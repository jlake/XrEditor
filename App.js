/*!
 * A sample application for XrEditor
 * Copyright(c) 2011 Jlake Ou
 *
 * Copyright(c) 2011 Jlake Ou (ouzhiwei@gmail.com)
 */
Ext.Loader.setConfig({
	enabled: true,
	paths: {
		XrEditor: 'classes',
		'Ext.ux.DataView': 'ux/DataView'
	}
});

Ext.require([
	'XrEditor.Global',
	'XrEditor.Util',
	'XrEditor.FileBrowser',
	'XrEditor.EditorFrame',
	'XrEditor.Editor',
	'XrEditor.HtmlEditor',
	'XrEditor.CodeEditor',
	'XrEditor.Selection',
	'XrEditor.Html',
	//'XrEditor.Inspector',
	'XrEditor.ImageBrowser',
	'XrEditor.SnippetBrowser',
	'XrEditor.Toolbox'
]);

Ext.define('XrEditor.App', {
	extend: 'Ext.container.Viewport',
	title: 'XrEditor Application',
	initComponent: function() {
		var me = this;
		var editorFrame = new XrEditor.EditorFrame();
		var fileBrowser = new XrEditor.FileBrowser();
		fileBrowser.setEditorFrame(editorFrame);
		var toolbox = new XrEditor.Toolbox();
		Ext.apply(this, {
			id: 'app-viewport',
			layout: {
				type: 'border',
				padding: 5
			},
			items: [{
				region: 'north',
				split: true,
				height: 50,
				bodyStyle: 'padding: 5px;',
				html: '<h1>XrEditor</h1>'
			},{
				region: 'west',
				title: 'File browser',
				collapsible: true,
				split: true,
				width: 280,
				minWidth: 150,
				maxWidth: 600,
				items: fileBrowser
			},{
				xtype: 'container',
				region: 'center',
				items: editorFrame,
				listeners: {
					resize: function() {
						me.doLayout();
						editorFrame.doLayout();
						//toolbox.doLayout();
					}
				}
			},{
				region: 'east',
				title: 'Toolbox',
				collapsible: true,
				floatable: true,
				split: true,
				width: 310,
				minWidth: 150,
				maxWidth: 600,
				items: toolbox
			}]
		});
		this.callParent(arguments);
	}
});

Ext.onReady(function(){
	Ext.tip.QuickTipManager.init();
	Ext.Ajax.timeout = 60000;
	Ext.create('XrEditor.App');
});
