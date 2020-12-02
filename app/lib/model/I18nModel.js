sap.ui.define([
	"./AbstractModel",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (JSONModel, Filter, FilterOperator) {
    "use strict";

    var I18nModel = JSONModel.extend("ext.lib.model.I18nModel", {

		metadata: {
            events: {
                loaded: {
                    parameters: {
						oData: {type: "object"}
					}
                }
            }
        },

        setTransactionModel: function (oModel) {
            this._oTransactionModel = oModel;
            //this.addTransactionGroup("_load_multilanguage");
            return this;
        },

        addTransactionGroup: undefined,

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

        load: function(){
            var sTenantId = "L2100",
                sLanguageCode = sap.ui.getCore().getConfiguration().getLanguage().toUpperCase();
            if(sLanguageCode.length > 2) sLanguageCode = sLanguageCode.substring(0, 2);

            //load all CM chain messages
            this._load([
                new Filter("tenant_id", FilterOperator.EQ, sTenantId),
                new Filter("language_code", FilterOperator.EQ, sLanguageCode)
            ]);

            return this;
        },

        loadBy: function(aGroups){
            var sTenantId = "L2100",
                sLanguageCode = sap.ui.getCore().getConfiguration().getLanguage().toUpperCase();
            if(sLanguageCode.length > 2) sLanguageCode = sLanguageCode.substring(0, 2);

            //load all CM chain messages
            this._load([
                new Filter("tenant_id", FilterOperator.EQ, sTenantId),
                new Filter("language_code", FilterOperator.EQ, sLanguageCode),
                new Filter("chain_code", FilterOperator.EQ, "CM"),
                new Filter("group_code", FilterOperator.EQ, null)
            ]);

            //load the other chain's group messages
            if(typeof aGroups == "string") aGroups = [aGroups];
            aGroups.forEach(function(sGroup){
                var aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, sTenantId),
                    new Filter("language_code", FilterOperator.EQ, sLanguageCode)
                ], sChain;
                if(sGroup.indexOf(".") > -1){
                    sChain = sGroup.substring(0, sGroup.indexOf(".")).toUpperCase();
                    sGroup = sGroup.substring(sGroup.indexOf(".")+1);
                    aFilters.push(new Filter("chain_code", FilterOperator.EQ, sChain));
                    aFilters.push(new Filter("group_code", FilterOperator.EQ, sGroup));
                }else{
                    aFilters.push(new Filter("group_code", FilterOperator.EQ, sGroup));
                }
                this._load(aFilters);
            }.bind(this));

            return this;
        },

        _load: function(filters){
			this._oTransactionModel.read("/Message", {
                    filters: filters,
                    urlParameters: {
                        "$select": "message_code,message_contents" //,message_type_code
                    },
                    success: function(oData){
                        this._setDataParsedFrom(oData);
                        this.fireEvent("loaded", {oData: oData});
                    }.bind(this),
                    error: function(oErr){
                        console.error("Failed to load multi language messages.");
                    }
                }
            );
        },

        _setDataParsedFrom: function(oData){
            var oParsed = this.getProperty("/") || {};
            (oData.results || []).forEach(function(oItem){
                oParsed[oItem.message_code] = oItem.message_contents;
            });
            this.setData(oParsed, false);
        }

    });

    return I18nModel;
});
