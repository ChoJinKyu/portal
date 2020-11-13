sap.ui.define([
    "sap/ui/core/format/DateFormat"
], function (DateFormat) {
	"use strict";

	return {

        toDateString: function(oDate){
            return DateFormat.getInstance().format(oDate, false);
        },
        
        toUTCDateString: function(oDate){
            return DateFormat.getInstance().format(oDate, true);
        },

        toDateTimeString: function(oDate){
            return DateFormat.getDateTimeInstance().format(oDate, true);
        },

        toUTCDateTimeString: function(oDate){
            return DateFormat.getDateTimeInstance().format(oDate, true);
        }

	};

});