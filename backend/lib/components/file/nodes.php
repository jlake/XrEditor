<?php
class components_file_Nodes extends k_Component {
    private $_node = '';
    private $_children = array();

    function execute() {
        $this->_node = $this->query('node', '.');
        $fm = new app_Filemanager( EDITOR_DOCROOT );
        $this->_children = $fm->findChildren($this->_node);
        return parent::execute();
    }

    function renderHtml() {
        $t = new k_Template("templates/file/nodes.tpl.php");
        return $t->render($this, array(
            'node' => $this->_node,
            'children' => $this->_children
        ));
    }

    function renderJson() {
        return $this->_children;
    }
}
