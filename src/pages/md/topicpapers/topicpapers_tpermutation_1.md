---
slug: "topicpapers/topicpapers-tpermutation-1"
title: "TopicPaper - Permutation - 1"
date: 2022-09-21 20:40:31
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
<div class='question_envelope rag_red rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

In a game you need to get three coloured discs (green, blue and red) in the correct order.

Three attempts have been made and are shown below, with the number of discs that are in the correct positions.

What is the correct order for the three coloured discs?

![missing table](/papers/missing_table.svg)


</div>
<div class='workings'>
<div class='working placeholder'>

TODOWORKING

</div>
<div class='working placeholder'>

TODOWORKING

</div>
</div>
<div class='answers'>
<div class='answer placeholder'>

TODOANSWER

</div>
<div class='answer placeholder'>

TODOANSWER

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

%empty%

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

How many triangles are there in this picture?

![brentwood-school--11-plus--maths--9999--sample-paper-1/section-2-question-12-subquestion-1-00.png](/assets/brentwood-school--11-plus--maths--9999--sample-paper-1/section-2-question-12-subquestion-1-00.png "brentwood-school--11-plus--maths--9999--sample-paper-1/section-2-question-12-subquestion-1-00.png")

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
\text{Number of small triangles}    &= 4 \\\\
\text{Number of large triangles}    &= 1 \\\\
\text{Total triangles}              &= 4 + 1  \\\\
                                    &= 5
\end{aligned}
$

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
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Individual triangles are to be painted BLUE or RED, so that no adjoining triangles have the same colour. 
In how many ways can this be done?

</div>
<div class='workings'>
<div class='working'>

If we use blue in the centre triangle, the only possible option for other adjoining triangles is red.

If we use red in the centre triangle, the only possible option for other adjoining triangles is blue.

Total Count $= 1 + 1 = 2$

</div>
<div class='working'>

Using permutation,

Number of ways of painting the centre triangle (red or blue) $= 2$

Number of ways of painting the remaining adjoining triangles $= 1$

Total arrangements $= 2 \times 1 = 2$

</div>
</div>
<div class='answers'>
<div class='answer'>

$2$

</div>
</div>

</div>
</li>
</ul>
</div>
</li>
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
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Khatijah throws two dice and adds together the scores.

How many different ways can she score $8$?

**Show each different way clearly.** 

</div>
<div class='workings'>
<div class='working'>

The possible arrangements are:

- $2,6$   
- $3,5$ 
- $4,4$  
- $5,3$
- $6,2$

Total count $= 5$

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

How many ways are there of colouring in three squares in this grid so that exactly one coloured square appears in each row and each column? Show clearly how you get your answer. 

![forest-school--11-plus--maths--2020--sample-paper-3/section-1-question-30-00.png](/assets/forest-school--11-plus--maths--2020--sample-paper-3/section-1-question-30-00.png "forest-school--11-plus--maths--2020--sample-paper-3/section-1-question-30-00.png")

</div>
<div class='workings'>
<div class='working'>

Let's represent row by $\text{R}$ and column by $\text{C}$.

The possible arrangements are:

- $\text{R1C1 \quad R2C2 \quad R3C3}$
- $\text{R1C1 \quad R2C3 \quad R3C2}$
- $\text{R1C2 \quad R2C1 \quad R3C3}$
- $\text{R1C2 \quad R2C3 \quad R3C1}$
- $\text{R1C3 \quad R2C1 \quad R3C2}$
- $\text{R1C3 \quad R2C2 \quad R3C1}$

Total count $= 6$

</div>
<div class='working'>

Using permutation,

Number of ways we can colour in the first row $= 3$

Number of ways we can colour in the  second row $= 2$

Number of ways we can colour in the third row $= 1$

Total arrangements $= 3 \times 2 \times 1 = 6$

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
<div class='question_envelope rag_pr rag_prcc question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

In this map of Squaretown, Tomasc is going to walk from $A$ to $B$.
He only ever walks north (up the map) or east (to the right of the map).
How many different possible routes are there?

![forest-school--11-plus--maths--9999--sample-paper-1/section-1-question-39-00.png](/assets/forest-school--11-plus--maths--9999--sample-paper-1/section-1-question-39-00.png "forest-school--11-plus--maths--9999--sample-paper-1/section-1-question-39-00.png")

</div>
<div class='workings'>
<div class='working'>

If we start with E, the possible arrangements are:

- EEENNN
- EENENN
- EENNEN
- EENNNE
- ENEENN
- ENENEN
- ENENNE
- ENNEEN
- ENNENE
- ENNNEE

Count $= 10$

If we start with N, the possible arrangements are:

- NNNEEE
- NNENEE
- NNEENE
- NNEEEN
- NENENE
- NENNEE
- NENEEN
- NEENNE
- NEENEN
- NEEENN

Count $= 10$

Total count $= 20$

</div>
</div>
<div class='answers'>
<div class='answer'>

$20$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Here are two ways of making a total of $12$ from three **different** whole numbers:

$2 + 3 + 7 =12$

$3 + 4 + 5 = 12$

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

Write down all the ways of making a total of $12$ using three different whole numbers (don’t count $2 + 3 + 7$ as different from $3 + 7 + 2$).

</div>
<div class='workings'>
<div class='working'>

If we use number $1$ and above, the possible arrangements are:

- $1  +  2  +  9$
- $1  +  3  +  8$
- $1  +  4  +  7$
- $1  +  5  +  6$

If we use number $2$ and above, the possible arrangements are:

- $2  +  3  +  7$
- $2  +  4  +  6$

If we use number $3$ and above, the possible arrangements are:

- $3  +  4  +  5$

Total count $= 4 + 2 + 1 = 7$

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
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

How many ways are there of making a total of $15$ using three **different** whole numbers?

</div>
<div class='workings'>
<div class='working'>

If we use number $1$ and above, the possible arrangements are:

- $1  +  2  +  12$
- $1  +  3  +  11$
- $1  +  4  +  10$
- $1  +  5  +  9$
- $1  +  6  +  8$

If we use number $2$ and above, the possible arrangements are:

- $2  +  3  +  10$
- $2  +  4  +  9$
- $2  +  5  +  8$
- $2  +  6  +  7$

If we use number $3$ and above, the possible arrangements are:

- $3  +  4  +  8$
- $3  +  5  +  7$

If we use number $4$ and above, the possible arrangements are:

- $4  +  5  +  6$

Total count $= 5 + 4 + 2 + 1 = 12$

</div>
</div>
<div class='answers'>
<div class='answer'>

$12$ 

</div>
</div>

</div>
</li>
</ul>
</div>
</li>
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

How many different $3$ digit numbers can you make from the digits $1, 1$ and $3$. You can use each digit as many times as you like.

</div>
<div class='workings'>
<div class='working'>

The possible arrangements are:

- $111$
- $113$
- $131$
- $133$
- $311$
- $313$
- $331$
- $333$

Total count $= 8$

</div>
<div class='working'>

Using permutation,

Number of digits that can be used in the hundreds place $= 2$

Number of digits that can be used in the tens place $= 2$

Number of digits that can be used in the units place $= 2$

Total arrangements $= 2 \times 2 \times 2 = 8$

</div>
</div>
<div class='answers'>
<div class='answer'>

$8$ 

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Here are some number cards:

![north-london-collegiate-school--11-plus--maths--9999--sample-paper-1/section-1-question-28-00.png](/assets/north-london-collegiate-school--11-plus--maths--9999--sample-paper-1/section-1-question-28-00.png "north-london-collegiate-school--11-plus--maths--9999--sample-paper-1/section-1-question-28-00.png")

You can use each card once to make the number $3927$, like this:

