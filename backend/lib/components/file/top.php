<?php
class components_file_Top extends k_Component {
	protected function map($name) {
		switch ($name) {
			case 'nodes':
				return 'components_file_Nodes';
			case 'contents':
				return 'components_file_Contents';
			case 'images':
				return 'components_file_Images';
		}
	}

	function renderHtml() {
		$t = new k_Template("templates/file/top.tpl.php");
		return $t->render($this);
	}
}
