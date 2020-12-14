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