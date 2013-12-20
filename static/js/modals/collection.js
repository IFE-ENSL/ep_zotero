/**
 * Create the collection modal
 * 
 * This modal is used to get what is in a collection (others collections or items)
 */
function createCollectionModal(userType, xml) {

    // create the modal
    var $modal = jQuery(
        '<div class="modal fade" id="success-modal" role="dialog" aria-labelledby="success" aria-hidden="true">'+
            '<div class="modal-dialog">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                        '<h4 class="modal-title" id="success">Librarie - Insérer votre référence</h4>'+
                    '</div>'+
                    '<div class="modal-body"></div>'+
                    '<div class="modal-footer">'+
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
    );

    // create the list of collections
    var $table = jQuery('<table class="table table-striped"></table>');

    // add rows to the table
    jQuery(xml).find("entry").each(function(index) {

        var entry = this;
        // get the needed info from xml
        var entryTitle = getEntryTitle(this);
        var itemKey = getEntryItemKey(this);

        // add a row
        $table.append(
            '<tr>'+
                '<td class="title">'+entryTitle+'</td>'+
                '<td></td>'+
            '</tr>'
        );

        // create the insert button
        var $button = jQuery('<button type="button" class="btn btn-primary browse_collection" data-key="'+itemKey+'">Parcourir</button>');
        $table.find('tr').last().find('td').last().append($button);

        $button.on('click', function () {
            $modal.find('.modal-footer').addClass("ajax-loading");
            var url = "error";
            if (userType == "groups") {
                url = "https://api.zotero.org/groups/"+zoteroGroupId+"/collections/"+itemKey+"/collections";
            } else if (userType == "users") {
                url = "https://api.zotero.org/users/"+zoteroApiUserId+"/collections/"+itemKey+"/collections?key="+zoteroApiUserKey;
            }
            jQuery.ajax({
                url : url
            })
            .success(function(xml){
                if (hasCollections(xml)) { // we get the collection modal
                    $collectionModal = createCollectionModal(userType, xml);
                    jQuery('body').append($collectionModal);
                    $modal.modal('hide');
                    $collectionModal.modal();
                } else { // we get the items modal
                    url = url.replace(itemKey+"/collections", itemKey+"/items");
                    jQuery.ajax({
                        url : url
                    })
                    .success(function(xml){
                        // we need the items modal
                        $modal.modal('hide');
                        $itemsModal = createItemsModal(xml);
                        jQuery('body').append($itemsModal);
                        var options = { valueNames: ['author', 'title', 'date'] };
                        var modalList = new List('modal-list', options);
                        $itemsModal.modal();
                    })
                    .error(function(jqXHR, desc, errorThrown){
                        $modal.modal('hide');
                        $errorModal = createErrorModal();
                        jQuery('body').append($errorModal);
                        $errorModal.modal();
                    });
                }
            })
            .error(function(jqXHR, desc, errorThrown){
                $modal.modal('hide');
                $errorModal = createErrorModal();
                jQuery('body').append($errorModal);
                $errorModal.modal();
            });
        });
    });

    $modal.find('.modal-body').append($table);

    // create the go back to the choice modal button
    var $goBackButton = jQuery('<button type="button" class="btn btn-primary">Revenir à la fenêtre de choix</button>');
    $modal.find('.modal-footer').prepend($goBackButton);

    $goBackButton.on('click', function() {
        // set the ajax-loader
        $modal.find('.modal-footer').addClass("ajax-loading");
        // set user id and key
        var url = "https://api.zotero.org/users/"+zoteroApiUserId+"/groups?key="+zoteroApiUserKey;
        console.log(url);
        jQuery.ajax({
            url : url
        })
        .success(function(xml){
            $modal.modal('hide');
            $choiceModal = createChoiceModal(xml);
            jQuery('body').append($choiceModal);
            $choiceModal.modal();
        })
        .error(function(jqXHR, desc, errorThrown){
            $modal.modal('hide');
            $errorModal = createErrorModal();
            jQuery('body').append($errorModal);
            $errorModal.modal();
        });
    });

    $modal.on('hidden.bs.modal', function (e) {
        jQuery(this).remove();
    });

    return $modal;
}
