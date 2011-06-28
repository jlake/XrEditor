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
		setLang: function(lang) {
			lang = lang || 'en';
			var url = XrEditor.Global.baseUrl + '/i18n/xreditor-' + lang + '.js';
			Ext.Ajax.request({
				url: url,
				success: function(response, opts) {
					eval(response.responseText);
					_dict = XrEditor.Message;
				},
				failure: function() {
					XrEditor.Util.popupMsg('Failed to load locale file.', 'Error', 'Failure');
					_dict = {};
				},
				scope: this 
			});
		},
		/**
		 * translate
		 */
		translate: function (str, replaceList) {
			var localStr = _dict[str] || str;
			if(replaceList) {
				return XrEditor.i18n.replaceTmpl(localStr, replaceList);
			}
			return localStr;
		},
		/**
		 * replace %xxx% strings in template
		 */
		replaceTmpl: function (tmpl, replaceList) {
			return tmpl.replace(/%(.*?)%/g, function($0, $1){
				return replaceList[$1] || '';
			});
		}
	};
}();

var _T = XrEditor.Locale.translate;
