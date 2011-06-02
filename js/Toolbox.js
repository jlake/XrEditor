/**
 * @class XrEditor.Toolbox
 * @extends Ext.tree.TabPanel
 *
 * define Toolbox class
 *
 * @Toolbox
 * 
 * @param {Object} config The config object
 * @author ouzhiwei@gmail.com (Jlake Ou)
 */
Ext.define('XrEditor.Toolbox', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.xrtoolbox',
	autoScroll: true,
	border: true,
	//title: 'Fire Browser',
	initComponent: function(){
		Ext.apply(this, {
			items: [{
				title: 'Resources',
				html: 'not ready'
			}, {
				title: 'Snippets',
				html: 'not ready'
			}]
		});
		this.callParent(arguments);
	}
});
