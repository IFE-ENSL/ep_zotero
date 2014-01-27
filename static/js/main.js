/**
 * Launch the form modal on click
 */
jQuery(document).ready(function () {
    // global variables
    zoteroGroupId = '';
    zoteroApiUserId = localStorage.getItem('zoteroApiUserId');
    zoteroApiUserKey = localStorage.getItem('zoteroApiUserKey');

    // add zotero button action
    jQuery(".zoteroButton").on('click', function () {
        console.log(zoteroApiUserId);
        console.log(zoteroApiUserKey);
        // clear identifiant if null
        if (zoteroApiUserId === '' || zoteroApiUserKey === '') {
            zoteroApiUserId = '';
            zoteroApiUserKey = '';
        }
        var $formModal = createApiZoteroFormModal();
        jQuery('body').append($formModal);
        $formModal.modal();
    });
});