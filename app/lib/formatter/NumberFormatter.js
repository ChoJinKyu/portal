sap.ui.define([
    "sap/ui/core/format/NumberFormat"
], function (NumberFormat) {
	"use strict";

	return {
        
        /**
         * a formatted string in the default locale and with default options
         * @param {number} pNumber 
         */
        numberFormat: function(pNumber){
            return this.numberFormat(pNumber, null, null);
        },

        /**
         * a formatted string using the locales argument 
         * @param {number} pNumber 
         * @param {string} pLocale 
         */
        numberFormat: function(pNumber, pLocale){
            return this.numberFormat(pNumber, pLocale, null);
        },

        /**
         * a formatted string using the locales argument and with currency option
         * (e.g) numberFormat(1234567890, 'de-DE', 'EUR')
         * @param {number} pNumber 
         * @param {string} pLocale 
         */
        numberFormat: function(pNumber, pLocale, pCurrency){
            if(!pNumber || pNumber === undefined){
                return "";
            }
            
            var oNumberFormat;
            if(pLocale && pLocale !== undefined){
                if(pCurrency && pCurrency !== undefined){
                    oNumberFormat = new Intl.NumberFormat(pLocale, { style: 'currency', currency: pCurrency });                    
                }else{
                    oNumberFormat = new Intl.NumberFormat(pLocale);
                }                
            }else{
                oNumberFormat = new Intl.NumberFormat();
            }

            return oNumberFormat.format(pNumber);
        }
	};

});