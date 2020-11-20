sap.ui.define([
    "sap/ui/base/EventProvider",
	"jquery.sap.global",
    "./AbstractModel"
], function (EventProvider, jQuery, AbstractModel) {
    "use strict";

    var DEFAULT_GROUP_ID = "changes";

    var TransactionManager = EventProvider.extend("ext.lib.model.TransactionManager", {

        oServiceModel: null,

        aDataModels: [],

        setServiceModel: function(oModel){
            this.oServiceModel = oModel;
            return this;
        },

        addDataModel: function (oModel) {
            this.aDataModels.push(oModel);
            return this;
        },

        addTransactionGroup: function (sGroup) {
            if (this.oServiceModel) {
                var aDeferredGroups = this.oServiceModel.getDeferredGroups();
                aDeferredGroups = aDeferredGroups.concat([sGroup]);
                this.oServiceModel.setDeferredGroups(aDeferredGroups);
            }
            return this;
        },

        submit: function(oParameters){
            console.group("Submit all batches of OData Service by TransactionManager.");

            this.aDataModels.forEach(function(oModel){
                oModel.setTransactionModel(this.oServiceModel);
                oModel._executeBatch(DEFAULT_GROUP_ID);
                console.log("Batches are executed on one of model.");
            }.bind(this));
            
            var successHandler = oParameters.success,
                that = this;
            this.oServiceModel.submitChanges(jQuery.extend({
                success: function(oEvent){
                    that.aDataModels.forEach(function(oModel){
                        if(oModel._onSuccessSubmitChanges)
                            oModel._onSuccessSubmitChanges();
                    }.bind(this));
                    if(successHandler)
                        successHandler.apply(that.oServiceModel, arguments);
                    console.groupEnd();
                },
                error: function(){
                    debugger;
                }
            }));
        }
        
    });

    return TransactionManager;
});
