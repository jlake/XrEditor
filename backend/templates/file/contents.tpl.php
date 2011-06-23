<h1>File Contents</h1>
<br />
<?php
echo '<b>Node:'.$node.'</b><br /><br />';
echo '<pre>'.htmlspecialchars($contents['contents'], ENT_QUOTES).'</pre>';
echo '<br /><br /><a href="'.url('..').'?node='.$parent.'">Up</a>';
?>
