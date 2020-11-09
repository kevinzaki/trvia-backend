const axios = require("axios");

const URL = "https://opentdb.com/";

const fetchQuestion = async (categoryId, token = null) => {
  try {
    const res = await axios.get(
      `${URL}api.php?amount=1&category=${categoryId}&type=multiple${token !==
        null && `&token=${token}`}&encode=url3986`
    );
    return res.data.results;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const fetchToken = async () => {
  try {
    const res = await axios.get(`${URL}api_token.php?command=request`);
    console.log(res.data.token);
    return res.data.token;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.FETCH_QUESTION = fetchQuestion;
exports.FETCH_TOKEN = fetchToken;
