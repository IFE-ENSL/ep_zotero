var _, $, jQuery;
var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');

/**
 * aceAttribsToClasses
 *
 * Set the zotero-reference:'json' class where the zotero_ref attribute is set
 */
function aceAttribsToClasses(hook, context){
  if(context.key == 'zotero_ref'){
    return ['zotero-reference:'+context.value]; // set 'zotero-reference' class
  }
}

/**
 * aceCreateDomLine
 * 
 * Add a em tag with data-xxx attributes on zotero-reference:'json' lines
 */
function aceCreateDomLine(name, context){
    var cls = context.cls;
    var referenceType = /zotero-reference:\{.*\}/.exec(cls); // check if the line contains the wanted class
    if (referenceType) {
        var tag = 'zotero-reference:';
        var author, date, title;
        var jsonString = referenceType[0].substring(tag.length);
        var jsonObj = $.parseJSON(jsonString);
        var dataLine = "";
        for (key in jsonObj) {
            if (key === 'author') { author = jsonObj[key]; }
            if (key === 'date') { date = jsonObj[key]; }
            if (key === 'title') { title = jsonObj[key]; }
            dataLine += 'data-'+key+'="'+jsonObj[key]+'" ';
        }

        var modifier = {
          extraOpenTags: '<em title="'+title+', '+date+'"; style="background: url(\'/static/plugins/ep_zotero/static/images/zotero.png\') no-repeat left; padding-left: 20px;" '+dataLine+'>',
          extraCloseTags: '</em>',
          cls: cls
        };

        return [modifier];
    } else {
        return [];
    }
};

/**
 * Insert a reference
 * 
 * Find out which lines are selected and assign them the 'zotero_ref' attribute.
 */
function doInsertReference(json){
    var rep = this.rep,
    documentAttributeManager = this.documentAttributeManager;
    if (!(rep.selStart && rep.selEnd)){
      return;
    }
    documentAttributeManager.setAttributesOnRange(start, end, [
      ['zotero_ref', json]
    ]);
}

/**
 * aceInitialized
 * 
 * Once ace is initialized, we set ace_doInsertReference and bind it to the context
 */
function aceInitialized(hook, context){
  var editorInfo = context.editorInfo;
  editorInfo.ace_doInsertReference = _(doInsertReference).bind(context);
}

// Export all hooks
exports.aceInitialized = aceInitialized;
exports.aceAttribsToClasses = aceAttribsToClasses;
exports.aceCreateDomLine = aceCreateDomLine;