sap.ui.define([
	"./Empty.controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("xx.exampleControls.controller.CodeCombo", {

        onSearchButtonPress: function(){
            var sCode = this.byId("searchCode").getValue();
            var sCurrency = this.byId("searchCurrency").getValue();

            MessageBox.show("sCode: " + sCode + ", sCurrency: " + sCurrency);
        }

	});
});