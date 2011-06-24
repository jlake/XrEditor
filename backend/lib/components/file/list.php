<?php
class components_file_List extends k_Component {
    private $_node = '';
    private $_parent = '';
    private $_children = array();

    protected function map($name) {
        switch ($name) {
            case 'list':
                return 'components_file_List';
            case 'contents':
                return 'components_file_Contents';
            case 'utility':
                return 'components_file_Utility';
        }
    }

    function execute() {
        $this->_node = $this->query('node', '.');
        $keyword = $this->query('keyword', '');
        $fm = new xreditor_Filemanager( EDITOR_DOCROOT );
        $this->_children = $fm->findChildren($this->_node, $keyword, '/\.(html|js|css)$/i');
        $this->_parent = $fm->getParentNode($this->_node);
        return parent::execute();
    }

    function renderHtml() {
        $t = new k_Template("templates/file/list.tpl.php");
        return $t->render($this, array(
            'node' => $this->_node,
            'parent' => $this->_parent,
            'children' => $this->_children
        ));
    }

    function renderJson() {
        return $this->_children;
    }
}
