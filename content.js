observeDOMChanges();

function observeDOMChanges() {
  console.log("gmail-nabvar: observeDOMChanges");

  // Observe changes in the DOM
  let observer = new MutationObserver((mutations) => {
    // Check if the DOM is fully loaded
    if (document.readyState === "complete") {
      runOnDomComplete();
      // Disconnect the observer once the DOM is complete
      observer.disconnect();
    }
  });

  // Start observing the DOM for changes
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // Run once when the document is initially loaded
  if (document.readyState === "complete") {
    runOnDomComplete();
  } else {
    window.addEventListener("load", runOnDomComplete);
  }
}

// Function to execute when DOM is changed and complete
var alreadyRun = false;
function runOnDomComplete() {
  if (alreadyRun === true) return;
  // Your code here
  console.log("gmail-navbar: DOM is fully loaded and changed!");

  alreadyRun = true;
  getOptionsAndNavbarUpdate();
}

var getElementByXPath = function (xPath) {
  var xPathResult = document.evaluate(
    xPath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  return xPathResult.singleNodeValue;
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getOptionsAndNavbarUpdate() {
  // alert("inside getOptionsAndNavbarUpdate");

  chrome.storage.sync.get(
    {
      color: defaultColor,
      showTitles: defaultShowTitles,
      links: JSON.stringify(Array.from(defaultLinksMap.entries())),
    },
    (items) => {
      color = items.color;
      showTitles = items.showTitles;
      let linksMap = new Map(JSON.parse(items.links));
      navbarUpdate(color, showTitles, linksMap);
    }
  );
}

function getNavbar() {
  let navbar = undefined;
  let navbarXPath = "";

  navbarXPath = "//*[normalize-space(.) = 'Mail']/ancestor::div[2]";
  navbar = getElementByXPath(navbarXPath);
  if (navbar) {
    console.log("gmail-navbar: worked with: " + navbarXPath);
    return navbar;
  }

  navbarXPath = "//*[normalize-space(.) = 'Mail']/ancestor::div[1]";
  navbar = getElementByXPath(navbarXPath);

  if (navbar) {
    console.log("gmail-navbar: worked with: " + navbarXPath);
    return navbar;
  }

  navbarXPath = "//*[normalize-space(.) = 'Mail']/ancestor::div[3]";
  navbar = getElementByXPath(navbarXPath);

  if (navbar) {
    console.log("gmail-navbar: worked with: " + navbarXPath);
    return navbar;
  }

  navbarXPath = "//*[normalize-space(.) = 'Mail']/ancestor::div[1]";
  navbar = getElementByXPath(navbarXPath);

  if (navbar) {
    console.log("gmail-navbar: worked with: " + navbarXPath);
    return navbar;
  }

  navbarXPath = "/html/body/div[7]/div[3]/div/div[2]/div[1]";
  navbar = getElementByXPath(navbarXPath);

  if (navbar) {
    console.log("gmail-navbar: worked with: " + navbarXPath);
    return navbar;
  }

  navbarXPath = "/html/body/div[8]/div[3]/div/div[2]/div[1]";
  navbar = getElementByXPath(navbarXPath);

  if (navbar) {
    console.log("gmail-navbar: worked with: " + navbarXPath);
    return navbar;
  }

  navbarXPath = "/html/body/div[6]/div[3]/div/div[2]/div[1]";
  navbar = getElementByXPath(navbarXPath);

  if (navbar) {
    console.log("gmail-navbar: worked with: " + navbarXPath);
    return navbar;
  }

  navbarXPath = "/html/body/div[9]/div[3]/div/div[2]/div[1]";
  navbar = getElementByXPath(navbarXPath);

  if (navbar) {
    console.log("gmail-navbar: worked with: " + navbarXPath);
    return navbar;
  }

  console.log("gmail-navbar: could not find navbar.");
  return undefined;
}

async function navbarUpdate(color, showTitles, links) {
  //await sleep(5000);

  // alert("inside navbarUpdate");
  // const navbarXPath = "/html/body/div[7]/div[3]/div/div[2]/div[1]";
  // const navbarXPath = "/html/body/div[8]/div[3]/div/div[2]/div[1]";
  // const navbarXPath = "/html/body/div[7]/div[3]/div/div[2]/div[1]";
  // const navbarXPath = "//div[@title='Mail']/ancestor::div[2]";
  // const navbarXPath = "//*[text()='Chat']/ancestor::div[2]";
  // var navbar = getElementByXPath(navbarXPath);
  // alert("Navbar is: " + navbar.innerHTML);

  const navbar = getNavbar();
  if (!navbar) {
    console.log("gmail-navbar:Navbar not found");
    return;
  }

  console.log("gmail-navbar: navbar is: " + navbar);

  console.log("gmail-navbar: navbar is: " + navbar.innerHTML);

  const divider = document.createElement("div");
  divider.classList = ["divider"];
  navbar.appendChild(divider);

  for (let [name, link] of links) {
    if (!link || !link.url || !link.show) continue;

    const div = document.createElement("div");
    let svg = svgs[name];
    if (!svg) console.log("Not found for: " + name);
    if (svg.startsWith("svgs/")) {
      // this is not being used any more
      var imgURL = chrome.runtime.getURL(svg);
      div.innerHTML = `<a href='${link.url}'><img src='${imgURL}'/></a>`;
    } else {
      svg = svg.replace("fill:#000000;", "fill:" + color);
      let s = `
      <div class='icon-wrapper'>
        <a href='${link.url}'>${svg} </a>
      </div>`;

      if (showTitles && link.title.trim() != "") {
        s += `
      <div class='title-wrapper'>
        <a href='${link.url}' style='text-decoration:none;'>
          <span style='font-size:12px;color:${color};'>
            ${link.title}
          </span>
        </a>
      </div>`;
      }
      div.innerHTML = s;
      div.classList = ["link-wrapper"];
    }
    navbar.appendChild(div);
  }
}
