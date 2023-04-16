import { quizzes, QUESTION_TYPES, MC_ANSWER_TYPES } from './mock_data.js';
import { renderRoleChoice } from './main.js';

function renderQuizListStudent(quizzes) {
  const app = document.querySelector('.app');
  app.innerHTML = `
    <div class="quiz-list-container">
      <button class="quiz-list__back-btn btn btn-red">Go back</button>

      <p class="quiz-list__heading"><i class="quiz-list__heading-icon fa-solid fa-caret-down"></i>Available quizzes</p>
      
      <ul class="quiz-list__list"></ul>
    </div>
  `;

  // Render each quiz into DOM
  const ulQuizList = document.querySelector('.quiz-list__list');
  const HTMLs = quizzes.map((quiz, index) => {
    let totalScores = 0;
    quiz.questions.forEach((question) => {
      totalScores += question.score;
    });

    return `
      ${
        !quiz.detail.isActive
          ? ''
          : `
              <li class="quiz-list__item" data-id="${quiz.id}">
                <i class="quiz-list__item-icon fa-solid fa-rocket"></i>
                <div class="quiz-list__item-info">
                  <h3 class="quiz-list__item-name">${quiz.detail.name}</h3>
                  <div class="quiz-list__item-detail">
                    <span class="quiz-list__item-detail-num">${totalScores}</span>
                    <span class="quiz-list__item-detail-text">pts</span>
                    <span class="quiz-list__item-detail-separator"></span>
                    <span class="quiz-list__item-detail-num">${quiz.questions.length}</span>
                    <span class="quiz-list__item-detail-text">Questions</span>
                  </div>
                </div>
                <i class="quiz-list__item-status-icon fa-solid fa-circle-check"></i>
                <i class="quiz-list__item-status-icon quiz-list__item-status-icon--disabled fa-solid fa-ban"></i>
              </li>
          `
      }
    `;
  });
  ulQuizList.innerHTML = HTMLs.join('');
  if (quizzes.length === 0) {
    ulQuizList.innerHTML = `
      <div class="quiz-list__nothing-show">Good job, no more quiz to do!</div>
    `;
  }

  // Event handler: Quiz taking, go back
  const liQuizItems = document.querySelectorAll('.quiz-list__item');
  const backBtn = document.querySelector('.quiz-list__back-btn');
  liQuizItems.forEach((liQuizItem) => {
    const quizId = liQuizItem.dataset.id;
    const quizName = liQuizItem.querySelector('.quiz-list__item-name');

    quizName.addEventListener('click', () => {
      renderQuizTaking(quizzes.find((quiz) => quiz.id === quizId));
    });
  });
  backBtn.addEventListener('click', () => {
    renderRoleChoice();
  });
}
// renderQuizListStudent();

