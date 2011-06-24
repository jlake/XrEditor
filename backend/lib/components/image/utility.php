<?php
class components_image_Utility extends k_Component {
    private $_result = array(
        'error' => false
    );

    function execute() {
        $fm = new xreditor_Imagemanager( EDITOR_IMGROOT );
        $action = $this->query('action');
        $this->_result['action'] = $action;
        $parent = '';
        switch($action) {
            case 'add':
                $parent = $this->query('parent');
                $name = $this->query('name');
                $type = $this->query('type');
                if(!$fm->createNode($parent, $name, $type)) {
                    $this->_result['error'] = 'add child failed';
                }
                break;
            case 'remove':
                $node = $this->query('node');
                $parent = $fm->getParentNode($node);
                if(!$fm->removeNode($node)) {
                    $this->_result['error'] = 'remove node failed';
                }
                break;
            case 'rename':
                $node = $this->query('node');
                $parent = $fm->getParentNode($node);
                $name = $this->query('name');
                if(!$fm->renameNode($node, $name)) {
                    $this->_result['error'] = 'rename node failed';
                }
                break;
            case 'move':
                $node = $this->query('node');
                $parent = $this->query('parent');
                if(!$fm->moveNode($node, $parent)) {
                    $this->_result['error'] = 'move node failed';
                }
                break;
            case 'save':
                $node = $this->query('node');
                $parent = $fm->getParentNode($node);
                $contents = $this->query('contents', '');
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
