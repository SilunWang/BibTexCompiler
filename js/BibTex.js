function handleFileSelect(evt) {

    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.

    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();
        reader.readAsText(f);
        reader.onload = (function (theFile) {
            return function (e) {
                // Render thumbnail.
                var res = this.result;
                BibAnalysis(res);
                document.getElementById('list').innerHTML = '<ul>' + out + '</ul>';
            };
        })(f);
    }

}

function clearAll(){
    document.getElementById('list').innerHTML = '<ul>' + '</ul>';
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

//charset
var Sigma = {

    "alphabets": ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '_', '.', '-'],

    "numbers": ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],

    "symbols": ['?', '!', '<', '>', '$', '#', '@', ':', ';', '\'', '+', '=', '~', '\\', '|', '&', '*', '%', '(', ')', '[', ']', '/', '^'],

    "spaces": [' ', '\t', '\n', '\r']
};

//current BibTex type: article? book? inproceedings?
var BibTex_Type = "";

//the current tag's name: author? title? pages?
var tag_name = "";

var BibTex = {

    "inproceedings": {
        "tags": {
            "author": "",
            "title": "",
            "booktitle": "",
            "pages": "",
            "year": ""
        },
        "necessity": ["author", "title", "booktitle", "year"],
        "option": ["pages"]
    },

    "article": {
        "tags": {
            "author": "",
            "title": "",
            "journal": "",
            "volume": "",
            "number": "",
            "pages": "",
            "year": ""
        },
        "necessity": ["author", "title", "journal", "volume", "number", "year"],
        "option": ["pages"]
    },

    "book": {
        "tags": {
            "author": "",
            "title": "",
            "publisher": "",
            "isbn": "",
            "year": ""
        },
        "necessity": ["author", "title", "publisher", "isbn", "year"],
        "option": []
    }
};


//state of automata
var state = 0;

//iter
var i = 0;

var stack = [];

var lexeme = "";

