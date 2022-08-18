---
slug: "topicpapers/topicpapers-talgebra-17"
title: "TopicPaper - Algebra - 17"
date: 2022-08-18 10:50:34
questions_count: "40"
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
<div class='question_envelope rag_g1 rag_prns question'>
<div class='uuid'>
<p>839261B7-4E0B-4FF5-A157-78F5DDA2504D</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2018--arithmetic-a:1:16</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g1</p>
</div>
<div class='rag'>
<p>rag_wf_prns</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

If one cake and two biscuits provide $450 \ \text {calories}$ and two cakes and three biscuits provide $800 \ \text {calories}$, how many $\ \text{calories}$ are provided by one biscuit?

</div>
<div class='workings'>
<div class='working'>

Let the calories provided by the cake (in calories) $= c$

Let the calories provided by the biscuit (in calories) $= b$

As per the question,

$
\begin{aligned} 
c + 2b      &= 450 \\\\
2c + 3b     &= 800         
\end{aligned}
$

We have got $2$ variables and we have $2$ equations to solve them. Let's eliminate to reduce it to just one variable. 
But which one should we eliminate? 

If we look at the question again, we only need the 
calories provided by the biscuit, so let's eliminate $c$ so we can directly calculate the value for $b$.

Multiply the first equation by $2$.

$
\begin{aligned}
c + 2b                          &= 450 \\\\
2 \times c  + 2 \times 2b       &= 2 \times 450 \\\\
2c + 4b                         &= 900
\end{aligned}
$

Subtract the second equation from the first to reduce it to one variable.

$
\begin{aligned}
2c + 4b                 &= 900 \\\\
2c + 3b                 &= 800    \\\\
2c + 4b -(2c + 3b)      &= 900 - 800 \\\\
2c + 4b - 2c - 3b       &= 100 \\\\
b                       &= 100  \ \text {calories}
\end{aligned}
$

Calories provided by the biscuit $= 100  \ \text {calories}$

</div>
<div class='working'>

What if we eliminate $b$ instead?

This approach is less efficient as we will have to calculate one extra value to get the answer.

Let's eliminate to reduce it to just one variable. 

The LCM of $2$ and $3$ is $6$.
Multiply the first equation by $3$ and the second equation by $2$ to make the coeifficent of $b$ the same.

$
\begin{aligned} 
c + 2b                          &= 450 \\\\
2c + 3b                         &= 800  \\\\   
3 \times c + 3 \times 2b        &= 3 \times 450 \\\\
2 \times 2c + 2 \times 3b       &= 2 \times 800  \\\\    
3c + 6b                         &= 1050 \\\\
4c + 6b                         &= 1600
\end{aligned}
$

Subtract the first equation from the second to reduce it to one variable.

$
\begin{aligned}
3c + 6b                 &= 1350 \\\\
4c + 6b                 &= 1600  \\\\ 
4c + 6b - (3c + 6b)     &= 1600 - 1350  \\\\ 
4c + 6b - 3c - 6b       &= 250  \\\\ 
c                       &= 250 \ \text {calories}
\end{aligned}
$

Calories provided by the cake $= 250 \ \text {calories}$

Let's substitute the value of $c$ in one of the initial equations to find the calories provided by the biscuit.

$
\begin{aligned} 
c + 2b                          &= 450 \\\\
250 + 2b                        &= 450 \\\\
2b                              &= 450 - 250 \\\\
2b                              &= 200 \\\\
b                               &= \dfrac{200}{2} \\\\
b                               &=  100  \ \text {calories}
\end{aligned}
$

Calories provided by the biscuit $= 100  \ \text {calories}$

</div>
</div>
<div class='answers'>
<div class='answer'>

$100  \ \text {calories}$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let the calories provided by the cake (in calories) $= c$
<emptyline>
Let the calories provided by the biscuit (in calories) $= b$
<emptyline>
As per the question,
<emptyline>
$
\begin{aligned} 
c + 2b      &= 450 \\\\
2c + 3b     &= 800         
\end{aligned}
$
<emptyline>
We have got $2$ variables and we have $2$ equations to solve them. Let's eliminate to reduce it to just one variable. 
But which one should we eliminate? 
<emptyline>
If we look at the question again, we only need the 
calories provided by the biscuit, so let's eliminate $c$ so we can directly calculate the value for $b$.
<emptyline>
Multiply the first equation by $2$.
<emptyline>
$
\begin{aligned}
c + 2b                          &= 450 \\\\
2 \times c  + 2 \times 2b       &= 2 \times 450 \\\\
2c + 4b                         &= 900
\end{aligned}
$
<emptyline>
Subtract the second equation from the first to reduce it to one variable.
<emptyline>
$
\begin{aligned}
2c + 4b                 &= 900 \\\\
2c + 3b                 &= 800    \\\\
2c + 4b -(2c + 3b)      &= 900 - 800 \\\\
2c + 4b - 2c - 3b       &= 100 \\\\
b                       &= 100  \ \text {calories}
\end{aligned}
$
<emptyline>
Calories provided by the biscuit $= 100  \ \text {calories}$
</code></pre>
</div>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>What if we eliminate $b$ instead?
<emptyline>
This approach is less efficient as we will have to calculate one extra value to get the answer.
<emptyline>
Let's eliminate to reduce it to just one variable. 
<emptyline>
The LCM of $2$ and $3$ is $6$.
Multiply the first equation by $3$ and the second equation by $2$ to make the coeifficent of $b$ the same.
<emptyline>
$
\begin{aligned} 
c + 2b                          &= 450 \\\\
2c + 3b                         &= 800  \\\\   
3 \times c + 3 \times 2b        &= 3 \times 450 \\\\
2 \times 2c + 2 \times 3b       &= 2 \times 800  \\\\    
3c + 6b                         &= 1050 \\\\
4c + 6b                         &= 1600
\end{aligned}
$
<emptyline>
Subtract the first equation from the second to reduce it to one variable.
<emptyline>
$
\begin{aligned}
3c + 6b                 &= 1350 \\\\
4c + 6b                 &= 1600  \\\\ 
4c + 6b - (3c + 6b)     &= 1600 - 1350  \\\\ 
4c + 6b - 3c - 6b       &= 250  \\\\ 
c                       &= 250 \ \text {calories}
\end{aligned}
$
<emptyline>
Calories provided by the cake $= 250 \ \text {calories}$
<emptyline>
Let's substitute the value of $c$ in one of the initial equations to find the calories provided by the biscuit.
<emptyline>
$
\begin{aligned} 
c + 2b                          &= 450 \\\\
250 + 2b                        &= 450 \\\\
2b                              &= 450 - 250 \\\\
2b                              &= 200 \\\\
b                               &= \dfrac{200}{2} \\\\
b                               &=  100  \ \text {calories}
\end{aligned}
$
<emptyline>
Calories provided by the biscuit $= 100  \ \text {calories}$
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
<pre class='language-latex'><code class='language-latex'>$100  \ \text {calories}$
</code></pre>
</div>
</div>


<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='839261B7-4E0B-4FF5-A157-78F5DDA2504D' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='839261B7-4E0B-4FF5-A157-78F5DDA2504D' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='839261B7-4E0B-4FF5-A157-78F5DDA2504D' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='839261B7-4E0B-4FF5-A157-78F5DDA2504D' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='839261B7-4E0B-4FF5-A157-78F5DDA2504D' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='839261B7-4E0B-4FF5-A157-78F5DDA2504D' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='839261B7-4E0B-4FF5-A157-78F5DDA2504D' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='839261B7-4E0B-4FF5-A157-78F5DDA2504D' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='839261B7-4E0B-4FF5-A157-78F5DDA2504D' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G1' data-uuid='839261B7-4E0B-4FF5-A157-78F5DDA2504D' id='FORM-839261B7-4E0B-4FF5-A157-78F5DDA2504D' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-839261B7-4E0B-4FF5-A157-78F5DDA2504D'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_g0 rag_prpcr question'>
<div class='uuid'>
<p>EE1F9669-3D5F-4C89-85B1-F004C01C7CF7</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2018--arithmetic-a:1:17</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g0</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
<li>
tmoney
</li>
<li>
tcoin
</li>
</ul>
</div>
<div class='question question'>

In a bag of money to take to the bank I have only $5 \text{p}$, $10 \text{p}$ and $20 \text{p}$ coins.

I have twice as many $20 \text{p}$ coins as $10 \text{p}$ coins and half as many $5 \text{p}$ coins as $10 \text{p}$ coins.

If the bag contains $\pounds 15.75$, how many $20 \text{p}$ coins are there?

</div>
<div class='workings'>
<div class='working'>

Let the number of $5 \text{p}$ coins $= a$. Then,

Number of $10 \text{p}$ coins $= 2a$

Number of $20 \text{p}$ coins $= 4a$

ABBR: It is really important to use the right units in calculations and convert where required.
.
The amount is given in pounds and the coins are in pence. Let's convert the total amount into pence.

As per the question,

$
\begin{aligned}  
5 \times a + 10 \times 2a + 20 \times 4a    &= \pounds 15.75 \\\\
5a + 20a + 80a                              &= 15.75 \times 100 \ \text {p} \\\\
5a + 20a + 80a                              &= 1575 \\\\
105a                                        &= 1575 \\\\
a                                           &= \dfrac {1575} {105} \\\\
a                                           &= \dfrac {21 \times 5 \times 15} {21 \times 5} \\\\
a                                           &= \dfrac {\cancel{21} \times \cancel{5} \times 15} {\cancel{21} \times \cancel{5}} \\\\
a                                           &= 15
\end{aligned}
$

Number of $5 \ \text{p}$ coins $= 15$

Number of $20 \ \text{p}$ coins.

$
\begin {aligned}
&= 4a \\\\
&= 4 \times 15 \\\\
&= 60
\end {aligned}
$

Number of $20 \ \text{p}$ coins $= 60$

</div>
</div>
<div class='answers'>
<div class='answer'>

$60$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let the number of $5 \text{p}$ coins $= a$. Then,
<emptyline>
Number of $10 \text{p}$ coins $= 2a$
<emptyline>
Number of $20 \text{p}$ coins $= 4a$
<emptyline>
rtq_abbr_md_unit_note.
The amount is given in pounds and the coins are in pence. Let's convert the total amount into pence.
<emptyline>
As per the question,
<emptyline>
$
\begin{aligned}  
5 \times a + 10 \times 2a + 20 \times 4a    &= \pounds 15.75 \\\\
5a + 20a + 80a                              &= 15.75 \times 100 \ \text {p} \\\\
5a + 20a + 80a                              &= 1575 \\\\
105a                                        &= 1575 \\\\
a                                           &= \dfrac {1575} {105} \\\\
a                                           &= \dfrac {21 \times 5 \times 15} {21 \times 5} \\\\
a                                           &= \dfrac {\cancel{21} \times \cancel{5} \times 15} {\cancel{21} \times \cancel{5}} \\\\
a                                           &= 15
\end{aligned}
$
<emptyline>
Number of $5 \ \text{p}$ coins $= 15$
<emptyline>
Number of $20 \ \text{p}$ coins.
<emptyline>
$
\begin {aligned}
&= 4a \\\\
&= 4 \times 15 \\\\
&= 60
\end {aligned}
$
<emptyline>
Number of $20 \ \text{p}$ coins $= 60$
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
<pre class='language-latex'><code class='language-latex'>$60$
</code></pre>
</div>
</div>

<div class='review-comments'>

<h4>Review Comments</h4>




i) Remove FS and \"then,\"from the first line.



ii) Remove FS in the below line

rtq_abbr_md_unit_note



iii) Remove FS in the below line and put it inside the second \begin-end

Number of $20 \ \text{p}$ coins.



iv) Remove last line.
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='EE1F9669-3D5F-4C89-85B1-F004C01C7CF7' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='EE1F9669-3D5F-4C89-85B1-F004C01C7CF7' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='EE1F9669-3D5F-4C89-85B1-F004C01C7CF7' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='EE1F9669-3D5F-4C89-85B1-F004C01C7CF7' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='EE1F9669-3D5F-4C89-85B1-F004C01C7CF7' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='EE1F9669-3D5F-4C89-85B1-F004C01C7CF7' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='EE1F9669-3D5F-4C89-85B1-F004C01C7CF7' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='EE1F9669-3D5F-4C89-85B1-F004C01C7CF7' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='EE1F9669-3D5F-4C89-85B1-F004C01C7CF7' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G0' data-uuid='EE1F9669-3D5F-4C89-85B1-F004C01C7CF7' id='FORM-EE1F9669-3D5F-4C89-85B1-F004C01C7CF7' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-EE1F9669-3D5F-4C89-85B1-F004C01C7CF7'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcr question'>
<div class='uuid'>
<p>C3BE9AFF-3897-4101-88BA-E1C514952C0C</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2018--arithmetic-b:1:1</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_pr</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
<li>
tmoney
</li>
</ul>
</div>
<div class='question question'>

Alison buys $6$ cups of coffee which cost $\pounds 2.20$ each, $4$ glasses of juice which cost $\pounds 1.15$ each 
and some packets of crisps which cost $55 \text{p}$ each. She pays by giving the member of staff $\pounds 25$ and receives $\pounds 2.80$ in change.

Using this information, complete the bill below by filling in the five spaces

| $6$ cups of coffee costing $\pounds 2.20$ each         | $\pounds$ |
|--------------------------------------------------------|-----------|
| $4$ glasses of juice costing $\pounds 1.15$ each       | $\pounds$ |
| $\ldots$ packets of crisps costing $55 \text{p}$ each  | $\pounds$ |
| Total                                                  | $\pounds$ |


</div>
<div class='workings'>
<div class='working'>


Total cost $=25 - 2.80$

$
\begin{aligned}
&= 25 - 2.80 \\\\
&= 22.2
\end{aligned}
$

Total cost of coffee $= 6 \times \pounds 2.20$

$
\begin{aligned}
&= 6 \times 2.20 \\\\
&= 13.2
\end{aligned}
$

Total cost of juices $= 4 \times \pounds 1.15$

$
\begin{aligned}
&= 4 \times 1.15 \\\\
&= 4.6
\end{aligned}
$

Let the cost of one packet of crisps $= a$ 

$
\begin{aligned}
\pounds 4.6 + \pounds 13.2 + 55 \text{ p} \times a                &= 22.2   \\\\
\pounds 4.6 + \pounds 13.2 + \pounds \dfrac{55}{100}\times a      &= 22.2   \\\\
17.8 + 0.55 \times a                                              &= 22.2   \\\\
0.55 \times a                                                     &= 22.2 - 17.8  \\\\
0.55 \times a                                                     &= 4.4 \\\\
a                                                                 &= \dfrac{4.4}{0.55} \\\\
a                                                                 &= \dfrac{4.4 \times 100 }{0.55 \times 100} \\\\
a                                                                 &= \dfrac{440 }{55} \\\\
a                                                                 &= \dfrac{11 \times 5 \times 8}{11 \times 5} \\\\
a                                                                 &= \dfrac{\cancel {11} \times \cancel {5} \times 8}{\cancel {11} \times \cancel {5}} \\\\
a                                                                 &= 8
\end{aligned}
$


</div>
</div>
<div class='answers'>
<div class='answer'>

$13.2 , 4.6, 8, 22.2$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>
Total cost $=25 - 2.80$
<emptyline>
$
\begin{aligned}
&= 25 - 2.80 \\\\
&= 22.2
\end{aligned}
$
<emptyline>
Total cost of coffee $= 6 \times \pounds 2.20$
<emptyline>
$
\begin{aligned}
&= 6 \times 2.20 \\\\
&= 13.2
\end{aligned}
$
<emptyline>
Total cost of juices $= 4 \times \pounds 1.15$
<emptyline>
$
\begin{aligned}
&= 4 \times 1.15 \\\\
&= 4.6
\end{aligned}
$
<emptyline>
Let the cost of one packet of crisps $= a$ 
<emptyline>
$
\begin{aligned}
\pounds 4.6 + \pounds 13.2 + 55 \text{ p} \times a                &= 22.2   \\\\
\pounds 4.6 + \pounds 13.2 + \pounds \dfrac{55}{100}\times a      &= 22.2   \\\\
17.8 + 0.55 \times a                                              &= 22.2   \\\\
0.55 \times a                                                     &= 22.2 - 17.8  \\\\
0.55 \times a                                                     &= 4.4 \\\\
a                                                                 &= \dfrac{4.4}{0.55} \\\\
a                                                                 &= \dfrac{4.4 \times 100 }{0.55 \times 100} \\\\
a                                                                 &= \dfrac{440 }{55} \\\\
a                                                                 &= \dfrac{11 \times 5 \times 8}{11 \times 5} \\\\
a                                                                 &= \dfrac{\cancel {11} \times \cancel {5} \times 8}{\cancel {11} \times \cancel {5}} \\\\
a                                                                 &= 8
\end{aligned}
$
<emptyline>
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
<pre class='language-latex'><code class='language-latex'>$13.2 , 4.6, 8, 22.2$
</code></pre>
</div>
</div>

<div class='review-comments'>

<h4>Review Comments</h4>




Start with :

Let the cost of one packet of crisps = a



APTQ,



After this calculate all three \"Total cost, Total cost of coffee and Total cost juices\"  everything inside one \begin-end.



then add below two lines outside the \begin-end.



rtq_abbr_md_unit_note

The cost of crisps is given in pence and the total cost is asked in pounds.Lets convert the costs of crisps in pounds.



After this, solve below inside second \begin-end.

£4.6 + £13.2 + 55p × a = 22.2

then solve further...



Also, units are missing in the final step of working and in answers as well.



In case of doubt about where to write units, ask me on slack.
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='C3BE9AFF-3897-4101-88BA-E1C514952C0C' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='C3BE9AFF-3897-4101-88BA-E1C514952C0C' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='C3BE9AFF-3897-4101-88BA-E1C514952C0C' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='C3BE9AFF-3897-4101-88BA-E1C514952C0C' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='C3BE9AFF-3897-4101-88BA-E1C514952C0C' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='C3BE9AFF-3897-4101-88BA-E1C514952C0C' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='C3BE9AFF-3897-4101-88BA-E1C514952C0C' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='C3BE9AFF-3897-4101-88BA-E1C514952C0C' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='C3BE9AFF-3897-4101-88BA-E1C514952C0C' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='PR' data-uuid='C3BE9AFF-3897-4101-88BA-E1C514952C0C' id='FORM-C3BE9AFF-3897-4101-88BA-E1C514952C0C' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-C3BE9AFF-3897-4101-88BA-E1C514952C0C'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcr question'>
<div class='uuid'>
<p>4CED6511-C49B-4229-A375-35FEA63D3656</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2018--arithmetic-b:1:5</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_pr</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

If $2^4 \times 3^1 = 2 \times 2 \times 2 \times 2 \times 3 = 48$

and $2^0 \times 3^2 = 3 \times 3 = 9$

Using this method to set out your work, or otherwise.

</div>
<div class='workings'>
<div class='working'>

TODOWORKING

</div>
<div class='working'>

TODOWORKING

</div>
</div>
<div class='answers'>
<div class='answer'>

TODOANSWER

</div>
<div class='answer'>

TODOANSWER

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>TODOWORKING
</code></pre>
</div>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>TODOWORKING
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
<pre class='language-latex'><code class='language-latex'>TODOANSWER
</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>TODOANSWER
</code></pre>
</div>
</div>
<ul class='subquestion lower-alpha'>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Work out $2^2 \times 3^3$.

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
&= 2^2 \times 3^3 \\\\
&= 2 \times 2 \times 3 \times \times 3 \times 3 \\\\
&= 108
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$108$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>$
\begin{aligned}
&= 2^2 \times 3^3 \\\\
&= 2 \times 2 \times 3 \times \times 3 \times 3 \\\\
&= 108
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
<pre class='language-latex'><code class='language-latex'>$108$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Find the **largest** value of $b$ for which $2^0 \times 3^b$ is **less** than $100$.

</div>
<div class='workings'>
<div class='working'>

As per the question,

$
\begin{aligned}
2^0 \times 3^b                < 100 \\\\
3^b                           < 100
\end{aligned}
$

We can easily infer the values by using trial and error. Let's find out the numbers which can meets satisfy the equations above.

Possible values $36 = 3, 4, 5 $

| Factors |  value of the expression $3^b$  | Numbers $< 100$   |
|:------: |  :-------------------------:    |:---------------:  |
|   $3$   |          $27$                   |        yes        |
|   $4$   |          $81$                   |        yes        |
|   $5$   |          $243$                  |        No         |

A quick check shows that $4$ is the largest possible value. 

</div>
</div>
<div class='answers'>
<div class='answer'>

