// Copyright 2009 Jlake Ou. All Rights Reserved.

/**
 * @fileoverview Tab Editor based on ExtJS and jQuery
 * dependencies:
 *   ExtJS 3.x
 *   jQuery (ver > 1.2.6)
 * @author ouzhiwei@gmail.com (Jlake Ou)
 */

var TabEditor = (function() {
	// golbal config (default)
	var _config = {
		iconPath: '../icons/',
		cssPath: '../css/',
		codemirrorPath: '../codemirror/',
		beautifyCode: true
	};

	// activated editor (which be focused)
	var _htmlEditor;

	/**
	 * html utilities
	 * @type {object}
	 */
	var _htmlUtil = {
		//*******************************************************
		// HTML 特殊文字変換
		//*******************************************************
		encodeHtml: function(sHtml){
			return (sHtml + '').replace(/&(?!amp;|lt;|gt;|quot;)/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/\"/g, '&quot;');
		},
		//*******************************************************
		// 色文字列 "rgb(d, d, d)" を "#hhhhhh" 形式に変換
		//*******************************************************
		toHex: function(nDec) {
			if(!nDec) return '00';
			nDec = parseInt(nDec);
			if (nDec == 0 || isNaN(nDec)) return '00';
			nDec = Math.max(0, nDec);
			nDec = Math.min(nDec, 255);
			nDec = Math.round(nDec);
			var sHex = '0123456789ABCDEF';
			return sHex.charAt((nDec - nDec % 16)/16) + sHex.charAt(nDec % 16);
		},
		replaceRgb: function(sHtml) {
			return sHtml.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/ig, function($0, r, g, b) {
				return '#' + _htmlUtil.toHex(r) + _htmlUtil.toHex(g) + _htmlUtil.toHex(b);
			});
		},
		//*******************************************************
		// HTML→XHTML変換
		//*******************************************************
		formatHtml: function(sHtml, rnFlg) {
			//属性の文字列変換
			function formatAttr(name, value){
				name = name.trim().toLowerCase();
				value = value.trim();
				if(value == '' && name != 'value') return '';
				switch(name){
					case 'style':
						value = value.replace(/([^:]+?)\s*:\s*([^;\b$]+)(?=;|\b|$)/g, function($0, p, v){
							return p.toLowerCase() + ':' + v.trim();
						});
						break;
					case 'href':
						value = value.replace(/\%0A/ig, '');
						value = Ext.util.Format.htmlDecode(value);
						break;
					default:
						value = _htmlUtil.formatEntities(value);
						break;
				}
				return ' ' + name + '="' + value + '"';
			}

			sHtml = sHtml.replace(/<[^<>]+>/gm, function(html){
				if(html.match(/^<!--/)) {
					//コメント
					return html;
				}
				//a="b" 属性の変換
				html = html.replace(/\s+([\w:-]+)=([\"])([^\2]*?)\2/gi, function($0, name, quote, value){
					return formatAttr(name, value);
				});
				//a=b 属性の変換
				html = html.replace(/\s+([\w:-]+)=([^\"\s<>]+)/gi, function($0, name, value){
					return formatAttr(name, value);
				});
				//タグ名の置換
				html = html.replace(/(<\/?)([a-z][\d\w:]*)/gi, function($0, prefix, name){
					name = name.toLowerCase();
					switch(name){
						case 'strong' : name = 'b'; break;
						case 'em' : name = 'i'; break;
						default : break;
					}
					return prefix + name;
				});
				//<tag...>を<tag... />に変換
				html = html.replace(/<(br|hr|img|input)\s*([^>]*?)(\/?)>/gi, function($0, name, value){
					return '<' + name.toLowerCase() + (value ? ' ' : '') + $.trim(value) + ' />';
				});
				return html;
			});
			// Firefox のため追加した <br> タグを削除
			sHtml = sHtml.replace('<br class="blank" />', '\n');
			//中身が空のタッグを削除
			//sHtml = sHtml.replace(/<(div|span|font|p)[^>]*>[\s\n]*<\/\1>/gmi, '').replace(/<(span|font)\s*>(.*?)<\/\1>/gmi, '$2');
			//IE対応
			sHtml = sHtml.replace(new RegExp(location.href, 'g'), '');
			//Firefox対応
			sHtml = _htmlUtil.replaceRgb(sHtml);
			//改行追加
			sHtml = sHtml.replace(/></g, '>\n<');
			return sHtml;
		},
		//*******************************************************
		// タグ名指定で親ノード検索
		//*******************************************************
		findParentNode: function(tagName, node) {
			while (node.tagName != "HTML") {
				if (node.tagName == tagName){
					return node;
				}
				node = node.parentNode;
			}
			return null;
		}
	}

	/**
	 * Class for html editor
	 * @param {object} doc document in iframe.
	 */
	var _HtmlEditor = function(doc, panel) {
		this.doc = doc;
		this.win = doc.defaultView || doc.parentWindow;
		this.sel = null;
		this.panel = panel;

		var _editor = this;
		//*******************************************************
		// focus on editor
		//*******************************************************
		this.focus = function() {
			this.win.focus();
		}
		//*******************************************************
		// CSSモード設定
		//*******************************************************
		this.setCssMode = function(bFlag) {
			try {
				document.execCommand('styleWithCSS', 0, bFlag);
			} catch(ex) {
				try {
					document.execCommand('useCSS', 0, bFlag);
				} catch(ex) {
					try {
						document.execCommand('styleWithCSS', false, bFlag);
					} catch(ex) {
					}
				}
			}
		}
		//*******************************************************
		// エディターのコマンドを実行
		//*******************************************************
		this.execCommand = function(sCmd, vValue) {
			if(!this.sel) return;
			if(Ext.isIE) {
				try {
					var range = this.sel.range;
					range.select();
					range.execCommand(sCmd, false, vValue);
				} catch(ex) {
				}
			} else {
				this.doc.execCommand(sCmd, false, vValue);
			}
		}
		//*******************************************************
		// update editor's selection
		//*******************************************************
		this.saveSelection = function() {
			if(Ext.isIE) {
				try {
					var range = this.doc.selection.createRange();
					this.sel = {
						type: this.doc.selection.type.toLowerCase(),
						range: range,
						text: range.text
					};
				} catch(ex) {
					this.sel = null;
				};
			} else {
				var selection = this.win.getSelection();
				if (selection && selection.rangeCount > 0) {
					var range = selection.getRangeAt(0);
					this.sel = {
						type: 'object',
						//range: range,
						range: range.cloneRange(),
						text: range.toString()
					};
				} else {
					this.sel = null;
				}
			}
			return this.sel;
		}
		//*******************************************************
		// restore editor's selection
		//*******************************************************
		this.restoreSelection = function() {
			if(!this.sel) return;
			if (range = this.sel.range) {
				if(Ext.isIE) {
					range.select();
				} else {
					if(selection = this.win.getSelection()) {
						selection.removeAllRanges();
						selection.addRange(range);
					}
				}
			}
		}
		//*******************************************************
		// get selection's parent node
		//*******************************************************
		this.getSelectionParent = function() {
			if(!this.sel) return;
			var range = this.sel.range;
			var parent = null;
			if(Ext.isIE) {
				if(range.type == "Control") {
					parent = range(0);
				} else { // text node
					parent = range.parentElement();
				}
			} else {
				var container = range.commonAncestorContainer;
				parent = container;
    
				if (container.nodeType == 3) { // text node
					parent = container.parentNode;
				} else if (range.startContainer.nodeType == 1 && range.startContainer == range.endContainer && (range.endOffset-range.startOffset)<=1) {
					// single object selected
					parent = range.startContainer.childNodes[range.startOffset];
				}
			}
			return parent;
		}
		//*******************************************************
		// update toolbar status by selection change
		//*******************************************************
		this.updateToolbarStatus = function(targetNode) {
			targetNode = targetNode || this.getSelectionParent();
			var ctPanel = this.panel.ownerCt.ownerCt;
			var oCmdStyle = {
				Bold: ['font-weight', 'bold'],
				Italic: ['font-style', 'italic'],
				UnderLine: ['text-decoration', 'underline'],
				StrikeThrough: ['text-decoration', 'line-through'],
				JustifyLeft: ['text-align', 'left'],
				JustifyCenter: ['text-align', 'center'],
				JustifyRight: ['text-align', 'right']
			};
			for(var cmd in oCmdStyle) {
				$target = $(targetNode);
				if(oButton = Ext.getCmp(ctPanel.id + '_' + cmd)){
					var aStyle = $target.css(oCmdStyle[cmd][0]).toLowerCase().split(' ');
					oButton.toggle(aStyle.indexOf(oCmdStyle[cmd][1]) != -1);
				}
			}
		}

		//*******************************************************
		// event process
		//*******************************************************
		$(this.doc).click(function(e) {
			_editor.updateToolbarStatus(e.target);
		});
	}

	/**
	 * Function for process editor's command
	 * @param {string} sCmd editor's command.
	 * @param {object} e event.
	 */
	function _processCmd(sCmd, e) {
		if(!_htmlEditor) return;
		_htmlEditor.saveSelection();
		switch(sCmd) {
			case 'Bold':
			case 'Italic':
			case 'UnderLine':
			case 'StrikeThrough':
			case 'JustifyLeft':
			case 'JustifyCenter':
			case 'JustifyRight':
				_htmlEditor.execCommand(sCmd);
				break;
			default:
				alert('Unknown Command: ' + sCmd)
				break;
		}
	}

	/**
	 * Function for get editor's toolbar
	 */
	function _createHtmlToolbar(containerId) {
		// toolbar button configs
		var aBtnConfigs = [
			{type: 'button', cmd: 'Bold', title: '太字', icon: 'edit-bold.png', toggle: true},
			{type: 'button', cmd: 'Italic', title: '斜体', icon: 'edit-italic.png', toggle: true},
			{type: 'button', cmd: 'UnderLine', title: '下線', icon: 'edit-underline.png', toggle: true},
			{type: 'button', cmd: 'StrikeThrough', title: '取り消し線', icon: 'edit-strike.png', toggle: true},
			{type: 'menu', cmd: '_fontSize', title: 'フォントサイズ', icon: 'edit.png', items:[
				{cmd: 'H1', title: 'H1', icon: 'edit-heading.png'},
				{cmd: 'H2', title: 'H2', icon: 'edit-heading.png'},
				{cmd: 'H3', title: 'H3', icon: 'edit-heading.png'},
				{cmd: 'H4', title: 'H4', icon: 'edit-heading.png'},
				{cmd: 'H5', title: 'H5', icon: 'edit-heading.png'},
				{cmd: 'H6', title: 'H6', icon: 'edit-heading.png'},
				{cmd: 'H7', title: 'H7', icon: 'edit-heading.png'}
			]},
			{type: '-'},
			{type: 'button', cmd: 'JustifyLeft', title: '左揃え', icon: 'edit-alignment.png', toggle: true},
			{type: 'button', cmd: 'JustifyCenter', title: '中央揃え', icon: 'edit-alignment-center.png', toggle: true},
			{type: 'button', cmd: 'JustifyRight', title: '右揃え', icon: 'edit-alignment-right.png', toggle: true},
			{type: '--'},
			{type: 'button', cmd: 'CreateLink', title: 'リンク作成', icon: 'link.png'},
			{type: 'button', cmd: 'UnLink', title: 'リンク解除', icon: 'link_break.png'},
			{type: '-'},
			{type: 'button', cmd: 'InsertImage', title: '画像挿入', icon: 'picture.png'},
			{type: '->'},
			{type: 'button', cmd: 'Help', title: 'ヘルプ', icon: 'question.png'}
		];
		var aTbConfigs = [];
		var oTbLine = {
			xtype: 'toolbar',
			items: []
		};
		for(var i = 0; i < aBtnConfigs.length; i++) {
			var oBtn = aBtnConfigs[i];
			switch(oBtn.type) {
				case '--':
					// new line
					if(oTbLine.items.length > 0) {
						aTbConfigs.push(oTbLine)
						oTbLine = {
							xtype: 'toolbar',
							items: []
						};
					}
					break;
				case '-':
				case '->':
				case '<-':
					// separator
					oTbLine.items.push(oBtn.type);
					break;
				case 'menu':
					// button with menu
					var menuItems = [];
					for(var j=0; j<oBtn.items.length; j++) {
						menuItems.push({
							id: containerId + '_' + oBtn.items[j].cmd,
							cmd: oBtn.items[j].cmd,
							icon: _config.iconPath + oBtn.items[j].icon,
							text: oBtn.items[j].title,
							handler: function(item, e) {
								_processCmd(this.initialConfig.cmd, e);
							}
						});
					}
					oTbLine.items.push({
						//id: containerId + '_' + oBtn.cmd,
						tooltip: oBtn.title,
						icon: _config.iconPath + oBtn.icon,
						cls: 'x-btn-icon',
						menu: new Ext.menu.Menu({
							items: menuItems
						})
					});
					break;
				case 'combo':
					// combo box
					oTbLine.items.push({
						//id: containerId + '_' + oBtn.cmd,
						xtype: 'combo',
						store: new Ext.data.SimpleStore({
							fields: ['cmd', 'title'],
							data : oBtn.storeData
						}),
						valueField: 'value',
						displayField: 'text',
						typeAhead: true,
						mode: 'local',
						triggerAction: 'all',
						emptyText: oBtn.emptyText || '',
						editable: false,
						width: oBtn.size || 70,
						listeners: {
							select: function(combo, record, index) {
								_processCmd(record.data.value);
							}
						}
					});
					break;
				default:
					// button
					oTbLine.items.push({
						id: containerId + '_' + oBtn.cmd,
						cmd: oBtn.cmd,
						tooltip: oBtn.title,
						icon: _config.iconPath + oBtn.icon,
						cls: 'x-btn-icon',
						enableToggle: oBtn.toggle ? true : false,
						listeners: {
							click: function(btn, e) {
								_processCmd(this.initialConfig.cmd, e);
							}
						}
					});
					break;
			}
		}
		if(oTbLine.items.length > 0) {
			aTbConfigs.push(oTbLine)
		}
		return new Ext.Panel({
			border: false,
			items: aTbConfigs
		});
	}

	/**
	 * Create editor tab panel
	 * @param {object} oParam parameter.
	 */
	function _createEditorTab(oParam) {
		oParam = oParam || {};
		var designTab = new Ext.Panel({
			title: 'design',
			layout:'fit',
			listeners: {
				render: function(panel) {
					var iframe = Ext.DomHelper.append(panel.body, {
						tag: 'iframe',
						id: 'iframe-'+panel.id,
						frameBorder: 0,
						fitToFrame: true,
						scrolling: 'auto',
						style: 'border:none; width:100%; height:100%;',
						src: ''
					});
					var doc = iframe.contentDocument || iframe.contentWindow.document;
					doc.contentEditable = true;
					doc.designMode = 'on';
					doc.open();
					var sHtml = '<html></header>'
							//+ '<link rel="stylesheet" type="text/css" href="' + _config.cssPath + 'reset.css"/>'
							+ '<link rel="stylesheet" type="text/css" href="' + _config.cssPath + 'editor.css"/>'
							+ '</header><body>'
							+ '<div>div tag test</div>'
							+ '<form>form tag test</form>'
							+ '<table><tr><td>r1 c1</td><td>r1 c2</td></tr><tr><td>r2 c1</td><td>r2 c2</td></tr></table>'
							+ '</body>';
					doc.write(sHtml);
					doc.close();
					// attach
					panel.htmlEditor = new _HtmlEditor(doc, panel);
				},
				activate: function(panel) {
					_htmlEditor = panel.htmlEditor;
					_htmlEditor.focus();
					_htmlEditor.restoreSelection();
				}
			}
		});
		var sourceTab = new Ext.Panel({
			title: 'source',
			layout:'fit',
			//autoScroll: true,
			listeners: {
				render: function(panel) {
					var codeEditor = new CodeMirror(panel.body, {
						path: _config.codemirrorPath + 'js/',
						parserfile: 'parsexml.js',
						width: '100%',
						height: '100%',
						stylesheet: _config.codemirrorPath + 'css/xmlcolors.css'
					});
					// attach
					panel.codeEditor = codeEditor;
				},
				activate: function(panel) {
					var sHtml = designTab.htmlEditor.doc.body.innerHTML;
					if(_config.beautifyCode) {
						sHtml = _htmlUtil.formatHtml(sHtml);
						sHtml = $.indent(sHtml, {tab: '  '});
					}
					panel.codeEditor.setCode(sHtml);

				}
			}
		});

		return new Ext.TabPanel({
			title: oParam.title || 'Untitled',
			deferredRender:false,
			width: '100%',
			height: '100%',
			tabPosition: 'bottom',
			activeTab: 0,
			items: [designTab, sourceTab]
		});
	}

	// 自作コンポーネント
	var _TabEditor = Ext.extend(Ext.TabPanel, {
		initComponent: function(){
			for(var k in _config) {
				_config[k] = this[k] || _config[k];
			}
			var config = {
				_name: 'TabEditor',
				tbar: _createHtmlToolbar(this.id)
			}
			Ext.apply(this.initialConfig, config);
			Ext.apply(this, config);
			_TabEditor.superclass.initComponent.call(this, arguments);
		},
		onRender: function(){
			_TabEditor.superclass.onRender.apply(this, arguments);
			var oDefaultTab = _createEditorTab();
			this.add(oDefaultTab);
			this.setActiveTab(0);

		},
		appendTab: function(oParam) {
			var tab = _createEditorTab(oParam);
			this.add(tab);
			this.doLayout();
		},
		getCurrentHtmlEditor: function() {
			return _htmlEditor;
		},
		htmlUtil: _htmlUtil
	});
	// xtype の登録
	Ext.reg('tabeditor', _TabEditor);

	return _TabEditor;
})();
