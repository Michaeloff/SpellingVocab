// ** quizDefinitionsAndSynonyms.js **
// Functions to handle user actions and results related to the definitions and spelling quiz.
// Most calls are used by both quizzes, with the main exception around possible-answer generation.

// Triggered by 'Start Quiz' button on 'Select List' page if definitions quiz is selected.
function loadQuizDefinitionsPage() {
    // Use jQuery AJAX load call to load the body content.
    $('#body-content').load("quizDefinitions.html", function () {
        setButtonStylingEvents();
        quizDefinitionSetup();
        nextQuizDefinition();
    });
}

// Triggered by 'Start Quiz' button on 'Select List' page if synonyms quiz is selected.
function loadQuizSynonymsPage() {
    // Use jQuery AJAX load call to load the body content.
    $('#body-content').load("quizSynonyms.html", function () {
        setButtonStylingEvents();
        quizSynonymsSetup();
        nextQuizDefinition();
    });
}

// Using the words from all lists, generate a list of possible synonyms and save it for use in questions.
function quizSynonymsSetup() {
    var wordObjects = [];
    selected.listsByGrade().forEach(listsFromSingleGrade => {
        Object.keys(listsFromSingleGrade).forEach(oneListFromOneGradeKey => {
            // Get an array of all word objects across all lists.
            wordObjects = wordObjects.concat(listsFromSingleGrade[oneListFromOneGradeKey]);
        });
    });

    let synonymLists = wordObjects.map(word => { return word.synonyms; });
    let synonyms = [];
    synonymLists.forEach(synonymList => {
        let individualSynonyms = synonymList.split(',');
        synonyms = synonyms.concat(individualSynonyms);
    });
    synonyms = synonyms.map(synonym => { return synonym.trim(); });         // Remove whitespace on ends.
    synonyms = synonyms.filter(synonym => { return (synonym != "N/A"); });  // Remove any N/A strings.

    quizProgress.clear();
    progressBar.init();
    quizDefinitionsState.init(synonyms);
}

// Using the words from all lists, generate a list of possible definitions and save it for use in questions.
function quizDefinitionSetup() {
    var wordObjects = [];
    selected.listsByGrade().forEach(listsFromSingleGrade => {
        Object.keys(listsFromSingleGrade).forEach(oneListFromOneGradeKey => {
            // Get an array of all word objects across all lists.
            wordObjects = wordObjects.concat(listsFromSingleGrade[oneListFromOneGradeKey]);
        });
    });

    let definitions = wordObjects.map(word => { return word.definition; });
    quizProgress.clear();
    progressBar.init();
    quizDefinitionsState.init(definitions);
}

// Show the next word and create/show the four possible answers.
function nextQuizDefinition() {
    let index = quizDefinitionsState.index();
    let selectedWords = selected.selectedWords()[index];
    var answer;

    $("#word").html(selectedWords.name);
    playWordProvided(selectedWords.name);

    if (selected.quizType() == "Synonyms") {
        answer = getRandomCorrectSynonym(selectedWords);
    }
    else {
        answer = selectedWords.definition;
    }
    var definitions = [];
    let numOfDefinitionsToAdd = 3;

    if (answer != constants.noneOfTheAbove()) {
        numOfDefinitionsToAdd = 4;
        definitions.push(answer);
    }

    while (definitions.length < numOfDefinitionsToAdd) {
        let newDefinition = getRandomDefinition();
        // Check definition is unique. indexOf returns -1 if not in list
        if ((definitions.indexOf(newDefinition) == -1)) { definitions.push(newDefinition); }
    }
    shuffle(definitions);
    if (answer == constants.noneOfTheAbove()) { definitions.push(constants.noneOfTheAbove()); }

    quizDefinitionsState.setFourOptions(definitions);
    let answerNum = definitions.indexOf(answer);
    quizDefinitionsState.setAnswerNum(answerNum);

    let fillerCorrect = constants.correctIconInvisible() + constants.twoSpaces();
    let fillerIncorrect = constants.incorrectIconInvisible() + constants.twoSpaces();

    for (index = 0; index < 4; index++) {
        let buttonDef = "#buttonDef" + index;
        // Add invisible icon to end to create the space for this for later. Prevents visible resize of buttons.
        if (index == answerNum) {
            $(buttonDef).html(fillerCorrect + definitions[index] + fillerCorrect);
        }
        else {
            $(buttonDef).html(fillerIncorrect + definitions[index] + fillerIncorrect);
        }
    }
    // Ensure that multiple rapid clicks don't create issues.
    quizDefinitionsState.setReady(true);
}

// This gets one random correct synonym from the selected word object.
function getRandomCorrectSynonym(selectedWords) {
    if (selectedWords.synonyms == "N/A") return constants.noneOfTheAbove();
    let synonyms = selectedWords.synonyms.split(',');
    let randomIndex = Math.floor(Math.random() * synonyms.length);  // returns a random integer from 0 to synonyms.length - 1
    let index = (randomIndex < synonyms.length) ? randomIndex : 0;
    return synonyms[index];
}

