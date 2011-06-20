<h1>Snippets</h1>
<br />
<?php include('paginator.tpl.php'); ?>
<table>
<tr>
    <th>Id</th>
    <th>Language</th>
    <th>Title</th>
    <th>Tags</th>
    <th>Contents</th>
    <th>Memo</th>
    <th>Last Modified</th>
</tr>
<?php foreach ($pageItems as $item) { ?>
<tr>
    <td><?php e($item['id']) ?></td>
    <td><?php e($item['lang']) ?></td>
    <td><?php e($item['title']) ?></td>
    <td><?php e($item['tags']) ?></td>
    <td><?php e($item['contents']) ?></td>
    <td><?php e($item['memo']) ?></td>
    <td><?php e($item['lastmod']) ?></td>
</tr>
<?php } ?>
</table>
<?php include('paginator.tpl.php'); ?>
