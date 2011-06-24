<?php
class components_snippet_List extends k_Component {
    const PAGE_SIZE = 5;
    const RANGE_SIZE = 10;

    private $_baseUrl = '';
    private $_page = 0;
    private $_pageCount = 0;
    private $_pageItems = array();
    private $_startPage = 1;
    private $_endPage = 1;
    private $_totalItemCount = 0;
    private $_firstItemNumber = 0;
    private $_lastItemNumber = 0;

    private $_filter = '';
    private $_order = '';
    private $_dir = '';

    protected function map($name) {
        switch ($name) {
            case 'list':
                return 'components_snippet_List';
            case 'detail':
                return 'components_snippet_Detail';
        }
    }

    function execute() {
        $this->_page = $this->query('page', 1);
        $this->_filter = $this->query('filter', '');
        $this->_order = $this->query('order', '');
        $this->_dir = $this->query('dir', '');

        $limit = $this->query('limit', self::PAGE_SIZE);
        $offset = $this->query('start', ($this->_page - 1) * $limit);

        $url = $this->requestUri();
        $url = preg_replace('/([&\?]page=\d+)/i', '', $url);
        $url .= (strpos($url, '?') === FALSE) ? '?' : '&';
        $this->_baseUrl = $url;

        $config = xreditor_Config::getDbConfig(APP_ENV);
        xreditor_Db::setConnectionInfo($config['dbname'], $config['username'], $config['password'],  $config['database']);

        $dataSql = "SELECT id, lang, title, tags, lastmod FROM snippets";
        $countSql = "SELECT count(1) FROM snippets";

        if(!empty($this->_filter)) {
            $filter = json_decode($this->_filter);
            $whereExpr = ' WHERE ' . xreditor_Db::arrayToWhereExpr($filter);
            $dataSql .= $whereExpr;
            $countSql .= $whereExpr;
        }
        
        if(!empty($this->_order)) {
            $orderBy .= ' ' . $this->_order . ' ' . $this->_dir;
            $dataSql .= $orderBy;
        }
        $dataSql .= " LIMIT $limit OFFSET $offset";
        $this->_pageItems = xreditor_Db::getResult($dataSql);
        $this->_totalItemCount = intval(xreditor_Db::getValue($countSql));
        $this->_pageCount = ceil($this->_totalItemCount / $limit);
        if($this->_pageCount > self::RANGE_SIZE) {
            $halfRange = floor(self::RANGE_SIZE / 2);
            if($this->_page > ($this->_pageCount - $halfRange)) {
                $this->_startPage = $this->_pageCount - self::RANGE_SIZE;
                $this->_endPage = $this->_pageCount;
            } else {
                $this->_startPage = $this->_page - $halfRange;
                $this->_endPage = $this->_page + $halfRange;
            }
        } else {
            $this->_startPage = 1;
            $this->_endPage = $this->_pageCount;
        }

        $this->_firstItemNumber = $offset + 1;
        $this->_lastItemNumber = $this->_firstItemNumber + $limit - 1;
        if($this->_lastItemNumber > $this->_lastItemNumber) {
            $this->_lastItemNumber = $this->_totalItemCount;
        }
        return parent::execute();
    }

    function renderHtml() {
        $t = new k_Template("templates/snippet/list.tpl.php");
        return $t->render($this, array(
            'baseUrl' => $this->_baseUrl,
            'page' => $this->_page,
            'pageItems' => $this->_pageItems,
            'pageCount' => $this->_pageCount,
            'startPage' => $this->_startPage,
            'endPage' => $this->_endPage,
            'totalItemCount' => $this->_totalItemCount,
            'firstItemNumber' => $this->_firstItemNumber,
            'lastItemNumber' => $this->_lastItemNumber,
        ));
    }

    function renderJson() {
        return array(
            'pageItems' => $this->_pageItems,
            'totalItemCount' => $this->_totalItemCount
        );
    }
}
