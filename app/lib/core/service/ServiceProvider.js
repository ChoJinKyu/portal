sap.ui.define([
    "sap/ui/base/Object",
	"./ServiceUrlProvider",
	"./ODataXhrService"
], function (Object, ServiceUrlProvider, ODataXhrService) {
    "use strict";

    var services = {};
    
    return {

        getService: function(serviceName, isNew){
            if(isNew === true){
                return this._createService({
                    serviceUrl: ServiceUrlProvider.getUrl(serviceName),
                    useBatch: true
                });
            }else{
                var oService = services[serviceName];
                if(!oService){
                    oService = this._createService({
                        serviceUrl: ServiceUrlProvider.getUrl(serviceName),
                        useBatch: true
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
        },
        
        _createService: function(sParams){
            return new ODataXhrService(sParams || {});
        }
        
    }

});