$4$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>As per the question,
<emptyline>
$
\begin{aligned}
2^0 \times 3^b                < 100 \\\\
3^b                           < 100
\end{aligned}
$
<emptyline>
We can easily infer the values by using trial and error. Let's find out the numbers which can meets satisfy the equations above.
<emptyline>
Possible values $36 = 3, 4, 5 $
<emptyline>
| Factors |  value of the expression $3^b$  | Numbers $< 100$   |
|:------: |  :-------------------------:    |:---------------:  |
|   $3$   |          $27$                   |        yes        |
|   $4$   |          $81$                   |        yes        |
|   $5$   |          $243$                  |        No         |
<emptyline>
A quick check shows that $4$ is the largest possible value. 
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
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Find the **smallest** value of $c$ for which $2^c \times 3^1$ is **greater** than $100$.

</div>
<div class='workings'>
<div class='working'>

As per the question,

$
\begin{aligned}
2^c \times 3^1                > 100 
\end{aligned}
$

We can easily infer the values by using trial and error. Let's find out the numbers which can meets satisfy the equations above.

Possible values $36 = 4, 5, 6 $

| Factors |  value of the expression $2^c \times 3^1$  | Numbers $> 100$   |
|:------: |:----------------------------------------:  |:---------------:  |
|   $4$   |          $48$                              |        No         |
|   $5$   |          $192$                             |        yes        |
|   $6$   |          $384$                             |        Yes        |

A quick check shows that $5$ is the smallest possible value of c.

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
<emptyline>
$
\begin{aligned}
2^c \times 3^1                > 100 
\end{aligned}
$
<emptyline>
We can easily infer the values by using trial and error. Let's find out the numbers which can meets satisfy the equations above.
<emptyline>
Possible values $36 = 4, 5, 6 $
<emptyline>
| Factors |  value of the expression $2^c \times 3^1$  | Numbers $> 100$   |
|:------: |:----------------------------------------:  |:---------------:  |
|   $4$   |          $48$                              |        No         |
|   $5$   |          $192$                             |        yes        |
|   $6$   |          $384$                             |        Yes        |
<emptyline>
A quick check shows that $5$ is the smallest possible value of c.
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
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Find the values of $d$ and $e$ for which $2^d \times 3^e = 144$.

</div>
<div class='workings'>
<div class='working'>

As per the question,

$
\begin{aligned}
2^d \times 3^e   &= 144 \\\\
2^d \times 3^e   &= 2 \times 2 \times 2 \times 2 \times 3 \times 3 \\\\
2^d \times 3^e   &= 2^4 \times 3^2 \\\\
\end{aligned}
$

$d = 4$

$e = 2$

</div>
</div>
<div class='answers'>
<div class='answer'>

$4, 2$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>As per the question,
<emptyline>
$
\begin{aligned}
2^d \times 3^e   &= 144 \\\\
2^d \times 3^e   &= 2 \times 2 \times 2 \times 2 \times 3 \times 3 \\\\
2^d \times 3^e   &= 2^4 \times 3^2 \\\\
\end{aligned}
$
<emptyline>
$d = 4$
<emptyline>
$e = 2$
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
<pre class='language-latex'><code class='language-latex'>$4, 2$
</code></pre>
</div>
</div>

</div>
</li>
</ul>
<div class='review-comments'>

<h4>Review Comments</h4>




Fix common mistakes in all parts: like capitalizing the first letter of the word \"Yes\" or \"No\" in the table.



Part b) 

\"can meets satisfy\" ==> satisfies

\"euqations\"  ==> equation



ii) Remove \"Possible values 36 = 3, 4, 5\" line.



iii) Table should look like below. make necessary changes in your table.

| b |  Value of the expression $2^c \times 3^1$  | Value $> 100$   |



iv) Add a last line: 

Largest value of b = 4





Part c) Same as part b)



Part d) Solve it using table method as well, like part b.
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='4CED6511-C49B-4229-A375-35FEA63D3656' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='4CED6511-C49B-4229-A375-35FEA63D3656' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='4CED6511-C49B-4229-A375-35FEA63D3656' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='4CED6511-C49B-4229-A375-35FEA63D3656' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='4CED6511-C49B-4229-A375-35FEA63D3656' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='4CED6511-C49B-4229-A375-35FEA63D3656' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='4CED6511-C49B-4229-A375-35FEA63D3656' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='4CED6511-C49B-4229-A375-35FEA63D3656' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='4CED6511-C49B-4229-A375-35FEA63D3656' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='PR' data-uuid='4CED6511-C49B-4229-A375-35FEA63D3656' id='FORM-4CED6511-C49B-4229-A375-35FEA63D3656' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-4CED6511-C49B-4229-A375-35FEA63D3656'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcr question'>
<div class='uuid'>
<p>75194A1F-473A-4C38-BC62-99DC9DA43047</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2018--arithmetic-b:1:9</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_pr</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

The company Clearglass makes and fits window units and has the following scale of charges for its work.

It charges $\pounds 500$ for each square metre of glass in the window unit and there is a fixed charge of $\pounds 150$ for making each window unit.

For example:- the cost of making a unit $2 \ \text{m}$ wide by $1.5 \ \text{m}$ high will be calculated as:

$2 \times 1.5 \times 500 + 150 = 1500 + 150 = \pounds 1650$

</div>
<div class='workings'>
<div class='working'>



</div>
</div>
<div class='answers'>
<div class='answer'>

TODOANSWER

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>
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
<pre class='language-latex'><code class='language-latex'>TODOANSWER
</code></pre>
</div>
</div>
<ul class='subquestion lower-alpha'>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

What is the total cost of one window unit which measures $1.5 \ \text{m}$ by $1.8 \ \text{m}$?

</div>
<div class='workings'>
<div class='working'>


$
\begin{aligned}
&= 1.5 \times 1.8 \times 500 + 150 \\\\
&= 2.7 \times 500 + 150 \\\\
&= 1350 + 150 \\\\
&= 1500
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$1500$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>
$
\begin{aligned}
&= 1.5 \times 1.8 \times 500 + 150 \\\\
&= 2.7 \times 500 + 150 \\\\
&= 1350 + 150 \\\\
&= 1500
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
<pre class='language-latex'><code class='language-latex'>$1500$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

If the total cost of a different window unit is $\pounds 1050$, what is its area in $\ \text{m}^2$?

</div>
<div class='workings'>
<div class='working'>

Let the area $= a$

$
\begin{aligned}
a \times 500 + 150   &= 1050 \\\\
a \times 500         &= 1050 - 150 \\\\
a \times 500         &= 900 \\\\
a                    &= \dfrac{900}{500} \\\\
a                    &= \dfrac{9 \times 100}{5 \times 100} \\\\
a                    &= \dfrac{9 \times \cancel {100}}{5 \times \cancel {100}} \\\\
a                    &= \dfrac{9}{5} \\\\
a                    &= 1.8 m^2
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$1.8 m$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let the area $= a$
<emptyline>
$
\begin{aligned}
a \times 500 + 150   &= 1050 \\\\
a \times 500         &= 1050 - 150 \\\\
a \times 500         &= 900 \\\\
a                    &= \dfrac{900}{500} \\\\
a                    &= \dfrac{9 \times 100}{5 \times 100} \\\\
a                    &= \dfrac{9 \times \cancel {100}}{5 \times \cancel {100}} \\\\
a                    &= \dfrac{9}{5} \\\\
a                    &= 1.8 m^2
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
<pre class='language-latex'><code class='language-latex'>$1.8 m$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

If the window unit in part b) is $1.5 \ \text{m}$ high, how wide is it?

</div>
<div class='workings'>
<div class='working'>


Let the width $= w$

$
\begin{aligned}
a              &= 1.8 m^2 \\\\
h \times w     &= 1.8 \\\\
1.5 \times w   &= 1.8 \\\\
w              &= \dfrac{1.8}{1.5} \\\\
w              &= \dfrac{1.8 \times 10}{1.5 \times 10} \\\\
w              &= \dfrac{18}{15} \\\\
w              &= \dfrac{3 \times 6}{3 \times 5} \\\\
w              &= \dfrac{\cancel 3 \times 6}{\cancel 3 \times 5} \\\\
w              &= \dfrac{6}{5} \\\\
w              &= 1.2 \text{m}
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$1.2 \text{m}$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>
Let the width $= w$
<emptyline>
$
\begin{aligned}
a              &= 1.8 m^2 \\\\
h \times w     &= 1.8 \\\\
1.5 \times w   &= 1.8 \\\\
w              &= \dfrac{1.8}{1.5} \\\\
w              &= \dfrac{1.8 \times 10}{1.5 \times 10} \\\\
w              &= \dfrac{18}{15} \\\\
w              &= \dfrac{3 \times 6}{3 \times 5} \\\\
w              &= \dfrac{\cancel 3 \times 6}{\cancel 3 \times 5} \\\\
w              &= \dfrac{6}{5} \\\\
w              &= 1.2 \text{m}
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
<pre class='language-latex'><code class='language-latex'>$1.2 \text{m}$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>


![missing image](/papers/missing_image.svg)


The diagram above shows a plan of the front window in a house which has to be made and fitted as **three separate** window units. 
The middle section of the window is $2.2 \ \text{m}$ wide and the side sections are each $0.5 \ \text{m}$ wide. 
The whole front window is $1.5 \ \text{m}$ high.
Calculate the total cost of making the three window units for this front window.

</div>
<div class='workings'>
<div class='working'>

As per the question,

Cost of Middle section of window $=2.2 \times 0.5 \times 500 + 150$

$
\begin{aligned}
&= 2.2 \times 1.5 \times 500 + 150 \\\\
&= 1650 + 150 \\\\
&= 1800
\end{aligned}
$

Cost of both side section of window $=2 \times (0.5 \times 1.5 \times 500 + 150)$

$
\begin{aligned}
&= 2 \times (0.5 \times 1.5 \times 500 + 150 )\\\\
&= 2 \times (375 + 150)\\\\
&= 2 \times 525 \\\\
&= 1050
\end{aligned}
$

Total cost $= 1050 + 1800 $

$
\begin{aligned}
&= 1050 + 1800 \\\\
&= 2850
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$2850$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>As per the question,
<emptyline>
Cost of Middle section of window $=2.2 \times 0.5 \times 500 + 150$
<emptyline>
$
\begin{aligned}
&= 2.2 \times 1.5 \times 500 + 150 \\\\
&= 1650 + 150 \\\\
&= 1800
\end{aligned}
$
<emptyline>
Cost of both side section of window $=2 \times (0.5 \times 1.5 \times 500 + 150)$
<emptyline>
$
\begin{aligned}
&= 2 \times (0.5 \times 1.5 \times 500 + 150 )\\\\
&= 2 \times (375 + 150)\\\\
&= 2 \times 525 \\\\
&= 1050
\end{aligned}
$
<emptyline>
Total cost $= 1050 + 1800 $
<emptyline>
$
\begin{aligned}
&= 1050 + 1800 \\\\
&= 2850
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
<pre class='language-latex'><code class='language-latex'>$2850$
</code></pre>
</div>
</div>

</div>
</li>
</ul>
<div class='review-comments'>

<h4>Review Comments</h4>




Part a) 

APTQ,

Total cost of one window = \"expression here..\"

then solve further



Part b) 

i) APTQ, missing in second line.



ii) write m^2 inside text also give space between answer and unit:  \"1.8 m^2\" ===> \"1.8 \ \text {m^2}\"

fix this in answer as well.



Part c)

APTQ, (missing in second line)



ii) Remove this line: a &= 1.8 m^2 \\\\



iii) Write units inside \text and also give a space between answer and unit. Make this change in answer section as well.





Part d) After \"APTQ,\" write everything inside one \begin-end.



ii) Units missing in the last line of all three workings and answer sections as well.


</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='75194A1F-473A-4C38-BC62-99DC9DA43047' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='75194A1F-473A-4C38-BC62-99DC9DA43047' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='75194A1F-473A-4C38-BC62-99DC9DA43047' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='75194A1F-473A-4C38-BC62-99DC9DA43047' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='75194A1F-473A-4C38-BC62-99DC9DA43047' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='75194A1F-473A-4C38-BC62-99DC9DA43047' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='75194A1F-473A-4C38-BC62-99DC9DA43047' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='75194A1F-473A-4C38-BC62-99DC9DA43047' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='75194A1F-473A-4C38-BC62-99DC9DA43047' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='PR' data-uuid='75194A1F-473A-4C38-BC62-99DC9DA43047' id='FORM-75194A1F-473A-4C38-BC62-99DC9DA43047' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-75194A1F-473A-4C38-BC62-99DC9DA43047'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_notstarted rag_prns question'>
<div class='uuid'>
<p>4E0A1485-BEE2-4FBC-A8D7-48C9A73A6388</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2018--arithmetic-b:1:11</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_notstarted</p>
</div>
<div class='rag'>
<p>rag_wf_prns</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
<li>
ttable
</li>
</ul>
</div>
<div class='question question'>

A train leaves Manchester with $200$ passengers on board comprising of men, women, boys and girls. 
There are four times as many men as women, twice as many men as boys and three times as many girls as women in the $200$ passengers.


![missing table](/papers/missing_table.svg)


</div>
<div class='workings'>
<div class='working'>

TODOWORKING

</div>
<div class='working'>

TODOWORKING

</div>
</div>
<div class='answers'>
<div class='answer'>

TODOANSWER

</div>
<div class='answer'>

TODOANSWER

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>TODOWORKING
</code></pre>
</div>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>TODOWORKING
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
<pre class='language-latex'><code class='language-latex'>TODOANSWER
</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>TODOANSWER
</code></pre>
</div>
</div>
<ul class='subquestion lower-alpha'>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Using this information, **complete row one** of the table.

</div>
<div class='workings'>
<div class='working'>

TODOWORKING

</div>
<div class='working'>

TODOWORKING

</div>
</div>
<div class='answers'>
<div class='answer'>

TODOANSWER

</div>
<div class='answer'>

TODOANSWER

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>TODOWORKING
</code></pre>
</div>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>TODOWORKING
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
<pre class='language-latex'><code class='language-latex'>TODOANSWER
</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>TODOANSWER
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

At the first stop which is Macclesfield, $\dfrac{3}{8}$ of the men get off and $20\%$ of the women get off the train. 
Twice as many girls as boys also get off at this first station.

**Complete row two and row three** of the table if there are now $112$ passengers left on the train after the first stop at 
Macclesfield **and if nobody new boarded the train**.

</div>
<div class='workings'>
<div class='working'>

TODOWORKING

</div>
<div class='working'>

TODOWORKING

</div>
</div>
<div class='answers'>
<div class='answer'>

TODOANSWER

</div>
<div class='answer'>

TODOANSWER

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>TODOWORKING
</code></pre>
</div>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>TODOWORKING
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
<pre class='language-latex'><code class='language-latex'>TODOANSWER
</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>TODOANSWER
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

At the second stop which is Stoke on Trent, all the remaining women get off and an equal number of men also get off.     The same number of boys as girls also get off.

If there are now five times as many male passengers (men and boys) as female passengers (women and girls) left on the train, 
how many boys **got off** at this second stop?

</div>
<div class='workings'>
<div class='working'>

TODOWORKING

</div>
<div class='working'>

TODOWORKING

</div>
</div>
<div class='answers'>
<div class='answer'>

TODOANSWER

</div>
<div class='answer'>

TODOANSWER

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>TODOWORKING
</code></pre>
</div>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>TODOWORKING
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
<pre class='language-latex'><code class='language-latex'>TODOANSWER
</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>TODOANSWER
</code></pre>
</div>
</div>

</div>
</li>
</ul>

</div>
</li>
<li>
<div class='question_envelope rag_g0 rag_prpcr question'>
<div class='uuid'>
<p>0D7C430D-B032-4DD3-A97B-F5008B1947C3</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2019--arithmetic-a:1:10</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g0</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

What is the missing number in the following sum? 

$4060800 = 4000000 + \ldots + 800$

</div>
<div class='workings'>
<div class='working'>

Let the missing number $= a$.

$
\begin {aligned}
4060800                     &= 4000000 + a + 800 \\\\
a                           &= 4060800 - 4000000 - 800  \\\\
a                           &= 60000
\end {aligned}
$

The missing number is $= 60000$.

</div>
</div>
<div class='answers'>
<div class='answer'>

$60000$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let the missing number $= a$.
<emptyline>
$
\begin {aligned}
4060800                     &= 4000000 + a + 800 \\\\
a                           &= 4060800 - 4000000 - 800  \\\\
a                           &= 60000
\end {aligned}
$
<emptyline>
The missing number is $= 60000$.
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
<pre class='language-latex'><code class='language-latex'>$60000$
</code></pre>
</div>
</div>

<div class='review-comments'>

<h4>Review Comments</h4>




Remove FS from first and last line.



Add APTQ in second line.
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='0D7C430D-B032-4DD3-A97B-F5008B1947C3' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='0D7C430D-B032-4DD3-A97B-F5008B1947C3' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='0D7C430D-B032-4DD3-A97B-F5008B1947C3' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='0D7C430D-B032-4DD3-A97B-F5008B1947C3' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='0D7C430D-B032-4DD3-A97B-F5008B1947C3' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='0D7C430D-B032-4DD3-A97B-F5008B1947C3' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='0D7C430D-B032-4DD3-A97B-F5008B1947C3' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='0D7C430D-B032-4DD3-A97B-F5008B1947C3' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='0D7C430D-B032-4DD3-A97B-F5008B1947C3' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G0' data-uuid='0D7C430D-B032-4DD3-A97B-F5008B1947C3' id='FORM-0D7C430D-B032-4DD3-A97B-F5008B1947C3' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-0D7C430D-B032-4DD3-A97B-F5008B1947C3'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_g0 rag_prpcr question'>
<div class='uuid'>
<p>30D0B7AD-9447-463A-831D-D948DCE6F17F</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2019--arithmetic-a:1:11</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g0</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

John thinks of a number. He multiplies that number by four and then adds three to the result. If the answer he obtains is $35$, what is the number he first thought of?

</div>
<div class='workings'>
<div class='working'>

Let the number that John thought is $= a$

As per the question,

$
\begin{aligned}
4a + 3    &= 35 \\\\
4a        &= 35 - 3 \\\\
4a        &= 32 \\\\
a         &= \dfrac {32} {4} \\\\
a         &= \dfrac {8 \times 4} {4} \\\\
a         &= \dfrac {8 \times \cancel {4}} {\cancel {4}} \\\\
a         &= 8
\end {aligned}
$

The number that John thought $= 8$.

</div>
</div>
<div class='answers'>
<div class='answer'>

$8$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let the number that John thought is $= a$
<emptyline>
As per the question,
<emptyline>
$
\begin{aligned}
4a + 3    &= 35 \\\\
4a        &= 35 - 3 \\\\
4a        &= 32 \\\\
a         &= \dfrac {32} {4} \\\\
a         &= \dfrac {8 \times 4} {4} \\\\
a         &= \dfrac {8 \times \cancel {4}} {\cancel {4}} \\\\
a         &= 8
\end {aligned}
$
<emptyline>
The number that John thought $= 8$.
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
<pre class='language-latex'><code class='language-latex'>$8$
</code></pre>
</div>
</div>

<div class='review-comments'>

<h4>Review Comments</h4>




first line change \"is\" to \"of\"



last line \"of\" missing



remove FS from last line
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='30D0B7AD-9447-463A-831D-D948DCE6F17F' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='30D0B7AD-9447-463A-831D-D948DCE6F17F' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='30D0B7AD-9447-463A-831D-D948DCE6F17F' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='30D0B7AD-9447-463A-831D-D948DCE6F17F' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='30D0B7AD-9447-463A-831D-D948DCE6F17F' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='30D0B7AD-9447-463A-831D-D948DCE6F17F' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='30D0B7AD-9447-463A-831D-D948DCE6F17F' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='30D0B7AD-9447-463A-831D-D948DCE6F17F' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='30D0B7AD-9447-463A-831D-D948DCE6F17F' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G0' data-uuid='30D0B7AD-9447-463A-831D-D948DCE6F17F' id='FORM-30D0B7AD-9447-463A-831D-D948DCE6F17F' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-30D0B7AD-9447-463A-831D-D948DCE6F17F'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_g1 rag_prns question'>
<div class='uuid'>
<p>0DDB7D8E-8C0B-4FC8-872C-52FBE4C7EC8F</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2019--arithmetic-a:1:14</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g1</p>
</div>
<div class='rag'>
<p>rag_wf_prns</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

A shopkeeper buys a box of $60 \ \text{apples}$ for $\pounds 12$. 
If he finds that $\dfrac{1}{10}$ of the apples are bad and can't be sold, at what price must he sell each of the good apples so that he makes a total **profit** of $\pounds 15$?

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
\text {Total apples}            &= 60 \\\\
\text {Number of bad apples}    &= \dfrac {1}{10} \times 60  \\\\
                                &= \dfrac {60}{10} \\\\
                                &= \dfrac {6{\cancel{0}}} {1{\cancel{0}}} \\\\
                                &= 6 \\\\
