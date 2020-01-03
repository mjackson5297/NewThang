// Events to be executed on load
document.addEventListener("DOMContentLoaded", function () {
  // *** Uncomment the line below for debugging or produciton
  // scorm.init();
});

//  Shorthand for using SCORM functions
var scorm = pipwerks.SCORM;

// Tracks the situations the user is currently on
var currentSituation = "";

// Array containing situations that have been loaded
var loadedSituations = [];

// TODO: Rethink this
for (var i = 1; i <= 6; i++) {

  // Markup for links in menu
  var menuItem = '<a id="situation' + i + 'link" class="disabled d-flex flex-row align-items-center justify-content-between m-2 p-1"  href="#" onclick="navigateTo(' + i + ');">' + '<span class="menu-item font-weight-bold text-primary"> Situation ' + i + ' </span> <img src="imgs/icon-check-circle.svg"' +
    'class="situation' + i + 'check check hidden" ></a>';

  // Adds all links to menu
  document.getElementById('menu-content').innerHTML += menuItem;
}

// Navigates to the specified situation
function navigateTo(situation) {

  // Removes '.active' from the current slide
  document.querySelector('.slide.active').classList.remove("active");

  // Adds '.active' to the specified situation
  document.getElementById('situation' + situation).classList.add("active");

  // Hides the menu
  document.getElementById('menu').classList.add("d-none");

  // Assesses current situation
  getCurrentSituation();
}

// Unlocks Navigation for buttons and also menu links - executed when all answers are correct
function unlockNavigation() {

  // Removes '.disabled' from forward button
  // document.querySelector('.active > .slide-content > .navigation-controls').classList.remove('disabled');
  document.querySelector('.active > .navigation-controls').classList.remove('disabled');

  // Unlocks Navigation Links in Menu
  if (currentSituation !== "") {
    document.getElementById('situation' + currentSituation + 'link').classList.remove('disabled');
    document.querySelector('.situation' + currentSituation + 'check').classList.remove('hidden');
  }
}

// Sets the exercise to "complete"
function setComplete() {
  scorm.data.set("cmi.completion_status", "completed");
  scorm.data.save();
  scorm.terminate();
}

// Swaps 2 classes on a particular ID
function swapClasses(targetElement, classToRemove, classToAdd) {
  targetElement.classList.remove(classToRemove);
  targetElement.classList.add(classToAdd);
}

// Toggle class on specified ID
function toggleClass(idToToggle, classToToggle) {
  document.getElementById(idToToggle).classList.toggle(classToToggle);
}

// Removes class from specified ID
function removeClass(targetID, classToRemove) {
  document.getElementById(targetID).classList.remove(classToRemove);
}

// Toggle notes on 'N' key
window.addEventListener('keydown', function (event) {
  if (event.keyCode === 78) {
    toggleClass('notes', 'd-none');
  }
});

// Appends answers to the current situation's slides
function appendAnswers() {
  loadedSituations.push(currentSituation);
  for (var i = 0; i < data.length; i++) {
    if (data[i].s === currentSituation) {
      var optionsToAppend = "<option></option>";
      for (var j = 0; j < data[i].a.length; j++) {
        var questionToAppend = document.getElementById("sit" + data[i].s + "-" + data[i].f + "-" + data[i].q);
        var checkBox = '<span class="checkmark"></span><span>' + data[i].l + "</span>";
        optionsToAppend += "<option>" + data[i].a[j] + "</option>";
      }
      "dropdown" === data[i].t ? questionToAppend.innerHTML += optionsToAppend : questionToAppend.innerHTML += checkBox;
      (data[i].h ? questionToAppend.setAttribute("title", data[i].h) : {});
    }
  }
};

