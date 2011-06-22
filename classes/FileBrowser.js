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
	selections: [],
	contextMenu: null,
	editorFrame: null,
	initComponent: function() {
		var me = this;
		var store = Ext.create('Ext.data.TreeStore', {
			proxy: {
				type: 'ajax',
				url: XrEditor.Global.urls.FILE_NODES
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
			}],
			listeners: {
				beforeload: function(store, operation, opts) {
					XrEditor.Util.showLoadingMask('Loading', me.body, 'BIG');
				},
				load: function(store, records, successful, opts) {
					XrEditor.Util.hideLoadingMask();
				}
			}
		});
		Ext.apply(this, {
			dockedItems: [this._createToolbar()],
			height: '100%',
			autoScroll: true,
			border: false,
			store: store,
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
				selectionchange: function(view, selections, options) {
					me.selections = selections;
				},
				itemcontextmenu: function(view, record, item, index, e, options) {
					e.stopEvent();
					var pos = e.getXY();
					this.showContextMenu(pos);
					return false;
				},
				itemdblclick: function(view, record, item, index, e, options) {
					Ext.Ajax.request({
						url: XrEditor.Global.urls.FILE_CONTENTS,
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
	 * create top toolbar
	 */
	_createToolbar: function() {
		var me = this;
		var createNode = function(button, e) {
			var selected = me.getSelectionModel().getLastSelected();
			var nodeType = button.initialConfig.nodeType;
			Ext.MessageBox.prompt('Input', 'New folder name:', function(btn, text){
				if(btn != 'ok') return;
				if(nodeType && nodeType != 'folder') {
					var pattern = new RegExp('.' + nodeType + '$');
					if(!pattern.test(pattern)) {
						text += '.' + nodeType;
					}
				}
				Ext.Ajax.request({
					url: XrEditor.Global.urls.FILE_UTILITY,
					method: 'GET',
					params: {
						action: 'add',
						parent: (selected && !selected.data.leaf) ? selected.internalId : '.',
						type: nodeType,
						name: text
					},
					success: function(response){
						var data = Ext.decode(response.responseText);
						//console.log(data);
						if(data.error) {
							XrEditor.Util.popupMsg(data.error, 'Error', 'ERROR');
							return;
						}
						me.store.load();
						/*
						console.log(selected);
						if(selected) {
							selected.updateInfo();
							selected.expand();
						}
						*/
					}
				});
			});
		};
		var deleteNode = function(button, e) {
			var selected = me.getSelectionModel().getLastSelected();
			if(!selected) return;
			Ext.MessageBox.confirm('Confirm', 'Are you sure to delete "' + selected.data.text +  '" ? ', function(btn) {
				if(btn != 'yes') return;
				Ext.Ajax.request({
					url: XrEditor.Global.urls.FILE_UTILITY,
					method: 'GET',
					params: {
						action: 'remove',
						node: selected.internalId
					},
					success: function(response){
						var data = Ext.decode(response.responseText);
						//console.log(data);
						if(data.error) {
							XrEditor.Util.popupMsg(data.error, 'Error', 'ERROR');
							return;
						}
						me.store.load();
					}
				});
			});
		};
		var renameNode = function(button, e) {
			var selected = me.getSelectionModel().getLastSelected();
			if(!selected) return;
			var nodeType = selected.data.leaf ? XrEditor.Util.getFileExtension(selected.data.text) : 'folder';
/*
var editor = new Ext.Editor({
    updateEl: true, // update the innerHTML of the bound element when editing completes
    field: {
        xtype: 'textfield'
    }
});
var el = selected.getTextEl();
editor.startEdit(el);
*/
			Ext.MessageBox.prompt('Rename', 'New name:', function(btn, text){
				if(btn != 'ok') return;
				if(nodeType && nodeType != 'folder') {
					var pattern = new RegExp('.' + nodeType + '$');
					if(!pattern.test(pattern)) {
						text += '.' + nodeType;
					}
				}
				Ext.Ajax.request({
					url: XrEditor.Global.urls.FILE_UTILITY,
					method: 'GET',
					params: {
						action: 'rename',
						node: selected.internalId,
						name: text
					},
					success: function(response){
						var data = Ext.decode(response.responseText);
						//console.log(data);
						if(data.error) {
							XrEditor.Util.popupMsg(data.error, 'Error', 'ERROR');
							return;
						}
						me.store.load();
					}
				});
			}, this, false, selected.data.text);
		};
		var aMenuItems = [{
			iconCls: 'icon-folder',
			text: 'Folder',
			nodeType: 'folder',
			handler: createNode
		}];
		for(var k in XrEditor.Global.fileTypes) {
			aMenuItems.push({
				iconCls: 'icon-doc-' + k,
				text: XrEditor.Global.fileTypes[k],
				nodeType: k,
				handler: createNode
			});
		}
		var config = {
			items: [{
				iconCls: 'icon-plus-circle',
				menu: Ext.create('Ext.menu.Menu', {
					items: aMenuItems
				})
			}, {
				iconCls: 'icon-minus-circle',
				handler: deleteNode
			}, {
				iconCls: 'icon-rename',
				handler: renameNode
			}, '->', {
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
