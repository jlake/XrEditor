<?php
// 開発環境設定ファイル
date_default_timezone_set('Asia/Tokyo');

class Config {
    public static function getDbConfig()
    {
        return array(
            'dbname' => BACKEND_ROOT . '/var/db/appdata.db3',
            'username' => null,
            'password' => null,
            'database' => 'sqlite',
            'host' => 'localhost',
        );
    }
}
