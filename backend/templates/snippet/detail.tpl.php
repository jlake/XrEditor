<h1>Snippets Detail</h1>
<br />
<table>
<tr>
    <th align="right">Id: </th>
    <td><?php e($detail['id']) ?></td>
</tr>
<tr>
    <th align="right">Language: </th>
    <td><?php e($detail['lang']) ?></td>
</tr>
<tr>
    <th align="right">Title: </th>
    <td><?php e($detail['title']) ?></td>
</tr>
<tr>
    <th align="right">Tags: </th>
    <td><?php e($detail['tags']) ?></td>
</tr>
<tr>
    <th align="right">Code: </th>
    <td><?php e($detail['code']) ?></td>
</tr>
<tr>
    <th align="right">Memo: </th>
    <td><?php e($detail['memo']) ?></td>
</tr>
<tr>
    <th align="right">Last Modified: </th>
    <td><?php e($detail['lastmod']) ?></td>
</tr>
</table>
<br />
<a href="<?php e(url('../list')); ?>">List</a>