---
slug: "ragpapers/topicpapers-talgebra-17-pr-prccrl"
title: "TopicPaper - Algebra - 17 - PR - PRCCRL"
date: 2022-08-18 10:50:34
questions_count: "1"
---
<ul class='question default-decimal'>
<li>
<div class='question_envelope rag_pr rag_prccrl question'>
<div class='uuid'>
<p>10B05544-761B-457F-96DF-14CD6C641037</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2019--arithmetic-a:1:20</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_pr</p>
</div>
<div class='rag'>
<p>rag_wf_prccrl</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
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
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>As per the question,
<emptyline>
original no. = a number between $11$ and $99$ ($2$ digits)
<emptyline>
original no.  $>$ new number
<emptyline>
the original no., the new number and $\dfrac {1}{3}$
are all multiples of $3$
<emptyline>
</code></pre>
</div>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Trial and error method
<emptyline>
$12$ is the smallest $2$ digit number which is a multiple of $3$
<emptyline>
certain combinations can be ruled out as the reverse is not near to $\dfrac {1}{3}$ of the original number
<emptyline>
possible combinations:
<emptyline>
$
\begin{aligned}
\quad \cancel{12-21}, \ 15-51, \ \cancel{18-81},\\\\ 
\cancel{24-42},\ 27-72, \ \cancel{36-63},\\\\
\cancel{39-93}, \ \cancel{45-54}, \ \cancel{48-84}
\end{aligned}
$
<emptyline>
Let's try combination $1$ : $15$ and $51$ 
<emptyline>
original number = $51$
<emptyline>
$
\begin{aligned}
\dfrac {51}{3}  &= 17\\\\
17 + 3          &= 20 \text{ (wrong)}
\end{aligned}
$
<emptyline>
Let's try combination $2$ : $27$ and $72$ 
<emptyline>
original number = $72$
<emptyline>
So reverse no. is,
<emptyline>
$
\begin{aligned}
&=\dfrac {72}{3}+3\\\\
&= 27
\end{aligned}
$
<emptyline>
$27$ and $472$ is the right combination. So $72$ is the original number.
</code></pre>
</div>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let the two digit number be $xy$
<emptyline>
$x$ in the tenth place and $y$ in the unit place.
<emptyline>
The original no. $= 10x + y$
<emptyline>
The swapped no.  $= 10y + x$
<emptyline>
As per the question, the new number is $3$ more than $\dfrac {1}{3}$ of the original number. 
<emptyline>
The swapped no. $= 3 + \dfrac {(10y + x)}{3}$
<emptyline>
i.e.  $= 10y + x = 3 + \dfrac {(10y + x)}{3}$
<emptyline>
Let's solve
<emptyline>
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
<emptyline>

The values $x$ and $y$ are between $0$ to $9$
<emptyline>
On substituting the only possibility that matches
<emptyline>
$
\begin{aligned}
 x                               &= 7 \\\\
 y                               &= 2 \\\\
(7 \times 7) - (29 \times 2)     &= -9 \\\\
49 - 58                          &= -9
\end{aligned}
$
</code></pre>
</div>
</div>
<div class='answers'>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>$72$
</code></pre>
</div>
</div>


<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='10B05544-761B-457F-96DF-14CD6C641037' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='10B05544-761B-457F-96DF-14CD6C641037' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='10B05544-761B-457F-96DF-14CD6C641037' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='10B05544-761B-457F-96DF-14CD6C641037' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='10B05544-761B-457F-96DF-14CD6C641037' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='10B05544-761B-457F-96DF-14CD6C641037' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='10B05544-761B-457F-96DF-14CD6C641037' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='10B05544-761B-457F-96DF-14CD6C641037' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='10B05544-761B-457F-96DF-14CD6C641037' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='PR' data-uuid='10B05544-761B-457F-96DF-14CD6C641037' id='FORM-10B05544-761B-457F-96DF-14CD6C641037' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-10B05544-761B-457F-96DF-14CD6C641037'>Initial</p>
</div>
</div>
</li>
</ul>