![north-london-collegiate-school--11-plus--maths--9999--sample-paper-1/section-1-question-28-01.png](/assets/north-london-collegiate-school--11-plus--maths--9999--sample-paper-1/section-1-question-28-01.png "north-london-collegiate-school--11-plus--maths--9999--sample-paper-1/section-1-question-28-01.png")

Use the four number cards to make numbers that are as close as possible to the numbers written below.

Example

![north-london-collegiate-school--11-plus--maths--9999--sample-paper-1/section-1-question-28-02.png](/assets/north-london-collegiate-school--11-plus--maths--9999--sample-paper-1/section-1-question-28-02.png "north-london-collegiate-school--11-plus--maths--9999--sample-paper-1/section-1-question-28-02.png")

You must **not** use the same card more than once in each answer.

![north-london-collegiate-school--11-plus--maths--9999--sample-paper-1/section-1-question-28-03.png](/assets/north-london-collegiate-school--11-plus--maths--9999--sample-paper-1/section-1-question-28-03.png "north-london-collegiate-school--11-plus--maths--9999--sample-paper-1/section-1-question-28-03.png")

![north-london-collegiate-school--11-plus--maths--9999--sample-paper-1/section-1-question-28-04.png](/assets/north-london-collegiate-school--11-plus--maths--9999--sample-paper-1/section-1-question-28-04.png "north-london-collegiate-school--11-plus--maths--9999--sample-paper-1/section-1-question-28-04.png")

![north-london-collegiate-school--11-plus--maths--9999--sample-paper-1/section-1-question-28-05.png](/assets/north-london-collegiate-school--11-plus--maths--9999--sample-paper-1/section-1-question-28-05.png "north-london-collegiate-school--11-plus--maths--9999--sample-paper-1/section-1-question-28-05.png")

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

$\large { \boxed{3} \ \boxed{0} \ \boxed{0} \ \boxed{0}  }$

</div>
<div class='workings'>
<div class='working'>

$2973$

</div>
</div>
<div class='answers'>
<div class='answer'>

$2973$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

$\large { \boxed{7} \ \boxed{0} \ \boxed{0} \ \boxed{0}  }$

</div>
<div class='workings'>
<div class='working'>

$7239$

</div>
</div>
<div class='answers'>
<div class='answer'>

$7239$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

$\large { \boxed{3} \ \boxed{8} \ \boxed{0} \ \boxed{0}  }$

</div>
<div class='workings'>
<div class='working'>

$3792$

</div>
</div>
<div class='answers'>
<div class='answer'>

$3792$

</div>
</div>

</div>
</li>
</ul>
</div>
</li>
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Ahmed chooses two different items for a snack. His choices are an apple, an orange, a banana, and a granola bar. How many different pairs of snacks could he choose? 

</div>
<div class='workings'>
<div class='working'>

The possible combinations are:

- Apple, Banana
- Apple, Granola
- Apple, Orange
- Banana, Granola
- Banana, Orange
- Granola, Orange

Count $= 6$

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
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

How many different $3$-digit whole numbers can be formed using the digits $4, 7$ and $9$, assuming that no digit can be repeated in a number?

</div>
<div class='workings'>
<div class='working'>

The possible arrangements are:

- $479$
- $497$
- $749$
- $794$
- $947$
- $974$

Total count $= 6$ 

</div>
<div class='working'>

Using permutation,

Number of digits that can be used in the hundreds place $= 3$

Number of digits that can be used in the tens place $= 2$

Number of digits that can be used in the units place $= 1$

Total arrangements $= 3 \times 2 \times 1 =6$

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
<div class='question_envelope rag_pr rag_prcc question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

A palindrome is a positive integer that is the same when read forwards or backwards.

The numbers $101$ and $4554$ are examples of palindromes.

Calculate the ratio of the number of $4$-digit palindromes to the number of $5$-digit palindromes. 

</div>
<div class='workings'>
<div class='working'>

For 4 digit palindromes 

In between $2000$ to $3000$, the possible arrangements are:

- $1001$
- $1111$
- $1221$
- $1331$
- $1441$
- $1551$
- $1661$
- $1771$
- $1881$
- $1991$

Count $= 10$

Similarly, in between $2000$ to $3000$ the possible arrangements are $10$

$2002$  to $2992$

Count $= 10$

Similarly, in between $3000$ to $4000$ the possible arrangements are $10$

$3003$  to $3993$

Count $= 10$

Similarly, in between $4000$ to $5000$ the possible arrangements are $10$

$4004$  to $4994$

Count $= 10$

Similarly, in between $5000$ to $6000$ the possible arrangements are $10$

$5005$  to $5995$

Count $= 10$

Similarly, in between $6000$ to $7000$ the possible arrangements are $10$

$6006$  to $6996$

Count $= 10$

Similarly, in between $7000$ to $8000$ the possible arrangements are $10$

$7007$  to $7997$

Count $= 10$

Similarly, in between $8000$ to $9000$ the possible arrangements are $10$

$8008$  to $8998$

Count $= 10$

Similarly, in between $2000$ to $3000$ the possible arrangements are $10$

$9009$  to $9999$

Count $= 10$

Total count $= 10 + 10 + 10 + 10 + 10 + 10 + 10 + 10 + 10 = 90$

For 5 digit palindromes

In between $10000$ to $20000$, the possible arrangements are:

- $10001$
- $10101$
- $10201$
- $10301$
- $10401$
- $10501$
- $10601$
- $10701$
- $10801$
- $10901$
- $11011$
- $11111$
- $11211$
- $11311$
- $11411$

 $\text{\textunderscore}$

 $\text{\textunderscore}$

 so on.... upto $19991$

Count $= 10 \times 10 = 100$

Similarly, in between $20000$ to $30000$, the possible arrangements are $10 \times 10$

$20002$ to $29992$

Count $= 100$

Similarly, in between $30000$ to $40000$, the possible arrangements are $10 \times 10$

$30003$ to $39993$

Count $= 100$

Similarly, in between $40000$ to $50000$, the possible arrangements are $10 \times 10$

$40004$ to $49994$

Count $= 100$

Similarly, in between $50000$ to $60000$, the possible arrangements are $10 \times 10$

$50005$ to $59995$

Count $= 100$

Similarly, in between $60000$ to $70000$, the possible arrangements are $10 \times 10$

$60006$ to $69996$

Count $= 100$

Similarly, in between $70000$ to $80000$, the possible arrangements are $10 \times 10$

$70007$ to $79997$

Count $= 100$

Similarly, in between $80000$ to $90000$, the possible arrangements are $10 \times 10$

$80008$ to $89998$

Count $= 100$

Similarly, in between $90000$ to $100000$, the possible arrangements are $10 \times 10$

$90009$ to $99999$

Count $= 100$

Total arrangements $= 100 + 100 + 100 + 100 + 100 + 100 + 100 + 100 + 100 = 900$

</div>
<div class='working'>

Using permutation,

For 4 digit palindromes

Number of digits that can be used in the thousand place $= 9$

Number of digits that can be used in the hundreds place $= 10$

Number of digits that can be used in the tens place $= 1$

Number of digits that can be used in the units place $= 1$

Total arrangements $= 9 \times 10 \times 1 \times 1 = 90$

For 5 digit palindromes

Number of digits that can be used in the ten thousands place $= 9$

Number of digits that can be used in the thousands place $= 10$

Number of digits that can be used in the hundreds place $= 10$

Number of digits that can be used in the tens place $= 1$

Number of digits that can be used in the units place $= 1$

Total arrangements $= 9 \times 10 \times 10 \times 1 \times 1 = 900$

So, the ratio of number $4$-digit palindromes and $5$-digit palindromes $= \dfrac {90} {900} = \dfrac {1} {10}$  

</div>
</div>
<div class='answers'>
<div class='answer'>

$\dfrac {1} {10}$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

How many $4$ digit numbers greater than $2000$ can be formed using the digits $1, 2, 3$ and $4$?

*Each digit can be used only once*.

