---
slug: "ragpapers/topicpapers-ttable-2-pr"
title: "TopicPaper - Table - 2 - PR"
date: 2022-10-04 10:03:20
questions_count: "9"
---
<ul class='question default-decimal'>
<li>
<div class='question_envelope rag_pr rag_prpcr question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

The table below shows four different makes of car each with four different engine sizes, in litres, and the Insurance Group for each. For example a Hissan $1.5$ car is in Insurance Group B.

<!--
                ,Car type   ,Skoyota    ,Hissan     ,Foxhall    ,Jagley
Engine size     ,           ,           ,           ,
$1.1$           ,           ,A          ,A          ,A          ,-
$1.2$           ,           ,A          ,A          ,B          ,-
$1.5$           ,           ,B          ,B          ,B          ,C
$1.9$           ,           ,-          ,C          ,B          ,D
-->

|                 | Car type     | Skoyota     | Hissan     | Foxhall     | Jagley     |
|:-----------:    |:--------:    |:-------:    |:------:    |:-------:    |:------:    |
| Engine size     |              |             |            |             |            |
|    $1.1$        |              |    A        |    A       |    A        |    -       |
|    $1.2$        |              |    A        |    A       |    B        |    -       |
|    $1.5$        |              |    B        |    B       |    B        |    C       |
|    $1.9$        |              |    -        |    C       |    B        |    D       |

The second table shows the monthly insurance payment paid by drivers of different age bands for each of the insurance groups, so a person aged $37$ would be in the age band $21 - 45$ and so would pay $\pounds 105$ each month for a car in Insurance group C.


<!--
                    ,Age band       ,Under 21       ,21 - 45        ,Over 45
Insurance Group     ,               ,               ,               ,
A                   ,               ,$\pounds 90$   ,$\pounds 80$   ,$\pounds 70$
B                   ,               ,$\pounds 110$  ,$\pounds 95$   ,$\pounds 85$
C                   ,               ,$\pounds 122$  ,$\pounds 105$  ,$\pounds 98$
D                   ,               ,$\pounds 190$  ,$\pounds 160$  ,$\pounds 170$
-->

|                     | Age band     |    Under 21       |    21 - 45        |    Over 45        |
|:---------------:    |:--------:    |:-------------:    |:-------------:    |:-------------:    |
| Insurance Group     |              |                   |                   |                   |
|        A            |              |  $\pounds 90$     |  $\pounds 80$     |  $\pounds 70$     |
|        B            |              | $\pounds 110$     |  $\pounds 95$     |  $\pounds 85$     |
|        C            |              | $\pounds 122$     | $\pounds 105$     |  $\pounds 98$     |
|        D            |              | $\pounds 190$     | $\pounds 160$     | $\pounds 170$     |


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

How much will a $19$ year old pay for a Foxhall $1.5$ car each month?

</div>
<div class='workings'>
<div class='working'>

Refer to Table $1$ Column: Foxhall Row: Engine $1.5$ size

Foxhall $1.5$ belongs to Group $B$

for Insurance amount Refer to Table $2$ Column: Under $21$ Row: $B$

Under $21$, with Insurance Group $B$ pays $\pounds 110$ insurance per month. 


</div>
</div>
<div class='answers'>
<div class='answer'>

$\pounds 110$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

A $30$ year old pays $\pounds 95$ for a Hissan car. What is the engine size of their car, in litres?

</div>
<div class='workings'>
<div class='working'>

Refer to Table $2$ Column: Under $21 - 45$ and find which Insurance Group $\pounds 95$ belongs to.

Under  $21 - 45$ $\pounds 95$ payment belongs to Insurance Group $B$

to find the Engine size refer to Table $1$ Column: Hissan, find $B$ and then the respective Row for Engine size $1.5$

Hissan with Insurance Group $B$ belongs to Engine size $1.5$ litres

</div>
</div>
<div class='answers'>
<div class='answer'>

$1.5 \ \text {ltrs}$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

How much would a $50$ year old person **save** each month by using a $1.1$ Hissan car rather than a $1.9$ Hissan car?

</div>
<div class='workings'>
<div class='working'>

