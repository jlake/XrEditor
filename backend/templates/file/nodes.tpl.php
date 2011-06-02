<h1>File Nodes</h1>
<pre>
<?php print_r($nodes); ?>
</pre>
<?php
foreach ($nodes as $node) {
   echo '<a href="?'.$node['id'].'">' . $node['text'] . '</a><br />';
}
?>
