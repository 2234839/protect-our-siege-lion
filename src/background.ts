"use strict";
import { app, BrowserWindow, ipcMain, Menu, nativeImage, Notification, protocol, screen, Tray } from "electron";
import path from "path";
import { createProtocol, installVueDevtools } from "vue-cli-plugin-electron-builder/lib";
import { Event_Name } from "./EventName";
import { Log } from "./util/log";
const isDevelopment = process.env.NODE_ENV !== "production";
const logger = new Log();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { secure: true, standard: true } }]);

function createWindow() {
  logger.info("开始运行");

  let size = screen.getPrimaryDisplay().workAreaSize;

  if (isDevelopment) size = { width: 800, height: 600 };

  win = new BrowserWindow({
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
    },
    frame: isDevelopment,
  });
  win.hide();

  win.on("show", () => {
    console.log("win show");

    win.webContents.send(Event_Name.main_show_window, "show");
  });

  if (isDevelopment) {
    win.webContents.openDevTools();
  } else {
    /** 正式使用要一直在顶部 */
    win.setAlwaysOnTop(true);
  }

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
  } else {
    createProtocol("app");
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    logger.info("关闭窗口");
  });

  setInterval(() => {
    time = Date.now();
    logger.info("打开窗口");
    win!.show();
  }, interval_time);
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    // app.quit()
  }
});

// app.on('activate', () => {
//   console.log(1111);

//   // On macOS it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (win === null) {
//     createWindow()
//   }
// })

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
/** 设置托盘图片icon */
const icon = nativeImage.createFromPath(path.join(__static, "/ico.jpg"));
/** 托盘图标 */
let tray: Tray | null = null;
let notification: Notification | null = null;

const interval_time = 1000 * 60 * 15;

let time = Date.now();
app.on("ready", async () => {
  console.log("app [ready]");

  tray = new Tray(icon);

  setInterval(() => {
    /** 更新剩余时间提示 */
    if (tray === null) return;
    tray.setToolTip(`还有 ${(interval_time - (Date.now() - time)) / 1000}s 后提醒`);
  }, 1000);

  tray.on("click", () => {
    win!.show();
  });
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "退出",
        click: function() {
          app.quit();
          app.quit(); //因为程序设定关闭为最小化，所以调用两次关闭，防止最大化时一次不能关闭的情况
        },
      },
    ]),
  );

  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

/** 监听关闭 */
ipcMain.addListener(Event_Name.main_hide_window, () => {
  win!.hide();
  logger.info("点击隐藏");
});
