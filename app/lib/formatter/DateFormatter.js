sap.ui.define([
    "sap/ui/core/format/DateFormat",
    "ext/lib/core/UserChoices"
], function (DateFormat, UserChoices) {
    "use strict";

    var getInstance = function(sFormat){
            return DateFormat.getInstance({ pattern: sFormat || "yyyy-MM-dd HH:mm:ss" });
        },
        toString = function(oDate, sType, bUTC){
            if(!oDate) return "";
            var sFormat = UserChoices.getDateTimeFormatString();
            switch(sType) {
                case "Date": 
                sFormat = UserChoices.getDateFormatString();
                break;
                case "Time": 
                sFormat = UserChoices.getTimeFormatString();
                break;
            }
            if(typeof oDate == "string") {
                try{
                    oDate = new Date(oDate);
                }catch(e){};
            }
            return getInstance(sFormat).format(oDate, bUTC);
        };

	return {
        
        toDateString: function(oDate){
            if(!oDate) return "";
            return toString(oDate, "Date", false);
        },
        
        toTimeString: function(oDate){
            if(!oDate) return "";
            return toString(oDate, "Time", false);
        },

        toDateTimeString: function(oDate){
            if(!oDate) return "";
            return toString(oDate, "DateTime", false);
        },
        
        toUTCDateString: function(oDate){
            if(!oDate) return "";
            return toString(oDate, "Date", true);
        },
        
        toUTCTimeString: function(oDate){
            if(!oDate) return "";
            return toString(oDate, "Time", true);
        },

        toUTCDateTimeString: function(oDate){
            if(!oDate) return "";
            return toString(oDate, "DateTime", true);
        }

	};

});