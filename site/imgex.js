function randomInt(max) {
    return Math.floor(Math.random() * max);
}

var letter2color = function(letter) {
    return [ (letter.codePointAt(0) * 13) % 255, (letter.codePointAt(0) * 17) % 255, (letter.codePointAt(0) * 19) % 255 ] 
}

// leaving this function in for the memories :') 
var expandRegex = function(regex) {
    // gstack stores groups for maybe eventual backreference
    var gstack = [];
    // opstack stores open symbols that need to be closed
    var opstack = [];
    // tstack stores the actual text, should optimally collapse to one element
    var tstack = [];
    var index = 0;
    // cchar is current character 
    var cchar = regex[index];

    while (index <= regex.length) {
	if (['[', '{', '('].includes(cchar)) {
	    console.log("CCHAR IN LIST", cchar);
	    opstack.push(cchar);
	    tstack.push('')
	} else if (cchar == '}') {
	    console.log("CCHAR CLOSING }", history);
	    var repeats = tstack.pop().split(',');
	    var torepeat = tstack.pop()
	    if (gstack.length == 0) {
		var repeated = torepeat.slice(-1);
	    } else var repeated = torepeat;
	    if (repeats.length > 1) {
		repeats = randomInt(parseInt(repeats[1]) - parseInt(repeats[0])) +
		    randomInt(parseInt(repeats[1])); 
		tstack.push(torepeat + repeated.repeat(repeats-1));
	    } else {
		tstack.push(torepeat + repeated.repeat(parseInt(repeats-1)));
	    }
	    if (opstack.pop() != '{') console.log("expected '{'");
	} else if (cchar == '*' || cchar == '+') {
	    var repeats = cchar == '+' ? randomInt(100) : randomInt(100) + 1;
	    var torepeat = tstack.pop()
	    if (gstack.length == 0) {
		var repeated = torepeat.slice(-1);
	    } else var repeated = torepeat;
	    tstack.push(torepeat + repeated.repeat(parseInt(repeats-1)));
	} else if (cchar == ')') {
	    console.log("CCHAR CLOSING )");
	    if (opstack.pop() != '(') console.log("expected '('");
	    gstack.push(tstack[tstack.length-1]);
	} else if ( cchar == ']') {
	    console.log("CCHAR CLOSING ]");
	    if (opstack.pop() != '[') console.log("expected '['");
	    var charset = tstack.pop();
	    tstack.push(charset[randomInt(charset.length)]);
	} else if ( cchar == '.' ) {
	    console.log("CCHAR IS .");
	    tstack[tstack.length-1] += randomInt(10);
	} else if ( cchar != undefined ) {
	    console.log(cchar)
	    if (tstack.length == 0) tstack.push('');
	    tstack[tstack.length-1] += cchar;
	}
	console.log(tstack);
	index+=1;
	cchar = regex[index];
    }
    // really there should only be one element in tstack, but code no work good 
    return tstack.join('');
} 

var imgFromRegex = function(ctx, canvasSize, regex) {
    const imgData = ctx.createImageData(canvasSize[0], canvasSize[1]);
    const data = imgData.data;
    var expanded = new RandExp(regex).gen();
    for (var i = 0; i < expanded.length; i++) {
	if ( i * 4 < data.length ) {
	    var pix = letter2color(expanded[i]);
	    data[i*4] = pix[0];
	    data[i*4 + 1] = pix[1];
	    data[i*4 + 2] = pix[2];
	    data[i*4 + 3] = 255;
	}
    }
    return(imgData);
}

import('./randexp.min.js').then( (test) => { 
    var canvas = document.getElementById('img');
    const ctx = canvas.getContext('2d');
    var genBtn = document.getElementById("gen");
    var downBtn = document.getElementById("down");
    downBtn.onclick = e => {
	var link = document.createElement('a');
	link.download = 'imgex.png';
	link.href = canvas.toDataURL();
	link.click();
    };
    genBtn.onclick = e => {
	canvas.width = 128;
	canvas.height = 128;
	var regex  = document.getElementById('imgex').value;
	var dat = imgFromRegex(ctx, [128, 128], regex);
	ctx.putImageData(dat, 0, 0);
	var imgdata = canvas.toDataURL();
	var imel = new Image();
	imel.src = imgdata;
	imel.onload = function() {
	    canvas.width = 512;
	    canvas.height = 512;
	    ctx.drawImage(imel, 0, 0, 512, 512); 
	};
    };
});

