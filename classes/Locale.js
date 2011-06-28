/**
 * @class XrEditor.Locale
 *
 * Copyright(c) 2011 Jlake Ou (ouzhiwei@gmail.com)
 */
XrEditor.Locale = function() {
	var _dict = {};

	return {
		/**
		 * set language
		 */
		setLang: function(lang, callback) {
			lang = lang || 'en';
			var url = XrEditor.Global.baseUrl + '/i18n/xreditor-' + lang + '.js';
			Ext.Ajax.request({
				url: url,
				success: function(response, opts) {
					eval('_dict=(' + response.responseText + ')');
					_dict = _dict || {};
					if(callback) callback();
				},
				failure: function() {
					XrEditor.Util.popupMsg('Failed to load locale file.', 'Error', 'Failure');
					_dict = {};
					if(callback) callback();
				},
				scope: this 
			});
		},
		/**
		 * translate
		 */
		translate: function (str, replaceList) {
			var localStr = _dict[str] || _dict[str.toLowerCase()] || str;
			if(replaceList) {
				return XrEditor.Locale.replaceTmpl(localStr, replaceList);
			}
			return localStr;
		},
		/**
		 * replace {N} marks in template
		 */
		replaceTmpl: function (tmpl, replaceList) {
			return tmpl.replace(/\{(.*?)\}/g, function($0, $1){
				return replaceList[$1] || '';
			});
		}
	};
}();

var _ = XrEditor.Locale.translate;
