import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chkPath, addTask, deleteTask, editTask, getTasksList, finishTask } from './lib/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = async function () {
    try {        
        const win = new BrowserWindow({
            width: 1600,
            height: 900,
            webPreferences: {
                preload: path.join(__dirname, 'preload.mjs'),
                contextIsolation: true,
                /* nodeIntegration: true, */
                sandbox: false
                
            },
            /* titleBarStyle: 'hidden', */
            ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {}),
        })
        const docksPath = new URL(path.join(app.getPath('documents'), 'todo_list'));
        const filePath = new URL(path.join(app.getPath('documents'), 'todo_list', 'tasks.json'));

        await chkPath(docksPath, false);
        await chkPath(filePath, true);

        ipcMain.handle('load-tasks', async (event) => await getTasksList(filePath.href));
        ipcMain.handle('add-task', async (event, task) => addTask(event, task, docksPath));
        ipcMain.handle('edit-task', async (event, task) => editTask(event, task, docksPath));
        ipcMain.handle('finish-task', async (event, taskId, done) => finishTask(event, taskId, done, docksPath));

        ipcMain.handle('delete-task', async (event, taskId) => deleteTask(event, taskId, docksPath));

        win.webContents.on('did-finish-load', () => {                        
            win.webContents.openDevTools();
        });

        win.loadFile('index.html');        
    } catch (err) {
        console.error(err)
    }
}
app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})