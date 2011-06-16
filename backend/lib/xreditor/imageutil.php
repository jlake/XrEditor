<?php
require_once 'PhpThumb/ThumbLib.inc.php';
defined('DEFAULT_THUMBLIB_IMPLEMENTATION')
    || define('DEFAULT_THUMBLIB_IMPLEMENTATION', 'gd');

class xreditor_Imageutil {
    /**
     * create thumbnail file
     */
    public static function createThumbnail($srcPath, $destPath, $w, $h)
    {
        $thumb = PhpThumbFactory::create($srcPath);
        $thumb->resize($w, $h);
        $thumb->save($destPath);
    }

    /**
     * display image with specified size
     */
    public static function display($srcPath, $w = 0, $h = 0)
    {
        $thumb = PhpThumbFactory::create($srcPath);
        if($w > 0 || $h > 0) {
            $thumb->resize($w, $h);
        }
        $thumb->show();
    }
}
