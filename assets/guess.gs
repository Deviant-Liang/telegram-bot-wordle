function badLetters(result, guess){
  bad_letters = [];
  for (let i = 0; i<5; i++){
      if (result[i] == "B")
          bad_letters.push(guess[i]);
  }
  return bad_letters
}

function partialLetters(result, guess){
  partial_letters = [];
  for (let i = 0; i<5; i++){
      if (result[i] == "Y"){
          partial_letters.push([guess[i], i])
      }
  }
  return partial_letters
}

function correctLetters(result, guess){
  correct_letters = []
  for (let i = 0; i<5; i++){
      if (result[i] == "G"){
          correct_letters.push([guess[i], i])
      }
  }
  return correct_letters
}

function word_remover(result, guess, possible_words, len_possible_words){
  bad_letters = badLetters(result, guess)
  correct_letters = correctLetters(result, guess)
  partial_letters = partialLetters(result, guess)

  good_letters = []
  for (let g = 0; g < correct_letters.length; g += 1)
    good_letters.push(correct_letters[g][0]);
  for (let p = 0; p < partial_letters.length; p += 1)
    good_letters.push(partial_letters[p][0]);

  acceptable_words1 = []
  for (var w = 0; w < len_possible_words; w += 1){
    check = 0
    for (var b = 0; b < bad_letters.length; b += 1){
      if (possible_words[w].includes(bad_letters[b])){
          if (good_letters.includes(bad_letters[b]));
          else{
            check = 1;
            break;
          }
      }
    }
    if (check == 0)
        acceptable_words1.push(possible_words[w])
  }
  //console.log(acceptable_words1.length)

  acceptable_words2 = []
  for (var w = 0; w < acceptable_words1.length; w += 1){
    check = 0
    for (let g = 0; g < correct_letters.length; g += 1){
      if (acceptable_words1[w][correct_letters[g][1]] != correct_letters[g][0]){
        check = 1;
        break;
      }
    }
    if (check == 0)
        acceptable_words2.push(acceptable_words1[w])
  }
  //console.log(acceptable_words2.length)
  
  acceptable_words3 = []
  for (var w = 0; w < acceptable_words2.length; w += 1){
    check = 0;
    for (let p = 0; p < partial_letters.length; p += 1){
      if (acceptable_words2[w][partial_letters[p][1]] == partial_letters[p][0]){
        check = 1;
        break;
      }
    }
    if (check == 0)
        acceptable_words3.push(acceptable_words2[w])
  }
  //console.log(acceptable_words3.length)
  
  acceptable_words4 = []
  for (var w = 0; w < acceptable_words3.length; w += 1){
    check = 0;
    for (let g = 0; g < good_letters.length; g +=1){
      if (!acceptable_words3[w].includes(good_letters[g])){
        check = 1;
        break;
      }
    }
    if (check == 0)
        acceptable_words4.push(acceptable_words3[w])
  }
  //console.log(acceptable_words4)

  acceptable_words5 = []
  for (var w = 0; w < acceptable_words4.length; w += 1){
    check = 0
    for (let b = 0; b < bad_letters.length; b += 1){
      if (good_letters.includes(bad_letters[b])){
        if (acceptable_words4[w].count(bad_letters[b]) != good_letters.count(bad_letters[b])){
            check = 1;
            break;
        }
      }
    }
    if (check == 0)
        acceptable_words5.push(acceptable_words4[w])
  }
  //console.log(acceptable_words5.length)

  return acceptable_words5
}

Object.defineProperties(String.prototype, {
    count: {
        value: function(query) {
            /* 
               Counts number of occurrences of query in array, an integer >= 0 
               Uses the javascript == notion of equality.
            */
            var count = 0;
            for(let i=0; i<this.length; i++)
                if (this[i]==query)
                    count++;
            return count;
        }
    }
});

Object.defineProperties(Array.prototype, {
    count: {
        value: function(query) {
            /* 
               Counts number of occurrences of query in array, an integer >= 0 
               Uses the javascript == notion of equality.
            */
            var count = 0;
            for(let i=0; i<this.length; i++)
                if (this[i]==query)
                    count++;
            return count;
        }
    }
});

