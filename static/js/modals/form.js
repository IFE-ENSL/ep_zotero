/**
 * Create the form modal to query the api
 */
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
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Fermer</button>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
    );

    // create the form
    var $apiZoteroForm = jQuery(
        '<form>'+
            '<p><label>Votre identifiant API (userID)</label><input type="text" name="user_api_id" value="'+zoteroApiUserId+'"/></p>'+
            '<p><label>Votre clé API (api key)</label><input type="text" name="user_api_key" value="'+zoteroApiUserKey+'"/></p>'+
        '</form>'
    );
    $formModal.find('.modal-body').append($apiZoteroForm);

    // create the help link
    var $helpLink = jQuery('<p><em class="help-link"><a class="help-link" href="#">Comment récupérer ces identifiants?</a></em></p>');
    $apiZoteroForm.append($helpLink);

    $helpLink.on('click', function() {
        $formModal.modal('hide');
        $helpModal = createHelpModal();
        jQuery('body').append($helpModal);
        $helpModal.modal();
    });

    // create the validation button
    var $apiCallButton = jQuery('<button type="button" class="btn btn-primary">Valider</button>');
    $formModal.find('.modal-footer').append($apiCallButton);

    $apiCallButton.on('click', function() {
        $formModal.find('.modal-footer').addClass("ajax-loading");
        // set user id and key
        zoteroApiUserId = $apiZoteroForm.find('*[name="user_api_id"]').val();
        zoteroApiUserKey = $apiZoteroForm.find('*[name="user_api_key"]').val();
        localStorage.setItem('zoteroApiUserKey', zoteroApiUserKey);
        localStorage.setItem('zoteroApiUserId', zoteroApiUserId);
        var url = "https://api.zotero.org/users/"+zoteroApiUserId+"/groups?key="+zoteroApiUserKey;
        console.log(url);
        jQuery.ajax({
            url : url
        })
        .success(function(xml){
            $formModal.modal('hide');
            $choiceModal = createChoiceModal(xml);
            jQuery('body').append($choiceModal);
            $choiceModal.modal();
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
