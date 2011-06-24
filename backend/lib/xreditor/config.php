<?php
class xreditor_Config {
    public static function getDbConfig($env) {
        if($env == 'development') {
            return array(
                'dbname' => BACKEND_ROOT . '/var/db/appdata.db3',
                'username' => null,
                'password' => null,
                'database' => 'sqlite',
                'host' => 'localhost',
            );
        } else if($env == 'production') {
            return array(
                'dbname' => BACKEND_ROOT . '/var/db/appdata.db3',
                'username' => null,
                'password' => null,
                'database' => 'sqlite',
                'host' => 'localhost',
            );
        }
        return null;
    }
}
