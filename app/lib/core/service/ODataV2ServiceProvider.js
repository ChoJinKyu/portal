sap.ui.define([
    "sap/ui/base/Object",
	"sap/ui/model/odata/v2/ODataModel"
], function (Object, ODataModel) {
    "use strict";

    var serviceUrls = {
            "cm.util.CommonService": "srv-api/odata/v2/cm.util.CommonService/",
            "cm.util.OrgService": "srv-api/odata/v2/cm.util.OrgService/"
        },
        models = {};
    
    return {
        getCommonService: function(sVersion){
            sVersion = sVersion || "v2";
            var sServiceName = "cm.util.CommonService",
                oModel = models[sServiceName];
            if(!oModel){
                oModel = new ODataModel({
                    serviceUrl: serviceUrls[sServiceName],
                    defaultBindingMode: "OneTime",
                    defaultCountMode: "Inline",
                    refreshAfterChange: false,
                    useBatch: true
                });
                models[sServiceName] = oModel;
            }
            return oModel;
        },
        
        getOrgService: function(sVersion){
            sVersion = sVersion || "v2";
            var sServiceName = "cm.util.OrgService",
                oModel = models[sServiceName];
            if(!oModel){
                oModel = new ODataModel({
                    serviceUrl: serviceUrls[sServiceName],
                    defaultBindingMode: "OneTime",
                    defaultCountMode: "Inline",
                    refreshAfterChange: false,
                    useBatch: true
                });
                models[sServiceName] = oModel;
            }
            return oModel;
        }
    }

});