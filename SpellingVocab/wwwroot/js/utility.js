// ** utility.js **
// These functions are for utility, often used across the quizzes or to set user options.
// The sections include: voice-related, theme-related, and misc.
//
/////////////  VOICE RELATED FUNCTIONS ///////////////

// The voice calls use a 3rd-party script called Responsive Voice JS and is included in index.html:
// <script src='https://code.responsivevoice.org/responsivevoice.js'></script>

// Speak whatever word or phrase is provided.
function playWordProvided(phrase) {
    responsiveVoice.speak(phrase, voiceSettings.getVoice(), { rate: voiceSettings.getSpeed() });
}

// Called when next word is loaded.
function playWordWithExample() {
    let selectedWords = selected.selectedWords();
    let currentSpokenSentence = selectedWords[quizState.index()].example;
    if (currentSpokenSentence == "N/A") { currentSpokenSentence = ""; }
    let upperCaseWord = quizState.currentWord().charAt(0).toUpperCase() + quizState.currentWord().slice(1);
    responsiveVoice.speak(upperCaseWord + ". " + currentSpokenSentence, voiceSettings.getVoice(), { rate: voiceSettings.getSpeed() }); //, defaultVoice, { pitch: 1.0, rate: 1.0 });
}

// Called when play icon is clicked (left of user input).
function playWordWithDefinition() {
    let selectedWords = selected.selectedWords();
    let phraseToSpeak = quizState.currentWord() + ". " + selectedWords[quizState.index()].partOfSpeech + ". " + selectedWords[quizState.index()].definition;
    responsiveVoice.speak(phraseToSpeak, voiceSettings.getVoice(), { rate: voiceSettings.getSpeed() });
    quizState.focus();
}

// Called for definitions and synonyms quiz when a correct or incorrect option is selected.
function playRandomResponse(correct) {
    let randomIndex = Math.floor(Math.random() * 4); // returns a random integer from 0 to 3
    if (correct) {
        switch (randomIndex) {
            case 1: playWordProvided("Correct!"); break;
            case 2: playWordProvided("Good!"); break;
            case 3: playWordProvided("Yes!"); break;
            default: playWordProvided("Right!"); break;
        }
    }
    else {
        switch (randomIndex) {
            case 1: playWordProvided("Incorrect."); break;
            case 2: playWordProvided("Not quite."); break;
            case 3: playWordProvided("Not it."); break;
            default: playWordProvided("Nope."); break;
        }
    }
}

function setVoiceSettings() {
    // Make sure document is ready before calling, specifically the navbar
    $("#voiceDropdown a").click(function () {
        let thisId = $(this).attr("id");
        let itemIds = ["fast", "normal", "slow", "verySlow"];

        if (itemIds.includes(thisId)) {
            if (thisId == "fast") { voiceSettings.setSpeed(1.4); }
            else if (thisId == "slow") { voiceSettings.setSpeed(0.85); }
            else if (thisId == "verySlow") { voiceSettings.setSpeed(0.65); }
            else { voiceSettings.setSpeed(1.0); }
        }
        else {
            voiceSettings.setVoice($(this).text());
            itemIds = ["usFemale", "ukFemale", "usMale", "ukMale"];
        }

        itemIds.forEach(function (itemId) {
            if (itemId == thisId) {
                $("#" + itemId).addClass('dropdown-item-checked');
            }
            else {
                $("#" + itemId).removeClass('dropdown-item-checked');
            }
        });

        playWordProvided("This is the sound and speed of my voice with the current settings.");
    });
}

// Use module pattern to consolidate voice settings
var voiceSettings = (function () {
    var voice = "US English Female";
    var speed = 1.0;

    function changeVoice(newVoice) { voice = newVoice; }
    function changeSpeed(newSpeed) { speed = newSpeed; }

    return {
        getVoice: function () { return voice; },
        setVoice: function (newVoice) { changeVoice(newVoice); },
        getSpeed: function () { return speed; },
        setSpeed: function (newSpeed) { changeSpeed(newSpeed); }
    };
})();


/////////////  THEME RELATED FUNCTIONS ///////////////

