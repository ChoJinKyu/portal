sap.ui.define([], function() { 
  "use strict";

  return function(data) {

    if(!data && !this.mBindingInfos){
        data = '[' + this.sPath.substr(1) + ']';
    }else if(!data && this.mBindingInfos){
        data = '[' + this.mBindingInfos.text.binding.sPath.substr(1) + ']';
    }

    return data;
  };
});