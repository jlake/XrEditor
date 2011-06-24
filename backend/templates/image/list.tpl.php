<h1>Image List</h1>
<br />
<b>Node:<?php e($node); ?></b><br />
<table><tr>
<?php
foreach ($folders as $i => $folder) {
    echo '<td align="center" valign="bottom"><a href="?node='.$folder['node'].'"><img src="'.$folder['url'].'" /><br />' . $folder['name'] . '</td>';
    if($i > 0 && $i % 5 == 0) {
        echo '</tr><tr>';
    }
}
?>
</tr><tr>
<?php
foreach ($pageItems as $i => $image) {
    echo '<td align="center" valign="bottom"><img src="'.$image['thumburl'].'" /><br />' . $image['name'] . '</td>';
    if($i > 0 && $i % 5 == 0) {
        echo '</tr><tr>';
    }
}
?>
</tr></table>
<?php include(realpath(dirname(__FILE__).'/../paginator.tpl.php')); ?>
<br />
<?php if(!empty($error)) { ?>
<b>Error:</b><br />
<div class="error">
    <?php e($error);?>
</div>
<?php } ?>
<a href="?node=<?php e($parent); ?>">Up</a>
