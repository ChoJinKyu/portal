sap.ui.define([], function() { 
  "use strict";

  return function(data) {

    return data ? data : '[' + this.mBindingInfos.text.binding.sPath.substr(1) + ']';
  };
});