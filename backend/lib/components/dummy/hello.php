<?php
class components_dummy_Hello extends k_Component {
    private $_msg = '';
    private $_error = '';

    function execute() {
        //$this->debug('debug test');
        $cache = new xreditor_Filecache( CACHE_PATH );
        $key = 'cache_test';
        $dateTime = $cache->get($key);
        if(!$dateTime) {
            $dateTime = date('Y-m-d H:i:s');
            $cache->set($key, $dateTime);
        }
        $this->_msg = 'Cache start atF'.$dateTime;
        $this->_error = $cache->getLastError();
        return parent::execute();
    }
    function renderHtml() {
        $t = new k_Template("templates/dummy/hello.tpl.php");
        return $t->render($this, array(
            'msg' => $this->_msg,
            'error' => $this->_error
        ));
    }
}
