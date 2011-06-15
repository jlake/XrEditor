/**
 * @class XrEditor.SnippetBrowser
 * @extends Ext.panel.Panel
 *
 * Copyright(c) 2011 Jlake Ou (ouzhiwei@gmail.com)
 */
Ext.define('XrEditor.SnippetBrowser', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.xrimagebrowser',

	title: 'Snippets',

	initComponent: function(){
		Ext.apply(this, {
			border: false,
			height: '100%',
			html: 'not ready'
		});
		this.callParent(arguments);
	}
});
