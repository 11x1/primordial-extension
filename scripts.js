// Handles frontend UI logic.

// Variables/UI elements
const comments_button = document.getElementById('comments-disabler');
const comments_checkbox = document.getElementById('comment-disabler-checkbox');
const comments_type = document.getElementById('comment-disabler-type');

function restoreOptions() {
    chrome.storage.sync.get({'comments-enable-type' : 'none'}, function (result) {
        comments_checkbox.checked = result['comments-enable-type'] == 'none' ? false : true;
        comments_type.style.visibility = comments_checkbox.checked ? 'visible' : 'hidden';
    });

    chrome.storage.sync.get({'comments-enable-selection' : 'newfag'}, function (result) {
        comments_type.value = result['comments-enable-selection'];
    });

}

restoreOptions();


comments_button.addEventListener('click', function() {
    comments_checkbox.checked = !comments_checkbox.checked;
    comments_type.style.visibility = comments_checkbox.checked ? 'visible' : 'hidden';
    const enable_type = comments_checkbox.checked ? comments_type.value == 'newfag' ? 'newfag' : 'all' : 'none'; 
    chrome.storage.sync.set({'comments-enable-type': enable_type}, () => { })
    chrome.storage.sync.set({'comments-enable-selection': comments_type.value}, () => { })
});

comments_type.onchange = () => {
    const enable_type = comments_type.value == 'newfag' ? 'newfag' : 'all'; 
    chrome.storage.sync.set({'comments-enable-type': enable_type}, () => { })
    chrome.storage.sync.set({'comments-enable-selection': comments_type.value}, () => { })
}