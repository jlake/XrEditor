<?php
class components_image_Top extends k_Component {
    protected function map($name) {
        switch ($name) {
            case 'thumb':
                return 'components_image_Thumb';
            case 'list':
                return 'components_image_List';
        }
    }

    function renderHtml() {
        $t = new k_Template("templates/image/top.tpl.php");
        return $t->render($this);
    }
}
