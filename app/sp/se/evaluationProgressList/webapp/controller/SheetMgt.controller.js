sap.ui.define([
	    "./BaseController",					
        "sap/ui/model/Filter",						
        "sap/ui/model/Sorter",			
        "sap/m/MessageBox",
        "ext/lib/util/Multilingual",
        "sap/ui/core/ListItem",
        "sap/m/SegmentedButtonItem",
        "sap/suite/ui/commons/CalculationBuilderVariable",
        "sap/uxap/ObjectPageHeaderContent"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function ( Controller, Filter, Sorter, MessageBox, 
        Multilingual, ListItem, SegmentedButtonItem, 
        CalculationBuilderVariable, ObjectPageHeaderContent ) {
        "use strict";
        
		return Controller.extend("sp.se.evalProgressList.controller.SheetMgt", {

			onInit: function () {
                var oView,oMultilingual;
                
                oView = this.getView();
                oMultilingual = new Multilingual();
                oView.setModel(oMultilingual.getModel(), "I18N");

                // this.getOwnerComponent().getRouter().getRoute("SheetMgt").attachPatternMatched(this._onPatternMatched, this);
                
            }
            , onAfterRendering: function () {
                var oSheetMgtPage;

                oSheetMgtPage = this.byId("sheetMgtPage");
                // let sId = oSheetMgtPage.getHeaderContent()[0].getParent().getId();
                // jQuery("#"+sId).removeClass("sapUxAPObjectPageHeaderContent");

                oSheetMgtPage.getHeaderContent()[0].getParent().onAfterRendering = function(){
                    jQuery("#"+this.getId()).removeClass("sapUxAPObjectPageHeaderContent");
                }
            }
            /**
             * Detail PatternMatched
             */
            , _onPatternMatched: function (e) {
                var oArgs, oComponent, oViewModel;

                oArgs = e.getParameter("arguments");
                oComponent = this.getOwnerComponent();
                oViewModel = oComponent.getModel("viewModel");

                oViewModel.setProperty("/Args", oArgs);
                this._readHeader();
            }
            /**
             * scale 데이터 조회
             */
            , _readHeader : function(){

            }
            /**
             * detail 페이지 종료
             */
            , onPressPageNavBack : function(){
                
                this.getOwnerComponent().getRouter().navTo("Master");
            }
            /**
             * 해당 상세 평가 삭제
             */
            , onPressDelete : function(){
                var sURLPath, oSaveData, oView, oViewModel, oArgs, oComponent,
                    oI18NModel;

                oView = this.getView();
                oI18NModel = oView.getModel("I18N");
                oViewModel = oView.getModel("viewModel");
                oArgs = oViewModel.getProperty("/Args");
                oComponent = this.getOwnerComponent();
                sURLPath = "srv-api/odata/v4/sp.evalProgressListV4Service/EvalItemSaveProc";

                if(oArgs.new === "Y"){
                    return;
                }

                MessageBox.confirm(oI18NModel.getProperty("/NCM00003"),{
                    onClose: function (sAction) {
                        if(sAction === MessageBox.Action.CANCEL){
                            return;
                        }
                        
                        oSaveData = this._getSaveData("D");
                        if(!oSaveData){
                            return;
                        }
                        oView.setBusy(true);
                        $.ajax({
                            url: sURLPath,
                            type: "POST",
                            data: JSON.stringify(oSaveData),
                            contentType: "application/json",
                            success: function (data) {
                                MessageBox.success(oI18NModel.getProperty("/NCM01002"), {
                                    onClose : function (sAction) {
                                        oView.setBusy(false);
                                        oComponent.getRouter().navTo("Master",{
                                            search : true
                                        });
                                    }
                                });
                            },
                            error: function (e) {
                                var sDetails;

                                sDetails = "";
                                try{
                                    sDetails += "<p><strong>" + e.responseJSON.error.code + "</strong></p>\n" +
                                    "<ul>" +
                                        "<li>" + e.responseJSON.error.message + "</li>" +
                                    "</ul>";
                                }catch(error){
                                    
                                }

                                MessageBox.error(e.status + " - " + e.statusText,{
                                    title: "Error",
                                    details : sDetails
                                })
                                oView.setBusy(false);
                            }
                        });
                    }.bind(this)
                });
            }
            /***
             * 해당 상세 평가 저장
             */
            , onPressSave : function(){
                var sURLPath, oSaveData, oView, oViewModel, oArgs, oComponent,
                    oI18NModel;

                oView = this.getView();
                oI18NModel = oView.getModel("I18N");
                oViewModel = oView.getModel("viewModel");
                oArgs = oViewModel.getProperty("/Args");
                oComponent = this.getOwnerComponent();

                MessageBox.confirm(oI18NModel.getProperty("/NCM00001"),{
                    onClose: function (sAction) {
                        if(sAction === MessageBox.Action.CANCEL){
                            return;
                        }
                        if(!this._checkValidation()){
                            return;
                        }
                        if(oArgs.new === "Y"){
                            sURLPath = "srv-api/odata/v4/sp.evalProgressListV4Service/CreateEvalItemSaveProc";
                        }else{
                            sURLPath = "srv-api/odata/v4/sp.evalProgressListV4Service/EvalItemSaveProc";
                        }
                        
                        oSaveData = this._getSaveData("U");
                        if(!oSaveData){
                            return;
                        }
                        oView.setBusy(true);
                        $.ajax({
                            url: sURLPath,
                            type: "POST",
                            data: JSON.stringify(oSaveData),
                            contentType: "application/json",
                            success: function (data) {
                                MessageBox.success(oI18NModel.getProperty("/NCM01001"), {
                                    onClose : function (sAction) {
                                        oView.setBusy(false);
                                        if(oArgs.new === "Y"){
                                            oComponent.getRouter().navTo("Master",{
                                                search : true
                                            });
                                            return;
                                        }
                                        this._readHeader();
                                    }.bind(this)
                                });
                            }.bind(this),
                            error: function (e) {
                                var sDetails;

                                sDetails = "";
                                try{
                                    sDetails += "<p><strong>" + e.responseJSON.error.code + "</strong></p>\n" +
                                    "<ul>" +
                                        "<li>" + e.responseJSON.error.message + "</li>" +
                                    "</ul>";
                                }catch(error){
                                    
                                }

                                MessageBox.error(e.status + " - " + e.statusText,{
                                    title: "Error",
                                    details : sDetails
                                })
                                oView.setBusy(false);
                            }
                        });
                    }.bind(this)
                });
            }
            /**
             * 저장시 Validation 필수값 확인
             * 
             */
            , _checkValidation : function(){
                var bValid, oView, oViewModel, oArgs, aControls;
                
                oView = this.getView();
                oViewModel = oView.getModel("viewModel");
                oArgs = oViewModel.getProperty("/Args");
                bValid = false;

                if(oArgs.new === "Y"){
                    aControls = oView.getControlsByFieldGroupId("newRequired");
                    bValid = this._isValidControl(aControls);
                }else{
                    aControls = oView.getControlsByFieldGroupId("detailRequired");
                    bValid = this._isValidControl(aControls);
                }

                return bValid;
            }
            /***
             * 저장시 데이터 구조 맞추기
             */
            , _getSaveData : function(sTransactionCode){
                var oSaveData, oUserInfo, oView, oViewModel,
                    aItemFields, aScleFields, oHeader, oItemType,
                    sHeadField, aScleItem, oNewHeader, sLevel, oArgs,
                    oI18NModel;

                oUserInfo = this._getUserSession();
                oView = this.getView();
                oViewModel = oView.getModel("viewModel");
                oHeader = oViewModel.getProperty("/Detail/Header");
                oArgs = oViewModel.getProperty("/Args");

                aItemFields = [
                ];
                aScleFields = [
                ];

                oSaveData = {
                    ItemType : [],
                    ScleType : []
                };

                oItemType = {};

                for(sHeadField in oHeader){
                    if(
                        oHeader.hasOwnProperty(sHeadField) && 
                        aItemFields.indexOf(sHeadField) > -1 && 
                        oHeader[sHeadField]
                    ){
                        oItemType[sHeadField] = oHeader[sHeadField];
                    }
                }

                oItemType.transaction_code = sTransactionCode;
                oSaveData.ItemType.push(oItemType);

                aScleItem = oViewModel.getProperty("/Detail/Item");
                aScleItem.forEach(function(oRowData){
                    var oNewRowData, sScleField;
                    oNewRowData = {};

                    if(!oRowData.transaction_code){
                        return;
                    }

                    for(sScleField in oRowData){
                        if(
                            oRowData.hasOwnProperty(sScleField) && 
                            aScleFields.indexOf(sScleField) > -1 && 
                            oRowData[sScleField]
                        ){
                            oNewRowData[sScleField] = oRowData[sScleField];
                        }
                    }

                    oSaveData.ScleType.push(oNewRowData);
                });


                return oSaveData;
            }
            /***
             * 수정 변경모드 
             */
            , onPressModeChange : function(oEvent, sGubun){
                var oView, oViewModel, bEditFlg, oComponent, oMasterPage, oTreeTable,
                    aSelectedIdices, oContext, oRowData, oI18NModel;

                oView = this.getView();
                oViewModel = oView.getModel("viewModel");
                bEditFlg = oViewModel.getProperty("/App/EditMode");

                if(sGubun === "CANCEL"){
                    oI18NModel = oView.getModel("I18N");
                    MessageBox.warning(oI18NModel.getProperty("/NPG00013"),{
                        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                        onClose: function (sAction) {
                            if(sAction === MessageBox.Action.CANCEL){
                                return;
                            }
                            this._readHeader();
                        }.bind(this)
                    });
                }else{
                    oViewModel.setProperty("/App/EditMode", !bEditFlg);
                }
            }
		});
	});
