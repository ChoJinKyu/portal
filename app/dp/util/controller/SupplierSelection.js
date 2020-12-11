sap.ui.define([
    "sap/ui/base/EventProvider",
    "ext/lib/model/I18nModel",
    "sap/ui/model/odata/v2/ODataModel",
    'sap/m/SearchField',
    "sap/ui/model/json/JSONModel",
    'sap/m/Token'
], function (EventProvider, I18nModel, ODataModel, SearchField, JSONModel, Token) {
    "use strict";

    // var oServiceModel = new ODataModel({
    //     serviceUrl: "srv-api/odata/v2/dp.util.SupplierSelectionService/",
    //     defaultBindingMode: "OneWay",
    //     defaultCountMode: "Inline",
    //     refreshAfterChange: false,
    //     useBatch: true
    // });

    var oInput, oSuppValueHelpDialog, gIsMulti;
    
    var SupplierSelection = EventProvider.extend("dp.util.SupplierSelection", {

        oServiceModel: new ODataModel({
            serviceUrl: "srv-api/odata/v2/dp.util.SupplierSelectionService/",
            defaultBindingMode: "OneWay",
            defaultCountMode: "Inline",
            refreshAfterChange: false,
            useBatch: true
        }),


        showSupplierSelection: function(oThis, oEvent, isMulti){

            gIsMulti = isMulti;

            oSuppValueHelpDialog = sap.ui.xmlfragment("dp.util.view.SupplierSelection", oThis);

            oSuppValueHelpDialog.setSupportMultiselect(isMulti);

            this._oBasicSearchField = new SearchField({
                showSearchButton: false
            });
            
            var oFilterBar = oSuppValueHelpDialog.getFilterBar();
            oFilterBar.setFilterBarExpanded(false);
            oFilterBar.setBasicSearch(this._oBasicSearchField);
            
            oThis.getView().setModel(this.oServiceModel, 'supplierModel');

            oInput = oEvent.getSource();

            console.log(oInput);

            var self = this;

            if (!oInput.getSuggestionItems().length) {
                oInput.bindAggregation("suggestionItems", {
                    path: "supplierModel>/Suppliers",
                    template: new sap.ui.core.Item({
                        key: "{supplierModel>supplier_code}",
                        // text: "[{supplierModel>supplier_code}] {supplierModel>supplier_local_name}",
                        text: "{supplierModel>supplier_code}"
                    })
                });
            }

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
                    oTable.bindAggregation("rows", '/Suppliers');
                }

                if (oTable.bindItems) {
                    oTable.bindAggregation("items", '/Suppliers', function () {
                        return new ColumnListItem({
                            cells: aCols.map(function (column) {
                                return new Label({ text: "{" + column.template + "}" });
                            })
                        });
                    });
                }
                oSuppValueHelpDialog.update();

            }.bind(this));

            // debugger

            

            var tokens = [];

            if(isMulti){
                tokens = oInput.getTokens()
            }else{
                var oToken = new Token();
                oToken.setKey(oInput.getSelectedKey());
                oToken.setText(oInput.getValue());
                oSuppValueHelpDialog.setTokens([oToken]);
            }

            oSuppValueHelpDialog.setTokens(tokens);

            oSuppValueHelpDialog.attachOk(this.onValueHelpSuppOkPress);
            oSuppValueHelpDialog.attachCancel(this.onValueHelpSuppCancelPress);
            oSuppValueHelpDialog.attachAfterClose(this.onValueHelpSuppAfterClose);

            oSuppValueHelpDialog.open();
        },

        onValueHelpSuppOkPress: function (oEvent) {

            var aTokens = oEvent.getParameter("tokens");

            if(gIsMulti){
                oInput.setTokens(aTokens);
            }else{
                oInput.setSelectedKey(aTokens[0].getKey());
            }

			oSuppValueHelpDialog.close();
        },
        

		onValueHelpSuppCancelPress: function () {
			oSuppValueHelpDialog.close();
		},

		onValueHelpSuppAfterClose: function () {
            oSuppValueHelpDialog.destroy();
        },

        onFilterBarSuppSearch: function (oEvent) {
			
			var	aSelectionSet = oEvent.getParameter("selectionSet");
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
            
            var _tempFilters = this.getFiltersFilterBar();

			aFilters.push(new Filter({
				filters: _tempFilters,
				and: false
			}));

			this._filterTable(new Filter({
				filters: aFilters,
				and: true
			}));
        },

        getFiltersFilterBar: function(){

            var sSearchQuery = this._oBasicSearchField.getValue();
            var _tempFilters = [];

            if(oSuppValueHelpDialog.oRows.sPath.indexOf('/Models') > -1){
                // /Models
                _tempFilters.push(new Filter("tolower(model)", FilterOperator.Contains, "'"+sSearchQuery.toLowerCase().replace("'","''")+"'"));

            }else if(oSuppValueHelpDialog.oRows.sPath.indexOf('/PartNumbers') > -1){
                //PartNumbers
                _tempFilters.push(new Filter({ path: "tolower(mold_number)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
                _tempFilters.push(new Filter({ path: "tolower(mold_item_type_name)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
                _tempFilters.push(new Filter({ path: "tolower(spec_name)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
            }else if(oSuppValueHelpDialog.oRows.sPath.indexOf('/CreateUsers') > -1){
                _tempFilters.push(new Filter({ path: "tolower(create_user_name)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
                _tempFilters.push(new Filter({ path: "tolower(create_user_id)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
            }

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