$1.1$ Hissan car belongs to Insurance Group $A$

A $50$ year old pays $\pounds 70$ under Insurance Group $A$

$1.9$ Hissan car belongs to Insurance Group $B$ 

A $50$ year old pays $\pounds 98$ under Insurance Group $B$

Savings per year by using a $1.1$  instead of $1.9$  Engine Hissan car:

$\pounds 98 - \pounds 70 = \pounds 28$


</div>
</div>
<div class='answers'>
<div class='answer'>

$\pounds 28$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

If a 32 year old pays $\pounds 95$ for a Skoyota car, what would a $20$ year old pay for a Jagley car with the same size engine?

</div>
<div class='workings'>
<div class='working'>

Refer to : Column $\text {Under} \ 21 -45$, $\pounds 95$ to find the Insurance Group

$\quad \pounds 95$ belongs to Insurance Group $B$

Now refer to: column Skoyota, Insurance Group $B$ to find the Engine size.

Group $B$ belongs to Engine size $1.5$

Same size Jagley belongs to Insurance Group $C$

Now refer again to Table $2$ column Under $20$ and then Row Insurance Group $C$ to find the amount.

Under $21$, Insurance Group $C$ pays $\pounds 122$ per month


</div>
</div>
<div class='answers'>
<div class='answer'>

$\pounds 122$

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

In magic squares, the numbers in every row, column and the two diagonals add up to the same number. What is the **$\underline{sum}$** of the **$\underline{missing}$** numbers in the magic square below?


| $4$             | $8$             | $9$             |
|:---------:    |:---------:    |:---------:    |
|                 | $7$             |                 |
|                 |                 |                 |

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
\text{Sum of first row}     &= 4 + 8 + 9 \\\\
                            &= 21
\end{aligned}
$

Let's complete the table.

| $4$                                    | $8$                                   | $9$                                    |
|:---------:                             |:---------:                            |:---------:                             |
| $21 - 4 - 5 = 12 \ \maroonC{\footnotesize{(3)}}$ | $7$                                   | $21 - 12 - 7 = 2 \ \maroonC{\footnotesize{(4)}}$ |
| $21 - 9 - 7 = 5 \ \maroonC{\footnotesize{(2)}}$  | $21 - 8 - 7 = 6 \ \maroonC{\footnotesize{(1)}}$ | $21 - 9 - 2 = 10 \ \maroonC{\footnotesize{(5)}}$ |

</div>
</div>
<div class='answers'>
<div class='answer'>

| $4$           | $8$             | $9$             |
|:---------:    |:---------:      |:---------:      |
|  $12$         | $7$             | $2$             |
|  $5$          | $6$             | $10$            |

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcr question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

The table below lists the charges on a new toll road


|               | Daytime         | Night          |
|-----------    |:------------:    |:----------:    |
| Lorry         | $$\pounds 6$             | $$\pounds 4.50$         |
| Car           | $$\pounds 3$             | $$\pounds 2$            |
| Motorbike     | $$\pounds 2.50$          | $$\pounds 1$            |
| Van           | $$\pounds 4$             | $$\pounds 3$            |

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
<ul class='subquestion lower-alpha'>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

How much would a lorry driver and a car driver save altogether by travelling at night?

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
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

During one night, the toll road is used by $100$ cars, $200$ lorries and $20$ vans. How much money is collected altogether?

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
</ul>
</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcr question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

This table shows the tram fares from Merton to three towns.


|                  | $1^{st}$ class     | $1^{st}$class     | $2^{nd}$ class     | $2^{nd}$ class     |
|--------------    |----------------    |---------------    |----------------    |----------------    |
|                  | adult              | child             | adult              | child              |
| Ashbridge        | $$\pounds 7.20$             | $$\pounds 4.70$            | $$\pounds 4.80$             | $$\pounds 3.10$             |
| Greenborough     | $$\pounds 9.10$             | $$\pounds 6.20$            | $$\pounds 5.40$             | $$\pounds 3.90$             |
| Felby            | $$\pounds 11.50$            | $$\pounds 7.60$            | $$\pounds 6.90$             | $$\pounds 5.40$             |

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
<ul class='subquestion lower-alpha'>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

