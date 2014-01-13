/**
 * Create the items modal
 *
 * Display a list of items in a modal
 */
function createItemsModal(xml, collectionTitle) {

    // create the modal
    var $modal = jQuery(
        '<div class="modal fade" id="success-modal" role="dialog" aria-labelledby="success" aria-hidden="true">'+
            '<div class="modal-dialog">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                        '<h4 class="modal-title" id="success">Liste de références - '+collectionTitle+'</h4>'+
                    '</div>'+
                    '<div class="modal-body"></div>'+
                    '<div class="modal-footer">'+
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Fermer</button>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
    );

    // create the list of references
    var $list = jQuery('<div id="modal-list"></div>');
    $list.append(jQuery(
        '<input class="search" />'+
        '<button class="sort btn-primary" data-sort="title">Trier par titre</button>'+
        '<button class="sort btn-primary" data-sort="author">Trier par auteur</button>'+
        '<button class="sort btn-primary" data-sort="date">Trier par date</button>'+
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

    if (!jQuery(xml).find("entry").length) {
        $modal.find('.modal-body').append("Aucune référence n'est disponible");
    } else {
        // add rows to the table
        jQuery(xml).find("entry").each(function(index) {

            // do not handle attachments entries
            var itemType = getEntryItemType(this);
            if (itemType != 'attachments') {

                // get the needed info from xml
                var entryTitle = getEntryTitle(this);
                var entryDate = getEntryDate(this);
                var authorName = getEntryAuthorName(this);
                var itemKey = getEntryItemKey(this);
                var url = getEntryUrl(this);

                // add a row
                $list.find('tbody.list').append(
                    '<tr>'+
                        '<td class="title">'+entryTitle+'</td>'+
                        '<td class="author">'+authorName+'</td>'+
                        '<td class="date">'+entryDate+'</td>'+
                    '</tr>'
                );

                // create the insert button
                var $insertButton = jQuery('<td><button type="button" class="btn btn-primary insert_reference" data-key="'+itemKey+'">Insérer</button></td>');
                $list.find('tbody.list').find('tr').last().append($insertButton);

                // insert the reference on click
                $insertButton.on('click', function () {
                    var padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;
                    padeditor.ace.callWithAce(function (ace) {
                        var json =
                        '{'+
                            '"key": "'+itemKey+'",'+
                            '"date": "'+entryDate+'",'+
                            '"title": "'+entryTitle+'",'+
                            '"author": "'+authorName+'",'+
                            '"location": "unknown",'+
                            '"editor": "unknown"'+
                        '}';
                        // rep contains informations about the cursor location
                        /*rep = ace.ace_getRep();
                        start = rep.selStart;
                        end = [rep.selStart[0], rep.selStart[1]+text.length];
                        ace.ace_replaceRange(rep.selStart, rep.selStart, text);
                        // insert the reference at the cursor location
                        console.log(ace);
                        console.log(docAttr);
                        console.log(start);
                        console.log(end);*/
                        ace.ace_doInsertReference(json);
                        $modal.modal('hide');
                    },'insertReference' , true);
                });
            }
        });
        $modal.find('.modal-body').append($list);
    }

    // create the go back to the choice modal button
    var $goBackButton = jQuery('<button type="button" class="btn btn-primary">Revenir à la fenêtre de choix</button>');
    $modal.find('.modal-footer').prepend($goBackButton);

    $goBackButton.on('click', function() {
        $modal.find('.modal-footer').addClass("ajax-loading");
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
