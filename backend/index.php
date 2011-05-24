<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include('web.php');

//define("BASE_DIR", dirname(__FILE__));
//define("BASE_URL", '/xreditor/backend');
define('DOC_ROOT', 'I:/www/XrEditor/sample');

$urls = array(
	'#^$#' => 'hello',
	'#^hello$#' => 'hello',
	'#^named/?(?P<namedparam>\w+)?/?$#' => 'named',
	'#^files/?(?P<dir>\w+)?/?$#' => 'files',
);


class hello {        

	function GET($p)
	{
		echo 'Welcome to web-php';

		/*
		// gets a reference to an Inspekt _GET object, clean up your variables!        
		$input = Web::get();
		*/
		// test your get vars
		/*
		if ($email = $input->testEmail('email')) {
			// wow emai is valid!
			... do something ...
		}
		*/                                                

		// or
		// $vars['message'] = 'requested via get';
		// echo Web::render("name-of-file.html", $vars);
	}                          

	function POST($p)
	{        
		// like you just posted a form
		/*
		$input = Web::post();
		if ($email = $input->testEmail('email')) {
			// wow email is valid!
			 save to db...
			 Web::redirect('/gohere');            
		}
		*/        

		echo 'request via POST';
	}  

	function AJAX($p)
	{
		echo "requested via AJAX";
	}                            
}                          

class named {
	function GET($p)
	{
		var_dump($p);
		echo "this is a captured var from the URI: ".$p['namedparam'];
	}
}

class files {
	function GET($p)
	{
		var_dump($p);
		$dir = DOC_ROOT;
		if(!empty($p['dir'])) $dir .= '/'.$p['dir'];
		$files = self::find($dir, '*.{html,js,css,txt}');
		//echo join('<br />', $files);
		var_dump($files);
	}

	/**
	 * find all file
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
	 * find all file
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

try {
	/* debug?
	$i = Web::instance();
	$i->debug(true);
	*/
	Web::run($urls); 
} catch (RequestErrorException $e) {
	// errorCode gives you the 404 or 500 code etc.
	// echo $e->errorCode();                       
	// viewError will print out a basic 404 page
	// catch the RequestErrorException and do whatever you want.
	// viewError will send a header() to the browser fyi.
	$e->ViewError();
}
