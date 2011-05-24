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
	extend: 'Ext.tab.Panel',
	alias: 'widget.xrinspector',
	
	//title: 'Inspector',
	//cls: 'editor',
	autoScroll: true,
	border: false,

	initComponent: function(){
		Ext.apply(this, {
			dockedItems: [this.createToolbar()],
			height: '100%',
			html: 'not ready'
		});
		this.callParent(arguments);
	},
	/**
	 * Create the top toolbar
	 * @private
	 * @return {Ext.toolbar.Toolbar} toolbar
	 */
	createToolbar: function(){
		var config = {
			items: ['->', {
				//scope: this,
				handler: this.showHelp,
				text: 'Help',
				iconCls: 'icon-help'
			}]
		};
		return Ext.create('widget.toolbar', config);
	},
	showHelp: function() {
		XrEditor.Util.showMsg('show Help', 'INFO', 'メッセージ');
	}
});
