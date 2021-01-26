sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function (Controller, MessageBox) {
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
	});
});