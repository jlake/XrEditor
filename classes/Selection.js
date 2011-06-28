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
	constructor: function(config) {
		this.initConfig(config);
		return this;
	},
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
	outerHTML: function(node){
		return node.outerHTML || (
			function(n){
				var div = document.createElement('div'), h;
				div.appendChild( n.cloneNode(true) );
				h = div.innerHTML;
				div = null;
				return h;
			})(node);
	},
	_hrImpl: function(mValue) {
		/*
		if(Ext.isIE){
			return this.insertHtml('<hr />');
		}
		return this.config.doc.execCommand("inserthorizontalrule", false, mValue);
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
				minValue: 1,
				maxValue: 125
			});
			var widthField = Ext.create('Ext.form.NumberField', {
				fieldLabel: 'Width',
				name: 'width',
				value: '100',
				minValue: 1,
				maxValue: 125
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
				bodyStyle: 'padding:10px',
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
						var sAttr = '';
						var values = formPanel.getValues();
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
	_linkImpl: function(mValue) {
		var me = this;
		var win;
		//var key = arguments.callee.name;
		var key = '_link';
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
				bodyStyle: 'padding:10px',
				labelWidth: 100,
				autoScroll: true,
				bodyBorder: false,
				collapsible: false,
				defaults: {width: 300, listWidth:300},
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
						var sAttr = '';
						var values = formPanel.getValues();
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
					text: _('cancel'),
					handler: function(){
						win.hide()
					}
				}],
				listeners: {
					show: function() {
						hrefField.setValue('http://');
						titleField.setValue('');
						targetField.setValue('');
					}
				}
			});
			XrEditor.Global.winCache[key] = win;
		}
		win.show();
	},
	_insertimageImpl: function(mValue) {
		var me = this;
		var win;
		//var key = arguments.callee.name;
		var key = '_insertimage';
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
				bodyStyle: 'padding:10px',
				labelWidth: 100,
				autoScroll: true,
				bodyBorder: false,
				collapsible: false,
				defaults: {width: 300, listWidth:300},
				items: [
					srcField,
					titleField
				]
			});
			win = new Ext.Window({
				title: _('insertimage'),
				width: 350,
				height: 200,
				layout: 'fit',
				closeAction: 'hide',
				buttonAlign:'center',
				items: formPanel,
				buttons: [{
					text: _('ok'),
					handler: function(){
						var sAttr = '';
						var values = formPanel.getValues();
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
					text: _('cancel'),
					handler: function(){
						win.hide()
					}
				}],
				listeners: {
					show: function() {
						srcField.setValue('http://');
						titleField.setValue('');
					}
				}
			});
			XrEditor.Global.winCache[key] = win;
		}
		win.show();
	}
});
