sap.ui.define([
    "sap/ui/base/Object",
], function (Object) {
    "use strict";

    var UserChoices = Object.extend("ext.lib.core.UserChoices", {

        getTenantId: function(){
            return "L2100";
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
        }
        
    });

    return UserChoices;

});