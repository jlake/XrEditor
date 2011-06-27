/*

This file is an extension for Ext JS 4

Copyright (c) 2011 Jlake Ou

Contact:  ouzhiwei@gmail.com
*/
Ext.define('Ext.ux.form.ColorField', {
	extend: 'Ext.form.field.Trigger',

	alias: 'widget.colorfield',

	/**
	 * @cfg {String} invalidText
	 * The error to display when the color in the field is invalid (defaults to
	 * '{value} is not a valid color - it must be in the format {format}').
	 */
	invalidText : "'{0}' is not a valid color - it must be in a the hex format (# followed by 3 or 6 letters/numbers 0-9 A-F)",
	/**
	 * @cfg {String} triggerClass
	 * An additional CSS class used to style the trigger button.  The trigger will always get the
	 * class 'x-form-trigger' and triggerClass will be <b>appended</b> if specified (defaults to 'x-form-color-trigger'
	 * which displays a color wheel icon).
	 */
	triggerCls : 'x-form-color-trigger',
	/**
	 * @cfg {String/Object} autoCreate
	 * A DomHelper element spec, or true for a default element spec (defaults to
	 * {tag: "input", type: "text", size: "10", autocomplete: "off"})
	 */

	menu: null,

	// private
	//defaultAutoCreate : {tag: "input", type: "text", size: "10", maxlength: "7", autocomplete: "off"},

	// Limit input to hex values
	maskRe: /[#a-f0-9]/i,
	//regex: /^#([a-f0-9]{3}|[a-f0-9]{6})$/i,

	initComponent: function(){
		this.callParent(arguments);
	},

	// private
	validateValue : function(value){
		//if(!Ext.ux.ColorField.superclass.validateValue.call(this, value)){
		if(this.callParent(this, arguments)) {
			return false;
		}
		if(value.length < 1){ // if it's blank and textfield didn't flag it then it's valid
			 this.setColor('');
			 return true;
		}

		var parseOK = this.parseColor(value);

		if(!value || (parseOK == false)){
			this.markInvalid(String.format(this.invalidText,value));
			return false;
		}
		this.setColor(value);
		return true;
	},

	/**
	 * Sets the current color and changes the background.
	 * Does *not* change the value of the field.
	 * @param {String} hex The color value.
	 */
	setColor: function(color) {
		//console.log('setColor', color);
		if (color=='' || color==undefined){
			if (this.emptyText!='' && this.parseColor(this.emptyText)) {
				color=this.emptyText;
			} else {
				color='transparent';
			}
		}
		if (this.trigger) {
			this.trigger.setStyle( {
				'background-color': color
			});
		} else {
			this.on('render',function(){this.setColor(color)},this);
		}
	},

	// private
	// Provides logic to override the default TriggerField.validateBlur which just returns true
	validateBlur : function() {
		return !this.menu || !this.menu.isVisible();
	},

	/**
	 * Returns the current value of the color field
	 * @return {String} value The color value
	 */
	getValue : function(){
		//return Ext.ux.ColorField.superclass.getValue.call(this) || "";
		return this.callParent(arguments);
	},

	/**
	 * Sets the value of the color field.  You can pass a string that can be parsed into a valid HTML color
	 * <br />Usage:
	 * <pre><code>
		colorField.setValue('#FFFFFF');
	   </code></pre>
	 * @param {String} color The color string
	 */
	setValue : function(color){
		//Ext.ux.ColorField.superclass.setValue.call(this, this.formatColor(color));
		var sColor = this.formatColor(color)
		this.callParent([sColor]);
		this.setColor(sColor);
	},

	// private
	parseColor : function(value){
		return (!value || (value.substring(0,1) != '#')) ?
			false : (value.length==4 || value.length==7 );
	},

	// private
	formatColor : function(value){
		if (!value || this.parseColor(value))
			return value;
		if (value.length==3 || value.length==6) {
			return '#' + value;
		}
		return '';
	},

	// private
	// Implements the default empty TriggerField.onTriggerClick function to display the ColorPalette
	onTriggerClick : function(){
		if(this.disabled){
			return;
		}
		var me = this;
		me.focus();
		if(this.menu == null){
			this.menu = Ext.create('Ext.menu.ColorPicker', {
				field: me,
				handler: function(menu, color) {
					menu.initialConfig.field.setValue(color);
				}
			});
		}
		this.menu.show(this.inputEl, "tl-bl");
	}
});
