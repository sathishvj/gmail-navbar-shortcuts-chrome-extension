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

var margin = "15px 25px 0px 25px";
var color = "#000000";

async function navbarUpdate() {
  await sleep(2000);

  // alert("inside navbarUpdate");
  const navbarXPath = "/html/body/div[7]/div[3]/div/div[2]/div[1]";
  var navbar = getElementByXPath(navbarXPath);
  // alert("Navbar is: " + navbar.innerHTML);

  const div = document.createElement("div");
  div.style.border = "1px dashed grey";
  div.height = "1px";
  navbar.appendChild(div);

  for (let [name, link] of links) {
    const div = document.createElement("div");
    div.style.margin = margin;
    let svg = svgs[name];
    if (!svg) alert("Not found for: " + name);
    if (svg.startsWith("svgs/")) {
      var imgURL = chrome.runtime.getURL(svg);
      div.innerHTML = `<a href='${link.url}'><img src='${imgURL}'/></a>`;
    } else {
      // if svg code is in place.
      svg = svg.replace("fill:#000000;", "fill:" + color + ";");
      div.innerHTML = `<a href='${link.url}'>${svg}</a>`;
    }
    navbar.appendChild(div);
  }
}

const links = new Map([
  [
    "compose",
    {
      url: "https://mail.google.com/mail/u/0/#inbox?compose=new",
    },
  ],
  [
    "inbox",
    {
      url: "https://mail.google.com/mail/u/0/#inbox",
    },
  ],
  [
    "starred",
    {
      url: "https://mail.google.com/mail/u/0/#starred",
    },
  ],
  [
    "sent",
    {
      url: "https://mail.google.com/mail/u/0/#sent",
    },
  ],
  [
    // "bin",
    "trash",
    {
      url: "https://mail.google.com/mail/u/0/#trash",
    },
  ],
  [
    "multipleMail",
    {
      url: "https://mail.google.com/mail/u/0/#all",
    },
  ],
  [
    "cloudy",
    {
      url: "https://mail.google.com/mail/u/0/#label/gcp-insiders",
    },
  ],
  [
    "badge",
    {
      url: "https://mail.google.com/mail/u/0/#label/google-cloud-experts",
    },
  ],
]);