// Checks Answers on current slide
// TODO: This needs reworking very badly
function checkAnswers(formToCheck) {
  var checkedQuestions = 0;
  var correctAnswers = 0;

  // Loops through all data
  for (var i = 0; i < data.length; i++) {
    var currentQuestion = 'sit' + data[i].s + '-' + data[i].f + '-' + data[i].q;

    // If the question's situation is the current situation and the form is the argument
    if (data[i].s === currentSituation && data[i].f == formToCheck) {
      checkedQuestions++;

      // if the question's type is a dropdown
      if (data[i].t == 'dropdown') {
        var dropdownToCheck = document.getElementById(currentQuestion);
        var selectedAnswer = dropdownToCheck.options[dropdownToCheck.selectedIndex].innerText;

        // if the question is correct
        if (selectedAnswer == data[i].c) {
          swapClasses(dropdownToCheck, "incorrect", "correct");
          correctAnswers++;
        }

        // If the question is incorrect
        else {
          swapClasses(dropdownToCheck, "correct", "incorrect");
        }
      }

      // If the question's type is a checkbox
      else if (data[i].t == 'checkbox') {
        var checkboxToCheck = document.querySelector('#' + currentQuestion + '>.checkmark');
        var checkboxInput = document.querySelector('#' + currentQuestion + '>input').checked.toString();

        // If the question is correct
        if (checkboxInput == data[i].c) {
          swapClasses(checkboxToCheck, "incorrect", "correct");
          correctAnswers++;
        }

        // If the question is incorrect
        else {
          swapClasses(checkboxToCheck, "correct", "incorrect");
        }
      }
    }
  }

  if (checkedQuestions === correctAnswers) {
    unlockNavigation();
  }
}

// Imports answers from a previous form
// TODO: Rework this bad mammajamma
function importAnswers(formToImport) {
  for (var i = 0; i < data.length; i++) {

    if (data[i].f === formToImport) {
      var answerToImport = document.getElementById('sit' + data[i].s + '-' + formToImport + '-' + data[i].q);
      var importedAnswer = document.getElementById('import-sit' + data[i].s + '-' + formToImport + '-' + data[i].q);

      if (data[i].t === "dropdown") {
        importedAnswer.innerText = answerToImport.value;
      } else if (data[i].t === "checkbox") {
        checkedStatus = document.querySelector('#sit' + data[i].s + '-' + formToImport + '-' + data[i].q + '>input').checked;
        if (checkedStatus) {
          importedAnswer.innerHTML = '<label class="check-container disabled opaque"><input autocomplete="off" checked="checked" type="checkbox"> <span class="checkmark secondary-check"></span> <span>' + data[i].l + '</span></label>';
        } else if (!checkedStatus) {
          importedAnswer.innerHTML = '<label class="check-container disabled opaque"><input autocomplete="off" type="checkbox"> <span class="checkmark secondary-check"></span> <span>' + data[i].l + '</span></label>';
        }
      }
    }
  }
}

// Assesses the current situation the user is on
function getCurrentSituation() {
  var activeSlide = document.getElementsByClassName("active")[0].id;

  // If the active slide has an ID containing the string "situation"
  if (activeSlide !== undefined && activeSlide.indexOf("situation") !== -1) {

    // Remove the substrings "situation" and "end" from that ID
    currentSituation = activeSlide.replace("situation", "").replace("end", "");

    // Changes situation number on navbar based on current situation
    document.getElementById("courseSubtitle").innerHTML = '| Situation ' + currentSituation;

    // If the current situation isn't in the "loadedSituations" array, append the question content
    if (loadedSituations.indexOf(currentSituation) == -1) {
      appendAnswers();
    }
  }
}

// 
function loadNextSlide() {
  var currentSlide = document.querySelector('.active.slide');
  var nextSlide = currentSlide.nextElementSibling;

  // Remove '.active' from the current slide, add it to the next
  currentSlide.classList.remove("active");
  nextSlide.classList.add("active");

  // Check if the situation changesd
  getCurrentSituation();
}

// Clears all dropdowns and checkboxes on a specified form
function clearForm(formToClear) {
  for (var i = 0; i < data.length; i++) {
    var currentQuestion = 'sit' + data[i].s + '-' + data[i].f + '-' + data[i].q;
    if (data[i].s === currentSituation && data[i].f == formToClear) {
      if (data[i].t == 'dropdown') {
        var dropdownToCheck = document.getElementById(currentQuestion);
        dropdownToCheck.selectedIndex = 0;
        dropdownToCheck.classList.remove("correct", "incorrect");
      } else if (data[i].t == 'checkbox') {
        var checkboxToCheck = document.querySelector('#' + currentQuestion + '>.checkmark');
        document.querySelector('#' + currentQuestion + '>input').checked = false;
        checkboxToCheck.classList.remove("correct", "incorrect");
      }
    }
  }
}