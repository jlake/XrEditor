<h1>Images</h1>
<br />
<?php
echo '<b>Node:'.$node.'</b><br /><table><tr>';
foreach ($images as $i => $image) {
    if($image['type'] == 'dir') {
        echo '<td align="center" valign="bottom"><a href="?node='.$image['node'].'"><img src="'.$image['url'].'" /><br />' . $image['name'] . '</td>';
    } else {
        echo '<td align="center" valign="bottom"><img src="'.$image['url'].'" width="160" height="120" /><br />' . $image['name'] . '</td>';
    }
    if($i > 0 && $i % 5 == 0) {
        echo '</tr><tr>';
    }
}
echo '</tr></table><br /><a href="?node='.$parent.'">Up</a>';
?>
