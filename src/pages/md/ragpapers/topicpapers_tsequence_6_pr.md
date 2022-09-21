---
slug: "ragpapers/topicpapers-tsequence-6-pr"
title: "TopicPaper - Sequence - 6 - PR"
date: 2022-09-21 20:40:31
questions_count: "11"
---
<ul class='question default-decimal'>
<li>
<div class='question_envelope rag_pr rag_prpcc question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Write down the next two numbers in the sequence.

$5, 11, 23, 47, \boxed{\phantom{11}}, \boxed{\phantom{11}}$

</div>
<div class='workings'>
<div class='working'>

ABBR:  Let's find the relation between the consecutive terms of the sequence.


$
\begin{matrix}
&   \footnotesize {\maroonC
 {(+6)} }
&&  \footnotesize {\maroonC
 {(+ 6 \times 2)} }
&&  \footnotesize {\maroonC
 {(+ 6 \times 4)} }
&&  \footnotesize {\maroonC
 {(+ 6 \times 8)} }
&&  \footnotesize {\maroonC
 {(+ 6 \times 16)} }  \\
5,  &&   11,  &&  23,  &&   47, && \ldots, && \ldots
\end{matrix}
$

$
\begin{aligned}
\text{First number}          &= 47 + 6 \times 8 \\\\
                             &= 47 + 48 \\\\
                             &= 95 \\\\
\text{Second number}         &= 95 + 6 \times 16 \\\\
                             &= 95 + 96 \\\\
                             &= 191
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$95$

</div>
<div class='answer'>

$191$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcc question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

If the differences between each pair of consecutive terms of a sequence are taken, and then the differences in this new sequence are taken, and so on, the numbers may turn out to be the same.

$
\begin{aligned}
& \text{For example for the sequence:}   &&   1   &&  &&   4   &&   &&   9   && && 16 && && 25 \\
& \text{The first differences are:}      &&   &&  3   &&   &&  5    &&   &&7  && && 9          \\ 
& \text{And the second differences are:} &&   &&  &&  2    &&  &&   2 && && 2
\end{aligned}
$

As the second differences are the same, we say that the original sequence is a **sequence of order ** $\bold {2}$

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

Fill in the gaps for this sequence of order 2 

$
\begin{aligned}
3   &&  &&   \text{\textunderscore \textunderscore \textunderscore}   &&  &&   \text{\textunderscore \textunderscore \textunderscore}   && && \text{\textunderscore \textunderscore \textunderscore} && && \text{\textunderscore \textunderscore \textunderscore} \\
&&  1  &&  &&  \text{\textunderscore \textunderscore \textunderscore}    &&  && \text{\textunderscore \textunderscore \textunderscore}  && && \text{\textunderscore \textunderscore \textunderscore}          \\ 
&&  &&  5  &&  &&   5 && && 5
\end{aligned}
$

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
3   &&  &&   4   &&  &&   10   && && 21 && && 37 \\
&&  1  &&  &&  6    &&  && 11  && && 16          \\ 
&&  &&  5  &&  &&   5 && && 5
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$
\begin{aligned}
3   &&  &&   4   &&  &&   10   && && 21 && && 37 \\
&&  1  &&  &&  6    &&  && 11  && && 16          \\ 
&&  &&  5  &&  &&   5 && && 5
\end{aligned}
$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

Fill in the gaps for this sequence of order 3 

$
\begin{aligned}
\text{\textunderscore \textunderscore \textunderscore}   &&  &&  12  &&  &&    \text{\textunderscore \textunderscore \textunderscore}   && && \text{\textunderscore \textunderscore \textunderscore} && && \text{\textunderscore \textunderscore \textunderscore} \\
&&  \text{\textunderscore \textunderscore \textunderscore}  &&  &&  \text{\textunderscore \textunderscore \textunderscore}    &&  && \text{\textunderscore \textunderscore \textunderscore}  && && \text{\textunderscore \textunderscore \textunderscore}          \\ 
&&  &&  \text{\textunderscore \textunderscore \textunderscore}  &&  &&   7 && && \text{\textunderscore \textunderscore \textunderscore} \\
&& && &&  3  &&  &&  \text{\textunderscore \textunderscore \textunderscore} 
\end{aligned}
$

