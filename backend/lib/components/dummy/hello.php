<?php

class components_dummy_Hello extends k_Component {
    private $_msg = '';
    private $_error = '';

    function execute() {
        //$this->debug('debug test');
        //FB::log('This is a log message');
        $cache = new xreditor_Filecache( BACKEND_CACHEDIR );
        $key = 'cache_test';
        $dateTime = '';
        if($this->query('clearcache')) {
            $result = $cache->clear($key);
        } else {
            $dateTime = $cache->get($key);
        }
        if(empty($dateTime)) {
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
