// fisher-yates-shuffle to shuffle answers
const shuffle = arr => {
  console.log(arr);
  let currIdx = arr.length,
    tempVal,
    randomIdx;

  while (currIdx !== 0) {
    randomIdx = Math.floor(Math.random() * currIdx);
    currIdx -= 1;
    tempVal = arr[currIdx];
    arr[currIdx] = arr[randomIdx];
    arr[randomIdx] = tempVal;
  }
  console.log(arr);
  return arr;
};

exports.shuffle = shuffle;
