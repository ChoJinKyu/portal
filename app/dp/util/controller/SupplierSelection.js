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

    var oInput = null;
    
    var SupplierSelection = EventProvider.extend("dp.util.SupplierSelection", {
        
        // oInput: null,

        oServiceModel: new ODataModel({
            serviceUrl: "srv-api/odata/v2/dp.util.SupplierSelectionService/",
            defaultBindingMode: "OneWay",
            defaultCountMode: "Inline",
            refreshAfterChange: false,
            useBatch: true
        }),


        showSupplierSelection: function(oThis, oEvent){

            var path = '';
            this._oValueHelpDialog = sap.ui.xmlfragment("dp.util.view.SupplierSelection", oThis);

            this._oBasicSearchField = new SearchField({
                showSearchButton: false
            });
            
            var oFilterBar = this._oValueHelpDialog.getFilterBar();
            oFilterBar.setFilterBarExpanded(false);
            oFilterBar.setBasicSearch(this._oBasicSearchField);
            
            // console.log( 'oThis.getView()',oThis.getView() );

            oThis.getView().setModel(this.oServiceModel, 'supplierModel');

            this.oInput = oEvent.getSource();

            var self = this;

            if (!this.oInput.getSuggestionItems().length) {
                this.oInput.bindAggregation("suggestionItems", {
                    path: "supplierModel>/Suppliers",
                    template: new sap.ui.core.Item({
                        key: "{supplierModel>supplier_code}",
                        text: "{supplierModel>supplier_code}"
                    })
                });
            }


            console.log( 'supplierModel', oThis.getView().getModel('supplierModel') );

            console.log('this.oInput.getSuggestionItems()',this.oInput.getSuggestionItems());

            console.log('this.oInput',this.oInput);

            // this.oServiceModel.read("/Suppliers",{
            //     success : function(data){

            //         this.getModel().setData(data.results, false);

                    

            //         console.log('this.oInput.getSuggestionItems()',self.oInput.getSuggestionItems());
            //     }.bind(this),
            //     error : function(data){
            //         console.log('error',data);
            //     }
            // });

            

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
            
            oThis.getView().addDependent(this._oValueHelpDialog);

            this._oValueHelpDialog.getTableAsync().then(function (oTable) {
                
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
                this._oValueHelpDialog.update();

            }.bind(this));

            // debugger

            var oToken = new Token();
            oToken.setKey(this.oInput.getSelectedKey());
            oToken.setText(this.oInput.getValue());
            this._oValueHelpDialog.setTokens([oToken]);

            this._oValueHelpDialog.attachOk(this.onValueHelpSuppOkPress);

            this._oValueHelpDialog.open();
        },

        onValueHelpSuppOkPress: function (oEvent) {
            // console.log('this.oInput22',this.oInput);

            console.log('this.getOwnerComponent()',this.getOwnerComponent());

            

            var aTokens = oEvent.getParameter("tokens");
            this.oInput.setSelectedKey(aTokens[0].getKey());
			this._oValueHelpDialog.close();
		},

		onValueHelpSuppCancelPress: function () {
			this._oValueHelpDialog.close();
		},

		onValueHelpSuppAfterClose: function () {
			this._oValueHelpDialog.destroy();
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

            if(this._oValueHelpDialog.oRows.sPath.indexOf('/Models') > -1){
                // /Models
                _tempFilters.push(new Filter("tolower(model)", FilterOperator.Contains, "'"+sSearchQuery.toLowerCase().replace("'","''")+"'"));

            }else if(this._oValueHelpDialog.oRows.sPath.indexOf('/PartNumbers') > -1){
                //PartNumbers
                _tempFilters.push(new Filter({ path: "tolower(mold_number)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
                _tempFilters.push(new Filter({ path: "tolower(mold_item_type_name)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
                _tempFilters.push(new Filter({ path: "tolower(spec_name)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
            }else if(this._oValueHelpDialog.oRows.sPath.indexOf('/CreateUsers') > -1){
                _tempFilters.push(new Filter({ path: "tolower(create_user_name)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
                _tempFilters.push(new Filter({ path: "tolower(create_user_id)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
            }

            return _tempFilters;
        },
        
        _filterTable: function (oFilter) {
			var oValueHelpDialog = this._oValueHelpDialog;

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