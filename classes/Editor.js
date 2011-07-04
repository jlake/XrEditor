/**
 * @class XrEditor.Editor
 * @extends Ext.panel.TabPanel
 * 
 * Copyright(c) 2011 Jlake Ou (ouzhiwei@gmail.com)
 */
Ext.define('XrEditor.Editor', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.xreditor',

	tabPosition: 'bottom',

	htmlEditor: null,
	codeEditor: null,

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
		var aItems = [];
		if(this.config.fileType == 'html') {
			this.htmlEditor = new XrEditor.HtmlEditor(this.config);
			aItems.push(this.htmlEditor);
		}
		this.codeEditor = new XrEditor.CodeEditor(this.config);
		aItems.push(this.codeEditor);
		
		Ext.apply(this, {
			title: this.title || 'Untitled',
			height: '100%',
			iconCls: 'icon-doc-' + this.config.fileType,
			closable: true,
			border: false,
			autoDestroy: true,
			items: aItems,
			listeners: {
				tabchange: function(editor, newCard, oldCard, opts) {
					if(newCard.itemId == 'code') {
						if(this.htmlEditor) {
							var sHtml = XrEditor.Html.xhtmlFormat(this.htmlEditor.getHtml());
							this.codeEditor.setCode(sHtml);
						}
					} else {
						this.htmlEditor.setHtml(this.codeEditor.getCode());
						//this.htmlEditor.initListeners();
					}
				},
				activate: function(editor, opts) {
					XrEditor.Global.currentEditor = editor;
				},
				deactivate: function(editor, opts) {
					XrEditor.Global.currentEditor = null;
				},
				remove: function(editor, opts) {
					XrEditor.Global.currentEditor = null;
				}
			}
		});
		this.callParent(arguments);
	},
	afterrender: function() {
		editorFrame.doLayout();
	},
	/**
	 * get editor's contents
	 */
	getContents: function() {
		var activeTab = this.getActiveTab();
		if(activeTab.itemId == 'code') {
			return this.codeEditor.getCode();
		} else {
			return this.htmlEditor.getHtml();
		}
	}
});
