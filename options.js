// Saves options to chrome.storage
const saveOptions = () => {
  var color = document.getElementById("color").value;
  var showTitles = document.getElementById("showTitles").checked;
  // const likesColor = document.getElementById("like").checked;

  if (!color) color = "#444746";
  // if (!showTitles) showTitles = "15px 25px 0px 25px";

  chrome.storage.sync.set({ color: color, showTitles: showTitles }, () => {
    // Update status to let user know options were saved.
    const status = document.getElementById("status");
    status.textContent = "Options saved.";
    setTimeout(() => {
      status.textContent = "";
    }, 750);
  });
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get({ color: "#444746", showTitles: true }, (items) => {
    document.getElementById("color").value = items.color;
    document.getElementById("showTitles").checked = items.showTitles;
  });
};

const addListeners = () => {
  document.getElementById("save").addEventListener("click", saveOptions);
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.addEventListener("DOMContentLoaded", addListeners);
