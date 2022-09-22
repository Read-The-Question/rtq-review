---
slug: "ragpapers/topicpapers-tmoney-1-pr-prrl"
title: "TopicPaper - Money - 1 - PR - PRRL"
date: 2022-09-21 20:40:31
questions_count: "3"
---
<ul class='question default-decimal'>
<li>
<div class='question_envelope rag_pr rag_prrl question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Find the smallest amount of money that cannot be paid using three or fewer British coins.

</div>
<div class='workings'>
<div class='working'>

The British coins are $1 \text {p}, \ 2 \text {p}, \ 5 \text {p}, \ 10 \text {p}, \ 20 \text {p}, \ 50 \text {p}, \ 100 \text {p}, \ 200 \text {p}$.

With one coin, the smallest amount that can’t be made $= 3$.

With two coins, the smallest amount that can’t be made $= 3 +$ the value of the coin where there is a gap of at least three to the next coin.

So, With two coins, the smallest amount that can’t be made $= 3 + 5 = 8 \text {p}$.

So, With three coins, the smallest amount that can’t be made $= 8 +$ the value of the coin where the gap is bigger than eight to the next coin.

$
\begin {aligned}
\text {Smallest amount}     &= 8 + 10 \\\\
                            &= 18 \text {p}
\end {aligned}
$

The smallest amount of money that cannot be paid using three or fewer British coins $= 18 \text {p}$

</div>
</div>
<div class='answers'>
<div class='answer'>

$18 \text {p}$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prrl question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

The cost in pounds, $C$, of going to the cinema can be worked out using the formula

$C = 8a + 3k$

In this formula $a$ stands for the number of adults and $k$ stands for the number of children.

</div>
<div class='workings'>
<div class='working'>

%empty%

</div>
</div>
<div class='answers'>
<div class='answer'>

%empty%

</div>
</div>
<ul class='subquestion lower-alpha'>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

What is the cost if three adults and one child go to the cinema?

</div>
<div class='workings'>
<div class='working'>

As per the question,

$
\begin {aligned}
\text {Total Cost}  &= 8a + 3k \\\\
                    &= 8 \times 3 + 3 \times 1 \\\\
                    &= 24 + 3 \\\\
                    &= \pounds 27
\end {aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$\pounds 27$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

The total cost for the Bryant family is $\pounds 25$. How many adults and how many children are in the family?

</div>
<div class='workings'>
<div class='working'>

As per the question,

The maximum count of adult tickets possible with $\pounds 25 = 2$

$
\begin {aligned}
8 \times 2 + 3k     &= 25 \\\\
16 + 3k             &= 25 \\\\
3k                  &= 25 - 16 \\\\
3k                  &= 9 \\\\
k                   &= \dfrac {9} {3} \\\\
k                   &= \dfrac {3 \times 3} {3} \\\\
k                   &= \dfrac {3 \times \cancel {3}} {\cancel {3}} \\\\
k                   &= 3
\end {aligned}
$

Bryant family has,

$
\begin {aligned}
\text {Adults}      &= 2 \\\\
\text {Children}    &= 3
\end {aligned}
$

</div>
<div class='working'>

This can be inferred by using trial and error.

Let's find the maximum number of adult tickets that can be bought with $\pounds 25$.

$
\begin {aligned}
\dfrac {\text {Total money}} {\text {Cost per adult}}   &= \text {No. of adult tickets} \\\\
\pounds \dfrac {25} {8}                                 &= \text {No. of adult tickets} \\\\
\dfrac {8 \times 3 + 1} {8}                             &= 3 \ \text {adult tickets}  + \text {Rest} \ \pounds 1
\end {aligned}
$

For $\pounds 1$ we cannot buy any child ticket. Let's reduce $1$ adult ticket and buy child tickets.

$
\begin {aligned}
8 \times 2 \ \text {adults}     &= \pounds 16 \\\\
\pounds 25 - \pounds 16         &= \pounds 9
\end {aligned}
$

Let's find the maximum number of child tickets that can be bought with $\pounds 9$

$
\begin {aligned}
\dfrac {\text {Total money}} {\text {Cost per child}}   &= \text {No. of child tickets} \\\\
\pounds \dfrac {9} {3}                                  &= 3 \ \text {tickets}
\end {aligned}
$

$8 \times 2 + 3 \times 3 = \pounds 25$

Bryant family has,

$
\begin {aligned}
\text {Adults}      &= 2 \\\\
\text {Children}    &= 3
\end {aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

Adult $=$ $2$

</div>
<div class='answer'>

Children $=$ $3$

</div>
</div>

</div>
</li>
</ul>
</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prrl question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

A calculator is used to divide $\pounds 17.20$ by $9$. The display shows $1.91111111$. How much is $\pounds 17.20 \div 9$, 
to the nearest penny?

</div>
<div class='workings'>
<div class='working'>

$
\begin {aligned}
&= \pounds 17.20 \div 9 \\\\
&= \dfrac {17.20} {9} \\\\
&= \pounds 1.911
\end {aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$\pounds 1.911$

</div>
</div>

</div>
</li>
</ul>