How much does it cost $1$ adult and $2$ children to travel $2^{nd}$ Felby?

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
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Ben and Anna were taken to Ashbridge by their Aunt Patricia. Their mother gave the children the money for the $2^{nd}$ class fare but Aunt Patricia paid the extra for them to travel $1^{st}$ class as well as paying for her own ticket. How much did Aunt Patricia pay?

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
</ul>
</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcr question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Princess Rose of Ruritania is getting married in July. The Lord Chancellor has to organise the wedding procession which will consist of cars and police motorcycles. The diagrams below show overhead views of one car and motorcycles and of two cars and motorcycles.

![the-peterborough-school--11-plus--maths--9999--sample-paper-1/section-1-question-17-00.png](/assets/the-peterborough-school--11-plus--maths--9999--sample-paper-1/section-1-question-17-00.png "the-peterborough-school--11-plus--maths--9999--sample-paper-1/section-1-question-17-00.png")

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

Complete the table below which shows how many motorcycles are needed for different numbers of cars.

| Number of cars            | $1$     | $2$     | $3$     | $4$     |
|-----------------------    |-----    |-----    |-----    |-----    |
| Number of motorcycles     | $6$     |         |         |         |

</div>
<div class='workings'>
<div class='working'>

Let's complete the table.

| Number of cars            | $1$     | $2$                       | $3$                                                 | $4$                                                 |
|-----------------------    |-----    |-----                      |-----                                                |-----                                                |
| Number of motorcycles     | $6$     | $10 \ \maroonC{\footnotesize{(1)}}$ | $4 \times 3 + 2 = 12 + 2 = 14 \ \maroonC{\footnotesize{(2)}}$ | $4 \times 4 + 2 = 16 + 2 = 18 \ \maroonC{\footnotesize{(3)}}$ |

</div>
</div>
<div class='answers'>
<div class='answer'>

| Number of cars            | $1$     | $2$     | $3$     | $4$     |
|-----------------------    |-----    |-----    |-----    |-----    |
| Number of motorcycles     | $6$     |  $10$   | $14$    | $18$    |

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

How many motorcycles would you need for $8$ cars?

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
\text{Number of motorcycles}    &= 4 \times 8 + 2 \\\\
                                &= 32 + 2 \\\\
                                &= 34
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$34$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

How many cars have you got if you have $42$ motorcycles

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
\text{Number of cars}       &= \dfrac {42 - 2} {4} \\\\
                            &= \dfrac {40} {4} \\\\
                            &= \dfrac {10 \times 4} {4} \\\\
                            &= \dfrac {10 \times \cancel 4} {\cancel 4} \\\\
                            &= 10
\end{aligned}
$

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
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

When the Lord Chancellor found out how many cars were going to be needed he asked the police to provide $55$ motorcycles. Explain how you know he must have made a mistake.

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
\text{Number of cars}       &= \dfrac {55 - 2} {4} \\\\
                            &= \dfrac {53} {4} \\\\
                            &= 13.25
\end{aligned}
$

Number of cars is not a whole number therefore he must have made a mistake.

</div>
</div>
<div class='answers'>
<div class='answer'>

Number of cars is not a whole number therefore he must have made a mistake.

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

The boy doing work experience with the Lord Chancellor said it would be much easier to use a formula. Fill in the gaps in his formula.

$\boxed{Number\,of\,motorcycles=\:\:\:\:\:\:\:\:\times number\,of\,cars+\:\:\:\:\:\:\:\:\:\:\:}$

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
\text{Number of motorcycles}    &= 4 \times \text{Number of cars} + 2
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

Number of motorcycles = $4 \times$ Number of cars $+ 2$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

What difference would it make to the formula if stretch limos were used with $4$ motorcycles on each side of the cars instead of $2$?

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
\text{Number of motorcycles}    &= 8 \times \text{Number of cars} + 2
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

Number of motorcycles = $8 \times$ Number of cars $+ 2$

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

In the figure, the length y of the dog-leg path across the square of side-length $2$ from A to B is given by the formula $y=\sqrt{1+x^2}+\sqrt{5-4x+x^2}$ where x is the distance shown. (For some values of $𝑥$ the path will go outside the square.)

