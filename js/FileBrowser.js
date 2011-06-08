/**
 * @class XrEditor.FileBrowser
 * @extends Ext.tree.TabPanel
 *
 * define FileBrowser class
 *
 * @FileBrowser
 * 
 * @param {Object} config The config object
 * @author ouzhiwei@gmail.com (Jlake Ou)
 */
Ext.define('XrEditor.FileBrowser', {
	extend: 'Ext.tree.Panel',
	alias: 'widget.xrfilebrowser',
	autoScroll: true,
	border: true,
	//title: 'Fire Browser',
	nodeUrl: 'backend/file/nodes.json',
	initComponent: function() {
		var store = Ext.create('Ext.data.TreeStore', {
			proxy: {
				type: 'ajax',
				url: this.nodeUrl
			},
			root: {
				text: 'Root',
				id: '.',
				expanded: true
			},
			folderSort: true,
			sorters: [{
				property: 'text',
				direction: 'ASC'
			}]
		});
		Ext.apply(this, {
			dockedItems: [this.createToolbar()],
			height: '100%',
			store: store,
			rootVisible: false,
			viewConfig: {
				plugins: {
					ptype: 'treeviewdragdrop',
					appendOnly: true
				}
			}
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
			items: ['->', {
				//scope: this,
				handler: this.showHelp,
				text: 'Help',
				iconCls: 'icon-help'
			}]
		};
		return Ext.create('widget.toolbar', config);
	},
	showHelp: function() {
		//XrEditor.Util.popupMsg('show Help', 'INFO', 'メッセージ');
		XrEditor.Util.showLoadingMask('Loading', this.body, 'BIG');
		setTimeout(function() {
			XrEditor.Util.hideLoadingMask();
		}, 1000);
	}
});
