navbarUpdate();

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

var color = "#444746";
var showTitles = true;

async function navbarUpdate() {
  chrome.storage.sync.get(
    {
      color: color,
      showTitles: showTitles,
    },
    (items) => {
      color = items.color;
      showTitles = items.showTitles;
    }
  );

  await sleep(2000);

  // alert("inside navbarUpdate");
  const navbarXPath = "/html/body/div[7]/div[3]/div/div[2]/div[1]";
  var navbar = getElementByXPath(navbarXPath);
  // alert("Navbar is: " + navbar.innerHTML);

  const divider = document.createElement("div");
  // divider.style.border = "1px dashed grey";
  // divider.height = "1px";
  divider.classList = ["divider"];
  navbar.appendChild(divider);

  for (let [name, link] of links) {
    const div = document.createElement("div");
    // div.style.margin = margin;
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

      if (showTitles) {
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

const links = new Map([
  [
    "compose",
    {
      url: "https://mail.google.com/mail/u/0/#inbox?compose=new",
      title: "Compose",
    },
  ],
  [
    "inbox",
    {
      url: "https://mail.google.com/mail/u/0/#inbox",
      title: "Inbox",
    },
  ],
  [
    "starred",
    {
      url: "https://mail.google.com/mail/u/0/#starred",
      title: "Starred",
    },
  ],
  [
    "sent",
    {
      url: "https://mail.google.com/mail/u/0/#sent",
      title: "Sent",
    },
  ],
  [
    // "bin",
    "trash",
    {
      url: "https://mail.google.com/mail/u/0/#trash",
      title: "Trash",
    },
  ],
  [
    "multipleMail",
    {
      url: "https://mail.google.com/mail/u/0/#all",
      title: "All",
    },
  ],
  [
    "cloudy",
    {
      url: "https://mail.google.com/mail/u/0/#label/gcp-insiders",
      title: "GCP Insiders",
    },
  ],
  [
    "badge",
    {
      url: "https://mail.google.com/mail/u/0/#label/google-cloud-experts",
      title: "GDE",
    },
  ],
]);
