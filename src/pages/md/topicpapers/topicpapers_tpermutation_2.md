---
slug: "topicpapers/topicpapers-tpermutation-2"
title: "TopicPaper - Permutation - 2"
date: 2022-07-11 18:04:07
---
<div class='paper'>
<div class='meta'>
<h3>boys</h3>
<h3>foot</h3>
<h3>Topic</h3>
<h3></h3>
<h3>TODO</h3>
</div>

# Section A
<ul class='question decimal'>
<li>
<div class='question_envelope rag_g0 rag_prcr question'>
<div class='uuid'>
<p>8BEE82C0-3EF8-4B6D-B5D5-530F6AF9A74E</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2014--arithmetic-a:1:19</p>
</div>
<div class='rag'>
<p>Waffles Woof</p>
</div>
<div class='rag'>
<p>rag_wf_g0</p>
</div>
<div class='rag'>
<p>rag_wf_prcr</p>
</div>
<div class='topics'>
<ul>
<li>
tpermutation
</li>
</ul>
</div>
<div class='question question'>

How many ODD three digit numbers is it possible to make using the 
numbers $4, 5$ and $7$ if you are allowed to use each of the 
numbers more than once in a particular three digit number?

</div>
<div class='workings'>
<div class='working'>

Since it is an odd number, only $5$ and $7$ can be used in the unit place.

When the three digit number ends in $5$, the possible options are:

- $445$
- $555$
- $775$
- $455$
- $545$
- $475$
- $745$
- $575$
- $755$

Count $= 9$

When the three digit number ends in $7$, the possible options are:

- $447$
- $557$
- $777$
- $457$
- $547$
- $477$
- $747$
- $577$
- $757$


Count $= 9$
 
$
\begin{aligned} 
\text{Total Count} &= 9 + 9 \\\\\
            &= 18
\end{aligned}
$

</div>
<div class='working'>

We can also solve this problem using permutation instead of manually counting all the arrangements.

Since it is an odd number, only $5$ and $7$ can be used in the unit place.

The count of digits that can be used in the hundreds place    $= 3$

The count of digits that can be used in the tens place        $= 3$

The count of digits that can be used in the unit place        $= 2$

$
\begin{aligned} 
\text{Total Arrangements}                           &= 3 \times 3 \times 2 \\\\\
                                                    &= 18
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$18$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Since it is an odd number, only $5$ and $7$ can be used in the unit place.

When the three digit number ends in $5$, the possible options are:

- $445$
- $555$
- $775$
- $455$
- $545$
- $475$
- $745$
- $575$
- $755$

Count $= 9$

When the three digit number ends in $7$, the possible options are:

- $447$
- $557$
- $777$
- $457$
- $547$
- $477$
- $747$
- $577$
- $757$


Count $= 9$
 
$
\begin{aligned} 
\text{Total Count} &= 9 + 9 \\\\\
            &= 18
\end{aligned}
$
</code></pre>
</div>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>We can also solve this problem using permutation instead of manually counting all the arrangements.

Since it is an odd number, only $5$ and $7$ can be used in the unit place.

The count of digits that can be used in the hundreds place    $= 3$

The count of digits that can be used in the tens place        $= 3$

The count of digits that can be used in the unit place        $= 2$

$
\begin{aligned} 
\text{Total Arrangements}                           &= 3 \times 3 \times 2 \\\\\
                                                    &= 18
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
<pre class='language-latex'><code class='language-latex'>$18$
</code></pre>
</div>
</div>


<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-sheet='G0' data-uuid='8BEE82C0-3EF8-4B6D-B5D5-530F6AF9A74E' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-sheet='G0' data-uuid='8BEE82C0-3EF8-4B6D-B5D5-530F6AF9A74E' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-sheet='G0' data-uuid='8BEE82C0-3EF8-4B6D-B5D5-530F6AF9A74E' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-sheet='G0' data-uuid='8BEE82C0-3EF8-4B6D-B5D5-530F6AF9A74E' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-sheet='G0' data-uuid='8BEE82C0-3EF8-4B6D-B5D5-530F6AF9A74E' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-sheet='G0' data-uuid='8BEE82C0-3EF8-4B6D-B5D5-530F6AF9A74E' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-sheet='G0' data-uuid='8BEE82C0-3EF8-4B6D-B5D5-530F6AF9A74E' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-sheet='G0' data-uuid='8BEE82C0-3EF8-4B6D-B5D5-530F6AF9A74E' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-sheet='G0' data-uuid='8BEE82C0-3EF8-4B6D-B5D5-530F6AF9A74E' id='FORM-8BEE82C0-3EF8-4B6D-B5D5-530F6AF9A74E' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-8BEE82C0-3EF8-4B6D-B5D5-530F6AF9A74E'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_g0 rag_prcr question'>
<div class='uuid'>
<p>C2A67BE9-CA1F-4D65-BB49-B74EA17783C6</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2014--arithmetic-a:1:20</p>
</div>
<div class='rag'>
<p>Waffles Woof</p>
</div>
<div class='rag'>
<p>rag_wf_g0</p>
</div>
<div class='rag'>
<p>rag_wf_prcr</p>
</div>
<div class='topics'>
<ul>
<li>
tpermutation
</li>
</ul>
</div>
<div class='question question'>

