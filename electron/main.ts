import { app, BrowserWindow, Tray, Menu, globalShortcut, Notification } from 'electron'
import path from 'node:path'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
let settingWin: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    transparent: true,
    frame: false,
    webPreferences: {
      devTools: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // 隐藏任务栏显示
  win.setSkipTaskbar(true)

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

function createSettingWindow() {
  settingWin = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
    width: 800,
    height: 600,
    resizable: false,
    maximizable: false
  })

  // 隐藏菜单栏
  Menu.setApplicationMenu(null)

  if(VITE_DEV_SERVER_URL) {
    settingWin.loadURL(VITE_DEV_SERVER_URL + '/#/setting')
  } else {
    settingWin.loadFile(path.join(process.env.DIST, 'index.html/#/setting'))
  }

  settingWin.on('closed', () => {
    settingWin = null
  })
}

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll()
  win = null
})

let tray:Tray | null = null

// 托盘图标右击菜单
const contextMenu: Menu = Menu.buildFromTemplate([
  {
    label: '设置',
    click() {
      if(!settingWin) {
        createSettingWindow()
      }
    }
  },
  {
    label: '退出',
    click() {
      win?.destroy()
      app.quit()
    }
  }
])

app.whenReady().then(() => {
  createWindow()
  // 注册托盘图标和事件
  tray = new Tray(path.join(process.env.PUBLIC, 'logo.png'))
  tray.setToolTip('闪念胶囊')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    win?.show()
  })

  // 快捷键打开窗口
  try {
    globalShortcut.register('CommandOrControl+Alt+T', () => {
      win?.isVisible() ? win.hide() : win?.show()
    })
  } catch (error) {
    new Notification({
      title: '闪念胶囊热键注册失败',
      body: '热键Ctrl+Alt+T已被占用',
      icon: path.join(process.env.PUBLIC, 'logo.png')
    }).show()
  }
})

app.on('before-quit', () => {
  if(tray) {
    tray.destroy()
  }
})
