function getQWiki(info,tab) {
  
  // console.log("Word " + info.selectionText + " was clicked.");

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id , info.selectionText, function(response) { 
    	// console.log("in resp");
      });  
 	  }
  );

}

chrome.contextMenus.create({
  title: "QWiki: %s", 
  contexts:["selection"], 
  onclick: getQWiki
});