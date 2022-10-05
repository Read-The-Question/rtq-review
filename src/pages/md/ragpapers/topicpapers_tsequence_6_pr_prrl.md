---
slug: "ragpapers/topicpapers-tsequence-6-pr-prrl"
title: "TopicPaper - Sequence - 6 - PR - PRRL"
date: 2022-10-04 10:03:20
questions_count: "4"
---
<ul class='question default-decimal'>
<li>
<div class='question_envelope rag_pr rag_prrl question'>
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
<div class='question_envelope rag_pr rag_prrl question'>
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
&   \footnotesize{\maroonC{(1000-11 \times 1)}}  
&&  \footnotesize{\maroonC{(1000-11 \times 2)}}    
&&  \footnotesize{\maroonC{(1000-11 \times 3)}} \\
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
<div class='question_envelope rag_pr rag_prrl question'>
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
&   \footnotesize {\maroonC {(+30)} }
&&  \footnotesize {\maroonC {(+30)} }
&&  \footnotesize {\maroonC {(+30)} }
&&  \footnotesize {\maroonC {(+30)} }
&&  \footnotesize {\maroonC {(+30)} }  \\
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
</ul>
