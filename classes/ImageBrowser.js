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
	node: '',

	url: {
		images: 'backend/file/images.json'
	},

	initComponent: function(){
		var me = this;
		
		Ext.define('ImageModel', {
			extend: 'Ext.data.Model',
			fields: [
				{name: 'node'},
				{name: 'type'},
				{name: 'name'},
				{name: 'url'},
				{name: 'size', type: 'float'},
				{name:'lastmod', type:'date', dateFormat:'timestamp'}
			]
		});

		this.store = Ext.create('Ext.data.Store', {
			model: ImageModel,
			proxy: {
				type: 'ajax',
				url: this.url.images,
				extraParams: {
					node: ''
				},
				reader: {
					type: 'json',
					root: 'images'
				},
			},
			listeners: {
				beforeload: function(store, operation, opts) {
					store.proxy.extraParams.node = me.node;
				}
			}
		});

		var dataView = Ext.create('Ext.view.View', {
			cls: 'images-view',
			//width: '100%',
			//height: '100%',
			store: this.store,
			tpl: [
				'<tpl for=".">',
					'<div class="thumb-wrap" id="{name}">',
					'<div class="thumb"><img src="{url}" title="{name}"></div>',
					'<span class="x-editable">{shortName}</span></div>',
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
						me.node = record.data.node;
						me.store.load();
					}
				}
			}
		});
		Ext.apply(this, {
			dockedItems: [this._createToolbar()],
			border: false,
			autoScroll: true,
			items: dataView
		});
		this.callParent(arguments);
	},
	/**
	 * create top toolbar
	 */
	_createToolbar: function() {
		var me = this;
		var config = {
			items: ['->', {
				handler: function() {
					me.store.load();
				},
				iconCls: 'icon-refresh'
			}]
		};
		return Ext.create('widget.toolbar', config);
	},
	afterRender: function() {
		this.store.load();
	}
});
