/**
 * Create
 * This modal is used to get what is in a collection (others collections or items)
 */

//numCollections

function createCollectionModal(xml) {
    //xml = list of collections or nothing?
    console.log(xml);
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
            // sub collection or items
            var url = "https://api.zotero.org/groups/"+zoteroGroupId+"/collections/"+itemKey+"/collections";
            console.log(url);
            jQuery.ajax({
                url : url
            })
            .success(function(xml){
                if (hasSubCollections(entry)) {
                    $modal.modal('hide');
                    // if there are collections we send them
                    console.log("has sub collections");
                    $collectionModal = createCollectionModal(xml);
                    jQuery('body').append($collectionModal);
                    $collectionModal.modal();
                } else {
                    // else we get the items
                    console.log("has no sub collections");
                    var url = "https://api.zotero.org/groups/"+zoteroGroupId+"/collections/"+itemKey+"/items";
                    jQuery.ajax({
                        url : url
                    })
                    .success(function(xml){
                        $modal.modal('hide');
                        // we need the items modal
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

    $modal.on('hidden.bs.modal', function (e) {
        jQuery(this).remove();
    });

    return $modal;
}