</div>
<div class='workings'>
<div class='working'>

$
\begin{aligned}
11   &&  &&  12  &&  && 17 && && 29 && && 51 \\
&& 1 && && 5 && && 12 && && 22 \\ 
&&  &&  4  &&  &&   7 && && 10 \\
&& && &&  3  &&  &&  3 
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$
\begin{aligned}
11   &&  &&  12  &&  && 17 && && 29 && && 51 \\
&& 1 && && 5 && && 12 && && 22 \\ 
&&  &&  4  &&  &&   7 && && 10 \\
&& && &&  3  &&  &&  3 
\end{aligned}
$

</div>
</div>

</div>
</li>
</ul>
</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcc question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

In the sequence of numbers $2, 3, 5, 8, 12, \ldots$, what is the first **three digit** number?

</div>
<div class='workings'>
<div class='working'>

ABBR:  Let's find the relation between the consecutive terms of the sequence.


$
\begin{matrix}
&   \footnotesize{\maroonC{(+1)}} 
&&  \footnotesize{\maroonC{(+2)}}  
&&  \footnotesize{\maroonC{(+3)}}   
&&  \footnotesize{\maroonC{(+4)}}  \\
2,  &&    3,  &&    5,  &&   8,  &&   12
\end{matrix}
$

The next few terms in the sequence would be:

$
\begin{matrix}
17, && 23,                            && 30, && 38, \\\\
47, && 57,                            && 68, && 80, \\\\
93, && \green{107},  && 122,&& 138
\end{matrix}
$

The first three digist number in the sequence will be $107$

</div>
</div>
<div class='answers'>
<div class='answer'>

$107$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcc question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

What is the missing number in the following sequence? 

$2.3, \quad 3.4, \quad 4.7, \quad 6.2, \quad \ldots, \quad 9.8$

</div>
<div class='workings'>
<div class='working'>

ABBR:  Let's find the relation between the consecutive terms of the sequence.


$
\begin{matrix}
&   \footnotesize {\maroonC {(+1.1)}} 
&&  \footnotesize {\maroonC {(+1.3)}}  
&&  \footnotesize {\maroonC {(+1.5)}}   
&&  \footnotesize {\maroonC {(+1.7)}}  
&&  \footnotesize {\maroonC {(+1.9)}} \\
2.3,  &&    3.4,  &&    4.7,  &&   6.2,  &&   \ldots,  &&   9.8
\end{matrix}
$

$
\begin{aligned}
\text{Missing number}   &= 6.2 + 1.7 \\\\
                        &= 7.9
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$7.9$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcc question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

What is the missing number in this list?

$101, \quad 86, \quad 74, \quad 65, \quad \ldots, \quad 56$

</div>
<div class='workings'>
<div class='working'>

ABBR:  Let's find the relation between the consecutive terms of the sequence.


$
\begin{matrix}
&   \footnotesize{\maroonC{(-15)}}
&&  \footnotesize{\maroonC{(-12)}}
&&  \footnotesize{\maroonC{(-9)}}
&&  \footnotesize{\maroonC{(-6)}}
&&  \footnotesize{\maroonC{(-3)}}  \\
101,  &&      86,  &&      74,   &&      65,  &&      \ldots,  &&      56
\end{matrix}
$

$
\begin{aligned}
\text{Missing number}   &= 65 - 6 \\\\
                        &= 59
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$59$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcc question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Here is a number sequence. Write in the missing number.

3   6   10   15   $\Box$

</div>
<div class='workings'>
<div class='working'>

ABBR:  Let's find the relation between the consecutive terms of the sequence.


