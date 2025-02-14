import { mkdir, access, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export async function chkPath(path, isFile) {
    //checks file or directory existance, if not exists then create it
    try {
        await access(path.href);
    } catch (err) {
        if (err.code === 'ENOENT') {
            if (isFile) {
                const initJSON = { tasks: [] }
                let json = JSON.stringify(initJSON, null, 2);
                await writeFile(path.href, json);
            } else if (!isFile) {
                await mkdir(path.href, { recursive: true });
            }
        } else {
            console.error(err);
        }
    }
}

export async function addTask(event, task, docksPath) {
    try {
        const filePath = path.resolve(docksPath.href, 'tasks.json');
        await chkPath(new URL(filePath), true);
        let file = await readFile(filePath, { encoding: 'utf-8' });
        let obj = JSON.parse(file);
        const taskObj = {
            id: randomUUID(),
            content: {
                title: task.title,
                description: task.description,
            },
            isDone: false,
            date: Date.now()
        }
        obj.tasks.push(taskObj);
        let json = JSON.stringify(obj, null, 2);
        const result = await writeFile(filePath, json);
        if (result === undefined) {
            return { taskId: taskObj.id, date: taskObj.date }
        }
    } catch (err) {
        console.error(err);
    }
}

export async function editTask(event, task, docksPath) {
    try {
        const filePath = path.resolve(docksPath.href, 'tasks.json');
        await chkPath(new URL(filePath), true);
        let file = await readFile(filePath, { encoding: 'utf-8' });
        let obj = JSON.parse(file);
        const taskIdx = obj.tasks.findIndex(taskItem => task.id === taskItem.id);
        if (taskIdx >= 0) {
            obj.tasks[taskIdx].content = {
                title: task.content.title,
                description: task.content.description,
            }
        }
        let json = JSON.stringify(obj, null, 2);
        const result = await writeFile(filePath, json);

        if (result === undefined) {
            return { message: `item with id: ${task.id} was successfully changed`, status: 'ok' }
        }

    } catch (err) {
        console.error(err);
        return { message: `cannot save the changes to item with id: ${task.id}`, status: 'error', error: err };
    }
}

export async function deleteTask(event, taskId, docksPath) {
    try {
        const filePath = path.resolve(docksPath.href, 'tasks.json');
        let file = await readFile(filePath, { encoding: 'utf-8' });
        let obj = JSON.parse(file);
        const filteredTasks = obj.tasks.filter(task => task.id !== taskId);
        obj.tasks = filteredTasks;
        let json = JSON.stringify(obj, null, 2);
        const result = await writeFile(filePath, json);
        if (result === undefined) {
            return { message: `item with id: ${taskId} was successfully deleted`, status: 'ok' };
        } else throw new Error('error deleting')
    } catch (err) {
        console.error(err);
        return { message: `cannot delete item with id: ${taskId}`, status: 'error', error: err };
    }
}

export async function getTasksList(filePath) {
    const file = await readFile(filePath, { encoding: 'utf-8' });
    /* 
    *** code for changing task data in file (adding fields etc.)
    let obj = JSON.parse(file);
    for (let task of obj.tasks) {
        task.isDone = false;
    }
    let json = JSON.stringify(obj, null, 2);
    const result = await writeFile(filePath, json);
    console.log(result) */

    return JSON.parse(file).tasks;
}

export async function finishTask(event, taskId, done, docksPath) {
    try {
        console.log(taskId, done)
        const filePath = path.resolve(docksPath.href, 'tasks.json');
        let file = await readFile(filePath, { encoding: 'utf-8' });
        let obj = JSON.parse(file);
        const taskIdx = obj.tasks.findIndex(taskItem => taskId === taskItem.id);
        if (taskIdx >= 0) {
            obj.tasks[taskIdx].isDone = done;
        }
        let json = JSON.stringify(obj, null, 2);
        const result = await writeFile(filePath, json);
        
        if (result === undefined) {
            return { message: `The status of task with id: ${taskId} was successfully changed`, status: 'ok' };
        } else throw new Error('error deleting')
    } catch (err) {
        console.error(err);
        return { message: `cannot change status of task with id: ${taskId}`, status: 'error', error: err };
    }
}