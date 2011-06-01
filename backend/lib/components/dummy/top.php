<?php
class components_dummy_Top extends k_Component {
	protected function map($name) {
		switch ($name) {
			case 'hello':
				return 'components_dummy_Hello';
		}
	}

	function renderHtml() {
		$t = new k_Template("templates/dummy/top.tpl.php");
		return $t->render($this);
	}
}
