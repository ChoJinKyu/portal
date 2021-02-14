sap.ui.define([
	"ext/lib/controller/BaseController",
	"sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/thirdparty/jquery",
	"sap/m/TablePersoController",
	"ext/lib/formatter/DateFormatter",
    "ext/lib/util/ExcelUtil",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"cm/util/control/ui/CountryDialog",
], function (BaseController, JSONModel, MessageBox, MessageToast, jQuery, 
        TablePersoController, 
        DateFormatter, ExcelUtil, 
        Filter, FilterOperator, 
        CountryDialog) {
	"use strict";

	return BaseController.extend("xx.templateRcmdV4.controller.TemplateBeginColumn", {

		dateFormatter: DateFormatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the controller is instantiated.
		 * @public
		 */
		onInit : function () {
			var oMultilingual = this.getMultilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new JSONModel(), "beginPageViewModel");

			oMultilingual.attachEvent("ready", function(oEvent){
				var oI18nModel = oEvent.getParameter("model");
				this.addHistoryEntry({
					title: oI18nModel.getText("/TEMPLATE_3COLUMNSLAYOUT_TITLE"),
					icon: "sap-icon://table-view",
					intent: "#Template3ColumnsLayout-display"
				}, true);
            }.bind(this));
            
            this.getView().bindElement({
                path: "/Tenant",
                events: {
                    dataStateChange: function(){
                        debugger;
                    },
                    dataRequested: function(){
                        this.getView().setBusy(true);
                    }.bind(this),
                    dataReceived: function(oData){
                    }.bind(this),
                    change: function(){
                        this.getView().setBusy(false);
                    }.bind(this)
                }
            });
			
			this.getRouter().getRoute("beginPage").attachPatternMatched(this._onRoutedThisPage, this);
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
        
        onCompanyListExportButtonPress: function(){
            ExcelUtil.fnExportExcel({
                fileName: "Template3ColumnsLayoutExport",
                table: this.byId("CompanyList"),
                data: this.getModel("list").getProperty("/")
            });
        },

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
		onPageSearchButtonPress : function (oEvent) {
            var aSearchFilters = this._getSearchStates();
            this._applySearch(aSearchFilters);
		},

		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		onCompanyListItemPress: function(oEvent) {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
				sPath = oEvent.getSource().getBindingContextPath(),
				oRecord = this.getModel().getProperty(sPath);

			this.getRouter().navTo("midPage", {
				layout: oNextUIState.layout, 
				tenantId: oRecord.tenant_id,
				companyCode: oRecord.company_code
			});

            if(oNextUIState.layout === "TwoColumnsMidExpanded"){
                this.getModel("beginPageViewModel").setProperty("/headerExpanded", false);
                this.getModel("beginPageViewModel").setProperty("/lessImportantSearchConditionsVisible", false);
            }

			// store index of the item clicked, which can be used later in the columnResize event
			var oItem = oEvent.getSource();
			oItem.setNavigated(true);
			this.iIndex = oItem.getParent().indexOfItem(oItem);
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

        getList: function(){
			return this.byId("companyList");
        },

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
            this.getList().getBinding("items").filter(aSearchFilters, "Application");
		},
		
		_getSearchStates: function(){
            var sTenant = this.getView().byId("searchTenant").getValue(),
                sKeyword = this.getView().byId("searchKeyword").getValue(),
			    aCountryTokens = this.getView().byId("searchCountry").getTokens();
			
			var aSearchFilters = [];
			if (sTenant) {
				aSearchFilters.push(new Filter("tenant_id", FilterOperator.EQ, sTenant));
            }
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