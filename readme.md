This is a Quiz application that support 2 modes:

1. Quiz editor mode:
   - CRUD quizzes: support 3 type of questions including Short answer, Multiple choice, Matching.
   - Support local storge after CRUD.
   - Disable, active a quiz: when a quiz is disabled, it can not be seen in quiz taking mode.
   - Special feature: Drag and drop questions when edit a quiz.
2. Quiz taking mode:
   - See available quizzes.
   - Taking a quizzes.
   - Get result after taking the quiz. Rule for marking:
     - Short answer question: when the answer not empty => get full mark.
     - Matching question: each correct matching get total points = questionTotalPoints / numberOfMatchings (each correct matching get equal point).
     - Multiple choice question: each correct matching get total points = questionTotalPoints / numberOfCorrectAnswers (each correct matching get equal point). Each incorrect matching get total negative points = - questionTotalPoints / numberOfPossibleAnswers (each incorrect matching is deduced equal point). If final point is negative => Final point = 0.

Usage:

- Open 'index.html' with live server.

Screenshot:
[thumbnail](https://drive.google.com/uc?export=download&id=1ScBloP2rOIh5iTHIEv_i6yALUM9cFPDJ)
