/*
* deprecated
*/
sap.ui.define([
    "sap/ui/base/Object",
], function (Object) {
    "use strict";

    var UserChoices = {

        getTenantId: function(){
            return "L2100";
        },

        getLocaleString: function(){
            var sLang = sap.ui.getCore().getConfiguration().getLocale().toString();
            return sLang.substring(0, 2);
        },

        getLanguage: function(){
            var sLang = sap.ui.getCore().getConfiguration().getLanguage().toUpperCase();
            return sLang.substring(0, 2);
        },

        getDateTimeFormatString: function(){
            return "yyyy-MM-dd HH:mm:ss";
        },

        getDateFormatString: function(){
            return "yyyy-MM-dd";
        },

        getTimeFormatString: function(){
            return "HH:mm:ss";
        },

        getUserInfo: function(){
            return new sap.ushell.services.UserInfo();
        },

        getFormatSettings: function(){
            return sap.ui.getCore().getConfiguration().getFormatSettings()   
        },

        getCurrencyCode: function(){
            return "USD";
        }
        
    };

    return UserChoices;

});