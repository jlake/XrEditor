/**
 * @class XrEditor.UTIL
 * @extends Ext.panel.TabPanel
 *
 * define UTIL class
 *
 * @constructor
 * 
 * @param {Object} config The config object
 * @author ouzhiwei@gmail.com (Jlake Ou)
 */
XrEditor.Util = function() {
	var _loadMask = [];
	var _msgCt;

	return {
		/**
		 * show loading mask
		 */
		showLoadingMask: function(sMsg, el, sSize, n){
			sMsg = sMsg || 'Loading';
			el = el || document.body;
			n = n || 0;
			var config = {
				msg: sMsg
			};
			if(sSize == 'BIG') {
				config.msgCls = 'big-loading-mask'
			}
			_loadMask[n] = new Ext.LoadMask(el, config);
			_loadMask[n].show();
		},
		/**
		 * hide loading mask
		 */
		hideLoadingMask: function(n){
			n = n || 0;
			if(_loadMask[n]) {
				_loadMask[n].hide();
			}
		},
		/**
		 * popup message box
		 */
		popupMsg: function(sMsg, sTitle, sLevel, args) {
			sLevel = sLevel || 'INFO';
			var params = {
				title: sTitle || 'Message',
				msg: sMsg,
				buttons: Ext.Msg.OK,
				icon: Ext.MessageBox[sLevel] || Ext.MessageBox.WARNING
			};
			Ext.apply(params, args);
			Ext.Msg.show(params);
		},
		/**
		 * slide down message
		 */
		slideMsg : function(sMsg, sTitle){
			sTitle = sTitle || 'Message';
			if(!_msgCt){
				_msgCt = Ext.core.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
			}
			var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
			var sHtml = '<div class="msg"><h3>' + sTitle + '</h3><p>' + sMsg + '</p></div>';
			var m = Ext.core.DomHelper.append(_msgCt, sHtml, true);
			m.hide();
			m.slideIn('t').ghost("t", { delay: 1000, remove: true});
		},
		/**
		 * get file extension
		 */
		getFileExtension: function(sName) {
			var sExt = (/[.]/.exec(sName)) ? /[^.]+$/.exec(sName) : '';
			return (sExt + '').toLowerCase();
		}
	};
}();