$
\begin{matrix}
&   \footnotesize{\maroonC
{(+3)}}
&&  \footnotesize{\maroonC
{(+4)}}
&&  \footnotesize{\maroonC
{(+5)}}
&&  \footnotesize{\maroonC
{(+6)}}  \\
3,  &&    6,  &&  10,  &&   15, && \ldots
\end{matrix}
$

$
\begin{aligned}
\text{Missing number}           &= 15 + 6 \\\\
                                &= 21
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$21$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcc question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Brian starts with $1000$ and subtracts $11$ each time. The first four numbers in his sequence are:

1000, 989, 978, 967


If he continues in this way, what will be the first negative number in his sequence?

</div>
<div class='workings'>
<div class='working'>

ABBR:  Let's find the relation between the consecutive terms of the sequence.


$
\begin{matrix}
&   \footnotesize{\maroonC
{(1000-11 \times 1)}}  
&&  \footnotesize{\maroonC
{(1000-11 \times 2)}}    
&&  \footnotesize{\maroonC
{(1000-11 \times 3)}} \\
1000,  &&    989,  &&  978,  &&   967 \ldots
\end{matrix}
$

The next term is calculated by subtracting $11$ from the previous term.

This is an arithmetic sequence too and the difference between the consecutive patterns of the sequence is constant.

The next term is calculated by subtracting multiple of $11$ to the first term and the number of times it is added is based on the position in the sequence.


Let the first negative number in the sequence be $1000 - 11a$

$
\begin{aligned}
1000 - 11a              &< 0 \\\\
1000                    &< 11a \\\\
11a                     &> 1000 \\\\
a                       &> \dfrac{1000}{11} \\\\
a                       &> 90.90 \\\\
a                       &\approx 91 
\end{aligned}
$

The first negative number in the sequence = $1000 - 11a$

$
\begin{aligned}
\text{First negative number}    &= 1000 - 11 \times a \\\\
                                &= 1000 - 11 \times 91 \\\\
                                &= 1000 - 1001 \\\\
                                &= -1
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$-1$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcc question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

This sequence of numbers goes up by $30$ each time.

$30,\:\:\:\: 60,\:\:\:\: 90,\:\:\:\: 120,\:\:\:\: 150,\:\:\:\: …….$

The sequence continues.

Will the number $1330$ be in the sequence? 

Explain how you know:

</div>
<div class='workings'>
<div class='working'>

ABBR:  Let's find the relation between the consecutive terms of the sequence.


$
\begin{matrix}
&   \footnotesize {\maroonC
 {(+30)} }
&&  \footnotesize {\maroonC
 {(+30)} }
&&  \footnotesize {\maroonC
 {(+30)} }
&&  \footnotesize {\maroonC
 {(+30)} }
&&  \footnotesize {\maroonC
 {(+30)} }  \\
30,  &&    60,  &&  90,  &&   120,  &&  150,  && \ldots
\end{matrix}
$

The next term is calculated by adding $30$ to the previous term.

This is an arithmetic sequence too and the difference between the consecutive patterns of the sequence is constant.

The next term is calculated by adding multiple of $30$ to the first term and the number of times it is added is based on the position in the sequence.


Let the number of term $= n$

$
\begin{aligned}
30 + 30 \times (n - 1)  &= 1330 \\\\
30 + 30n - 30           &= 1330 \\\\
30n                     &= 1330 \\\\
n                       &= \dfrac {1330} {30} \\\\
n                       &= \dfrac {133 \cancel {0}} {3 \cancel {0}} \\\\
n                       &= \dfrac {133} {3} \\\\
n                       &= 44 \dfrac {1} {3}
\end{aligned}
$

$44 \dfrac {1} {3}$ is not a whole number.

Hence, the number $1330$ will not be in the sequence.

</div>
</div>
<div class='answers'>
<div class='answer'>

No

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcc question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Frank is making a sequence of numbers. The first number is $1$ and the third is $9$. Frank gets his sequence by multiplying the previous value by the same number each time. Write in the three missing numbers in the sequence shown.

