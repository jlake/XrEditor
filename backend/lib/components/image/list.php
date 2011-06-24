<?php
class components_image_List extends k_Component {
    private $_result = '';

    protected function map($name) {
        switch ($name) {
            case 'list':
                return 'components_image_List';
            case 'thumb':
                return 'components_image_Thumb';
        }
    }

    function execute() {
        $node = $this->query('node', '.');
        $keyword = $this->query('keyword', '');
        $fm = new xreditor_Imagemanager( EDITOR_IMGROOT );
        $this->_result = $fm->findChildren($node, $keyword);
        foreach($this->_result['images'] as &$image) {
            $this->debug($image['name']);
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
        return $t->render($this, $this->_result);
    }

    function renderJson() {
        return $this->_result;
    }
}
