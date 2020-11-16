sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"../model/formatter",
	"sap/m/TablePersoController",
	"./developmentReceiptPersoService",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"sap/m/ComboBox",
    "sap/ui/core/Item",
    "sap/m/Token"
], function (BaseController, JSONModel, History, formatter, TablePersoController, developmentReceiptPersoService, Filter, FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, Token) {
	"use strict";

	return BaseController.extend("dp.developmentReceipt.controller.developmentReceipt", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the developmentReceipt controller is instantiated.
		 * @public
		 */
		onInit : function () {
			var oViewModel,
				oResourceBundle = this.getResourceBundle();

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				developmentReceiptTableTitle : oResourceBundle.getText("developmentReceiptTableTitle"),
				tableNoDataText : oResourceBundle.getText("tableNoDataText")
			});
			this.setModel(oViewModel, "developmentReceiptView");

			// Add the developmentReceipt page to the flp routing history
			this.addHistoryEntry({
				title: oResourceBundle.getText("developmentReceiptViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#Template-display"
            }, true);

            this._doInitSearch();
			//this._doInitTable();
			//this._doInitTablePerso();
        },
        
        onAfterRendering : function () {
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
		onMoldMstTableUpdateFinished : function (oEvent) {
			// update the developmentReceipt's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("developmentReceiptTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("developmentReceiptTableTitle");
			}
			this.getModel("developmentReceiptView").setProperty("/developmentReceiptTableTitle", sTitle);
		},

		onMoldMstTablePersoButtonPressed: function(oEvent){
			this._oTPC.openDialog();
		},

		onMoldMstTablePersoRefresh : function() {
			developmentReceiptPersoService.resetPersData();
			this._oTPC.refresh();
		},

		onMoldMstTableFilterPress: function(oEvent){
			var oTableFilterState = [],
				sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				oTableFilterState = [
					new Filter({
						filters: [
							new Filter("message_code", FilterOperator.Contains, sQuery),
							new Filter("message_contents", FilterOperator.Contains, sQuery)
						],
						and: false
					})
				];
			}

			this.getView().byId("moldMstTable").getBinding("items").filter(oTableFilterState, "Application");
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMoldMstTableItemPress : function (oEvent) {
			// The source is the list item that got pressed
			this._showMainObject(oEvent.getSource());
		},

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
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

		_getSearchStates: function(){
			var chain = this.getView().byId("searchAffiliateS").getSelectedKey(),
				language = this.getView().byId("searchDivisionS").getSelectedKey(),
				keyword = this.getView().byId("searchReceiptDateS").getValue();
				
			var aTableSearchState = [];
			if (chain && chain.length > 0) {
				aTableSearchState.push(new Filter("chain_code", FilterOperator.EQ, chain));
			}
			if (language && language.length > 0) {
				aTableSearchState.push(new Filter("language_code", FilterOperator.EQ, language));
			}
			if (keyword && keyword.length > 0) {
				aTableSearchState.push(new Filter({
					filters: [
						new Filter("message_code", FilterOperator.Contains, keyword),
						new Filter("message_contents", FilterOperator.Contains, keyword)
					],
					and: false
				}));
			}
			return aTableSearchState;
		},

		/**
		 * Event handler for page edit button press
		 * @public
		 */
		onMoldMstTableCancelButtonPress: function(){
			this._toEditMode();
		},

       
        onMoldMstTableBindButtonPress: function(){
			var oTable = this.byId("moldMstTable"),
                oBinding = oTable.getBinding("items");

            var oContext = oBinding.create({
                "tenant_id": "L2100",
                "chain_code": "CM",
                "language_code": "",
                "message_code": "",
                "message_type_code": "",
                "message_contents": "",
                "local_create_dtm": "2020-10-13T00:00:00Z",
                "local_update_dtm": "2020-10-13T00:00:00Z"
            });

            oContext.created().then(function (oEvent) {
                oTable.refresh();
                MessageToast.show("Success to create.");
            }).catch(function(oEvent){
                MessageBox.error("Error while creating.");
            });
        },
		
		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onMoldMstTableDeleteButtonPress: function(){
			this._toShowMode();
        },
        
        onMoldMstTableReceiptButtonPress: function(){
			var oView = this.getView(),
				me = this;
			MessageBox.confirm("Are you sure ?", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						oView.getModel().submitBatch("odataGroupIdForUpdate").then(function(ok){
							me._toShowMode();
							oView.setBusy(false);
                            MessageToast.show("Success to save.");
						}).catch(function(err){
                            MessageBox.error("Error while saving.");
                        });
					};
				}
			});
        },

		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function(){
            this.onMoldMstTableReceiptButtonPress.apply(this, arguments);
        },
        
		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelEditButtonPress: function(){
			this.onMoldMstTableDeleteButtonPress.apply(this, arguments);
        },

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefreshPress : function () {
			var oTable = this.byId("moldMstTable");
			oTable.getBinding("items").refresh();
		},





		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showMainObject : function (oItem) {
			var that = this;
			oItem.getBindingContext().requestCanonicalPath().then(function (sObjectPath) {
				that.getRouter().navTo("mainObject", {
					tenantId: oItem.getBindingContext().getProperty("tenant_id"),
					messageCode: oItem.getBindingContext().getProperty("message_code"),
					languageCode: oItem.getBindingContext().getProperty("language_code")
				});
			});
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function(aTableSearchState) {
			var oTable = this.byId("moldMstTable"),
				oViewModel = this.getModel("developmentReceiptView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("developmentReceiptNoDataWithSearchText"));
			}
		},

		_rebindTable: function(oTemplate, sKeyboardMode) {
			var aFilters = this._getSearchStates();
			this.byId("moldMstTable").bindItems({
				path: "/Message",
				filters: aFilters,
				parameters: {
					"$$updateGroupId" : 'odataGroupIdForUpdate'
				},
				template: oTemplate,
				templateShareable: true,
				key: "message_code"
			}).setKeyboardMode(sKeyboardMode);
		},

		_toEditMode: function(){
            var FALSE = false;
			this.byId("pageSearchFormS").setEditable(FALSE);
			this.byId("pageSearchButton").setEnabled(FALSE);
			this.byId("moldMstTableBindButton").setEnabled(!FALSE);
			this.byId("moldMstTableCancelButton").setEnabled(FALSE);
			this.byId("moldMstTableDeleteButton").setEnabled(!FALSE);
			this.byId("moldMstTableReceiptButton").setEnabled(!FALSE);
			this._rebindTable(this.oEditableTemplate, "Edit");
		},

		_toShowMode: function(){
            var TRUE = true;
			this._rebindTable(this.oReadOnlyTemplate, "Navigation");
			this.byId("pageSearchFormS").setEditable(TRUE);
			this.byId("pageSearchButton").setEnabled(TRUE);
			this.byId("moldMstTableBindButton").setEnabled(!TRUE);
			this.byId("moldMstTableCancelButton").setEnabled(TRUE);
			this.byId("moldMstTableDeleteButton").setEnabled(!TRUE);
			this.byId("moldMstTableReceiptButton").setEnabled(!TRUE);
		},

        /* Affiliate Start */
        /**
         * @private
         * @see 검색을 위한 컨트롤에 대하여 필요 초기화를 진행 합니다. 
         */
		_doInitSearch: function(){
			this._oMultiInput = this.getView().byId("searchAffiliateE");
            this._oMultiInput.setTokens(this._getDefaultTokens());

            this._oMultiInput1 = this.getView().byId("searchAffiliateS");
            this._oMultiInput1.setTokens(this._getDefaultTokens());

            this.oColModel = new JSONModel(sap.ui.require.toUrl("dp/developmentReceipt/localService/mockdata") + "/columnsModel.json");
            this.oAffiliateModel = new JSONModel(sap.ui.require.toUrl("dp/developmentReceipt/localService/mockdata") + "/affiliate.json");
            this.setModel("affiliateModel", this.oAffiliateModel);
        },
        /**
         * @private 
         * @see searchAffiliate setTokens
         */
        _getDefaultTokens: function () {
            
            var oToken = new Token({
                key: "LGEKR",
                text: "[LGEKR] LG Electronics Inc."
            });

            return [oToken];
        },

        /**
         * @public 
         * @see searchAffiliate Fragment View 컨트롤 valueHelp
         */
        onValueHelpRequested : function () {
            console.group("onValueHelpRequested");

            var aCols = this.oColModel.getData().cols;

            this._oValueHelpDialog = sap.ui.xmlfragment("dp.developmentReceipt.view.ValueHelpDialogAffiliate", this);
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
            var aTokens = oEvent.getParameter("tokens");
            this.searchAffiliate = this.getView().byId("searchAffiliateE");
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
        /* Affiliate End */

		_doInitTable: function(){

			this.oReadOnlyTemplate = new ColumnListItem({
				cells: [
					new ObjectIdentifier({
						text: "{chain_code}"
					}), new ObjectIdentifier({
						text: "{language_code}"
					}), new ObjectIdentifier({
						text: "{message_code}"
					}), new Text({
						text: "{message_contents}", hAlign: "Right"
					}), new Text({
						text: "{message_type_code}", hAlign: "Right"
					})
				],
				type: sap.m.ListType.Navigation
			});
			this.oReadOnlyTemplate.attachPress(this.onMoldMstTableItemPress.bind(this));

            var oMessageTypeComboBox = new ComboBox({
                    selectedKey: "{message_type_code}"
                });
                oMessageTypeComboBox.bindItems({
                    path: 'util>/CodeDetails',
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
                        new Filter("company_code", FilterOperator.EQ, '*'),
                        new Filter("group_code", FilterOperator.EQ, 'CM_MESSAGE_TYPE_CODE')
                    ],
                    template: new Item({
                        key: "{util>code}",
                        text: "{util>code_description}"
                    })
                });
			this.oEditableTemplate = new ColumnListItem({
				cells: [
					new Input({
						value: "{chain_code}"
					}), new Input({
						value: "{language_code}"
					}), new Input({
						value: "{message_code}"
					}), new Input({
						value: "{message_contents}"
					}), oMessageTypeComboBox
				]
            });

			this._toShowMode();
		},

		_doInitTablePerso: function(){
			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.byId("moldMstTable"),
				componentName: "developmentReceipt",
				persoService: developmentReceiptPersoService,
				hasGrouping: true
			}).activate();
		}


	});
});