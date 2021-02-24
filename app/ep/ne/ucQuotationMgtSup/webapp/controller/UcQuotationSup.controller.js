sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "sap/ui/model/json/JSONModel",
    "ext/lib/util/Validator",
    "ext/lib/formatter/Formatter",
    //"ext/lib/formatter/DateFormatter",
    "ext/lib/formatter/NumberFormatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History",
    "sap/m/ColumnListItem",
    "sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    "sap/ui/richtexteditor/RichTextEditor",
    "sap/ui/model/odata/v2/ODataModel",
     "ext/cm/util/control/ui/EmployeeDialog",
     "ext/cm/util/control/ui/DepartmentDialog", 
    "sap/ui/model/Sorter"
], function (BaseController, Multilingual, TransactionManager, ManagedModel, ManagedListModel, JSONModel, Validator, Formatter, NumberFormatter,
    Filter, FilterOperator, Fragment, MessageBox, MessageToast, History,
    ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, RichTextEditor, ODataModel, EmployeeDialog, DepartmentDialog, Sorter) {
    "use strict";

    var oTransactionManager;

    return BaseController.extend("ep.ne.ucQuotationMgtSup.controller.UcQuotationSup", {

        //dateFormatter: DateFormatter,
        numberFormatter: NumberFormatter,
        formatter: Formatter,
        validator: new Validator(),


        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new JSONModel(), "midObjectViewModel");

            this.setModel(new JSONModel(), "popUcQuotationSup");
            this.setModel(new JSONModel(), "popExtraRate");

            this.getRouter().getRoute("selectionPage").attachPatternMatched(this._onRoutedThisPage, this);
            this.enableMessagePopover();

        },

        /**
         * Search 버튼 클릭(Filter 추출)
         */
        onSearch: function () {
            console.log("onsearch");
            
            var aSearchFilters = this._getSearchStates();
            this._applySearch(aSearchFilters);
        },

        _applySearch: function (aSearchFilters) {
            var oView = this.getView(),
                oModel = this.getModel(),
                oViewModel = this.getModel("viewModel"),
                that = this;

            console.log("aSearchFilters ---> " , aSearchFilters);

            //var oViewModel.setProperty("/ucdetails", dtlModel);

            oView.setBusy(true);

            // Master 조회
            // oModel.read("/GetUcApprovalDtlView", {
            //     filters: aSearchFilters,
            //     // sorters: [
            //     //     new Sorter("const_start_date", false)
            //     // ],
            //     success: function (oData) {
            //         console.log(" GetUcApprovalDtlView ::: ", oData.results);
            //         oView.getModel("popUcQuotationSup").setData(oData.results);
            //         oView.setBusy(false);
            //     }

            // });

            var sSearchPopEpItemClassCode = this.getView().byId("searchPopEpItemClassCode").getSelectedKey();
            var sSearchPopItemDesc = this.getView().byId("searchPopItemDesc").getValue();
            var sSearchPopNetPriceContractTitle = this.getView().byId("searchPopNetPriceContractTitle").getValue();

             var mstData = oViewModel.getProperty("/ucmaster");
            var tenant_id = mstData.tenant_id;
            var company_code = mstData.company_code;
            var org_code = mstData.org_code;
            var supplier_code = mstData.supplier_code;
            var ep_item_code = sSearchPopEpItemClassCode;
            var sDate = that.convertDateToString(mstData.const_start_date);

            console.log("aSearchFilters---> " , aSearchFilters);
            console.log("sDate---> " , sDate);
            console.log("sSearchPopItemDesc---> " , sSearchPopItemDesc);
            console.log("sSearchPopNetPriceContractTitle---> " , sSearchPopNetPriceContractTitle);
            ///?$filter=(substringof(%27설치%27,item_desc))
            $.ajax({   //tenant_id : String, company_code : String, org_code : String, supplier_code : String, large_item_class_code : String, const_start_date : String
                    url: "ep/ne/ucQuotationMgtSup/webapp/srv-api/odata/v4/ep.UcQuotationMgtService/UcContractDtlView(tenant_id='"+tenant_id +"',company_code='"+company_code +"',org_code='"+org_code +"',supplier_code='"+supplier_code +"',large_item_class_code='"+ep_item_code +"',const_start_date='"+ sDate +"')/Set?$filter=(contains(item_desc,'"+ sSearchPopItemDesc +"')) and (contains(net_price_contract_title,'"+ sSearchPopNetPriceContractTitle +"'))",
                    type: "GET",
                    contentType: "application/json",
                    //filters: aSearchFilters,
                    success: (function (oData) {
                        console.log("#########oData Success#####", oData.value);
                        oView.getModel("popUcQuotationSup").setData(oData.value);
                        oView.setBusy(false);
                    }).bind(this) 
                })


            // Master 조회
            // oModel.read("/UcQuotationListView", {
            //     filters: aSearchFilters,
            //     sorters: [
            //         new Sorter("const_start_date", false)
            //     ],
            //     success: function (oData) {
            //         console.log("oData====", oData);
            //         //oViewModel.getModel("listModel").setData(oData.results);

            //         oViewModel.setProperty("/list", oData.results);
            //         oView.setBusy(false);
            //     }
            // });

        },


        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
        onPageNavBackButtonPress: function () {
            //this.validator.clearValueState(this.byId("midObjectForm"));
            this.validator.clearValueState(this.byId("ucUcQuotationSupEditBox"));
            // var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            // this.getRouter().navTo("mainPage", {layout: sNextLayout});
            var sPreviousHash = History.getInstance().getPreviousHash();
            console.log("sPreviousHash==", sPreviousHash);
            // if (sPreviousHash !== undefined) {
            //     // eslint-disable-next-line sap-no-history-manipulation
            //     history.go(-1);
            // } else {
            this.getRouter().navTo("mainPage", {}, true);
            //}
        },

		/**
		 * Event handler for page edit button press
		 * @public
		 */
        onPageEditButtonPress: function () {
            this._toEditMode();
        },

		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function (flag) {
            var oView = this.getView(),
                oViewModel = this.getModel("viewModel"),
                that = this;

            var mstData = [];
            var details = [];
            var itemSeq = 0;

            // '221010'	'BM등록요청'
            // '221020'	'물량확정요청'
            // '221030'	'물량수정요청'
            // '221040'	'물량확정'

            var statusCode = "221010";
            if (flag == "R") {
                statusCode = "221020";
            } else {
                statusCode = "221010";
            }


            mstData.push(oViewModel.getProperty("/ucmaster"));
            var dtlData = oViewModel.getProperty("/ucdetails");
            var reteDate = this.hasInput;
            var rate_len = 0;
            console.log("reteDate ----------> " , reteDate);

            // dtlData.map(function(e) { 
            //     console.log("e.quotation_quantity ----------> " , e.quotation_quantity);
            //     if(!e.quotation_quantity){
            //         MessageToast.show("수량을 입력해주세요~");
            //         return;
            //     }
            // });
            

            if (reteDate === undefined) {
                rate_len = 0;
                console.log("rate_len ----------> " , rate_len);
            }else{
                rate_len = reteDate.length;
            }

            var omst = [];
            var const_quotation_number_ = "";
             omst = mstData.map(function(e) { 
                const_quotation_number_ = e.const_quotation_number;

                 if(e.completion_flag == null || e.completion_flag === undefined){
                        e.completion_flag = true;
                 }
                    

                return { 
                    tenant_id: e.tenant_id, 
                    company_code: e.company_code,
                    const_quotation_number: e.const_quotation_number,
                    const_name: e.const_name,
                    ep_item_code: e.ep_item_code,
                    const_start_date: (!that.convertDateToString(e.const_start_date) ? null : that.convertDateToString(e.const_start_date)),
                    const_end_date: (!that.convertDateToString(e.const_end_date) ? null : that.convertDateToString(e.const_end_date)),
                    remark: e.remark,
                    attch_group_number: e.attch_group_number,
                    completion_flag : e.completion_flag,
                    completion_date :(!that.convertDateToString(e.completion_date) ? null : that.convertDateToString(e.completion_date)),
                    facility_person_empno : e.facility_person_empno,
                    completion_attch_group_number : e.completion_attch_group_number,
                    quotation_status_code : statusCode,
                    update_user_id: (!e.update_user_id ? 'Admin' : e.update_user_id),
                    row_state: 'U',
                };
            });

            console.log(" omst ::: ", omst);

            //var len = oViewModel.getProperty("/ucdetails").length;
            var odtl = [];
            //var num = 1;
            //var delNum = 0;
            var afterDelCnt = 0;
            
           var seq_input = 0;
           var index = 0;
           //var rowState = "";

             odtl = dtlData.map(function(e) { 

                //len = num * 10;

                console.log(" e.row_state ::: ", e.row_state);
                if(e.row_state != "D"){
                    seq_input = 10 * (index + 1);
                    if(e.const_quotation_item_number && !e.row_state){
                        e.row_state = "U";
                    }
                    index++;
                }else{
                    seq_input =  e.item_sequence - (afterDelCnt * 10);
                    afterDelCnt++;
                }

                console.log(" seq_input ::: ", seq_input);

                return { 

                    tenant_id: e.tenant_id, 
                    company_code: e.company_code,
                    const_quotation_number:  const_quotation_number_,
                    const_quotation_item_number: (!e.const_quotation_item_number ? null : e.const_quotation_item_number),
                    //item_sequence: (e.item_sequence == 0 ? (num++ * 10) : parseFloat(e.item_sequence)), 
                    item_sequence: seq_input,
                    const_name: e.const_name,
                    ep_item_code: e.ep_item_code,
                    item_desc: e.item_desc,
                    spec_desc: e.spec_desc,
                    quotation_quantity: (!e.quotation_quantity ? null : parseFloat(e.quotation_quantity)),
                    extra_rate: (!e.extra_rate ? "1" : String(e.extra_rate)),
                    unit: (!e.unit ? null : e.unit),
                    currency_code: e.currency_code,
                    currency_name: (!e.currency_name ? null : e.currency_name),
                    material_apply_flag: (!e.material_apply_flag ? false : e.material_apply_flag),
                    labor_apply_flag: (!e.labor_apply_flag ? false : e.labor_apply_flag),
                    net_price_change_allow_flag: (!e.net_price_change_allow_flag ? false : e.net_price_change_allow_flag),
                    base_material_net_price: (!e.base_material_net_price ? null : parseFloat(e.base_material_net_price)),
                    base_labor_net_price: (!e.base_labor_net_price ? null : parseFloat(e.base_labor_net_price)),
                    material_net_price: (!e.material_net_price ? null : parseFloat(e.material_net_price)),
                    material_amount: (!e.material_amount ? 0 : parseFloat(e.material_amount)),
                    labor_net_price: (!e.labor_net_price ? null : parseFloat(e.labor_net_price)),
                    labor_amount: (!e.labor_amount ? 0 : parseFloat(e.labor_amount)),
                    sum_amount: (!e.sum_amount ? null : parseFloat(e.sum_amount)),
                    remark: e.remark,
                    net_price_contract_document_no: e.net_price_contract_document_no,
                    net_price_contract_degree: parseFloat(e.net_price_contract_degree),
                    net_price_contract_item_number: e.net_price_contract_item_number,
                    supplier_item_create_flag: (!e.supplier_item_create_flag ? false : Boolean(e.supplier_item_create_flag)),
                    row_state: (!e.const_quotation_item_number ? 'C' : e.row_state),
                    net_price_contract_title : e.net_price_contract_title,
                    extra_rate_count : parseFloat(e.extra_rate_count),
                    create_user_id: (!e.create_user_id ? 'Admin' : e.create_user_id),
                    update_user_id: (!e.update_user_id ? 'Admin' : e.update_user_id)
                    
                };
            });

            console.log(" odtl ::: ", odtl);


            var orate = [];
            if(rate_len > 0){
             orate = reteDate.map(function(e) { 

                return { 
                    tenant_id: e.tenant_id, 
                    company_code: e.company_code,
                    const_quotation_number:  const_quotation_number_,
                    const_quotation_item_number: (!e.const_quotation_item_number ? null : e.const_quotation_item_number),
                    apply_extra_sequence: (!e.apply_extra_sequence ? null : parseFloat(e.apply_extra_sequence)),
                    net_price_contract_document_no: (!e.net_price_contract_document_no ? null : e.net_price_contract_document_no),
                    net_price_contract_degree : (!e.net_price_contract_degree ? null : parseInt(e.net_price_contract_degree)),
                    net_price_contract_extra_seq : (!e.net_price_contract_extra_seq ? null : parseFloat(e.net_price_contract_extra_seq)),
                    extra_number: (!e.extra_number ? null : e.extra_number), 
                    extra_class_number: (!e.extra_class_number ? null : e.extra_class_number), 
                    //extra_rate: (!e.apply_extra_rate ? null : parseInt(e.apply_extra_rate)), 
                    extra_rate: (!e.apply_extra_rate ? null : String(e.apply_extra_rate)), 
                    row_state: (!e.row_state ? null : e.row_state),
                    create_user_id: (!e.create_user_id ? 'Admin' : e.create_user_id),
                    update_user_id: (!e.update_user_id ? 'Admin' : e.update_user_id)
                };
            });
        }

        console.log("orate ---> " , orate);

            var input = {
                inputData: {
                    ucMasterData: [],
                    ucDetailData: [],
                    ucQuotationExtraData: []
                }
            };

            input.inputData.ucMasterData = omst;
            input.inputData.ucDetailData = odtl;
            input.inputData.ucQuotationExtraData = orate;

            console.log("input====", input);


            if (this.validator.validate(this.byId("ucUcQuotationSupEditBox")) !== true) return;
            if (this.validator.validate(this.byId("ucCompletionEditBox")) !== true) return;
            if (this.validator.validate(this.byId("mainTable")) !== true) return;

            var url = "ep/ne/ucQuotationMgtSup/webapp/srv-api/odata/v4/ep.UcQuotationMgtV4Service/SaveUcQuotationDtlProc";

            MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
                title: this.getModel("I18N").getText("/SAVE"),
                initialFocus: MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        $.ajax({
                            url: url,
                            type: "POST",
                            data: JSON.stringify(input),
                            contentType: "application/json",
                            success: function (data) {

                                console.log("#########Success#####", data);
                                oView.setBusy(false);
                                MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
                                //that.validator.clearValueState(that.byId("ucUcQuotationSupEditBox"));
                                oViewModel.setProperty("/ucmaster", data.ucMasterData[0]);

                                //oView.byId("completionDate").setDateValue(data.ucMasterData[0].completion_date);
                                oViewModel.setProperty("/ucdetails", data.ucDetailData);
                                oViewModel.setProperty("/ucRate", data.ucQuotationExtraData);
                                that._toShowMode();       


                            },
                            error: function (e) {
                                console.log("error====", e);
                            }
                        });

                    }
                }
            });

        },

		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelEditButtonPress: function () {
            //this.validator.clearValueState(this.byId("midObjectForm"));
            this.validator.clearValueState(this.byId("ucUcQuotationSupEditBox"));
            if (this.getModel("midObjectViewModel").getProperty("/isAddedMode") == true) {
                this.onPageNavBackButtonPress.call(this);
            } else {
                if (this.getModel("midObjectViewModel").getProperty("/isEditMode") == true) {
                    this._toShowMode();
                } else {
                    this.onPageNavBackButtonPress.call(this);
                }
            }
        },

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function (oEvent) {

            var oArgs = oEvent.getParameter("arguments"),
                oView = this.getView(),
                oModel = this.getModel(),
                oViewModel = this.getModel("viewModel"),
                that = this;
            this._sTenantId = oArgs.tenantId;
            this._sCompanyCode = oArgs.companyCode;
            this._sConstQuotationNumber = oArgs.constQuotationNumber;
            this.getModel("midObjectViewModel").setProperty("/viewConstQuotationNumber", oArgs.constQuotationNumber);


            console.log("##getOwnerComponent==", this.getOwnerComponent().getRootControl().byId("fcl"));

            console.log("##oArgs.tenantId==", oArgs.tenantId);
            console.log("##oArgs.companyCode==", oArgs.companyCode);
            console.log("##oArgs.constQuotationNumber==", oArgs.constQuotationNumber);

            //각 모델의 스키마 생성
            var mstModel = this.getSchema("UcQuotationListView");
            console.log("mstModel=================", mstModel);
            oViewModel.setProperty("/ucmaster", mstModel);

            var dtlModel = this.getSchema("UcQuotationDtlView");
            console.log("dtlModel=================", dtlModel);
            oViewModel.setProperty("/ucdetails", dtlModel);

            this.getModel("midObjectViewModel").setProperty("/isAddedMode", false);
            var loi_status = "";


            oView.setBusy(true);

            // Master 조회
            oModel.read("/UcQuotationListView", {
                filters: [
                    new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                    new Filter("company_code", FilterOperator.EQ, this._sCompanyCode),
                    new Filter("const_quotation_number", FilterOperator.EQ, this._sConstQuotationNumber)
                ],
                success: function (oData) {
                    
                    console.log(" UcQuotationListView ::: ", oData.results);

                    oData.results[0]["quotation_write_date"] = that.convertDateToString(oData.results[0]["quotation_write_date"]);
                    oData.results[0]["const_start_date"] = that.convertDateToString(oData.results[0]["const_start_date"]);
                    oData.results[0]["const_end_date"] = that.convertDateToString(oData.results[0]["const_end_date"]);
                    oData.results[0]["completion_date"] = that.convertDateToString(oData.results[0]["completion_date"]);
                    
                    console.log(" convert.... ::: ", oData.results[0]);
                    oViewModel.setProperty("/ucmaster", oData.results[0]);

                    oView.setBusy(false);
                    loi_status = oData.quotation_status_code;
                    that._toShowMode();
                }

            });


            // Detail 조회
            oModel.read("/UcQuotationDtlView", {
                filters: [
                    new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                    new Filter("company_code", FilterOperator.EQ, this._sCompanyCode),
                    new Filter("const_quotation_number", FilterOperator.EQ, this._sConstQuotationNumber)
                ],
                sorters: [
                    new Sorter("item_sequence", false)
                ],
                success: function (oData) {
                    console.log(" UcQuotationDtlView ::: ", oData.results);

                    oData.results.forEach(function (item, index) {
                        oData.results[index]["material_net_price"] = (!oData.results[index]["material_net_price"] ? 0 : parseFloat(oData.results[index]["material_net_price"]));
                        oData.results[index]["labor_net_price"] = (!oData.results[index]["labor_net_price"] ? 0 : parseFloat(oData.results[index]["labor_net_price"]));
                        //oData.results[index]["material_amount"] = (!oData.results[index]["material_amount"] ? 0 : parseFloat(oData.results[index]["material_amount"]));
                        //oData.results[index]["labor_amount"] = (!oData.results[index]["labor_amount"] ? 0 : parseFloat(oData.results[index]["labor_amount"]));

                        console.log("allow : " , oData.results[index]["net_price_change_allow_flag"]);
                        console.log("meterial : " , oData.results[index]["material_apply_flag"]);
                        console.log("labor : " , oData.results[index]["labor_apply_flag"]);
                        if(oData.results[index]["net_price_change_allow_flag"] == true){
                            if(oData.results[index]["material_apply_flag"] == true || oData.results[index]["labor_apply_flag"] == true){
                                oViewModel.setProperty('/ucmaster/change_allow_flag',true);
                            }else{
                                oViewModel.setProperty('/ucmaster/change_allow_flag',false);
                            }
                        }
                    });

                    oViewModel.setProperty("/ucdetails", oData.results);
                    oView.setBusy(false);

                }

            });
        },


        getSchema: function (entityName) {

            var mstModel = {};

            var oRootModel = this.getModel();
            var jsonMetadata = new JSONModel();
            jsonMetadata.setData(oRootModel.getServiceMetadata());

            var findMetadata = jsonMetadata.getData().dataServices.schema[0].entityType.filter(d => {
                return d["name"] == entityName;
            });

            for (var field of findMetadata[0].property) {
                var fieldName = field["name"];
                var fieldType = field["type"];
                var defaultValue = null;
                if (fieldType == "Edm.String") {
                    defaultValue = "";
                }
                // console.log("fieldName=", fieldName);
                // console.log("defaultValue=", defaultValue);
                mstModel[fieldName] = defaultValue;

            }

            return mstModel;
        },

        // '221010'	'BM등록요청'
        // '221020'	'물량확정요청'
        // '221030'	'물량수정요청'
        // '221040'	'물량확정'


        _toEditMode: function () {
            this.getModel("midObjectViewModel").setProperty("/isEditMode", true);
            this.getModel("midObjectViewModel").setProperty("/isShowMode", false);

            var oViewModel = this.getModel("viewModel");
            var statusCode = oViewModel.getProperty("/ucmaster").quotation_status_code;

            this._showFormFragment('UcQuotationSup_Edit');
            this.byId("page").setProperty("showFooter", true);
            this.byId("pageEditButton").setVisible(false);
            this.byId("pageSaveButton").setVisible(true);
            this.byId("pageRequestButton").setVisible(true);
            if (statusCode === "221010" || statusCode == "221030") { 
                this.byId("pageSaveButton").setEnabled(true);
            } else {
                this.byId("pageSaveButton").setEnabled(false);
            }
            if (statusCode === "221020" || statusCode == "221040") {
                this.byId("pageRequestButton").setEnabled(false);
            } else {
                this.byId("pageRequestButton").setEnabled(true);
            }
            this.byId("pageCancelButton").setEnabled(true);
            this.byId("midTableAddButton").setEnabled(true);
            this.byId("midTableDeleteButton").setEnabled(true);
            console.log("####################isEditMode", this.getModel("midObjectViewModel").getProperty("/isEditMode"));

        },

        _toShowMode: function () {
            this.getModel("midObjectViewModel").setProperty("/isEditMode", false);
            this.getModel("midObjectViewModel").setProperty("/isShowMode", true);

            var oViewModel = this.getModel("viewModel");
            var statusCode = oViewModel.getProperty("/ucmaster").quotation_status_code;

            this._showFormFragment('UcQuotationSup_Show');
            if (statusCode == "221040" || statusCode == "221020" ) {
                this.byId("page").setProperty("showFooter", false);
            } else {
                this.byId("page").setProperty("showFooter", true);
            }

            if (statusCode === "221010" || statusCode == "221030") { 
                this.byId("pageEditButton").setVisible(true);
            } else {
                this.byId("pageEditButton").setVisible(false);
            }

            this.byId("pageSaveButton").setVisible(false);
            this.byId("pageRequestButton").setVisible(false);
            this.byId("pageCancelButton").setEnabled(true);
            this.byId("midTableAddButton").setEnabled(false);
            this.byId("midTableDeleteButton").setEnabled(false);
            console.log("####################isEditMode", this.getModel("midObjectViewModel").getProperty("/isEditMode"));
        },

        _oFragments: {},
        _showFormFragment: function (sFragmentName) {
            var oPageSubSection = this.byId("pageUcSubSection1");
            this._loadFragment(sFragmentName, function (oFragment) {
                oPageSubSection.removeAllBlocks();
                oPageSubSection.addBlock(oFragment);
            })
        },
        _loadFragment: function (sFragmentName, oHandler) {
            var that = this;
            //if (!this._oFragments[sFragmentName]) {
            if (!this._oFragments[sFragmentName] || !this._oFragments[sFragmentName].getParent()) {
                if (this._oFragments[sFragmentName]) this._oFragments[sFragmentName].destroy();
                Fragment.load({
                    id: this.getView().getId(),
                    name: "ep.ne.ucQuotationMgtSup.view." + sFragmentName,
                    controller: this
                }).then(function (oFragment) {
                    this._oFragments[sFragmentName] = oFragment;
                    if (oHandler) oHandler(oFragment);
                    this.byId("page").setSelectedSection("pageSectionMain");
                    this.byId("pageSectionMain").setSelectedSubSection("pageUcSubSection1");
                }.bind(this));
            } else {
                if (oHandler) oHandler(this._oFragments[sFragmentName]);
                this.byId("page").setSelectedSection("pageSectionMain");
                this.byId("pageSectionMain").setSelectedSubSection("pageUcSubSection1");
            }
        },


        // onAfterRendering : function () {
        //     var that = this,
        //         sHtmlValue = "";
        //         // sHtmlValue = '<p style="text-align: justify; background: white; font-size: 10pt; font-family: Calibri, sans-serif;"><strong><span style="font-size: 10.5pt; font-family: sans-serif; color: black;">Lorem ipsum dolor sit amet</span></strong>' +
        // 		// '<span style="font-size: 10.5pt; font-family: sans-serif; color: black;">, consectetur adipiscing elit. Suspendisse ornare, nibh nec gravida tincidunt, ipsum quam venenatis nisl, vitae venenatis urna sem eget ipsum. Ut cursus auctor leo et vulputate. ' +
        // 		// 'Curabitur nec pretium odio, sed auctor felis. In vehicula, eros aliquam pharetra mattis, ante mi fermentum massa, nec pharetra arcu massa finibus augue. </span></p> ';                
        // 	sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
        // 		function (RTE, EditorType) {
        // 			var oRichTextEditor = new RTE("myRTE", {
        // 				editorType: EditorType.TinyMCE4,
        // 				width: "100%",
        //                 height: "200px",
        //                 //editable: "{contModel>/editMode}",
        //                 editable: true,
        // 				customToolbar: true,
        // 				showGroupFont: true,
        // 				showGroupLink: true,
        // 				showGroupInsert: true,
        // 				value: sHtmlValue,
        // 				ready: function () {
        // 					this.addButtonGroup("styleselect").addButtonGroup("table");
        // 				}
        //             });
        // 			that.getView().byId("idVerticalLayout").addContent(oRichTextEditor);
        //     });

        //     //this.onPageEnterFullScreenButtonPress();
        // }

        

        onMidTableAddButtonPress: function () {

            var oView = this.getView(),
                oModel = this.getModel(),
                oViewModel = this.getModel("viewModel"),
                that = this;
            
            var mstData = oViewModel.getProperty("/ucmaster");
            var dtlData = oViewModel.getProperty("/ucdetails");
            var tenant_id = mstData.tenant_id;
            var company_code = mstData.company_code;
            var org_code = mstData.org_code;
            var supplier_code = mstData.supplier_code;
            var ep_item_code = mstData.ep_item_code;
            var sDate = that.convertDateToString(mstData.const_start_date);
            //var sDate = '2020-01-01';
            
            console.log("mstData.tenant_id  ------> " , mstData.tenant_id);
            console.log("mstData.company_code  ------> " , mstData.company_code);
            console.log("mstData.const_quotation_number  ------> " , mstData.const_quotation_number);
            console.log("mstData.org_code  ------> " , mstData.org_code);
            console.log("mstData.supplier_code  ------> " , mstData.supplier_code);
            console.log("mstData.ep_item_code  ------> " , mstData.ep_item_code);
            console.log("mstData.const_start_date  ------> " , mstData.const_start_date);
            console.log("sDate  ------> " , sDate);


            if (!this._contractItemDialog) {
                this._contractItemDialog = Fragment.load({
                    id: oView.getId(),
                    name: "ep.ne.ucQuotationMgtSup.view.ContractItem",
                    controller: this
                }).then(function (contractItemDialog) {
                    oView.addDependent(contractItemDialog);
                    return contractItemDialog;
                }.bind(this));
            }


            this._contractItemDialog.then((function (contractItemDialog) {
                contractItemDialog.open();

                oView.setBusy(true);
    
                $.ajax({   //tenant_id : String, company_code : String, org_code : String, supplier_code : String, large_item_class_code : String, const_start_date : String
                    url: "ep/ne/ucQuotationMgtSup/webapp/srv-api/odata/v4/ep.UcQuotationMgtService/UcContractDtlView(tenant_id='"+tenant_id +"',company_code='"+company_code +"',org_code='"+org_code +"',supplier_code='"+supplier_code +"',large_item_class_code='"+ep_item_code +"',const_start_date='"+ sDate +"')/Set",
                    type: "GET",
                    contentType: "application/json",
                    
                    success: (function (oData) {
                        console.log("#########oData Success#####", oData.value);
                        oView.getModel("popUcQuotationSup").setData(oData.value);
                        oView.setBusy(false);
                    }).bind(this) 
                })


                //--------------------------------------------

                // oView.setBusy(true);

                // // Master 조회
                // oModel.read("/GetUcApprovalDtlView", {
                //     filters: [
                //         new Filter("tenant_id", FilterOperator.EQ, mstData.tenant_id),
                //         new Filter("company_code", FilterOperator.EQ, mstData.company_code)//,
                //         //new Filter("const_quotation_number", FilterOperator.EQ, this._sConstQuotationNumber)
                //     ],
                //     success: function (oData) {
                //         console.log(" GetUcApprovalDtlView ::: ", oData.results);
                //         oView.getModel("popUcQuotationSup").setData(oData.results);
                //         oView.setBusy(false);

                //     }

                // });

                oView.byId("searchPopEpItemClassCode").setSelectedKey(mstData.ep_item_code); 
                oView.byId("searchPopOrgCode").setText(mstData.org_name);
                oView.byId("popTable").clearSelection();

                oViewModel.setProperty("/popUcdetails", '');

            }).bind(this));

        },

        onContractItemSelectionApply: function (oEvent) {
            var oView = this.getView();
            var oTable = this.byId("popTable"),
                oModel = this.getView().getModel("popUcQuotationSup"),
                oViewModel = this.getModel("viewModel"),
                oSelected = oTable.getSelectedIndices();
            var dtlData = oViewModel.getProperty("/ucdetails");
            //var table = this.byId("mainTable");
            var input = [];

            dtlData.forEach(function (item, index) {
                input.push(dtlData[index]);
            });
            
            var document_no = "";
            var degree = "";
            var item_number = "";
            var document_no_ = "";
            var degree_ = "";
            var item_number_ = "";
            var real_val = 9999;

            var seq = 0;
            //seq = (dtlData.length+1) * 10;

            if (oSelected.length > 0) {
                
                console.log("oSelected.length ---> " , oSelected.length);
                console.log("dtlData ---> " , dtlData.length );
                oSelected.some(function (chkIdx, index) {

                document_no_ = (!oModel.getData()[chkIdx].net_price_contract_document_no ? '' : oModel.getData()[chkIdx].net_price_contract_document_no); 
                degree_ = (!oModel.getData()[chkIdx].net_price_contract_degree ? '' : oModel.getData()[chkIdx].net_price_contract_degree);
                item_number_ = (!oModel.getData()[chkIdx].net_price_contract_item_number ? '' : oModel.getData()[chkIdx].net_price_contract_item_number);

                if(dtlData.length > 0){
                        dtlData.map(r => {
                            
                            document_no = (!r["net_price_contract_document_no"] ? '' : r["net_price_contract_document_no"]); 
                            degree = (!r["net_price_contract_degree"] ? '' : r["net_price_contract_degree"]);
                            item_number = (!r["net_price_contract_item_number"] ? '' : r["net_price_contract_item_number"]);

                            console.log("document_no ---> " , document_no   + " ^^^^^^^^ document_no_ ---> " , document_no_);
                            console.log("degree ---> " , degree   + " ^^^^^^^^ degree_ ---> " , degree_);
                            console.log("item_number ---> " , item_number   + " ^^^^^^^^ item_number_ ---> " , item_number_);

                            if (((document_no.includes(document_no_)) 
                                && (degree.includes(degree_)) 
                                && (item_number.includes(item_number_)))) {
                                console.log("@@@@@===", document_no_ + "@@@@@===", degree_  + "@@@@@===", item_number_ );

                                real_val = chkIdx;
                                console.log("this.real_val========", real_val);
                            }

                        });

                    console.log("one real_val========", real_val  + " one chkIdx========", chkIdx);
                    if(real_val.toString() != chkIdx){
                        console.log("chkIdx========", chkIdx);  
                        input.push(oModel.getData()[chkIdx]);  
                    }
                }else{
                    input.push(oModel.getData()[chkIdx]);
                }

                });
            }

            console.log("input========", input);

            input.map(function (d, index) {
                console.log("index=", index);
                d["item_sequence"] = 10 * (index + 1);
                if(dtlData.length <= index){
                    d["row_state"] = "C";
                }
                return d;
            });

            console.log("$$$$$$$ input========", input);
            oViewModel.setProperty("/ucdetails", input);
            this.byId("dialogContractItem").close();
        },

        onExtraRateApply: function (oEvent) {
            var oView = this.getView();
            var oTable = this.byId("popRateTable"),
                oModel = this.getView().getModel("popExtraRate"),
                oViewModel = this.getModel("viewModel"),
                oSelected = oTable.getSelectedIndices();
            var rateData = oViewModel.getProperty("/ucRate");
            var dtlData = oViewModel.getProperty("/ucdetails");
            var that = this;

            var input = [];
            this.hasInput = [];

            // dtlData.forEach(function (item, index) {
            //     input.push(dtlData[index]);
            // });
            

            // var document_no_ = "";
            // var degree_ = "";
            // var item_number_ = "";
            // var real_val = 0;


            console.log("this.rateIndex ---> " , this.rateIndex );
            var selIndex = this.rateIndex;

            if (oSelected.length > 0) {
                
                console.log("oSelected.length ---> " , oSelected.length);
                console.log("rateData.length ---> " , rateData.length );
                
                var sum_val = 0;
                var sum_rate = 0 ;
                var sum_int = [];
                oSelected.some(function (chkIdx, index) {
                    //input.push(oModel.getData()[chkIdx]);  
                    input.push(rateData[chkIdx]);  
                    sum_rate = (!oModel.getData()[chkIdx].apply_extra_rate) ? null : parseFloat(oModel.getData()[chkIdx].apply_extra_rate);
                    sum_val = sum_val + sum_rate;
                });
            }
            
            input.forEach(function (item, index) {
                input[index].row_state= "C";
                input[index].const_quotation_item_number = dtlData[selIndex].const_quotation_item_number;
            });

            sum_int = String(sum_val).split('.');
            console.log("####  ---> " + "1.".concat(sum_int[1]));
            console.log("input========", input);

            this.hasInput = input;
            console.log("this.hasInput========", this.hasInput);

            var coms = parseFloat("1.".concat(sum_int[1]));
            console.log("Math.round========", (Math.round(coms*100)/100.0));

            if(input.length > 0){
                dtlData[selIndex].row_state = 'U';
                dtlData[selIndex].extra_rate = (Math.round(coms*100)/100.0);

                that.onRateChange(dtlData[selIndex].extra_rate,selIndex);
            }

            
            oViewModel.setProperty("/ucdetails", dtlData);
            this.byId("dialogExtraRate").close();
        },

        onExitContractItem: function () {
            this.byId("dialogContractItem").close();
        },

        onExtraRate: function () {
            this.byId("dialogExtraRate").close();
        },

        _checkNumber : function (oEvent) {
            var _oInput = oEvent.getSource();
            var val = _oInput.getValue();
            val = val.replace(/[^\d]/g, '');
            _oInput.setValue(val);
        },

        //할증변경
        onRateChange : function(val,index){

            console.log(" val   ----------------->" , val);
            console.log(" index ----------------->" , index); 

            var oViewModel = this.getModel("viewModel");
            var dtlData = oViewModel.getProperty("/ucdetails");
 
            dtlData[index]["labor_amount"] = Math.round(val * dtlData[index]["quotation_quantity"] * dtlData[index]["labor_net_price"]);
            dtlData[index]["sum_amount"] = Math.round(dtlData[index]["material_amount"]) + Math.round(dtlData[index]["labor_amount"]);
            if(dtlData[index]["row_state"] != "C"){
                dtlData[index]["row_state"] = "U";
            }
        },

        //수량변경
        onQuantityChange: function(oEvent){

            console.log("onQuantityChange -->" , oEvent);
            var _oInput = oEvent.getSource();
            var val = _oInput.getValue();
                val = val.replace(/[^\d]/g, '');
            _oInput.setValue(val);
            console.log("val -->" , val);

            var oViewModel = this.getModel("viewModel");
            var sPath = oEvent.getSource().getBindingInfo("value").binding.getContext().getPath();
            var index = sPath.substr(sPath.length-1);
            console.log(" index  ----------------->" , index); 

            var dtlData = oViewModel.getProperty("/ucdetails");

            console.log(" edit before----------------->" , dtlData[index]["row_state"]); 
            console.log(" edit extra_rate----------------->" , dtlData[index]["extra_rate"]); 

            if(!dtlData[index]["extra_rate"]){
                dtlData[index]["extra_rate"] = 1;
            }
            
            dtlData[index]["material_amount"] = val * dtlData[index]["extra_rate"] * dtlData[index]["material_net_price"];
            dtlData[index]["labor_amount"] = val * dtlData[index]["extra_rate"] * dtlData[index]["labor_net_price"];
            dtlData[index]["sum_amount"] = dtlData[index]["material_amount"] + dtlData[index]["labor_amount"];
            if(dtlData[index]["row_state"] != "C"){
                dtlData[index]["row_state"] = "U";
            }
        },

        //자재단가변경
        onMaterialChange: function(oEvent){

            console.log("onMaterialChange -->" , oEvent);
            var _oInput = oEvent.getSource();
            var val = _oInput.getValue();
                val = val.replace(/[^\d]/g, '');
            _oInput.setValue(val);
            console.log("val -->" , val);

            var oViewModel = this.getModel("viewModel");
            var sPath = oEvent.getSource().getBindingInfo("value").binding.getContext().getPath();
            var index = sPath.substr(sPath.length-1);
            console.log(" index ----------------->" , index); 

            var dtlData = oViewModel.getProperty("/ucdetails");

            if(!dtlData[index]["extra_rate"]){
                dtlData[index]["extra_rate"] = 1;
            }

            dtlData[index]["material_amount"] = val * dtlData[index]["extra_rate"] * dtlData[index]["quotation_quantity"]; //자재단가 * 수량
            dtlData[index]["labor_amount"] = dtlData[index]["quotation_quantity"] * dtlData[index]["extra_rate"] * dtlData[index]["labor_net_price"]; //수량 * 노무단가
            dtlData[index]["sum_amount"] = dtlData[index]["material_amount"] + dtlData[index]["labor_amount"];
            if(dtlData[index]["row_state"] != "C"){
                dtlData[index]["row_state"] = "U";
            }
        },

        //노무단가변경
        onLaborChange: function(oEvent){

            console.log("onLaborChange -->" , oEvent);
            var _oInput = oEvent.getSource();
            var val = _oInput.getValue();
                val = val.replace(/[^\d]/g, '');
            _oInput.setValue(val);
            console.log("val -->" , val);

            var oViewModel = this.getModel("viewModel");
            var sPath = oEvent.getSource().getBindingInfo("value").binding.getContext().getPath();
            var index = sPath.substr(sPath.length-1);
            console.log(" index  ----------------->" , index); 

            var dtlData = oViewModel.getProperty("/ucdetails");

            if(!dtlData[index]["extra_rate"]){
                dtlData[index]["extra_rate"] = 1;
            }

            dtlData[index]["labor_amount"] = val * dtlData[index]["extra_rate"] * dtlData[index]["quotation_quantity"]; //노무단가 * 수량
            dtlData[index]["material_amount"] = dtlData[index]["quotation_quantity"] * dtlData[index]["extra_rate"] * dtlData[index]["material_net_price"]; //수량 * 자재단가
            dtlData[index]["sum_amount"] = dtlData[index]["material_amount"] + dtlData[index]["labor_amount"];
            if(dtlData[index]["row_state"] != "C"){
                dtlData[index]["row_state"] = "U";
            }
        },

        _bindView: function () {
            var promise = jQuery.Deferred();

            var oView = this.getView(),
                oModel = this.getModel(),
                oViewModel = this.getModel("viewModel");
            var mstData = oViewModel.getProperty("/ucmaster");
            oView.setBusy(true);

            oModel.read("/UcApprovalExtraRateView", {
                filters: [
                    new Filter("tenant_id", FilterOperator.EQ, mstData.tenant_id),
                    new Filter("company_code", FilterOperator.EQ, mstData.company_code),
                    new Filter("net_price_contract_document_no", FilterOperator.EQ, this.net_price_contract_document_no_),
                    new Filter("net_price_contract_degree", FilterOperator.EQ, this.net_price_contract_degree_)
                ],
                success: function (oData) {
                    console.log(" UcApprovalExtraRateView ::: ", oData.results);
                    oView.getModel("popExtraRate").setData(oData.results);
                    oViewModel.setProperty("/ucRate", oData.results);
                    oView.setBusy(false);

                    promise.resolve(oData);

                }.bind(this),						
                error: function(oData){						
                    promise.reject(oData);	
                }

            });

            return promise;
        },

        onTableExtraRatePress: function (oEvent) {

            console.log(" onTableExtraRatePress oEvent----------------->", oEvent); 

            var oView = this.getView(),
                oModel = this.getModel(),
                oViewModel = this.getModel("viewModel");

            var mstData = oViewModel.getProperty("/ucmaster");
            var dtlData = oViewModel.getProperty("/ucdetails");
            var rateData = oViewModel.getProperty("/ucRate");

            console.log("mstData  ------> " , mstData);
            console.log("dtlData  ------> " , dtlData);

            var sPath = oEvent.getSource().getBindingInfo("text").binding.getContext().getPath();
            this.rateIndex =  parseInt(sPath.substr(11,1));
            var beforeIndex = parseInt(sPath.substr(11,1));
            var test_val = [];
            ///ucdetails/2

             console.log(" sPath----------------->", sPath);
             console.log(" this.rateIndex----------------->", this.rateIndex);  
             console.log(" this.tenant_id----------------->", dtlData[this.rateIndex]["tenant_id"]); 
             console.log(" this.company_code----------------->", dtlData[this.rateIndex]["company_code"]); 
             console.log(" this.const_quotation_number----------------->", dtlData[this.rateIndex]["const_quotation_number"]); 
             console.log(" this.const_quotation_item_number----------------->", dtlData[beforeIndex]["const_quotation_item_number"]); 
             console.log(" dtlData @@@@@ extra_rate_count ----------------->", dtlData[beforeIndex]["extra_rate_count"]); 

            this.net_price_contract_document_no_ = dtlData[beforeIndex]["net_price_contract_document_no"];
            this.net_price_contract_degree_ = dtlData[beforeIndex]["net_price_contract_degree"];
            this.net_price_contract_extra_seq_ = dtlData[beforeIndex]["net_price_contract_extra_seq"];

            var rate_count = parseFloat(dtlData[beforeIndex]["extra_rate_count"]);
            var labor_net_price = parseFloat(dtlData[beforeIndex]["labor_net_price"]);
            var editMode = this.getModel("midObjectViewModel").getProperty("/isEditMode");

            if(editMode == true){
                if(rate_count > 0 || labor_net_price > 0){
                    oViewModel.setProperty('/ucmaster/completion_flag_',true);
                }
            }else{
                oViewModel.setProperty('/ucmaster/completion_flag_',false);
            }
            
            console.log("completion_flag  ------> " , oViewModel.getProperty("/ucmaster/completion_flag_"));
           


            var odtl = [];
            var net_price_contract_document_no_ = "";
             odtl = dtlData.map(function(e) { 
                net_price_contract_document_no_ = e.net_price_contract_document_no;
            });


            if (!this._extraRateDialog) {
                this._extraRateDialog = Fragment.load({
                    id: oView.getId(),
                    name: "ep.ne.ucQuotationMgtSup.view.ExtraRate",
                    controller: this
                }).then(function (extraRateDialog) {
                    oView.addDependent(extraRateDialog);
                    return extraRateDialog;
                }.bind(this));
            }

            this._extraRateDialog.then((function (extraRateDialog) {
                extraRateDialog.open();

               

                // if(!rateData){
                // // Master 조회
                //     oView.setBusy(true);
                //     oModel.read("/UcApprovalExtraRateView", {
                //         filters: [
                //             new Filter("tenant_id", FilterOperator.EQ, mstData.tenant_id),
                //             new Filter("company_code", FilterOperator.EQ, mstData.company_code)//,
                //             //new Filter("const_quotation_number", FilterOperator.EQ, this._sConstQuotationNumber)
                //         ],
                //         success: function (oData) {
                //             console.log(" UcApprovalExtraRateView ::: ", oData.results);
                //             oView.getModel("popExtraRate").setData(oData.results);
                //             oViewModel.setProperty("/ucRate", oData.results);
                //             oView.setBusy(false);

                //         }

                //     });
                // }

                this._bindView().then((function () {
                    oView.setBusy(true);
                 //console.log("rateData  ------> " , rateData);

                // 저장되어있는 할증 조회
                oModel.read("/UcQuotationExtraRateView", {
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, dtlData[this.rateIndex]["tenant_id"]),
                        new Filter("company_code", FilterOperator.EQ, dtlData[this.rateIndex]["company_code"]),
                        new Filter("const_quotation_number", FilterOperator.EQ, dtlData[this.rateIndex]["const_quotation_number"]),
                        new Filter("const_quotation_item_number", FilterOperator.EQ, dtlData[this.rateIndex]["const_quotation_item_number"])
                    ],
                    success: function (oData) {
                        console.log(" before UcQuotationExtraRateView ::: ", oData.results);
                        oViewModel.setProperty("/ucBeforeRate", oData.results);

                        var beforeRateData = oViewModel.getProperty("/ucBeforeRate");
                        var net_price_contract_document_no_ = "";
                        var net_price_contract_degree_ = "";
                        var net_price_contract_extra_seq_ = "";
                        var popExtraRate = oView.getModel("popExtraRate");
                        var test_index = 0;

                        console.log(" before beforeRateData ::: ", beforeRateData);
                        for(var idx = 0; idx < beforeRateData.length; idx++){

                            var dtl_net_price_contract_document_no = (!beforeRateData[idx]["net_price_contract_document_no"] ? '' : beforeRateData[idx]["net_price_contract_document_no"]); 
                            var dtl_net_price_contract_degree = (!beforeRateData[idx]["net_price_contract_degree"] ? '' : beforeRateData[idx]["net_price_contract_degree"]); 
                            var dtl_net_price_contract_extra_seq = (!beforeRateData[idx]["net_price_contract_extra_seq"] ? '' : beforeRateData[idx]["net_price_contract_extra_seq"]); 


                            console.log(" popExtraRate----------------->" ,popExtraRate.getData()); 

                        //if(rateData){
                            console.log(" 1111111111111----------------->", dtl_net_price_contract_document_no);  
                            test_index = 0;
                            popExtraRate.getData().map(r => {
                            
                                net_price_contract_document_no_ = (!r["net_price_contract_document_no"] ? '' : r["net_price_contract_document_no"]); 
                                net_price_contract_degree_ = (!r["net_price_contract_degree"] ? '' : r["net_price_contract_degree"]); 
                                net_price_contract_extra_seq_ = (!r["net_price_contract_extra_seq"] ? '' : r["net_price_contract_extra_seq"]); 
                                console.log(" document_no----------------->" ,net_price_contract_document_no_ + " degree----------------->" ,net_price_contract_degree_ + " seq----------------->" ,net_price_contract_extra_seq_);  
                                console.log(" check document_no----------------->" ,dtl_net_price_contract_document_no + " degree----------------->" ,dtl_net_price_contract_degree + " seq----------------->" ,dtl_net_price_contract_extra_seq);  

                                if (((dtl_net_price_contract_document_no.includes(net_price_contract_document_no_)) 
                                && (dtl_net_price_contract_degree.includes(net_price_contract_degree_)) 
                                && (dtl_net_price_contract_extra_seq.includes(net_price_contract_extra_seq_)))) {
                                    console.log("@@@@@===", dtl_net_price_contract_document_no + "@@@@@===", net_price_contract_document_no_   );
                                    console.log("@@@@@===", dtl_net_price_contract_degree + "@@@@@===", net_price_contract_degree_   );
                                    console.log("@@@@@===", dtl_net_price_contract_extra_seq + "@@@@@===", net_price_contract_extra_seq_   );

                                    console.log(" test_index----------------->", test_index); 
                                    test_val.push(test_index);
                                }
                                test_index++;
                            });

                        }

                        console.log(" test_val----------------->", test_val);
                        oView.byId("popRateTable").clearSelection();
                        for(var i=0; i < test_val.length ; i++){
                            oView.byId("popRateTable").addSelectionInterval(test_val[i],test_val[i]);
                            console.log("############################################" , test_val[i]);
                        }

                        //}
                        
                        console.log("net_price_contract_title---------------->", dtlData[beforeIndex]["net_price_contract_title"]);   

                        oView.byId("searchNetPriceContractTitle").setText(dtlData[beforeIndex]["net_price_contract_title"]);
                        oView.setBusy(false);

                    }

                });
                //저장되어있는 할증 조회

                }).bind(this));
                

                oView.byId("searchNetPriceContractDocumentNo").setText(dtlData[beforeIndex]["net_price_contract_document_no"]); 
                //dtlData[this.rateIndex]["const_quotation_item_number"]

            }).bind(this));

        },


        onItemInfoDeleteButtonPress: function () {
            var table = this.byId("mainTable"),
                oViewModel = this.getModel("viewModel"),
                oDtlData = oViewModel.getProperty("/ucdetails");

            table.getSelectedIndices().reverse().forEach(function (idx) {
                if (oDtlData[idx]["row_state"] == "C") {
                    oDtlData.splice(idx, 1);
                } else {
                    oDtlData[idx]["row_state"] = "D";
                }
            });

            console.log("oDtlData=", oDtlData);
            oViewModel.setProperty("/ucdetails", oDtlData);
            this.byId("mainTable").clearSelection();
        },

        convertBoolean : function (str) {
            return str.toLowerCase() === "true";
        },

        onSegmentChange: function (oEvent) {
            console.log("onSegmentChange  ------> " ,oEvent);

            var oViewModel = this.getModel("viewModel");
            var that = this;

            var isFalseBoolean = (oEvent.getParameter("item").getKey()==='true');
            console.log("isFalseBoolean  ------> " ,isFalseBoolean);
            oViewModel.setProperty('/ucmaster/completion_flag',isFalseBoolean);

            if(!isFalseBoolean){
                console.log("false !!!!!");
                oViewModel.setProperty('/ucmaster/completion_date',null);
                oViewModel.setProperty('/ucmaster/facility_person_name',""); 
                oViewModel.setProperty('/ucmaster/facility_person_empno',""); 
                //oViewModel.setProperty('/ucmaster/facility_person_name',"");
                //this.getView().byId("facility_person_name").setValue("");
            }
            
        },

        // getFormatDate: function (date) {

        //     if (!date) {
        //         return '';
        //     }

        //     var year = date.getFullYear();              //yyyy
        //     var month = (1 + date.getMonth());          //M
        //     month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
        //     var day = date.getDate();                   //d
        //     day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
        //     return year + '' + month + '' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
        // },

        _getSearchStates: function () {

            console.log("_getSearchStates");
            var sSearchPopEpItemClassCode = this.getView().byId("searchPopEpItemClassCode").getSelectedKey();
            var sSearchPopItemDesc = this.getView().byId("searchPopItemDesc").getValue();
            var sSearchPopNetPriceContractTitle = this.getView().byId("searchPopNetPriceContractTitle").getValue();
            var sUseFlag = this.getView().byId("searchRateUseflag").getSelectedKey();
            
            console.log("sSearchPopItemDesc==", sSearchPopItemDesc);
            console.log("sSearchPopNetPriceContractTitle==", sSearchPopNetPriceContractTitle);
            console.log("sUseFlag==", sUseFlag);

            var aSearchFilters = [];

            if(!this.isValNull(sSearchPopEpItemClassCode)){
                    aSearchFilters.push(new Filter("ep_item_class_code", FilterOperator.EQ, sSearchPopEpItemClassCode));
                }

            //추후적용
            // if(!this.isValNull(sUseFlag)){
            //         //var bUseFlag = (sUseFlag === "true")?true:false;
            //         aSearchFilters.push(new Filter("expiration_contract_include_flag", FilterOperator.EQ, sUseFlag));
            //     }

            if(!this.isValNull(sSearchPopItemDesc)){
                    var aKeywordFilters = {
                        filters: [
                            new Filter("item_desc", FilterOperator.Contains, sSearchPopItemDesc)
                        ],
                        and: false
                    };
                    aSearchFilters.push(new Filter(aKeywordFilters));
                }

            if(!this.isValNull(sSearchPopNetPriceContractTitle)){
                    var aKeywordFilters = {
                        filters: [
                            new Filter("net_price_contract_title", FilterOperator.Contains, sSearchPopNetPriceContractTitle)
                        ],
                        and: false
                    };
                    aSearchFilters.push(new Filter(aKeywordFilters));
                }

            return aSearchFilters;
        },

        // dialogContractItemAfterclose: function() {
        //     this.byId("dialogContractItem").destroy();
        // },

        // dialogExtraRateAfterclose: function() {
        //     this.byId("dialogExtraRate").destroy();
        // },

        onDetailInputWithManValuePress: function (oEvent) {
            //var sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;    
            var that = this;        
            this.oDetailEmployeeDialog = new EmployeeDialog({
                // id:"employeeDialog" ,
                title:"담당자 검색",
                closeWhenApplied:true,
                items:{
                    filters: [
                    ]
                }

            });
            this.oDetailEmployeeDialog.open();
            this.oDetailEmployeeDialog.attachEvent("apply", function (oEvent) {
                //console.log("oEvent 여기는 팝업에 팝업에서 내려오는곳 : ", oEvent.mParameters.item.vendor_pool_code);
                var sModel = this.getModel("manlist");

                    // if (!that.fnChkDupData(that.mngListTbl, "manlist", "/vpManagerDtlView", "vendor_pool_person_empno", empNo)) {

                        // sModel.setProperty(sPath + "/user_local_name", oEvent.mParameters.item.user_local_name);
                        // sModel.setProperty(sPath + "/user_english_name", oEvent.mParameters.item.user_english_name);
                        // sModel.setProperty(sPath + "/job_title", oEvent.mParameters.item.job_title);
                        // sModel.setProperty(sPath + "/vendor_pool_person_role_text", oEvent.mParameters.item.vendor_pool_person_role_text);
                        // sModel.setProperty(sPath + "/department_local_name", oEvent.mParameters.item.department_local_name);
                        // sModel.setProperty(sPath + "/department_english_name", oEvent.mParameters.item.department_english_name);
                        // sModel.setProperty(sPath + "/user_status_code", oEvent.mParameters.item.user_status_code); 

                //     } else {
                //         alert("중복 값이 있습니다.");
                //         sModel.setProperty(sPath + "/user_local_name", "");
                //         sModel.setProperty(sPath + "/user_english_name", "");
                //         sModel.setProperty(sPath + "/job_title", "");
                //         sModel.setProperty(sPath + "/vendor_pool_person_role_text", "");
                //         sModel.setProperty(sPath + "/department_local_name", "");
                //         sModel.setProperty(sPath + "/department_english_name", "");
                //         sModel.setProperty(sPath + "/user_status_code", "");
                //     }

                console.log("@@@@@@@@@@@@@@@@@@ 0 " , oEvent.mParameters.item.department_local_name);
                this.byId("facility_person_name").setValue(null);
                this.byId("facility_person_empno").setValue(null);
                // that.oSupplierCode.setValue(null);
                this.byId("facility_person_name").setValue(oEvent.mParameters.item.department_local_name);
                this.byId("facility_person_empno").setValue(oEvent.mParameters.item.department_id);


                console.log("@@@@@@@@@@@@@@@@@@ 0 " , this.byId("facility_person_empno").getValue());

                // sModel.setProperty(sPath + "/user_local_name", oEvent.mParameters.item.user_local_name);
                // sModel.setProperty(sPath + "/vendor_pool_person_empno", oEvent.mParameters.item.employee_number);
                // // sModel.setProperty(sPath + "/user_english_name", oEvent.mParameters.item.user_english_name);
                // sModel.setProperty(sPath + "/job_title", oEvent.mParameters.item.job_title);
                // // sModel.setProperty(sPath + "/vendor_pool_person_role_text", oEvent.mParameters.item.vendor_pool_person_role_text);
                // sModel.setProperty(sPath + "/department_local_name", oEvent.mParameters.item.department_local_name);
                // // sModel.setProperty(sPath + "/department_english_name", oEvent.mParameters.item.department_english_name);
                // // sModel.setProperty(sPath + "/user_status_code", oEvent.mParameters.item.user_status_code);                

            }.bind(this));
        },

        onDetailInputWithDeptValuePress: function(){
             this.oDetailDeptDialog = new DepartmentDialog({
                // id:"employeeDialog" ,
                title:"부서 검색",
                closeWhenApplied:true,
                items:{
                    filters: [
                    ]
                }

            });
            this.oDetailDeptDialog.open();
            this.oDetailDeptDialog.attachEvent("apply", function (oEvent) {
                //console.log("oEvent 여기는 팝업에 팝업에서 내려오는곳 : ", oEvent.mParameters.item.vendor_pool_code);
                that.byId("general_repr_department_name").setValue(null);
                that.byId("general_repr_department_code").setValue(null);
                // that.oSupplierCode.setValue(null);
                that.byId("general_repr_department_name").setValue(oEvent.mParameters.item.department_local_name);
                that.byId("general_repr_department_code").setValue(oEvent.mParameters.item.department_id);
            }.bind(this));
        },
