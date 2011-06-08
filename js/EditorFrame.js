/**
 * @class XrEditor.EditorFrame
 * @extends Ext.panel.TabPanel
 *
 * define EditorFrame class
 *
 * @EditorFrame
 * 
 * @param {Object} config The config object
 * @author ouzhiwei@gmail.com (Jlake Ou)
 */
Ext.define('XrEditor.EditorFrame', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.xrEditorFrame',
	
	title: 'Editor Frame Panel',
	//cls: 'editor',
	autoScroll: true,
	border: false,

	htmlEditor: null,
	
	initComponent: function(){
		this.htmlEditor = new XrEditor.HtmlEditor;
		Ext.apply(this, {
			dockedItems: [this.createToolbar()],
			height: '100%',
			items: [this.htmlEditor]
		});
		this.callParent(arguments);
	},

	/**
	 * Create the top toolbar
	 * @private
	 * @return {Ext.toolbar.Toolbar} toolbar
	 */
	createToolbar: function(){
		var config = {
			items: [{
				//scope: this,
				handler: this.saveOne,
				text: 'save',
				iconCls: 'icon-save'
			}, {
				//scope: this,
				handler: this.saveAll,
				text: 'save all',
				iconCls: 'icon-saveall'
			}, '->', {
				//scope: this,
				handler: this.showHelp,
				text: 'Help',
				iconCls: 'icon-help'
			}]
		};
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
	saveOne: function() {
		XrEditor.Util.slideMsg('save one', 'Editor');
	},
	/**
	 * Open the post in a new tab
	 * @private
	 */
	saveAll: function() {
		XrEditor.Util.slideMsg('save all', 'Editor');
	},
	/**
	 * Open the post in a new tab
	 * @private
	 */
	showHelp: function() {
		XrEditor.Util.popupMsg('show Help', 'INFO', 'メッセージ');
	}
});