function renderQuizTaking(quiz) {
  const app = document.querySelector('.app');
  app.innerHTML = `
    <div class="quiz-taking-container">
      <p class="quiz-taking__heading">${quiz.detail.name}</p>
      <p class="quiz-taking__sub-heading">Instruction: ${quiz.detail.instruction}</p>

      <ul class="quiz-taking__list" data-quizId="${quiz.id}"></ul>

      <div class="quiz-taking__quiz-control">
        <button class="btn btn-red quiz-taking__cancel-quiz-btn">Cancel</button>
        <button class="btn btn-blue quiz-taking__submit-quiz-btn">Submit Quiz</button>
      </div>
    </div>
  `;

  // Render each quiz into DOM
  const ulQuizList = document.querySelector('.quiz-taking__list');
  const HTMLs = quiz.questions.map((question, questionIndex) => {
    if (question.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
      return `
        <li class="quiz-taking__question" data-questionId="${
          question.id
        }" data-questionType="${
        question.type
      }" data-index="${questionIndex}" data-score="${question.score}">
          <div class="quiz-taking__question-header">
            <span class="quiz-taking__question-question-num">Question ${
              questionIndex + 1
            }</span>
            <div class="quiz-taking__question-question-score">
              pts<span class="quiz-taking__question-question-score-num"
                >${question.score}</span
              >
            </div>
          </div>

          <div class="quiz-taking__question-body">
            <h3 class="quiz-taking__question-question">${question.question}</h3>
            ${question.answers
              .map((answer, answerIndex) => {
                return `
                <div class="quiz-taking__checkbox-input-group" data-type="${
                  answer.type
                }">
                  <input class="quiz-taking__checkbox-input" type="checkbox" id="${
                    String(question.id) + '-' + String(answerIndex)
                  }">
                  <label class="quiz-taking__label-for-checbox" for="${
                    String(question.id) + '-' + String(answerIndex)
                  }">${answer.body}</label>
                </div>
              `;
              })
              .join('')}
            
          </div>
        </li>
      `;
    } else if (question.type === QUESTION_TYPES.SHORT_ANSWER) {
      return `
        <li class="quiz-taking__question" data-questionId="${
          question.id
        }" data-questionType="${
        question.type
      }" data-index="${questionIndex}" data-score="${question.score}">
          <div class="quiz-taking__question-header">
            <span class="quiz-taking__question-question-num">Question ${
              questionIndex + 1
            }</span>
            <div class="quiz-taking__question-question-score">
              pts<span class="quiz-taking__question-question-score-num"
                >${question.score}</span
              >
            </div>
          </div>

          <div class="quiz-taking__question-body">
            <h3 class="quiz-taking__question-question">${question.question}</h3>
            <textarea placeholder="Enter your answer..." rows="10" class="quiz-taking__answer-textarea"></textarea>
          </div>
        </li>
      `;
    } else if (question.type === QUESTION_TYPES.MATCHING) {
      return `
        <li class="quiz-taking__question" data-questionId="${
          question.id
        }" data-questionType="${
        question.type
      }" data-index="${questionIndex}" data-score="${question.score}">
          <div class="quiz-taking__question-header">
            <span class="quiz-taking__question-question-num">Question ${
              questionIndex + 1
            }</span>
            <div class="quiz-taking__question-question-score">
              pts<span class="quiz-taking__question-question-score-num"
                >${question.score}</span
              >
            </div>
          </div>

          <div class="quiz-taking__question-body">
            <h3 class="quiz-taking__question-question">Match the following facts:</h3>
            ${question.matchingList
              .map((matching, matchingIndex) => {
                return `
                <div class="quiz-taking__matching-group" data-matchingIndex={matchingIndex}>
                  <span class="quiz-taking__left-matching-text">${
                    matching[0]
                  }</span>
                  <select class="quiz-taking__right-matching-select" data-correctAnswer="${
                    matching[1]
                  }">
                    '<option value="">[ Choose ]</option>'+ ${shuffle(
                      question.matchingList
                        .map((matchingInner) => {
                          return `
                            <option value="${matchingInner[1]}">${matchingInner[1]}</option>
                          `;
                        })
                        .concat(
                          question.distractors.map((distractor) => {
                            return `
                              <option value="distractor">${distractor}</option>
                            `;
                          })
                        )
                    )}
                  </select>
                </div>
              `;
              })
              .join('')}
          </div>
        </li>
      `;
    }
  });
  ulQuizList.innerHTML = HTMLs.join('');

  // Handle event: Cancel, submit Quiz
  const cancelQuizBtn = document.querySelector('.quiz-taking__cancel-quiz-btn');
  const submitQuizBtn = document.querySelector('.quiz-taking__submit-quiz-btn');
  cancelQuizBtn.addEventListener('click', () => {
    renderQuizListStudent(quizzes);
  });
  submitQuizBtn.addEventListener('click', () => {
    // Calculate points
    const liQuestionItems = document.querySelectorAll('.quiz-taking__question');
    const scores = [];
    liQuestionItems.forEach((liQuestionItem, questionIndex) => {
      if (
        liQuestionItem.dataset.questiontype === QUESTION_TYPES.MULTIPLE_CHOICE
      ) {
        const checkboxGroups = liQuestionItem.querySelectorAll(
          '.quiz-taking__checkbox-input-group'
        );
        let scoresForAllCheckboxs = 0;
        let totalAnswer = quiz.questions[questionIndex].answers.length;
        let totalCorrectAnswer = 0;
        let totalPossibleAnswer = 0;

        // Get number of correct answer
        quiz.questions[questionIndex].answers.forEach((answer) => {
          if (answer.type === MC_ANSWER_TYPES.CORRECT) totalCorrectAnswer++;
        });
        totalPossibleAnswer = totalAnswer - totalCorrectAnswer;

        // Get scores
        checkboxGroups.forEach((checkboxGroup) => {
          const checkboxInput = checkboxGroup.querySelector(
            '.quiz-taking__checkbox-input'
          );

          if (checkboxInput.checked) {
            if (checkboxGroup.dataset.type === MC_ANSWER_TYPES.POSSIBLE) {
              scoresForAllCheckboxs -=
                Number(liQuestionItem.dataset.score) / totalPossibleAnswer;
            } else if (checkboxGroup.dataset.type === MC_ANSWER_TYPES.CORRECT) {
              scoresForAllCheckboxs +=
                Number(liQuestionItem.dataset.score) / totalCorrectAnswer;
            }
          }
        });

        if (scoresForAllCheckboxs < 0) scoresForAllCheckboxs = 0;
        scores.push(scoresForAllCheckboxs);
      } else if (
        liQuestionItem.dataset.questiontype === QUESTION_TYPES.SHORT_ANSWER
      ) {
        const answerTextArea = liQuestionItem.querySelector(
          '.quiz-taking__answer-textarea'
        );

        if (answerTextArea.value.trim() != '') {
          scores.push(Number(liQuestionItem.dataset.score));
        } else {
          scores.push(0);
        }
      } else if (
        liQuestionItem.dataset.questiontype === QUESTION_TYPES.MATCHING
      ) {
        const matchingGroups = liQuestionItem.querySelectorAll(
          '.quiz-taking__matching-group'
        );
        let scoresForAllMatchingGroups = 0;

        matchingGroups.forEach((matchingGroup) => {
          const selectElement = matchingGroup.querySelector(
            '.quiz-taking__right-matching-select'
          );

          if (
            selectElement.dataset.correctanswer ===
            selectElement.options[selectElement.selectedIndex].text
          ) {
            scoresForAllMatchingGroups +=
              Number(liQuestionItem.dataset.score) / matchingGroups.length;
          }
        });

        scores.push(scoresForAllMatchingGroups);
      }
    });

    renderQuizResult(quiz, scores);
  });
}
// renderQuizTaking(quizzes[0]);

