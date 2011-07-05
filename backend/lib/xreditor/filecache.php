<?php
class xreditor_Filecache {
    protected $_cachePath = '/tmp';
    protected $_key = '';
    protected $_error = '';

   /**
    * Constructor
    */
    public function __construct($cachePath = null) {
        if($cachePath) {
            $this->_cachePath = $cachePath;
        }
    }

    /**
     * Method to get cache file path
     * @return string
     */
    public function _getFilePath() {
        return $this->_cachePath . '/' . preg_replace('/[^\w]+/', '-', $this->_key) . '.cache';
    }

    /**
     * Method to write data into cache.
     * @param string $key
     * @param mixed $value data to be written in cache
     * @param int $expire[optional] Cache Time to live
     * @return boolean
     */
    public function set($key, $value, $expire = null) {
        $this->_key = $key;
        if(!is_writable($this->_cachePath)) {
            return false;
        }
        $data = array(
            'value' => $value,
            'expire'  => isset($expire) ? time() + $expire : null,
        );
        return file_put_contents($this->_getFilePath(), json_encode($data));
    }

    /**
     * Method to read data from cache.
     * @param string $key
     * @return mixed
     */
    public function get($key) {
        $this->_key = $key;
        $cacheFile = $this->_getFilePath();
        $value = null;
        if(file_exists($cacheFile)) {
            $data = json_decode(file_get_contents($cacheFile), true);
            if(empty($data['expire']) || $data['expire'] < time()) {
                $value = $data['value'];
            } else {
                $this->_error = 'Cache data expired';
            }
        } else {
            $this->_error = 'Cache file does not exists';
        }
        return $value;
    }

    /**
     * Method to clear the cache.
     * @param string $key
     * @return boolean
     */
    public function clear($key) {
        $cacheFile = $this->_getFilePath();;
        if(file_exists($cacheFile)) {
            return unlink($cacheFile);
        }
        return true;
    }

    /**
    * get last error
    * @return string
    */
    public function getLastError(){
        return $this->_error;
    }
}
