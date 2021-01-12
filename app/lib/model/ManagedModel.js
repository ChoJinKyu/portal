sap.ui.define([
  "./AbstractModel"
], function (JSONModel) {
  "use strict";

  var STATE_COL = "_state_";

  var ManagedModel = JSONModel.extend("ext.lib.model.ManagedModel", {

    setData: function (oData, sPath, bMerge) {
      var sPath = sPath || this._transactionPath;
      oData = oData || {};
      if (oData.__metadata && oData.__metadata.uri) {
        var sEntity = oData.__metadata.type.substring(oData.__metadata.type.lastIndexOf(".") +1);
        oData.__entity = oData.__metadata.uri.substring(oData.__metadata.uri.indexOf("/"+sEntity));
      } else if (!!sPath) {
        oData.__entity = sPath;
        oData[STATE_COL] = "C";
      }
      JSONModel.prototype.setData.call(this, oData, bMerge);
    },

    isChanged: function () {
      var oData = this.getObject("/");
      return oData[STATE_COL] && oData[STATE_COL] != "C" && oData[STATE_COL] != "D";
    },

    setProperty: function (sPath, oValue, oContext, bAsyncUpdate) {
      var oData = this.getObject("/");
      if (oData[STATE_COL] != "C" && oData[STATE_COL] != "D")
        oData[STATE_COL] = "U";
      return JSONModel.prototype.setProperty.call(this, sPath, oValue, oContext, bAsyncUpdate);
    },

    removeData: function () {
      var oData = this.getObject("/");
      oData[STATE_COL] = "D";
      JSONModel.prototype.setProperty.call(this, "/", oData);
    },

    read: function (sPath, oParameters) {
      var that = this,
        successHandler = oParameters.success;
      this._oTransactionModel.read(sPath, jQuery.extend(oParameters, {
        success: function (oData) {
          that._transactionPath = sPath;
          that.setData(oData, sPath, false);
          if (successHandler)
            successHandler.apply(that._oTransactionModel, arguments);
        }
      })
      );
    },

    readP: function (sPath, oParameters) {
      var that = this;
      return new Promise(function (resolve, reject) {
        that._oTransactionModel.read(sPath, jQuery.extend(oParameters, {
          success: resolve,
          error: reject
        }))
      }).then(function (oData) {
        that._transactionPath = sPath;
        return oData;
      })
    },

    _executeBatch: function (sGroupId) {
      var oItem = this.getData(),
        sEntity = oItem.__entity;
      delete oItem.__entity;
      if (!!oItem[STATE_COL]) {
        var state = oItem[STATE_COL];
        delete oItem[STATE_COL];
        if (state == "C") {
          this._oTransactionModel.create(sEntity, oItem, {
            groupId: sGroupId,
            success: function () {
              oItem.__entity = sEntity;
            }
          });
        } else if (state == "D") {
          this._oTransactionModel.remove(sEntity, {
            groupId: sGroupId,
            success: function () {
              oItem.__entity = sEntity;
            }
          });
        } else if (state == "U") {
          this._oTransactionModel.update(sEntity, oItem, {
            groupId: sGroupId,
            success: function () {
              oItem.__entity = sEntity;
            }
          });
        }
      }
    }

  });

  return ManagedModel;
});
