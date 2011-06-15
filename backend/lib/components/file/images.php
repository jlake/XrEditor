<?php
class components_file_Images extends k_Component {
    private $_node = '';
    private $_parent = '';
    private $_images = array();

    function execute() {
        $this->_node = $this->query('node', '.');
        $fm = new xreditor_Filemanager( EDITOR_IMGROOT );
        $this->_images = $fm->findImageFiles($this->_node);
        $this->_parent = $fm->getParentNode($this->_node);
        return parent::execute();
    }

    function renderHtml() {
        $t = new k_Template("templates/file/images.tpl.php");
        return $t->render($this, array(
            'node' => $this->_node,
            'parent' => $this->_parent,
            'images' => $this->_images
        ));
    }

    function renderJson() {
        return array(
            'images' => $this->_images
        );
    }
}
