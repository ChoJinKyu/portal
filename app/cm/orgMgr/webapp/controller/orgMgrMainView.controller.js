sap.ui.define([
        "ext/lib/controller/BaseController",
        "ext/lib/util/Multilingual",
        "ext/lib/model/TransactionManager",
        "ext/lib/model/ManagedListModel",
        "ext/lib/formatter/Formatter",
        "sap/base/Log",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/ui/core/format/DateFormat",        
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/FilterType",
        "sap/ui/model/Sorter",
        "sap/ui/model/json/JSONModel",
        "sap/ui/thirdparty/jquery",
        "sap/m/Token",
    ],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */

    function (BaseController, Multilingual, TransactionManager, ManagedListModel, formatter, Log, MessageBox, MessageToast, DateFormat, Filter, 
        FilterOperator, FilterType, Sorter, JSONModel, jquery, Token) {
        "use strict";
        var _aValidTabKeys = ["Tenant", "Company", "Purchasing", "Plant", "Unit", "Division"];
        

		return BaseController.extend("cm.orgMgr.controller.orgMgrMainView", {
            formatter: formatter,
			onInit: function () {

                var oMultilingual = new Multilingual();
			    this.setModel(oMultilingual.getModel(), "I18N");
                var oRouter = this.getRouter();
                this.getView().setModel(new JSONModel(), "view");
                this.setModel(new ManagedListModel(), "list");

                oMultilingual.attachEvent("ready", function(oEvent){
				var oi18nModel = oEvent.getParameter("model");
				this.addHistoryEntry({
					title: oi18nModel.getText("/MESSAGE_MANAGEMENT"),
					icon: "sap-icon://table-view",
					intent: "#Template-display"
                    }, true);
                }.bind(this));

                //this._doInitTablePerso();
                
                //oRouter.getRoute("TargetorgMgrMainView").attachMatched(this._onRouteMatched, this);

                // this.tabModel();
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

                // oMessageModelBinding.attachChange(this.onMessageBindingChange, this);
                // this._bTechnicalErrors = false;
                
            },
            _onRouteMatched: function (oEvent) {
                var oArgs, oView, oQuery;
                oArgs = oEvent.getParameter("arguments");
                oView = this.getView();
            
                oQuery = oArgs["?query"];
                if (oQuery && _aValidTabKeys.indexOf(oQuery.tab) > -1){
                    oView.getModel("view").setProperty("/selectedTabKey", oQuery.tab);
                } else {
                    this.getRouter().navTo("TargetorgMgrMainView", {
                        //tabkeyId: oArgs.tabkeyId,
                        "?query": {
                            tab: _aValidTabKeys[0]
                        }
                    }, true /*no history*/);
                }
            },

            
            onSelectedKey: function (oEvent){
                var oCtx = this.getView().getBindingContext();
                this.getRouter().navTo("TargetorgMgrMainView", {
                    //tabkeyId: oCtx.getProperty("tabkeyId"),
                    "?query": {
                        tab: oEvent.getParameter("selectedKey")
                    }
                }, true /*without history*/);
            },

            onMainTableAddButtonPress: function (oEvent) {
                var vSelectKey = this.getView().oParent.mProperties.key + "Table",
                    utcDate = this._getUtcSapDate();

                switch(vSelectKey){
                    case "TenantTable":
                        console.group("TenantTab");
                        var oList = this.byId(vSelectKey),
                        oBinding = oList.getBinding("items"),
                        oContext = oBinding.create({
                            "tenant_id"                 : "",
                            "tenant_name"               : "",
                            "use_flag"                  : false,
                            "local_create_dtm"          : utcDate,
                            "local_update_dtm"          : utcDate
                        }); 
                        console.groupEnd();
                        return 0;

                    case "CompanyTable": 
                        console.group("Company");
                        var oList = this.byId(vSelectKey),
                        oBinding = oList.getBinding("items"),
                        oContext = oBinding.create({
                            "tenant_id"                 : "",
                            "company_code"              : "",
                            "company_name"              : "",
                            "use_flag"                  : false,
                            "erp_type_code"             : "",
                            "currency_code"             : "",
                            "country_code"              : "",
                            "language_code"             : "",
                            "affiliate_code"            : "",
                            "local_create_dtm"          : utcDate,
                            "local_update_dtm"          : utcDate
                        }); 
                        console.groupEnd();
                        return 0;

                    case "PurchasingTable": 
                        console.group("Purchasing");
                        var oList = this.byId(vSelectKey),
                        oBinding = oList.getBinding("items"),
                        oContext = oBinding.create({
                            "tenant_id"                 : "",
                            "purchase_org_code"         : "",
                            "purchase_org_name"         : "",
                            "use_flag"                  : false,
                            "local_create_dtm"          : utcDate,
                            "local_update_dtm"          : utcDate
                        }); 
                        console.groupEnd();
                        return 0;

                    case "PlantTable":
                        console.group("Plant"); 
                        var oList = this.byId(vSelectKey),
                        oBinding = oList.getBinding("items"),
                        oContext = oBinding.create({
                            "tenant_id"                 : "",
                            "company_code"              : "",
                            "plant_code"                : "",
                            "plant_name"                : "",
                            "use_flag"                  : false,
                            "purchase_org_code"         : "",
                            "bizdivision_code"          : "",
                            "au_code"                   : "",
                            "hq_au_code"                : "",
                            "local_create_dtm"          : utcDate,
                            "local_update_dtm"          : utcDate
                        }); 
                        console.groupEnd();
                        return 0;

                    case "UnitTable": 
                        console.group("Unit");
                        var oList = this.byId(vSelectKey),
                        oBinding = oList.getBinding("items"),
                        oContext = oBinding.create({
                            "tenant_id"                 : "",
                            "bizunit_code"              : "",
                            "bizunit_name"              : "",
                            "use_flag"                  : false,
                            "local_create_dtm"          : utcDate,
                            "local_update_dtm"          : utcDate
                        }); 
                        console.groupEnd();
                        return 0;

                    case "DivisionTable":
                        console.group("Division");
                        var oList = this.byId(vSelectKey),
                        oBinding = oList.getBinding("items"),
                        oContext = oBinding.create({
                            "tenant_id"                 : "",
                            "bizdivision_code"          : "",
                            "bizdivision_name"          : "",
                            "bizunit_code"              : "",
                            "use_flag"                  : false,
                            "local_create_dtm"          : utcDate,
                            "local_update_dtm"          : utcDate
                        }); 
                        console.groupEnd();
                        return 0;
                }

                

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
            onCreate : function() {
                

            },

            // onSelectedKey : function(oEvent) {
                // debugger;
                // var vGroupCheck = "Org_" + this.getView().oParent.mProperties.key + "Group";
                // var vSelectKey = this.getView().oParent.mProperties.key + "Table";
                // var oBinding = this.byId(vSelectKey).getBinding("items");
                
                // if(vGroupCheck){

                //     MessageBox.confirm("업로드가 안된 값을 지우시고 이동하시 겠습니까?", {
                //     title : "!!",
                //     initialFocus : sap.m.MessageBox.Action.CANCEL,
                //     onClose : function(sButton) {
                //         if (sButton === MessageBox.Action.OK) {
                //             oBinding.resetChanges();
                //         } else if (sButton === MessageBox.Action.CANCEL) {
                            
                //             };
                //         }
                //     });
                    
                // }

                
                
            // },

            tabModel : function() {
                console.group("tabModel");

                var oView = this.getView();
                var otabModel = new JSONModel({ 
                            tabSelectKey : "",
                            string:"22",
                            string2:"33",
                            String5:true,
                });

                this.setModel(otabModel, "tab1");
                console.groupEnd();
            },
            
            onSave : function () {             
                var vSelectKey = "Org_" + this.getView().oParent.mProperties.key + "Group";
                var oView = this.getView();

                var fnSuccess = function () {
                    this._setBusy(false);
                    MessageToast.show("저장 업데이트 완료");
                    this._setUIChanges(false);
                }.bind(this);

                var fnError = function (oError) {
                    this._setBusy(false);
                    this._setUIChanges(false);
                    MessageBox.error(oError.message);
                }.bind(this);
                 
                this._setBusy(true); // Lock UI until submitBatch is resolved.
                MessageBox.confirm("저장 하시 겠습니까?", {
                    title : "저장",
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            oView.getModel().submitBatch(vSelectKey).then(fnSuccess, fnError);
                        } else if (sButton === MessageBox.Action.CANCEL) {
                            
                        };
                    }
                });
                // this.getView().getModel().submitBatch(vSelectKey).then(fnSuccess, fnError);
                this._bTechnicalErrors = false; // If there were technical errors, a new save resets them.
            
            },
            _setBusy : function (bIsBusy) {
                var oModel = this.getView().getModel("timeModel");
                oModel.setProperty("/busy", bIsBusy);
            },

            onRefresh : function () {
                console.group("Refresh");
                var vSelectKey = this.getView().oParent.mProperties.key + "Table";
                var oBinding = this.byId(vSelectKey).getBinding("items");
                this.getView().setBusy(true);
                oBinding.resetChanges();
                oBinding.refresh();
                this.getView().setBusy(false);
                console.groupEnd();
            },
            _getText : function (sTextId, aArgs) {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sTextId, aArgs);
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
            onDeleteRow : function () {
                var vSelectKey = this.getView().oParent.mProperties.key + "Table";
                var oSelected  = this.byId(vSelectKey).getSelectedContexts();
                var oBinding = this.byId(vSelectKey).getBinding("items");
                var oView = this.getView();
                oView.setBusy(true);
                if (oSelected.length > 0) {
                    MessageBox.confirm("삭제 합니다??", {
                    title : "Comfirmation",
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            for(var idx = 0; idx < oSelected.length; idx++){
                            oSelected[idx].delete("$auto").then(function () {
                                oView.setBusy(false);
                                MessageToast.show("삭제 되었습니다.");
                            }.bind(this), function (oError) {
                                oView.setBusy(false);
                                MessageBox.error(oError.message);
                                });
                            }
                        } else if (sButton === MessageBox.Action.CANCEL) {
                            
                        };
                    }
                });

                }else{
                    MessageBox.error("선택된 행이 없습니다.");
                    oView.setBusy(false);
                }
            }
            
		});
	});
