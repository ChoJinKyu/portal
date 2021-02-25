sap.ui.define([
    "./App.controller",
    //"ext/lib/util/SppUserSessionUtil",
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
    "ext/lib/util/UUID"
],
    function (
        BaseController,
        //SppUserSessionUtil,
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
        MakerDialog,
        UUID
    ) {
        "use strict";

        var sSelectedDialogPath, sTenantId, oOpenDialog;
        var that;
        return BaseController.extend("sp.np.netPriceMgt.controller.BasePriceDetail", {
            dateFormatter: DateFormatter,
            formatter: Formatter,
            validator: new Validator(),

            /*========================================= Init : Start ===============================*/

            onInit: function () {
                that = this;
                // Router설정. Detail 화면이 호출될 때마다 _getBasePriceDetail 함수 호출
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("NetPriceMgtDetail").attachPatternMatched(this._onRoutedThisPage, this);

                this.getView().setModel(new ManagedListModel(), "approver");
                this.setModel(new JSONModel(), "detailModel");
                this.setModel(new JSONModel({viewMode: true}), "detailViewModel");

                //마스터정보
                //this.setModel(new JSONModel(), "masterInfoList");
                //일반정보 리스트, 기준단가목록 같이 사용할수 없어서 나눔
                //this.setModel(new ManagedListModel(), "generalInfoList");
                //this.setModel(new ManagedListModel(), "basePriceInfoList");
                //협상이력
                //this.setModel(new ManagedListModel(), "negotitaionList");
            },

            /**
             * Base Price Detail 데이터 조회
            */
            _onRoutedThisPage: function (oEvent) {
                //푸터 버튼 초기화
                this.fnLoadData(oEvent.getParameter("arguments"));
            },
            /*========================================= Init : End ===============================*/
            fnBtnCtrlClear: function() {
                //console.log("버튼 초기화!!");
                that.byId("draftBtn").setVisible(false);
                that.byId("deleteBtn").setVisible(false);
                that.byId("requestBtn").setVisible(false);
                that.byId("approveBtn").setVisible(false);
                that.byId("rejectBtn").setVisible(false);
                //that.byId("editBtn").setVisible(false);
            },

            fnBtnCtrl: function (approveStatus) {
                console.log("approveStatus:" + approveStatus);
                var oDetailViewModel = this.getModel("detailViewModel");
                console.log("detailViewModel::::" + oDetailViewModel.getProperty("/viewMode"));
                switch (approveStatus) {
                    case "DR":
                        //that.byId("editBtn").setVisible(true);
                        that.byId("draftBtn").setVisible(true);
                        that.byId("deleteBtn").setVisible(true);
                        that.byId("requestBtn").setVisible(true);
                        //oDetailViewModel.setProperty("/viewMode", true);
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
                        //console.log("너왜 않나와");
                        that.byId("draftBtn").setVisible(true);
                        break;
                }
            },

            fnUploadLoadData: function() {
                var fileGroupId;
                if (this.pMode === "C") {
                    fileGroupId = UUID.randomUUID();
                } else {
                    fileGroupId = this.fileGroupId;
                }
                var oFragmentController = sap.ui.controller("ext.lib.upload/UploadCollection");

                sap.ui.require(["sap/ui/core/Fragment"], function(Fragment){
                    Fragment.load({
                        name: "ext.lib.upload/UploadCollection",
                        controller: oFragmentController
                    }).then(function(oFragmentUploadCollection){
                        that.getView().byId("attachPanel").addContent(oFragmentUploadCollection);
                        
                        var initParam = {
                            /* fileGroupId : UUID.randomUUID(),  // 신규일경우 */
                            fileGroupId : "098239879832998", /* 기 저장된 데이터가 있을 경우 */
                            oUploadCollection : oFragmentUploadCollection
                        };

                        oFragmentController.onInit(initParam);

                    });
                });
            },

            /*========================================= oData : Start ===============================*/
            fnLoadData: function (args) {
                var oView = this.getView();
                this.pAppNum = args.pAppNum;
                this.pMode = args.pMode;
                this.generalInfoTbl = this.byId("generalInfoTbl");
                var oRootModel = this.getModel("rootModel");
                var oDetailModel = this.getModel("detailModel");
                //var generalInfoModel = this.getModel("generalInfoList");
                //this.basePriceInfoModel = this.getModel("basePriceInfoList");
                var oDetailViewModel = this.getModel("detailViewModel");
                //var oApproverModel = this.getModel("approver");
                //generalInfoModel.setProperty("/entityName", "GeneralView");
                //generalInfoModel.setProperty("/GeneralView", null);
                //this.basePriceInfoModel.setProperty("/entityName", "GeneralView");
                //this.basePriceInfoModel.setProperty("/GeneralView", null);

                //this.onRichTextEditorRendering();

                // Approval Line 초기화 시작
                //oApproverModel.setProperty("/entityName", "Approvers");
                //oApproverModel.setProperty("/Approvers", null);
                this.fnBtnCtrlClear();
                var oReferMulti = this.byId("referMulti");

                if (oReferMulti) {
                    oReferMulti.removeAllTokens();
                }
                // Approval Line 초기화 끝

                // 리스트 또는 품의진행상태조회에서 선택해서 넘어오는 경우

                if (args.pMode === "R") {
                    oDetailModel.setData({});
                    oDetailViewModel.setProperty("/viewMode", true);

                    var aMasterFilters = [];
                    aMasterFilters.push(new Filter("tenant_id", FilterOperator.EQ, "L2100"));
                    aMasterFilters.push(new Filter("approval_number", FilterOperator.EQ, that.pAppNum));

                    oView.setBusy(true);

                    // Master 조회
                    this._readData("detail", "/MasterView", aMasterFilters, {}, function (data) {
                        console.log("MasterView:", data);
                        if (data.results.length > 0) {
                            var result = data.results[0];

                            var oNewBasePriceData = {
                                "tenant_d": "L2100",
                                "approval_number": result.approval_number,
                                "approval_title": result.approval_title,
                                "approval_contents": decodeURIComponent(escape(result.approval_contents)),
                                "approval_status_code": result.approve_status_code,
                                "approval_status_name": result.approve_status_name,
                                "requestor_empno": result.requestor_empnm,
                                "request_date": this.getOwnerComponent()._changeDateString(oToday),
                                "net_price_document_type_code": result.net_price_document_type_code,
                                "net_price_document_type_name": result.net_price_document_type_name,
                                "net_price_source_code": result.net_price_source_code,
                                "net_price_source_name": result.net_price_source_name,
                                "net_price_type_code": result.net_price_type_code
                            };
                            oDetailModel.setData(oNewBasePriceData);
                            oDetailModel.refresh(true);
                            //버튼 컨트롤
                            that.fnBtnCtrl(result.approve_status_code);
                            //업로드영역 컨트롤
                            this.fileGroupId = (result.attch_group_number === null) ? UUID.randomUUID() : result.attch_group_number;
                            that.fnUploadLoadData();

                            that._readData("detail", "/GeneralView", aMasterFilters, {}, function (data) {
                                console.log("GeneralView::", data);
                                oDetailModel.setProperty("/GeneralView", data.results);
                                //generalInfoModel.setProperty("/GeneralView", data.results);
                            }.bind(this));

                            oView.setBusy(false);
                        } else {
                            oView.setBusy(false);
                        }
                    }.bind(this));
                } else {// Create 버튼으로 넘어오는 경우
                    // 기준단가 기본 데이터 세팅
                    var oToday = new Date();
                    var oNewBasePriceData = {
                        "tenant_id": "L2100",
                        "approval_number": "N/A",
                        "approval_title": "",
                        "approval_status_code": "DR",    // DR: Draft
                        "approval_status_name": oRootModel.getProperty("/processList/0/code_name"),
                        "requestor_empno": "00000",
                        "request_date": this.getOwnerComponent()._changeDateString(oToday),
                        "GeneralView": []
                    };
                    oDetailModel.setData(oNewBasePriceData);
                    oDetailViewModel.setProperty("/detailsLength", 0);
                    //oDetailViewModel.setProperty("/viewMode", true);

                    // 저장된 Approver가 없는 경우 Line 추가
                    this.onApproverAdd(0);
                    //버튼 컨트롤
                    that.fnBtnCtrl("CR");
                    //업로드영역 컨트롤
                    that.fnUploadLoadData();
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
                var oDetailModel = this.getModel("detailModel");

                if (!this.oMakerCodeDialog) {
                    this.oMakerCodeDialog = new MakerDialog({
                        multiSelection: false
                    });

                    this.oMakerCodeDialog.attachEvent("apply", function (oEvent) {
                        oDetailModel.setProperty(that.sPath + "/maker_code", oEvent.mParameters.item.maker_code);
                        oDetailModel.setProperty(that.sPath + "/maker_name", oEvent.mParameters.item.maker_local_name);
                    }.bind(this));
                }
                this.oMakerCodeDialog.open();
            },

            vhMaterialOrgCode: function (oEvent) {
                that.sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;
                var oPurOrgModel = this.getModel("purOrg");
                var oRootModel = this.getModel("rootModel");
                var oDetailModel = this.getModel("detailModel");

                var aPurOrgFilter = [new Filter("tenant_id", FilterOperator.EQ, "L2100")];
                oPurOrgModel.read("/Pur_Operation_Org", {
                    filters: aPurOrgFilter,
                    success: function (data) {
                        if (data && data.results) {
                            var aResults = data.results;
                            var aCompoany = [];
                            var oPurOrg = {};

                            for (var i = 0; i < aResults.length; i++) {
                                var oResult = aResults[i];
                                if (-1 === aCompoany.indexOf(oResult.company_code)) {
                                    aCompoany.push(oResult.company_code);
                                    oPurOrg[oResult.company_code] = [];
                                }

                                oPurOrg[oResult.company_code].push({ org_code: oResult.org_code, org_name: oResult.org_name });
                            }

                            oRootModel.setProperty("/purOrg", oPurOrg);

                            if (!that.oSearchMultiMaterialMasterDialog) {
                                that.oSearchMultiMaterialMasterDialog = new MaterialOrgDialog({
                                    title: "Choose Material Code",
                                    multiSelection: false,
                                    companyCode: "LGCKR",
                                    purOrg: oRootModel.getProperty("/purOrg"),
                                    tenantId: "L2100"
                                });
                                that.oSearchMultiMaterialMasterDialog.attachEvent("apply", function (oEvent) {
                                    console.log("apply event!!!");
                                    //oViewModel.refresh();
                                    oDetailModel.setProperty(that.sPath + "/company_code", oEvent.mParameters.item.company_code);
                                    oDetailModel.setProperty(that.sPath + "/org_code", oEvent.mParameters.item.org_code);
                                    oDetailModel.setProperty(that.sPath + "/material_code", oEvent.mParameters.item.material_code);
                                    oDetailModel.setProperty(that.sPath + "/material_desc", oEvent.mParameters.item.material_desc);
                                    oDetailModel.setProperty(that.sPath + "/uom", oEvent.mParameters.item.base_uom_code);
                                }.bind(that));
                            }
                            that.oSearchMultiMaterialMasterDialog.open();

                        }
                    },
                    error: function (data) {
                        console.log("error", data);
                    }
                });
            },

            vhMaterialCode: function (oEvent) {
                //console.log("change1:" + oEvent.oSource.getProperty("selectedKey"));
                that.sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;
                var oDetailModel = this.getModel("detailModel");

                if (!this.gMatrialDialog) {
                    this.gMatrialDialog = new MatrialDialog({
                        title: "Choose Material",
                        multiSelection: false,
                        items: {
                            filters: [
                                new Filter("tenant_id", "EQ", "L2100")
                            ]
                        }
                    });

                    this.gMatrialDialog.attachEvent("apply", function (oEvent) {
                        //console.log("oEvent 여기는 팝업에 내려오는곳 : ", oEvent.mParameters.item.material_code);
                        oDetailModel.setProperty(that.sPath + "/material_code", oEvent.mParameters.item.material_code);
                        oDetailModel.setProperty(that.sPath + "/material_desc", oEvent.mParameters.item.material_desc);
                    }.bind(this));
                }

                //searObject : 태넌트아이디, 검색 인풋아이디
                var sSearchObj = {};
                sSearchObj.tanentId = "L2100";
                this.gMatrialDialog.open(sSearchObj);
            },

            vhSupplierCode: function (oEvent) {
                //console.log("change1:" + oEvent.oSource.getProperty("selectedKey"));
                that.sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;
                var oDetailModel = this.getModel("detailModel");
                if (!this.gSupplierDialog) {
                    this.gSupplierDialog = new SupplierDialog({
                        title: "Choose Supplier",
                        multiSelection: false,
                        items: {
                            filters: [
                                new Filter("tenant_id", "EQ", "L2100")
                            ]
                        }
                    });

                    this.gSupplierDialog.attachEvent("apply", function (oEvent) {
                        //console.log("달라지기 있기 없기 sPath:" + that.sPath);
                        //console.log("oEvent 여기는 팝업에 내려오는곳 : ", oEvent.mParameters.item.material_code);
                        oDetailModel.setProperty(that.sPath + "/supplier_code", oEvent.mParameters.item.supplier_code);
                        oDetailModel.setProperty(that.sPath + "/supplier_local_name", oEvent.mParameters.item.supplier_local_name);
                        oDetailModel.setProperty(that.sPath + "/supplier_english_name", oEvent.mParameters.item.supplier_english_name);
                    }.bind(this));
                }

                //searObject : 태넌트아이디, 검색 인풋아이디
                var sSearchObj = {};
                sSearchObj.tanentId = "L2100";
                this.gSupplierDialog.open(sSearchObj);
            },

            vhVendorPoolCodePop: function (oEvent) {
                that.sPath = oEvent.getSource();
                if (!this.gVendorPoolDialog) {
                    this.gVendorPoolDialog = new VendorPoolDialog({
                        title: "Choose VendorPool",
                        multiSelection: false,
                        items: {
                            filters: [
                                new Filter("tenant_id", "EQ", "L2100")
                            ]
                        }
                    });

                    this.gVendorPoolDialog.attachEvent("apply", function (oEvent) {
                        //console.log("달라지기 있기 없기 sPath:" + that.sPath);
                        console.log("oEvent 여기는 팝업에 내려오는곳 : ", oEvent.mParameters.item);
                        that.sPath.setValue(null);
                        that.sPath.setValue(oEvent.mParameters.item.vendor_pool_code);
                        
                    }.bind(this));
                }

                //searObject : 태넌트아이디, 검색 인풋아이디
                var sSearchObj = {};
                sSearchObj.tanentId = "L2100";
                this.gVendorPoolDialog.open(sSearchObj);
            },

            vhVendorPoolCode: function (oEvent) {
                //console.log("change1:" + oEvent.oSource.getProperty("selectedKey"));
                that.sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;
                var oDetailModel = this.getModel("detailModel");
                if (!this.gVendorPoolDialog) {
                    this.gVendorPoolDialog = new VendorPoolDialog({
                        title: "Choose VendorPool",
                        multiSelection: false,
                        items: {
                            filters: [
                                new Filter("tenant_id", "EQ", "L2100")
                            ]
                        }
                    });

                    this.gVendorPoolDialog.attachEvent("apply", function (oEvent) {
                        //console.log("달라지기 있기 없기 sPath:" + that.sPath);
                        //console.log("oEvent 여기는 팝업에 내려오는곳 : ", oEvent.mParameters.item.material_code);
                        oDetailModel.setProperty(that.sPath + "/vendor_pool_code", oEvent.mParameters.item.vendor_pool_code);
                        oDetailModel.setProperty(that.sPath + "/vendor_pool_local_name", oEvent.mParameters.item.vendor_pool_local_name);
                    }.bind(this));
                }

                //searObject : 태넌트아이디, 검색 인풋아이디
                var sSearchObj = {};
                sSearchObj.tanentId = "L2100";
                this.gVendorPoolDialog.open(sSearchObj);
            },

            /*========================================= ValueHelp : End ===============================*/
            fnChkPriceVal: function(oEvent, path) {
                var oDetailModel = this.getModel("detailModel");
                that.sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;
                var newValue = oEvent.getParameter("newValue");
                console.log(path, newValue.length);

                var _pattern1 = /^\d{25}$/; // 현재 value값이 3자리 숫자이면 . 만 입력가능

                if (_pattern1.test(newValue)) {
                    console.log("더이상 숫자를 입력 할수 없습니다." + newValue.length, newValue.substr(0, newValue.length -1).length);
                    this.setValue = newValue.substr(0, newValue.length-1);
                    console.log(newValue, this.setValue);
                    oDetailModel.setProperty(that.sPath + "/" + path, null);
                    oDetailModel.setProperty(that.sPath + "/" + path, this.setValue);
                    return;
                }
                // 소수점 둘째자리까지만 입력가능
                var _pattern2 = /^\d*[.]\d{6}$/; // 현재 value값이 소수점 둘째짜리 숫자이면 더이상 입력 불가

                if (_pattern2.test(newValue)) {
                    console.log("소수점 5자리 입력가능합니다.");
                    this.setValue = newValue.substr(0, newValue.length-1);
                    console.log(newValue, this.setValue);
                    oDetailModel.setProperty(that.sPath + "/" + path, null);
                    oDetailModel.setProperty(that.sPath + "/" + path, this.setValue);
                    return;
                }  
            },

            fnChkReplaceChange: function (oEvent) {
                console.log("livechange!!");
                //var regex = /[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]/gi;     // 특수문자 제거 (한글 영어 숫자만)
                //var regex = /[^a-zA-Z0-9\s ]/gi;                   // 특수문자 제거 (영어 숫자만)
                //var regex = /[^0-9\s ]/gi;                   // 특수문자 제거 (영어 숫자만)
                var regex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;  //한글 제거 11/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g%^&*()_+|<

                var newValue = oEvent.getParameter("newValue");
                //$(this).val(v.replace(regexp,''));
                if (newValue !== "") {
                    newValue = newValue.replace(regex, "");
                    oEvent.oSource.setValue(null);
                    oEvent.oSource.setValue(newValue);
                }
            },
            
            fnChkEndDate: function (oEvent) {
                var oDetailModel = this.getModel("detailModel");
                that.sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;
                if (oDetailModel.getProperty(that.sPath + "/effective_start_date") !== null && oDetailModel.getProperty(that.sPath + "/effective_end_date") !== null) {
                    if (new Date(oDetailModel.getProperty(that.sPath + "/effective_start_date")) > new Date(oDetailModel.getProperty(that.sPath + "/effective_end_date"))) {
                        oDetailModel.setProperty(that.sPath + "/effective_end_date", null);
                        MessageToast.show("유효 종료일자가 적합하지 않습니다.");
                    }
                }
            },

            onRichTextEditorRendering: function () {
                var that = this;
                var sId = that.getView().getId();
                var oEditor = sap.ui.getCore().byId(sId + "myRTE");

                if (oEditor) {
                    oEditor.destroy();
                }

                setTimeout(function () {
                    sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
                        function (RTE, EditorType) {
                            var oRichTextEditor = new RTE(sId + "myRTE", {
                                editorType: EditorType.TinyMCE4,
                                width: "100%",
                                height: "300px",
                                visible: "{detailViewModel>/viewMode}",
                                customToolbar: true,
                                showGroupFont: true,
                                showGroupLink: true,
                                showGroupInsert: true,
                                value: "{detailModel>/approval_contents}",
                                ready: function () {
                                    this.addButtonGroup("styleselect").addButtonGroup("table");
                                }
                            });
                            that.getView().byId("idVerticalLayout").addContent(oRichTextEditor);
                        });
                }, 1500);
            },

            /**
             * 수정모드 변경
             */
            onEditToggle: function () {
                var oDetailViewModel = this.getModel("detailViewModel");
                oDetailViewModel.setProperty("/viewMode", !oDetailViewModel.getProperty("/viewMode"));
            },

            onApproverAdd: function (oParam) {
                //console.log("//// onApproverAdd", oParam);
                var approver = this.getView().getModel("approver");
                approver.addRecord({
                    "tenant_id": "L2100",
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

            fnAddPrice: function () {
                var chkFlag = true;
                var procObj = {};
                var inDetails = [];
                var oDetailModel = that.getModel("detailModel");
                procObj = {
                    "param": {
                        "tenant_id": "L2100",
                        "language_code": "KO",
                        "inDetails": []
                    }
                };

                this.generalInfoList = oDetailModel.getProperty("/GeneralView");
                console.log("generalInfoList : " + this.generalInfoList);
                $(this.generalInfoList).each(function (idx, item) {
                    //console.log("item:" + item);
                    if (!!item.org_code && !!item.supplier_code && !!item.material_code && !!item.market_code && !!item.currency_code) {
                        var inDetailObj = {};
                        inDetailObj.rowval = Number(idx + 1);
                        inDetailObj.tenant_id = "L2100";
                        inDetailObj.company_code = "LGCKR";
                        //inDetailObj.org_type_code = item.org_type_code;
                        inDetailObj.org_code = item.org_code;
                        inDetailObj.approval_number = item.approval_number;
                        inDetailObj.item_sequence = (item.item_sequence === "") ? null : Number(item.item_sequence);
                        inDetailObj.supplier_code = item.supplier_code;
                        inDetailObj.material_code = item.material_code;
                        inDetailObj.market_code = item.market_code;
                        inDetailObj.net_price = parseFloat(item.net_price);
                        inDetailObj.currency_code = item.currency_code;

                        procObj.param.inDetails.push(inDetailObj);

                    } else {
                        MessageToast.show("필수값이 부족합니다.");
                        chkFlag = false;
                        return false;
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
                                        oDetailModel.setProperty("/BasePriceListView", data.outDetails);
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

            /**
             * Base Price 라인 추가
             */
            onAddGeneralInfo: function () {
                var oDetailModel = this.getModel("detailModel");
                var aDetails = oDetailModel.getProperty("/GeneralView");
                var oDefault = {
                    "_row_state_": "C",
                    "tenant_id": "L2100",
                    "curr_net_price": "0",
                    "currency_code" : ""
                };
                aDetails.unshift(oDefault);
                oDetailModel.refresh();
            },

            /**
             * detail 선택 데이터 체크
             */
            onRowSelectionChange: function (oEvent) {
                var generalInfoModel = this.getModel("detailModel"),
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
            onDeleteGeneralInfo: function (oEvent) {
                var oDetailModel = this.getModel("detailModel"),
                    aDetails = oDetailModel.getProperty("/GeneralView"),
                    oDetailTable = oEvent.getSource().getParent().getParent();

                for (var i = aDetails.length-1; 0 <= i; i--) {
                    if (aDetails[i].checked) {
                        aDetails.splice(i, 1);
                    }
                }

                oDetailModel.refresh();
                oDetailTable.clearSelection();
            },

            //N2팝업 시작
            onBasePriceCreatePress: function () {
                if (!this._BasePriceCreateDialog) {
                    var fragmentId = this.getView().createId("SimpleChangeDialog");
                    this._BasePriceCreateDialog = sap.ui.xmlfragment(fragmentId, "sp.np.netPriceMgt.view.NetPriceMgtBasePriceCreatePop", this);
                    this.getView().addDependent(this._BasePriceCreateDialog);
                    this._BasePriceCreateTable = sap.ui.core.Fragment.byId(fragmentId, "basePriceCreatePopTable");
                }
                this._BasePriceCreateDialog.open();
            },

            onBasePriceCreateAddPress: function() {
                //this._BasePriceCreateTable
            },

            onBasePriceCreateDelPress: function() {
                //this._BasePriceCreateTable
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

            /*========================================= On Change Action : Start ===============================*/
            /** Simple Change Start  **/
            onSimpleChangePress: function () {
                var selectedIndices = this.getView().byId("generalInfoTbl").getSelectedIndices();
                if (selectedIndices.length > 0) {
                    if (!this._SimpleChangeDialog) {
                        var fragmentId = this.getView().createId("SimpleChangeDialog");
                        this._SimpleChangeDialog = sap.ui.xmlfragment(fragmentId, "sp.np.netPriceMgt.view.SimpleChangeDialog", this);
                        this.getView().addDependent(this._SimpleChangeDialog);
                        this._SimpleChangeTable = sap.ui.core.Fragment.byId(fragmentId, "simpleChangeTable");
                    }
                    this._SimpleChangeDialog.open();
                } else {
                    MessageBox.confirm("추가할 항목을 선택하세요.", {
                        initialFocus: sap.m.MessageBox.Action.CANCEL,
                        onClose: function (sButton) {

                        }
                    });
                }
            },

            onPressSimpleChangeDialogClose: function () {
                //this._SimpleChangeDialog.close();
                this._SimpleChangeDialog.destroy();
                delete this._SimpleChangeDialog;
            },

            onPressSimpleChangeDialogSave: function () {
                var oSelectedItems = this._SimpleChangeTable.getSelectedItems();
                var oDetailModel = this.getModel("detailModel");
                //console.log(" - -- - - onPressSimpleChangeDialogSave - - - - ")
                //console.log(oSelectedItems);
                
                // oSelectedItems.forEach(element => {
                //     console.log( element );
                // });

                if (oSelectedItems.length > 0) {
                    var selectedIndices = this.getView().byId("generalInfoTbl").getSelectedIndices();
                    if (selectedIndices.length > 0) {
                        var oItems = oDetailModel.getData().GeneralView;
                        
                        var getSimpleChangObj = {};
                        for (var i = 0; i < selectedIndices.length; i++) {
                            //console.log(oItems[i]);

                            oSelectedItems.forEach(element => {
                                //console.log(element);
                                if (element.getCells()[1].sId.indexOf("venderPoolPop") != -1 && element.getCells()[1].getValue() !== "") {
                                    oItems[selectedIndices[i]].vendor_pool_code = element.getCells()[1].getValue();
                                }
                                
                                if (element.getCells()[1].sId.indexOf("marketCodePop") != -1 && element.getCells()[1].getValue() !== "") {
                                    oItems[selectedIndices[i]].market_code = element.getCells()[1].getSelectedKey();
                                }
                                
                                if (element.getCells()[1].sId.indexOf("netPricePop") != -1 && element.getCells()[1].getValue() !== "") {
                                    oItems[selectedIndices[i]].net_price_type_code = element.getCells()[1].getSelectedKey();
                                }
                                
                                if (element.getCells()[1].sId.indexOf("effStartDatePop") != -1 && element.getCells()[1].getValue() !== "") {
                                    oItems[selectedIndices[i]].effective_start_date = new Date(element.getCells()[1].getValue());
                                }
                                
                                if (element.getCells()[1].sId.indexOf("effEndDatePop") != -1 && element.getCells()[1].getValue() !== "") {
                                    oItems[selectedIndices[i]].effective_end_date = new Date(element.getCells()[1].getValue());
                                }
                                
                                if (element.getCells()[1].sId.indexOf("paymentTermPop") != -1 && element.getCells()[1].getValue() !== "") {
                                    oItems[selectedIndices[i]].payterms_code = element.getCells()[1].getSelectedKey();
                                }

                                if (element.getCells()[1].sId.indexOf("incotermsPop") != -1 && element.getCells()[1].getValue() !== "") {
                                    oItems[selectedIndices[i]].incoterms = element.getCells()[1].getSelectedKey();
                                }
                            });
                            //oItems[i].material_code = "234324";
                            //var sId = oSelectedItems[0].getCells()[1].sId;
                        }

                        oDetailModel.refresh();
                        this._SimpleChangeDialog.close();
                    }
                } else {
                    MessageToast.show(this.getModel("I18N").getText("/NPG00016"));
                }
            },

            generalInfoChange: function (oEvent) {
                var oDetailModel = this.getModel("detailModel");
                that.sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;
                oDetailModel.setProperty(that.sPath + oEvent.getSource().getBinding("value").sPath, oEvent.getParameter("value"));
            },
            /*========================================= On Change Action : End ===============================*/

            
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

            numberFormat: function (val) {
                if (val !== null) {
                    return parseFloat(val).toFixed(5);
                }
            },


            /*========================================= Footer Button Action : Start ===============================*/

            fnSave: function (msg, mode) {

                var procObj = {};
                var generalList = [];
                var oDetailModel = this.getModel("detailModel");
                that.generalInfoList = oDetailModel.getProperty("/GeneralView");
                
                if (this.validator.validate(this.byId("detailForm")) !== true) return;
                if (that.generalInfoList === null || that.generalInfoList.length === 0) {
                    MessageToast.show(that.getModel("I18N").getText("/GENERAL_INFO") + " " + that.getModel("I18N").getText("/ECM01002"));
                    return;
                }

                procObj = {
                    "param": {
                        "master": {
                            "tenant_id": "L2100",
                            "company_code": "LGCKR",
                            "approval_number": (that.byId("approval_number").getText() === "N/A") ? null : String(that.byId("approval_number").getText()),				/* 없으면 Insert (undefined, null, ''), 존재하면 Update*/
                            "approval_title": that.byId("approval_title").getValue(),
                            "approval_contents": that.byId("approval_contents").getValue(),
                            "attch_group_number": "temp00",
                            "net_price_document_type_code": that.byId("net_price_document_type_code").getSelectedKey(),
                            "net_price_source_code": that.byId("net_price_source_code").getSelectedKey(),
                            "buyer_empno": "00000"//SppUserSessionUtil.getUserInfo().EMPLOYEE_NUMBER
                        },
                        "general": []
                    }
                }

                if (mode === "AR") {
                    procObj.param.master.approve_status_code = mode;
                }

                MessageBox.confirm(msg, {
                    title: "Comfirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            
                            console.log("generalInfoList : " + that.generalInfoList);

                            $(that.generalInfoList).each(function (idx, item) {
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
                                generalInfoObj.net_price_type_code = item.net_price_type_code;
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
                                    var eMessage = "callProcError";

                                    if (e.responseJSON.error.message == undefined || e.responseJSON.error.message == null) {
                                        eMessage = "callProcError";
                                    } else {
                                        eMessage = e.responseJSON.error.message;
                                    }

                                    MessageToast.show(eMessage);
                                    console.log(eMessage);
                                }
                            });
                        }
                    }
                });
            },

            onDraft: function () {
                this.fnSave(this.getModel("I18N").getText("/NCM00001"));
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
                                    "tenant_id": "L2100",
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
                                    MessageToast.show(that.getModel("I18N").getText("/NCM00003"));
                                    that.getRouter().navTo("NetPriceMgtList");
                                },
                                error: function (e) {
                                    var eMessage = "callProcError";

                                    if (e.responseJSON.error.message == undefined || e.responseJSON.error.message == null) {
                                        eMessage = "callProcError";
                                    } else {
                                        eMessage = e.responseJSON.error.message;

                                    }

                                    MessageToast.show(eMessage);
                                    console.log(eMessage);
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
                                    "tenant_id": "L2100",
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
                                    paramObj.pAppNum = that.pAppNum;
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
                                        eMessage = e.responseJSON.error.message;
                                    }

                                    MessageToast.show(eMessage);
                                    console.log(eMessageDetail);
                                }
                            });
                        }
                    }
                });
            },

            /**
             * 승인요청
             */
            onRequest: function () {
                //this.onChangeStatus("AR", this.getModel("I18N").getText("/NSP00104"));
                this.fnSave(this.getModel("I18N").getText("/NSP00104"), "AR");
            },

            /*승인 버튼 */
            onApprove: function () {
                this.onChangeStatus("AP", this.getModel("I18N").getText("/NSP00105"));
            },

            /*반려 버튼 */
            onReject: function () {
                this.onChangeStatus("RJ", this.getModel("I18N").getText("/NSP00106"));
            },

            /*취소 버튼 */
            onCancel: function () {
                //this.onChangeStatus("");
            },
            /*========================================= Footer Button Action : End ===============================*/


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
            },

            onN2: function() {
                this.getRouter().navTo("NetPriceMgtBasePriceCreate", {
                    "pMode" : "R",
                    "pAppNum":  that.pAppNum
                });
            }
        });
    }
);
