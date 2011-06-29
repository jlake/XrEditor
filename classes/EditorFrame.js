/**
 * @class XrEditor.EditorFrame
 * @extends Ext.panel.TabPanel
 *
 * Copyright(c) 2011 Jlake Ou (ouzhiwei@gmail.com)
 */
Ext.define('XrEditor.EditorFrame', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.xreditorframe',
	
	//title: 'Editor Frame',

	initComponent: function() {
		var editor = new XrEditor.Editor({
			nodeId: '_blank',
			code: '<h1>Hello World!</h1>To insert image, just double click on it!',
			fileType: 'html'
		});
		Ext.apply(this, {
			dockedItems: [this._createToolbar()],
			height: '100%',
			border: true,
			items: [editor]
		});
		this.callParent(arguments);
	},
	/**
	 * Create the top toolbar
	 */
	_createToolbar: function() {
		var config = {
			items: [{
				handler: this.saveOne,
				text: _('save'),
				iconCls: 'icon-save'
			}, {
				handler: this.saveAll,
				text: _('save all'),
				iconCls: 'icon-saveall'
			}, '->', {
				handler: this.showHelp,
				text: _('about xreditor'),
				iconCls: 'icon-help'
			}]
		};
		return Ext.create('widget.toolbar', config);
	},

	/**
	 * save current document
	 */
	saveOne: function() {
		XrEditor.Util.slideMsg(_('save one'));
	},
	/**
	 * save all documents
	 */
	saveAll: function() {
		XrEditor.Util.slideMsg(_('save all'));
	},
	/**
	 * show help message
	 */
	showHelp: function() {
		var sHtml = '<b>XrEditor ' + _('version {0}', [XrEditor.Global.version]) + '</b>'
			+ '<br /><small>Copyright &copy; 2011 Jlake Ou</small>';
		XrEditor.Util.popupMsg(sHtml, _('about'));
	}
});
