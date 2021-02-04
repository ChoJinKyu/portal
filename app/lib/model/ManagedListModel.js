sap.ui.define([
    "./AbstractModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (JSONModel, Filter, FilterOperator) {
    "use strict";

    var STATE_COL = "_row_state_";

    var ManagedListModel = JSONModel.extend("ext.lib.model.ManagedListModel", {

        constructor: function (oData, bObserve) {
            this._aRemovedRows = [];
            JSONModel.prototype.constructor.call(this, oData, bObserve);
        },

        setData: function (oData, sPath, bMerge) {
            var aRecords = oData.results || oData || [],
                oResult = {};
            sPath = sPath || this._transactionPath;
            aRecords.forEach(function (oItem) {
                if (oItem.__metadata && oItem.__metadata.uri) {
                    var sType = oItem.__metadata.type,
                        sUrl = oItem.__metadata.uri;
                    sType = sType.substring(0, sType.lastIndexOf("."));
                    oItem.__entity = sUrl.substring(sUrl.indexOf(sType) + sType.length);
                }
            });
            oResult.entityName = sPath.substring(1);
            oResult[oResult.entityName] = aRecords;
            JSONModel.prototype.setData.call(this, oResult, bMerge);
            this._aRemovedRows = [];
        },

        setProperty: function (sPath, oValue, oContext, bAsyncUpdate) {
            if (!!oContext) {
                var _oRecord = this.getObject(oContext.getPath());
                if (typeof _oRecord == "object" && !_oRecord[STATE_COL]) _oRecord[STATE_COL] = "U";
            }
            JSONModel.prototype.setProperty.call(this, sPath, oValue, oContext, bAsyncUpdate);
        },

        addRecord: function (oRecord, sPath, nIndex) {
            var sEntityName = this.getProperty("/entityName") || (sPath && sPath.startsWith("/") ? sPath.substring(1) : sPath),
                aRecords = this.getProperty("/" + sEntityName);
            if (!aRecords) aRecords = [];
            if (typeof sPath == "number") nIndex = sPath;
            if (nIndex == undefined) nIndex = aRecords.length;
            if (!!sPath) oRecord.__entity = sPath;
            oRecord[STATE_COL] = "C";
            aRecords.splice(nIndex || 0, 0, oRecord);
            JSONModel.prototype.setProperty.call(this, "/" + sEntityName, aRecords);
        },

        markRemoved: function (nIndex) {
            var sEntityName = this.getProperty("/entityName"),
                aRecords = this.getProperty("/" + sEntityName);
            var _oRecord = aRecords[nIndex];
            if (_oRecord[STATE_COL] == "C") {
                this.removeRecord(nIndex);
            } else {
                _oRecord[STATE_COL] = "D";
                JSONModel.prototype.setProperty.call(this, "/" + sEntityName + "/" + nIndex, _oRecord);
            }
        },

        removeRecord: function (nIndex) {
            var sEntityName = this.getProperty("/entityName"),
                aRecords = this.getProperty("/" + sEntityName),
                oRemoved = aRecords.splice(nIndex, 1);
            this._addRemoved(oRemoved[0]);
            JSONModel.prototype.setProperty.call(this, "/" + sEntityName, aRecords);
        },

        isChanged: function () {
            return this.getChanges().length > 0;
        },

        getChanges: function () {
            return this._getRecordsByState("C,U,D");
        },

        getModifiedData: function () {
            return this._getRecordsByState("C,U");
        },

        getCreatedRecords: function () {
            return this._getRecordsByState("C");
        },

        getUpdatedRecords: function () {
            return this._getRecordsByState("U");
        },

        getDeletedRecords: function () {
            return this._getRecordsByState("D");
        },

        read: function (sPath, oParameters) {
            oParameters = oParameters || {};
            var fSuccessHandler = oParameters.success,
                fFetchAllSuccess = oParameters.fetchOthersSuccess;
            this._oTransactionModel.read(sPath, jQuery.extend(oParameters, {
                success: function (oData) {
                    this._transactionPath = sPath;
                    this.setData(oData, sPath, false);
                    if (fSuccessHandler)
                        fSuccessHandler.apply(this._oTransactionModel, arguments);
                }.bind(this),
                fetchOthersSuccess: function(aSuccesses){
                    var aData = this.getProperty(sPath);
                    aSuccesses.forEach(function(oSuccess){
                        aData = aData.concat(oSuccess.results);
                    }.bind(this));
                    this.setProperty(sPath, aData);
                    if (fFetchAllSuccess)
                        fFetchAllSuccess.apply(this._oTransactionModel, arguments);
                }.bind(this)
            }));
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
                that.setData(oData, sPath, false);
                return oData;
            })
        },

        _executeBatch: function (sGroupId) {
            var oServiceModel = this._oTransactionModel,
                sTransactionPath = this._transactionPath,
                cs = this.getCreatedRecords(),
                us = this.getUpdatedRecords(),
                ds = this.getDeletedRecords();

            (cs || []).forEach(function (oItem) {
                var sPath = oItem.__entity || sTransactionPath;
                delete oItem[STATE_COL];
                delete oItem.__entity;
                oServiceModel.create(sPath, oItem, {
                    groupId: sGroupId,
                    success: function (oData) {
                        if (oData.__metadata && oData.__metadata.uri) {
                            var sType = oData.__metadata.type,
                                sUrl = oData.__metadata.uri;
                            sType = sType.substring(0, sType.lastIndexOf("."));
                            oItem.__entity = sUrl.substring(sUrl.indexOf(sType) + sType.length);
                        }
                        //oItem.__entity = sPath;
                    }
                });
            });
            (ds || []).forEach(function (oItem) {
                //delete oItem[STATE_COL];
                oServiceModel.remove(oItem.__entity, {
                    groupId: sGroupId,
                    success: function () {
                    }
                });
            });
            (us || []).forEach(function (oItem) {
                var sEntity = oItem.__entity;
                delete oItem[STATE_COL];
                delete oItem.__entity;
                oServiceModel.update(sEntity, oItem, {
                    groupId: sGroupId,
                    success: function () {
                        oItem.__entity = sEntity;
                    }
                });
            });
        },

        _onSuccessSubmitChanges: function () {
            this.commit();
        },

        commit: function () {
            var sEntityName = this.getProperty("/entityName"),
                aRecords = this.getProperty("/" + sEntityName),
                aIndices = [];

            aRecords.forEach(function (oRecord, nIndex) {
                if (oRecord[STATE_COL] == "D") {
                    aIndices.push(nIndex);
                } else {
                    oRecord[STATE_COL] = undefined;
                }
            });
            aIndices.reverse().forEach(function (nIndex) {
                aRecords.splice(nIndex, 1);
            });
            JSONModel.prototype.setProperty.call(this, "/" + sEntityName, aRecords);
        },

        _getRecordsByState: function (sStates) {
            var sEntityName = this.getProperty("/entityName"),
                aRecords = this.getProperty("/" + sEntityName) || [],
                aResults = [];

            if (sStates == "D")
                aResults = this._aRemovedRows;

            aRecords.forEach(function (oRecord) {
                if (sStates.indexOf(oRecord[STATE_COL]) > -1) aResults.push(oRecord);
            });
            return aResults;
        },

        _addRemoved: function (oRecord, nIndex) {
            oRecord[STATE_COL] = "D";
            this._aRemovedRows.push(oRecord);
        }
    });

    return ManagedListModel;
});