sap.ui.define([
    "sap/ui/thirdparty/jquery",
], function (jQuery) {
    "use strict";

    var ODataUtil = {

        parseBatchResponses : function(aData){
            var aResponses = aData.__batchResponses,
                aSuccesses,
                aErrors = [];
            if(!aResponses || aResponses.length < 1)
                return [];
            aSuccesses = jQuery.map(aResponses, function(oResponse){
                if(parseInt(oResponse.statusCode, 10) >= 400){
                    aErrors.push(oResponse);
                }else{
                    return oResponse.data;
                }
            });
            return {
                successes: aSuccesses,
                errors: aErrors
            }
        }
        
    };

    return ODataUtil;
});