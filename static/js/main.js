/*
    // insert text in pad

    var padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;
    return padeditor.ace.callWithAce(function (ace) {
        // rep contains informations about the cursor location
        rep = ace.ace_getRep();
        // insert the reference at the cursor location
        ace.ace_replaceRange(rep.selStart, rep.selStart, "Référence bibliographique");
    });

    // insert and overwrite

    var start;
    var end;
    var padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;
    padeditor.ace.callWithAce(function (ace) {
        rep = ace.ace_getRep();
        start = rep.selStart;
        var text = "texteici";
        end = [rep.selStart[0], rep.selStart[1]+text.length];
        ace.ace_replaceRange(rep.selStart, rep.selStart, text);
    });

    padeditor.ace.callWithAce(function (ace) {
        rep = ace.ace_getRep();
        ace.ace_replaceRange(start, end, "youpi");
    });

    // jQuery in the pad_editor

    var $pad = jQuery("[name='ace_outer']").contents().find("[name='ace_inner']").contents().find("#innerdocbody");
    $pad.find("span:contains('ZoteroKey')").attr("class", "ok");
*/

/**
 * Launch the form modal on click
 */
jQuery(document).ready(function () {
    // global variables
    zoteroGroupId = '';
    zoteroApiUserId = '1714010';
    zoteroApiUserKey = 'Dm8ucI67hW83jEY5Ah1aypoD';

    // add zotero button action
    jQuery(".zoteroButton").on('click', function () {
        var $formModal = createApiZoteroFormModal();
        jQuery('body').append($formModal);
        $formModal.modal();
    });
});
