function doPost(e){
  var estringa = JSON.parse(e.postData.contents);
  var payload = identificar(estringa);
  var data = {
    "method": "post",
    "payload": payload
  }
  UrlFetchApp.fetch("https://api.telegram.org/YourBotID", data);
}

function validCheck(wordGuess){
  return (words.indexOf(wordGuess) > -1)
}


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

String.prototype.replaceAt = function (index, char) {
  let a = this.split("");
  a[index] = char;
  return a.join("");
}


/* old algo
function check(guessWord, correctWord){
  var pattern = "";
  for (let i = 0; i < 5; i++) {
    if(guessWord[i] == correctWord[i])
      pattern += correct_place;
    else if(correctWord.includes(guessWord[i])){    
      pattern += correct_letter;
    }
    else
      pattern += incorrect_letter;
  }
  return pattern
}
*/

var url = "YourSpreadSheetURL";
var ss = SpreadsheetApp.openByUrl(url);
var ws = ss.getSheetByName("YourWorksheetName");


correct_place = "🟩";
correct_letter = "🟨";
incorrect_letter = "⬛";

function identificar(e){
  var correctWord = ws.getRange("A1").getValue();
  // start a new game
  if (e.message.text.includes("/new")){
    newWord = randomChooseWord();
    ws.getRange('A1').setValue(newWord);
    var mensaje = {
      "method": "sendMessage",
      "chat_id": String(e.message.chat.id),
      "text": "OK! Please guess a word with 5 characters."
    }
  }
  
  if (validCheck(e.message.text.toLowerCase())){
    var correctWord = ws.getRange("A1").getValue();
    text = check(e.message.text.toLowerCase(), correctWord);
    var pattern = "";
    for (let i = 0; i<5; i++) {
      if (text[i] == 'B') pattern += incorrect_letter;
      else if (text[i] == 'G') pattern += correct_place;
      else pattern += correct_letter;
    }
    if(pattern == "🟩🟩🟩🟩🟩"){
      pattern = pattern + '\n' + "Congratulations! The answer is " + correctWord.toUpperCase() + '\n' + "https://dictionary.cambridge.org/dictionary/english/" + correctWord;  // search the target word in cambridge dictionary
    }
    var mensaje = {
      "method": "sendMessage",
      "chat_id": String(e.message.chat.id),
      "text": pattern
    } 
  }

  // invalid word
  /*
  else {
    if (!e.message.text.includes("/new")){
      var mensaje = {
        "method": "sendMessage",
        "chat_id": String(e.message.chat.id),
        "text": "The word is invalid or it's not in the dictionary."
      }
    }
  }
  */

  if (e.message.text.includes("/heck")){
    var arr = wordleSolver();
    var text = "";
    for(let i = 0; i < arr.length; i += 1){
      text += arr[i][0] + " " + arr[i][1] + "\n" 
    }
    var mensaje = {
      "method": "sendMessage",
      "chat_id": String(e.message.chat.id),
      "text": text
    }
  }
  
  return mensaje
}


   