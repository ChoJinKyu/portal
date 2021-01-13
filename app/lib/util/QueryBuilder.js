sap.ui.define([
	"sap/ui/model/odata/ODataUtils",
], function (ODataUtils) {
    "use strict";

    return {
        build: function(oParameter){
            var aParams = [];
            if(oParameter.urlParameters)
                aParams.push(ODataUtils._createUrlParamsArray(oParameter.urlParameters));
            if(oParameter.filters)
			    aParams.push(ODataUtils.createFilterParams(oParameter.filters));
            if(oParameter.sorters)
                aParams.push(ODataUtils.createSortParams(oParameter.sorters));
            return "?" + aParams.join("&");
        },
        
        buildForCount: function(oParameter){
            var aParams = [];
            if(oParameter.filters)
			    aParams.push(ODataUtils.createFilterParams(oParameter.filters));
            return "/$count?" + aParams.join("&");
        }
    };
});