![tonbridge-school--scholarship--maths--2016--sample-paper-2/section-1-question-6-00.png](/assets/tonbridge-school--scholarship--maths--2016--sample-paper-2/section-1-question-6-00.png "tonbridge-school--scholarship--maths--2016--sample-paper-2/section-1-question-6-00.png")

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

Make a table of y values (correct to $2$ decimal places) corresponding to $x$ values of $0,\:\: 0.5,\:\: 1,\:\: 1.5,\:\: 2,\:\: 2.5,\:\: 3,\:\: 3.5,\:\: 4$. Why are the yvalues for $0.5$ and $1.5$ the same?

</div>
<div class='workings'>
<div class='working'>

Let's complete the table.

| Value of $x$ |                                Value of $y$                                                                                           |
|--------------|-------------------------------------------------------------------------------------------                                            |
|     $0$      | $\sqrt{1 + 0^2} + \sqrt{5 - 4 \times 0 + 0 ^ 2} = \sqrt{1 + 0} + \sqrt{5 - 0 + 0} = \sqrt{1} + \sqrt{5} = 3.24$                       |
|     $0.5$    | $\sqrt{1 + 0.5^2} + \sqrt{5 - 4 \times 0.5 + 0.5 ^ 2} = \sqrt{1 + 0.25} + \sqrt{5 - 2 + 0.25} = \sqrt{1.25} + \sqrt{3.25} = 2.92$     |
|     $1$      | $\sqrt{1 + 1^2} + \sqrt{5 - 4 \times 1 + 1 ^ 2} = \sqrt{1 + 1} + \sqrt{5 - 4 + 1} = \sqrt{2} + \sqrt{2} = 2.83$                       |
|     $1.5$    | $\sqrt{1 + 1.5^2} + \sqrt{5 - 4 \times 1.5 + 1.5 ^ 2} = \sqrt{1 + 2.25} + \sqrt{5 - 6 + 2.25} = \sqrt{3.25} + \sqrt{1.25} = 2.92$     |
|     $2$      | $\sqrt{1 + 2^2} + \sqrt{5 - 4 \times 2 + 2 ^ 2} = \sqrt{1 + 4} + \sqrt{5 - 8 + 4} = \sqrt{5} + \sqrt{1} = 3.24$                       |
|     $2.5$    | $\sqrt{1 + 2.5^2} + \sqrt{5 - 4 \times 2.5 + 2.5 ^ 2} = \sqrt{1 + 6.25} + \sqrt{5 - 10 + 6.25} = \sqrt{7.25} + \sqrt{1.25} = 3.81$    |
|     $3$      | $\sqrt{1 + 3^2} + \sqrt{5 - 4 \times 3 + 3 ^ 2} = \sqrt{1 + 9} + \sqrt{5 - 12 + 9} = \sqrt{10} + \sqrt{2} = 4.58$                     |
|     $3.5$    | $\sqrt{1 + 3.5^2} + \sqrt{5 - 4 \times 3.5 + 3.5 ^ 2} = \sqrt{1 + 12.25} + \sqrt{5 - 14 + 12.25} = \sqrt{13.35} + \sqrt{3.25} = 5.46$ |
|     $4$      | $\sqrt{1 + 4^2} + \sqrt{5 - 4 \times 4 + 0 ^ 2} = \sqrt{1 + 16} + \sqrt{5 - 16 + 16} = \sqrt{17} + \sqrt{5} = 6.36$                   |

</div>
</div>
<div class='answers'>
<div class='answer'>

| Value of $x$ | Value of $y$  |
|--------------|---------------|
|     $0$      | $3.24$        |
|     $0.5$    | $2.92$        |
|     $1$      | $2.83$        |
|     $1.5$    | $2.92$        |
|     $2$      | $3.24$        |
|     $2.5$    | $3.81$        |
|     $3$      | $4.58$        |
|     $3.5$    | $5.46$        |
|     $4$      | $6.36$        |

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Using your values in (a) and choosing a sensible scale, plot a graph of $y$ against $x$ .

