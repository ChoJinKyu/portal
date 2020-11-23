sap.ui.define([
	"./BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"ext/lib/model/ManagedListModel",
	"ext/lib/formatter/DateFormatter",
	"sap/m/TablePersoController",
	"./MainListPersoService",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/Fragment',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Token",
	"sap/m/Input",
	"sap/m/ComboBox",
    "sap/ui/core/Item",
    'sap/ui/core/Element'
], function (BaseController, History, JSONModel, ManagedListModel, DateFormatter, TablePersoController, MainListPersoService, Filter, FilterOperator, Fragment, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Token, Input, ComboBox, Item, Element) {
	"use strict";
   /**
    * @description 품의 목록 (총 품의 공통)
    * @date 2020.11.19 
    * @author jinseon.lee , daun.lee 
    */
    var dialogCategori;
	return BaseController.extend("dp.moldApprovalList.controller.MainList", {

		dateFormatter: DateFormatter,
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
		onInit : function () {
			var oViewModel,
				oResourceBundle = this.getResourceBundle();

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				headerExpanded: true,
				mainListTableTitle : oResourceBundle.getText("mainListTableTitle"),
				tableNoDataText : oResourceBundle.getText("tableNoDataText")
			});
			this.setModel(oViewModel, "mainListView");

			// Add the mainList page to the flp routing history
			this.addHistoryEntry({
				title: oResourceBundle.getText("mainListViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#Template-display"
			}, true);
			
			this.setModel(new ManagedListModel(), "list");
			
			this.getRouter().getRoute("mainList").attachPatternMatched(this._onRoutedThisPage, this);

            this._doInitTablePerso();
            //this._doInitSearch();
        },
        
        onAfterRendering : function () {
			this.byId("pageSearchButton").firePress();
			return;
        },

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onMainTableUpdateFinished : function (oEvent) {
			// update the mainList's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("mainListTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("mainListTableTitle");
			}
			this.getModel("mainListView").setProperty("/mainListTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTablePersoButtonPressed: function(oEvent){
			this._oTPC.openDialog();
		},

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTablePersoRefresh : function() {
			MainListPersoService.resetPersData();
			this._oTPC.refresh();
		},

		/**
		 * Event handler when a table add button pressed
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		onMainTableAddButtonPress: function(){
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
			this.getRouter().navTo("midPage", {
				layout: oNextUIState.layout, 
				tenantId: "new",
				controlOptionCode: "code"
			});
		},

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
		onPageSearchButtonPress : function (oEvent) {
            //console.log(oEvent.getParameters());
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var aSearchFilters = this._getSearchStates();
				this._applySearch(aSearchFilters);
			}
		},

		/**
		 * Event handler when pressed the item of table 
         * @description 목록 클릭시 이벤트 
		 * @param {sap.ui.base.Event} oEvent 
		 * @public
		 */
		onMainTableItemPress: function(oEvent) {

            var sPath = oEvent.getSource().getBindingContext("list").getPath(),
                oRecord = this.getModel("list").getProperty(sPath);
            console.log("oRecord >>>  ", oRecord);
            var that = this;
            that.getRouter().navTo("pssaObject", {
                moldId: oRecord.mold_id          
            });
            // if (oRecord.mold_id % 3 == 0) {
            //     that.getRouter().navTo("pssaCreateObject", {
            //         company: "[LGEKR] LG Electronics Inc."
            //         , plant: "[DFZ] Washing Machine"
            //     });
            // } else if (oRecord.mold_id % 3 == 2) {
                
            // } else {
            //     that.getRouter().navTo("pssaCreateObject", {
            //         company: "[LGEKR] LG Electronics Inc."
            //         , plant: "[DFZ] Washing Machine"
            //     });
            // }

		},

        /* Affiliate Start */
        /**
         * @private
         * @see 검색을 위한 컨트롤에 대하여 필요 초기화를 진행 합니다. 
         */
		_doInitSearch: function(){
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S";

			this._oMultiInput = this.getView().byId("searchCompany"+sSurffix);
            this._oMultiInput.setTokens(this._getDefaultTokens());

            this.oColModel = new JSONModel(sap.ui.require.toUrl("dp/moldApprovalList/localService/mockdata") + "/columnsModel.json");
            this.oAffiliateModel = new JSONModel(sap.ui.require.toUrl("dp/moldApprovalList/localService/mockdata") + "/affiliate.json");
            this.setModel("affiliateModel", this.oAffiliateModel);

            // /** Receipt Date */
            // var today = new Date();
            
            // this.getView().byId("searchReceiptDate"+sSurffix).setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()-90));
            // this.getView().byId("searchReceiptDate"+sSurffix).setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
        },
        /**
         * @private 
         * @see searchAffiliate setTokens
         */
        _getDefaultTokens: function () {
            
            var oToken = new Token({
                key: "EKHQ",
                text: "[LGEKR] LG Electronics Inc."
            });

            return [oToken];
        },

        /**
         * @public 
         * @see searchAffiliate Fragment View 컨트롤 valueHelp
         */
        onValueHelpRequestedAffiliate : function () {
            console.group("onValueHelpRequestedAffiliate");

            var aCols = this.oColModel.getData().cols;

            this._oValueHelpDialog = sap.ui.xmlfragment("dp.moldApprovalList.view.ValueHelpDialogAffiliate", this);
            this.getView().addDependent(this._oValueHelpDialog);

            this._oValueHelpDialog.getTableAsync().then(function (oTable) {
                oTable.setModel(this.oAffiliateModel);
                oTable.setModel(this.oColModel, "columns");

                if (oTable.bindRows) {
                    oTable.bindAggregation("rows", "/AffiliateCollection");
                }

                if (oTable.bindItems) {
                    oTable.bindAggregation("items", "/AffiliateCollection", function () {
                        return new ColumnListItem({
                            cells: aCols.map(function (column) {
                                return new Label({ text: "{" + column.template + "}" });
                            })
                        });
                    });
                }
                this._oValueHelpDialog.update();
            }.bind(this));

            this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
            this._oValueHelpDialog.open();
                console.groupEnd();
        },

        /**
         * @public 
         * @see 사용처 ValueHelpDialogAffiliate Fragment 선택후 확인 이벤트
         */
        onValueHelpOkPress : function (oEvent) {
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S",
                aTokens = oEvent.getParameter("tokens");

            this.searchAffiliate = this.getView().byId("searchCompany"+sSurffix);
            this.searchAffiliate.setTokens(aTokens);
            this._oValueHelpDialog.close();
        },

        /**
         * @public 
         * @see 사용처 ValueHelpDialogAffiliate Fragment 취소 이벤트
         */
        onValueHelpCancelPress: function () {
            this._oValueHelpDialog.close();
        },

        /**
         * @public
         * @see 사용처 ValueHelpDialogAffiliate Fragment window.close after 이벤트
         */
        onValueHelpAfterClose: function () {
            this._oValueHelpDialog.destroy();
        },
        
         /**
         * @public
         * @see 사용처 ValueHelpDialogAffiliate Fragment window.close after 이벤트
         */
        onValueHelpRequestedCreate: function (){
            var oView = this.getView();

			if (!this.pDialog) {
				this.pDialog = Fragment.load({
					id: oView.getId(),
					name: "dp.moldApprovalList.view.dialogApprovalCategory",
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					return oDialog;
				});
			} 
			this.pDialog.then(function(oDialog) {
				oDialog.open();
			});
		
        },
        
        
         /**
         * @public
         * @see 사용처 create 팝업에서 나머지 버튼 비활성화 시키는 작업수행
         */ 
        onToggleHandleChange : function(oEvent){
            var groupId = this.getView().getControlsByFieldGroupId("toggleButtons");
            var isPressed;
            var isPressedId;
            isPressedId =oEvent.getSource().getId();
            for(var i=0; i<groupId.length; i++){
                if(groupId[i].getId() != isPressedId){
                    groupId[i].setPressed(false);
                }
            }
           
        },

        handleConfirm : function(targetControl){
            var groupId = this.getView().getControlsByFieldGroupId("toggleButtons");
            for(var i=0; i<groupId.length; i++){
                if(groupId[i].getPressed() == true){
                    console.log(groupId[i].mProperties.text);
                    console.log(this.byId("searchCompanyF").getValue());
                    console.log(this.byId("searchPlantF").getValue());
                    this.getRouter().navTo("pssaCreateObject", {
                        company: this.byId("searchCompanyF").getValue()
                        , plant: this.byId("searchPlantF").getValue()
                        , 
                    });
                }    
            }
        },

        createPopupClose: function (oEvent){
            this.byId("dialogApprovalCategory").close();
        },

        /* Affiliate End */

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onRoutedThisPage: function(){
			this.getModel("mainListView").setProperty("/headerExpanded", true);
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */
		_applySearch: function(aSearchFilters) {
			var oView = this.getView(),
				oModel = this.getModel("list");
			oView.setBusy(true);
			oModel.setTransactionModel(this.getModel());
			oModel.read("/MoldSpec", {
				filters: aSearchFilters,
				success: function(oData){
					oView.setBusy(false);
				}
			});
		},
		
		_getSearchStates: function(){
			// var sChain = this.getView().byId("searchChain").getSelectedKey(),
			// 	sKeyword = this.getView().byId("searchKeyword").getValue(),
			// 	sUsage = this.getView().byId("searchUsageSegmentButton").getSelectedKey();
			
			var aSearchFilters = [];
			// if (sChain && sChain.length > 0) {
			// 	aSearchFilters.push(new Filter("chain_code", FilterOperator.EQ, sChain));
			// }
			// if (sKeyword && sKeyword.length > 0) {
			// 	aSearchFilters.push(new Filter({
			// 		filters: [
			// 			new Filter("control_option_code", FilterOperator.Contains, sKeyword),
			// 			new Filter("control_option_name", FilterOperator.Contains, sKeyword)
			// 		],
			// 		and: false
			// 	}));
			// }
			// if(sUsage != "all"){
			// 	switch (sUsage) {
			// 		case "site":
			// 		aSearchFilters.push(new Filter("site_flag", FilterOperator.EQ, "true"));
			// 		break;
			// 		case "company":
			// 		aSearchFilters.push(new Filter("company_flag", FilterOperator.EQ, "true"));
			// 		break;
			// 		case "org":
			// 		aSearchFilters.push(new Filter("organization_flag", FilterOperator.EQ, "true"));
			// 		break;
			// 		case "user":
			// 		aSearchFilters.push(new Filter("user_flag", FilterOperator.EQ, "true"));
			// 		break;
			// 	}
			// }
			return aSearchFilters;
		},
		
		_doInitTablePerso: function(){
			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.byId("mainTable"),
				componentName: "moldApprovalList",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
		}

        

	});
});