<?php
class xreditor_Filemanager {
    protected $_rootPath;

   /** 
    * Constructor 
    */
    public function __construct($rootPath) { 
        if($rootPath) {
            $this->_rootPath = $rootPath; 
        }
    }
   /** 
    * get file extension
    */
    public static function getExtension($fileName) {
        //return strtolower(substr(strrchr($fileName, '.'), 1));
        return strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    }

   /** 
    * from php manual page 
    */
    public static function formatBytes($val, $digits = 3, $mode = 'SI', $bB = 'B'){ //$mode == 'SI'|'IEC', $bB == 'b'|'B'
        $si = array('', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y');
        $iec = array('', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei', 'Zi', 'Yi');
        switch(strtoupper($mode)) {
            case 'SI' : $factor = 1000; $symbols = $si; break;
            case 'IEC' : $factor = 1024; $symbols = $iec; break;
            default : $factor = 1000; $symbols = $si; break;
        }
        switch($bB) {
            case 'b' : $val *= 8; break;
            default : $bB = 'B'; break;
        }
        for($i=0;$i<count($symbols)-1 && $val>=$factor;$i++)
            $val /= $factor;
        $p = strpos($val, '.');
        if($p !== false && $p > $digits) $val = round($val);
        elseif($p !== false) $val = round($val, $digits-$p);
        return round($val, $digits) . ' ' . $symbols[$i] . $bB;
    }

   /** 
    * get parent node
    */
    function getParentNode($node) {
        return substr($node, 0, strrpos($node, '/'));
    }

   /** 
    * find all children for a node
    */
    function findChildren($node, $filter = '') {
        $nodes = array();
        if(strpos($node, '..') !== false){
            return $nodes;
        }

        if($node == '.') $node = '';
        $path = $this->_rootPath.$node;
        if (!is_dir($path)) {
            return $nodes;
        }
        $iterator = new DirectoryIterator($path);
        foreach ($iterator as $f) {
           //echo $f->getFilename() . " " . $f->getType() . "\n";
            $fileName = $f->getFilename();
            if(substr($fileName, 0, 1) == '.') continue;
            if($f->isDir()) {
                $nodes[] = array(
                    'id'   => $node.'/'.$fileName,
                    'type' => $f->getType(),
                    'text' => $fileName,
                    'qtip' => 'Last Modified: '.date('Y-m-d g:i:s', $f->getMTime()),
                    'leaf' => false,
                    'cls'  => 'folder'
                );
            } else {
                if(!empty($filter) && !preg_match($filter, $fileName)) continue;
                $nodes[] = array(
                    'id'   => $node.'/'.$fileName,
                    'type' => $f->getType(),
                    'text' => $fileName,
                    'qtip' => 'Size: '.self::formatBytes($f->getSize(), 2).'<br />Last Modified: '.date('Y-m-d g:i:s', $f->getMTime()),
                    'leaf' => true,
                    'cls'  => 'file',
                    'iconCls' => 'icon-doc-'.self::getExtension($fileName)
                );
            }
        }
        return $nodes;
    }
 
   /** 
    * get node's contents
    */
    public function getContents($node) {
        $filePath = $this->_rootPath.$node;
        if(is_readable($filePath)) {
            return array(
                'contents' => file_get_contents($filePath)
            );
        } else {
            return array(
                'error' => 'Can not read file: '.$filePath
            );
        }
    }

   /** 
    * find image files
    */
    function findImageFiles($node) {
        $images = array();
        if(strpos($node, '..') !== false){
            return $images;
        }
        if($node == '.') $node = '';
        $path = $this->_rootPath.$node;
        if (!is_dir($path)) {
            return $images;
        }
        $iterator = new DirectoryIterator($path);
        foreach ($iterator as $f) {
            $fileName = $f->getFilename();
           //echo $f->getFilename() . " " . $f->getType() . "\n";
            $fileName = $f->getFilename();
            if(substr($fileName, 0, 1) == '.') continue;
            $fileNode = $node.'/'.$fileName;
            if($f->isDir()) {
                $images[] = array(
                    'node'   => $fileNode,
                    'name' => $fileName,
                    'type' => $f->getType(),
                    'lasmod' => $f->getMTime(),
                    'url' => IMAGE_URL.'/shared/photo_folder.png'
                );
            } else {
                if(!preg_match('/\.(jpg|gif|png)$/i', $fileName)) continue;
                $ext = self::getExtension($fileName);
                $images[] = array(
                    'node'   => $fileNode,
                    'name' => $fileName,
                    'type' => $f->getType(),
                    'size' => $f->getSize(),
                    'lasmod' => $f->getMTime(),
                    'url' => EDITOR_IMGURL.$fileNode
                );
            }
        }
        return $images;
    }
}
