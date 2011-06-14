/**
 * @class XrEditor.EditorFrame
 * @extends Ext.panel.TabPanel
 *
 * define EditorFrame class
 *
 * @EditorFrame
 * 
 * @param {Object} config The config object
 * @author ouzhiwei@gmail.com (Jlake Ou)
 */
Ext.define('XrEditor.EditorFrame', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.xreditorframe',
	
	title: 'Editor Frame Panel',
	//cls: 'editor',
	autoScroll: true,
	border: false,

	initComponent: function(){
		/*
		var sHtml = '<div>div tag test</div>'
			+ '<p>p tag test</p>'
			+ '<form>form tag test</form>'
			+ '<table width="100%"><tr><td>r1 c1</td><td>r1 c2</td></tr><tr><td>r2 c1</td><td>r2 c2</td></tr></table>'
			+ '<ol><li>item 1</li><li>item 2</li><li>item 3</li></ol>'
			+ '<ul><li>item 1</li><li>item 2</li><li>item 3</li></ul>'
			+ '<dl><dt>title 1</dt><dd>datail 1</dd><dt>title 2</dt><dd>datail 2</dd></dl>'
			;
		var defaultEditor = new XrEditor.Editor({
			node: '',
			code: sHtml
		});
		*/
		Ext.apply(this, {
			dockedItems: [this._createToolbar()],
			height: '100%',
			items: []
		});
		this.callParent(arguments);
	},
	/**
	 * Create the top toolbar
	 */
	_createToolbar: function() {
		var config = {
			items: [{
				//scope: this,
				handler: this.saveOne,
				text: 'save',
				iconCls: 'icon-save'
			}, {
				//scope: this,
				handler: this.saveAll,
				text: 'save all',
				iconCls: 'icon-saveall'
			}, '->', {
				//scope: this,
				handler: this.showHelp,
				text: 'Help',
				iconCls: 'icon-help'
			}]
		};
		return Ext.create('widget.toolbar', config);
	},
	/**
	 * Navigate to the active post in a new window
	 */
	saveOne: function() {
		XrEditor.Util.slideMsg('save one', 'Editor');
	},
	/**
	 * Open the post in a new tab
	 */
	saveAll: function() {
		XrEditor.Util.slideMsg('save all', 'Editor');
	},
	/**
	 * Open the post in a new tab
	 */
	showHelp: function() {
		XrEditor.Util.popupMsg('XrEditor', 'メッセージ');
	}
});