</div>
<div class='workings'>
<div class='working'>

If we use $2$ in the thousands place, the possible arrangements are:

- $2134$
- $2143$
- $2314$
- $2341$
- $2413$
- $2431$

Count $= 6$

If we use $3$ in the thousands place, the possible arrangements are:

- $3124$
- $3142$
- $3214$
- $3241$
- $3412$
- $3421$

Count $= 6$


If we use $4$ in the thousands place, the possible arrangements are:

- $4123$
- $4132$
- $4213$
- $4231$
- $4312$
- $4321$

Count $= 6$

Total count $= 6 + 6 + 6 = 18$

</div>
<div class='working'>

Using permutation,

Number of digits that can be used in the thousands place $= 3$

Number of digits that can be used in the hundreds place $= 3$

Number of digits that can be used in the tens place $= 2$

Number of digits that can be used in the units place $= 1$

Total arrangements $= 3 \times 3 \times 2 \times 1 = 18$

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

Mary has $\text{three}$ brothers and $\text{four}$ sisters. If they, and Mary, all buy each other an Easter egg, how many eggs will be bought?

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
\text{Total siblings}                   &= 1 + 3 + 4 = 8 \\\\
\text{Number of eggs each buys}         &= 8 - 1 \\\\
                                        &= 7 \\\\
\text{Total eggs bought}                &= 8 \times 7 \\\\
                                        &= 56
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$56$

</div>
</div>

</div>
</li>
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
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Some numbers read the same forwards and backwards, like $343$ and $1221$. We call these numbers *mirror numbers*.  

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

Find all *mirror numbers* between $10$ and $100$. Write your answers in the space below.

</div>
<div class='workings'>
<div class='working'>

The possible numbers are:

- $11$
- $22$
- $33$
- $44$
- $55$
- $66$
- $77$
- $88$
- $99$

Total count $= 9$

</div>
</div>
<div class='answers'>
<div class='answer'>

$9$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Find all the *mirror numbers* between $100$ and $200$. Write your answers in the space below.

</div>
<div class='workings'>
<div class='working'>

The possible numbers are:

- $101$
- $111$
- $121$
- $131$
- $141$
- $151$
- $161$
- $171$
- $181$
- $191$

Count $= 10$

</div>
</div>
<div class='answers'>
<div class='answer'>

$10$

</div>
</div>

</div>
</li>
</ul>
</div>
</li>
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

The three digit number $452$ has a digit sum of $11$ because $4 + 5 + 2 = 11$.

The three digit number $584$ has a digit sum of $17$ because $5 + 8 + 4 = 17$.

Write down in the space below all $3$ digit numbers that have a digit sum equal to $25$.

</div>
<div class='workings'>
<div class='working'>

If we use number $7$ and above, the possible arrangements are:

- $799$
- $979$
- $997$

Count $= 3$

If we use number $8$ and above, the possible arrangements are:

- $889$
- $898$
- $988$

Count $= 3$

Total count $= 3 + 3 = 6$

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
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Four people meet to discuss a new swimming competition. Each person shakes everyone else’s hand exactly once. How many handshakes are there in total? 

</div>
<div class='workings'>
<div class='working'>

Let the four people $= \text{P1, P2, P3, P4}$

The possible combinations are:

- $\text{P1, P2}$
- $\text{P1, P3}$
- $\text{P1, P4}$
- $\text{P2, P3}$
- $\text{P2, P4}$
- $\text{P3, P4}$

Total count $= 6$

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
<div class='question_envelope rag_notstarted rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

The equilateral triangle ADF is split into four equally sized smaller equilateral triangles.

![st-albans-school--11-plus--maths--2019--sample-paper-1/section-1-question-20-00.png](/assets/st-albans-school--11-plus--maths--2019--sample-paper-1/section-1-question-20-00.png "st-albans-school--11-plus--maths--2019--sample-paper-1/section-1-question-20-00.png")  

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

Two of the four small triangles are to be painted black and the other two are to be painted white .In how many different ways can this be done?

![st-albans-school--11-plus--maths--2019--sample-paper-1/section-1-question-20-subquestion-1-00.png](/assets/st-albans-school--11-plus--maths--2019--sample-paper-1/section-1-question-20-subquestion-1-00.png "st-albans-school--11-plus--maths--2019--sample-paper-1/section-1-question-20-subquestion-1-00.png")

Ben thinks that he can draw a copy of the of triangles without taking his pencil off the page **and** without going over the same line twice. He begins at A and then travels to B.

</div>
<div class='workings'>
<div class='working'>

$\dfrac {1} {2}$

</div>
</div>
<div class='answers'>
<div class='answer'>

$\dfrac {1} {2}$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Complete the list below showing the order that Ben's pencil visits the corners of the triangles.

</div>
<div class='workings'>
<div class='working'>

$\text {A}, \quad  \text {B}, \quad \text {D}, \quad \text {E}, \quad \text {F},  \quad \text {C}, \quad \text {E}, \quad \text {B}, \quad \text {C}, \quad \text {A}$

</div>
</div>
<div class='answers'>
<div class='answer'>

$\text {A}, \quad  \text {B}, \quad \text {D}, \quad \text {E}, \quad \text {F},  \quad \text {C}, \quad \text {E}, \quad \text {B}, \quad \text {C}, \quad \text {A}$

</div>
</div>

</div>
</li>
</ul>
</div>
</li>
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Tom   only  has $4$  Smarties   left, one   each  of Red,  Green,   Orange   and   Yellow.  If he chooses $2$ 
Smarties,   list  all   the   possible combinations   of colours.

</div>
<div class='workings'>
<div class='working'>

The possible combinations are:

- Red, Green
- Red, Orange
- Red, Yellow
- Green, Orange
- Green, Yellow
- Orange, Yellow

Total count $= 6$

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
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Here are some digit cards:

$\boxed{2} \quad \boxed{4} \quad \boxed{6} \quad \boxed{6}$

Write all the three-digit numbers, greater than $500$, that can be made using these cards.

</div>
<div class='workings'>
<div class='working'>

The possible arrangements are:

- $624$
- $626$
- $642$
- $646$
- $662$
- $664$

Total count $= 6$

</div>
<div class='working'>

Using permutation,

Number of digits that can be used in the hundreds place (only $6$ can be used) $= 1$

Number of digits that can be used in the tens place $= 3$

Number of digits that can be used in the units place $= 2$

Total arrangements $= 1 \times 3 \times 2 = 6$

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
<div class='question_envelope rag_pr rag_prpcr question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Four friends, Archibald, Bertram, Camilla and Daphne go on holiday together on the French Riviera. On the first evening at 
the hotel they sit down to dinner at a square table shown below. Archibald insists that he sits facing South so that he can have a clear view of the Mediterranean Sea, whilst Bertram and Camilla decide to sit next to each other. Show the four possible seating arrangements on the diagrams below. The first one has been done for you.

![the-haberdashers-askes-boys-school--11-plus--maths--2009--sample-paper-1/section-1-question-30-00.png](/assets/the-haberdashers-askes-boys-school--11-plus--maths--2009--sample-paper-1/section-1-question-30-00.png "the-haberdashers-askes-boys-school--11-plus--maths--2009--sample-paper-1/section-1-question-30-00.png")
![the-haberdashers-askes-boys-school--11-plus--maths--2009--sample-paper-1/section-1-question-30-01.png](/assets/the-haberdashers-askes-boys-school--11-plus--maths--2009--sample-paper-1/section-1-question-30-01.png "the-haberdashers-askes-boys-school--11-plus--maths--2009--sample-paper-1/section-1-question-30-01.png")
![the-haberdashers-askes-boys-school--11-plus--maths--2009--sample-paper-1/section-1-question-30-02.png](/assets/the-haberdashers-askes-boys-school--11-plus--maths--2009--sample-paper-1/section-1-question-30-02.png "the-haberdashers-askes-boys-school--11-plus--maths--2009--sample-paper-1/section-1-question-30-02.png")
![the-haberdashers-askes-boys-school--11-plus--maths--2009--sample-paper-1/section-1-question-30-03.png](/assets/the-haberdashers-askes-boys-school--11-plus--maths--2009--sample-paper-1/section-1-question-30-03.png "the-haberdashers-askes-boys-school--11-plus--maths--2009--sample-paper-1/section-1-question-30-03.png")

