sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/m/MessageBox",
	"sap/ui/core/message/Message",
    "sap/ui/core/MessageType",
    "sap/ui/core/ValueState",					
    "sap/ui/model/Filter",

], function (Controller, MessageBox, Message, MessageType, ValueState, Filter) {
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
        , onValidationTest : function(oEvent){
            var oControl;

            oControl = oEvent.getSource();
            
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

            if(sEleName === "sap.m.ComboBox"){
                if(!sValue && oControl.getValue()){
                    oControl.setValueState(ValueState.Error);
                    oControl.setValueStateText("옳바른 값을 선택해 주십시오.");
                    oControl.focus();
                    return false;
                }
            }else if(oContext && oContext.getType()){
                if(oContext.getType().getMetadata().getName() === "sap.ui.model.odata.type.Decimal"){
                    sValue = sValue.replace(/,/gi, "");
                }
                try{
                    oContext.getType().validateValue(sValue);
                }catch(e){
                    oControl.setValueState(ValueState.Error);
                    oControl.setValueStateText(e.message);
                    oControl.focus();
                    return false;
                }
            }
            
            oControl.setValueState(ValueState.None);
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
                    }
                }
                
                if(sEleName === "sap.m.ComboBox"){
                    if(!sValue && oControl.getValue()){
                        oControl.setValueState(ValueState.Error);
                        oControl.setValueStateText("옳바른 값을 선택해 주십시오.");
                        oControl.focus();
                        return false;
                    }
                }else if(oContext && oContext.getType()){
                    if(oContext.getType().getMetadata().getName() === "sap.ui.model.odata.type.Decimal"){
                        sValue = sValue.replace(/,/gi, "");
                    }
                    try{
                        oContext.getType().validateValue(sValue);
                    }catch(e){
                        oControl.setValueState(ValueState.Error);
                        oControl.setValueStateText(e.message);
                        oControl.focus();
                        return false;
                    }
                }
                
                oControl.setValueState(ValueState.None);

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
        , convToJsonTree: function (oData) {
            var tree = {}, data = oData.results || oData.value;
            data.map(function (d) {
                d["level"] = d.evaluation_article_path_code.split("^").length - 1;
                d["nodes"] = [];
                return d;
            });
            // 0
            tree = data.reduce(function (t, d) {
                if (d.level == 0) t.push(d);
                return t;
            }, []);
            // 1
            tree = data.reduce(function (t, d) {
                if (d.level == 1) {
                    t.map(function (t0) {
                        if (t0.node_id == d.parent_id) {
                            t0.nodes.push(d);
                        }
                        return t0;
                    });
                }
                return t;
            }, this._deepCopy(tree));
            // 2
            tree = data.reduce(function (t, d) {
                if (d.level == 2) {
                    t.map(function (t0) {
                        t0.nodes.map(function (t1) {
                            if (t1.node_id == d.parent_id) {
                                t1.nodes.push(d);
                            }
                            return t1;
                        });
                        return t0;
                    });
                }
                return t;
            }, this._deepCopy(tree));
            // 3
            tree = data.reduce(function (t, d) {
                if (d.level == 3) {
                    t.map(function (t0) {
                        t0.nodes.map(function (t1) {
                            t1.nodes.map(function (t2) {
                                if (t2.node_id == d.parent_id) {
                                    t2.nodes.push(d);
                                }
                                return t2;
                            });
                            return t1;
                        });
                        return t0;
                    });
                }
                return t;
            }, this._deepCopy(tree));
            // 4
            tree = data.reduce(function (t, d) {
                if (d.level == 4) {
                    t.map(function (t0) {
                        t0.nodes.map(function (t1) {
                            t1.nodes.map(function (t2) {
                                t2.nodes.map(function (t3) {
                                    if (t3.node_id == d.parent_id) {
                                        t3.nodes.push(d);
                                    }
                                    return t3;
                                });
                                return t2;
                            });
                            return t1;
                        });
                        return t0;
                    });
                }
                return t;
            }, this._deepCopy(tree));
            // 5
            tree = data.reduce(function (t, d) {
                if (d.level == 5) {
                    t.map(function (t0) {
                        t0.nodes.map(function (t1) {
                            t1.nodes.map(function (t2) {
                                t2.nodes.map(function (t3) {
                                    t3.nodes.map(function (t4) {
                                        if (t4.node_id == d.parent_id) {
                                            t4.nodes.push(d);
                                        }
                                        return t4;
                                    });
                                    return t3;
                                });
                                return t2;
                            });
                            return t1;
                        });
                        return t0;
                    });
                }
                return t;
            }, this._deepCopy(tree));

            return [ tree, oData ];
        },

        read: function (oModel, path, parameters, aHeaderFilters) {
            var that = this;
            return new Promise(function (resolve, reject) {
                oModel.read(path, jQuery.extend(parameters, {
                    success: resolve,
                    error: reject
                }));
            }).then(function (oData) {
                // filter
                var filters = parameters.filters;
                // 검색조건 및 결과가 없는 경우 종료
                if (filters.filter(function(f) { return f.sPath === 'evaluation_article_type_code' || f.sPath === 'tolower(evaluation_article_name)' }).length <= 0
                    ||
                    !oData || !(oData.results) || oData.results.length <= 0) {
                    return that.convToJsonTree(oData);
                }
                    
                var aDataKeys = [];
                var aDummyFilters = [];
                oData.results.forEach(function(oRowData){
                    for(var i = 1, len = 5; i < 6; i++){
                        var sCode = oRowData["evaluation_article_level" + i + "_code"];
                        if(!sCode){
                            continue;
                        }
                        if(aDataKeys.indexOf(sCode) === -1){
                            aDataKeys.push(sCode);
                            aDummyFilters.push(
                                new Filter({ path : "evaluation_article_code", operator : "EQ", value1 : sCode })
                            );
                        }
                    }
                });
                aHeaderFilters.push(
                    new Filter({ filters : aDummyFilters, and : false })
                );


                // 필터링된 Node 만을 호출한다.
                return new Promise(function (resolve, reject) {
                    oModel.read(path, jQuery.extend(parameters, {
                        filters: [...aHeaderFilters],
                        success: resolve,
                        error: reject
                    }))
                }).then(function (oData) {
                    return that.convToJsonTree(oData);
                });
            })
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

            oBingModel.setProperty(oBindContxtPath, oRowData);

            this.onValidationTest(oEvent);
        }
	});
});