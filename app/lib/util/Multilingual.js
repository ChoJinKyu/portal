sap.ui.define([
    "sap/ui/base/EventProvider",
	"ext/lib/model/I18nModel",
	"sap/ui/model/odata/v2/ODataModel"
], function (EventProvider, I18nModel, ODataModel) {
    "use strict";

    var oServiceModel = new ODataModel({
        serviceUrl: "srv-api/odata/v2/cm.util.CommonService/",
        defaultBindingMode: "OneWay",
        defaultCountMode: "Inline",
        refreshAfterChange: false,
        useBatch: true
    });
    
    var Multilingual = EventProvider.extend("ext.lib.util.Multilingual", {

		metadata: {
            events: {
                ready: {
                    parameters : {
                        model : {type : "object"}
                    }
                }
            }
        },

        constructor: function(){
            this.oModel = sap.ui.getCore().getModel("MultilingualModel");
            if(this.oModel == null){
                this.oModel = new I18nModel();
                this.oModel
                    .setTransactionModel(oServiceModel)
                    .attachEvent("loaded", function(oEvent){
                        this.isReady = true;
                        this.fireEvent("ready", {
                            model: this.oModel
                        });
                    }.bind(this))
                    //.load(this.getOwnerComponent().getManifestEntry("sap.app").id)
                    // .load("cm.templateListInlineEdit");
                    .load();
                sap.ui.getCore().setModel(this.oModel, "MultilingualModel");
            }else{
                setTimeout(function(){
                    this.fireEvent("ready", {
                        model: this.oModel
                    });
                }.bind(this), 10);
            }

            EventProvider.prototype.constructor.apply(this, arguments);
        },

        getModel: function(){
            return this.oModel;
        }
    });

    return Multilingual;
});