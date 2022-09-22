---
slug: "ragpapers/topicpapers-tsequence-6-pr-prrl"
title: "TopicPaper - Sequence - 6 - PR - PRRL"
date: 2022-09-21 20:40:31
questions_count: "1"
---
<ul class='question default-decimal'>
<li>
<div class='question_envelope rag_pr rag_prrl question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

| Pattern Number     |   Pattern     | Number of Blocks     |
|:--------------:    |-------------- |:----------------:    |
|       $1$          |               |        $1$           |
|       $2$          |               |        $4$           |
|       $3$          |               |      ......          |
|       $4$          |               |      .......         |


Fill in the total number of blocks in pattern numbers $3$ and $4$. Without drawing a diagram what is the total number of blocks on the $8^{th}$ pattern?

</div>
<div class='workings'>
<div class='working'>

| Pattern Number     |   Pattern           | Number of Blocks     |
|:--------------:    |-------------------  |:----------------:    |
|       $1$          |  $1$                |        $1$           |
|       $2$          |  $1 + 3 = 2^2$      |        $4$           |
|       $3$          |  $4 + 5 = 3^2$      |        $9$           |
|       $4$          |  $9 + 7 = 4^2$      |        $16$          |
|       $5$          |  $16 + 9 = 5^2$     |        $25$          |
|       $6$          |  $25 + 11 = 6^2$    |        $36$          |
|       $7$          |  $36 + 13 = 7^2$    |        $49$          |
|       $8$          |  $49 + 15 = 8^2$    |        $64$          |

Total number of blocks on the $8^{th}$ pattern $= 64$

</div>
</div>
<div class='answers'>
<div class='answer'>

$64$

</div>
</div>

</div>
</li>
</ul>
