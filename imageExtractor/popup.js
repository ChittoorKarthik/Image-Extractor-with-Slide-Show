
document.getElementById("extractImagesButton").onclick=function() {

    console.log("clicked Extractbtn");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        console.log("sending extract request to content.js");
        chrome.tabs.sendMessage(activeTab.id, {action: "extractImages"});
    });
}

document.getElementById("stopButton").onclick=function() {
    console.log("clicked Stopbtn");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        console.log("sending stop extension request to content.js");
        chrome.tabs.sendMessage(activeTab.id, {action: "stopExtension"});
    });
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
    if (message.action === "displayImages") {
        console.log("recieved request to display images");
        initImageDisplay(message.images);
    }
});