\text {Number of good apples}   &= 60 - 6 \\\\
                                &= 54 \\\\
\text{Total selling price}      &= \text {Profit} + \text {Cost price} \\\\
                                &= 15 + 12 \\\\
                                &= \pounds 27 \\\\
\text {Selling price of each good apple}    &= \dfrac{\text{Total selling price}} {\text{Total good apples}} \\\\
                                            &= \dfrac {27}{54}\\\\
                                            &= \dfrac {27}{27 \times 2}\\\\
                                            &= \dfrac {\cancel {27}}{\cancel {27} \times 2}\\\\
                                            &= \dfrac {1}{2} \\\\
                                            &= \pounds 0.5
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$\pounds 0.50$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>$
\begin{aligned}
\text {Total apples}            &= 60 \\\\
\text {Number of bad apples}    &= \dfrac {1}{10} \times 60  \\\\
                                &= \dfrac {60}{10} \\\\
                                &= \dfrac {6{\cancel{0}}} {1{\cancel{0}}} \\\\
                                &= 6 \\\\
\text {Number of good apples}   &= 60 - 6 \\\\
                                &= 54 \\\\
\text{Total selling price}      &= \text {Profit} + \text {Cost price} \\\\
                                &= 15 + 12 \\\\
                                &= \pounds 27 \\\\
\text {Selling price of each good apple}    &= \dfrac{\text{Total selling price}} {\text{Total good apples}} \\\\
                                            &= \dfrac {27}{54}\\\\
                                            &= \dfrac {27}{27 \times 2}\\\\
                                            &= \dfrac {\cancel {27}}{\cancel {27} \times 2}\\\\
                                            &= \dfrac {1}{2} \\\\
                                            &= \pounds 0.5
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
<pre class='language-latex'><code class='language-latex'>$\pounds 0.50$
</code></pre>
</div>
</div>


<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='0DDB7D8E-8C0B-4FC8-872C-52FBE4C7EC8F' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='0DDB7D8E-8C0B-4FC8-872C-52FBE4C7EC8F' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='0DDB7D8E-8C0B-4FC8-872C-52FBE4C7EC8F' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='0DDB7D8E-8C0B-4FC8-872C-52FBE4C7EC8F' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='0DDB7D8E-8C0B-4FC8-872C-52FBE4C7EC8F' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='0DDB7D8E-8C0B-4FC8-872C-52FBE4C7EC8F' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='0DDB7D8E-8C0B-4FC8-872C-52FBE4C7EC8F' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='0DDB7D8E-8C0B-4FC8-872C-52FBE4C7EC8F' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='0DDB7D8E-8C0B-4FC8-872C-52FBE4C7EC8F' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G1' data-uuid='0DDB7D8E-8C0B-4FC8-872C-52FBE4C7EC8F' id='FORM-0DDB7D8E-8C0B-4FC8-872C-52FBE4C7EC8F' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-0DDB7D8E-8C0B-4FC8-872C-52FBE4C7EC8F'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_g0 rag_prpcr question'>
<div class='uuid'>
<p>864F4E3D-6828-49EA-AE5B-C17F5CF91616</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2019--arithmetic-a:1:16</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g0</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
<li>
tmoney
</li>
<li>
tunitprompt
</li>
</ul>
</div>
<div class='question question'>

Two bottles of water and three small bags of fruit cost a total of $\pounds 2.55$. If a bottle of water costs $15 \text{p}$ **more** than a bag of fruit, what is the cost of a bag of fruit?

</div>
<div class='workings'>
<div class='working'>

Let the cost of a bottle of water (in pence) $= w$

Let the cost of a bag of fruit (in pence) $= f$

ABBR: It is really important to use the right units in calculations and convert where required
.

The cost is given in pounds and pence. Let's convert all the costs into pence.

As per the question,

$
\begin{aligned}
2w + 3f      &= \pounds 2.55 \\\\
2w + 3f      &= 255 \text{p} \\\\
w - f        &= 15
\end{aligned}
$

We have got $2$ variables and we have $2$ equations to solve them. Let's eliminate to reduce it to just one variable. 

But which one should we eliminate? 

If we look at the question again, we only need the 

cost for a bag of fruit, so let's eliminate $w$ so we can directly calculate the value for $f$.

Multiply the second equation by $2$.

$
\begin{aligned}
w - f                           &= 15 \\\\
w \times 2 - f  \times 2        &= 15 \times 2 \\\\
2w - 2f                         &= 30
\end{aligned}
$

Subtract the second equation from the first to reduce it to one variable.

$
\begin{aligned}
2w + 3f             &= 255 \\\\
2w - 2f             &= 30 \\\\
2w + 3f - (2w - 2f) &= 255 - 30 \\\\
2w + 3f - 2w + 2f   &= 225 \\\\
5f                  &= 225 \\\\
f                   &= \dfrac{225}{5} \\\\
f                   &= 45 \ \text{pence}
\end{aligned}
$

Cost of a bag of fruit $= 45 \ \text {pence}$.

</div>
<div class='working'>

What if we eliminate $f$ instead?

This approach is less efficient as we will have to calculate one extra value to get the answer.

Let's eliminate to reduce it to just one variable. 

Multiply the second equation by $3$.

$
\begin{aligned} 
w - f                           &= 15 \\\\
w \times 3 - f  \times 3        &= 15 \times 3 \\\\
3w - 3f                         &= 45
\end{aligned}
$

Add second equation to the first to reduce it to one variable.

$
\begin{aligned}
2w + 3f                 &= 255 \\\\
3w - 3f                 &= 45 \\\\
2w + 3f + (3w - 3f)     &= 255 + 45 \\\\
2w + 3f + 3w - 3f       &= 300 \\\\
5w                      &= 300 \\\\
w                       &= \dfrac{300}{5} \\\\
w                       &= 60 \ \text{pence}
\end{aligned}
$

Cost of a bottle of water $= 60 \ \text{pence}$. 

Let's substitute the value of $w$ in one of the initial equations to find the cost of a bag of fruit.

$
\begin{aligned} 
w - f               &= 15 \\\\
60 -f               &= 15 \\\\
-f                  &= 15 - 60 \\\\
-f                  &= -45 \\\\
f                   &= 45 \ \text{pence}
\end{aligned}
$

Cost of a bag of fruit $= 45 \ \text {pence}$

</div>
</div>
<div class='answers'>
<div class='answer'>

$45p$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let the cost of a bottle of water (in pence) $= w$
<emptyline>
Let the cost of a bag of fruit (in pence) $= f$
<emptyline>
rtq_abbr_md_unit_no_dot_note.
<emptyline>
The cost is given in pounds and pence. Let's convert all the costs into pence.
<emptyline>
As per the question,
<emptyline>
$
\begin{aligned}
2w + 3f      &= \pounds 2.55 \\\\
2w + 3f      &= 255 \text{p} \\\\
w - f        &= 15
\end{aligned}
$
<emptyline>
We have got $2$ variables and we have $2$ equations to solve them. Let's eliminate to reduce it to just one variable. 
<emptyline>
But which one should we eliminate? 
<emptyline>
If we look at the question again, we only need the 
<emptyline>
cost for a bag of fruit, so let's eliminate $w$ so we can directly calculate the value for $f$.
<emptyline>
Multiply the second equation by $2$.
<emptyline>
$
\begin{aligned}
w - f                           &= 15 \\\\
w \times 2 - f  \times 2        &= 15 \times 2 \\\\
2w - 2f                         &= 30
\end{aligned}
$
<emptyline>
Subtract the second equation from the first to reduce it to one variable.
<emptyline>
$
\begin{aligned}
2w + 3f             &= 255 \\\\
2w - 2f             &= 30 \\\\
2w + 3f - (2w - 2f) &= 255 - 30 \\\\
2w + 3f - 2w + 2f   &= 225 \\\\
5f                  &= 225 \\\\
f                   &= \dfrac{225}{5} \\\\
f                   &= 45 \ \text{pence}
\end{aligned}
$
<emptyline>
Cost of a bag of fruit $= 45 \ \text {pence}$.
</code></pre>
</div>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>What if we eliminate $f$ instead?
<emptyline>
This approach is less efficient as we will have to calculate one extra value to get the answer.
<emptyline>
Let's eliminate to reduce it to just one variable. 
<emptyline>
Multiply the second equation by $3$.
<emptyline>
$
\begin{aligned} 
w - f                           &= 15 \\\\
w \times 3 - f  \times 3        &= 15 \times 3 \\\\
3w - 3f                         &= 45
\end{aligned}
$
<emptyline>
Add second equation to the first to reduce it to one variable.
<emptyline>
$
\begin{aligned}
2w + 3f                 &= 255 \\\\
3w - 3f                 &= 45 \\\\
2w + 3f + (3w - 3f)     &= 255 + 45 \\\\
2w + 3f + 3w - 3f       &= 300 \\\\
5w                      &= 300 \\\\
w                       &= \dfrac{300}{5} \\\\
w                       &= 60 \ \text{pence}
\end{aligned}
$
<emptyline>
Cost of a bottle of water $= 60 \ \text{pence}$. 
<emptyline>
Let's substitute the value of $w$ in one of the initial equations to find the cost of a bag of fruit.
<emptyline>
$
\begin{aligned} 
w - f               &= 15 \\\\
60 -f               &= 15 \\\\
-f                  &= 15 - 60 \\\\
-f                  &= -45 \\\\
f                   &= 45 \ \text{pence}
\end{aligned}
$
<emptyline>
Cost of a bag of fruit $= 45 \ \text {pence}$
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
<pre class='language-latex'><code class='language-latex'>$45p$
</code></pre>
</div>
</div>

<div class='review-comments'>

<h4>Review Comments</h4>




WORKING 1:

i) 2w + 3f = £2.55

   2w + 3f = 2.55 x 100p  (this line missing)

   2w + 3f = 255



ii) Remove space between these lines:

If we look at the question again, we only need the 



cost for a bag of fruit, so lets eliminate $w$ so we can directly calculate the 



iv) f = 225 / 5

    f = 45 x 5 / 5  (this line missing)

then cancel 5 

    f = 45



iii) Replace pence with p in all the places it is written as a unit.

for eg; \"f = 45 \ \text{pence}\" ===> \"f = 45 \ \text{p}\"

Make this change wherever required.



iv) Remove FS from below line

Cost of a bag of fruit = 45 pence.




</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='864F4E3D-6828-49EA-AE5B-C17F5CF91616' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='864F4E3D-6828-49EA-AE5B-C17F5CF91616' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='864F4E3D-6828-49EA-AE5B-C17F5CF91616' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='864F4E3D-6828-49EA-AE5B-C17F5CF91616' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='864F4E3D-6828-49EA-AE5B-C17F5CF91616' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='864F4E3D-6828-49EA-AE5B-C17F5CF91616' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='864F4E3D-6828-49EA-AE5B-C17F5CF91616' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='864F4E3D-6828-49EA-AE5B-C17F5CF91616' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='864F4E3D-6828-49EA-AE5B-C17F5CF91616' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G0' data-uuid='864F4E3D-6828-49EA-AE5B-C17F5CF91616' id='FORM-864F4E3D-6828-49EA-AE5B-C17F5CF91616' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-864F4E3D-6828-49EA-AE5B-C17F5CF91616'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_g0 rag_prpcr question'>
<div class='uuid'>
<p>26E16C3C-4AED-4018-A4B3-041DDC0C4959</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2019--arithmetic-a:1:17</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g0</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

Bilal has made a box in the shape of a cuboid with sides $4 \ \text{cm}, 5 \ \text{cm}$ and $32 \ \text{cm}$. 
He wants to make another **different** shaped box but with the **same** volume. 
This box will have a height of $10 \ \text{cm}$ and a square base. What will be the length of the base?

</div>
<div class='workings'>
<div class='working'>

Let the length of the base (in $\text{cm}$) $= a$

ABBR: $\text{Volume} = \text{length} \times \text{width} \times \text{height}$


As per the question, the two boxes have the same volume. Using that we get,

$
\begin{aligned}
10 \times a \times a    &= 4 \times 5 \times 32 \\\\
a^{2}                   &= \dfrac {4 \times 5 \times 32} {10} \\\\
a^{2}                   &= \dfrac {2 \times 2 \times 5 \times 32} {2 \times 5} \\\\
a^{2}                   &= \dfrac {2 \times \cancel{2} \times \cancel{5} \times 32} {\cancel{2} \times \cancel{5}} \\\\
a^{2}                   &= 2 \times 32 \\\\
a^{2}                   &= 64 \\\\
a                       &= \sqrt{64} \\\\
a                       &= 8 \ \text{cm}
\end{aligned}
$

Length of the base $= 8 \ \text{cm}$

</div>
</div>
<div class='answers'>
<div class='answer'>

$8 \ \text{cm}$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let the length of the base (in $\text{cm}$) $= a$
<emptyline>
rtq_abbr_katex_formula_volume_cuboid
<emptyline>
As per the question, the two boxes have the same volume. Using that we get,
<emptyline>
$
\begin{aligned}
10 \times a \times a    &= 4 \times 5 \times 32 \\\\
a^{2}                   &= \dfrac {4 \times 5 \times 32} {10} \\\\
a^{2}                   &= \dfrac {2 \times 2 \times 5 \times 32} {2 \times 5} \\\\
a^{2}                   &= \dfrac {2 \times \cancel{2} \times \cancel{5} \times 32} {\cancel{2} \times \cancel{5}} \\\\
a^{2}                   &= 2 \times 32 \\\\
a^{2}                   &= 64 \\\\
a                       &= \sqrt{64} \\\\
a                       &= 8 \ \text{cm}
\end{aligned}
$
<emptyline>
Length of the base $= 8 \ \text{cm}$
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
<pre class='language-latex'><code class='language-latex'>$8 \ \text{cm}$
</code></pre>
</div>
</div>

<div class='review-comments'>

<h4>Review Comments</h4>




In APTQ line remove \"the two boxes have the same volume. Using that we get\"



Changes not applied. Please make the above changes.
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='26E16C3C-4AED-4018-A4B3-041DDC0C4959' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='26E16C3C-4AED-4018-A4B3-041DDC0C4959' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='26E16C3C-4AED-4018-A4B3-041DDC0C4959' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='26E16C3C-4AED-4018-A4B3-041DDC0C4959' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='26E16C3C-4AED-4018-A4B3-041DDC0C4959' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='26E16C3C-4AED-4018-A4B3-041DDC0C4959' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='26E16C3C-4AED-4018-A4B3-041DDC0C4959' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='26E16C3C-4AED-4018-A4B3-041DDC0C4959' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='26E16C3C-4AED-4018-A4B3-041DDC0C4959' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G0' data-uuid='26E16C3C-4AED-4018-A4B3-041DDC0C4959' id='FORM-26E16C3C-4AED-4018-A4B3-041DDC0C4959' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-26E16C3C-4AED-4018-A4B3-041DDC0C4959'>Initial</p>
</div>
</div>
</li>
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
<li>
<div class='question_envelope rag_g0 rag_prpcr question'>
<div class='uuid'>
<p>FEF8AADE-2D7B-4940-99BD-A18E327E4D0F</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2019--arithmetic-b:1:2</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g0</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

The gas meter reading on Andrew's smart meter in October was $5475$ units. 
Exactly **three** months later, in January, the reading was $6045$ units. 
M-power charge a fixed amount of $\pounds 16.20$ **each month** plus $40\text{p}$ for **each unit** used during the three months between the two readings.

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
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>%empty%
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
<pre class='language-latex'><code class='language-latex'>%empty%
</code></pre>
</div>
</div>
<ul class='subquestion lower-alpha'>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

How many units of gas has Andrew used in the three month period from October to January?

</div>
<div class='workings'>
<div class='working'>


January reading = $6045$ 

October reading = $5475$ 

$
\begin {aligned}
&= 6045 - 5475 \\\\
&= 570
\end {aligned}
$



</div>
</div>
<div class='answers'>
<div class='answer'>

$570 \ \text {units}$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>
January reading = $6045$ 
<emptyline>
October reading = $5475$ 
<emptyline>
$
\begin {aligned}
&= 6045 - 5475 \\\\
&= 570
\end {aligned}
$
<emptyline>

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
<pre class='language-latex'><code class='language-latex'>$570 \ \text {units}$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Calculate the **total** amount Andrew has to pay for that three month period.

</div>
<div class='workings'>
<div class='working'>

As per the question, 

$
\begin{aligned}
&= 3 \times \pounds 16.20 + 570 \times 40 \ \text {p} \\\\
&= \pounds 48.60 + 570 \times \pounds \dfrac {40} {100} \\\\
&= \pounds 48.60 + 570 \times \pounds 0.40 \\\\
&= 48.60 + 228 \\\\
&= \pounds 276.60
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$\pounds 276.60$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>As per the question, 
<emptyline>
$
\begin{aligned}
&= 3 \times \pounds 16.20 + 570 \times 40 \ \text {p} \\\\
&= \pounds 48.60 + 570 \times \pounds \dfrac {40} {100} \\\\
&= \pounds 48.60 + 570 \times \pounds 0.40 \\\\
&= 48.60 + 228 \\\\
&= \pounds 276.60
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
<pre class='language-latex'><code class='language-latex'>$\pounds 276.60$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

In fact, M-power also have to add $5\%$ to Andrew's bill which is the tax known as VAT. What will be the **final** bill that Andrew has to pay for his gas?

</div>
<div class='workings'>
<div class='working'>

As per the question,

Final Bill $=$ Total bill + VAT 

$
\begin{aligned}
                        &= \pounds 276.60 + (5 \% \ \text {of } 276.60) \\\\
                        &= 276.60 + (5 \% \times 276.60) \\\\
                        &= 276.60 + (\dfrac {5} {100} \times 276.60) \\\\
                        &= 276.60 + (\dfrac {276.60 \times 5}{100}) \\\\
                        &= 276.60 + \dfrac {1383} {100} \\\\
                        &= 276.60 + 13.83 \\\\
                        &= \pounds 290.43
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$\pounds 290.43$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>As per the question,
<emptyline>
Final Bill $=$ Total bill + VAT 
<emptyline>
$
\begin{aligned}
                        &= \pounds 276.60 + (5 \% \ \text {of } 276.60) \\\\
                        &= 276.60 + (5 \% \times 276.60) \\\\
                        &= 276.60 + (\dfrac {5} {100} \times 276.60) \\\\
                        &= 276.60 + (\dfrac {276.60 \times 5}{100}) \\\\
                        &= 276.60 + \dfrac {1383} {100} \\\\
                        &= 276.60 + 13.83 \\\\
                        &= \pounds 290.43
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
<pre class='language-latex'><code class='language-latex'>$\pounds 290.43$
</code></pre>
</div>
</div>

</div>
</li>
</ul>
<div class='review-comments'>

<h4>Review Comments</h4>




Part a)

Write last two line like this using \begin-end.

Gas used in three months = 6045−5475

                         = 570



Part c) Write \"Final Bill == Total bill + VAT\" inside the \begin-end.





ii) Remove unit (£) from the below line:

= £276.60 + (5% of 276.60)


</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='FEF8AADE-2D7B-4940-99BD-A18E327E4D0F' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='FEF8AADE-2D7B-4940-99BD-A18E327E4D0F' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='FEF8AADE-2D7B-4940-99BD-A18E327E4D0F' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='FEF8AADE-2D7B-4940-99BD-A18E327E4D0F' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='FEF8AADE-2D7B-4940-99BD-A18E327E4D0F' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='FEF8AADE-2D7B-4940-99BD-A18E327E4D0F' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='FEF8AADE-2D7B-4940-99BD-A18E327E4D0F' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='FEF8AADE-2D7B-4940-99BD-A18E327E4D0F' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='FEF8AADE-2D7B-4940-99BD-A18E327E4D0F' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G0' data-uuid='FEF8AADE-2D7B-4940-99BD-A18E327E4D0F' id='FORM-FEF8AADE-2D7B-4940-99BD-A18E327E4D0F' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-FEF8AADE-2D7B-4940-99BD-A18E327E4D0F'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_g0 rag_prccrl question'>
<div class='uuid'>
<p>DD136C6F-448A-43DA-AEFE-3AF5F79B1533</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2019--arithmetic-b:1:3</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g0</p>
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

The **Blast** of a two digit number is obtained as follows:

The Blast of $63$ is $216$ because $6 \times 6 \times 6 = 216$ 

and the Blast of $27$ is $128$ because $2 \times 2 \times 2 \times 2 \times 2 \times 2 \times 2 = 128$

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
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>%empty%
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
<pre class='language-latex'><code class='language-latex'>%empty%
</code></pre>
</div>
</div>
<ul class='subquestion lower-alpha'>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Write down the Blast of the two digit number $34$.

</div>
<div class='workings'>
<div class='working'>

