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
    var checked = "";
    var userIdValue = localStorage.getItem('zoteroApiUserId');
    var userKeyValue = localStorage.getItem('zoteroApiUserKey');
    if (localStorage.getItem('zoteroApiUserId')){
        checked = "checked";
    } else {
        userIdValue = "";
        userKeyValue = "";
    }
    var $apiZoteroForm = jQuery(
        '<form>'+
            '<p><label>Votre identifiant API (userID)</label><input type="text" name="user_api_id" value="'+userIdValue+'"/></p>'+
            '<p><label>Votre clé API (api key)</label><input type="text" name="user_api_key" value="'+userKeyValue+'"/></p>'+
            '<p class="storage">'+
                '<label class="save-ids">Sauvegarder mes identifiants pour cet ordinateur</label>'+
                '<input type="checkbox" id="save_ids" value="1" '+checked+'>'+
            '</p>'+
        '</form>'
    );
    $formModal.find('.modal-body').append($apiZoteroForm);

    var $help = jQuery(
        '<div class="help">'+
            '<p>Pour pouvoir récupérer vos références bibliographiques depuis le pad, vous devez autoriser l\'application. Voici la démarche à suivre</p>'+
            '<section>'+
                '<ul>'+
                    '<li>Connectez-vous sur <a target="_blank" href="https://www.zotero.org/user/login/">Zotero</a></li>'+
                    '<li>Puis, allez sur la page de <a target="_blank" href="https://www.zotero.org/settings/keys">configuration des clés API</a><br />'+
                        'Sur cette page, vous pouvez déjà récupérer votre <strong>userID</strong><br /><br />'+
                        '<img src="/static/plugins/ep_zotero/static/images/zotero_api_page.png"/>'+
                    '</li>'+
                    '<li>Ensuite, allez sur la page de <a target="_blank" href="https://www.zotero.org/settings/keys/new">création de clé</a><br />'+
                        'Ajoutez une description (par exemple pad_ens), et cochez <strong>Allow library access</strong>. Sauvegardez la clé. Vous pouvez ensuite récupérer la clé créée.<br /><br />'+
                        '<img src="/static/plugins/ep_zotero/static/images/zotero_create_api_key.png"/>'+
                    '</li>'+
                '</ul>'+
            '</section>'+
        '</div>'
    );

    // create the help link
    var $helpLink = jQuery('<p><em class="help-link"><a class="help-link" href="#">Comment récupérer ces identifiants?</a></em></p>');
    $apiZoteroForm.append($helpLink);
    // append help text
    $formModal.find('.modal-body').append($help);

    $helpLink.find('a').on('click', function() {
        if ($helpLink.find('a').text() === "Comment récupérer ces identifiants?") {
            $helpLink.find('a').text("Cacher l'aide");
        } else {
            jQuery('.help-link').find('a').text("Comment récupérer ces identifiants?");
        }
        $formModal.find('.help').toggleClass('active');
    });

    // create the validation button
    var $apiCallButton = jQuery('<button type="button" class="btn btn-primary">Valider</button>');
    $formModal.find('.modal-footer').append($apiCallButton);

    $apiCallButton.on('click', function() {
        $formModal.find('.modal-footer').addClass("ajax-loading");
        // set user id and key
        zoteroApiUserId = $apiZoteroForm.find('*[name="user_api_id"]').val();
        zoteroApiUserKey = $apiZoteroForm.find('*[name="user_api_key"]').val();
        if (document.getElementById('save_ids').checked){
            localStorage.setItem('zoteroApiUserKey', zoteroApiUserKey);
            localStorage.setItem('zoteroApiUserId', zoteroApiUserId);
        }
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

    var $deleteLocalStorageButton = jQuery('<button type="button" class="btn btn-default delete-ids">Supprimer la sauvegarde<br/> de mes identifiants</button>');
    $formModal.find('p.storage').append($deleteLocalStorageButton);
    $deleteLocalStorageButton.on('click', function() {
        /*$apiZoteroForm.find('*[name="user_api_id"]').attr('value', '');
        $apiZoteroForm.find('*[name="user_api_key"]').attr('value', '');*/
        console.log("delta");
        localStorage.clear();
        document.getElementById("save_ids").checked = false;
    });

    $formModal.on('hidden.bs.modal', function () {
        jQuery(this).remove();
    });

    return $formModal;
}