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
    jQuery(".zoteroButton").on('click', function () {
        var $formModal = createApiZoteroFormModal();
        jQuery('body').append($formModal);
        $formModal.modal();
    });
});

// UTILS

/**
 * Has Top collections
 * Check whether or not a top collection has collections
 */
function hasTopCollections(xml) {
    return jQuery(xml).has("entry").length > 0;
}

/**
 * Has collections
 * Check whether or collection has sub-collections
 */
function hasSubCollections(entry) {
    var collectionNumber = jQuery(entry).find('zapi\\:numCollections, numCollections').text();

    return parseInt(collectionNumber) > 0;
}


/**
 * Get the entry title
 * Fixes errors when the text contains single quote & remove html tags from titles
 */
function getEntryTitle(entry) {
    var entryTitle = jQuery(entry).find('title').text();
    var cleanEntryTitle = entryTitle.replace("\'","\\\'");

    if (cleanEntryTitle != '') {
        return cleanEntryTitle;
    } else {
        return entryTitle;
    }
}

/**
 * Get the entry date
 * Format the existing date
 */
function getEntryDate(entry) {
    var date = jQuery(entry).find('published').text();
    var splittedDate = date.split('T');

    return splittedDate[0];
}

/**
 * Get the entry author
 */
function getEntryAuthorName(entry) {
    var authorName = jQuery(entry).find('author').first().find('name').first().text();

    return authorName;
}

/**
 * Get the item key of an entry
 */
function getEntryItemKey(entry) {
    var itemKey = jQuery(entry).find('zapi\\:key, key').text();

    return itemKey;
}

/**
 * Get the item type of an entry
 */
function getEntryItemType(entry) {
    var itemType = jQuery(entry).find('zapi\\:itemType, itemType').text();

    return itemType;
}

/**
 * Get the url type of an entry
 */
function getEntryUrl(entry) {
    var url = jQuery(entry).find('content tr.url td').text();

    return url;
}

/**
 * Get the id of the groupe of an entry
 */
function getEntryGroupId(entry) {
    var groupId = jQuery(entry).find('zapi\\:groupID, groupID').text();

    return groupId;
}