</div>
<div class='workings'>
<div class='working'>

Let Archibald be 'A', Bertram be 'B', Camilla be 'C', Daphne be 'D'

If Bertram and Camilla sit next to each other and Archibald sit on north, the possible arrangements are:

| North     | East  | South     | West  |
|:---:  |:---:  |:---:  |:---:  |
| A     | B     | C     | D     |
| A     | C     | B     | D     |
| A     | D     | B     | C     |
| A     | D     | C     | B     |

Count $= 4$

</div>
</div>
<div class='answers'>
<div class='answer'>

$4$

</div>
</div>
<ul class='subquestion lower-alpha'>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

On the second day of the holiday, Archibald relents and graciously allows anyone (including himself) to face the sea, 
although Bertram and Camilla still choose to sit next to each other. How many possible arrangements are there now?

</div>
<div class='workings'>
<div class='working'>

Let Archibald be 'A', Bertram be 'B', Camilla be 'C', Daphne be 'D'

If Bertram sit on North, the possible arrangements are:

| North     | East  | South     | West  |
|:---:  |:---:  |:---:  |:---:  |
| B     | C     | D     | A     |
| B     | C     | A     | D     |
| B     | D     | A     | C     |
| B     | A     | D     | C     |

Count $= 4$

If Bertram sit on South, the possible arrangements are:

| North     | East  | South     | West  |
|:---:  |:---:  |:---:  |:---:  |
| D     | C     | B     | A     |
| A     | C     | B     | D     |
| D     | A     | B     | C     |
| A     | D     | B     | C     |

Count $= 4$

If Bertram sit on East, the possible arrangements are:

| North     | East  | South     | West  |
|:---:  |:---:  |:---:  |:---:  |
| D     | B     | C     | A     |
| A     | B     | C     | D     |
| C     | B     | D     | A     |
| C     | B     | A     | D     |

Count $= 4$

If Bertram sit on East, the possible arrangements are:

| North     | East  | South     | West  |
|:---:  |:---:  |:---:  |:---:  |
| D     | A     | C     | B     |
| A     | D     | C     | B     |
| C     | D     | A     | B     |
| C     | A     | D     | B     |

Count $= 4$

Total count $= 4 + 4 + 4 +4 = 16$

</div>
<div class='working'>

Using permutation,

Number of ways Bertram and Camilla can sit $= 8$

Number of ways Daphne can sit $= 2$

Number of ways Archibald can sit $= 1$

Total arrangements $= 8 \times 2 \times 1 = 16$

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

On the last day of the holiday, all four friends decide that they can sit where they like.  How many possible arrangements are there now?

</div>
<div class='workings'>
<div class='working'>

If Bertram and Camilla sit next to each other, and Archibald likes sit on north, the possible arrangements are:

| North     | East  | South     | West  |
|:---:  |:---:  |:---:  |:---:  |
| A     | B     | C     | D     |
| A     | C     | B     | D     |
| A     | D     | B     | C     |
| A     | D     | C     | B     |

Count $= 4$

</div>
<div class='working'>

Using permutation,

Number of ways Archibald can sit $= 1$

Number of ways Bertram and Camilla can sit $= 4$

Number of ways Daphne can sit $= 1$

Total arrangements $= 1 \times 4 \times 1 = 4$

</div>
</div>
<div class='answers'>
<div class='answer'>

$4$

</div>
</div>

</div>
</li>
</ul>
</div>
</li>
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

The numbers $34$ and $55$ are two examples of two-digit numbers which are made up using the digits $3, 4$ and $5$. 
How many two-digit numbers in total can be made using some or all of the digits $3, 4$ and $5$?

</div>
<div class='workings'>
<div class='working'>

The possible arrangements are:

- $33$
- $34$
- $35$
- $43$
- $44$ 
- $45$
- $53$
- $54$
- $55$

Total count $= 9$

</div>
<div class='working'>

Using permutation,

Number of digits that can be used in the tens place $= 3$

Number of digits that can be used in the units place $= 3$

Total arrangements $= 3 \times 3 = 9$ 

</div>
</div>
<div class='answers'>
<div class='answer'>

$9$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Amar (form captain), Brian (vice captain), Charles and Daniel are best friends in the same class at school. 
They always like to stand next to each other in the lunch queue. 

On Mondays it is a school rule that the form captain is at the front of the queue followed by the vice captain. 
There are two ways in which these boys can queue up on a Monday: $ABCD$ and $ABDC$. 


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

On Tuesdays, the form captain must again queue up first but the remaining three boys can follow in any order. 
There are six ways in which these boys can queue up on a Tuesday. Four of these ways are listed below. 

Write down the remaining two: $ABCD, ABDC, ACBD, ACDB, \text{\textunderscore \textunderscore \textunderscore}, \text{\textunderscore \textunderscore \textunderscore}$ 

</div>
<div class='workings'>
<div class='working'>

The remaining possible ways are:

- $\text{ADBC}$
- $\text{ADCB}$

</div>
</div>
<div class='answers'>
<div class='answer'>

$\text{ADBC, ADCB}$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

On Wednesdays there are no restrictions and all four boys can queue up together in any order. In how many ways can this be done? 

</div>
<div class='workings'>
<div class='working'>

If $\text{A}$ is in the first position, the possible arrangements are:

- $\text{ABCD}$
- $\text{ABDC}$
- $\text{ACBD}$
- $\text{ACDB}$
- $\text{ADBC}$
- $\text{ADCB}$

Count $= 6$

If $\text{B}$ is in the first position, the possible arrangements are:

- $\text{BACD}$
- $\text{BADC}$
- $\text{BCAD}$
- $\text{BCDA}$
- $\text{BDAC}$
- $\text{BDCA}$

Count $= 6$

If $\text{C}$ is in the first position, the possible arrangements are:

- $\text{CABD}$
- $\text{CADB}$
- $\text{CBAD}$
- $\text{CBDA}$
- $\text{CDAB}$
- $\text{CDBA}$

Count $= 6$

If $\text{D}$ is in the first position, the possible arrangements are:

- $\text{DABC}$
- $\text{DACB}$
- $\text{DBAC}$
- $\text{DBCA}$
- $\text{DCAB}$
- $\text{DCBA}$

Count $= 6$

Total count $= 6 + 6 + 6 + 6 = 24$

</div>
<div class='working'>

Using permutation,

Number of places $\text{A}$ can be in the queue $= 4$

Number of places $\text{B}$ can be in the queue $= 3$

Number of places $\text{C}$ can be in the queue $= 2$

Number of places $\text{D}$ can be in the queue $= 1$

Total arrangements $= 4 \times 3 \times 2 \times 1 = 24$

</div>
</div>
<div class='answers'>
<div class='answer'>

$24$

</div>
</div>

</div>
</li>
</ul>
</div>
</li>
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

The streets of New York are arranged in a grid as shown in the diagram.

![the-haberdashers-askes-boys-school--11-plus--maths--2013--sample-paper-4/section-1-question-29-00.png](/assets/the-haberdashers-askes-boys-school--11-plus--maths--2013--sample-paper-4/section-1-question-29-00.png "the-haberdashers-askes-boys-school--11-plus--maths--2013--sample-paper-4/section-1-question-29-00.png")

There are three direct ways of travelling from $A$ to $B$.

Travel one block North followed by two blocks East

