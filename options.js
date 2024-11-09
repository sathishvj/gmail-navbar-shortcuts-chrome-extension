const gnoLoc = "gmail-navbar-options";

// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// Option 3: Create a helper function for deferred execution
function waitForElement(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
}

// Saves options to chrome.storage
function saveOptions() {
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
  console.log(gnoLoc, "Links: ", links);
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
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
  chrome.storage.sync.get(
    {
      color: defaultColor,
      showTitles: defaultShowTitles,
      links: JSON.stringify(Array.from(defaultLinksMap.entries())),
    },
    (items) => {
      document.getElementById("color").value = items.color;
      setColorBoxBackgroundColor();
      document.getElementById("showTitles").checked = items.showTitles;

      console.log(gnoLoc, "restoreOptions: ", items.links, typeof items.links);
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
}

function insertIconsOptions() {
  var iconsSubContainer = document.createElement("div");

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

    iconsSubContainer.append(div);
  }

  // timing hack that I'm not able to fix right now
  waitForElement("#iconsContainer")
    .then((element) => {
      //   const iconsContainer = document.getElementById("iconsContainer");
      element.append(iconsSubContainer);
    })
    .catch((error) => {
      console.error("Error appending to element iconsContainer:", error);
    });
}

function resetOptions() {
  document.getElementById("color").value = defaultColor;
  document.getElementById("showTitles").checked = defaultShowTitles;

  for (let [name, link] of defaultLinksMap) {
    document.getElementById(name + "IconURL").value = link.url;
    document.getElementById(name + "IconTitle").value = link.title;
    document.getElementById(name + "IconShow").checked = link.show;
  }
}

function addListeners() {
  const elements = [
    { selector: "#save", event: "click", handler: saveOptions },
    { selector: "#reset", event: "click", handler: resetOptions },
    {
      selector: "#grey-box",
      event: "click",
      handler: () => setColor("#444746"),
    },
    {
      selector: "#black-box",
      event: "click",
      handler: () => setColor("#000000"),
    },
    {
      selector: "#white-box",
      event: "click",
      handler: () => setColor("#ffffff"),
    },
    {
      selector: "#color",
      event: "change",
      handler: () => setColorBoxBackgroundColor(),
    },
  ];

  elements.forEach(({ selector, event, handler }) => {
    waitForElement(selector)
      .then((element) => {
        element.addEventListener(event, handler);
      })
      .catch((error) => {
        console.error(`Error appending to element ${selector}:`, error);
      });
  });
}

function setColor(color) {
  waitForElement("#color").then((element) => {
    element.value = color;
    setColorBoxBackgroundColor();
  });
}

function setColorBoxBackgroundColor() {
  waitForElement("#color").then((element) => {
    console.log(gnoLoc, "color.value: ", element.value);
    element.style.backgroundColor = element.value;
  });
}

function createElements() {
  insertIconsOptions();
  restoreOptions();
  addListeners();
}

// var alreadyRunOptions = false;
// function runOnOptionsDomComplete() {
//   if (alreadyRunOptions === true) return;
//   alreadyRunOptions = true;
//   addEventListeners();
// }

document.addEventListener("DOMContentLoaded", () => {
  console.log(gnoLoc, "DOMContentLoaded");

  // console.log("gmail-navbar-options: DOM is fully loaded!");
  //   runOnOptionsDomComplete();
  createElements();
});
