<?php
class components_file_Top extends k_Component {
	protected function map($name) {
		switch ($name) {
			case 'nodes':
				return 'components_file_Nodes';
		}
	}

	function renderHtml() {
		$t = new k_Template("templates/file/top.tpl.php");
		return $t->render($this);
	}
}
