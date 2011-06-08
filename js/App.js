/*!
 * ZepEditor 1.0
 * Copyright(c) 2011 Jlake Ou
 */
Ext.define('XrEditor.App', {
    extend: 'Ext.container.Viewport',

    //uses: ['XrEditor.Html'],
	
	title: 'XrEditor Application',

	initComponent: function() {
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
				items: new XrEditor.FileBrowser
			},{
				region: 'center',
				layout: 'border',
				//border: false,
				items: [{
					region: 'center',
					border: false,
					items: new XrEditor.EditorFrame
				},{
					region: 'south',
					//collapsible: true,
					split: true,
					height: 100,
					items: new XrEditor.Inspector
				}]
			},{
				region: 'east',
				title: 'Toolbox',
				collapsible: true,
				floatable: true,
				split: true,
				width: 250,
				items: new XrEditor.Toolbox
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
