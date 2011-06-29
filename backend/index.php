<?php
error_reporting(E_ALL | E_STRICT);

defined('BACKEND_ROOT')
    || define('BACKEND_ROOT', realpath(dirname(__FILE__)));

defined('BACKEND_BASEURL')
    || define('BACKEND_BASEURL',  '/xreditor/backend');

defined('FRONT_BASEURL')
    || define('FRONT_BASEURL',  '/xreditor');

defined('APP_ENV')
    || define('APP_ENV', (getenv('APP_ENV') ? getenv('APP_ENV') : 'production'));

defined('CACHE_PATH')
    || define('CACHE_PATH',  BACKEND_ROOT . '/var/cache');

defined('EDITOR_DOCROOT')
    || define('EDITOR_DOCROOT',  BACKEND_ROOT . '/var/docroot');

defined('EDITOR_IMGROOT')
    || define('EDITOR_IMGROOT',  BACKEND_ROOT . '/var/images');

defined('EDITOR_IMGURL')
    || define('EDITOR_IMGURL',  BACKEND_BASEURL . '/var/images');
 
//echo BACKEND_ROOT;
set_include_path(implode(PATH_SEPARATOR, array(
    BACKEND_ROOT.'/lib',
    get_include_path()
)));

require_once BACKEND_ROOT . '/config/global.inc.php';
k()
  // Enable file logging
  ->setLog(BACKEND_ROOT . '/log/debug.log')
  // Uncomment the next line to enable in-browser debugging
  //->setDebug()
  // Dispatch request
  ->run('components_Root')
  ->out();
