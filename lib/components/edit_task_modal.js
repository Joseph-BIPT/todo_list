export default function() {    
    return `
        <div class="modal fade" id="edit_task_modal" tabindex="-1" aria-labelledby="edit_task_modal_title" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="edit_task_modal_title">Edit Task</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <label for="edit_task_title_input" class="col-form-label">Task title</label>
                        <input id="edit_task_title_input" class="form-control" type="text" name="edit_task_title_input">
                        <label for="edit_task_description_textarea" class="col-form-label">Task description</label>
                        <textarea name="edit_task_description_textarea" id="edit_task_description_textarea"
                            class="form-control"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="delete_task_btn" class="btn btn-danger">delete task</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>                        
                        <button type="button" id="confirm_edit_btn" class="btn btn-primary">confirm</button>                        
                    </div>
                </div>
            </div>
        </div>
    `
}