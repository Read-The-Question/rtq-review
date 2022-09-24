---
slug: "ragpapers/topicpapers-tinfer-2-g0"
title: "TopicPaper - Infer - 2 - G0"
date: 2022-09-24 04:59:20
questions_count: "1"
---
<ul class='question default-decimal'>
<li>
<div class='question_envelope rag_g0 rag_prcr question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Sarah has theses digits cards:

$\boxed{5} \quad \boxed{2} \quad \boxed{4}$

She makes a $2$-digit number and $1$-digit number using all the cards.
She multiplies them together.
Her answer is the multiple of $3$.

Which of the following could NOT be a possible answer?

-  $25 \times 4$
-  $42 \times 5$
-  $54 \times 2$
-  $24 \times 5$

</div>
<div class='workings'>
<div class='working'>

We know that a number is a multiple of 3 if the cross sum of the digits is divisible by 3.

| Number    |         Sum                                           | Divisible $3$
|:------:   |:----------------------------------------------------: | :-----:
|  $25$     | $2 + 5 = \green{7}$                                   |  No
|  $42$     | $4 + 2 = \red{6}$                                     |  Yes
|  $54$     | $5 + 4 = \red{9}$                                     |  Yes
|  $24$     | $2 + 4 = \red{6}$                                     |  Yes

The answer that could not be possible $= 25 \times 4$

</div>
</div>
<div class='answers'>
<div class='option'>
<p>A</p>
</div>
<div class='answer'>

$25 \times 4$

</div>
</div>

</div>
</li>
</ul>
