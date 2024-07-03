const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    })

    mainWindow.loadFile('index.html')
    mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()
})