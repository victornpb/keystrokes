/**
*  keystrokes.js  - written by Victor N - 21/Jan/2010 - www.vitim.us
*  27/Apr/2012 - added support to string #id and fixed keystrokes
*/


/**
 * Add a event to a element;
 * @param {Object} element	Element or ID;
 * @param {String} trigger	Trigger to fire action eg:load,click,mouseover,etc;
 * @param {Function} action	A pointer to a function to be called on trigger;
 */
function addEvent(element,trigger,action) {
	if(typeof element==="string"){element=document.getElementById(element);}
	if (element.addEventListener) {
		element.addEventListener(trigger,action,false);
		return true;
	} else if (element.attachEvent) {
		element['e'+trigger+action] = action;
		element[trigger+action] = function() { element['e'+trigger+action]( window.event );}
		var r = element.attachEvent('on'+trigger, element[trigger+action]);
		return r;
	} else {
		element['on'+trigger] = action;
		return true;
	}
}

function id(id){
	return document.getElementById(id);
}


/******************************************************************************************/

var Keys = { "BACKSPACE":8, "TAB":9,"ENTER":13,"SHIFT":16,"CTRL":17,"ALT":18, "PAUSEBREAK":19, "CAPSLOCK":20,"ESC":27, "SPACE":32, "PAGEUP":33, "PAGEDOWN":34, "END":35, "HOME":36, "LEFT":37, "UP":38, "RIGHT":39, "DOWN":40, "PRNTSCRN":44, "INSERT":45, "DELETE":46, "0":48, "1":49, "2":50, "3":51, "4":52, "5":53, "6":54, "7":55, "8":56, "9":57, "A":65, "B":66, "C":67, "D":68, "E":69, "F":70, "G":71, "H":72, "I":73, "J":74, "K":75, "L":76, "M":77, "N":78, "O":79, "P":80, "Q":81, "R":82, "S":83, "T":84, "U":85, "V":86, "W":87, "X":88, "Y":89, "Z":90, "WINKEY":91, "WINKEYR":92, "APPLICATION":93, "NUM0":96, "NUM1":97, "NUM2":98, "NUM3":99, "NUM4":100, "NUM5":101, "NUM6":102, "NUM7":103, "NUM8":104, "NUM9":105, "MULTIPLY":106, "ADD":107, "SUBTRACT":109, "DECIMALPOINT":110, "DIVIDE":111, "F1":112, "F2":113, "F3":114, "f4":115, "F5":116, "F6":117, "F7":118, "F8":119, "F9":120, "F10":121, "F11":122, "F12":123, "NUMLOCK":144, "SCROLLLOCK":145, "SEMICOLON":186, "EQUAL":187, "COMMA":188, "DASH":189, "PERIOD":190, "SLASH":191, "GRAVE":192, "OPENBRAKET":219, "BACKSLASH":220, "CLOSEBRAKET":221, "SINGLEQUOTE":222, "MMNEXT":176, "MMPREVIOUS":177, "MMSTOP":178, "MMPLAY":179, "MMREWIND":227, "MMFORWARD":228, "MYCOMPUTER":182, "MYCALCULATOR":183, "HELP":225, "Invalid!":0
}

/**
 * Execute an action when key event match to keystroke;
 * @param {Object} event	Event;
 * @param {String} keystroke	Element or ID in "#elm" format, or a fixed keystroke like "CTRL+1";
 * @param {Function} action	A pointer to a function to be called on trigger;	
 */
function hotAction(event,keystroke,action){
	
	if(typeof keystroke==="string" && keystroke.charAt(0)=="#"){ // id
		keystroke=document.getElementById(keystroke.substring(1,keystroke.length)).value;
	}
	else if(typeof keystroke==="element"){ //element
		keystroke=keystroke.value;
	}
	if(isKeyEventEqualKeyCombination(event,keystroke)){
		action();
	}
}

/** Return true when key event match to keyCombination:string ex:"CTRL+1" */
function isKeyEventEqualKeyCombination(event,keyCombination){
	
	var pressedKeyCode=event.keyCode;
	
	if(keyCombination=="<none>"){
		return false;
	}
	else if(keyCombination.indexOf("+")!=-1){ //key combination
		
		var Ctrl=keyCombination.indexOf("CTRL")!=-1;
		var Alt=keyCombination.indexOf("ALT")!=-1;
		var Shift=keyCombination.indexOf("SHIFT")!=-1;
		var Winkey=keyCombination.indexOf("WINKEY")!=-1;
		
		var key=keyCombination.split("+");
		for(var i=0;i<key.length;i++){
			if(key[i]!="CTRL" && key[i]!="ALT" && key[i]!="SHIFT" && key[i]!="WINKEY"){
				key = pressedKeyCode==Keys[key[i]];
				break;
			}
		}	
		return (event.ctrlKey==Ctrl)&&(event.altKey==Alt)&&(event.shiftKey==Shift)&&(event.metaKey==Winkey)&&(key);
	}
	else{ //single key
		return pressedKeyCode==Keys[keyCombination];
	}
}

/** Enable inputs with class="keystroke" to turn into customizable keystroke; */
function initializeKeystrokeButtons(){

	var elements=document.getElementsByClassName('keystroke');
	
	for(var i=0;i<elements.length;i++){
		addEvent(elements[i],"click", keystrokeStartEdit);
		addEvent(elements[i],"keydown", keystrokeEdit);
		addEvent(elements[i],"keyup", keystrokeEndEdit);
		addEvent(elements[i],"blur", keystrokeEndEdit);
		addEvent(elements[i],"dblclick", keystrokeRemove);
	}

	function keystrokeStartEdit(e){
		if(this.type.toLowerCase()=="button"){
			this.title=this.value;
			this.value=this.placeholder;
			this.type="text";
			this.focus();
		}
	}
	
	function keystrokeEdit(e){
		this.title=getKeystroke(e);
		this.value=this.title;
		e.preventDefault();
		return false;
	}
	
	function keystrokeEndEdit(e){
		this.type="button";
		this.value=this.title;
		this.blur();
	}
	
	function keystrokeRemove(e){
		this.title="<none>";
		this.value=this.title;
		this.type="button";
	}
	
	function getKeyname(event){
		var keyName=event.keyCode;
		for(var name in Keys){
			if(Keys[name]==event.keyCode){
				keyName=name;
				break;
			}
		}
		return keyName;
	}

	function getKeystroke(event){
		var keystroke="";
		var key=getKeyname(event);
		var modifiers=checkModifiers(event);
		
		if(key=="CTRL" || key=="ALT" || key=="SHIFT" || key=="WINKEY"){
			keystroke=modifiers.substring(0,modifiers.length-1);
		}
		else{
			keystroke=modifiers+key;
		}
		return keystroke;
	}
	
	function checkModifiers(event){
		var modifiers="";
		if(event.ctrlKey) modifiers+="CTRL+";
		if(event.altKey) modifiers+="ALT+";
		if(event.shiftKey) modifiers+="SHIFT+";
		if(event.metaKey) modifiers+="WINKEY+";
		return modifiers;
	}
}
