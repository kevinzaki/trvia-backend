const Player = require("./player"); /** Player Class */
const TriviaQuestion = require("./triviaQuestion");
class Room {
  constructor(
    id,
    token,
    hostId,
    numberOfRounds,
    numberOfQuestionsPerRound,
    categories
  ) {
    this.id = id;
    this.hostId = hostId;
    this.token = token;
    this.players = {};
    this.numberOfRounds = numberOfRounds;
    this.numberOfQuestionsPerRound = numberOfQuestionsPerRound;
    this.categories = categories;
    this.roundCount = 0;
    this.quesitonCount = 0;
    this.question = null;
  }
  setNumberOfRounds(numberOfRounds) {
    this.numberOfRounds = numberOfRounds;
  }
  setNumberOfQuestionsPerRound(numberOfQuestionsPerRound) {
    this.numberOfQuestionsPerRound = numberOfQuestionsPerRound;
  }
  setCategories(categories) {
    this.categories = categories;
  }
  getToken() {
    return this.token;
  }
  addPlayer(id, name) {
    this.players[id] = new Player(id, name);
  }
  getPlayer(id) {
    return this.players[id];
  }
  async newQuestion() {
    const val = await TriviaQuestion.init(
      this.categories[this.roundCount],
      this.token
    );

    if (!val[0]) return null;
    const question = decodeURIComponent(val[0].question);
    const possibleAnswers = val[0].incorrect_answers.map(ans =>
      decodeURIComponent(ans)
    );
    const correctAnswer = decodeURIComponent(val[0].correct_answer);
    possibleAnswers.push(correctAnswer);
    this.question = new TriviaQuestion({
      question,
      possibleAnswers,
      correctAnswer
    });
  }
  getQuestion() {
    console.log(this.question);
    return this.question.getQuestion();
  }
  getQuestionAnswers() {
    return this.question.getPossibleAnswers();
  }
  getCorrectAnswer() {
    return this.question.getCorrectAnswer();
  }
  answerQuestion(userId, answer) {
    if (answer === this.question.getCorrectAnswer()) {
      this.players[userId].incrementScore();
      console.log(this.players[userId]);
    }
  }
  getScores() {
    const scores = [];
    for (let player in this.players) {
      let id = this.players[player].getId();
      let name = this.players[player].getName();
      let score = this.players[player].getScore();
      scores.push({ id, name, score });
    }
    console.log(scores);
    scores.sort((a, b) => b.score - a.score);
    return scores;
  }
}

module.exports = Room;
