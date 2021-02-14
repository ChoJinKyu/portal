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
            // this.setModel(new JSONModel(), "master");
            // this.setModel(new JSONModel(), "details");
            this.setModel(new JSONModel(), "midObjectViewModel");

            // this.setModel(new JSONModel(), "ucQuotationSup");

            this.setModel(new JSONModel(), "popUcQuotationSup");
            this.setModel(new JSONModel(), "popExtraRate");

            // oTransactionManager = new TransactionManager();
            // oTransactionManager.addDataModel(this.getModel("master"));
            // oTransactionManager.addDataModel(this.getModel("details"));

            this.getRouter().getRoute("selectionPage").attachPatternMatched(this._onRoutedThisPage, this);

            // this.getModel("master").attachPropertyChange(this._onMasterDataChanged.bind(this));

            //this._initTableTemplates();
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
            oModel.read("/GetUcApprovalDtlView", {
                filters: aSearchFilters,
                // sorters: [
                //     new Sorter("const_start_date", false)
                // ],
                success: function (oData) {
                    console.log(" GetUcApprovalDtlView ::: ", oData.results);
                    oView.getModel("popUcQuotationSup").setData(oData.results);
                    oView.setBusy(false);
                }

            });

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

        // /**
        //  * Event handler for Enter Full Screen Button pressed
        //  * @public
        //  */
        // onPageEnterFullScreenButtonPress: function () {
        //     var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/fullScreen");
        //     this.getRouter().navTo("midPage", {
        //         layout: sNextLayout,
        //         tenantId: this._sTenantId,
        //         companyCode: this._sCompanyCode,
        //         loiWriteNumber: this._sLoiWriteNumber,
        //         loiItemNumber: this._sLoiItemNumber,
        //         loiSelectionNumber: this._sLoiSelectionNumber,
        //         loiNumber: this._sLoiNumber
        //     });
        // },
        // /**
        //  * Event handler for Exit Full Screen Button pressed
        //  * @public
        //  */
        // onPageExitFullScreenButtonPress: function () {
        //     var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
        //     this.getRouter().navTo("midPage", {
        //         layout: sNextLayout,
        //         tenantId: this._sTenantId,
        //         companyCode: this._sCompanyCode,
        //         loiWriteNumber: this._sLoiWriteNumber,
        //         loiItemNumber: this._sLoiItemNumber,
        //         loiSelectionNumber: this._sLoiSelectionNumber,
        //         loiNumber: this._sLoiNumber
        //     });
        // },
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
		 * Event handler for delete page entity
		 * @public
		 */
        // onPageDeleteButtonPress: function () {
        //     var oView = this.getView(),
        //         oMasterModel = this.getModel("master"),
        //         that = this;

        //     var input = {};
        //     var inputData = {};
        //     var detailData = this._sLoiDtlArr;

        //     console.log("detailData===", detailData[0]);
        //     console.log("detailData===", detailData);

        //     inputData = {
        //         "tenant_id": oMasterModel.getData().tenant_id,
        //         "company_code": oMasterModel.getData().company_code,
        //         "loi_selection_number": oMasterModel.getData().loi_selection_number,
        //         "user_id": '9586',
        //         "details": detailData
        //     }

        //     input.inputData = inputData;

        //     console.log("input====", JSON.stringify(input));
        //     var url = "ep/po/loiPublishMgt/webapp/srv-api/odata/v4/ep.LoiMgtV4Service/DeleteLoiSupplySelectionProc";

        //     MessageBox.confirm(this.getModel("I18N").getText("/NCM00003"), {
        //         title: "Comfirmation",
        //         initialFocus: sap.m.MessageBox.Action.CANCEL,
        //         onClose: function (sButton) {
        //             if (sButton === MessageBox.Action.OK) {
        //                 oView.setBusy(true);

        //                 $.ajax({
        //                     url: url,
        //                     type: "POST",
        //                     data: JSON.stringify(input),
        //                     contentType: "application/json",
        //                     success: function (data) {
        //                         console.log("#########Success#####", data.value);
        //                         oView.setBusy(false);
        //                         that.onPageNavBackButtonPress.call(that);
        //                         MessageToast.show(that.getModel("I18N").getText("/NCM01002"));
        //                     },
        //                     error: function (e) {
        //                         console.log("error====", e);
        //                     }
        //                 });

        //             }
        //         }
        //     });
        // },

		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function (flag) {
            var oView = this.getView(),
                oViewModel = this.getModel("viewModel"),
                that = this;

            

            //var input = {};
            //var inputData = {};
            var mstData = [];
            var details = [];
            var afterDelCnt = 0;
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
            //var dtl_net_price_contract_degree_ = dtlData[this.rateIndex].const_quotation_item_number;
            var rate_len = 0;
            console.log("reteDate ----------> " , reteDate);
            

            if (reteDate === undefined) {
                rate_len = 0;
                console.log("rate_len ----------> " , rate_len);
            }else{
                rate_len = reteDate.length;
            }
            
            //rate_len = (!reteDate.length ? 0 : reteDate.length);
            

            //var supplierData = oViewModel.getProperty("/supplier");
            //var extraData = oViewModel.getProperty("/extra");

            // inputData = {
            //     "mst": mstData,
            //     "dtl": dtlData//,
            //     //"supplier": supplierData,
            //     //"extra": extraData
            // }


            // var convertContractStartDate = that.convertDateToString(contractStartDate);
            //         var convertContractEndDate = that.convertDateToString(contractEndDate);

            var omst = [];
            var const_quotation_number_ = "";
             omst = mstData.map(function(e) { 
                const_quotation_number_ = e.const_quotation_number;
                console.log("date >>> " , e.facility_person_empno);
                console.log("date222 >>> " , e.facility_person_name);

                console.log("const_start_date11 >>> " , e.const_start_date);
                 console.log("const_end_date222 >>> " , e.const_end_date);
                 console.log("completion_date33 >>> " , e.completion_date);

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
                    completion_flag : Boolean(e.completion_flag),
                    completion_date :(!that.convertDateToString(e.completion_date) ? null : that.convertDateToString(e.completion_date)),
                    facility_person_empno : e.facility_person_empno,
                    completion_attch_group_number : e.completion_attch_group_number,
                    quotation_status_code : statusCode,
                    update_user_id: (!e.update_user_id ? 'Admin' : e.update_user_id),
                    row_state: 'U',

                };
            });


            console.log(" omst ::: ", omst);//that.getFormatDate(r["delivery_request_date"]),

            //this._sConstQuotationNumber
            console.log(" 123444444 ::: ");

            var len = oViewModel.getProperty("/ucdetails").length;
            // var addDtlData = this.getSchema("UcApprovalDtlDetailView");
            // addDtlData["tenant_id"] = "L2100";
            // addDtlData["item_sequence"] = 10 * (len + 1);


            var odtl = [];
            //var len = 0;
            //var delNum = 0;
            //var afterDelCnt = 0;
            var num = 1;
            var delNum = 0;
            var afterDelCnt = 0;
            


            console.log(" 55555555555555555 ::: ");

             //var itemSeq = 0;
            //detail.getData()["LOIRequestDetailView"].map(r => {
                //itemSeq = len * 10;
           // })
           var seq_input = 0;
           var index = 0;
           var rowState = "";

             odtl = dtlData.map(function(e) { 

                len = num * 10;
                //console.log(" len ::: ", reteDate.length);
                //rate_len = (!reteDate.length ? 0 : reteDate.length);
                // dtl_const_quotation_item_number_ = ((e.row_state == "U" && rate_len > 0) ? e.const_quotation_item_number : null);
                // console.log(" dtl_const_quotation_item_number_ ::: ", dtl_const_quotation_item_number_);

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
                    net_price_contract_degree: (!e.net_price_contract_degree ? null : parseFloat(e.net_price_contract_degree)),
                    net_price_contract_item_number: e.net_price_contract_item_number,
                    supplier_item_create_flag: (!e.supplier_item_create_flag ? false : Boolean(e.supplier_item_create_flag)),
                    row_state: (!e.const_quotation_item_number ? 'C' : e.row_state),
//row_state: (!e.const_quotation_item_number ? 'C' : 'U'),
                    create_user_id: (!e.create_user_id ? 'Admin' : e.create_user_id),
                    update_user_id: (!e.update_user_id ? 'Admin' : e.update_user_id)
                    

                };

                // console.log(" String(e ::: ", String(e.item_sequence - (afterDelCnt * 10)));

                // if (e.row_state == "D") {
                //         delNum = delNum + 1;
                //         afterDelCnt++;
                //     }

                // if (e.row_state == "U" && reteDate.length > 0) {
                // //if (reteDate.length > 0) {
                //     dtl_const_quotation_item_number_ = (!e.const_quotation_item_number ? null : e.const_quotation_item_number);
                //     console.log(" dtl_const_quotation_item_number_ ::: ", dtl_const_quotation_item_number_);
                // }


                // if (r["_row_state_"] == "D") {
                //         delNum = delNum + 1;
                //         afterDelCnt++;
                //     }
            });

            console.log(" odtl ::: ", odtl);


            var orate = [];
            if(rate_len > 0){
             orate = reteDate.map(function(e) { 

                return { 



//         apply_extra_desc: "2"
// apply_extra_rate: "12"
// company_code: "LGCKR"
// create_user_id: "100003"
// extra_class_name: null
// extra_class_number: "G003"
// extra_name: "위험지역할증(여수)"
// extra_number: "01"
// local_create_dtm: Fri Feb 05 2021 10:04:42 GMT+0900 (대한민국 표준시) {}
// local_update_dtm: Fri Feb 05 2021 10:04:42 GMT+0900 (대한민국 표준시) {}
// net_price_contract_degree: "0"
// net_price_contract_document_no: ""
// system_create_dtm: Fri Feb 05 2021 10:04:42 GMT+0900 (대한민국 표준시) {}
// system_update_dtm: Fri Feb 05 2021 10:04:42 GMT+0900 (대한민국 표준시) {}
// tenant_id: "L2100"
// update_user_id: "100003"

// var dtl_net_price_contract_degree_ = 0;
// var dtl_net_price_contract_document_no_ = "";

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

            console.log("orate ---> " , orate);

            // return;

            // // '221010'	'BM등록요청'
            // // '221020'	'물량확정요청'
            // // '221030'	'물량수정요청'
            // // '221040'	'물량확정'
 
            // var statusCode = "221010";
            // var statusName = "BM등록요청";
            // // if (flag == "R") {
            // //     statusCode = "221020";
            // //     statusName = "물량확정요청";
            // // } else if (flag == "B") {
            // //     statusCode = "221030";
            // //     statusName = "물량수정요청";
            // // } else {
            // //     statusCode = "221040";
            // //     statusName = "물량확정";
            // // }

            // var input = {};
            // var inputData = {};
            // //var detailData = this._sLoiDtlArr;
            // var tenantId = oMasterModel.getData().tenant_id;
            // if (tenantId.indexOf(",") > -1) {
            //     tenantId = tenantId.split(",")[0];
            // }
            // var companyCode = oMasterModel.getData().company_code;
            // if (companyCode.indexOf(",") > -1) {
            //     companyCode = companyCode.split(",")[0];
            // }


            // oDetailsModel.getData().map(r => {

            //     console.log("const_quotation_number ---> " , r["const_quotation_number"] == "undefined" ? 0 : r["const_quotation_number"]);
            //     console.log("const_quotation_item_number ---> " , r["const_quotation_item_number"]);
            //     console.log("item_sequence ---> " , r["item_sequence"]);
            //     console.log("ep_item_code ---> " , r["ep_item_code"]);
            //     console.log("item_desc ---> " , r["item_desc"]);
            //     console.log("spec_desc ---> " , r["spec_desc"]);
            //     console.log("quotation_quantity ---> " , r["quotation_quantity"]);
            //     console.log("unit ---> " , r["unit"]);
            //     console.log("material_apply_flag ---> " , r["material_apply_flag"]);
            //     console.log("labor_apply_flag ---> " , r["labor_apply_flag"]);
            //     console.log("net_price_change_allow_flag ---> " , r["net_price_change_allow_flag"]);
            //     console.log("base_material_net_price ---> " , r["base_material_net_price"]);
            //     console.log("material_net_price ---> " , r["material_net_price"]);
            //     console.log("material_amount ---> " , r["material_amount"]);
            //     console.log("labor_net_price ---> " , r["labor_net_price"]);
            //     console.log("labor_amount ---> " , r["labor_amount"]);
            //     console.log("sum_amount ---> " , r["sum_amount"]);
            //     console.log("currency_code ---> " , r["currency_code"]);
            //     console.log("extra_rate ---> " , r["extra_rate"]);
            //     console.log("net_price_contract_document_no ---> " , r["net_price_contract_document_no"]);
            //     console.log("net_price_contract_degree ---> " , r["net_price_contract_degree"]);
            //     console.log("net_price_contract_item_number ---> " , r["net_price_contract_item_number"]);
            //     console.log("supplier_item_create_flag ---> " , r["supplier_item_create_flag"]);
            //     console.log("remark ---> " , r["remark"]);


               

                
            //     details.push({
            //             tenant_id: r["tenant_id"],
            //             company_code: r["company_code"],
            //             const_quotation_number: '0000871814',//(r["const_quotation_number"] == undefined ? '' : r["const_quotation_number"]),
            //             item_sequence: (!r["item_sequence"] ? 10 : parseFloat(String(itemSeq))),
            //             ep_item_code: r["ep_item_code"],
            //             item_desc: r["item_desc"],
            //             spec_desc: r["spec_desc"],
            //             quotation_quantity: (!r["quotation_quantity"] ? null : r["quotation_quantity"]),
            //             unit: r["unit"],
            //             material_apply_flag: r["material_apply_flag"],
            //             labor_apply_flag: r["labor_apply_flag"],
            //             net_price_change_allow_flag: (!r["net_price_change_allow_flag"] ? false : r["net_price_change_allow_flag"]),
            //             base_material_net_price: (!r["base_material_net_price"] ? null : parseFloat(r["base_material_net_price"])),
            //             base_labor_net_price: (!r["base_labor_net_price"] ? null : parseFloat(r["base_labor_net_price"])),
            //             material_net_price: (!r["material_net_price"] ? null : parseFloat(r["material_net_price"])),
            //             material_amount: (!r["material_amount"] ? null : parseFloat(r["material_amount"])),
            //             labor_net_price: (!r["labor_net_price"] ? null : parseFloat(r["labor_net_price"])),
            //             labor_amount: (!r["labor_amount"] ? null : parseFloat(r["labor_amount"])),
            //             sum_amount: (!r["sum_amount"] ? null: parseFloat(r["sum_amount"])),
            //             currency_code: r["currency_code"],
            //             extra_rate: (!r["extra_rate"] ? null : parseFloat(r["extra_rate"])),
            //             net_price_contract_document_no: r["net_price_contract_document_no"],
            //             net_price_contract_degree: (!r["net_price_contract_degree"] ? null : parseInt(r["net_price_contract_degree"])),
            //             net_price_contract_item_number: r["net_price_contract_item_number"],
            //             supplier_item_create_flag: (!r["supplier_item_create_flag"] ? false : r["supplier_item_create_flag"]),
            //             remark:  (r["remark"] == null ? '' : r["remark"])

            //             //delivery_request_date: that.getFormatDate(r["delivery_request_date"]),

                        
            //         });

            //         console.log("details ---> " , details);
            // });



            // inputData = {
            //     "tenant_id": tenantId,
            //     "company_code": companyCode,
            //     "const_quotation_number": oMasterModel.getData().const_quotation_number,
            //     "const_name": oMasterModel.getData().const_name,


            //     "ep_item_code": oMasterModel.getData().ep_item_code,
            //     "const_start_date": oMasterModel.getData().const_start_date,
            //     "const_end_date": oMasterModel.getData().const_end_date,
            //     "currency_code": oMasterModel.getData().currency_code,
                
            //     "const_person_empno": oMasterModel.getData().const_person_empno,

            //     "purchasing_department_code": oMasterModel.getData().purchasing_department_code,
            //     "buyer_empno": oMasterModel.getData().buyer_empno,

            //     "remark": oMasterModel.getData().remark,
            //     "attch_group_number": oMasterModel.getData().attch_group_number,
            //     "user_id": '9586',
            //     //"details": detailData
            // }

            //console.log("input====", JSON.stringify(inputData));

            //input.inputData = inputData;

            console.log("input====", input);

            // if(!oMasterModel.isChanged() && !oDetailsModel.isChanged()) {
            // 	MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
            // 	return;
            // }

            if (this.validator.validate(this.byId("ucUcQuotationSupEditBox")) !== true) return;

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
            // var oArgs = oEvent.getParameter("arguments"),
            //     oView = this.getView();

            // this._sTenantId = oArgs.tenantId;
            // this._sCompanyCode = oArgs.companyCode;
            // this._sConstQuotationNumber = oArgs.constQuotationNumber;
            // // this._sLoiItemNumber = oArgs.loiItemNumber;
            // // this._sLoiSelectionNumber = oArgs.loiSelectionNumber;
            // // this._sLoiNumber = oArgs.loiNumber;
            // // this._sQuotationNumber = oArgs.quotationNumber;
            // // this._sQuotationItemNumber = oArgs.quotationItemNumber;
            



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

            console.log("####################22222");

            //각 모델의 스키마 생성
            var mstModel = this.getSchema("UcQuotationListView");
            console.log("mstModel333=================", mstModel);

            oViewModel.setProperty("/ucmaster", mstModel);
            var dtlModel = this.getSchema("UcQuotationDtlView");
            console.log("dtlModel333=================", dtlModel);

            oViewModel.setProperty("/ucdetails", dtlModel);

                console.log("###수정");
                var that = this;
                this.getModel("midObjectViewModel").setProperty("/isAddedMode", false);
                var loi_status = "";

                // var oView = this.getView();
                // var oMasterModel = this.getModel();
                // var oDetailsModel = this.getModel();
                oView.setBusy(true);
                var omst = [];

                // Master 조회
                oModel.read("/UcQuotationListView", {
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                        new Filter("company_code", FilterOperator.EQ, this._sCompanyCode),
                        new Filter("const_quotation_number", FilterOperator.EQ, this._sConstQuotationNumber)
                    ],
                    success: function (oData) {
                        
                        console.log(" UcQuotationListView ::: ", oData.results);

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
                        // console.log(" UcQuotationDtlView ::: ", oData.results);

                        // console.log(" const_start_date ::: ", oData.results[0]);
                        // console.log("convertDateToString  const_start_date ::: ", that.convertDateToString(oData.results[0]["const_start_date"]));
                        //oView.getModel("details").setData(oData.results);

                        oData.results.forEach(function (item, index) {
           

                            oData.results[index]["material_net_price"] = (!oData.results[index]["material_net_price"] ? 0 : parseFloat(oData.results[index]["material_net_price"]));
                            oData.results[index]["labor_net_price"] = (!oData.results[index]["labor_net_price"] ? 0 : parseFloat(oData.results[index]["labor_net_price"]));
                            //oData.results[index]["material_amount"] = (!oData.results[index]["material_amount"] ? 0 : parseFloat(oData.results[index]["material_amount"]));
                            //oData.results[index]["labor_amount"] = (!oData.results[index]["labor_amount"] ? 0 : parseFloat(oData.results[index]["labor_amount"]));

                        });

                        oViewModel.setProperty("/ucdetails", oData.results);
                        oView.setBusy(false);
                        // loi_status = oData.quotation_status_code;
                        // that._toShowMode();


                    

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
            // var oMasterModel = this.getModel("master")
            // var statusCode = oMasterModel.getData().quotation_status_code;

            var oViewModel = this.getModel("viewModel");
            var statusCode = oViewModel.getProperty("/ucmaster").quotation_status_code;

            this._showFormFragment('UcQuotationSup_Edit');
            // this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("page").setProperty("showFooter", true);
            this.byId("pageEditButton").setVisible(false);
            //this.byId("pageDeleteButton").setVisible(false);
            //this.byId("pageNavBackButton").setEnabled(false);
            this.byId("pageSaveButton").setVisible(true);
            this.byId("pageRequestButton").setVisible(true);
            if (statusCode === "221010") { //BM등록요청
                this.byId("pageSaveButton").setEnabled(true);
            } else {
                this.byId("pageSaveButton").setEnabled(false);
            }
            if (statusCode === "221020") {
                this.byId("pageRequestButton").setEnabled(false);
            } else {
                this.byId("pageRequestButton").setEnabled(true);
            }
            this.byId("pageCancelButton").setEnabled(true);
            this.byId("midTableAddButton").setEnabled(true);
            this.byId("midTableDeleteButton").setEnabled(true);
            // this.byId("midTableAddButton").setEnabled(!FALSE);
            // this.byId("midTableDeleteButton").setEnabled(!FALSE);
            // this.byId("midTableSearchField").setEnabled(FALSE);
            // this.byId("midTableApplyFilterButton").setEnabled(FALSE);
            // this.byId("midTable").setMode(sap.m.ListMode.SingleSelectLeft);
            //this._bindMidTable(this.oEditableTemplate, "Edit");
            console.log("####################isEditMode", this.getModel("midObjectViewModel").getProperty("/isEditMode"));

        },

        _toShowMode: function () {
            // var oMasterModel = this.getModel("master");
            // var statusCode = oMasterModel.getData().quotation_status_code;


            var oViewModel = this.getModel("viewModel");
       console.log("toshow...quotation_status_code " , oViewModel.getProperty("/ucmaster").quotation_status_code);     
            var statusCode = oViewModel.getProperty("/ucmaster").quotation_status_code;
            console.log("statusCode=", statusCode);
            this.getModel("midObjectViewModel").setProperty("/isEditMode", false);
            this.getModel("midObjectViewModel").setProperty("/isShowMode", true);
            this._showFormFragment('UcQuotationSup_Show');
            // this.byId("page").setSelectedSection("pageSectionMain");
            if (statusCode == "221040" || statusCode == "221030" ) {
                this.byId("page").setProperty("showFooter", false);
            } else {
                this.byId("page").setProperty("showFooter", true);
            }
            //this.byId("pageEditButton").setVisible(true);
            // if (statusCode === "122040" || statusCode === "122060") {
            //     this.byId("pageEditButton").setVisible(false);
            //     this.byId("pageDeleteButton").setVisible(false);
            // } else {
            //this.byId("pageEditButton").setVisible(true);

            if (statusCode === "221010") { //BM등록요청
                this.byId("pageEditButton").setVisible(true);
            } else {
                this.byId("pageEditButton").setVisible(false);
            }

            //this.byId("pageDeleteButton").setVisible(true)
            //}
            //this.byId("pageDeleteButton").setEnabled(true);
            //this.byId("pageNavBackButton").setEnabled(true);

            this.byId("pageSaveButton").setVisible(false);
            this.byId("pageRequestButton").setVisible(false);

            this.byId("pageCancelButton").setEnabled(true);
            this.byId("midTableAddButton").setEnabled(false);
            this.byId("midTableDeleteButton").setEnabled(false);
            // this.byId("midTableAddButton").setEnabled(!TRUE);
            // this.byId("midTableDeleteButton").setEnabled(!TRUE);
            // this.byId("midTableSearchField").setEnabled(TRUE);
            // this.byId("midTableApplyFilterButton").setEnabled(TRUE);
            // this.byId("midTable").setMode(sap.m.ListMode.None);
            // this._bindMidTable(this.oReadOnlyTemplate, "Navigation");
            console.log("####################isEditMode", this.getModel("midObjectViewModel").getProperty("/isEditMode"));
        },

        // _bindMidTable: function(oTemplate, sKeyboardMode){
        // 	this.byId("midTable").bindItems({
        // 		path: "details>/ControlOptionDetails",
        // 		template: oTemplate
        // 	}).setKeyboardMode(sKeyboardMode);
        // },

        // _oFragments: {},
        // _showFormFragment: function (sFragmentName) {
        //     var oPageSubSection = this.byId("pageSubSection1");
        //     this._loadFragment(sFragmentName, function (oFragment) {
        //         oPageSubSection.removeAllBlocks();
        //         oPageSubSection.addBlock(oFragment);
        //     })
        // },
        // _loadFragment: function (sFragmentName, oHandler) {
        //     if (!this._oFragments[sFragmentName]) {
        //         Fragment.load({
        //             id: this.getView().getId(),
        //             name: "ep.po.loiPublishMgt.view." + sFragmentName,
        //             controller: this
        //         }).then(function (oFragment) {
        //             this._oFragments[sFragmentName] = oFragment;
        //             if (oHandler) oHandler(oFragment);
        //         }.bind(this));
        //     } else {
        //         if (oHandler) oHandler(this._oFragments[sFragmentName]);
        //     }
        // }

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
            if (!this._oFragments[sFragmentName]) {
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

            console.log("mstData.tenant_id  ------> " , mstData.tenant_id);
            console.log("mstData.company_code  ------> " , mstData.company_code);
            console.log("mstData.const_quotation_number  ------> " , mstData.const_quotation_number);

            console.log("mstData.org_name  ------> " , mstData.org_name);


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

                // Master 조회
                oModel.read("/GetUcApprovalDtlView", {
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, mstData.tenant_id),
                        new Filter("company_code", FilterOperator.EQ, mstData.company_code)//,
                        //new Filter("const_quotation_number", FilterOperator.EQ, this._sConstQuotationNumber)
                    ],
                    success: function (oData) {
                        console.log(" GetUcApprovalDtlView ::: ", oData.results);
                        oView.getModel("popUcQuotationSup").setData(oData.results);
                        oView.setBusy(false);

                    }

                });

                oView.byId("searchPopEpItemClassCode").setSelectedKey(mstData.ep_item_code); 
                oView.byId("searchPopOrgCode").setText(mstData.org_name);


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
                        console.log("two more========", chkIdx);  
                        
                        input.push(oModel.getData()[chkIdx]);  
                        //input[chkIdx].row_state= "C";  
                        //input[chkIdx].item_sequence= (chkIdx+1) * 10;
                        console.log("idx=", input[index].item_sequence);
                        
                    }
                }else{
                    input.push(oModel.getData()[chkIdx]);
                    //input[chkIdx].row_state= "C";    
                }

                });
            }

            


            console.log("input========", input);
            //oViewModel.setProperty("/ucdetails", input);

            // var seq = 0;
            // seq = (dtlData.length+1) * 10;
            // input.forEach(function (item, index) {
            //     //input.push(dtlData[index]);
            //     // console.log("idx11=", input[index].item_sequence);
                
            //     // if(input[index].item_sequence == 0){
            //     //     input[index].row_state= "C";
            //     //     input[index].item_sequence= seq;
            //     //     console.log("idx=", input[index].item_sequence);
            //     //     seq = seq + 10;
            //     // }
            //     seq = seq + 10;
            //     input[index].item_sequence= seq;
            //     input[index].row_state= "C";
                
            // });

             input.map(function (d, index) {
                console.log("index=", index);
                d["item_sequence"] = 10 * (index + 1);
                //d["row_state"] = "C";
                if(dtlData.length <= index){
                    d["row_state"] = "C";
                }
                return d;
            });

            

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
            
            var document_no = "";
            var degree = "";
            var item_number = "";
            var document_no_ = "";
            var degree_ = "";
            var item_number_ = "";
            var real_val = 0;


            console.log("this.rateIndex 111111111111111---> " , this.rateIndex );
            var selIndex = this.rateIndex;

            if (oSelected.length > 0) {
                
                console.log("oSelected.length ---> " , oSelected.length);
                console.log("rateData.length ---> " , rateData.length );
                
                var sum_val = 0;
                var aaa = 0 ;
                var sum_int = [];
                oSelected.some(function (chkIdx, index) {
                    //input.push(oModel.getData()[chkIdx]);  
                    input.push(rateData[chkIdx]);  
                    aaa = (!oModel.getData()[chkIdx].apply_extra_rate) ? null : parseFloat(oModel.getData()[chkIdx].apply_extra_rate);
                    sum_val = sum_val + aaa;
                });
            }
            
            input.forEach(function (item, index) {
                input[index].row_state= "C";
                input[index].const_quotation_item_number = dtlData[selIndex].const_quotation_item_number;

                //sum_val = sum_val +  parseFloat(dtlData[selIndex].apply_extra_rate).toFixed(2);//parseFloat(sum_val) + Math.floor(dtlData[selIndex].apply_extra_rate*100)/100;
                //console.log("sum_val========", dtlData[selIndex].apply_extra_rate);
            });

            sum_int = String(sum_val).split('.');

            console.log("####  ---> " + "1.".concat(sum_int[1]));


            

