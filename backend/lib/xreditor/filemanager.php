<?php
class xreditor_Filemanager {
    protected $_rootPath = '/tmp';

   /** 
    * Constructor 
    */
    public function __construct($rootPath = null) { 
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
    public static function formatBytes($val, $digits = 3, $mode = 'SI', $bB = 'B') { //$mode == 'SI'|'IEC', $bB == 'b'|'B'
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
    function findChildren($node, $filter = '', $keyword = '') {
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
            //if(substr($fileName, 0, 1) == '.') continue;
            if ($f->isDot()) continue;
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
    * delete directory recursively
    */
    public static function rmdirRecursively($dir) {
        $iterator = new DirectoryIterator($dir);
        foreach ($iterator as $f) {
           //echo $f->getFilename() . " " . $f->getType() . "\n";
            $fileName = $f->getFilename();
            //if(substr($fileName, 0, 1) == '.') continue;
            if ($f->isDot()) continue;
            $path = $f->getPathname();
            if($f->isDir()) {
                self::rmdirRecursively( $path );
            } else {
                if(!unlink($path)) {
                    return false;
                }
            }
        }
        return rmdir($dir);
    }

   /** 
    * get parent node
    */
    public function getParentNode($node) {
        return substr($node, 0, strrpos($node, '/'));
    }

    /**
     * create node
     *
     * @param string $parentNode        parent node
     * @param string $name        new node name
     * @param string $type        node type (dir, js, css, html)
     * @return boolean
     */
    public function createNode($parentNode, $name, $type = '') {
        if(empty($parentNode) || empty($name)) {
            return false;
        }
        $path = $this->_rootPath.$parentNode.'/'.$name;
        if(file_exists($path)) {
            return false;
        }
        if($type == 'dir' || $type == 'folder') {
            return mkdir($path);
        }
        return touch($path);
    }

    /**
     * remove node
     *
     * @param string $node        node
     * @return boolean
     */
    public function removeNode($node) {
        if(empty($node)) {
            return false;
        }
        $path = $this->_rootPath.$node;
        if(is_dir($path)) {
            return self::rmdirRecursively($path);
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
    public function renameNode($node, $name) {
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
    public function moveNode($node, $newParent) {
        if(empty($node) || empty($newParent)) {
            return false;
        }
        $oldPath = $this->_rootPath.$node;
        $newPath = $this->_rootPath.$newParent.'/'.basename($node);
        if (copy($oldPath, $newPath)) {
            return unlink($oldPath);
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
    * save node's contents
    */
    public function putContents($node, $contents, $encode = null) {
        $filePath = $this->_rootPath.$node;
        $success = false;
        if(is_writeable($filePath)) {
            if(isset($encode)) {
                $contents = mb_convert_encoding($contents, $encode, 'auto');
            }
            $success = file_put_contents($filePath, $contents);
        }
        if($success) {
            return array(
                'contents' => file_get_contents($filePath)
            );
        } else {
            return array(
                'error' => 'Can not write file: '.$filePath
            );
        }
    }

   /** 
    * find image files
    */
    public function findImageFiles($node, $keyword = '') {
        $result = array(
            'node' => $node,
            'parent' => $this->getParentNode($node),
            'folders' => array(),
            'images' => array(),
            'error' => ''
        );
        $pattern = '';
        if(!empty($keyword)) {
            $pattern = '/'.str_replace('/', '\/', $keyword).'/i';
        }
        $cache = new xreditor_Filecache( CACHE_PATH );
        $key = 'image_files_'.$node;
        $cacheData = $cache->get($key);
        if(!empty($cacheData)) {
            $result['folders'] = $cacheData['folders'];
            $result['images'] = array();
            foreach($cacheData['images'] as $image) {
                if(!empty($pattern) && !preg_match($pattern, $image['name'])) continue;
                $result['images'][] = $image;
            }
            return $result;
        }
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
                    'url' => IMAGE_URL.'/shared/folder-24.png'
                );
            } else {
                if(!preg_match('/\.(jpg|gif|png|tiff|jpeg)$/i', $fileName)) continue;
                if(!empty($pattern) && !preg_match($pattern, $fileName)) continue;
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
        $cache->set($key, $result);
        $result['error'] = $cache->getLastError();
        return $result;
    }
}
