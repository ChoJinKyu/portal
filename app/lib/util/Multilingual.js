sap.ui.define([
	"ext/lib/model/I18nModel",
	"sap/ui/model/odata/v2/ODataModel"
], function (I18nModel, ODataModel) {
    "use strict";
    
    var Multilingual = function(){
            // Do not use the constructor
            throw new Error();
        },
        MultilingualClass = function(){
            this.oServiceModel = new ODataModel({
                serviceUrl: "srv-api/odata/v2/xx.TemplateService/",
                defaultBindingMode: "OneWay",
                defaultCountMode: "Inline",
                refreshAfterChange: false,
                useBatch: true
            });
            this.oModel = new I18nModel();
			this.oModel
                .setTransactionModel(this.oServiceModel)
                .attachEvent("loaded", function(oEvent){

                    // Add the mainList page to the flp routing history
                    this.addHistoryEntry({
                        title: this.getModel("i18nd").getText("/templateListInlineEdit.title"),
                        icon: "sap-icon://table-view",
                        intent: "#Template-display"
                    }, true);

                }.bind(this))
                //.load(this.getOwnerComponent().getManifestEntry("sap.app").id)
                // .load("cm.templateListInlineEdit");
                .load();

        },
        oSingleton;

    Multilingual.getInstance = function(){
        if(!oSingleton)
            oSingleton = new MultilingualClass();
        return oSingleton;
    };

    MultilingualClass.prototype = {
        getModel: function(){
            return this.oModel;
        }
    }

    return Multilingual;
});