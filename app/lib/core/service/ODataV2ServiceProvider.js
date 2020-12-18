sap.ui.define([
    "./ServiceProvider",
	"sap/ui/model/odata/v2/ODataModel"
], function (Parent, ODataModel) {
    "use strict";

    Parent._createService = function(sParams){
        return new ODataModel(jQuery.extend({
                defaultBindingMode: "OneTime",
                defaultCountMode: "Inline",
                refreshAfterChange: false,
                useBatch: true
            }, sParams || {}));
    };

    Parent.getCommonService = function(){
        return this.getService("cm.util.CommonService");
    };
    
    Parent.getOrgService = function(){
        return this.getService("cm.util.OrgService");
    };

    return Parent;

});