The number $3$ can be split in three different ways by adding positive whole numbers together as follows

$1 + 2, \quad 2 + 1 \quad$ and $\quad 1 + 1 + 1$.

Using the same method, in how many different ways can the number $5$ be split?

</div>
<div class='workings'>
<div class='working'>

When using $4$ and any smaller number, the possible options are:

- $4 + 1$
- $1 + 4$

Count $= 2$

When using $3$ and any smaller number, the possible options are:

- $3 + 2$
- $2 + 3$
- $3 + 1 + 1$
- $1 + 3 + 1$
- $1 + 1 + 3$

Count $= 5$

When using $2$ and any smaller number, the possible options are:

- $2 + 2 + 1$
- $2 + 1 + 2$
- $1 + 2 + 2$
- $2 + 1 + 1 + 1$
- $1 + 2 + 1 + 1$
- $1 + 1 + 2 + 1$
- $1 + 1 + 1 + 2$

Count $= 7$

When using $1$ and any smaller number, the possible options are:

- $1 + 1 + 1 + 1 + 1$

Count $= 1$

 
$
\begin{aligned} 
\text{Total Count} &= 2 + 5 + 7 + 1 \\\\
            &= 15
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$15$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>When using $4$ and any smaller number, the possible options are:

- $4 + 1$
- $1 + 4$

Count $= 2$

When using $3$ and any smaller number, the possible options are:

- $3 + 2$
- $2 + 3$
- $3 + 1 + 1$
- $1 + 3 + 1$
- $1 + 1 + 3$

Count $= 5$

When using $2$ and any smaller number, the possible options are:

- $2 + 2 + 1$
- $2 + 1 + 2$
- $1 + 2 + 2$
- $2 + 1 + 1 + 1$
- $1 + 2 + 1 + 1$
- $1 + 1 + 2 + 1$
- $1 + 1 + 1 + 2$

Count $= 7$

When using $1$ and any smaller number, the possible options are:

- $1 + 1 + 1 + 1 + 1$

Count $= 1$

 
$
\begin{aligned} 
\text{Total Count} &= 2 + 5 + 7 + 1 \\\\
            &= 15
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
<pre class='language-latex'><code class='language-latex'>$15$
</code></pre>
</div>
</div>


<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-sheet='G0' data-uuid='C2A67BE9-CA1F-4D65-BB49-B74EA17783C6' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-sheet='G0' data-uuid='C2A67BE9-CA1F-4D65-BB49-B74EA17783C6' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-sheet='G0' data-uuid='C2A67BE9-CA1F-4D65-BB49-B74EA17783C6' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-sheet='G0' data-uuid='C2A67BE9-CA1F-4D65-BB49-B74EA17783C6' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-sheet='G0' data-uuid='C2A67BE9-CA1F-4D65-BB49-B74EA17783C6' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-sheet='G0' data-uuid='C2A67BE9-CA1F-4D65-BB49-B74EA17783C6' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-sheet='G0' data-uuid='C2A67BE9-CA1F-4D65-BB49-B74EA17783C6' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-sheet='G0' data-uuid='C2A67BE9-CA1F-4D65-BB49-B74EA17783C6' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-sheet='G0' data-uuid='C2A67BE9-CA1F-4D65-BB49-B74EA17783C6' id='FORM-C2A67BE9-CA1F-4D65-BB49-B74EA17783C6' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-C2A67BE9-CA1F-4D65-BB49-B74EA17783C6'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_g0 rag_prcr question'>
<div class='uuid'>
<p>3A2365AD-70B7-45DF-8397-B6EF9E526FF8</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2017--arithmetic-a:1:20</p>
</div>
<div class='rag'>
<p>Waffles Woof</p>
</div>
<div class='rag'>
<p>rag_wf_g0</p>
</div>
<div class='rag'>
<p>rag_wf_prcr</p>
</div>
<div class='topics'>
<ul>
<li>
tpermutation
</li>
</ul>
</div>
<div class='question question'>