$1$. ___________, $9$, ___________, ___________

</div>
<div class='workings'>
<div class='working'>

let the constant multiplier number $= r$

As per the question,

$
\begin{aligned}
1 \times r \times r             &= 9 \\\\
r^2                             &= 9 \\\\
r                               &= \sqrt {9} \\\\
r                               &= 3
\end{aligned}
$

$
\begin{matrix}
&   \footnotesize{\maroonC
{(\times 3)}}
&&  \footnotesize{\maroonC
{(\times 3)}}
&&  \footnotesize{\maroonC
{(\times 3)}}
&&  \footnotesize{\maroonC
{(\times 3)}} \\
1,  &&    1 \times 3,  &&  9,  &&   9 \times 3,  &&   9 \times 3 \times 3 \ldots
\end{matrix}
$

$
\begin{aligned}
\text{First missing number}     &= 1 \times r \\\\
                                &= 1 \times 3 \\\\
                                &= 3 \\\\
\text{Second missing number}    &= 9 \times r \\\\
                                &= 9 \times 3 \\\\
                                &= 27 \\\\
\text{Third missing number}     &= 9 \times r \times r \\\\
                                &= 9 \times 3 \times 3 \\\\
                                &= 9 \times 9 \\\\
                                &= 81
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$3$

</div>
<div class='answer'>

$27$

</div>
<div class='answer'>

$81$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prrl question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

| Pattern Number     |   Pattern     | Number of Blocks     |
|:--------------:    |-------------- |:----------------:    |
|       $1$          |               |        $1$           |
|       $2$          |               |        $4$           |
|       $3$          |               |      ......          |
|       $4$          |               |      .......         |


Fill in the total number of blocks in pattern numbers $3$ and $4$. Without drawing a diagram what is the total number of blocks on the $8^{th}$ pattern?

</div>
<div class='workings'>
<div class='working'>

| Pattern Number     |   Pattern           | Number of Blocks     |
|:--------------:    |-------------------  |:----------------:    |
|       $1$          |  $1$                |        $1$           |
|       $2$          |  $1 + 3 = 2^2$      |        $4$           |
|       $3$          |  $4 + 5 = 3^2$      |        $9$           |
|       $4$          |  $9 + 7 = 4^2$      |        $16$          |
|       $5$          |  $16 + 9 = 5^2$     |        $25$          |
|       $6$          |  $25 + 11 = 6^2$    |        $36$          |
|       $7$          |  $36 + 13 = 7^2$    |        $49$          |
|       $8$          |  $49 + 15 = 8^2$    |        $64$          |

Total number of blocks on the $8^{th}$ pattern $= 64$

</div>
</div>
<div class='answers'>
<div class='answer'>

$64$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_pr rag_prpcc question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Find the missing numbers in each of these sequences. 

Write your answers in the boxes provided.

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

$50\:\:\:42\:\:\:34\:\:\:\Box\:\:\:18$

</div>
<div class='workings'>
<div class='working'>

ABBR:  Let's find the relation between the consecutive terms of the sequence.


The next term is calculated by subtracting $8$ from the previous term. Hence, the sequence would be:

$
\begin{matrix}
&   \footnotesize{\maroonC
{(-8)}} 
&&  \footnotesize{\maroonC
{(-8)}}  
&&  \footnotesize{\maroonC
{(-8)}}   
&&  \footnotesize{\maroonC
{(-8)}} \\
50,  &&    42,  &&  34,  &&   \boxed{\\},  &&   18 \ldots
\end{matrix}
$

$
\begin{aligned}
\text{Missing number}   &= 34 - 8 \\\\
                        &= 26
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$26$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

$2.302\:\:\:2.304\:\:\:2.306\:\:\:2.308\:\:\:\Box$

</div>
<div class='workings'>
<div class='working'>

ABBR:  Let's find the relation between the consecutive terms of the sequence.


