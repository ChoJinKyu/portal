sap.ui.define([
		"sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "ext/lib/util/Multilingual",
        "sap/ui/core/Component",
        "sap/ui/core/routing/HashChanger",
        "sap/ui/core/ComponentContainer",
        "sap/m/MessageToast",
        "sap/ui/model/odata/v4/ODataModel"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, JSON, Multilingual, Component, HashChanger, ComponentContainer, MessageToast, ODataModel) {
        "use strict";
        
               

		return Controller.extend("sp.sc.scQBCreate.controller.MainList", {
            oServiceModel: new ODataModel({
                serviceUrl: "srv-api/odata/v4/sp.sourcingV4Service/",
                // defaultBindingMode: "OneWay",
                // defaultCountMode: "Inline",
                // refreshAfterChange: false,
                synchronizationMode:"None"
                // useBatch: true
            }),
			onInit: function () {

                // I18N 모델 SET
                var oMultilingual = new Multilingual();
                this.getView().setModel(oMultilingual.getModel(), "I18N");

                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("mainPage").attachPatternMatched(this._onProductMatched, this);
                
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
                // 

                var a =
                jQuery.ajax({
                    async: false,
                    // url: "sp/sc/scQBCreate/webapp/srv-api/odata/v4/sp.negoHeadersService/Sc_Nego_Type_Code?&$orderby=evaluation_type/sort_no,sort_no&$select=tenant_id,nego_type_code,nego_type_name,evaluation_type&$expand=nego_parent_type($select=nego_parent_type_name),evaluation_type($select=evaluation_type_name),Outcomes($select=outcome_name)", 
                    // url: "sp/sc/scQBCreate/webapp/srv-api/odata/v4/sp.sourcingV4Service/Sc_Nego_Type_Code?&$orderby=evaluation_type/sort_no,sort_no&$select=tenant_id,nego_type_code,nego_type_name,evaluation_type&$expand=nego_parent_type($select=nego_parent_type_name),evaluation_type($select=evaluation_type_name),Outcomes($orderby=sort_no;$select=outcome_name)", 
                    url: "sp/sc/scQBCreate/webapp/srv-api/odata/v4/sp.sourcingV4Service/Sc_Nego_Type_Code?&$orderby=nego_supeval_type/sort_no,sort_no&$select=tenant_id,nego_type_code,nego_type_name,nego_supeval_type&$expand=nego_parent_type($select=nego_parent_type_name),nego_supeval_type($select=nego_supeval_type_name),Outcomes($orderby=sort_no;$select=outcome_name)", 

                    contentType: "application/json",
                    success: function(oData2){ 
                        
                        return oData2.value;
                        
                        // this.getModel("tblModel").setProperty("/right",oData2.value);
                        //setTimeout(this.onSetColor(), 3000); //화면그려지고 호출될때도 있지만 그려지기 전에 호출되기도 함
                    }.bind(this)                        
                });


                // var b = this.byId("rbg1");
                // var addButton = new sap.m.RadioButton( {text: "123"} );
                // b.addButton(addButton);
                // b.addButton(addButton);
                // b.addButton(addButton);




                var oNego = a.responseJSON.value;
                console.log("Array ========================== ", oNego);

                // Outcome Radio Button Text
                var oRbg = [];
                var temp = {
                    "nego_supeval_type": { OP : "", PNP : ""  },
                    "RFQ": { nego_name : "", outcome: [] }, 
                    "CPB": { nego_name : "", outcome: [] }, 
                    "RFP": { nego_name : "", outcome: [] }, 
                    "TSB": { nego_name : "", outcome: [] }  
                };
                for(var i=0; i<oNego.length; i++){
                    var oNegoRow = oNego[i];
                    if(oNegoRow.nego_type_code == "RFQ"){    //견적
                        temp.RFQ.nego_name =  oNegoRow.nego_type_name;
                        temp.nego_supeval_type.OP = oNegoRow.nego_supeval_type.nego_supeval_type_name ;   //가격 Text
                        for(var j=0; j<oNegoRow.Outcomes.length; j++){
                            var outcome = oNegoRow.Outcomes[j];
                            temp.RFQ.outcome.push({ name : outcome.outcome_name});
                        }
                    }else if(oNegoRow.nego_type_code == "CPB"){    //입찰 
                        temp.CPB.nego_name =  oNegoRow.nego_type_name;
                        for(var j=0; j<oNegoRow.Outcomes.length; j++){
                            var outcome = oNegoRow.Outcomes[j];
                            temp.CPB.outcome.push({ name : outcome.outcome_name});
                        }
                    }else if(oNegoRow.nego_type_code == "RFP"){    //견적
                        temp.RFP.nego_name =  oNegoRow.nego_type_name;
                        temp.nego_supeval_type.PNP = oNegoRow.nego_supeval_type.nego_supeval_type_name ;   //가격 + 비가격 Text
                        for(var j=0; j<oNegoRow.Outcomes.length; j++){
                            var outcome = oNegoRow.Outcomes[j];
                            temp.RFP.outcome.push({ name : outcome.outcome_name});
                        }
                    }else if(oNegoRow.nego_type_code == "TSB"){    //견적
                        temp.TSB.nego_name =  oNegoRow.nego_type_name;
                        for(var j=0; j<oNegoRow.Outcomes.length; j++){
                            var outcome = oNegoRow.Outcomes[j];
                            temp.TSB.outcome.push({ name : outcome.outcome_name});
                        }
                    }
                }
                
                var radioModel = new JSON(temp);
                // radioModel.setData(oRbg);
                this.getView().setModel(radioModel ,"rbg");
                var nego = new JSON(oNego);
                this.getView().setModel(nego ,"nego");

                // 

                // this.oServiceModel.read("/Sc_Nego_Type_Code",{
                // // oModel.read("mainV4/Sc_Nego_Type_Code?&$orderby=evaluation_type/sort_no,sort_no&$select=tenant_id,nego_type_code,nego_type_name,evaluation_type&$expand=nego_parent_type($select=nego_parent_type_name),evaluation_type($select=evaluation_type_name),Outcomes($select=outcome_name)",{
                //     success: function(oData){
                //         
                //     }.bind(this)                    
                // });

                // oModel.read("/NegoHeaders", {
                //     // filters: aTableSearchState,
                //     // sorters: [
                //     // 	new Sorter("chain_code"),
                //     // 	new Sorter("message_code"),
                //     //     new Sorter("language_code", true)
                //     // ],
                //     success: function(oData){
                //         // this.validator.clearValueState(this.byId("mainTable"));
                //         // this.byId("mainTable").clearSelection();
                //         oView.setBusy(false);
                //     }.bind(this)
                // });

                



            },
            alignPartnerStatus: function(e){
                return "Center";
            },
            onApplyePress: function(e){

                if(!this._nego){
                    this._nego = this.getView().getModel("nego").oData;
                }
                var type ;      // Negotiation Type
                if(this._cNum == "1"){                          // RFQ (견적 계획)
                    type ="RFQ";
                }else if(this._cNum == "2"){                    // Competitive Bidding (입찰 계획)
                    type ="CPB";
                }else if(this._cNum == "3"){                    // RFP (견적 계획)
                    type ="RFP";
                }else if(this._cNum == "4"){                    // 2-Step Bidding (입찰 계획)
                    type ="TSB";
                }
                

                var oRbgName = "rbg" + this._cNum ;
                var oRbg = this.getView().byId(oRbgName);
                var outcomeText =oRbg.getSelectedButton().getText();
                var outcomeCode;

                for(var i=0; i<this._nego.length; i++){
                    var nego = this._nego[i];
                    if(nego.nego_type_code == type){
                        var negoOutcomes = nego.Outcomes;
                        for(var j=0; j<negoOutcomes.length; j++){
                            var negoOutcome = negoOutcomes[j];
                            if(negoOutcome.outcome_name == outcomeText){
                                outcomeCode = negoOutcome.outcome_code;
                                break;
                            }
                        }
                    }
                }




                // var outcome = oRbg.getSelectedIndex() + 1;
                
                // // 기존 시작 =========================================================================================
                // if( this._cNum == "1" || this._cNum =="3"){
                //     this.getOwnerComponent().getRouter().navTo("detailPage", { type : this._cNum, outcome : String(outcome) } );
                // }else{
                //     this.getOwnerComponent().getRouter().navTo("detailPage2", { type : this._cNum, outcome : String(outcome) } );
                // }
                // this._clickEvent("0");
                // // 기존 끝 =========================================================================================

                // App To App

                //portal에 있는 toolPage 
                var oToolPage = this.getView().oParent.oParent.oParent.oContainer.oParent;
                //이동하려는 app의 component name,url
                var sComponent = "sp.sc.scQBPages",
                    sUrl = "../sp/sc/scQBPages/webapp";
                    
                //  생성 구분 코드(NC : Negotiation Create, NW : Negotiation Workbench) / Negotiation Type / outcome 
                var changeHash =  "NC/" + type + "/" + outcomeCode ;   
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

                //test
                

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
