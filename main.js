const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');
const axios = require('axios');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();
});

ipcMain.handle('getTopArtists', async (event, country) => {
    // Guard clause: a country must be provided
    if (!country) return;

    try {
        const response = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=geo.getTopArtists&api_key=bdf2bfe3b88560327d10efaa667a3a87&format=json&country=${country}`);

        return response.data;
    } catch (error) {
        console.error('Error fetching data from IMDB:', error);

        return [];
    }
});