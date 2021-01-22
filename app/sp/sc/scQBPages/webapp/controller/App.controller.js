sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, JSONModel) {
		"use strict";

		return Controller.extend("sp.sc.scQBPages.controller.App", {
			onInit: function () {
                // this.getOwnerComponent().getRouter().navTo("mainPage", {} );

                // apply content density mode to root view
                // this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
                
                var sHash = sap.ui.core.routing.HashChanger.getInstance().getHash();
                var pageId = sHash.split('/')[0];
                var pType = sHash.split('/')[0];
                var pOutcome = sHash.split('/')[1];
                var pMode = sHash.split('/')[2];
                
                var routeName;
                debugger;
                if (pType === "1" || pType === "3") {
                    routeName = "detailPage";
                } else {
                    routeName = "detailPage2";
                }
                this.getOwnerComponent().getRouter().navTo(routeName, { type : pType, outcome : pOutcome, header_id : "0" } );


                var inputModel = new JSONModel();
                inputModel.setData({ type : "E"});
                this.getView().setModel(inputModel, "defaultModel");
                
                // this.getRouter().navTo(routeName);


                // if( this._cNum == "1" || this._cNum =="3"){
                //      this.getRouter().navTo("detailPage", { type : this._cNum, outcome : outcome } );
                // }else{
                //     this.getOwnerComponent().getRouter().navTo("detailPage2", { type : this._cNum, outcome : outcome } );
                // }
                // this._clickEvent("0");

			}
		});
	});
