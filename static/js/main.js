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

jQuery(document).ready(function () {
    // display the form-modal on click
    jQuery(".zoteroButton").on('click', function () {
        var $formModal = createApiZoteroFormModal();
        jQuery('body').append($formModal);
        $formModal.modal();
    });
});

function createApiZoteroFormModal() {
    // create the modal
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

function createSuccessModal(xml) {
    // create the insert button
    console.log(xml);
    var table = '<table class="table table-striped">'+
        '<thead>'+
            '<tr>'+
                '<td>Titre</td>'+
                '<td>Auteur</td>'+
                '<td colspan="2">date</td>'+
            '</tr>'+
        '</thead>'+
        '<tbody>';
    jQuery(xml).find("entry").each(function(index) {
        var itemType = jQuery(this).find('zapi\\:itemType, itemType').text();
        if (itemType == 'encyclopediaArticle') {
            var itemTitle = jQuery(this).find('title').text();
            var date = jQuery(this).find('published').text();
            var splittedDate = date.split('T');
            date = splittedDate[0];
            table +=
                '<tr>'+
                    '<td>'+itemTitle+'</td>'+
                    '<td><em>author here</em></td>'+
                    '<td>'+date+'</td>'+
                    '<td><button type="button" class="btn btn-primary" data-id="">insert</button></td>'+
                '</tr>';
        }
    });
    table += '</tbody></table>';
    // create the modal
    var $modal = jQuery(
        '<div class="modal fade" id="success-modal" role="dialog" aria-labelledby="success" aria-hidden="true">'+
            '<div class="modal-dialog">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                        '<h4 class="modal-title" id="success">Insérer votre référence</h4>'+
                    '</div>'+
                    '<div class="modal-body">'+
                        table +
                    '</div>'+
                    '<div class="modal-footer">'+
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
    );

    $modal.on('hidden.bs.modal', function (e) {
        jQuery(this).remove();
    });

    return $modal;
}

