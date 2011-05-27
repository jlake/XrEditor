<?php
set_include_path(implode(PATH_SEPARATOR, array(
	realpath('./lib'),
	get_include_path(),
)));

require_once 'konstrukt/konstrukt.inc.php';

class Root extends k_Component {
	protected function map($name) {
	if ($name == "hello") {
		return 'hellocontroller';
	}
	}
	function execute() {
		return $this->wrap(parent::execute());
	}
	function wrapHtml($content) {
		return sprintf("<html><body><h1>Example 1</h1>%s</body></html>", $content);
	}
	function renderHtml() {
		return sprintf("<a href='%s'>say hello</a>", htmlspecialchars($this->url('hello')));
	}
}

class HelloController extends k_Component {
	function renderHtml() {
		return "Hello World";
	}
}

class FileController {
	function renderJson() {
		return $this->find2(realpath('./lib'), "*.html");
	}

	/**
	 * find files
	 *
	 * @param string $dir     - target dir
	 * @param string $pattern - match pattern
	 *
	 * @return array
	 */
	function find($dir, $pattern){
		$dir = escapeshellcmd($dir);
		$files = glob("$dir/$pattern", GLOB_BRACE);
		foreach (glob("$dir/{.[^.]*,*}", GLOB_BRACE|GLOB_ONLYDIR) as $sub_dir){
			$arr   = self::find($sub_dir, $pattern);
			$files = array_merge($files, $arr);
		}
		return $files;
	}

	/**
	 * find files
	 *
	 * @param string $dir     - target dir
	 * @param string $pattern - match pattern
	 *
	 * @return array
	 */
	function find2($dir, $pattern){
		$dir = escapeshellcmd($dir);
		$files[$dir] = glob("$dir/$pattern", GLOB_BRACE);
		foreach (glob("$dir/{.[^.]*,*}", GLOB_BRACE|GLOB_ONLYDIR) as $sub_dir){
			$arr   = self::find($sub_dir, $pattern);
			$files[$sub_dir] = $arr;
		}
		return $files;
	}
}


if (realpath($_SERVER['SCRIPT_FILENAME']) == __FILE__) {
	k()->run('Root')->out();
}
