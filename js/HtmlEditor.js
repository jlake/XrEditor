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
	//cls: 'editor',
	autoScroll: true,
	border: true,

	title: 'Html Editor',

	iframe: null,
	doc: null,
	win: null,
	cssPath : '/xreditor/css',

	contextMenu: null,

	initComponent: function(){
		Ext.apply(this, {
			autoScroll: false,
			dockedItems: [this.createToolbar()]
		});
		this.callParent(arguments);
	},

	createToolbar: function(editor){
		var config = {
			items: [{
				itemId: 'Bold',
				handler: this.clickButton,
				text: 'B',
				//iconCls: 'icon-save'
			}, {
				itemId: 'Italic',
				handler: this.clickButton,
				text: 'I',
				//iconCls: 'icon-save'
			}, {
				itemId: 'UnderLine',
				handler: this.clickButton,
				text: 'U',
				//iconCls: 'icon-save'
			}]
		};
		return Ext.create('widget.toolbar', config);
	},

	clickButton: function(btn, e) {
		XrEditor.Util.popupMsg('itemId: ' + btn.itemId);
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
		this.doc.open();
		var sHtml = '<html></header>'
				+ '<link rel="stylesheet" type="text/css" href="' + this.cssPath + '/editor.css" />'
				+ '</header><body>'
				+ '<div>div tag test</div>'
				+ '<p>p tag test</p>'
				+ '<form>form tag test</form>'
				+ '<table width="100%"><tr><td>r1 c1</td><td>r1 c2</td></tr><tr><td>r2 c1</td><td>r2 c2</td></tr></table>'
				+ '<ol><li>item 1</li><li>item 2</li><li>item 3</li></ol>'
				+ '<ul><li>item 1</li><li>item 2</li><li>item 3</li></ul>'
				+ '<dl><dt>title 1</dt><dd>datail 1</dd><dt>title 2</dt><dd>datail 2</dd></dl>'
				+ '</body>';
		this.doc.write(sHtml);
		this.doc.close();
		this.bindContextMenu();
		return this.callParent(arguments);
	},

	 getMousePosition: function(e) {
		var x = 0, y = 0;
		var e = e || window.event;
		if (e.clientX || e.clientY) {
			//console.log(2);
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
		} else if (e.pageX || e.pageY) {
			//console.log(1);
			x = e.pageX;
			y = e.pageY;
		}
		return [x, y];
	},

	showContextMenu: function(pos) {
		if(!this.contextMenu) this.contextMenu = Ext.create('Ext.menu.Menu', {
			id: 'editor_contextmenu',
			items: [{
				text: 'Insert',
				handler: function() {
					XrEditor.Util.slideMsg('insert', 'Editor');
				}
			}, '-', {
				text: 'Delete',
				handler: function() {
					XrEditor.Util.slideMsg('delete', 'Editor');
				}
			}]
		});
		this.contextMenu.show(pos);
	},

	hideContextMenu: function() {
		if(this.contextMenu) this.contextMenu.hide();
	},

	bindContextMenu: function() {
		var me = this;
		$(this.iframe).contents().find('body > *').bind('contextmenu', function(e){
			//console.log('contextmenu', e.target);
			$(e.target).addClass('hilight');
			var pos = me.getMousePosition(e);
			me.showContextMenu(pos);
		})
		$(this.iframe).contents().find('body').bind('click', function(e){
			$(e.target).find('.hilight').removeClass('hilight');
			me.hideContextMenu();
		});
	}
});
