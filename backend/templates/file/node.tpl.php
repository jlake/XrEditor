<h1>Node management</h1>

Action:
<b><?php e($action); ?></b>
<br />
Result:<br />
<b>
<?php
    if($error) {
        e($error);
    } else {
        e('OK');
    }
?>
</b>