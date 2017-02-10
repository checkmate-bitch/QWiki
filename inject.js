// add : select a text and press a shortcut key or right click option to get the wiki for the selected text 
// implement drag ? good feature or not?
// set opacity according to input range
// detect the body background and set your background accordingly to suit asthetic 
// get a settings page. 
// disable on a form or input element
// run only when double click gives a string 
// select a text and shortcut (different) allows you to collect links from a page. when the work is done open the extension and fire all links or 1 link at a time.
// place a (less..) or up arrow/triangle on the bottom when a hidden heading is expanded to indicate hide again feature from bottom 


// side panel
var div = document.createElement("div");
// resize handler
var handle = document.createElement("div");
// content 
var innerDiv = document.createElement("div");
// close span
var closeSpan = document.createElement("span");
// divs to un/hide the text
var hiders;

// add class close-span
closeSpan.classList.add("extension-close-span");

// add class inner-div
innerDiv.classList.add("extension-inner-div");

// format close button
closeSpan.innerHTML = "&#10006;";

// format resize handle
Object.assign( handle.style, { 
                                bottom: "0",
                                left: "0",
                                cursor: "nesw-resize",
                                position: "absolute",
                                width: "10px",
                                height: "10px",
                                background: "red"
                              });

// format inner div
Object.assign( innerDiv.style, {
                                  position: "relative",
                                  overflowY: "auto",
                                  height: "90%",
                                  width: "100%",
                                  textAlign: "justify"
                              });

// format side panel
Object.assign(div.style , {
                            position: "absolute",
                            right: "0",
                            width: "0",
                            // background: "#28aadc",
                            background: "#2f4f4f",
                            opacity: "0",
                            overflow: "hidden",
                            boxShadow: "-8px 5px 20px -4px rgba(122,119,140,0.71)"
                          });
div.style.zIndex = "9999";
div.style.top = window.scrollY + 40 +"px";
 
// append resize handle to side panel and side panel to body
div.appendChild(closeSpan);
div.appendChild(handle);
div.appendChild(innerDiv);
document.body.appendChild(div);

// change the width and height of side panel according to the mouse position
function startResize(e){
  e.preventDefault();
  // console.log(e.clientY, div.offsetTop);
  div.style.width = (window.innerWidth - e.clientX - 30) + "px";
  div.style.height = (e.clientY - 100) + "px";
}

// remove events when up
function stopResize(){
  window.removeEventListener("mousemove", startResize);
  window.removeEventListener("mouseup", stopResize);
}

// checks for mousemovement and mouseup
function initResize(){
  window.addEventListener("mousemove", startResize);
  window.addEventListener("mouseup", stopResize);
}

function closePanel(){
  div.style.height = "0";
  div.style.width = "0";
  div.style.opacity = "0";
  div.style.padding = "0";
  innerDiv.style.padding = 0;
}

// check if class "hide" is added. If yes, then remove else add
function unhide(e){
  // console.log(e);
  if(e.target.localName == "h2"){
    var hide = e.srcElement.parentElement.children[1];
    if(!hide.classList.length)
      hide.classList.add("hide")
    else hide.classList.remove("hide");
  }
}

// start resizing
handle.addEventListener("mousedown", initResize);
// close the side panel
closeSpan.addEventListener("click", closePanel);

// side panel styling
function styleSidePanel(){
  
  // transition side panel
  div.style.width = "350px";
  div.style.height = "75vh";
  div.style.opacity = "1";
  div.style.padding = "50px 10px 0 10px";
  div.style.transition = `opacity 0.5s ease-in-out`;
  div.style.top = window.scrollY + 55 +"px";
  // div.style.transition = `translateY 1s cubic-bezier(0.68, -0.85, 0.265, 1.55)`;

  // inner div padding
  innerDiv.style.padding = "0 10px 0 10px";

}


function getString(){

  console.log(window.getSelection().toString());
  
  // get the word on which the event double click triggered
  var val = window.getSelection().toString();

  // format val for spaces
  val = val.trim().replace(/\s/g, "_");
  console.log("format value: ", val);

  // url to get data from
  var url = "https://en.wikipedia.org/w/api.php?action=parse&format=json&page="+val+"&prop=text&redirects=1";

  
  // get the data, format it and put it in the side panel 
  $.getJSON(url, data => {

    // console.log(data);

    // If no result returned
    if(data.error){
      alert("No result for the term");
      return;
    }

    styleSidePanel();
    
    // get the markup in a div container which gives htmlcollection[] object
    innerDiv.innerHTML = data.parse.text["*"];

    // convert the htmlcollection to array and remove unwanted properties
    var children = Array.from(innerDiv.children);
        children = children.filter( child => {
          // console.log(child.tagName);
          return child.tagName !== "TABLE" && child.tagName !== "DIV"; 
        });

    // format the array, convert it into string
    var html = children.map( child => {
                if(child.tagName === "P")
                  return `<p class="para-graph">${child.innerText}</p>`; 
                else if(child.tagName === "H2")
                  return `</article></div><div id="${child.innerText.replace(/\[\w+\]/, "")}"><h2 class="heading2">${child.innerText}</h2><article class="hide">`;
                else if(child.tagName === "H3")
                  return `<h3 class="heading3">${child.innerText}</h3>`;
                else  return `<ul class="para-graph">${child.innerText}</ul>`;
              })
              .join("")
              .replace(/\[\w+\]/g, "");

    // remove extra div and article tags from the begining
    html = html.replace("</article></div>", "");

    
    // Get the indexes of See also , Footnotes, References, External Links and other redundant headings
    var see = html.indexOf("See also") === -1 ? html.length : html.indexOf("See also");
    var ref = html.indexOf("References") === -1 ? html.length : html.indexOf("References");
    var ext = html.indexOf("External links") === -1 ? html.length : html.indexOf("External links");
    var foot = html.indexOf("Footnotes") === -1 ? html.length : html.indexOf("Footnotes");
    // store the minimum
    var min = Math.min(see, ref, ext, foot);
    // if none of these are present in the document then -1 will be displayed
    // so using ternary operator
    var index = min === -1 ? html.length : min; 
    // console.log("all",{see,ref,ext,foot});
    // console.log(index);
    
    // get string only till useful content
    // append formatted string into innerDiv
    innerDiv.innerHTML = html.substring(0, index);
    // innerDiv.innerHTML = html;

    // add css to innerDiv children
    /*
    var children = innerDiv.children;
    for(var i= 0; i< children.length; i++){
      children[i].style.color = "wheat";
    }*/
    
    // add all inner divs to un/hide
    hiders = Array.from(innerDiv.querySelectorAll("div"));
    hiders.forEach( hider => {
      // console.log(hider);
      hider.addEventListener("click", unhide);
    });
    // beginHiders;

  });   
}

document.addEventListener("dblclick" , getString);

function detectKeys(e){
  // console.log(e);
  if(e.shiftKey && e.altKey && e.which === 81){
    console.log("shortcut activate");
    // console.log(window.getSelection().toString());
    getString();
  }
}

// detect shortcut / hotkey and fire getString
document.addEventListener("keydown", detectKeys);

// receive message from background.js
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    // console.log({request, sender, sendResponse});
    getString();
})