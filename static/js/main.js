/*
    // insert text in pad
    var padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;
    return padeditor.ace.callWithAce(function (ace) {
        // rep contains informations about the cursor location
        rep = ace.ace_getRep();
        // insert the reference at the cursor location
        ace.ace_replaceRange(rep.selStart, rep.selStart, "Référence bibliographique");
    });
*/

/**
 * Launch the form modal on click
 */
jQuery(document).ready(function () {
    jQuery(".zoteroButton").on('click', function () {
        var $formModal = createApiZoteroFormModal();
        jQuery('body').append($formModal);
        $formModal.modal();
    });
});

/**
 * Create the from modal to query the api
 */
function createApiZoteroFormModal() {
    var $formModal = jQuery(
        '<div class="modal fade" role="dialog" aria-labelledby="success" aria-hidden="true">'+
            '<div class="modal-dialog">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                        '<h4 class="modal-title" id="success">Récupérer vos références bibliographiques</h4>'+
                    '</div>'+
                    '<div class="modal-body"></div>'+
                    '<div class="modal-footer">'+
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
    );

    // create the form
    var $apiZoteroForm = jQuery(
        '<form>'+
            '<label>Votre identifiant API</label><input type="text" name="user_api_id" value="1714010"/><br />'+
            '<label>Votre clé API</label><input type="text" name="user_api_key" value="Dm8ucI67hW83jEY5Ah1aypoD"/>'+
        '</form>'
    );
    $formModal.find('.modal-body').append($apiZoteroForm);

    // create the validation button
    var $apiCallButton = jQuery('<button type="button" class="btn btn-primary">Validate</button>');
    $formModal.find('.modal-footer').append($apiCallButton);

    // attempt an ajax request on click on the modal validation button
    $apiCallButton.on('click', function() {
        var apiUserId = $apiZoteroForm.find('*[name="user_api_id"]').val();   // 1714010
        var apiUserKey = $apiZoteroForm.find('*[name="user_api_key"]').val(); // Dm8ucI67hW83jEY5Ah1aypoD
        var url = "https://api.zotero.org/users/"+apiUserId+"/items?key="+apiUserKey;
        jQuery.ajax({
            url : url
        })
        .success(function(xml){
            $formModal.modal('hide');
            $successModal = createSuccessModal(xml);
            jQuery('body').append($successModal);
            $successModal.modal();
            var options = { valueNames: ['author', 'title'] };
            var modalList = new List('modal-list', options);
        })
        .error(function(jqXHR, desc, errorThrown){
            $formModal.modal('hide');
            $errorModal = createErrorModal();
            jQuery('body').append($errorModal);
            $errorModal.modal();
        });
    });

    $formModal.on('hidden.bs.modal', function (e) {
        jQuery(this).remove();
    });

    return $formModal;
}

/**
 * Create the error modal
 */
function createErrorModal() {
    // create the modal
    var $modal = jQuery(
        '<div class="modal fade" id="error-modal" role="dialog" aria-labelledby="error" aria-hidden="true">'+
            '<div class="modal-dialog">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                        '<h4 class="modal-title" id="error">Une erreur est survenue</h4>'+
                    '</div>'+
                    '<div class="modal-body">'+
                        'error'+
                    '</div>'+
                    '<div class="modal-footer">'+
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
    );

    // create the retry button
    var $retryButton = jQuery('<button type="button" class="btn btn-primary">Retry</button>');
    $modal.find('.modal-footer').append($retryButton);

    // display the form-modal on click on retry
    $retryButton.on('click', function () {
        $modal.modal('hide');
        var $formModal = createApiZoteroFormModal();
        jQuery('body').append($formModal);
        $formModal.modal();
    });

    $modal.on('hidden.bs.modal', function (e) {
        jQuery(this).remove();
    });

    return $modal;
}

/**
 * Create the success modal from the xml
 */
function createSuccessModal(xml) {
    console.log(xml);
    
    var $modal = jQuery(
        '<div class="modal fade" id="success-modal" role="dialog" aria-labelledby="success" aria-hidden="true">'+
            '<div class="modal-dialog">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                        '<h4 class="modal-title" id="success">Insérer votre référence</h4>'+
                    '</div>'+
                    '<div class="modal-body"></div>'+
                    '<div class="modal-footer">'+
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
    );

    // create the list of references
    var list = createZoteroReferencesList(xml);
    $modal.find('.modal-body').append(list);

    $modal.on('hidden.bs.modal', function (e) {
        jQuery(this).remove();
    });

    return $modal;
}

/**
 * Create the list with zotero references from the xml
 */
function createZoteroReferencesList(xml) {
    var list =
        '<div id="modal-list">'+
            '<input class="search" />'+
            '<button class="sort btn-primary" data-sort="title">Sort by title</button>'+
            '<button class="sort btn-primary" data-sort="author">Sort by author</button>'+
            '<table class="table table-striped">'+
                '<thead>'+
                    '<tr>'+
                        '<td>Titre</td>'+
                        '<td>Auteur</td>'+
                        '<td colspan="2">date</td>'+
                    '</tr>'+
                '</thead>'+
                '<tbody class="list">'
    ;

    jQuery(xml).find("entry").each(function() {
        // get the needed info from the xml
        var itemType = jQuery(this).find('zapi\\:itemType, itemType').text();
        // only handle entries with the encyclopediaArticle type
        if (itemType == 'encyclopediaArticle') {
            var entryTitle = getEntryTitle(this);
            var date = getEntryDate(this);
            var authorName = getEntryAuthorName(this);
            // add a row to the table
            list +=
                '<tr>'+
                    '<td class="title">'+entryTitle+'</td>'+
                    '<td class="author">'+authorName+'</td>'+
                    '<td>'+date+'</td>'+
                    '<td><button type="button" class="btn btn-primary" data-id="">insert</button></td>'+
                '</tr>';
        }
    });

    // close the list
    list += '</tbody></table></div>';

    return list;
}


/**
 * Get the entry title
 * Fixes errors when the text contains single quote & remove html tags from titles
 */
function getEntryTitle(entry) {
    var entryTitle = jQuery(entry).find('title').text();
    // 
    var cleanEntryTitle = jQuery(entryTitle.replace("\'","\\\'")).text();

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













