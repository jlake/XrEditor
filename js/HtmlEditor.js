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
	
	initComponent: function(){
		this.iframe = this.createIframe();
		Ext.apply(this, {
			dockedItems: [this.createToolbar()]
		});
		this.callParent(arguments);
	},

	createToolbar: function(editor){
		var config = {
			items: [{
				handler: this.clickButton,
				text: 'B',
				//iconCls: 'icon-save'
			}, {
				handler: this.clickButton,
				text: 'I',
				//iconCls: 'icon-save'
			}, {
				handler: this.clickButton,
				text: 'U',
				//iconCls: 'icon-save'
			}]
		};
		return Ext.create('widget.toolbar', config);
	},
	
	clickButton: function(btn, e) {
		XrEditor.Util.showMsg('button clicked');
	},
	
	createIframe: function() {
		var obj = document.createElement('iframe');
		obj.setAttribute('id', 'iframe-' + this.id);
		obj.setAttribute('frameBorder', '0');
		obj.setAttribute('scrolling', 'auto');

		obj.style.position = 'relative';
		obj.style.width = '100%';
		obj.style.height = '100%';

		console.log(obj);
		this.win = obj.contentWindow;
		//this.doc = obj.contentDocument || obj.contentWindow.document;
		// this.doc.contentEditable = true;
		// this.doc.designMode = 'on';
		// this.doc.open();
		// var sHtml = '<html></header>'
		// 		//+ '<link rel="stylesheet" type="text/css" href="' + _config.cssPath + 'reset.css"/>'
		// 		+ '<link rel="stylesheet" type="text/css" href="' + _config.cssPath + 'editor.css"/>'
		// 		+ '</header><body>'
		// 		+ '<div>div tag test</div>'
		// 		+ '<form>form tag test</form>'
		// 		+ '<table><tr><td>r1 c1</td><td>r1 c2</td></tr><tr><td>r2 c1</td><td>r2 c2</td></tr></table>'
		// 		+ '</body>';
		// this.doc.write(sHtml);
		// this.doc.close();
		
		return obj;
	},
	
	afterRender: function() {
		this.body.appendChild(this.iframe);
		return this.callParent(arguments);
	}
});
