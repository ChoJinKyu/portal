sap.ui.define([
	"./AbstractModel"
], function (JSONModel) {
    "use strict";

    var STATE_COL = "_state_";

    var ManagedModel = JSONModel.extend("ext.lib.model.ManagedModel", {

        setData: function(oData, sEntity, bMerge){
            var sPath = this._transactionPath;
            oData = oData || {};
            if(oData.__metadata && oData.__metadata.uri){
                oData.__entity = oData.__metadata.uri.substring(oData.__metadata.uri.indexOf(sPath));
            } else if(!!sEntity){
                oData.__entity = sEntity;
                oData[STATE_COL] = "C";
            }
            JSONModel.prototype.setData.call(this, oData, bMerge);
        },

        removeData: function(){
            var oData = this.getObject("/");
            oData[STATE_COL] = "D";
            JSONModel.prototype.setProperty.call(this, "/", oData);
        },

        read: function(sPath, oParameters){
            var that = this,
                successHandler = oParameters.success;
			this._oTransactionModel.read(sPath, jQuery.extend(oParameters, {
                    success: function(oData){
                        that._transactionPath = sPath;
                        that.setData(oData, false);
                        if(successHandler)
                            successHandler.apply(that._oTransactionModel, arguments);
                    }
                })
            );
        },

        _executeBatch: function(sGroupId){
            var oItem = this.getData(),
                sEntity = oItem.__entity;
            delete oItem.__entity;
            if(!!oItem[STATE_COL]){
                var state = oItem[STATE_COL];
                delete oItem[STATE_COL];
                if(state == "C"){
                    this._oTransactionModel.create(sEntity, oItem, {
                        groupId: sGroupId,
                        success: function(){
                            oItem.__entity = sEntity;
                        }
                    });
                }else if(state == "D"){
                    this._oTransactionModel.remove(sEntity, {
                        groupId: sGroupId,
                        success: function(){
                            oItem.__entity = sEntity;
                        }
                    });
                }
            }else{
                this._oTransactionModel.update(sEntity, oItem,{
                    groupId: sGroupId,
                    success: function(){
                        oItem.__entity = sEntity;
                    }
                });
            }
        }

    });

    return ManagedModel;
});
