let mcqs;
let currentQuestion = 0;
let selectedOption = null;

function fetchMCQs() {
    fetch('mcqscat1.json')
        .then(response => response.json())
        .then(data => {
            mcqs = data;
            updateQuestion();
        })
        .catch(error => console.error('Error fetching MCQs:', error));
}

function updateQuestion() {
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const resultElement = document.getElementById("result");

    // Reset selectedOption
    selectedOption = null;

    const currentMCQ = mcqs[currentQuestion];

    // Set the HTML content of question element with question number and text
    const questionNumber = currentQuestion + 1;
    questionElement.innerHTML = `<strong>Question ${questionNumber}:</strong>`;

    // Check if the question contains an image
    const imageRegex = /\\includegraphics\[max width=\\textwidth, center]{(.*?)}/g;
    let questionWithImage = currentMCQ.question;
    let match;
    while ((match = imageRegex.exec(currentMCQ.question)) !== null) {
        const includeGraphicsTag = match[0];
        const filenameWithoutExtension = match[1];
        const src = `images/${filenameWithoutExtension}.jpg`; // Append .png extension
        questionWithImage = questionWithImage.replace(includeGraphicsTag, `<div><img src="${src}" alt="Question Image"></div>`);
    }
    questionWithImage += '<br>';
    questionElement.innerHTML += questionWithImage;

    // Set the HTML content of options element with option names (A), (B), (C), (D)
    optionsElement.innerHTML = "";
    const optionLetters = ['A', 'B', 'C', 'D'];
    for (let i = 0; i < currentMCQ.options.length; i++) {
        const optionElement = document.createElement("li");
        optionElement.innerHTML = `<strong>(${optionLetters[i]})</strong> ${currentMCQ.options[i]}`;
        optionElement.setAttribute("data-option", optionLetters[i]); // Set data-option attribute
        optionElement.addEventListener("click", handleOptionClick); // Add click event listener
        optionsElement.appendChild(optionElement);
    }

    // Let MathJax process the newly added content
    MathJax.typesetPromise();

    // Clear previous result
    resultElement.textContent = "";
}






function handleOptionClick(event) {
    // Remove previous selection
    const prevSelectedOption = document.querySelector('.selected');
    if (prevSelectedOption) {
        prevSelectedOption.classList.remove('selected');
    }

    // Update selected option
    const option = event.target.closest('li');
    option.classList.add('selected');
    selectedOption = option.getAttribute('data-option');
}

const prevButton = document.getElementById("prev-button");
prevButton.addEventListener("click", () => {
    currentQuestion--;
    if (currentQuestion < 0) {
        currentQuestion = mcqs.length - 1; // Wrap to the last question
    }
    updateQuestion();
});

const nextButton = document.getElementById("next-button");
nextButton.addEventListener("click", () => {
    currentQuestion++;
    if (currentQuestion >= mcqs.length) {
        currentQuestion = 0; // Wrap to the first question
    }
    updateQuestion();
});

const submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", () => {
    const currentMCQ = mcqs[currentQuestion];
    const correctOption = currentMCQ.correct_option;

    const resultElement = document.getElementById("result");
    if (!selectedOption) {
        resultElement.textContent = `The correct option is ${correctOption}.`;
    } else if (selectedOption === correctOption) {
        resultElement.textContent = "Correct!";
    } else {
        resultElement.textContent = `Incorrect! The correct option is ${correctOption}.`;
    }
});


fetchMCQs(); // Fetch MCQs when the page loads
