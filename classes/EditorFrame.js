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
			nodeId: '',
			code: '<h1>Hello World!</h1><p>To insert image, just double click on it!</p>',
			fileType: 'html'
		});
		editor.setTitle('*scratch*');
		Ext.apply(this, {
			dockedItems: [this._createToolbar()],
			height: '100%',
			border: true,
			items: [editor],
			listeners: {
				tabchange: function(frame, newEditor, oldEditor, opts) {
					var bDisable = (newEditor.config.nodeId == '');
					Ext.getCmp('tb-save-one').setDisabled(bDisable);
					Ext.getCmp('tb-save-all').setDisabled(bDisable);
				}
			}
		});
		this.callParent(arguments);
	},

	/**
	 * Create the top toolbar
	 */
	_createToolbar: function() {
		var me = this;
		var config = {
			items: [{
				id: 'tb-save-one',
				text: _('save'),
				iconCls: 'icon-save',
				disabled: true,
				handler: function() {
					me.save(XrEditor.Global.currentEditor);
				}
			}, {
				id: 'tb-save-all',
				text: _('save all'),
				iconCls: 'icon-saveall',
				disabled: true,
				handler: function() {
					me.items.each(function(editor, index, length) {
						me.save(editor);
					});
				}
			}, '->', {
				handler: this.showHelp,
				text: _('about xreditor'),
				iconCls: 'icon-help'
			}]
		};
		return Ext.create('widget.toolbar', config);
	},

	/**
	 * save document
	 */
	save: function(editor) {
		if(!editor || editor.config.nodeId == '') return;
		Ext.Ajax.request({
			url: XrEditor.Global.urls.FILE_UTILITY,
			//method: 'GET',
			params: {
				action: 'save',
				node: editor.config.nodeId,
				contents: editor.getContents()
			},
			success: function(response){
				var data = Ext.decode(response.responseText);
				if(data.error) {
					XrEditor.Util.popupMsg(data.error, _('error'), 'ERROR');
					return;
				}
				XrEditor.Util.slideMsg(editor.config.nodeId + '<br />' + _('has been saved'), _('save'));
			}
		});
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
