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

const insertIconsOptions = () => {
  var icons = [
    "inbox",
    "compose",
    "starred",
    "sent",
    "multipleMail",
    "trash",
    "setting",
    "badge",
    "alarm",
    "bell",
    "bookmark",
    "calendar",
    "cloudy",
    "controls",
    "global",
    "graph",
    "home",
    "location",
    "musicPlayer",
    "picture",
    "promotion",
    "target",
  ];

  const iconsContainer = document.getElementById("iconsContainer");

  for (i in icons) {
    const icon = icons[i];
    const div = document.createElement("div");
    div.innerHTML = `<div class="row">
      <img src="svgs/${icon}.svg" width="25px" />
      <input type="checkbox" name="${icon}IconCheckbox" id="${icon}IconCheckbox"/>
      <input type="text" name="${icon}IconURL" id="${icon}IconURL" class="urlTextbox"/>
      <input type="text" name="${icon}IconTitle" id="${icon}IconTitle" />
    </div>
    `;
    iconsContainer.append(div);
  }
};

const addListeners = () => {
  document.getElementById("save").addEventListener("click", saveOptions);

  insertIconsOptions();
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.addEventListener("DOMContentLoaded", addListeners);