The next term is calculated by adding $0.002$ to the previous term. Hence, the sequence would be:

$
\begin{matrix}
&   \footnotesize{\maroonC
{(+0.002)}} 
&&  \footnotesize{\maroonC
{(+0.002)}}  
&&  \footnotesize{\maroonC
{(+0.002)}}
&&  \footnotesize{\maroonC
{(+0.002)}} \\
2.302,  &&    2.304,  &&  2.306,  &&   2.308 &&   \boxed{\\} \ldots
\end{matrix}
$

$
\begin{aligned}
\text{Missing number}   &= 2.308 + 0.002 \\\\
                        &= 2.31
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

$2.31$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

$4\:\:\:7\:\:\:13\:\:\:25\:\:\:49\:\:\:\Box$

</div>
<div class='workings'>
<div class='working'>

ABBR:  Let's find the relation between the consecutive terms of the sequence.


$
\begin{matrix}
&   \footnotesize{\maroonC
{+(3)}}
&&  \footnotesize{\maroonC
{+(3 \times 2)}}
&&  \footnotesize{\maroonC
{+(3 \times 4)}}
&&  \footnotesize{\maroonC
{+(3 \times 8)}}
&&  \footnotesize{\maroonC
{+(3 \times 16)}} \\
4,  &&    7,  &&  13,  &&   25,  &&   49 &&  \boxed{\\} \ldots
\end{matrix}
$

$
\begin{aligned}
\text{Missing number}   &= 49 + 3 \times 16 \\\\
                        &= 49 + 48 \\\\
                        &= 97
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

Missing number = $97$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

$100\:\:\:81\:\:\:64\:\:\:49\:\:\:36\:\:\:\Box$

</div>
<div class='workings'>
<div class='working'>

ABBR:  Let's find the relation between the consecutive terms of the sequence.


It is a sequence of square numbers

$
\begin{matrix}
   \footnotesize{\maroonC
{(10^2)}}
&&  \footnotesize{\maroonC
{(9^2)}}
&&  \footnotesize{\maroonC
{(8^2)}}
&&  \footnotesize{\maroonC
{(7^2)}}
&&  \footnotesize{\maroonC
{(6^2)}}
&&  \footnotesize{\maroonC
{(5^2)}} \\
100,  &&    81,  &&  64,  &&   49,  &&   36 &&  \boxed{\\} \ldots
\end{matrix}
$

$
\begin{aligned}
\text{Missing number}   &= 5^2 \\\\
                        &= 25
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

Missing number = $25$

</div>
</div>

</div>
</li>
<li>
<div class='question_envelope rag_not_found rag_not_found subquestion'>
<div class='question subquestion'>

$\Box\:\:\:3.5\:\:\:7\:\:\:14\:\:\:28$

</div>
<div class='workings'>
<div class='working'>

ABBR:  Let's find the relation between the consecutive terms of the sequence.


The next term is calculated by multiplying the previous term by $2$. Hence, the sequence would be:

$
\begin{matrix}
&   \footnotesize{\maroonC
{(\times 2)}}
&&  \footnotesize{\maroonC
{(\times 2)}}
&&  \footnotesize{\maroonC
{(\times 2)}}
&&  \footnotesize{\maroonC
{(\times 2)}} \\
\boxed{\\},  &&    3.5,  &&  7,  &&   14,  &&   28, && \ldots
\end{matrix}
$

$
\begin{aligned}
\text{Missing number}               &= \dfrac {3.5} {2} \\\\
                                    &= \dfrac {3.5 \times 10} {2 \times 10} \\\\
                                    &= \dfrac {35} {20} \\\\
                                    &= \dfrac {35 \times 5} {20 \times 5} \\\\
                                    &= \dfrac {175} {100} \\\\
                                    &= 1.75
\end{aligned}
$

</div>
</div>
<div class='answers'>
<div class='answer'>

Missing number = $1.75$

</div>
</div>

</div>
</li>
</ul>
</div>
</li>
</ul>
