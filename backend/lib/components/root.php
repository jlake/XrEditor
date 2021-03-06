<?php
class components_Root extends k_Component {
    protected function map($name) {
        switch ($name) {
            case 'dummy':
                return 'components_dummy_Top';
            case 'file':
                return 'components_file_List';
            case 'image':
                return 'components_image_List';
            case 'snippet':
                return 'components_snippet_List';
        }
    }

    function execute() {
        return $this->wrap(parent::execute());
    }

    function wrapHtml($content) {
        $t = new k_Template("templates/layout.tpl.php");
        $this->document->setTitle('XrEditor backend');
        return $t->render(
            $this,
            array(
                'content' => $content,
                'title' => $this->document->title(),
                'scripts' => $this->document->scripts(),
                'styles' => $this->document->styles(),
                'onload' => $this->document->onload()
            )
        );
    }

    function renderHtml() {
        $t = new k_Template("templates/root.tpl.php");
        return $t->render($this);
    }
}
