Ext.define('XrEditor.Html', {
    singleton: true,
	//*******************************************************
	// HTML 特殊文字変換
	//*******************************************************
	enocde: function(sHtml){
		return (sHtml + '').replace(/&(?!amp;|lt;|gt;|quot;)/gm, '&amp;')
			.replace(/</gm, '&lt;')
			.replace(/>/gm, '&gt;')
			.replace(/\"/gm, '&quot;');
	},
	//*******************************************************
	// 色文字列 "rgb(d, d, d)" を "#hhhhhh" 形式に変換
	//*******************************************************
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
	//*******************************************************
	// HTML→XHTML変換
	//*******************************************************
	formatXhtml: function(sHtml) {
		//属性の文字列変換
		function formatAttr(name, value){
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
			if(html.match(/^<!--/)) {
				//コメント
				return html;
			}
			//a="b" 属性の変換
			html = html.replace(/\s+([\w:-]+)=([\"])([^\2]*?)\2/gi, function($0, name, quote, value){
				return formatAttr(name, value);
			});
			//a=b 属性の変換
			html = html.replace(/\s+([\w:-]+)=([^\"\s<>]+)/gi, function($0, name, value){
				return formatAttr(name, value);
			});
			//タグ名の置換
			html = html.replace(/(<\/?)([a-z][\d\w:]*)/gi, function($0, prefix, name){
				name = name.toLowerCase();
				switch(name){
					case 'strong' : name = 'b'; break;
					case 'em' : name = 'i'; break;
					default : break;
				}
				return prefix + name;
			});
			//<tag...>を<tag... />に変換
			html = html.replace(/<(br|hr|img|input)\s*([^>]*?)(\/?)>/gi, function($0, name, value){
				return '<' + name.toLowerCase() + (value ? ' ' : '') + $.trim(value) + ' />';
			});
			return html;
		});
		// Firefox のため追加した <br> タグを削除
		sHtml = sHtml.replace('<br class="blank" />', '\n');
		//中身が空のタッグを削除
		//sHtml = sHtml.replace(/<(div|span|font|p)[^>]*>[\s\n]*<\/\1>/gmi, '').replace(/<(span|font)\s*>(.*?)<\/\1>/gmi, '$2');
		//IE対応
		sHtml = sHtml.replace(new RegExp(location.href, 'g'), '');
		//Firefox対応
		sHtml = this.rgbToHex(sHtml);
		//改行追加
		sHtml = sHtml.replace(/></g, '>\n<');
		return sHtml;
	},
	//*******************************************************
	// タグ名指定で親ノード検索
	//*******************************************************
	findParentNode: function(tagName, node) {
		while (node.tagName != "HTML") {
			if (node.tagName == tagName){
				return node;
			}
			node = node.parentNode;
		}
		return null;
	}
});