//EmployeeDialog   new EmployeeDialog({
        openPlantPopup: function () {
            if (!this.oCmDialogHelp) {
                this.oCmDialogHelp = new EmployeeDialog({
                    title: "시설담당자",
                    keyFieldLabel: "{I18N>/PLANT_CODE}",
                    textFieldLabel: "{I18N>/PLANT_NAME}",
                    keyField: "employee_number",
                    textField: "user_local_name",
                    items: {
                        sorters: [
                            new Sorter("user_local_name", false)
                        ],
                        serviceName: "cm.util.OrgService",
                        entityName: "Division"
                    }
                });
                this.oCmDialogHelp.attachEvent("apply", function (oEvent) {
                    this.byId("saveFacilityPersonCode").setValue(oEvent.getParameter("item").employee_number);
                    this.byId("saveFacilityPersonName").setValue(oEvent.getParameter("item").user_local_name);
                }.bind(this));
            }
            this.oCmDialogHelp.open();
        },

        

        // getFormatDate2 : function (date) {

        //     if(!date){
        //         return '';
        //     }

        //     var year = date.getFullYear();              //yyyy
        //     var month = (1 + date.getMonth());          //M
        //     month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
        //     var day = date.getDate();                   //d
        //     day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
        //     return  year + '' + month + '' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
        // },

        convertDateToString: function (pDate) {

            if (!pDate) return null;

            var date = new Date(pDate);
            var year = date.getFullYear();
            var month = ("0" + (1 + date.getMonth())).slice(-2);
            var day = ("0" + date.getDate()).slice(-2);
            var dateString = year + "-" + month + "-" + day;

            var dateString = year + "-" + month + "-" + day;
            return dateString;

        },

        moveToTable11: function() {
			this.getSelectedRowContext("table2", function(oSelectedRowContext, iSelectedRowIndex, oTable2) {
				// reset the rank property and update the model to refresh the bindings
				this.oProductsModel.setProperty("Rank", this.config.initialRank, oSelectedRowContext);
				this.oProductsModel.refresh(true);

				// select the previous row when there is no row to select
				var oNextContext = oTable2.getContextByIndex(iSelectedRowIndex + 1);
				if (!oNextContext) {
					oTable2.setSelectedIndex(iSelectedRowIndex - 1);
				}
			});
		},

        moveToTable22: function() {
			this.getSelectedRowContext("popTable", function(oSelectedRowContext) {
				var oTable2 = this.byId("popTable2");
				var oFirstRowContext = oTable2.getContextByIndex(0);

				// insert always as a first row
				var iNewRank = this.config.defaultRank;
				if (oFirstRowContext) {
					iNewRank =  this.config.rankAlgorithm.Before(oFirstRowContext.getProperty("Rank"));
				}

				this.oProductsModel.setProperty("Rank", iNewRank, oSelectedRowContext);
				this.oProductsModel.refresh(true);

				// select the inserted row
				oTable2.setSelectedIndex(0);
			});
        },
        
        getSelectedRowContext: function(sTableId, fnCallback) {
            var oTable = this.byId(sTableId);
            
            console.log("oTable ---> " ,oTable)
			var iSelectedIndex = oTable.getSelectedIndex();

			if (iSelectedIndex === -1) {
				MessageToast.show("Please select a row!");
				return;
			}

			var oSelectedContext = oTable.getContextByIndex(iSelectedIndex);
			if (oSelectedContext && fnCallback) {
				fnCallback.call(this, oSelectedContext, iSelectedIndex, oTable);
			}

			return oSelectedContext;
        },


        moveToTable2: function() {
            
            var oView = this.getView();
            var oTable = this.byId("popTable"),
                oModel = this.getView().getModel("popUcQuotationSup"),
                oViewModel = this.getModel("viewModel"),
                oSelected = oTable.getSelectedIndices();
            var dtlData = oViewModel.getProperty("/popUcdetails");
            //var table = this.byId("mainTable");
            var input = [];

            //  dtlData.forEach(function (item, index) {
            //      input.push(dtlData[index]);
            //  });

            if (oSelected.length > 0) {
                
                console.log("oSelected.length ---> " , oSelected.length);
                oSelected.some(function (chkIdx, index) {
                    input.push(oModel.getData()[chkIdx]);
                });
            }

            oViewModel.setProperty("/popUcdetails", input);
        },

        moveToTable1: function() {
            
            var oView = this.getView();
            var oTable = this.byId("popTable2"),
                oModel = this.getView().getModel("popUcQuotationSup"),
                oViewModel = this.getModel("viewModel"),
                oSelected = oTable.getSelectedIndices();
            var popDtlData = oViewModel.getProperty("/popUcdetails");
            var dtlData = oViewModel.getProperty("/ucdetails");
            var dtlData_len = dtlData.length;


            console.log("dtlData====>>>  ", dtlData);

            var input = [];
             popDtlData.forEach(function (item, index) {
                 input.push(popDtlData[index]);
             });

            if (oSelected.length > 0) {
                
                console.log("oSelected.length ---> " , oSelected.length);
                oSelected.some(function (chkIdx, index) {
                    popDtlData.splice(chkIdx, 1);
                    console.log("############################################" , chkIdx);
                });
            }

            console.log("popDtlData=", popDtlData);
            //console.log("dtlData.length=", dtlData_len);

            oViewModel.setProperty("/ucdetails", popDtlData);
            oView.byId("popTable2").clearSelection();

        },


    });
});