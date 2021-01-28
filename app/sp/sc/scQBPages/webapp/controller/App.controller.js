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
                
                // var sHash = sap.ui.core.routing.HashChanger.getInstance().getHash();
                
                // var paramArray = sHash.split('/');
                // // 0 : 생성구분( NC: 생성, NW: 조회)
                // // 1 : Negotiation Type
                // // 2 : outcome
                // // 3 : Header Id(NW일 때만)
                // $.sap.negoMode = paramArray[0]; // Nav - Back 용

                // var pMode = paramArray[0];
                // var pType = paramArray[1];
                // var pOutcome = paramArray[2];
                // if(pMode == "NW"){
                //     var pHeaderId =paramArray[3];
                // }else{
                //     var pHeaderId ="0"; //생성일 때 Header Id = 0
                // }

                // console.log("parameterArray ===================", paramArray);
                // // var pMode = sHash.split('/')[0];
                // // var pType = sHash.split('/')[1];
                // // var pOutcome = sHash.split('/')[2];
                // // if(pMode == "NW"){
                // //     var pHeaderId = sHash.split('/')
                // // }
                
                // var routeName;
                // debugger;
                // if (pType === "1" || pType === "3") {
                //     routeName = "detailPage";
                // } else {
                //     routeName = "detailPage2";
                // }
                
                // this.getOwnerComponent().getRouter().navTo(routeName, { type : pType, outcome : pOutcome, header_id : pHeaderId } );


                // var inputModel = new JSONModel();
                // inputModel.setData({ type : "E"});
                // this.getView().setModel(inputModel, "defaultModel");
                
                // this.getRouter().navTo(routeName);


                // if( this._cNum == "1" || this._cNum =="3"){
                //      this.getRouter().navTo("detailPage", { type : this._cNum, outcome : outcome } );
                // }else{
                //     this.getOwnerComponent().getRouter().navTo("detailPage2", { type : this._cNum, outcome : outcome } );
                // }
                // this._clickEvent("0");

                
                this.getOwnerComponent().getRouter().navTo("detailPage2", { type : "1", outcome : "1", header_id : "1" } );
			}
		});
	});