Travel one block East followed by one block North followed by one block East

Travel two blocks East followed by one block North.

We write these as $NEE, ENE$ and $EEN$ respectively.

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

There are six direct routes from $A$ to $C$. Four of these routes are $NNEE, NENE, ENEN$ and $EENN$. 
Write down the remaining two routes.

</div>
<div class='workings'>
<div class='working'>

The remaining possible routes are:

- $\text{NEEN}$
- $\text{ENNE}$


</div>
</div>
<div class='answers'>
<div class='answer'>

$\text{NEEN, ENNE}$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

How many direct routes are there to travel from $A$ to $D$?

</div>
<div class='workings'>
<div class='working'>

The possible routes are:

- $\text{ENNN}$
- $\text{NENN}$
- $\text{NNEN}$
- $\text{NNNE}$

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
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

How many direct routes are there to travel from $A$ to $E$?

</div>
<div class='workings'>
<div class='working'>

The possible routes are:

- $\text{EEENN}$
- $\text{EENEN}$
- $\text{EENNE}$
- $\text{ENEEN}$
- $\text{ENENE}$
- $\text{ENNEE}$
- $\text{NEEEN}$
- $\text{NEENE}$
- $\text{NENEE}$
- $\text{NNEEE}$

Count $= 10$

</div>
</div>
<div class='answers'>
<div class='answer'>

$10$

</div>
</div>

</div>
</li>
</ul>
</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prcc question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

The diagram shows the one-way cycle paths in a town. The diagram is not to scale but the distance along each section of the route is shown and is measured in kilometres.


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

How many possible routes are there in total from $A$ to $B$? 

</div>
<div class='workings'>
<div class='working'>

If we trave A to B, the possible route are:

- $15$
- $6 + 10$
- $6 + 8$
- $4 + 10$
- $4 + 8$
- $7 + 10$
- $7 + 8$

count $= 7$

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
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

How long is the shortest distance from $A$ to $B$?

![the-haberdashers-askes-boys-school--11-plus--maths--2014--sample-paper-5/section-1-question-19-subquestion-2-00.png](/assets/the-haberdashers-askes-boys-school--11-plus--maths--2014--sample-paper-5/section-1-question-19-subquestion-2-00.png "the-haberdashers-askes-boys-school--11-plus--maths--2014--sample-paper-5/section-1-question-19-subquestion-2-00.png")

</div>
<div class='workings'>
<div class='working'>

| Path     |  Distance    |
|:---:  |:---:  |
| $15$  | $15$  |
| $6 + 10$  | $16$  |
| $6 + 8$   | $14$  |
| $4 + 10$  | $14$  |
| $4 + 8$   | $12$  |
| $7 + 10$  | $17$  |
| $7 + 8$   | $15$  |

So, from the above table the shortest distance between A and B $= 12$ 

</div>
</div>
<div class='answers'>
<div class='answer'>

$12$

</div>
</div>

</div>
</li>
</ul>
</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prcc question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Mr Green buys four cinema tickets for himself, his wife and their best friends Mr and Mrs White. 
Mrs Green is a rather large lady who must sit in a wider aisle seat. 
In the interest of marital harmony each husband must sit next to his wife. 
The tickets are for seats, $A1, A2, A3$ and $A4$ shown on the plan below.

![the-haberdashers-askes-boys-school--11-plus--maths--2015--sample-paper-6/section-1-question-30-00.png](/assets/the-haberdashers-askes-boys-school--11-plus--maths--2015--sample-paper-6/section-1-question-30-00.png "the-haberdashers-askes-boys-school--11-plus--maths--2015--sample-paper-6/section-1-question-30-00.png")

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

In how many possible ways can Mr Green allocate tickets?

</div>
<div class='workings'>
<div class='working'>

The possible arrangements are:

|  A1         |   A2      |   A3       |  A4         |
|:-----------:|:---------:|:----------:|:-----------:|
| Mrs Green   |  Mr Green | Mr White   |  Mrs White  |
| Mrs Green   | Mr Green  | Mrs White  | Mr White    |

Count $= 2$

</div>
<div class='working'>

Using permutation,

The number of ways Mrs Green can be seated $= 1$

The number of ways Mr Green can be seated $= 1$

The number of ways Mr White can be seated $= 2$

The number of ways Mrs White can be seated $= 1$

Total arrangements $= 1 \times 1 \times 2 \times 1 = 2$

</div>
</div>
<div class='answers'>
<div class='answer'>

$2$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

The following week they are joined by their next best friends, Mr and Mrs Brown.
Again it is decided that every husband sits next to his wife, and Mrs Green must sit on the end of a row. 
The tickets are for seats $A1, A2, A3, A4, A5$ and $A6$.

In how many possible ways can Mr Green allocate tickets?

</div>
<div class='workings'>
<div class='working'>

If Mr Brown and Mrs Brown sit on middle seats, the possible arrangements are:

|  A1         |   A2      |  A3         |   A4      |   A5       |  A6         |
|:-----------:|:---------:|:-----------:|:---------:|:----------:|:-----------:|
| Mrs Green   |  Mr Green | Mrs Brown   |  Mr Brown | Mrs White  |  Mr White   |
| Mrs Green   | Mr Green  | Mr  Brown   |  Mrs Brown| Mrs White  |  Mr White   |
| Mrs Green   |  Mr Green | Mrs Brown   |  Mr Brown | Mr White   |  Mrs White  |
| Mrs Green   | Mr Green  | Mr  Brown   | Mrs Brown | Mr White   |  Mrs White  |

Count $= 4$

If Mr White and Mrs White sit on middle seats, the possible arrangements are:

|  A1         |   A2      |  A3         |   A4      |   A5       |  A6         |
|:-----------:|:---------:|:-----------:|:---------:|:----------:|:-----------:|
| Mrs Green   |  Mr Green | Mrs White   |  Mr White | Mrs Brown  |  Mr  Brown  |
| Mrs Green   | Mr Green  | Mr  White   | Mrs White | Mrs Brown  |  Mr  Brown  |
| Mrs Green   |  Mr Green | Mrs White   |  Mr White | Mr  Brown  |  Mrs Brown  |
| Mrs Green   | Mr Green  | Mr  White   | Mrs White | Mr  Brown  |  Mrs Brown  |

Count $= 4$

Total count $= 4 + 4 = 8$

</div>
<div class='working'>

Using permutation,

The number of ways Mrs Green can be seated $= 1$

The number of ways Mr Green can be seated $= 1$

The number of ways Mr White can be seated $= 4$

The number of ways Mrs White can be seated $= 1$

The number of ways Mr Brown can be seated $= 2$

The number of ways Mrs Brown can be seated $= 1$

Total arrangements $= 1 \times 1 \times 4 \times 1 \times 2 \times 1 = 8$

</div>
</div>
<div class='answers'>
<div class='answer'>

$8$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

The outing was so enjoyable that all three couples decide to repeat the experience the following week but this time 
Mr Green buys tickets for seats $A1, A2, A3, A4, B1$ and $B2$. Assuming that the usual restrictions about where they can 
sit still apply, work out the number of ways in which Mr Green can allocate the tickets.

![the-haberdashers-askes-boys-school--11-plus--maths--2015--sample-paper-6/section-1-question-30-subquestion-3-00.png](/assets/the-haberdashers-askes-boys-school--11-plus--maths--2015--sample-paper-6/section-1-question-30-subquestion-3-00.png "the-haberdashers-askes-boys-school--11-plus--maths--2015--sample-paper-6/section-1-question-30-subquestion-3-00.png")

</div>
<div class='workings'>
<div class='working'>

If Mr Brown and Mrs Brown sit on B1,B2 seats, the possible arrangements are:

