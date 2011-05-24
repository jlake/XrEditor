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
			defaults: {
				split: true
			},
			items: [{
				region: 'north',
				collapsible: true,
				title: 'North',
				split: true,
				height: 100,
				html: 'north panel'
			},{
				region: 'west',
				collapsible: true,
				title: 'Starts at width 30%',
				split: true,
				width: '30%',
				html: 'west panel'
			},{
				region: 'center',
				//layout: 'border',
				//border: false,
				html: 'center panel'
			},{
				region: 'east',
				collapsible: true,
				floatable: true,
				split: true,
				width: 200,
				title: 'East',
				html: 'east panel'
			},{
				region: 'south',
				collapsible: true,
				split: true,
				height: 200,
				title: 'South',
				html: 'south panel'
			}],
			listeners: {
				render: function() {
					//alert("Hello");
					XrEditor.Html.sayHello();
				}
			}
		});
		this.callParent(arguments);
	}
});
