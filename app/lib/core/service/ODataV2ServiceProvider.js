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

        getService: function(serviceName, isNew){
            if(!serviceUrls[serviceName])
                throw new Exception("No service registered : " + serviceName);
            if(isNew === true){
                return this._createModel({
                    serviceUrl: serviceUrls[serviceName]
                });
            }else{
                var oModel = models[serviceName];
                if(!oModel){
                    oModel = this._createModel({
                        serviceUrl: serviceUrls[serviceName]
                    });
                    models[serviceName] = oModel;
                }
                return oModel;
            }
        },

        getServiceByUrl: function(serviceUrl, isNew){
            var oUrl, sServiceName;
            for(oUrl in serviceUrls){
                if(serviceUrl == serviceUrls[oUrl]){
                    sServiceName = oUrl;
                    break;
                }
            }
            if(sServiceName){
                return this.getService(sServiceName, isNew);
            }else{
                return this._createModel({
                    serviceUrl: serviceUrl
                });
            }
        },

        _createModel: function(sParams){
            return new ODataModel(jQuery.extend({
                    defaultBindingMode: "OneTime",
                    defaultCountMode: "Inline",
                    refreshAfterChange: false,
                    useBatch: true
                }, sParams || {}));
        },

        getCommonService: function(){
            return this.getService("cm.util.CommonService");
        },
        
        getOrgService: function(){
            return this.getService("cm.util.OrgService");
        }
    }

});