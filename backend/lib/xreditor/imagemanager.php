<?php
class xreditor_Imagemanager extends xreditor_Filemanager {
   /** 
    * get cache key
    */
    public function getCacheKey($node) {
        return 'image_files_'.$node;
    }

   /** 
    * find all children for a node
    */
    public function findChildren($node, $keyword = '', $filter = '', $clearCache = false) {
        $result = array(
            'node' => $node,
            'parent' => $this->getParentNode($node),
            'folders' => array(),
            'images' => array(),
            'error' => ''
        );
        if(strpos($node, '..') !== false){
            return $result;
        }
        $pattern = '';
        if(!empty($keyword)) {
            $pattern = '/'.str_replace('/', '\/', $keyword).'/i';
        }
        if(empty($filter)) {
            $filter = '/\.(jpg|gif|png|tiff|jpeg)$/i';
        }
        $cache = new xreditor_Filecache( BACKEND_CACHEDIR );
        $key = $this->getCacheKey($node);
        if($clearCache) {
            $cache->clear($key);
        } else {
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
                    'url' => FRONT_BASEURL.'/images/shared/folder-24.png'
                );
            } else {
                if(!empty($filter) && !preg_match($filter, $fileName)) continue;
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
