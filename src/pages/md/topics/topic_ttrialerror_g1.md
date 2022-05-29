---
slug: "topics/topic-ttrialerror-g1"
title: "Topic - Trialerror - G1"
date: 2022-05-29 22:27:47
---
<ul class='question default-decimal'>
<li>
<div class='question_envelope rag_sc_g1 question'>
<div class='uuid'>
<p>E0DF26E4-1A30-4BCD-84C9-1C135AACA602</p>
</div>
<div class='topics'>
<ul>
<li>
tunassigned
</li>
<li>
ttrialerror
</li>
<li>
tfactor
</li>
<li>
tnumber
</li>
</ul>
</div>
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

<div class='papername'>
<p>eltham-college--11-plus--maths--2019--sample-paper-1</p>
</div>
<div class='rag'>
<p>rag_sc_g1</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_ad_g1 question'>
<div class='uuid'>
<p>D4788CA3-B338-4047-8521-069529293876</p>
</div>
<div class='topics'>
<ul>
<li>
tsequence
</li>
<li>
ttrialerror
</li>
</ul>
</div>
<div class='question question'>

Andy works out the sums of numbers as follows $1 + 2, 1 + 2 + 3, 1 + 2 + 3 + 4$ and so on. What is the first of these sums of numbers that is greater than $80$?

</div>
<div class='workings'>
<div class='working'>

This is a triangular number sequence.

Let's start with numbers starting with $= 10$.

As we need to find the sum adding up to $80$, let's start with first $10$ numbers.

We also use the result from the previous calculation to save effort.

| Number    |         Sum                                           | $> 80$
|:------:   |:----------------------------------------------------: | :-----:
|  $10$     | $1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 = \red{55}$   |  No
|  $11$     | $\text{Sum}(10) + 11 = \red{66}$                      |  No
|  $12$     | $\text{Sum}(11) + 12 = \red{78}$                      |  No
|  $11$     | $\text{Sum}(12) + 13 = \green{91}$                    |  Yes

Answer $= 91$

</div>
<div class='working'>

Is there any way other than using trial and error? This is a sum of whole numbers in a sequence and we can use the formula for the sum of whole numbers.

$\text{Sum} = \dfrac {n (n+1)}{2}$ 

Let's try for $n = 12$.

$
\begin{aligned}
&= \dfrac { 12 (12 + 1)}{2} \\\\
&= \dfrac { 12 \times 13 }{2} \\\\
&= \dfrac { 6 \times 2 \times 13 }{2} \\\\
&= \dfrac { 6 \times \cancel{2} \times 13 }{\cancel{2}} \\\\
&= 6 \times 13 \\\\
&= 78
\end{aligned}
$

$78$ is less than $80$, so let's try for $n = 13$.

$
\begin{aligned}
&= \dfrac { 13 (13 + 1)}{2} \\\\
&= \dfrac { 13 \times 14 }{2} \\\\
&= \dfrac { 13 \times 7 \times 2 }{2} \\\\
&= \dfrac { 13 \times 7 \times \cancel{2} }{\cancel{2}} \\\\
&= 13 \times 7 \\\\
&= 91
\end{aligned}
$

$91$ is greater than $80$.

Answer $= 91$

</div>
</div>
<div class='answers'>
<div class='answer'>

$91$

</div>
</div>

<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2012--arithmetic-1</p>
</div>
<div class='rag'>
<p>rag_ad_g1</p>
</div>
</div>
</li>
</ul>
