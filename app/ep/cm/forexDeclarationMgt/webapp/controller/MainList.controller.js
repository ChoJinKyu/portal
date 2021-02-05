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
    "sap/m/VBox",
    "sap/ui/core/mvc/Controller"
], function (BaseController, Multilingual, TransactionManager, ManagedListModel, Validator, JSONModel, DateFormatter,
    TablePersoController, MainListPersoService, Fragment, NumberFormatter, Sorter,
    Filter, FilterOperator, MessageBox, MessageToast, Dialog, DialogType, Button, ButtonType, Text, Label, Input, VBox, Controller) {
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


            this.getView().setModel(new JSONModel({summaryChart: []}), "popup");
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

                console.log("requestFromDate ->>>>>>>>>>>>>" , requestFromDate);

            var sRequestDepartment = this.getView().byId("searchPurchasingDepartmentName").getValue(),
                sRequestor = this.getView().byId("searchBuyerName").getValue();

            var poName = this.getView().byId("searchPoName").getValue();

            var selectManagementTargetFlag = this.getView().byId("selectManagementTargetFlag").getSelected(),
                selectManagementTargetFlag2 = this.getView().byId("selectManagementTargetFlag2").getSelected(),
                selectDeclareTargetFlag = this.getView().byId("selectDeclareTargetFlag").getSelected(),
                selectDeclareTargetFlag2 = this.getView().byId("selectDeclareTargetFlag2").getSelected();

                console.log("selectManagementTargetFlag ---> " ,selectManagementTargetFlag);
                console.log("selectManagementTargetFlag2 ---> " ,selectManagementTargetFlag2);


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
            if (selectManagementTargetFlag === true && selectManagementTargetFlag2 === true) {
                aSearchFilters.push(new Filter("management_target_flag", FilterOperator.EQ, true));
            }else if (selectManagementTargetFlag === false && selectManagementTargetFlag2 === true) {
                aSearchFilters.push(new Filter("management_target_flag", FilterOperator.EQ, false));
            }else if(selectManagementTargetFlag === false && selectManagementTargetFlag2 === false){
                aSearchFilters.push(new Filter("management_target_flag", FilterOperator.EQ, null));
            }
            
            if (selectDeclareTargetFlag === true && selectDeclareTargetFlag2 === true) {
                aSearchFilters.push(new Filter("declare_target_flag", FilterOperator.EQ, true));
            }else if (selectDeclareTargetFlag === false && selectDeclareTargetFlag2 === true) {
                aSearchFilters.push(new Filter("declare_target_flag", FilterOperator.EQ, false));
            }else if(selectDeclareTargetFlag === false && selectDeclareTargetFlag2 === false) {
                aSearchFilters.push(new Filter("declare_target_flag", FilterOperator.EQ, null));
            }
           

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


        onSummaryChartButtonPress: function(oEvent) {
            console.log("chart popup");
            this.sFrom = "";
            this.sTo = "";
            this._goChartlView(oEvent);
            
        },

        _goChartlView: function(oEvent){
            
            console.log(" _goChartlView oEvent :: ", oEvent);
            var oView = this.getView();

            this._chartDialog = Fragment.load({
                id: oView.getId(),
                name: "ep.cm.forexDeclarationMgt.view.SummaryChart",
                controller: this
            }).then(function (_chartDialog) {
                oView.addDependent(_chartDialog);
                
                //console.log("_chartDialog :::: " , oView);
                return _chartDialog;
            }.bind(this));


            console.log("this.sFrom :::: " , this.sFrom);
            console.log("this.sTo :::: " , this.sTo);


            console.log("_chartDialog :::: " , oView);

            var sDate = "2010-01-01";
            var eDate = "2020-12-31";

            if(this.sFrom != "" && this.sTo != ""){
                sDate = this.sFrom;
                eDate = this.sTo;
            }

            


            this._chartDialog.then((function (_chartDialog) {
                
                // if(!this._chartDialog) {
                //     this._chartDialog =  sap.ui.xmlfragment("searchChartPoDate", this );
                //     this.getView().addDependent(this._chartDialog);
                // }

                _chartDialog.open();


                $.ajax({
                    url: "ep/cm/forexDeclarationMgt/webapp/srv-api/odata/v4/ep.PoApprMgtV4Service/ForexDeclarationSummaryView(tenant_id='L2100',company_code='LGCKR',purchasing_department_code='',buyer_empno='',po_start_date="+sDate +",po_end_date="+ eDate +")/Set",
                    type: "GET",
                    contentType: "application/json",
                    
                    success: (function (oData) {
                        console.log("#########oData Success#####", oData.value);
                        this.getModel("popup").setProperty("/summaryChart", oData.value);
                        //console.log("#########SummaryChartModel#####", oView.getModel("SummaryChartModel").getData());
                    }).bind(this) 
                })
                 
            }).bind(this));
        },

        _goChartlView_: function(oEvent,sFrom,eTo){
            
            console.log(" _goChartlView__ oEvent :: ", oEvent);
            var oView = this.getView();

            $.ajax({
                    url: "ep/cm/forexDeclarationMgt/webapp/srv-api/odata/v4/ep.PoApprMgtV4Service/ForexDeclarationSummaryView(tenant_id='L2100',company_code='LGCKR',purchasing_department_code='',buyer_empno='',po_start_date="+this.sFrom +",po_end_date="+ this.sTo +")/Set",
                    type: "GET",
                    contentType: "application/json",
                    
                    success: (function (oData) {
                        console.log("#########oData Success#####", oData.value);
                        this.getModel("popup").setProperty("/summaryChart", oData.value);
                        //console.log("#########SummaryChartModel#####", oView.getModel("SummaryChartModel").getData());
                    }).bind(this) 
                })
        },

        onChartSearchButtonPress: function (oEvent) {
            
            console.log("chart search ::: " , oEvent);


            console.log("this.getFormatDate(sFrom) :: ", this.sFrom);
            console.log("this.getFormatDate(to) :: ", this.sTo);
            console.log("sDate ::: " , this.sFrom);
            console.log("sTo::: " , this.sTo);



            this._goChartlView_(oEvent,this.sFrom,this.sTo);
        },


        press: function (oEvent) {
			MessageToast.show("The interactive bar chart is pressed.");
		},

		selectionChanged: function (oEvent) {
			var oBar = oEvent.getParameter("bar");
			MessageToast.show("The selection changed: " + oBar.getLabel() + " " + ((oBar.getSelected()) ? "selected" : "deselected"));
		},
        

        _goDetailView: function(oEvent){
            
            console.log("oEvent :: ", oEvent);

            var oView = this.getView();
            var oTable = oView.byId("mainTable"),
                oModel = this.getView().getModel("list");
            var rowData = oEvent.getParameter('rowBindingContext').getObject();
            var that = this;
            
            var input = {};
            var saveForexDtl = [];
            var poNumber = rowData.po_number;
            console.log("po_number :: ", poNumber);
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

            console.log("####saveForexDtl(1)====", saveForexDtl);

            input.forexItems = saveForexDtl;
            this.getModel("forexDtl").setData(input);

            console.log("####forexDtl(2)====", this.getModel("forexDtl").getData());
            console.log("rowData :: ", rowData);
            
            /* 신고진행상태
            920010	작성대기
            920020	신고진행중
            920030	신고완료
            */			

            var forexDeclareStatusName = rowData.forex_declare_status_name;
            var pageVal = "";
            // if(forexDeclareStatusName == "920010" || forexDeclareStatusName == "920020"){
            //     pageVal = "ep.cm.forexDeclarationMgt.view.forexDetail_Edit"
            // }else{
            //     pageVal = "ep.cm.forexDeclarationMgt.view.forexDetail_Show"
            // }

            if(forexDeclareStatusName == "작성대기" || forexDeclareStatusName == "신고진행중"){
                pageVal = "ep.cm.forexDeclarationMgt.view.forexDetail_Edit"
            }else{
                pageVal = "ep.cm.forexDeclarationMgt.view.forexDetail_Show"
            }


            this._forexDialog = Fragment.load({
                id: oView.getId(),
                name: pageVal,
                controller: this
            }).then(function (_forexDialog) {
                oView.addDependent(_forexDialog);
                
                //console.log("_forexDialog :::: " , oView);
                return _forexDialog;
            }.bind(this));

            this._forexDialog.then(function (_forexDialog) {
                _forexDialog.open();

                if(forexDeclareStatusName == "작성대기" || forexDeclareStatusName == "신고진행중"){
                    oView.byId("poNumber").setText(rowData.po_number);
                    oView.byId("poName").setText(rowData.po_name);
                    oView.byId("receiptScheduledDate").setText(that.getFormatDate(rowData.receipt_scheduled_date));
                    oView.byId("declareScheduledDate").setDateValue(rowData.declare_scheduled_date);
                    oView.byId("declareDate").setDateValue(rowData.declare_date);
                    oView.byId("processedCompleteDate").setText(that.getFormatDate(rowData.processed_complete_date));
                    oView.byId("remark").setValue(rowData.remark);
                }else{
                    oView.byId("poNumber").setText(rowData.po_number);
                    oView.byId("poName").setText(rowData.po_name);
                    oView.byId("receiptScheduledDate").setText(that.getFormatDate(rowData.receipt_scheduled_date));
                    oView.byId("declareScheduledDate").setText(that.getFormatDate(rowData.declare_scheduled_date));
                    oView.byId("declareDate").setText(that.getFormatDate(rowData.declare_date));
                    oView.byId("processedCompleteDate").setText(that.getFormatDate(rowData.processed_complete_date));
                    oView.byId("remark").setText(rowData.remark);
                }
                 
            });
        },


        dialogAfterclose: function() {
            this.byId("dialogForex").destroy();
        },

        dialogChartAfterclose: function() {
            this.byId("dialogForexChart").destroy();
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
            console.log("forexDtlModel.getData()1234==" + JSON.stringify(forexDtlModel.getData()));

            if(statusCode == "920010" || statusCode == "920020"){
                forexDtlModel.getData()["forexItems"].map(d => {
                    d["declare_scheduled_date"] = that.getFormatDate2(oView.byId("declareScheduledDate").getDateValue());
                    d["declare_date"] = that.getFormatDate2(oView.byId("declareDate").getDateValue());
                    d["remark"] = oView.byId("remark").getValue();
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

        onExitSummaryChart: function () {
            this.byId("dialogForexChart").close();
        },

        _findFragmentControlId : function (fragmentID, controlID) {
            return sap.ui.core.Fragment.byId(fragmentID, controlID);
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
        },

        getFormatDate2 : function (date) {

            if(!date){
                return '';
            }

            var year = date.getFullYear();              //yyyy
            var month = (1 + date.getMonth());          //M
            month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
            var day = date.getDate();                   //d
            day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
            return  year + '' + month + '' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
        },

        creationDateChange: function (oEvent) {
            
            // this.sFrom="";
            // this.sTo = ""
            this.sFrom = this.getFormatDate(oEvent.getParameter("from"));
            this.sTo = this.getFormatDate(oEvent.getParameter("to"));

            console.log("this.getFormatDate(sFrom) :: ", this.sFrom);
            console.log("this.getFormatDate(to) :: ", this.sTo);
        }

    });
});