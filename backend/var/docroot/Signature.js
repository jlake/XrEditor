Ext.define('Ext.ux.Signature', {
 
	// new ExtJs 4 method for defining objects
	extend: "Ext.Component",
	alternateClassName : 'Ext.Signature',
 
	// these are the signature configurations
	config: {
		name: '',
		department: '',
		phoneNumbers: [],
		emailAddresses: []
	},
 
	// define our template right here (to allow extensions)
	signatureTpl: [
	'<div class="signature">',
		'<div class="name">{name}</div>',
		'<div class="department">{department}</div>',
		'<ul class="phone">',
			'<tpl for="phoneNumbers">',
			'<li class="number{[xindex === xcount ? " last" : ""]}">{number} ({rel})</li>',
			'</tpl>',
		'</ul>',
		'<ul class="email">',
			'<tpl for="emailAddresses">',
			'<li class="address{[xindex === xcount ? " last" : ""]}"><a href="mailto:{.}">{.}</a></li>',
			'</tpl>',
		'</ul>',
	'</div>'
	],
 
	constructor: function(c){
 
		// call superclass constructor method, this is an Ext.define helper method
		this.callParent(arguments);
 
		// initialize our config from arguments, this is also an Ext.define helper method
		this.initConfig(c);
 
		// (re)load the signature template
		this.reloadTemplate();
 
		return this;
	},
 
	reloadTemplate:	function(){
 
		// initialize our template, store in private variable to be recycled
		this._signatureTemplate = Ext.isObject(this.signatureTpl) ?
																this.signatureTpl:
																new Ext.XTemplate( this.signatureTpl);
 
		// compile the template to save on multiple iterations
		this._signatureTemplate.compile();
 
		// (re)load the signature template's data and component body
		this.reload();
	},
 
	reload : function() {
 
		// update the contents of this component's body to be the
		// rendered signature template.
		this.update(this._signatureTemplate.apply({
			name: this.getName(),
			department: this.getDepartment(),
			phoneNumbers: this.getPhoneNumbers(),
			emailAddresses: this.getEmailAddresses()
		}));
 
		/**
 ^^	You're probably wondering where these this.get*() methods are coming from..
		 They're automatically created from the initConfig() method called in
		 the class constructor.
		 **/
	}
});