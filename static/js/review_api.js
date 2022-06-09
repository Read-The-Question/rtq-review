const submitReview = (uuid, sheet, rag) => {
    console.log(`Submit review for: UUID: ${uuid}, sheet: ${sheet}, Review RAG: ${rag}`)
    // alert(`Submit review for: UUID: ${uuid}, sheet: ${sheet}, Review RAG: ${rag}`);

    // body = {uuid, sheet, rag};
    submitReviewAsync(uuid, sheet, rag);
    // .then(response => response.json());
}

async function submitReviewAsync(uuid, sheet, rag) {
    const body = {uuid, sheet, rag};
    console.log(uuid);
    const review_status = document.getElementById(uuid);

    setStatusWithTimeout(review_status, "Submitting. Please wait ...", "loading", 0);
    // review_status.innerText = "Updating ...";

	const response = await fetch(
		'https://httpbin.org/post',
		{
			method: 'POST',
            body: body,
			headers: {
                'Accept': 'application/json'
			}
		}
	);

	if (!response.ok) {
        setStatusWithTimeout(review_status, "Error while submitting!", "error", 4000);
        // alert(`HTTP error! status: ${response.status}`);
	} else {
        // alert(`HTTP success! status: ${response.status}`);
        setStatusWithTimeout(review_status, "Success", "success", 4000);
    }

	// const data = await response.json();
    // console.log(data);

    // alert(`HTTP success! ${data}`);
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