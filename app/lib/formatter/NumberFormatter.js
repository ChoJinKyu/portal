sap.ui.define([
    "sap/ui/core/format/NumberFormat"
], function (NumberFormat) {
	"use strict";

	return {

        /**
         * a formatted string using the locales argument and with currency option
         * (e.g) numberFormat(1234567890, 'de-DE', 'EUR')
         * @param {number} nValue 
         * @param {string} sLocale 
         * @param {string} sCurrency 
         */
        toNumberString: function(nValue, sLocale, sCurrency){
            if(!nValue) return "";
            if(sLocale){
                if(sCurrency && sCurrency !== undefined){
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
        }
	};

});