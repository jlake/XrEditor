<?php
class pdo_Config {
    public static function getConfig($env) {
        if($env == 'development') {
            return array(
                'dbname' => APP_ROOT . '/var/db/appdata.db3',
                'username' => null,
                'password' => null,
                'database' => 'sqlite',
                'host' => 'localhost',
            );
        } else if($env == 'production') {
            return array(
                'dbname' => APP_ROOT . '/var/db/appdata.db3',
                'username' => null,
                'password' => null,
                'database' => 'sqlite',
                'host' => 'localhost',
            );
        }
        return null;
    }
}
