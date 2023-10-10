chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete" && /^http/.test(tab.url)) {
    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        files: ["./content.js"],
      })
      .then(() => {
        console.log("INJECTED");
      })
      .catch((err) => console.log(err));
  }
});
