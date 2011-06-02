var Utils = {
  NOT_SUPPORTED : {},
  DOM : {
    getElementWithId : function() {
      var func = function() { return Utils.NOT_SUPPORTED; }
      if(document.getElementById) {
        func = function(id) {
          return document.getElementById(id);
        }
      } else if(document.all) {
        func = function(id) {
          return document.all[id];
        }
      }
      return ( this.getElementWithId = func )();
    }
  },
  Ranges : {
    create : function() {
      var func = function() { return Utils.NOT_SUPPORTED };
      if(document.body && document.body.createTextRange) {
        func = function() { return document.body.createTextRange(); }
      } else if(document.createRange) {
        func = function() { return document.createRange(); }
      }
      return (this.create = func)();
    },
    selectNode : function(node, originalRng) {
      var func = function() { return Utils.NOT_SUPPORTED; };
      var rng = this.create(), method = '';
      if(rng.moveToElementText) { method = 'moveToElementText'; }
      else if(rng.selectNode) { method = 'selectNode'; }
      if(method)
        func = function(node, rng) {
          rng = rng || Utils.Ranges.create();
          rng[method](node);
          return rng;
        }
      return rng = null, (this.selectNode = func)(node, originalRng);
    }
  },
  Selection : {
    clear:function() {
      var func = function() { return Utils.NOT_SUPPORTED };
      if( typeof document.selection !== 'undefined' ) {
        func = function() {
          if(document.selection && document.selection.empty) {
            return (Utils.Selection.clear = function() {
              if(document.selection) { document.selection.empty(); }
            })();
          }
        }
      } else if(window.getSelection) {
        var sel = window.getSelection();
        if(sel.removeAllRanges) {
          func = function() {
            window.getSelection().removeAllRanges();
          }
        }
        sel = null;
      }
      return (this.clear = func)();
    },
    add : function(originalRng) {
      var func = function() { return Utils.NOT_SUPPORTED };
      var rng = Utils.Ranges.create();
      if(rng.select) {
        func = function(rng) { rng.select(); }
      } else if(window.getSelection) {
        var sel = window.getSelection();
        if(sel.addRange) {
          func = function(rng) { window.getSelection().addRange(rng); }
        }
        sel = null;
      }
      return (this.add = func) ( originalRng );
    }
  }
};
(function() {
  var rng = Utils.Ranges.create();
  var ele = Utils.DOM.getElementWithId( 'myID' );
  if(rng !== Utils.NOT_SUPPORTED && ele !== Utils.NOT_SUPPORTED) {
    document.write(
      '<form>' +
      '<input type="button" class="key" value="Select" onclick="'+
        'Utils.Selection.clear();' +
        'Utils.Selection.add(' +
          'Utils.Ranges.selectNode(' +
            'Utils.DOM.getElementWithId( this.form.ids.options[this.form.ids.selectedIndex].value )'+
          ')' +
        ')' +
      '">&nbsp;' +
      '<select name="ids">' +
      '<option value="line1" selected="selected">line 1</option>' +
      '<option value="line2">line 2</option>' +
      '<option value="line3">line 3</option>' +
      '<option value="lines">all 3</option>' +
      '<option value="sam">the code</option>' +
      '<option value="body">the page</option>' +
      '<\/select>' +
      '<\/form>'
    );
  }
})();