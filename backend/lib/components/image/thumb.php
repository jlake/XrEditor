<?php
$GLOBALS['konstrukt_content_types']['image/jpg'] = 'image';
$GLOBALS['konstrukt_content_types']['image/gif'] = 'image';
$GLOBALS['konstrukt_content_types']['image/png'] = 'image';
class components_image_Thumb extends k_Component {
    private $_node = '';
    private $_fullpath = '';

    function execute() {
        $this->_node = $this->query('node', '');
        if(!empty($this->_node)) {
            $this->_fullpath = EDITOR_IMGROOT . $this->_node;
        }
        return parent::execute();
    }

    function renderHtml() {
        $t = new k_Template("templates/image/thumb.tpl.php");
        return $t->render($this, array(
            'node' => $this->_node,
            'fullpath' => $this->_fullpath,
        ));
    }

    function renderImage() {
        xreditor_Imageutil::display($this->_fullpath, $this->query('w', 100), $this->query('h', 100));
    }
}
