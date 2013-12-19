/**
 * Create the items modal
 *
 * Display a list of items in a modal
 */
function createItemsModal(xml) {

    console.log(xml);
    // create the modal
    var $modal = jQuery(
        '<div class="modal fade" id="success-modal" role="dialog" aria-labelledby="success" aria-hidden="true">'+
            '<div class="modal-dialog">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                        '<h4 class="modal-title" id="success">Liste de références</h4>'+
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

    // add rows to the table
    jQuery(xml).find("entry").each(function(index) {

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
            $insertButton.on('click', function () {
                var padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;
                padeditor.ace.callWithAce(function (ace) {
                    // rep contains informations about the cursor location
                    rep = ace.ace_getRep();
                    // insert the reference at the cursor location
                    var text = "[ZoteroKey"+itemKey+"]";
                    ace.ace_replaceRange(rep.selStart, rep.selStart, text);
                    console.log(ace);
                    $modal.modal('hide');
                });
            });
        }
    });

    $modal.find('.modal-body').append($list);

    $modal.on('hidden.bs.modal', function (e) {
        jQuery(this).remove();
    });

    return $modal;
}
