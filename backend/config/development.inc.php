<?php
// �J�����ݒ�t�@�C��
date_default_timezone_set('Asia/Tokyo');

// �A�v���P�[�V�����ݒ�
class Config {
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

// �A�v���P�[�V�����萔
class AppConst {
}