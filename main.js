const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const isMac = process.platform === "darwin";
const isDev = process.env.NODE_ENV !== "production";

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    show: false,
    width: isDev ? 1000 : 800,
    height: 600,
    minWidth: 770,
    minHeight: 673,
    title: "Nabla",
    titleBarStyle: "hidden",
    ...(process.platform === "darwin" ? { titleBarOverlay: true } : {}),
    icon: isMac
      ? path.join(__dirname, "icons/nabla/mac/icon.icns")
      : path.join(__dirname, "icons/nabla/win/icon.ico"),

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "./renderer/splash.html"));
  mainWindow.maximize(); 
  // splash.maximize();
  // mainWindow.webContents.openDevTools()

  // mainWindow.once("ready-to-show", () => {
  //   mainWindow.show();
  // });

  const homePagePath = `file://${path.join(__dirname, "./renderer/index.html")}`;
  // const mechPath = path.join(__dirname, "./renderer/assets/mech/mech.html");
  // const emagPath = path.join(__dirname, "./renderer/assets/emag/emag.html");
  // const vecPath = path.join(__dirname, "./renderer/assets/vec/vec.html");
  // const relPath = path.join(__dirname, "./renderer/assets/rel/rel.html");

  setTimeout(() => {
    ipcMain.emit("app/splashDestroyed");
  }, 5500);

  ipcMain.on("app/splashDestroyed", () => {
    
    mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
    mainWindow.show();
    mainWindow.maximize();
  });

  ipcMain.on("app/close", () => {
    app.quit();
  });

  ipcMain.on("app/minimize", () => {
    mainWindow.minimize();
  });

  ipcMain.on("app/maximize", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on("app/goHome", () => {
    console.log(path.join("", mainWindow.webContents.getURL())); 
    console.log(path.join("", homePath));
    mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
  });

  ipcMain.on("app/mech", () => {
      console.log("mech");
      mainWindow.loadFile(path.join(__dirname, "./renderer/assets/mech/mech.html"));
  });
  
  ipcMain.on("app/emag", () => {
      console.log("emag");
      mainWindow.loadFile(path.join(__dirname, "./renderer/assets/emag/emag.html")); 
  });

  ipcMain.on("app/vec", () => {
      console.log("vec");
      mainWindow.loadFile(path.join(__dirname, "./renderer/assets/vec/vec.html")); 
  });

  ipcMain.on("app/rel", () => {
      console.log("rel");
      mainWindow.loadFile(path.join(__dirname, "./renderer/assets/rel/rel.html")); 
  });
}

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
