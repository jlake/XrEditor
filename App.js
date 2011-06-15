/*!
 * A sample application for XrEditor
 * Copyright(c) 2011 Jlake Ou
 *
 * Copyright(c) 2011 Jlake Ou (ouzhiwei@gmail.com)
 */
Ext.define('XrEditor.App', {
	extend: 'Ext.container.Viewport',
	title: 'XrEditor Application',
	initComponent: function() {
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
				//collapsible: true,
				split: true,
				height: 50,
				html: '<h1>XrEditor</h1>'
			},{
				region: 'west',
				title: 'File browser',
				collapsible: true,
				split: true,
				width: 280,
				items: fileBrowser
			},{
				xtype: 'container',
				region: 'center',
				items: editorFrame,
				listeners: {
					resize: function() {
						editorFrame.doLayout();
					}
				}
			},{
				region: 'east',
				title: 'Toolbox',
				collapsible: true,
				floatable: true,
				split: true,
				width: 300,
				items: toolbox
			}]
		});
		this.callParent(arguments);
	}
});
