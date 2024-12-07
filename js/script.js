let quizData = [];
let shuffledQuizData = [];
const quiz = document.getElementById('quiz');
const submitBtn = document.getElementById('submit');
const results = document.getElementById('results');
const feedback = document.getElementById('feedback');
const progressBar = document.getElementById('progress-bar');
const counter = document.getElementById('counter');
const certificationSelect = document.getElementById('certification-select');
const quizTitle = document.getElementById('quiz-title');
const certificationBadge = document.getElementById('certification-badge');
let currentQuestionIndex = 0;
let numCorrect = 0;
let numIncorrect = 0;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / shuffledQuizData.length) * 100;
    progressBar.style.width = `${progress}%`;
    counter.innerHTML = `${currentQuestionIndex + 1}/${shuffledQuizData.length} | ${numIncorrect} erradas | ${numCorrect} certas`;
}

function loadQuiz() {
    feedback.innerHTML = '';
    const currentQuestion = shuffledQuizData[currentQuestionIndex];
    const answers = [];
    const letters = ['a', 'b', 'c', 'd'];
    const shuffledAnswers = letters.map(letter => ({ letter, text: currentQuestion[letter] }));
    shuffle(shuffledAnswers);
    shuffledAnswers.forEach(({ letter, text }, index) => {
        answers.push(
            `<label>
                <input type="radio" name="question" value="${letter}">
                ${letters[index]} : ${text}
            </label>`
        );
    });
    quiz.innerHTML = `<div class="question">${currentQuestionIndex + 1}. ${currentQuestion.question}</div>
                      <div class="answers">${answers.join('')}</div>`;
    updateProgress();
}

function showResults() {
    const answerContainer = quiz.querySelector('.answers');
    const selector = `input[name=question]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;
    const currentQuestion = shuffledQuizData[currentQuestionIndex];

    if (!userAnswer) {
        feedback.innerHTML = 'Por favor, selecione uma resposta.';
        feedback.style.color = 'orange';
        return;
    }

    if (userAnswer === currentQuestion.correct) {
        numCorrect++;
        feedback.innerHTML = 'Resposta Correta';
        feedback.style.color = 'green';
    } else {
        numIncorrect++;
        feedback.innerHTML = `Resposta Incorreta<br>Resposta correta: ${currentQuestion[currentQuestion.correct]}`;
        feedback.style.color = 'red';
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < shuffledQuizData.length) {
            loadQuiz();
        } else {
            quiz.innerHTML = '';
            results.innerHTML = `${numCorrect} de ${shuffledQuizData.length} corretas`;
        }
    }, 2000);
}

function fetchQuizData(fileName) {
    fetch(`./json/${fileName}`)
        .then(response => response.json())
        .then(data => {
            quizData = data;
            shuffledQuizData = [...quizData];
            shuffle(shuffledQuizData);
            loadQuiz();
        })
        .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));
}

certificationSelect.addEventListener('change', (event) => {
    const selectedFile = event.target.value;
    const selectedText = event.target.options[event.target.selectedIndex].text;
    const selectedBadge = event.target.options[event.target.selectedIndex].getAttribute('data-badge');
    quizTitle.innerHTML = `Quiz ${selectedText}`;
    certificationBadge.src = selectedBadge;
    currentQuestionIndex = 0;
    numCorrect = 0;
    numIncorrect = 0;
    fetchQuizData(selectedFile);
});

fetchQuizData(certificationSelect.value);
submitBtn.addEventListener('click', showResults);