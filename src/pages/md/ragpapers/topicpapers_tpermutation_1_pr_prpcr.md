---
slug: "ragpapers/topicpapers-tpermutation-1-pr-prpcr"
title: "TopicPaper - Permutation - 1 - PR - PRPCR"
date: 2022-10-04 10:03:20
questions_count: "2"
---
<ul class='question default-decimal'>
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
</ul>
