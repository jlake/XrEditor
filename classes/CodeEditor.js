/**
 * @class XrEditor.CodeEditor
 * @extends Ext.panel.TabPanel
 *
 * define CodeEditor class
 *
 * @constructor
 * 
 * @param {Object} config The config object
 * @author ouzhiwei@gmail.com (Jlake Ou)
 */
Ext.define('XrEditor.CodeEditor', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.xrcodeeditor',

	autoScroll: true,
	border: true,

	itemId: 'code',
	title: 'Code',
	iconCls: 'icon-code',

	editor: null,
	//editorWrapper: null,

	initComponent: function(){
		Ext.apply(this, {
			dockedItems: [this.createToolbar()],
			listeners: {
				resize: function(panel, w, h, opts) {
					//if(this.editor) this.editor.refresh();
					/*
					if(this.editorWrapper) {
						var size = this.body.getSize();
						this.editorWrapper.setWidth(size.width);
						this.editorWrapper.setHeight(size.height);
					}*/
				}
			}
		});
		this.callParent(arguments);
	},
	createToolbar : function(editor){
		var config = {
			items: [{
				tooltip: 'Undo',
				iconCls: 'icon-undo',
				handler: function() {
					//this.editor.undo();
				}
			}, {
				tooltip: 'Redo',
				iconCls: 'icon-redo',
				handler: function() {
					//this.editor.redo();
				}
			}, '-', {
				tooltip: 'Search & Replace',
				iconCls: 'icon-magnifier',
				handler: function() {
					// TO-DO
				}
			}, '-', {
				tooltip: 'Word Wrap/No Wrapping',
				iconCls: 'icon-nowrap',
				enableToggle: true,
				listeners: {
					toggle: function(btn, pressed) {
						//this.editor.setTextWrapping(!pressed);
					}
				}
			}]
		};
		return Ext.create('widget.toolbar', config);
	},
	afterRender: function() {
		this.editor = CodeMirror(this.body.dom, {
			value: '',
			mode: 'htmlmixed'
		});
		//this.editorWrapper = Ext.get(this.editor.getWrapperElement());
	},
	setMode: function(sMode) {
	},
	getCode: function() {
		return this.editor ? this.editor.getValue() : '';
	},
	setCode: function(sCode) {
		if(this.editor) this.editor.setValue(sCode);
	}
});
