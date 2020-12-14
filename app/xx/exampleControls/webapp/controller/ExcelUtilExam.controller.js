sap.ui.define([
	"./Empty.controller",
	"ext/lib/model/v2/ODataDelegateModel",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
    "sap/m/MessageToast",
    "ext/lib/util/ExcelUtil"
], function (Controller, DelegateModel, JSONModel, MessageBox, MessageToast, ExcelUtil) {
	"use strict";

	return Controller.extend("xx.exampleControls.controller.ExcelUtilExam", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {

            this._loadRModelData();
            this._loadGModelData();
            this.setModel(new JSONModel(), "excelModel");

            //sheet.js cdn url
            $.getScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.5/xlsx.full.min.js");
		}

		, onAfterRendering: function(){
            this.byId("rTable").setModel(this.getModel("rModelList"));
            this.byId("gTable").setModel(this.getModel("gModelList"));
        }
        
        , onExportPress: function(_oEvent) {
            var sTableId = _oEvent.getSource().getParent().getParent().getId()
            debugger;
            if(!sTableId) {return;}

            var oTable = this.byId(sTableId);
            var sFileName = oTable.title || this.byId("page").getTitle() || "sheetData";//file name to exporting
            //var oData = this.getModel("list").getProperty("/Message");//binded Data
            var oData = oTable.getModel().getProperty("/Message");
            var oParam = {
                fileName : sFileName || "SpreadSheet",
                table : oTable,
                data : oData
            };
            ExcelUtil.fnExportExcel(oParam);
        }

        
        , onImportChange: function(_oEvent) {
            var oTable = _oEvent.getSource().getParent().getParent();
            var oModel = oTable.getModel();
            var oExcelModel = this.getModel("excelModel");
            debugger;
            oExcelModel.setData({});
            ExcelUtil.fnImportExcel({
                uploader: _oEvent.getSource(),
                file: _oEvent.getParameter("files") && _oEvent.getParameter("files")[0],
                model: oExcelModel,
                success: function() {
                    debugger;
                    var aTableData = oModel.getProperty("/Message") || [],
                        aCols  = oTable.getColumns(),
                        oExcelData = this.model.getData();
                    
                    if(oExcelData) {
                        var aData = oExcelData[Object.keys(oExcelData)[0]];

                        aData.forEach(function(oRow) {
                            var aKeys = Object.keys(oRow),
                                newObj = {};
                            aCols.forEach(function(oCol, idx) {
                                debugger;
                                var sLabel = typeof oCol.getLabel === "function" ? oCol.getLabel().getText() : oCol.getHeader().getText();//As Grid or Responsible Table
                                var sName = oCol.data("bindName") || "";
                                var iKeyIdx = aKeys.indexOf(sLabel);
                                if(iKeyIdx > -1 && sName) {
                                    var oValue = oRow[aKeys[iKeyIdx]];
                                    if(oValue) {
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
        }

        , onResetRModelListPress: function() {
            this.getView().getModel("rModelList").setData({});
        }

        , onResetGModelListPress: function() {
            this.getView().getModel("gModelList").setData({});
        }

        , onRLoadPress: function() {
            this._loadRModelData();
        }

        , onGLoadPress: function() {
            this._loadGModelData();
        }

        , _loadRModelData: function() {
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
                    "use_flag": "true"
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
                    "use_flag": "false"
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
                    "use_flag": true
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
                    "use_flag": true
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
                    "use_flag": true
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
                    "use_flag": true
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
                    "use_flag": true
                }]
			}), "rModelList");
        }

        , _loadGModelData: function() {
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