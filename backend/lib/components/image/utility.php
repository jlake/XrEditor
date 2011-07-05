<?php
class components_image_Utility extends k_Component {
    private $_result = array(
        'error' => false
    );

    private function _param($name, $default = '') {
        if($this->method() == 'post') {
            return $this->body($name, $default);
        }
        return $this->query($name, $default);
    }

    function postForm() {
        return $this->render();
    }

    function execute() {
        $fm = new xreditor_Imagemanager( EDITOR_IMGROOT );
        $action = $this->_param('action');
        $this->_result['action'] = $action;
        $parent = '';
        switch($action) {
            case 'add':
                $parent = $this->_param('parent');
                $name = $this->_param('name');
                $type = $this->_param('type');
                if(!$fm->createNode($parent, $name, $type)) {
                    $this->_result['error'] = 'add child failed';
                }
                break;
            case 'remove':
                $node = $this->_param('node');
                $parent = $fm->getParentNode($node);
                if(!$fm->removeNode($node)) {
                    $this->_result['error'] = 'remove node failed';
                }
                break;
            case 'rename':
                $node = $this->_param('node');
                $parent = $fm->getParentNode($node);
                $name = $this->_param('name');
                if(!$fm->renameNode($node, $name)) {
                    $this->_result['error'] = 'rename node failed';
                }
                break;
            case 'move':
                $node = $this->_param('node');
                $parent = $this->_param('parent');
                if(!$fm->moveNode($node, $parent)) {
                    $this->_result['error'] = 'move node failed';
                }
                break;
            case 'save':
                $node = $this->_param('node');
                $parent = $fm->getParentNode($node);
                $contents = $this->_param('contents', '');
                if(!$fm->putContents($node, $contents)) {
                    $this->_result['error'] = 'save file failed';
                }
                break;
        }
        if(empty($parent)) {
            $parent = '.';
        }
        $cache = new xreditor_Filecache( CACHE_PATH );
        $key = $fm->getCacheKey($parent);
        $this->debug('delete cache '.$key);
        $cache->delete($key);
        return parent::execute();
    }

    function renderHtml() {
        $t = new k_Template("templates/image/utility.tpl.php");
        return $t->render($this, $this->_result);
    }

    function renderJson() {
        return $this->_result;
    }
}
