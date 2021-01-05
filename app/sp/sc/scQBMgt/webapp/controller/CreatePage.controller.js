sap.ui.define([
		"sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, JSON) {
		"use strict";

		return Controller.extend("sp.sc.scQBMgt.controller.CreatePage", {
			onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("createPage").attachPatternMatched(this._onProductMatched, this);
                
                this._oModel = new JSON();
            
                this._oData = { flag : 0 };
                this._oModel.setData(this._oData);
                this.getView().setModel(this._oModel ,"AAA");
                var vboxB1 = this.getView().byId("vboxB1");
                vboxB1.attachBrowserEvent("click", function(event) {
                    this._oData = { flag : 1 };
                    this._oModel.setData(this._oData);
                    this.getView().setModel(this._oModel ,"AAA");
                    console.log(this.getView().getModel("AAA"));
                    var aaa = this.getView().byId("aaa");
                    this._clickEvent("1");
                    // alert(aaa);
                    // $("#"+aaa).addClass("aaa");
                    // $("#"+aaa).addStyleClass("aaa");
                    // document.getElementById(aaa).style.backgroundColor = "blue !important";
                    // aaa.addStyleClass("vBoxForm");
                    // aaa.removeStyleClass("sapMFlexItem");
                    // $("#"+aaa.getId()).addStyleClass("vBoxForm");
                    // $("#__xmlview0--vboxB1")[0].style.backgroundColor="rgb(224, 133, 217)";
                    // alert("1111");
                }, this);

                var vboxB2 = this.getView().byId("vboxB2");
                vboxB2.attachBrowserEvent("click", function(event) {
                    this._oData = { flag : 2 };
                    this._oModel.setData(this._oData);
                    this.getView().setModel(this._oModel ,"AAA");
                    console.log(this.getView().getModel("AAA"));
                    // alert("2222");
                    this._clickEvent("2");
                    
                }, this);
                var vboxB3 = this.getView().byId("vboxB3");
                vboxB3.attachBrowserEvent("click", function(event) {
                    this._oData = { flag : 3 };
                    this._oModel.setData(this._oData);
                    this.getView().setModel(this._oModel ,"AAA");
                    console.log(this.getView().getModel("AAA"));
                    this._clickEvent("3");
                    // alert("3333");
                }, this);
                var vboxB4 = this.getView().byId("vboxB4");
                vboxB4.attachBrowserEvent("click", function(event) {
                    this._oData = { flag : 4 };
                    this._oModel.setData(this._oData);
                    this.getView().setModel(this._oModel ,"AAA");
                    console.log(this.getView().getModel("AAA"));
                    this._clickEvent("4");
                    // alert("4444");
                }, this);
                // this.oRouter.attachPatternMatched(this._onProductMatched, this);
               



            },

            _onProductMatched: function (e) {



                var text1 = this.getView().byId("text1");
                var stringValue = "RFQ (견적 계획)" + '\n' + "제안 가격을 받아 평가 후 우선 협상 대상자를 선정하고 협상을 거쳐 낙찰자를 선정";
                text1.setText(stringValue);

                var text2 = this.getView().byId("text2");
                var stringValue = "Competitive Bidding (입찰 계획)" + '\n' + "가격 입찰서를 제출 받아 예정가격 이하 최저 가격으로 입찰한 자를 낙찰자로 선정";
                text2.setText(stringValue);

                var text3 = this.getView().byId("text3");
                var stringValue = "RFP (견적 계획)" + '\n' + "제안 가격에 품질 ,성능 ,납기 등을 종합적으로 심사하여 우선 협상 대상자를 선정하고 협상을 거쳐 낙찰자를 선정";
                text3.setText(stringValue);

                var text4 = this.getView().byId("text4");
                var stringValue = "2-Step Bidding (입찰 계획)" + '\n' + "1단계에서 품질/성능/납기 등에 대한 규격 입찰서를 받아 입찰 적격자를 판단하고 적격자로 부터 가격 입찰서를 제출받아 최저 가격으로 입찰한 자를 낙찰자로 선정";
                text4.setText(stringValue);

                // if($("#__text13")[0].style.fontSize == ""){
                //     $("#__text0")[0].style.fontSize="1.2rem";
                //     $("#__text0")[0].style.fontWeight="bold";
                //     $("#__text13")[0].style.fontSize="1.2rem";
                //     $("#__text13")[0].style.fontWeight="bold";

                // }
                

            },
            onApplyePress: function(e){
                var oRbgName = "rbg" + this._cNum ;
                var oRbg = this.getView().byId(oRbgName);
                var outcome = oRbg.getSelectedIndex() + 1;
                

                debugger;
                if( this._cNum == "1" || this._cNum =="3"){
                    this.getOwnerComponent().getRouter().navTo("detailPage", { type : this._cNum, outcome : String(outcome) } );
                }else{
                    this.getOwnerComponent().getRouter().navTo("detailPage2", { type : this._cNum, outcome : String(outcome) } );
                }
                
            },
            _clickEvent: function(num){
                // var bId = "vboxB" + num;
                // var oVBox = this.getView().byId(sId);

                if(this._cNum != num){
                    if((this._cNum != undefined || num == "0") && this._cNum != "0" ){
                         //선택 전 분홍 박스 white로 변경
                        var bId = "vboxB" + this._cNum;
                        this.getView().byId(bId).addStyleClass("whiteBG");
                        this.getView().byId(bId).removeStyleClass("pinkBG");   
                    }
                    if(num != "0"){
                        //선택 후 분홍 박스로 변경
                        var aId = "vboxB" + num;
                        this.getView().byId(aId).addStyleClass("pinkBG");
                        this.getView().byId(aId).removeStyleClass("whiteBG");   
                    }
                    

                }

                // this.getView().byId("vboxB1").addStyleClass("pinkBG");
                // this.getView().byId("vboxB1").removeStyleClass("whiteBG");

                this._cNum = num;
                




                // for(var i=1; i<5; i++){
                //     var oWhiteId = "#__xmlview0--vboxB" + String(i);

                //     if( i == num){
                //         $(oWhiteId)[0].style.backgroundColor="rgb(252, 221, 233)";
                //     }else{
                //         $(oWhiteId)[0].style.backgroundColor="white";
                //     }
                    
                //     // $("#__xmlview0--vboxB1")[0].style.backgroundColor="blue"
                // }

                // if(num == "0"){
                //     return;
                // }

                // var oId = "#__xmlview0--vboxB" + num;

                // $(oId)[0].style.backgroundColor="rgb(252, 221, 233)";

                // alert("11");
                // console.log(e);
            },
            onCancelPrss: function(e){
                this.getOwnerComponent().getRouter().navTo("mainPage", {} );
            },
            onClosePress: function(e){
                this._oData = { flag : 0 };
                this._oModel.setData(this._oData);
                this.getView().setModel(this._oModel ,"AAA");
                console.log(this.getView().getModel("AAA"));
                this._clickEvent("0");
            },
            onNavBack: function(e){
                this.getOwnerComponent().getRouter().navTo("mainPage", {} );
            }
		});
	});