$
\begin {aligned}
\text {Blast of 34}     &= 3 ^ 4 \\\\
                        &= 3 \times 3 \times 3 \times 3 \\\\
                        &= 81
\end {aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$81$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>$
\begin {aligned}
\text {Blast of 34}     &= 3 ^ 4 \\\\
                        &= 3 \times 3 \times 3 \times 3 \\\\
                        &= 81
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
<pre class='language-latex'><code class='language-latex'>$81$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Which two digit number has a Blast of $125$?

</div>
<div class='workings'>
<div class='working'>

$53$

Let's verify 

$
\begin{aligned}
&= 5^3
&= 5 \times 5 \times 5\\\\
&= 125
\end{aligned}
$

$125$ is a blast of $53$

</div>
</div>
<div class='answers'>
<div class='answer'>

$53$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>$53$
<emptyline>
Let's verify 
<emptyline>
$
\begin{aligned}
&= 5^3
&= 5 \times 5 \times 5\\\\
&= 125
\end{aligned}
$
<emptyline>
$125$ is a blast of $53$
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
<pre class='language-latex'><code class='language-latex'>$53$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Work out another two digit number which has the **same** Blast as $24$.

</div>
<div class='workings'>
<div class='working'>


Blast of 24 $= 2 \times 2 \times 2 \times 2 = 16$

Another number with the Blast of $16 = 42$

Let's verify

$
\begin{aligned}
16   &= 4 \times 4 \\\\
16   &= 4 ^ 2
\end{aligned}
$


</div>
</div>
<div class='answers'>
<div class='answer'>

$42$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>
Blast of 24 $= 2 \times 2 \times 2 \times 2 = 16$
<emptyline>
Another number with the Blast of $16 = 42$
<emptyline>
Let's verify
<emptyline>
$
\begin{aligned}
16   &= 4 \times 4 \\\\
16   &= 4 ^ 2
\end{aligned}
$
<emptyline>
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
<pre class='language-latex'><code class='language-latex'>$42$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

A particular two digit number is blasted and then that answer is also Blasted. If the final answer is $9$, what was the **original** number?

</div>
<div class='workings'>
<div class='working'>

Let's first find $9$ is a blast of which two digit number,

$
\begin {aligned}
9       &= 3 \times 3 \\\\
9       &= 3^2
\end {aligned}
$

$9$ is a blast of $32$

Now, we need to find $32$ is a blast of which two digit number to find our original number,

$
\begin {aligned}
32      &= 2 \times 2 \times 2 \times 2 \times 2 \\\\
32      &= 2^5
\end {aligned}
$

$32$ is a blast of $25$

The original number is $25$

</div>
</div>
<div class='answers'>
<div class='answer'>

$25$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let's first find $9$ is a blast of which two digit number,
<emptyline>
$
\begin {aligned}
9       &= 3 \times 3 \\\\
9       &= 3^2
\end {aligned}
$
<emptyline>
$9$ is a blast of $32$
<emptyline>
Now, we need to find $32$ is a blast of which two digit number to find our original number,
<emptyline>
$
\begin {aligned}
32      &= 2 \times 2 \times 2 \times 2 \times 2 \\\\
32      &= 2^5
\end {aligned}
$
<emptyline>
$32$ is a blast of $25$
<emptyline>
The original number is $25$
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
<pre class='language-latex'><code class='language-latex'>$25$
</code></pre>
</div>
</div>

</div>
</li>
</ul>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='DD136C6F-448A-43DA-AEFE-3AF5F79B1533' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='DD136C6F-448A-43DA-AEFE-3AF5F79B1533' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='DD136C6F-448A-43DA-AEFE-3AF5F79B1533' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='DD136C6F-448A-43DA-AEFE-3AF5F79B1533' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='DD136C6F-448A-43DA-AEFE-3AF5F79B1533' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='DD136C6F-448A-43DA-AEFE-3AF5F79B1533' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='DD136C6F-448A-43DA-AEFE-3AF5F79B1533' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='DD136C6F-448A-43DA-AEFE-3AF5F79B1533' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='DD136C6F-448A-43DA-AEFE-3AF5F79B1533' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G0' data-uuid='DD136C6F-448A-43DA-AEFE-3AF5F79B1533' id='FORM-DD136C6F-448A-43DA-AEFE-3AF5F79B1533' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-DD136C6F-448A-43DA-AEFE-3AF5F79B1533'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_g1 rag_prns question'>
<div class='uuid'>
<p>130DB243-D3C7-45CA-9989-ED58478FAE23</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2019--arithmetic-b:1:4</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g1</p>
</div>
<div class='rag'>
<p>rag_wf_prns</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

A plant grows during the first month after it is planted. 
During the second month it grows by half the height it had already reached. 
During the third month it grows by one third of the height it had reached at the end of the second month. 
It then grows by one quarter and one fifth of the height reached in the same way in the next two months.

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
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>%empty%
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
<pre class='language-latex'><code class='language-latex'>%empty%
</code></pre>
</div>
</div>
<ul class='subquestion lower-alpha'>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

If a plant is $1 \ \text{metre}$ tall at the end of the first month, how tall will it be after five months?

</div>
<div class='workings'>
<div class='working'>

As per the question,

To find out the height of the plant after five months, we should know the height of plant at the end of first, second, third and fourth month.

$
\begin {aligned}
\text {Height of the plant at the end of the first month}       &= 1 \ \text {m} \\\\
\text {Height of the plant at the end of the second month}      &= 1 + \dfrac {1} {2} \ \text {of} \ 1 \\\\
                                                                &= 1 + \dfrac {1} {2} \\\\
                                                                &= \dfrac {1 \times 2} {1 \times 2} + \dfrac {1} {2} \\\\
                                                                &= \dfrac {2} {2} + \dfrac {1} {2} \\\\
                                                                &= \dfrac {2 + 1} {2} \\\\
                                                                &= \dfrac {3} {2} \\\\
                                                                &= 1.5 \ \text {m} \\\\
\text {Height of the plant at the end of the third month}       &= 1.5 + \dfrac {1} {3} \ \text {of} \ 1.5 \\\\
                                                                &= 1.5 + \dfrac {1} {3} \times 1.5 \\\\
                                                                &= \dfrac {3} {2} + \dfrac {1} {3} \times \dfrac {3} {2} \\\\
                                                                &= \dfrac {3} {2} + \dfrac {3} {6} \\\\
                                                                &= \dfrac {3} {2} + \dfrac {1} {2} \\\\
                                                                &= \dfrac {3 + 1} {2} \\\\
                                                                &= \dfrac {4} {2} \\\\
                                                                &= 2 \ \text {m} \\\\
\text {Height of the plant at the end of the fourth month}      &= 2 + \dfrac {1} {4} \ \text {of} \ 2 \\\\
                                                                &= 2 + \dfrac {1} {4} \times 2 \\\\
                                                                &= 2 + \dfrac {2} {4} \\\\
                                                                &= \dfrac {2 \times 4} {1 \times 4} + \dfrac {2} {4} \\\\
                                                                &= \dfrac {8} {4} + \dfrac {2} {4} \\\\
                                                                &= \dfrac {8 + 2} {4} \\\\
                                                                &= \dfrac {10} {4} \\\\
                                                                &= 2.5 \ \text {m} \\\\
\text {Height of the plant at the end of the fifth month}       &= 2.5 + \dfrac {1} {5} \ \text {of} \ 2.5 \\\\
                                                                &= \dfrac {5} {2} + \dfrac {1} {5} \times \dfrac {5} {2} \\\\
                                                                &= \dfrac {5} {2} + \dfrac {5} {10} \\\\
                                                                &= \dfrac {5 \times 5} {2 \times 5} + \dfrac {5} {10} \\\\
                                                                &= \dfrac {25} {10} + \dfrac {5} {10} \\\\
                                                                &= \dfrac {25 + 5} {10} \\\\
                                                                &= \dfrac {30} {10} \\\\
                                                                &= \dfrac {3 \cancel {0}} {1 \cancel {0}} \\\\
                                                                &= 3 \ \text {m}
\end {aligned}
$

The plant will be $3 \ \text {m}$ tall after five months.

</div>
</div>
<div class='answers'>
<div class='answer'>

$3 \ \text {m}$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>As per the question,
<emptyline>
To find out the height of the plant after five months, we should know the height of plant at the end of first, second, third and fourth month.
<emptyline>
$
\begin {aligned}
\text {Height of the plant at the end of the first month}       &= 1 \ \text {m} \\\\
\text {Height of the plant at the end of the second month}      &= 1 + \dfrac {1} {2} \ \text {of} \ 1 \\\\
                                                                &= 1 + \dfrac {1} {2} \\\\
                                                                &= \dfrac {1 \times 2} {1 \times 2} + \dfrac {1} {2} \\\\
                                                                &= \dfrac {2} {2} + \dfrac {1} {2} \\\\
                                                                &= \dfrac {2 + 1} {2} \\\\
                                                                &= \dfrac {3} {2} \\\\
                                                                &= 1.5 \ \text {m} \\\\
\text {Height of the plant at the end of the third month}       &= 1.5 + \dfrac {1} {3} \ \text {of} \ 1.5 \\\\
                                                                &= 1.5 + \dfrac {1} {3} \times 1.5 \\\\
                                                                &= \dfrac {3} {2} + \dfrac {1} {3} \times \dfrac {3} {2} \\\\
                                                                &= \dfrac {3} {2} + \dfrac {3} {6} \\\\
                                                                &= \dfrac {3} {2} + \dfrac {1} {2} \\\\
                                                                &= \dfrac {3 + 1} {2} \\\\
                                                                &= \dfrac {4} {2} \\\\
                                                                &= 2 \ \text {m} \\\\
\text {Height of the plant at the end of the fourth month}      &= 2 + \dfrac {1} {4} \ \text {of} \ 2 \\\\
                                                                &= 2 + \dfrac {1} {4} \times 2 \\\\
                                                                &= 2 + \dfrac {2} {4} \\\\
                                                                &= \dfrac {2 \times 4} {1 \times 4} + \dfrac {2} {4} \\\\
                                                                &= \dfrac {8} {4} + \dfrac {2} {4} \\\\
                                                                &= \dfrac {8 + 2} {4} \\\\
                                                                &= \dfrac {10} {4} \\\\
                                                                &= 2.5 \ \text {m} \\\\
\text {Height of the plant at the end of the fifth month}       &= 2.5 + \dfrac {1} {5} \ \text {of} \ 2.5 \\\\
                                                                &= \dfrac {5} {2} + \dfrac {1} {5} \times \dfrac {5} {2} \\\\
                                                                &= \dfrac {5} {2} + \dfrac {5} {10} \\\\
                                                                &= \dfrac {5 \times 5} {2 \times 5} + \dfrac {5} {10} \\\\
                                                                &= \dfrac {25} {10} + \dfrac {5} {10} \\\\
                                                                &= \dfrac {25 + 5} {10} \\\\
                                                                &= \dfrac {30} {10} \\\\
                                                                &= \dfrac {3 \cancel {0}} {1 \cancel {0}} \\\\
                                                                &= 3 \ \text {m}
\end {aligned}
$
<emptyline>
The plant will be $3 \ \text {m}$ tall after five months.
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
<pre class='language-latex'><code class='language-latex'>$3 \ \text {m}$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

If a plant **grows** $90 \ \text{cm}$ in the third month, how tall was it after one month?

</div>
<div class='workings'>
<div class='working'>

Let the size of plant at the end of first month $= a$

Size of plant at the end of second month $= a + \dfrac {1} {2} \times a$

As per the question,

$
\begin{aligned}
\dfrac{1}{3} \times \text {Size of plant at the end of second month}    &= 90 \\\\
\dfrac{1}{3} \times (a + \dfrac {1} {2} \times a)                       &= 90 \\\\
\dfrac{1}{3} \times (a + \dfrac {a} {2})                                &= 90 \\\\
\dfrac{1}{3} \times (\dfrac {a \times 2} {1 \times 2} + \dfrac {a} {2}) &= 90 \\\\
\dfrac{1}{3} \times (\dfrac {2a} {2} + \dfrac {a} {2})                  &= 90 \\\\
\dfrac{1}{3} \times \dfrac {2a + a} {2}                                 &= 90 \\\\
\dfrac{1}{3} \times \dfrac {3a} {2}                                     &= 90 \\\\
\dfrac {3a} {3 \times 2}                                                &= 90 \\\\
\dfrac {3 \times a} {3 \times 2}                                        &= 90 \\\\
\dfrac {\cancel{3} \times a} {\cancel{3} \times 2}                      &= 90 \\\\
\dfrac {a} {2}                                                          &= 90 \\\\
a                                                                       &= 90 \times 2 \\\\
a                                                                       &= 180 \ \text{cm}
\end{aligned}
$

The plant was $180 \ \text{cm}$ tall after one month.

</div>
</div>
<div class='answers'>
<div class='answer'>

$180 \ \text{cm}$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let the size of plant at the end of first month $= a$
<emptyline>
Size of plant at the end of second month $= a + \dfrac {1} {2} \times a$
<emptyline>
As per the question,
<emptyline>
$
\begin{aligned}
\dfrac{1}{3} \times \text {Size of plant at the end of second month}    &= 90 \\\\
\dfrac{1}{3} \times (a + \dfrac {1} {2} \times a)                       &= 90 \\\\
\dfrac{1}{3} \times (a + \dfrac {a} {2})                                &= 90 \\\\
\dfrac{1}{3} \times (\dfrac {a \times 2} {1 \times 2} + \dfrac {a} {2}) &= 90 \\\\
\dfrac{1}{3} \times (\dfrac {2a} {2} + \dfrac {a} {2})                  &= 90 \\\\
\dfrac{1}{3} \times \dfrac {2a + a} {2}                                 &= 90 \\\\
\dfrac{1}{3} \times \dfrac {3a} {2}                                     &= 90 \\\\
\dfrac {3a} {3 \times 2}                                                &= 90 \\\\
\dfrac {3 \times a} {3 \times 2}                                        &= 90 \\\\
\dfrac {\cancel{3} \times a} {\cancel{3} \times 2}                      &= 90 \\\\
\dfrac {a} {2}                                                          &= 90 \\\\
a                                                                       &= 90 \times 2 \\\\
a                                                                       &= 180 \ \text{cm}
\end{aligned}
$
<emptyline>
The plant was $180 \ \text{cm}$ tall after one month.
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
<pre class='language-latex'><code class='language-latex'>$180 \ \text{cm}$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

If a plant is $2 \ \text{metres}$ tall at the end of the first month, **how much will it have grown**, in total, by the end of the fifth month?

</div>
<div class='workings'>
<div class='working'>

As per the question,

$
\begin{aligned}
\text{Height of the tree at the end of first month}  &= 2 \ \text {m} \\\\
\text{Height of the tree at the end of second month} &= 2 + 2 \times \dfrac {1}{2}\\\\
                                                     &= 2 + 1 \\\\
                                                     &= 3 \ \text {m} \\\\
\text{Height of the tree at the end of third month}  &= 3 + 3 \times \dfrac {1}{3}\\\\
                                                     &= 3 + 1 \\\\
                                                     &= 4 \ \text {m} \\
\text{Height of the tree at the end of fourth month} &= 4 + 4 \times \dfrac {1}{4}\\\\
                                                     &= 4 + 1 \\\\
                                                     &= 5 \ \text {m} \\
\text{Height of the tree at the end of fifth month}  &= 5 + 5 \times \dfrac {1}{5}\\\\
                                                     &= 5 + 1 \\\\
                                                     &= 6 \ \text {m} 
\end{aligned}
$



$
\begin{aligned}
\text{Total growth from end of first month to end of fifth month}  &= 6 - 2 \\\\
                                                                    &= 4 \ \text {m}
\end{aligned}
$


</div>
</div>
<div class='answers'>
<div class='answer'>

$4 \ \text {m}$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>As per the question,
<emptyline>
$
\begin{aligned}
\text{Height of the tree at the end of first month}  &= 2 \ \text {m} \\\\
\text{Height of the tree at the end of second month} &= 2 + 2 \times \dfrac {1}{2}\\\\
                                                     &= 2 + 1 \\\\
                                                     &= 3 \ \text {m} \\\\
\text{Height of the tree at the end of third month}  &= 3 + 3 \times \dfrac {1}{3}\\\\
                                                     &= 3 + 1 \\\\
                                                     &= 4 \ \text {m} \\
\text{Height of the tree at the end of fourth month} &= 4 + 4 \times \dfrac {1}{4}\\\\
                                                     &= 4 + 1 \\\\
                                                     &= 5 \ \text {m} \\
\text{Height of the tree at the end of fifth month}  &= 5 + 5 \times \dfrac {1}{5}\\\\
                                                     &= 5 + 1 \\\\
                                                     &= 6 \ \text {m} 
\end{aligned}
$
<emptyline>

<emptyline>
$
\begin{aligned}
\text{Total growth from end of first month to end of fifth month}  &= 6 - 2 \\\\
                                                                    &= 4 \ \text {m}
\end{aligned}
$
<emptyline>
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
<pre class='language-latex'><code class='language-latex'>$4 \ \text {m}$
</code></pre>
</div>
</div>

</div>
</li>
</ul>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='130DB243-D3C7-45CA-9989-ED58478FAE23' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='130DB243-D3C7-45CA-9989-ED58478FAE23' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='130DB243-D3C7-45CA-9989-ED58478FAE23' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='130DB243-D3C7-45CA-9989-ED58478FAE23' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='130DB243-D3C7-45CA-9989-ED58478FAE23' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='130DB243-D3C7-45CA-9989-ED58478FAE23' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='130DB243-D3C7-45CA-9989-ED58478FAE23' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='130DB243-D3C7-45CA-9989-ED58478FAE23' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='130DB243-D3C7-45CA-9989-ED58478FAE23' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G1' data-uuid='130DB243-D3C7-45CA-9989-ED58478FAE23' id='FORM-130DB243-D3C7-45CA-9989-ED58478FAE23' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-130DB243-D3C7-45CA-9989-ED58478FAE23'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcr question'>
<div class='uuid'>
<p>EC76AD4B-0FB5-4FAA-9501-93309D05DD30</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2019--arithmetic-b:1:6</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_pr</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

If the weight of straight bones in the human body depends on the length, radius and density of the bone using the following formula

$\text{Weight} = \text{Length}\times \text{Radius} \times \text{Radius} \times \text{Density}$

or $W = L \times R \times R \times D$

then a shin bone of length $40 \ \text{cm}$, radius $3 \ \text{cm}$ and density $5$ would have a weight of $1800 \ \text{g}$ because

$W = 40 \times 3 \times 3 \times 5 = 1800$

Using this formula,

</div>
<div class='workings'>
<div class='working'>



</div>
<div class='working'>

TODOWORKING

</div>
</div>
<div class='answers'>
<div class='answer'>

TODOANSWER

</div>
<div class='answer'>

TODOANSWER

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>
</code></pre>
</div>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>TODOWORKING
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
<pre class='language-latex'><code class='language-latex'>TODOANSWER
</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>TODOANSWER
</code></pre>
</div>
</div>
<ul class='subquestion lower-alpha'>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Work out the weight of a finger bone of length $3 \ \text{cm}$, with a radius of $0.5 \ \text{cm}$ and density $2$

</div>
<div class='workings'>
<div class='working'>


$
\begin{aligned}
&= 3 \times 0.5 \times 0.5 \times 2 \\
&= (3 \times 0.5) \times (0.5 \times 2) \\
&= 1.5 \times 1 \\
&= 1.5 \text {g}\\
\end {aligned}
$



</div>
</div>
<div class='answers'>
<div class='answer'>

TODOANSWER

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>
$
\begin{aligned}
&= 3 \times 0.5 \times 0.5 \times 2 \\
&= (3 \times 0.5) \times (0.5 \times 2) \\
&= 1.5 \times 1 \\
&= 1.5 \text {g}\\
\end {aligned}
$
<emptyline>

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
<pre class='language-latex'><code class='language-latex'>TODOANSWER
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Work out the density of a forearm of length $30 \ \text{cm}$, with a radius of $2 \ \text{cm}$ which weighs $480 \ \text{g}$

</div>
<div class='workings'>
<div class='working'>


$
\begin{aligned}
30 \times 2 \times 2 \times D &= 480 \\\\
120 \times D                  &= 480 \\\\
D                             &= \dfrac{480}{120} \\\\
D                             &= \dfrac{120 \times 4}{120} \\\\
D                             &= \dfrac{\cancel {120} \times 4}{\cancel {120}} \\\\
D                             &= 4 
\end {aligned}
$

Density $= 4$


</div>
</div>
<div class='answers'>
<div class='answer'>

$4$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>
$
\begin{aligned}
30 \times 2 \times 2 \times D &= 480 \\\\
120 \times D                  &= 480 \\\\
D                             &= \dfrac{480}{120} \\\\
D                             &= \dfrac{120 \times 4}{120} \\\\
D                             &= \dfrac{\cancel {120} \times 4}{\cancel {120}} \\\\
D                             &= 4 
\end {aligned}
$
<emptyline>
Density $= 4$
<emptyline>
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
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Work out the radius of a thigh bone of length $50 \ \text{cm}$ which has a density of $8$ and weighs $3600 \ \text{g}$

</div>
<div class='workings'>
<div class='working'>


$
\begin{aligned}
50 \times R \times R \times 8   &= 3600 \\\\
50 \times R^2 \times 8          &= 3600 \\\\
400 \times R^2                  &= 3600 \\\\
R^2                             &= \dfrac{3600}{400} \\\\
R^2                             &= \dfrac{400 \times 9}{400} \\\\
R^2                             &= \dfrac{\cancel {400} \times 9}{\cancel {400}} \\\\
R^2                             &= 9 \\\\
R                               &= \sqrt{9} \\\\
R                               &= 3 \text { cm}
\end {aligned}
$

Radius $= 3 \text { cm}$



</div>
</div>
<div class='answers'>
<div class='answer'>

$3 \text {cm}$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>
$
\begin{aligned}
50 \times R \times R \times 8   &= 3600 \\\\
50 \times R^2 \times 8          &= 3600 \\\\
400 \times R^2                  &= 3600 \\\\
R^2                             &= \dfrac{3600}{400} \\\\
R^2                             &= \dfrac{400 \times 9}{400} \\\\
R^2                             &= \dfrac{\cancel {400} \times 9}{\cancel {400}} \\\\
R^2                             &= 9 \\\\
R                               &= \sqrt{9} \\\\
R                               &= 3 \text { cm}
\end {aligned}
$
<emptyline>
Radius $= 3 \text { cm}$
<emptyline>

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
<pre class='language-latex'><code class='language-latex'>$3 \text {cm}$
</code></pre>
</div>
</div>

</div>
</li>
</ul>
<div class='review-comments'>

<h4>Review Comments</h4>




Part a) 

