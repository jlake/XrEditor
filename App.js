/*!
 * ZepEditor 1.0
 * Copyright(c) 2011 Jlake Ou
 */
Ext.define('XrEditor.App', {
	extend: 'Ext.container.Viewport',
	title: 'XrEditor Application',
	initComponent: function() {
		var editorFrame = new XrEditor.EditorFrame();
		var fileBrowser = new XrEditor.FileBrowser();
		fileBrowser.setEditorFrame(editorFrame);
		var inspector = new XrEditor.Inspector();
		var toolbox = new XrEditor.Toolbox();
		Ext.apply(this, {
			id: 'app-viewport',
			layout: {
				type: 'border',
				padding: 5
			},
			items: [{
				region: 'north',
				//title: 'North',
				//collapsible: true,
				split: true,
				height: 50,
				html: '<h1>XrEditor</h1>'
			},{
				region: 'west',
				title: 'File browser',
				collapsible: true,
				split: true,
				width: '25%',
				items: fileBrowser
			},{
				region: 'center',
				layout: 'border',
				//border: false,
				items: [{
					region: 'center',
					border: false,
					items: editorFrame
				},{
					region: 'south',
					//collapsible: true,
					split: true,
					height: 100,
					items: inspector
				}]
			},{
				region: 'east',
				title: 'Toolbox',
				collapsible: true,
				floatable: true,
				split: true,
				width: 250,
				items: toolbox
			}],
			listeners: {
				render: function() {
					//XrEditor.Html.sayHello();
				}
			}
		});
		this.callParent(arguments);
	}
});