Two crosses can be put in three squares in three different ways, as follows.

![missing image](/papers/missing_image.svg)


![missing image](/papers/missing_image.svg)


![missing image](/papers/missing_image.svg)


In how many different ways can you put three crosses in five squares?

</div>
<div class='workings'>
<div class='working'>

Let's find all the possible ways to put $3$ crosses in $5$ squares.

$\large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} } \ \large { \boxed {0} } \ \large { \boxed {0} }$

$\large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} } \ \large { \boxed {0} } \ \large { \boxed {\text{X}} } \ \large { \boxed {0} }$

$\large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} } \ \large { \boxed {0} } \ \large { \boxed {0} } \ \large { \boxed {\text{X}} }$

$\large { \boxed {\text{X}} } \ \large { \boxed {0} } \ \large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} } \ \large { \boxed {0} }$

$\large { \boxed {\text{X}} } \ \large { \boxed {0} } \ \large { \boxed {\text{X}} } \ \large { \boxed {0} } \ \large { \boxed {\text{X}} }$

$\large { \boxed {\text{X}} } \ \large { \boxed {0} } \ \large { \boxed {0} } \ \large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} }$

$\large { \boxed {0} } \ \large { \boxed {0} } \ \large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} }$

$\large { \boxed {0} } \ \large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} } \ \large { \boxed {0} }$

$\large { \boxed {0} } \ \large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} } \ \large { \boxed {0} } \ \large { \boxed {\text{X}} }$

$\large { \boxed {0} } \ \large { \boxed {\text{X}} } \ \large { \boxed {0} } \ \large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} }$

Total options $= 10$

</div>
</div>
<div class='answers'>
<div class='answer'>

$10$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let's find all the possible ways to put $3$ crosses in $5$ squares.

$\large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} } \ \large { \boxed {0} } \ \large { \boxed {0} }$

$\large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} } \ \large { \boxed {0} } \ \large { \boxed {\text{X}} } \ \large { \boxed {0} }$

$\large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} } \ \large { \boxed {0} } \ \large { \boxed {0} } \ \large { \boxed {\text{X}} }$

$\large { \boxed {\text{X}} } \ \large { \boxed {0} } \ \large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} } \ \large { \boxed {0} }$

$\large { \boxed {\text{X}} } \ \large { \boxed {0} } \ \large { \boxed {\text{X}} } \ \large { \boxed {0} } \ \large { \boxed {\text{X}} }$

$\large { \boxed {\text{X}} } \ \large { \boxed {0} } \ \large { \boxed {0} } \ \large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} }$

$\large { \boxed {0} } \ \large { \boxed {0} } \ \large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} }$

$\large { \boxed {0} } \ \large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} } \ \large { \boxed {0} }$

$\large { \boxed {0} } \ \large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} } \ \large { \boxed {0} } \ \large { \boxed {\text{X}} }$

$\large { \boxed {0} } \ \large { \boxed {\text{X}} } \ \large { \boxed {0} } \ \large { \boxed {\text{X}} } \ \large { \boxed {\text{X}} }$

Total options $= 10$
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
<pre class='language-latex'><code class='language-latex'>$10$
</code></pre>
</div>
</div>


<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-sheet='G0' data-uuid='3A2365AD-70B7-45DF-8397-B6EF9E526FF8' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-sheet='G0' data-uuid='3A2365AD-70B7-45DF-8397-B6EF9E526FF8' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-sheet='G0' data-uuid='3A2365AD-70B7-45DF-8397-B6EF9E526FF8' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-sheet='G0' data-uuid='3A2365AD-70B7-45DF-8397-B6EF9E526FF8' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-sheet='G0' data-uuid='3A2365AD-70B7-45DF-8397-B6EF9E526FF8' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-sheet='G0' data-uuid='3A2365AD-70B7-45DF-8397-B6EF9E526FF8' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-sheet='G0' data-uuid='3A2365AD-70B7-45DF-8397-B6EF9E526FF8' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-sheet='G0' data-uuid='3A2365AD-70B7-45DF-8397-B6EF9E526FF8' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-sheet='G0' data-uuid='3A2365AD-70B7-45DF-8397-B6EF9E526FF8' id='FORM-3A2365AD-70B7-45DF-8397-B6EF9E526FF8' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-3A2365AD-70B7-45DF-8397-B6EF9E526FF8'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_blocked rag_prns question'>
<div class='uuid'>
<p>64D05414-BEA8-4226-8051-BDA5464DA810</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2018--arithmetic-a:1:18</p>
</div>
<div class='rag'>
<p>Waffles Woof</p>
</div>
<div class='rag'>
<p>rag_wf_blocked</p>
</div>
<div class='rag'>
<p>rag_wf_prns</p>
</div>
<div class='topics'>
<ul>
<li>
tpermutation
</li>
</ul>
</div>
<div class='question question'>

