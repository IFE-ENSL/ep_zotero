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
                        
                    '</div>'+
                    '<div class="modal-footer">'+
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Fermer</button>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
    );

    // create the retry button
    var $retryButton = jQuery('<button type="button" class="btn btn-primary">Se connecter</button>');
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
