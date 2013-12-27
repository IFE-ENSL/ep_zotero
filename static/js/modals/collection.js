/**
 * Create the collection modal
 * 
 * This modal is used to get what is in a collection (others collections or items)
 */
function createCollectionModal(userType, xml, url, numItems, collectionTitle) {
    console.log(xml);
    // create the modal
    var $modal = jQuery(
        '<div class="modal fade" id="success-modal" role="dialog" aria-labelledby="success" aria-hidden="true">'+
            '<div class="modal-dialog">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                        '<h4 class="modal-title" id="success">Parcourir - '+collectionTitle+'</h4>'+
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
        var numItems = getNumItems(this);

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
                url = "https://api.zotero.org/groups/"+zoteroGroupId+"/collections/"+itemKey+"/collections?end=true";
            } else if (userType == "users") {
                url = "https://api.zotero.org/users/"+zoteroApiUserId+"/collections/"+itemKey+"/collections?end=true&key="+zoteroApiUserKey;
            }
            console.log(url);
            jQuery.ajax({
                url : url
            })
            .success(function(xml){
                if (hasCollections(xml)){ // we get the collection modal
                    $collectionModal = createCollectionModal(userType, xml, url, numItems, entryTitle);
                    jQuery('body').append($collectionModal);
                    $modal.modal('hide');
                    $collectionModal.modal();
                } else { // we get the items modal
                    url = url.replace(itemKey+"/collections", itemKey+"/items");
                    console.log(url);
                    jQuery.ajax({
                        url : url
                    })
                    .success(function(xml){
                        // we need the items modal
                        $modal.modal('hide');
                        $itemsModal = createItemsModal(xml, entryTitle);
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
    $table.prepend('<h5>Collections</h5>');
    // add the list of items if there are any
    if (numItems > 0) {
        url = url.replace("/collections\?end=true", "/items?");
        console.log(url);
        jQuery.ajax({
            url : url
        })
        .success(function(xml){
            // create the list of references
            var $list = jQuery('<div id="modal-list"></div>');
            $list.append(jQuery(
                '<h5>Références</h5>'+
                '<table class="table table-striped">'+
                    '<thead>'+
                        '<tr>'+
                            '<td>Titre</td>'+
                            '<td>Auteur</td>'+
                            '<td colspan="2">Date</td>'+
                        '</tr>'+
                    '</thead>'+
                    '<tbody class="list"></tbody>'+
                '</table>'
            ));

            // add rows to the table
            jQuery(xml).find("entry").each(function(index){

                // do not handle attachments entries
                var itemType = getEntryItemType(this);
                if (itemType != 'attachments') {

                    // get the needed info from xml
                    var entryTitle = getEntryTitle(this);
                    var date = getEntryDate(this);
                    var authorName = getEntryAuthorName(this);
                    var itemKey = getEntryItemKey(this);
                    var url = getEntryUrl(this);

                    // add a row
                    $list.find('tbody.list').append(
                        '<tr>'+
                            '<td class="title">'+entryTitle+'</td>'+
                            '<td class="author">'+authorName+'</td>'+
                            '<td class="date">'+date+'</td>'+
                        '</tr>'
                    );

                    // create the insert button
                    var $insertButton = jQuery('<td><button type="button" class="btn btn-primary insert_reference" data-key="'+itemKey+'">Insérer</button></td>');
                    $list.find('tbody.list').find('tr').last().append($insertButton);

                    // insert the reference on click
                    $insertButton.on('click', function (){
                        var padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;
                        padeditor.ace.callWithAce(function (ace) {
                            // rep contains informations about the cursor location
                            rep = ace.ace_getRep();
                            console.log(ace);
                            // insert the reference at the cursor location
                            var text =
                            '[ZoteroReference]'+
                            '{'+
                                '"key": "'+itemKey+'",'+
                                '"date": "'+entryDate+'",'+
                                '"title": "'+entryTitle+'",'+
                                '"author": "'+authorName+'",'+
                                '"location": "unknown",'+
                                '"editor": "unknown"'+
                            '}';
                            ace.ace_replaceRange(rep.selStart, rep.selStart, text);
                            $modal.modal('hide');
                        });
                    });
                }
            });

            $modal.find('.modal-body').append($list);
        })
        .error(function(jqXHR, desc, errorThrown){
            $modal.modal('hide');
            $errorModal = createErrorModal();
            jQuery('body').append($errorModal);
            $errorModal.modal();
        });
    }

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
