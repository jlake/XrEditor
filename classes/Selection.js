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
				this.restoreSelection();
				this.config.doc.execCommand('InsertHTML', false, sHtml);
			} else {
				this.range.deleteContents();
				this.range.insertNode(range.createContextualFragment(sHtml));
				this.range.collapse(false);
			}
		}
	},
	execCommand: function(sCmd, mValue) {
		if(!this.range) return;

		this.restoreSelection();
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
	_hrImpl: function(mValue) {
		if(Ext.isIE){
			return this.insertHtml('<hr />');
		}
		return this.config.doc.execCommand("inserthorizontalrule", false, mValue);
	}
});