i)Coding guidelines not followed. Give proper spacing between lines and also between answer and unit.



ii) Answer missing!!!



iii) Explanation missing:

APTQ,

Weight of a finger bone = \"expression here..\"

then solve further...



Part b)

i) Add APTQ at the beginning.



ii) Last line: Density \"of forearm\" = 4



Part c) 

i) Same as part b)

ii) Space between value and unit in answer section.
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='EC76AD4B-0FB5-4FAA-9501-93309D05DD30' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='EC76AD4B-0FB5-4FAA-9501-93309D05DD30' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='EC76AD4B-0FB5-4FAA-9501-93309D05DD30' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='EC76AD4B-0FB5-4FAA-9501-93309D05DD30' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='EC76AD4B-0FB5-4FAA-9501-93309D05DD30' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='EC76AD4B-0FB5-4FAA-9501-93309D05DD30' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='EC76AD4B-0FB5-4FAA-9501-93309D05DD30' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='EC76AD4B-0FB5-4FAA-9501-93309D05DD30' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='EC76AD4B-0FB5-4FAA-9501-93309D05DD30' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='PR' data-uuid='EC76AD4B-0FB5-4FAA-9501-93309D05DD30' id='FORM-EC76AD4B-0FB5-4FAA-9501-93309D05DD30' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-EC76AD4B-0FB5-4FAA-9501-93309D05DD30'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_g1 rag_prns question'>
<div class='uuid'>
<p>8A898C47-8D9A-43DC-AC09-747E90B1BA6A</p>
</div>
<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2019--arithmetic-b:1:11</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g1</p>
</div>
<div class='rag'>
<p>rag_wf_prns</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

A pair of numbers written as a column like this $\dbinom {5}{2}$ is known as a $\text{VEC}$.

$\text{VECs}$ can be combined together in two different ways, as follows


$\dbinom {5}{2} \ldotp \dbinom {6}{7} = 5 \times 6 + 2 \times 7 = 30 + 14 = 44$

$\dbinom {5}{2} \wedge \dbinom {6}{7} = 5 \times 7 - 2 \times 6 = 35 - 12 = 23$

</div>
<div class='workings'>
<div class='working'>

TODOWORKING

</div>
<div class='working'>

TODOWORKING

</div>
</div>
<div class='answers'>
<div class='answer'>

TODOANSWER

</div>
<div class='answer'>

TODOANSWER

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>TODOWORKING
</code></pre>
</div>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>TODOWORKING
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
<pre class='language-latex'><code class='language-latex'>TODOANSWER
</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>TODOANSWER
</code></pre>
</div>
</div>
<ul class='subquestion lower-alpha'>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Work out the value of $\dbinom {7}{5} \ldotp \dbinom {8}{9}$

</div>
<div class='workings'>
<div class='working'>


$
\begin{aligned}
&= (7 \times 8) + (5\times 9) \\
&= 56 + 45 \\
&= 101 \\
\end{aligned}
$


</div>
</div>
<div class='answers'>
<div class='answer'>

$101$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>
$
\begin{aligned}
&= (7 \times 8) + (5\times 9) \\
&= 56 + 45 \\
&= 101 \\
\end{aligned}
$
<emptyline>
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
<pre class='language-latex'><code class='language-latex'>$101$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Work out the value of $\dbinom {7}{5} \wedge  \dbinom {8}{9}$ 

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
&= (7 \times 9) - (5\times 8) \\
&= 63 - 40 \\
&= 23 \\
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$23$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>$
\begin{aligned}
&= (7 \times 9) - (5\times 8) \\
&= 63 - 40 \\
&= 23 \\
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
<pre class='language-latex'><code class='language-latex'>$23$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Find the value of $p$ if $\dbinom {3}{11} \ldotp \dbinom {5}{p} = 37$

</div>
<div class='workings'>
<div class='working'>


$
\begin{aligned}
(3 \times 5) + (11\times p)    &= 37 \\\\
15 + 11p                       &= 37 \\\\
11p                            &= 37 - 15 \\\\
p                              &= \dfrac {22}{11} \\\\ 
p                              &= \dfrac {11 \times 2}{11} \\\\  
p                              &= \dfrac {\cancel {11} \times 2}{\cancel {11}} \\\\
p                              &= 2   
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$2$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>
$
\begin{aligned}
(3 \times 5) + (11\times p)    &= 37 \\\\
15 + 11p                       &= 37 \\\\
11p                            &= 37 - 15 \\\\
p                              &= \dfrac {22}{11} \\\\ 
p                              &= \dfrac {11 \times 2}{11} \\\\  
p                              &= \dfrac {\cancel {11} \times 2}{\cancel {11}} \\\\
p                              &= 2   
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
<pre class='language-latex'><code class='language-latex'>$2$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Find the value of q if $\dbinom {3}{9} \wedge  \dbinom {2}{q} = 6$

</div>
<div class='workings'>
<div class='working'>


$
\begin{aligned}
(3 \times q) - (9\times 2) &= 6 \\\\
3q - 18                    &= 6 \\\\
3q                         &= 6 + 18 \\\\
3q                         &= 24 \\\\
q                          &= \dfrac {24}{3} \\\\
q                          &= \dfrac {3 \times 8}{3} \\\\ 
q                          &= \dfrac {\cancel 3 \times 8}{\cancel 3} \\\\   
q                          &= 8            
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$8$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>
$
\begin{aligned}
(3 \times q) - (9\times 2) &= 6 \\\\
3q - 18                    &= 6 \\\\
3q                         &= 6 + 18 \\\\
3q                         &= 24 \\\\
q                          &= \dfrac {24}{3} \\\\
q                          &= \dfrac {3 \times 8}{3} \\\\ 
q                          &= \dfrac {\cancel 3 \times 8}{\cancel 3} \\\\   
q                          &= 8            
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
<pre class='language-latex'><code class='language-latex'>$8$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Find the value of $r$ if $\dbinom {6}{r} \ldotp \dbinom {r}{4} = 40$

</div>
<div class='workings'>
<div class='working'>


$
\begin{aligned}
(6 \times r) + (r \times 4)   &= 40  \\\\
6r + 4r                       &= 40  \\\\
10r                           &= 40  \\\\
r                             &= \dfrac {40}{10} \\\\ 
r                             &= \dfrac {4 \times 10}{10} \\\\ 
r                             &= \dfrac {4 \times \cancel {10}}{\cancel {10}} \\\\ 
r                             &= 4  
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$4$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>
$
\begin{aligned}
(6 \times r) + (r \times 4)   &= 40  \\\\
6r + 4r                       &= 40  \\\\
10r                           &= 40  \\\\
r                             &= \dfrac {40}{10} \\\\ 
r                             &= \dfrac {4 \times 10}{10} \\\\ 
r                             &= \dfrac {4 \times \cancel {10}}{\cancel {10}} \\\\ 
r                             &= 4  
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
<pre class='language-latex'><code class='language-latex'>$4$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Find the value of $s$ if $\dbinom {8}{s} \wedge  \dbinom {2}{s} = 30$

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
(8 \times s) - (2 \times s)   &= 30  \\\\
8s - 2s                       &= 30  \\\\
6s                            &= 30  \\\\
r                             &= \dfrac {30}{6} \\\\ 
r                             &= \dfrac {5 \times 6}{6} \\\\ 
r                             &= \dfrac {5 \times \cancel 6}{\cancel 6} \\\\ 
r                             &= 5  
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$5$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>$
\begin{aligned}
(8 \times s) - (2 \times s)   &= 30  \\\\
8s - 2s                       &= 30  \\\\
6s                            &= 30  \\\\
r                             &= \dfrac {30}{6} \\\\ 
r                             &= \dfrac {5 \times 6}{6} \\\\ 
r                             &= \dfrac {5 \times \cancel 6}{\cancel 6} \\\\ 
r                             &= 5  
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
<pre class='language-latex'><code class='language-latex'>$5$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Find the value of $t$ if $\dbinom {12}{t} \wedge  \dbinom {t}{8} = 47$

</div>
<div class='workings'>
<div class='working'>


$
\begin{aligned}
(12 \times 8) - (t \times t)  &= 47  \\\\
96 - t^2                      &= 47  \\\\
t^2                           &= 96 - 47  \\\\
t^2                           &= 49 \\\\ 
t                             &= \sqrt{49} \\\\ 
t                             &= 7
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$7$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>
$
\begin{aligned}
(12 \times 8) - (t \times t)  &= 47  \\\\
96 - t^2                      &= 47  \\\\
t^2                           &= 96 - 47  \\\\
t^2                           &= 49 \\\\ 
t                             &= \sqrt{49} \\\\ 
t                             &= 7
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
<pre class='language-latex'><code class='language-latex'>$7$
</code></pre>
</div>
</div>

</div>
</li>
</ul>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='8A898C47-8D9A-43DC-AC09-747E90B1BA6A' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='8A898C47-8D9A-43DC-AC09-747E90B1BA6A' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='8A898C47-8D9A-43DC-AC09-747E90B1BA6A' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='8A898C47-8D9A-43DC-AC09-747E90B1BA6A' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='8A898C47-8D9A-43DC-AC09-747E90B1BA6A' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='8A898C47-8D9A-43DC-AC09-747E90B1BA6A' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='8A898C47-8D9A-43DC-AC09-747E90B1BA6A' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='8A898C47-8D9A-43DC-AC09-747E90B1BA6A' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='8A898C47-8D9A-43DC-AC09-747E90B1BA6A' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G1' data-uuid='8A898C47-8D9A-43DC-AC09-747E90B1BA6A' id='FORM-8A898C47-8D9A-43DC-AC09-747E90B1BA6A' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-8A898C47-8D9A-43DC-AC09-747E90B1BA6A'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_g1 rag_prns question'>
<div class='uuid'>
<p>338BD9F0-E09D-4540-A23F-773F26F2E6B6</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-1:1:7</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g1</p>
</div>
<div class='rag'>
<p>rag_wf_prns</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

Write in what the two missing digits could be:


$\boxed{}\boxed{3}\boxed{4} + \boxed {} \boxed {9} \boxed{7} = 631$

</div>
<div class='workings'>
<div class='working'>

Let the missing digits = $a , b$

As per the question,

$a34 + b97 = 631$

$
\begin{array}{cccccccccccccc}
      &   a       &   3   &   4 \\
{}+   &   b       &   9   &   7 \\
   \hline
      & (a+b+1)   &   3   &   1
\end{array}
$

Comparing the digits, $a + b + 1 = 6$

$
\begin{aligned}
a + b    &= 6 - 1 \\\\
a + b    &= 5
\end{aligned}
$

The set of digits $a ,b$ can be = $ (1, 4), (2, 3), (3, 2), (4,1)$

</div>
</div>
<div class='answers'>
<div class='answer'>

$ (1, 4), (2, 3), (3, 2), (4,1)$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let the missing digits = $a , b$
<emptyline>
As per the question,
<emptyline>
$a34 + b97 = 631$
<emptyline>
$
\begin{array}{cccccccccccccc}
      &   a       &   3   &   4 \\
{}+   &   b       &   9   &   7 \\
   \hline
      & (a+b+1)   &   3   &   1
\end{array}
$
<emptyline>
Comparing the digits, $a + b + 1 = 6$
<emptyline>
$
\begin{aligned}
a + b    &= 6 - 1 \\\\
a + b    &= 5
\end{aligned}
$
<emptyline>
The set of digits $a ,b$ can be = $ (1, 4), (2, 3), (3, 2), (4,1)$
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
<pre class='language-latex'><code class='language-latex'>$ (1, 4), (2, 3), (3, 2), (4,1)$
</code></pre>
</div>
</div>


<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='338BD9F0-E09D-4540-A23F-773F26F2E6B6' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='338BD9F0-E09D-4540-A23F-773F26F2E6B6' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='338BD9F0-E09D-4540-A23F-773F26F2E6B6' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='338BD9F0-E09D-4540-A23F-773F26F2E6B6' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='338BD9F0-E09D-4540-A23F-773F26F2E6B6' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='338BD9F0-E09D-4540-A23F-773F26F2E6B6' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='338BD9F0-E09D-4540-A23F-773F26F2E6B6' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='338BD9F0-E09D-4540-A23F-773F26F2E6B6' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='338BD9F0-E09D-4540-A23F-773F26F2E6B6' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G1' data-uuid='338BD9F0-E09D-4540-A23F-773F26F2E6B6' id='FORM-338BD9F0-E09D-4540-A23F-773F26F2E6B6' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-338BD9F0-E09D-4540-A23F-773F26F2E6B6'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_g0 rag_prpcr question'>
<div class='uuid'>
<p>0A3C048F-79C4-49D7-B58E-976896702ECF</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-1:1:9</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g0</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

Write in the missing numbers to each of the following:

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
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>%empty%
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
<pre class='language-latex'><code class='language-latex'>%empty%
</code></pre>
</div>
</div>
<ul class='subquestion lower-alpha'>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

$93 - \Box - \boxed{18} = 36$

</div>
<div class='workings'>
<div class='working'>

$93 - \underline{\green
{39}} - 18 = 43$

</div>
</div>
<div class='answers'>
<div class='answer'>

$39$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>$93 - \underline{\rtq_katex_color_answer{39}} - 18 = 43$
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
<pre class='language-latex'><code class='language-latex'>$39$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

$(8 + \Box )\times 7 =91$

</div>
<div class='workings'>
<div class='working'>

Let the missing number $=a$

As per the question,

$
\begin{aligned}
(8 + a)\times 7     &= 91 \\\\
8 + a               &= \dfrac {91} {7} \\\\ 
                    &= \dfrac {7 \times 13} {7} \\\\
                    &= \dfrac {\cancel {7} \times 13} {\cancel {7}} \\\\
8 + a               &= 13 \\\\
a                   &= 13 - 8 \\\\
a                   &= 5
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$5$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let the missing number $=a$
<emptyline>
As per the question,
<emptyline>
$
\begin{aligned}
(8 + a)\times 7     &= 91 \\\\
8 + a               &= \dfrac {91} {7} \\\\ 
                    &= \dfrac {7 \times 13} {7} \\\\
                    &= \dfrac {\cancel {7} \times 13} {\cancel {7}} \\\\
8 + a               &= 13 \\\\
a                   &= 13 - 8 \\\\
a                   &= 5
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
<pre class='language-latex'><code class='language-latex'>$5$
</code></pre>
</div>
</div>

</div>
</li>
</ul>
<div class='review-comments'>

<h4>Review Comments</h4>




Part a) 

Show the explanation as well.



Let the missing number = a

APTQ,

93 - a - 18 = 36

then solve further...



Part b)

8 + a = 91 / 7

After this, \"8 + a\" is missing in two lines.
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='0A3C048F-79C4-49D7-B58E-976896702ECF' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='0A3C048F-79C4-49D7-B58E-976896702ECF' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='0A3C048F-79C4-49D7-B58E-976896702ECF' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='0A3C048F-79C4-49D7-B58E-976896702ECF' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='0A3C048F-79C4-49D7-B58E-976896702ECF' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='0A3C048F-79C4-49D7-B58E-976896702ECF' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='0A3C048F-79C4-49D7-B58E-976896702ECF' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='0A3C048F-79C4-49D7-B58E-976896702ECF' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='0A3C048F-79C4-49D7-B58E-976896702ECF' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G0' data-uuid='0A3C048F-79C4-49D7-B58E-976896702ECF' id='FORM-0A3C048F-79C4-49D7-B58E-976896702ECF' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-0A3C048F-79C4-49D7-B58E-976896702ECF'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_g1 rag_prns question'>
<div class='uuid'>
<p>97E481D7-AB21-4BC5-A018-A6D984DF8B70</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-1:1:12</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g1</p>
</div>
<div class='rag'>
<p>rag_wf_prns</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

The three numbers missing from these boxes are all prime numbers. Write in the missing numbers.



$\Box \times \Box \times \Box = 385$

</div>
<div class='workings'>
<div class='working'>

Prime factors of $385 = 5, 7, 11$

Let's verify,

$
\begin{aligned}
&= 5 \times 7 \times 11 \\\\
&= 385 
\end{aligned}
$


</div>
</div>
<div class='answers'>
<div class='answer'>

$5, 7, 11$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Prime factors of $385 = 5, 7, 11$
<emptyline>
Let's verify,
<emptyline>
$
\begin{aligned}
&= 5 \times 7 \times 11 \\\\
&= 385 
\end{aligned}
$
<emptyline>
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
<pre class='language-latex'><code class='language-latex'>$5, 7, 11$
</code></pre>
</div>
</div>


<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='97E481D7-AB21-4BC5-A018-A6D984DF8B70' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='97E481D7-AB21-4BC5-A018-A6D984DF8B70' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='97E481D7-AB21-4BC5-A018-A6D984DF8B70' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='97E481D7-AB21-4BC5-A018-A6D984DF8B70' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='97E481D7-AB21-4BC5-A018-A6D984DF8B70' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='97E481D7-AB21-4BC5-A018-A6D984DF8B70' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='97E481D7-AB21-4BC5-A018-A6D984DF8B70' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='97E481D7-AB21-4BC5-A018-A6D984DF8B70' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='97E481D7-AB21-4BC5-A018-A6D984DF8B70' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G1' data-uuid='97E481D7-AB21-4BC5-A018-A6D984DF8B70' id='FORM-97E481D7-AB21-4BC5-A018-A6D984DF8B70' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-97E481D7-AB21-4BC5-A018-A6D984DF8B70'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_oldpr rag_prpcr question'>
<div class='uuid'>
<p>2ABA366D-6722-48B2-9A4C-D98E63A13BFD</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-1:1:15</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_oldpr</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
<li>
tmoney
</li>
</ul>
</div>
<div class='question question'>

The charge $$\pounds C$ made by a caterer for arranging a birthday party for $n$ people is given by theformula:

$C = 3n +40$

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
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>%empty%
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
<pre class='language-latex'><code class='language-latex'>%empty%
</code></pre>
</div>
</div>
<ul class='subquestion lower-alpha'>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

What is the charge, in $\pounds $, for a party of $20$ people?

</div>
<div class='workings'>
<div class='working'>

As per the question,

Charge per 20 people $\pounds$ C   $= 3 \times 20 + 40$

$
\begin{aligned}
&= 3 \times 20 + 40 \\\\
&= 60 + 40 \\\\
&= \pounds 100
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$\pounds 100$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>As per the question,
<emptyline>
Charge per 20 people $\pounds$ C   $= 3 \times 20 + 40$
<emptyline>
$
\begin{aligned}
&= 3 \times 20 + 40 \\\\
&= 60 + 40 \\\\
&= \pounds 100
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
<pre class='language-latex'><code class='language-latex'>$\pounds 100$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

