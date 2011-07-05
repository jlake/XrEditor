/**
 * @class XrEditor.ImageBrowser
 * @extends Ext.tab.Panel
 *
 * Copyright(c) 2011 Jlake Ou (ouzhiwei@gmail.com)
 */
Ext.define('XrEditor.ImageBrowser', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.xrimagebrowser',

	store: null,
	subFolderMenu: null,
	contextMenu: null,
	searchField: null,
	labelEditor: null,
	activeRecord: null,
	folder: {
		node: '',
		parent: '',
		children: []
	},
	config: {
		thumbWidth: 80,
		thumbHeight: 60,
	},
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		return this;
	},
	/**
	 * @override
	 */
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
					root: 'pageItems',
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
		me.labelEditor = Ext.create('Ext.ux.DataView.LabelEditor', {
			dataIndex: 'name',
			listeners: {
				beforecomplete: function(editor, value, startValue, opts) {
					//console.log('beforecomplete', editor, value, startValue, opts);
					if(!value || !/^[\w.-]+$/.test(value)) {
						XrEditor.Util.popupMsg('Invalid input!', _('error'), 'ERROR');
						return false;
					}
					var ext = XrEditor.Util.getFileExtension(startValue);
					var pattern = new RegExp('.' + ext + '$', 'i');
					if(!pattern.test(value)) {
						value += '.' + ext;
						editor.setValue(value);
					}
					Ext.Ajax.request({
						url: XrEditor.Global.urls.IMAGE_UTILITY,
						method: 'GET',
						params: {
							action: 'rename',
							node: editor.activeRecord.data.node,
							name: value
						},
						success: function(response){
							var data = Ext.decode(response.responseText);
							//console.log(data);
							if(data.error) {
								XrEditor.Util.popupMsg(data.error, _('error'), 'ERROR');
								editor.setValue(startValue);
								return;
							}
						}
					});
					return true;
				}
			}
		});
		var dataView = Ext.create('Ext.view.View', {
			cls: 'images-view',
			store: store,
			tpl: [
				'<tpl for=".">',
					'<div class="thumb-wrap" id="{name}">',
					'<span class="thumb"><img src="{thumburl}" width="'+ me.config.thumbWidth + '" height="'+ me.config.thumbHeight + '" title="{name}"></span>',
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
				me.labelEditor
			],
			prepareData: function(data) {
				Ext.apply(data, {
					shortName: Ext.util.Format.ellipsis(data.name, 15),
					sizeString: Ext.util.Format.fileSize(data.size),
					dateString: Ext.util.Format.date(data.lastmod, "Y-m-d g:i:s")
				});
				return data;
			},
			listeners: {
				itemcontextmenu: function(view, record, item, index, e, opts) {
					e.stopEvent();
					me.showContextMenu(e.getXY());
					me.activeRecord = record;
					return false;
				},
				itemdblclick: function(view, record, item, index, e, opts) {
					if(editor = XrEditor.Global.currentEditor) {
						if(editor.activeTab.sendCommand) {
							editor.activeTab.sendCommand('insertimage', record.data.url);
						}
					}
				},
				itemremove: function(record, index, opts) {
					console.log('itemremove', record, index, opts);
				}
			}
		});
		me.earchField = Ext.create('Ext.ux.form.SearchField', {
			paramName: 'keyword',
			store: me.store,
			width: 170
		});
		Ext.apply(this, {
			title: this.title || _('images'),
			dockedItems: [this._createToolbar()],
			border: false,
			height: '100%',
			autoScroll: true,
			items: dataView,
			bbar: Ext.create('Ext.PagingToolbar', {
				store: store,
				displayInfo: true,
				displayMsg: '{0} - {1} of {2}',
				emptyMsg: _('no items to display')
			}),
		});
		this.callParent(arguments);
	},
	/**
	 * create top toolbar
	 */
	_createToolbar: function() {
		var me = this;
		this.contextMenu = Ext.create('Ext.menu.Menu', {
			id: 'contextbrowser_contextmenu',
			//plain: true,
			//floating: true,
			items: [{
				text: _('delete'),
				iconCls: 'icon-minus-circle',
				handler: function(item, e) {
					Ext.MessageBox.confirm(_('confirm'), _('are you sure to delete {0}', ['"' + me.activeRecord.data.name +  '"']) + '?', function(btn) {
						if(btn == 'yes') {
							me.activeRecord.data.delflg = true;
							me.store.remove(me.activeRecord);
						}
						me.activeRecord = null;
					});
				}
			}]
		});
		var config = {
			items: [{
				iconCls: 'icon-folder-up',
				handler: function() {
					me.folder.node = me.folder.parent;
					me.store.load();
				}
			}, {
				iconCls: 'icon-folder-go',
				menu: me.subFolderMenu
			}, {
				iconCls: 'icon-folder-home',
				handler: function() {
					me.folder.node = '';
					me.store.load();
				}
			}, '-', {
				iconCls: 'icon-refresh',
				handler: function() {
					me.store.load();
				}
			}, '->', me.earchField]
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
	/**
	 * @override
	 */
	afterRender: function() {
		this.store.load();
		this.callParent(arguments);
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
	}
});
