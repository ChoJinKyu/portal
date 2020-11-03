sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/FilterType",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/ui/core/format/DateFormat"
	],
	function (Controller, Fragment, JSONModel, Filter, FilterOperator, FilterType, MessageToast, MessageBox, DateFormat) {
		"use strict";

		return Controller.extend("cm.timeZoneMgr.controller.timeZoneMgr", {
			onInit: function () {
                var oModel = new JSONModel({
                    timeZoneCountryInput : ""

                });
                //this.getView().setModel(oModel , "timemodel");

                var oMessageManager = sap.ui.getCore().getMessageManager(),
				oMessageModel = oMessageManager.getMessageModel(),
				oMessageModelBinding = oMessageModel.bindList("/", undefined, [],
					new Filter("technical", FilterOperator.EQ, true)),
				oViewModel = new JSONModel({
                        selectedrows : [],
                        timeZoneCountryInput : "",
                        busy : false,
                        hasUIChanges : false,
                        usernameEmpty : true,
                        order : 0
                    });
                this.getView().setModel(oViewModel, "timeModel");
                this.getView().setModel(oMessageModel, "message");

                oMessageModelBinding.attachChange(this.onMessageBindingChange, this);
                this._bTechnicalErrors = false;
            },
         

            _setUIChanges : function (bHasUIChanges) {
                if (this._bTechnicalErrors) {
                    // If there is currently a technical error, then force 'true'.
                    bHasUIChanges = true;
                } else if (bHasUIChanges === undefined) {
                    bHasUIChanges = this.getView().getModel().hasPendingChanges();
                }
                var oModel = this.getView().getModel("timeModel");
                oModel.setProperty("/hasUIChanges", bHasUIChanges);
            },

            handleValueHelp: function () {
                var sInputValue = this.byId("timeZoneCountryInput").getValue();
                if (!this._oValueHelpDialog) {
                    Fragment.load({
                        name: "cm.timeZoneMgr.view.CountryValueHelpDialog",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        this._oValueHelpDialog = oValueHelpDialog;
                        this.getView().addDependent(this._oValueHelpDialog);
                        this._oValueHelpDialog.getBinding("items")
                        .filter([new Filter("country_code", FilterOperator.Contains, sInputValue)]);
                        this._oValueHelpDialog.open(sInputValue);
                    }.bind(this));
                } else {
                    this._configValueHelpDialog();
                    this._oValueHelpDialog.getBinding("items")
                    .filter([new Filter("country_code", FilterOperator.Contains, sInputValue)]);
                    this._oValueHelpDialog.open(sInputValue);
                    
                }
            },

            _configValueHelpDialog: function () {
                var sInputValue = this.byId("timeZoneCountryInput").getValue(),
                    oModel = this.getView().getModel("timeModel"),
                    aCountry = oModel.setProperty("/timeZoneCountryInput", sInputValue);
                    oModel.setProperty("timeZoneCountryInput", sInputValue);
            },

            handleSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("country_code", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            },

            handleValueHelpClose: function (oEvent) {
                var vInput = oEvent.getParameters().selectedItem;
                if (!vInput) {
                    return;
                }
                var vInputData = vInput.getCells()[0].mProperties.text;
                this.byId("timeZoneCountryInput").setValue(vInputData);
            },

            onhandleValueHelpClose: function (oEvent) {
                var sDescription,
                    oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
                if (!oSelectedItem) {
                    return;
                }
                sDescription = oSelectedItem.getDescription();
                this.byId("timeZoneCountryInput").setSelectedKey(sDescription);

            },

            onCreate : function () {
          
            var oList = this.byId("table"), 
                oBinding = oList.getBinding("rows"),
                utcDate = this._getUtcSapDate(),
				oContext = oBinding.create({
					"tenant_id"                 : "L2100",
					"timezone_code"             : "",
					"timezone_name"             : "",
                    "country_code"              : "",
                    "gmt_offset"                : null,
					"dst_flag"                  : false, 
					"dst_start_month"           : null,
                    "dst_start_day"             : null,
                    "dst_start_week"            : null,
					"dst_start_day_of_week"     : null,
					"dst_start_time_rate"       : null,
                    "dst_end_month"             : null,
                    "dst_end_day"               : null,
					"dst_end_week"              : null,
					"dst_end_day_of_week"       : null,
                    "dst_end_time_rate"         : null,
                    "local_create_dtm"          : utcDate,
                    "local_update_dtm"          : utcDate
                }); 
                
                  oContext.created().then(function () {
                    oBinding.refresh();                    
                });     

                this.getView().getModel("timeModel").setProperty("/usernameEmpty", true);

                oList.getRows().some(function (oItem) {
                    if (oItem.getBindingContext() === oContext) {
                        oItem.focus();
                        oItem.setSelected(true);
                        return true;
                    }
                });
            },
            onSave : function () {
                var fnSuccess = function () {
                    this._setBusy(false);
                    MessageToast.show(this._getText("changesSentMessage"));
                    this._setUIChanges(false);
                }.bind(this);

                var fnError = function (oError) {
                    this._setBusy(false);
                    this._setUIChanges(false);
                    MessageBox.error(oError.message);
                }.bind(this);

                this._setBusy(true); // Lock UI until submitBatch is resolved.
                this.getView().getModel().submitBatch("updateGroupTimeZone").then(fnSuccess, fnError);
                this._bTechnicalErrors = false; // If there were technical errors, a new save resets them.
            },
            _setBusy : function (bIsBusy) {
                var oModel = this.getView().getModel("timeModel");
                oModel.setProperty("/busy", bIsBusy);
            },

            onMessageBindingChange : function (oEvent) {
                var aContexts = oEvent.getSource().getContexts(),
                    aMessages,
                    bMessageOpen = false;

                if (bMessageOpen || !aContexts.length) {
                    return;
                }

                // Extract and remove the technical messages
                aMessages = aContexts.map(function (oContext) {
                    return oContext.getObject();
                });
                sap.ui.getCore().getMessageManager().removeMessages(aMessages);

                this._setUIChanges(true);
                this._bTechnicalErrors = true;
                MessageBox.error(aMessages[0].message, {
                    id : "serviceErrorMessageBox",
                    onClose : function () {
                        bMessageOpen = false;
                    }
                });

                bMessageOpen = true;
            },
            onResetChanges : function () {
                this.byId("table").getBinding("rows").resetChanges();
                this._bTechnicalErrors = false; 
                this._setUIChanges();
            },

            onInputChange : function (oEvt) {
                if (oEvt.getParameter("escPressed")) {
                    this._setUIChanges();
                } else {
                    this._setUIChanges(true);
                    if (oEvt.getSource().getParent().getBindingContext().getProperty("UserName")) {
                        this.getView().getModel("timeModel").setProperty("/usernameEmpty", false);
                    }
                }
            },

            onSearch : function () {
                var oView = this.getView(),
                    sValue1 = oView.byId("time_zone_code").getValue(),
                    sValue2 = oView.byId("time_zone").getValue(),
                    sValue3 = oView.byId("timeZoneCountryInput").getValue(),
                    oFilter = new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                    oFilter1 = new Filter("timezone_code", FilterOperator.Contains, sValue1),
                    oFilter2 = new Filter("timezone_name", FilterOperator.Contains, sValue2),
                    oFilter3 = new Filter("country_code", FilterOperator.Contains, sValue3);

                oView.byId("table").getBinding("rows").resetChanges();
                oView.byId("table").getBinding("rows").filter([oFilter,oFilter1,oFilter2,oFilter3]);
            },
            _getUtcSapDate : function(){
                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "yyyy-MM-dd'T'HH:mm"
                });
                
                var oNow = new Date();
                var utcDate = oDateFormat.format(oNow)+":00Z"; 
                console.log("utcDate",utcDate);
                return utcDate;
            },
            _getText : function (sTextId, aArgs) {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sTextId, aArgs);
            },
            onCopyRow : function (oEvent) {
                console.group("onCopyRow");
                debugger;
                var oTable = this.byId("table"),
                    oBinding = oTable.getBinding("rows"),                    
                    rows = oTable.getRows(), 
                    indices = oTable.getSelectedIndices(),                    
                    utcDate = this._getUtcSapDate();    

                console.log("indices", indices);
        
                // if (this.byId("subList").getBinding("rows").hasPendingChanges()) {
                //     this._showMsgStrip("e", this.errorUIChangeCopyRow);
                //     return;
                // }

                // debugger;

                // if(indices.length>1){
                //     MessageBox.show(this.errorCheckChangeCopyRow, {
                //         icon: MessageBox.Icon.ERROR,
                //         title: this.errorCheckChangeCopyRowTitle,
                //         actions: [MessageBox.Action.OK],
                //         styleClass: "sapUiSizeCompact"
                //     });
                //     return;
                // }
                var data = [];
                console.log[indices.length-1];
                for (var i = 0 ; i <= indices.length-1; i++ ){
                    var index = indices[i];
                    console.log[rows[index].getCells().length-1];
                    for(var j = 0 ; j <= rows[index].getCells().length-1; j++){
                        
                        data[j] = rows[index].getCells()[j].mProperties;
                        if(data[j].value === "" ){
                            data[j].value = null;
                        }
                    }
                    var oContext = oBinding.create({
                        "tenant_id"               : data[0].text,
                        "timezone_code"           : "",
                        "timezone_name"           : data[2].value,
                        "country_code"            : data[3].value,
                        "gmt_offset"              : data[4].value,
                        "dst_flag"                : data[5].selected,
                        "dst_start_month"         : data[6].value,
                        "dst_start_day"           : data[7].value,
                        "dst_start_week"          : data[8].value,
                        "dst_start_day_of_week"   : data[9].value,
                        "dst_start_time_rate"     : data[10].value,
                        "dst_end_month"           : data[11].value,
                        "dst_end_day"             : data[12].value,
                        "dst_end_week"            : data[13].value,
                        "dst_end_day_of_week"     : data[14].value,
                        "dst_end_time_rate"       : data[15].value,
                        "local_create_dtm"        : utcDate,
                        "local_update_dtm"        : utcDate
                    });
                }
                
                var timeModel = this.getView().getModel("timeModel");
                
                
                oTable.clearSelection();

                this.getView().setBusy(true);

                oContext.created().then(function () {
                    oBinding.refresh();
                });

                this.getView().getModel("timeModel").setProperty("/usernameEmpty", true);

                //focus 이동
                oTable.getRows().some(function (oRows) {
                    if (oRows.getBindingContext() === oContext) {
                        oRows.focus();
                        oRows.setSelected(true);
                        return true;
                    }
                });

                this.getView().setBusy(false);

                console.groupEnd();
            },
            onCheck : function(){ 
            },
            onCellClick : function(){
            },
            onDelete : function () {
                debugger;
                var oSelected  = this.byId("table").getSelectedContexts();

                if (oSelected.length > 0) {

                    for(var idx = 0; idx < oSelected.length; idx++){

                        var oView = this.getView();
                        oView.setBusy(true);

                        oSelected[idx].delete("$auto").then(function () {
                            oView.setBusy(false);
                            MessageToast.show("삭제 되었습니다.");
                            this.onLngRefresh();
                        }.bind(this), function (oError) {
                            oView.setBusy(false);
                            MessageBox.error(oError.message);
                        });

                    }
                }else{
                    MessageBox.error("선택된 행이 없습니다.");
                }
            }
		}); 
	});
