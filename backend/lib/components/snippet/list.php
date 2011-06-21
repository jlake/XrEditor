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

        $url = $this->requestUri();
        $url = preg_replace('/([&\?]page=\d+)/i', '', $url);
        $url .= (strpos($url, '?') === FALSE) ? '?' : '&';
        $this->_baseUrl = $url;

        $config = pdo_Config::getConfig(APP_ENV);
        pdo_Db::setConnectionInfo($config['dbname'], $config['username'], $config['password'],  $config['database']);

        $dataSql = "SELECT id, lang, title, tags, lastmod FROM snippets";
        $countSql = "SELECT count(1) FROM snippets";

        if(!empty($this->_filter)) {
            $filter = json_decode($this->_filter);
            $whereExpr = ' WHERE ' . pdo_Db::arrayToWhereExpr($filter);
            $dataSql .= $whereExpr;
            $countSql .= $whereExpr;
        }
        
        if(!empty($this->_order)) {
            $orderBy .= ' ' . $this->_order . ' ' . $this->_dir;
            $dataSql .= $orderBy;
            $countSql .= $orderBy;
        }
        if($this->query('page')) {
            $limit = self::PAGE_SIZE;
            $offset = ($this->_page - 1) * self::PAGE_SIZE;
        } else {
            $limit = $this->query('limit', self::PAGE_SIZE);
            $offset = $this->query('start', 0);
        }
        $dataSql .= " LIMIT $limit OFFSET $offset";

        $this->_pageItems = pdo_Db::getResult($dataSql);
        $this->_totalItemCount = intval(pdo_Db::getValue($countSql));
        $this->_pageCount = ceil($this->_totalItemCount / self::PAGE_SIZE);
        $halfSize = floor(self::RANGE_SIZE / 2);
        $this->_startPage = ($this->_page > $halfSize) ? ($this->_page - $halfSize) : $this->_page;
        $this->_endPage = $this->_startPage + self::RANGE_SIZE;
        if($this->_endPage > $this->_pageCount) {
            $this->_endPage = $this->_pageCount;
        }

        $this->_firstItemNumber = $offset + 1;
        $this->_lastItemNumber = $this->_firstItemNumber + self::PAGE_SIZE - 1;
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
