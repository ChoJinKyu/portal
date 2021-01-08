sap.ui.define([
], function () {
    "use strict";

    var map = {
            "dp.MmService": "srv-api/odata/v2/dp.util.MmService/"
        };
    
    return {
        getUrl: function(sServiceName){
            if(!map.hasOwnProperty(sServiceName))
                throw new Exception("No registered service name.");
            return map[sServiceName];
        },

        getName: function(sServiceUrl){
            var oUrl, sServiceName;
            for(oUrl in map){
                if(sServiceUrl == map[oUrl]){
                    return oUrl;
                }
            }
        }
    }

});