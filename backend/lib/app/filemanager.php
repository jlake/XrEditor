<?php
class app_Filemanager {
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
    function findChildren($node) {
        $nodes = array();
        if(strpos($node, '..') !== false){
            return $nodes;
        }
        if($node == '.') $node = '';
        //$node = preg_replace('/^./', '', $node);
        $directory = $this->_rootPath.$node;
        //var_dump($directory);
        if (!is_dir($directory)) {
            return $nodes;
        }
        $iterator = new DirectoryIterator($directory);
        foreach ($iterator as $f) {
           //echo $f->getFilename() . " " . $f->getType() . "\n";
            $fileName = $f->getFilename();
            if(substr($fileName, 0, 1) == '.') continue;
            $qtip = 'Type: ' .ucwords($f->getType()). '<br />Last Modified: '.date('Y-m-d g:i:s', $f->getMTime());
            if($f->isDir()) {
                $nodes[] = array(
                    'id'   => $node.'/'.$fileName,
                    'text' => $fileName,
                    'qtip' => $qtip,
                    'leaf'  => false,
                    'cls'  => 'folder'
                );
            } else {
                //$ext = strtolower(substr(strrchr($fileName, '.'), 1));
                $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                $nodes[] = array(
                    'id'   => $node.'/'.$fileName,
                    'text' => $fileName,
                    'qtip' => $qtip.'<br />Size: '.self::formatBytes($f->getSize(), 2),
                    'leaf'  => true,
                    'cls'  => 'file',
                    'iconCls' => 'icon-doc-'.$ext
                );
            }
        }
        return $nodes;
    }

   /** 
    * get parent node
    */
    function getParentNode($node) {
        $parent = strtolower(substr(strrchr($fileName, '/'), 1));
    }
}