</div>
<div class='workings'>
<div class='working'>

*ABBR: TODO:: Add drawing starts.*

![missing image](/papers/missing_image.svg)



Plot the values of $x$ and $y$ on the graph


*ABBR: TODO:: Add drawing ends.*


</div>
</div>
<div class='answers'>
<div class='answer'>

%empty%

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Read-off from your graph the shortest distance from A to B .

</div>
<div class='workings'>
<div class='working'>

$2.83$

</div>
</div>
<div class='answers'>
<div class='answer'>

$2.83$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

For what value of $x$ is the $y$ - value twice the shortest distance from A to B ?

</div>
<div class='workings'>
<div class='working'>

$3.5$

</div>
</div>
<div class='answers'>
<div class='answer'>

$3.5$

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

Study the pattern of numbers in the table below carefully. Column B gives the mean (average) of the numbers listed in Column A.

|               |   **A**       | **B**     |
|-----------    |:---------:    |:-----:    |
| **Row 1**     |    $2$        |  $2$      |
| **Row 2**     |   $4,6$       |  $5$      |
| **Row 3**     | $8,10,12$     |  $10$     |
| **Row 4**     |               |           |
| **Row 5**     |               |           |
|               |               |           |
| **Row n**     |               |           |

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

Write down the entries in Columns A and B for Row 4 and Row 5

</div>
<div class='workings'>
<div class='working'>

|               |   **A**                | **B**                                                         |
|-----------    |:---------:             |:-----:                                                        |
| **Row 4**     | $14, 16, 18, 20$       | $\dfrac {14 + 16 + 18 + 20} {4} = \dfrac {68} {4} = 17$       |
| **Row 5**     | $22, 24, 26, 28, 30$   | $\dfrac {22 + 24 + 26 + 28 + 30} {5} = \dfrac {130} {5} = 26$ |

</div>
</div>
<div class='answers'>
<div class='answer'>

|               |   **A**               | **B**     |
|-----------    |:---------:            |:-----:    |
| **Row 4**     | $14, 16, 18, 20$      | $17$      |
| **Row 5**     | $22, 24, 26, 28, 30$  | $26$      |

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

For Row $n$ , find formulae in terms of $n$ for :

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
<ul class='subsubquestion lower-roman'>
<li>
<div class='question_envelope rag_not_found rag_not_found subsubquestion'>
<div class='question subsubquestion'>

The number of terms in Column A;

</div>
<div class='workings'>
<div class='working'>

$\text{Number of terms in Column A}  = n$

</div>
</div>
<div class='answers'>
<div class='answer'>

Number of terms in Column A $= n$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subsubquestion'>
<div class='question subsubquestion'>

The entry in Column B;

</div>
<div class='workings'>
<div class='working'>

$\text{Entry in Column B}  = n ^ 2 + 1$

</div>
</div>
<div class='answers'>
<div class='answer'>

Entry in Column B $= n ^ 2 + 1$

</div>
</div>

</div>
</li>
</ul>
</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

If the numbers in Column A start with $4424$ and end with $4556$, what is the entry in Column B?

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
\text{Number of terms}          &= \dfrac {4556 - 4424} {2} \\\\
                                &= \dfrac {132} {2} \\\\
                                &= \dfrac {2 \times 66} {2} \\\\
                                &= \dfrac {\cancel 2 \times 66} {\cancel 2} \\\\
                                &= 66 \\\\
\text{Entry in Column B}        &= 66 ^ 2 + 1 \\\\
                                &= 4356 + 1 \\\\
                                &= 4357
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$4357$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

If the entry in Column B is $9410$, what is the smallest number listed in Column A?

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
\text{Number of terms}      &= \sqrt{9410 - 1} \\\\
                            &= \sqrt{9409} \\\\
                            &= 97 \\\\
