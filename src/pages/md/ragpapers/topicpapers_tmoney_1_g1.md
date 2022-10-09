---
slug: "ragpapers/topicpapers-tmoney-1-g1"
title: "TopicPaper - Money - 1 - G1"
date: 2022-10-09 21:18:43
questions_count: "1"
---
<ul class='question default-decimal'>
<li>
<div class='question_envelope rag_g1 rag_prns question'>
<div class='uuid'>
<p>3535C8D5-DE86-4450-A6FD-9386A9F13C8D</p>
</div>
<div class='papername'>
<p>aldenham-school--11-plus--maths--9999--sample-paper-4:1:28</p>
</div>
<div class='rag'>
<p>Waffles Woof</p>
</div>
<div class='rag'>
<p>rag_wf_g1</p>
</div>
<div class='rag'>
<p>rag_wf_prns</p>
</div>
<div class='topics'>
<ul>
<li>
tmoney
</li>
</ul>
</div>
<!-- - if !options[:questions_only] -->
<!-- = render :reviewsubtag, question: question -->
<div class='question question'>

Have a look at the deals ticket vendors are offering: 

Each ticket cost $\pounds 480$. 

|     Offers    |                                     |
|:-------------:|:-----------------------------------:|
| Super Tickets |         Buy $2$ get $1$ free        |
|  Tickets R US | Buy $3$ get $25 \%$ off total price |
| Ticket Galore |    Buy $1$ get $2$ at $40 \%$ off   |
|   Top Ticket  |      Buy $2$ get $1$ half price     |

![aldenham-school--11-plus--maths--9999--sample-paper-4/section-1-question-28-00.png](/assets/aldenham-school--11-plus--maths--9999--sample-paper-4/section-1-question-28-00.png "aldenham-school--11-plus--maths--9999--sample-paper-4/section-1-question-28-00.png")

If I needed $3$ tickets, put the vendors in order (cheapest first).

</div>
<div class='workings'>
<div class='working'>

Let's calculate the best price of $3$ tickets from each vendor.

**Super Tickets**

$
\begin  {aligned}
\text{Cost of } 3 \text{ tickets}     &= 480 \times 2 \\\\
                                      &= \pounds 960
\end {aligned}
$

**Tickets R US**

If the total price is reduced by $25 \%$, then the sale price will be $100 - 25 = 75 \%$ of the original price. Using that, we get

$
\begin {aligned}
\text {Cost of} \ 3 \ \text{tickets}       &= 75\% \times 480 \times 3 \\\\
                                           &= \dfrac{75}{100} \times 480 \times 3 \\\\
                                           &= \dfrac{75 \times 480 \times 3}{100} \\\\
                                           &= \dfrac{25 \times 3 \times 4 \times 120 \times 3}{25 \times 4} \\\\
                                           &= \dfrac{\cancel{25} \times 3 \times \cancel{4} \times 120 \times 3}{\cancel{25} \times \cancel{4}} \\\\
                                           &= 3 \times 120 \times 3 \\\\
                                           &= \pounds 1080
\end {aligned}
$

**Ticket Galore**

If the price is reduced by $40 \%$, then the sale price will be $100 - 40 = 60 \%$ of the original price. Using that, we get

$
\begin {aligned}
\text {Cost of} \ 3 \ \text{tickets}      &= 480 + 60\% \times 480 \times 2 \\\\
                                          &= 480 + \dfrac{60}{100} \times 480 \times 2 \\\\
                                          &= 480 + \dfrac{60 \times 480 \times 2}{100} \\\\
                                          &= 480 + \dfrac{6\cancel{0} \times 48\cancel{0} \times 2}{1\cancel{0}\cancel{0}} \\\\
                                          &= 480 + 6 \times 48 \times 2 \\\\
                                          &= 480 + 576 \\\\
                                          &= \pounds 1056
\end {aligned}
$


**Top Ticket**

If the price is reduced by $\dfrac{1}{2}$, then the sale price will be $1 - \dfrac{1}{2} = \dfrac{1}{2}$ of the original price. Using that, we get

$
\begin {aligned}
\text{Cost of} \ 3 \ \text{tickets}      &= 480 \times 2 + \dfrac{1}{2} \times 480 \\\\
                                         &= 960 + \dfrac{480}{2} \\\\
                                         &= 960 + \dfrac{240 \times 2}{2} \\\\
                                         &= 960 + \dfrac{240 \times \cancel{2}}{\cancel{2}} \\\\
                                         &= 960 + 240 \\\\
                                         &= \pounds 1200
