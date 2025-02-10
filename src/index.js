const iframe = document.createElement("iframe");
iframe.src = "https://safari-test-one.vercel.app";
iframe.style.display = "none";
document.body.appendChild(iframe);

function sendMessage(action, key, value = null) {
  return new Promise((resolve) => {
    function listener(event) {
      if (event.origin === "https://safari-test-one.vercel.app") {
        resolve(event.data.value);
        window.removeEventListener("message", listener);
      }
    }
    window.addEventListener("message", listener);
    iframe.contentWindow?.postMessage({ action, key, value }, "https://safari-test-one.vercel.app");
  });
}

function setLightTheme() {
  sendMessage("set", "theme", "initial").then(() => {
    console.log("Theme set in IndexedDB!");
    document.body.style.background = "initial";
  });
}

function getTheme() {
  sendMessage("get", "theme").then((value) => {
    document.body.style.background = value;
    console.log("Theme from IndexedDB:", value);
  });
}

async function triggerRequestStorageAccess() {
  if (document.requestStorageAccess) {
    try {
      await document.requestStorageAccess();
      console.log("Storage access granted!");
    } catch (error) {
      console.warn("Storage access denied:", error);
    }
  } else {
    console.log("Storage Access API not needed in this browser.");
  }
}
