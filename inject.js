// a preferance or a settings page
// detect the body background and set your background accordingly to suit asthetic 
// implement drag ? good feature or not?
// set opacity according to input range
// disable on a form or input element
// select a text and shortcut (different) allows you to collect links from a page. when the work is done open the extension and fire all links or 1 link at a time.
// place a (less..) or up arrow/triangle on the bottom when a hidden heading is expanded to indicate hide again feature from bottom 
// h1,2,...6 can have a,i others inside it. remove them


// side panel or all container div
var div = document.createElement("div");
// resize handler or red button to resize
var handle = document.createElement("div");
// content div or inner div where text displayed
var innerDiv = document.createElement("div");
// close span or close button
var closeSpan = document.createElement("span");
// divs to un/hide the text in inner div
var hiders;

// add css to outer container div that holds everything
div.classList.add("qwiki-extension-outer-div");
div.style.top = window.scrollY + 40 +"px";

// add css close-span which with close button
closeSpan.classList.add("qwiki-extension-close-span");

// add css inner-div where content is
innerDiv.classList.add("qwiki-extension-inner-div");

// add css to resize handle element
handle.classList.add("qwiki-extension-handle");

// format close button
closeSpan.innerHTML = "&#10006;";

// format resize handle
/*
Object.assign( handle.style, { 
                                bottom: "0",
                                left: "0",
                                cursor: "nesw-resize",
                                position: "absolute",
                                width: "10px",
                                height: "10px",
                                background: "red"
                              });
*/

// format inner div
/*
Object.assign( innerDiv.style, {
                                  position: "relative",
                                  overflowY: "auto",
                                  height: "90%",
                                  width: "99%",
                                  textAlign: "justify"
                              });
*/

// format side panel
/*
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
*/
 
// add close button, resize handle and inner text container to main container. add this to body
div.appendChild(closeSpan);
div.appendChild(handle);
div.appendChild(innerDiv);
document.body.appendChild(div);

// change the width and height of side panel or container according to the mouse position 
// when click and drag on red resize handle
function startResize(e){
  e.preventDefault();
  // console.log(e.clientY, div.offsetTop);
  div.style.width = (window.innerWidth - e.clientX - 30) + "px";
  div.style.height = (e.clientY - 100) + "px";
}

// remove events when mouse no longer dragging resize handle
function stopResize(){
  window.removeEventListener("mousemove", startResize);
  window.removeEventListener("mouseup", stopResize);
}

// checks for mousemovement and mouseup
function initResize(){
  window.addEventListener("mousemove", startResize);
  window.addEventListener("mouseup", stopResize);
}

// remove the side panel when close button clicked
function closePanel(){
  div.style.height = "0";
  div.style.width = "0";
  div.style.opacity = "0";
  div.style.padding = "0";
  innerDiv.style.padding = "0";
}

// check if class "hide" is added. If yes, then remove else add
function unhide(e){
  // console.log(e);
  if(e.target.localName == "h2"){
    var hide = e.srcElement.parentElement.children[1];
    if(!hide.classList.length)
      hide.classList.add("qwiki-extension-hide")
    else hide.classList.remove("qwiki-extension-hide");
  }
}

// start resizing when click and drag
handle.addEventListener("mousedown", initResize);
// close the side panel
closeSpan.addEventListener("click", closePanel);

// side panel styling
// needed whenever container closed and reopened
function styleSidePanel(){
  
  // transition side panel
  div.style.width = "400px";
  div.style.height = "75vh";
  div.style.opacity = "1";
  div.style.borderRadius = "3px";
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
  var original_val = window.getSelection().toString();

  // format val for spaces
  var val = original_val.trim().replace(/\s/g, "_");
  console.log("format value: ", val);

  // url to get data from
  // var url = "https://en.wikipedia.org/w/api.php?action=parse&format=json&page="+val+"&prop=text&redirects=1";
  var url = "https://en.wikipedia.org/w/api.php?action=parse&prop=text&page="+val+"&format=json&redirects=1";

  // get the data, format it and put it in the side panel 
  $.getJSON(url, data => {

    // console.log(data);

    // If no result returned
    if(data.error){
      alert("No result for "+val);
      return;
    }

    styleSidePanel();

    // console.log(data.parse.text["*"]);
    
    // get the markup in a div container which gives htmlcollection[] object
    innerDiv.innerHTML = data.parse.text["*"];

    // console.log(innerDiv.children[0].children);

    // convert the htmlcollection datatype to array and remove unwanted properties
    var children = Array.from(innerDiv.children[0].children);
        children = children.filter( child => {
          // console.log(child.tagName);
          return child.tagName !== "TABLE" && child.tagName !== "DIV"; 
        });

    // format the array, convert it into string
    // parser that removes wiki markup and adds html
    var html = children.map( child => {
                if(child.tagName === "P")
                  return `<p class="qwiki-extension-para-graph">${child.innerText}</p>`; 
                else if(child.tagName === "H2")
                  return `</article></div><div id="${child.innerText.replace(/\[\w+\]/, "")}"><h2 class="qwiki-extension-heading2">${child.innerText}</h2><article class="qwiki-extension-hide">`;
                else if(child.tagName === "H3")
                  return `<h3 class="qwiki-extension-heading3">${child.innerText}</h3>`;
                else if(child.tagName === "UL")
                  return `<ul class="qwiki-extension-para-graph">${child.innerText}</ul>`;
                else return;
              }) 
              .join("")
              .replace(/\[\w+\]/g, "");

    // remove extra div and article tags from the begining
    html = html.replace("</article></div>", "");
    html = `<h1 class="qwiki-extension-panel-h1"><a title="link to Wiki" href="https://en.wikipedia.org/wiki/${val}" target="_blank">${original_val}</a></h1>` + html;    
    
    // Get the indexes of See also , Footnotes, References, External Links and other redundant headings
    var see = html.indexOf("See also") === -1 ? html.length : html.indexOf("See also");
    var ref = html.indexOf("References") === -1 ? html.length : html.indexOf("References");
    var ext = html.indexOf("External links") === -1 ? html.length : html.indexOf("External links");
    var foot = html.indexOf("Footnotes") === -1 ? html.length : html.indexOf("Footnotes");
    // store the minimum
    var min = Math.min(see, ref, ext, foot);
    // if none of these are present in the document then -1 will be displayed
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

/*
function detectKeys(e){
  // console.log(e);
  if(e.shiftKey && e.altKey && e.which === 81){
    console.log("shortcut activate");
    // console.log(window.getSelection().toString());
    getString();
  }
}*/

// detect shortcut / hotkey and fire getString
// document.addEventListener("keydown", detectKeys);

// receive message from background.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    getString();
})
