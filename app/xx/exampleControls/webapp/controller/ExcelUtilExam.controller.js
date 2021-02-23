sap.ui.define([
    "./Empty.controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "ext/lib/util/ExcelUtil",
    "ext/lib/formatter/Formatter",
    "ext/lib/formatter/DateFormatter"
], function (Controller, JSONModel, MessageBox, MessageToast, ExcelUtil, Formatter, DateFormatter) {
    "use strict";

    return Controller.extend("xx.exampleControls.controller.ExcelUtilExam", {

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */
        formatter: Formatter,

        DateFormatter: DateFormatter,
        
        onInit: function () {

            this._loadResponsibleTableData();
            this._loadGridTableData();
            this.setModel(new JSONModel(), "excelModel");
            this.setModel(new JSONModel({readMode: true, editMode: false}), "displayModel");

            //sheet.js cdn url
            jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.5/xlsx.full.min.js");
        },

        onAfterRendering: function () {
            this.byId("rTable").setModel(this.getModel("rModelList"));
            this.byId("gTable").setModel(this.getModel("gModelList"));
        },

        /**
         * sap.ui.export.Spreadsheet 의 workbook.columns 관련 적용된 options 입니다.
         *
         **** label {string}     : Sheet column 의 Label
         **** width {number}     : Sheet column 의 Width (default 10 으로 적용 됨)
         **** textAlign {string} : Sheet column 의 textAlign
         **** type {string}      : EDM type(format, scale, trueValue 등을 사용하기 위해 type 은 필수 적용해야 한다.)
         **** scale {number}     : 소숫점 표현을 위한 scale
         **** delimiter {boolean} : 숫자 값에 천 단위 구분 기호를 표시 여부
         **** unit {string}      : 숫자 값 옆에 측정 단위 또는 통화로 표시 할 텍스트
         **** inputFormat {string} : 문자열 형식 날짜에 대한 서식 템플릿
         **** template {string}  : Formatting template that supports indexed placeholders within curly brackets
         **** format {string}    : Date, DateTime type 에 대한 formatting template
         **** trueValue {string} : boolean type 의 true 대신 표현할 Text
         **** falseValue {string} : boolean type 의 false 대신 표현할 Text
         *
         **** noExport {boolean} : Table Column 중 exporting 제외 Column 지정(Hidden Column 도 default 로 exporting 합니다.)
         * @param {event} _oEvent 
         * @param {object} _oParam : modelName, path 정보를 전달
         */
        onExportPress: function (_oEvent, _oParam) {

            var oTable = _oEvent.getSource().getParent().getParent();
            var oData = oTable.getModel(_oParam.modelName).getProperty(_oParam.path);//binded Data

            if(!oData || (oData && oData.length < 1) ) {
                MessageBox.error("데이터가 없습니다.", {at : "center center"});
                return;
            }
            /**
             * ComboBox 와 같은 ItemList 의 Code 대신 Text 로 표현 할 경우 CodeList 를 배열에 담아 추가로 전달 합니다.
             */
            //Code Model Context
            var aCtxtCode = Object.keys(this.getModel("common").getContext("/Code").getProperty("/"));

            //CM_CHAIN_CD, CM_LANG_CODE code list
            var aChainCode = [], aLangCode = [];
            aCtxtCode.forEach(function(sCtxt) {
                let oCtxt = this.getModel("common").getContext("/Code").getProperty("/"+sCtxt);
                if(oCtxt.group_code === "CM_CHAIN_CD") {
                    aChainCode.push(oCtxt);
                }
                if(oCtxt.group_code === "CM_LANG_CODE") {
                    aLangCode.push(oCtxt);
                }
            }.bind(this));

            //optional object param
            //aListItem - 코드목록, sBindName - Table 칼럼에 바인딩한 property, sKeyName - 코드목록의 key, sTextName - 코드목록의 text
            var oOption = [
                {aListItem : aChainCode, sBindName : "chain_code", sKeyName : "code", sTextName : "code_name"},
                {aListItem : aLangCode, sBindName : "language_code", sKeyName : "code", sTextName : "code_name"}
            ];// code data는 복수개일 수 있으므로 배열로 전달.

            ExcelUtil.fnExportExcel({
                fileName: "ExportExam",
                table: oTable,
                data: oData,//Table Model data
                success : this._callbackExport//callback 실행이 필요하면 추가 함.
            }, oOption);
        },

        /**
         * Export callback function
         */
        _callbackExport : function() {
            console.log('_callbackExport called');
        }
        ,
        onChangeModePress: function (_oEvent) {
            let oDispModel = this.getModel("displayModel");
            let toBeReadMode = oDispModel.getProperty("/readMode") ? false : true;
            let toBeEditMode = oDispModel.getProperty("/editMode") ? false : true;
            oDispModel.setData({readMode: toBeReadMode, editMode: toBeEditMode});
        },

        /**
         * Excel Importing
         * 1. Uplaod Template 헤더에 Table binding property 가 기입되어 있어야 한다. ex) 회사(company_code), 사업부(division_code)
         * 2. Table Column Header 에 'bindName' key로 binding 될 해당 Column 의 property 명을 기입 한다.
         * 3. Table Column type이 Date, DateTime 인 경우 Excel 해당 Column 셀 서식은 '텍스트' 로 설정 한다.
         * @param {event} _oEvent 
         */
        onImportChange: function (_oEvent, _oParam) {
            var oTable = _oEvent.getSource().getParent().getParent();
            var oModel = oTable.getModel(_oParam.modelName);
            var oExcelModel = this.getModel("excelModel");
            //console.time("importing Sheet");
            oModel.setProperty(_oParam.path, []);
            
            //open BusyDialog
            //Table updateFinished event 에서 setBusy(false) 해 주세요.
            oTable.setBusyIndicatorDelay(0);
            oTable.setBusy(true);
            
            ExcelUtil.fnImportExcel({
                uploader: _oEvent.getSource(),
                file: _oEvent.getParameter("files") && _oEvent.getParameter("files")[0],
                model: oExcelModel,
                success: function () {
                    var aTableData = oModel.getProperty(_oParam.path) || [],
                        aCols = oTable.getColumns(),
                        oExcelData = this.model.getData();

                    if (oExcelData) {
                        var aData = oExcelData[Object.keys(oExcelData)[0]];
                        var aUsedCols;//비슷한 이름의 property 제외하기 위한 array
                        aData.forEach(function (oRow) {
                            var aKeys = Object.keys(oRow),
                                newObj = {}
                                aUsedCols = [];
                            $.each(aCols, function(idx, oCol) {
                                var sName = oCol.data("bindName") || "";//CustomData bindName 이 binding되는 Model property 임.
                                if(!sName) {
                                    return true;
                                }
                                var sType = oCol.data("type") || "";
                                $.each(aKeys, function(idx2, sKeyName) {
                                    if(aUsedCols.indexOf(sName) < 0 && sKeyName.indexOf(sName) > -1) {
                                        var oValue = oRow[sKeyName];
                                        //Table Column 에 CustomeData type이 Date, DateTime 인 경우 Date 형식으로 변환 함.
                                        //DateFormatter 사용 안한다면 string 으로 적용.
                                        if(sType.toUpperCase().indexOf("DATE") > -1) {
                                            oValue = new Date(oValue);
                                        }
                                        newObj[sName] = oValue !== "N/A" ? oValue : "";
                                        aUsedCols.push(sName);
                                        return false;//skip
                                    }
                                });
                            });
                            if(Object.keys(newObj).length > 0) {
                                aTableData.push(newObj);
                            }
                        });
                        oModel.setProperty(_oParam.path, aTableData);
                        //console.timeEnd("importing Sheet");
                    }
                }
            });
        },

        onResetRModelListPress: function () {
            this.getView().getModel("rModelList").setData({});
        },

        onResetGModelListPress: function () {
            this.getView().getModel("gModelList").setData({});
        }, 
        
        onRLoadPress: function () {
            this._loadResponsibleTableData();
        }, 
        
        onGLoadPress: function () {
            this._loadGridTableData();
        },
        
        _loadResponsibleTableData: function () {
            this.setModel(new JSONModel({
                "Message": [
                    {
                        "__metadata": {
                            "id": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ABBREVIATION',language_code='KO')",
                            "uri": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ABBREVIATION',language_code='KO')",
                            "type": "cm.MsgMgrService.Message"
                        },
                        "tenant_id": "L2100",
                        "message_code": "ABBREVIATION",
                        "language_code": "KO",
                        "chain_code": "CM",
                        "message_type_code": "LBL",
                        "message_contents": "약어",
                        "local_create_dtm": new Date(1606974329000),
                        "local_update_dtm": new Date(1606974329000),
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606974351000)/",
                        "system_update_dtm": "/Date(1606974351000)/",
                        "price": "2500000",
                        "currency_code": "KRW",
                        "use_flag": true,
                        "product_name": "Portable DVD player",
                        "product_id": "HT-2001"
                    },
                    {
                        "__metadata": {
                            "id": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ABNORMAL',language_code='KO')",
                            "uri": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ABNORMAL',language_code='KO')",
                            "type": "cm.MsgMgrService.Message"
                        },
                        "tenant_id": "L2100",
                        "message_code": "ABNORMAL",
                        "language_code": "KO",
                        "chain_code": "DP",
                        "message_type_code": "LBL",
                        "message_contents": "특이",
                        "local_create_dtm": new Date(1606974329000),
                        "local_update_dtm": new Date(1606974329000),
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606974351000)/",
                        "system_update_dtm": "/Date(1606974351000)/",
                        "price": "500000",
                        "currency_code": "KRW",
                        "use_flag": false,
                        "product_nameproduct_name": "Widescreen Portable DVD Player w MP3",
                        "product_id": "HT-2000"
                    },
                    {
                        "__metadata": {
                            "id": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ACCOUNT',language_code='KO')",
                            "uri": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ACCOUNT',language_code='KO')",
                            "type": "cm.MsgMgrService.Message"
                        },
                        "tenant_id": "L2100",
                        "message_code": "ACCOUNT",
                        "language_code": "EN",
                        "chain_code": "DP",
                        "message_type_code": "LBL",
                        "message_contents": "계정",
                        "local_create_dtm": new Date(1606974329000),
                        "local_update_dtm": new Date(1606974329000),
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606974351000)/",
                        "system_update_dtm": "/Date(1606974351000)/",
                        "price": "70000000",
                        "currency_code": "KRW",
                        "use_flag": true,
                        "product_name": "Astro Laptop 1516",
                        "product_id": "HT-1251"
                    },
                    {
                        "__metadata": {
                            "id": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ACCOUNT_CODE',language_code='KO')",
                            "uri": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ACCOUNT_CODE',language_code='KO')",
                            "type": "cm.MsgMgrService.Message"
                        },
                        "tenant_id": "L2100",
                        "message_code": "ACCOUNT_CODE",
                        "language_code": "KO",
                        "chain_code": "CM",
                        "message_type_code": "LBL",
                        "message_contents": "계정코드",
                        "local_create_dtm": new Date(1606748448000),
                        "local_update_dtm": new Date(1606748448000),
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606748516000)/",
                        "system_update_dtm": "/Date(1606748516000)/",
                        "price": "3300000000",
                        "currency_code": "KRW",
                        "use_flag": true,
                        "product_name": "Astro Phone 6",
                        "product_id": "HT-1252"
                    },
                    {
                        "__metadata": {
                            "id": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ACCOUNT_CODE',language_code='EN')",
                            "uri": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ACCOUNT_CODE',language_code='EN')",
                            "type": "cm.MsgMgrService.Message"
                        },
                        "tenant_id": "L2100",
                        "message_code": "ACCOUNT_CODE",
                        "language_code": "EN",
                        "chain_code": "CM",
                        "message_type_code": "LBL",
                        "message_contents": "ACCOUNT CODE",
                        "local_create_dtm": new Date(1606748448000),
                        "local_update_dtm": new Date(1606748448000),
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606748516000)/",
                        "system_update_dtm": "/Date(1606748516000)/",
                        "price": "88000000",
                        "currency_code": "KRW",
                        "use_flag": true,
                        "product_name": "Audio/Video Cable Kit",
                        "product_id": "HT-2026"
                    },
                    {
                        "__metadata": {
                            "id": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ACCOUNT_PAYABLES',language_code='KO')",
                            "uri": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ACCOUNT_PAYABLES',language_code='KO')",
                            "type": "cm.MsgMgrService.Message"
                        },
                        "tenant_id": "L2100",
                        "message_code": "ACCOUNT_PAYABLES",
                        "language_code": "KO",
                        "chain_code": "CM",
                        "message_type_code": "LBL",
                        "message_contents": "외상매입금",
                        "local_create_dtm": new Date(1606974329000),
                        "local_update_dtm": new Date(1606974329000),
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606974351000)/",
                        "system_update_dtm": "/Date(1606974351000)/",
                        "price": "0",
                        "currency_code": "KRW",
                        "use_flag": true,
                        "product_name": "Beam Breaker B-1",
                        "product_id": "HT-6100"
                    },
                    {
                        "__metadata": {
                            "id": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ACCOUNTING',language_code='KO')",
                            "uri": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ACCOUNTING',language_code='KO')",
                            "type": "cm.MsgMgrService.Message"
                        },
                        "tenant_id": "L2100",
                        "message_code": "ACCOUNTING",
                        "language_code": "KO",
                        "chain_code": "CM",
                        "message_type_code": "LBL",
                        "message_contents": "회계",
                        "local_create_dtm": new Date(1606974329000),
                        "local_update_dtm": new Date(1606974329000),
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606974351000)/",
                        "system_update_dtm": "/Date(1606974351000)/",
                        "price": "4300000",
                        "currency_code": "KRW",
                        "use_flag": true,
                        "product_name": "Beam Breaker B-2",
                        "product_id": "HT-6101"
                    }]
            }), "rModelList");
        }, 
        
        _loadGridTableData: function () {
            this.setModel(new JSONModel({
                "Message": [
                    {
                        "__metadata": {
                            "id": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ABBREVIATION',language_code='KO')",
                            "uri": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ABBREVIATION',language_code='KO')",
                            "type": "cm.MsgMgrService.Message"
                        },
                        "tenant_id": "L2100",
                        "message_code": "ABBREVIATION",
                        "language_code": "KO",
                        "chain_code": "CM",
                        "message_type_code": "LBL",
                        "message_contents": "약어",
                        "local_create_dtm": new Date(1606974329000),
                        "local_update_dtm": "/Date(1606974329000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606974351000)/",
                        "system_update_dtm": "/Date(1606974351000)/",
                        "street": "401 23rd St", "city": "Port Angeles", "phone": "5682-121-828", "scale": 10.000000
                    },
                    {
                        "__metadata": {
                            "id": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ABNORMAL',language_code='KO')",
                            "uri": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ABNORMAL',language_code='KO')",
                            "type": "cm.MsgMgrService.Message"
                        },
                        "tenant_id": "L2100",
                        "message_code": "ABNORMAL",
                        "language_code": "KO",
                        "chain_code": "CM",
                        "message_type_code": "LBL",
                        "message_contents": "특이",
                        "local_create_dtm": new Date(1606974329000),
                        "local_update_dtm": "/Date(1606974329000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606974351000)/",
                        "system_update_dtm": "/Date(1606974351000)/",
                        "street": "51 39th St", "city": "Smallfield", "phone": "2212-853-789", "scale": 0.22222222
                    },
                    {
                        "__metadata": {
                            "id": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ACCOUNT',language_code='KO')",
                            "uri": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ACCOUNT',language_code='KO')",
                            "type": "cm.MsgMgrService.Message"
                        },
                        "tenant_id": "L2100",
                        "message_code": "ACCOUNT",
                        "language_code": "KO",
                        "chain_code": "CM",
                        "message_type_code": "LBL",
                        "message_contents": "계정",
                        "local_create_dtm": new Date(1606974329000),
                        "local_update_dtm": "/Date(1606974329000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606974351000)/",
                        "system_update_dtm": "/Date(1606974351000)/",
                        "street": "451 55th St", "city": "Meridian", "phone": "2234-245-898", "scale": 5.345678
                    },
                    {
                        "__metadata": {
                            "id": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ACCOUNT_CODE',language_code='KO')",
                            "uri": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ACCOUNT_CODE',language_code='KO')",
                            "type": "cm.MsgMgrService.Message"
                        },
                        "tenant_id": "L2100",
                        "message_code": "ACCOUNT_CODE",
                        "language_code": "KO",
                        "chain_code": "CM",
                        "message_type_code": "LBL",
                        "message_contents": "계정코드",
                        "local_create_dtm": new Date(1606748448000),
                        "local_update_dtm": "/Date(1606748448000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606748516000)/",
                        "system_update_dtm": "/Date(1606748516000)/",
                        "street": "40 21st St", "city": "Bethesda", "phone": "5512-125-643", "scale": 1.23456
                    },
                    {
                        "__metadata": {
                            "id": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ACCOUNT_CODE',language_code='EN')",
                            "uri": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ACCOUNT_CODE',language_code='EN')",
                            "type": "cm.MsgMgrService.Message"
                        },
                        "tenant_id": "L2100",
                        "message_code": "ACCOUNT_CODE",
                        "language_code": "EN",
                        "chain_code": "CM",
                        "message_type_code": "LBL",
                        "message_contents": "ACCOUNT CODE",
                        "local_create_dtm": new Date(1606748448000),
                        "local_update_dtm": "/Date(1606748448000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606748516000)/",
                        "system_update_dtm": "/Date(1606748516000)/",
                        "street": "123 72nd St", "city": "McLean", "phone": "5412-543-765", "scale": 6.43210
                    },
                    {
                        "__metadata": {
                            "id": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ACCOUNT_PAYABLES',language_code='KO')",
                            "uri": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ACCOUNT_PAYABLES',language_code='KO')",
                            "type": "cm.MsgMgrService.Message"
                        },
                        "tenant_id": "L2100",
                        "message_code": "ACCOUNT_PAYABLES",
                        "language_code": "KO",
                        "chain_code": "CM",
                        "message_type_code": "LBL",
                        "message_contents": "외상매입금",
                        "local_create_dtm": new Date(1606974329000),
                        "local_update_dtm": "/Date(1606974329000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606974351000)/",
                        "system_update_dtm": "/Date(1606974351000)/",
                        "street": "999 2nd St", "city": "London", "phone": "3333-444-5678", "scale": 6.43210
                    },
                    {
                        "__metadata": {
                            "id": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ACCOUNTING',language_code='KO')",
                            "uri": "https://lgcommondev-workspaces-ws-qh4t8-app2.jp10.applicationstudio.cloud.sap:443/odata/v2/cm.MsgMgrService/Message(tenant_id='L2100',message_code='ACCOUNTING',language_code='KO')",
                            "type": "cm.MsgMgrService.Message"
                        },
                        "tenant_id": "L2100",
                        "message_code": "ACCOUNTING",
                        "language_code": "KO",
                        "chain_code": "CM",
                        "message_type_code": "LBL",
                        "message_contents": "회계",
                        "local_create_dtm": new Date(1606748448000),
                        "local_update_dtm": "/Date(1606974329000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606974351000)/",
                        "system_update_dtm": "/Date(1606974351000)/",
                        "street": "333 88nd St", "city": "Seoul", "phone": "82-2-543-765", "scale": 7
                    }]
            }), "gModelList");
        },

        onRtableUpdateFinished : function(_oEvent) {
            var oTable = _oEvent.getSource();
            if(oTable.getBusy()) {
                oTable.setBusy(false);
            }
        },

        onGtableUpdateFinished : function(_oEvent) {
            var oTable = _oEvent.getSource();
            if(oTable.getBusy()) {
                oTable.setBusy(false);
            }
        }

    });
});