// ** quizSelection.js **
// These functions involve the quiz selection page, which allows users to pick a
// grade, word list, and a quiz type before launching the quiz.

"use strict";  // Using strict catches more ambiguous code that can lead to issues

// As soon as the doc is ready, setup the voice, theme and load the words. Once words are loaded, load the selection page.
$(document).ready(function (e) {
    setVoiceSettings();
    setTheme();
    setQuizType();
    // Use jQuery AJAX getJSON call to populate the word list from the words.json file.
    $.getJSON("js/words.json", function (words) {
        selected.createListsByGrade(words);
        loadSelectPage();  // The select page is the default page to start with.
    });
});


// Called after doc/words are ready and when "Select List" (or "SpellBound") is clicked
function loadSelectPage() {
    // Use jQuery AJAX load call to load the body content.
    $('#body-content').load("quizSelection.html", function () {

        // 'Select Grade' clicked on 'Select List' page.
        $("#gradeSelection").on('click', 'a', function () {
            selected.setGrade($(this).text());
            $("#dropdownMenuGrades").text(selected.grade());
            setWordListsByGrade(true);
            $("#dropdownMenuLists").text(selected.listName());
            setupWordTable();
        });

        // Note: "$("#listSelection a").click(function()"  doesn't work when lists item <li> populated 
        // through ajax call, so you have to delegate the event to the closest static parent with .on() jQuery method.
        // 'Select List' clicked on 'Select List' page.
        $("#listSelection").on('click', 'a', function () {
            selected.setListName($(this).text());
            $("#dropdownMenuLists").text(selected.listName());
            setWordListsByGrade(false);
            setupWordTable();
        });

        // 'Select Quiz' clicked on 'Select List' page.
        $("#quizSelection").on('click', 'a', function () {
            selected.setQuizType($(this).text());
            $("#dropdownMenuQuizzes").text(selected.quizType());
            setQuizTypeOnMenuBar();
            setupWordTable();
        });

        // When loading the page, populate the dropdowns with the current user selections.
        $("#dropdownMenuGrades").text(selected.grade());
        setWordListsByGrade(false);
        $("#dropdownMenuLists").text(selected.listName());
        $("#dropdownMenuQuizzes").text(selected.quizType());
        setupWordTable();
    });
}

// Populate the word list dropdown based on the grade.
function setWordListsByGrade(gradeChanged) {
    let listNamesForSelectedGrade = selected.setSelectedWords(gradeChanged);

    $("#listDropdownItems").empty();
    listNamesForSelectedGrade.forEach(function (listItem) {
        $("<a class='dropdown-item' href='#!'></a>").appendTo("#listDropdownItems").text(listItem);
    });
}

// Populate the word table with the list of words/definitions based on the selected list.
function setupWordTable() {
    var table = $('#selectWordsTable');
    $("#selectWordsTableBody").empty();
    var rows = setSelectedWordTableRows();

    $.each(rows, function (rowIndex, row) {
        var lastRow = $('<tr/>').appendTo(table.find('tbody:last'));
        //lastRow.append($("<td class='text-right pr-4'>").text(row[0]));
        lastRow.append($("<td class='text-center'>").text(row[0]));
        lastRow.append($("<td/>").text(row[1]));
    });
}

// Use module pattern to create a "class" that separates private access to the selected state data.
// This also provides private control over word list creation and other word-selection activities.
var selected = (function () {
    var grade = "3rd";
    var gradeInt = 3;
    var listName = "3rd - 2018 - words 18-34";
    var quizType = "Spelling";
    // Array of objects. An object for each grade 0 to 9. Each object has keys == <list name>, values == <array of Word objects>
    var listsByGrade = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    var selectedWords;

    function Word(name, partOfSpeech, definition, example, synonyms) {
        this.name = name;
        this.partOfSpeech = partOfSpeech;
        this.definition = definition;
        this.example = example;
        this.synonyms = synonyms;
    }

    function setGrade(newGrade) {
        grade = newGrade;
        gradeInt = parseInt(grade.charAt(0), 10);
    }
    function setListName(newListName) { listName = newListName; }
    function setQuizType(newQuizType) { quizType = newQuizType; }

    function setSelectedWords(gradeChanged) {
        let listNamesForSelectedGrade = Object.keys(listsByGrade[gradeInt]);
        if (gradeChanged) { listName = listNamesForSelectedGrade[0]; }
        selectedWords = listsByGrade[gradeInt][listName];
        return listNamesForSelectedGrade;
    }

    function createListsByGrade(words) {
        $.each(words, function (index, word) {
            var newWord = new Word(word.Word, word.PartOfSpeech, word.Definition, word.Example, word.Synonyms);

            if (listsByGrade[word.Grade][word.List] == undefined) {
                listsByGrade[word.Grade][word.List] = [newWord];
            }
            else {
                listsByGrade[word.Grade][word.List].push(newWord);
            }
        });
    }

    return {
        grade: function () { return grade; },
        setGrade: function (newGrade) { return setGrade(newGrade); },
        listName: function () { return listName; },
        setListName: function (newListName) { return setListName(newListName); },
        quizType: function () { return quizType; },
        setQuizType: function (newQuizType) { return setQuizType(newQuizType); },
        listsByGrade: function () { return listsByGrade; },
        createListsByGrade: function (words) { return createListsByGrade(words); },
        setSelectedWords: function (gradeChanged) { return setSelectedWords(gradeChanged); },
        selectedWords: function () { return selectedWords; },
        length: function () { return selectedWords.length; }
    }
})();

