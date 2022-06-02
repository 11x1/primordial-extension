// inject.js
// Author: khey
// Author URI: https://11x1.github.io/
// Author Github URI: https://www.github.com/11x1
// Description: Script will be executed (like it would be in chrome dev console) and manage different UI elements

document.body.onload = () => {
    chrome.storage.sync.get(['comments-enable-type'], function(result) { 
        if (result['comments-enable-type'] == 'none') return

        const comments = document.getElementsByClassName('message message--post js-post js-inlineModContainer')
        let iterated_comments = 0

        const close_comment = (comment) => {
            comment.style.maxHeight = '70px'

            const extras = comment.getElementsByClassName('message-user')[0]
            for (i=0; i<extras.children.length; i++){
                elem = extras.children[i]
                elem.style.visibility = 'hidden'
            }

            const message = comment.getElementsByClassName('message-content js-messageContent')[0]
            for (i=0; i<message.children.length; i++){
                elem = message.children[i]
                elem.style.visibility = 'hidden'
            }
            const user_box = comment.getElementsByClassName('message-cell message-cell--user')[0]
            user_box.style.maxHeight = '70px'

            extras.children[1].style.visibility = 'visible'
            extras.children[1].style.top = '0'
            extras.children[1].style.left = '50%'
            extras.children[1].style.transform = 'translateX(-50%)'
            extras.children[1].style.position = 'absolute'

            // Make the user content page div smaller
            const user_content = comment.getElementsByClassName('message-user')[0]
            user_content.style.maxHeight = '70px'
            
            // Hide the subscription tags/other tags
            const tags = comment.getElementsByClassName('userBanner userBanner userBanner')
            for (i=0; i<tags.length; i++) {
                tags[i].style.visibility = 'hidden'
            }

            // Disable the message content to avoid clicking issues
            const message_content = comment.getElementsByClassName('message-content js-messageContent')[0]
            message_content.style.visibility = 'hidden'
            message_content.style.position = 'fixed'
            message_content.style.maxHeight = '-100%'

            // Footer disabled
            const footer = comment.getElementsByClassName('message-footer')[0]
            footer.style.visibility = 'hidden'
            footer.style.position = 'fixed'


            top_bar = comment.getElementsByClassName('message-attribution-opposite message-attribution-opposite--list')[0]
            top_bar.children[3].children[0].innerHTML = 'OPEN'
        }

        const show_comment = (comment) => {
            const old_height = comment.getAttribute('old_height') + 'px'
            comment.style.maxHeight = old_height

            extras = comment.getElementsByClassName('message-user')[0]
            for (i=0; i<extras.children.length; i++){
                elem = extras.children[i]
                elem.style.visibility = 'visible'
            }

            message = comment.getElementsByClassName('message-content js-messageContent')[0]
            for (i=0; i<message.children.length; i++){
                elem = message.children[i]
                elem.style.visibility = 'visible'
            }
            user_box = comment.getElementsByClassName('message-cell message-cell--user')[0]
            user_box.style.maxHeight = old_height

            extras.children[1].style.visibility = 'visible'
            extras.children[1].style.top = 'auto'
            extras.children[1].style.position = 'relative'

            // Disable the user content page div
            const user_content = comment.getElementsByClassName('message-user')[0]
            user_content.style.maxHeight = old_height

            // Show the subscription tags/other tags
            const tags = comment.getElementsByClassName('userBanner userBanner userBanner')
            for (i=0; i<tags.length; i++) {
                tags[i].style.visibility = 'visible'
            }

            // Enable the message content to see it
            const message_content = comment.getElementsByClassName('message-content js-messageContent')[0]
            message_content.style.visibility = 'visible'
            message_content.style.position = 'relative'
            message_content.bottom = 'auto'

            // Footer enabled
            const footer = comment.getElementsByClassName('message-footer')[0]
            footer.style.visibility = 'visible'
            footer.style.position = 'relative'

            top_bar = comment.getElementsByClassName('message-attribution-opposite message-attribution-opposite--list')[0]
            top_bar.children[3].children[0].innerHTML = 'CLOSE'
        }

        const handle_closing_opening = (comment) => {
            const top_bar = comment.getElementsByClassName('message-attribution-opposite message-attribution-opposite--list')[0]
            const sign = top_bar.children[3].children[0].innerHTML
            if (sign === 'OPEN'){
                show_comment(comment)
            } else {
                close_comment(comment)
            }
        }

        // need this because when I'd do it once, it would skip some elements, no idea why
        while (iterated_comments < comments.length) {
            for (i=0; i<comments.length; i++) {
                iterated_comments += 1
                let comment = comments[i]

                // Check if uid is above 1k
                extras = comment.getElementsByClassName('message-userExtras')[0]
                uid_str = extras.children[0].innerText.replace('uid\n', '').replace(',', '')
                uid_int = parseInt(uid_str)
                if (result['comments-enable-type'] == 'newfag' && uid_int > 1000 && comment.getElementsByClassName('kheycodes-comment-close').length == 0) {
                    top_bar = comment.getElementsByClassName('message-attribution-opposite message-attribution-opposite--list')[0]
                    // creating new element
                    new_list_thing = document.createElement('li')
                    // we can use element tag <a> to get style inherited from primordials webpage
                    // siply put: new button go follow other button style ooga booga
                    new_button_elem = document.createElement('a')
                    new_button_elem.innerHTML = 'CLOSE'
                    new_list_thing.appendChild(new_button_elem)
                    // Giving it a custom class because i need to
                    new_list_thing.className = 'kheycodes-comment-close'
                    new_list_thing.onclick = () => { handle_closing_opening(comment) }
                    top_bar.appendChild(new_list_thing)

                    // Give the newly created element the pointer cursor on hover
                    css = '.kheycodes-comment-close:hover{ cursor: pointer }';
                    var style = document.createElement('style');

                    if (style.styleSheet) {
                        style.styleSheet.cssText = css;
                    } else {
                        style.appendChild(document.createTextNode(css));
                    }

                    document.getElementsByTagName('head')[0].appendChild(style);

                    comment.setAttribute('old_height', comment.offsetHeight)
                    close_comment(comment)
                } else if (comment.getElementsByClassName('kheycodes-comment-close').length == 0) {
                    top_bar = comment.getElementsByClassName('message-attribution-opposite message-attribution-opposite--list')[0]
                    // creating new element
                    new_list_thing = document.createElement('li')
                    // we can use element tag <a> to get style inherited from primordials webpage
                    // siply put: new button go follow other button style ooga booga
                    new_button_elem = document.createElement('a')
                    new_button_elem.innerHTML = 'CLOSE'
                    new_list_thing.appendChild(new_button_elem)
                    // Giving it a custom class because i need to
                    new_list_thing.className = 'kheycodes-comment-close'
                    new_list_thing.onclick = () => { handle_closing_opening(comment) }
                    top_bar.appendChild(new_list_thing)

                    // Give the newly created element the pointer cursor on hover
                    css = '.kheycodes-comment-close:hover{ cursor: pointer }';
                    var style = document.createElement('style');

                    if (style.styleSheet) {
                        style.styleSheet.cssText = css;
                    } else {
                        style.appendChild(document.createTextNode(css));
                    }

                    document.getElementsByTagName('head')[0].appendChild(style);

                    comment.setAttribute('old_height', comment.offsetHeight)
                }
            }
        }
     });
}