// ** quizSpelling.js **
// Functions to handle user actions and results related to the spelling quiz.

// Triggered by 'Start Quiz' button on 'Select List' page.
function loadQuizPage() {
    switch (selected.quizType()) {
        case "Spelling":
            loadQuizSpellingPage();
            break;
        case "Definitions":
            loadQuizDefinitionsPage();
            break;
        case "Synonyms":
            loadQuizSynonymsPage();
            break;
        default:
            loadQuizSpellingPage();
            break;
    }
}

// Triggered by 'Start Quiz' button on 'Select List' page if spelling quiz is selected.
function loadQuizSpellingPage() {
    // Use jQuery AJAX load call to load the body content.
    $('#body-content').load("quizSpelling.html", function () {
        quizState.init();
        start();
    });
}

// Clear the quiz state/progress and play first word in list.
function start() {
    quizProgress.clear();
    quizState.clear();
    quizState.setAnswerText(selected.length() + " words to spell.  Good luck!");
    setWordByIndex();
    playWordWithExample();
    quizState.focus();
}

// Fill out the displayed quiz window using the word information based on the current word index.
function setWordByIndex() {
    let index = quizState.index();
    let selectedWords = selected.selectedWords();

    quizState.setCurrentWord(selectedWords[index].name);
    let definitionWithPartOfSpeech = "(" + selectedWords[index].partOfSpeech + ") " + selectedWords[index].definition;
    $("#definition").html(definitionWithPartOfSpeech);
    var hideWord = new RegExp(quizState.currentWord(), "gi"); // reg exp with global case-insensitive replace
    $("#example").html(selectedWords[index].example.replace(hideWord, " _______ "));
    $("#synonyms").html(selectedWords[index].synonyms);
}

// Called when the user hits enter or clicks right arrow button to check if they got it right.
function checkWord() {
    if (quizState.index() >= selected.length()) {
        // At the end of the list, start over.
        $("#quizResults").addClass("d-none");
        $("#mainQuiz").removeClass("d-none");
        start();
        return;
    }

    if (quizState.userInput() == quizState.currentWord()) {
        quizProgress.rightAnswerAdd(quizState.currentWord());
        moveToNextWord(true);
    }
    else if (quizState.userInput() == "") {
        quizProgress.skippedAnswerAdd([quizState.currentWord(), "<skipped>"]);
        moveToNextWord(false);
    }
    else {
        incorrect();
    }

    quizState.setUserInput("");
    quizState.focus();
}

// Called when user click question icon. It reveals the spelling of the word.
function showWord() {
    quizState.setAnswerText(quizState.currentWord());
    quizState.focus();
}

// If the word is correct or skipped, update progress and move to the next word or show quiz results.
function moveToNextWord(correct) {
    quizState.setFirstTry(true);

    if (correct) {
        quizProgress.incrementCorrect();
        quizState.setAnswerText(quizState.currentWord() + constants.oneSpace() + constants.correctIcon());
    }
    else {
        quizState.setAnswerText(quizState.currentWord() + constants.oneSpace() + constants.incorrectIcon());
    }

    quizState.incrementIndex();
    if (quizState.index() >= selected.length()) {
        quizComplete();
        setupQuizResultsTable();
    }
    else {
        setWordByIndex();
        playWordWithExample();
    }

    // Add progress bar update here.
}

// If the word is incorrect either provide another try or record and move on.
function incorrect() {
    if (quizState.firstTry()) {
        quizState.setFirstTry(false);
        playWordProvided("One more try!");
        quizState.setAnswerText("One more try!");
    }
    else {
        quizProgress.wrongAnswerAdd([quizState.currentWord(), quizState.userInput()]);
        moveToNextWord(false);
    }
}

