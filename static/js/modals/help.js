/**
 * Create help modal
 */
function createHelpModal() {

    // create the modal
    var $modal = jQuery(
        '<div class="modal fade" role="dialog" aria-labelledby="success" aria-hidden="true">'+
            '<div class="modal-dialog">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                        '<h4 class="modal-title" id="success">Aide</h4>'+
                    '</div>'+
                    '<div class="modal-body">'+
                        '<h5>Récupérer vos identifiants Zotero</h5>'+
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
                    '</div>'+
                    '<div class="modal-footer">'+
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Fermer</button>'+
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
