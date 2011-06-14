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
	editorFrame: null,
	urls: {
		nodes: 'backend/file/nodes.json',
		contents: 'backend/file/contents.json'
	},
	initComponent: function() {
		var me = this;
		Ext.apply(this, {
			dockedItems: [this.createToolbar()],
			height: '100%',
			store: Ext.create('Ext.data.TreeStore', {
				proxy: {
					type: 'ajax',
					url: me.urls.nodes
				},
				root: {
					text: 'Root',
					id: '.',
					expanded: true
				},
				folderSort: true,
				/*
				sorters: [{
					property: 'text',
					direction: 'ASC'
				}],
				*/
				listeners: {
					beforeload: function(store, operation, opts) {
						XrEditor.Util.showLoadingMask('Loading', me.body, 'BIG');
					},
					load: function(store, records, successful, opts) {
						XrEditor.Util.hideLoadingMask();
					}
				}
			}),
			rootVisible: false,
			viewConfig: {
				plugins: {
					ptype: 'treeviewdragdrop',
					appendOnly: true
				}
			},
			loadMask: {
				msg: 'Loading...'
			},
			listeners: {
				itemcontextmenu: function(view, record, item, index, e, options) {
					//console.log('itemcontextmenu', item);
					e.stopEvent();
					var pos = e.getXY();
					this.showContextMenu(pos);
					return false;
				},
				itemdblclick: function(view, record, item, index, e, options) {
					Ext.Ajax.request({
						url: me.urls.contents,// + '?node=' +  record.data.id,
						params: {
							node: record.data.id
						},
						success: function(response){
							var text = response.responseText;
							//console.log(text);
							XrEditor.Util.slideMsg(text, record.data.id);
						}
					});
				}
			}
		});
		this.contextMenu = Ext.create('Ext.menu.Menu', {
			id: 'filebrowser_contextmenu',
			//plain: true,
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
		this.callParent(arguments);
	},
	showContextMenu: function(pos) {
		if(this.contextMenu) this.contextMenu.showAt(pos);
	},
	hideContextMenu: function() {
		if(this.contextMenu) this.contextMenu.hide();
	},
	setEditorFrame: function(obj) {
		this.editorFrame = obj;
	},
	/**
	 * Create the top toolbar
	 * @private
	 * @return {Ext.toolbar.Toolbar} toolbar
	 */
	createToolbar: function() {
		var me = this;
		var config = {
			items: ['->', {
				//scope: this,
				handler: function() {
					me.store.load();
				},
				iconCls: 'icon-refresh'
			}]
		};
		return Ext.create('widget.toolbar', config);
	}
});
