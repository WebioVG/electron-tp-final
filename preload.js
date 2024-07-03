const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('databaseApi', {
    getTopArtists: (country) => ipcRenderer.invoke('getTopArtists', country)
})