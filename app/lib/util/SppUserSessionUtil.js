sap.ui.define([
    "sap/ui/base/Object",
    "ext/lib/util/SppUserSession"
], function (Object, SppUserSession) {
    "use strict";

    var SppUserSessionUtil = {
        SppUserSession : new SppUserSession(),

        getUserInfo: function(){
            return this.SppUserSession.getModel().getData();
        },

        getUserId: function(){
            return this.SppUserSession.getModel().getSessionAttr("USER_ID");
        },

        getTenantId: function(){
            return this.SppUserSession.getModel().getSessionAttr("TENANT_ID");
        },
        
        getLanguageCode: function(){
            return this.SppUserSession.getModel().getSessionAttr("LANGUAGE_CODE");
        },

        getTimezoneCode: function(){
            return this.SppUserSession.getModel().getSessionAttr("TIMEZONE_CODE");
        },

        getDateFormatType: function(){
            return this.SppUserSession.getModel().getSessionAttr("DATE_FORMAT_TYPE");
        },

        getDigitsFormatType: function(){
            return this.SppUserSession.getModel().getSessionAttr("DIGITS_FORMAT_TYPE");
        },

        getCurrencyCode: function(){
            return this.SppUserSession.getModel().getSessionAttr("CURRENCY_CODE");
        }

    };

    return SppUserSessionUtil;

});