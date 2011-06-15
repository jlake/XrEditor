/**
 * @class XrEditor.Inspector
 * @extends Ext.tab.Panel
 *
 * Copyright(c) 2011 Jlake Ou (ouzhiwei@gmail.com)
 */
Ext.define('XrEditor.Inspector', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.xrinspector',
	
	title: 'Inspector',

	initComponent: function(){
		Ext.apply(this, {
			height: '100%',
			border: false,
			bodyStyle: 'background:#cff;',
			html: 'not ready'
		});
		this.callParent(arguments);
	}
});