What is the average cost per person for a party of $20$ people?

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
&= \dfrac {100} {20} \\\\
&= \dfrac {20 \times 5} {20} \\\\
&= \dfrac {\cancel{20} \times 5} {\cancel{20}} \\\\
&= \pounds 5
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$5$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>$
\begin{aligned}
&= \dfrac {100} {20} \\\\
&= \dfrac {20 \times 5} {20} \\\\
&= \dfrac {\cancel{20} \times 5} {\cancel{20}} \\\\
&= \pounds 5
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
<pre class='language-latex'><code class='language-latex'>$5$
</code></pre>
</div>
</div>

</div>
</li>
</ul>
<div class='review-comments'>

<h4>Review Comments</h4>




Part a) 

Remove units \"£\" from the below line and put this line inside \begin-end.



Charge per 20 people £ C = 3 x 20 + 40



Part b)

i) Add a starting line inside \begin-end.

\text {Average cost per person} = \dfrac {\text {Cost of 20 people}} {20}

then solve further....



ii) Add unit in the answer section.
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='2ABA366D-6722-48B2-9A4C-D98E63A13BFD' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='2ABA366D-6722-48B2-9A4C-D98E63A13BFD' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='2ABA366D-6722-48B2-9A4C-D98E63A13BFD' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='2ABA366D-6722-48B2-9A4C-D98E63A13BFD' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='2ABA366D-6722-48B2-9A4C-D98E63A13BFD' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='2ABA366D-6722-48B2-9A4C-D98E63A13BFD' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='2ABA366D-6722-48B2-9A4C-D98E63A13BFD' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='2ABA366D-6722-48B2-9A4C-D98E63A13BFD' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='2ABA366D-6722-48B2-9A4C-D98E63A13BFD' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='PR' data-uuid='2ABA366D-6722-48B2-9A4C-D98E63A13BFD' id='FORM-2ABA366D-6722-48B2-9A4C-D98E63A13BFD' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-2ABA366D-6722-48B2-9A4C-D98E63A13BFD'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcr question'>
<div class='uuid'>
<p>594EBD3F-1293-4FF8-93B0-C9B96E73E43C</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-1:1:19</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_pr</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

Find the missing numbers so that the answer is always $56$

![missing image](/papers/missing_image.svg)


</div>
<div class='workings'>
<div class='working'>

Let the missing number $=a$

As per the question,

$
\begin{aligned}
17 + a                  &= 56 \\\\
a                       &= 56 - 17 \\\\
a                       &= 39
\end{aligned}
$

Let the missing number $=b$

$
\begin{aligned}
131 - b                 &= 56 \\\\
b                       &= 131 - 56 \\\\
b                       &= 75
\end{aligned}
$

Let the missing number $=c$

As per the question,

$
\begin{aligned}
50 \% \ \text{of} \ c                                   &= 56 \\\\
\dfrac {50} {100} \times c                              &= 56 \\\\
\dfrac {50} {50 \times 2} \times c                      &= 56 \\\\
\dfrac {\cancel {50}} {\cancel {50} \times 2} \times c  &= 56 \\\\
\dfrac {1} {2} \times c                                 &= 56 \\\\
c                                                       &= 56 \times 2 \\\\
c                                                       &= 112
\end{aligned}
$

Let the missing number $=d$

As per the question,

$
\begin{aligned}
560 \div d              &= 56 \\\\
d                       &= \dfrac {560} {56}  \\\\
d                       &= \dfrac {56 \times 10} {56}  \\\\
d                       &= \dfrac {\cancel {56} \times 10} {\cancel {56}}  \\\\
d                       &= 10
\end{aligned}
$

Let the missing number $=e$

As per the question,

$
\begin{aligned}
\dfrac {1} {2} \times e                                 &= 56 \\\\
e                                                       &= 56 \times 2 \\\\
e                                                       &= 112
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$ 39, 187, 112, 10, 112$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let the missing number $=a$
<emptyline>
As per the question,
<emptyline>
$
\begin{aligned}
17 + a                  &= 56 \\\\
a                       &= 56 - 17 \\\\
a                       &= 39
\end{aligned}
$
<emptyline>
Let the missing number $=b$
<emptyline>
$
\begin{aligned}
131 - b                 &= 56 \\\\
b                       &= 131 - 56 \\\\
b                       &= 75
\end{aligned}
$
<emptyline>
Let the missing number $=c$
<emptyline>
As per the question,
<emptyline>
$
\begin{aligned}
50 \% \ \text{of} \ c                                   &= 56 \\\\
\dfrac {50} {100} \times c                              &= 56 \\\\
\dfrac {50} {50 \times 2} \times c                      &= 56 \\\\
\dfrac {\cancel {50}} {\cancel {50} \times 2} \times c  &= 56 \\\\
\dfrac {1} {2} \times c                                 &= 56 \\\\
c                                                       &= 56 \times 2 \\\\
c                                                       &= 112
\end{aligned}
$
<emptyline>
Let the missing number $=d$
<emptyline>
As per the question,
<emptyline>
$
\begin{aligned}
560 \div d              &= 56 \\\\
d                       &= \dfrac {560} {56}  \\\\
d                       &= \dfrac {56 \times 10} {56}  \\\\
d                       &= \dfrac {\cancel {56} \times 10} {\cancel {56}}  \\\\
d                       &= 10
\end{aligned}
$
<emptyline>
Let the missing number $=e$
<emptyline>
As per the question,
<emptyline>
$
\begin{aligned}
\dfrac {1} {2} \times e                                 &= 56 \\\\
e                                                       &= 56 \times 2 \\\\
e                                                       &= 112
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
<pre class='language-latex'><code class='language-latex'>$ 39, 187, 112, 10, 112$
</code></pre>
</div>
</div>

<div class='review-comments'>

<h4>Review Comments</h4>
(Subquestion formating- not reviewed)



Discuss over slack.
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='594EBD3F-1293-4FF8-93B0-C9B96E73E43C' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='594EBD3F-1293-4FF8-93B0-C9B96E73E43C' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='594EBD3F-1293-4FF8-93B0-C9B96E73E43C' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='594EBD3F-1293-4FF8-93B0-C9B96E73E43C' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='594EBD3F-1293-4FF8-93B0-C9B96E73E43C' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='594EBD3F-1293-4FF8-93B0-C9B96E73E43C' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='594EBD3F-1293-4FF8-93B0-C9B96E73E43C' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='594EBD3F-1293-4FF8-93B0-C9B96E73E43C' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='594EBD3F-1293-4FF8-93B0-C9B96E73E43C' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='PR' data-uuid='594EBD3F-1293-4FF8-93B0-C9B96E73E43C' id='FORM-594EBD3F-1293-4FF8-93B0-C9B96E73E43C' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-594EBD3F-1293-4FF8-93B0-C9B96E73E43C'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_oldpr rag_prpcr question'>
<div class='uuid'>
<p>EA27B9DD-790C-44A0-8752-26E1204AF515</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-2:1:15</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_oldpr</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

Ben wants to buy $17$ small bottles of drink for a party. A shop sells them at: $15 \text{p}$$ for $1$ bottle; $28 \text{p}$$ for two bottles; $60 \text{p}$$ for a pack of $5$ bottles. What is the smallest amount of money he needs to spend?  [Give your answer in $\pounds s]

</div>
<div class='workings'>
<div class='working'>

To spend the smallest amount Ben needs to buy maximum possible pack of 5 bottles.

Bottles needed $= 17$

$
\begin{aligned}
&= 15 \ \text {bottles} + 2 \ \text {bottles} \\\\
&= 3 \times 5 \ \text {pack} + 1 \times 2 \ \text {pack}
\end{aligned}
$

Let's calculate the amount of money he needs to spend.

Smallest amount he spends $= 3 \times $ Cost of 5 packs $+ 1 \times$ Cost of $2$ packs

$
\begin{aligned}
&= 3 \times 60 \text {p} + 1 \times 28 \text {p} \\\\
&= 180 + 28 \\\\
&= 208 \text {p} \\\\
&= \dfrac {208} {100} \\\\
&= \pounds 2.08
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$\pounds 2.08$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>To spend the smallest amount Ben needs to buy maximum possible pack of 5 bottles.
<emptyline>
Bottles needed $= 17$
<emptyline>
$
\begin{aligned}
&= 15 \ \text {bottles} + 2 \ \text {bottles} \\\\
&= 3 \times 5 \ \text {pack} + 1 \times 2 \ \text {pack}
\end{aligned}
$
<emptyline>
Let's calculate the amount of money he needs to spend.
<emptyline>
Smallest amount he spends $= 3 \times $ Cost of 5 packs $+ 1 \times$ Cost of $2$ packs
<emptyline>
$
\begin{aligned}
&= 3 \times 60 \text {p} + 1 \times 28 \text {p} \\\\
&= 180 + 28 \\\\
&= 208 \text {p} \\\\
&= \dfrac {208} {100} \\\\
&= \pounds 2.08
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
<pre class='language-latex'><code class='language-latex'>$\pounds 2.08$
</code></pre>
</div>
</div>

<div class='review-comments'>

<h4>Review Comments</h4>






i) Put \"Bottles needed = 17\" line inside first \begin-end.



ii) After \"Lets calculate....\" line add the following two lines.

rtq_abbr_md_unit_note

The costs are given in pence and the answer is required in pounds. Lets convert all the costs into pounds.



iii) Put below line inside second \begin-end.

Smallest amount he spends = 3 x Cost of 5 packs + 1 × Cost of 2 packs



iv) Show conversion at the beginning

= 3×60p + 1×28p

= 3 x £ 60/100 + 1 x £ 28/100

= 3 x 60/100 + 1 x 28/100

then solve further...








</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='EA27B9DD-790C-44A0-8752-26E1204AF515' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='EA27B9DD-790C-44A0-8752-26E1204AF515' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='EA27B9DD-790C-44A0-8752-26E1204AF515' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='EA27B9DD-790C-44A0-8752-26E1204AF515' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='EA27B9DD-790C-44A0-8752-26E1204AF515' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='EA27B9DD-790C-44A0-8752-26E1204AF515' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='EA27B9DD-790C-44A0-8752-26E1204AF515' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='EA27B9DD-790C-44A0-8752-26E1204AF515' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='EA27B9DD-790C-44A0-8752-26E1204AF515' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='PR' data-uuid='EA27B9DD-790C-44A0-8752-26E1204AF515' id='FORM-EA27B9DD-790C-44A0-8752-26E1204AF515' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-EA27B9DD-790C-44A0-8752-26E1204AF515'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_g1 rag_prns question'>
<div class='uuid'>
<p>94669F97-3EC9-472D-9A7F-01E61D890604</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-2:1:18</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g1</p>
</div>
<div class='rag'>
<p>rag_wf_prns</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
<li>
tstatistics
</li>
</ul>
</div>
<div class='question question'>

The four numbers $8,\:\: 3,\:\: 9\:\: and\:\:\:\Box$ have an average of $6$.


What number goes in the box?

</div>
<div class='workings'>
<div class='working'>

Let the missing number $= a$

As per the question,

$
\begin{aligned}
\dfrac {8 + 3 + 9 + a} {4}              &= 6 \\\\
\dfrac {20 + a} {4}                     &= 6 \\\\
20 + a                                  &= 6 \times 4 \\\\
20 + a                                  &= 24 \\\\
a                                       &= 24 - 20 \\\\
a                                       &= 4
\end{aligned}
$

The missing number $= 4$

</div>
</div>
<div class='answers'>
<div class='answer'>

$4$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let the missing number $= a$
<emptyline>
As per the question,
<emptyline>
$
\begin{aligned}
\dfrac {8 + 3 + 9 + a} {4}              &= 6 \\\\
\dfrac {20 + a} {4}                     &= 6 \\\\
20 + a                                  &= 6 \times 4 \\\\
20 + a                                  &= 24 \\\\
a                                       &= 24 - 20 \\\\
a                                       &= 4
\end{aligned}
$
<emptyline>
The missing number $= 4$
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


<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='94669F97-3EC9-472D-9A7F-01E61D890604' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='94669F97-3EC9-472D-9A7F-01E61D890604' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='94669F97-3EC9-472D-9A7F-01E61D890604' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='94669F97-3EC9-472D-9A7F-01E61D890604' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='94669F97-3EC9-472D-9A7F-01E61D890604' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='94669F97-3EC9-472D-9A7F-01E61D890604' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='94669F97-3EC9-472D-9A7F-01E61D890604' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='94669F97-3EC9-472D-9A7F-01E61D890604' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='94669F97-3EC9-472D-9A7F-01E61D890604' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G1' data-uuid='94669F97-3EC9-472D-9A7F-01E61D890604' id='FORM-94669F97-3EC9-472D-9A7F-01E61D890604' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-94669F97-3EC9-472D-9A7F-01E61D890604'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_oldpr rag_prccrl question'>
<div class='uuid'>
<p>D3C5761E-89B9-4E65-945B-16E81E23F067</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-2:1:21</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_oldpr</p>
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

On the planet Zog, all numbers are written with the digits in reverse order. For example, forty-five is written as $54$. Pluto, an inhabitant of Zog, was given the subtraction $729-26$. If no mistakes were made, what answer did Pluto write down?

</div>
<div class='workings'>
<div class='working'>

As per the question,

$
\begin{aligned}
&= 729 - 26 \\\\
&= 927 - 62 \\\\
&= 865
\end{aligned}
$

For planet Zog it will be written as $= 568$

</div>
</div>
<div class='answers'>
<div class='answer'>

$568$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>As per the question,
<emptyline>
$
\begin{aligned}
&= 729 - 26 \\\\
&= 927 - 62 \\\\
&= 865
\end{aligned}
$
<emptyline>
For planet Zog it will be written as $= 568$
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
<pre class='language-latex'><code class='language-latex'>$568$
</code></pre>
</div>
</div>

<div class='review-comments'>

<h4>Review Comments</h4>
APTQ,

On planet Zog, all numbers are written in reverse order.

So, 729−26

=927−62

=865



​865 will be also written in reverse order = 568



Change your bleu answer also.
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='D3C5761E-89B9-4E65-945B-16E81E23F067' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='D3C5761E-89B9-4E65-945B-16E81E23F067' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='D3C5761E-89B9-4E65-945B-16E81E23F067' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='D3C5761E-89B9-4E65-945B-16E81E23F067' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='D3C5761E-89B9-4E65-945B-16E81E23F067' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='D3C5761E-89B9-4E65-945B-16E81E23F067' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='D3C5761E-89B9-4E65-945B-16E81E23F067' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='D3C5761E-89B9-4E65-945B-16E81E23F067' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='D3C5761E-89B9-4E65-945B-16E81E23F067' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='PR' data-uuid='D3C5761E-89B9-4E65-945B-16E81E23F067' id='FORM-D3C5761E-89B9-4E65-945B-16E81E23F067' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-D3C5761E-89B9-4E65-945B-16E81E23F067'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_oldpr rag_prpcr question'>
<div class='uuid'>
<p>9FBBD942-5D1D-4C22-990D-69A275C0ADF1</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-2:1:23</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_oldpr</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

The **$\underline{same}$** number if missing from all three boxes.

Write the same missing number in each box.

$\Box\:\:\:\:\times\:\:\:\:\Box\:\:\:\:\times\:\:\:\:\Box= \:\:\:512$

</div>
<div class='workings'>
<div class='working'>

Let the missing number $= a$

As per the question,

$
\begin{aligned}
a^3 &=  512 \\\\
a^3 &= 8 \times 8 \times 8 \\\\
a^3 &= 8^3 \\\\
a   &= 8
\end{aligned}
$

The number in the missing box $= 8$

</div>
</div>
<div class='answers'>
<div class='answer'>

$8$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let the missing number $= a$
<emptyline>
As per the question,
<emptyline>
$
\begin{aligned}
a^3 &=  512 \\\\
a^3 &= 8 \times 8 \times 8 \\\\
a^3 &= 8^3 \\\\
a   &= 8
\end{aligned}
$
<emptyline>
The number in the missing box $= 8$
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
<pre class='language-latex'><code class='language-latex'>$8$
</code></pre>
</div>
</div>

<div class='review-comments'>

<h4>Review Comments</h4>
Delete \"be\" in Line 1



Add after step 1

a^3 =  2 x 256 

a^3 = 4 x 128 

a^3 = 8 x 64 

a^3 = 8 x 8x 8 

a^3 = 8^3

a = 8



The number in the missing box = 8



After APTQ, 

a x a x a = 512  (add this line)

a^3 = 512
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='9FBBD942-5D1D-4C22-990D-69A275C0ADF1' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='9FBBD942-5D1D-4C22-990D-69A275C0ADF1' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='9FBBD942-5D1D-4C22-990D-69A275C0ADF1' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='9FBBD942-5D1D-4C22-990D-69A275C0ADF1' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='9FBBD942-5D1D-4C22-990D-69A275C0ADF1' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='9FBBD942-5D1D-4C22-990D-69A275C0ADF1' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='9FBBD942-5D1D-4C22-990D-69A275C0ADF1' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='9FBBD942-5D1D-4C22-990D-69A275C0ADF1' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='9FBBD942-5D1D-4C22-990D-69A275C0ADF1' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='PR' data-uuid='9FBBD942-5D1D-4C22-990D-69A275C0ADF1' id='FORM-9FBBD942-5D1D-4C22-990D-69A275C0ADF1' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-9FBBD942-5D1D-4C22-990D-69A275C0ADF1'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_g0 rag_prpcr question'>
<div class='uuid'>
<p>82081F61-AF8E-4357-8AF9-7FC59FE52137</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-3:1:1</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g0</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

Write in the missing numbers:

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
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>%empty%
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
<pre class='language-latex'><code class='language-latex'>%empty%
</code></pre>
</div>
</div>
<ul class='subquestion lower-alpha'>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

$23 \times\:\:\:\:\Box  =\:\:\: 690$

</div>
<div class='workings'>
<div class='working'>


Let the missing number $=a$

$
\begin{aligned}
23 \times a                             &= 690 \\\\
a                                       &= \dfrac {690} {23} \\\\
                                        &= \dfrac {30 \times 23} {23} \\\\
                                        &= \dfrac {30 \times \cancel {23}} {\cancel {23}} \\\\
                                        &= 30
\end{aligned} 
$

Missing number $= 30$

</div>
</div>
<div class='answers'>
<div class='answer'>

$30$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>
Let the missing number $=a$
<emptyline>
$
\begin{aligned}
23 \times a                             &= 690 \\\\
a                                       &= \dfrac {690} {23} \\\\
                                        &= \dfrac {30 \times 23} {23} \\\\
                                        &= \dfrac {30 \times \cancel {23}} {\cancel {23}} \\\\
                                        &= 30
\end{aligned} 
$
<emptyline>
Missing number $= 30$
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
<pre class='language-latex'><code class='language-latex'>$30$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

$\Box\:\:\:-\:\:\:\boxed{87} = \:\:\:265$

</div>
<div class='workings'>
<div class='working'>

Let the missing number $=a$
$
\begin{aligned}
a - 87                             &= 265 \\\\
a                                  &= 265 + 87 \\\\
                                   &= 352
\end{aligned}
$

Missing number $= 352$

</div>
</div>
<div class='answers'>
<div class='answer'>

$352$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let the missing number $=a$
$
\begin{aligned}
a - 87                             &= 265 \\\\
a                                  &= 265 + 87 \\\\
                                   &= 352
\end{aligned}
$
<emptyline>
Missing number $= 352$
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
<pre class='language-latex'><code class='language-latex'>$352$
</code></pre>
</div>
</div>

</div>
</li>
</ul>
<div class='review-comments'>

<h4>Review Comments</h4>




Part a)

i) APTQ, (missing, add in second line)



ii) a is missing after this a = 690 / 23 line.





Part b) Coding guidelines not followed, look at website and write it as per the coding guidelines.


</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='82081F61-AF8E-4357-8AF9-7FC59FE52137' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='82081F61-AF8E-4357-8AF9-7FC59FE52137' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='82081F61-AF8E-4357-8AF9-7FC59FE52137' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='82081F61-AF8E-4357-8AF9-7FC59FE52137' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='82081F61-AF8E-4357-8AF9-7FC59FE52137' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='82081F61-AF8E-4357-8AF9-7FC59FE52137' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='82081F61-AF8E-4357-8AF9-7FC59FE52137' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='82081F61-AF8E-4357-8AF9-7FC59FE52137' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='82081F61-AF8E-4357-8AF9-7FC59FE52137' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G0' data-uuid='82081F61-AF8E-4357-8AF9-7FC59FE52137' id='FORM-82081F61-AF8E-4357-8AF9-7FC59FE52137' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-82081F61-AF8E-4357-8AF9-7FC59FE52137'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_oldpr rag_prpcr question'>
<div class='uuid'>
<p>2960FFC6-FBA2-447C-BF04-E3648C9CB1C2</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-3:1:5</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_oldpr</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

I am five years older than my brother. Our ages add up to $23$. How old am I? 

