sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"sap/ui/model/json/JSONModel",
    "ext/lib/util/ExcelUtil",
	"ext/lib/formatter/DateFormatter",
	"sap/m/TablePersoController",
	"cm/util/control/ui/CountryDialog",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/thirdparty/jquery",
], function (BaseController, Multilingual, JSONModel, ExcelUtil, DateFormatter, 
        TablePersoController, 
        CountryDialog,
        Filter, FilterOperator, MessageBox, MessageToast, jQuery) {
	"use strict";

	return BaseController.extend("xx.template3ColumnsLayout.controller.TemplateBeginColumn", {

		dateFormatter: DateFormatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the controller is instantiated.
		 * @public
		 */
		onInit : function () {
			var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new JSONModel(), "list");
            this.setModel(new JSONModel(), "beginPageViewModel");

			oMultilingual.attachEvent("ready", function(oEvent){
				var oI18nModel = oEvent.getParameter("model");
				this.addHistoryEntry({
					title: "3컬럼 Layout",
					icon: "sap-icon://table-view",
					intent: "#Template3ColumnsLayout-display"
				}, true);
			}.bind(this));
			
			this.getRouter().getRoute("beginPage").attachPatternMatched(this._onRoutedThisPage, this);

            this.enableMessagePopover();
        },
		
		/* =========================================================== */
		/* event handlers                                              */
        /* =========================================================== */
        
        onSearchCountryDialogPress: function(oEvent){
            var oInput = oEvent.getSource();
            if(!this.oSearchCountryDialog){
                this.oSearchCountryDialog = new CountryDialog({
                    title: "Choose a Country",
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                            new Filter("group_code", FilterOperator.EQ, "L2100")
                        ]
                    }
                });
                this.oSearchCountryDialog.attachEvent("apply", function(oEvent){
                    oInput.setTokens(oEvent.getSource().getTokens());
                }.bind(this));
            }
            this.oSearchCountryDialog.open();

            var aTokens = oInput.getTokens();
            this.oSearchCountryDialog.setTokens(aTokens);
        },
        
        onMainTableExportButtonPress: function(){
            ExcelUtil.fnExportExcel({
                fileName: "Template3ColumnsLayoutExport",
                table: this.byId("mainTable"),
                data: this.getModel("list").getProperty("/")
            });
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
				var aSearchFilters = this._getSearchStates();
				this._applySearch(aSearchFilters);
			}
		},

		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		onMainTableItemPress: function(oEvent) {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
				sPath = oEvent.getSource().getBindingContext("list").getPath(),
				oRecord = this.getModel("list").getProperty(sPath);

			this.getRouter().navTo("midPage", {
				layout: oNextUIState.layout, 
				tenantId: oRecord.tenant_id,
				companyCode: oRecord.company_code
			});

            if(oNextUIState.layout === "TwoColumnsMidExpanded"){
                this.getModel("beginPageViewModel").setProperty("/headerExpandFlag", false);
            }

			var oItem = oEvent.getSource();
			oItem.setNavigated(true);
			var oParent = oItem.getParent();
			// store index of the item clicked, which can be used later in the columnResize event
			this.iIndex = oParent.indexOfItem(oItem);
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onRoutedThisPage: function(){
			this.getModel("beginPageViewModel").setProperty("/headerExpanded", false);
			this.byId("pageSearchButton").firePress();
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
			this.getModel().read("/Company", {
                filters: aSearchFilters,
                fetchOthers: true,
				success: function(oData){
                    oModel.setProperty("/", oData.results);
				},
				fetchOthersSuccess: function(aData, aErrors){
                    aData.forEach(function(oData){
                        oModel.setProperty("/", oData.results);
                    }.bind(this));
					oView.setBusy(false);
				}.bind(this)
			});
		},
		
		_getSearchStates: function(){
			var sKeyword = this.getView().byId("searchKeyword").getValue(),
			    aCountryTokens = this.getView().byId("searchCountry").getTokens();
			
			var aSearchFilters = [];
			if (sKeyword && sKeyword.length > 0) {
				aSearchFilters.push(new Filter({
					filters: [
                        new Filter({
                                path: "company_code",
                                operator: FilterOperator.Contains,
                                value1: sKeyword,
                                caseSensitive: false
                            }),
                        new Filter({
                                path: "company_name",
                                operator: FilterOperator.Contains,
                                value1: sKeyword,
                                caseSensitive: false
                            })
					],
					and: false
				}));
			}
			if (aCountryTokens.length > 0) {
				aSearchFilters.push(new Filter({
                    filters: jQuery.map(aCountryTokens, function(oToken){
                        return new Filter("country_code", FilterOperator.EQ, oToken.getProperty("key"));
                    }),
                    and: false
                }));
            }
			return aSearchFilters;
		},

	});
});