//if obj is in array a
function contains(a, obj) {

    for (var i = 0; i < a.length; i++) {

        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

//main function
function BibAnalysis(str) {

    while (i < str.length) {

        var ch = str.charAt(i);
        switch (state) {
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
            case 13:
                Bib_State_13(ch);
                break;
        }

        i++;
    }

}

//check if all the necessary tags are filled in
function isLegal(obj) {
    for (val in obj.necessity) {
        if(obj.tags[obj.necessity[val]] == "")
            return false;
    }
    return true;
}

//print all the filled tags in order
function printBibTags(obj) {
    out += '<li>';
    for(var val in obj) {
        if(val == "pages"){
            out += "Pages " + obj[val] + '. ';
        }
        else if(val == "title"){
            out += '<I>' + obj[val] + '. ' + '</I>';
        }
        else if(obj[val] != ""){
            out += obj[val] + '. ';
        }
        obj[val] = "";
    }
    out += '</li>';
}

//initial state
function Bib_State_0(ch) {
    if (ch == '@')
        state = 1;
}

//match @XXXXXX
function Bib_State_1(ch) {

    //letters
    if (contains(Sigma.alphabets, ch)) {
        lexeme = lexeme + ch;
    }
    //lexeme found in BibTex format: article book inproceedings.etc
    else if (ch == '{' && lexeme.toLowerCase() in BibTex) {
        stack.push(ch); // push '{'
        BibTex_Type = lexeme.toLowerCase();
        state = 2;
        lexeme = "";
    }
    //error
    else {
        state = 13;
        lexeme = "";
    }
}

//match name
function Bib_State_2(ch) {
    if (ch != '}' && ch != ',')
        return;
    else if (ch == ','){
        state = 3;  //to match tags
    }
    else if (ch == '}'){
        if(stack.pop() == '{' && isLegal(BibTex[BibTex_Type])){
            printBibTags(BibTex[BibTex_Type].tags);
            state = 0;  //to initial
        }
        else{
            state = 13;
        }
    }
}


//match tags
function Bib_State_3(ch) {
    if (contains(Sigma.alphabets, ch)) {
        state = 4;
        lexeme = lexeme + ch;
    }
    else if (contains(Sigma.spaces, ch))
        return;
    else
        state = 13; //error
}

//wait for '='
function Bib_State_4(ch) {
    lexeme = lexeme.toLowerCase();
    if (ch == '=' && (lexeme in BibTex[BibTex_Type].tags)) {
        tag_name = lexeme;
        lexeme = "";
        state = 5;
    }
    else if (ch == '=' && !(lexeme in BibTex[BibTex_Type].tags)) {
        lexeme = "";
        state = 13; //error
    }
    else if (contains(Sigma.alphabets, ch)) {
        lexeme = lexeme + ch;
        return;
    }
}

//filter out spaces
function Bib_State_5(ch) {
    if (ch == '\"') {
        stack.push(ch);
        state = 6;  //tag=""
    }
    else if (ch == '{'){
        stack.push(ch);
        state = 7;  //tag={}
    }
    else if (contains(Sigma.spaces, ch))
        return;
    else
        state = 13; //error
}

//tags=""
function Bib_State_6(ch) {
    if (tag_name == 'author') {
        state = 8;
        BibTex[BibTex_Type].tags[tag_name] += ch;
    }
    else if (contains(Sigma.alphabets, ch) || contains(Sigma.spaces, ch) || contains(Sigma.numbers, ch) || contains(Sigma.symbols, ch)) {
        BibTex[BibTex_Type].tags[tag_name] += ch;
        return;
    }
    else if (ch == '\"') {
        if(stack.pop() == '\"'){
            state = 2;
        }
        else{
            state = 13;
        }
    }

}

//tags={}
function Bib_State_7(ch) {
    if (tag_name == 'author') {
        state = 8;
        BibTex[BibTex_Type].tags[tag_name] += ch;
    }
    else if (contains(Sigma.alphabets, ch) || contains(Sigma.spaces, ch) || contains(Sigma.numbers, ch) || contains(Sigma.symbols, ch)) {
        BibTex[BibTex_Type].tags[tag_name] += ch;
        return;
    }
    else if (ch == '}') {
        if(stack.pop() == '{'){
            state = 2;
        }
        else{
            state = 13;
        }
    }
}

//tagname = author
function Bib_State_8(ch) {
    if (contains(Sigma.spaces, ch))
        state = 9;
    else if (contains(Sigma.alphabets, ch))
        BibTex[BibTex_Type].tags[tag_name] += ch;
    else if (ch == '\"') {
        var outchar = stack.pop();
        if (outchar == '\"'){
            state = 2;
        }
        else {
            state = 13;
        }

    }
    else if (ch == '}') {
        var outchar = stack.pop();
        if (outchar == '{'){
            state = 2;
        }
        else {
            state = 13;
        }

    }
}

//math 'a'
function Bib_State_9(ch) {
    if (contains(Sigma.spaces, ch))
        return;
    else if (ch == 'a')
        state = 10;
    else {
        BibTex[BibTex_Type].tags[tag_name] += " " + ch;
        state = 8
    }
}

//match 'n'
function Bib_State_10(ch) {
    if (ch == 'n')
        state = 11;
    else {
        BibTex[BibTex_Type].tags[tag_name] += " " + ch;
        state = 8
    }
}

//match 'd'
function Bib_State_11(ch) {
    if (ch == 'd')
        state = 12;
    else {
        BibTex[BibTex_Type].tags[tag_name] += " " + ch;
        state = 8
    }
}

//find spaces
function Bib_State_12(ch) {
    if (contains(Sigma.spaces, ch))
        return;
    else if (contains(Sigma.alphabets, ch)) {
        BibTex[BibTex_Type].tags[tag_name] += ", " + ch;
        state = 8;
    }
}

//error state, wait for another @
function Bib_State_13(ch) {
    stack.length = 0;
    if (ch == '@')
        state = 1;
    else
        return;
}

