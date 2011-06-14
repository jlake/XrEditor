/**
 * @class XrEditor.HtmlEditor
 * @extends Ext.panel.TabPanel
 *
 * define HtmlEditor class
 *
 * @constructor
 * 
 * @param {Object} config The config object
 * @author ouzhiwei@gmail.com (Jlake Ou)
 */
Ext.define('XrEditor.HtmlEditor', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.xrhtmleditor',

	autoScroll: true,
	border: true,

	itemId: 'html',
	title: 'Design',
	iconCls: 'icon-design',

	iframe: null,
	doc: null,
	win: null,
	cssPath: '/xreditor/css',

	contextMenu: null,
	selection: null,

	config: {
		node: '',
		code: '',
		fileType: ''
	},
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		return this;
	},

	initComponent: function(){
		Ext.apply(this, {
			autoScroll: false,
			dockedItems: [this._createToolbar()]
		});
		this.callParent(arguments);
	},

	/**
	 * create toolbar for html editor
	 */
	_createToolbar: function() {
		var me = this;
		// toolbar button configs
		var aBtnConfigs = [
			{type: 'button', cmd: 'bold', title: '太字', toggle: false},
			{type: 'button', cmd: 'italic', title: '斜体', toggle: false},
			{type: 'button', cmd: 'underline', title: '下線', toggle: false},
			{type: 'button', cmd: 'strikethrough', title: '取り消し線', toggle: false},
			{type: 'button', cmd: 'hr', title: '水平線', toggle: false},
			{type: '-'},
			{type: 'button', cmd: 'justifyleft', title: '左揃え', toggle: false},
			{type: 'button', cmd: 'justifycenter', title: '中央揃え', toggle: false},
			{type: 'button', cmd: 'justifyright', title: '右揃え', toggle: false},
			{type: '-'},
			{type: 'menu', cmd: 'heading', title: 'ヘッディング', items: [
				{cmd: 'H1', title: 'H1'},
				{cmd: 'H2', title: 'H2'},
				{cmd: 'H3', title: 'H3'},
				{cmd: 'H4', title: 'H4'},
				{cmd: 'H5', title: 'H5'},
				{cmd: 'H6', title: 'H6'},
				{cmd: 'H7', title: 'H7'}
			]},
			{type: 'combo', cmd: 'heading1', title: 'ヘッディング', items: [
				{cmd: 'H1', title: 'H1'},
				{cmd: 'H2', title: 'H2'},
				{cmd: 'H3', title: 'H3'},
				{cmd: 'H4', title: 'H4'},
				{cmd: 'H5', title: 'H5'},
				{cmd: 'H6', title: 'H6'},
				{cmd: 'H7', title: 'H7'}
			]},
			{type: '/'},
			{type: 'button', cmd: 'link', title: 'リンク作成'},
			{type: 'button', cmd: 'unlink', title: 'リンク解除'},
			{type: '-'},
			{type: 'button', cmd: 'insertimage', title: '画像挿入'}
		];
		var aTbConfigs = [];
		var oTbLine = {
			xtype: 'toolbar',
			border: false,
			items: []
		};
		for(var i = 0; i < aBtnConfigs.length; i++) {
			var oBtn = aBtnConfigs[i];
			switch(oBtn.type) {
				case '/':
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
					// button with pull down menu
					var menuItems = [];
					for(var j=0; j<oBtn.items.length; j++) {
						menuItems.push({
							itemId: oBtn.items[j].cmd,
							iconCls: 'icon-edit-' + oBtn.items[j].cmd,
							text: oBtn.items[j].title,
							handler: function(btn, e) {
								me.sendCommand(btn.itemId);
							}
						});
					}
					oTbLine.items.push({
						tooltip: oBtn.title,
						iconCls: 'icon-edit-' + oBtn.cmd,
						cls: 'x-btn-icon',
						menu: new Ext.menu.Menu({
							items: menuItems
						})
					});
					break;
				case 'combo':
					// combo box
					oTbLine.items.push({
						xtype: 'combo',
						store: Ext.create('Ext.data.Store', {
							fields: ['cmd', 'title'],
							data: oBtn.items
						}),
						valueField: 'cmd',
						displayField: 'title',
						mode: 'local',
						triggerAction: 'all',
						emptyText: oBtn.emptyText || '',
						editable: false,
						width: oBtn.size || 70,
						listeners: {
							select: function(field, value, opts) {
								me.sendCommand(value);
							}
						}
					});
					break;
				case 'button':
					// button
					oTbLine.items.push({
						itemId: oBtn.cmd,
						tooltip: oBtn.title,
						iconCls: 'icon-edit-' + oBtn.cmd,
						enableToggle: oBtn.toggle,
						handler: function(btn, e) {
							me.sendCommand(btn.itemId);
						}
					});
					break;
				default:
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
	},

	clickButton: function(btn, e) {
		//console.log(btn.initialConfig);
		if(btn.initialConfig.editor) {
			btn.initialConfig.editor.selection.execCommand(btn.itemId);
		}
	},

	sendCommand: function(sCmd, oArgs) {
		this.selection.saveSelection();
		this.selection.execCommand(sCmd, oArgs);
	},

	createIframe: function() {
		var iframe = document.createElement('iframe');
		iframe.setAttribute('id', 'iframe-' + this.id);
		iframe.setAttribute('frameBorder', '0');
		iframe.setAttribute('scrolling', 'auto');

		iframe.style.position = 'relative';
		iframe.style.width = '100%';
		iframe.style.height = '100%';
		return iframe;
	},

	afterRender: function() {
		this.iframe = this.createIframe();
		this.body.appendChild(this.iframe);

		//console.log(obj);
		this.win = this.iframe.contentWindow;
		this.doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
		this.doc.contentEditable = true;
		this.doc.designMode = 'on';

		this.setHtml(this.config.code);

		this.selection = new XrEditor.Selection({
			doc: this.doc,
			win: this.win
		});

		var me = this;
		this.contextMenu = Ext.create('Ext.menu.Menu', {
			id: 'editor_contextmenu',
			plain: true,
			//floating: true,
			items: [{
				text: 'Insert',
				iconCls: 'icon-plus',
				handler: function(widget, e) {
					XrEditor.Util.slideMsg('insert', 'Editor');
					me.hideContextMenu();
				}
			}, {
				text: 'Delete',
				iconCls: 'icon-minus',
				handler: function(widget, e) {
					XrEditor.Util.slideMsg('delete', 'Editor');
					me.hideContextMenu();
				}
			}]
		});
		this.initListeners();
		return this.callParent(arguments);
	},

	showContextMenu: function(pos) {
		if(this.contextMenu) this.contextMenu.showAt(pos);
	},

	hideContextMenu: function() {
		if(this.contextMenu && !this.contextMenu.hidden) this.contextMenu.hide();
	},

	getMousePosition: function(e) {
		var pos = e.getXY();
		var iframePos = Ext.get(this.iframe).getAnchorXY();
		pos[0] += iframePos[0];
		pos[1] += iframePos[1];
		return pos;
	},

	initListeners: function() {
		var docEl = Ext.get(this.doc.body)
		if(!docEl) return;
		var me = this;
		docEl.addListener('contextmenu', function(e, el, o) {
			//console.log('contextmenu');
			//Ext.get(el).addCls('redbox');
			Ext.get(el).highlight();
			e.stopEvent();
			var pos = me.getMousePosition(e);
			me.showContextMenu(pos);
			return false;
		});
		docEl.addListener('click', function(e, el, o) {
			me.hideContextMenu();
		});
		docEl.addListener('focus', function(e, el, o) {
			//me.hideContextMenu();
		});
	},

	setCssMode: function(bFlag) {
		if(!this.doc) return;
		try {
			this.doc.execCommand('styleWithCSS', 0, bFlag);
		} catch(e1) {
			try {
				this.doc.execCommand('useCSS', 0, bFlag);
			} catch(e2) {
				try {
					this.doc.execCommand('styleWithCSS', false, bFlag);
				} catch(e3) {
				}
			}
		}
	},

	bindHelperCss: function() {
		var header = this.doc.getElementsByTagName('head')[0];
		var link = this.doc.createElement('link');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('type', 'text/css');
		link.setAttribute('href', this.cssPath + '/editor-helper.css');
		header.appendChild(link);
	},

	getHtml: function() {
		if(!this.doc) return '';
		return this.doc.body.innerHTML;
	},

	setHtml: function(sCode) {
		if(!this.doc) return;
		this.doc.open();
		var sHtml = XrEditor.Html.formatXhtml(sCode);

		this.doc.write(sHtml);
		this.bindHelperCss();

		this.doc.close();
	}
});