</div>
<div class='workings'>
<div class='working'>

Let the age $=a$

Brother's age $= a - 5$

As per the question,

$
\begin{aligned}
a + a - 5                                   &= 23 \\\\
2a - 5                                      &= 23 \\\\
2a                                          &= 23 + 5 \\\\
2a                                          &= 28 \\\\
a                                           &= \dfrac {28} {2} \\\\
a                                           &= \dfrac {2 \times 14} {2} \\\\
a                                           &= \dfrac {\cancel {2} \times 14} {\cancel {2}} \\\\
a                                           &= 14
\end{aligned}
$

Age $ = 14 \ \text {years old}$

</div>
</div>
<div class='answers'>
<div class='answer'>

$14 \ \text {years}$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let the age $=a$
<emptyline>
Brother's age $= a - 5$
<emptyline>
As per the question,
<emptyline>
$
\begin{aligned}
a + a - 5                                   &= 23 \\\\
2a - 5                                      &= 23 \\\\
2a                                          &= 23 + 5 \\\\
2a                                          &= 28 \\\\
a                                           &= \dfrac {28} {2} \\\\
a                                           &= \dfrac {2 \times 14} {2} \\\\
a                                           &= \dfrac {\cancel {2} \times 14} {\cancel {2}} \\\\
a                                           &= 14
\end{aligned}
$
<emptyline>
Age $ = 14 \ \text {years old}$
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
<pre class='language-latex'><code class='language-latex'>$14 \ \text {years}$
</code></pre>
</div>
</div>

<div class='review-comments'>

<h4>Review Comments</h4>




Last line: \"Age = 14 years old\" ==> \"I am 14 years old.\"
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='2960FFC6-FBA2-447C-BF04-E3648C9CB1C2' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='2960FFC6-FBA2-447C-BF04-E3648C9CB1C2' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='2960FFC6-FBA2-447C-BF04-E3648C9CB1C2' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='2960FFC6-FBA2-447C-BF04-E3648C9CB1C2' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='2960FFC6-FBA2-447C-BF04-E3648C9CB1C2' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='2960FFC6-FBA2-447C-BF04-E3648C9CB1C2' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='2960FFC6-FBA2-447C-BF04-E3648C9CB1C2' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='2960FFC6-FBA2-447C-BF04-E3648C9CB1C2' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='2960FFC6-FBA2-447C-BF04-E3648C9CB1C2' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='PR' data-uuid='2960FFC6-FBA2-447C-BF04-E3648C9CB1C2' id='FORM-2960FFC6-FBA2-447C-BF04-E3648C9CB1C2' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-2960FFC6-FBA2-447C-BF04-E3648C9CB1C2'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_oldpr rag_prpcr question'>
<div class='uuid'>
<p>10D44C55-4639-4E1B-933F-702EB8DE1D6F</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-3:1:7</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_oldpr</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

Bob’s bucket weighs $21\,kg$ when full of water. After he pours half the water from the bucket, it weighs $12\,kg$. What is the weight of the empty bucket?

</div>
<div class='workings'>
<div class='working'>

Let the weight of empty bucket $=a$

Let the weight of water $=b$

As per the question,


$
\begin{aligned}
a + b              &= 21 \\\\
a + \dfrac{b}{2}   &= 12                                                                
\end{aligned}
$

We have got $2$ variables and we have $2$ equations to solve them. Let's eliminate to reduce it to just one variable. 

Multiply second equation by $2$

$
\begin{aligned}
2\times a + 2\times \dfrac{b}{2}           &= 2 \times 12 \\\\
2a + \cancel 2\times \dfrac{b}{\cancel 2}  &= 24 \\\\
2a + b                                     &= 24                                                              
\end{aligned}
$

Subtract the first equation from the above to reduce it to one variable

$
\begin{aligned}
2a + b - (a + b)                           &= 24 - 21\\\\
a                                          &= 3                                                             
\end{aligned}
$


</div>
</div>
<div class='answers'>
<div class='answer'>

$3 \ \text{kg}$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let the weight of empty bucket $=a$
<emptyline>
Let the weight of water $=b$
<emptyline>
As per the question,
<emptyline>

$
\begin{aligned}
a + b              &= 21 \\\\
a + \dfrac{b}{2}   &= 12                                                                
\end{aligned}
$
<emptyline>
We have got $2$ variables and we have $2$ equations to solve them. Let's eliminate to reduce it to just one variable. 
<emptyline>
Multiply second equation by $2$
<emptyline>
$
\begin{aligned}
2\times a + 2\times \dfrac{b}{2}           &= 2 \times 12 \\\\
2a + \cancel 2\times \dfrac{b}{\cancel 2}  &= 24 \\\\
2a + b                                     &= 24                                                              
\end{aligned}
$
<emptyline>
Subtract the first equation from the above to reduce it to one variable
<emptyline>
$
\begin{aligned}
2a + b - (a + b)                           &= 24 - 21\\\\
a                                          &= 3                                                             
\end{aligned}
$
<emptyline>
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
<pre class='language-latex'><code class='language-latex'>$3 \ \text{kg}$
</code></pre>
</div>
</div>

<div class='review-comments'>

<h4>Review Comments</h4>
Delete Line 2



Step 1 : Weight of empty bucket + Weight of Water / 2 = 12 kg

a + 21/2 kg = 12 kg

then your last 4 steps. 

a + 21 = 12 x 2

a + 21 = 24

a = 24 - 21

a = 3 kg



Weight of empty bucket = 3 kg



in blue anser 3 kg



*New comments*



Add last line after \"a = 3\" line

Weight of empty bucket = 3 kg
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='10D44C55-4639-4E1B-933F-702EB8DE1D6F' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='10D44C55-4639-4E1B-933F-702EB8DE1D6F' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='10D44C55-4639-4E1B-933F-702EB8DE1D6F' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='10D44C55-4639-4E1B-933F-702EB8DE1D6F' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='10D44C55-4639-4E1B-933F-702EB8DE1D6F' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='10D44C55-4639-4E1B-933F-702EB8DE1D6F' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='10D44C55-4639-4E1B-933F-702EB8DE1D6F' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='10D44C55-4639-4E1B-933F-702EB8DE1D6F' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='10D44C55-4639-4E1B-933F-702EB8DE1D6F' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='PR' data-uuid='10D44C55-4639-4E1B-933F-702EB8DE1D6F' id='FORM-10D44C55-4639-4E1B-933F-702EB8DE1D6F' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-10D44C55-4639-4E1B-933F-702EB8DE1D6F'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcr question'>
<div class='uuid'>
<p>FDEB857E-2289-4056-9087-65D68B1A15E2</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-3:1:12</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_pr</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

An ant is travelling along the straight line AC as shown below. The distance from A to B is four times as far as the distance from B to C. The distance from A to C is $80\,cm$. [diagram not drawn to scale]

![missing image](/papers/missing_image.svg)


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
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>%empty%
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
<pre class='language-latex'><code class='language-latex'>%empty%
</code></pre>
</div>
</div>
<ul class='subquestion lower-alpha'>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Find the distance from A to B in centimetres

</div>
<div class='workings'>
<div class='working'>

Let the distance from B to C $= d \ \text{cm}$

As per the question,

Distance from A to B $= 4d \ \text{cm}$

Total distance, A to C $= 80 \ \text{cm}$

AB + BC = AC

$
\begin{aligned}
4d + d                                  &= 80 \ \text{cm} \\\\
5d                                      &= 80 \\\\
d                                       &= \dfrac {80} {5} \\\\
d                                       &= \dfrac {5 \times 16} {5} \\\\
d                                       &= \dfrac {\cancel {5} \times 16} {\cancel {5}} \\\\
d                                       &= 16 \ \text{cm}
\end{aligned}
$

Distance B to C $= 16 \ \text{cm}$

Distance from A to B $= 4d$

$
\begin{aligned}
&= 4 \times 16 \\\\
&= 64 \ \text {cm}
\end{aligned}
$

Distance from A to B $= 64 \ \text {cm}$

</div>
</div>
<div class='answers'>
<div class='answer'>

$64 \ \text {cm}$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let the distance from B to C $= d \ \text{cm}$
<emptyline>
As per the question,
<emptyline>
Distance from A to B $= 4d \ \text{cm}$
<emptyline>
Total distance, A to C $= 80 \ \text{cm}$
<emptyline>
AB + BC = AC
<emptyline>
$
\begin{aligned}
4d + d                                  &= 80 \ \text{cm} \\\\
5d                                      &= 80 \\\\
d                                       &= \dfrac {80} {5} \\\\
d                                       &= \dfrac {5 \times 16} {5} \\\\
d                                       &= \dfrac {\cancel {5} \times 16} {\cancel {5}} \\\\
d                                       &= 16 \ \text{cm}
\end{aligned}
$
<emptyline>
Distance B to C $= 16 \ \text{cm}$
<emptyline>
Distance from A to B $= 4d$
<emptyline>
$
\begin{aligned}
&= 4 \times 16 \\\\
&= 64 \ \text {cm}
\end{aligned}
$
<emptyline>
Distance from A to B $= 64 \ \text {cm}$
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
<pre class='language-latex'><code class='language-latex'>$64 \ \text {cm}$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Write down the distance from A to B in millimetres

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
\text{Distance from A to B}             &= 64 \text { cm} \\\\
                                        &= 64 \times 10 \ \text {mm} \\\\
                                        &= 640 \text { mm}
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$640 \text { mm}$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>$
\begin{aligned}
\text{Distance from A to B}             &= 64 \text { cm} \\\\
                                        &= 64 \times 10 \ \text {mm} \\\\
                                        &= 640 \text { mm}
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
<pre class='language-latex'><code class='language-latex'>$640 \text { mm}$
</code></pre>
</div>
</div>

</div>
</li>
</ul>
<div class='review-comments'>

<h4>Review Comments</h4>
1. part reviewed. 2. unit conversion Ratio



Part a)



Let the distance from B to C = d cm

Distance from A to B = 4d cm

As per the question,

AB + BC = 8

4d + d = 8

then solve further...





ii) Put second \"Distance from A to B = 4d\" inside second \begin-end.



iii) Remove last line.
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='FDEB857E-2289-4056-9087-65D68B1A15E2' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='FDEB857E-2289-4056-9087-65D68B1A15E2' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='FDEB857E-2289-4056-9087-65D68B1A15E2' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='FDEB857E-2289-4056-9087-65D68B1A15E2' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='FDEB857E-2289-4056-9087-65D68B1A15E2' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='FDEB857E-2289-4056-9087-65D68B1A15E2' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='FDEB857E-2289-4056-9087-65D68B1A15E2' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='FDEB857E-2289-4056-9087-65D68B1A15E2' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='FDEB857E-2289-4056-9087-65D68B1A15E2' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='PR' data-uuid='FDEB857E-2289-4056-9087-65D68B1A15E2' id='FORM-FDEB857E-2289-4056-9087-65D68B1A15E2' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-FDEB857E-2289-4056-9087-65D68B1A15E2'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcr question'>
<div class='uuid'>
<p>40BB4AA1-3BD3-470A-93B3-6A06036015BD</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-4:1:18</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_pr</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
<li>
tstatistics
</li>
</ul>
</div>
<div class='question question'>

After the first 5 weeks of the holiday, Stuart has earned an average of $$\pounds 11$ per week. In his sixth week he earns $$\pounds 23$. What is his new average weekly wage?

</div>
<div class='workings'>
<div class='working'>

As per the question,

New average $= \dfrac{11 \times 5 + 23}{6}$

$
\begin{aligned}
&= \dfrac{11 \times 5 + 23}{6} \\\\
&= \dfrac{55 + 23}{6} \\\\
&= \dfrac{78}{6} \\\\
&= \dfrac{6 \times 13}{6} \\\\
&= \dfrac{\cancel 6 \times 13}{\cancel 6} \\\\
&= 13
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$13$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>As per the question,
<emptyline>
New average $= \dfrac{11 \times 5 + 23}{6}$
<emptyline>
$
\begin{aligned}
&= \dfrac{11 \times 5 + 23}{6} \\\\
&= \dfrac{55 + 23}{6} \\\\
&= \dfrac{78}{6} \\\\
&= \dfrac{6 \times 13}{6} \\\\
&= \dfrac{\cancel 6 \times 13}{\cancel 6} \\\\
&= 13
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
<pre class='language-latex'><code class='language-latex'>$13$
</code></pre>
</div>
</div>

<div class='review-comments'>

<h4>Review Comments</h4>




Remove \"APTQ,\"



Put \"New Avg....\" line inside the \begin-end.
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='40BB4AA1-3BD3-470A-93B3-6A06036015BD' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='40BB4AA1-3BD3-470A-93B3-6A06036015BD' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='40BB4AA1-3BD3-470A-93B3-6A06036015BD' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='40BB4AA1-3BD3-470A-93B3-6A06036015BD' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='40BB4AA1-3BD3-470A-93B3-6A06036015BD' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='40BB4AA1-3BD3-470A-93B3-6A06036015BD' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='40BB4AA1-3BD3-470A-93B3-6A06036015BD' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='40BB4AA1-3BD3-470A-93B3-6A06036015BD' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='40BB4AA1-3BD3-470A-93B3-6A06036015BD' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='PR' data-uuid='40BB4AA1-3BD3-470A-93B3-6A06036015BD' id='FORM-40BB4AA1-3BD3-470A-93B3-6A06036015BD' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-40BB4AA1-3BD3-470A-93B3-6A06036015BD'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_g1 rag_prns question'>
<div class='uuid'>
<p>B475D829-FDEB-40B6-8FA4-023371521EB4</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-5:1:4</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g1</p>
</div>
<div class='rag'>
<p>rag_wf_prns</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

$t \times 0.805 = 8050$

What is the value of $t$? 

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
t \times 0.805      &= 8050 \\\\
t                   &= \dfrac {8050} {0.805} \\\\
t                   &= \dfrac {8050 \times 10000} {0.805 \times 10000} \\\\
t                   &= \dfrac {8050 \times 10000} {8050} \\\\
t                   &= \dfrac {\cancel {8050} \times 10000} {\cancel {8050}} \\\\
t                   &= 10000
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$10000$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>$
\begin{aligned}
t \times 0.805      &= 8050 \\\\
t                   &= \dfrac {8050} {0.805} \\\\
t                   &= \dfrac {8050 \times 10000} {0.805 \times 10000} \\\\
t                   &= \dfrac {8050 \times 10000} {8050} \\\\
t                   &= \dfrac {\cancel {8050} \times 10000} {\cancel {8050}} \\\\
t                   &= 10000
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
<pre class='language-latex'><code class='language-latex'>$10000$
</code></pre>
</div>
</div>


<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='B475D829-FDEB-40B6-8FA4-023371521EB4' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='B475D829-FDEB-40B6-8FA4-023371521EB4' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='B475D829-FDEB-40B6-8FA4-023371521EB4' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='B475D829-FDEB-40B6-8FA4-023371521EB4' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='B475D829-FDEB-40B6-8FA4-023371521EB4' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='B475D829-FDEB-40B6-8FA4-023371521EB4' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='B475D829-FDEB-40B6-8FA4-023371521EB4' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='B475D829-FDEB-40B6-8FA4-023371521EB4' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='B475D829-FDEB-40B6-8FA4-023371521EB4' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G1' data-uuid='B475D829-FDEB-40B6-8FA4-023371521EB4' id='FORM-B475D829-FDEB-40B6-8FA4-023371521EB4' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-B475D829-FDEB-40B6-8FA4-023371521EB4'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_g1 rag_prns question'>
<div class='uuid'>
<p>24C887CF-4462-405D-A46E-9A5B7A2C09DE</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-5:1:9</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g1</p>
</div>
<div class='rag'>
<p>rag_wf_prns</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

Solve each of the following equations:

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
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>%empty%
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
<pre class='language-latex'><code class='language-latex'>%empty%
</code></pre>
</div>
</div>
<ul class='subquestion lower-alpha'>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

$8 - χ = 2$

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
8 - χ                   &= 2 \\\\
χ                       &= 8 - 2 \\\\
χ                       &= 6
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$6$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>$
\begin{aligned}
8 - χ                   &= 2 \\\\
χ                       &= 8 - 2 \\\\
χ                       &= 6
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
<pre class='language-latex'><code class='language-latex'>$6$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

$x+\frac{1}{3}=1\frac{1}{4}$

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
x + \dfrac {1} {3}                   &= 1 \dfrac {1} {4} \\\\
x + \dfrac {1} {3}                   &= \dfrac {5} {4} \\\\
x                                    &= \dfrac {5} {4} - \dfrac {1} {3} \\\\
x                                    &= \dfrac {5 \times 3} {4 \times 3} - \dfrac {1 \times 4} {3 \times 4} \\\\
x                                    &= \dfrac {15} {12} - \dfrac {4} {12} \\\\
x                                    &= \dfrac {15 - 4} {12} \\\\
x                                    &= \dfrac {11} {12}
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$\dfrac {11} {12}$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>$
\begin{aligned}
x + \dfrac {1} {3}                   &= 1 \dfrac {1} {4} \\\\
x + \dfrac {1} {3}                   &= \dfrac {5} {4} \\\\
x                                    &= \dfrac {5} {4} - \dfrac {1} {3} \\\\
x                                    &= \dfrac {5 \times 3} {4 \times 3} - \dfrac {1 \times 4} {3 \times 4} \\\\
x                                    &= \dfrac {15} {12} - \dfrac {4} {12} \\\\
x                                    &= \dfrac {15 - 4} {12} \\\\
x                                    &= \dfrac {11} {12}
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
<pre class='language-latex'><code class='language-latex'>$\dfrac {11} {12}$
</code></pre>
</div>
</div>

</div>
</li>
</ul>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='24C887CF-4462-405D-A46E-9A5B7A2C09DE' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='24C887CF-4462-405D-A46E-9A5B7A2C09DE' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='24C887CF-4462-405D-A46E-9A5B7A2C09DE' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='24C887CF-4462-405D-A46E-9A5B7A2C09DE' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='24C887CF-4462-405D-A46E-9A5B7A2C09DE' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='24C887CF-4462-405D-A46E-9A5B7A2C09DE' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='24C887CF-4462-405D-A46E-9A5B7A2C09DE' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='24C887CF-4462-405D-A46E-9A5B7A2C09DE' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G1' data-uuid='24C887CF-4462-405D-A46E-9A5B7A2C09DE' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G1' data-uuid='24C887CF-4462-405D-A46E-9A5B7A2C09DE' id='FORM-24C887CF-4462-405D-A46E-9A5B7A2C09DE' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-24C887CF-4462-405D-A46E-9A5B7A2C09DE'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcr question'>
<div class='uuid'>
<p>798959A4-A1CC-4746-BBFD-BB83D4CA9BC0</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-5:1:10</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_pr</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

On the ski slopes the depth of the snow is $160\,cm$ and each day $3\,cm$ melts. After how many days will the depth of snow have fallen to $124\,cm$.

</div>
<div class='workings'>
<div class='working'>

Let the number of days $=a$

As per the question,

$
\begin{aligned}
3a    &= 160 - 124 \\\\
3a    &= 36 \\\\
a     &= \dfrac{36}{3} \\\\
a     &= \dfrac{12 \times 3}{3} \\\\
a     &= \dfrac{12 \times \cancel 3}{\cancel 3} \\\\
a     &= 12
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$12$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let the number of days $=a$
<emptyline>
As per the question,
<emptyline>
$
\begin{aligned}
3a    &= 160 - 124 \\\\
3a    &= 36 \\\\
a     &= \dfrac{36}{3} \\\\
a     &= \dfrac{12 \times 3}{3} \\\\
a     &= \dfrac{12 \times \cancel 3}{\cancel 3} \\\\
a     &= 12
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
<pre class='language-latex'><code class='language-latex'>$12$
</code></pre>
</div>
</div>

<div class='review-comments'>

<h4>Review Comments</h4>




Add last line: Number of days = 12
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='798959A4-A1CC-4746-BBFD-BB83D4CA9BC0' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='798959A4-A1CC-4746-BBFD-BB83D4CA9BC0' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='798959A4-A1CC-4746-BBFD-BB83D4CA9BC0' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='798959A4-A1CC-4746-BBFD-BB83D4CA9BC0' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='798959A4-A1CC-4746-BBFD-BB83D4CA9BC0' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='798959A4-A1CC-4746-BBFD-BB83D4CA9BC0' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='798959A4-A1CC-4746-BBFD-BB83D4CA9BC0' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='798959A4-A1CC-4746-BBFD-BB83D4CA9BC0' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='798959A4-A1CC-4746-BBFD-BB83D4CA9BC0' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='PR' data-uuid='798959A4-A1CC-4746-BBFD-BB83D4CA9BC0' id='FORM-798959A4-A1CC-4746-BBFD-BB83D4CA9BC0' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-798959A4-A1CC-4746-BBFD-BB83D4CA9BC0'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_g0 rag_prpcr question'>
<div class='uuid'>
<p>03AD91B5-06E0-4B12-808B-4F0278EC9237</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-5:1:17</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g0</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

