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
	/*
	requires: [
		'Ext.panel.Panel',
		'Ext.button.Button'
	],*/
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
	initComponent: function(){
		Ext.apply(this, {
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
		XrEditor.Util.showMsg('itemId: ' + btn.itemId);
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
				//+ '<link rel="stylesheet" type="text/css" href="' + this.cssPath + '/reset.css"/>'
				+ '<link rel="stylesheet" type="text/css" href="' + this.cssPath + '/editor.css"/>'
				+ '</header><body>'
				+ '<div>div tag test</div>'
				+ '<form>form tag test</form>'
				+ '<table><tr><td>r1 c1</td><td>r1 c2</td></tr><tr><td>r2 c1</td><td>r2 c2</td></tr></table>'
				+ '</body>';
		this.doc.write(sHtml);
		this.doc.close();

		return this.callParent(arguments);
	}
});
