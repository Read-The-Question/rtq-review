---
slug: "topics/topic-tpermutation-g1"
title: "Topic - Permutation - G1"
date: 2022-05-31 16:01:00
---
<ul class='question default-decimal'>
<li>
<div class='question_envelope rag_ga_g1 question'>
<div class='uuid'>
<p>A467E5ED-C83A-436F-95CE-C93C3DF23377</p>
</div>
<div class='topics'>
<ul>
<li>
tunassigned
</li>
<li>
tpermutation
</li>
</ul>
</div>
<div class='question question'>

How many different four digit numbers can be made from the digits $2, 2, 2, 3$ and $3$?

</div>
<div class='workings'>
<div class='working'>

Let's try and find all the possible arrangements.

If we use all $2$s and one $3$, the possible arrangements are:

- $2223$
- $2232$
- $2322$
- $3222$

If we use two $2$s and two $3$s, the possible arrangements are:

- $2233$
- $2323$
- $2332$
- $3223$
- $3232$
- $3322$

Total count $= 10$

<!--
Bebs explanation

the numbers that we can make which start with 2.
If the first three digits are 2, the last digit must be 3.
2223
If the first two digits are 2, the options for the last two digits are shown below.
2233
2232
If the first digit is 2, the options for the last three digits are shown below.
2322
2323
2332
Now let's try and find all the numbers that we can make which start with 3.
If the first two digits are 3, the last two digits must be 2 and 2.
3322
If the first digit is 3, the options for the last three digits are shown below.
3222
3223
3232

answer = 2223, 2233, 2232, 2322, 2323, 2332, 3322, 3222, 3223, 3232
-->

</div>
</div>
<div class='answers'>
<div class='answer'>

$10$

</div>
</div>

<div class='papername'>
<p>the-manchester-grammar-school--11-plus--maths--2010--arithmetic-1</p>
</div>
<div class='rag'>
<p>rag_ga_g1</p>
</div>
</div>
</li>
</ul>