\end {aligned}
$

Using the calculation above, the vendors in order (cheapest first):

|  Vendor       | Price          |
|:-------------:|:--------------:|
| Super Tickets | $\pounds 960$  |
| Ticket Galore | $\pounds 1056$ |
| Tickets R US  | $\pounds 1080$ |
| Top Ticket    | $\pounds 1200$ |

</div>
</div>
<div class='answers'>
<div class='answer'>

$\text {Super Tickets}, \text {Ticket Galore}, \text {Tickets R US}, \text {Top Ticket}$

</div>
</div>
<div class='workingscodeblock'>
<div class='workingcodeblock'>

<pre class='language-latex'><code class='language-latex'>Let's calculate the best price of $3$ tickets from each vendor.
<emptyline>
**Super Tickets**
<emptyline>
$
\begin  {aligned}
\text{Cost of } 3 \text{ tickets}     &= 480 \times 2 \\\\
                                      &= \pounds 960
\end {aligned}
$
<emptyline>
**Tickets R US**
<emptyline>
If the total price is reduced by $25 \%$, then the sale price will be $100 - 25 = 75 \%$ of the original price. Using that, we get
<emptyline>
$
\begin {aligned}
\text {Cost of} \ 3 \ \text{tickets}       &= 75\% \times 480 \times 3 \\\\
                                           &= \dfrac{75}{100} \times 480 \times 3 \\\\
                                           &= \dfrac{75 \times 480 \times 3}{100} \\\\
                                           &= \dfrac{25 \times 3 \times 4 \times 120 \times 3}{25 \times 4} \\\\
                                           &= \dfrac{\cancel{25} \times 3 \times \cancel{4} \times 120 \times 3}{\cancel{25} \times \cancel{4}} \\\\
                                           &= 3 \times 120 \times 3 \\\\
                                           &= \pounds 1080
\end {aligned}
$
<emptyline>
**Ticket Galore**
<emptyline>
If the price is reduced by $40 \%$, then the sale price will be $100 - 40 = 60 \%$ of the original price. Using that, we get
<emptyline>
$
\begin {aligned}
\text {Cost of} \ 3 \ \text{tickets}      &= 480 + 60\% \times 480 \times 2 \\\\
                                          &= 480 + \dfrac{60}{100} \times 480 \times 2 \\\\
                                          &= 480 + \dfrac{60 \times 480 \times 2}{100} \\\\
                                          &= 480 + \dfrac{6\cancel{0} \times 48\cancel{0} \times 2}{1\cancel{0}\cancel{0}} \\\\
                                          &= 480 + 6 \times 48 \times 2 \\\\
                                          &= 480 + 576 \\\\
                                          &= \pounds 1056
\end {aligned}
$
<emptyline>

**Top Ticket**
<emptyline>
If the price is reduced by $\dfrac{1}{2}$, then the sale price will be $1 - \dfrac{1}{2} = \dfrac{1}{2}$ of the original price. Using that, we get
<emptyline>
$
\begin {aligned}
\text{Cost of} \ 3 \ \text{tickets}      &= 480 \times 2 + \dfrac{1}{2} \times 480 \\\\
                                         &= 960 + \dfrac{480}{2} \\\\
                                         &= 960 + \dfrac{240 \times 2}{2} \\\\
                                         &= 960 + \dfrac{240 \times \cancel{2}}{\cancel{2}} \\\\
                                         &= 960 + 240 \\\\
                                         &= \pounds 1200
\end {aligned}
$
<emptyline>
Using the calculation above, the vendors in order (cheapest first):
<emptyline>
|  Vendor       | Price          |
|:-------------:|:--------------:|
| Super Tickets | $\pounds 960$  |
| Ticket Galore | $\pounds 1056$ |
| Tickets R US  | $\pounds 1080$ |
| Top Ticket    | $\pounds 1200$ |
</code></pre>
</div>
</div>
<div class='answers'>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>%empty%</code></pre>
</div>
<div class='answercodeblock'>
<pre class='language-latex'><code class='language-latex'>$\text {Super Tickets}, \text {Ticket Galore}, \text {Tickets R US}, \text {Top Ticket}$
</code></pre>
</div>
</div>


