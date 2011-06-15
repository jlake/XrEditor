/**
 * @class XrEditor.Resource
 * @extends Ext.tab.Panel
 *
 * define Resource class
 *
 * @Resource
 * 
 * @param {Object} config The config object
 * @author ouzhiwei@gmail.com (Jlake Ou)
 */
Ext.define('XrEditor.Resource', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.xrresource',
	
	autoScroll: true,
	border: false,

	title: 'Resource',

	initComponent: function(){
		Ext.apply(this, {
			height: '100%',
			html: 'not ready'
		});
		this.callParent(arguments);
	}
});
