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
	selectedNode: null,
	contextMenu: null,
	initComponent: function() {
		var me = this;
		this.contextMenu = Ext.create('Ext.menu.Menu', {
			id: 'filebrowser_contextmenu',
			plain: true,
			//floating: true,
			items: [{
				text: 'Insert',
				iconCls: 'icon-plus',
				handler: function(widget, e) {
					XrEditor.Util.slideMsg('insert', 'Editor');
					me.hideContextMenu();
				}
			}, {
				text: 'Delete',
				iconCls: 'icon-minus',
				handler: function(widget, e) {
					XrEditor.Util.slideMsg('delete', 'Editor');
					me.hideContextMenu();
				}
			}]
		});
		Ext.apply(this, {
			dockedItems: [this.createToolbar()],
			height: '100%',
			store: Ext.create('Ext.data.TreeStore', {
				proxy: {
					type: 'ajax',
					url: 'backend/file/nodes.json'
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
			}),
			rootVisible: false,
			viewConfig: {
				plugins: {
					ptype: 'treeviewdragdrop',
					appendOnly: true
				}
			},
			listeners: {
				itemcontextmenu: function(view, record, item, index, e, options) {
					//console.log('itemcontextmenu', item);
					e.stopEvent();
					var pos = e.getXY();
					this.showContextMenu(pos);
					return false;
				}
			}
		});
		this.callParent(arguments);
	},
	showContextMenu: function(pos) {
		if(this.contextMenu) this.contextMenu.showAt(pos);
	},
	hideContextMenu: function() {
		if(this.contextMenu) this.contextMenu.hide();
	},
	/**
	 * Create the top toolbar
	 * @private
	 * @return {Ext.toolbar.Toolbar} toolbar
	 */
	createToolbar: function() {
		var me = this;
		// refresh tree nodes
		var refresh = function() {
			XrEditor.Util.showLoadingMask('Loading', me.body, 'BIG');
			me.store.load();
			setTimeout(function() {
				XrEditor.Util.hideLoadingMask();
			}, 1000);
		}
		var config = {
			items: ['->', {
				//scope: this,
				handler: refresh,
				//text: 'Refresh',
				iconCls: 'icon-refresh'
			}]
		};
		return Ext.create('widget.toolbar', config);
	}
});
