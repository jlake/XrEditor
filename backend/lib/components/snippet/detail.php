<?php
class components_snippet_Detail extends k_Component {
    const PAGE_SIZE = 5;
    const RANGE_SIZE = 10;

    private $_detail = '';

    function execute() {
        $id = $this->query('id', '');

        $dbConfig = Config::getDbConfig();
        xreditor_Db::setConnectionInfo($dbConfig['dbname'], $dbConfig['username'], $dbConfig['password'],  $dbConfig['database']);

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
