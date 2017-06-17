// send message to inject.js when option is selected from context menu
function getQWiki(info,tab) {
  
  // console.log("Word " + info.selectionText + " was clicked.");

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id , info.selectionText, function(response) { 
      // console.log("in resp");
      });  
    }
  );

}

// create an option in the context menu
chrome.contextMenus.create({
  title: "QWiki: %s", 
  contexts:["selection"], 
  onclick: getQWiki
});

// trigger when hotkey command is pressed
chrome.commands.onCommand.addListener(function(cmd){

  console.log("command:", cmd);

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      // console.log("tabs", tabs);
      chrome.tabs.sendMessage(tabs[0].id , {action: "SendIt"}, function(response) { 
    	 // console.log("in resp");
      });  
 	  }
  );

});
