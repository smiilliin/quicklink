import { screen, app, BrowserWindow, ipcMain, globalShortcut } from "electron";
import * as path from "path";
import SettingManager from "@smiilliin/settings";
import { spawn, exec } from "child_process";
import os from "os";
import fs from "fs";

let mainWindow: BrowserWindow;
let subWindow: BrowserWindow | undefined;
const port = process.env.DEV ? process.env.PORT : undefined;
const devTool = false;

const openLink = (link: string) => {
  if (fs.statSync(link).isDirectory()) {
    let explorer;
    switch (os.platform()) {
      case "win32":
        explorer = "explorer";
        break;
      case "darwin":
      default:
        explorer = "open";
        break;
    }

    spawn(explorer, [link], { detached: true }).unref();
  } else {
    switch (os.platform()) {
      case "win32":
        exec(`start "start" "${link.replace(/"/g, '\\"')}"`, {
          cwd: path.dirname(link),
        }).unref();
        break;
      case "darwin":
      default:
        spawn("open", [link], {
          cwd: path.dirname(link),
          detached: true,
        }).unref();
        break;
    }
  }
};

const createMainWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 0,
    height: 110,
    frame: false,
    transparent: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (port) {
    mainWindow.loadURL(`http://localhost:${port}`);

    if (devTool) mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../../ret/build/index.html"));
  }
  mainWindow.on("close", (event) => {
    event.preventDefault();
  });
};
const createSubWindow = async () => {
  subWindow = new BrowserWindow({
    width: 540,
    height: 300,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (port) {
    subWindow.loadURL(`http://localhost:${port}/#/setting`);
  } else {
    subWindow.loadURL(
      `file://${
        path.join(__dirname, "../../ret/build/index.html") + "#/setting"
      }`
    );
  }
  subWindow.on("close", () => {
    subWindow = undefined;
  });
};

app.on("ready", () => {
  if (app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: true,
    });
  }
  createMainWindow();

  const settingManager = new SettingManager("quicklink");

  ipcMain.on("forLinks", (event) => {
    const { linkShortcut }: any = settingManager.load("shortcuts.json", {
      linkShortcut: "ctrl+alt+c",
    });

    const onLink = () => {
      const { links } = settingManager.load("links.json", { links: [] });
      if (!mainWindow.isVisible() && links.length > 0) {
        const windowSize = mainWindow.getSize();
        const mousePos = screen.getCursorScreenPoint();
        mainWindow.setPosition(
          Math.round(mousePos.x - windowSize[0] / 2),
          Math.round(mousePos.y - windowSize[1] / 2)
        );

        mainWindow.show();

        let oldMousePos = screen.getCursorScreenPoint();
        const windowPos = mainWindow.getPosition();

        const mouseInterval = setInterval(() => {
          if (!mainWindow) {
            clearInterval(mouseInterval);
            return;
          }
          const mousePos = screen.getCursorScreenPoint();

          if (oldMousePos.x != mousePos.x || oldMousePos.y != mousePos.y) {
            if (
              mousePos.x < windowPos[0] ||
              mousePos.x > windowPos[0] + windowSize[0] ||
              mousePos.y < windowPos[1] ||
              mousePos.y > windowPos[1] + windowSize[1]
            ) {
              hideFunc();
            }
          }

          oldMousePos = mousePos;
        }, 100);
        const hideFunc = () => {
          mainWindow.hide();
          mainWindow.off("blur", hideFunc);
          clearInterval(mouseInterval);
        };
        mainWindow.on("blur", hideFunc);
      } else {
        mainWindow.hide();
        if (!subWindow) createSubWindow();
        if (!subWindow) return;

        subWindow.focus();
      }
    };
    globalShortcut.register(linkShortcut, onLink);

    let oldLinkShortcut = linkShortcut;
    settingManager.watch("shortcuts.json", (options) => {
      const { linkShortcut } = options;

      globalShortcut.unregister(oldLinkShortcut);
      globalShortcut.register(linkShortcut, onLink);

      oldLinkShortcut = linkShortcut;
    });

    const { links } = settingManager.load("links.json", { links: [] });

    mainWindow.setSize(links.length * 110, 100);
    event.reply("forLinks", links);
  });

  settingManager.watch(
    "links.json",
    (options) => {
      const { links } = options;

      mainWindow.setSize(links.length * 110, 100);
      mainWindow.webContents.send("forLinks", links);
    },
    { links: [] }
  );
  ipcMain.on("open", (event, link) => {
    openLink(link);
    mainWindow!.hide();
  });
  ipcMain.on("setLinks", (event, links: Array<ILink>) => {
    settingManager.setOption("links.json", "links", links);
  });
  ipcMain.on("loadLinks", (event) => {
    event.returnValue = settingManager.load("links.json", { links: [] }).links;
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
