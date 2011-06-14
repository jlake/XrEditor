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

	title: 'Untiltled',
	iconCls: 'icon-doc-html',

	htmlEditor: null,
	codeEditor: null,

	config: {
		code: ''
	},
	constructor: function(config) {
		this.initConfig(config);
		this.htmlEditor = new XrEditor.HtmlEditor(config);
		this.codeEditor = new XrEditor.CodeEditor(config);
		this.callParent(arguments);
		return this;
	},
	initComponent: function(){
		Ext.apply(this, {
			height: '100%',
			items: [this.htmlEditor, this.codeEditor],
			listeners: {
				tabchange: function(panel, newCard, oldCard, opts) {
					if(newCard.itemId == 'code') {
						this.codeEditor.setCode(this.htmlEditor.getHtml());
					} else {
						this.htmlEditor.setHtml(this.codeEditor.getCode());
						this.htmlEditor.initListeners();
					}
				}
			}
		});
		this.callParent(arguments);
	},
});
