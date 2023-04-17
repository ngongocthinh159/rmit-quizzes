import { quizzes, QUESTION_TYPES, MC_ANSWER_TYPES } from './mock_data.js';
import { renderQuizListStudent } from './student.js';
import { storeQuizzes, getQuizzes, QUIZZES_KEY } from './storage.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

function renderRoleChoice() {
  const app = document.querySelector('.app');
  app.innerHTML = `
    <div class="role-choice-container">
      <div class="role-choice__wrapper">
        <p class="role-choice__heading">Please choose a mode</p>
        <div class="role-choice__lecturer">
          I'm a lecturer
          <i class="role-choice__icon fa-solid fa-pen-nib"></i>
        </div>
        <div class="role-choice__student">
          I'm a student
          <i class="role-choice__icon fa-solid fa-pen"></i>
        </div>
      </div>
    </div>
  `;

  const lecturer = document.querySelector('.role-choice__lecturer');
  const student = document.querySelector('.role-choice__student');

  lecturer.addEventListener('click', () => {
    renderQuizListLecturer(quizzes);
  });

  student.addEventListener('click', () => {
    renderQuizListStudent(quizzes);
  });
}
renderRoleChoice();
// renderQuizListStudent(quizzes);

function renderQuizListLecturer(quizzes) {
  const app = document.querySelector('.app');
  app.innerHTML = `
    <div class="quiz-list-container">
      <button class="quiz-list__back-btn btn btn-red">Go back</button>

      <p class="quiz-list__heading"><i class="quiz-list__heading-icon fa-solid fa-caret-down"></i>Practice quizzes</p>
      
      <ul class="quiz-list__list"></ul>

      <div class="quiz-list__control">
        <button class="btn btn-blue quiz-list__btn-add-new">+ Add new</button>
      </div>
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
      <li class="quiz-list__item${
        quiz.detail.isActive ? '' : ' quiz-list__item--disabled'
      }">
        <i class="quiz-list__item-icon fa-solid fa-rocket"></i>
        <div class="quiz-list__item-info">
          <h3 class="quiz-list__item-name">${quiz.detail.name}</h3>
          <div class="quiz-list__item-detail">
            <span class="quiz-list__item-detail-num">${totalScores}</span>
            <span class="quiz-list__item-detail-text">pts</span>
            <span class="quiz-list__item-detail-separator"></span>
            <span class="quiz-list__item-detail-num">${
              quiz.questions.length
            }</span>
            <span class="quiz-list__item-detail-text">Questions</span>
          </div>
        </div>
        <i class="quiz-list__item-status-icon fa-solid fa-circle-check"></i>
        <i class="quiz-list__item-status-icon quiz-list__item-status-icon--disabled fa-solid fa-ban"></i>
        <label for="checkbox-for-menu-${index}">
          <i class="quiz-list__ellipse-icon fa-solid fa-ellipsis-vertical">
            <input id="checkbox-for-menu-${index}" type="checkbox" hidden/>
            <ul class="quiz-list__tool-menu">   
              <li class="quiz-list__tool-menu-item">Edit quiz</li>
              <li class="quiz-list__tool-menu-item">${
                quiz.detail.isActive ? 'Disable quiz' : 'Enable quiz'
              }</li>
            </ul>
          </i> 
        </label>
      </li>
    `;
  });
  ulQuizList.innerHTML = HTMLs.join('');
  if (quizzes.length === 0) {
    ulQuizList.innerHTML = `
      <div class="quiz-list__nothing-show">Nothing to show, please make a new quiz!</div>
    `;
  }

  // Event handler: Ellipse icon, Tool menu
  const quizItems = [...document.querySelectorAll('.quiz-list__item')];
  quizItems.forEach((quizItem, index) => {
    const currentMenu = quizItem.querySelector('.quiz-list__tool-menu');
    const checkBox = quizItem.querySelector(`#checkbox-for-menu-${index}`);
    const heading = quizItem.querySelector('.quiz-list__item-name');

    // Handle heading click
    heading.addEventListener('click', () => {
      renderEditQuiz(quizzes[index], index, false, true);
    });

    // Handle Show/Hide menu
    checkBox.addEventListener('change', () => {
      if (checkBox.checked) {
        currentMenu.style.display = 'block';
      } else {
        currentMenu.style.display = 'none';
      }
    });

    // Handle menu item click
    const menuItems = [
      ...currentMenu.querySelectorAll('.quiz-list__tool-menu-item'),
    ];
    menuItems.forEach((menuItem) => {
      menuItem.addEventListener('click', (e) => {
        switch (menuItem.innerText) {
          case 'Edit quiz':
            renderEditQuiz(quizzes[index], index, false, true);
            break;
          case 'Disable quiz':
            quizzes[index].detail.isActive = false;
            storeQuizzes(quizzes);
            renderQuizListLecturer(quizzes);
            break;
          case 'Enable quiz':
            quizzes[index].detail.isActive = true;
            storeQuizzes(quizzes);
            renderQuizListLecturer(quizzes);
            break;
          default:
            break;
        }
      });
    });
  });

  // Handle add new btn
  const addNewBtn = document.querySelector('.quiz-list__btn-add-new');
  addNewBtn.addEventListener('click', () => {
    renderEditQuiz(
      {
        id: uuidv4(),
        detail: {
          name: 'Sample quiz name',
          instruction: 'Quiz instruction',
          timeLimit: 1000 * 60 * 40,
          isActive: true,
        },
        questions: [
          {
            id: uuidv4(),
            type: QUESTION_TYPES.SHORT_ANSWER,
            score: 10,
            question: '',
          },
        ],
      },
      quizzes.length,
      true,
      true
    );
  });

  // Handle back btn
  const backBtn = document.querySelector('.quiz-list__back-btn');
  backBtn.addEventListener('click', () => {
    renderRoleChoice();
  });
}
// renderQuizListLecturer(quizzes);

