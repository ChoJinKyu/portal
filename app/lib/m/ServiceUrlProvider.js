sap.ui.define([
], function () {
    "use strict";

    var DESTINATION = '../srv-api';
    var ODATA_URI = '/odata/v4';

    var SERVICE_UTILS = '/cm.ServiceUtils';
    return {

        toAbsolute: function(uri){
            return uri.startsWith('/') ? uri : ('/' + uri)
        },

        toODataUrl: function(uri){
            return DESTINATION + ODATA_URI + this.toAbsolute(uri);
        },

        getServiceUtils: function(entityName) {
            return this.toODataUrl(SERVICE_UTILS + this.toAbsolute(entityName));
        }
        
    }
    
}, true);