<div class='review'>
<ul class='review'>
<li class='review'>
<button class='review rag_prcc' data-rag='PRCC' data-review-type='REVIEW_ANSWER' data-reviewer='ap' data-sheet='G1' data-uuid='3535C8D5-DE86-4450-A6FD-9386A9F13C8D' onclick='submitReview(event)'>PRCC</button>
</li>
<li class='review'>
<button class='review rag_prcc' data-rag='PRPCC' data-review-type='REVIEW_ANSWER' data-reviewer='ap' data-sheet='G1' data-uuid='3535C8D5-DE86-4450-A6FD-9386A9F13C8D' onclick='submitReview(event)'>PRPCC</button>
</li>
<li class='review'>
<button class='review rag_prg' data-rag='PRG' data-review-type='REVIEW_ANSWER' data-reviewer='ap' data-sheet='G1' data-uuid='3535C8D5-DE86-4450-A6FD-9386A9F13C8D' onclick='submitReview(event)'>PRG</button>
</li>
<li class='review'>
<button class='review rag_prg2' data-rag='PRG2' data-review-type='REVIEW_ANSWER' data-reviewer='ap' data-sheet='G1' data-uuid='3535C8D5-DE86-4450-A6FD-9386A9F13C8D' onclick='submitReview(event)'>PRG2</button>
</li>
<li class='review'>
<button class='review rag_prcr' data-rag='PRCR' data-review-type='REVIEW_ANSWER' data-reviewer='ap' data-sheet='G1' data-uuid='3535C8D5-DE86-4450-A6FD-9386A9F13C8D' onclick='submitReview(event)'>PRCR</button>
</li>
<li class='review'>
<button class='review rag_prpcr' data-rag='PRPCR' data-review-type='REVIEW_ANSWER' data-reviewer='ap' data-sheet='G1' data-uuid='3535C8D5-DE86-4450-A6FD-9386A9F13C8D' onclick='submitReview(event)'>PRPCR</button>
</li>
<li class='review'>
<button class='review rag_prrl' data-rag='PRRL' data-review-type='REVIEW_ANSWER' data-reviewer='ap' data-sheet='G1' data-uuid='3535C8D5-DE86-4450-A6FD-9386A9F13C8D' onclick='submitReview(event)'>PRRL</button>
</li>
<li class='review'>
<button class='review rag_prr' data-rag='PRR' data-review-type='REVIEW_ANSWER' data-reviewer='ap' data-sheet='G1' data-uuid='3535C8D5-DE86-4450-A6FD-9386A9F13C8D' onclick='submitReview(event)'>PRR</button>
</li>
<li class='review'>
<button class='review rag_prbd' data-rag='PRBD' data-review-type='REVIEW_ANSWER' data-reviewer='ap' data-sheet='G1' data-uuid='3535C8D5-DE86-4450-A6FD-9386A9F13C8D' onclick='submitReview(event)'>PRBD</button>
</li>
<li class='review'>
<button class='review rag_prct' data-rag='PRCT' data-review-type='REVIEW_ANSWER' data-reviewer='ap' data-sheet='G1' data-uuid='3535C8D5-DE86-4450-A6FD-9386A9F13C8D' onclick='submitReview(event)'>PRCT</button>
</li>
<li class='review'>
<button class='review rag_prct' data-review-type='REVIEW_ANSWER' data-sheet='G1' data-uuid='3535C8D5-DE86-4450-A6FD-9386A9F13C8D' onclick='resetComment(event)'>Reset Comments</button>
</li>
</ul>

<form class='review' data-review-type='REVIEW_ANSWER' data-reviewer='ap' data-sheet='G1' data-uuid='3535C8D5-DE86-4450-A6FD-9386A9F13C8D' id='FORM-3535C8D5-DE86-4450-A6FD-9386A9F13C8D' onsubmit='submitComment(event)'>
<textarea cols='30' name='comment' placeholder='Enter review comments ...' required rows='10'></textarea>
<br>
<input type='submit' value='Submit'>
<input type='reset' value='Reset'>
</form>

<p class='review_status initial' id='REVIEW-STATUS-3535C8D5-DE86-4450-A6FD-9386A9F13C8D'>Initial</p>
</div>
</div>
</li>
</ul>
