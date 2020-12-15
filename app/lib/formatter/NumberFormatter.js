sap.ui.define([
    "sap/ui/core/format/NumberFormat",
    "ext/lib/core/UserChoices",
], function (NumberFormat, UserChoices) {
    "use strict";
    
    var toNumberString = function(nValue, sLocale, sCurrency){
        if(!nValue) return "";
        if(sLocale){
            if(sCurrency && sCurrency){
                return new Intl.NumberFormat(sLocale, {
                    style: 'currency', 
                    currency: sCurrency 
                }).format(nValue);
            }else{
                return new Intl.NumberFormat(sLocale).format(nValue);
            }                
        }else{
            return new Intl.NumberFormat().format(nValue);
        }
    };

	return {

        /**
         * a formatted string using the locales argument and with currency option
         * (e.g) toNumberString(1234567890, 'de-DE', 'EUR')
         * @param {number} nValue 
         * @param {string} sLocale 
         * @param {string} sCurrency 
         */
        toNumberString: function(nValue, sLocale, sCurrency){
            return toNumberString(nValue, sLocale, sCurrency);
        },

        /**
         * a formatted string using user locale and currency string
         * (e.g) toCurrencyString(5769.83)
         * @param {number} nValue 
         */
        toCurrencyString: function(nValue){
            var sLocale = UserChoices.getLocaleString(), 
                sCurrency = UserChoices.getCurrencyCode();
            return toNumberString(nValue, sLocale, sCurrency);
        }
	};

});