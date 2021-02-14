sap.ui.define([
	"ext/lib/model/AbstractModel",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Parent, Filter, FilterOperator) {
    "use strict";

    var OPUiModel = Parent.extend("op.util.controller.OPUiModel", {

		metadata: {
            events: {
                ready: {
                    parameters : {
                        model : {type : "object"}
                    }
                }
            }
        },

        getText: function(sPath){
            if(arguments.length > 1){
                var sText = this.getProperty(sPath),
                    aParams = [], i;
                for(i = 1; i < arguments.length; i++){
                    aParams.push(arguments[i]);
                }
                aParams.forEach(function(oParam, nIndex){
                    sText = sText.replace('{'+(nIndex)+'}', oParam);
                });
                sText.replace()
                return sText;
            }else
                return this.getProperty(sPath)
        },

        setData: function(oData){
            var oParsed = this.getProperty("/") || {};
            (oData || []).forEach(function(oItem){
                oParsed[oItem.ettLabel] = oItem.ettStatus;
            });
            Parent.prototype.setData.call(this, oParsed);
        },

        setDataM: function(oData, txnType){
            var oParsed = this.getProperty("/") || {};
            (oData || []).forEach(function(oItem){
                if (oItem.txn_type_code === txnType)
                    oParsed[oItem.ettLabel] = oItem.ettStatus;
            });
            Parent.prototype.setData.call(this, oParsed);
        },

      
        setReady: function(){
            this.bReady = true;
            this.fireEvent("ready", {
                model: this
            });
        },

        isReady: function(){
            return this.bReady;
        }


    });

    return OPUiModel;
});
