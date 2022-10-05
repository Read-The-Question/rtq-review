---
slug: "topicpapers/topicpapers-tpermutation-2"
title: "TopicPaper - Permutation - 2"
date: 2022-10-04 10:03:20
questions_count: "8"
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
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

How many ODD three digit numbers is it possible to make using the 
numbers $4, 5$ and $7$ if you are allowed to use each of the 
numbers more than once in a particular three digit number?

</div>
<div class='workings'>
<div class='working'>

Note: Since it is an odd number, only $5$ and $7$ can be used in the units place.

When the three digit number ends in $5$, the possible arrangements are:

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

When the three digit number ends in $7$, the possible arrangements are:

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

Total count $= 9 + 9 = 18$

</div>
<div class='working'>

Note: Since it is an odd number, only $5$ and $7$ can be used in the units place.

Using permutation,

Number of digits that can be used in the hundreds place    $= 3$

Number of digits that can be used in the tens place        $= 3$

Number of digits that can be used in the units place       $= 2$

Total arrangements $= 3 \times 3 \times 2 = 18$

</div>
</div>
<div class='answers'>
<div class='answer'>

$18$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

The number $3$ can be split in three different ways by adding positive whole numbers together as follows

$1 + 2, \quad 2 + 1 \quad$ and $\quad 1 + 1 + 1$.

Using the same method, in how many different ways can the number $5$ be split?

</div>
<div class='workings'>
<div class='working'>

If we use number $4$ and below, the possible options are:

- $4 + 1$
- $1 + 4$

Count $= 2$

If we use number $3$ and below, the possible options are:

- $3 + 2$
- $2 + 3$
- $3 + 1 + 1$
- $1 + 3 + 1$
- $1 + 1 + 3$

Count $= 5$

If we use number $2$ and below, the possible options are:

- $2 + 2 + 1$
- $2 + 1 + 2$
- $1 + 2 + 2$
- $2 + 1 + 1 + 1$
- $1 + 2 + 1 + 1$
- $1 + 1 + 2 + 1$
- $1 + 1 + 1 + 2$

Count $= 7$

If we use $1$, the possible options are:

- $1 + 1 + 1 + 1 + 1$

Count $= 1$

Total Count $= 2 + 5 + 7 + 1 = 15$

</div>
</div>
<div class='answers'>
<div class='answer'>

$15$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Two crosses can be put in three squares in three different ways, as follows.

![the-manchester-grammar-school--11-plus--maths--2017--arithmetic-a/section-1-question-20-00.png](/assets/the-manchester-grammar-school--11-plus--maths--2017--arithmetic-a/section-1-question-20-00.png "the-manchester-grammar-school--11-plus--maths--2017--arithmetic-a/section-1-question-20-00.png")

![the-manchester-grammar-school--11-plus--maths--2017--arithmetic-a/section-1-question-20-01.png](/assets/the-manchester-grammar-school--11-plus--maths--2017--arithmetic-a/section-1-question-20-01.png "the-manchester-grammar-school--11-plus--maths--2017--arithmetic-a/section-1-question-20-01.png")

![the-manchester-grammar-school--11-plus--maths--2017--arithmetic-a/section-1-question-20-02.png](/assets/the-manchester-grammar-school--11-plus--maths--2017--arithmetic-a/section-1-question-20-02.png "the-manchester-grammar-school--11-plus--maths--2017--arithmetic-a/section-1-question-20-02.png")

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

Total arrangements $= 10$

</div>
</div>
<div class='answers'>
<div class='answer'>

$10$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

In how many different ways can the letters $M, A, T, H$ be placed in a line if the $T$ is **always** first and the $A$ is **never** last?

</div>
<div class='workings'>
<div class='working'>

The possible arrangements are:

- $\text{T A H M}$
- $\text{T A M H}$
- $\text{T H A M}$
- $\text{T M A H}$

Count $= 4$

</div>
</div>
<div class='answers'>
<div class='answer'>

$4$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

How many numbers between $300$ and $500$ contain **at least one** $4$ in their digits?

</div>
<div class='workings'>
<div class='working'>

If $4$ is in the units place, the possible arrangements between $300$ to $399$ are:

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

If $4$ is in the tens place, the possible arrangements between $300$ to $399$ (excluding $344$ as it already counted) are:

- $340$
- $341$
- $342$
- $343$
- $345$
- $346$
- $347$
- $348$
- $349$

Count $= 9$

The possible arrangements between $400$ to $499 = 100$

Total count $= 10 + 9 + 100 = 119$

</div>
</div>
<div class='answers'>
<div class='answer'>

$119$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_notstarted rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
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

</div>
</li>
<li>
<div class='question_envelope rag_notstarted rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
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

</div>
</li>
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Write down in rising order of size all the $3$-digit numbers which can be formed by using te digits $7$,$8$ and $9$ once each. The first is $789$.

</div>
<div class='workings'>
<div class='working'>

The possible arrangements in rising order are:

- $789$
- $798$
- $879$
- $897$
- $978$
- $987$

</div>
</div>
<div class='answers'>
<div class='answer'>

$789, 798, 879, 897, 978, 987$

</div>
</div>

</div>
</li>
</ul>
</div>