// Get a random (incorrect) definition from a list of definitions or synonyms. In the small chance it's correct, note that it will be screened out later.
function getRandomDefinition() {
    let numOfDefinitions = quizDefinitionsState.definitions().length;
    let randomIndex = Math.floor(Math.random() * numOfDefinitions);  // returns a random integer from 0 to numOfDefinitions - 1
    let index = (randomIndex < numOfDefinitions) ? randomIndex : 0;
    return quizDefinitionsState.definitions()[index];
}

// Called when user clicks an answer (will pass 0, 1, 2 or 3). Checks answer correctness and acts accordingly.
function selectedAnswer(answerNum) {
    if (quizDefinitionsState.ready() == false) { return; }

    // Spaces and filler are used to create a consistent length so that the answer boxes don't resize when
    // the green checkmarks or red X's appear.
    let spaces = constants.twoSpaces();
    let buttonDef = "#buttonDef" + answerNum;
    if (answerNum == quizDefinitionsState.answerNum()) {
        playRandomResponse(true);
        let filler = constants.correctIconInvisible() + spaces;
        $(buttonDef).html(filler + quizDefinitionsState.fourOptions()[answerNum] + spaces + constants.correctIcon());
        quizProgress.incrementCorrect();
        quizDefinitionsState.addCorrectAnswer();
    }
    else {
        playRandomResponse(false);
        let filler = constants.incorrectIconInvisible() + spaces;
        $(buttonDef).html(filler + quizDefinitionsState.fourOptions()[answerNum] + spaces + constants.incorrectIcon());
        if (quizDefinitionsState.tryAgain()) {
            quizDefinitionsState.setTryAgain(false);
            return;
        }
    }
    // Correct, or wrong the 2nd time. Move to next word or finish quiz.
    quizDefinitionsState.setReady(false);
    quizDefinitionsState.setTryAgain(true);
    quizDefinitionsState.incrementIndex();
    progressBar.update(quizDefinitionsState.index());

    if (quizDefinitionsState.index() >= selected.length()) {
        setTimeout(quizComplete, 500);
        setupQuizDefinitionsResultsTable();
    }
    else {
        setTimeout(nextQuizDefinition, 1000);
    }
}

// Quiz results table has two rows. First row shows word with correct/incorrect icon, and second row
// shows either the definitions or synonyms.
function setupQuizDefinitionsResultsTable() {
    let tableResults = $('#quizDefinitionsTable');
    $("#quizDefinitionsTableBody").empty();
    let cellStart = "<td class='text-right'>";
    let spaces = constants.twoSpaces();
    let correctCell = spaces + constants.correctIcon() + spaces;
    let incorrectCell = spaces + constants.incorrectIcon() + spaces;
    var rows = setSelectedWordTableRows();

    rows.forEach(function (row, index) {
        let rowToAdd = $("<tr/>").appendTo(tableResults.find('tbody:last'));

        if (quizDefinitionsState.correctAnswers().indexOf(index) == -1) {
            rowToAdd.append(cellStart + row[0] + incorrectCell);
        }
        else {
            rowToAdd.append(cellStart + row[0] + correctCell);
        }
        rowToAdd.append($("<td/>").text(row[1]));
    });
}

// Use module pattern to create a "class" that separates private access to the definition state data.
// Used for both definitions or synonyms as the "definition"
var quizDefinitionsState = (function () {
    var definitions; // Used for either definitions or synonyms
    var fourOptions;
    var tryAgain = true;
    var userTouching = false;
    var ready = false;
    var answerNum;
    var correctAnswers = [];
    var index = 0;

     function init(newDefinitions) {
        index = 0;
        correctAnswers.length = 0;
        definitions = newDefinitions;
    }
    function setFourOptions(values) { fourOptions = values; }
    function setTryAgain(value) { tryAgain = value; }
    function setUserTouching(value) { userTouching = value; }
    function setReady(value) { ready = value; }
    function setAnswerNum(value) { answerNum = value; }
    function addCorrectAnswer() { correctAnswers.push(index); }
    function incrementIndex() { index++; }

    return {
        init: (useSynonyms, newDefinitions) => { init(useSynonyms, newDefinitions); },
        definitions: () => { return definitions; },
        fourOptions: () => { return fourOptions; },
        setFourOptions: (values) => { setFourOptions(values); },
        tryAgain: () => { return tryAgain; },
        setTryAgain: (value) => { setTryAgain(value); },
        userTouching: () => { return userTouching; },
        setUserTouching: (value) => { return setUserTouching(value); },
        ready: () => { return ready; },
        setReady: (value) => { setReady(value); },
        answerNum: () => { return answerNum; },
        setAnswerNum: (value) => { setAnswerNum(value); },
        correctAnswers: () => { return correctAnswers; },
        addCorrectAnswer: () => { addCorrectAnswer(); },
        index: () => { return index; },
        incrementIndex: () => { incrementIndex(); }
    }
})();