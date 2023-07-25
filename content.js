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
    div.style.margin = "15px 25px 0px 25px";
    if (link.svg.startsWith("svgs/")) {
      var imgURL = chrome.runtime.getURL(link.svg);
      div.innerHTML = `<a href='${link.url}'><img src='${imgURL}'/></a>`;
    } else {
      // if svg code is in place.
      div.innerHTML = `<a href='${link.url}'>${link.svg}</a>`;
    }
    navbar.appendChild(div);
  }
}

const links = new Map([
  [
    "inbox",
    {
      url: "https://mail.google.com/mail/u/0/#inbox",
      svg: "svgs/inbox.svg",
    },
  ],
  [
    "starred",
    {
      url: "https://mail.google.com/mail/u/0/#starred",
      svg: "svgs/starred.svg",
    },
  ],
  [
    "sent",
    {
      url: "https://mail.google.com/mail/u/0/#sent",
      svg: "svgs/sent.svg",
    },
  ],
  [
    "bin",
    {
      url: "https://mail.google.com/mail/u/0/#trash",
      svg: "svgs/trash.svg",
    },
  ],
  [
    "all",
    {
      url: "https://mail.google.com/mail/u/0/#all",
      svg: "svgs/multiple-mail.svg",
    },
  ],
  [
    "gcpinsiders",
    {
      url: "https://mail.google.com/mail/u/0/#label/gcp-insiders",
      svg: "svgs/badge.svg",
    },
  ],
  [
    "googlecloudexperts",
    {
      url: "https://mail.google.com/mail/u/0/#label/google-cloud-experts",
      svg: "svgs/lightning-cloud.svg",
    },
  ],
]);
