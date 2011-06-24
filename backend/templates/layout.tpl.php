<html>
    <head>
    <title><?php e($title); ?></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link rel="stylesheet" href="/xreditor/css/backend.css" />
<?php foreach ($styles as $style): ?>
    <link rel="stylesheet" href="<?php e($style); ?>" />
<?php endforeach; ?>
<?php foreach ($scripts as $script): ?>
    <script type="text/javascript" src="<?php e($script); ?>"></script>
<?php endforeach; ?>
<?php foreach ($onload as $javascript): ?>
    <script type="text/javascript">
        <?php echo $javascript; ?>
    </script>
<?php endforeach; ?>
    </head>
    <body>
        <header>
            <h1>XrEditor backend</h1>
            <a href="<?php e(BACKEND_BASEURL); ?>">Home</a>
        </header>
        <hr />
        <?php echo $content; ?>
    </body>
</html>
