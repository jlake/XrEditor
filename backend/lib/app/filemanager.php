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

    
    function getNodes($node) {
        $nodes = array();
        if(strpos($node, '..') !== false){
            return $nodes;
        }

        $directory = $this->_rootPath.$node;
        //var_dump($directory);
        if (!is_dir($directory)) {
            return $nodes;
        }
        $iterator = new DirectoryIterator($directory);
        foreach ($iterator as $f) {
           //echo $f->getFilename() . " " . $f->getType() . "\n";
            $name = $f->getFilename();
            $type = $f->getType();
            if(substr($name, 0, 1) == '.') continue;
            $fullpath = $directory . '/' . $name;
            //var_dump($filename);
            $lastmod = date('M j, Y, g:i a', filemtime($fullpath));
            $qtip = 'Type: ' .ucwords($type). '<br />Last Modified: '.$lastmod;
            $leaf = false;
            $cls = 'folder';
            if(!is_dir($fullpath)) {
                $qtip .= '<br />Size: '.self::formatBytes(filesize($fullpath), 2);
                $leaf = true;
                $cls = 'file';
            }
             $nodes[] = array(
                'id'   => $node.'/'.$name,
                'text' => $name,
                'qtip' => 'Type: Folder<br />Last Modified: '.$lastmod,
                'leaf'  => $leaf,
                'cls'  => $cls
            );
        }
        return $nodes;
    }
}
