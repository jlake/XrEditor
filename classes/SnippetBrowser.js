/**
 * @class XrEditor.SnippetBrowser
 * @extends Ext.grid.Panel
 *
 * Copyright(c) 2011 Jlake Ou (ouzhiwei@gmail.com)
 */
Ext.define('XrEditor.SnippetBrowser', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.xrimagebrowser',

	title: 'Snippets',

	selectedNode: null,
	contextMenu: null,
	editorFrame: null,
	initComponent: function() {
		var me = this;
		Ext.define('SnippetItem', {
			extend: 'Ext.data.Model',
			fields: [
				'id', 'title', 'lang', 'tags',
				{name: 'lastmod', mapping: 'lastmod', type: 'date', dateFormat: 'timestamp'}
			],
			idProperty: 'id'
		});

		var store = Ext.create('Ext.data.Store', {
			pageSize: XrEditor.Global.pageSize,
			model: 'SnippetItem',
			remoteSort: true,
			proxy: {
				type: 'ajax',
				url: XrEditor.Global.urls.SNIPPET_LIST,
				reader: {
					root: 'pageItems',
					totalProperty: 'totalItemCount'
				},
				simpleSortMode: true
			},
			listeners: {
				beforeload: function(store, operation, opts) {
					//store.proxy.extraParams.id = '';
					//XrEditor.Util.showLoadingMask('Loading', me.body, 'BIG');
				},
				load: function(store, records, successful, opts) {
					//XrEditor.Util.hideLoadingMask();
				}
			}
		});
		Ext.apply(this, {
			dockedItems: [this._createToolbar()],
			height: '100%',
			autoScroll: true,
			border: false,
			store: store,
			loadMask: {
				msg: 'Loading...'
			},
			columns: [{
				text: 'Language',
				sortable: true,
				dataIndex: 'lang',
				renderer: function(value) {
					return '<img src="' + XrEditor.Global.baseUrl + '/images/shared/folder_page.png" />&nbsp;' + value;
				}
			},{
				text: 'Title',
				sortable: true,
				dataIndex: 'title'
			},{
				text: 'Last Modified',
				dataIndex: 'lastmod',
				sortable: true
			}],
			bbar: Ext.create('Ext.PagingToolbar', {
				store: store,
				displayInfo: true,
				displayMsg: '{0} - {1} of {2}',
				emptyMsg: "No items to display"
			}),
			listeners: {
				beforerender: function(view) {
					store.load();
				},
				itemcontextmenu: function(view, record, item, index, e, options) {
					e.stopEvent();
					var pos = e.getXY();
					this.showContextMenu(pos);
					return false;
				},
				itemdblclick: function(view, record, item, index, e, options) {
					Ext.Ajax.request({
						url: XrEditor.Global.urls.SNIPPET_DETAIL,
						params: {
							node: record.data.id
						},
						success: function(response){
							var data = Ext.decode(response.responseText);
							console.log(data);
						}
					});
				}
			}
		});
		this.callParent(arguments);
	},
	/**
	 * create top toolbar
	 */
	_createToolbar: function() {
		var me = this;
		var aItems = [];
		for(var k in XrEditor.Global.fileTypes) {
			aItems.push({
				iconCls: 'icon-doc-' + k,
				text: XrEditor.Global.fileTypes[k],
				fileType: k,
				handler: function(btn, e) {
				}
			});
		}
		var newFileMenu = Ext.create('Ext.menu.Menu', {
			items: aItems
		});
		this.contextMenu = Ext.create('Ext.menu.Menu', {
			id: 'contextbrowser_contextmenu',
			//plain: true,
			//floating: true,
			items: [{
				text: 'New',
				iconCls: 'icon-file-add',
				menu: newFileMenu
			}, {
				text: 'Rename',
				iconCls: 'icon-rename',
				handler: function(widget, e) {
					XrEditor.Util.slideMsg('rename', 'Snippet');
					//me.hideContextMenu();
				}
			}, {
				text: 'Delete',
				iconCls: 'icon-file-delete',
				handler: function(widget, e) {
					XrEditor.Util.slideMsg('delete', 'Snippet');
					//me.hideContextMenu();
				}
			}]
		});
		var config = {
			items: [{
				iconCls: 'icon-file-add',
				menu: newFileMenu
			}, {
				iconCls: 'icon-file-delete',
				handler: function() {
				}
			}, {
				iconCls: 'icon-rename',
				handler: function(widget, e) {
					XrEditor.Util.slideMsg('rename', 'Snippet');
					//me.hideContextMenu();
				}
			}, {
				iconCls: 'icon-file-edit',
				handler: function() {
				}
			}, '->', {
				//scope: this,
				handler: function() {
					me.store.load();
				},
				iconCls: 'icon-refresh'
			}]
		};
		return Ext.create('widget.toolbar', config);
	},
	/**
	 * cshow context menu
	 */
	showContextMenu: function(pos) {
		if(this.contextMenu) this.contextMenu.showAt(pos);
	},
	/**
	 * hide context menu
	 */
	hideContextMenu: function() {
		if(this.contextMenu) this.contextMenu.hide();
	},
	/**
	 * set editor frame
	 */
	setEditorFrame: function(obj) {
		this.editorFrame = obj;
	}
});
