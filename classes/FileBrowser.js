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
				selectionchange: function(view, selections, opts) {
					me.selections = selections;
				},
				itemcontextmenu: function(view, record, item, index, e, opts) {
					e.stopEvent();
					var pos = e.getXY();
					this.showContextMenu(pos);
					return false;
				},
				itemdblclick: function(view, record, item, index, e, opts) {
					me.editorFrame.items.each(function(item, index, length) {
						if(item.initialConfig.nodeId == record.data.id) {
							me.editorFrame.setActiveTab(item);
							return false;
						}
					});
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
								nodeId: record.data.id,
								code: data.contents
							});
							var aTmp = record.data.id.split(/\//);
							editor.setTitle(aTmp[aTmp.length-1]);
							me.editorFrame.add(editor);
							me.editorFrame.setActiveTab(editor);
							me.editorFrame.doLayout();
						}
					});
				},
				itemappend: function(node, newNode, index, opts) {
					//console.log('itemappend', node, newNode, index, opts);
					if(newNode.data.newflg) {
						Ext.Ajax.request({
							url: XrEditor.Global.urls.FILE_UTILITY,
							method: 'GET',
							params: {
								action: 'add',
								parent: node.data.id,
								type: newNode.data.type,
								name: newNode.data.text
							},
							success: function(response){
								var data = Ext.decode(response.responseText);
								if(data.error) {
									XrEditor.Util.popupMsg(data.error, 'Error', 'ERROR');
									newNode.remove(true);
									return;
								}
							}
						});
					}
				},
				itemmove: function(node, oldParent, newParent, index, opts) {
					if(oldParent.id == newParent.id) return;
					Ext.Ajax.request({
						url: XrEditor.Global.urls.FILE_UTILITY,
						method: 'GET',
						params: {
							action: 'move',
							node: node.data.id,
							parent: newParent.data.id
						},
						success: function(response){
							var data = Ext.decode(response.responseText);
							//console.log(data);
							if(data.error) {
								XrEditor.Util.popupMsg(data.error, 'Error', 'ERROR');
								return;
							}
						}
					});
				},
				itemremove: function(node, childNode, opts) {
					//console.log('itemremove', node, childNode, opts);
					if(childNode.data.delflg) {
						Ext.Ajax.request({
							url: XrEditor.Global.urls.FILE_UTILITY,
							method: 'GET',
							params: {
								action: 'remove',
								node: childNode.data.id
							},
							success: function(response){
								var data = Ext.decode(response.responseText);
								//console.log(data);
								if(data.error) {
									XrEditor.Util.popupMsg(data.error, 'Error', 'ERROR');
									node.appendNode(childNode);
									return;
								}
							}
						});
					}
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
		var _appendNode = function(button, e) {
			var selectedNode = me.selections[0] || me.getRootNode();
			if(selectedNode.data.leaf) return;
			var nodeType = button.initialConfig.nodeType || 'folder';
			Ext.MessageBox.prompt('Input', 'New folder/file name:', function(btn, text){
				if(btn != 'ok') return;
				if(!text || !/^[\w.-]+$/.test(text)) {
					XrEditor.Util.popupMsg('Invalid input!', 'Error', 'ERROR');
					return;
				}
				var iconCls = '';
				if(nodeType && nodeType != 'folder') {
					var pattern = new RegExp('.' + nodeType + '$', 'i');
					if(!pattern.test(text)) {
						text += '.' + nodeType;
					}
					iconCls = 'doc-type-' + nodeType;
				}
				selectedNode.appendChild({
					newflg: true,
					id: selectedNode.data.id + '/' + text,
					type: nodeType,
					text: text,
					qtip: 'Last Modified: ' + Ext.util.Format.date(Ext.Date.now(), "Y-m-d g:i:s"),
					leaf: false,
					cls: nodeType, 
					iconCls: iconCls
				});
			});
		}
		var _removeNode = function(button, e) {
			//var selectedNode = me.getSelectionModel().getLastselectedNode();
			var selectedNode = me.selections[0];
			if(!selectedNode) return;
			Ext.MessageBox.confirm('Confirm', 'Are you sure to delete "' + selectedNode.data.text +  '" ? ', function(btn) {
				if(btn == 'yes') {
					selectedNode.data.delflg = true;
					selectedNode.remove();
				}
			});
		};
		var _renameNode = function(button, e) {
			//var selectedNode = me.getSelectionModel().getLastselectedNode();
			var selectedNode = me.selections[0];
			if(!selectedNode) return;
			var nodeType = selectedNode.data.leaf ? XrEditor.Util.getFileExtension(selectedNode.data.text, true) : 'folder';
			Ext.MessageBox.prompt('Rename', 'New name:', function(btn, text){
				if(btn != 'ok') return;
				if(nodeType && nodeType != 'folder') {
					var pattern = new RegExp('.' + nodeType + '$', 'i');
					if(!pattern.test(text)) {
						text += '.' + nodeType;
					}
				}
				Ext.Ajax.request({
					url: XrEditor.Global.urls.FILE_UTILITY,
					method: 'GET',
					params: {
						action: 'rename',
						node: selectedNode.data.id,
						name: text
					},
					success: function(response){
						var data = Ext.decode(response.responseText);
						//console.log(data);
						if(data.error) {
							XrEditor.Util.popupMsg(data.error, 'Error', 'ERROR');
							return;
						}
						// because there is no setText function
						selectedNode.data.text = text;
						selectedNode.parentNode.replaceChild(selectedNode, selectedNode);
					}
				});
			}, this, false, selectedNode.data.text);
		};
		var aMenuItems = [{
			iconCls: 'icon-folder',
			text: 'Folder',
			nodeType: 'folder',
			handler: _appendNode
		}];
		for(var k in XrEditor.Global.fileTypes) {
			aMenuItems.push({
				iconCls: 'icon-doc-' + k,
				text: XrEditor.Global.fileTypes[k],
				nodeType: k,
				handler: _appendNode
			});
		}

		var oNewMenu = Ext.create('Ext.menu.Menu', {
			items: aMenuItems
		});
		this.contextMenu = Ext.create('Ext.menu.Menu', {
			id: 'filebrowser_contextmenu',
			//plain: true,
			//floating: true,
			items: [{
				text: 'New',
				iconCls: 'icon-plus-circle',
				menu: oNewMenu
			}, {
				text: 'Rename',
				iconCls: 'icon-rename',
				handler: _renameNode
			}, {
				text: 'Delete',
				iconCls: 'icon-minus-circle',
				handler: _removeNode
			}]
		});
		var config = {
			items: [{
				iconCls: 'icon-plus-circle',
				menu: oNewMenu
			}, {
				iconCls: 'icon-minus-circle',
				handler: _removeNode
			}, {
				iconCls: 'icon-rename',
				handler: _renameNode
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
