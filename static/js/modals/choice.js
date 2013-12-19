/**
 * Create the choice modal (choice between groups librairies and user library)
 */
function createChoiceModal(xml) {

    console.log(xml);
    // create the modal
    var $modal = jQuery(
        '<div class="modal fade" id="choice-modal" role="dialog" aria-labelledby="success" aria-hidden="true">'+
            '<div class="modal-dialog">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                        '<h4 class="modal-title" id="choice">Parcourir vos bibliothèques</h4>'+
                    '</div>'+
                    '<div class="modal-body">'+
                        '<div class="user-library"><h4>Ma bibliothèque</h4></div>'+
                        '<div class="groups-libraries"><h4>Bibliothèques de groupes</h4></div>'+
                    '</div>'+
                    '<div class="modal-footer">'+
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
    );

    /**
     * Load the appropriate modal
     * 
     * If the xml contains entries, there are collection and we load the collection modal
     * Else we load the items modal to display items directly
     */
    function loadAppropriateModal(url, xml) {
        if (hasTopCollections(xml)) {
            $modal.modal('hide');
            // if there are collections we send them
            console.log("has collection");
            $collectionModal = createCollectionModal(xml);
            jQuery('body').append($collectionModal);
            $collectionModal.modal();
        } else {
            // else we get the items
            console.log("has no collection");
            url = url.replace('collections/top', 'items');
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
    }

    // create button for the user library
    var $libraryCallButton = jQuery('<button type="button" class="btn btn-primary">Accéder à ma bibliothèque</button>');
    $modal.find('.user-library').append($libraryCallButton);

    // ajax request on click
    $libraryCallButton.on('click', function () {
        $modal.find('.modal-footer').addClass("ajax-loading");
        // collection or items
        var url = "https://api.zotero.org/users/"+zoteroApiUserId+"/collections/top?key="+zoteroApiUserKey;
        console.log(url);
        jQuery.ajax({
            url : url
        })
        .success(function(xml){
            loadAppropriateModal(url, xml);
        })
        .error(function(jqXHR, desc, errorThrown){
            $modal.modal('hide');
            $errorModal = createErrorModal();
            jQuery('body').append($errorModal);
            $errorModal.modal();
        });
    })

    // create the list of groups
    $groupLibrariesList = jQuery('<table class="table"></table>');

    // add li to the list
    jQuery(xml).find("entry").each(function(index) {

        // get the needed info from xml
        var entryTitle = getEntryTitle(this);
        zoteroGroupId = getEntryGroupId(this);

        // add a row
        $groupLibrariesList.append(
            '<tr>'+
                '<td>'+entryTitle+'</td>'+
                '<td></td>'+
            '</tr>'
        );

        // create the button to browser a group collection
        var $browseButton = jQuery('<button type="button" class="btn btn-primary" data-group-id="'+zoteroGroupId+'">Parcourir</button>');
        $groupLibrariesList.find('tr').last().find('td').last().append($browseButton);

        // ajax request on click
        $browseButton.on('click', function () {
            $modal.find('.modal-footer').addClass("ajax-loading");
            var url = "https://api.zotero.org/groups/"+zoteroGroupId+"/collections/top";
            console.log(url);
            jQuery.ajax({
                url : url
            })
            .success(function(xml){
                loadAppropriateModal(url, xml);
            })
            .error(function(jqXHR, desc, errorThrown){
                $modal.modal('hide');
                $errorModal = createErrorModal();
                jQuery('body').append($errorModal);
                $errorModal.modal();
            });
        });
    });

    $modal.find('.groups-libraries').append($groupLibrariesList);

    $modal.on('hidden.bs.modal', function (e) {
        jQuery(this).remove();
    });

    return $modal;
}

