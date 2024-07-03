document.addEventListener('DOMContentLoaded', async () => {
    async function getTopArtists(country) {
        try {
            const data = await window.databaseApi.getTopArtists(country);

            if (data.error === 6) {
                console.log('Country not found.');
                return;
            }

            return data;
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    async function getTopArtistQuestion() {
        const data = await getTopArtists('france');
        return generateQuizQuestions(data);
    }

    function generateQuizQuestions(data) {
        const artists = data.topartists.artist;

        if (!artists || !Array.isArray(artists) || artists.length === 0) {
            console.error('Invalid or empty artist data');
            return [];
        }

        const questions = [];

        // Multiple Choice: "Which of the following artists has the most listeners?"
        const shuffledArtists = [...artists].sort(() => 0.5 - Math.random());
        const correctArtist = artists.reduce((max, artist) => parseInt(max.listeners) > parseInt(artist.listeners) ? max : artist);
        const options = shuffledArtists.slice(0, 4);
        if (!options.includes(correctArtist)) {
            options[0] = correctArtist;
        }
        questions.push({
            type: 'multiple-choice',
            question: 'Which of the following artists has the most listeners?',
            options: options.map(artist => artist.name),
            correctAnswer: correctArtist.name
        });

        // True/False: Random artist is one of the top artists in France
        const randomArtist = shuffledArtists[Math.floor(Math.random() * shuffledArtists.length)];
        const isTopArtist = artists.some(artist => artist.name === randomArtist.name);
        questions.push({
            type: 'true-false',
            question: `Is ${randomArtist.name} one of the top artists in France?`,
            correctAnswer: isTopArtist
        });

        // Image Recognition: "Identify the artist from the given image."
        const randomArtistForImage = shuffledArtists[0];
        questions.push({
            type: 'image-recognition',
            question: 'Identify the artist from the given image.',
            imageUrl: randomArtistForImage.image.find(img => img.size === 'large')['#text'],
            correctAnswer: randomArtistForImage.name
        });

        return questions;
    }

    function displayQuestion(question, currentIndex, totalQuestions, onNextQuestion) {
        const questionElement = document.getElementById('question');
        const answerContainer = document.getElementById('answerContainer');

        questionElement.textContent = `Question ${currentIndex + 1}/${totalQuestions}: ${question.question}`;
        answerContainer.innerHTML = '';

        if (question.type === 'multiple-choice') {
            question.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.onclick = () => {
                    const isUserCorrect = (option === question.correctAnswer);
                    alert(isUserCorrect ? 'True!' : 'False!')
                    onNextQuestion(isUserCorrect);
                };
                answerContainer.appendChild(button);
            });
        } else if (question.type === 'true-false') {
            ['True', 'False'].forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.onclick = () => {
                    const isUserCorrect = ((option === 'True') === question.correctAnswer);
                    alert(isUserCorrect ? 'True!' : 'False!')
                    onNextQuestion(isUserCorrect);
                };
                answerContainer.appendChild(button);
            });
        } else if (question.type === 'image-recognition') {
            const img = document.createElement('img');
            img.src = question.imageUrl;
            img.alt = 'Artist Image';
            img.style.width = '300px';
            answerContainer.appendChild(img);

            const input = document.createElement('input');
            input.type = 'text';
            const button = document.createElement('button');
            button.textContent = 'Submit';
            button.onclick = () => {
                const isUserCorrect = (input.value === question.correctAnswer);
                alert(isUserCorrect ? 'True!' : 'False!')
                onNextQuestion(isUserCorrect);
            };
            answerContainer.appendChild(input);
            answerContainer.appendChild(button);
        }
    }

    async function startQuiz() {
        const questions = await getTopArtistQuestion();
        if (!questions || questions.length === 0) return;

        let currentIndex = 0;
        let score = 0;

        function handleNextQuestion(isUserCorrect) {
            if (isUserCorrect) score++;
            currentIndex++;

            if (currentIndex < questions.length) {
                displayQuestion(questions[currentIndex], currentIndex, questions.length, handleNextQuestion);
            } else {
                displayScore(score, questions.length);
            }
        }

        displayQuestion(questions[0], currentIndex, questions.length, handleNextQuestion);
    }

    function displayScore(score, total) {
        const questionElement = document.getElementById('question');
        const answerContainer = document.getElementById('answerContainer');

        questionElement.textContent = `Quiz Completed! Your score is ${score}/${total}.`;
        answerContainer.innerHTML = '';
    }

    startQuiz();
});