function renderEditQuiz(
  quiz,
  quizIndex,
  isCreateQuiz = false,
  showQuizBody = true
) {
  // Quiz index is the index of the quiz is being editted
  const app = document.querySelector('.app');
  app.innerHTML = `
    <div class="quiz-edit-container">
      <p class="quiz-edit__heading">Quiz details</p>
      <p class="quiz-edit__quiz-name-container">
        Name:
        <input type="text" class="quiz-edit__quiz-name-input" value="${
          quiz.detail.name
        }"/>
      </p>
      <p class="quiz-edit__quiz-instruction-container">
        Instruction:
        <input type="text" class="quiz-edit__quiz-instruction-input" value="${
          quiz.detail.instruction
        }"/>
      </p>

      
      <div class="quiz-edit__config-container">
        <label for="checkbox-show-quiz-body" class="quiz-edit__label-show-quiz-body">Show quiz body (hide to drag and drop)</label>
        <input type="checkbox" id="checkbox-show-quiz-body" class="quiz-edit__checkbox-show-quiz-body" ${
          showQuizBody ? 'checked' : ''
        }/>
      </div>

      <ul class="quiz-edit__list"></ul>

      <div class="quiz-edit__quiz-control">
        ${
          isCreateQuiz
            ? ''
            : '<button type="button" class="btn btn-red quiz-edit__btn-delete-quiz" data-bs-toggle="modal" data-bs-target="#delete-confirmation-modal">Delete quiz</button>'
        }
        <button class="btn btn-blue-border quiz-edit__btn-cancel-quiz">Cancel</button>
        <button class="btn btn-blue quiz-edit__btn-save-quiz">Save</button>
      </div>

      <div id="delete-confirmation-modal" class="modal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirmation</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Do you want to delete this quiz?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button id="btn-delete-quiz" type="button" class="btn btn-primary" data-bs-dismiss="modal">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Render each question into DOM
  const HTMLs = quiz.questions.map((question, index) => {
    if (question.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
      return `
        <li class="quiz-edit__question" data-id="${question.id}">
          <div class="quiz-edit__question-header">
            ${
              showQuizBody
                ? ''
                : `
                <div class="quiz-edit__drag-drop-wrapper" draggable="true">
                  <i class="quiz-edit__drag-drop-icon fa-solid fa-grip"></i>
                </div>
              `
            }
            
            <span class="quiz-edit__question-question-num">Question ${
              index + 1
            }</span>
            <select
              class="quiz-edit__question-question-type-select"
              name="question_type"
              id=""
            >
              <option value="multiple_choice" selected="selected">Multiple choice</option>
              <option value="short_answer">Short answer</option>
              <option value="matching">Matching</option>
            </select>
            <button class="btn btn-blue quiz-edit__btn-reset">
              <i class="btn-icon fa-solid fa-rotate-right"></i>
              Reset
            </button>
            <div class="quiz-edit__question-question-score">
              pts
              <input
                class="quiz-edit__question-question-score-num"
                type="number"
                name=""
                id=""
                value="${question.score}"
              />
            </div>
          </div>
          <div class="quiz-edit__question-body">
            <div class="quiz-edit__question-body-question ${
              showQuizBody ? '' : 'd-none'
            }">
              <p class="quiz-edit__question-instruction">
                Enter your question and multiple answers, then select the one correct answer.
              </p>
              <p class="quiz-edit__question-question-text">Question:</p>
              <textarea
                name=""
                id=""
                rows="10"
                style="resize: none"
                placeholder="Enter your question..."
                class="quiz-edit__question-textarea-question"
              >${question.question}</textarea>
            </div>
            <div class="quiz-edit__question-body-answer ${
              showQuizBody ? '' : 'd-none'
            }">
              <div class="quiz-edit__question-answer-heading-wrapper">
                <span class="quiz-edit__question-answer-heading">Answers:</span>
              </div>
              <ol class="quiz-edit__question-answer-list">
                ${
                  question.answers &&
                  question.answers
                    .map((answer) => {
                      return `
                      <li class="quiz-edit__question-answer-item ${
                        answer.type === MC_ANSWER_TYPES.CORRECT
                          ? 'quiz-edit__question-answer-item--correct'
                          : ''
                      }">
                        <select class="quiz-edit__question-answer-select" name="" id="">
                          <option value="possible" ${
                            answer.type === MC_ANSWER_TYPES.POSSIBLE
                              ? "selected='selected'"
                              : ''
                          }>Possible answer</option>
                          <option value="correct" ${
                            answer.type === MC_ANSWER_TYPES.CORRECT
                              ? "selected='selected'"
                              : ''
                          }>Correct answer</option>
                        </select>
                        <textarea
                          style="resize: none"
                          name=""
                          id=""
                          rows="3"
                          class="quiz-edit__question-textarea-answer"
                          placeholder="Enter answer..."
                        >${answer.body}</textarea>
                        <div class="quiz-edit__question-answer-control">
                          <button class="btn btn-red quiz-edit__btn-delete-answer ${
                            question.answers.length === 1 ? 'btn--disabled' : ''
                          }">Delete</button>
                          <button class="btn btn-blue quiz-edit__btn-add-answer">+ Add new</button>
                        </div>
                      </li>
                    `;
                    })
                    .join('')
                }
              </ol>
            </div>

            <div class="quiz-edit__question-footer">
              <div class="quiz-edit__question-footer-control">
                <button class="btn btn-red quiz-edit__btn-delete-question 
                ${
                  quiz.questions.length === 1 ? 'btn--disabled' : ''
                }">Delete question</button>
                <button class="btn btn-blue quiz-edit__btn-add-question">+ New question</button>
              </div>
            </div>
          </div>
        </li>
      `;
    } else if (question.type === QUESTION_TYPES.SHORT_ANSWER) {
      return `
        <li class="quiz-edit__question" data-id="${question.id}">
          <div class="quiz-edit__question-header">
            ${
              showQuizBody
                ? ''
                : `
                <div class="quiz-edit__drag-drop-wrapper" draggable="true">
                  <i class="quiz-edit__drag-drop-icon fa-solid fa-grip"></i>
                </div>
              `
            }

            <span class="quiz-edit__question-question-num">Question ${
              index + 1
            }</span>
            <select
              class="quiz-edit__question-question-type-select"
              name="question_type"
              id=""
            >
              <option value="multiple_choice">Multiple choice</option>
              <option value="short_answer" selected="selected">Short answer</option>
              <option value="matching">Matching</option>
            </select>
            <button class="btn btn-blue quiz-edit__btn-reset">
              <i class="btn-icon fa-solid fa-rotate-right"></i>
              Reset
            </button>
            <div class="quiz-edit__question-question-score">
              pts
              <input
                class="quiz-edit__question-question-score-num"
                type="number"
                name=""
                id=""
                value="${question.score}"
              />
            </div>
          </div>
          <div class="quiz-edit__question-body">
            <div class="quiz-edit__question-body-question ${
              showQuizBody ? '' : 'd-none'
            }">
              <p class="quiz-edit__question-instruction">
                Students will be given a text field to compose their answer.
              </p>
              <p class="quiz-edit__question-question-text">Question:</p>
              <textarea
                name=""
                id=""
                rows="10"
                style="resize: none"
                placeholder="Enter your question..."
                class="quiz-edit__question-textarea-question"
              >${question.question}</textarea>
            </div>

            <div class="quiz-edit__question-footer">
              <div class="quiz-edit__question-footer-control">
                <button class="btn btn-red quiz-edit__btn-delete-question 
                ${
                  quiz.questions.length === 1 ? 'btn--disabled' : ''
                }">Delete question</button>
                <button class="btn btn-blue quiz-edit__btn-add-question">+ New question</button>
              </div>
            </div>
          </div>
        </li>
      `;
    } else if (question.type === QUESTION_TYPES.MATCHING) {
      return `
        <li class="quiz-edit__question" data-id="${question.id}">
          <div class="quiz-edit__question-header">
            ${
              showQuizBody
                ? ''
                : `
                <div class="quiz-edit__drag-drop-wrapper" draggable="true">
                  <i class="quiz-edit__drag-drop-icon fa-solid fa-grip"></i>
                </div>
              `
            }

            <span class="quiz-edit__question-question-num">Question ${
              index + 1
            }</span>
            <select
              class="quiz-edit__question-question-type-select"
              name="question_type"
              id=""
            >
              <option value="multiple_choice">Multiple choice</option>
              <option value="short_answer">Short answer</option>
              <option value="matching" selected="selected">Matching</option>
            </select>
            <button class="btn btn-blue quiz-edit__btn-reset">
              <i class="btn-icon fa-solid fa-rotate-right"></i>
              Reset
            </button>
            <div class="quiz-edit__question-question-score">
              pts
              <input
                class="quiz-edit__question-question-score-num"
                type="number"
                name=""
                id=""
                value="${question.score}"
              />
            </div>
          </div>
          
          <div class="quiz-edit__question-body">
            <div class="quiz-edit__question-body-question ${
              showQuizBody ? '' : 'd-none'
            }">
              <p class="quiz-edit__question-instruction">
                Build pairs of matching values. Students will see values on the left and have to select the matching value on the right from a dropdown. Multiple rows can have the same answer, and you can add additional distractors to the right side.
              </p>
              <p class="quiz-edit__question-question-text">Matching questions:</p>

              <ol class="quiz-edit__matching-list">
                ${question.matchingList
                  .map((matching) => {
                    return `
                    <li class="quiz-edit__matching-item">
                      <div class="container-fluid">
                        <div class="row">
                          <div class="col col-md-6">
                            <div class="quiz-edit__matching-item-left-container">
                              <input
                                class="quiz-edit__matching-item-input quiz-edit__matching-item-input-left"
                                type="text"
                                placeholder="Matching left side"
                                value="${matching[0]}"
                              />
                            </div>
                          </div>
                          <div class="col col-md-6">
                            <div class="quiz-edit__matching-item-right-container quiz-edit__matching-item-input-right">
                              <input
                                class="quiz-edit__matching-item-input"
                                type="text"
                                placeholder="Matching right side"
                                value="${matching[1]}"
                              />
                              <button class="btn btn-red quiz-edit__btn-delete-matching ${
                                question.matchingList.length === 1
                                  ? 'btn--disabled'
                                  : ''
                              }">
                                <i
                                  class="quiz-edit__btn-delete-matching-icon fa-solid fa-trash"
                                ></i
                                >Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  `;
                  })
                  .join('')}
              </ol>

              <button class="btn btn-blue quiz-edit__btn-add-matching">
                + Add new
              </button>
            </div>

            <div class="quiz-edit__distractors-container ${
              showQuizBody ? '' : 'd-none'
            }">
              <h3 class="quiz-edit__distractors-heading">
                Additional match possibilities (distractors):
              </h3>
              <h3 class="quiz-edit__distractors-sub-heading">
                type each distractors on its own line
              </h3>
              <textarea
                name=""
                class="quiz-edit__distractors-text-area"
                id=""
                class=""
                rows="6"
                style="resize: none;"
                placeholder="Enter each distractor on each line..."
              >${question.distractors.join('\n')}</textarea>
            </div>

            <div class="quiz-edit__question-footer">
              <div class="quiz-edit__question-footer-control">
                <button class="btn btn-red quiz-edit__btn-delete-question 
                ${
                  quiz.questions.length === 1 ? 'btn--disabled' : ''
                }">Delete question</button>
                <button class="btn btn-blue quiz-edit__btn-add-question">+ New question</button>
              </div>
            </div>
          </div>
        </li>
      `;
    }
  });
  const ulQuestionList = app.querySelector('.quiz-edit__list');
  ulQuestionList.innerHTML = HTMLs.join('');

  // Handle events of each question interaction
  let quizClone = _.cloneDeep(quiz);
  const liQuestionItems = [...app.querySelectorAll('.quiz-edit__question')];
  liQuestionItems.forEach((liQuestionItem, index) => {
    // Get refs
    const questionTypeSelect = liQuestionItem.querySelector(
      '.quiz-edit__question-question-type-select'
    );
    const btnReset = liQuestionItem.querySelector('.quiz-edit__btn-reset');
    const scoreInput = liQuestionItem.querySelector(
      '.quiz-edit__question-question-score-num'
    );
    const deleteQuestionBtn = liQuestionItem.querySelector(
      '.quiz-edit__btn-delete-question'
    );
    const addQuestionBtn = liQuestionItem.querySelector(
      '.quiz-edit__btn-add-question'
    );
    const questionTextArea = liQuestionItem.querySelector(
      '.quiz-edit__question-textarea-question'
    );
    const liAnswerItems = liQuestionItem.querySelectorAll(
      '.quiz-edit__question-answer-item'
    );
    const liMatchingItems = liQuestionItem.querySelectorAll(
      '.quiz-edit__matching-item'
    );
    const addMatchingBtn = liQuestionItem.querySelector(
      '.quiz-edit__btn-add-matching'
    );
    const distractorTextArea = liQuestionItem.querySelector(
      '.quiz-edit__distractors-text-area'
    );

    // ------------ General event handler ------------
    // Handle question type change
    questionTypeSelect.addEventListener('change', (e) => {
      if (e.target.value === QUESTION_TYPES.MULTIPLE_CHOICE) {
        quizClone.questions[index] = {
          id: uuidv4(),
          type: QUESTION_TYPES.MULTIPLE_CHOICE,
          score: 10,
          question: `${quiz.questions[index].question || ''}`,
          answers: [
            {
              type: MC_ANSWER_TYPES.POSSIBLE,
              body: '',
            },
          ],
        };
      } else if (e.target.value === QUESTION_TYPES.SHORT_ANSWER) {
        quizClone.questions[index] = {
          id: uuidv4(),
          type: QUESTION_TYPES.SHORT_ANSWER,
          score: 10,
          question: `${quiz.questions[index].question || ''}`,
        };
      } else if (e.target.value === QUESTION_TYPES.MATCHING) {
        quizClone.questions[index] = {
          id: uuidv4(),
          type: QUESTION_TYPES.MATCHING,
          score: 10,
          matchingList: [['', '']],
          distractors: [],
        };
      }
      renderEditQuiz(quizClone, quizIndex, isCreateQuiz, showQuizBody);
    });

    // Handle reset question button
    btnReset.addEventListener('click', () => {
      if (quizClone.questions[index].type === QUESTION_TYPES.MULTIPLE_CHOICE) {
        quizClone.questions[index] = {
          id: uuidv4(),
          type: QUESTION_TYPES.MULTIPLE_CHOICE,
          score: 10,
          question: '',
          answers: [
            {
              type: MC_ANSWER_TYPES.POSSIBLE,
              body: '',
            },
          ],
        };
      } else if (
        quizClone.questions[index].type === QUESTION_TYPES.SHORT_ANSWER
      ) {
        quizClone.questions[index] = {
          id: uuidv4(),
          type: QUESTION_TYPES.SHORT_ANSWER,
          score: 10,
          question: '',
        };
      } else if (quizClone.questions[index].type === QUESTION_TYPES.MATCHING) {
        quizClone.questions[index] = {
          id: uuidv4(),
          type: QUESTION_TYPES.MATCHING,
          score: 10,
          matchingList: [['', '']],
          distractors: [],
        };
      }
      renderEditQuiz(quizClone, quizIndex, isCreateQuiz, showQuizBody);
    });

    // Handle score change (point range from 0 - 1000)
    scoreInput.addEventListener('input', (e) => {
      if (e.target.value < 0) {
        e.target.value = 0;
      }
      if (e.target.value > 100) {
        e.target.value = 100;
      }
      quizClone.questions[index].score = Number(e.target.value);
    });

    // Handle delete question button
    deleteQuestionBtn.addEventListener('click', () => {
      quizClone.questions.splice(index, 1);
      renderEditQuiz(quizClone, quizIndex, isCreateQuiz, showQuizBody);
    });

    // Handle add question button
    addQuestionBtn.addEventListener('click', () => {
      quizClone.questions.splice(index + 1, 0, {
        id: uuidv4(),
        type: QUESTION_TYPES.SHORT_ANSWER,
        score: 10,
        question: '',
      });
      renderEditQuiz(quizClone, quizIndex, isCreateQuiz, showQuizBody);
    });

    // Handle text area input change
    if (questionTextArea) {
      questionTextArea.addEventListener('input', (e) => {
        const input = e.target.value;
        quizClone.questions[index].question = input;
      });
    }

    // ------------ Multiple choice event handler ------------
    liAnswerItems.forEach((liAnswerItem, answerIndex) => {
      const questionTypeSelect = liAnswerItem.querySelector(
        '.quiz-edit__question-answer-select'
      );
      const deleteAnswerBtn = liAnswerItem.querySelector(
        '.quiz-edit__btn-delete-answer'
      );
      const addAnswerBtn = liAnswerItem.querySelector(
        '.quiz-edit__btn-add-answer'
      );
      const answerTextArea = liAnswerItem.querySelector(
        '.quiz-edit__question-textarea-answer'
      );

      // Handle answer type select
      questionTypeSelect.addEventListener('change', (e) => {
        if (e.target.value === MC_ANSWER_TYPES.POSSIBLE) {
          quizClone.questions[index].answers[answerIndex].type =
            MC_ANSWER_TYPES.POSSIBLE;
        } else if (e.target.value === MC_ANSWER_TYPES.CORRECT) {
          quizClone.questions[index].answers[answerIndex].type =
            MC_ANSWER_TYPES.CORRECT;
        }
        renderEditQuiz(quizClone, quizIndex, isCreateQuiz, showQuizBody);
      });

      // Handle delete answer btn
      deleteAnswerBtn.addEventListener('click', () => {
        quizClone.questions[index].answers.splice(answerIndex, 1);
        renderEditQuiz(quizClone, quizIndex, isCreateQuiz, showQuizBody);
      });

      // Handle add answer btn
      addAnswerBtn.addEventListener('click', () => {
        quizClone.questions[index].answers.splice(answerIndex + 1, 0, {
          type: MC_ANSWER_TYPES.POSSIBLE,
          body: '',
        });
        renderEditQuiz(quizClone, quizIndex, isCreateQuiz, showQuizBody);
      });

      // Handle text area input
      answerTextArea.addEventListener('input', (e) => {
        const input = e.target.value;
        quizClone.questions[index].answers[answerIndex].body = input;
      });
    });

    // ------------ Matching questions event handler ------------
    liMatchingItems.forEach((liMatchingItem, matchingIndex) => {
      const deleteMatchingBtn = liMatchingItem.querySelector(
        '.quiz-edit__btn-delete-matching'
      );
      const matchingInputLeft = liMatchingItem.querySelector(
        '.quiz-edit__matching-item-input-left'
      );
      const matchingInputRight = liMatchingItem.querySelector(
        '.quiz-edit__matching-item-input-right'
      );

      // Handle delete matching item
      deleteMatchingBtn.addEventListener('click', () => {
        quizClone.questions[index].matchingList.splice(matchingIndex, 1);
        renderEditQuiz(quizClone, quizIndex, isCreateQuiz);
      });

      // Handle matching input left/right
      matchingInputLeft.addEventListener('input', (e) => {
        const input = e.target.value;
        quizClone.questions[index].matchingList[matchingIndex][0] = input;
      });
      matchingInputRight.addEventListener('input', (e) => {
        const input = e.target.value;
        quizClone.questions[index].matchingList[matchingIndex][1] = input;
      });
    });
    // Handle add matching btn
    if (addMatchingBtn) {
      addMatchingBtn.addEventListener('click', () => {
        quizClone.questions[index].matchingList.push(['', '']);
        renderEditQuiz(quizClone, quizIndex, isCreateQuiz, showQuizBody);
      });
    }
    // Handle distractors input
    if (distractorTextArea) {
      distractorTextArea.addEventListener('input', (e) => {
        const input = e.target.value;
        let distractors = input.split('\n');
        distractors = distractors
          .map((distractor) => distractor.trim())
          .filter((distractor) => {
            if (distractor === '') return false;
            return true;
          });
        quizClone.questions[index].distractors = distractors;
      });
    }
  });

  // Handle quiz event: Name input, Show/Hide quiz body, Delete, Cancel, Save current Quiz
  const nameInput = document.querySelector('.quiz-edit__quiz-name-input');
  const instructionInput = document.querySelector(
    '.quiz-edit__quiz-instruction-input'
  );
  const showHideQuizBodyCheckbox = document.querySelector(
    '.quiz-edit__checkbox-show-quiz-body'
  );
  const deleteQuizBtn = document.querySelector('#btn-delete-quiz');
  const cancelQuizBtn = document.querySelector('.quiz-edit__btn-cancel-quiz');
  const saveQuizBtn = document.querySelector('.quiz-edit__btn-save-quiz');
  nameInput.addEventListener('input', (e) => {
    const input = e.target.value;
    quizClone.detail.name = input;
  });
  instructionInput.addEventListener('input', (e) => {
    const input = e.target.value;
    quizClone.detail.instruction = input;
  });
  showHideQuizBodyCheckbox.addEventListener('change', (e) => {
    renderEditQuiz(quizClone, quizIndex, isCreateQuiz, e.target.checked);
  });
  if (deleteQuizBtn) {
    deleteQuizBtn.addEventListener('click', () => {
      quizzes.splice(quizIndex, 1);
      storeQuizzes(quizzes);
      renderQuizListLecturer(quizzes);
    });
  }
  cancelQuizBtn.addEventListener('click', () => {
    renderQuizListLecturer(quizzes);
  });
  saveQuizBtn.addEventListener('click', () => {
    quizzes.splice(quizIndex, 1, quizClone);
    storeQuizzes(quizzes);
    renderQuizListLecturer(quizzes);
  });

  // Handle drag and drop event
  const dragBtns = document.querySelectorAll('.quiz-edit__drag-drop-wrapper');
  dragBtns.forEach((dragBtn, btnIndex) => {
    dragBtn.addEventListener('dragstart', (e) => {
      liQuestionItems[btnIndex].classList.add('dragging');
    });
    dragBtn.addEventListener('dragend', (e) => {
      liQuestionItems[btnIndex].classList.remove('dragging');

      // Move each question to appropriately index
      const newQuestionArray = [];
      const newLiQuestionItems = [
        ...ulQuestionList.querySelectorAll('.quiz-edit__question'),
      ];
      newLiQuestionItems.forEach((liQuestionItem) => {
        const id = liQuestionItem.dataset.id;
        const question = quizClone.questions.find(
          (question) => question.id === id
        );
        newQuestionArray.push(question);
      });
      quizClone.questions = newQuestionArray;

      // Rerender
      renderEditQuiz(quizClone, quizIndex, isCreateQuiz, showQuizBody);
    });
  });

  ulQuestionList.addEventListener('dragover', (e) => {
    // Get the dragging element
    let draggingIndex = null;
    const draggingLi = liQuestionItems.find((liQuestionItem, i) => {
      if (liQuestionItem.classList.contains('dragging')) {
        draggingIndex = i;
        return true;
      }
      return false;
    });

    // Get the closest li
    let minOffset = Number.POSITIVE_INFINITY;
    let closestLi = null;
    let closestIndex = null;
    liQuestionItems.forEach((liQuestionItem, i) => {
      const boundingRect = liQuestionItem.getBoundingClientRect();
      const currentOffset =
        e.clientY - (boundingRect.y + boundingRect.height / 2);

      if (currentOffset < 0 && minOffset > Math.abs(currentOffset)) {
        minOffset = Math.abs(currentOffset);
        closestLi = liQuestionItem;
        closestIndex = i;
      }
    });

    // Move element inside DOM
    if (closestLi) {
      ulQuestionList.insertBefore(draggingLi, closestLi);
    } else {
      ulQuestionList.appendChild(draggingLi);
    }
  });
}
// renderEditQuiz(quizzes[0], 0, false, false);

export { renderRoleChoice };
