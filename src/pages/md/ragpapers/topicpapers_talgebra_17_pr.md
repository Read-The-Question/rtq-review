---
slug: "ragpapers/topicpapers-talgebra-17-pr"
title: "TopicPaper - Algebra - 17 - PR"
date: 2022-09-21 20:40:31
questions_count: "1"
---
<ul class='question default-decimal'>
<li>
<div class='question_envelope rag_pr rag_prrl question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Chen writes down a two digit number. He finds that if he swaps the digits of the number round, the new number he creates is three more than one third of the original number.

What was the **original** number?

</div>
<div class='workings'>
<div class='working'>

As per the question,

original no. = a number between $11$ and $99$ ($2$ digits)

original no.  $>$ new number

the original no., the new number and $\dfrac {1}{3}$
are all multiples of $3$


</div>
<div class='working'>

Trial and error method

$12$ is the smallest $2$ digit number which is a multiple of $3$

certain combinations can be ruled out as the reverse is not near to $\dfrac {1}{3}$ of the original number

possible combinations:

$
\begin{aligned}
\quad \cancel{12-21}, \ 15-51, \ \cancel{18-81},\\\\ 
\cancel{24-42},\ 27-72, \ \cancel{36-63},\\\\
\cancel{39-93}, \ \cancel{45-54}, \ \cancel{48-84}
\end{aligned}
$

Let's try combination $1$ : $15$ and $51$ 

original number = $51$

$
\begin{aligned}
\dfrac {51}{3}  &= 17\\\\
17 + 3          &= 20 \text{ (wrong)}
\end{aligned}
$

Let's try combination $2$ : $27$ and $72$ 

original number = $72$

So reverse no. is,

$
\begin{aligned}
&=\dfrac {72}{3}+3\\\\
&= 27
\end{aligned}
$

$27$ and $472$ is the right combination. So $72$ is the original number.

</div>
<div class='working'>

Let the two digit number be $xy$

$x$ in the tenth place and $y$ in the unit place.

The original no. $= 10x + y$

The swapped no.  $= 10y + x$

As per the question, the new number is $3$ more than $\dfrac {1}{3}$ of the original number. 

The swapped no. $= 3 + \dfrac {(10y + x)}{3}$

i.e.  $= 10y + x = 3 + \dfrac {(10y + x)}{3}$

Let's solve

$
\begin{aligned}
3 + \dfrac{(10x + y)}{3} &= 10y + x \\\\
\dfrac{9 + (10x + y)}{3} &= 10y + x \\\\
           9 + (10x + y) &= (10y + x) \times 3 \\\\
             9 + 10x + y &= 30y + 3x \\\\
    9 + 10x + y -30y -3x &= 0 \\\\
            9 + 7x - 29y &= 0 \\\\
                 7x -29y &= -9 
\end{aligned}
$


The values $x$ and $y$ are between $0$ to $9$

On substituting the only possibility that matches

$
\begin{aligned}
 x                               &= 7 \\\\
 y                               &= 2 \\\\
(7 \times 7) - (29 \times 2)     &= -9 \\\\
49 - 58                          &= -9
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$72$

</div>
</div>

</div>
</li>
</ul>
