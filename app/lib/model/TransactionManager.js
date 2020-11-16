sap.ui.define([
    "sap/ui/base/EventProvider",
	"jquery.sap.global",
    "./AbstractModel"
], function (EventProvider, jQuery, AbstractModel) {
    "use strict";

    var TransactionManager = EventProvider.extend("ext.lib.model.TransactionManager", {

        transactionModel: null,

        models: [],

        constructor: function(){
            EventProvider.prototype.constructor.apply(this, arguments);
        },

        addDataModel: function (oModel) {
            this._oTransactionModel = oModel;
            return this;
        },

        addTransactionGroup: function (sGroup) {
            if (this._oTransactionModel) {
                var aDeferredGroups = this._oTransactionModel.getDeferredGroups();
                aDeferredGroups = aDeferredGroups.concat([sGroup]);
                this._oTransactionModel.setDeferredGroups(aDeferredGroups);
            }
            return this;
        },

        submit: function(oParameters){
            console.group("Submit all batches of OData Service by TransactionManager.");

            models.forEach(function(oModel){
                oModel._executeBatch();
                console.log("Batches are executed on one of model.");
            });
            
            var successHandler = oParameters.success,
                that = this;
            oService.submitChanges(jQuery.extend({
                success: function(oEvent){
                    console.groupEnd();
                    if(successHandler)
                        successHandler.apply(that._oTransactionModel, arguments);
                }
            }));
        }
        
    });

    return TransactionManager;
});
