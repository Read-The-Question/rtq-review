---
slug: "ragpapers/topicpapers-tinfer-6-g0"
title: "TopicPaper - Infer - 6 - G0"
date: 2022-10-04 10:03:20
questions_count: "3"
---
<ul class='question default-decimal'>
<li>
<div class='question_envelope rag_g0 rag_prcr question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Nicole likes palindromic numbers.

Palindromic numbers read the same backwards as forwards, for example:

$44 \quad 323 \quad 1221 \quad 1234321$ and so on

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

$11, 22, 33, 44, 55$ are all palindromic.

What is the smallest multiple of $11$ that is not palindromic?

</div>
<div class='workings'>
<div class='working'>

$110$

</div>
</div>
<div class='answers'>
<div class='answer'>

$110$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

What is the smallest number larger than $1000$ that is palindromic?

</div>
<div class='workings'>
<div class='working'>

$1001$

</div>
</div>
<div class='answers'>
<div class='answer'>

$1001$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Which two palindromic numbers less than $1000$ have a difference of only $2$?

</div>
<div class='workings'>
<div class='working'>

$11 - 9 = 2$

$11$ and $9$ are two palindromic numbers that have a difference of only $2$.

</div>
</div>
<div class='answers'>
<div class='answer'>

$11, 9$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>


The palindromic number $131$ has a digit sum of $5$ (since $1 + 3 + 1 = 5)$

What is the only other palindromic number less than 1000 which has a digit sum of $5$?

</div>
<div class='workings'>
<div class='working'>

$212$

</div>
</div>
<div class='answers'>
<div class='answer'>

$212$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

List all of the palindromic numbers between $1000$ and a million which have a digit sum of $5$.

</div>
<div class='workings'>
<div class='working'>

$10201, 11111$

</div>
</div>
<div class='answers'>
<div class='answer'>

$10201, 11111$

</div>
</div>

</div>
</li>
</ul>
</div>
</li>
<li>
<div class='question_envelope rag_g0 rag_prcr question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Ten cards numbered from $1$ to $10$ are put in order in a pile, with $1$ on the top. 

I move one card from the top and place it at the bottom, and then throw the new top card away. 

Then I put the new top card to the bottom, and this time a second top card to the bottom, before throwing away the next one. 

Now I put the new top card to the bottom, the next top card to the bottom, and now a third top card to the bottom, before throwing the next one away. 

Finally, I put the top card to the bottom, the next top card to the bottom, the next top card to the bottom, a fourth top card to the bottom, and throw away the next card. 

What number is on the card now at the top of the pile?

</div>
<div class='workings'>
<div class='working'>

Let's go through the instructions step by step and draw intermediate states for the cards.

*Ten cards numbered from $1$ to $10$ are put in order in a pile, with $1$ on the top.*

Let's draw the initial state of the cards with the left most card representing the top of the pile.

$\large { \boxed{1} \ \boxed{2} \ \boxed{3} \ \boxed{4} \ \boxed{5} \ \boxed{6} \ \boxed{7} \ \boxed{8} \ \boxed{9} \ \boxed{10} }$

*I move one card from the top and place it at the bottom, and then throw the new top card away.* 

$\large { \boxed{\red{\cancel{2}}} \ \boxed{3} \ \boxed{4} \ \boxed{5} \ \boxed{6} \ \boxed{7} \ \boxed{8} \ \boxed{9} \ \boxed{10} \ \boxed{\green{1}} }$

$\large { \boxed{3} \ \boxed{4} \ \boxed{5} \ \boxed{6} \ \boxed{7} \ \boxed{8} \ \boxed{9} \ \boxed{10} \ \boxed{1} }$

*Then I put the new top card to the bottom, and this time a second top card to 
the bottom, before throwing away the next one.*

$\large { \boxed{\red{\cancel{5}}} \ \boxed{6} \ \boxed{7} \ \boxed{8} \ \boxed{9} \ \boxed{10} \ \boxed{1} \ \boxed{\green{3}} \ \boxed{\green{4}} }$

$\large { \boxed{6} \ \boxed{7} \ \boxed{8} \ \boxed{9} \ \boxed{10} \ \boxed{1} \ \boxed{3} \ \boxed{4} }$

*Now I put the new top card to the bottom, the next top card to the 
bottom, and now a third top card to the bottom, before throwing the next one away.* 

$\large { \boxed{\red{\cancel{9}}} \ \boxed{10} \ \boxed{1} \ \boxed{3} \ \boxed{4} \ \boxed{\green{6}} \ \boxed{\green{7}} \ \boxed{\green{8}} }$

$\large { \boxed{10} \ \boxed{1} \ \boxed{3} \ \boxed{4} \ \boxed{6} \ \boxed{7} \ \boxed{8} }$

*Finally, I put the top card to the bottom, the next top card to 
the bottom, the next top card to the bottom, a 
fourth top card to the bottom, and throw away the next card.*

$\large { \boxed{\red{\cancel{6}}} \ \boxed{7} \ \boxed{8} \ \boxed{\green{10}} \ \boxed{\green{1}} \ \boxed{\green{3}} \ \boxed{\green{4}} }$

$\large { \boxed{7} \ \boxed{8} \ \boxed{10} \ \boxed{1} \ \boxed{3} \ \boxed{4} }$

Number at the top $= 7$

</div>
</div>
<div class='answers'>
<div class='answer'>

$7$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_g0 rag_prcr question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

$83$ is a prime number. If Nancy reverses the order of the digits she gets $38$ which is not prime. How many two digit primes **__do__** give a different prime number when their digits are reversed?

</div>
<div class='workings'>
<div class='working'>

Let's list all the $2$ digit prime numbers from $1$ to $100$.

- $11$
- $13$
- $17$
- $19$
- $23$ 
- $29$
- $31$
- $37$
- $41$
- $43$
- $47$
- $53$
- $59$
- $61$
- $67$
- $71$
- $73$
- $79$
- $83$
- $89$
- $97$

When the digits are reversed, we get

- $11$
- $31$
- $71$
- $91$
- $32$
- $92$
- $13$
- $73$
- $14$
- $34$
- $74$
- $35$
- $95$
- $16$
- $76$
- $17$
- $37$
- $97$
- $38$
- $98$
- $79$

The reversed number which are still primes are:

- $11$
- $13$
- $17$
- $31$
- $37$
- $71$
- $73$
- $79$
- $97$

<!--
$
\begin{matrix}
11 && 13 && 17 && 19 && 23 \\\\
29 && 31 && 37 && 41 && 43 \\\\
47 && 53 && 59 && 61 && 67 \\\\
71 && 73 && 79 && 83 && 89 \\\\
97
\end{matrix}
$

When the digits are reversed, we get

$
\begin{matrix}
11 && 31 && 71 && 91 && 32 \\\\
92 && 13 && 73 && 14 && 34 \\\\
74 && 35 && 95 && 16 && 76 \\\\
17 && 37 && 97 && 38 && 98 \\\\
79
\end{matrix}
$

The reversed number which are still primes are:

$
\begin{matrix}
11 && 13 && 17 && 31 && 37 \\\\
71 && 73 && 79 && 97
\end{matrix}
$
-->

</div>
</div>
<div class='answers'>
<div class='answer'>

$11, 13, 17, 31, 37, 71, 73, 79, 97$

</div>
</div>

</div>
</li>
</ul>
