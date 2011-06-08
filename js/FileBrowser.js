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
	selectedNode: null,
	contextMenu: null,
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
			},
			listeners: {
				selectionchange: function(view, selections, options) {
					console.log('selectionchange');
				},
				itemcontextmenu: function(view, record, item, index, e, options) {
					console.log('itemcontextmenu', item);
					//var pos = e.getXY();
					//var pos = Ext.get(item).getAnchorXY();
					//var pos = view.getPositionByEvent(e);
					//var pos = XrEditor.Util.getMousePosition(e);
					//this.showContextMenu(pos);
				}
			}
		});
		this.callParent(arguments);
	},

	showContextMenu: function(pos) {
		if(!this.contextMenu) this.contextMenu = Ext.create('Ext.menu.Menu', {
			id: 'filebrowser_contextmenu',
			items: [{
				text: 'Insert',
				handler: function() {
					XrEditor.Util.slideMsg('insert', 'Editor');
				}
			}, '-', {
				text: 'Delete',
				handler: function() {
					XrEditor.Util.slideMsg('delete', 'Editor');
				}
			}]
		});
		this.contextMenu.show(pos);
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
	/**
	 * Create the top toolbar
	 */
	showHelp: function() {
		//XrEditor.Util.popupMsg('show Help', 'INFO', 'メッセージ');
		XrEditor.Util.showLoadingMask('Loading', this.body, 'BIG');
		setTimeout(function() {
			XrEditor.Util.hideLoadingMask();
		}, 1000);
	}
});
