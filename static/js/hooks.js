/*var _ = require('ep_etherpad-lite/static/js/underscore');

// Once ace is initialized, we set the documentAttributeManager as a global variable
exports.aceInitialized = function(hook, context){
    console.log("init");
    docAttr = context.documentAttributeManager;
    var editorInfo = context.editorInfo;
    editorInfo.ace_doInsertZoteroReference = _(doInsertZoteroReference).bind(context);
}

/*exports.postAceInit = function(hook, context){
    var hs = $('.zoteroButton');
    hs.on('click', function(){
        context.ace.callWithAce(function(ace){
            ace.ace_doInsertZoteroReference();
        }, 'insertzoteroreference', true);
    });
}

function doInsertZoteroReference(){
    console.log(this);
    var rep = this.rep, documentAttributeManager = this.documentAttributeManager;
    var text =
        '[ZoteroReference]'+
        '{'+
            '"key": "'+"itemKey"+'",'+
            '"date": "'+"entryDate"+'",'+
            '"title": "'+"entryTitle"+'",'+
            '"author": "'+"authorName"+'",'+
            '"location": "unknown",'+
            '"editor": "unknown"'+
        '}';
    var firstLine, lastLine;

    start = rep.selStart;
    end = [rep.selStart[0], rep.selStart[1]+text.length];
    this.editorInfo.ace_replaceRange(rep.selStart, rep.selStart, text);
    documentAttributeManager.setAttributesOnRange(start, end, [["data-test", "test"]]);
    console.log("fin");
    firstLine = rep.selStart[0];
    lastLine = Math.max(firstLine, rep.selEnd[0] - ((rep.selEnd[1] === 0) ? 1 : 0));
    _(_.range(firstLine, lastLine + 1)).each(function(i){
        documentAttributeManager.setAttributeOnLine(i, 'heading', 'tag1');
    });
}*/

var _, $, jQuery;

var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');
var colorsClass = 'reference';

// All our colors are block elements, so we just return them.
var references = ['1'];

// Bind the event handler to the toolbar buttons
/*var postAceInit = function(hook, context){
  var hs = $('.color-selection');
  hs.on('change', function(){
    var value = $(this).val();
    var intValue = parseInt(value,10);
    if(!_.isNaN(intValue)){
      context.ace.callWithAce(function(ace){
        ace.ace_doInsertColors(intValue);
      },'insertColor' , true);
      hs.val("dummy");
    }
  })
  $('.font_color').hover(function(){
    $('.submenu > .color-selection').attr('size', 6);
  });
  $('.font-color-icon').click(function(){
    $('#font-color').toggle();
  });
};*/

// Our colors attribute will result in a 'reference' class
function aceAttribsToClasses(hook, context){
  if(context.key == 'zotero_ref'){
    return ['zotero-reference:'+context.value]; // set 'zotero-reference' class
  }
}


// Here we convert the class reference into a tag
function aceCreateDomLine(name, context){
    var cls = context.cls;
    var domline = context.domline;
    console.log('test');
    var referenceType = /zotero-reference:\{.*\}/.exec(cls);
    if (referenceType) {
        
        var tag = 'zotero-reference:';
        var author, date;
        console.log("ok?"); console.log(referenceType[0]);
        var jsonString = referenceType[0].substring(tag.length);
        console.log(jsonString);
        var jsonObj = $.parseJSON(jsonString);
        // set values into html via data attributes
        var dataLine = "";
        for (key in jsonObj) {
            if (key == 'author') {
                author = jsonObj[key];
            }
            if (key == 'date') {
                date = jsonObj[key];
            }
            
            dataLine += 'data-'+key+'="'+jsonObj[key]+'" ';
        }
   
        var modifier = {
          extraOpenTags: '<span '+dataLine+'>',
          extraCloseTags: '</span>',
          cls: cls
        };

        return [modifier];
    } else {
        return [];
    }
};



// Find out which lines are selected and assign them the 'zotero_ref' attribute.
function doInsertReference(json){
    console.log("doInsert");
    var rep = this.rep,
    documentAttributeManager = this.documentAttributeManager;
    if (!(rep.selStart && rep.selEnd)){
      return;
    }
    documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selEnd, [
      ['zotero_ref', json]
    ]);
}


// Once ace is initialized, we set ace_doInsertColors and bind it to the context
function aceInitialized(hook, context){
  var editorInfo = context.editorInfo;
  editorInfo.ace_doInsertReference = _(doInsertReference).bind(context);
}


// Export all hooks
exports.aceInitialized = aceInitialized;
exports.aceAttribsToClasses = aceAttribsToClasses;
exports.aceCreateDomLine = aceCreateDomLine;