// Saves options to chrome.storage
const saveOptions = () => {
  const color = document.getElementById("color").value;
  const margin = document.getElementById("margin").value;
  // const likesColor = document.getElementById("like").checked;

  if (!color) color = "#000000";
  if (!margin) margin = "15px 25px 0px 25px";

  chrome.storage.sync.set({ color: color, margin: margin }, () => {
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
  chrome.storage.sync.get(
    { color: "#000000", margin: "15px 25px 0px 25px" },
    (items) => {
      document.getElementById("color").value = items.color;
      document.getElementById("margin").value = items.margin;
    }
  );
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
