const submitReview = (uuid, sheet, rag) => {
    // console.log(`Submit review for: UUID: ${uuid}, sheet: ${sheet}, Review RAG: ${rag}`)
    // alert(`Submit review for: UUID: ${uuid}, sheet: ${sheet}, Review RAG: ${rag}`);
    submitReviewAsync(uuid, sheet, rag);
}

async function submitReviewAsync(uuid, sheet, rag) {
    const body = {uuid, sheet, rag};
    console.log(uuid);
    const review_status = document.getElementById(uuid);

    setStatusWithTimeout(review_status, "Submitting. Please wait ...", "loading", 0);

	// const response = await fetch(
	// 	'https://read-the-question-20220609.herokuapp.com/rag',
	// 	{
	// 		method: 'POST',
    //         body: JSON.stringify(body),
	// 		headers: {
    //             'Content-Type': 'application/json',
	// 		}
	// 	}
	// );

    try {
        const response = await fetch(
            'http://localhost:5000/rag',
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