\text{Smallest term}        &= 9410 - 2 \times \left( \dfrac {97 - 1} {2} - 1 \right) \\\\
                            &= 9410 - 2 \times \left( \dfrac {96} {2} - 1 \right) \\\\
                            &= 9410 - 2 \times \left( \dfrac {2 \times 48} {2} - 1 \right) \\\\
                            &= 9410 - 2 \times \left( \dfrac {\cancel 2 \times 48} {\cancel 2} - 1 \right) \\\\
                            &= 9410 - 2 \times ( 48 - 1 ) \\\\
                            &= 9410 - 2 \times 47 \\\\
                            &= 9410 - 94 \\\\
                            &= 9316
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$9316$

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

Here is a numbers game. There are two numbers which are first added together and then multiplied together. Fill in the gaps in the table (the first row is done for you).
$\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:$

| First Number     | Second Number     | Numbers Added  Together     | Number Multiplied Together     |
|:------------:    |---------------    |:-----------------------:    |:--------------------------:    |
|      $4$         |      $7$          |           $11$              |            $28$                |
|      $5$         |      $12$         |                             |                                |
|      $9$         |                   |           $16$              |                                |
|                  |      $20$         |                             |           $1000$               |
|                  |                   |           $18$              |            $45$                |
|                  |                   |           $20$              |            $96$                |

</div>
<div class='workings'>
<div class='working'>

Let's complete the table.

| First Number                                    | Second Number                       | Numbers Added  Together               | Number Multiplied Together              |
|:------------:                                   |---------------                      |:-----------------------:              |:--------------------------:             |
|      $4$                                        |      $7$                            |           $11$                        |            $28$                         |
|      $5$                                        |      $12$                           | $12 + 5 = 17 \ \maroonC{\footnotesize{(1)}}$    | $5 \times 12 = 60 \ \maroonC{\footnotesize{(2)}}$ |
|      $9$                                        | $16 - 9 = 7 \ \maroonC{\footnotesize{(3)}}$   |           $16$                        | $9 \times 7 = 63 \ \maroonC{\footnotesize{(4)}}$  |
| $\dfrac {1000} {20} = 500 \ \maroonC{\footnotesize{(5)}}$ |      $20$                           | $500 + 20 = 520 \ \maroonC{\footnotesize{(6)}}$ |           $1000$                        |
| $15 \ \maroonC{\footnotesize{(7)}}$                       | $18 - 15 = 3 \ \maroonC{\footnotesize{(8)}}$  |           $18$                        |            $45$                         |
| $12 \ \maroonC{\footnotesize{(9)}}$                       | $20 - 12 = 8 \ \maroonC{\footnotesize{(10)}}$ |           $20$                        |            $96$                         |

</div>
</div>
<div class='answers'>
<div class='answer'>

| First Number     | Second Number     | Numbers Added  Together     | Number Multiplied Together     |
|:------------:    |---------------    |:-----------------------:    |:--------------------------:    |
|      $4$         |      $7$          |           $11$              |            $28$                |
|      $5$         |     $12$          |           $17$              |            $60$                |
|      $9$         |      $7$          |           $16$              |            $63$                |
|      $500$       |     $20$          |          $520$              |           $1000$               |
|      $15$        |      $3$          |           $18$              |            $45$                |
|      $12$        |      $8$          |           $20$              |            $96$                |

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcr question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

The favourite sports of a group of 100 boys are shown in the table below. Calculate the missing number and draw a bar chart or a pie chart to illustrate this information.
$\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:\:$

| Cricket     | 15     |
|:-------:    |:--:    |
|  Rugby      | 25     |
|  Soccer     |        |
|  Other      | 10     |

</div>
<div class='workings'>
<div class='working'>

Let's complete the table.

| Cricket     | $15$                      |
|:-------:    |:--:                       |
|  Rugby      | $25$                      |
|  Soccer     | $100 - 15 - 25 - 10 = 60$ |
|  Other      | $10$                      |

*ABBR: TODO:: Add drawing starts.*

![missing image](/papers/missing_image.svg)



Plot the information about different sports in the graph


*ABBR: TODO:: Add drawing ends.*


</div>
</div>
<div class='answers'>
<div class='answer'>

| Cricket     | $15$ |
|:-------:    |:--:  |
|  Rugby      | $25$ |
|  Soccer     | $60$ |
|  Other      | $10$ |

</div>
</div>

</div>
</li>
</ul>