//console.log("sum_val========", aaa);
            console.log("input========", input);

            this.hasInput = input;

            console.log("this.hasInput========", this.hasInput);

            

var coms = parseFloat("1.".concat(sum_int[1]));
console.log("Math.round========", (Math.round(coms*100)/100.0));

            if(input.length > 0){
                dtlData[selIndex].row_state = 'U';
                dtlData[selIndex].extra_rate = (Math.round(coms*100)/100.0);



        
                
                
            // var odtl = [];

            //  odtl = dtlData.map(function(e) { 
            //     return { 
            //         tenant_id: e.tenant_id, 
            //         company_code: e.company_code,
            //         const_quotation_number: e.const_quotation_number,
            //         const_name: e.const_name,
            //         ep_item_code: e.ep_item_code,
            //         const_start_date: that.getFormatDate(e.const_start_date),
            //         const_end_date: that.getFormatDate(e.const_end_date),
            //         remark: e.remark,
            //         attch_group_number: e.attch_group_number,
            //         update_user_id: (!e.update_user_id ? 'Admin' : e.update_user_id),
            //         row_state: 'U',
            //     };
            // });

            //     input[1].row_state= "U";
            //     input[index].item_sequence= seq;
            //     console.log("idx=", input[index].item_sequence);
            //     seq = seq + 10;

            that.onRateChange(dtlData[selIndex].extra_rate,selIndex);
            }

            


            oViewModel.setProperty("/ucdetails", dtlData);

            
            // oViewModel.setProperty("/ucdetails", input);

            // var seq = 0;
            // seq = (dtlData.length+1) * 10;
            // input.forEach(function (item, index) {
            //     //input.push(dtlData[index]);
            //     console.log("idx11=", index);
                
                
            //     if(input[index].item_sequence == 0){
            //         input[index].row_state= "C";
            //         input[index].item_sequence= seq;
            //         console.log("idx=", input[index].item_sequence);
            //         seq = seq + 10;
            //     }
                
                
            // });

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

            
            console.log("val -->" , val);

             var oViewModel = this.getModel("viewModel");
            // var sPath = oEvent.getSource().getBindingInfo("value").binding.getContext().getPath();
            // var index = sPath.substr(sPath.length-1);
            console.log(" index obj ----------------->" , index); 

            var dtlData = oViewModel.getProperty("/ucdetails");
            //quotation_quantity

            console.log(" edit before----------------->" , dtlData[index]["row_state"]); 

            //dtlData[index]["material_amount"] = dtlData[index]["material_amount"];
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
            console.log(" index obj ----------------->" , index); 

            var dtlData = oViewModel.getProperty("/ucdetails");

            console.log(" edit before----------------->" , dtlData[index]["row_state"]); 

            dtlData[index]["material_amount"] = val * dtlData[index]["material_net_price"];
            dtlData[index]["labor_amount"] = val * dtlData[index]["labor_net_price"];
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
            console.log(" index obj ----------------->" , index); 

            var dtlData = oViewModel.getProperty("/ucdetails");

            dtlData[index]["material_amount"] = val * dtlData[index]["quotation_quantity"]; //자재단가 * 수량
            dtlData[index]["labor_amount"] = dtlData[index]["quotation_quantity"] * dtlData[index]["labor_net_price"]; //수량 * 노무단가
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
            console.log(" index obj ----------------->" , index); 

            var dtlData = oViewModel.getProperty("/ucdetails");

            dtlData[index]["labor_amount"] = val * dtlData[index]["quotation_quantity"]; //노무단가 * 수량
            dtlData[index]["material_amount"] = dtlData[index]["quotation_quantity"] * dtlData[index]["material_net_price"]; //수량 * 자재단가
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
                    new Filter("company_code", FilterOperator.EQ, mstData.company_code)//,
                    //new Filter("const_quotation_number", FilterOperator.EQ, this._sConstQuotationNumber)
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


            // oMasterModel.setTransactionModel(this.getModel());
            // oMasterModel.read(sObjectPath, {
            //     success: function (oData) {
            //         oView.setBusy(false);

            //         console.log("master ----> " ,oData);
            //         oView.getModel("master").updateBindings(true);
            //          promise.resolve(oData);
            //     }.bind(this),						
            //     error: function(oData){						
            //         promise.reject(oData);	
            //     }	

            // });

            return promise;
        },

        onTableExtraRatePress: function (oEvent) {

            console.log(" empl abc----------------->", oEvent); 

            var oView = this.getView(),
                oModel = this.getModel(),
                oViewModel = this.getModel("viewModel");

            var mstData = oViewModel.getProperty("/ucmaster");
            var dtlData = oViewModel.getProperty("/ucdetails");
            var rateData = oViewModel.getProperty("/ucRate");

            console.log("dtlData  ------> " , dtlData);

            console.log("mstData.tenant_id  ------> " , mstData.tenant_id);
            console.log("mstData.company_code  ------> " , mstData.company_code);
            console.log("dtlData.net_price_contract_document_no  ------> " , dtlData.net_price_contract_document_no);
            console.log("mstData.net_price_contract_title  ------> " , mstData.net_price_contract_title);

            var sPath = oEvent.getSource().getBindingInfo("text").binding.getContext().getPath();
            this.rateIndex =  parseInt(sPath.substr(11,1));
            var beforeIndex = parseInt(sPath.substr(11,1));
            var test_val = [];
            ///ucdetails/2
             //console.log(" sPath----------------->", sPath); 
             console.log(" sPath----------------->", sPath);
             console.log(" this.rateIndex----------------->", this.rateIndex);  
             //console.log(" this.tenant_id----------------->", dtlData[0]["tenant_id"]); 
             console.log(" this.tenant_id----------------->", dtlData[this.rateIndex]["tenant_id"]); 
             console.log(" this.company_code----------------->", dtlData[this.rateIndex]["company_code"]); 
             console.log(" this.const_quotation_number----------------->", dtlData[this.rateIndex]["const_quotation_number"]); 
             console.log(" this.const_quotation_item_number----------------->", dtlData[beforeIndex]["const_quotation_item_number"]); 

             console.log(" $$$$$$$$$$$$$$$$$$ this.net_price_contract_document_no----------------->", dtlData[beforeIndex]["net_price_contract_document_no"]); 

//oView.byId("searchNetPriceContractTitle").setText(dtlData[beforeIndex]["net_price_contract_title"]);

            // var sPath = oEvent.getSource().getBindingInfo("value").binding.getContext().getPath();
            // var index = sPath.substr(sPath.length-1);
            // console.log(" index obj ----------------->" , index); 


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

                console.log("rateData  ------> " , rateData);

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
                        //oView.getModel("popExtraRate").setData(oData.results);
                        oViewModel.setProperty("/ucBeforeRate", oData.results);


                        //console.log(" %%%%%%%%%%%%%%%% this.net_price_contract_title----------------->", oData.results[beforeIndex]["net_price_contract_title"]); 


                        var beforeRateData = oViewModel.getProperty("/ucBeforeRate");
                        var net_price_contract_document_no_ = "";
                        var net_price_contract_degree_ = "";
                        var net_price_contract_extra_seq_ = "";
                        
                        var test_index = 0;

                        var dtl_net_price_contract_document_no = (!dtlData[beforeIndex]["net_price_contract_document_no"] ? '' : dtlData[beforeIndex]["net_price_contract_document_no"]); 
                        var dtl_net_price_contract_degree = (!dtlData[beforeIndex]["net_price_contract_degree"] ? '' : dtlData[beforeIndex]["net_price_contract_degree"]); 
                        var dtl_net_price_contract_extra_seq = (!dtlData[beforeIndex]["net_price_contract_extra_seq"] ? '' : dtlData[beforeIndex]["net_price_contract_extra_seq"]); 


                        console.log(" rateData----------------->" ,rateData); 

                        if(rateData){
                            console.log(" 1111111111111----------------->", dtl_net_price_contract_document_no);  
                            rateData.map(r => {
                            
                                net_price_contract_document_no_ = (!r["net_price_contract_document_no"] ? '' : r["net_price_contract_document_no"]); 
                                net_price_contract_degree_ = (!r["net_price_contract_degree"] ? '' : r["net_price_contract_degree"]); 
                                net_price_contract_extra_seq_ = (!r["net_price_contract_extra_seq"] ? '' : r["net_price_contract_extra_seq"]); 
console.log(" 222222222222----------------->" ,net_price_contract_document_no_);  

                                // if (((dtl_net_price_contract_document_no.includes(net_price_contract_document_no_)) 
                                // && (dtl_net_price_contract_degree.includes(net_price_contract_degree_)) 
                                // && (dtl_net_price_contract_extra_seq.includes(net_price_contract_extra_seq_)))) {

                                if (((dtl_net_price_contract_document_no.includes(net_price_contract_document_no_)) 
                                && (dtl_net_price_contract_degree.includes(net_price_contract_degree_)) 
                                && (dtl_net_price_contract_extra_seq.includes(net_price_contract_extra_seq_)))) {
                                    console.log("@@@@@===", dtl_net_price_contract_document_no + "@@@@@===", net_price_contract_document_no_   );
                                    console.log("@@@@@===", dtl_net_price_contract_degree + "@@@@@===", net_price_contract_degree_   );
                                    console.log("@@@@@===", dtl_net_price_contract_extra_seq + "@@@@@===", net_price_contract_extra_seq_   );

                                    //++test_index;

                                    console.log(" test_index----------------->", test_index); 
                                    test_val.push(test_index);


                                    //oView.byId("popRateTable").setSelectedIndex(test_index);
                                    
                                    
                                   


                                }

                                test_index++;

                            });

                            console.log(" test_val----------------->", test_val);
                            oView.byId("popRateTable").clearSelection();
                            for(var i=0; i < test_val.length ; i++){
                                oView.byId("popRateTable").addSelectionInterval(i,1);
                                console.log("############################################" , i);
                            }

                        }
                        console.log(" beforeRateData----------------->", beforeRateData[0]); 
                        console.log(" beforeRateData- net_price_contract_title---------------->", beforeRateData[0]["net_price_contract_title"]);   

                        oView.byId("searchNetPriceContractTitle").setText(beforeRateData[0]["net_price_contract_title"]);
            

                        oView.setBusy(false);

                    }

                });
                //저장되어있는 할증 조회

                }).bind(this));
                

                oView.byId("searchNetPriceContractDocumentNo").setText(dtlData[beforeIndex]["net_price_contract_document_no"]); 
                



                dtlData[this.rateIndex]["const_quotation_item_number"]

            }).bind(this));

        },



        // onExtraRateApply: function (oEvent) {
        //     var oView = this.getView();
        //     var oTable = this.byId("popRateTable"),
        //         oModel = this.getView().getModel("popExtraRate"),
        //         oViewModel = this.getModel("viewModel"),
        //         oSelected = oTable.getSelectedIndices();
        //     var dtlData = oViewModel.getProperty("/ucdetails");
        //     var input = [];

        //     console.log("oModel  ------> " , oModel);

        //     this.byId("dialogExtraRate").close();
        // },

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

            // oDtlData.map(function (d, index) {
            //     console.log("index=", index);
            //     if(oDtlData[index]["row_state"] != "D"){
            //         d["item_sequence"] = 10 * (index + 1);
            //     }
            //     return d;
                
            // });

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
            //this.byId("changeDate").getFormatDate("");


