sap.ui.define([
], function () {
    "use strict";

    var map = {
            "cm.util.CommonService": "srv-api/odata/v2/cm.util.CommonService/",
            "cm.util.OrgService": "srv-api/odata/v2/cm.util.OrgService/",
            "cm.util.HrService": "srv-api/odata/v2/cm.util.HrService/",
            "cm.util.SppUserSessionService": "srv-api/odata/v2/cm.util.SppUserSessionService/"
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