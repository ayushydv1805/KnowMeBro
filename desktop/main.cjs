const { app, BrowserWindow, shell } = require("electron");
const path = require("node:path");

const APP_URL = "https://knowmebro.onrender.com/";
const APP_ORIGIN = new URL(APP_URL).origin;

app.setAppUserModelId("com.knowmebro.desktop");

function isAppUrl(value) {
  try {
    return new URL(value).origin === APP_ORIGIN;
  } catch {
    return false;
  }
}

function openExternalSafely(value) {
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:" || url.protocol === "mailto:") {
      void shell.openExternal(url.toString());
    }
  } catch {
    // Ignore malformed or unsupported links.
  }
}

function createWindow() {
  const window = new BrowserWindow({
    title: "KnowMeBro",
    width: 1320,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: "#0b1020",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });

  window.once("ready-to-show", () => window.show());

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (isAppUrl(url)) {
      void window.loadURL(url);
    } else {
      openExternalSafely(url);
    }
    return { action: "deny" };
  });

  window.webContents.on("will-navigate", (event, url) => {
    if (!isAppUrl(url)) {
      event.preventDefault();
      openExternalSafely(url);
    }
  });

  window.webContents.on("did-fail-load", (_event, errorCode, _description, validatedURL, isMainFrame) => {
    if (isMainFrame && errorCode !== -3 && isAppUrl(validatedURL)) {
      void window.loadFile(path.join(__dirname, "offline.html"));
    }
  });

  void window.loadURL(APP_URL);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