//Boolean bbb = that.convertBoolean(oEvent.getParameter("item").getKey());
           

            oViewModel.setProperty('/ucmaster/completion_flag',isFalseBoolean);

            if(!isFalseBoolean){
                console.log("false !!!!!");
                oViewModel.setProperty('/ucmaster/completion_date',null);
                oViewModel.setProperty('/ucmaster/facility_person_name',""); 
                oViewModel.setProperty('/ucmaster/facility_person_empno',""); 
                //oViewModel.setProperty('/ucmaster/facility_person_name',"");
                //this.getView().byId("facility_person_name").setValue("");
            }
            

            //viewModel>/ucmaster/completion_flag
            

            //var [event, field] = arguments;

            //console.log("event  ------> ", oEvent.getParameter("item").getKey());
            //console.log("val  ------> ", val);
            // var bVal;
            // bVal= oEvent.getParameter("item").getKey();

            
        },

        // onStatusSelectionChange: function (oEvent) {
        //     var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S",
        //         seSurffix = sSurffix === "E" ? "S" : "E",
        //         oSearchStatus = this.getView().byId("searchStatus" + seSurffix);

        //     oSearchStatus.setSelectedKey(oEvent.getParameter("item").getKey());
        // },


        getFormatDate: function (date) {

            if (!date) {
                return '';
            }

            var year = date.getFullYear();              //yyyy
            var month = (1 + date.getMonth());          //M
            month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
            var day = date.getDate();                   //d
            day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
            return year + '' + month + '' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
        },

        _getSearchStates: function () {

            console.log("_getSearchStates");
            //console.log(this.getView().byId("searchPopEpItemCode").getSelectedKey().getContext());
            var sSearchPopEpItemClassCode = this.getView().byId("searchPopEpItemClassCode").getSelectedKey();
            var sSearchPopItemDesc = this.getView().byId("searchPopItemDesc").getValue();
            var sSearchPopNetPriceContractTitle = this.getView().byId("searchPopNetPriceContractTitle").getValue();
            //추후적용 var sUseFlag = this.getView().byId("searchRateUseflag").getSelectedKey();

            // var requestFromDate = this.byId("searchConstDate").getValue().substring(0, 10).replaceAll(" ", ""),
            //     requestToDate = this.byId("searchConstDate").getValue().substring(13).replaceAll(" ", "");


            // var sSearchConstQuotationNumber = this.getView().byId("searchConstQuotationNumber").getValue(),
            //     status = this.getView().byId("searchPopEpItemCode").getSelectedKey();
            
            console.log("sSearchPopItemDesc==", sSearchPopItemDesc);
            console.log("sSearchPopNetPriceContractTitle==", sSearchPopNetPriceContractTitle);
            // console.log("requestFromDate==", requestFromDate);
            // console.log("requestToDate==", requestToDate);
            // console.log("sSearchConstQuotationNumber==", sSearchConstQuotationNumber);
            // console.log("status==", status);


            var aSearchFilters = [];

            if(!this.isValNull(sSearchPopEpItemClassCode)){
                    aSearchFilters.push(new Filter("ep_item_class_code", FilterOperator.EQ, sSearchPopEpItemClassCode));
                }

            //추후적용
            // if(!this.isValNull(sUseFlag)){
            //         var bUseFlag = (sUseFlag === "true")?true:false;
            //         aSearchFilters.push(new Filter("expiration_contract_include_flag", FilterOperator.EQ, bUseFlag));
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

            //  if(!!requestFromDate || !!requestToDate){
            //     aSearchFilters.push(new Filter({
            //         filters: [
            //             new Filter("const_start_date", FilterOperator.BT, requestFromDate, requestToDate),
            //             new Filter("const_start_date", FilterOperator.BT, requestFromDate, requestToDate)
            //         ],
            //         and : false
            //     }));
            // }

            // if(!this.isValNull(sSearchConstQuotationNumber)){
            //         var aKeywordFilters = {
            //             filters: [
            //                 new Filter("const_quotation_number", FilterOperator.Contains, sSearchConstQuotationNumber)
            //             ],
            //             and: false
            //         };
            //         aSearchFilters.push(new Filter(aKeywordFilters));
            //     }

            // if (sSearchPopEpItemCode) {
            //     aSearchFilters.push(new Filter("quotation_status_code", FilterOperator.EQ, sSearchPopEpItemCode));
            // }


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
                    title: "{I18N>/PLANT_NAME}",
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

    });
});