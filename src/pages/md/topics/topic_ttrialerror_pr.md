---
slug: "topics/topic-ttrialerror-pr"
title: "Topic - Trialerror - PR"
date: 2022-05-28 13:42:11
---
<ul class='question default-decimal'>
<li>
<div class='question_envelope rag_np_pr question'>
<div class='uuid'>
<p>B281E4BD-D74F-47C1-9CA7-E354CB7604AA</p>
</div>
<div class='topics'>
<ul>
<li>
ttrialerror
</li>
</ul>
</div>
<div class='question question'>

In arithmetic questions, any calculations inside brackets are carried out first.

Put brackets in to make this calculation correct:

$3 + 5 \times 2 + 3 = 40$

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
&= 3 + 5 \times 2 + 3 \\\\
&= 3 + (5 \times 2) + 3 \\\\
&= 3 + (5 \times 2) + 3
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$3 + (5 \times 2) + 3$

</div>
</div>

<div class='papername'>
<p>alderley-edge-school-for-girls--11-plus--maths--2019--sample-paper-1</p>
</div>
<div class='rag'>
<p>rag_np_pr</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_np_pr question'>
<div class='uuid'>
<p>F7F2FFC1-D62D-4514-9BEE-0D066D637BB9</p>
</div>
<div class='topics'>
<ul>
<li>
ttrialerror
</li>
</ul>
</div>
<div class='question question'>

Put brackets in this calculation to make it correct:

$3 \times 4 - 2 + 3 = 9$

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
& 3 \times 4 - 2 + 3 = 9 \\\\
& 3 \times (4 - 2) + 3 \\\\
& (3 \times (4 - 2)) + 3 \\\\
& (3 \times (4 - 2)) + 3 \\\\
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$ (3 \times (4 - 2)) + 3 = 9$

</div>
</div>

<div class='papername'>
<p>alderley-edge-school-for-girls--11-plus--maths--9999--sample-paper-2</p>
</div>
<div class='rag'>
<p>rag_np_pr</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_ga_pr question'>
<div class='uuid'>
<p>74DBCD36-37BB-4856-BF34-7C3AA8E7DF0E</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
<li>
tarea
</li>
<li>
tquadraticprompt
</li>
<li>
tperimeter
</li>
<li>
ttrialerror
</li>
</ul>
</div>
<div class='question question'>

The area of a rectangle is $72$ square centimetres. The length of the rectangle is $1 \ \text{cm}$ more than the width.

Work out the length of the perimeter of the rectangle.

</div>
<div class='workings'>
<div class='working'>

Let the width of the rectangle in ($\text{cm}$) $= a$

Then, as per the question, the length of the rectangle in ($\text{cm}$) $= a +1$

$\text{Area} = \text{length} \times \text{width}$

Equating dimensions to the area, we get

$a \times (a + 1) = 72$

This is a quadratic equation and we can infer the value for $a$ by looking at the factors for $72$.

*Note: Solving quadratic equations is beyond the scope and any such equations can be easily inferred by trial and error method.*

$
\begin{aligned}
a \times (a + 1)    &= 72 \\\\
8 \times (8 + 1)    &= 72 \\\\
8 \times 9          &= 72  \\\\
a                   &= 8  \ \text{cm}
\end{aligned}
$

Let's find the perimeter of the rectangle.

$
\begin{aligned}
\text{Perimeter}    &= 2 \times (\text{length} + \text{width}) \\\\
                    &= 2 \times (a + a + 1) \\\\
                    &= 2 \times (8 + 8 + 1) \\\\
                    &= 2 \times 17 \\\\
                    &= 34 \ \text{cm}
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$34 \ \text{cm}$

</div>
</div>

<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2011--arithmetic-1</p>
</div>
<div class='rag'>
<p>rag_ga_pr</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_ad_pr question'>
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
<p>rag_ad_pr</p>
</div>
</div>
</li>
</ul>
