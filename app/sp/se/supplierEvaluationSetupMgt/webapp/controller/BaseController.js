sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/m/MessageBox",
	"sap/ui/core/message/Message",
    "sap/ui/core/MessageType",
    "sap/ui/core/ValueState",					
    "sap/ui/model/Filter",
    "ext/lib/util/SppUserSessionUtil",
    "sap/ui/model/json/JSONModel"

], function (Controller, MessageBox, Message, MessageType, ValueState, Filter, SppUserSessionUtil, JSONModel) {
	"use strict";

	return Controller.extend("sp.se.supplierEvaluationSetupMgt.controller.BaseController", {
        onSelectIconTabBar : function(oEvent){
            var oControl, sSelectedKey;

            oControl = oEvent.getSource();
            sSelectedKey = oEvent.getParameter("selectedKey");

            this.getOwnerComponent().getRouter().navTo(sSelectedKey, {new :"Y"});
        },
        onPressNavBack : function(oEvent){

            // this.getOwnerComponent().getRouter().navTo("MainList", {search :"Y"});
        },
        /**
         * detail 페이지 종료
         */
        onPressPageNavBack : function(){
            // this.getOwnerComponent().getRouter().navTo("Master");
        },
        /***
         * OdataModel read를 위한 함수 프로미스 구현
         * @Param oParam.model OdataModel
         * @Param oParam.entity EntityName
         * @Param oParam.param Read Parameters
         */
        _readOdata : function(oParam){
            var oModel, sPath, mParameters, fnSuccess, fnError;

            oModel = oParam.model;
            sPath = oParam.path;
            mParameters = oParam.param;
            
            if(jQuery.isEmptyObject(mParameters)){
                mParameters = {};
            }
            fnSuccess = mParameters.success;
            fnError = mParameters.error;

            return new Promise(function (resolve, reject) {
                oModel.read(sPath, 
                    jQuery.extend(mParameters, {
                        success : function(){
                            if(fnSuccess && typeof fnSuccess === "function"){
                                fnSuccess.apply(mParameters, arguments);
                            }
                            resolve(arguments);
                        },
                        error : function(){
                            if(fnError && typeof fnError === "function"){
                                fnError.apply(mParameters, arguments);
                            }
                            reject(arguments);
                        }
                    })
                );
            });
        }
        /***
         * 세션 유저정보를 가져온다.
         */
        , _getUserSession : function(){
            var oComponent, oUserModel, oUserInfo, oSessionUserInfo;

            oComponent = this.getOwnerComponent();
            oUserModel = oComponent.getModel("User");

            if(!oUserModel){
                oSessionUserInfo = this.getSessionUserInfo();

                oSessionUserInfo.evalPersonEmpno = "5480";

                oUserModel = new JSONModel(oSessionUserInfo);
                oComponent.setModel("User", oUserModel);
            }

            oUserInfo = oUserModel.getProperty("/");

            return oUserInfo;
        }
        /***
         * Control 유형에 따른 필수 값 확인
         */
        , _isValidControl : function(aControls){
            var oMessageManager = sap.ui.getCore().getMessageManager(),
                bAllValid = false,
                oI18n = this.getView().getModel("I18N");
                
            oMessageManager.removeAllMessages();
            bAllValid = aControls.every(function(oControl){
                var sEleName = oControl.getMetadata().getElementName(),
                    sValue, oContext;
                
                switch(sEleName){
                    case "sap.m.Input":
                    case "sap.m.TextArea":
                        sValue = oControl.getValue();
                        oContext = oControl.getBinding("value");
                        break;
                    case "sap.m.ComboBox":
                        sValue = oControl.getSelectedKey();
                        break;
                    case "sap.m.MultiComboBox":
                        sValue = oControl.getSelectedKeys().length;
                        break;
                    default:
                        return true;
                }
                
                if(!oControl.getProperty('enabled')) return true;
                if(!oControl.getProperty('editable')) return true;
                if(oControl.getProperty('required')){
                    if(!sValue){
                        oControl.setValueState(ValueState.Error);
                        oControl.setValueStateText(oI18n.getText("/ECM01002"));
                        oMessageManager.addMessages(new Message({
                            message: oI18n.getText("/ECM01002"),
                            type: MessageType.Error
                        }));
                        bAllValid = false;
                        oControl.focus();
                        return false;
                    }else{
                        oControl.setValueState(ValueState.None);
                    }
                }
                
                if(oContext&&oContext.getType()){
                    try{
                        oContext.getType().validateValue(sValue);
                    }catch(e){
                        oControl.setValueState(ValueState.Error);
                        oControl.setValueStateText(e.message);
                        oControl.focus();
                        return false;
                    }
                    oControl.setValueState(ValueState.None);
                }else if(sEleName === "sap.m.ComboBox"){
                    if(!sValue && oControl.getValue()){
                        oControl.setValueState(ValueState.Error);
                        oControl.setValueStateText("옳바른 값을 선택해 주십시오.");
                        oControl.focus();
                        return false;
                    }else{
                        oControl.setValueState(ValueState.None);
                    }
                }
                // else{
                //     if(oControl.getValueState() !== "Error"){
                //         oControl.focus();
                //         return false;
                //     }
                // }

                return true;
            });

            return bAllValid;
        }
        /**
         * ValueState 초기화
         */
        , _clearValueState : function(aControls){
             aControls.forEach(function(oControl){
                var sEleName = oControl.getMetadata().getElementName(),
                    sValue;
                
                switch(sEleName){
                    case "sap.m.Input":
                    case "sap.m.TextArea":
                    case "sap.m.ComboBox":
                        break;
                    default:
                        return;
                }
                oControl.setValueState(ValueState.None);
                oControl.setValueStateText();
            });
        }
        /**
         * 저장시 Validation 필수값 확인
         * 
         */
         ,_checkValidation : function(oModel){
            var bValid, oView, oViewModel, oArgs, aControls;
            
            oView = this.getView();
            oViewModel = oModel;
            // oArgs = oViewModel.getProperty("/Args");
            bValid = false;

            // if(this.scenario_number === "New"){
            //     aControls = oView.getControlsByFieldGroupId("newRequired");
            //     bValid = this._isValidControl(aControls);
            // }else{
                aControls = oView.getControlsByFieldGroupId("required");
                bValid = this._isValidControl(aControls);
            // }

            return bValid;
        }
        
        /**
         * deep Copy 
         */
        , _deepCopy : function(oData){
            var oNewObj;
            
            if(oData && typeof oData === "object" && !(oData instanceof Date)){
                if(Array.isArray(oData)){
                    oNewObj = [];
                }else{
                    oNewObj = {};
                }
                for(var key in oData){
                    if(oData.hasOwnProperty(key)){
                        oNewObj[key] = this._deepCopy( oData[key] );
                    }
                }
            }else{
                oNewObj = oData;
            }

            return oNewObj;
        }
       
           ,_onKeyLiveChange: function(oEvent){
            var _oInput = oEvent.getSource();
            var val = _oInput.getValue();
            //     val = val.replace(/[^\d]/g, '');
                
            // _oInput.setValue(val);

            // var blank_pattern = /[\s]/g;
            // if( blank_pattern.test(val) == true){
                // MessageToast.show(' 공백은 사용할 수 없습니다. ');

                // val = val.replace(/[ㄱ-힣~!@#$%^&*()_+|<>?:{}= ]/g,'');
                val = val.replace(/[^A-Za-z0-9]/ig, '');
                _oInput.setValue(val);
            // }

            }

            ,_onNumberLiveChange: function(oEvent){
            var _oInput = oEvent.getSource();
            var val = _oInput.getValue();


                val = val.replace(/[0-9]/ig, '');

                _oInput.setValue(val);

            }

            ,_onGradeLiveChanage: function(oEvent){
            var _oInput = oEvent.getSource();
            var val = _oInput.getValue();


                val = val.replace(/[^0-9.]/ig, '');

                _oInput.setValue(val);

            }

            

            
            
	});
});