<h1>Snippets List</h1>
<br />
<?php include(realpath(dirname(__FILE__).'/../paginator.tpl.php')); ?>
<table>
<tr>
    <th>Id</th>
    <th>Language</th>
    <th>Title</th>
    <th>Tags</th>
    <th>Last Modified</th>
    <th>&nbsp;</th>
</tr>
<?php foreach ($pageItems as $item) { ?>
<tr>
    <td><?php e($item['id']) ?></td>
    <td><?php e($item['lang']) ?></td>
    <td><?php e($item['title']) ?></td>
    <td><?php e($item['tags']) ?></td>
    <td><?php e($item['lastmod']) ?></td>
    <td><a href="<?php e(url('detail', array('id' => $item['id']))); ?>">Detail</a></td>
</tr>
<?php } ?>
</table>
<?php include(realpath(dirname(__FILE__).'/../paginator.tpl.php')); ?>
