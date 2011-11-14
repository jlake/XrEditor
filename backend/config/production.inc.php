<?php
// 本番環境設定ファイル
date_default_timezone_set('Asia/Tokyo');

class Config {
    public static $db = array(
        'dbname' => BACKEND_ROOT . '/var/db/appdata.db3',
        'username' => null,
        'password' => null,
        'database' => 'sqlite',
        'host' => 'localhost',
    );
}
