---
slug: "ragpapers/topicpapers-tpermutation-1-g2"
title: "TopicPaper - Permutation - 1 - G2"
date: 2022-09-21 20:40:31
questions_count: "1"
---
<ul class='question default-decimal'>
<li>
<div class='question_envelope rag_g2 rag_prpcr question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

On the island of Pythageuleria all vehicle number plates have $2$ letters from the selection A, B, C, D, followed by a number 
$1, 2, 3$ or $4$. 

For example:

$\boxed{ \text {A D 1} } \qquad 
\boxed{ \text {A D 4} } \qquad 
\boxed{ \text {C A 3} } \qquad 
\boxed{ \text {D D 2} }$

Note that repeated letters are allowed.

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

Calculate how many plates start with a double B.

</div>
<div class='workings'>
<div class='working'>

The possible arrangements are:

- $\text{BB1}$
- $\text{BB2}$
- $\text{BB3}$
- $\text{BB4}$

Total count $= 4$

</div>
<div class='working'>

Using permutation,

Number of letters that can be used in the first place $= 1$

Number of letters that can be used in the second place $= 1$

Number of digits that can be used in the third place $= 4$

Total arrangements $= 1 \times 1 \times 4 = 4$

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
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Calculate how many plates there are that start with any repeated letter.

</div>
<div class='workings'>
<div class='working'>

If we use double $\text{A}$ in the first and the second place, the possible arrangements are:

- $\text{AA1}$
- $\text{AA2}$
- $\text{AA3}$
- $\text{AA4}$

Count $= 4$

If we use double $\text{B}$ in the first and the second place, the possible arrangements are:

- $\text{BB1}$
- $\text{BB2}$
- $\text{BB3}$
- $\text{BB4}$

Count $= 4$

If we use double $\text{C}$ in the first and the second place, the possible arrangements are:

- $\text{CC1}$
- $\text{CC2}$
- $\text{CC3}$
- $\text{CC4}$

Count $= 4$

If we use double $\text{D}$ in the first and the second place, the possible arrangements are:

- $\text{DD1}$
- $\text{DD2}$
- $\text{DD3}$
- $\text{DD4}$

Count $= 4$

Total count $= 4 + 4 + 4 + 4 = 16$

</div>
<div class='working'>

Using permutation,

Number of letters that can be used in the first place $(\text{A B C D}) = 4$

Number of letters that can be used in the second place (same as first letter) $= 1$

Number of digits that can be used in the third place $= 4$

Total arrangements $= 4 \times 1 \times 4 = 16$

</div>
</div>
<div class='answers'>
<div class='answer'>

$16$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Calculate how many plates contain just one vowel and an odd number.

</div>
<div class='workings'>
<div class='working'>

If we use $\text{A}$ in the first place, the possible arrangements are:

- $\text{AB1}$
- $\text{AB3}$
- $\text{AC1}$
- $\text{AC3}$
- $\text{AD1}$
- $\text{AD3}$

Count $= 6$

If we use $\text{A}$ in the second place, the possible arrangements are:

- $\text{BA1}$
- $\text{BA3}$
- $\text{CA1}$
- $\text{CA3}$
- $\text{DA1}$
- $\text{DA3}$

Count $= 6$

Total count $= 6 + 6 = 12$

</div>
</div>
<div class='answers'>
<div class='answer'>

$12$  

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Given that there are $64$ possible codes in total, calculate what fraction of the number plates have their own two letters in 
alphabetical order, giving your answer in its lowest form.

</div>
<div class='workings'>
<div class='working'>


If we use $\text{A}$ in the first place, the possible arrangements are:

$
\begin{matrix}
\text{AB1}  &  \text{AB2}  &  \text{AB3}  &  \text{AB4} \\
\text{AC1}  &  \text{AC2}  &  \text{AC3}  &  \text{AC4} \\
\text{AD1}  &  \text{AD2}  &  \text{AD3}  &  \text{AD4} \\
\end{matrix}
$

Count $=12$

If we use $\text{B}$ in the first place, the possible arrangements are:

$
\begin{matrix}
\text{BC1}  &  \text{BC2}  &  \text{BC3}  &  \text{BC4} \\
\text{BD1}  &  \text{BD2}  &  \text{BD3}  &  \text{BD4} \\
\end{matrix}
$

Count $=8$

If we use $\text{C}$ in the first place, the possible arrangements are:

$
\begin{matrix}
\text{CD1}  &  \text{CD2}  &  \text{CD3}  &  \text{CD4} \\
\end{matrix}
$

Count $=4$

$
\begin{aligned}
\text{Fraction} &= \dfrac {12 + 8 + 4} {64} \\\\
                &= \dfrac {24} {64} \\\\
                &= \dfrac {8 \times 3} {8 \times 8} \\\\
                &= \dfrac {\cancel{8} \times 3} {\cancel{8} \times 8} \\\\
                &= \dfrac {3} {8}
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$\dfrac {3} {8}$ 

</div>
</div>

</div>
</li>
</ul>
</div>
</li>
</ul>