// These themes are provided by https://www.bootstrapcdn.com/bootswatch
function setTheme() {
    $("#themeDropdown a").click(function () {
        let thisId = $(this).attr("id");
        let itemIds = ["default", "cosmo", "flatly", "journal", "litera", "lumen", "materia", "minty", "pulse", "sandstone", "sketchy", "slate", "spacelab", "united"];

        itemIds.forEach(function (itemId) {
            if (itemId == thisId) {
                $("#" + itemId).addClass('dropdown-item-checked');
            }
            else {
                $("#" + itemId).removeClass('dropdown-item-checked');
            }
        });
        selectTheme(thisId);
    });
}

// The integrity data and references for Bootstrap themes can be found here: https://www.bootstrapcdn.com/bootswatch
function selectTheme(theme) {

    switch (theme) {
        case "default":
            $("#bootstrapRef").attr("integrity", "sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS");
            $("#bootstrapRef").attr("href", "https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css");
            break;
        case "cosmo":
            $("#bootstrapRef").attr("integrity", "sha384-BmPRQ4EzBa9ifYo2LjomrSZ28x2GHvKNtv599SfxGvi39OQfRzluOw+sLUfxPOOD");
            $("#bootstrapRef").attr("href", "https://stackpath.bootstrapcdn.com/bootswatch/4.2.1/cosmo/bootstrap.min.css");
            break;
        case "flatly":
            $("#bootstrapRef").attr("integrity", "sha384-9dACWymWSkhCeCgbjV6xqS20Luu4ue6QnEvr+nMXpPMwIq/OB89AoRh27Flsrxzs");
            $("#bootstrapRef").attr("href", "https://stackpath.bootstrapcdn.com/bootswatch/4.2.1/flatly/bootstrap.min.css");
            break;
        case "journal":
            $("#bootstrapRef").attr("integrity", "sha384-wyzVWKv3ozWhmlIxdqqiBLCfdGQ6A9puGP5vQFZKjv0Q3/r1mBYkoaQ5gyhZh9cY");
            $("#bootstrapRef").attr("href", "https://stackpath.bootstrapcdn.com/bootswatch/4.2.1/journal/bootstrap.min.css");
            break;
        case "litera":
            $("#bootstrapRef").attr("integrity", "sha384-DkdUb51XC4VPExQljj9mtMYspLBzNJscXpAnuo0rcJcLd7aeOH3jnz6cS1v8OFMW");
            $("#bootstrapRef").attr("href", "https://stackpath.bootstrapcdn.com/bootswatch/4.2.1/litera/bootstrap.min.css");
            break;
        case "lumen":
            $("#bootstrapRef").attr("integrity", "sha384-9b6g9YkA3pNts/17Rv1oVN633iGTGjRNrBHSn2XFY0WJVdha5Ev3MOVPmJPZpFqD");
            $("#bootstrapRef").attr("href", "https://stackpath.bootstrapcdn.com/bootswatch/4.2.1/lumen/bootstrap.min.css");
            break;
        case "materia":
            $("#bootstrapRef").attr("integrity", "sha384-3e5vG6/QiyHhwOR48/nvSyd+BAndFCuA4km61zJyky3Xr6mlaGNvyvJZjtac/He7");
            $("#bootstrapRef").attr("href", "https://stackpath.bootstrapcdn.com/bootswatch/4.2.1/materia/bootstrap.min.css");
            break;
        case "minty":
            $("#bootstrapRef").attr("integrity", "sha384-jsT0TI7JBEWn8YstmA/9zrJCL1V9Nc3W8o0sjFOWfu7QFRWjxwELS43/lFzo9t6S");
            $("#bootstrapRef").attr("href", "https://stackpath.bootstrapcdn.com/bootswatch/4.2.1/minty/bootstrap.min.css");
            break;
        case "pulse":
            $("#bootstrapRef").attr("integrity", "sha384-daEGF+rqKeUQDdLJe7DqgBSAE++P93VSeY44F6/iQZ9Z9Fdw/L45uzkqPu5QFHOm");
            $("#bootstrapRef").attr("href", "https://stackpath.bootstrapcdn.com/bootswatch/4.2.1/pulse/bootstrap.min.css");
            break;
        case "sandstone":
            $("#bootstrapRef").attr("integrity", "sha384-T8Hp0+7hNSzMWfUlwSbmLBVrToSckKSiobfGsr5PL1ezzM/+aTdPnnMBTicJvoib");
            $("#bootstrapRef").attr("href", "https://stackpath.bootstrapcdn.com/bootswatch/4.2.1/sandstone/bootstrap.min.css");
            break;
        case "sketchy":
            $("#bootstrapRef").attr("integrity", "sha384-Yr9hLdz4zKsdMcB2IUf0I2Y+KFalEfJez2d0H2rgQoAYjvm/mzbm2egxZ9Gc9kkg");
            $("#bootstrapRef").attr("href", "https://stackpath.bootstrapcdn.com/bootswatch/4.2.1/sketchy/bootstrap.min.css");
            break;
        case "slate":
            $("#bootstrapRef").attr("integrity", "sha384-jvsa5AujJxqzaYhQWMyOGNelM0rlTAvpVpU9zE8jwYi9dg9TdB7TzPUCLa+gLowa");
            $("#bootstrapRef").attr("href", "https://stackpath.bootstrapcdn.com/bootswatch/4.2.1/slate/bootstrap.min.css");
            break;
        case "spacelab":
            $("#bootstrapRef").attr("integrity", "sha384-dN0bQBvJ8wEUUKo/xICRDCg194KyqLX7p96/aqHs/bDlswiRc3IxSIjSNfvO9rgD");
            $("#bootstrapRef").attr("href", "https://stackpath.bootstrapcdn.com/bootswatch/4.2.1/spacelab/bootstrap.min.css");
            break;
        case "united":
            $("#bootstrapRef").attr("integrity", "sha384-udHIRBY7G8ZUr7aO8wRn7wD4bsGGRLR5orCz1FV93MZ7232xhAdjDYEvqeZLx45b");
            $("#bootstrapRef").attr("href", "https://stackpath.bootstrapcdn.com/bootswatch/4.2.1/united/bootstrap.min.css");
            break;
        default:
            $("#bootstrapRef").attr("integrity", "sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS");
            $("#bootstrapRef").attr("href", "https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css");
            break;
    }

    // Example: <link href="https://stackpath.bootstrapcdn.com/bootswatch/4.2.1/cerulean/bootstrap.min.css" rel="stylesheet" integrity="sha384-62+JPIF7fVYAPS4itRiqKa7VU321chxfKZRtkSY0tGoTwcUItAFEH/HGTpvDH6e6" crossorigin="anonymous">
}


