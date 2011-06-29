/**
 * @class XrEditor.CodeEditor
 * @extends Ext.panel.TabPanel
 *
 * Copyright(c) 2011 Jlake Ou (ouzhiwei@gmail.com)
 */
Ext.define('XrEditor.CodeEditor', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.xrcodeeditor',

	autoScroll: true,
	border: true,

	itemId: 'code',
	iconCls: 'icon-code',

	wrapper: null,
	editor: null,
	searchWin: null,

	config: {
		nodeId: '',
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
			title: this.title || _('code'),
			dockedItems: [this._createToolbar()],
			items: []
		});
		this.callParent(arguments);
	},
	/**
	 * Create the top toolbar
	 */
	_createToolbar : function(){
		var me = this;
		var config = {
			items: [{
				tooltip: _('undo'),
				iconCls: 'icon-undo',
				handler: function() {
					me.editor.undo();
				}
			}, {
				tooltip: _('redo'),
				iconCls: 'icon-redo',
				handler: function() {
					me.editor.redo();
				}
			}, '-', {
				tooltip: _('search & replace'),
				iconCls: 'icon-magnifier',
				handler: function() {
					me.searchReplace();
				}
			}]
		};
		return Ext.create('widget.toolbar', config);
	},
	/**
	 * override afterRender method
	 */
	afterRender: function() {
		this.callParent(arguments);
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
			lineNumbers: true,
			theme: 'default'
		});
		Ext.get(this.editor.getWrapperElement()).applyStyles('background:#ffe;width:100%;height:100%;');
	},
	/**
	 * set editor's mode
	 */
	setMode: function(sMode) {
		this.editor.setOption('mode', sMode);
		this.editor.refresh();
	},
	/**
	 * get editor's code
	 */
	getCode: function() {
		return this.editor ? this.editor.getValue() : '';
	},
	/**
	 * set editor's code
	 */
	setCode: function(sCode) {
		if(this.editor) this.editor.setValue(sCode);
	},
	/**
	 * insert code
	 */
	insertCode: function(sCode) {
		if(!this.editor) return;
		/*
		if(cursor = this.editor.getCursor()) {
			this.editor.replaceRange(sCode, cursor, cursor);
		} */
		this.editor.replaceSelection(sCode);
	},
	/**
	 * Search & replace
	 */
	searchReplace: function() {
		var me = this;
		var editor = me.editor;
		var cursor = null;
		var findText = new Ext.form.TextField({
			fieldLabel: _('search string'),
			value: '',
			anchor: '100%',
			listeners: {
				blur: function() {
					cursor = null;
				}
			}
		});
		var replaceText = new Ext.form.TextField({
			fieldLabel: _('replace with string'),
			value: '',
			anchor: '100%'
		});

		var lastPos = null, lastQuery = null, marked = [];

		function unmark() {
			for (var i = 0; i < marked.length; ++i) marked[i]();
			marked.length = 0;
		}

		function search(text) {
			unmark();                     
			if (!text) return;
			cursor = editor.getSearchCursor(text);
			while(cursor.findNext()) {
				marked.push(editor.markText(cursor.from(), cursor.to(), "searched"));
			}
			if (lastQuery != text) lastPos = null;
			cursor = editor.getSearchCursor(text, lastPos || editor.getCursor());
			if (!cursor.findNext()) {
				cursor = editor.getSearchCursor(text);
				if (!cursor.findNext()) return;
			}
			editor.setSelection(cursor.from(), cursor.to());
			lastQuery = text; lastPos = cursor.to();
		}

		function replace(text, replace, allFlg) {
			unmark();
			if (!text) return;
			if(allFlg) {
				var cnt = 0;
				cursor = editor.getSearchCursor(text);
				while(cursor.findNext()) {
					editor.replaceRange(replace, cursor.from(), cursor.to());
					cnt++;
				}
				XrEditor.Util.slideMsg(_('{0} occurrences have been replaced', [cnt]), _('message'));
			} else {
				if(cursor) {
					editor.replaceRange(replace, cursor.from(), cursor.to());
					search(text);
				}
			}
		}
		var formPanel = new Ext.form.FormPanel({
			frame: true,
			width: '100%',
			height: '100%',
			bodyStyle: 'padding:10px',
			labelWidth: 100,
			autoScroll: true,
			bodyBorder: false,
			collapsible: false,
			defaults: {width: 180, listWidth:180},
			items: [
				findText,
				replaceText
			]
		});
		me.searchWin = me.searchWin || new Ext.Window({
			title: _('search & replace'),
			closable: true,
			width: 360,
			height: 160,
			modal: true,
			buttonAlign: 'center',
			plain: true,
			closeAction: 'hide',
			layout: 'fit',
			items: formPanel,
			buttons: [{
				text: _('find next'),
				handler: function(){
					search(findText.getValue());
				}
			}, {
				text: _('replace'),
				handler: function(){
					replace(findText.getValue(), replaceText.getValue(), false);
				}
			}, {
				text: _('replace all'),
				handler: function(){
					replace(findText.getValue(), replaceText.getValue(), true);
				}
			}, {
				text: _('close'),
				handler: function(){
					me.searchWin.close();
				}
			}],
			keys: {
				key: [13],
				fn: function() {
					fSearch(findText.getValue());
				}
			},
			listeners: {
				show: function() {
					findText.focus();
				}
			}
		});
		me.searchWin.show();
	}
});
