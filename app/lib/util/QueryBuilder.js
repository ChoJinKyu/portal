sap.ui.define([
	"sap/ui/model/odata/ODataUtils",
], function (ODataUtils) {
    "use strict";

    return {
        build: function(oParameter, oMetadata, sEntity){
            var aParams = [],
                oEntityType = oMetadata._getEntityTypeByPath("/" + sEntity);
            if(oParameter.urlParameters)
                aParams.push(ODataUtils._createUrlParamsArray(oParameter.urlParameters));
            if(oParameter.filters)
			    aParams.push(ODataUtils.createFilterParams(oParameter.filters, oMetadata, oEntityType));
            if(oParameter.sorters)
                aParams.push(ODataUtils.createSortParams(oParameter.sorters));
            return "?" + aParams.join("&");
        },
        
        buildForCount: function(oParameter, oMetadata, sEntity){
            var aParams = [],
                oEntityType = oMetadata._getEntityTypeByPath("/" + sEntity);
            if(oParameter.filters)
			    aParams.push(ODataUtils.createFilterParams(oParameter.filters, oMetadata, oEntityType));
            return "/$count?" + aParams.join("&");
        }
    };
});