| A1    | A2    | A3    | A4    | B1    | B2    |
|:---:  |:---:  |:---:  |:---:  |:---:  |:---:  |
| Mrs Green     | Mr Green  | Mrs White     | Mr White  | Mrs Brown     | Mr Brown  |
| Mrs Green     | Mr Green  | Mr White  | Mrs White     | Mrs Brown     | Mr Brown  |
| Mrs Green     | Mr Green  | Mrs White     | Mr White  | Mr Brown  | Mrs Brown     |
| Mrs Green     | Mr Green  | Mr White  | Mrs White     | Mr Brown  | Mrs Brown     |

Count $= 4$

If Mr White and Mrs White sit on B1,B2 seats, the possible arrangements are:

| A1    | A2    | A3    | A4    | B1    | B2    |
|:---:  |:---:  |:---:  |:---:  |:---:  |:---:  |
| Mrs Green     | Mr Green  | Mrs Brown     | Mr Brown  | Mrs White     | Mr White  |
| Mrs Green     | Mr Green  | Mr Brown  | Mrs Brown     | Mrs White     | Mr White  |
| Mrs Green     | Mr Green  | Mrs Brown     | Mr Brown  | Mr White  | Mrs White     |
| Mrs Green     | Mr Green  | Mr Brown  | Mrs Brown     | Mr White  | Mrs White     |

Count $= 4$

If Mr Green and Mrs Green sit on B1,B2 seats and Mr White and Mrs White sit on A1,A2 seats, the possible arrangements are:

| A1    | A2    | A3    | A4    | B1    | B2    |
|:---:  |:---:  |:---:  |:---:  |:---:  |:---:  |
| Mrs White     | Mr White  | Mrs Brown     | Mr Brown  | Mrs Green     | Mr Green  |
| Mr White  | Mrs White     | Mrs Brown     | Mr Brown  | Mrs Green     | Mr Green  |
| Mrs White     | Mr White  | Mr Brown  | Mrs Brown     | Mrs Green     | Mr Green  |
| Mr White  | Mrs White     | Mr Brown  | Mrs Brown     | Mrs Green     | Mr Green  |

Count $= 4$

If Mr Green and Mrs Green sit on B1,B2 seats and Mr Brown and Mrs Brown sit on A1,A2 seats, the possible arrangements are:

| A1    | A2    | A3    | A4    | B1    | B2    |
|:---:  |:---:  |:---:  |:---:  |:---:  |:---:  |
| Mrs Brown     | Mr Brown  | Mrs White     | Mr White  | Mrs Green     | Mr Green  |
| Mr Brown  | Mrs Brown     | Mrs White     | Mr White  | Mrs Green     | Mr Green  |
| Mrs Brown     | Mr Brown  | Mr White  | Mrs White     | Mrs Green     | Mr Green  |
| Mr Brown  | Mrs Brown     | Mr White  | Mrs White     | Mrs Green     | Mr Green  |

Count $= 4$

Total count $= 4 + 4 + 4 + 4 = 16$

</div>
<div class='working'>

The number of ways Mrs Green can be seated $= 2$ 

The number of ways Mr Green can be seated $= 1$

The number of ways Mr White can be seated $= 4$

The number of ways Mrs White can be seated $= 1$

The number of ways Mr Brown can be seated $= 2$

The number of ways Mrs Brown can be seated $= 1$

Total arrangements $= 2 \times 1 \times 4 \times 1 \times 2 \times 1 = 16$

</div>
</div>
<div class='answers'>
<div class='answer'>

$16$

</div>
</div>

</div>
</li>
</ul>
</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcr question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

The diagram shows the one-way cycle paths in a park.

Work out the total number of possible routes to go:

-  from $A$ to $C$
-  from $A$ to $D$
-  from $A$ to $E$

![the-haberdashers-askes-boys-school--11-plus--maths--2016--sample-paper-7/section-1-question-28-00.png](/assets/the-haberdashers-askes-boys-school--11-plus--maths--2016--sample-paper-7/section-1-question-28-00.png "the-haberdashers-askes-boys-school--11-plus--maths--2016--sample-paper-7/section-1-question-28-00.png")

</div>
<div class='workings'>
<div class='working'>

 
If we go from $A$ to $C$, the possible arrangements are:

- A $1$ B $1$ C
- A $1$ B $2$ C
- A $2$ B $1$ C
- A $2$ B $2$ C
- A $3$ B $1$ C
- A $3$ B $2$ C

If we go from $A$ to $D$, the possible arrangements are:

If we use path $1$ between A and B, and $1$ between B and c

$
\begin{matrix}
A & 1 & B & 1 & C & 1 & D \\ 
A & 1 & B & 1 & C & 2 & D \\
A & 1 & B & 1 & C & 3 & D \\
A & 1 & B & 1 & C & 4 & D \\
\end{matrix}
$

Count $= 4$

If we use path $1$ between A and B, and $2$ between B and c

$
\begin{matrix}
A & 1 & B & 2 & C & 1 & D \\
A & 1 & B & 2 & C & 2 & D \\
A & 1 & B & 2 & C & 3 & D \\
A & 1 & B & 2 & C & 4 & D \\
\end{matrix}
$

Count $= 4$

If we use path $2$ between A and B, and $1$ between B and c

$
\begin{matrix}
A & 2 & B & 1 & C & 1 & D \\
A & 2 & B & 1 & C & 2 & D \\
A & 2 & B & 1 & C & 3 & D \\
A & 2 & B & 1 & C & 4 & D \\
\end{matrix}
$

Count $= 4$

If we use path $2$ between A and B, and $2$ between B and c

$
\begin{matrix}
A & 2 & B & 2 & C & 1 & D \\
A & 2 & B & 2 & C & 2 & D \\
A & 2 & B & 2 & C & 3 & D \\
A & 2 & B & 2 & C & 4 & D \\
\end{matrix}
$

If we use path $3$ between A and B, and $1$ between B and c

$
\begin{matrix}
A & 3 & B & 1 & C & 1 & D \\
A & 3 & B & 1 & C & 2 & D \\
A & 3 & B & 1 & C & 3 & D \\
A & 3 & B & 1 & C & 4 & D \\
\end{matrix}
$

Count $= 4$

If we use path $3$ between A and B, and $2$ between B and c

$
\begin{matrix}
A & 3 & B & 2 & C & 1 & D \\
A & 3 & B & 2 & C & 2 & D \\
A & 3 & B & 2 & C & 3 & D \\
A & 3 & B & 2 & C & 4 & D \\
\end{matrix}
$

Count $= 4$

If we use path $4$ 

- A $4$ D

Count $= 1$

Total count $= 4 + 4 + 4 + 4 + 4 + 4 + 1 = 25$

If we go from $A$ to $E$, the possible arrangements are:

- $ABCDE$
- $ABCE$
- $ADE$
- $AE$

Count $= 4$

Total count $= 4 + 4 + 4 = 12$

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
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

A football competition was held between five Year $6$ teams. 
Each team played every other team once. 

How many games did the teams play in total?

![the-london-independent-girls-schools-consortium--11-plus--maths--2010--group-1/section-1-question-34-00.png](/assets/the-london-independent-girls-schools-consortium--11-plus--maths--2010--group-1/section-1-question-34-00.png "the-london-independent-girls-schools-consortium--11-plus--maths--2010--group-1/section-1-question-34-00.png")

</div>
<div class='workings'>
<div class='working'>

Let the teams are $= \text{A}, \text{B}, \text{C}, \text{D}, \text{E}, \text{F}$

The possible games between the teams are:

- $\text{A}, \text{B}$
- $\text{A}, \text{C}$
- $\text{A}, \text{D}$
- $\text{A}, \text{E}$
- $\text{A}, \text{F}$
- $\text{B}, \text{C}$
- $\text{B}, \text{D}$
- $\text{B}, \text{E}$
- $\text{B}, \text{F}$
- $\text{C}, \text{D}$
- $\text{C}, \text{E}$
- $\text{C}, \text{F}$
- $\text{D}, \text{E}$
- $\text{D}, \text{F}$
- $\text{E}, \text{F}$

