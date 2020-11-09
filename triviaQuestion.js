const { FETCH_QUESTION, FETCH_TOKEN } = require("./client");

class TriviaQuestion {
  constructor({
    question = null,
    possibleAnswers = null,
    correctAnswer = null
  }) {
    this.question = question;
    this.possibleAnswers = possibleAnswers;
    this.correctAnswer = correctAnswer;
  }
  static async init(category, token) {
    const question = await FETCH_QUESTION(category, token);
    return question;
  }
  getQuestion() {
    return this.question;
  }
  getPossibleAnswers() {
    return this.possibleAnswers;
  }
  getCorrectAnswer() {
    return this.correctAnswer;
  }
}
// const question = TriviaQuestion.init(
//   14,
//   "1c7688d138334e1df29e69c7fde349897881e82d14cb868c7fc32b034b210be1"
// )
//   .then(val => {
//     console.log(val);
//     new TriviaQuestion({ ...val });
//   })
//   .then(val2 => console.log(val2));

module.exports = TriviaQuestion;
