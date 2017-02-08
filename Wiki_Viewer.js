var icon = document.getElementById("search-icon");
var searchText = document.querySelector("#search-bar > [type=text]");
var bar = document.querySelector("#search-bar");
var close = document.querySelector("#close");
var rand = document.getElementById("rand");
var search = document.getElementById("search");
var results = document.getElementById("results");
var options = document.getElementById("options");

icon.onclick = function(){
  searchText.style.display = "inline-block";
  close.style.display = "inline-block";
  bar.classList.add("active");
  icon.classList.add("active");
  searchText.focus();
}

close.onclick = function(){
  searchText.style.display = "none";
  close.style.display = "none";
  bar.classList.remove("active");
  icon.classList.remove("active");
  search.classList.remove("start");
  options.classList.remove("top");
  results.innerHTML = "";
  options.innerHTML = "";
  bar.reset();
}

function autocomplete(e){
  // console.log(this.value);
  e.preventDefault();
  options.innerHTML = "";
  // options.style.left = search.offsetLeft+50+"px";
  // results.innerHTML = "";
  if(this.value.length > 2){
   var val = this.value;
   var titles = [];

   url = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrsearch="+val+"&prop=extracts&exintro&explaintext&exsentences=1&exlimit=max";
   $.getJSON(url, data => {

      // If no result returned
      // console.log(data);
      if(!data.query){
        return;
      }

      var pages = data.query.pages;
      for(var key in pages){
        titles.push(pages[key].title);
      }
      // console.log(titles);
      var html = titles.map( title => {
        var re = new RegExp(val, "gi");
        title = title.replace( re, `<span class="hightlight">${val}</span>`);
        // console.log(title);
        return `<li>${title}</li>`;
      }).join("");
      // console.log(html);
      options.innerHTML = html;

      options.onclick = function(e){
        // console.log(e.target.innerText);
        searchText.value = e.target.innerText;
        options.innerHTML = "";
        searchText.focus();
      }
   });
  }
}

function getQuery(e){
  results.innerHTML = "";
  options.innerHTML = "";
  e.preventDefault();
  // console.log(searchText.value);
  var titles = [];
  var extracts = [];
  var pageids = []; 
  var val = searchText.value;

  url = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrsearch="+val+"&prop=extracts&exintro&explaintext&exsentences=1&exlimit=max";
  $.getJSON(url, data => {
    
    // If no result returned
    // console.log(data);
    if(!data.query){
      results.innerHTML = `<div class="new-div"><h1>No results available for ${val}</h1></div>`;
      return;
    }

    var pages = data.query.pages;
    // console.log(pages);
    for(var key in pages){
      // console.log(key);
      titles.push(pages[key].title);
      pageids.push(pages[key].pageid);
      extracts.push(pages[key].extract);
    }
    // console.log(titles,pageids,extracts);

    search.classList.add("start");
    options.classList.add("top");

    for(var i = 0; i < titles.length; i++){
      var a = document.createElement("a");
      var div = document.createElement("div");
      var h1 = document.createElement("h1");
      var p = document.createElement("p");
      var url = "https://en.wikipedia.org/?curid="+pageids[i];
      a.setAttribute("href", url);
      a.setAttribute("target", "_blank");
      h1.innerHTML = titles[i];
      p.innerHTML = extracts[i];
      a.appendChild(div);
      div.appendChild(h1);
      div.appendChild(p);
      div.classList.add("new-div");
      results.appendChild(a);
    }

    this.reset();
    options.innerHTML = "";
    setTimeout( () => options.innerHTML = "", 1000);

  });
  searchText.blur();  
}

function unfocus(e){
  console.log(e);
  var target = e.target;
  if(target !== options)
    options.innerHTML = "";
}

bar.addEventListener("submit", getQuery);
searchText.addEventListener("input", autocomplete);
searchText.addEventListener("focus", autocomplete);
document.addEventListener("click", unfocus);

rand.onclick = function(){
  var url = "https://en.wikipedia.org/wiki/Special:Random";
  window.open(url,'_blank');
};