<?php
class components_image_List extends k_Component {
    const PAGE_SIZE = 10;
    const RANGE_SIZE = 10;

    private $_node = '';
    private $_keyword = '';
    private $_folders = array();

    private $_baseUrl = '';
    private $_page = 0;
    private $_pageCount = 0;
    private $_pageItems = array();
    private $_startPage = 1;
    private $_endPage = 1;
    private $_totalItemCount = 0;
    private $_firstItemNumber = 0;
    private $_lastItemNumber = 0;

    protected function map($name) {
        switch ($name) {
            case 'list':
                return 'components_image_List';
            case 'thumb':
                return 'components_image_Thumb';
            case 'utility':
                return 'components_image_Utility';
        }
    }

    function execute() {
        $this->_node = $this->query('node', '.');
        $this->_keyword = $this->query('keyword', '');
        $this->_page = $this->query('page', 1);

        $limit = $this->query('limit', self::PAGE_SIZE);
        $offset = $this->query('start', ($this->_page - 1) * $limit);

        $url = $this->requestUri();
        $url = preg_replace('/([&\?]page=\d+)/i', '', $url);
        $url .= (strpos($url, '?') === FALSE) ? '?' : '&';
        $this->_baseUrl = $url;

        $fm = new xreditor_Imagemanager( EDITOR_IMGROOT );
        $children = $fm->findChildren($this->_node, $this->_keyword, $this->query('clearcache', false));

        $this->_folders =  $children['folders'];
        $this->_pageItems =  array_slice($children['images'], $offset, $limit);
        $this->_totalItemCount = count($children['images']);
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

        foreach($this->_pageItems as &$image) {
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
            'parent' => xreditor_Filemanager::getParentNode($this->_node),
            'folders' => $this->_folders,
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
            'folders' => $this->_folders,
            'pageItems' => $this->_pageItems,
            'totalItemCount' => $this->_totalItemCount
        );
    }
}
