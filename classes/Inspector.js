/**
 * @class XrEditor.Inspector
 * @extends Ext.tab.Panel
 *
 * define Inspector class
 *
 * @Inspector
 * 
 * @param {Object} config The config object
 * @author ouzhiwei@gmail.com (Jlake Ou)
 */
Ext.define('XrEditor.Inspector', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.xrinspector',
	
	//title: 'Inspector',
	//cls: 'editor',
	autoScroll: true,
	border: false,

	title: 'Inspector',

	initComponent: function(){
		Ext.apply(this, {
			height: '100%',
			html: 'not ready'
		});
		this.callParent(arguments);
	},
});
