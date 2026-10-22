const { app, BrowserWindow, shell, Menu } = require("electron");

if (!app.requestSingleInstanceLock()) { app.quit(); }

let win;
function create() {
  win = new BrowserWindow({
    width: 1200, height: 820, minWidth: 380, minHeight: 600,
    autoHideMenuBar: true, title: "Osembo", backgroundColor: "#F6F1E4",
    webPreferences: { contextIsolation: true, sandbox: true }
  });
  win.loadFile("app/index.html");
  // WhatsApp / web links open in the normal browser, never inside the app window
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^(https?:|mailto:|tel:|sms:)/.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (e, url) => {
    if (!url.startsWith("file:")) { e.preventDefault(); shell.openExternal(url); }
  });
}
app.on("second-instance", () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.whenReady().then(() => { Menu.setApplicationMenu(null); create(); });
app.on("window-all-closed", () => app.quit());
