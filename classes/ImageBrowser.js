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

	url: {
		images: 'backend/file/images.json'
	},

	initComponent: function(){
		var ImageModel = Ext.define('ImageModel', {
			extend: 'Ext.data.Model',
			fields: [
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
				reader: {
					type: 'json',
					root: 'images'
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
				selectionchange: function(dv, nodes ){
					/*
					var l = nodes.length,
						s = l !== 1 ? 's' : '';
					this.up('panel').setTitle('Simple DataView (' + l + ' item' + s + ' selected)');
					*/
				}
			}
		});
		Ext.apply(this, {
			border: false,
			//height: '100%',
			autoScroll: true,
			items: dataView
		});
		this.callParent(arguments);
	},
	afterRender: function() {
		this.store.load();
	}
});
