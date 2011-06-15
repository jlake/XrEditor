/**
 * @class XrEditor.FileBrowser
 * @extends Ext.tree.TabPanel
 * 
 * Copyright(c) 2011 Jlake Ou (ouzhiwei@gmail.com)
 */
Ext.define('XrEditor.FileBrowser', {
	extend: 'Ext.tree.Panel',
	alias: 'widget.xrfilebrowser',
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
			dockedItems: [this._createToolbar()],
			height: '100%',
			autoScroll: true,
			border: false,
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
					e.stopEvent();
					var pos = e.getXY();
					this.showContextMenu(pos);
					return false;
				},
				itemdblclick: function(view, record, item, index, e, options) {
					Ext.Ajax.request({
						url: me.urls.contents,
						params: {
							node: record.data.id
						},
						success: function(response){
							var data = Ext.decode(response.responseText);
							if(data.error) {
								XrEditor.Util.popupMsg(data.error, 'Error', 'ERROR');
								return;
							}
							var editor = new XrEditor.Editor({
								fileType: XrEditor.Util.getFileExtension(record.data.id),
								node: record.data.id,
								code: data.contents
							});
							var aTmp = record.data.id.split(/\//);
							editor.setTitle(aTmp[aTmp.length-1]);
							me.editorFrame.add(editor);
							me.editorFrame.setActiveTab(editor);
							me.editorFrame.doLayout();
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
	/**
	 * @return {Ext.toolbar.Toolbar} toolbar
	 */
	_createToolbar: function() {
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
	},
	showContextMenu: function(pos) {
		if(this.contextMenu) this.contextMenu.showAt(pos);
	},
	hideContextMenu: function() {
		if(this.contextMenu) this.contextMenu.hide();
	},
	setEditorFrame: function(obj) {
		this.editorFrame = obj;
	}
});
