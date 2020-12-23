sap.ui.define([
    "sap/ui/base/Object",
	"./ODataXhrService"
], function (Object, ODataXhrService) {
    "use strict";

    var serviceUrls = {
            "cm.util.CommonService": "srv-api/odata/v2/cm.util.CommonService/",
            "cm.util.OrgService": "srv-api/odata/v2/cm.util.OrgService/"
        },
        services = {};
    
    return {

        getService: function(serviceName, isNew){
            if(!serviceUrls[serviceName])
                throw new Exception("No service registered : " + serviceName);
            if(isNew === true){
                return this._createService({
                    serviceUrl: serviceUrls[serviceName]
                });
            }else{
                var oService = services[serviceName];
                if(!oService){
                    oService = this._createService({
                        serviceUrl: serviceUrls[serviceName]
                    });
                    services[serviceName] = oService;
                }
                return oService;
            }
        },

        getServiceByUrl: function(serviceUrl, isNew){
            var sServiceName = ServiceUrlProvider.getName(serviceUrl);
            if(sServiceName){
                return this.getService(sServiceName, isNew);
            }else{
                return this._createService({
                    serviceUrl: serviceUrl,
                    useBatch: true
                });
            }
        }
    }

});