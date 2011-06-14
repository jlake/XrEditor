<?php
class components_file_Contents extends k_Component {
    private $_node = '';
    private $_contents = '';
    private $_parent = '';

    function execute() {
        if($this->method() == 'post') {
            $this->_node = $this->body('node', '.');
        } else {
            $this->_node = $this->query('node', '.');
        }
        $fm = new xreditor_Filemanager( EDITOR_DOCROOT );
        $this->_contents = $fm->getContents($this->_node);
        $this->_parent = $fm->getParentNode($this->_node);
        return parent::execute();
    }
    function postForm() {
        $this->_node = $this->body('node', '.');
        return $this->render();
    }
    function renderHtml() {
        $t = new k_Template("templates/file/contents.tpl.php");
        return $t->render($this, array(
            'node' => $this->_node,
            'parent' => $this->_parent,
            'contents' => $this->_contents,
        ));
    }

    function renderJson() {
        return $this->_contents;
    }
}
