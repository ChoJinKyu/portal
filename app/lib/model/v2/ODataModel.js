sap.ui.define([
    "sap/ui/model/odata/v2/ODataModel"
], function (SuperModel) {
    "use strict";

    var STATE_COLUMN = "_row_state_";

    var ODataV2Model = SuperModel.extend("ext.lib.model.v2.ODataModel", {
        _CLASS: "ext.lib.model.v2.ODataModel",

        constructor: function(){

            SuperModel.prototype.constructor.apply(this, arguments);
            this.attachPropertyChange(this.onPropertyChanged);
        },

        onPropertyChanged: function(oEvent){
            if(oEvent.getId() == STATE_COLUMN) return;
            var oContext = oEvent.getParameter("context");
            this.setProperty(oContext.getPath() + "/" + STATE_COLUMN, "U");
            debugger;
        },

        read: function (sPath, oParameters) {
            var that = this,
                successHandler = oParameters.success;
            SuperModel.prototype.read.call(this, sPath, jQuery.extend(oParameters, {
                success: function (oData) {
                    if (successHandler)
                        successHandler.apply(that._oTransactionModel, arguments);
                }
            }));
            
        },
        
    });

    return ODataV2Model;
});
