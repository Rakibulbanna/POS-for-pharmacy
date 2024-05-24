import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'os'
import { join } from 'path'
import App from "../../api/server"


// const exec = require('child_process').exec;
// exec("prisma migrate dev --name init ")


// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

export const ROOT_PATH = {
  // /dist
  dist: join(__dirname, '../..'),
  // /dist or /public
  public: join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
const indexHtml = join(ROOT_PATH.dist, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Elit POS',
    icon: join(ROOT_PATH.public, 'elitbuzz.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
    },
  })
  win.maximize()

  if (app.isPackaged) {
    win.loadFile(indexHtml)
  } else {
    win.loadURL(url)
    // win.webContents.openDevTools()
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// new window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
    },
  })

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg })
  } else {
    childWindow.loadURL(`${url}/#${arg}`)
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
})

// TODO: make this port error free check if port is available or not then make dicission
// which port to use
App.listen(3255)


//-------------------- print function -----------------

// List of all options at -
// https://www.electronjs.org/docs/latest/api/web-contents#contentsprintoptions-callback
const printOptions = {
  silent: false,
  printBackground: true,
  color: true,
  margin: {
    marginType: 'printableArea',
  },
  landscape: false,
  pagesPerSheet: 1,
  collate: false,
  copies: 1,
  header: 'Page header',
  footer: 'Page footer',
};


const fs = require('fs')
const path = require('path')
const os = require('os')
//handle print
ipcMain.handle('printComponent', async (event, contentUrl, type = "portrait", height=null) => {

  let printWin:any = new BrowserWindow({ show: false, title: "Preview", autoHideMenuBar: true });
  printWin.webContents.on('destroyed', () => {
    printWin = null
  });
  printWin.loadURL(contentUrl);

  printWin.webContents.once('did-finish-load', () => {

    if (type === "receipt"){
      let options = {silent: true}

      printWin.webContents.print(options,(res: boolean, err: string) => {
        printWin.destroy()
      })

    } else {
      let printOption = {}
      if (type === "landscape") {
        printOption = { ...printOption, landscape: true, pageSize: "A4", marginsType: 20 }
      } else if (type === "barcode"){
        printOption = {...printOption, pageSize: {width: 38000, height: 25000, marginsType: 1}}
      } else if(type === "report"){
        printOption = { ...printOption, landscape: true, pageSize: "A4", marginsType: 20 }
      }

      printWin.webContents.printToPDF(printOption).then((data) => {
        let buf = Buffer.from(data);
        let dataString = buf.toString('base64');
        let printUrl = 'data:application/pdf;base64,' + dataString;


        printWin.show()
        printWin.setTitle("Preview")


        printWin.loadURL(printUrl);

      }).catch(err => {
        console.log(err);
      })
    }
  })

  return 'shown print dialog';
});

 //handle preview
//  ipcMain.handle('previewComponent', (event, url) => {
//   let win = new BrowserWindow({ title: 'Preview', show: false, autoHideMenuBar: true });
//   win.loadURL(url);

  //   win.webContents.once('did-finish-load', () => {
//    win.webContents.printToPDF(printOptions).then((data) => {
//      let buf = Buffer.from(data);
//      let dataString = buf.toString('base64');
//      let url = 'data:application/pdf;base64,' + dataString;

//      win.webContents.on('ready-to-show', () => {
//       win.show();
//       win.setTitle('Preview');
//      });

//      win.webContents.on('closed', () => win = null);
//      win.loadURL(url);
//     })
//     .catch((error) => {
//      console.log(error);
//     });
//   });
//   return 'shown preview window';
//  });
