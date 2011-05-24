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

	initComponent: function(){
		Ext.apply(this, {
			dockedItems: [this.createToolbar()]
		});
		this.callParent(arguments);
	},

	createToolbar : function(editor){
	}
});
