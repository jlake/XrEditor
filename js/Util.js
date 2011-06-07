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
		 * Loadingマスクの表示
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
		 * Loadingマスクの非表示
		 */
		hideLoadingMask: function(n){
			n = n || 0;
			if(_loadMask[n]) {
				_loadMask[n].hide();
			}
		},
		/**
		 * メッセージを表示
		 */
		showMsg: function(sMsg, sLevel, sTitle, args) {
			var params = {
				title: sTitle || 'メッセージ',
				msg: sMsg,
				buttons: Ext.Msg.OK,
				icon: Ext.MessageBox[sLevel] || Ext.MessageBox.WARNING
			};
			Ext.apply(params, args);
			Ext.Msg.show(params);
		},
		/**
		 * 一時メッセージ
		 */
		flashMsg : function(sMsg, sTitle, args){
			sTitle = sTitle || 'メッセージ';
			if(!_msgCt){
				_msgCt = Ext.DomHelper.insertFirst(document.body, {id:'flash-msg'}, true);
			}
			_msgCt.alignTo(document, 'c-c');
			_msgCt.alignTo(document, 't-t');
			var sHtml = '<div class="msg">'
					+ '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>'
					+ '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc">'
					+ '<h3>' + sTitle + '</h3>' + sMsg + '</div></div></div>'
					+ '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>'
					+ '</div>';

			var m = Ext.DomHelper.append(_msgCt, {html:sHtml}, true);
			m.slideIn('t').pause(1).ghost("t", {remove:true});
		}
	};
}();
