/**
 * @class XrEditor.FramePanel
 * @extends Ext.panel.TabPanel
 *
 * define FramePanel class
 *
 * @FramePanel
 * 
 * @param {Object} config The config object
 * @author ouzhiwei@gmail.com (Jlake Ou)
 */
Ext.define('XrEditor.FramePanel', {
	/*
	requires: [
		'Ext.panel.Panel',
		'Ext.button.Button'
	],*/
	extend: 'Ext.panel.TabPanel',
	alias: 'widget.xrframepanel',
	//cls: 'editor',
	autoScroll: true,
	border: true,

	initComponent: function(){
		Ext.apply(this, {
			dockedItems: [this.createToolbar()]
		});
		this.callParent(arguments);
	},

	/**
	 * Create the top toolbar
	 * @private
	 * @return {Ext.toolbar.Toolbar} toolbar
	 */
	createToolbar: function(){
		var items = [],
			config = {};
		if (!this.inTab) {
			items.push({
				scope: this,
				handler: this.saveOne,
				text: 'save',
				iconCls: 'editor-save'
			}, '-');
		}
		else {
			config.cls = 'x-docked-noborder-top';
		}
		items.push({
			scope: this,
			handler: this.saveAll,
			text: 'save all',
			iconCls: 'editor-saveall'
		});
		config.items = items;
		return Ext.create('widget.toolbar', config);
	},

	/**
	 * Set the active editor
	 * @param {Ext.data.Model} rec The record
	 */
	setActive: function(editorId) {
		this.active = editorId;
		//this.setActiveEditor(editorId);
	},

	/**
	 * Navigate to the active post in a new window
	 * @private
	 */
	saveOne: function(){
	},

	/**
	 * Open the post in a new tab
	 * @private
	 */
	saveAll: function(){
	}
});
