<?php
class components_snippet_Detail extends k_Component {
    const PAGE_SIZE = 5;
    const RANGE_SIZE = 10;

    private $_detail = '';

    function execute() {
        $id = $this->query('id', '');

        $config = xreditor_Config::getDbConfig(APP_ENV);
        xreditor_Db::setConnectionInfo($config['dbname'], $config['username'], $config['password'],  $config['database']);

        $dataSql = "SELECT * FROM snippets";

        $this->_detail = xreditor_Db::getRow("SELECT * FROM snippets WHERE id = ? ", array($id));
        return parent::execute();
    }

    function renderHtml() {
        $t = new k_Template("templates/snippet/detail.tpl.php");
        return $t->render($this, array(
            'detail' => $this->_detail,
        ));
    }

    function renderJson() {
        return array(
            'detail' => $this->_detail,
        );
    }
}
