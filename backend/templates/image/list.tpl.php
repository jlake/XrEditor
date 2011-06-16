<h1>Image List</h1>
<br />
<?php
echo '<b>Node:'.$node.'</b><br /><table><tr>';
foreach ($folders as $i => $folder) {
    echo '<td align="center" valign="bottom"><a href="?node='.$folder['node'].'"><img src="'.$folder['url'].'" /><br />' . $folder['name'] . '</td>';
    if($i > 0 && $i % 5 == 0) {
        echo '</tr><tr>';
    }
}
echo '</tr><tr>';
foreach ($images as $i => $image) {
    echo '<td align="center" valign="bottom"><img src="'.$image['thumburl'].'" /><br />' . $image['name'] . '</td>';
    if($i > 0 && $i % 5 == 0) {
        echo '</tr><tr>';
    }
}
echo '</tr></table><br /><a href="?node='.$parent.'">Up</a>';
?>
