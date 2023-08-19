getOptionsAndNavbarUpdate();

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

// var color = "#444746";
// var showTitles = true;

async function getOptionsAndNavbarUpdate() {
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

async function navbarUpdate(color, showTitles, links) {
  await sleep(2000);

  // alert("inside navbarUpdate");
  // const navbarXPath = "/html/body/div[7]/div[3]/div/div[2]/div[1]";
  const navbarXPath = "/html/body/div[8]/div[3]/div/div[2]/div[1]";
  var navbar = getElementByXPath(navbarXPath);
  // alert("Navbar is: " + navbar.innerHTML);

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
