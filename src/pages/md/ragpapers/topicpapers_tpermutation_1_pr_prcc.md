---
slug: "ragpapers/topicpapers-tpermutation-1-pr-prcc"
title: "TopicPaper - Permutation - 1 - PR - PRCC"
date: 2022-10-04 10:03:20
questions_count: "4"
---
<ul class='question default-decimal'>
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
</ul>
