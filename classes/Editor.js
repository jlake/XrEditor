/**
 * @class XrEditor.Editor
 * @extends Ext.panel.TabPanel
 *
 * define Editor class
 *
 * @Editor
 * 
 * @param {Object} config The config object
 * @author ouzhiwei@gmail.com (Jlake Ou)
 */
Ext.define('XrEditor.Editor', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.xreditor',

	autoScroll: true,
	border: false,
	tabPosition: 'bottom',

	htmlEditor: null,
	codeEditor: null,

	title: 'Untiltled',
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
		var aItems = [];
		if(this.config.fileType == 'html') {
			this.htmlEditor = new XrEditor.HtmlEditor(this.config);
			aItems.push(this.htmlEditor);
		}
		this.codeEditor = new XrEditor.CodeEditor(this.config);
		aItems.push(this.codeEditor);
		
		Ext.apply(this, {
			height: '100%',
			iconCls: 'icon-doc-' + this.config.fileType,
			closable: true,
			items: aItems,
			listeners: {
				tabchange: function(panel, newCard, oldCard, opts) {
					if(newCard.itemId == 'code') {
						if(this.htmlEditor) this.codeEditor.setCode(this.htmlEditor.getHtml());
					} else {
						this.htmlEditor.setHtml(this.codeEditor.getCode());
						this.htmlEditor.initListeners();
					}
				}
			}
		});
		this.callParent(arguments);
	},
	afterrender: function() {
		editorFrame.doLayout();
	}
});
