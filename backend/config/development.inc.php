<?php
// 開発環境設定ファイル
date_default_timezone_set('Asia/Tokyo');

// アプリケーション設定
class AppConfig {
    public static $db = array(
        'database' => 'sqlite',
        'dbname' => "var/db/appdata.db3",
        'username' => null,
        'password' => null,
        'host' => 'localhost',
    );

    public static function getConfig($id)
    {
        $configs = array(
            'db' => self::$db,
        );
        if(isset($configs[$id])) {
            return $configs[$id];
        }
        return array();
    }
}
