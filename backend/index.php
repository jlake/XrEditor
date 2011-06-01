<?php
defined('ROOT_PATH')
    || define('ROOT_PATH', realpath(dirname(__FILE__)));

require_once ROOT_PATH . '/config/global.inc.php';
k()
  // Enable file logging
  ->setLog(ROOT_PATH . '/log/debug.log')
  // Uncomment the next line to enable in-browser debugging
  //->setDebug()
  // Dispatch request
  ->run('components_Root')
  ->out();