function letterFreq(possible_words){
  alphabet = "abcdefghijklmnopqrstuvwxyz"
  arr = []
  for (var c =0; c < alphabet.length; c += 1){
    freq = [0, 0, 0, 0, 0]
    for (let i = 0; i<5; i++){
      for (var w = 0; w < possible_words.length; w += 1){
        if (possible_words[w][i] == alphabet[c])
          freq[i] += 1;
      }
    }
    arr.push([alphabet[c], freq])
  }
  return arr
}  

function wordScore(possible_words, frequencies){
  words = []
  max_freq = [0, 0, 0, 0, 0]
  for (var c = 0; c < frequencies.length; c += 1){
      for(let i = 0; i<5; i++){
          if (max_freq[i] < frequencies[c][i])
              max_freq[i] = frequencies[c][i]
      }
  }
  for (var w = 0; w < possible_words.length; w += 1){
      score = 1
      for(let i = 0; i<5; i++){
          c = possible_words[w][i].charCodeAt(0) - 97; // convert to index          
          score *= 1 + (frequencies[c][1][i] - max_freq[i]) ** 2;
          //console.log(frequencies[c][1][i])
      }
      words.push([possible_words[w], score])
      // score += numpy.random.uniform(0, 1)  // this will increase expectation from 2.95 to 3.23, but is technically fairer
  }
  return words
}


function bestWord(possible_words, frequencies){
  max_score = 999999999999999;   // start with a ridiculous score
  best_word = "words";    // start with a random word
  scores = wordScore(possible_words, frequencies);
  for (var w = 0; w < possible_words.length; w += 1){
    if (scores[w][1] < max_score){
        max_score = scores[w][1];
        best_word = scores[w][0];
    }
  }
  return best_word
}

function wordleSolver(){
  function check(guess, targetWord) {
    var checkStates = "";
    for (let i = 0; i<5; i++) {
      if (targetWord[i] == guess[i]) {
        checkStates += "G";
        targetWord = targetWord.replaceAt(i, '_');
        guess = guess.replaceAt(i, '_');
      }
      else{
        checkStates += "B";
      }
    }
    for (let i=0; i<5; i++) {
      if (guess[i] == '_') continue;
      let fi = targetWord.indexOf(guess[i]);
      if (fi > -1) {
        checkStates = checkStates.replaceAt(i, "Y");
        targetWord = targetWord.replaceAt(fi, '_');
      }
    }
    return checkStates;
  }


  // List of possible words
  var possible_words = words
  var len_possible_words = possible_words.length

  var process = [];

  // text to pattern
  correct_place = "🟩";
  correct_letter = "🟨";
  incorrect_letter = "⬛";
  function patternBYG(text){
    var pattern = "";
    for (let i = 0; i<5; i++) {
      if (text[i] == 'B') pattern += incorrect_letter;
      else if (text[i] == 'G') pattern += correct_place;
      else pattern += correct_letter;
    }
    return pattern
  }

  guess = "crane";
  correctWord = ws.getRange("A1").getValue();
  result = check(guess, correctWord);

  pattern = patternBYG(result)

  process.push(["slate", pattern]);

  while(result != "GGGGG"){
    possible_words = word_remover(result, guess, possible_words, len_possible_words);
    //console.log(possible_words)
    if (possible_words.length == 0)
      break;
    suggestion = bestWord(possible_words, letterFreq(possible_words));
    //console.log(possible_words)
    //console.log("The suggested word is:", suggestion);

    len_possible_words = possible_words.length
    guess = suggestion;
    // new result
    result = check(guess, correctWord);
    
    pattern = patternBYG(result)
    process.push([guess, pattern]);
  }

  /*
  if (possible_words.length == 0)
    console.log("Oh no! You made a mistake entering one of your results. Please try again.")
  else if (result != "GGGGG")
    console.log("Number of guesses exceeded, sorry we failed!")
  else
    console.log("Congratulations! We solved today's Wordle")
  */

  console.log(process)

  return process;
}










