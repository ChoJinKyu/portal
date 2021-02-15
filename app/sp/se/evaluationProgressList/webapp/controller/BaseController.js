sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/m/MessageBox",
	"sap/ui/core/message/Message",
    "sap/ui/core/MessageType",
    "sap/ui/core/ValueState",					
    "sap/ui/model/Filter",

], function (Controller, MessageBox, Message, MessageType, ValueState, Filter) {
	"use strict";

	return Controller.extend("sp.se.evalProgressList.controller.BaseController", {
        onSelectIconTabBar : function(oEvent){
            var oControl, sSelectedKey;

            oControl = oEvent.getSource();
            sSelectedKey = oEvent.getParameter("selectedKey");

            this.getOwnerComponent().getRouter().navTo(sSelectedKey,{new :"Y"});
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
            var oUserInfo;
            
            oUserInfo = {
                loginUserId : "TestUser",
                tenantId : "L2100",
                companyCode : "LGCKR",
                orgTypeCode : "BU",
                orgCode : "BIZ00100",
                evalPersonEmpno : "5480"
            };

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
                    default:
                        return true;
                }
                
                // if(!oControl.getProperty('enabled')) return true;
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
                
                if(oContext && oContext.getType()){
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
        
        /***
         * Bind Items
         */
        , _setBindItems : function(oParam){
            this.byId(oParam.id).bindItems({
                path : oParam.path,
                filters : oParam.filters,
                sorter : oParam.sorter,
                template : oParam.template
            });
        }

        , onChangeEdit : function(oEvent){
            var oControl, oContext, oBindContxtPath, oBingModel, oRowData;

            oControl = oEvent.getSource();
            oContext = oControl.getBindingContext("viewModel");
            oBingModel = oContext.getModel();
            oBindContxtPath = oContext.getPath();
            oRowData = oContext.getObject();

            if(oRowData.crudFlg === "D"){
                return;
            }else if(oRowData.crudFlg === "C"){
                oBingModel.setProperty(oBindContxtPath, oRowData);
                return;
            }

            oRowData.crudFlg = "U";
            oRowData.transaction_code = "U";

            oBingModel.setProperty(oBindContxtPath, oRowData)
        }
	});
});