Total count $= 15$

</div>
<div class='working'>

Number of teams the first team can pick to play $= 5$

Number of teams the second team can pick to play $= 4$

Number of teams the third team can pick to play $= 3$

Number of teams the fourth team can pick to play $= 2$

Number of teams the fifth team can pick to play $= 1$

Total games $= 6 + 5 + 4 + 3 + 2 + 1 = 15$

</div>
<div class='working'>

Using permutation,

Number of ways we can select the first team $= 6$

Number of ways we can select the second team $= 5$

Total arrangements $= 6 \times 5 = 30$

The game betwen the first team and the second team is same as the game between second 
team and the first team. So we are counting all the games twice. Let's account for that.

Total games $= 30 \div 2 = 15$

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

This number plate has the number $279$.

$\boxed {\quad 279 \quad}$

Write down all the other $3$-figure numbers 
you could make using $2, 7$ and $9$ once in each $3$-figure number.
You can only use $2, 7$ and $9$ once in each $3$-figure number.

</div>
<div class='workings'>
<div class='working'>

The possible arrangements are:

- $279$
- $297$
- $729$
- $792$
- $927$
- $972$

Count $= 6$

</div>
<div class='working'>

Using permutation,

Number of digits that can be used in the hundreds place $= 3$

Number of digits that can be used in the tens place $= 2$

Number of digits that can be used in the units place $= 1$

Total arrangements $= 3 \times 2 \times 1 = 6$

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
<div class='question_envelope rag_blocked rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

The diagram below shows the footpaths between villages.

Each village is represented by a letter.

For example, there are three different possible footpaths between villages $Q$ and $R$.

![the-london-independent-girls-schools-consortium--11-plus--maths--2013--group-2/section-1-question-37-00.png](/assets/the-london-independent-girls-schools-consortium--11-plus--maths--2013--group-2/section-1-question-37-00.png "the-london-independent-girls-schools-consortium--11-plus--maths--2013--group-2/section-1-question-37-00.png")

Jane wants to walk from village $A$ and $B$ without travelling through any village twice on her route.

Work out how many different possible routes Jane could take?

</div>
<div class='workings'>
<div class='working'>

Using permutation,

If we follow $APB$ village, the number of possible route are $= 1$

If we follow $AQRSB$ village, the number of possible route are $= 2 \times 3 = 6$

If we follow $ATUVB$ village, the number of possible route are $= 2 \times 3 \times 2 = 12$

So, total possible routes $= 1 + 6 + 12 = 19$

</div>
</div>
<div class='answers'>
<div class='answer'>

$19$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

In a doctor’s waiting room, there are $6$ seats in a row.

Mr Spencer arrives with his $2$ children.

He wants to sit between his $2$ children.

$3$ other people arrive who do not mind where they sit.

![the-london-independent-girls-schools-consortium--11-plus--maths--2014--group-2/section-1-question-35-00.png](/assets/the-london-independent-girls-schools-consortium--11-plus--maths--2014--group-2/section-1-question-35-00.png "the-london-independent-girls-schools-consortium--11-plus--maths--2014--group-2/section-1-question-35-00.png")

How many different possible seating arrangements are there of the $6$ people?

*You may find the boxes helpful*.

![the-london-independent-girls-schools-consortium--11-plus--maths--2014--group-2/section-1-question-35-01.png](/assets/the-london-independent-girls-schools-consortium--11-plus--maths--2014--group-2/section-1-question-35-01.png "the-london-independent-girls-schools-consortium--11-plus--maths--2014--group-2/section-1-question-35-01.png")

</div>
<div class='workings'>
<div class='working'>

Let Mr Spencer $= \text{S}$

Let his children $= \text{C1}$ and $\text{C2}$

Let the other three people $= \text{P1, P2, P3}$

If Mr Spencer sits in the second seat, the possible arrangements are:

- $\text{C1  \quad S  \quad C2 \quad P1 \quad P2 \quad P3}$
- $\text{C1  \quad S  \quad C2 \quad P1 \quad P3 \quad P2}$
- $\text{C1  \quad S  \quad C2 \quad P2 \quad P1 \quad P3}$
- $\text{C1  \quad S  \quad C2 \quad P2 \quad P3 \quad P1}$
- $\text{C1  \quad S  \quad C2 \quad P3 \quad P1 \quad P2}$
- $\text{C1  \quad S  \quad C2 \quad P3 \quad P2 \quad P1}$
- $\text{C2  \quad S  \quad C1 \quad P1 \quad P2 \quad P3}$
- $\text{C2  \quad S  \quad C1 \quad P1 \quad P3 \quad P2}$
- $\text{C2  \quad S  \quad C1 \quad P2 \quad P1 \quad P3}$
- $\text{C2  \quad S  \quad C1 \quad P2 \quad P3 \quad P1}$
- $\text{C2  \quad S  \quad C1 \quad P3 \quad P1 \quad P2}$
- $\text{C2  \quad S  \quad C1 \quad P3 \quad P2 \quad P1}$

Count $= 12$

If Mr Spencer sits in the third seat, the possible arrangements are:

- $\text{P1 \quad C1 \quad S \quad C2 \quad P2 \quad P3}$
- $\text{P1 \quad C1 \quad S \quad C2 \quad P3 \quad P2}$
- $\text{P2 \quad C1 \quad S \quad C2 \quad P1 \quad P3}$
- $\text{P2 \quad C1 \quad S \quad C2 \quad P3 \quad P1}$
- $\text{P3 \quad C1 \quad S \quad C2 \quad P1 \quad P2}$
- $\text{P3 \quad C1 \quad S \quad C2 \quad P2 \quad P1}$
- $\text{P1 \quad C2 \quad S \quad C1 \quad P2 \quad P3}$
- $\text{P1 \quad C2 \quad S \quad C1 \quad P3 \quad P2}$
- $\text{P2 \quad C2 \quad S \quad C1 \quad P1 \quad P3}$
- $\text{P2 \quad C2 \quad S \quad C1 \quad P3 \quad P1}$
- $\text{P3 \quad C2 \quad S \quad C1 \quad P1 \quad P2}$
- $\text{P3 \quad C2 \quad S \quad C1 \quad P2 \quad P1}$

Count $= 12$


If Mr Spencer sits in the fourth seat, the possible arrangements are:

- $\text{P1 \quad P2 \quad C1 \quad S \quad C2 \quad P3}$
- $\text{P1 \quad P3 \quad C1 \quad S \quad C2 \quad P2}$
- $\text{P2 \quad P1 \quad C1 \quad S \quad C2 \quad P3}$
- $\text{P2 \quad P3 \quad C1 \quad S \quad C2 \quad P1}$
- $\text{P3 \quad P1 \quad C1 \quad S \quad C2 \quad P2}$
- $\text{P3 \quad P2 \quad C1 \quad S \quad C2 \quad P1}$
- $\text{P1 \quad P2 \quad C2 \quad S \quad C1 \quad P3}$
- $\text{P1 \quad P3 \quad C2 \quad S \quad C1 \quad P2}$
- $\text{P2 \quad P1 \quad C2 \quad S \quad C1 \quad P3}$
- $\text{P2 \quad P3 \quad C2 \quad S \quad C1 \quad P1}$
- $\text{P3 \quad P1 \quad C2 \quad S \quad C1 \quad P2}$
- $\text{P3 \quad P2 \quad C2 \quad S \quad C1 \quad P1}$

Count $= 12$

If Mr Spencer sit in fifth seat, the possible arrangements are:

