---
slug: "ragpapers/topicpapers-talgebra-16-red"
title: "TopicPaper - Algebra - 16 - RED"
date: 2022-09-24 04:59:20
questions_count: "1"
---
<ul class='question default-decimal'>
<li>
<div class='question_envelope rag_red rag_prr question'>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Alison has a large number of coloured pencils. 

When the pencils are divided between two of her friends there is one pencil left over. 

If they are divided between three friends there are two left over. 

Between four friends there would be three left over. 

Between five friends there would be four left over and between six friends, five left over.  

What is the smallest number of coloured pencils that Alison could have?

</div>
<div class='workings'>
<div class='working'>


Let's take the total number of pencils as $x$
and the leftover pencils as $y$

As per the question,

$
\begin{aligned}
x \div 2 \text{ \ friends} &= 1 \text{\ pencil is remainder}\\
x \div 3 \text{ \ friends} &= 2 \text{\ pencil is remainder}\\
x \div 4 \text{ \ friends} &= 3 \text{\ pencil is remainder}\\
x \div 5 \text{ \ friends} &= 4 \text{\ pencil is remainder}\\
x \div 6 \text{ \ friends} &= 5 \text{\ pencil is remainder}\\
\end{aligned}
$

If a number is divided by $2$ and has a remainder of $1$ then it is an odd numbers

Also known is if a number is divided by $5$ then it will have $0$ or $5$ at its units place. The

As per the question, when Alison divides her pencils between $5$ friends she is left with $4$ as remainder.
i.e., The number being looked for will have either $4$ or $9$ $(4 + 0) \text{or} \ (5 + 4)$ at the unit place:

As $4$ is not an odd number, it can be ruled out

So it can be derived that the total number of pencils has $9$ at its units place.

Let's solve further using trial and error, 

The options are: 9, 19, 29, 39, 49, 59, 69,....

Leave out division by $5$ as all the options will give a remainder $4$. 

Let's take 
Quotient  = Q
Remainder = R

$9$ (too small)(ruled out)

$19 \div 6 = Q \  3 \ R \ 1$ (as per question R is $5$)  (ruled out)

$29 \div 6 = Q \  4 \ R \ 5$ (right)

$29 \div 4 = Q \  7 \ R \ 1$ (as per question R is 3) (ruled out)

$39 \div 3 = Q \ 13$ (as per question R is 2) (ruled out)

$49 \div 6 = Q \  8 \ R \ 1$ (as per question R is 5)  (ruled out)

$59 \div 6 = Q \  9 \ R \ 4$

$59 \div 5 = Q \ 11 \ R \ 4$

$59 \div 4 = Q \ 14 \ R \ 3$

$59 \div 3 = Q \ 19 \ R \ 2$

$59 \div 2 = Q \ 19 \ R \ 1$

The total numbers of pencils are $59$


</div>
</div>
<div class='answers'>
<div class='answer'>

$59$

</div>
</div>

</div>
</li>
</ul>
