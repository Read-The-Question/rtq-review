const removeSubTag = (event) => {
    // console.log(`Submit review for: UUID: ${uuid}, sheet: ${sheet}, Review RAG: ${rag}`)
    // alert(`Submit review for: UUID: ${uuid}, sheet: ${sheet}, Review RAG: ${rag}`);
    const btn = event.currentTarget;

    const uuid = btn.dataset.uuid;
    const subtag = btn.dataset.subtag;

    const body = {uuid, subtag};
    console.log(body);

    // const url = 'http://localhost:5000/removesubtag';
    const url = 'https://read-the-question-20220609.herokuapp.com/removesubtag';

    submitAsyncRequest(uuid, body, url, 'SUBTAG');
}

const addSubTag = (event) => {
    // console.log(`Submit review for: UUID: ${uuid}, sheet: ${sheet}, Review RAG: ${rag}`)
    // alert(`Submit review for: UUID: ${uuid}, sheet: ${sheet}, Review RAG: ${rag}`);
    const btn = event.currentTarget;

    const uuid = btn.dataset.uuid;
    const subtag = btn.dataset.subtag;

    const body = {uuid, subtag};
    console.log(body);

    // const url = 'http://localhost:5000/addsubtag';
    const url = 'https://read-the-question-20220609.herokuapp.com/addsubtag';

    submitAsyncRequest(uuid, body, url, 'SUBTAG');
}

const submitReview = (event) => {
    // console.log(`Submit review for: UUID: ${uuid}, sheet: ${sheet}, Review RAG: ${rag}`)
    // alert(`Submit review for: UUID: ${uuid}, sheet: ${sheet}, Review RAG: ${rag}`);
    const btn = event.currentTarget;

    const uuid = btn.dataset.uuid;
    const sheet = btn.dataset.sheet;
    const rag = btn.dataset.rag;
    const reviewType = btn.dataset.reviewType;
    const reviewer = btn.dataset.reviewer;

    const body = {uuid, sheet, rag, reviewer};
    console.log(body);
    // console.log(reviewType);
    // console.log(btn.dataset);

    // const answer_url = 'http://localhost:5000/rag';
    const answer_url = 'https://read-the-question-20220609.herokuapp.com/rag';
    const question_url = 'https://read-the-question-20220609.herokuapp.com/questionrag';

    if (reviewType == "REVIEW_QUESTION") {
        submitAsyncRequest(uuid, body, question_url, 'REVIEW');
    } else {
        submitAsyncRequest(uuid, body, answer_url, 'REVIEW');
    }
}

const submitComment = (event) => {
    event.preventDefault();
    // console.log(`Submit review for: UUID: ${uuid}, sheet: ${sheet}, Review RAG: ${rag}`)
    // alert(`Submit review for: UUID: ${uuid}, sheet: ${sheet}, Review RAG: ${rag}`);
    // alert("Submit comment");
    // console.log(event);

    const form = event.currentTarget;

    const formObj = Object.fromEntries(new FormData(form));
    const comment = formObj.comment;
    const uuid = form.dataset.uuid;
    const sheet = form.dataset.sheet;
    const reviewType = form.dataset.reviewType;
    const reviewer = form.dataset.reviewer;

    const body = {uuid, sheet, comment, reviewer};
    console.log(body);

    const url = 'http://localhost:5000/comments';
    const answer_url = 'https://read-the-question-20220609.herokuapp.com/comments';
    const question_url = 'https://read-the-question-20220609.herokuapp.com/questioncomments';

    if (reviewType == "REVIEW_QUESTION") {
        submitAsyncRequest(uuid, body, question_url, 'REVIEW');
    } else {
        submitAsyncRequest(uuid, body, answer_url, 'REVIEW');
    }

}

const resetComment = (event) => {
    event.preventDefault();
    // console.log(`Submit review for: UUID: ${uuid}, sheet: ${sheet}, Review RAG: ${rag}`)
    // alert(`Submit review for: UUID: ${uuid}, sheet: ${sheet}, Review RAG: ${rag}`);
    // alert("Submit comment");
    // console.log(event);

    const btn = event.currentTarget;

    const uuid = btn.dataset.uuid;
    const sheet = btn.dataset.sheet;
    const reviewType = btn.dataset.reviewType;

    const body = {uuid, sheet};
    console.log(body);

    // const url = 'http://localhost:5000/comments';
    const answer_url = 'https://read-the-question-20220609.herokuapp.com/resetanswercomments';
    const question_url = 'https://read-the-question-20220609.herokuapp.com/resetquestioncomments';

    if (reviewType == "REVIEW_QUESTION") {
        submitAsyncRequest(uuid, body, question_url, 'REVIEW');
    } else {
        submitAsyncRequest(uuid, body, answer_url, 'REVIEW');
    }

}

async function submitAsyncRequest(uuid, body, url, reviewPrefix) {
    const review_status = document.getElementById(`${reviewPrefix}-STATUS-${uuid}`);

    setStatusWithTimeout(review_status, "Submitting. Please wait ...", "loading", 0);

    try {
        const response = await fetch(
            url,
            {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
    
        if (!response.ok) {
            const body = await response.json();
            console.log(`HTTP success! ${body}`);
    
            setStatusWithTimeout(review_status, `Error: ${body.reason}`, "error", 3000);
            // alert(`HTTP error! status: ${response.status}`);
        } else {
            // alert(`HTTP success! status: ${response.status}`);
            setStatusWithTimeout(review_status, "Success", "success", 3000);
        }
    } catch(e) {
        console.error(e);
        setStatusWithTimeout(review_status, `Error: ${e.message}`, "error", 3000);
    }
}

const setStatusWithTimeout = (element, startState, statusClassName, timer) => {
    element.innerText = startState;

    element.classList.remove('error', 'initial', 'success', 'loading');
    element.classList.add(statusClassName);

    if (timer > 0) {
        setTimeout(() => {
            element.classList.remove('error', 'initial', 'success', 'loading');
            element.classList.add('initial');
            element.innerText = "Initial";
        }, timer);
    }
}

