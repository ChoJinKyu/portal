sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/model/ManagedListModel",
    "ext/lib/util/Multilingual",
    "ext/lib/util/Validator",
    "ext/lib/util/ExcelUtil",
    "cm/util/control/ui/EmployeeDialog",
    "dp/md/util/controller/ModelDeveloperSelection",
    "./DevelopmentReceiptPersoService",
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
    "sap/m/Token"
], function (BaseController, DateFormatter, ManagedListModel, Multilingual, Validator, ExcelUtil, EmployeeDialog, ModelDeveloperSelection, DevelopmentReceiptPersoService,
    ManagedObject, History, Element, Fragment, JSONModel, Filter, FilterOperator, Sorter, Column, Row, TablePersoController, Item,
    ComboBox, ColumnListItem, Input, MessageBox, MessageToast, ObjectIdentifier, SearchField, Text, Token) {
    "use strict";

    return BaseController.extend("dp.md.developmentReceipt.controller.DevelopmentReceipt", {

        dateFormatter: DateFormatter,

        validator: new Validator(),

        modelDeveloperSelection: new ModelDeveloperSelection(),

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the developmentReceipt controller is instantiated.
		 * @public
		 */
        onInit: function () {
            var oViewModel,
                oResourceBundle = this.getResourceBundle();

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                developmentReceiptTableTitle: oResourceBundle.getText("developmentReceiptTableTitle"),
                tableNoDataText: oResourceBundle.getText("tableNoDataText")
            });
            this.setModel(oViewModel, "developmentReceiptView");

            // Add the developmentReceipt page to the flp routing history
            this.addHistoryEntry({
                title: oResourceBundle.getText("developmentReceiptViewTitle"),
                icon: "sap-icon://table-view",
                intent: "#Template-display"
            }, true);

            this._doInitSearch();
            //this._doInitTablePerso();

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedListModel(), "list");

            this._oTPC = new TablePersoController({
                customDataKey: "developmentReceipt",
                persoService: DevelopmentReceiptPersoService
            }).setTable(this.byId("moldMstTable"));
            //console.log(this.byId("moldMstTable"));
        },

        onMainTablePersoButtonPressed: function (event) {
            this._oTPC.openDialog();

        },

        onAfterRendering: function () {
            //this.getModel().setDeferredGroups(["bindReceipt", "cancelBind", "delete", "receipt"]);
            this.byId("pageSearchButton").firePress();
            return;
        },

        /**
         * @private
         * @see 검색을 위한 컨트롤에 대하여 필요 초기화를 진행 합니다. 
         */
        _doInitSearch: function () {
            this.getView().setModel(this.getOwnerComponent().getModel());

            this.setDivision('LGESL');//LGEKR

            //접속자 법인 사업부로 바꿔줘야함
            this.getView().byId("searchCompanyS").setSelectedKeys(['LGESL']);
            this.getView().byId("searchCompanyE").setSelectedKeys(['LGESL']);
            this.getView().byId("searchDivisionS").setSelectedKeys(['A040']);//CCZ', 'DHZ', 'PGZ
            this.getView().byId("searchDivisionE").setSelectedKeys(['A040']);

            /** Create Date */
            var today = new Date();

            this.getView().byId("searchCreationDateE").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90));
            this.getView().byId("searchCreationDateE").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
            this.getView().byId("searchCreationDateS").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90));
            this.getView().byId("searchCreationDateS").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
        },

        setDivision: function (companyCode) {
/*
            var filter = new Filter({
                filters: [
                    new Filter("tenant_id", FilterOperator.EQ, 'L2600'),
                    new Filter("org_type_code", FilterOperator.EQ, 'AU'),
                    new Filter("company_code", FilterOperator.EQ, companyCode)
                ],
                and: true
            });

            var bindItemInfo = {
                path: 'purOrg>/Pur_Operation_Org',
                filters: filter,
                template: new Item({
                    key: "{purOrg>org_code}", text: "[{purOrg>org_code}] {purOrg>org_name}"
                })
            };
*/
            var filter = new Filter({
                filters: [
                    new Filter("tenant_id", FilterOperator.EQ, 'L2600'),
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
        onMoldMstTableUpdateFinished: function (oEvent) {
            // update the developmentReceipt's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("developmentReceiptTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("developmentReceiptTableTitle");
            }
            this.getModel("developmentReceiptView").setProperty("/developmentReceiptTableTitle", sTitle);
        },

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onMoldMstTablePersoButtonPressed: function (oEvent) {
            this._oTPC.openDialog();
        },

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onMoldMstTablePersoRefresh: function () {
            DevelopmentReceiptPersoService.resetPersData();
            this._oTPC.refresh();
        },

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onMoldMstTableItemPress: function (oEvent) {
            // The source is the list item that got pressed
            this._showMainObject(oEvent.getSource());
        },

        onMoldMstTableUserSearch: function (oEvent) {
            this.modelDeveloperSelection.showModelDeveloperSelection(this, oEvent);
        },

        onInputWithEmployeeValuePress: function(oEvent){
            oEvent.getSource().getParent().getCells()[0].setSelected(true);
            var index = oEvent.getSource().getBindingContext("list").getPath().split('/')[2];

            this.onInputWithEmployeeValuePress["row"] = index;

            this.byId("employeeDialog").open();
        },

        onEmployeeDialogApplyPress: function(oEvent){
            var userId = oEvent.getParameter("item").email_id.split('@')[0],
                userName = oEvent.getParameter("item").user_local_name,
                employeeNumber = oEvent.getParameter("item").employee_number,
                oModel = this.getModel("list"),
                rowIndex = this.onInputWithEmployeeValuePress["row"];

            oModel.setProperty("/MoldMstView/"+rowIndex+"/mold_developer_name", userName + " [" + userId + "]");
            oModel.setProperty("/MoldMstView/"+rowIndex+"/mold_developer_empno", employeeNumber);
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
        handleEmployeeSelectDialogPress: function (oEvent) {

            var oView = this.getView();
            var oButton = oEvent.getSource();
            if (!this._oDialog) {
                this._oDialog = Fragment.load({
                    id: oView.getId(),
                    name: "dp.md.developmentReceipt.view.Employee",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }

            this._oDialog.then(function (oDialog) {
                oDialog.open();
            });

        },

        /**
         * @description employee 팝업에서 apply 버튼 누르기 
         */
        /*onEmploySelectionApply: function () {
            var oTable = this.byId("employeeSelectTable");
            var aItems = oTable.getSelectedItems();
            var that = this;
            aItems.forEach(function (oItem) {
                var obj = new JSONModel({
                    model: oItem.getCells()[0].getText()
                    , moldPartNo: oItem.getCells()[1].getText()
                });
                that._approvalRowAdd(obj);
            });
            this.onExitEmployee();
        },
*/

        /**
         * @description Approval Row에 add 하기 
         */
        /*_approvalRowAdd: function (obj) {
            var oTable = this.byId("moldMstTable"),
                oModel = this.getModel("list");
            var aItems = oTable.getRows();
            var oldItems = [];
            
            aItems.forEach(function (oItem) {
                //  console.log("oItem >>> " , oItem.mAggregations.cells[0].mProperties.text);
                //  console.log("oItem >>> " , oItem.mAggregations.cells[1].mProperties.selectedKey);
                //  console.log("oItem >>> " , oItem.mAggregations.cells[2].mProperties.value);
                var item = {
                    "no": oItem.mAggregations.cells[0].mProperties.text,
                    "type": oItem.mAggregations.cells[1].mProperties.selectedKey,
                    "nameDept": oItem.mAggregations.cells[2].mProperties.value,
                }
                oldItems.push(item);
            });

            this.getView().setModel(new ManagedListModel(), "list"); // oldItems 에 기존 데이터를 담아 놓고 나서 다시 모델을 리셋해서 다시 담는 작업을 함 

        },
*/
		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
        onPageSearchButtonPress: function () {
            this.validator.validate( this.byId('pageSearchFormE'));
            if(this.validator.validate( this.byId('pageSearchFormS') ) !== true) return;

            var aTableSearchState = this._getSearchStates();
            this._applySearch(aTableSearchState);
        },

        _checkStatus: function () {
            var oModel = this.getModel("list"),
                statusChk = false,
                viewData = oModel.getData().MoldMstView;

            for (var idx = 0; idx < viewData.length; idx++) {
                if(viewData[idx].chk){
                    var statusCode = viewData[idx].mold_progress_status_code;
                    if(!(statusCode === "DEV_REQ" || statusCode === "DEV_RCV")){
                        statusChk = true;
                    }
                }
            }

            return statusChk;
        },

        _checkFamilyPartNo: function () {
            var oModel = this.getModel("list"),
                viewData = oModel.getData().MoldMstView,
                familyPartNoChk = false;

            for (var idx = 0; idx < viewData.length; idx++) {
                if(viewData[idx].chk){
                    if(viewData[idx].family_flag === "Y"){
                        var familyPartNumber1 = viewData[idx].family_part_number_1,
                            familyPartNumber2 = viewData[idx].family_part_number_2,
                            familyPartNumber3 = viewData[idx].family_part_number_3,
                            familyPartNumber4 = viewData[idx].family_part_number_4,
                            familyPartNumber5 = viewData[idx].family_part_number_5;

                        if(familyPartNumber1 === null || familyPartNumber1 === ""){
                            MessageToast.show( "Family Part Number 1부터 입력해 주세요." );
                            return;
                        }
                        
                        if(!(familyPartNumber3 === null || familyPartNumber3 === "")){
                            if(familyPartNumber2 === null || familyPartNumber2 === ""){
                                MessageToast.show("family part number 2부터 입력해 주세요");
                                return;
                            }
                        }
                        if(!(familyPartNumber4 === null || familyPartNumber4 === "")){
                            if(familyPartNumber2 === null || familyPartNumber2 === ""){
                                MessageToast.show("family part number 2부터 입력해 주세요");
                                return;
                            }
                            if(familyPartNumber3 === null || familyPartNumber3 === ""){
                                MessageToast.show("family part number 3부터 입력해 주세요");
                                return;
                            }
                        }
                        if(!(familyPartNumber5 === null || familyPartNumber5 === "")){
                            if(familyPartNumber2 === null || familyPartNumber2 === ""){
                                MessageToast.show("family part number 2부터 입력해 주세요");
                                return;
                            }
                            if(familyPartNumber3 === null || familyPartNumber3 === ""){
                                MessageToast.show("family part number 3부터 입력해 주세요");
                                return;
                            }
                            if(familyPartNumber4 === null || familyPartNumber4 === ""){
                                MessageToast.show("family part number 4부터 입력해 주세요");
                                return;
                            }
                        }
                        
                    }//if(viewData[idx].family_flag === "Y")
                }//if(viewData[idx].chk)
            }//for
            return true;
        },

		/**
		 * Event handler for page Bind button press
		 * @public
		 */
        onMoldMstTableBindButtonPress: function () {
            var oModel = this.getModel("list"),
                viewData = oModel.getData().MoldMstView,
                orgChk = false,
                orgCode = "",
                v_this = this;

            var checkCnt = 0,
                input = {},
                moldViews = [];

            var url = "dp/md/developmentReceipt/webapp/srv-api/odata/v4/dp.DevelopmentReceiptV4Service/BindDevelopmentReceipt";

            for (var idx = 0; idx < viewData.length; idx++) {
                if(viewData[idx].chk){
                    checkCnt++;

                    if(checkCnt === 1){
                        orgCode = viewData[idx].org_code;
                    }else{
                        if(!(orgCode === viewData[idx].org_code)){
                            orgChk = true;
                        }
                    }

                    moldViews.push({
                        chk                         : viewData[idx].chk,
                        tenant_id                   : viewData[idx].tenant_id,
                        company_code                : viewData[idx].company_code,
                        org_code                    : viewData[idx].org_code,
                        mold_number                 : viewData[idx].mold_number,
                        mold_sequence               : viewData[idx].mold_sequence,
                        mold_id                     : viewData[idx].mold_id,
                        mold_progress_status_code   : viewData[idx].mold_progress_status_code,
                        mold_production_type_code   : viewData[idx].mold_production_type_code,
                        mold_item_type_code         : viewData[idx].mold_item_type_code,
                        mold_type_code              : viewData[idx].mold_type_code,
                        mold_location_type_code     : viewData[idx].mold_location_type_code,
                        mold_cost_analysis_type_code: viewData[idx].mold_cost_analysis_type_code,
                        mold_purchasing_type_code   : viewData[idx].mold_purchasing_type_code,
                        die_form                    : viewData[idx].die_form,
                        mold_size                   : viewData[idx].mold_size,
                        mold_developer_empno        : viewData[idx].mold_developer_empno,
                        remark                      : viewData[idx].remark,
                        family_part_number_1        : viewData[idx].family_part_number_1,
                        family_part_number_2        : viewData[idx].family_part_number_2,
                        family_part_number_3        : viewData[idx].family_part_number_3,
                        family_part_number_4        : viewData[idx].family_part_number_4,
                        family_part_number_5        : viewData[idx].family_part_number_5,
                        set_id                      : viewData[idx].set_id
                    });
                }
            }

            if (checkCnt > 1) {
                if(this._checkStatus()){
                    MessageToast.show( "Development Request, Receipt 상태일 때만 Bind & Receipt 가능합니다." );
                    return;
                }
                if(orgChk){
                    MessageToast.show( "같은 플랜트일 때 Bind & Receipt 가능합니다." );
                    return;
                }
                
                if(!this._checkFamilyPartNo()) return;
 
                MessageBox.confirm("Bind & Receipt 후엔 미접수 상태로 변경은 불가능합니다. Bind & Receipt 하시겠습니까?", {
                    title: "Comfirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            input.moldDatas = moldViews;
                            
                            $.ajax({
                                url: url,
                                type: "POST",
                                data : JSON.stringify(input),
                                contentType: "application/json",
                                success: function(data){
                                    MessageToast.show("Success to Bind & Receipt.");
                                    v_this.onPageSearchButtonPress();
                                },
                                error: function(e){
                                }
                            });
                        };
                    }.bind(this)
                });

                //oTable.clearSelection();
            
            }else{
                MessageBox.error("2개 이상 선택해 주세요.");
            }

        },

        onMoldMstTableCancelButtonPress: function () {
            var oModel = this.getModel("list"),
                viewData = oModel.getData().MoldMstView,
                v_this = this;

            var checkCnt = 0,
                input = {},
                moldViews = [];

            var url = "dp/md/developmentReceipt/webapp/srv-api/odata/v4/dp.DevelopmentReceiptV4Service/CancelBindDevelopmentReceipt";

            for (var idx = 0; idx < viewData.length; idx++) {
                if(viewData[idx].chk){
                    checkCnt++;

                    moldViews.push({
                        chk                         : viewData[idx].chk,
                        tenant_id                   : viewData[idx].tenant_id,
                        company_code                : viewData[idx].company_code,
                        org_code                    : viewData[idx].org_code,
                        mold_number                 : viewData[idx].mold_number,
                        mold_sequence               : viewData[idx].mold_sequence,
                        mold_id                     : viewData[idx].mold_id,
                        mold_progress_status_code   : viewData[idx].mold_progress_status_code,
                        mold_production_type_code   : viewData[idx].mold_production_type_code,
                        mold_item_type_code         : viewData[idx].mold_item_type_code,
                        mold_type_code              : viewData[idx].mold_type_code,
                        mold_location_type_code     : viewData[idx].mold_location_type_code,
                        mold_cost_analysis_type_code: viewData[idx].mold_cost_analysis_type_code,
                        mold_purchasing_type_code   : viewData[idx].mold_purchasing_type_code,
                        die_form                    : viewData[idx].die_form,
                        mold_size                   : viewData[idx].mold_size,
                        mold_developer_empno        : viewData[idx].mold_developer_empno,
                        remark                      : viewData[idx].remark,
                        family_part_number_1        : viewData[idx].family_part_number_1,
                        family_part_number_2        : viewData[idx].family_part_number_2,
                        family_part_number_3        : viewData[idx].family_part_number_3,
                        family_part_number_4        : viewData[idx].family_part_number_4,
                        family_part_number_5        : viewData[idx].family_part_number_5,
                        set_id                      : viewData[idx].set_id
                    });
                }
            }

            if (checkCnt > 1) {
                if(this._checkStatus()){
                    MessageToast.show( "Development Request, Receipt 상태일 때만 Cancel Bind 가능합니다." );
                    return;
                }
                
                if(!this._checkFamilyPartNo()) return;
 
                MessageBox.confirm("Cancel Bind 하시겠습니까?", {
                    title: "Comfirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            input.moldDatas = moldViews;
                            
                            $.ajax({
                                url: url,
                                type: "POST",
                                data : JSON.stringify(input),
                                contentType: "application/json",
                                success: function(data){
                                    MessageToast.show("Success to Cancel Bind.");
                                    v_this.onPageSearchButtonPress();
                                },
                                error: function(e){
                                }
                            });
                        };
                    }.bind(this)
                });

            }else{
                MessageBox.error("2개 이상 선택해 주세요.");
            }
        },

		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        /** Unreceipt 가능. Receipt 상태의 금형 중, 예산 집행품의 또는 입찰대상 협력사 선정 품의 결재 요청 이전 금형에 대해서만 Delete 가능 */
        onMoldMstTableDeleteButtonPress: function () {
            var oModel = this.getModel("list"),
                oView = this.getView(),
                viewData = oModel.getData().MoldMstView,
                checkCnt = 0;

            for (var idx = 0; idx < viewData.length; idx++) {
                if(viewData[idx].chk){
                    checkCnt++;
                }
            }

            if (checkCnt > 0) {
                if (this._checkStatus()) {
                    MessageToast.show("Development Request, Receive 상태일 때만 삭제 가능합니다.");
                    return;
                }

                MessageBox.confirm("삭제하시겠습니까?", {//this.getModel("I18N").getText("/NCM0104", oSelected.length, "${I18N>/DELETE}") this.getModel("I18N").getText("/NCM0104", checkCnt, "삭제")
                    title: "Comfirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            for (var jdx = 0; jdx < viewData.length; jdx++) {
                                if(viewData[jdx].chk){
                                    oModel.removeRecord(jdx);
                                }
                            }

                            oModel.submitChanges({
                                success: function () {
                                    oView.setBusy(false);
                                    MessageToast.show("Success to Delete.");
                                    this.onPageSearchButtonPress();
                                }.bind(this), error: function (oError) {
                                    oView.setBusy(false);
                                    MessageBox.error(oError.message);
                                }
                            });
                        };
                    }.bind(this)
                });

            } else {
                MessageBox.error("선택된 행이 없습니다.");
            }

        },

        onMoldMstTableReceiptButtonPress: function () {
            var oModel = this.getModel("list"),
                oView = this.getView(),
                viewData = oModel.getData().MoldMstView;

            var checkCnt = 0;

            for (var idx = 0; idx < viewData.length; idx++) {
                if(viewData[idx].chk){
                    //viewData[idx].update_type = "receipt";
                    checkCnt++;
                }
            }

            if (checkCnt > 0) {
                if(this._checkStatus()){
                    MessageToast.show( "Development Request, Receipt 상태일 때만 Receipt 가능합니다." );
                    return;
                }
                            
                if(!this._checkFamilyPartNo()) return;
                
                MessageBox.confirm("Receipt 후엔 미접수 상태로 변경은 불가능합니다. Receipt 하시겠습니까?", {
                    title: "Comfirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            oView.setBusy(true);
                            oModel.submitChanges({
                                success: function (oEvent) {
                                    oView.setBusy(false);
                                    MessageToast.show("Success to Receipt.");
                                    this.onPageSearchButtonPress();
                                }.bind(this), error: function (oError) {
                                    MessageToast.show("oError");
                                    oView.setBusy(false);
                                    MessageBox.error(oError.message);
                                }
                            });
                        };
                    }.bind(this)
                });

            }else{
                MessageBox.error("선택된 행이 없습니다.");
            }
        },
        
        onExportPress: function (_oEvent) {
            var sTableId = _oEvent.getSource().getParent().getParent().getId();
            if (!sTableId) { return; }

            var oTable = this.byId(sTableId);
            var sFileName = oTable.title || this.byId("page").getTitle(); //file name to exporting
            var oData = oTable.getModel('list').getProperty("/MoldMstView");//binded Data

            //CM_YN code list
            var aCtxtMoldFamilyFlag = Object.keys(this.getModel("util").getContext("/Code(tenant_id='L2600,group_id='CM_YN')").getProperty("/"));
            var aMoldFamilyFlag = aCtxtMoldFamilyFlag.map(sCtxt => this.getModel("util").getContext("/Code(tenant_id='L2600,group_id='CM_YN')").getModel().getProperty("/"+sCtxt));

            //DP_MD_PROD_TYPE code list
            var aCtxtMoldProductionTypeCode = Object.keys(this.getModel("util").getContext("/Code(tenant_id='L2600,group_id='DP_MD_PROD_TYPE')").getProperty("/"));
            var aMoldProductionTypeCode = aCtxtMoldProductionTypeCode.map(sCtxt => this.getModel("util").getContext("/Code(tenant_id='L2600,group_id='DP_MD_PROD_TYPE')").getModel().getProperty("/"+sCtxt));

            //DP_MD_ITEM_TYPE code List
            var aCtxtMoldItemTypeCode = Object.keys(this.getModel("util").getContext("/Code(tenant_id='L2600,group_id='DP_MD_ITEM_TYPE')").getProperty("/"));
            var aMoldItemTypeCode = aCtxtMoldItemTypeCode.map(sCtxt => this.getModel("util").getContext("/Code(tenant_id='L2600,group_id='DP_MD_ITEM_TYPE')").getModel().getProperty("/"+sCtxt));

            //DP_MD_MOLD_TYPE code List
            var aCtxtMoldTypeCode = Object.keys(this.getModel("util").getContext("/Code(tenant_id='L2600,group_id='DP_MD_MOLD_TYPE')").getProperty("/"));
            var aMoldTypeCode = aCtxtMoldTypeCode.map(sCtxt => this.getModel("util").getContext("/Code(tenant_id='L2600,group_id='DP_MD_MOLD_TYPE')").getModel().getProperty("/"+sCtxt));

            //DP_MD_ED_TYPE code List
            var aCtxtMoldLocationTypeCode = Object.keys(this.getModel("util").getContext("/Code(tenant_id='L2600,group_id='DP_MD_ED_TYPE')").getProperty("/"));
            var aMoldLocationTypeCode = aCtxtMoldLocationTypeCode.map(sCtxt => this.getModel("util").getContext("/Code(tenant_id='L2600,group_id='DP_MD_ED_TYPE')").getModel().getProperty("/"+sCtxt));

            //DP_MD_COST_ANALYSIS_TYPE code List
            var aCtxtMoldCostAnalysisCode = Object.keys(this.getModel("util").getContext("/Code(tenant_id='L2600,group_id='DP_MD_COST_ANALYSIS_TYPE')").getProperty("/"));
            var aMoldCostAnalysisCode = aCtxtMoldCostAnalysisCode.map(sCtxt => this.getModel("util").getContext("/Code(tenant_id='L2600,group_id='DP_MD_COST_ANALYSIS_TYPE')").getModel().getProperty("/"+sCtxt));

            //DP_MD_PURCHASE_TYPE code List
            var aCtxtMoldPurchasingTypeCode = Object.keys(this.getModel("util").getContext("/Code(tenant_id='L2600,group_id='DP_MD_PURCHASE_TYPE')").getProperty("/"));
            var aMoldPurchasingTypeCode = aCtxtMoldPurchasingTypeCode.map(sCtxt => this.getModel("util").getContext("/Code(tenant_id='L2600,group_id='DP_MD_PURCHASE_TYPE')").getModel().getProperty("/"+sCtxt));

            //DP_MD_MOLD_STRUCTURE code List
            var aCtxtMoldStructure = Object.keys(this.getModel("util").getContext("/Code(tenant_id='L2600,group_id='DP_MD_MOLD_STRUCTURE')").getProperty("/"));
            var aMoldStructure = aCtxtMoldStructure.map(sCtxt => this.getModel("util").getContext("/Code(tenant_id='L2600,group_id='DP_MD_MOLD_STRUCTURE')").getModel().getProperty("/"+sCtxt));

            //DP_MD_MOLD_SIZE code List
            var aCtxtMoldSize = Object.keys(this.getModel("util").getContext("/Code(tenant_id='L2600,group_id='DP_MD_MOLD_SIZE')").getProperty("/"));
            var aMoldSize = aCtxtMoldSize.map(sCtxt => this.getModel("util").getContext("/Code(tenant_id='L2600,group_id='DP_MD_MOLD_SIZE')").getModel().getProperty("/"+sCtxt));

            //optional object param
            //aListItem - 코드목록, sBindName - Table 칼럼에 바인딩한 property, sKeyName - 코드목록의 key, sTextName - 코드목록의 text
            var oOption = [
                {aListItem : aMoldFamilyFlag, sBindName : "family_flag", sKeyName : "code", sTextName : "code_name"},
                {aListItem : aMoldProductionTypeCode, sBindName : "mold_production_type_code", sKeyName : "code", sTextName : "code_name"},
                {aListItem : aMoldItemTypeCode, sBindName : "mold_item_type_code", sKeyName : "code", sTextName : "code_name"},
                {aListItem : aMoldTypeCode, sBindName : "mold_type_code", sKeyName : "code", sTextName : "code_name"},
                {aListItem : aMoldLocationTypeCode, sBindName : "mold_location_type_code", sKeyName : "code", sTextName : "code_name"},
                {aListItem : aMoldCostAnalysisCode, sBindName : "mold_cost_analysis_type_code", sKeyName : "code", sTextName : "code_name"},
                {aListItem : aMoldPurchasingTypeCode, sBindName : "mold_purchasing_type_code", sKeyName : "code", sTextName : "code_name"},
                {aListItem : aMoldStructure, sBindName : "die_form", sKeyName : "code", sTextName : "code_name"},
                {aListItem : aMoldSize, sBindName : "mold_size", sKeyName : "code", sTextName : "code_name"}
            ];// code data는 복수개일 수 있으므로 배열로 전달.

            ExcelUtil.fnExportExcel({
                fileName: "Mold Development Receipt" || "SpreadSheet",
                table: oTable,
                data: oData
            }, oOption);



/*
            var sTableId = _oEvent.getSource().getParent().getParent().getId();
            if (!sTableId) { return; }

            var oTable = this.byId(sTableId);
            
            var oData = oTable.getModel('list').getProperty("/MoldMstView");
            
            ExcelUtil.fnExportExcel({
                fileName: "MoldDevelopmentReceipt",
                table: oTable,
                data: oData
            });*/
        },

        onCheckAll : function (oEvent) {
            var oTable = this.byId("moldMstTable");

            for (var idx = 0; idx < oTable.getRows().length; idx++) {
                oTable.getRows()[idx].getCells()[0].setSelected(oEvent.getSource().getSelected());
            }
        },
        
        setIdSelect : function (oEvent) {
            if(!oEvent.getSource().getParent().getCells()[0].getSelected()){
                var oTable = this.byId("moldMstTable"),
                    oModel = this.getModel("list"),
                    viewData = oModel.getData().MoldMstView,
                    setId = viewData[oEvent.getSource().getParent().getIndex()].set_id;

                for (var idx = 0; idx < oTable.getRows().length; idx++) {
                    if(!(setId === null || setId === "")){
                        if(setId === oTable.getRows()[idx].getCells()[8].getText()){
                            oTable.getRows()[idx].getCells()[0].setSelected(true);
                        }
                    }
                }
            }
        },
        
        inputFieldChange : function (oEvent) {
            oEvent.getSource().getParent().getCells()[0].setSelected(true);
            var colName = oEvent.getSource().sId.split('--')[2].split('-')[0],
                familyPartNumber1 = oEvent.getSource().getParent().getCells()[25].mProperties.value,
                familyPartNumber2 = oEvent.getSource().getParent().getCells()[26].mProperties.value,
                familyPartNumber3 = oEvent.getSource().getParent().getCells()[27].mProperties.value,
                familyPartNumber4 = oEvent.getSource().getParent().getCells()[28].mProperties.value;

            if(colName === "family_part_number_2"){
                if(familyPartNumber1 === null || familyPartNumber1 === ""){
                    MessageToast.show("family part number 1부터 입력하세요");
                }
            }else if(colName === "family_part_number_3"){
                if(familyPartNumber1 === null || familyPartNumber1 === ""){
                    MessageToast.show("family part number 1부터 입력하세요");
                }
                if(familyPartNumber2 === null || familyPartNumber2 === ""){
                    MessageToast.show("family part number 2부터 입력하세요");
                }
            }else if(colName === "family_part_number_4"){
                if(familyPartNumber1 === null || familyPartNumber1 === ""){
                    MessageToast.show("family part number 1부터 입력하세요");
                }
                if(familyPartNumber2 === null || familyPartNumber2 === ""){
                    MessageToast.show("family part number 2부터 입력하세요");
                }
                if(familyPartNumber3 === null || familyPartNumber3 === ""){
                    MessageToast.show("family part number 3부터 입력하세요");
                }
            }else if(colName === "family_part_number_5"){
                if(familyPartNumber1 === null || familyPartNumber1 === ""){
                    MessageToast.show("family part number 1부터 입력하세요");
                }
                if(familyPartNumber2 === null || familyPartNumber2 === ""){
                    MessageToast.show("family part number 2부터 입력하세요");
                }
                if(familyPartNumber3 === null || familyPartNumber3 === ""){
                    MessageToast.show("family part number 3부터 입력하세요");
                }
                if(familyPartNumber4 === null || familyPartNumber4 === ""){
                    MessageToast.show("family part number 4부터 입력하세요");
                }
            }
        },
        
        onSelectChange : function (oEvent) {
            oEvent.getSource().getParent().getCells()[0].setSelected(true);
            var combo, colName = oEvent.getSource().sId.split('--')[2].split('-')[0],
                key = this.getModel("list").getProperty(oEvent.getSource().getBindingInfo("selectedKey").binding.getContext().getPath()).mold_item_type_code;

            if(colName === "mold_item_type_code"){
                combo = oEvent.getSource().getParent().getCells()[12];
                combo.setSelectedKey(null); 
                combo.bindItems({
                    path: 'util>/Code',
                    filters: [
                        new Filter('tenant_id', FilterOperator.EQ, 'L2600'),
                        new Filter("group_code", FilterOperator.EQ, 'DP_MD_MOLD_TYPE'),
                        new Filter("parent_code", FilterOperator.EQ, key)
                    ],
                    template: new Item({
                        key: "{util>code}", text: "{util>code_name}"
                    })
                });
            }else if(colName === "mold_type_code"){
                combo = oEvent.getSource().getParent().getCells()[17];
                combo.setSelectedKey(null); 
                combo.bindItems({
                    path: 'util>/Code',
                    filters: [
                        new Filter('tenant_id', FilterOperator.EQ, 'L2600'),
                        new Filter("group_code", FilterOperator.EQ, 'DP_MD_MOLD_STRUCTURE'),
                        new Filter("parent_code", FilterOperator.EQ, key)
                    ],
                    template: new Item({
                        key: "{util>code}", text: "{util>code_name}"
                    })
                });
            }
        },
        
        onRefresh: function () {
            var oBinding = this.byId("moldMstTable").getBinding("rows");
            this.getView().setBusy(true);
            oBinding.refresh();
            this.getView().setBusy(false);
        },

		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function () {
            var oModel = this.getModel("list"),
                oView = this.getView();

            if (!oModel.isChanged()) {
                MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
                return;
            }

            if (this.validator.validate(this.byId("moldMstTable")) !== true) {
                MessageToast.show(this.getModel('I18N').getText('/ECM01002'));
                return;
            }

            MessageBox.confirm(this.getModel("I18N").getText("/NCM0004"), {
                title: this.getModel("I18N").getText("/SAVE"),
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true); console.log(oModel);
                        oModel.submitChanges({
                            success: function (oEvent) {
                                oView.setBusy(false);
                                MessageToast.show(this.getModel("I18N").getText("/NCM0005"));
                                
                            }.bind(this)
                        });
                    };
                }.bind(this)
            });
        },

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
        onRefreshPress: function () {
            var oTable = this.byId("moldMstTable");
            oTable.getBinding("rows").refresh();

        },

        creationDateChange: function (oEvent) {
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S",
                seSurffix = sSurffix === "E" ? "S" : "E",
                sFrom = oEvent.getParameter("from"),
                sTo = oEvent.getParameter("to");

            this.getView().byId("searchCreationDate" + seSurffix).setDateValue(sFrom);
            this.getView().byId("searchCreationDate" + seSurffix).setSecondDateValue(sTo);
        },

        onStatusSelectionChange: function (oEvent) {
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S",
                seSurffix = sSurffix === "E" ? "S" : "E",
                oSearchStatus = this.getView().byId("searchStatus" + seSurffix);

            oSearchStatus.setSelectedKey(oEvent.getParameter("item").getKey());
        },

        familyFlagChange: function (oEvent) {
            oEvent.getSource().getParent().getCells()[0].setSelected(true);
            
            var sSelectedKey = this.getModel("list").getProperty(oEvent.getSource().getBindingInfo("selectedKey").binding.getContext().getPath()).family_flag;
            if (sSelectedKey === 'N') {
                oEvent.getSource().getParent().getCells()[25].setValue(null);
                oEvent.getSource().getParent().getCells()[26].setValue(null);
                oEvent.getSource().getParent().getCells()[27].setValue(null);
                oEvent.getSource().getParent().getCells()[28].setValue(null);
                oEvent.getSource().getParent().getCells()[29].setValue(null);
            }
/*
            if (sSelectedKey === 'Y') {
                oEvent.getSource().getParent().getCells()[25].setEditable(true);
                oEvent.getSource().getParent().getCells()[26].setEditable(true);
                oEvent.getSource().getParent().getCells()[27].setEditable(true);
                oEvent.getSource().getParent().getCells()[28].setEditable(true);
                oEvent.getSource().getParent().getCells()[29].setEditable(true);
            } else {
                oEvent.getSource().getParent().getCells()[25].setValue(null);
                oEvent.getSource().getParent().getCells()[26].setValue(null);
                oEvent.getSource().getParent().getCells()[27].setValue(null);
                oEvent.getSource().getParent().getCells()[28].setValue(null);
                oEvent.getSource().getParent().getCells()[29].setValue(null);
                
                oEvent.getSource().getParent().getCells()[25].setEditable(false);
                oEvent.getSource().getParent().getCells()[26].setEditable(false);
                oEvent.getSource().getParent().getCells()[27].setEditable(false);
                oEvent.getSource().getParent().getCells()[28].setEditable(false);
                oEvent.getSource().getParent().getCells()[29].setEditable(false);
            }*/
        },

        getFormatDate: function (date) {
            var year = date.getFullYear();              //yyyy
            var month = (1 + date.getMonth());          //M
            month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
            var day = date.getDate();                   //d
            day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
            return year + '' + month + '' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
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
        _showMainObject: function (oItem) {
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
        _applySearch: function (aTableSearchState) {
            var oView = this.getView(),
                oModel = this.getModel("list");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
            oModel.read("/MoldMstView", {
                filters: aTableSearchState,
                success: function (oData) {
                    this.validator.clearValueState(this.byId("moldMstTable"));
                    oView.setBusy(false);
                }.bind(this)
            });
        },

        _getSearchStates: function () {
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S",
                company = this.getView().byId("searchCompany" + sSurffix).getSelectedKeys(),
                division = this.getView().byId("searchDivision" + sSurffix).getSelectedKeys(),
                status = this.getView().byId("searchStatus" + sSurffix).getSelectedKey(),
                //status = Element.registry.get(statusSelectedItemId).getText(),
                receiptFromDate = this.getView().byId("searchCreationDate" + sSurffix).getDateValue(),
                receiptToDate = this.getView().byId("searchCreationDate" + sSurffix).getSecondDateValue(),
                itemType = this.getView().byId("searchItemType").getSelectedKeys(),
                productionType = this.getView().byId("searchProductionType").getSelectedKeys(),
                eDType = this.getView().byId("searchEDType").getSelectedKey(),
                description = this.getView().byId("searchDescription").getValue(),
                model = this.getView().byId("searchModel").getValue(),
                moldNo = this.getView().byId("searchPart").getValue(),
                familyPartNo = this.getView().byId("searchFamilyPartNo").getValue();

            var aTableSearchState = [];
            var companyFilters = [];
            var divisionFilters = [];

            aTableSearchState.push(new Filter("mold_purchasing_type_code", FilterOperator.EQ, "L"));

            if (company.length > 0) {

                company.forEach(function (item) {
                    companyFilters.push(new Filter("company_code", FilterOperator.EQ, item));
                });

                aTableSearchState.push(
                    new Filter({
                        filters: companyFilters,
                        and: false
                    })
                );
            }

            if (division.length > 0) {

                division.forEach(function (item) {
                    divisionFilters.push(new Filter("org_code", FilterOperator.EQ, item));
                });

                aTableSearchState.push(
                    new Filter({
                        filters: divisionFilters,
                        and: false
                    })
                );
            }

            if (receiptFromDate || receiptToDate) {
                aTableSearchState.push(new Filter("local_create_dtm", FilterOperator.BT, receiptFromDate, receiptToDate));
            }
            if (status) {
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

            if(productionType.length > 0){

                var _productionTypeFilters = [];
                productionType.forEach(function(item){
                    _productionTypeFilters.push(new Filter("mold_production_type_code", FilterOperator.EQ, item ));
                });

                aTableSearchState.push(
                    new Filter({
                        filters: _productionTypeFilters,
                        and: false
                    })
                );
            }

            if (eDType && eDType.length > 0) {
                aTableSearchState.push(new Filter("mold_location_type_code", FilterOperator.EQ, eDType));
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
            if (familyPartNo && familyPartNo.length > 0) {
                aTableSearchState.push(new Filter({
                    filters: [
                        new Filter("family_part_number_1", FilterOperator.Contains, familyPartNo.toUpperCase()),
                        new Filter("family_part_number_2", FilterOperator.Contains, familyPartNo.toUpperCase()),
                        new Filter("family_part_number_3", FilterOperator.Contains, familyPartNo.toUpperCase()),
                        new Filter("family_part_number_4", FilterOperator.Contains, familyPartNo.toUpperCase()),
                        new Filter("family_part_number_5", FilterOperator.Contains, familyPartNo.toUpperCase())
                    ],
                    and: false
                }));
            }
            return aTableSearchState;
        },

        handleSelectionFinishComp: function (oEvent) {

            this.copyMultiSelected(oEvent);

            var params = oEvent.getParameters();
            var divisionFilters = [];

            if (params.selectedItems.length > 0) {

                params.selectedItems.forEach(function (item, idx, arr) {

                    divisionFilters.push(new Filter({
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, 'L2600'),
                            new Filter("org_type_code", FilterOperator.EQ, 'AU'),
                            new Filter("company_code", FilterOperator.EQ, item.getKey())
                        ],
                        and: true
                    }));
                });
            } else {
                divisionFilters.push(
                    new Filter("tenant_id", FilterOperator.EQ, 'L2600'),
                    new Filter("org_type_code", FilterOperator.EQ, 'AU')
                );
            }

            var filter = new Filter({
                filters: divisionFilters,
                and: params.selectedItems.length == 1 ? true : false
            });

            this.getView().byId("searchDivisionS").getBinding("items").filter(filter, "Application");
            this.getView().byId("searchDivisionE").getBinding("items").filter(filter, "Application");
        },

        handleSelectionFinishDiv: function (oEvent) {
            this.copyMultiSelected(oEvent);
        },

        copyMultiSelected: function (oEvent) {
            var source = oEvent.getSource(),
                params = oEvent.getParameters();

            var sIds = source.sId.split('--'),
                id = sIds[sIds.length-1],
                idPreFix = id.substr(0, id.length - 1),
                selectedKeys = [];

            params.selectedItems.forEach(function (item, idx, arr) {
                selectedKeys.push(item.getKey());
            });

            this.getView().byId(idPreFix + 'S').setSelectedKeys(selectedKeys);
            this.getView().byId(idPreFix + 'E').setSelectedKeys(selectedKeys);
        },

        onValueHelpRequested: function (oEvent) {

            var path = '';
            this._oValueHelpDialog = sap.ui.xmlfragment("dp.md.developmentReceipt.view.ValueHelpDialogModel", this);

            this._oBasicSearchField = new SearchField({
                showSearchButton: false
            });

            var oFilterBar = this._oValueHelpDialog.getFilterBar();
            oFilterBar.setFilterBarExpanded(false);
            oFilterBar.setBasicSearch(this._oBasicSearchField);

            this.setValuHelpDialog(oEvent);

            var aCols = this.oColModel.getData().cols;

            this.getView().addDependent(this._oValueHelpDialog);

            this._oValueHelpDialog.getTableAsync().then(function (oTable) {
                var _filter = new Filter("tenant_id", FilterOperator.EQ, "L2600");

                oTable.setModel(this.getOwnerComponent().getModel(this.modelName));
                oTable.setModel(this.oColModel, "columns");

                if (oTable.bindRows) {
                    oTable.bindAggregation("rows", this.vhdPath);
                    oTable.getBinding("rows").filter(_filter);
                }

                if (oTable.bindItems) {
                    oTable.bindAggregation("items", this.vhdPath, function () {
                        return new ColumnListItem({
                            cells: aCols.map(function (column) {
                                return new Label({ text: "{" + column.template + "}" });
                            })
                        });
                    });
                     oTable.getBinding("items").filter(_filter);
                }
                this._oValueHelpDialog.update();

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

                this.modelName = '';
                this.vhdPath = '/Models';
                
                this._oValueHelpDialog.setTitle('Model');
                this._oValueHelpDialog.setKey('model');
                this._oValueHelpDialog.setDescriptionKey('model');

            }else if(oEvent.getSource().sId.indexOf("searchPart") > -1){
                //part
                this._oInputModel = this.getView().byId("searchPart");

                this.oColModel = new JSONModel({
                    "cols": [
                        {
                            "label": "Part No",
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

                this.modelName = '';
                this.vhdPath = "/PartNumbers";
                this._oValueHelpDialog.setTitle('Part No');
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
			
			var	aSelectionSet = oEvent.getParameter("selectionSet");
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
            
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, 'L2600' ));

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
                //PartNumbers
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

        _doInitTablePerso: function () {
            // init and activate controller
            this._oTPC = new TablePersoController({
                table: this.byId("moldMstTable"),
                componentName: "developmentReceipt",
                persoService: DevelopmentReceiptPersoService,
                hasGrouping: true
            }).activate();
        }

    });
});