- $\text{P1 \quad P2 \quad P3 \quad C1 \quad S \quad C2}$
- $\text{P1 \quad P3 \quad P2 \quad C1 \quad S \quad C2}$
- $\text{P2 \quad P1 \quad P3 \quad C1 \quad S \quad C2}$
- $\text{P2 \quad P3 \quad P1 \quad C1 \quad S \quad C2}$
- $\text{P3 \quad P1 \quad P2 \quad C1 \quad S \quad C2}$
- $\text{P3 \quad P2 \quad P1 \quad C1 \quad S \quad C2}$
- $\text{P1 \quad P2 \quad P3 \quad C2 \quad S \quad C1}$
- $\text{P1 \quad P3 \quad P2 \quad C2 \quad S \quad C1}$
- $\text{P2 \quad P1 \quad P3 \quad C2 \quad S \quad C1}$
- $\text{P2 \quad P3 \quad P1 \quad C2 \quad S \quad C1}$
- $\text{P3 \quad P1 \quad P2 \quad C2 \quad S \quad C1}$
- $\text{P3 \quad P2 \quad P1 \quad C2 \quad S \quad C1}$

Count $= 12$

Total count $= 12 + 12 + 12 + 12 = 48$

</div>
<div class='working'>

Using permutation,

Since Mr Spencer has to sit between his two children, he can only sit in the middle four seats.

Number of places Mr Spencer can sit $= 4$

Number of places his first child can sit $= 2$

Number of places his second child can sit $= 1$

Number of ways the fourth seat can be occupied $= 3$

Number of ways the fifth seat can be occupied $= 2$

Number of ways the sixth seat can be occupied $= 1$

Total arrangements $= 4 \times 2 \times 1 \times 3 \times 2 \times 1 = 48$

</div>
</div>
<div class='answers'>
<div class='answer'>

$48$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Mum, Dad and Granny have three cakes:

Chocolate, strawberry and coffee.

Mum likes chocolate or coffee.

Dad likes chocolate, and Granny likes all three.

How can it be arranged, so that they each get a cake that they like? 

</div>
<div class='workings'>
<div class='working'>

Since Dad likes only chocolate, he can have the the chocolate cake.

Mum can have coffee.

That leaves strawberry cake for Granny.

</div>
</div>
<div class='answers'>
<div class='answer'>

Dad $=$ Chocolate

</div>
<div class='answer'>

Mum $=$ Coffee

</div>
<div class='answer'>

Granny $=$ Strawberry

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_g3 rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

How many different four digit numbers can be made from the digits $2, 2, 2, 3$ and $3$?

</div>
<div class='workings'>
<div class='working'>

If we use three $2$ and one $3$, the possible arrangements are:

- $2223$
- $2232$
- $2322$
- $3222$

If we use two $2$ and two $3$, the possible arrangements are:

- $2233$
- $2323$
- $2332$
- $3223$
- $3232$
- $3322$

Total count $= 4 + 6 = 10$

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

How many $2$-digit numbers contain at least one $4$?

</div>
<div class='workings'>
<div class='working'>

Two digit numbers with their first digit as $4$ are:

$
\begin{matrix}
40 &  41 &  42 &  43 &  44 \\\\
45 &  46 &  47 &  48 &  49
\end{matrix}
$

Two digit numbers with their last digit as $4$ are (ensure you do not count $44$ twice):

$
\begin{matrix}
14 & 24 & 34 & 54 \\\\
64 & 74 & 84 & 94
\end{matrix}
$

Count $= 10 + 8 = 18$

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

How many three digit numbers contain at least two sevens?

</div>
<div class='workings'>
<div class='working'>

Note: $777$ occurs in every list, so ensure to count it only once.

If we use a $7$ in the hundreds and the tens place, the possible arrangements (excluding $777$) are:

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

If we use a $7$ in the hundreds and the units place, the possible arrangements (excluding $777$) are:

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


If we use a $7$ in the tens and the units place, the possible arrangements (including $777$) are:

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

Total count $= 9 + 9 + 9 = 27$

</div>
</div>
<div class='answers'>
<div class='answer'>

$27$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_notstarted rag_prns question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Following independence, the new country of Oldhallia is trying to design its national flag. The government decide that their flag will consist of two colours. 

For example:

![missing table](/papers/missing_table.svg)


Blue Green

because international rules state that the flag may not be all one colour and the rules also state that they are only allowed to pick from a certain number of colours.

The country always chooses what colour to put in the left section first. When calculating how many possible choices that they have for their flag; the following system is adopted. So with seven possible colours the choices would be

![missing table](/papers/missing_table.svg)


Any of the $7$ colours.
Any of the $6$ remaining colours.

Which gives a total number of possible flags $= 7 \times 6 = 42$.

If the country wants to make a flag with three colours, the rules state that they may not have two sections of the same colour next to each other.

If there were $4$ choices of colour the calculation would be:

![missing table](/papers/missing_table.svg)


Any of the $4$ colours.
Any of the $3$ remaining colours.
Any of the $3$ colours which are different from the middle.

which gives a total number of possible flags $= 4 \times 3 \times 3 = 36$.

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

How many possible flags are there if they can choose from $10$ colours?

</div>
<div class='workings'>
<div class='working'>

If we choose for left side of flag, the number of possible choices $= 10$

If we choose for right side of flag, the number of possible choices $= 9$

Total arrangement $= 10 \times 9 = 90$ 

</div>
</div>
<div class='answers'>
<div class='answer'>

$90$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

If there are a total of $12$ flags, how many colours did they have to choose from?

</div>
<div class='workings'>
<div class='working'>

Total Colours \times [Left Colours - 1] = Flags 

Flags = 12

Let's take total colours as $x$

$
\begin{aligned}
x \times (x -1 ) = 12
x^2 - x = 12
x^2 - x -12 = 0
(x + 4) (x - 3) = 0
x = 4
x = - 3
\end{aligned}
$

Let's substitute

$
\begin{aligned}
4 \times (4 -1 ) = 12
4 \times 3 = 12
\end{aligned}
$

$x = 4$

There are total of $4$ colors 

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

If the international rules were relaxed to allow flags of all one colour as well, how many possible flags would there be choosing from $6$ colours?

</div>
<div class='workings'>
<div class='working'>

Flags with $1$ Colour 

$=6 Colours \times 1 = 6$

Flags with $2$ Colours 

$
\begin{aligned}
= 6 Colours \times (6 - 1) \\
= 6 \times 5 \\
= 30
\end{aligned}
$

Total flags

$= (1$ colour $+ 2$ colour) Flags
$= 6 + 30$ 

$= 36$ Flags

</div>
</div>
<div class='answers'>
<div class='answer'>

$36$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

How many flags are there if they can choose from $10$ colours?

</div>
<div class='workings'>
<div class='working'>

A flag may have $3$ colours.

Total Flags = Total colours $\times$ (Total $- 1$) \times (Total $- 1$)

</div>
<div class='working'>

Total colour options $=10$

Let's substitute as above,

Total Flags 

$
\begin{aligned}
&= 10 \times (10- 1) \times (10 - 1) \\
&= 10 \times 9 \times 9 \\
&= 10 \times 81 \\
&= 810
\end{aligned}
$

$810$ different flags are possible with $10$ colours.


</div>
</div>
<div class='answers'>
<div class='answer'>

$810$


</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

If there are a total of $150$ possible flags, how many colours did they have to choose from?

</div>
<div class='workings'>
<div class='working'>

A flag may have $3$ colours.

Total Flags = Total colours $\times$ (Total $- 1$) $\times$ (Total $- 1$)

Total Flags $=150$

Let's substitute as above,

Total Flags 

$
\begin{aligned}
150 &= x \times (x- 1) \times (x - 1) \\
\end{aligned}
$

$810$ different flags are possible with $10$ colours.




</div>
</div>
<div class='answers'>
<div class='answer'>

$810$

</div>
</div>

</div>
</li>
</ul>
</div>
</li>
</ul>
</div>
