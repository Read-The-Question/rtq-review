---
slug: "ragpapers/topicpapers-tpermutation-1-g3"
title: "TopicPaper - Permutation - 1 - G3"
date: 2022-09-21 20:40:31
questions_count: "25"
---
<ul class='question default-decimal'>
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
</ul>
