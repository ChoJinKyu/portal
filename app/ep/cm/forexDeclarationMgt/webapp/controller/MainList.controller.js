sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedListModel",
    "ext/lib/util/Validator",
    "sap/ui/model/json/JSONModel",
    "ext/lib/formatter/DateFormatter",
    // "sap/m/TablePersoController",
    "sap/ui/table/TablePersoController",
    "./MainListPersoService",
    "sap/ui/core/Fragment",
    "ext/lib/formatter/NumberFormatter",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/Text",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/VBox"
], function (BaseController, Multilingual, TransactionManager, ManagedListModel, Validator, JSONModel, DateFormatter,
    TablePersoController, MainListPersoService, Fragment, NumberFormatter, Sorter,
    Filter, FilterOperator, MessageBox, MessageToast, Dialog, DialogType, Button, ButtonType, Text, Label, Input, VBox) {
    "use strict";

    var oTransactionManager;

    return BaseController.extend("ep.cm.forexDeclarationMgt.controller.MainList", {

        dateFormatter: DateFormatter,

        validator: new Validator(),

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
        onInit: function () {
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedListModel(), "list");
            this.setModel(new JSONModel(), "mainListViewModel");

            this.setModel(new JSONModel(), "forexDtl");

            // this._oTPC = new TablePersoController({
            //     customDataKey: "forexDeclarationMgt",
            //     persoService: MainListPersoService
            // }).setTable(this.byId("mainTable"));

            this.enableMessagePopover();

            // var today = new Date();

            // this.getView().byId("searchRequestDate").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30));
            // this.getView().byId("searchRequestDate").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
        },

        onRenderedFirst: function () {
            this.byId("pageSearchButton").firePress();
        },

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onMainTablePersoButtonPressed: function (oEvent) {
            this._oTPC.openDialog();
        },

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onMainTablePersoRefresh: function () {
            MainListPersoService.resetPersData();
            this._oTPC.refresh();
        },

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
        onPageSearchButtonPress: function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                // Search field's 'refresh' button has been pressed.
                // This is visible if you select any master list item.
                // In this case no new search is triggered, we only
                // refresh the list binding.
                this.onRefresh();
            } else {
                var aSearchFilters = this._getSearchStates();
                var aSorter = this._getSorter();
                this._applySearch(aSearchFilters, aSorter);
            }
        },


        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function () {
            this.getModel("mainListViewModel").setProperty("/headerExpanded", true);
        },

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */
        _applySearch: function (aSearchFilters, aSorter) {
            var oView = this.getView(),
                oModel = this.getModel("list");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
            oModel.read("/ForexDeclarationView", {
                filters: aSearchFilters,
                sorters: aSorter,
                success: function (oData) {
                    console.log("oData====", oData);
                    oView.setBusy(false);
                }
            });
        },

        _getSearchStates: function () {

             var loiNumberTokens = this.getView().byId("searchPoNumber").getTokens();
             var sLoiNumber = loiNumberTokens.map(function (oToken) {
                 return oToken.getKey();
             });

            var requestFromDate = this.getView().byId("searchPoDate").getDateValue(),
                requestToDate = this.getView().byId("searchPoDate").getSecondDateValue(),
                status = this.getView().byId("searchStatus").getSelectedKey();

            var sRequestDepartment = this.getView().byId("searchPurchasingDepartmentName").getValue(),
                sRequestor = this.getView().byId("searchBuyerName").getValue();

            var poName = this.getView().byId("searchPoName").getValue();

            var selectManagementTargetFlag = this.getView().byId("selectManagementTargetFlag").getSelected(),
                selectManagementTargetFlag2 = this.getView().byId("selectManagementTargetFlag2").getSelected(),
                selectDeclareTargetFlag = this.getView().byId("selectDeclareTargetFlag").getSelected(),
                selectDeclareTargetFlag2 = this.getView().byId("selectDeclareTargetFlag2").getSelected();

     
            
            

            console.log("poName -----> " , poName);
             console.log("selectManagementTargetFlag -----> " , this.getView().byId("selectManagementTargetFlag").getSelected());
             console.log("selectManagementTargetFlag2 -----> " , this.getView().byId("selectManagementTargetFlag2").getSelected());

            

            


            var aSearchFilters = [];

            if (sLoiNumber.length > 0) {
                var _tempFilters = [];

                sLoiNumber.forEach(function (item, idx, arr) {
                    _tempFilters.push(new Filter("po_number", FilterOperator.EQ, item));
                });

                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }

            if (requestFromDate && requestToDate) {
                aSearchFilters.push(new Filter("po_date", FilterOperator.BT, this.getFormatDate(requestFromDate), this.getFormatDate(requestToDate)));
            }

            // if (sRequestDepartment && sRequestDepartment.length > 0) {
            //     aSearchFilters.push(new Filter("request_department_code", FilterOperator.EQ, sLoiNumber));
            // }
            // if (sRequestor && sRequestor.length > 0) {
            //     aSearchFilters.push(new Filter("requestor_empno", FilterOperator.EQ, sLoiNumber));
            // }

            if(sRequestDepartment && sRequestDepartment.length > 0){
                aSearchFilters.push(new Filter("tolower(purchasing_department_code)", FilterOperator.Contains, "'"+sRequestDepartment.toLowerCase()+"'"));
            }
            if(sRequestor && sRequestor.length > 0){
                aSearchFilters.push(new Filter("tolower(buyer_empno)", FilterOperator.Contains, "'"+sRequestor.toLowerCase()+"'"));
            }

            if (status) {
                aSearchFilters.push(new Filter("forex_declare_status_code", FilterOperator.EQ, status));
            }

            if (poName && poName.length > 0) {
                 aSearchFilters.push(new Filter("po_name", FilterOperator.EQ, poName));
            }

            if (selectManagementTargetFlag === true && selectManagementTargetFlag2 === false) {
                aSearchFilters.push(new Filter("management_target_flag", FilterOperator.EQ, true));
            }

            if (selectManagementTargetFlag === false && selectManagementTargetFlag2 === true) {
                aSearchFilters.push(new Filter("management_target_flag", FilterOperator.EQ, false));
            }

            if (selectDeclareTargetFlag === true && selectDeclareTargetFlag2 === false) {
                aSearchFilters.push(new Filter("declare_target_flag", FilterOperator.EQ, true));
            }

            if (selectDeclareTargetFlag === false && selectDeclareTargetFlag2 === true) {
                aSearchFilters.push(new Filter("declare_target_flag", FilterOperator.EQ, false));
            }

            
            // if(selectManagementTargetFlag){
            //     aSearchFilters.push(new Filter("management_target_flag", FilterOperator.EQ, selectManagementTargetFlag));
            // }else if(selectManagementTargetFlag2){
            //     aSearchFilters.push(new Filter("management_target_flag", FilterOperator.EQ, selectManagementTargetFlag2));
            // }

            // if(selectDeclareTargetFlag){
            //     aSearchFilters.push(new Filter("declare_target_flag", FilterOperator.EQ, selectDeclareTargetFlag));
            // }else if(selectDeclareTargetFlag2){
            //     aSearchFilters.push(new Filter("declare_target_flag", FilterOperator.EQ, selectDeclareTargetFlag2));
            // }


            console.log("aSearchFilters -----> " , aSearchFilters);
            console.log("this.getView() -----> ", this.getView());

            return aSearchFilters;
        },

        _getSorter: function () {
            var aSorter = [];
            aSorter.push(new Sorter("po_number", true));
            //var aSorter = new Sorter("system_create_dtm", true);    
            return aSorter;
        },


        /**
         * Table 의 선택된 index 를 리턴
         * @param {object} _oTable
         */
        _getSelectedIndex: function(_oTable) {
            if(!_oTable) { alert("invalid Table!"); }
            
            var iIdx = _oTable.getSelectedIndex();
            
            if(iIdx < 0) {
                MessageBox.alert("데이터가 선택되지 않았습니다.");
                return -1;
            }
            return iIdx;
        },


        /**
         * Cell 클릭 후 상세화면으로 이동
         */
        onCellClickPress: function(oEvent) {
            this._goDetailView(oEvent);
        },

        

        _goDetailView: function(oEvent){
            
            console.log("111111111111111111", oEvent);

             var oView = this.getView();
            var oTable = oView.byId("mainTable"),
                oModel = this.getView().getModel("list");
            var rowData = oEvent.getParameter('rowBindingContext').getObject();
            
            var input = {};
            var saveForexDtl = [];
            var poNumber = rowData.po_number;
            console.log("####po_number====", poNumber);
            if (poNumber !== '' && poNumber != null && poNumber !== undefined) {
                
                var tenantId = rowData.tenant_id;
                var companyCode = rowData.company_code;
                var forexDeclareStatusCode = rowData.forex_declare_status_code;
                var declareScheduledDate = rowData.declare_scheduled_date;
                var declareDate = rowData.declare_date;
                var attchGroupNumber =  rowData.attch_group_number;
                var remark =  rowData.remark;


                console.log("####po_number====", poNumber);
                console.log("####tenant_id====", tenantId);
                console.log("####company_code====", companyCode);
                console.log("####forex_declare_status_code====", forexDeclareStatusCode);
                console.log("####declare_scheduled_date====", declareScheduledDate);
                console.log("####declare_date====", declareDate);
                console.log("####attch_group_number====", attchGroupNumber);
                console.log("####remark====", remark);

                if(forexDeclareStatusCode == "작성대기"){
                    forexDeclareStatusCode = "920010";
                }else if(forexDeclareStatusCode == "신고진행중"){
                    forexDeclareStatusCode = "920020";
                }else{
                    forexDeclareStatusCode = "920030";
                }



                var forexItems = {
                            "po_number": poNumber,
                            "tenant_id": tenantId,
                            "company_code": companyCode,
                            "forex_declare_status_code": forexDeclareStatusCode,
                            "declare_scheduled_date": declareScheduledDate,
                            "declare_date": declareDate,
                            "attch_group_number": attchGroupNumber,
                            "remark": remark,
                            "update_user_id" : "ADMIN"
                        }

                        saveForexDtl.push(forexItems);

            }else{
                return;
            }

            console.log("####saveForexDtl111====", saveForexDtl);

            input.forexItems = saveForexDtl;
            this.getModel("forexDtl").setData(input);
            console.log("####forexDtl2222====", this.getModel("forexDtl").getData());

            // pTenantId = rowData.tenant_id;
            // pOrg_code  = rowData.org_code;
            // pOperation_unit_code = rowData.operation_unit_code;
            // pTemp_type = rowData.temp_type;

             
            console.log("rowData --------------------> ", rowData);
            
            /* 신고진행상태
            920010	작성대기
            920020	신고진행중
            920030	신고완료
            */			

            var forexDeclareStatusName = rowData.forex_declare_status_name;

            console.log("forexDeclareStatusName --------------------> ", forexDeclareStatusName);
            var pageVal = "";
            // if(forexDeclareStatusName == "920010" || forexDeclareStatusName == "920020"){
            //     pageVal = "ep.cm.forexDeclarationMgt.view.forexDetail_Edit"
            // }else{
            //     pageVal = "ep.cm.forexDeclarationMgt.view.forexDetail_Show"
            // }

            if(forexDeclareStatusName == "작성대기" || forexDeclareStatusName == "신고진행중"){
                console.log("edit :: ");
                pageVal = "ep.cm.forexDeclarationMgt.view.forexDetail_Edit"
            }else{
                console.log("show :: ");
                pageVal = "ep.cm.forexDeclarationMgt.view.forexDetail_Show"
            }


            //if (!this._forexDialog) {
//oView.removeAllDependents();
 //this._forexDialog.destroy(); 

                this._forexDialog = Fragment.load({
                    id: oView.getId(),
                    name: pageVal,
                    controller: this
                }).then(function (_forexDialog) {
                    oView.addDependent(_forexDialog);
                    
                    //console.log("_forexDialog :::: " , oView);
                    return _forexDialog;
                }.bind(this));
            //}

            this._forexDialog.then(function (_forexDialog) {
                _forexDialog.open();

                

                if(forexDeclareStatusName == "작성대기" || forexDeclareStatusName == "신고진행중"){
                    oView.byId("poNumber").setText(rowData.po_number);
                    oView.byId("poName").setText(rowData.po_name);
                    oView.byId("receiptScheduledDate").setText(rowData.receipt_scheduled_date);
                    oView.byId("declareScheduledDate").setDateValue(rowData.declare_scheduled_date);
                    oView.byId("declareDate").setDateValue(rowData.declare_date);
                    oView.byId("processedCompleteDate").setText(rowData.processed_complete_date);
                    oView.byId("remark").setValue(rowData.remark);
                }else{
                    oView.byId("poNumber").setText(rowData.po_number);
                    oView.byId("poName").setText(rowData.po_name);
                    oView.byId("receiptScheduledDate").setText(rowData.receipt_scheduled_date);
                    oView.byId("declareScheduledDate").setText(rowData.declare_scheduled_date);
                    oView.byId("declareDate").setText(rowData.declare_date);
                    oView.byId("processedCompleteDate").setText(rowData.processed_complete_date);
                    oView.byId("remark").setText(rowData.remark);
                }
                 

            });

        },


        dialogAfterclose: function() {
            this.byId("dialogForex").destroy();
        },


        /**
		 * Event handler for saving page changes
		 * @public
		 */
        onForexSave: function (flag) {

            var oView = this.getView(),
                that = this;

             /* 신고진행상태
            920010	작성대기
            920020	신고진행중
            920030	신고완료
            */	
            var statusCode = "920010";
            var statusChange = "";
            
            
            
            if (flag == "S") {
                statusCode = "920010";
                statusChange = "920020";

            }else if (flag == "C") {
                statusCode = "920020";
                statusChange = "920030";
            } else {
                statusCode = "920030";
                statusChange = "920010";
            }

            var forexDtlModel = this.getModel("forexDtl");
            console.log("forexDtlModel.getData()1==" + JSON.stringify(forexDtlModel.getData()));

            if(statusCode == "920010" || statusCode == "920020"){
                forexDtlModel.getData()["forexItems"].map(d => {
                    d["declare_scheduled_date"] = oView.byId("declareScheduledDate").getValue();
                    d["declare_date"] = oView.byId("declareDate").getValue();
                    d["remark"] = oView.byId("remark").getValue();
                    d["attch_group_number"] = oView.byId("attchGroupNumber").getText();
                    d["forex_declare_status_code"] = statusChange;
                    return d;
                });
            }else{
                forexDtlModel.getData()["forexItems"].map(d => {
                    d["declare_scheduled_date"] = oView.byId("declareScheduledDate").getText();
                    d["declare_date"] = oView.byId("declareDate").getText();
                    d["remark"] = oView.byId("remark").getText();
                    d["attch_group_number"] = oView.byId("attchGroupNumber").getText();
                    d["forex_declare_status_code"] = statusChange;
                    return d;
                });
            }

            console.log("forexDtlModel.getData()2==" + JSON.stringify(forexDtlModel.getData()));

            //if (this.validator.validate(this.byId("dialogForex")) !== true) return;

            // console.log("####oTransactionManager====", oTransactionManager);
            // console.log("####oDataModel====", oMasterModel.getData());

            var url = "ep/cm/forexDeclarationMgt/webapp/srv-api/odata/v4/ep.PoApprMgtV4Service/SavePoForexDeclarationProc";

            MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
                title: this.getModel("I18N").getText("/SAVE"),
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        $.ajax({
                            url: url,
                            type: "POST",
                            data: JSON.stringify(forexDtlModel.getData()),
                            contentType: "application/json",
                            success: function (data) {

                                console.log("#########Success#####", data.value);

                                MessageToast.show(that.getModel("I18N").getText("/NCM01001"));

                                // if(data.value.rsltCnt > 0) {
                                //     MessageToast.show(that.getModel("I18N").getText("/NCM0005"));
                                // }else {
                                //     MessageToast.show(that.getModel("I18N").getText("/NCM01005"));
                                // }
                                that.onExitForex();
                                that.byId("pageSearchButton").firePress();
                            },
                            error: function (e) {
                                console.log(e);
                            }
                        });
                    };
                }
            });

        },

        /**
         * @description 팝업 닫기 
         */
        onExitForex: function () {
            this.byId("dialogForex").close();
        },


        onTableSupplierSelectionPress: function (oEvent) {
            var sPath = oEvent.getSource().getBindingContext("list").getPath(),
                oRecord = this.getModel("list").getProperty(sPath);

            this.getRouter().navTo("selectionPage", {
                //layout: oNextUIState.layout,
                tenantId: oRecord.tenant_id,
                companyCode: oRecord.company_code,
                loiWriteNumber: oRecord.loi_write_number,
                loiItemNumber: oRecord.loi_item_number,
                loiSelectionNumber: oRecord.loi_selection_number,
                loiNumber: oRecord.loi_number
            }, true);
        },

        // _doInitTablePerso: function(){
        // 	// init and activate controller
        // 	this._oTPC = new TablePersoController({
        // 		table: this.byId("mainTable"),
        // 		componentName: "loiPublishMgt",
        // 		persoService: MainListPersoService,
        // 		hasGrouping: true
        //     }).activate();

        //     // //this.getView().setModel(new ManagedListModel(), "list");
        //     // // 개인화 - UI 테이블의 경우만 해당
        //     // this._oTPC = new TablePersoController({
        //     // customDataKey: "loiPublishMgt",
        //     // persoService: MainListPersoService
        //     // }).setTable(this.byId("mainTable"));            

        // }

        getFormatDate : function (date) {

            if(!date){
                return '';
            }

            var year = date.getFullYear();              //yyyy
            var month = (1 + date.getMonth());          //M
            month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
            var day = date.getDate();                   //d
            day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
            return  year + '-' + month + '-' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
        }


    });
});