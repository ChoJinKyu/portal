sap.ui.define([
    "./App.controller",
    "ext/lib/util/SppUserSessionUtil",
    "ext/lib/model/ManagedListModel",
    "ext/lib/model/TransactionManager",
    "ext/lib/util/Validator",
    "ext/lib/formatter/Formatter",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/richtexteditor/RichTextEditor",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/Token",
    "ext/pg/util/control/ui/MaterialOrgDialog",
    "dp/util/control/ui/MaterialMasterDialog",
    "ext/pg/util/control/ui/MaterialDialog",
    "ext/pg/util/control/ui/SupplierDialog",
    "ext/pg/util/control/ui/VendorPoolDialog",
    "ext/pg/util/control/ui/VendorPoolDialogPop",
    "ext/sp/util/control/ui/MakerDialog",
],
    function (
        BaseController,
        SppUserSessionUtil,
        ManagedListModel,
        TransactionManager,
        Validator,
        Formatter,
        DateFormatter,
        JSONModel,
        ODataModel,
        RichTextEditor,
        MessageBox,
        Fragment,
        Filter,
        FilterOperator,
        MessageToast,
        Token,
        MaterialOrgDialog,
        MaterialMasterDialog,
        MatrialDialog,
        SupplierDialog,
        VendorPoolDialog,
        VendorPoolDialogPop,
        MakerDialog
    ) {
        "use strict";

        var sSelectedDialogPath, sTenantId, oOpenDialog;
        var that;
        return BaseController.extend("sp.np.netPriceMgt.controller.BasePriceDetail", {
            dateFormatter: DateFormatter,
            formatter: Formatter,

            /*========================================= Init : Start ===============================*/

            onInit: function () {
                that = this;
                // Router설정. Detail 화면이 호출될 때마다 _getBasePriceDetail 함수 호출
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("NetPriceMgtDetail").attachPatternMatched(this._onRoutedThisPage, this);

                this.getView().setModel(new ManagedListModel(), "approver");
                this.setModel(new JSONModel(), "detailModel");
                this.setModel(new JSONModel(), "detailViewModel");

                //마스터정보 리스트
                this.setModel(new JSONModel(), "masterInfoList");
                //일반정보 리스트, 기준단가목록 같이 사용할수 없어서 나눔
                this.setModel(new ManagedListModel(), "generalInfoList");
                this.setModel(new ManagedListModel(), "basePriceInfoList");
                //협상이력
                this.setModel(new ManagedListModel(), "negotitaionList");
            },

            /**
             * Base Price Detail 데이터 조회
            */
            _onRoutedThisPage: function (oEvent) {
                this.fnLoadData(oEvent.getParameter("arguments"));
                
            },
            /*========================================= Init : End ===============================*/

            fnBtnCtrlFnc: function (approveStatus) {
                console.log("approveStatus:" + approveStatus);
                that.byId("draftBtn").setVisible(false);
                that.byId("deleteBtn").setVisible(false);
                that.byId("requestBtn").setVisible(false);
                that.byId("approveBtn").setVisible(false);
                that.byId("rejectBtn").setVisible(false);
                //that.byId("cancelBtn").setVisible(false);
                
                switch (approveStatus) {
                    case "DR":
                        that.byId("draftBtn").setVisible(true);
                        that.byId("deleteBtn").setVisible(true);
                        that.byId("requestBtn").setVisible(true);
                        break;
                    case "AR":
                        //that.byId("cancelBtn").setVisible(true);
                        that.byId("approveBtn").setVisible(true);
                        that.byId("rejectBtn").setVisible(true);
                        break;
                    case "IA":
                        that.byId("approveBtn").setVisible(true);
                        that.byId("rejectBtn").setVisible(true);
                        break;
                    case "AP":
                        that.onEditToggle(false);
                        break;
                    case "RJ":
                        that.onEditToggle(false);
                        break;
                    case "CR":
                        that.byId("draftBtn").setVisible(true);
                        break;
                }
            },
            
            /*========================================= oData : Start ===============================*/
            fnLoadData: function(args) {
                var oView = this.getView();
                this.pAppNum = args.pAppNum;
                this.generalInfoTbl = this.byId("generalInfoTbl");
                var oRootModel = this.getModel("rootModel");
                var oDetailModel = this.getModel("detailModel");
                var generalInfoModel = this.getModel("generalInfoList");
                this.basePriceInfoModel = this.getModel("basePriceInfoList");
                var oDetailViewModel = this.getModel("detailViewModel");
                var oApproverModel = this.getModel("approver");
                generalInfoModel.setProperty("/entityName", "GeneralView");
                generalInfoModel.setProperty("/GeneralView", null);
                this.basePriceInfoModel.setProperty("/entityName", "GeneralView");
                this.basePriceInfoModel.setProperty("/GeneralView", null);

                // Approval Line 초기화 시작
                oApproverModel.setProperty("/entityName", "Approvers");
                oApproverModel.setProperty("/Approvers", null);

                var oReferMulti = this.byId("referMulti");

                if (oReferMulti) {
                    oReferMulti.removeAllTokens();
                }
                // Approval Line 초기화 끝

                // 리스트 또는 품의진행상태조회에서 선택해서 넘어오는 경우

                if (args.pMode === "R") {
                    oDetailModel.setData({});
                    //oDetailViewModel.setProperty("/viewMode", false);

                    var aMasterFilters = [];
                    aMasterFilters.push(new Filter("tenant_id", FilterOperator.EQ, SppUserSessionUtil.getUserInfo().TENANT_ID));
                    aMasterFilters.push(new Filter("approval_number", FilterOperator.EQ, that.pAppNum));

                    oView.setBusy(true);

                    // Master 조회
                    this._readData("detail", "/MasterView", aMasterFilters, {}, function (data) {
                        console.log("MasterView:", data);
                        if (data.results.length > 0) {
                            var result = data.results[0];

                            var oNewBasePriceData = {
                                "tenant_d": SppUserSessionUtil.getUserInfo().TENANT_ID,
                                "approval_number": result.approval_number,
                                "approval_title": result.approval_title,
                                "approval_contents": result.approval_contents,
                                "approval_status_code": result.approve_status_code,
                                "approval_status_name": result.approve_status_name,
                                "requestor_empno": result.requestor_empnm,
                                "request_date": this.getOwnerComponent()._changeDateString(oToday),
                                "net_price_document_type_code": result.net_price_document_type_code,
                                "net_price_source_code": result.net_price_source_code,
                                "net_price_type_code": result.net_price_type_code
                            };
                            oDetailModel.setData(oNewBasePriceData);
                            
                            that._readData("detail", "/GeneralView", aMasterFilters, {}, function (data) {
                                console.log("GeneralView::", data);
                                generalInfoModel.setProperty("/GeneralView", data.results);
                                //this.basePriceInfoModel.setProperty("/GeneralView", data.results);
                                that.fnBtnCtrlFnc(result.approve_status_code);
                            }.bind(this));

                            oView.setBusy(false);
                        } else {
                            oView.setBusy(false);
                        }

                        // Process에 표시될 상태 및 아이콘 데이터 세팅
                        //this.onSetProcessFlowStateAndIcon(oDetailViewModel, oMaster.approve_status_code);
                    }.bind(this));
                } else {// Create 버튼으로 넘어오는 경우

                    // 기준단가 기본 데이터 세팅
                    var oToday = new Date();
                    var oNewBasePriceData = {
                        "tenant_id": SppUserSessionUtil.getUserInfo().TENANT_ID,
                        "approval_number": "N/A",
                        "approval_title": "",
                        //"approval_type_code": oRootModel.getProperty("/selectedApprovalType"),   // V10: 신규, V20: 변경
                        "approval_status_code": "DR",    // DR: Draft
                        "approval_status_name": oRootModel.getProperty("/processList/0/code_name"),
                        "requestor_empno": SppUserSessionUtil.getUserInfo().EMPLOYEE_NUMBER,
                        "request_date": this.getOwnerComponent()._changeDateString(oToday)
                    };
                    oDetailModel.setData(oNewBasePriceData);
                    oDetailViewModel.setProperty("/detailsLength", 0);
                    oDetailViewModel.setProperty("/viewMode", true);

                    // 저장된 Approver가 없는 경우 Line 추가
                    this.onApproverAdd(0);
                    that.fnBtnCtrlFnc("CR");

                    // Process에 표시될 상태 및 아이콘 데이터 세팅
                    // this.onSetProcessFlowStateAndIcon(oDetailViewModel, oNewBasePriceData.approve_status_code);
                }
            },
                
            /**
             * OData 호출
             */
            _readData: function (sModelParam, sCallUrlParam, aFiltersParam, oUrlParametersParam, fCallbackParam) {
                var oModel = this.getModel(sModelParam);
                var oView = this.getView();

                oModel.read(sCallUrlParam, {
                    filters: aFiltersParam,
                    urlParameters: oUrlParametersParam,
                    success: fCallbackParam,
                    error: function (data) {
                        oView.setBusy(false);
                        console.log("error", data);
                    }
                });
            },

            _bindView: function (sObjectPath, sModel, aFilter, callback) {
                var oView = this.getView(),
                    oModel = this.getModel(sModel);
                oView.setBusy(true);
                oModel.setTransactionModel(this.getModel());
                oModel.read(sObjectPath, {
                    filters: aFilter,
                    success: function (oData) {
                        oView.setBusy(false);
                        callback(oData);
                    }
                });
            },
            /*========================================= oData : End ===============================*/


            /*========================================= ValueHelp : Start ===============================*/

            vhMakerCode: function (oEvent) {
                that.sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;
                var generalInfoModel = this.getModel("generalInfoList");

                if (!this.oMakerCodeDialog) {
                    this.oMakerCodeDialog = new MakerDialog({
                        multiSelection: false
                    });

                    this.oMakerCodeDialog.attachEvent("apply", function (oEvent) {
                        generalInfoModel.setProperty(that.sPath + "/maker_code", oEvent.mParameters.item.maker_code);
                        generalInfoModel.setProperty(that.sPath + "/maker_name", oEvent.mParameters.item.maker_local_name);
                    }.bind(this));
                }
                this.oMakerCodeDialog.open();

            },

            vhMaterialOrgCode: function (oEvent) {
                //console.log("spath:::" + oEvent.getSource().getParent().getRowBindingContext().sPath);
                that.sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;
                var oRootModel = this.getModel("rootModel");
                var generalInfoModel = this.getModel("generalInfoList");

                if (!this.oSearchMultiMaterialMasterDialog) {
                    this.oSearchMultiMaterialMasterDialog = new MaterialOrgDialog({
                        title: "Choose Material Code",
                        multiSelection: false,
                        companyCode: SppUserSessionUtil.getUserInfo().COMPANY_CODE,
                        purOrg: oRootModel.getProperty("/purOrg"),
                        tenantId: SppUserSessionUtil.getUserInfo().TENANT_ID
                    });
                    this.oSearchMultiMaterialMasterDialog.attachEvent("apply", function (oEvent) {
                        console.log("apply event!!!");
                        //oViewModel.refresh();
                        generalInfoModel.setProperty(that.sPath + "/org_code", oEvent.mParameters.item.org_code);
                        generalInfoModel.setProperty(that.sPath + "/material_code", oEvent.mParameters.item.material_code);
                        generalInfoModel.setProperty(that.sPath + "/material_desc", oEvent.mParameters.item.material_desc);
                        generalInfoModel.setProperty(that.sPath + "/uom", oEvent.mParameters.item.base_uom_code);
                    }.bind(that));
                }
                this.oSearchMultiMaterialMasterDialog.open();
            },

            vhMaterialCode: function (oEvent) {
                //console.log("change1:" + oEvent.oSource.getProperty("selectedKey"));
                that.sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;
                var generalInfoModel = this.getModel("generalInfoList");
                if (!this.gMatrialDialog) {
                    this.gMatrialDialog = new MatrialDialog({
                        title: "Choose Material",
                        multiSelection: false,
                        items: {
                            filters: [
                                new Filter("tenant_id", "EQ", SppUserSessionUtil.getUserInfo().TENANT_ID)
                            ]
                        }
                    });

                    this.gMatrialDialog.attachEvent("apply", function (oEvent) {
                        //console.log("oEvent 여기는 팝업에 내려오는곳 : ", oEvent.mParameters.item.material_code);
                        generalInfoModel.setProperty(that.sPath + "/material_code", oEvent.mParameters.item.material_code);
                        generalInfoModel.setProperty(that.sPath + "/material_desc", oEvent.mParameters.item.material_desc);
                    }.bind(this));
                }

                //searObject : 태넌트아이디, 검색 인풋아이디
                var sSearchObj = {};
                sSearchObj.tanentId = SppUserSessionUtil.getUserInfo().TENANT_ID;
                this.gMatrialDialog.open(sSearchObj);
            },

            vhSupplierCode: function (oEvent) {
                //console.log("change1:" + oEvent.oSource.getProperty("selectedKey"));
                that.sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;
                var generalInfoModel = this.getModel("generalInfoList");
                if (!this.gSupplierDialog) {
                    this.gSupplierDialog = new SupplierDialog({
                        title: "Choose Supplier",
                        multiSelection: false,
                        items: {
                            filters: [
                                new Filter("tenant_id", "EQ", SppUserSessionUtil.getUserInfo().TENANT_ID)
                            ]
                        }
                    });

                    this.gSupplierDialog.attachEvent("apply", function (oEvent) {
                        //console.log("달라지기 있기 없기 sPath:" + that.sPath);
                        //console.log("oEvent 여기는 팝업에 내려오는곳 : ", oEvent.mParameters.item.material_code);
                        generalInfoModel.setProperty(that.sPath + "/supplier_code", oEvent.mParameters.item.supplier_code);
                        generalInfoModel.setProperty(that.sPath + "/supplier_local_name", oEvent.mParameters.item.supplier_local_name);
                        generalInfoModel.setProperty(that.sPath + "/supplier_english_name", oEvent.mParameters.item.supplier_english_name);
                    }.bind(this));
                }

                //searObject : 태넌트아이디, 검색 인풋아이디
                var sSearchObj = {};
                sSearchObj.tanentId = SppUserSessionUtil.getUserInfo().TENANT_ID;
                this.gSupplierDialog.open(sSearchObj);
            },

            vhVendorPoolCode: function (oEvent) {
                console.log("change1:" + oEvent.oSource.getProperty("selectedKey"));
                that.sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;
                var generalInfoModel = this.getModel("generalInfoList");
                if (!this.gVendorPoolDialog) {
                    this.gVendorPoolDialog = new VendorPoolDialog({
                        title: "Choose Supplier",
                        multiSelection: false,
                        items: {
                            filters: [
                                new Filter("tenant_id", "EQ", SppUserSessionUtil.getUserInfo().TENANT_ID)
                            ]
                        }
                    });

                    this.gVendorPoolDialog.attachEvent("apply", function (oEvent) {
                        //console.log("달라지기 있기 없기 sPath:" + that.sPath);
                        //console.log("oEvent 여기는 팝업에 내려오는곳 : ", oEvent.mParameters.item.material_code);
                        generalInfoModel.setProperty(that.sPath + "/vendor_pool_code", oEvent.mParameters.item.vendor_pool_code);
                        generalInfoModel.setProperty(that.sPath + "/vendor_pool_local_name", oEvent.mParameters.item.vendor_pool_local_name);
                    }.bind(this));
                }

                //searObject : 태넌트아이디, 검색 인풋아이디
                var sSearchObj = {};
                sSearchObj.tanentId = SppUserSessionUtil.getUserInfo().TENANT_ID;
                this.gVendorPoolDialog.open(sSearchObj);
            },

            /*========================================= ValueHelp : End ===============================*/

            // onSetStatus: function (sStatusCodeParam) {
            //     var oRootModel = this.getModel("rootModel");

            //     if (oRootModel) {
            //         var aProcessList = oRootModel.getProperty("/processList");
            //         var sReturnValue = aProcessList[0].code_name;

            //         if (sStatusCodeParam === "20") {
            //             sReturnValue = aProcessList[1].code_name;
            //         } else if (sStatusCodeParam === "30") {
            //             sReturnValue = aProcessList[2].code_name;
            //         }
            //     }

            //     return sReturnValue;
            // },

            fnChkEndDate: function(oEvent) {
                var generalInfoModel = this.getModel("generalInfoList");
                that.sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;
                if (new Date(generalInfoModel.getProperty(that.sPath + "/effective_start_date")) > new Date(generalInfoModel.getProperty(that.sPath + "/effective_end_date"))) {
                    generalInfoModel.setProperty(that.sPath + "/effective_end_date", null);
                    MessageToast.show("유효 종료일자가 적합하지 않습니다.");
                }
            },

            /**
             * 수정모드 변경
             */
            onEditToggle: function (flag) {
                var oDetailViewModel = this.getModel("detailViewModel");
                oDetailViewModel.setProperty("/viewMode", flag);
            },

            onApproverAdd: function (oParam) {
                //console.log("//// onApproverAdd", oParam);
                var approver = this.getView().getModel("approver");
                approver.addRecord({
                    "tenant_id": this.tenant_id,
                    "approval_number": this.approval_number,
                    "approve_sequence": "",
                    "approver_type_code": "",
                    "approver_empno": "",
                    "approver_name": "",
                    "selRow": true,
                }, "/Approvers", oParam); // 드래그가 도착한 위치에 내가 선택한 아이템  담기 
                this.setOrderByApproval();
                this.setSelectedApproval(String(Number(oParam) + 1));
            },

            // 삭제 
            setApproverRemoveRow: function (oParam) {
                var oModel = this.getModel("approver");
                oModel.removeRecord(oParam - 1);
                this.setOrderByApproval();
            },
            // 시퀀스 정렬 
            setOrderByApproval: function () {
                var approver = this.getModel("approver");
                for (var i = 0; i < approver.getData().Approvers.length; i++) {
                    approver.getData().Approvers[i].approve_sequence = String(i + 1);
                }
                this.getModel("approver").refresh(true);
            },
            // 선택행 플래그 정리  
            setSelectedApproval: function (row) {
                var approver = this.getModel("approver");
                for (var i = 0; i < approver.getData().Approvers.length; i++) {
                    if (row == approver.getData().Approvers[i].approve_sequence) {
                        approver.getData().Approvers[i].selRow = true;
                    } else {
                        approver.getData().Approvers[i].selRow = false;
                    }
                }
                //console.log(" setSelectedApproval ", approver);
                this.getModel("approver").refresh(true);
            },

            /**
             * Editor 상태 및 값 세팅
             */
            _setEditorStatusAndValue: function (sApprovalStatusCodeParam, sApprovalRequestDescParam) {
                var bEditor = true;
                var oEditor = sap.ui.getCore().byId(this.getView().getId() + "myRTE");
                sApprovalRequestDescParam = sApprovalRequestDescParam || "";

                // 상태가 Draft가 아닐 경우 Editor editable false
                if (sApprovalStatusCodeParam !== "10") {
                    bEditor = false;
                }

                oEditor.setEditable(bEditor);
                oEditor.setValue(sApprovalRequestDescParam);
            },

            /**
             * 편집기(Editor) 창 세팅
             */
            setRichEditor: function () {
                var that = this,
                    sHtmlValue = ''
                sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
                    function (RTE, EditorType) {
                        var oRichTextEditor = new RTE(that.getView().getId() + "myRTE", {
                            editorType: EditorType.TinyMCE4,
                            width: "100%",
                            height: "200px",
                            customToolbar: true,
                            showGroupFont: true,
                            showGroupLink: true,
                            showGroupInsert: true,
                            value: sHtmlValue,
                            ready: function () {
                                this.addButtonGroup("styleselect").addButtonGroup("table");
                            }
                        });

                        that.getView().byId("idVerticalLayout").addContent(oRichTextEditor);
                    });
            },

            /**
             * 리턴 데이터 화면에 맞게 변경
             */
            _returnDataRearrange: function (oDataParam) {
                var oMaster = oDataParam;
                var aDetails = oMaster.details.results;
                var iDetailsLen = aDetails.length;

                for (var i = 0; i < iDetailsLen; i++) {
                    var oDetail = aDetails[i];
                    oDetail.prices = oDetail.prices.results;

                    oDetail.purOrg = this.getModel("rootModel").getProperty("/purOrg/" + oDetail.company_code);
                }

                oMaster.details = aDetails;

                return oMaster;
            },

            /*========================================= BasePrice Action : Start ===============================*/

            /**
             * Base Price 라인 추가
             */
            onAddGeneralInfo: function () {
                var generalInfoModel = this.getModel("generalInfoList");
                generalInfoModel.addRecord({
                    "_row_state_": "C",
                    "tenant_id": this.tenant_id,
                    "selRow": true,
                }, "/GeneralView", 0); // 드래그가 도착한 위치에 내가 선택한 아이템  담기 

                generalInfoModel.refresh();
            },

            /**
             * detail 선택 데이터 체크
             */
            onRowSelectionChange: function (oEvent) {
                var generalInfoModel = this.getModel("generalInfoList"),
                    oParameters = oEvent.getParameters(),
                    bSelectAll = !!oParameters.selectAll;

                // 전체 선택일 경우
                if (bSelectAll || oParameters.rowIndex === -1) {
                    var aDetails = generalInfoModel.getProperty("/GeneralView");
                    aDetails.forEach(function (oDetail) {
                        oDetail.checked = bSelectAll;
                    });
                } else {// 단독 선택일 경우
                    var oDetail = generalInfoModel.getProperty(oParameters.rowContext.getPath());
                    oDetail.checked = !oDetail.checked;
                }
            },

            /**
             * 체크된 detail 데이터 삭제
             */
            onDeleteGeneralInfo: function () {
                var table = this.byId("generalInfoTbl"),
                    model = this.getModel("generalInfoList");
                table.getSelectedIndices().reverse().forEach(function (idx) {
                    model.markRemoved(idx);
                });
            },

            /*========================================= BasePrice Action : End ===============================*/

            /**
             * key값 추출
             */
            _getMasterKey: function (oDataParam, sTableNameParam) {
                var oKey = {};

                if (sTableNameParam === "Master") {
                    oKey.tenant_id = oDataParam.tenant_id;
                    oKey.approval_number = oDataParam.approval_number;
                }

                return oKey;
            },

            /*========================================= Button Action ===============================*/
            fnAddPrice: function () {
                var chkFlag = true;
                var procObj = {};
                var inDetails = [];

                procObj = {
                    "param": {
                        "tenant_id": SppUserSessionUtil.getUserInfo().TENANT_ID,
                        "language_code": SppUserSessionUtil.getUserInfo().LANGUAGE_CODE,
                        "inDetails": []
                    }
                };

                this.generalInfoList = that.generalInfoTbl.getModel("generalInfoList").getProperty("/GeneralView");
                console.log("generalInfoList : " + this.generalInfoList);
                $(this.generalInfoList).each(function (idx, item) {
                    //console.log("item:" + item);
                    if (!!item.tenant_id && !!item.company_code && !!item.org_type_code && !!item.org_code
                        && !!item.supplier_code && !!item.material_code && !!item.market_code && !!item.currency_code) {
                        var inDetailObj = {};
                        inDetailObj.tenant_id = SppUserSessionUtil.getUserInfo().TENANT_ID;
                        inDetailObj.company_code = item.company_code;
                        inDetailObj.org_type_code = item.org_type_code;
                        inDetailObj.org_code = item.org_code;
                        inDetailObj.approval_number = item.approval_number;
                        inDetailObj.item_sequence = (item.item_sequence === "") ? null : Number(item.item_sequence);
                        inDetailObj.supplier_code = item.supplier_code;
                        inDetailObj.material_code = item.material_code;
                        inDetailObj.market_code = item.market_code;
                        inDetailObj.currency_code = item.currency_code;
                        procObj.param.inDetails.push(inDetailObj);
                    } else {
                        MessageToast.show("필수값이 부족합니다.");
                        chkFlag = false;
                    }
                });

                if (chkFlag) {
                    //procObj.param.inDetails = that.generalInfoList;
                    MessageBox.confirm("Are Add Price Data?", {
                        title: "Comfirmation",
                        initialFocus: sap.m.MessageBox.Action.CANCEL,
                        onClose: function (sButton) {
                            if (sButton === MessageBox.Action.OK) {
                                $.ajax({
                                    url: "srv-api/odata/v4/sp.netpriceApprovalDetailPriceV4Service/ApprovalPriceInfoProc",
                                    type: "POST",
                                    data: JSON.stringify(procObj),
                                    contentType: "application/json",
                                    success: function (data) {
                                        console.log('data:', data);
                                        that.basePriceInfoModel.setProperty("/GeneralView", data.outDetails);
                                        //console.log('data:', data.value[0]);
                                    },
                                    error: function (e) {
                                        var eMessage = "callProcError",
                                            errorType,
                                            eMessageDetail;

                                        if (e.responseJSON.error.message == undefined || e.responseJSON.error.message == null) {
                                            eMessage = "callProcError";
                                            eMessageDetail = "callProcError";
                                        } else {
                                            eMessage = e.responseJSON.error.message.substring(0, 8);
                                            eMessageDetail = e.responseJSON.error.message.substring(9);
                                            errorType = e.responseJSON.error.message.substring(0, 1);
                                            console.log('errorMessage!:', e.responseJSON.error.message.substring(9));

                                        }

                                        MessageToast.show(eMessageDetail);
                                        console.log(eMessageDetail);
                                    }
                                });
                            }
                        }
                    });
                }
            },
            /*========================================= Button Action ===============================*/

            /**
             *  yyyyMMdd 포맷으로 반환
             */
            getFormatDate: function (date) {
                if (date !== undefined && date !== null) {
                    var year = date.getFullYear();              //yyyy
                    var month = (1 + date.getMonth());          //M
                    month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
                    var day = date.getDate();                   //d
                    day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
                    return year + '' + month + '' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
                } else {
                    return null;
                }
            },
            /*========================================= Footer Button Action ===============================*/

            onDraft: function () {
                var procObj = {};
                var generalList = [];
                procObj = {
                    "param": {
                        "master": {
                            "tenant_id": SppUserSessionUtil.getUserInfo().TENANT_ID,
                            "company_code": SppUserSessionUtil.getUserInfo().COMPANY_CODE,
                            "approval_number": (that.byId("approval_number").getText() === "N/A") ? null : String(that.byId("approval_number").getText()),				/* 없으면 Insert (undefined, null, ''), 존재하면 Update*/
                            "approval_title": that.byId("approval_title").getValue(),
                            "approval_contents": that.byId("approval_contents").getValue(),
                            "attch_group_number": "temp00",
                            "net_price_document_type_code": that.byId("net_price_document_type_code").getSelectedKey(),
                            "net_price_source_code": that.byId("net_price_source_code").getSelectedKey(),
                            "buyer_empno": SppUserSessionUtil.getUserInfo().EMPLOYEE_NUMBER,
                            "tentprc_flag": true
                        },
                        "general": [
                            // {
                            //     "item_sequence"                    : 1             /* (_row_state_ 값에 따라) [C] 불필요, [U,D] 는 필수 */
                            //     ,"line_type_code"                  : "lineType"
                            //     ,"material_code"                   : "material" 
                            //     ,"payterms_code"                   : "payterms"
                            //     ,"supplier_code"                   : "supplier"
                            //     ,"effective_start_date"            : null
                            //     ,"effective_end_date"              : null
                            //     ,"surrogate_type_code"             : "surrogate"
                            //     ,"currency_code"                   : "KRW"
                            //     ,"net_price"                       : 100
                            //     ,"vendor_pool_code"                : "VPCODE"
                            //     ,"market_code"                     : "market"
                            //     ,"net_price_approval_reason_code"  : "reason"
                            //     ,"maker_code"                      : "maker"
                            //     ,"incoterms"                       : "ico"
                            //     ,"_row_state_"                     : "C"		     /* C, U, D */
                            // }
                        ]
                    }
                }

                MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
                    title: "Comfirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            this.generalInfoList = that.generalInfoTbl.getModel("generalInfoList").getProperty("/GeneralView");
                            console.log("generalInfoList : " + this.generalInfoList);

                            $(this.generalInfoList).each(function (idx, item) {
                                var generalInfoObj = {};
                                generalInfoObj.item_sequence = Number(item.item_sequence);
                                //generalInfoObj.company_code = SppUserSessionUtil.getUserInfo().COMPANY_CODE;
                                generalInfoObj.org_code = item.org_code;
                                generalInfoObj.line_type_code = item.line_type_code;
                                generalInfoObj.material_code = item.material_code;
                                generalInfoObj.payterms_code = item.payterms_code;
                                generalInfoObj.supplier_code = item.supplier_code;
                                generalInfoObj.effective_start_date = that.getFormatDate(item.effective_start_date);
                                generalInfoObj.effective_end_date = that.getFormatDate(item.effective_end_date);
                                generalInfoObj.surrogate_type_code = item.surrogate_type_code;
                                generalInfoObj.currency_code = item.currency_code;
                                generalInfoObj.net_price = parseFloat(item.net_price);
                                generalInfoObj.vendor_pool_code = item.vendor_pool_code;
                                generalInfoObj.market_code = item.market_code;
                                //generalInfoObj.maker_name = item.maker_name;
                                generalInfoObj.net_price_approval_reason_code = item.net_price_approval_reason_code;
                                generalInfoObj.maker_code = item.maker_code;
                                generalInfoObj.incoterms = item.incoterms;
                                generalInfoObj._row_state_ = item._row_state_;
                                procObj.param.general.push(generalInfoObj);
                            });

                            $.ajax({
                                url: "srv-api/odata/v4/sp.netpriceApprovalDetailV4Service/ApprovalSaveProc",
                                type: "POST",
                                data: JSON.stringify(procObj),
                                contentType: "application/json",
                                success: function (data) {
                                    console.log('data:', data);
                                    //console.log('data:', data.value[0]);
                                    MessageToast.show(that.getModel("I18N").getText("/NOP00038"));
                                    var paramObj = {};
                                    paramObj.pMode = "R";
                                    paramObj.pAppNum = data.approval_number;
                                    that.fnLoadData(paramObj);
                                },
                                error: function (e) {
                                    var eMessage = "callProcError",
                                        errorType,
                                        eMessageDetail;

                                    if (e.responseJSON.error.message == undefined || e.responseJSON.error.message == null) {
                                        eMessage = "callProcError";
                                        eMessageDetail = "callProcError";
                                    } else {
                                        eMessage = e.responseJSON.error.message.substring(0, 8);
                                        eMessageDetail = e.responseJSON.error.message.substring(9);
                                        errorType = e.responseJSON.error.message.substring(0, 1);
                                        console.log('errorMessage!:', e.responseJSON.error.message.substring(9));

                                    }

                                    MessageToast.show(eMessageDetail);
                                    console.log(eMessageDetail);
                                }
                            });
                        }
                    }
                });
            },

            /**
             * 삭제
             */
            onDelete: function () {
                MessageBox.confirm(this.getModel("I18N").getText("/NCM00003"), {
                    title: "Comfirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            var procObj = {
                                "param": {
                                    "tenant_id": SppUserSessionUtil.getUserInfo().TENANT_ID,
                                    "approval_number": that.pAppNum
                                }
                            };

                            $.ajax({
                                url: "srv-api/odata/v4/sp.netpriceApprovalDetailV4Service/ApprovalDeleteProc",
                                type: "POST",
                                data: JSON.stringify(procObj),
                                contentType: "application/json",
                                success: function (data) {
                                    //console.log('data:', data);
                                    MessageToast.show(this.getModel("I18N").getText("/NCM00003"));
                                    that.getRouter().navTo("NetPriceMgtList");
                                },
                                error: function (e) {
                                    var eMessage = "callProcError",
                                        errorType,
                                        eMessageDetail;

                                    if (e.responseJSON.error.message == undefined || e.responseJSON.error.message == null) {
                                        eMessage = "callProcError";
                                        eMessageDetail = "callProcError";
                                    } else {
                                        eMessage = e.responseJSON.error.message.substring(0, 8);
                                        eMessageDetail = e.responseJSON.error.message.substring(9);
                                        errorType = e.responseJSON.error.message.substring(0, 1);
                                        console.log('errorMessage!:', e.responseJSON.error.message.substring(9));

                                    }

                                    MessageToast.show(eMessageDetail);
                                    console.log(eMessageDetail);
                                }
                            });
                        }
                    }
                });
            },

            onChangeStatus: function (status, msg) {
                MessageBox.confirm(msg, {
                    title: "Comfirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            var procObj = {
                                "param": {
                                    "tenant_id": SppUserSessionUtil.getUserInfo().TENANT_ID,
                                    "approval_number": that.pAppNum,
                                    "approve_status_code": status
                                }
                            };

                            $.ajax({
                                url: "srv-api/odata/v4/sp.netpriceApprovalDetailV4Service/ApprovalStatusChangeProc",
                                type: "POST",
                                data: JSON.stringify(procObj),
                                contentType: "application/json",
                                success: function (data) {
                                    //console.log('data:', data);
                                    MessageToast.show(that.getModel("I18N").getText("/NOP00038"));
                                    var paramObj = {};
                                    paramObj.pMode = "R";
                                    paramObj.pAppNum = data.approval_number;
                                    that.fnLoadData(paramObj);
                                },
                                error: function (e) {
                                    var eMessage = "callProcError",
                                        errorType,
                                        eMessageDetail;

                                    if (e.responseJSON.error.message == undefined || e.responseJSON.error.message == null) {
                                        eMessage = "callProcError";
                                        eMessageDetail = "callProcError";
                                    } else {
                                        eMessage = e.responseJSON.error.message.substring(0, 8);
                                        eMessageDetail = e.responseJSON.error.message.substring(9);
                                        errorType = e.responseJSON.error.message.substring(0, 1);
                                        console.log('errorMessage!:', e.responseJSON.error.message.substring(9));

                                    }

                                    MessageToast.show(eMessageDetail);
                                    console.log(eMessageDetail);
                                }
                            });
                        }
                    }
                });
            },

            /**
             * 상신
             */
            onRequest: function () {
                this.onChangeStatus("AR", this.getModel("I18N").getText("/NSP00105"));
            },

            /*승인요청 버튼 */
            onApprove: function () {
                this.onChangeStatus("AP", this.getModel("I18N").getText("/NSP00104"));
            },

            /*반려 버튼 */
            onReject: function () {
                this.onChangeStatus("RJ", this.getModel("I18N").getText("/NSP00106"));
            },

            /*취소 버튼 */
            onCancel: function () {
                //this.onChangeStatus("");
            },

            /**
             * List 화면으로 이동
             */
            onBack: function () {
                var oRootModel = this.getModel("rootModel");
                oRootModel.setProperty("/selectedData", null);

                this.getRouter().navTo("NetPriceMgtList");
            },

            onDeveloping: function () {
                MessageBox.information("준비중");
            }

        });
    }
);
