---
slug: "topics/topic-tpermutation-oldpr"
title: "Topic - Permutation - Old PR"
date: 2022-05-28 14:33:22
---
<ul class='question default-decimal'>
<li>
<div class='question_envelope rag_up_oldpr question'>
<div class='uuid'>
<p>6789607F-5F2D-4D59-A07E-046CD61362DB</p>
</div>
<div class='topics'>
<ul>
<li>
tpermutation
</li>
</ul>
</div>
<div class='question question'>

How many $2$-digit numbers contain at least one $4$?

</div>
<div class='workings'>
<div class='working'>

The two digit numbers with first digit as $4$ are:

$
\begin{matrix}
40 &  41 &  42 &  43 &  44 \\  
45 &  46 &  47 &  48 &  49  
\end{matrix}
$

The two digit numbers with last  digit as $4$ are (ensure you do not count $44$ twice):

$
\begin{matrix}
14 & 24 & 34 & 54 \\ 
64 & 74 & 84 & 94
\end{matrix}
$

$
\begin{aligned}
\text{Count} &= 10 + 8  \\\\
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

<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2011--arithmetic-1</p>
</div>
<div class='rag'>
<p>rag_up_oldpr</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_up_oldpr question'>
<div class='uuid'>
<p>7DEB0853-0DD5-4F2B-AA9D-2F777753D9B3</p>
</div>
<div class='topics'>
<ul>
<li>
tinfer
</li>
<li>
tpermutation
</li>
</ul>
</div>
<div class='question question'>

How many three digit numbers contain at least two sevens?

</div>
<div class='workings'>
<div class='working'>

Let's find all the $3$ digit numbers that contain at least two $7$s.

If we use a $7$ in hundreds and tens place, the possible arrangements are:

- $770$
- $771$
- $772$
- $773$
- $774$
- $775$
- $776$
- $778$
- $779$

Count $= 9$

If we use a $7$ in hundreds and units place, the possible arrangements are:

- $707$
- $717$
- $727$
- $737$
- $747$
- $757$
- $767$
- $787$
- $797$

Count $= 9$


If we use a $7$ in tens and units place, the possible arrangements are:

- $177$
- $277$
- $377$
- $477$
- $577$
- $677$
- $777$
- $877$
- $977$

Count $= 9$


Note: $777$ will occur in every sequence, so we ensure to count it only once.

$
\begin {aligned}
\text{Total count}   &= 9 + 9 + 9 \\\\
                     &= 27
\end {aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$27$

</div>
</div>

<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2013--arithmetic-1</p>
</div>
<div class='rag'>
<p>rag_up_oldpr</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_up_oldpr question'>
<div class='uuid'>
<p>8BEE82C0-3EF8-4B6D-B5D5-530F6AF9A74E</p>
</div>
<div class='topics'>
<ul>
<li>
tinfer
</li>
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

<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2014--arithmetic-a</p>
</div>
<div class='rag'>
<p>rag_up_oldpr</p>
</div>
</div>
</li>
<li>
<div class='question_envelope rag_up_oldpr question'>
<div class='uuid'>
<p>3A2365AD-70B7-45DF-8397-B6EF9E526FF8</p>
</div>
<div class='topics'>
<ul>
<li>
tinfer
</li>
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

<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2017--arithmetic-a</p>
</div>
<div class='rag'>
<p>rag_up_oldpr</p>
</div>
</div>
</li>
</ul>
