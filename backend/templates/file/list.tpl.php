<h1>File Nodes</h1>
<br />
<?php
echo '<b>Node:'.$node.'</b><br /><br />';
foreach ($children as $node) {
    if($node['type'] == 'dir') {
        echo '<a href="?node='.$node['id'].'">' . $node['text'] . '</a><br />';
    } else {
        echo '<a href="'.url('contents').'?node='.$node['id'].'">' . $node['text'] . '</a><br />';
    }
}
echo '<br /><a href="?node='.$parent.'">Up</a>';
?>
