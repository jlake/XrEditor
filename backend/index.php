<?php
error_reporting(E_ALL | E_STRICT);

defined('APP_ROOT')
    || define('APP_ROOT', realpath(dirname(__FILE__)));

defined('APP_ENV')
    || define('APP_ENV', (getenv('APP_ENV') ? getenv('APP_ENV') : 'production'));

defined('HOME_URL')
    || define('HOME_URL',  '/xreditor/backend');

defined('IMAGE_URL')
    || define('IMAGE_URL',  '/xreditor/images');

defined('EDITOR_DOCROOT')
    || define('EDITOR_DOCROOT',  APP_ROOT . '/var/docroot');

defined('EDITOR_IMGROOT')
    || define('EDITOR_IMGROOT',  APP_ROOT . '/var/docroot/images');

defined('EDITOR_IMGURL')
    || define('EDITOR_IMGURL',  '/xreditor/backend/var/docroot/images');

defined('CACHE_PATH')
    || define('CACHE_PATH',  APP_ROOT . '/var/cache');

//echo APP_ROOT;
set_include_path(implode(PATH_SEPARATOR, array(
    APP_ROOT.'/lib',
    get_include_path()
)));

require_once APP_ROOT . '/config/global.inc.php';
k()
  // Enable file logging
  ->setLog(APP_ROOT . '/log/debug.log')
  // Uncomment the next line to enable in-browser debugging
  //->setDebug()
  // Dispatch request
  ->run('components_Root')
  ->out();
