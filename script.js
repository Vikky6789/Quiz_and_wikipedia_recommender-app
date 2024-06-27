document.addEventListener('DOMContentLoaded', function() {
    const quizForm = document.getElementById('quiz-form');
    const categorySelect = document.getElementById('category-select');
    const quizContainer = document.getElementById('quiz-container');
    const finishButton = document.getElementById('finish-btn');
    const scoreDisplay = document.getElementById('score-value');
    const scoreContainer = document.getElementById('score-container');
    const flashcardsContainer = document.getElementById('knowledge-content');

    quizForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission

        const selectedCategory = categorySelect.value;

        if (selectedCategory) {
            fetchQuizQuestions(selectedCategory);
        } else {
            alert('Please select a category to start the quiz.');
        }
    });

    function fetchQuizQuestions(category) {
        const API_URL = `https://opentdb.com/api.php?amount=8&category=${category}&type=multiple`;

        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                displayQuiz(data.results);
                removeFlashcards();
                showScoreAndFinishButton();
            })
            .catch(error => {
                console.error('Error fetching quiz questions:', error);
                alert('Failed to fetch quiz questions. Please try again later.');
            });
    }

    function displayQuiz(questions) {
        quizContainer.innerHTML = ''; // Clear previous quiz content
        scoreDisplay.textContent = '0'; // Reset score display

        questions.forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');
            questionElement.innerHTML = `<p>${index + 1}. ${question.question}</p>`;

            const optionsContainer = document.createElement('div');
            optionsContainer.classList.add('options');

            const options = [...question.incorrect_answers, question.correct_answer];
            shuffleArray(options);

            options.forEach(option => {
                const optionElement = document.createElement('button');
                optionElement.classList.add('option');
                optionElement.textContent = option;
                optionElement.addEventListener('click', function() {
                    if (!optionElement.classList.contains('selected')) {
                        if (option === question.correct_answer) {
                            optionElement.style.backgroundColor = '#8bc34a'; // Green for correct
                            updateScore(1); // Increment score
                        } else {
                            optionElement.style.backgroundColor = '#f44336'; // Red for incorrect
                        }
                        optionElement.classList.add('selected');
                        disableOptions(optionsContainer);
                    }
                });
                optionsContainer.appendChild(optionElement);
            });

            questionElement.appendChild(optionsContainer);
            quizContainer.appendChild(questionElement);
        });
    }

    function updateScore(points) {
        const currentScore = parseInt(scoreDisplay.textContent);
        scoreDisplay.textContent = currentScore + points;
    }

    function disableOptions(container) {
        const optionButtons = container.querySelectorAll('.option');
        optionButtons.forEach(button => {
            button.disabled = true; // Disable option buttons
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    finishButton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    function removeFlashcards() {
        flashcardsContainer.style.display = 'none';
    }

    function showScoreAndFinishButton() {
        scoreContainer.style.display = 'flex';
        scoreContainer.style.width="100px";
        finishButton.style.display = 'flex';
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const browseWikiInfo = document.getElementById('browse-wiki-info');
    const wikiSearch = document.getElementById('wiki-search');
    const wikiSearchForm = document.getElementById('wiki-search-form');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const closeSearchResults = document.getElementById('close-search-results');

    // Event listener for clicking "Browse Wiki Info"
    browseWikiInfo.addEventListener('click', function(event) {
        event.preventDefault();
        wikiSearch.classList.add('show'); // Show the wiki search bar
    });

    // Event listener for form submission
    wikiSearchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const searchTerm = searchInput.value.trim();

        if (searchTerm !== '') {
            searchWikipedia(searchTerm);
        }
    });

    // Event listener for closing search results
    closeSearchResults.addEventListener('click', function() {
        searchResults.innerHTML = ''; // Clear search results
        wikiSearch.classList.remove('show'); // Hide the wiki search bar
    });

    // Function to search Wikipedia
    function searchWikipedia(term) {
        const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=${encodeURIComponent(term)}`;

        fetch(endpoint)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                displaySearchResults(data.query.search);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                showNoResults();
            });
    }

    // Function to display search results
    function displaySearchResults(results) {
        searchResults.innerHTML = ''; // Clear previous results
        if (results.length === 0) {
            showNoResults();
        } else {
            const maxResults = Math.min(results.length, 5); // Limit to 5 results
            for (let i = 0; i < maxResults; i++) {
                const result = results[i];
                const resultElement = document.createElement('div');
                resultElement.classList.add('search-result');
                resultElement.innerHTML = `
                    <h3>${result.title}</h3>
                    <p>${result.snippet}</p>
                    <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}" target="_blank">Read more on Wikipedia</a>
                `;
                searchResults.appendChild(resultElement);
            }
            wikiSearch.classList.add('show'); // Show search results box
        }
    }

    // Function to show no results found message
    function showNoResults() {
        searchResults.innerHTML = '<p>No results found. Here are some suggestions:</p>' +
            '<ul>' +
            '<li>Check the spelling of your query.</li>' +
            '<li>Try searching for related terms.</li>' +
            '</ul>';
        wikiSearch.classList.add('show'); // Show search results box
    }
});

// JavaScript to toggle blur effect on flashcards when "Browse Wiki Info" is clicked

// Select elements
const wikiSearchButton = document.getElementById('browse-wiki-info');
const wikiSearchContainer = document.getElementById('wiki-search');
const closeSearchResultsButton = document.getElementById('close-search-results');
const flashcards = document.querySelectorAll('.flashcard');

// Event listener for "Browse Wiki Info" button click
wikiSearchButton.addEventListener('click', function() {
    // Toggle visibility of wiki search container
    wikiSearchContainer.classList.toggle('show');

    // Toggle blur effect on flashcards
    flashcards.forEach(flashcard => {
        flashcard.classList.toggle('blurred');
    });
});

// Event listener for closing search results
closeSearchResultsButton.addEventListener('click', function() {
    // Hide wiki search container
    wikiSearchContainer.classList.remove('show');

    // Remove blur effect on flashcards
    flashcards.forEach(flashcard => {
        flashcard.classList.remove('blurred');
    });
});


