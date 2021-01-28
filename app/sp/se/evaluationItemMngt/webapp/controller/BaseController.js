sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
	"sap/ui/core/message/Message",
    "sap/ui/core/MessageType",
    "sap/ui/core/ValueState"

], function (Controller, MessageBox, Message, MessageType, ValueState) {
	"use strict";

	return Controller.extend("sp.se.evaluationItemMngt.controller.BaseController", {
        /***
         * OdataModel read를 위한 함수 프로미스 구현
         * @Param oParam.model OdataModel
         * @Param oParam.entity EntityName
         * @Param oParam.param Read Parameters
         */
        _readOdata : function(oParam){
            var $Dfferred, oModel, sEntityName, mParameters, fnSuccess, fnError;

            $Dfferred = $.Deferred();
            oModel = oParam.model;
            sEntityName = oParam.entity;
            mParameters = oParam.param;
            
            if($.isEmptyObject(mParameters)){
                mParameters = {};
            }
            fnSuccess = mParameters.success;
            fnError = mParameters.error;

            oModel.read(sEntityName, 
                $.extend(mParameters, {
                    success : function(){
                        if(typeof fnSuccess === "function"){
                            fnSuccess.apply(mParameters, arguments);
                        }
                        $Dfferred.resolve(arguments);
                    },
                    error : function(oError){
                        if(typeof fnError === "function"){
                            fnError.apply(mParameters, arguments);
                        }
                        $Dfferred.reject(arguments);
                        // MessageBox.error("Unable to load data.", {
                        //     title: "Error",
                        //     details: "<p><strong>This can happen if:</strong></p>\n" +
                        //         "<ul>" +
                        //         "<li>You are not connected to the internet</li>" +
                        //         "<li>a backend component is not <em>available</em></li>" +
                        //         "<li>or an underlying system is down</li>" +
                        //         "</ul>" +
                        //         "<p>Get more help <a href='//www.sap.com' target='_top'>here</a>.",
                        //     contentWidth: "100px",
                        //     styleClass: sResponsivePaddingClasses
                        // });
                    }
                })
            );

            return $Dfferred;
        }


        , _isValidControl : function(aControls){
            var oMessageManager = sap.ui.getCore().getMessageManager(),
                bAllValid = false,
                oI18n = this.getView().getModel("I18N");
                
            oMessageManager.removeAllMessages();
            bAllValid = aControls.every(function(oControl){
                var sEleName = oControl.getMetadata().getElementName(),
                    sValue;
                
                switch(sEleName){
                    case "sap.m.Input":
                    case "sap.m.TextArea":
                        sValue = oControl.getValue();
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
                return true;
            });

            return bAllValid;
        }

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
	});
});