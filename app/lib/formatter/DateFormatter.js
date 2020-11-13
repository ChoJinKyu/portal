sap.ui.define([
    "sap/ui/core/format/DateFormat"
], function (DateFormat) {
	"use strict";

	return {

        toDateString: function(oDate){
            if(!oDate) return "";
            return DateFormat.getInstance().format(oDate, false);
        },
        
        toUTCDateString: function(oDate){
            if(!oDate) return "";
            return DateFormat.getInstance().format(oDate, true);
        },

        toDateTimeString: function(oDate){
            if(!oDate) return "";
            return DateFormat.getDateTimeInstance().format(oDate, true);
        },

        toUTCDateTimeString: function(oDate){
            if(!oDate) return "";
            return DateFormat.getDateTimeInstance().format(oDate, true);
        }

	};

});