// Setup the quiz results table. It will show incorrectly spelled words first, then skipped, then a separate table for correct.
// Incorrect/skipped words will have two columns (incorrect | correct), while the correct table has a single column.
function setupQuizResultsTable() {
    let tableMissed = $('#quizMissedTable');
    let tableCorrect = $('#quizCorrectTable');
    $("#quizMissedTableBody").empty();
    $("#quizCorrectTableBody").empty();

    if (quizProgress.correct() < selected.length()) { // Missed some words
        tableMissed.removeClass("d-none");
        // Build rows for wrong
        $.each(quizProgress.wrongAnswerRows(), function (rowIndex, wrongAnswerContent) {
            let rowToAdd = $("<tr/>").appendTo(tableMissed.find('tbody:last'));
            rowToAdd.append($("<td class='text-right pr-3'>").text(wrongAnswerContent[0]));  // right justify left column correct answers
            rowToAdd.append($("<td class='text-danger text-left pl-3'>").text(wrongAnswerContent[1]));   // left justify right column user answers
        });
        // Build rows for skipped
        $.each(quizProgress.skippedAnswerRows(), function (rowIndex, skippedAnswerContent) {
            let rowToAdd = $("<tr/>").appendTo(tableMissed.find('tbody:last'));
            rowToAdd.append($("<td class='text-right pr-3'>").text(skippedAnswerContent[0]));  // right justify left column correct answers
            rowToAdd.append($("<td class='text-danger text-left pl-3'>").text(skippedAnswerContent[1]));   // left justify right column user answers
        });
    }
    else { tableMissed.addClass("d-none"); }

    if (quizProgress.correct() > 0) { // Build rows for correct answers
        tableCorrect.removeClass("d-none");
        $.each(quizProgress.rightAnswerRows(), function (rowIndex, rightAnswer) {
            let rowToAdd = $("<tr/>").appendTo(tableCorrect.find('tbody:last'));
            rowToAdd.append($("<td class='pl-3'>").text(rightAnswer));
        });
    }
    else { tableCorrect.addClass("d-none"); }
}

// Use module pattern to create a "class" that separates private access to the quiz state data.
var quizState = (function () {
    var index = 0;
    var firstTry = true;
    var answer;
    var userInput;
    var currentWord = "";

    function init() {
        answer = $("#answer");
        userInput = document.getElementById('enterSpelling');
        userInput.addEventListener("keyup", function (event) { // Execute a function when the user releases a key on the keyboard
            event.preventDefault();      // Cancel the default action, if needed
            if (event.keyCode === 13) {  // Number 13 is the "Enter" key on the keyboard
                checkWord();
            }
        });
    }
    function clear() {
        index = 0;
        firstTry = true;
    }
    function setAnswerText(value) { answer.html(value); }
    function setUserInput(value) { userInput.value = value; }
    function setCurrentWord(value) { currentWord = value; }
    function setFirstTry(value) { firstTry = value; }
    function incrementIndex() { index++; }

    return {
        init: function () { return init(); },
        clear: function () { return clear(); },
        setAnswerText: function (value) { setAnswerText(value); },
        userInput: function () { return userInput.value; },
        setUserInput: function (value) { setUserInput(value); },
        currentWord: function () { return currentWord; },
        setCurrentWord: function (value) { setCurrentWord(value); },
        index: function () { return index; },
        incrementIndex: function () { incrementIndex(); },
        firstTry: function () { return firstTry; },
        setFirstTry: function (value) { return setFirstTry(value); },
        focus: function () { return userInput.focus(); }
    }
})();

// Use module pattern to create a "class" that separates private access to the quiz progress state data.
var quizProgress = (function () {
    var correct = 0;
    var wrongAnswerRows = [];
    var skippedAnswerRows = [];
    var rightAnswerRows = [];

    function clear() {
        correct = 0;
        wrongAnswerRows.length = 0;
        skippedAnswerRows.length = 0;
        rightAnswerRows.length = 0;
    }
    function incrementCorrect() { correct++; }
    function wrongAnswerAdd(row) { wrongAnswerRows.push(row); }
    function skippedAnswerAdd(row) { skippedAnswerRows.push(row); }
    function rightAnswerAdd(row) { rightAnswerRows.push(row); }

    return {
        clear: function () { return clear(); },
        correct: function () { return correct; },
        incrementCorrect: function () { return incrementCorrect(); },
        wrongAnswerRows: function () { return wrongAnswerRows; },
        wrongAnswerAdd: function (row) { return wrongAnswerAdd(row); },
        skippedAnswerRows: function () { return skippedAnswerRows; },
        skippedAnswerAdd: function (row) { return skippedAnswerAdd(row); },
        rightAnswerRows: function () { return rightAnswerRows; },
        rightAnswerAdd: function (row) { return rightAnswerAdd(row); }
    }
})();

