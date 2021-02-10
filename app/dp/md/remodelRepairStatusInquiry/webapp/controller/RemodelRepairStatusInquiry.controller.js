sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/model/ManagedListModel",
    "ext/lib/util/Multilingual",
    "ext/lib/util/Validator",
    "./RemodelRepairStatusInquiryPersoService",
    "sap/ui/base/ManagedObject",
    "sap/ui/core/routing/History",
    "sap/ui/core/Element",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    "sap/ui/table/Column",
    "sap/ui/table/Row",
    "sap/ui/table/TablePersoController",
    "sap/ui/core/Item",
    "sap/m/ComboBox",
    "sap/m/ColumnListItem",
    "sap/m/Input",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/ObjectIdentifier",
    'sap/m/SearchField',
    "sap/m/Text",
    "sap/m/Token",
    "dp/md/util/controller/SupplierSelection",
    "ext/lib/util/ExcelUtil",
    "ext/lib/formatter/NumberFormatter",
    "ext/lib/util/SppUserSession"
], function (BaseController, DateFormatter, ManagedListModel, Multilingual, Validator, RemodelRepairStatusInquiryPersoService, 
    ManagedObject, History, Element, Fragment, JSONModel, Filter, FilterOperator, Sorter, Column, Row, TablePersoController, Item, 
    ComboBox, ColumnListItem, Input, MessageBox, MessageToast, ObjectIdentifier, SearchField, Text, Token, SupplierSelection, ExcelUtil,
    NumberFormatter, SppUserSession) {
    "use strict";
    
    return BaseController.extend("dp.md.remodelRepairStatusInquiry.controller.RemodelRepairStatusInquiry", {

        dateFormatter: DateFormatter,
        numberFormatter: NumberFormatter,
        validator: new Validator(),
        supplierSelection: new SupplierSelection(),
        userInfo: {},

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the remodelRepairStatusInquiry controller is instantiated.
         * @public
         */
        onInit : function () {
            var oViewModel,
                oResourceBundle = this.getResourceBundle();

            var sppUserSession = new SppUserSession();
            this.setModel(sppUserSession.getModel(),'USER_SESSION');
            
            this.userInfo = this.getSessionUserInfo();

            this.userInfo.TENANT_ID = 'L2101';  //임시

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                remodelRepairStatusInquiryTableTitle : oResourceBundle.getText("remodelRepairStatusInquiryTableTitle"),
                tableNoDataText : oResourceBundle.getText("tableNoDataText")
            });
            this.setModel(oViewModel, "remodelRepairStatusInquiryView");

            // Add the remodelRepairStatusInquiry page to the flp routing history
            this.addHistoryEntry({
                title: oResourceBundle.getText("remodelRepairStatusInquiryViewTitle"),
                icon: "sap-icon://table-view",
                intent: "#Template-display"
            }, true);
            
            this._doInitSearch();
            //this._doInitTablePerso();
            
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            
            this.setModel(new ManagedListModel(), "list");

            this._oTPC = new TablePersoController({
                customDataKey: "remodelRepairStatusInquiry",
                persoService: RemodelRepairStatusInquiryPersoService
            }).setTable(this.byId("moldMstTable"));

            //sheet.js cdn url
            jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.5/xlsx.full.min.js");
        },
        
        onMainTablePersoButtonPressed: function (event) {
            this._oTPC.openDialog();
            
        },
        
        onAfterRendering : function () {
            this.getModel().setDeferredGroups(["bindReceipt", "cancelBind", "delete", "receipt"]);
            
            return;
        },

        /**
         * @private
         * @see 검색을 위한 컨트롤에 대하여 필요 초기화를 진행 합니다. 
         */
        _doInitSearch: function(){
            var companyRole = 'LGESL';
            var orgRole = 'A040';

            this.getView().setModel(this.getOwnerComponent().getModel());

            this.setDivision(companyRole);

            //접속자 법인 사업부로 바꿔줘야함
            this.getView().byId("searchCompanyS").setSelectedKeys(companyRole);
            this.getView().byId("searchCompanyE").setSelectedKeys(companyRole);
            this.getView().byId("searchDivisionS").setSelectedKeys(orgRole);
            this.getView().byId("searchDivisionE").setSelectedKeys(orgRole);

            /** Create Date */
            var today = new Date();
            
            // this.getView().byId("searchCreationDateE").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()-90));
            // this.getView().byId("searchCreationDateE").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
            // this.getView().byId("searchCreationDateS").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()-90));
            // this.getView().byId("searchCreationDateS").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
        },

        setDivision: function(companyCode){
            
            var filter = new Filter({
                            filters: [
                                    new Filter("tenant_id", FilterOperator.EQ, this.userInfo.TENANT_ID ),
                                    new Filter("company_code", FilterOperator.EQ, companyCode)
                                ],
                                and: true
                        });

            var bindItemInfo = {
                    path: '/Divisions',
                    filters: filter,
                    template: new Item({
                        key: "{org_code}", text: "[{org_code}] {org_name}"
                    })
                };

            this.getView().byId("searchDivisionS").bindItems(bindItemInfo);
            this.getView().byId("searchDivisionE").bindItems(bindItemInfo);
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Triggered by the table's 'updateFinished' event: after new table
         * data is available, this handler method updates the table counter.
         * This should only happen if the update was successful, which is
         * why this handler is attached to 'updateFinished' and not to the
         * table's list binding's 'dataReceived' method.
         * @param {sap.ui.base.Event} oEvent the update finished event
         * @public
         */
        onMoldMstTableUpdateFinished : function (oEvent) {
            // update the remodelRepairStatusInquiry's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("remodelRepairStatusInquiryTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("remodelRepairStatusInquiryTableTitle");
            }
            this.getModel("remodelRepairStatusInquiryView").setProperty("/remodelRepairStatusInquiryTableTitle", sTitle);
        },

        /**
         * Event handler when a table item gets pressed
         * @param {sap.ui.base.Event} oEvent the table selectionChange event
         * @public
         */
        onMoldMstTablePersoButtonPressed: function(oEvent){
            this._oTPC.openDialog();
        },

        /**
         * Event handler when a table personalization refresh
         * @param {sap.ui.base.Event} oEvent the table selectionChange event
         * @public
         */
        onMoldMstTablePersoRefresh : function() {
            RemodelRepairStatusInquiryPersoService.resetPersData();
            this._oTPC.refresh();
        },

        /**
         * Event handler when a table item gets pressed
         * @param {sap.ui.base.Event} oEvent the table selectionChange event
         * @public
         */
        onMoldMstTableItemPress : function (oEvent) {
            // The source is the list item that got pressed
            this._showMainObject(oEvent.getSource());
        },

        onMoldMstTableUserSearch: function (event) {
            var oItem = event.getParameter("suggestionItem");
            this.handleEmployeeSelectDialogPress(event);
        },

        /**
         * @description employee 팝업 닫기 
         */
        onExitEmployee: function () {
            this.byId("dialogEmployeeSelection").close();
           // this.byId("dialogEmployeeSelection").destroy();
        },

        /**
         * @description employee 팝업 열기 
         */
        handleEmployeeSelectDialogPress : function (oEvent) {
  
            var oView = this.getView();
            var oButton = oEvent.getSource();
            if (!this._oDialog) {
                this._oDialog = Fragment.load({ 
                    id: oView.getId(),
                    name: "dp.md.remodelRepairStatusInquiry.view.Employee",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            } 
            
            this._oDialog.then(function(oDialog) {
                oDialog.open();
            });
            
        },

        // I18NFormatter: function(foo,bar){
        //     console.log('I18NFormatter');
        //     console.log(foo);
        //     console.log(bar);

        //     var myformatter = function(aa, bb){
        //         console.log(aa,bb);
        //         return null;
        //     }
        // },


        /**
         * Event handler when a search button pressed
         * @param {sap.ui.base.Event} oEvent the button press event
         * @public
         */
        onPageSearchButtonPress : function () {

            this.validator.validate( this.byId('pageSearchFormE'));
            if(this.validator.validate( this.byId('pageSearchFormS') ) !== true) return;

            var aTableSearchState = this._getSearchStates();
            this._applySearch(aTableSearchState);
        },

        /**
         * Event handler for page edit button press
         * @public
         */
        onMoldMstTableEditButtonPress: function(){
            this._toEditMode();
        },
        
        
/*
        inputFieldChange : function (oEvent) {
            this.byId("moldMstTable").setSelectedIndex([oEvent.getSource().getParent().getIndex()]);
        },
*/
        onRefresh : function () {
            var oBinding = this.byId("moldMstTable").getBinding("rows");
            this.getView().setBusy(true);
            oBinding.refresh();
            this.getView().setBusy(false);
        },

        
        /**
         * Event handler for cancel page editing
         * @public
         */
        onPageCancelEditButtonPress: function(){
            this._toShowMode();
        },

        /**
         * Event handler for refresh event. Keeps filter, sort
         * and group settings and refreshes the list binding.
         * @public
         */
        onRefreshPress : function () {
            var oTable = this.byId("moldMstTable");
            oTable.getBinding("rows").refresh();
            
        },

        creationDateChange : function (oEvent) {
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S",
                seSurffix = sSurffix === "E" ? "S" : "E",
                sFrom = oEvent.getParameter("from"),
                sTo = oEvent.getParameter("to");

            this.getView().byId("searchCreationDate"+seSurffix).setDateValue(sFrom);
            this.getView().byId("searchCreationDate"+seSurffix).setSecondDateValue(sTo);
        },
        
        onStatusSelectionChange : function (oEvent) {
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S",
                seSurffix = sSurffix === "E" ? "S" : "E",
                oSearchStatus = this.getView().byId("searchStatus"+seSurffix);

            oSearchStatus.setSelectedKey(oEvent.getParameter("item").getKey());

            this.toggleEnabledDate(oEvent.getParameter("item").getKey());
        },

        toggleEnabledDate: function(status){
            //confirm 일때 활성화

            var dateS = this.byId('searchCreationDateS');
            var dateE = this.byId('searchCreationDateE');

            if(status == 'RCV_CNF'){
                dateS.setEnabled(true);
                dateE.setEnabled(true);

                dateS.setRequired(true);
                dateE.setRequired(true);
            }else{
                dateS.setEnabled(false);
                dateE.setEnabled(false);

                dateS.setRequired(false);
                dateE.setRequired(false);

                dateS.setValue('');
                dateE.setValue('');
            }
        },
        
        onSuppValueHelpRequested: function(oEvent){

            var companyCodes, plantCodes;
            var row = oEvent.getSource().getParent();
            
            if(row && row.sParentAggregationName == 'rows'){
                //table 의 supplier
                companyCodes = row.getCells()[0].getText();
                plantCodes = row.getCells()[1].getText();
            }else{
                //조회 조건의 supplier
                var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S";
                companyCodes = this.getView().byId("searchCompany"+sSurffix).getSelectedKeys();
                plantCodes = this.getView().byId("searchDivision"+sSurffix).getSelectedKeys();
            }

            var oInput = oEvent.getSource();

            var param = {
                'oThis':this,
                'oEvent':oEvent,
                'companyCode':companyCodes,
                'orgCode':plantCodes,
                'isMulti':false
            }
            
            this.supplierSelection.showSupplierSelection(param, function(tokens){

                // var suppCode = tokens[0].getKey();
                oInput.setValue(tokens[0].getKey());
                // oInput.setDescription( tokens[0].getText().replace(' ('+suppCode+')', '') );
            });
        },

        onTestSuppBtnPress: function(oEvent){
            var sCompanyCode, sPlantCode;
            sCompanyCode = 'LGEKR';
            sPlantCode = 'DFZ';
            this.supplierSelection.showSupplierSelection(this, oEvent, sCompanyCode, sPlantCode, function(data){
                console.log(data);
            });
        },

        handleAttachmentPress: function(oEvent){
            MessageToast.show( "준비중.." );
        },

        onMoldMstTableConfirmButtonPress: function(oEvent){
            var oTable = this.byId("moldMstTable"),
                oModel = this.getModel('dse'),
                lModel = this.getModel("list"),
                oView = this.getView(),
                oSelected  = oTable.getSelectedIndices();
            var self = this;

            if (oSelected.length == 0) {
                MessageToast.show( "아이템을 선택하세요." );
                return;
            }

            if(this.validator.validate( this.byId('moldMstTable') ) !== true){
                MessageToast.show( this.getModel('I18N').getText('/ECM0201') );
                return;
            }

            MessageBox.confirm("Confirm 하시겠습니까?", {
                title : "Comfirmation",
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {

                        

                        // console.log('11',lModel);

                        oSelected.forEach(function (idx) {
                            
                            var selectItem = lModel.getData().MoldMasterSpec[idx];
                            var sEntity = selectItem.__entity;

                            selectItem.mold_progress_status_code = "RCV_CNF";
                            selectItem.receipt_confirmed_user_empno = 'temp_empno';
                            
                            delete selectItem.__entity;
                            delete selectItem._row_state_;

                            oModel.update(sEntity, selectItem, {
                                success: function(result){
                                    oView.setBusy(false);
                                    MessageToast.show("Success to Receipt Confirm.");
                                    self.onPageSearchButtonPress();
                                }.bind(this), 
                                error: function(oError){MessageToast.show("oError");
                                    oView.setBusy(false);
                                    MessageBox.error(oError.message);
                                }
                            });

                        // }.bind(this));

                        });

                        // console.log(oModel);

                        // lModel.submitChanges({
                        //     success: function(){
                        //         oView.setBusy(false);
                        //         MessageToast.show("Success to Receipt Confirm.");
                        //         // this.onPageSearchButtonPress();
                        //     }.bind(this), error: function(oError){MessageToast.show("oError");
                        //         oView.setBusy(false);
                        //         MessageBox.error(oError.message);
                        //     }
                        // });

                        // oTransactionManager.submit({
                        //   success: function(){
                        //         oView.setBusy(false);
                        //         MessageToast.show("Success to Receipt Confirm.");
                        //         // this.onPageSearchButtonPress();
                        //     }.bind(this), error: function(oError){MessageToast.show("oError");
                        //         oView.setBusy(false);
                        //         MessageBox.error(oError.message);
                        //     }
                        // });
                    };
                }.bind(this)
            });

        },

        onExportPress: function (_oEvent) {
            var sTableId = _oEvent.getSource().getParent().getParent().getId();
            if (!sTableId) { return; }

            var oTable = this.byId(sTableId);
            
            // var sFileName = oTable.title || this.byId("page").getTitle(); //file name to exporting
            var oData = oTable.getModel('list').getProperty("/MoldMasterSpec");
            // var rows = oTable.getRows();

            // console.log('oData',oData);

            // for(var i=0 ; i<oData.length ; i++){
            //     console.log(i);
            //     var _cells = rows[i].getCells();
            //     oData[i].mold_progress_status_code = _cells[6].getValue();
            //     oData[i].inspection_flag = oData[i].inspection_flag?'YES':'NO';
            //     oData[i].mold_production_type_code = _cells[13].getSelectedItem().getText();
            //     oData[i].mold_item_type_code = _cells[14].getValue();
            // }

            ExcelUtil.fnExportExcel({
                fileName: "RemodelRepairStatusInquiry",
                table: oTable,
                data: oData
            });
        },

        familyFlagChange : function (oEvent) {
            var sSelectedKey = oEvent.getSource().getSelectedKey();
            
            if (sSelectedKey === 'Y') {
                oEvent.getSource().getParent().getCells()[23].setEditable(true);
                oEvent.getSource().getParent().getCells()[24].setEditable(true);
                oEvent.getSource().getParent().getCells()[25].setEditable(true);
                oEvent.getSource().getParent().getCells()[26].setEditable(true);
                oEvent.getSource().getParent().getCells()[27].setEditable(true);
            } else {
                oEvent.getSource().getParent().getCells()[23].setEditable(false);
                oEvent.getSource().getParent().getCells()[24].setEditable(false);
                oEvent.getSource().getParent().getCells()[25].setEditable(false);
                oEvent.getSource().getParent().getCells()[26].setEditable(false);
                oEvent.getSource().getParent().getCells()[27].setEditable(false);
            }
        },

        getFormatDate : function (date) {

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

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Shows the selected item on the object page
         * On phones a additional history entry is created
         * @param {sap.m.ObjectListItem} oItem selected Item
         * @private
         */
        _showMainObject : function (oItem) {
            var that = this;
            oItem.getBindingContext().requestCanonicalPath().then(function (sObjectPath) {
                that.getRouter().navTo("mainObject", {
                    tenantId: oItem.getBindingContext().getProperty("tenant_id"),
                    messageCode: oItem.getBindingContext().getProperty("message_code"),
                    languageCode: oItem.getBindingContext().getProperty("language_code")
                });
            });
        },

        /**
         * Internal helper method to apply both filter and search state together on the list binding
         * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
         * @private
         */
        _applySearch: function(aTableSearchState) {
            var oView = this.getView();
            var oModel = this.getModel("list");
            var self = this;
            
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel('dse'));
            oModel.read("/MoldMasterSpec", {
                filters: aTableSearchState,
                success: function(oData){
                    this.validator.clearValueState(this.byId("moldMstTable"));
                    self.byId('moldMstTable').clearSelection();
                    oView.setBusy(false);
                }.bind(this)
            });
        },

        
        _getSearchStates: function(){
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S",
                company = this.getView().byId("searchCompany"+sSurffix).getSelectedKeys(),
                division = this.getView().byId("searchDivision"+sSurffix).getSelectedKeys(),
                status = this.getView().byId("searchStatus"+sSurffix).getSelectedKey(),
                receiptFromDate = this.getView().byId("searchCreationDate"+sSurffix).getDateValue(),
                receiptToDate = this.getView().byId("searchCreationDate"+sSurffix).getSecondDateValue(),
                itemType = this.getView().byId("searchItemType").getSelectedKeys(),
                description = this.getView().byId("searchDescription").getValue(),
                model = this.getView().byId("searchModel").getValue(),
                moldNo = this.getView().byId("searchMoldNo").getValue();
            
            var aTableSearchState = [];
            var companyFilters = [];
            var divisionFilters = [];

            if(company.length > 0){

                company.forEach(function(item){
                    companyFilters.push(new Filter("company_code", FilterOperator.EQ, item ));
                });

                aTableSearchState.push(
                    new Filter({
                        filters: companyFilters,
                        and: false
                    })
                );
            }
            
            if(division.length > 0){

                division.forEach(function(item){
                    divisionFilters.push(new Filter("org_code", FilterOperator.EQ, item ));
                });

                aTableSearchState.push(
                    new Filter({
                        filters: divisionFilters,
                        and: false
                    })
                );
            }

            if (receiptFromDate || receiptToDate) {
                aTableSearchState.push(new Filter("receipt_confirmed_date", FilterOperator.BT, this.getFormatDate(receiptFromDate), this.getFormatDate(receiptToDate)));
            }

            if (status && status != 'ALL') {
                aTableSearchState.push(new Filter("mold_progress_status_code", FilterOperator.EQ, status));
            }

            
            if(itemType.length > 0){

                var _itemTypeFilters = [];
                itemType.forEach(function(item){
                    _itemTypeFilters.push(new Filter("mold_item_type_code", FilterOperator.EQ, item ));
                });

                aTableSearchState.push(
                    new Filter({
                        filters: _itemTypeFilters,
                        and: false
                    })
                );
            }

            if (model && model.length > 0) {
                aTableSearchState.push(new Filter("tolower(model)", FilterOperator.Contains, "'" + model.toLowerCase() + "'"));
            }
            if (moldNo && moldNo.length > 0) {
                aTableSearchState.push(new Filter("mold_number", FilterOperator.Contains, moldNo.toUpperCase()));
            }
            if (description && description.length > 0) {
                aTableSearchState.push(new Filter("tolower(spec_name)", FilterOperator.Contains, "'" + description.toLowerCase() + "'"));
            }
            
            return aTableSearchState;
        },
        
        _toEditMode: function(){
            var oRows = this.byId("moldMstTable").getRows(),
                oUiModel = this.getView().getModel("mode");
                oUiModel.setProperty("/editFlag", true);
                oUiModel.setProperty("/viewFlag", false);

            oRows.forEach(function (oRow) {
                var oCells = oRow.getCells();

                oCells.forEach(function (oCell, jdx) {
                    if(jdx > 6 && jdx !== 12){
                        oCell.removeStyleClass("readonlyField");
                    }
                });
            });
            
            var FALSE = false;
            this.byId("page").setProperty("showFooter", !FALSE);
            this.byId("moldMstTable").setSelectionMode(sap.ui.table.SelectionMode.None);
        },

        _toShowMode: function(){
            var oRows = this.byId("moldMstTable").getRows(),
                oUiModel = this.getView().getModel("mode");
                oUiModel.setProperty("/editFlag", false);
                oUiModel.setProperty("/viewFlag", true);

            oRows.forEach(function (oRow) {
                var oCells = oRow.getCells();

                oCells.forEach(function (oCell, jdx) {
                    if(jdx > 6 && jdx !== 12){
                        oCell.addStyleClass("readonlyField");
                    }
                });
            });
            
            var TRUE = true;
            this.byId("page").setProperty("showFooter", !TRUE);
            this.byId("moldMstTable").setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
        },

        handleSelectionFinishComp: function(oEvent){

            this.copyMultiSelected(oEvent);

            var params = oEvent.getParameters();
            var divisionFilters = [];
            var self = this;

            console.log('self.userInfo.TENANT_ID',self.userInfo.TENANT_ID);

            if(params.selectedItems.length > 0){

                params.selectedItems.forEach(function(item, idx, arr){

                    divisionFilters.push(new Filter({
                                filters: [
                                    new Filter("tenant_id", FilterOperator.EQ, self.userInfo.TENANT_ID ),
                                    new Filter("company_code", FilterOperator.EQ, item.getKey() )
                                ],
                                and: true
                            }));
                });
            }else{
                divisionFilters.push(new Filter("tenant_id", FilterOperator.EQ, self.userInfo.TENANT_ID ));
            }

            var filter = new Filter({
                            filters: divisionFilters,
                            and: false
                        });

            var bindInfo = {
                    path: '/Divisions',
                    filters: filter,
                    template: new Item({
                    key: "{org_code}", text: "[{org_code}] {org_name}"
                    })
                };

            this.getView().byId("searchDivisionS").bindItems(bindInfo);
            this.getView().byId("searchDivisionE").bindItems(bindInfo);
        },

        handleSelectionFinishDiv: function(oEvent){
            this.copyMultiSelected(oEvent);
        },

        copyMultiSelected: function(oEvent){
            var source = oEvent.getSource();
            var params = oEvent.getParameters();

            var sIds = source.sId.split('--');
            var id = sIds[sIds.length-1];
            var idPreFix = id.substr(0, id.length-1);
            var selectedKeys = [];

            params.selectedItems.forEach(function(item, idx, arr){
                selectedKeys.push(item.getKey());
            });

            this.getView().byId(idPreFix+'S').setSelectedKeys(selectedKeys);
            this.getView().byId(idPreFix+'E').setSelectedKeys(selectedKeys);
        },

        onValueHelpRequested : function (oEvent) {

            var path = '';
            this._oValueHelpDialog = sap.ui.xmlfragment("dp.md.remodelRepairStatusInquiry.view.ValueHelpDialogModel", this);

            this._oBasicSearchField = new SearchField({
                showSearchButton: false
            });
            
            var oFilterBar = this._oValueHelpDialog.getFilterBar();
            oFilterBar.setFilterBarExpanded(false);
            oFilterBar.setBasicSearch(this._oBasicSearchField);
            
            this.setValuHelpDialog(oEvent);

            

            var aCols = this.oColModel.getData().cols;
            var self = this;
            
            this.getView().addDependent(this._oValueHelpDialog);

            this._oValueHelpDialog.getTableAsync().then(function (oTable) {

                var _filter = new Filter("tenant_id", FilterOperator.EQ, self.userInfo.TENANT_ID );
                
                oTable.setModel(self.getOwnerComponent().getModel(self.modelName));
                oTable.setModel(self.oColModel, "columns");

                if (oTable.bindRows) {
                    oTable.bindAggregation("rows", self.vhdPath);
                    oTable.getBinding("rows").filter(_filter);
                }

                if (oTable.bindItems) {
                    oTable.bindAggregation("items", self.vhdPath, function () {
                        return new ColumnListItem({
                            cells: aCols.map(function (column) {
                                return new Label({ text: "{" + column.template + "}" });
                            })
                        });
                    });
                    oTable.getBinding("items").filter(_filter);
                }
                self._oValueHelpDialog.update();

            }.bind(this));

            

            // debugger

            var oToken = new Token();
            oToken.setKey(this._oInputModel.getSelectedKey());
            oToken.setText(this._oInputModel.getValue());
            this._oValueHelpDialog.setTokens([oToken]);
            this._oValueHelpDialog.open();
            

        },

        setValuHelpDialog: function(oEvent){

            if(oEvent.getSource().sId.indexOf("searchModel") > -1){
                //model
                this._oInputModel = this.getView().byId("searchModel");

                this.oColModel = new JSONModel({
                    "cols": [
                        {
                            "label": "Model",
                            "template": "model"
                        }
                    ]
                });

                this.modelName = 'dse';
                this.vhdPath = '/Models';
                
                this._oValueHelpDialog.setTitle('Model');
                this._oValueHelpDialog.setKey('model');
                this._oValueHelpDialog.setDescriptionKey('model');

            }else if(oEvent.getSource().sId.indexOf("searchMoldNo") > -1){
                //part
                this._oInputModel = this.getView().byId("searchMoldNo");

                this.oColModel = new JSONModel({
                    "cols": [
                        {
                            "label": "Mold No",
                            "template": "mold_number"
                        },
                        {
                            "label": "Item Type",
                            "template": "mold_item_type_name"
                        },
                        {
                            "label": "Description",
                            "template": "spec_name"
                        }
                    ]
                });

                this.modelName = 'dse';
                this.vhdPath = '/PartNumbers';
                this._oValueHelpDialog.setTitle('Mold No');
                this._oValueHelpDialog.setKey('mold_number');
                this._oValueHelpDialog.setDescriptionKey('spec_name');

            }else if(oEvent.getSource().sId.indexOf("searchRequester") > -1){

                this._oInputModel = this.getView().byId("searchRequester");

                this.oColModel = new JSONModel({
                    "cols": [
                        {
                            "label": "Name",
                            "template": "create_user_name"
                        },
                        {
                            "label": "ID",
                            "template": "create_user_id"
                        }
                    ]
                });

                this.modelName = 'dsc';
                this.vhdPath = '/CreateUsers';
                this._oValueHelpDialog.setTitle('Requester');
                this._oValueHelpDialog.setKey('create_user_id');
                this._oValueHelpDialog.setDescriptionKey('create_user_id');
            }
        },

        onValueHelpOkPress: function (oEvent) {
            var aTokens = oEvent.getParameter("tokens");
            this._oInputModel.setSelectedKey(aTokens[0].getKey());
            this._oValueHelpDialog.close();
        },

        onValueHelpCancelPress: function () {
            this._oValueHelpDialog.close();
        },

        onValueHelpAfterClose: function () {
            this._oValueHelpDialog.destroy();
        },

        onFilterBarSearch: function (oEvent) {
            
            var aSelectionSet = oEvent.getParameter("selectionSet");
            var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                if (oControl.getValue()) {
                    aResult.push(new Filter({
                        path: oControl.getName(),
                        operator: FilterOperator.Contains,
                        value1: oControl.getValue()
                    }));
                }

                return aResult;
            }, []);
            
            var _tempFilters = this.getFiltersFilterBar();

            aFilters.push(new Filter({
                filters: _tempFilters,
                and: false
            }));

            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this.userInfo.TENANT_ID ));

            this._filterTable(new Filter({
                filters: aFilters,
                and: true
            }));
        },

        getFiltersFilterBar: function(){

            var sSearchQuery = this._oBasicSearchField.getValue();
            var _tempFilters = [];

            if(this._oValueHelpDialog.oRows.sPath.indexOf('/Models') > -1){
                // /Models
                _tempFilters.push(new Filter("tolower(model)", FilterOperator.Contains, "'"+sSearchQuery.toLowerCase().replace("'","''")+"'"));

            }else if(this._oValueHelpDialog.oRows.sPath.indexOf('/PartNumbers') > -1){
                //MoldNumbers
                _tempFilters.push(new Filter({ path: "tolower(mold_number)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
                _tempFilters.push(new Filter({ path: "tolower(mold_item_type_name)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
                _tempFilters.push(new Filter({ path: "tolower(spec_name)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
            }else if(this._oValueHelpDialog.oRows.sPath.indexOf('/CreateUsers') > -1){
                _tempFilters.push(new Filter({ path: "tolower(create_user_name)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
                _tempFilters.push(new Filter({ path: "tolower(create_user_id)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
            }

            return _tempFilters;
        },
        
        _filterTable: function (oFilter) {
            var oValueHelpDialog = this._oValueHelpDialog;

            oValueHelpDialog.getTableAsync().then(function (oTable) {
                if (oTable.bindRows) {
                    oTable.getBinding("rows").filter(oFilter);
                }

                if (oTable.bindItems) {
                    oTable.getBinding("items").filter(oFilter);
                }

                oValueHelpDialog.update();
            });
        },
        
        _doInitTablePerso: function(){
            // init and activate controller
            this._oTPC = new TablePersoController({
                table: this.byId("moldMstTable"),
                componentName: "remodelRepairStatusInquiry",
                persoService: RemodelRepairStatusInquiryPersoService,
                hasGrouping: true
            }).activate();
        }

    });
});