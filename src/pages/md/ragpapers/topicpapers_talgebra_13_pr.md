---
slug: "ragpapers/topicpapers-talgebra-13-pr"
title: "TopicPaper - Algebra - 13 - PR"
date: 2022-10-04 10:03:20
questions_count: "3"
---
<ul class='question default-decimal'>
<li>
<div class='question_envelope rag_pr rag_prrl question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Billy is given some toffees by his father. 
He eats one and then shares the rest out equally between himself and Emily. 
He then eats another and then shares the rest out equally between himself and Detti. 
He eats one more and gives the last one to Sean.

![the-london-independent-girls-schools-consortium--11-plus--maths--2008--group-1/section-1-question-42-00.png](/assets/the-london-independent-girls-schools-consortium--11-plus--maths--2008--group-1/section-1-question-42-00.png "the-london-independent-girls-schools-consortium--11-plus--maths--2008--group-1/section-1-question-42-00.png")

</div>
<div class='workings'>
<div class='working placeholder'>

TODOWORKING

</div>
</div>
<div class='answers'>
<div class='answer placeholder'>

TODOANSWER

</div>
</div>
<ul class='subquestion lower-alpha'>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

How many toffees did Detti get?

</div>
<div class='workings'>
<div class='working'>

Let the number of toffees $= a$

As per the question,

After eating $1$ and dividing it equally with emily, toffees left $= b = \dfrac{(a-1)}{2}$

Again after eating one and dividing it equally with Detti, toffees left $= c = \dfrac{b-1}{2}$

After eating one and giving last to Sean, toffees left $= c - 1 -1 = 0$

So,

$
\begin{aligned}
c - 1 -1 &= 0 \\\\
c        &= 2 \\\\
\end{aligned}
$

Number of toffees detti got $= 2$


</div>
</div>
<div class='answers'>
<div class='answer'>

$2$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

How many toffees did Emily get?

</div>
<div class='workings'>
<div class='working'>

Number of toffees Emily got $= b$

$
\begin{aligned}
\dfrac{b-1}{2} &= c \\\\
\dfrac{b-1}{2} &= 2 \\\\
b - 1          &= 2 \times 2 \\\\
b - 1          &= 4 \\\\
b              &= 4 + 1 \\\\
b              &= 5
\end{aligned}
$

Number of toffees Emily got $= 5$


</div>
</div>
<div class='answers'>
<div class='answer'>

$5$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

How many toffees did Billy have at the start?

</div>
<div class='workings'>
<div class='working'>

Number of toffees Billy had $= a$

As per the question,

$
\begin{aligned}
\dfrac{a-1}{2}  &= b \\\\
\dfrac{a-1}{2}  &= 5 \\\\
a - 1           &= 5 \times 2 \\\\
a - 1           &= 10 \\\\
a               &= 11 
\end{aligned}
$

Number toffees in the start $= 11$

</div>
</div>
<div class='answers'>
<div class='answer'>

$11$

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

At a party all the children were put into groups of $4$ to play a game. Two children had to sit out.

For another game they were put into groups of $5$, Two children had to sit out.

For the next game they were put into groups of $6$. No one had to sit out.

How many children were at the party?

</div>
<div class='workings'>
<div class='working'>

Let the number of children $= n$

When the number is divided by $4$ number of children left $= 2$

When the number is divided by $5$ number of children left $= 2$

The number  $=$ LCM of $(4,5)n$ + 2 

We can easily infer their values by using trial and error. Let's find the number which meets the following critiera below.

- The number $= 20n + 2$.

- The number is a multiple of $6$.

|     n     |  value of the equation| Multiple of $6$  |
|:---------:|:---------------------:|:----------------:|
|   $1$     |       $22$            |        No        |
|   $2$     |       $42$            |        Yes       |
|   $3$     |       $62$            |        No        |
|   $4$     |       $82$            |        No        |
|   $5$     |       $102$           |        No        |

A quick check shows n $=2$ satisfies all the criteria above

$
\begin{aligned}
\text {Number of children in the party} &= 20 \times 2 + 2 \\\\
								        &= 40 + 2 \\\\
								        &= 42 
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$122$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prrl question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Amir, Anna and Arjun have bought some fruit at a market stall.

Amir bought $2$ Pears and $1$ Mango for $\pounds 1.35$

Anna bought $1$ Pear and $2$ Mangos for $\pounds 1.20$

Arjun bought $1$ Pear, $1$ Mango and $1$ Apple for $\pounds 1$

How much, in pence, did the apple cost?

</div>
<div class='workings'>
<div class='working'>

Let the price of pear $= p$

Let the price of Mango $= m$

Let the price of apple $= a$

As per the question,

$
\begin{aligned}
2p + m    &= 1.35 \\\\
p + 2m    &= 1.20 \\\\
p + m + a &= 1
\end{aligned}
$

For calculating the cost of apple we will have to use elimination method. So lets add eqaution 1 and equation 2 first

$
\begin{aligned}
2p + m + p + 2m   &= 1.35 + 1.20 \\\\
3p + 3m           &= 2.55 \\\\
3(p + m)          &= 2.55 \\\\
p + m             &= \dfrac{2.55}{3} \\\\
p + m             &= 0.85
\end{aligned}
$

Now we have,

$
\begin{aligned}
p + m + a         &= 1 \\\\
p + m             &= 0.85 
\end{aligned}
$

So now, using elimination method on the above two equations

$
\begin{aligned}
p + m + a - (p + m) &= 1 - 0.85 \\\\
p + m + a - p - m   &= 1 - 0.85 \\\\
a                   &= \pounds 0.15 \\\\
a                   &= 0.15 \times 100 \text{p} \\\\ 
a                   &= 15 \text{p}
\end{aligned}
$

Therefore, the cost of an apple $= 15$ p


</div>
</div>
<div class='answers'>
<div class='answer placeholder'>

TODOANSWER

</div>
</div>

</div>
</li>
</ul>
