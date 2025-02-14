export default function() {    
    return `
        <div class="modal fade" id="add_task_modal" tabindex="-1" aria-labelledby="task_modal_title" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="add_task_modal_title">Add Task</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <label for="add_task_title_input" class="col-form-label">Task title</label>
                        <input id="add_task_title_input" class="form-control" type="text" name="add_task_title_input">
                        <label for="add_task_description_textarea" class="col-form-label">Task description</label>
                        <textarea name="add_task_description_textarea" id="add_task_description_textarea"
                            class="form-control"></textarea>
                    </div>
                    <div class="modal-footer">                        
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>                                                
                        <button type="button" id="submit_newtask_data_btn" class="btn btn-primary">submit</button>
                    </div>
                </div>
            </div>
        </div>
    `
}