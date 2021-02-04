sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    'sap/ui/core/Popup',
    'sap/ui/core/Fragment'
], function(Controller, JSONModel, MessageBox, Popup, Fragment) {
	"use strict";

    var _oTargetInput;
    var _sCopyValue;

	return Controller.extend("xx.templateGuide.controller.GridTable", {
		onInit: function() {
            _oTargetInput = null;
            _sCopyValue = "";

			var oModel = new JSONModel();
			var oData = {
				modelData: [
					{supplier: "Titanium", street: "401 23rd St", city: "Port Angeles", phone: "5682-121-828", openOrders: 10},
					{supplier: "Technocom", street: "51 39th St", city: "Smallfield", phone: "2212-853-789", openOrders: 0},
					{supplier: "Red Point Stores", street: "451 55th St", city: "Meridian", phone: "2234-245-898", openOrders: 5},
					{supplier: "Technocom", street: "40 21st St", city: "Bethesda", phone: "5512-125-643", openOrders: 0},
					{supplier: "Very Best Screens", street: "123 72nd St", city: "McLean", phone: "5412-543-765", openOrders: 6}
				]
			};
			var oView = this.getView();

			oModel.setData(oData);
			oView.setModel(oModel);
        },
        onHeaderBtnPress : function(oEvent) {
            oEvent.getSource().getParent().getParent().setVisible(false);

			MessageBox.information("Clicked.", {
				styleClass: "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer"
			});
        },
        
        handlePressOpenMenu : function(oEvent) {
            var oButton = oEvent.getSource();
            _oTargetInput = oButton.getParent().getItems()[0];

			// create menu only once
			// if (!this._menu) {
			// 	Fragment.load({
			// 		name: "xx.templateGuide.fragment.MenuItemEventing",
			// 		controller: this
			// 	}).then(function(oMenu){
			// 		this._menu = oMenu;
			// 		this.getView().addDependent(this._menu);
			// 		this._menu.open(this._bKeyboard, oButton, Popup.Dock.BeginTop, Popup.Dock.BeginBottom, oButton);
			// 	}.bind(this));
			// } else {
			// 	this._menu.open(this._bKeyboard, oButton, Popup.Dock.BeginTop, Popup.Dock.BeginBottom, oButton);
            // }
        },

        onCopy : function(oEvent){
            this._sCopyValue = _oTargetInput.getValue();

            // $(oEvent.getSource().getParent().getItems()[0].getDomRef()).find("input").select();
            // document.execCommand('copy');
        },

        onPaste : function(oEvent){
            _oTargetInput.setValue(this._sCopyValue);
            // oEvent.getSource().getParent().getItems()[0].setValue(pastedData);
        },

        onRowSelectionChange : function(oEvent){
            oEvent;
        },

        onChange : function(oEvent){
            oEvent;
        },
	});
});
