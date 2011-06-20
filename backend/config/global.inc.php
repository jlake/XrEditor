<?php
require_once 'konstrukt/konstrukt.inc.php';
set_error_handler('k_exceptions_error_handler');
spl_autoload_register('k_autoload');

$config_file = dirname(__FILE__) . '/'. APP_ENV . '.inc.php';
if (is_file($config_file)) {
  require_once($config_file);
}