Granddad spends one quarter of his weekly pension on a Friday night out, and one third of what remains on a Saturday night. What fraction of his weekend pension is left for him to spend during the rest of the week?

</div>
<div class='workings'>
<div class='working'>

$\text{Let the weekly pension of granddad} = a$

$\text{As per the question},$

$
\begin{aligned}
\text{Pension spent on friday}          &= \dfrac {a} {4} \\\\
\text{Pension spent on saturday}        &= \dfrac {1} {3} \left ( a - \dfrac {a} {4} \right ) \\\\
                                        &= \dfrac {1} {3} \left ( \dfrac {a \times 4} { 1 \times 4} - \dfrac {a} {4} \right ) \\\\
                                        &= \dfrac {1} {3} \left ( \dfrac {4a} {4} - \dfrac {a} {4} \right ) \\\\
                                        &= \dfrac {1} {3} \left ( \dfrac {4a - a} {4} \right ) \\\\
                                        &= \dfrac {1} {3} \times \dfrac {3a} {4} \\\\
                                        &= \dfrac {3 \times a} {3 \times 4} \\\\
                                        &= \dfrac {\cancel {3} \times a} {\cancel {3} \times 4} \\\\
                                        &= \dfrac {a} {4}
\end{aligned}
$

$
\begin{aligned}
\text{Pension left}                     &= a - \dfrac {a} {4} - \dfrac {a} {4} \\\\
                                        &= \dfrac {4a} {4} - \dfrac {a} {4} - \dfrac {a} {4} \\\\
                                        &= \dfrac {4a - a - a} {4} \\\\
                                        &= \dfrac {2a} {4} \\\\
                                        &= \dfrac {2 \times a} {2 \times 2} \\\\
                                        &= \dfrac {\cancel {2} \times a} {\cancel {2} \times 2} \\\\
                                        &= \dfrac {a} {2} \\\\
\text{Fraction of Pension left}         &= \dfrac {\dfrac{a} {2}} {a} \\\\
                                        &= \dfrac {a} {2 \times a} \\\\
                                        &= \dfrac {\cancel {a}} {2 \times \cancel {a}} \\\\
                                        &= \dfrac {1} {2}
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$\dfrac{1} {2}$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>$\text{Let the weekly pension of granddad} = a$
<emptyline>
$\text{As per the question},$
<emptyline>
$
\begin{aligned}
\text{Pension spent on friday}          &= \dfrac {a} {4} \\\\
\text{Pension spent on saturday}        &= \dfrac {1} {3} \left ( a - \dfrac {a} {4} \right ) \\\\
                                        &= \dfrac {1} {3} \left ( \dfrac {a \times 4} { 1 \times 4} - \dfrac {a} {4} \right ) \\\\
                                        &= \dfrac {1} {3} \left ( \dfrac {4a} {4} - \dfrac {a} {4} \right ) \\\\
                                        &= \dfrac {1} {3} \left ( \dfrac {4a - a} {4} \right ) \\\\
                                        &= \dfrac {1} {3} \times \dfrac {3a} {4} \\\\
                                        &= \dfrac {3 \times a} {3 \times 4} \\\\
                                        &= \dfrac {\cancel {3} \times a} {\cancel {3} \times 4} \\\\
                                        &= \dfrac {a} {4}
\end{aligned}
$
<emptyline>
$
\begin{aligned}
\text{Pension left}                     &= a - \dfrac {a} {4} - \dfrac {a} {4} \\\\
                                        &= \dfrac {4a} {4} - \dfrac {a} {4} - \dfrac {a} {4} \\\\
                                        &= \dfrac {4a - a - a} {4} \\\\
                                        &= \dfrac {2a} {4} \\\\
                                        &= \dfrac {2 \times a} {2 \times 2} \\\\
                                        &= \dfrac {\cancel {2} \times a} {\cancel {2} \times 2} \\\\
                                        &= \dfrac {a} {2} \\\\
\text{Fraction of Pension left}         &= \dfrac {\dfrac{a} {2}} {a} \\\\
                                        &= \dfrac {a} {2 \times a} \\\\
                                        &= \dfrac {\cancel {a}} {2 \times \cancel {a}} \\\\
                                        &= \dfrac {1} {2}
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
<pre class='language-latex'><code class='language-latex'>$\dfrac{1} {2}$
</code></pre>
</div>
</div>

<div class='review-comments'>

<h4>Review Comments</h4>




Remove the katex in first two lines, no need of that.



$\text{Let the weekly pension of granddad} = a$



$\text{As per the question},$



After APTQ, write everything inside one \begin-end.
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='03AD91B5-06E0-4B12-808B-4F0278EC9237' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='03AD91B5-06E0-4B12-808B-4F0278EC9237' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='03AD91B5-06E0-4B12-808B-4F0278EC9237' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='03AD91B5-06E0-4B12-808B-4F0278EC9237' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='03AD91B5-06E0-4B12-808B-4F0278EC9237' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='03AD91B5-06E0-4B12-808B-4F0278EC9237' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='03AD91B5-06E0-4B12-808B-4F0278EC9237' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='03AD91B5-06E0-4B12-808B-4F0278EC9237' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='03AD91B5-06E0-4B12-808B-4F0278EC9237' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G0' data-uuid='03AD91B5-06E0-4B12-808B-4F0278EC9237' id='FORM-03AD91B5-06E0-4B12-808B-4F0278EC9237' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-03AD91B5-06E0-4B12-808B-4F0278EC9237'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_notstarted rag_prns question'>
<div class='uuid'>
<p>3275A71A-639B-441D-A05F-DB24503E5553</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-5:1:19</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_notstarted</p>
</div>
<div class='rag'>
<p>rag_wf_prns</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
<li>
tinfer
</li>
</ul>
</div>
<div class='question question'>

Find the values of A, B and C in the following addition sum.

$C\:\: 6\:\: 7$

$7\:\: 4\:\: A$

$\underline{8\:\:B\:\: 4 \:\:+}$

$2\:\: 0\:\: 0\:\: 6$

</div>
<div class='workings'>
<div class='working'>

TODOWORKING

</div>
<div class='working'>

TODOWORKING

</div>
</div>
<div class='answers'>
<div class='answer'>

TODOANSWER

</div>
<div class='answer'>

TODOANSWER

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>TODOWORKING
</code></pre>
</div>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>TODOWORKING
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
<pre class='language-latex'><code class='language-latex'>TODOANSWER
</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>TODOANSWER
</code></pre>
</div>
</div>


</div>
</li>
<li>
<div class='question_envelope rag_g0 rag_prpcr question'>
<div class='uuid'>
<p>706748E4-8A3B-422B-A4AB-A60AA490E362</p>
</div>
<div class='papername'>
<p>the-perse-school--11-plus--maths--9999--specimen-paper-5:1:22</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g0</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

I have 3 cats-Fred, Gary and Harry. When I weigh Fred and Gary they come to $12\,kg$ more than Harry. When I weigh Gary and Harry they weigh $8\,kg$ more than Fred and when I weigh Fred and Harry they weigh $14\,kg$ more than Gary. What is the combined weight of all three cats?

</div>
<div class='workings'>
<div class='working'>

Let the weight of Fred $=a$

Let the weight of Gary $=b$

Let the weight of Harry $=c$

As per the question,

$
\begin{aligned}
a + b                       &= 12 + c \\\\
b + c                       &= 8 + a \\\\
a + c                       &= 14 + b \\\\
\end{aligned}
$

To find the combined weights of all three cats we will add up the above three equations,

$
\begin{aligned}
a + b + b + c + a + c       &= 12 + c + 8 + a + 14 + b \\\\
2a + 2b + 2c                &= 12 + 8 + 14 + a + b + c \\\\
2a + 2b + 2c - a - b - c    &= 12 + 8 + 14 \\\\
a + b + c                   &= 34
\end{aligned}
$

Combined weight $= 34$

</div>
</div>
<div class='answers'>
<div class='answer'>

$34$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let the weight of Fred $=a$
<emptyline>
Let the weight of Gary $=b$
<emptyline>
Let the weight of Harry $=c$
<emptyline>
As per the question,
<emptyline>
$
\begin{aligned}
a + b                       &= 12 + c \\\\
b + c                       &= 8 + a \\\\
a + c                       &= 14 + b \\\\
\end{aligned}
$
<emptyline>
To find the combined weights of all three cats we will add up the above three equations,
<emptyline>
$
\begin{aligned}
a + b + b + c + a + c       &= 12 + c + 8 + a + 14 + b \\\\
2a + 2b + 2c                &= 12 + 8 + 14 + a + b + c \\\\
2a + 2b + 2c - a - b - c    &= 12 + 8 + 14 \\\\
a + b + c                   &= 34
\end{aligned}
$
<emptyline>
Combined weight $= 34$
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
<pre class='language-latex'><code class='language-latex'>$34$
</code></pre>
</div>
</div>

<div class='review-comments'>

<h4>Review Comments</h4>




Remove \\\\ in the below line.



a + c &= 14 + b \\\\
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='706748E4-8A3B-422B-A4AB-A60AA490E362' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='706748E4-8A3B-422B-A4AB-A60AA490E362' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='706748E4-8A3B-422B-A4AB-A60AA490E362' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='706748E4-8A3B-422B-A4AB-A60AA490E362' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='706748E4-8A3B-422B-A4AB-A60AA490E362' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='706748E4-8A3B-422B-A4AB-A60AA490E362' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='706748E4-8A3B-422B-A4AB-A60AA490E362' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='706748E4-8A3B-422B-A4AB-A60AA490E362' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='706748E4-8A3B-422B-A4AB-A60AA490E362' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G0' data-uuid='706748E4-8A3B-422B-A4AB-A60AA490E362' id='FORM-706748E4-8A3B-422B-A4AB-A60AA490E362' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-706748E4-8A3B-422B-A4AB-A60AA490E362'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_oldpr rag_prpcr question'>
<div class='uuid'>
<p>B67C812C-8264-4E3E-AE90-257236E2DAC5</p>
</div>
<div class='papername'>
<p>the-peterborough-school--11-plus--maths--9999--sample-paper-1:1:15</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_oldpr</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

Aled had $67$ marbles when he went to school. He gave $19$ to his best friend Owen. He did a swap with Jess giving her $5$ coloured ones in exchange for $9$ plain ones. Then he played marbles with Meg and won $27$ marbles and played with Ben and lost $34$ marbles. How many marbles did he have when he got home?

</div>
<div class='workings'>
<div class='working'>

As per the question,

Marbles Alen had initially $= 67$

$
\begin{aligned}
&= 67 - 19 - 5 + 9 + 27 - 34 \\\\
&= 79 - 34 \\\\
&= 45
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$45$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>As per the question,
<emptyline>
Marbles Alen had initially $= 67$
<emptyline>
$
\begin{aligned}
&= 67 - 19 - 5 + 9 + 27 - 34 \\\\
&= 79 - 34 \\\\
&= 45
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
<pre class='language-latex'><code class='language-latex'>$45$
</code></pre>
</div>
</div>

<div class='review-comments'>

<h4>Review Comments</h4>
Wrong answer, also some explanation missing.



Let the number of marbles Allen got home = m

APTQ, 

a = 67 - 19 + 5 - 9 + 27- 34

then solve further...





Add a last line: Marbles Allen got home = 37



Change answer in answer section too.
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='B67C812C-8264-4E3E-AE90-257236E2DAC5' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='B67C812C-8264-4E3E-AE90-257236E2DAC5' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='B67C812C-8264-4E3E-AE90-257236E2DAC5' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='B67C812C-8264-4E3E-AE90-257236E2DAC5' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='B67C812C-8264-4E3E-AE90-257236E2DAC5' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='B67C812C-8264-4E3E-AE90-257236E2DAC5' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='B67C812C-8264-4E3E-AE90-257236E2DAC5' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='B67C812C-8264-4E3E-AE90-257236E2DAC5' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='B67C812C-8264-4E3E-AE90-257236E2DAC5' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='PR' data-uuid='B67C812C-8264-4E3E-AE90-257236E2DAC5' id='FORM-B67C812C-8264-4E3E-AE90-257236E2DAC5' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-B67C812C-8264-4E3E-AE90-257236E2DAC5'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_g0 rag_prpcr question'>
<div class='uuid'>
<p>5676BD98-93C6-45F1-BEB8-EF3E3D08068F</p>
</div>
<div class='papername'>
<p>the-queens-school--11-plus--maths--9999--sample-paper-1:1:22</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_g0</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

$\frac {1} {6}$ of this box of chocolates are white chocolate. If there are $30$ chocolates in the box, 

![missing image](/papers/missing_image.svg)


how many are white chocolate?   

</div>
<div class='workings'>
<div class='working'>

As per the question,

$
\begin{aligned}
&= \dfrac {1} {6} \times 30 \\\\
&= \dfrac {30} {6} \\\\
&= \dfrac {6 \times 5} {6} \\\\
&= \dfrac {\cancel {6} \times 5} {\cancel {6}} \\\\
&= 5
\end{aligned}
$

Number of white chocolates $= 5$

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
<emptyline>
$
\begin{aligned}
&= \dfrac {1} {6} \times 30 \\\\
&= \dfrac {30} {6} \\\\
&= \dfrac {6 \times 5} {6} \\\\
&= \dfrac {\cancel {6} \times 5} {\cancel {6}} \\\\
&= 5
\end{aligned}
$
<emptyline>
Number of white chocolates $= 5$
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
<ul class='subquestion lower-alpha'>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

In the same box $10$ are milk chocolates.

What fraction, of all the chocolates, are milk chocolate?

</div>
<div class='workings'>
<div class='working'>

As per the question,

$
\begin{aligned}
&= \dfrac {1 \cancel {0}} {3 \cancel {0}} \\\\
&= \dfrac {1} {3}
\end{aligned}
$

Fraction of milk chocolates $= \dfrac {1} {3}$

</div>
</div>
<div class='answers'>
<div class='answer'>

$\dfrac {1} {3}$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>As per the question,
<emptyline>
$
\begin{aligned}
&= \dfrac {1 \cancel {0}} {3 \cancel {0}} \\\\
&= \dfrac {1} {3}
\end{aligned}
$
<emptyline>
Fraction of milk chocolates $= \dfrac {1} {3}$
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
<pre class='language-latex'><code class='language-latex'>$\dfrac {1} {3}$
</code></pre>
</div>
</div>

</div>
</li>
</ul>
<div class='review-comments'>

<h4>Review Comments</h4>




Part a)

Instead of writing \"Number of....\" in the last line. put it at the beginning of the \begin-end.

Like below:

\text {Number of....}   &= \dfrac {1} {6} \times 30 \\\\





Part b) same as part a, last line in \begin-end.
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='5676BD98-93C6-45F1-BEB8-EF3E3D08068F' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='5676BD98-93C6-45F1-BEB8-EF3E3D08068F' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='5676BD98-93C6-45F1-BEB8-EF3E3D08068F' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='5676BD98-93C6-45F1-BEB8-EF3E3D08068F' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='5676BD98-93C6-45F1-BEB8-EF3E3D08068F' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='5676BD98-93C6-45F1-BEB8-EF3E3D08068F' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='5676BD98-93C6-45F1-BEB8-EF3E3D08068F' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='5676BD98-93C6-45F1-BEB8-EF3E3D08068F' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='G0' data-uuid='5676BD98-93C6-45F1-BEB8-EF3E3D08068F' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='G0' data-uuid='5676BD98-93C6-45F1-BEB8-EF3E3D08068F' id='FORM-5676BD98-93C6-45F1-BEB8-EF3E3D08068F' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-5676BD98-93C6-45F1-BEB8-EF3E3D08068F'>Initial</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcr question'>
<div class='uuid'>
<p>0C074B21-7DBC-45D1-A408-217D2217ABF2</p>
</div>
<div class='papername'>
<p>the-queens-school--11-plus--maths--9999--sample-paper-1:1:26</p>
</div>
<div class='rag'>
<p>Ayushi Mishra</p>
</div>
<div class='rag'>
<p>rag_am_pr</p>
</div>
<div class='rag'>
<p>rag_wf_prpcr</p>
</div>
<div class='topics'>
<ul>
<li>
talgebra
</li>
</ul>
</div>
<div class='question question'>

$4$ CDs and $2$ DVDs cost $$\pounds 46$. 
3 CDs and 2 DVDs cost $\pounds 39.

![missing image](/papers/missing_image.svg)


Find the cost of 

</div>
<div class='workings'>
<div class='working'>

TODOWORKING

</div>
<div class='working'>

TODOWORKING

</div>
</div>
<div class='answers'>
<div class='answer'>

TODOANSWER

</div>
<div class='answer'>

TODOANSWER

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>TODOWORKING
</code></pre>
</div>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>TODOWORKING
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
<pre class='language-latex'><code class='language-latex'>TODOANSWER
</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>TODOANSWER
</code></pre>
</div>
</div>
<ul class='subquestion lower-alpha'>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

one CD

</div>
<div class='workings'>
<div class='working'>


Let the cost of CD $= a$

Let the cost of DVD $= b$

As per the question,

$
\begin {aligned}
4a + 2b                 &= \pounds 46 \\\\
3a + 2b                 &= \pounds 39
\end {aligned}
$

Let's use elimination to reduce it to just one variable. 

Subtract second equation from first equation 

$
\begin {aligned}
4a + 2b - (3a + 2b)            &= 46 - 39 \\\\
4a + 2b - 3a - 2b              &= 7 \\\\
a                              &= \pounds 7
\end {aligned}
$

Cost of one CD $= 7$

</div>
</div>
<div class='answers'>
<div class='answer'>

$\pounds 7$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>
Let the cost of CD $= a$
<emptyline>
Let the cost of DVD $= b$
<emptyline>
As per the question,
<emptyline>
$
\begin {aligned}
4a + 2b                 &= \pounds 46 \\\\
3a + 2b                 &= \pounds 39
\end {aligned}
$
<emptyline>
Let's use elimination to reduce it to just one variable. 
<emptyline>
Subtract second equation from first equation 
<emptyline>
$
\begin {aligned}
4a + 2b - (3a + 2b)            &= 46 - 39 \\\\
4a + 2b - 3a - 2b              &= 7 \\\\
a                              &= \pounds 7
\end {aligned}
$
<emptyline>
Cost of one CD $= 7$
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
<pre class='language-latex'><code class='language-latex'>$\pounds 7$
</code></pre>
</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

one DVD

</div>
<div class='workings'>
<div class='working'>

Substuting the value of a in first equation, 

$
\begin{aligned}
4 \times 7 + b   &= 46 \\\\
28 + b           &= 46 \\\\
b                &= 46 - 28 \\\\
b                &= \pounds 18 
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$\pounds 18$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Substuting the value of a in first equation, 
<emptyline>
$
\begin{aligned}
4 \times 7 + b   &= 46 \\\\
28 + b           &= 46 \\\\
b                &= 46 - 28 \\\\
b                &= \pounds 18 
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
<pre class='language-latex'><code class='language-latex'>$\pounds 18$
</code></pre>
</div>
</div>

</div>
</li>
</ul>
<div class='review-comments'>

<h4>Review Comments</h4>




Part a) 

i) Remove units in two line after APTQ,



iii) Rewrite the \"Lets..\" and  \"subtract...\" as below.



We have got $2$ variables and we have $2$ equations to solve them. Lets eliminate to reduce it to just one variable. 

Subtract the first equation from the second to reduce it to one variable.



ii) Unit missing in below line



Cost of one CD = 7
</div>

<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='0C074B21-7DBC-45D1-A408-217D2217ABF2' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='0C074B21-7DBC-45D1-A408-217D2217ABF2' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='0C074B21-7DBC-45D1-A408-217D2217ABF2' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='0C074B21-7DBC-45D1-A408-217D2217ABF2' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='0C074B21-7DBC-45D1-A408-217D2217ABF2' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prccrl' data-rag='PRCCRL' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='0C074B21-7DBC-45D1-A408-217D2217ABF2' onclick='submitReview(event)'>PRCCRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='0C074B21-7DBC-45D1-A408-217D2217ABF2' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='0C074B21-7DBC-45D1-A408-217D2217ABF2' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='up' data-sheet='PR' data-uuid='0C074B21-7DBC-45D1-A408-217D2217ABF2' onclick='submitReview(event)'>PRCT</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-sheet='PR' data-uuid='0C074B21-7DBC-45D1-A408-217D2217ABF2' id='FORM-0C074B21-7DBC-45D1-A408-217D2217ABF2' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-0C074B21-7DBC-45D1-A408-217D2217ABF2'>Initial</p>
</div>
</div>
</li>
</ul>
</div>