In how many different ways can the letters $M, A, T, H$ be placed in a line if the $T$ is **always** first and the $A$ is **never** last?

</div>
<div class='workings'>
<div class='working'>

Let's try and find all the possible arrangements.

- $\text{T A H M}$
- $\text{T A M H}$
- $\text{T H A M}$
- $\text{T M A H}$

Total count $= 4$

</div>
</div>
<div class='answers'>
<div class='answer'>

$4$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let's try and find all the possible arrangements.

- $\text{T A H M}$
- $\text{T A M H}$
- $\text{T H A M}$
- $\text{T M A H}$

Total count $= 4$
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
<pre class='language-latex'><code class='language-latex'>$4$
</code></pre>
</div>
</div>


</div>
</li>
<li>
<div class='question_envelope rag_blocked rag_prns question'>
<div class='uuid'>
<p>19528BB0-C11D-48F8-8DAB-32D249EC8D2D</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2018--arithmetic-a:1:19</p>
</div>
<div class='rag'>
<p>Waffles Woof</p>
</div>
<div class='rag'>
<p>rag_wf_blocked</p>
</div>
<div class='rag'>
<p>rag_wf_prns</p>
</div>
<div class='topics'>
<ul>
<li>
tpermutation
</li>
</ul>
</div>
<div class='question question'>

How many numbers between $300$ and $500$ contain **at least one** $4$ in their digits?

</div>
<div class='workings'>
<div class='working'>

Let's try and find all the possible arrangements.

Let's first count all the numbers between $300$ and $399$.

If we use $4$ in the unit place, the possible arrangements are:

- $304$
- $314$
- $324$
- $334$
- $344$
- $354$
- $364$
- $374$
- $384$
- $394$

Count $= 10$

If we use $4$ in the tens place, the possible arrangements are: 

- $341$
- $342$
- $343$
- $345$
- $346$
- $347$
- $348$
- $349$

Count $= 9$

*Note: $344$ is already accounted for in the first list, so ensure you do not count it again.*

Now let's look at all the numbers between $400$ and $499$. As every number in this range will have at least one $4$, so

Count between $400$ and $499 = 100$

$
\begin {aligned}
\text{Total count}   &= 100 + 10 + 9 \\\\
                     &= 119
