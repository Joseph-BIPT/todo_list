'use strict';

window.addEventListener('DOMContentLoaded', async () => {

    //appending bootstrap`s modal elements
    document.body.insertAdjacentHTML('beforeend', window.nodeAPI.editModal());
    document.body.insertAdjacentHTML('beforeend', window.nodeAPI.addModal());
    const editModal = document.getElementById('edit_task_modal');
    const editModalInstance = new bootstrap.Modal(editModal);
    const addTaskModal = document.getElementById('add_task_modal');
    const addModalInstance = new bootstrap.Modal(addTaskModal);
    //---------------------------------------

    const tasks = await window.nodeAPI.loadTasks()
    const taskList = document.getElementById('task_list');
    createTaskitemsList(taskList, tasks);

    const editTaskTitleInput = document.getElementById('edit_task_title_input');
    const addTaskTitleInput = document.getElementById('add_task_title_input');
    const editTaskDescriptionTextarea = document.getElementById('edit_task_description_textarea');
    const addTaskDescriptionTextarea = document.getElementById('add_task_description_textarea');
    const confirmEditBtn = document.getElementById('confirm_edit_btn');
    const deleteTaskBtn = document.getElementById('delete_task_btn');
    const submitNewtaskDataBtn = document.getElementById('submit_newtask_data_btn');
    const addTaskDialogBtn = document.getElementById('add_task_dialog_btn');
    const refreshTaskListBtn = document.getElementById('refresh_btn');
    const sortSelect = document.getElementById('sort_select');

    addTaskDialogBtn.addEventListener('click', showAddTaskDialogHandler);
    submitNewtaskDataBtn.addEventListener('click', submitTaskHandler);
    refreshTaskListBtn.addEventListener('click', (evt) => refreshTasksHandler(evt, taskList, sortSelect));
    sortSelect.addEventListener('change', (evt) => sortSelectHandler(evt, taskList, sortSelect));

    taskList.addEventListener('click', async function (evt) {
        const targetItem = evt.target.closest('.list-item');
        const editBtnClicked = evt.target.closest('button');
        const checkBoxClicked = evt.target.closest('input[type="checkbox"]');
        const taskListItemsArray = [...taskList.children].map(li => li.children[0])

        for (let item of taskListItemsArray) {
            if (targetItem) {
                if (item.getAttribute('id') == targetItem.getAttribute('id')) {
                    const titleEl = targetItem.querySelector('#task_title');
                    if (editBtnClicked) {
                        evt.preventDefault();
                        const description = targetItem.querySelector('#task_description').value;
                        const listItemIndx = taskListItemsArray.findIndex(item => item.id === targetItem.getAttribute('id'))
                        showEditItemDialogHandler(evt, editBtnClicked, listItemIndx, titleEl.textContent, description);
                    } else if (checkBoxClicked) {
                        if(checkBoxClicked.checked){
                            const result = await window.nodeAPI.taskIsDone(targetItem.getAttribute('id'), true);                            
                            if(result.status === 'ok'){
                                titleEl.style.textDecoration = 'line-through';
                            }
                        }else{                            
                            const result = await window.nodeAPI.taskIsDone(targetItem.getAttribute('id'), false);                            
                            if(result.status === 'ok'){                                
                                titleEl.style.textDecoration = 'none';
                            }
                        }
                    }
                    item.classList.add('active')
                } else {
                    item.classList.remove('active')
                }
            }
        }
    })


    let editHandler, deleteHandler;
    editModal.addEventListener('hidden.bs.modal', (event) => {
        event.preventDefault();
        confirmEditBtn.removeEventListener('click', editHandler);
        deleteTaskBtn.removeEventListener('click', deleteHandler)
    })

    //shows "edit item dialog"
    function showEditItemDialogHandler(evt, editBtn, listItemIndx, title, description) {
        evt.preventDefault();
        evt.stopPropagation();

        const currentId = editBtn.getAttribute('data-bs-id');
        editTaskTitleInput.value = title;
        editTaskDescriptionTextarea.value = description;

        //assign a click listener to confirmation edit button. Here used closure to use named function 
        //and then use that name to pass to removeEventListener('click', 'name of function')
        //-------------------------------------------------------------------------
        function createEditHandler() {
            return function (evt) {
                confirmEditHandler(evt, currentId, listItemIndx)
            }
        }
        function createDeleteHandler() {
            return function (evt) {
                deleteItemHandler(evt, currentId, listItemIndx)
            }
        }
        editHandler = createEditHandler();
        deleteHandler = createDeleteHandler();
        confirmEditBtn.addEventListener('click', editHandler);
        deleteTaskBtn.addEventListener('click', deleteHandler);
        //-------------------------------------------------------------------------

        editModalInstance.show();
    }

    async function confirmEditHandler(evt, currentId, listItemIndx) {
        const taskObj = {
            id: currentId,
            content: {
                title: editTaskTitleInput.value,
                description: editTaskDescriptionTextarea.value
            },
        }
        const result = await window.nodeAPI.editTask(taskObj);

        if (result.status === 'ok') {
            taskList.children[listItemIndx].innerHTML = `
                <div class="list-item" id="${taskObj.id}">
                    <div class="chkbox-wrapper">
                        <input type="checkbox" name="task_status" class="form-check-input"/>
                    </div>
                    <div class="parag-wrapper">                                
                        <p id="task_title" >${taskObj.content.title}</p>
                        <input type="hidden" value="${taskObj.content.description}" id="task_description" name="task_description"/>
                    </div>            
                    <div class="btn-wrapper">
                        <button class="open-edit-dlg-btn" data-bs-id="${taskObj.id}">
                            <img src="./images/svg/ellipsis-vertical-solid.svg" alt="">
                        </button>
                    </div>
                </div>                
            `
        }
        editModalInstance.hide();
    }

    async function deleteItemHandler(evt, taskId, listItemIndx) {

        const result = await window.nodeAPI.deleteTask(taskId);
        if (result.status === 'ok') {
            taskList.removeChild(taskList.children[listItemIndx]);
        } else {
            console.log('error')
        }
        editModalInstance.hide();
    }

    function showAddTaskDialogHandler(evt) {
        evt.preventDefault();

        addTaskTitleInput.value = '';
        addTaskDescriptionTextarea.value = ''

        addModalInstance.show();
    }

    async function submitTaskHandler(evt) {
        evt.preventDefault();
        let taskObj = {
            title: addTaskTitleInput.value,
            description: addTaskDescriptionTextarea.value,            
        }

        const { taskId, date } = await window.nodeAPI.addTask(taskObj);
        if (taskId) {
            taskList.insertAdjacentHTML('beforeend', `
                <li>
                    <div class="list-item" id="${taskId}">
                        <div class="chkbox-wrapper">
                            <input type="checkbox" name="task_status" class="form-check-input" />
                        </div>
                        <div class="parag-wrapper">                                
                            <p id="task_title" >${addTaskTitleInput.value}</p>
                            <input type="hidden" value="${date}" id="task_created_date" name="task_created_date"/>
                            <input type="hidden" value="${addTaskDescriptionTextarea.value}" id="task_description" name="task_description"/>
                        </div>            
                        <div class="btn-wrapper">
                            <button class="open-edit-dlg-btn" data-bs-id="${taskId}">
                                <img src="./images/svg/ellipsis-vertical-solid.svg" alt="">
                            </button>
                        </div>
                    </div> 
                </li>
            `)
            addModalInstance.hide();
        }
    }

    async function refreshTasksHandler(evt, taskList, sortSelect) {
        evt.preventDefault();
        await refresh(sortSelect, sort, createTaskitemsList, taskList);
    }

    async function sortSelectHandler(evt, taskList, sortSelect) {
        await refresh(sortSelect, sort, createTaskitemsList, taskList);
    }

    function sort(tasks, sortBy) {
        try {
            if (sortBy === 'date') {
                return tasks.sort((a, b) => compareFn(a, b, 'date'));
            } else if (sortBy === 'name') {
                return tasks.sort((a, b) => compareFn(a, b, 'name'));
            } else if (sortBy === 'date_reverse') {
                return tasks.sort((a, b) => compareFn(a, b, 'date_reverse'));
            }
        } catch (e) {
            console.log('e', e)
        }
    }

    function compareFn(a, b, sortBy) {
        switch (sortBy) {
            case 'name': {
                const operandA = a.content.title.toUpperCase();
                const operandB = b.content.title.toUpperCase();
                return operandA < operandB ? -1 : operandA > operandB ? 1 : 0;                
            }
            case 'date': {
                const operandA = a.date;
                const operandB = b.date;
                return operandA < operandB ? -1 : operandA > operandB ? 1 : 0;
            }
            case 'date_reverse': {
                const operandA = a.date;
                const operandB = b.date;
                return operandA > operandB ? -1 : operandA > operandB ? 1 : 0;
            }
        }        
    }

    function createTaskitemsList(taskList, tasks) {
        let tasksString = ''
        for (let { content, id, date, isDone } of tasks) {
            let checked = '';
            let textDecoration = '';
            if(isDone){
                checked = 'checked';
                textDecoration = 'text-decoration: line-through;';
            }else{
                checked = ''
                textDecoration = 'text-decoration: none;';
            }
            tasksString += `
                <li>
                    <div class="list-item" id="${id}">
                        <div class="chkbox-wrapper">                            
                            <input type="checkbox" name="task_status" class="form-check-input" ${checked}>
                        </div>
                        <div class="parag-wrapper">                                
                            <p id="task_title" style="${textDecoration}">${content.title}</p>
                            <input type="hidden" value="${date}" id="task_created_date" name="task_created_date"/>
                            <input type="hidden" value="${content.description}" id="task_description" name="task_description"/>
                        </div>            
                        <div class="btn-wrapper">
                            <button class="open-edit-dlg-btn" data-bs-id="${id}">
                                <img src="./images/svg/ellipsis-vertical-solid.svg" alt="">
                            </button>
                        </div>
                    </div>
                </li>
            `
        }
        taskList.innerHTML = tasksString;
    }
})

async function refresh(sortSelect, sort, createTaskitemsList, taskList) {
    const tasks = await window.nodeAPI.loadTasks();

    const sortBy = sortSelect.options[sortSelect.selectedIndex].value;
    const sortedTasks = sort(tasks, sortBy);

    createTaskitemsList(taskList, sortedTasks);
}

