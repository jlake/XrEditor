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
	alias: 'widget.xreditorframe',
	
	title: 'Editor Frame Panel',
	autoScroll: true,
	border: false,

	initComponent: function(){
		var editor = new XrEditor.Editor({
			node: '',
			code: 'Hello World!',
			fileType: 'html'
		});
		Ext.apply(this, {
			dockedItems: [this._createToolbar()],
			height: '100%',
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
		XrEditor.Util.popupMsg('XrEditor', 'メッセージ');
	}
});
