<?php
class components_dummy_Hello extends k_Component {
    function renderHtml() {
        $t = new k_Template("templates/dummy/hello.tpl.php");
        return $t->render($this);
    }
}
