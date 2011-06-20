/**
 * @class XrEditor.Global
 * @extends Object
 *
 * Copyright(c) 2011 Jlake Ou (ouzhiwei@gmail.com)
 */
XrEditor.Global = {
	version: '0.1',
	//lang: 'jp',
	fileTypes: {
		js: 'JavaScript',
		css: 'CSS',
		html: 'HTML'
	},
	urls: {
		FILE_NODES: 'backend/file/list.json',
		FILE_CONTENTS: 'backend/file/contents.json',
		FILE_UTILITY: 'backend/file/utility.json',
		IMAGE_LIST: 'backend/image/list.json'
	},
	currentEditor: null
};