/////////////  MISC HELPER FUNCTIONS ///////////////

// Set the quiz type based on the user selection from the top navbar 'Select Quiz' dropdown 
function setQuizType() {
    $("#quizDropdown a").click(function () {
        let quizId = $(this).attr("id");
        switch (quizId) {
            case "quizSpelling":
                selected.setQuizType("Spelling");
                break;
            case "quizDefinitions":
                selected.setQuizType("Definitions");
                break;
            case "quizSynonyms":
                selected.setQuizType("Synonyms");
                break;
            default:
                selected.setQuizType("Spelling");
                break;
        }
        setQuizTypeOnMenuBar();
        loadQuizPage();
    })
}

// Put a left checkmark on the quiz type selected in the top navbar 'Select Quiz' dropdown.
function setQuizTypeOnMenuBar() {
    let quizId = "quizSpelling";
    if (selected.quizType() == "Definitions") { quizId = "quizDefinitions"; }
    else if (selected.quizType() == "Synonyms") { quizId = "quizSynonyms"; }

    let itemIds = ["quizSpelling", "quizDefinitions", "quizSynonyms"];

    itemIds.forEach(function (itemId) {
        if (itemId == quizId) {
            $("#" + itemId).addClass('dropdown-item-checked');
        }
        else {
            $("#" + itemId).removeClass('dropdown-item-checked');
        }
    });
}

