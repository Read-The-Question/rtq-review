---
slug: "ragpapers/topicpapers-tpermutation-1-pr-prns"
title: "TopicPaper - Permutation - 1 - PR - PRNS"
date: 2022-09-24 04:59:20
questions_count: "4"
---
<ul class='question default-decimal'>
<li>
<div class='question_envelope rag_pr rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

In a game of football the final score was $3-2$. How many possible half time scores were there?

</div>
<div class='workings'>
<div class='working'>

The possible arrangements are:

$
\begin{matrix}
(0,0) & (0,1) & (0,2) \\
(1,0) & (1,1) & (1,2) \\
(2,0) & (2,1) & (2,2) \\
(3,0) & (3,1) & (3,2) \\
\end{matrix}
$

Count $= 12$

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
<div class='question_envelope rag_pr rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

There are $5$ competitors in a tennis competition. If each player plays every other player once only, how many matches will there be?

</div>
<div class='workings'>
<div class='working'>

Let $5$ competitors be C$1$, C$2$, C$3$, C$4$, C$5$

If each players face each other once, the possible arrangements are:

- C$1$ - C$2$
- C$1$ - C$3$
- C$1$ - C$4$
- C$1$ - C$5$

Count $= 4$

The remaining matches C$2$ play with other are:
 
- C$2$ - C$3$
- C$2$ - C$4$
- C$2$ - C$5$

Count $= 3$

The remaining matches C$3$ plays with other are:
 
- C$3$ - C$4$
- C$3$ - C$5$

Count $= 2$
 
The remaining match C$4$ play with C$5$

- C$4$ - C$5$

Count $= 1$

Total count $= 4 + 3 + 2 + 1 = 10$

</div>
<div class='working'>

Using permutation,

Number of matches first player play $= 4$

Number of matches second player play with remaining players $= 3$

Number of matches third player play with remaining players $= 2$

Number of matches forth player play with remaining players $= 1$

Total arrangements $= 4 + 3 + 2 + 1 = 10$

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
<div class='question_envelope rag_pr rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Three people stand in a line in order A B C. The people then change positions in the line so that no one person is left standing in the same position as they were to start with. 
For example C A B. 

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

What is the only other possible order?

![st-albans-high-school-for-girls--11-plus--maths--2017--sample-paper-2/section-1-question-43-subquestion-1-00.png](/assets/st-albans-high-school-for-girls--11-plus--maths--2017--sample-paper-2/section-1-question-43-subquestion-1-00.png "st-albans-high-school-for-girls--11-plus--maths--2017--sample-paper-2/section-1-question-43-subquestion-1-00.png")

</div>
<div class='workings'>
<div class='working'>

The remaining other possible arrangement is 

B C A

</div>
</div>
<div class='answers'>
<div class='answer'>

B C A

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

This process is now repeated with four people, A B C D.

The people then change positions in the line so that, again, **no one person is left standing in the same position as they were to start with**.

How many possible ways are there of doing this? Use any space on the next page that you need to.

</div>
<div class='workings'>
<div class='working'>

The possible arrangements are:

- D A B C
- C D A B
- B C D A

</div>
</div>
<div class='answers'>
<div class='answer'>

D A B C, C D A B, B C D A

</div>
</div>

</div>
</li>
</ul>
</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

$A \ B \ C \ D \ E$ are the first five letters of the alphabet in the usual order.

$A$ and $B$ are neighbours as they are next to each other in the alphabet.

$B$ and $C$ are also neighbours.

$C$ and $D$ are neighbours, $D$ and $E$ are neighbours.

The five letters have to be written down in some other order so that no neighbours are next to each other (in any order).

For example, $A \ C \ E \ D \ B$ is **not allowed** because the neighbours $D$ and $E$ are next to each other.

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

If we start with $A$ there are only two ways of writing the five letters 
with no neighbours next to each other. The first one is done for you.



Complete the other way.

Answer1:  $A \quad C \quad E \quad B \quad D$

Answer2: $
A \quad
D \quad 
\text{\textunderscore \textunderscore \textunderscore} \quad 
\text{\textunderscore \textunderscore \textunderscore} \quad 
\text{\textunderscore \textunderscore \textunderscore}
$


</div>
<div class='workings'>
<div class='working'>

The remaining possible arrangements are:

A D B E C 

</div>
</div>
<div class='answers'>
<div class='answer'>

A D B E C 

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Now start with the letter $B$. There are three ways of writing the five 
letters with no neighbours next to each other. 

The first one is done for you. Complete the other two ways.

Answer1: $B \quad D \quad A \quad C \quad E$

Answer2: $
B \quad
D \quad 
\text{\textunderscore \textunderscore \textunderscore} \quad 
\text{\textunderscore \textunderscore \textunderscore} \quad 
\text{\textunderscore \textunderscore \textunderscore}
$

Answer3: $
B \quad
E \quad 
\text{\textunderscore \textunderscore \textunderscore} \quad 
\text{\textunderscore \textunderscore \textunderscore} \quad 
\text{\textunderscore \textunderscore \textunderscore}
$

</div>
<div class='workings'>
<div class='working'>

The possible remaining arrangements are:

- B D A E C
- B E C A D

</div>
</div>
<div class='answers'>
<div class='answer'>

B D A E C, B E C A D

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

In total, how many ways are there of arranging the letters $A \ B \ C \ D \ E$, so that none are next to their neighbours?

</div>
<div class='workings'>
<div class='working'>

If we start with A, the possible arrangements are:

- A C E B D
- A D B E C

Count $= 2$

If we start with B, the possible arrangements are:

- B D A C E
- B D A E C
- B E C A D

Count $= 3$

If we start with C, the possible arrangements are:

- C A D B E
- C A E B D
- C E B D A
- C E A D B

Count $= 4$

If we start with D, the possible arrangements are:

- D A C E B
- D B E A C
- D B E C A

Count $= 3$

If we start with E, the possible arrangements are:

- E B D A C
- E C A D B

Count $= 2$

Total count $= 2 + 3 + 4 + 3 + 2 = 14$ 

</div>
</div>
<div class='answers'>
<div class='answer'>

$14$

</div>
</div>

</div>
</li>
</ul>
</div>
</li>
</ul>
