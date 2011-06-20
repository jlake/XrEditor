<?php
class components_image_List extends k_Component {
    private $_node = '';
    private $_parent = '';
    private $_images = array();
    private $_folders = array();

    protected function map($name) {
        switch ($name) {
            case 'list':
                return 'components_image_List';
            case 'thumb':
                return 'components_image_Thumb';
        }
    }

    function execute() {
        $this->_node = $this->query('node', '.');
        $fm = new xreditor_Filemanager( EDITOR_IMGROOT );
        $result = $fm->findImageFiles($this->_node);
        $this->_images = $result['images'];
        $this->_folders = $result['folders'];
        $this->_parent = $fm->getParentNode($this->_node);
        foreach($this->_images as &$image) {
            $image['thumburl'] = $this->url('thumb.image', array(
                    'node' => $image['node'],
                    'w' => $this->query('w', 160),
                    'h' => $this->query('w', 120),
                ));
        }
        return parent::execute();
    }

    function renderHtml() {
        $t = new k_Template("templates/image/list.tpl.php");
        return $t->render($this, array(
            'node' => $this->_node,
            'parent' => $this->_parent,
            'images' => $this->_images,
            'folders' => $this->_folders
        ));
    }

    function renderJson() {
        return array(
            'node' => $this->_node,
            'parent' => $this->_parent,
            'images' => $this->_images,
            'folders' => $this->_folders
        );
    }
}
