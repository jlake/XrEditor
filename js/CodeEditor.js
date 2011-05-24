/**
 * @class XrEditor.CodeEditor
 * @extends Ext.panel.TabPanel
 *
 * define CodeEditor class
 *
 * @constructor
 * 
 * @param {Object} config The config object
 * @author ouzhiwei@gmail.com (Jlake Ou)
 */
Ext.define('XrEditor.CodeEditor', {
	/*
	requires: [
		'Ext.panel.Panel',
		'Ext.button.Button'
	],*/
	extend: 'Ext.panel.Panel',
	alias: 'widget.xrcodeeditor',
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
