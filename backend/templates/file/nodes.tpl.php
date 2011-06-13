<h1>File Nodes</h1>
<?php
foreach ($children as $node) {
   echo '<a href="?node='.$node['id'].'">' . $node['text'] . '</a><br />';
}
?>
