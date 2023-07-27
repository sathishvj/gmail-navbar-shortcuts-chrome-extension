// Saves options to chrome.storage
const saveOptions = () => {
  var color = document.getElementById("color").value;
  var showTitles = document.getElementById("showTitles").checked;
  // const likesColor = document.getElementById("like").checked;

  if (!color) color = defaultColor;
  // if (!showTitles) showTitles = "15px 25px 0px 25px";

  var links = new Map();
  for (let i in iconNames) {
    var iconName = iconNames[i];
    links.set(iconName, {
      url: document.getElementById(iconName + "IconURL").value.trim(),
      title: document.getElementById(iconName + "IconTitle").value.trim(),
      show: document.getElementById(iconName + "IconShow").checked,
    });
  }
  console.log("Links: ", links);
  let linksSerialMap = JSON.stringify(Array.from(links.entries()));

  chrome.storage.sync.set(
    { color: color, showTitles: showTitles, links: linksSerialMap },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById("status");
      status.textContent = "Options saved.";
      setTimeout(() => {
        status.textContent = "";
      }, 750);
    }
  );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get(
    {
      color: defaultColor,
      showTitles: defaultShowTitles,
      links: JSON.stringify(Array.from(defaultLinksMap.entries())),
    },
    (items) => {
      document.getElementById("color").value = items.color;
      document.getElementById("showTitles").checked = items.showTitles;

      console.log("restoreOptions: ", items.links, typeof items.links);
      // const map = new Map(Object.entries(items.links));
      let linksMap = new Map(JSON.parse(items.links));

      // if (items.links && items.links.leng) {
      for (let [name, link] of linksMap) {
        document.getElementById(name + "IconURL").value = link.url;
        document.getElementById(name + "IconTitle").value = link.title;
        document.getElementById(name + "IconShow").checked = link.show;
      }
    }
  );
};

const insertIconsOptions = () => {
  const iconsContainer = document.getElementById("iconsContainer");

  for (i in iconNames) {
    const icon = iconNames[i];
    const div = document.createElement("div");
    let svgData = svgs[icon];

    svgData = svgData.replace("fill:#000000;", "fill:" + defaultColor);
    svgData = svgData.replace("<svg ", "<svg width='20px' ");
    // <img src="svgs/${icon}.svg" width="25px" />
    div.innerHTML = `<div class="row">
      ${svgData}
      <input type="checkbox" name="${icon}IconShow" id="${icon}IconShow"/>
      <input type="text" name="${icon}IconURL" id="${icon}IconURL" class="urlTextbox" placeholder="url like https://mail.google.com/mail/u/0/#...">
      <input type="text" name="${icon}IconTitle" id="${icon}IconTitle" placeholder='Title'/>
    </div>
    `;
    iconsContainer.append(div);
  }
};

const resetOptions = () => {
  document.getElementById("color").value = defaultColor;
  document.getElementById("showTitles").checked = defaultShowTitles;

  for (let [name, link] of defaultLinksMap) {
    document.getElementById(name + "IconURL").value = link.url;
    document.getElementById(name + "IconTitle").value = link.title;
    document.getElementById(name + "IconShow").checked = link.show;
  }
};

const addListeners = () => {
  document.getElementById("save").addEventListener("click", saveOptions);
  document.getElementById("reset").addEventListener("click", resetOptions);

  document.getElementById("grey-box").addEventListener("click", function () {
    document.getElementById("color").value =
      document.getElementById("grey-box").innerText;
  });
  document.getElementById("black-box").addEventListener("click", function () {
    document.getElementById("color").value =
      document.getElementById("black-box").innerText;
  });
  document.getElementById("white-box").addEventListener("click", function () {
    document.getElementById("color").value =
      document.getElementById("white-box").innerText;
  });

  insertIconsOptions();
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.addEventListener("DOMContentLoaded", addListeners);
