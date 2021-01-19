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

    var oInput, oDeveloperValueHelpDialog, gIsMulti, gCallback;
    
    var ModelDeveloperSelection = EventProvider.extend("dp.util.ModelDeveloperSelection", {

        self: null,

        oServiceModel: new ODataModel({
            serviceUrl: "srv-api/odata/v2/dp.util.ModelDeveloperSelectionService/",
            defaultBindingMode: "OneWay",
            defaultCountMode: "Inline",
            refreshAfterChange: false,
            useBatch: true
        }),

        showModelDeveloperSelection: function(oThis, oEvent, callback){

            oThis.getView().setModel(this.oServiceModel, 'userModel');
            
            self = this;
            oInput = oEvent.getSource();
            gCallback = callback;

            if(oInput.getMetadata().getName().indexOf('MultiInput') > -1 || callback){
                gIsMulti = true;
            }else{
                gIsMulti = false;
            }

            oDeveloperValueHelpDialog = sap.ui.xmlfragment("tmp.util.view.ModelDeveloperSelection", oThis);

            oDeveloperValueHelpDialog.setSupportMultiselect(gIsMulti);
            oDeveloperValueHelpDialog.attachOk(this.onValueHelpDeveloperOkPress);
            oDeveloperValueHelpDialog.attachCancel(this.onValueHelpDeveloperCancelPress);
            oDeveloperValueHelpDialog.attachAfterClose(this.onValueHelpDeveloperAfterClose);

            this._oBasicSearchField = new SearchField({
                showSearchButton: false
            });

            // this._oBasicSearchField.attachSearch(this.onFilterBarDeveloperSearch);
            
            var oFilterBar = oDeveloperValueHelpDialog.getFilterBar();
            // oFilterBar.setFilterBarExpanded(false);
            oFilterBar.setBasicSearch(this._oBasicSearchField);
            oFilterBar.attachSearch(this.onFilterBarDeveloperSearch);

            if (oInput.getMetadata().getName().indexOf('Input') > -1) {
                oInput.bindAggregation("suggestionItems", {
                    path: "userModel>/ModelDeveloper",
                    template: new sap.ui.core.Item({
                        key: "{userModel>employee_number}",
                        text: "{userModel>user_name}"
                    })
                });
            }

            var oColModel = new JSONModel({
                "cols": [
                    {
                        "label": "Name",
                        "template": "user_local_name"
                    },
                    {
                        "label": "ID",
                        "template": "user_id"
                    }
                ]
            });

            var aCols = oColModel.getData().cols;
            
            oThis.getView().addDependent(oDeveloperValueHelpDialog);

            oDeveloperValueHelpDialog.getTableAsync().then(function (oTable) {
                
                oTable.setModel(this.oServiceModel);
                oTable.setModel(oColModel, "columns");

                if (oTable.bindRows) {
                    oTable.bindAggregation("rows", '/ModelDeveloper');
                }

                if (oTable.bindItems) {
                    oTable.bindAggregation("items", '/ModelDeveloper', function () {
                        return new ColumnListItem({
                            cells: aCols.map(function (column) {
                                return new Label({ text: "{" + column.template + "}" });
                            })
                        });
                    });
                }
                oDeveloperValueHelpDialog.update();

            }.bind(this));

            this.setChosenDeveloper(oDeveloperValueHelpDialog, oInput);

            oDeveloperValueHelpDialog.open();
            
        },

        setChosenDeveloper: function(oDeveloperValueHelpDialog, oInput){
            var tokens = [];

            /*if(oInput.getMetadata().getName().indexOf('MultiInput') > -1){
                tokens = oInput.getTokens()
                oDeveloperValueHelpDialog.setTokens(tokens);
            }else if(oInput.getMetadata().getName().indexOf('Input') > -1){*/
                var oToken = new Token();
                //oToken.setKey(oInput.getSelectedKey());
                oToken.setText(oInput.getValue());
                tokens = [oToken];
                oDeveloperValueHelpDialog.setTokens(tokens);
            //}

        },

        onValueHelpDeveloperOkPress: function (oEvent) {

            var aTokens = oEvent.getParameter("tokens");

            if(gCallback && typeof gCallback == 'function'){
                gCallback(aTokens.map(function(item){
                    return item.mProperties;
                }));
            }else{
                if(gIsMulti){
                    oInput.setTokens(aTokens);
                }else{
                    oInput.setValue(aTokens[0].getKey());
                }
            }

            oDeveloperValueHelpDialog.close();
        },
        

        onValueHelpDeveloperCancelPress: function () {
            oDeveloperValueHelpDialog.close();
        },

        onValueHelpDeveloperAfterClose: function () {
            oDeveloperValueHelpDialog.destroy();
        },

        onFilterBarDeveloperSearch: function (oEvent) {
            
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

            _tempFilters.push(new Filter({ path: "tolower(user_id)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
            _tempFilters.push(new Filter({ path: "tolower(user_local_name)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
            _tempFilters.push(new Filter({ path: "tolower(user_english_name)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));

            return _tempFilters;
        },

        _filterTable: function (oFilter) {
            var oValueHelpDialog = oDeveloperValueHelpDialog;

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

    return ModelDeveloperSelection;
});