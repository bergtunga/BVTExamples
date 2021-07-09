function rot13(str) {
const upperCaseAlphabetArray //= ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
= "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split();
var decodedString = '';

//We are looping over the string we are given as the argument of the function
for(var i = 0; i < str.length; i++){

  //the .indexOf() array method is super useful for this solution!
  //We are finding the index of the letter of the string we are on, and setting the variable cipherIndex to that value
  //OR, this value will be set to -1, str[i] is a space or punctuation symbol
  let cipherIndex = upperCaseAlphabetArray.indexOf(str[i]);

//Testing to make sure that we found an actual index value
  if(cipherIndex !== -1){
      //Decrypting the letter by shifting it 13 places, for this shift cipher it doesn't matter if we shift forward or backward, aswe are shifting by 13 spaces
      cipherIndex += 13;

      //This if statement allows us to use one array for everything,
      if (cipherIndex > 25){
          cipherIndex -= 26;
          // console.log(cipherIndex);
      };

      //here we push the decoded letter into the decoded string
      decodedString += upperCaseAlphabetArray[cipherIndex];

  } else{
      // console.log("This is str[i]", str[i]);
      decodedString += str[i];
  }
}
//  console.log(decodedString);
  return decodedString;
}
//const upperCaseAlphabetArray_ = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
function rot13_new(str) {
  const upperCaseAlphabetArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


  var decodedString = '';

  //We are looping over the string we are given as the argument of the function
  for(var i = 0; i < str.length; i++){

    //the .indexOf() array method is super useful for this solution!
    //We are finding the index of the letter of the string we are on, and setting the variable cipherIndex to that value
    //OR, this value will be set to -1, str[i] is a space or punctuation symbol
    let cipherIndex = upperCaseAlphabetArray.indexOf(str[i]);

  //Testing to make sure that we found an actual index value
    if(cipherIndex !== -1){
        //Decrypting the letter by shifting it 13 places, for this shift cipher it doesn't matter if we shift forward or backward, aswe are shifting by 13 spaces
        cipherIndex += 13;

        //This if statement allows us to use one array for everything,
        if (cipherIndex > 25){
            cipherIndex -= 26;
            // console.log(cipherIndex);
        };

        //here we push the decoded letter into the decoded string
        decodedString += upperCaseAlphabetArray[cipherIndex];

    } else{
        // console.log("This is str[i]", str[i]);
        decodedString += str[i];
    }
  }
  //  console.log(decodedString);
  return decodedString;
}
function cypher(str, key = 13) {
return str.replace(/[A-Z]/g, letter =>
  String.fromCharCode(
    letter.charCodeAt(0) + key - (letter.charCodeAt(0)+key > 'Z'.charCodeAt(0))*26
  ));
}
function cypher2(str, key = 13) {
  return str.replace(/[A-Z]/g, letter =>
    String.fromCharCode(
      letter.charCodeAt(0) + key + (letter.charCodeAt(0)+key > 'Z'.charCodeAt(0)) ? -26 : 0
  ));
}
function tests(){
  let string_array = genRandomStrings(10000000);

  //console.log("verification# ", string_array[0], string_array[1]);

  console.log("split time: ", testTime(rot13_new, string_array));
  console.log("array time: ", testTime(rot13, string_array));
  console.log("one-line time: ", testTime(cypher, string_array));
  console.log("ternary time: ", testTime(cypher2, string_array));

}



function genRandomStrings(size){
  let string_array =Array(size);

  let start_time = process.hrtime.bigint();
  let A = 'A'.charCodeAt(0);
  console.log("Beginning generation...");

  for(let j = 0; j < size; j++){
    string_array[j] = String.fromCharCode(
      A + Math.floor(Math.random()*26),
      A + Math.floor(Math.random()*26),
      A + Math.floor(Math.random()*26),
      A + Math.floor(Math.random()*26),
      A + Math.floor(Math.random()*26),
      A + Math.floor(Math.random()*26),
      A + Math.floor(Math.random()*26),
      A + Math.floor(Math.random()*26),
      A + Math.floor(Math.random()*26),
      A + Math.floor(Math.random()*26)
    );
    //Random, 10 char string
  }
  console.log("Generation Complete! Time taken: ", bigint_to_string(process.hrtime.bigint()-start_time));
  return string_array;
}
function testTime(testee, testcases){
  let start_time = process.hrtime.bigint(), end_time;
  for(let str of testcases){
    testee(str);
  }
  end_time = process.hrtime.bigint();
  return end_time-start_time;
}
function bigint_to_string(input){
  let ns = input % 1000000n;
  let ms = (input/1000000n) % 1000n;
  let s = (input /1000000n)/1000n;
  return `${s}sec ${ms}ms ${ns}ns`;
}
tests();
//if(1){console.log('one');}
//if(0){console.log('zero');}