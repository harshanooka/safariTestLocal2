const iframe = document.createElement("iframe");
iframe.src = "https://local.cache.com:8081";
iframe.style.display = "none";
document.body.appendChild(iframe);

function checkCookie(name) {
  return document.cookie.split("; ").some((row) => row.startsWith(name + "="));
}

function ensureStorageAccess() {
  if (!checkCookie("storageUnlocked")) {
    console.log("🚨 Redirecting to grant storage access...");
    window.location.href = "https://local.cache.com:8081/grant-access.html";
  } else {
    console.log("✅ Storage access already granted!");
  }
}

function sendMessage(action, key, value = null) {
  return new Promise<string>((resolve) => {
    function listener(event: MessageEvent<{ value: string }>) {
      if (event.origin === "https://local.cache.com:8081") {
        resolve(event.data.value);
        window.removeEventListener("message", listener);
      }
    }
    window.addEventListener("message", listener);
    iframe.contentWindow?.postMessage({ action, key, value }, { targetOrigin: "https://local.cache.com:8081" });
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

ensureStorageAccess();
