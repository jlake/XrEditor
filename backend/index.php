<?php
error_reporting(E_ALL | E_STRICT);

defined('APP_ROOT')
    || define('APP_ROOT', realpath(dirname(__FILE__)));

defined('EDITOR_DOCROOT')
    || define('EDITOR_DOCROOT',  APP_ROOT . '/var/docroot');

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
