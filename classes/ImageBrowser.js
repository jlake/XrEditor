/**
 * @class XrEditor.ImageBrowser
 * @extends Ext.tab.Panel
 *
 * Copyright(c) 2011 Jlake Ou (ouzhiwei@gmail.com)
 */
Ext.define('XrEditor.ImageBrowser', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.xrimagebrowser',

	title: 'Images',

	initComponent: function(){
		Ext.apply(this, {
			border: false,
			height: '100%',
			html: 'not ready'
		});
		this.callParent(arguments);
	}
});
