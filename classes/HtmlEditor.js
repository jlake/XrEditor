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

	initComponent: function(){
		Ext.apply(this, {
			autoScroll: false,
			dockedItems: [this.createToolbar()]
		});
		this.callParent(arguments);
	},

	createToolbar: function(){
		var me = this;
		var config = {
			items: [{
				itemId: 'bold',
				editor: me,
				handler: this.clickButton,
				text: 'B',
				//iconCls: 'icon-bold'
			}, {
				itemId: 'italic',
				editor: me,
				handler: this.clickButton,
				text: 'I',
				//iconCls: 'icon-italic'
			}, {
				itemId: 'underline',
				editor: me,
				handler: this.clickButton,
				text: 'U',
				//iconCls: 'icon-underline'
			}, {
				itemId: 'hr',
				editor: me,
				handler: this.clickButton,
				text: 'HR',
				//iconCls: 'icon-hr'
			}]
		};
		return Ext.create('widget.toolbar', config);
	},

	clickButton: function(btn, e) {
		//console.log(btn.initialConfig);
		if(btn.initialConfig.editor) {
			btn.initialConfig.editor.selection.execCommand(btn.itemId);
		}
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

		var sHtml = '<div>div tag test</div>'
			+ '<p>p tag test</p>'
			+ '<form>form tag test</form>'
			+ '<table width="100%"><tr><td>r1 c1</td><td>r1 c2</td></tr><tr><td>r2 c1</td><td>r2 c2</td></tr></table>'
			+ '<ol><li>item 1</li><li>item 2</li><li>item 3</li></ol>'
			+ '<ul><li>item 1</li><li>item 2</li><li>item 3</li></ul>'
			+ '<dl><dt>title 1</dt><dd>datail 1</dd><dt>title 2</dt><dd>datail 2</dd></dl>'
			;
		this.setHtml(sHtml);


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
			me.selection.saveSelection();
		});
		docEl.addListener('focus', function(e, el, o) {
			me.hideContextMenu();
			me.selection.saveSelection();
		});
		docEl.addListener('keyup', function(e, el, o) {
			me.selection.saveSelection();
		});
		docEl.addListener('mouseup', function(e, el, o) {
			me.selection.saveSelection();
		});
	},

	setCssMode: function(bFlag) {
		if(!this.doc) return;
		try {
			this.doc.execCommand('styleWithCSS', 0, bFlag);
		} catch(ex1) {
			try {
				this.doc.execCommand('useCSS', 0, bFlag);
			} catch(ex2) {
				try {
					this.doc.execCommand('styleWithCSS', false, bFlag);
				} catch(ex3) {
				}
			}
		}
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

		var otherhead = this.doc.getElementsByTagName('head')[0];
		var link = this.doc.createElement('link');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('type', 'text/css');
		link.setAttribute('href', this.cssPath + '/editor.css');
		otherhead.appendChild(link);

		this.doc.close();
	}
});
