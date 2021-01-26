sap.ui.define([
		"sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "ext/lib/util/Multilingual",
        "sap/ui/core/Component",
        "sap/ui/core/routing/HashChanger",
        "sap/ui/core/ComponentContainer",
        "sap/m/MessageToast"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, JSON, Multilingual, Component, HashChanger, ComponentContainer, MessageToast) {
        "use strict";
               

		return Controller.extend("sp.sc.scQBCreate.controller.MainList", {
			onInit: function () {

                // I18N 모델 SET
                var oMultilingual = new Multilingual();
                this.getView().setModel(oMultilingual.getModel(), "I18N");

                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("createPage").attachPatternMatched(this._onProductMatched, this);
                
                this._oModel = new JSON();
            
                this._oData = { flag : 0 };
                this._oModel.setData(this._oData);
                this.getView().setModel(this._oModel ,"AAA");
                var vboxB1 = this.getView().byId("vboxB1");
                vboxB1.attachBrowserEvent("click", function(event) {
                    this._clickEvent("1");
                }, this);

                var vboxB2 = this.getView().byId("vboxB2");
                vboxB2.attachBrowserEvent("click", function(event) {
                    this._clickEvent("2");
                    
                }, this);
                var vboxB3 = this.getView().byId("vboxB3");
                vboxB3.attachBrowserEvent("click", function(event) {
                    this._clickEvent("3");
                }, this);
                var vboxB4 = this.getView().byId("vboxB4");
                vboxB4.attachBrowserEvent("click", function(event) {
                    this._clickEvent("4");
                }, this);
                // this.oRouter.attachPatternMatched(this._onProductMatched, this);

            },
            
            onApplyePress: function(e){
                var oRbgName = "rbg" + this._cNum ;
                var oRbg = this.getView().byId(oRbgName);
                var outcome = oRbg.getSelectedIndex() + 1;
                

                debugger;

                // // 기존 시작 =========================================================================================
                // if( this._cNum == "1" || this._cNum =="3"){
                //     this.getOwnerComponent().getRouter().navTo("detailPage", { type : this._cNum, outcome : String(outcome) } );
                // }else{
                //     this.getOwnerComponent().getRouter().navTo("detailPage2", { type : this._cNum, outcome : String(outcome) } );
                // }
                // this._clickEvent("0");
                // // 기존 끝 =========================================================================================

                // App To App Test
                
                //portal에 있는 toolPage 
                var oToolPage = this.getView().oParent.oParent.oParent.oContainer.oParent;
                //이동하려는 app의 component name,url
                var sComponent = "sp.sc.scQBPages",
                    sUrl = "../sp/sc/scQBPages/webapp";
                    
                //  생성 구분 코드(NC : Negotiation Create, NW : Negotiation Workbench) / Negotiation Type / outcome 
                var changeHash =  "NC" + this._cNum + "/" + String(outcome) + "/" ;   
                HashChanger.getInstance().replaceHash("");

                Component.load({
                    name: sComponent,
                    url: sUrl
                }).then(function (oComponent) {
                    var oContainer = new ComponentContainer({
                        name: sComponent,
                        async: true,
                        url: sUrl
                    });
                    oToolPage.removeAllMainContents();
                    oToolPage.addMainContent(oContainer);
                    //hash setting
                    HashChanger.getInstance().setHash(changeHash);
                }).catch(function (e) {
                    MessageToast.show("error");
                })

                
            },
            _clickEvent: function(num){
                // 라디오 그룹 동적 visibled
                this._oData = { flag : parseInt(num) };
                this._oModel.setData(this._oData);
                this.getView().setModel(this._oModel ,"AAA");
                console.log(this.getView().getModel("AAA"));

                // 라디오 버튼 기본 설정
                if(num != "0"){
                    var rbgId = "rbg" + num;
                    this.getView().byId(rbgId).setSelectedIndex(0);
                }
                

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
                this._cNum = num;

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
