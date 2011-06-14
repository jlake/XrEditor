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

	config: {
		node: '',
		code: '',
		fileType: ''
	},
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		return this;
	},

	initComponent: function(){
		Ext.apply(this, {
			dockedItems: [this._createToolbar()],
			bodyStyle: 'background:#ffe;'
		});
		this.callParent(arguments);
	},
	/**
	 * Create the top toolbar
	 */
	_createToolbar : function(){
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
		var sMode = '';
		switch(this.config.fileType) {
			case 'js':
				sMode = 'javascript';
				break;
			case 'css':
				sMode = 'css';
				break;
			case 'xml':
				sMode = 'xml';
				break;
			default:
				sMode = 'htmlmixed';
				break;
		}
		this.editor = CodeMirror(this.body.dom, {
			value: this.config.code,
			mode: sMode,
			theme: 'default'
		});
		Ext.get(this.editor.getWrapperElement()).applyStyles('width:100%;height:100%;');
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
