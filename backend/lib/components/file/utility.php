<?php
class components_file_Utility extends k_Component {
    private $_result = array(
        'error' => false
    );

    function execute() {
        $fm = new xreditor_Filemanager( EDITOR_DOCROOT );
        $action = $this->query('action');
        $this->_result['action'] = $action;
        switch($action) {
            case 'add':
                $parent = $this->query('parent');
                $name = $this->query('name');
                $type = $this->query('type', 'file');
                if(!$fm->addChild($parent, $name, $type)) {
                    $this->_result['error'] = 'add child failed';
                }
                break;
            case 'remove':
                $node = $this->query('node');
                if(!$fm->removeNode($node)) {
                    $this->_result['error'] = 'remove node failed';
                }
                break;
            case 'rename':
                $node = $this->query('node');
                $name = $this->query('name');
                if(!$fm->renameNode($node, $name)) {
                    $this->_result['error'] = 'rename node failed';
                }
                break;
        }
        return parent::execute();
    }

    function renderHtml() {
        $t = new k_Template("templates/file/utility.tpl.php");
        return $t->render($this, $this->_result);
    }

    function renderJson() {
        return $this->_result;
    }
}
