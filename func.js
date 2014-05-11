function handleFileSelect(evt) {

    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output = [];

    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();
      reader.readAsText(f);
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          var res = this.result;
          BibAnalysis(res);
          document.getElementById('list').innerHTML = '<ul>' + out + '</ul>';
        };
      })(f);
    }
    
}

var out = "";

function handleDragOver(evt) {

  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.

}

// Setup the dnd listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);

var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

var spaces = [' ', '\t', '\n', '\r'];

var bibtype = ['inproceedings', 'article', 'book'];

var tags = ['author', 'title', 'journal', 'volume', 'number', 'pages', 'year', 'booktitle', 'publisher', 'isbn'];

var state = 0;

var i = 0;

var stack = new Array();

var lexeme = "";

var content = "";

function contains(a, obj) {

  for(var i = 0; i < a.length; i++) {

    if(a[i] === obj){
      return true;
    }
  }
  return false;
}

function BibAnalysis(str) {

  while(i < str.length) {

    var ch = str.charAt(i);
    switch(state){
      case 0:
        Bib_State_0(ch);
        break;
      case 1:
        Bib_State_1(ch);
        break;
      case 2:
        Bib_State_2(ch);
        break;
      case 3:
        Bib_State_3(ch);
        break;
      case 4:
        Bib_State_4(ch);
        break;
      case 5:
        Bib_State_5(ch);
        break;
      case 6:
        Bib_State_6(ch);
        break;
      case 7:
        Bib_State_7(ch);
        break;
      case 8:
        Bib_State_8(ch);
        break;
      case 9:
        Bib_State_9(ch);
        break;
      case 10:
        Bib_State_10(ch);
        break;
      case 11:
        Bib_State_11(ch);
        break;
      case 12:
        Bib_State_12(ch);
        break;
    }

    i++;
  }
  
}

//初始状态
function Bib_State_0(ch) {
  if(ch == '@')
    state = 1;
}

//匹配@后面的字符串
function Bib_State_1(ch) {
  //letters
  if(contains(alphabet, ch)){
    lexeme = lexeme + ch;
  }
  //lexeme found in bibtype: article book inproceedings
  else if(ch == '{' && contains(bibtype, lexeme.toLowerCase())) {
    state = 2;
    lexeme = "";
  }
  //error
  else{
    state = 13; 
    lexeme = "";
  }
}

//匹配name
function Bib_State_2(ch) {
  if(ch != '}' && ch != ',')
    return;
  else if(ch == ',')
    state = 3;  //去匹配tags
  else if(ch == '}')
    state = 0;  //回归到初始状态
}

//
function Bib_State_3(ch) {
  if(contains(alphabet, ch)){
    state = 4;
    lexeme = lexeme + ch;
  }
  else if(contains(spaces, ch))
    return;
  else
    state = 13; //error
}

function Bib_State_4(ch) {
  if(ch == '=' && contains(tags, lexeme.toLowerCase())){
    //lexeme = "";
    state = 5;
  }
  else if(ch == '=' && !contains(tags, lexeme.toLowerCase())){
    lexeme = "";
    state = 13; //error
  }
  else if(contains(alphabet, ch)){
    lexeme = lexeme + ch;
    return;
  }
}

function Bib_State_5(ch) {
  if(ch == '\"'){
    state = 6;  //tag=""
  }
  else if(ch == '{')
    state = 7;  //tag={}
  else if(contains(spaces, ch))
    return;
  else
    state = 13; //error
}

//tags=""
function Bib_State_6(ch) {
  if(lexeme.toLowerCase() == 'author'){
    lexeme = "";
    state = 8;
    content = content + ch;
  }
  else if(contains(alphabet, ch) || contains(spaces, ch)){
    content = content + ch;
    return;
  }
  else if(ch == '\"'){
    lexeme = "";
    out += content + "<br/>";
    content = "";
    state = 2;
  }
  
}

//tags={}
function Bib_State_7(ch) {
  if(lexeme.toLowerCase() == 'author'){
    lexeme = "";
    state = 8;
    content = content + ch;
  }
  else if(contains(alphabet, ch) || contains(spaces, ch)){
    content = content + ch;
    return;
  }
  else if(ch == '}'){
    lexeme = "";
    out += content + "<br/>";
    content = "";
    state = 2;
  }
}

function Bib_State_8(ch) {
  if(contains(spaces, ch))
    state = 9;
  else if(contains(alphabet, ch))
    content = content + ch;
  else if(ch == '\"' || ch == '}'){
    out += content + "<br/>";
    content = "";
    state = 2;
  }
}

function Bib_State_9(ch) {
  if(contains(spaces, ch))
    return;
  else if(ch == 'a')
    state = 10;
  else{
    content = content + " " + ch;
    state = 8
  }
}

function Bib_State_10(ch) {
  if(ch == 'n')
    state = 11;
  else{
    content = content + " " + ch;
    state = 8
  }
}

function Bib_State_11(ch) {
  if(ch == 'd')
    state = 12;
  else{
    content = content + " " + ch;
    state = 8
  }
}

function Bib_State_12(ch) {
  if(contains(spaces, ch))
    return;
  else if(contains(alphabet, ch)){
    content = content + ", " + ch;
    state = 8;
  }
}

