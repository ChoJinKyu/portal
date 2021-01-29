sap.ui.define([
    "./Empty.controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "ext/lib/util/ExcelUtil",
    "ext/lib/formatter/Formatter"
], function (Controller, JSONModel, MessageBox, MessageToast, ExcelUtil, Formatter) {
    "use strict";

    return Controller.extend("xx.exampleControls.controller.ExcelUtilExam", {

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */
        formatter: Formatter,
        
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

        onExportPress: function (_oEvent) {
            var sTableId = _oEvent.getSource().getParent().getParent().getId();
            if (!sTableId) { return; }

            var oTable = this.byId(sTableId);
            var sFileName = oTable.title || this.byId("page").getTitle(); //file name to exporting
            var oData = oTable.getModel().getProperty("/Message");//binded Data

            //CM_CHAIN_CD code list
            var aCtxtChainCode = Object.keys(this.getModel("common").getContext("/Code(tenant_id='L2100,group_id='CM_CHAIN_CD')").getProperty("/"));
            var aChainCode = aCtxtChainCode.map(sCtxt => this.getModel("common").getContext("/Code(tenant_id='L2100,group_id='CM_CHAIN_CD')").getModel().getProperty("/"+sCtxt));

            //CM_LANG_CODE code List
            var aCtxtLang = Object.keys(this.getModel("common").getContext("/Code(tenant_id='L2100,group_id='CM_CHAIN_CD')").getProperty("/"));
            var aLangCode = aCtxtLang.map(sCtxt => this.getModel("common").getContext("/Code(tenant_id='L2100,group_id='CM_LANG_CODE')").getModel().getProperty("/"+sCtxt));

            //optional object param
            //aListItem - 코드목록, sBindName - Table 칼럼에 바인딩한 property, sKeyName - 코드목록의 key, sTextName - 코드목록의 text
            var oOption = [
                {aListItem : aChainCode, sBindName : "chain_code", sKeyName : "code", sTextName : "code_name"},
                {aListItem : aLangCode, sBindName : "language_code", sKeyName : "code", sTextName : "code_name"}
            ];// code data는 복수개일 수 있으므로 배열로 전달.

            ExcelUtil.fnExportExcel({
                fileName: sFileName || "SpreadSheet",
                table: oTable,
                data: oData
            }, oOption);
        },

        onChangeModePress: function (_oEvent) {
            let oDispModel = this.getModel("displayModel");
            let toBeReadMode = oDispModel.getProperty("/readMode") ? false : true;
            let toBeEditMode = oDispModel.getProperty("/editMode") ? false : true;
            oDispModel.setData({readMode: toBeReadMode, editMode: toBeEditMode});
        },

        onImportChange: function (_oEvent) {
            var oTable = _oEvent.getSource().getParent().getParent();
            var oModel = oTable.getModel();
            var oExcelModel = this.getModel("excelModel");
            
            oExcelModel.setData({});
            ExcelUtil.fnImportExcel({
                uploader: _oEvent.getSource(),
                file: _oEvent.getParameter("files") && _oEvent.getParameter("files")[0],
                model: oExcelModel,
                success: function () {
                    var aTableData = oModel.getProperty("/Message") || [],
                        aCols = oTable.getColumns(),
                        oExcelData = this.model.getData();

                    if (oExcelData) {
                        var aData = oExcelData[Object.keys(oExcelData)[0]];

                        aData.forEach(function (oRow) {
                            var aKeys = Object.keys(oRow),
                                newObj = {};
                            aCols.forEach(function (oCol, idx) {
                                //debugger;
                                //var sLabel = typeof oCol.getLabel === "function" ? oCol.getLabel().getText() : oCol.getHeader().getText();//As Grid or Responsible Table
                                var sLabel = "";
                                if(typeof oCol.getLabel === "function") {
                                    if(typeof oCol.getLabel().getText === "function") {
                                        sLabel = oCol.getLabel().getText();
                                    } else if(typeof oCol.getLabel().getItems === "function") {
                                        $.each(oCol.getLabel().getItems(), function(idx2, oItem) {
                                            if(oItem.getText()) {
                                                sLabel = oItem.getText();
                                                return false;
                                            }
                                        });   
                                    }
                                    
                                }

                                var sName = oCol.data("bindName") || "";
                                var iKeyIdx = aKeys.indexOf(sLabel);
                                if (iKeyIdx > -1 && sName) {
                                    var oValue = oRow[aKeys[iKeyIdx]];
                                    if (oValue) {
                                        oValue = oValue.toString();
                                    }
                                    newObj[sName] = oValue !== "N/A" ? oValue : "";
                                }
                            });
                            aTableData.push(newObj);
                        });
                        oModel.setProperty("/Message", aTableData);
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
                        "local_create_dtm": "/Date(1606974329000)/",
                        "local_update_dtm": "/Date(1606974329000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606974351000)/",
                        "system_update_dtm": "/Date(1606974351000)/",
                        "price": "2500000",
                        "currency_code": "KRW",
                        "use_flag": "true",
                        "name": "Portable DVD player",
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
                        "chain_code": "CM",
                        "message_type_code": "LBL",
                        "message_contents": "특이",
                        "local_create_dtm": "/Date(1606974329000)/",
                        "local_update_dtm": "/Date(1606974329000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606974351000)/",
                        "system_update_dtm": "/Date(1606974351000)/",
                        "price": "500000",
                        "currency_code": "KRW",
                        "use_flag": "false",
                        "name": "Widescreen Portable DVD Player w MP3",
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
                        "language_code": "KO",
                        "chain_code": "CM",
                        "message_type_code": "LBL",
                        "message_contents": "계정",
                        "local_create_dtm": "/Date(1606974329000)/",
                        "local_update_dtm": "/Date(1606974329000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606974351000)/",
                        "system_update_dtm": "/Date(1606974351000)/",
                        "price": "70000000",
                        "currency_code": "KRW",
                        "use_flag": true,
                        "name": "Astro Laptop 1516",
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
                        "local_create_dtm": "/Date(1606748448000)/",
                        "local_update_dtm": "/Date(1606748448000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606748516000)/",
                        "system_update_dtm": "/Date(1606748516000)/",
                        "price": "3300000000",
                        "currency_code": "KRW",
                        "use_flag": true,
                        "name": "Astro Phone 6",
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
                        "local_create_dtm": "/Date(1606748448000)/",
                        "local_update_dtm": "/Date(1606748448000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606748516000)/",
                        "system_update_dtm": "/Date(1606748516000)/",
                        "price": "88000000",
                        "currency_code": "KRW",
                        "use_flag": true,
                        "name": "Audio/Video Cable Kit",
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
                        "local_create_dtm": "/Date(1606974329000)/",
                        "local_update_dtm": "/Date(1606974329000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606974351000)/",
                        "system_update_dtm": "/Date(1606974351000)/",
                        "price": "0",
                        "currency_code": "KRW",
                        "use_flag": true,
                        "name": "Beam Breaker B-1",
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
                        "local_create_dtm": "/Date(1606974329000)/",
                        "local_update_dtm": "/Date(1606974329000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606974351000)/",
                        "system_update_dtm": "/Date(1606974351000)/",
                        "price": "4300000",
                        "currency_code": "KRW",
                        "use_flag": true,
                        "name": "Beam Breaker B-2",
                        "product_id": "HT-6101"
                    }]
            }), "rModelList");
        }, _loadGridTableData: function () {
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
                        "local_create_dtm": "/Date(1606974329000)/",
                        "local_update_dtm": "/Date(1606974329000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606974351000)/",
                        "system_update_dtm": "/Date(1606974351000)/"
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
                        "local_create_dtm": "/Date(1606974329000)/",
                        "local_update_dtm": "/Date(1606974329000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606974351000)/",
                        "system_update_dtm": "/Date(1606974351000)/"
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
                        "local_create_dtm": "/Date(1606974329000)/",
                        "local_update_dtm": "/Date(1606974329000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606974351000)/",
                        "system_update_dtm": "/Date(1606974351000)/"
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
                        "local_create_dtm": "/Date(1606748448000)/",
                        "local_update_dtm": "/Date(1606748448000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606748516000)/",
                        "system_update_dtm": "/Date(1606748516000)/"
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
                        "local_create_dtm": "/Date(1606748448000)/",
                        "local_update_dtm": "/Date(1606748448000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606748516000)/",
                        "system_update_dtm": "/Date(1606748516000)/"
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
                        "local_create_dtm": "/Date(1606974329000)/",
                        "local_update_dtm": "/Date(1606974329000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606974351000)/",
                        "system_update_dtm": "/Date(1606974351000)/"
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
                        "local_create_dtm": "/Date(1606974329000)/",
                        "local_update_dtm": "/Date(1606974329000)/",
                        "create_user_id": "anonymous",
                        "update_user_id": "anonymous",
                        "system_create_dtm": "/Date(1606974351000)/",
                        "system_update_dtm": "/Date(1606974351000)/"
                    }]
            }), "gModelList");
        }

    });
});