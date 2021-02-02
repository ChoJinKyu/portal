sap.ui.define([
	"./AbstractModel",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Parent, Filter, FilterOperator) {
    "use strict";

    var SppUserSessionModel = Parent.extend("ext.lib.model.SppUserSessionModel", {

		metadata: {
            events: {
                ready: {
                    parameters : {
                        model : {type : "object"}
                    }
                }
            }
        },

        getSessionAttr: function(pAttr){
            if(pAttr){
                if(pAttr.startsWith("/")){
                    return this.getProperty(pAttr);
                }else{
                    return this.getProperty("/" + pAttr);
                }
            }else{
                return null;
            }
        },

        setData: function(oData){
            if(oData.length == 1){
                Parent.prototype.setData.call(this, oData[0]);

                //sap.ui.getCore().getConfiguration().setLanguage('en');
                //sap.ui.getCore().getConfiguration().getFormatSettings().setNumberSymbol("decimal",",");
                //sap.ui.getCore().getConfiguration().getFormatSettings().setNumberSymbol("group"  ,".");
            }
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

    return SppUserSessionModel;
});
