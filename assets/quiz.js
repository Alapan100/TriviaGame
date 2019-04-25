$(document).ready(function () {
  "use strict";

  var questions = [{
    question: "Which city does Bruce Wayne protect as he moonlights as the superhero known as Batman?",
    choices: ['Central-City', 'Gotham-City', 'Metropolis', 'Opal-City', 'Star-City'],
    correctAnswer: 1
  }, {
    question: "From which nation does Princess Diana hail from?",
    choices: ['Bialya', 'Markovia', 'Qurac', 'Santa-Prisca', 'Themyscira'],
    correctAnswer: 4
  }, {
    question: "Which character is living in the Kent farm as Connor Kent, under the giuse of Clark Kent's cousin?",
    choices: ['Kon-El/Superboy', 'Mon-El/Valor', 'Kara Zor-EL/Supergirl', 'Kem-El/Eradicator', 'Thara Ak-Var/Flamebird'],
    correctAnswer: 0
  }, {
    question: "Which Lantern Corps is Hal Jordan a part of?",
    choices: ['White-Lanterns', 'Blue-Lanterns', 'Yellow-Lanterns', 'Green-Lanterns', 'Red-Lanterns'],
    correctAnswer: 3
  }, {
    question: "Who is Darkseid?",
    choices: ['Guardian of Light', 'Sorcerer-Supreme', 'Emissary of The-Unknown', 'Userper of the Dead', 'Tyrant Ruler of Apokolips'],
    correctAnswer: 4
  }, {
    question: "Where did Damian Wayne grow up?",
    choices: ['Lian Yu', 'Corto Maltese', 'Nanda Parbat', 'Thalarion', 'Kahndaq'],
    correctAnswer: 2
  }, {
    question: "Which Scientific Research facility was responsible for creating a clone of Superman using Superman's and Lex Luthor's DNA?",
    choices: ['S.T.A.R. Labs', 'Stagg Industries', 'Cadmus Laboratories', 'LexCorp', 'Dayton Labs'],
    correctAnswer: 2
  }, {
    question: "Which character murdered Nora Allen?",
    choices: ['Mark Mardon/Weather-Wizard', 'Eobard Thawne/Reverse-Flash', 'Sam Scudder/Mirror-Master', 'Leonard Snart/Captain-Cold', 'Mick Rory/Heat-Wave'],
    correctAnswer: 1
  }, {
    question: "In the New 52 continuity, where is Cyborg's exoskeleton from?",
    choices: ['Krypton', 'Daxam', 'Tamaran', 'Rimbor', 'Maltus'],
    correctAnswer: 0
  }, {
    question: "Who is Arthur Curry's mother?",
    choices: ['Queen Clea', 'Queen Mera', 'Queen Zazzala', 'Queen Atlanna', 'Queen Hippolyta'],
    correctAnswer: 3
  }];

  var sec = 120;
  var time = setInterval(myTimer, 1000);

  function myTimer() {
    document.getElementById('timer').innerHTML = sec + "sec left";
    sec--;
    if (sec == -1) {
      clearInterval(time);
      alert("Time out!");
    }
  }


  var questionCounter = 0;
  var selections = [];
  var quiz = $('.content');

  displayNext();

  // Click handler for the 'next' button
  $('#next').on('click', function (e) {
    e.preventDefault();

    setTimeout("CheckTime()", 1000);

    // Suspend click listener during fade animation
    if (quiz.is(':animated')) {
      return false;
    }
    choose();

    // If no user selection, progress is stopped
    if (isNaN(selections[questionCounter])) {
      $('#warning').text('Please make a selection!');
    } else {
      questionCounter++;
      displayNext();
      $('#warning').text('');
    }
  });

  // Click handler for the 'prev' button
  $('#prev').on('click', function (e) {
    e.preventDefault();

    if (quiz.is(':animated')) {
      return false;
    }
    choose();
    questionCounter--;
    displayNext();
  });

  // Click handler for the 'Start Over' button
  $('#start').on('click', function (e) {
    e.preventDefault();

    if (quiz.is(':animated')) {
      return false;
    }
    questionCounter = 0;
    selections = [];
    displayNext();
    $('#start').hide();
  });

  // Creates and returns the div that contains the questions and 
  // the answer selections
  function createQuestionElement(index) {
    var qElement = $('<div>', {
      id: 'question'
    });

    var header = $('<h2>Question ' + (index + 1) + ':</h2>');
    qElement.append(header);

    var question = $('<p>').append(questions[index].question);
    qElement.append(question);

    var radioButtons = createRadios(index);
    qElement.append(radioButtons);
    // this is new
    var warningText = $('<p id="warning">');
    qElement.append(warningText);

    return qElement;

  }

  // Creates a list of the answer choices as radio inputs
  function createRadios(index) {
    var radioList = $('<ul>');
    var item;
    var input = '';
    for (var i = 0; i < questions[index].choices.length; i++) {
      item = $('<li>');
      input = '<input type="radio" name="answer" value=' + i + ' />';
      input += questions[index].choices[i];
      item.append(input);
      radioList.append(item);
    }
    return radioList;
  }

  function choose() {
    selections[questionCounter] = +$('input[name="answer"]:checked').val();
  }

  function displayNext() {
    quiz.fadeOut(function () {
      $('#question').remove();

      if (questionCounter < questions.length) {
        var nextQuestion = createQuestionElement(questionCounter);
        quiz.append(nextQuestion).fadeIn();
        if (!(isNaN(selections[questionCounter]))) {
          $('input[value=' + selections[questionCounter] + ']').prop('checked', true);
        }

        if (questionCounter === 1) {
          $('#prev').show();
        } else if (questionCounter === 0) {

          $('#prev').hide();
          $('#next').show();
        }
      } else {
        var scoreElem = displayScore();
        quiz.append(scoreElem).fadeIn();
        $('#next').hide();
        $('#prev').hide();
        $('#start').show();
      }
    });
  }

  function displayScore() {
    var score = $('<h3>', { id: 'question' });

    var numCorrect = 0;
    for (var i = 0; i < selections.length; i++) {
      if (selections[i] === questions[i].correctAnswer) {
        numCorrect++;
      }
    }
    var percentage = numCorrect / questions.length;
    if (percentage >= 0.9) {
      score.append('Incredible! You got ' + numCorrect + ' out of ' +
        questions.length + ' questions right!');
    }

    else if (percentage >= 0.7) {
      score.append('Good job! You got ' + numCorrect + ' out of ' +
        questions.length + ' questions right!');
    }

    else if (percentage >= 0.5) {
      score.append('You got ' + numCorrect + ' out of ' +
        questions.length + ' questions right.');
    }

    else {
      score.append('You only got ' + numCorrect + ' out of ' +
        questions.length + ' right. Want to try again?');
    }
    return score;
  }
});