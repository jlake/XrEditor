/**
 * @class XrEditor.Inspector
 * @extends Ext.tab.Panel
 *
 * define Inspector class
 *
 * @author ouzhiwei@gmail.com (Jlake Ou)
 */
Ext.define('XrEditor.Inspector', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.xrinspector',
	
	autoScroll: true,
	border: false,

	title: 'Inspector',

	initComponent: function(){
		Ext.apply(this, {
			height: '100%',
			bodyStyle: 'background:#cff;',
			html: 'not ready'
		});
		this.callParent(arguments);
	}
});
