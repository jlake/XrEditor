/**
 * @class XrEditor.Html
 * @extends Object
 * 
 * Copyright(c) 2011 Jlake Ou (ouzhiwei@gmail.com)
 */
Ext.define('XrEditor.Html', {
    singleton: true,
	/**
	 * encode html special characters (escape)
	 */
	enocde: function(sHtml){
		return (sHtml + '').replace(/&(?!amp;|lt;|gt;|quot;)/gm, '&amp;')
			.replace(/</gm, '&lt;')
			.replace(/>/gm, '&gt;')
			.replace(/\"/gm, '&quot;');
	},
	/**
	 * convert "rgb(d, d, d)" to "#hhhhhh"
	 */
	rgbToHex: function(sHtml) {
		var decToHex = function(nDec) {
			if(!nDec) return '00';
			nDec = parseInt(nDec);
			if (nDec == 0 || isNaN(nDec)) return '00';
			nDec = Math.max(0, nDec);
			nDec = Math.min(nDec, 255);
			nDec = Math.round(nDec);
			var sHex = '0123456789ABCDEF';
			return sHex.charAt((nDec - nDec % 16)/16) + sHex.charAt(nDec % 16);
		};
		return sHtml.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/ig, function($0, r, g, b) {
			return '#' + decToHex(r) + decToHex(g) + decToHex(b);
		});
	},
	/**
	 * format as xhtml
	 */
	xhtmlFormat: function(sHtml) {
		// function for format attribute
		var formatAttr = function(name, value){
			name = name.trim().toLowerCase();
			value = value.trim();
			if(value == '' && name != 'value') return '';
			switch(name){
				case 'style':
					value = value.replace(/([^:]+?)\s*:\s*([^;\b$]+)(?=;|\b|$)/g, function($0, p, v){
						return p.toLowerCase() + ':' + v.trim();
					});
					break;
				case 'href':
					value = value.replace(/\%0A/ig, '');
					value = Ext.util.Format.htmlDecode(value);
					break;
				default:
					value = XrEditor.Html.enocde(value);
					break;
			}
			return ' ' + name + '="' + value + '"';
		}

		sHtml = sHtml.replace(/<[^<>]+>/gm, function(html){
			// comments
			if(html.match(/^<!--/)) {
				return html;
			}
			// format a="b" attributes
			html = html.replace(/\s+([\w:-]+)=([\"])([^\2]*?)\2/gi, function($0, name, quote, value){
				return formatAttr(name, value);
			});
			// format a=b attributes
			html = html.replace(/\s+([\w:-]+)=([^\"\s<>]+)/gi, function($0, name, value){
				return formatAttr(name, value);
			});
			/*
			// replace some tag
			html = html.replace(/(<\/?)([a-z][\d\w:]*)/gi, function($0, prefix, name){
				name = name.toLowerCase();
				switch(name){
					case 'strong' : name = 'b'; break;
					case 'em' : name = 'i'; break;
					default : break;
				}
				return prefix + name;
			});
			*/
			// <tag...> to <tag... />
			html = html.replace(/<(br|hr|img|input)\s*([^>]*?)(\/?)>/gi, function($0, name, value){
				return '<' + name.toLowerCase() + (value ? ' ' + value : '') + ' />';
			});
			return html;
		});
		// delete tags with empty contents
		// sHtml = sHtml.replace(/<(div|span|font|p)[^>]*>[\s\n]*<\/\1>/gmi, '').replace(/<(span|font)\s*>(.*?)<\/\1>/gmi, '$2');
		//for IE
		sHtml = sHtml.replace(new RegExp(location.href, 'g'), '');
		// for Firefox
		sHtml = this.rgbToHex(sHtml);
		// add \n between <..><...>
		sHtml = sHtml.replace(/></g, '>\n<');
		return sHtml;
	}
});