const QUIZZES_KEY = 's3879364';

function storeQuizzes(quizzes) {
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
}

function getQuizzes() {
  return JSON.parse(localStorage.getItem(QUIZZES_KEY));
}

export { storeQuizzes, getQuizzes, QUIZZES_KEY };
