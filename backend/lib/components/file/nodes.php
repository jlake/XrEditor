<?php
class components_file_Nodes extends k_Component {
    private $_node = '';
    private $_nodes = array();
    function execute() {
        $fm = new app_Filemanager( EDITOR_DOCROOT );
        $this->_nodes = $fm->getNodes($this->query('node'));
        return parent::execute();
    }

    function renderHtml() {
        $t = new k_Template("templates/file/nodes.tpl.php");
        return $t->render($this, array(
            'current' => $this->_node,
            'nodes' => $this->_nodes
        ));
    }

    function renderJson() {
        return $this->_nodes;
    }
}