function renderQuizResult(quiz, scores) {
  const app = document.querySelector('.app');
  let totalResultScore = 0;
  let totalQuizScore = 0;
  app.innerHTML = `
    <div class="quiz-result-container">
      <p class="quiz-result__heading">${quiz.detail.name}</p>

      <ul class="quiz-result__score-list">
        ${scores.map((score, scoreIndex) => {
          totalResultScore += score;
          totalQuizScore += quiz.questions[scoreIndex].score;

          return `
            <li class="quiz-result__score-item">
              <span class="quiz-result__question-label">Question ${
                scoreIndex + 1
              }:</span>
              <span class="quiz-result__score-num">${score.toFixed(2)}</span>
              <span class="quiz-result__score-separator">/</span>
              <span class="quizx-result__total-score-num">${quiz.questions[
                scoreIndex
              ].score.toFixed(2)}</span>
              <span class="quiz-result__pts-text">pts</span>
            </li>
          `;
        }).join('')}
      </ul>
      
      <div class="quiz-result__result-container">
        Total:
        <span class="quiz-result__total-score-result-num">${totalResultScore.toFixed(
          2
        )}</span>
        <span class="quiz-result__total-score-reparator">/</span>
        <span class="quiz-result__total-score-quiz-num">${totalQuizScore.toFixed(
          2
        )}</span>
        <span class="quiz-result__total-score-pts">pts</span>
        <span class="quiz-result__total-score-percentage">(${(
          (totalResultScore / totalQuizScore) *
          100
        ).toFixed(2)}%)</span>
      </div>
      
      <div class="quiz-result__quiz-control">
        <button class="btn btn-red quiz-result__back-quiz-btn">Go back</button>
        <button class="btn btn-blue quiz-result__take-quiz-btn">Take again</button>
      </div>
    </div>
  `;

  // Handle event: Go back, Take quiz again
  const backBtn = document.querySelector('.quiz-result__back-quiz-btn');
  const takeAgainBtn = document.querySelector('.quiz-result__take-quiz-btn');
  backBtn.addEventListener('click', () => {
    renderQuizListStudent(quizzes);
  });
  takeAgainBtn.addEventListener('click', () => {
    renderQuizTaking(quiz);
  });
}
// renderQuizResult(quizzes[0], [0, 0, 0]);

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export { renderQuizListStudent };