// Three quiz types use this: Spelling, Definitions and Synonyms. The last two show a data table with words and defintions,
// while the Synonyms quiz uses words and synonyms in the displayed data table.
function setSelectedWordTableRows() {
    var rows = [];
    if (selected.quizType() == "Synonyms") {
        selected.selectedWords().forEach(function (word, index) {
            let wordAndSynonyms = [];
            wordAndSynonyms.push(word.name);
            let synonyms = (word.synonyms == "N/A") ? "(no common synonyms)" : word.synonyms;
            wordAndSynonyms.push(synonyms);
            rows.push(wordAndSynonyms);
        });
    }
    else {
        selected.selectedWords().forEach(function (word, index) {
            let wordAndDefinition = [];
            wordAndDefinition.push(word.name);
            wordAndDefinition.push(word.definition);
            rows.push(wordAndDefinition);
        });
    }
    return rows;
}

// All quizzes will call this on completion to hide the main quiz and show the results message/table.
function quizComplete() {
    $("#mainQuiz").addClass("d-none");
    $("#quizResults").removeClass("d-none");

    let doneMessage = "Correct: " + quizProgress.correct() + " out of " + selected.length();
    $("#resultsNumCorrect").text(doneMessage);

    let correctPercent = (quizProgress.correct() / selected.length()) * 100;
    if (correctPercent == 100) { playWordProvided("Perfect! You're awesome!"); }
    else if (correctPercent >= 85) { playWordProvided("Great job!"); }
    else if (correctPercent >= 70) { playWordProvided("Good, but you can do even better."); }
    else if (correctPercent >= 50) { playWordProvided("Study up and give it another try."); }
    else { playWordProvided("You may want to take a good look at the list."); }
}

// Quiz buttons have color styling when hovering/clicking/touching.
function setButtonStylingEvents() {
    // There are known issues in Safari with iOS devices and hover:
    // https://stackoverflow.com/questions/2741816/is-it-possible-to-force-ignore-the-hover-pseudoclass-for-iphone-ipad-users
    // https://codeburst.io/the-only-way-to-detect-touch-with-javascript-7791a3346685
    // iOS handles hover and mouseenter/mouseleave unpredictably. A workaround is to detect a user is touching, and use only
    // the touchstart/touchend events in that case.

    $('.quiz-button').mouseenter(function () {
        if (!quizDefinitionsState.userTouching()) {
            $(this).css('background-color', 'hsl(215, 90%, 95%)');
        }
    });
    $('.quiz-button').mouseleave(function () {
        $(this).css('background-color', 'white');
    });

    $('.quiz-button').on('touchstart', function () {
        quizDefinitionsState.setUserTouching(true);
        $(this).css('background-color', 'hsl(215, 90%, 90%)');
    });
    $('.quiz-button').on('touchend', function () {
        $(this).css('background-color', 'white');
    });
}

// Randomly shuffle provided array.
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {  // While there remain elements to shuffle...
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Load about page when 'About' is selected on top navbar menu.
function loadAboutPage() {
    $('#body-content').load("about.html", function () { });
}

// Handle the progress bar
let progressBar = (function () {
    function init() {
        $("#progressBar").attr("style", "width: 0%");
        $(".progress").removeClass("d-none");
    }
    function hide() { $(".progress").addClass("d-none"); }
    function update(index) {
        let progress = (index / selected.length()) * 100;
        $("#progressBar").attr("style", "width: " + progress + "%");
    }

    return {
        init: () => { return init(); },
        hide: () => { return hide(); },
        update: (index) => { return update(index); }
    }
})();

// Consolidate the constants here to minimize typos.
let constants = (function () {
    let noneOfTheAbove = "none of the above";
    let oneSpace = "&nbsp;";
    let twoSpaces = "&nbsp;&nbsp;";
    let correctIcon = "<i class='fas fa-check text-success'></i>";
    let correctIconInvisible = "<i class='fas fa-check text-success invisible'></i>";
    let incorrectIcon = "<i class='fas fa-times text-danger'></i>";
    let incorrectIconInvisible = "<i class='fas fa-times text-danger invisible'></i>";

    return {
        noneOfTheAbove: () => { return noneOfTheAbove; },
        oneSpace: () => { return oneSpace; },
        twoSpaces: () => { return twoSpaces; },
        correctIcon: () => { return correctIcon; },
        correctIconInvisible: () => { return correctIconInvisible; },
        incorrectIcon: () => { return incorrectIcon; },
        incorrectIconInvisible: () => { return incorrectIconInvisible; }
    }
})();