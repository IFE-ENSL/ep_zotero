/*
    // insert text in pad
    var padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;
    return padeditor.ace.callWithAce(function (ace) {
        // rep contains informations about the cursor location
        rep = ace.ace_getRep();
        // insert the reference at the cursor location
        ace.ace_replaceRange(rep.selStart, rep.selStart, "Référence bibliographique");
    });
*/

jQuery(document).ready(function () {
    loadFormModal();

    // display the formmodal on click
    jQuery("#insertZoteroReference").click(function () {
        jQuery('#form-modal').modal();
    });

    // attempt an ajax request on click on the modal validation button
    jQuery("#zoteroRequestButton").click(function () {
        var apiUserId = document.getElementById('user_api_id').value; //1714010
        var apiUserKey = document.getElementById('user_api_key').value; //Dm8ucI67hW83jEY5Ah1aypoD
        event.preventDefault();
        requestZoteroApi(apiUserId, apiUserKey);
        console.log(apiUserId);
        console.log(apiUserKey);
    });
});

function loadFormModal() {
    jQuery('.modal').remove();
        jQuery('body').append('\
            <div class="modal fade" id="form-modal" role="dialog" aria-labelledby="success" aria-hidden="true">\
                <div class="modal-dialog">\
                    <div class="modal-content">\
                        <div class="modal-header">\
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                            <h4 class="modal-title" id="success">Récupérer vos références bibliographiques</h4>\
                        </div>\
                        <div class="modal-body">\
                            <label>Votre identifiant API</label><input type="text" name="user_api_id" id="user_api_id"/><br />\
                            <label>Votre clé API</label><input type="text" name="user_api_key" id="user_api_key"/>\
                        </div>\
                        <div class="modal-footer">\
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
                            <button type="button" class="btn btn-primary" id="zoteroRequestButton">Validate</button>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>\
    ');
}

function requestZoteroApi(apiUserId, apiUserKey) {
    var url = "https://api.zotero.org/users/"+apiUserId+"/items?key="+apiUserKey;
    jQuery.ajax({
        url : url
    })
    .success(function(xml){
        jQuery(xml).find("title").each(function( index ) {
            console.log( index + ": " + $( this ).text() );
        });
        
    })
    .error(function(jqXHR, desc, errorThrown){
        alert("not cool");
    });
}

