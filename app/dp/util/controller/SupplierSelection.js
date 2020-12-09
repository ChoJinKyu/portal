sap.ui.define([
    "sap/ui/base/EventProvider",
	"ext/lib/model/I18nModel",
    "sap/ui/model/odata/v2/ODataModel",
    'sap/m/SearchField',
    "sap/ui/model/json/JSONModel"
], function (EventProvider, I18nModel, ODataModel, SearchField, JSONModel) {
    "use strict";

    // var oServiceModel = new ODataModel({
    //     serviceUrl: "srv-api/odata/v2/dp.util.SupplierSelectionService/",
    //     defaultBindingMode: "OneWay",
    //     defaultCountMode: "Inline",
    //     refreshAfterChange: false,
    //     useBatch: true
    // });
    
    var SupplierSelection = EventProvider.extend("dp.util.SupplierSelection", {

        oServiceModel: new ODataModel({
            serviceUrl: "srv-api/odata/v2/dp.util.SupplierSelectionService/",
            defaultBindingMode: "OneWay",
            defaultCountMode: "Inline",
            refreshAfterChange: false,
            useBatch: true
        }),

		showSupplierSelection: function(oThis, oEvent, sInputId){

            var path = '';
            this._oValueHelpDialog = sap.ui.xmlfragment("dp.util.view.SupplierSelection", oThis);

            this._oBasicSearchField = new SearchField({
				showSearchButton: false
            });
            
            var oFilterBar = this._oValueHelpDialog.getFilterBar();
			oFilterBar.setFilterBarExpanded(false);
            oFilterBar.setBasicSearch(this._oBasicSearchField);
            
            this._oInputModel = oEvent.getSource();

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
			oToken.setKey(this._oInputModel.getSelectedKey());
			oToken.setText(this._oInputModel.getValue());
			this._oValueHelpDialog.setTokens([oToken]);
            this._oValueHelpDialog.open();
        }
    });

    return SupplierSelection;
});