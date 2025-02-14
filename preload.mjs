
import { contextBridge, ipcRenderer } from 'electron';
import editModalComponent from './lib/components/edit_task_modal.js';
import addModalComponent from './lib/components/add_task_modal.js';


contextBridge.exposeInMainWorld('nodeAPI', {
    loadTasks: () => ipcRenderer.invoke('load-tasks'),
    addTask: (task) => ipcRenderer.invoke('add-task', task), 
    editTask: (task) => ipcRenderer.invoke('edit-task', task),
    deleteTask: (id) => ipcRenderer.invoke('delete-task', id),
    taskIsDone: (id, done) => ipcRenderer.invoke('finish-task', id, done),
    editModal: () => editModalComponent(),
    addModal: () => addModalComponent(),
});   
