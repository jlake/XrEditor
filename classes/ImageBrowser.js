/**
 * @class XrEditor.ImageBrowser
 * @extends Ext.tab.Panel
 *
 * Copyright(c) 2011 Jlake Ou (ouzhiwei@gmail.com)
 */
Ext.define('XrEditor.ImageBrowser', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.xrimagebrowser',

	title: 'Images',
	store: null,
	folder: {
		node: '',
		parent: '',
		children: []
	},
	subFolderMenu: null,
	config: {
		thumbWidth: 80,
		thumbHeight: 60,
	},
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		return this;
	},

	initComponent: function(){
		var me = this;
		me.subFolderMenu = Ext.create('Ext.menu.Menu', {
			items: me.folder.children
		});
		Ext.define('ImageModel', {
			extend: 'Ext.data.Model',
			fields: [
				{name: 'node'},
				{name: 'type'},
				{name: 'name'},
				{name: 'url'},
				{name: 'thumburl'},
				{name: 'size', type: 'float'},
				{name: 'lastmod', type:'date', dateFormat:'timestamp'}
			]
		});
		var store = Ext.create('Ext.data.Store', {
			model: ImageModel,
			pageSize: XrEditor.Global.pageSize,
			proxy: {
				type: 'ajax',
				url: XrEditor.Global.urls.IMAGE_LIST,
				extraParams: {
					w: me.config.thumbWidth,
					h: me.config.thumbHeight,
					node: ''
				},
				reader: {
					type: 'json',
					root: 'images',
					totalProperty: 'totalItemCount'
				}
			},
			listeners: {
				beforeload: function(store, operation, opts) {
					store.proxy.extraParams.node = me.folder.node;
				},
				load: function(store, records, successful, operation, opts) {
					if(data = store.proxy.reader.jsonData) {
						me.folder.node = data.node;
						me.folder.parent = data.parent;
						me.folder.children = data.folders;
						me.updateSubFolderMenu();
					}
				},
				update: function(store, record, operation, opts) {
				}
			}
		});
		me.store = store;
		var dataView = Ext.create('Ext.view.View', {
			cls: 'images-view',
			store: store,
			tpl: [
				'<tpl for=".">',
					'<div class="thumb-wrap" id="{name}">',
					'<span class="thumb"><img src="{thumburl}" width="'+ me.config.thumbWidth + '" height="'+ me.config.thumbHeight + '" title="{name}" url="{url}"></span>',
					'<br /><span class="x-editable">{shortName}</span></div>',
				'</tpl>',
				'<div class="x-clear"></div>'
			],
			multiSelect: true,
			trackOver: true,
			overItemCls: 'x-item-over',
			itemSelector: 'div.thumb-wrap',
			emptyText: 'No images to display',
			plugins: [
				Ext.create('Ext.ux.DataView.DragSelector', {}),
				Ext.create('Ext.ux.DataView.LabelEditor', {dataIndex: 'name'})
			],
			prepareData: function(data) {
				Ext.apply(data, {
					shortName: Ext.util.Format.ellipsis(data.name, 15),
					sizeString: Ext.util.Format.fileSize(data.size),
					dateString: Ext.util.Format.date(data.lastmod, "m/d/Y g:i a")
				});
				return data;
			},
			listeners: {
				/*
				selectionchange: function(view, nodes ){
					var l = nodes.length,
						s = l !== 1 ? 's' : '';
					this.up('panel').setTitle('Simple DataView (' + l + ' item' + s + ' selected)');
				},
				*/
				itemdblclick: function(view, record, item, index, e, opts) {
					//console.log(record.data);
					if(record.data.type == 'dir') {
						me.folder.node = record.data.node;
						me.store.load();
					}
				}
			}
		});
		Ext.apply(this, {
			dockedItems: [this._createToolbar()],
			border: false,
			height: '100%',
			autoScroll: true,
			items: dataView,
			bbar: Ext.create('Ext.PagingToolbar', {
				store: store,
				displayInfo: true,
				displayMsg: '{0} - {1} of {2}',
				emptyMsg: "No items to display"
			}),
		});
		this.callParent(arguments);
	},
	/**
	 * create top toolbar
	 */
	_createToolbar: function() {
		var me = this;
		var config = {
			items: [{
				iconCls: 'icon-folder-up',
				handler: function() {
					me.folder.node = me.folder.parent;
					//me.folder.parent = '';
					me.store.load();
				}
			}, {
				iconCls: 'icon-folder-home',
				handler: function() {
					me.folder.node = '';
					//me.folder.parent = null;
					me.store.load();
				}
			}, {
				iconCls: 'icon-folder-go',
				menu: me.subFolderMenu
			}, '->', {
				iconCls: 'icon-refresh',
				handler: function() {
					me.store.load();
				}
			}]
		};
		return Ext.create('widget.toolbar', config);
	},
	/**
	 * update menu for sub folders
	 */
	updateSubFolderMenu: function() {
		var me = this;
		me.subFolderMenu.removeAll();
		var aItems = [];
		for(var i=0; i<me.folder.children.length; i++) {
			var folder = me.folder.children[i];
			aItems.push({
				iconCls: 'icon-folder',
				text: folder.name,
				node: folder.node,
				handler: function(btn, e) {
					me.folder.node = btn.initialConfig.node;
					me.store.load();
				}
			});
		}
		me.subFolderMenu.add(aItems);
	},
	afterRender: function() {
		this.store.load();
	}
});
