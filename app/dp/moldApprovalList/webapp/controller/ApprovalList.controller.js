sap.ui.define([
	"./BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"ext/lib/model/ManagedListModel",
	"ext/lib/formatter/DateFormatter",
	"sap/m/TablePersoController",
	"./ApprovalListPersoService",
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
    'sap/ui/core/Element',
	"sap/ui/core/syncStyleClass"
], function (BaseController, History, JSONModel, ManagedListModel, DateFormatter, TablePersoController, ApprovalListPersoService, Filter, FilterOperator, Fragment, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Token, Input, ComboBox, Item, Element, syncStyleClass) {
	"use strict";
   /**
    * @description 품의 목록 (총 품의 공통)
    * @date 2020.11.19 
    * @author jinseon.lee , daun.lee 
    */
    var toggleButtonId ="";

	return BaseController.extend("dp.moldApprovalList.controller.ApprovalList", {

		dateFormatter: DateFormatter,
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the approvalList controller is instantiated.
		 * @public
		 */
		onInit : function () {
			var oViewModel,
				oResourceBundle = this.getResourceBundle();

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				headerExpanded: true,
				approvalListTableTitle : oResourceBundle.getText("approvalListTableTitle"),
				tableNoDataText : oResourceBundle.getText("tableNoDataText")
			});
			this.setModel(oViewModel, "approvalListView");

			// Add the approvalList page to the flp routing history
			this.addHistoryEntry({
				title: oResourceBundle.getText("approvalListViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#Template-display"
			}, true);
			
			this.setModel(new ManagedListModel(), "list");
			
			this.getRouter().getRoute("approvalList").attachPatternMatched(this._onRoutedThisPage, this);

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
			// update the approvalList's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("approvalListTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("approvalListTableTitle");
			}
			this.getModel("approvalListView").setProperty("/approvalListTableTitle", sTitle);
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
			ApprovalListPersoService.resetPersData();
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
        onDblClick  : function(oEvent) {
            console.log(oEvent);
            window.clicks = window.clicks + 1;
                
            if(window.clicks == 1) {
                setTimeout(sap.ui.controller(this).clearClicks, 500);
            } else if(window.clicks == 2) {
                console.log("더블클릭");
            }
        },

        
        
        /* Affiliate Start */
        /**
         * @private
         * @see 검색을 위한 컨트롤에 대하여 필요 초기화를 진행 합니다. 
         */
		_doInitSearch: function(){
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S";

			this._oMultiInput = this.getView().byId("searchApprovalCategory"+sSurffix);
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

        approvalDialogOpen: function (oEvent) {
            
            var oButton = oEvent.getSource();
            var id = oButton.getId();
            var page ="";
            if(id.indexOf("Model") != -1){
                page = "dp.moldApprovalList.view.DialogModel";
            }else if(id.indexOf("MoldPartNo") != -1){
                page = "dp.moldApprovalList.view.DialogMoldPartNo";
            }else if(id.indexOf("Requester") != -1){
                page = "dp.moldApprovalList.view.DialogRequester";
            }
            //console.log(oButton.getBindingContext("msg").getPath())
            console.log("page >>>", page);
            Fragment.load({
                name: page,
                controller: this
            }).then(function (oDialog) {
                this._oDialog = oDialog;
                this._configDialog(oButton);
                this._oDialog.open();
            }.bind(this));
			
		},

		_configDialog: function (oButton) {
			// Set draggable property
			var bDraggable = oButton.data("draggable");
			this._oDialog.setDraggable(bDraggable == "true");

			// Set resizable property
			var bResizable = oButton.data("resizable");
			this._oDialog.setResizable(bResizable == "true");

			// Multi-select if required
			var bMultiSelect = !!oButton.data("multi");
			this._oDialog.setMultiSelect(bMultiSelect);

			// Remember selections if required
			var bRemember = !!oButton.data("remember");
			this._oDialog.setRememberSelections(bRemember);

			var sResponsivePadding = oButton.data("responsivePadding");
			var sResponsiveStyleClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--subHeader sapUiResponsivePadding--content sapUiResponsivePadding--footer";

			if (sResponsivePadding) {
				this._oDialog.addStyleClass(sResponsiveStyleClasses);
			} else {
				this._oDialog.removeStyleClass(sResponsiveStyleClasses);
			}

			// Set custom text for the confirmation button
			var sCustomConfirmButtonText = oButton.data("confirmButtonText");
			this._oDialog.setConfirmButtonText(sCustomConfirmButtonText);

			this.getView().addDependent(this._oDialog);

			// toggle compact style
			syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
        },

        onHandleApply : function (oEvent) {
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S",
            aTokens = oEvent.getParameter("tokens");
            console.log(oEvent.getParameter());

            this.searchAffiliate = this.getView().byId("searchAffiliate"+sSurffix);
            this.searchAffiliate.setTokens(aTokens);
            this._oValueHelpDialog.close();
        },
		// 	var oButton = oEvent.getSource();
        //     var id = oButton.getId();
        //     var page ="";
        //     if(id.indexOf("Model") != -1){
        //         page = "dp.moldApprovalList.view.DialogModel";
        //     }else if(id.indexOf("MoldPartNo") != -1){
        //         page = "dp.moldApprovalList.view.DialogMoldPartNo";
        //     }else if(id.indexOf("Requester") != -1){
        //         page = "dp.moldApprovalList.view.DialogRequester";
        //     }
        //     //console.log(oButton.getBindingContext("msg").getPath())
        //     console.log("page >>>", page);
        //     Fragment.load({
        //         name: page,
        //         controller: this
        //     }).then(function (oValueHelpDialog) {
        //         this._oValueHelpDialog = oValueHelpDialog;
        //         this.getView().addDependent(this._oValueHelpDialog);
        //         this._configValueHelpDialog();
        //         this._oValueHelpDialog.open();
        //     }.bind(this));
			
		// },

		// _configValueHelpDialog: function () {
		// 	var sInputValue = this.byId("searchModel").getValue(),
		// 		oModel = this.getView().getModel(),
        //         aProducts = oModel.getProperty("/MoldSpec");
                
        //         console.log("oModel >>>", oModel);
        //         console.log("sInputValue >>>", sInputValue);

		// 	aProducts.forEach(function (oProduct) {
		// 		oProduct.selected = (oProduct.Name === sInputValue);
		// 	});
		// 	oModel.setProperty("/MoldSpec", aProducts);
		// },


		handleValueHelpClose: function () {
            console.log(this.getView());
            var oModel = this.getView().getModel(),
				aProducts = oModel.getProperty("msg>message_contents"),
				oInput = this.byId("searchModel");
                console.log(oModel);
                console.log(oModel.getBinding());
                console.log(aProducts);
			var bHasSelected = aProducts.some(function (oProduct) {
				if (oProduct.selected) {
					oInput.setValue(oProduct.Name);
					return true;
				}
			});

			if (!bHasSelected) {
				oInput.setValue(null);
			}
		},

         /**
         * @public
         * @see 사용처 DialogModel, DialogMoldPartNo, DialogRequester Search 이벤트
         */
        handleSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("message_contents", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
        },

        
         /**
         * @public
         * @see 사용처 DialogCreate Fragment Open 이벤트
         */
        onDialogCreate: function (){
            var oView = this.getView();

			if (!this.pDialog) {
				this.pDialog = Fragment.load({
					id: oView.getId(),
					name: "dp.moldApprovalList.view.DialogCreate",
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
            var isPressedId;
            isPressedId =oEvent.getSource().getId();
            toggleButtonId = isPressedId;
            for(var i=0; i<groupId.length; i++){
                if(groupId[i].getId() != isPressedId){
                    groupId[i].setPressed(false);
                }
            }
           
        },

         /**
         * @public
         * @see 사용처 create 팝업에서 select 버튼 press시 Object로 이동
         */ 
        handleConfirm : function(targetControl){
            console.log(toggleButtonId);
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
			this.getModel("approvalListView").setProperty("/headerExpanded", true);
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
				persoService: ApprovalListPersoService,
				hasGrouping: true
			}).activate();
		}

        

	});
});