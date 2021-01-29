sap.ui.define([
    "sap/ui/base/EventProvider",
    "ext/lib/model/I18nModel",
    "sap/ui/model/odata/v2/ODataModel",
    'sap/m/SearchField',
    "sap/ui/model/json/JSONModel",
    'sap/m/Token',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Item",
], function (EventProvider, I18nModel, ODataModel, SearchField, JSONModel, Token, Filter, FilterOperator, Item) {
    "use strict";

    var oInput, oSuppValueHelpDialog, gIsMulti, gCallback;
    
    var SupplierSelection = EventProvider.extend("dp.util.SupplierSelection", {

        self: null,

        oServiceModel: new ODataModel({
            serviceUrl: "srv-api/odata/v2/sp.supplierMasterMgtService/",
            defaultBindingMode: "OneWay",
            defaultCountMode: "Inline",
            refreshAfterChange: false,
            useBatch: true
        }),

        oDSEServiceModel: new ODataModel({
            serviceUrl: "srv-api/odata/v2/dp.DetailSpecEntryService/",
            defaultBindingMode: "OneWay",
            defaultCountMode: "Inline",
            refreshAfterChange: false,
            useBatch: true
        }),

        oCmOrgServiceModel: new ODataModel({
            serviceUrl: "srv-api/odata/v2/cm.OrgMgtService/",
            defaultBindingMode: "OneWay",
            defaultCountMode: "Inline",
            refreshAfterChange: false,
            useBatch: true
        }),

        showSupplierSelection: function(oParam, callback){

            var oThis = oParam.oThis;
            var oEvent = oParam.oEvent;
            var companyCode = oParam.companyCode;
            var orgCode = oParam.orgCode;
            gIsMulti =  oParam.isMulti;
            gCallback = callback;

            oThis.getView().setModel(this.oServiceModel, 'supplierModel');
            oThis.getView().setModel(this.oDSEServiceModel, 'dseModel');
            oThis.getView().setModel(this.oCmOrgServiceModel, 'cmOrgModel');
            
            self = this;
            oInput = oEvent.getSource();
            
            oSuppValueHelpDialog = sap.ui.xmlfragment("dp.md.util.view.SupplierSelection", oThis);

            oSuppValueHelpDialog.setSupportMultiselect(gIsMulti);
            oSuppValueHelpDialog.attachOk(this.onValueHelpSuppOkPress);
            oSuppValueHelpDialog.attachCancel(this.onValueHelpSuppCancelPress);
            oSuppValueHelpDialog.attachAfterClose(this.onValueHelpSuppAfterClose);

            this._oBasicSearchField = new SearchField({
                showSearchButton: false
            });

            // this._oBasicSearchField.attachSearch(this.onFilterBarSuppSearch);
            
            var oFilterBar = oSuppValueHelpDialog.getFilterBar();
            // oFilterBar.setFilterBarExpanded(false);
            oFilterBar.setBasicSearch(this._oBasicSearchField);
            oFilterBar.attachSearch(this.onFilterBarSuppSearch);

            var oColModel = new JSONModel({
                "cols": [
                    {
                        "label": "Supplier Code",
                        "template": "supplier_code"
                    },
                    {
                        "label": "Supplier Local Name",
                        "template": "supplier_local_name"
                    },
                    {
                        "label": "Supplier English Name",
                        "template": "supplier_english_name"
                    }
                ]
            });

            var aCols = oColModel.getData().cols;
            
            oThis.getView().addDependent(oSuppValueHelpDialog);

            oSuppValueHelpDialog.getTableAsync().then(function (oTable) {

                oTable.setModel(this.oServiceModel);
                oTable.setModel(oColModel, "columns");

                if (oTable.bindRows) {
                    oTable.bindAggregation("rows", '/supplierMaster');
                }

                if (oTable.bindItems) {
                    oTable.bindAggregation("items", '/supplierMaster', function () {
                        return new ColumnListItem({
                            cells: aCols.map(function (column) {
                                return new Label({ text: "{" + column.template + "}" });
                            })
                        });
                    });
                }
                oSuppValueHelpDialog.update();

            }.bind(this));

            this.setChosenSupplier(oSuppValueHelpDialog, oInput);

            oSuppValueHelpDialog.open();
            
            //company, plant 값을 세팅해야한다..
            this.setCompOrgVal(oThis, companyCode, orgCode);
        },

        setChosenSupplier: function(oSuppValueHelpDialog, oInput){
            var tokens = [];

            if(oInput.getMetadata().getName().indexOf('MultiInput') > -1){
                tokens = oInput.getTokens()
                oSuppValueHelpDialog.setTokens(tokens);
            }else if(oInput.getMetadata().getName().indexOf('Input') > -1){
                var oToken = new Token();
                oToken.setKey(oInput.getSelectedKey());
                oToken.setText(oInput.getValue());
                tokens = [oToken];
                oSuppValueHelpDialog.setTokens(tokens);
            }

        },

        setCompOrgVal: function(oThis, companyCodes, orgCodes){

            if(typeof companyCodes == 'string'){
                companyCodes = [].concat([companyCodes]);
            }

            sap.ui.getCore().byId("supplierCompany").setSelectedKeys(companyCodes);
            this.setOrg(companyCodes, orgCodes);
        },

        setOrg: function(companyCodes, orgCodes){

            var companyFilters = [];
            companyCodes.forEach(function(item){
                companyFilters.push(new Filter("company_code", FilterOperator.EQ, item ));
            });

            var tmpFilter = new Filter({
                            filters: companyFilters,
                            and: false
                        });
                        
            var filter = new Filter({
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, 'L2600' ),
                                tmpFilter
                            ],
                            and: true
                        });

            sap.ui.getCore().byId("supplierPlant").bindItems(
                {
                    path: 'dseModel>/Divisions',
                    filters: filter,
                    template: new Item({
                    key: "{dseModel>org_code}", text: "[{dseModel>org_code}] {dseModel>org_name}"
                    })
                }
            )

            if(typeof orgCodes == 'string'){
                orgCodes = [].concat([orgCodes]);
            }

            sap.ui.getCore().byId("supplierPlant").setSelectedKeys(orgCodes);
        },

        onValueHelpSuppOkPress: function (oEvent) {
            var tokens = oEvent.getParameter("tokens");
            gCallback(tokens);
            oSuppValueHelpDialog.close();
        },
        

        onValueHelpSuppCancelPress: function () {
            oSuppValueHelpDialog.close();
        },

        onValueHelpSuppAfterClose: function () {
            oSuppValueHelpDialog.destroy();
        },

        onFilterBarSuppSearch: function (oEvent) {
            
            var aSelectionSet = oEvent.getParameter("selectionSet");
            var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                if (oControl.getValue()) {
                    aResult.push(new Filter({
                        path: oControl.getName(),
                        operator: FilterOperator.Contains,
                        value1: oControl.getValue()
                    }));
                }

                return aResult;
            }, []);
            
            var _tempFilters = self.getFiltersFilterBar();

            aFilters.push(new Filter({
                filters: _tempFilters,
                and: false
            }));

            self._filterTable(new Filter({
                filters: aFilters,
                and: true
            }));
        },

        getFiltersFilterBar: function(){

            var sSearchQuery = self._oBasicSearchField.getValue();
            var _tempFilters = [];

            _tempFilters.push(new Filter({ path: "tolower(supplier_code)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
            _tempFilters.push(new Filter({ path: "tolower(supplier_local_name)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
            _tempFilters.push(new Filter({ path: "tolower(supplier_english_name)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));

            return _tempFilters;
        },

        _filterTable: function (oFilter) {
            var oValueHelpDialog = oSuppValueHelpDialog;

            oValueHelpDialog.getTableAsync().then(function (oTable) {
                if (oTable.bindRows) {
                    oTable.getBinding("rows").filter(oFilter);
                }

                if (oTable.bindItems) {
                    oTable.getBinding("items").filter(oFilter);
                }

                oValueHelpDialog.update();
            });
        },
    });

    return SupplierSelection;
});