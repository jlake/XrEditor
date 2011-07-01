/**
 * @class XrEditor.Selection
 * @extends Ext.panel.TabPanel
 *
 * Copyright(c) 2011 Jlake Ou (ouzhiwei@gmail.com)
 */
Ext.define('XrEditor.Selection', {
	type: '',
	range: null,
	text: '',
	config: {
		doc: {},
		win: {}
	},
	/**
	 * Constructor
	 */
	constructor: function(config) {
		this.initConfig(config);
		return this;
	},
	/**
	 * save selection
	 */
	saveSelection: function() {
		if(!this.doc) return;
		if (this.config.win.getSelection) {
			var sel = this.config.win.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				this.range = sel.getRangeAt(0);
			}
		} else if (this.config.doc.selection && this.config.doc.selection.createRange) {
			this.range = this.config.doc.selection.createRange();
		} else {
			this.range = null;
		}
	},
	/**
	 * restore selection
	 */
	restoreSelection: function() {
		if (!this.range) return;
		if (this.config.win.getSelection) {
			var sel = this.config.win.getSelection();
			sel.removeAllRanges();
			sel.addRange(this.range);
		} else if (this.config.doc.selection && this.range.select) {
			this.range.select();
		}
	},
	/**
	 * insert html at current selection
	 */
	insertHtml: function(sHtml) {
		if(!this.range) return;
		if(Ext.isIE) {
			if(this.range.item) {
				this.range.item(0).outerHTML = sHtml;
			} else {
				this.range.select();
				this.range.pasteHTML(sHtml);
				this.range.collapse(false);
			}
		} else {
			if(Ext.isWebkit && document.queryCommandEnabled('InsertHTML')) {
				//this.restoreSelection();
				this.config.doc.execCommand('InsertHTML', false, sHtml);
			} else {
				this.range.deleteContents();
				this.range.insertNode(this.range.createContextualFragment(sHtml));
				this.range.collapse(false);
			}
		}
	},
	/**
	 * execute editor command
	 */
	execCommand: function(sCmd, mValue) {
		//console.log('execCommand', sCmd, mValue);
		if(!this.range) return;
		//this.restoreSelection();
		var retValue;
		var implFunc = "_" + sCmd + "Impl";
		if(this[implFunc]){
			retValue = this[implFunc](mValue);
		} else {
			if(this.range.execCommand) {
				try {
					this.range.select();
					retValue = this.range.execCommand(sCmd, false, mValue);
				} catch(ex) {
				}
			} else {
				retValue = this.doc.execCommand(sCmd, false, mValue);
			}
		}
		return retValue
	},
	/**
	 * find parent node
	 */
	findParentNode: function(tagName, node) {
		while (node.tagName != "HTML") {
			if (node.tagName == tagName){
				return node;
			}
			node = node.parentNode;
		}
		return null;
	},
	/**
	 * get node's outter html 
	 */
	outerHTML: function(node){
		return node.outerHTML || (
			function(n){
				var div = document.createElement('div'), h;
				div.appendChild( n.cloneNode(true) );
				h = div.innerHTML;
				Ext.get(div).remove();
				div = null;
				return h;
			})(node);
	},
	/**
	 * implement command 'inserthtml'
	 */
	_inserthtmlImpl: function(sHtml) {
		return this.insertHtml(sHtml);
	},
	/**
	 * implement command 'hr'
	 */
	_hrImpl: function() {
		/*
		if(Ext.isIE){
			return this.insertHtml('<hr />');
		}
		return this.config.doc.execCommand("inserthorizontalrule", false);
		*/
		var me = this;
		var win;
		//var key = arguments.callee.name;
		var key = '_hr';
		if(XrEditor.Global.winCache[key]) {
			win = XrEditor.Global.winCache[key];
		} else {
			var sizeField = Ext.create('Ext.form.NumberField', {
				fieldLabel: 'Size',
				name: 'size',
				//hideTrigger: true,
				value: '',
				minValue: 1
			});
			var widthField = Ext.create('Ext.form.NumberField', {
				fieldLabel: 'Width',
				name: 'width',
				value: '100',
				minValue: 1
			});
			var colorField = Ext.create('Ext.ux.form.ColorField', {
				fieldLabel: 'Color',
				name: 'color',
				value: ''
			});
			var alignField = Ext.create('Ext.form.ComboBox', {
				fieldLabel: 'Align',
				name: 'align',
				store: Ext.create('Ext.data.Store', {
					fields: ['value', 'text'],
					data: [
						{value: '', text: 'None'},
						{value: 'left', text: 'Left'},
						{value: 'center', text: 'Center'},
						{value: 'right', text: 'Right'}
					]
				}),
				valueField: 'value',
				displayField: 'text',
				mode: 'local',
				triggerAction: 'all',
				emptyText: '',
				editable: false
				//width: 70
			});
			var formPanel = new Ext.form.FormPanel({
				frame: true,
				width: '100%',
				height: '100%',
				bodyPadding: 10,
				labelWidth: 100,
				autoScroll: true,
				bodyBorder: false,
				collapsible: false,
				//defaults: {width: 70, listWidth:180},
				items: [
					sizeField,
					widthField,
					colorField,
					alignField
				]
			});
			win = new Ext.Window({
				title: _('hr'),
				width: 350,
				height: 210,
				layout: 'fit',
				closeAction: 'hide',
				buttonAlign:'center',
				items: formPanel,
				buttons: [{
					text: _('ok'),
					handler: function(){
						var values = formPanel.getValues();
						var sAttr = '';
						for(name in values) {
							if(values[name]) {
								if(name == 'width') values[name] += '%';
								sAttr += ' ' + name +'="' + values[name] + '"';
							}
						}
						var sHtml = '<hr' + sAttr + '/>';
						me.insertHtml(sHtml);
						win.hide();
					}
				},{
					text: _('cancel'),
					handler: function(){
						win.hide()
					}
				}],
				listeners: {
					show: function() {
						sizeField.setValue('');
						widthField.setValue('100');
						colorField.setValue('');
						alignField.setValue('');
					}
				}
			});
			XrEditor.Global.winCache[key] = win;
		}
		win.show();
	},
	/**
	 * implement command 'createlink'
	 */
	_createlinkImpl: function() {
		var me = this;
		var win;
		//var key = arguments.callee.name;
		var key = '_createlink';
		if(XrEditor.Global.winCache[key]) {
			win = XrEditor.Global.winCache[key];
		} else {
			var hrefField = Ext.create('Ext.form.TextField', {
				fieldLabel: 'Link URL',
				name: 'href',
				//hideTrigger: true,
				value: 'http://'
			});
			var titleField = Ext.create('Ext.form.TextField', {
				fieldLabel: 'Title',
				name: 'title',
				value: ''
			});
			var targetField = Ext.create('Ext.form.ComboBox', {
				fieldLabel: 'Target',
				name: 'target',
				store: Ext.create('Ext.data.Store', {
					fields: ['value', 'text'],
					data: [
						{value: '', text: _('default')},
						{value: '_blank', text: _('new window')},
						{value: '_self', text: _('current frame(window)')},
						{value: '_parent', text: _('parrent frame')},
						{value: '_top', text: _('top window')}
					]
				}),
				valueField: 'value',
				displayField: 'text',
				mode: 'local',
				triggerAction: 'all',
				emptyText: '',
				editable: false
			});
			var formPanel = new Ext.form.FormPanel({
				frame: true,
				width: '100%',
				height: '100%',
				bodyPadding: 10,
				autoScroll: true,
				bodyBorder: false,
				collapsible: false,
				fieldDefaults: {
					labelAlign: 'right',
					labelWidth: 70,
					width: 300,
					msgTarget: 'qtip'
				},
				items: [
					hrefField,
					titleField,
					targetField
				]
			});
			win = new Ext.Window({
				title: _('link'),
				width: 350,
				height: 200,
				layout: 'fit',
				closeAction: 'hide',
				buttonAlign:'center',
				items: formPanel,
				buttons: [{
					text: _('ok'),
					handler: function(){
						var values = formPanel.getValues();
						var sAttr = '';
						for(name in values) {
							if(values[name]) {
								sAttr += ' ' + name +'="' + values[name] + '"';
							}
						}
						var node = me.range.cloneContents();
						var sHtml = '<a' + sAttr + '>' + me.outerHTML(node).replace(/<\/*a[^>]*>/gi, '') + '</a>';
						me.insertHtml(sHtml);
						win.hide();
					}
				},{
					text: _('reset'),
					handler: function(){
						formPanel.getForm().reset()
						hrefField.setValue('http://');
					}
				},{
					text: _('cancel'),
					handler: function(){
						win.hide()
					}
				}]
			});
			XrEditor.Global.winCache[key] = win;
		}
		win.show();
	},
	/**
	 * implement command 'insertimg'
	 */
	_insertimgImpl: function() {
		var me = this;
		var win;
		//var key = arguments.callee.name;
		var key = '_insertimg';
		if(XrEditor.Global.winCache[key]) {
			win = XrEditor.Global.winCache[key];
		} else {
			var srcField = Ext.create('Ext.form.TextField', {
				fieldLabel: 'Image URL',
				name: 'src',
				//hideTrigger: true,
				value: 'http://'
			});
			var titleField = Ext.create('Ext.form.TextField', {
				fieldLabel: 'Title',
				name: 'title',
				value: ''
			});
			var formPanel = new Ext.form.FormPanel({
				frame: true,
				width: '100%',
				height: '100%',
				bodyPadding: 10,
				autoScroll: true,
				bodyBorder: false,
				collapsible: false,
				fieldDefaults: {
					labelAlign: 'right',
					labelWidth: 70,
					width: 300,
					msgTarget: 'qtip'
				},
				items: [
					srcField,
					titleField
				]
			});
			win = new Ext.Window({
				title: _('insertimg'),
				width: 350,
				height: 200,
				layout: 'fit',
				closeAction: 'hide',
				buttonAlign:'center',
				items: formPanel,
				buttons: [{
					text: _('ok'),
					handler: function(){
						var values = formPanel.getValues();
						var sAttr = '';
						for(name in values) {
							if(values[name]) {
								sAttr += ' ' + name +'="' + values[name] + '"';
							}
						}
						var node = me.range.cloneContents();
						var sHtml = '<img' + sAttr + ' />';
						me.insertHtml(sHtml);
						win.hide();
					}
				},{
					text: _('reset'),
					handler: function(){
						formPanel.getForm().reset()
						srcField.setValue('http://');
					}
				},{
					text: _('cancel'),
					handler: function(){
						win.hide()
					}
				}]
			});
			XrEditor.Global.winCache[key] = win;
		}
		win.show();
	},
	/**
	 * implement command 'createlink'
	 */
	_insertblockImpl: function(el) {
		var me = this;
		me.targetEl = el;
		var win;
		//var key = arguments.callee.name;
		var key = '_insertblock';
		if(XrEditor.Global.winCache[key]) {
			win = XrEditor.Global.winCache[key];
		} else {
			var positionField = Ext.create('Ext.form.FieldContainer', {
				fieldLabel : _('position'),
				defaultType: 'radiofield',
				defaults: {
					flex: 1,
				},
				layout: 'hbox',
				fieldDefaults: {
					hideLabel: true,
					width: 70,
					msgTarget: 'qtip'
				},
				items: [{
					boxLabel: _('above'),
					name: 'position',
					checked: true,
					inputValue: 'a'
				}, {
					boxLabel: _('below'),
					name: 'position',
					inputValue: 'b',
				}]
			});
			var tagField = Ext.create('Ext.form.ComboBox', {
				fieldLabel: _('tag'),
				name: 'tag',
				width: 150,
				listWidth: 150,
				store: Ext.create('Ext.data.Store', {
					fields: ['value', 'text'],
					data: [
						{value: 'div', text: 'div'},
						{value: 'p', text: 'p'},
						{value: 'form', text: 'form'},
						{value: 'ul', text: 'ul'},
						{value: 'ol', text: 'ol'},
						{value: 'dl', text: 'dl'}
					]
				}),
				valueField: 'value',
				displayField: 'text',
				mode: 'local',
				triggerAction: 'all',
				emptyText: '',
				editable: false,
				value: 'div'
			});
			var formPanel = new Ext.form.FormPanel({
				frame: true,
				width: '100%',
				height: '100%',
				bodyPadding: 10,
				autoScroll: true,
				bodyBorder: false,
				collapsible: false,
				fieldDefaults: {
					labelAlign: 'right',
					labelWidth: 70,
					msgTarget: 'qtip'
				},
				items: [
					positionField,
					tagField,
				]
			});
			win = new Ext.Window({
				title: _('insert block'),
				width: 350,
				height: 200,
				layout: 'fit',
				closeAction: 'hide',
				buttonAlign: 'center',
				items: formPanel,
				buttons: [{
					text: _('ok'),
					handler: function(){
						var values = formPanel.getValues();
						if(!values.tag) return;
						var sText = 'some text';
						if(values.tag == 'ul' || values.tag == 'ol') {
							sText = '<li>item 1</li>';
						} else if(values.tag == 'dl') {
							sText = '<dt>title 1</dt><dd>detail 1</dd>';
						}
						var sHtml = '<' + values.tag + '>' + sText + '</' + values.tag + '>';
						if(values.position == 'b') {
							Ext.core.DomHelper.insertAfter(me.targetEl, sHtml);
						} else {
							Ext.core.DomHelper.insertBefore(me.targetEl, sHtml);
						}
						win.hide();
					}
				},{
					text: _('reset'),
					handler: function(){
						formPanel.getForm().reset()
					}
				},{
					text: _('cancel'),
					handler: function(){
						win.hide()
					}
				}]
			});
			XrEditor.Global.winCache[key] = win;
		}
		win.show();
	},
	/**
	 * implement command 'inserttable'
	 */
	_inserttableImpl: function() {
		var me = this;
		var win;
		//var key = arguments.callee.name;
		var key = '_inserttable';
		if(XrEditor.Global.winCache[key]) {
			win = XrEditor.Global.winCache[key];
		} else {
			var fieldGroup1 = Ext.create('Ext.form.FieldContainer', {
				defaults: {
					flex: 0,
					labelAlign: 'right',
					labelWidth: 70,
					width: 140,
					msgTarget: 'qtip'
				},
				layout: 'hbox',
				items: [{
					xtype: 'numberfield',
					fieldLabel: _('rows'),
					name: 'rows',
					value: '2',
					minValue: 1
				}, {
					xtype: 'numberfield',
					fieldLabel: _('columns'),
					name: 'columns',
					value: '2',
					minValue: 1
				}]
			});
			var fieldGroup2 = Ext.create('Ext.form.FieldContainer', {
				defaults: {
					flex: 0,
					labelAlign: 'right',
					labelWidth: 70,
					msgTarget: 'qtip'
				},
				layout: 'hbox',
				items: [{
					xtype: 'numberfield',
					fieldLabel: _('border'),
					name: 'border',
					value: '',
					width: 140
				}, {
					xtype: 'label',
					width: 40,
					text: 'px'
				}]
			});
			var fieldGroup3 = Ext.create('Ext.form.FieldContainer', {
				defaults: {
					flex: 0,
					labelAlign: 'right',
					labelWidth: 70,
					msgTarget: 'qtip'
				},
				layout: 'hbox',
				items: [{
					xtype: 'numberfield',
					fieldLabel: _('width'),
					name: 'width',
					width: 140,
					value: ''
				}, {
					hideLabel: true,
					xtype: 'combo',
					name: 'width_unit',
					width: 50,
					listWidth: 50,
					store: Ext.create('Ext.data.Store', {
						fields: ['value', 'text'],
						data: [
							{value: '%', text: '%'},
							{value: 'px', text: 'px'},
						]
					}),
					valueField: 'value',
					displayField: 'text',
					mode: 'local',
					triggerAction: 'all',
					emptyText: '',
					editable: false,
					value: '%'
				}]
			});
			var formPanel = new Ext.form.FormPanel({
				frame: true,
				width: '100%',
				height: '100%',
				bodyPadding: 10,
				autoScroll: true,
				bodyBorder: false,
				collapsible: false,
				items: [
					fieldGroup1,
					fieldGroup2,
					fieldGroup3
				]
			});
			win = new Ext.Window({
				title: _('insert table'),
				width: 350,
				height: 200,
				layout: 'fit',
				closeAction: 'hide',
				buttonAlign: 'center',
				items: formPanel,
				buttons: [{
					text: _('ok'),
					handler: function(){
						var values = formPanel.getValues();
						//console.log(values);
						var sAttr = '';
						if(values.border) {
							sAttr += ' border="' + values.border + '"';
						}
						if(values.width) {
							sAttr += ' width="' + values.width + values.width_unit + '"';
						}
						if(values.rows > 0 && values.columns > 0) {
							var sHtml = '<table' + sAttr + '>\n';
							for(var i=0; i<values.rows; i++) {
								sHtml += '<tr>\n';
								for(var j=0; j<values.columns; j++) {
									sHtml += '<td>&nbsp;</td>\n';
								}
								sHtml += '</tr>\n';
							}
							sHtml += '</table>';
							me.insertHtml(sHtml);
						}
						win.hide();
					}
				},{
					text: _('reset'),
					handler: function(){
						formPanel.getForm().reset()
					}
				},{
					text: _('cancel'),
					handler: function(){
						win.hide()
					}
				}]
			});
			XrEditor.Global.winCache[key] = win;
		}
		win.show();
	}
});