\end {aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$119$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let's try and find all the possible arrangements.

Let's first count all the numbers between $300$ and $399$.

If we use $4$ in the unit place, the possible arrangements are:

- $304$
- $314$
- $324$
- $334$
- $344$
- $354$
- $364$
- $374$
- $384$
- $394$

Count $= 10$

If we use $4$ in the tens place, the possible arrangements are: 

- $341$
- $342$
- $343$
- $345$
- $346$
- $347$
- $348$
- $349$

Count $= 9$

*Note: $344$ is already accounted for in the first list, so ensure you do not count it again.*

Now let's look at all the numbers between $400$ and $499$. As every number in this range will have at least one $4$, so

Count between $400$ and $499 = 100$

$
\begin {aligned}
\text{Total count}   &= 100 + 10 + 9 \\\\
                     &= 119
\end {aligned}
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
<pre class='language-latex'><code class='language-latex'>$119$
</code></pre>
</div>
</div>


</div>
</li>
<li>
<div class='question_envelope rag_notstarted rag_prns question'>
<div class='uuid'>
<p>826766D1-0786-4F68-AD0B-6CA2C8F22C40</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2019--arithmetic-a:1:19</p>
</div>
<div class='rag'>
<p>Waffles Woof</p>
</div>
<div class='rag'>
<p>rag_wf_notstarted</p>
</div>
<div class='rag'>
<p>rag_wf_prns</p>
</div>
<div class='topics'>
<ul>
<li>
tpermutation
</li>
</ul>
</div>
<div class='question question'>

In a school table-tennis league each team plays each of the other teams **twice** during the year, once at home and once away. If there are $30$ matches in total during the season, how many teams are there in the table-tennis league?

</div>
<div class='workings'>
<div class='working'>

As per the question each team plays every other team twice

Let's take

total no. of teams in a leagues as $x$ teams

total no. of games played as       $n$  games

$
\begin{aligned}
n \  &= x^2 - x \\
30 \ &= x^2 - x 
\end{aligned}
$

$x$ is greater than $5$ as $(5 \times 5) = 25$

Let' try to substitute $x$ with $6$

$
\begin{aligned}
30 &= 6^2 - 6 \\
   &= (6 \times 6) - 6 \\
   &= 36 - 6 \\
   &= 30 \\
\end{aligned}
$

$x$ = 6

There are total of $6$ teams playing the league


</div>
</div>
<div class='answers'>
<div class='answer'>

$6$ 

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>As per the question each team plays every other team twice

Let's take

total no. of teams in a leagues as $x$ teams

total no. of games played as       $n$  games

$
\begin{aligned}
n \  &= x^2 - x \\
30 \ &= x^2 - x 
\end{aligned}
$

$x$ is greater than $5$ as $(5 \times 5) = 25$

Let' try to substitute $x$ with $6$

$
\begin{aligned}
30 &= 6^2 - 6 \\
   &= (6 \times 6) - 6 \\
   &= 36 - 6 \\
   &= 30 \\
\end{aligned}
$

$x$ = 6

There are total of $6$ teams playing the league

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
<pre class='language-latex'><code class='language-latex'>$6$ 
</code></pre>
</div>
</div>


</div>
</li>
<li>
<div class='question_envelope rag_blocked rag_prns question'>
<div class='uuid'>
<p>D1877BC6-DBDD-470A-9061-101346F1F6A4</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-3:1:15</p>
</div>
<div class='rag'>
<p>Waffles Woof</p>
</div>
<div class='rag'>
<p>rag_wf_blocked</p>
</div>
<div class='rag'>
<p>rag_wf_prns</p>
</div>
<div class='topics'>
<ul>
<li>
tpermutation
</li>
</ul>
</div>
<div class='question question'>

Yesterday, the reading on Mr Smith’s electricity meter was $098157$. He was shocked to realise that all six of these digits are different. How many more units of electricity will he use before the next time all the digits are different?

</div>
<div class='workings'>
<div class='working'>

As per the question,

Units of electricity used by Smith = $098157$

The next time all the digits are different, is by adding units to $098157$

$098157 + 1 = 098158$ 
The digits $8$ is repeated.

$098157 + 2 = 098159$
The digits $9$ is repeated.

$098157 + 3 = 098160$
The digits $0$ is repeated.

$098157 + 4 = 098161$
The digits $1$ is repeated.

$098157 + 5 = 098162$
No digit is repeated. All digits are different.

The number of units required to get next time all different digits = $098162 - 098157 = 5$

</div>
</div>
<div class='answers'>
<div class='answer'>

$5$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>As per the question,

Units of electricity used by Smith = $098157$

The next time all the digits are different, is by adding units to $098157$

$098157 + 1 = 098158$ 
The digits $8$ is repeated.

$098157 + 2 = 098159$
The digits $9$ is repeated.

$098157 + 3 = 098160$
The digits $0$ is repeated.

$098157 + 4 = 098161$
The digits $1$ is repeated.

$098157 + 5 = 098162$
No digit is repeated. All digits are different.

The number of units required to get next time all different digits = $098162 - 098157 = 5$
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
<pre class='language-latex'><code class='language-latex'>$5$
</code></pre>
</div>
</div>


</div>
</li>
<li>
<div class='question_envelope rag_notstarted rag_prns question'>
<div class='uuid'>
<p>FAD3A72B-8B37-4011-BDA2-D70E94CDEB4B</p>
</div>
<div class='papername'>
<p>whitgift-school--11-plus--maths--9999--sample-paper-1:1:20</p>
</div>
<div class='rag'>
<p>Waffles Woof</p>
</div>
<div class='rag'>
<p>rag_wf_notstarted</p>
</div>
<div class='rag'>
<p>rag_wf_prns</p>
</div>
<div class='topics'>
<ul>
<li>
tpermutation
</li>
</ul>
</div>
<div class='question question'>

Write down in rising order of size all the 3-digit numbers which can be formed by using te digits $7$,$8$ and $9$ once each. The first is $789$.
 
</div>
<div class='workings'>
<div class='working'>

$789 \quad < \quad 798 \quad < \quad 879 \quad < \quad 897 \quad < \quad 978 \quad < \quad 987$

</div>
</div>
<div class='answers'>
<div class='answer'>

$789 \quad < \quad 798 \quad < \quad 879 \quad < \quad 897 \quad < \quad 978 \quad < \quad 987$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>$789 \quad < \quad 798 \quad < \quad 879 \quad < \quad 897 \quad < \quad 978 \quad < \quad 987$
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
<pre class='language-latex'><code class='language-latex'>$789 \quad < \quad 798 \quad < \quad 879 \quad < \quad 897 \quad < \quad 978 \quad < \quad 987$
</code></pre>
</div>
</div>


</div>
</li>
</ul>
</div>
