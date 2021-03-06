/**
 * @class XrEditor.Global
 * @extends Object
 *
 * Copyright(c) 2011 Jlake Ou (ouzhiwei@gmail.com)
 */
XrEditor.Global = {
	version: '0.1',
	baseUrl: '/xreditor',
	languages: {
		en: {title: 'English', flag: 'us.png'},
		ja: {title: '日本語', flag: 'jp.png'},
		zh_CN: {title: '简体中文', flag: 'cn.png'}
	},
	fileTypes: {
		js: 'JavaScript',
		css: 'CSS',
		xml: 'XML',
		html: 'HTML'
	},
	urls: {
		FILE_NODES: 'backend/file/list.json',
		FILE_CONTENTS: 'backend/file/contents.json',
		FILE_UTILITY: 'backend/file/utility.json',
		IMAGE_LIST: 'backend/image/list.json',
		IMAGE_UTILITY: 'backend/image/utility.json',
		SNIPPET_LIST: 'backend/snippet/list.json',
		SNIPPET_DETAIL: 'backend/snippet/detail.json'
	},
	pageSize: 20,
	winCache: {},
	currentEditor: null
};
