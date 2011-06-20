<?php
class xreditor_Filemanager {
    protected $_rootPath;

   /** 
    * Constructor 
    */
    public function __construct($rootPath = EDITOR_DOCROOT) { 
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
    * get parent node
    */
    function getParentNode($node) {
        return substr($node, 0, strrpos($node, '/'));
    }

    /**
     * create node
     *
     * @param string $parentNode        parent node
     * @param string $name        new node name
     * @param string $type        node type (file, dir)
     * @return boolean
     */
    function addChild($parentNode, $name, $type = 'file') {
        if(empty($parentNode) || empty($name)) {
            return false;
        }
        $path = $this->_rootPath.$parentNode.'/'.$name;
        if($type == 'file') {
            return touch($path);
        } else if($type == 'dir') {
            return mkdir($path);
        }
        return false;
    }

    /**
     * remove node
     *
     * @param string $node        node
     * @return boolean
     */
    function removeNode($node) {
        if(empty($node)) {
            return false;
        }
        $path = $this->_rootPath.$node;
        if(is_dir($path)) {
            return rmdir($path);
        } else {
            return unlink($path);
        }
    }

    /**
     * rename node
     *
     * @param string $node        node
     * @param string $name        new node name
     * @return boolean
     */
    function renameNode($node, $name) {
        if(empty($node) || empty($name)) {
            return false;
        }
        $oldPath = $this->_rootPath.$node;
        $newPath = $this->getParentNode($oldPath).'/'.$name;
        return rename($oldPath, $newPath);
    }

    /**
     * move node
     *
     * @param string $node        node
     * @param string $newParent   new parent
     * @return boolean
     */
    function moveNode($node, $newParent) {
        if(empty($node) || empty($newParent)) {
            return false;
        }
        $oldPath = $this->_rootPath.$node;
        $newPath = $this->_rootPath.$newParent.'/'.basename($node);
        if (copy($oldPath, $newPath)) {
            return unlink("/tmp/code.c");
        } 
        return false;
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
        $result = array(
            'folders' => array(),
            'images' => array()
        );
        if(strpos($node, '..') !== false){
            return $result;
        }
        if($node == '.') $node = '';
        $path = $this->_rootPath.$node;
        if (!is_dir($path)) {
            return $result;
        }
        $iterator = new DirectoryIterator($path);
        foreach ($iterator as $f) {
            $fileName = $f->getFilename();
           //echo $f->getFilename() . " " . $f->getType() . "\n";
            $fileName = $f->getFilename();
            if(substr($fileName, 0, 1) == '.') continue;
            $fileNode = $node.'/'.$fileName;
            if($f->isDir()) {
                $result['folders'][] = array(
                    'node' => $fileNode,
                    'name' => $fileName,
                    'lastmod' => $f->getMTime(),
                    'url' => IMAGE_URL.'/shared/normal_folder.png'
                );
            } else {
                if(!preg_match('/\.(jpg|gif|png)$/i', $fileName)) continue;
                $ext = self::getExtension($fileName);
                $result['images'][] = array(
                    'node' => $fileNode,
                    'name' => $fileName,
                    'size' => $f->getSize(),
                    'lastmod' => $f->getMTime(),
                    'url' => EDITOR_IMGURL.$fileNode
                );
            }
        }
        return $result;
    }
}
