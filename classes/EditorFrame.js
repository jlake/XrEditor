/**
 * @class XrEditor.EditorFrame
 * @extends Ext.panel.TabPanel
 *
 * Copyright(c) 2011 Jlake Ou (ouzhiwei@gmail.com)
 */
Ext.define('XrEditor.EditorFrame', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.xreditorframe',
	
	title: 'Editor Frame Panel',

	initComponent: function() {
		var editor = new XrEditor.Editor({
			nodeId: '_blank',
			code: '<h1>Hello World!</h1>',
			fileType: 'html'
		});
		Ext.apply(this, {
			dockedItems: [this._createToolbar()],
			height: '100%',
			border: true,
			items: [editor]
		});
		this.callParent(arguments);
	},
	/**
	 * Create the top toolbar
	 */
	_createToolbar: function() {
		var config = {
			items: [{
				handler: this.saveOne,
				text: 'save',
				iconCls: 'icon-save'
			}, {
				handler: this.saveAll,
				text: 'save all',
				iconCls: 'icon-saveall'
			}, '->', {
				handler: this.showHelp,
				text: 'Help',
				iconCls: 'icon-help'
			}]
		};
		return Ext.create('widget.toolbar', config);
	},

	/**
	 * save current document
	 */
	saveOne: function() {
		XrEditor.Util.slideMsg('save one', 'Editor');
	},
	/**
	 * save all documents
	 */
	saveAll: function() {
		XrEditor.Util.slideMsg('save all', 'Editor');
	},
	/**
	 * show help message
	 */
	showHelp: function() {
		XrEditor.Util.popupMsg('XrEditor ' + XrEditor.Global.version, 'メッセージ');
	}
});
