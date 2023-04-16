import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { storeQuizzes, getQuizzes, QUIZZES_KEY } from './storage.js';

const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  SHORT_ANSWER: 'short_answer',
  MATCHING: 'matching',
};

const MC_ANSWER_TYPES = {
  POSSIBLE: 'possible',
  CORRECT: 'correct',
};

// const question1 = {
//   id: uuidv4(),
//   type: QUESTION_TYPES.MULTIPLE_CHOICE,
//   score: 10,
//   question:
//     'A company has two accounts for perform testing and each account has a single VPC: VPC-TEST1 and VPC-TEST2. The operations team require a method of securely copying files between Amazon EC2 instances in these VPCs. The connectivity should not have any single points of failure or bandwidth constraints.\nWhich solution should a Solutions Architect recommend?',
//   answers: [
//     {
//       type: MC_ANSWER_TYPES.POSSIBLE,
//       body: 'Create a VPC gateway endpoint',
//     },
//     {
//       type: MC_ANSWER_TYPES.POSSIBLE,
//       body: 'Attach a virtual private gateway',
//     },
//     {
//       type: MC_ANSWER_TYPES.POSSIBLE,
//       body: 'Attach a Direct Connect gateway',
//     },
//     {
//       type: MC_ANSWER_TYPES.CORRECT,
//       body: 'Create a VPC peering connection',
//     },
//   ],
// };

// const question2 = {
//   id: uuidv4(),
//   type: QUESTION_TYPES.SHORT_ANSWER,
//   score: 20,
//   question: 'Short answer question',
// };

// const question3 = {
//   id: uuidv4(),
//   type: QUESTION_TYPES.MATCHING,
//   score: 30,
//   matchingList: [
//     ['The length of the test 1', '3 day'],
//     ['Total mark of the test 1', '30'],
//     ['Share the answers with other students is', 'Not allowed'],
//   ],
//   distractors: ['dis1', 'dis2'],
// };

// const quiz1 = {
//   id: uuidv4(),
//   detail: {
//     name: 'Practice Test 1',
//     instruction: '',
//     timeLimit: 1000 * 60 * 30,
//     isActive: true,
//   },
//   questions: [question1, question2, question3],
// };

// const quiz2 = {
//   id: uuidv4(),
//   detail: {
//     name: 'Practice Test 2',
//     instruction: '',
//     timeLimit: 1000 * 60 * 40,
//     isActive: false,
//   },
//   questions: [question2, question3, question1],
// };

// let quizzes = [quiz1, quiz2];
// storeQuizzes(quizzes);


let quizzes = getQuizzes(QUIZZES_KEY) || [];

export { quizzes, QUESTION_TYPES, MC_ANSWER_TYPES };
