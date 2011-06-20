<?php if($totalItemCount > 1) { ?>
<p><strong><?php e($firstItemNumber) ?></strong>件から<strong><?php e($lastItemNumber) ?></strong>件 （検索結果<strong><?php e($totalItemCount) ?></strong>件中）</p>
<?php } ?>
<?php if($pageCount > 1) { ?>
<div class="pagenation">
    <?php if($page > 1) { ?>
      <a href="<?php e($baseUrl) ?>page=<?php e($page - 1) ?>">前ページ</a>
    <?php } else { ?>
      <span class="disabled">前ページ</span>
    <?php } ?>

    <?php for($i = $startPage; $i<=$endPage; $i++) { ?>
        <?php if($i == $page) { ?>
            <span class="disabled"><?php e($i) ?></span>
        <?php } else { ?>
            <a href="<?php e($baseUrl) ?>page=<?php e($i) ?>"><?php e($i) ?></a>
        <?php } ?>
    <?php } ?>

    <?php if($page < $pageCount) { ?>
      <a href="<?php e($baseUrl) ?>page=<?php e($page + 1) ?>">次ページ</a>
    <?php } else { ?>
      <span class="disabled">次ページ</span>
    <?php } ?>
</div>
<?php } ?>
