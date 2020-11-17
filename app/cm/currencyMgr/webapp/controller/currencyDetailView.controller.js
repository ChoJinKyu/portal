sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "ext/lib/model/ManagedListModel",
    "sap/m/TablePersoController",
    "ext/lib/model/ManagedModel",
    "ext/lib/controller/BaseController",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, Filter, FilterOperator, ManagedModel, ManagedListModel, TablePersoController, MainListPersoService, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("cm.currencyMgr.controller.currencyDetailView", {  
        onInit: function () {
            // debugger;
            // var oViewModel,
            // 	oResourceBundle = this.getResourceBundle();
            
            var component = this.getOwnerComponent();
            
            

			this.oOwnerComponent = this.getOwnerComponent();

			this.oRouter = this.oOwnerComponent.getRouter();
			this.oModel = this.oOwnerComponent.getModel();

			this.oRouter.getRoute("master").attachPatternMatched(this._onProductMatched, this);
            this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
            this.getView().setModel(new ext.lib.model.ManagedModel(), "master");
            this.getView().setModel(new ManagedListModel(), "list");
            
            
        },
        
        _onProductMatched: function (oEvent) {
            var currencyViewPath;
            var currencyCode;
            var oUiModel = this.getView().getModel("Currency");
            var oView = this.getView();
            if (oEvent.getParameter("arguments").currency === "new")
            {
			    var oObjectPage = this.getView().byId("ObjectPageLayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();
                oUiModel.setProperty("/true4", !bCurrentShowFooterState);
                oUiModel.setProperty("/true5", !bCurrentShowFooterState);
                this._resetInputValue();
                this.onEditToggleButtonPress();
                oObjectPage.setShowFooter(!bCurrentShowFooterState);
                var oMasterModel = this.getView().getModel("master");
				oMasterModel.setData({
					tenant_id: "L2100"
                });
                oUiModel.setProperty("/LiveChange", "New"); //네이밍 설정
                oUiModel.setProperty("/newCheck", "New"); 
                this._applySearch();
                
            }else{
                this._currency = oEvent.getParameter("arguments").currency || this._currency || "0";
                currencyViewPath = this._currency.split("CurrencyView").slice(-1).pop();
                currencyViewPath = "Currency" + currencyViewPath;
                this.getView().byId("CurrencyViewObjectPageSection").bindElement({
                    path: "/" + currencyViewPath
                });
                currencyCode = oEvent.getParameter("arguments").currency || this._currency || "0";
                currencyCode = currencyCode.split("code='").slice(-1).pop();
                currencyCode = currencyCode.split("'").slice(0)[0];
                oUiModel.setProperty("/LiveChange", currencyCode);
                this._applySearch();
            }
        },


		onEditToggleButtonPress: function() {
            var oUiModel = this.getView().getModel("Currency"),
			    oObjectPage = this.getView().byId("ObjectPageLayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();
            oUiModel.setProperty("/true4", !bCurrentShowFooterState);
            oUiModel.setProperty("/true6", bCurrentShowFooterState);
            if(this.getView().byId(""))
            {
                oUiModel.setProperty("/true5", !bCurrentShowFooterState);
            }
            
            oObjectPage.setShowFooter(!bCurrentShowFooterState);
        },

		onExit: function () {
			this.oRouter.getRoute("master").detachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").detachPatternMatched(this._onProductMatched, this);
        },

        handleFullScreen: function () {
            var oUiModel = this.getView().getModel("Currency");
            oUiModel.setProperty("/true1", false);
            oUiModel.setProperty("/true2", true);
            var oFCL = this.oView.getParent().getParent();
                oFCL.setLayout("MidColumnFullScreen");
                
			var sNextLayout = "MidColumnFullScreen";//this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.oRouter.navTo("detail", {layout: sNextLayout, currency: this._currency});
		},

		handleExitFullScreen: function () {
            var oFCL = this.oView.getParent().getParent();
                oFCL.setLayout("TwoColumnsMidExpanded");
            var oUiModel = this.getView().getModel("Currency");
                oUiModel.setProperty("/true1", true);
                oUiModel.setProperty("/true2", false);
			var sNextLayout = "exitFullScreen"; 
			this.oRouter.navTo("detail", {layout: sNextLayout, currency: this._currency});
		},

		handleClose: function () {
            var oFCL = this.oView.getParent().getParent();
            oFCL.setLayout("OneColumn");
            var oUiModel = this.getView().getModel("Currency"),
                oObjectPage = this.getView().byId("ObjectPageLayout");
            oUiModel.setProperty("/true1", true);
            oUiModel.setProperty("/true2", false);
            oUiModel.setProperty("/true4", false);
            oUiModel.setProperty("/true5", false);
            oObjectPage.setShowFooter(false);
                
			var sNextLayout = "closeColumn";
			this.oRouter.navTo("master", {layout: sNextLayout});
        },
        
        onFooterCancelButton: function (oEvent) {
            var oUiModel = this.getView().getModel("Currency"),
                oObjectPage = this.getView().byId("ObjectPageLayout");

            oUiModel.setProperty("/true4", false);
            oUiModel.setProperty("/true5", false);
            oUiModel.setProperty("/true6", true);
            oObjectPage.setShowFooter(false);

            if(oUiModel.getProperty("/newCheck"))
            {

                this.handleClose();
                sap.m.MessageToast.show("Close");
                // sap.m.MessageBox.confirm("Are you sure ?", {
                //     title: "Comfirmation",
                //     initialFocus: sap.m.MessageBox.Action.CANCEL,
                //     onClose: function (sButton) {
                //         if (sButton === sap.m.MessageBox.Action.OK) {
                            
                //         };
                //     }
                // });
                
            }

            
        },

        _doInitTablePerso: function(){
			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.byId("CurrencyLngTable"),
				componentName: "currencyMgr",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
        },
        onLiveChange: function(oEvent) {
            var sNewValue = oEvent.getParameter("value");
            var oUiModel = this.getView().getModel("Currency");
            // this.byId("getValue").setText(sNewValue);
            oUiModel.setProperty("/LiveChange", sNewValue);
        },

        onLngAddRow: function(){
            var oUiModel = this.getView().getModel("Currency");
			var oTable = this.byId("CurrencyLngTable"),
                oModel = this.getView().getModel("list"),
                currencyCode;
                //currencyCode = this.getView().byId("ipCurCode").mProperties.value;
                currencyCode = oUiModel.getProperty("/LiveChange");
			    oModel.addRecord({
				"tenant_id": "L2100",
                "language_code": "",
                "currency_code" : currencyCode,
				"currency_code_name": "",
				"currency_code_desc": "",
				"currency_prefix": "",
				"currency_suffix": "",
				"local_create_dtm": new Date(),
				"local_update_dtm": new Date()
			}, 0);
        },
        onLngSave: function () {

            // this.oOwnerComponent = this.getOwnerComponent();
			// this.oRouter = this.oOwnerComponent.getRouter();
            //var [tId, mName] = arguments;
            var view = this.getView();
            var model = view.getModel("list");
            // Validation
            if (model.getChanges() <= 0) {
                sap.m.MessageBox.alert("변경사항이 없습니다.");
                reutn;
            }
            sap.m.MessageBox.confirm("Are you sure ?", {
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === sap.m.MessageBox.Action.OK) {
                        view.setBusy(true);
                        model.submitChanges({
                            success: function (oEvent) {
                                view.setBusy(false);
                                sap.m.MessageToast.show("Success to save.");
                            }
                        });
                    };
                }
            });
            this.oRouter.getRoute("master").attachPatternMatched(this._onProductMatched, this);
            
        },

        onLngDeleteRow: function(){
			var oTable = this.byId("CurrencyLngTable"),
				oModel = this.getView().getModel("list"),
				aItems = oTable.getSelectedItems(),
				aIndices = [];
			aItems.forEach(function(oItem){
				aIndices.push(oModel.getData().indexOf(oItem.getBindingContext("list").getObject()));
			});
			aIndices = aIndices.sort(function(a, b){return b-a;});
			aIndices.forEach(function(nIndex){
				//oModel.removeRecord(nIndex);
				oModel.markRemoved(nIndex);
			});
            oTable.removeSelections(true);
            this.oRouter.navTo("master", {refresh: "refresh"});
		},

        _applySearch: function() {
            var oUiModel = this.getView().getModel("Currency");
            var currencyCode;
            currencyCode = oUiModel.getProperty("/LiveChange");
            var predicates = [];
            predicates.push(new Filter("currency_code", FilterOperator.EQ, currencyCode));
			var oView = this.getView(),
				oModel = this.getView().getModel("list");
                oView.setBusy(true);
                oModel.setTransactionModel(this.getView().getModel());
                oModel.read("/CurrencyLng", {
				filters: predicates,
				success: function(oData){
					oView.setBusy(false);
                    }
                });
        },
        

  
        _getSearchStates: function(){
            var aTableSearchState = [];
            
            aTableSearchState.push(new Filter("tenant_id", FilterOperator.EQ, "L2100"));
			return aTableSearchState;
        },
        onPageSearchButtonPress : function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var aTableSearchState = this._getSearchStates();
				this._applySearch(aTableSearchState);
			}
        },

        _resetInputValue: function() {
            var oView = this.getView();
            oView.byId("ipCurCode").setValue("");
            oView.byId("ipScale").setValue("");
            oView.byId("ipExScale").setValue("");
            oView.byId("strtDate").setValue("");
            oView.byId("endDate").setValue("");
            oView.byId("ipUseFlag").setValue("");
        },
	});
});