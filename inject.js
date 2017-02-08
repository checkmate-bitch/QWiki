// add : select a text and press a shortcut key or right click option to get the wiki for the selected text 
// implement drag ? good feature or not?
// set opacity according to input range
// detect the body background and set your background accordingly to suit asthetic 
// get a settings page. 
// disable on a form or input element
// run only when double click gives a string 


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
closeSpan.classList.add("close-span");

// add class inner-div
innerDiv.classList.add("inner-div");

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
  div.style.width = (window.innerWidth - e.clientX - 50) + "px";
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
  // div.style.transform = "translateY(0)";
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
// un/hide headings

// function beginHiders(){
  // hiders.forEach( hider => {
    // console.log("hider");
    // hider.addEventListener("click", unhide)
  // });
// }

function getString(){
  console.log(window.getSelection().toString());
  
  // transition side panel
  div.style.width = "350px";
  div.style.height = "70vh";
  div.style.opacity = "1";
  div.style.padding = "50px 10px 0 10px";
  div.style.transition = `opacity 0.5s ease-in-out`;
  div.style.top = window.scrollY + 60 +"px";
  // div.style.transition = `translateY 1s cubic-bezier(0.68, -0.85, 0.265, 1.55)`;

  // inner div padding
  innerDiv.style.padding = "0 10px 0 10px";

  // get the word on which the event double click triggered
  var val = window.getSelection().toString();

  // url to get data from
  var url = "https://en.wikipedia.org/w/api.php?action=parse&format=json&page="+val+"&prop=text&redirects=1"

  
  // get the data, format it and put it in the side panel 
  $.getJSON(url, data => {
    
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
                  return `<p>${child.innerText}</p>`; 
                else if(child.tagName === "H2")
                  return `</article></div><div id="${child.innerText.replace(/\[\w+\]/, "")}"><h2>${child.innerText}</h2><article class="hide">`;
                else if(child.tagName === "H3")
                  return `<h3>${child.innerText}</h3>`;
                else  return `<ul>${child.innerText}</ul>`;
              })
              .join("")
              .replace(/\[\w+\]/g, "");

    // remove extra div and article tags from the begining
    html = html.replace("</article></div>", "");

    /*
    var see = html.indexOf("See also") === -1 ? html.length : html.indexOf("See also");
    var ref = html.indexOf("References") === -1 ? html.length : html.indexOf("References");
    var ext = html.indexOf("External links") === -1 ? html.length : html.indexOf("External links");
    var foot = html.indexOf("Footnotes") === -1 ? html.length : html.indexOf("Footnotes");
    var min = Math.min(see, ref, ext, foot);
    var index = min === -1 ? html.length : min; 

    console.log(index);
    // See also , Footnotes, References, External Links 
    

    // append formatted string into innerDiv
    // innerDiv.innerHTML = html.substring(0, index);*/
    innerDiv.innerHTML = html;
    
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