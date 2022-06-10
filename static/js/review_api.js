const submitReview = (event) => {
    // console.log(`Submit review for: UUID: ${uuid}, sheet: ${sheet}, Review RAG: ${rag}`)
    // alert(`Submit review for: UUID: ${uuid}, sheet: ${sheet}, Review RAG: ${rag}`);
    const btn = event.currentTarget;

    const uuid = btn.dataset.uuid;
    const sheet = btn.dataset.sheet;
    const rag = btn.dataset.rag;

    const body = {uuid, sheet, rag};
    console.log(body);

    // const url = 'http://localhost:5000/rag';
    const url = 'https://read-the-question-20220609.herokuapp.com/rag';

    submitAsyncRequest(uuid, body, url);
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

    const body = {uuid, sheet, comment};
    console.log(body);

    // const url = 'http://localhost:5000/comments';
    const url = 'https://read-the-question-20220609.herokuapp.com/comments';

    submitAsyncRequest(uuid, body, url);
}

async function submitAsyncRequest(uuid, body, url) {
    const review_status = document.getElementById(`REVIEW-STATUS-${uuid}`);

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

// const submitReviewOld = (uuid, sheet, rag) => {
//     // console.log(`Submit review for: UUID: ${uuid}, sheet: ${sheet}, Review RAG: ${rag}`)
//     // alert(`Submit review for: UUID: ${uuid}, sheet: ${sheet}, Review RAG: ${rag}`);

//     const body = {uuid, sheet, rag};
//     console.log(body);
//     const url = 'https://read-the-question-20220609.herokuapp.com/rag';

//     submitAsyncRequest(uuid, body, url);
// }


// async function submitCommentAsync(uuid, sheet, comment) {
//     const body = {uuid, sheet, comment};
//     console.log(uuid);
//     const review_status = document.getElementById(uuid);

//     setStatusWithTimeout(review_status, "Submitting. Please wait ...", "loading", 0);

//     try {
//         const response = await fetch(
//             'https://read-the-question-20220609.herokuapp.com/comments',
//             {
//                 method: 'POST',
//                 body: JSON.stringify(body),
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             }
//         );
            

//         // const response = await fetch(
//         //     'http://localhost:5000/comments',
//         //     {
//         //         method: 'POST',
//         //         body: JSON.stringify(body),
//         //         headers: {
//         //             'Content-Type': 'application/json',
//         //         }
//         //     }
//         // );
    
//         if (!response.ok) {
//             const body = await response.json();
//             console.log(`HTTP success! ${body}`);
    
//             setStatusWithTimeout(review_status, `Error: ${body.reason}`, "error", 3000);
//             // alert(`HTTP error! status: ${response.status}`);
//         } else {
//             // alert(`HTTP success! status: ${response.status}`);
//             setStatusWithTimeout(review_status, "Success", "success", 3000);
//         }
//     } catch(e) {
//         console.error(e);
//         setStatusWithTimeout(review_status, `Error: ${e.message}`, "error", 3000);
//     }
// }


// async function submitReviewAsync(uuid, sheet, rag) {
//     const body = {uuid, sheet, rag};
//     console.log(uuid);
//     const review_status = document.getElementById(uuid);

//     setStatusWithTimeout(review_status, "Submitting. Please wait ...", "loading", 0);

//     try {
//         const response = await fetch(
//             'https://read-the-question-20220609.herokuapp.com/rag',
//             {
//                 method: 'POST',
//                 body: JSON.stringify(body),
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             }
//         );
            

//         // const response = await fetch(
//         //     'http://localhost:5000/rag',
//         //     {
//         //         method: 'POST',
//         //         body: JSON.stringify(body),
//         //         headers: {
//         //             'Content-Type': 'application/json',
//         //         }
//         //     }
//         // );
    
//         if (!response.ok) {
//             const body = await response.json();
//             console.log(`HTTP success! ${body}`);
    
//             setStatusWithTimeout(review_status, `Error: ${body.reason}`, "error", 3000);
//             // alert(`HTTP error! status: ${response.status}`);
//         } else {
//             // alert(`HTTP success! status: ${response.status}`);
//             setStatusWithTimeout(review_status, "Success", "success", 3000);
//         }
//     } catch(e) {
//         console.error(e);
//         setStatusWithTimeout(review_status, `Error: ${e.message}`, "error", 3000);
//     }
// }

