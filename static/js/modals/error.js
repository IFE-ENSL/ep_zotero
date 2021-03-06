/**
 * Create the error modal
 */
function createErrorModal(errorMessage) {

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
                        'Il est possible que vos identifiants soient erronés ou que l\'api zotero soit indisponible actuellement.'+
                    '</div>'+
                    '<div class="modal-footer">'+
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Fermer</button>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
    );

    // create the retry button
    var $retryButton = jQuery('<button type="button" class="btn btn-primary">Se reconnecter</button>');
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
