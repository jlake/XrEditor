/**
 * @class XrEditor.Toolbox
 * @extends Ext.tree.TabPanel
 *
 * Copyright(c) 2011 Jlake Ou (ouzhiwei@gmail.com)
 */
Ext.define('XrEditor.Toolbox', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.xrtoolbox',
	//title: 'Fire Browser',
	imageBrowser: null,
	snippetBrowser: null,
	initComponent: function(){
		this.imageBrowser = new XrEditor.ImageBrowser();
		this.snippetBrowser = new XrEditor.SnippetBrowser();
		Ext.apply(this, {
			border: false,
			items: [this.imageBrowser, this.snippetBrowser]
		});
		this.callParent(arguments);
	}
});
