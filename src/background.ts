'use strict'
import { app, BrowserWindow, Menu, nativeImage, Notification, protocol, Tray } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import { Log } from './util/log';
import path from 'path';
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow() {
  win = new BrowserWindow({
    width: 800, height: 600, webPreferences: {
      nodeIntegration: true

    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })

}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

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
const icon = nativeImage.createFromPath(path.join(__static, '/ico.jpg'))//app.ico是app目录下的ico文件
/** 托盘图标 */
let tray:Tray| null = null
const logger = new Log()
let notification: Notification | null = null
const interval_time=1000*60*20
let time = Date.now()
app.on('ready', async () => {
  tray = new Tray(icon);
  notification = new Notification({
    title: "眺望远方",
    body: "要注意保护视力",
    icon,
  })
  tray.setToolTip('眺望助手')
  tray.on('click',()=>{
    if(tray === null) return;
    tray.displayBalloon({
      content:`还有 ${(interval_time-(Date.now() - time))/1000}s 后提醒`,icon,title:"眺望助手"
    })
  })
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: '设置',
      click: function () { } //打开相应页面
    },
    {
      label: '帮助',
      click: function () { }
    },
    {
      label: '关于',
      click: function () { }
    },
    {
      label: '退出',
      click: function () {
        app.quit();
        app.quit();//因为程序设定关闭为最小化，所以调用两次关闭，防止最大化时一次不能关闭的情况
      }
    }
  ]));

  logger.info('开始运行')
  setInterval(() => {
    time = Date.now()
    logger.info('弹出提示')
    const id = setInterval(() => {
      if (notification === null) return;
      notification.show()
    }, 1000)
    if (notification === null) return;
    notification.once("click", function () {
      clearInterval(id)
      logger.info('点击提示')
    })
  }, interval_time)


  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

  }
  // createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
