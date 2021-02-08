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
    "dp/util/control/ui/MaterialMasterDialog",
    "ext/pg/util/control/ui/MaterialDialog",
    "ext/pg/util/control/ui/SupplierDialog",
    "ext/pg/util/control/ui/VendorPoolDialog"
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
        MaterialMasterDialog, 
        MatrialDialog,
        SupplierDialog,
        VendorPoolDialog
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
                //일반정보 리스트, 기준단가목록 같이 사용
                this.setModel(new ManagedListModel(), "generalInfoList");
                //협상이력
                this.setModel(new ManagedListModel(), "negotitaionList");
                
                this.netPriceDocumentTypeCode = this.byId("net_price_document_type_code");
                this.netPriceDocumentTypeCode.onAfterRendering = function(oEvent) {
                    console.log("net_price_document_type_code onload!!!!" + oEvent);
                };
                
                //this.setRichEditor();
            },

            /**
             * Base Price Detail 데이터 조회
            */
            _onRoutedThisPage: function (oEvent) {
                var args = oEvent.getParameter("arguments");
                //console.log("pMode", oEvent.getParameter("arguments"));

                var oView = this.getView();
                var oRootModel = this.getModel("rootModel");
                var oDetailModel = this.getModel("detailModel");
                var generalInfoModel = this.getModel("generalInfoList");
                var oDetailViewModel = this.getModel("detailViewModel");
                var oApproverModel = this.getModel("approver");
                generalInfoModel.setProperty("/entityName", "GeneralView");
                generalInfoModel.setProperty("/GeneralView", null);

                oDetailModel.setData({});
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
                    oDetailViewModel.setProperty("/viewMode", false);

                    var aMasterFilters = [];
                    aMasterFilters.push(new Filter("tenant_id", FilterOperator.EQ, SppUserSessionUtil.getUserInfo().TENANT_ID));
                    //aMasterFilters.push(new Filter("language_code", FilterOperator.EQ, "'" + SppUserSessionUtil.getUserInfo().LANGUAGE_CODE + "'"));
                    //aMasterFilters.push(new Filter("approval_number", FilterOperator.EQ, args.pAppNum));
                    aMasterFilters.push(new Filter("approval_number", FilterOperator.EQ, "1"));

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
                                //"approval_type_code": oRootModel.getProperty("/selectedApprovalType"),   // V10: 신규, V20: 변경
                                "approve_status_code": result.approve_status_code,    // DR: Draft
                                "status": oRootModel.getProperty("/processList/0/code_name"),
                                "requestor_empno": result.requestor_empnm,
                                "request_date": this.getOwnerComponent()._changeDateString(oToday),
                                "net_price_document_type_code": result.net_price_document_type_code,
                                "net_price_source_code": result.net_price_source_code,
                                "details": []
                            };
                            oDetailModel.setData(oNewBasePriceData);

                            that._readData("detail", "/GeneralView", aMasterFilters, {}, function (data) {
                                console.log("GeneralView::", data);
                                generalInfoModel.setProperty("/GeneralView", data.results);
                            }.bind(this));

                             
                            oView.setBusy(false);
                        } else {
                            oView.setBusy(false);
                        }

                        oDetailModel.setProperty("/approval_status_code", "10");
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
                        //"approve_status_code": "DR",    // DR: Draft
                        "status": oRootModel.getProperty("/processList/0/code_name"),
                        "requestor_empno": SppUserSessionUtil.getUserInfo().EMPLOYEE_NUMBER,
                        "request_date": this.getOwnerComponent()._changeDateString(oToday),
                        "net_price_document_type_code": result.net_price_document_type_code,
                        "details": []
                    };
                    oDetailModel.setData(oNewBasePriceData);
                    oDetailViewModel.setProperty("/detailsLength", 0);
                    oDetailViewModel.setProperty("/viewMode", true);

                    // 저장된 Approver가 없는 경우 Line 추가
                    this.onApproverAdd(0);
     
                    oDetailModel.setProperty("/approval_status_code", "10");
                    // Process에 표시될 상태 및 아이콘 데이터 세팅
                   // this.onSetProcessFlowStateAndIcon(oDetailViewModel, oNewBasePriceData.approve_status_code);
                }

                // 생성버튼에서 선택한 유형(신규, 변경)의 Fragment 세팅
                //this._setTableFragment(oRootModel.getProperty("/selectedApprovalType"));
            },
            /*========================================= Init : End ===============================*/

            /*========================================= oData : Start ===============================*/
            /**
             * OData 호출
             */
            _readData: function (sModelParam ,sCallUrlParam, aFiltersParam, oUrlParametersParam, fCallbackParam) {
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
            
            cChanged: function() {
                console.log("cChanged!!!");
            },
            
            
            /*========================================= ValueHelp : Start ===============================*/
            vhMaterialCode: function(oEvent) {
                console.log("change1:" + oEvent.oSource.getProperty("selectedKey"));
                that.sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;
                var generalInfoModel = this.getModel("generalInfoList");
                if (!this.gMatrialDialog) {
                    this.gMatrialDialog = new MatrialDialog({
                        title: "Choose Supplier",
                        multiSelection: false,
                        items: {
                            filters: [
                                new Filter("tenant_id", "EQ", "L2100")
                            ]
                        }
                    });

                    this.gMatrialDialog.attachEvent("apply", function (oEvent) {
                        //console.log("달라지기 있기 없기 sPath:" + that.sPath);
                        //console.log("oEvent 여기는 팝업에 내려오는곳 : ", oEvent.mParameters.item.material_code);
                        generalInfoModel.setProperty(that.sPath + "/material_code", oEvent.mParameters.item.material_code);
                    }.bind(this));
                }

                //searObject : 태넌트아이디, 검색 인풋아이디
                var sSearchObj = {};
                sSearchObj.tanentId = SppUserSessionUtil.getUserInfo().TENANT_ID;
                this.gMatrialDialog.open(sSearchObj);
            },

            vhSupplierCode: function(oEvent) {
                console.log("change1:" + oEvent.oSource.getProperty("selectedKey"));
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
                    }.bind(this));
                }

                //searObject : 태넌트아이디, 검색 인풋아이디
                var sSearchObj = {};
                sSearchObj.tanentId = SppUserSessionUtil.getUserInfo().TENANT_ID;
                this.gSupplierDialog.open(sSearchObj);
            },

            vhVendorPoolCode: function(oEvent) {
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
                        generalInfoModel.setProperty(that.sPath + "/vendor_pool_code", oEvent.mParameters.item.supplier_code);
                    }.bind(this));
                }

                //searObject : 태넌트아이디, 검색 인풋아이디
                var sSearchObj = {};
                sSearchObj.tanentId = SppUserSessionUtil.getUserInfo().TENANT_ID;
                this.gVendorPoolDialog.open(sSearchObj);
            },

            /*========================================= ValueHelp : End ===============================*/
            
            onSetStatus: function (sStatusCodeParam) {
                var oRootModel = this.getModel("rootModel");

                if (oRootModel) {
                    var aProcessList = oRootModel.getProperty("/processList");
                    var sReturnValue = aProcessList[0].code_name;

                    if (sStatusCodeParam === "20") {
                        sReturnValue = aProcessList[1].code_name;
                    } else if (sStatusCodeParam === "30") {
                        sReturnValue = aProcessList[2].code_name;
                    }
                }

                return sReturnValue;
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
            onAddBasePrice: function () {
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
            onDeleteBasePrice: function () {
                var table = this.byId("basePriceTbl"),
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
            
            /*========================================= Footer Button Action ===============================*/

            onTmpSave: function() {
                
                // MessageBox.confirm("Are You Save Data?", {
                //     title : "Comfirmation",
                //     initialFocus : sap.m.MessageBox.Action.CANCEL,
                //     onClose : function(sButton) {
                //         if (sButton === MessageBox.Action.OK) {
                            
                //         }
                //     }
                // });

                var procObj = {};
                var generalList = [];
                procObj = {
                    "param" : {
                        "master" : {
                            "tenant_id"                       : SppUserSessionUtil.getUserInfo().TENANT_ID,
                            "company_code"                    : SppUserSessionUtil.getUserInfo().COMPANY_CODE,
                            "org_type_code"                   : "PL",
                            "org_code"                        : "5100",
                            "approval_number"                 : null,				/* 없으면 Insert (undefined, null, ''), 존재하면 Update*/
                            "approval_title"                  : "Insert Test",
                            "approval_contents"               : "Insert Test....",
                            "attch_group_number"              : "temp00",
                            "net_price_document_type_code"    : "A",
                            "net_price_source_code"           : "B",
                            "buyer_empno"                     : "emp00",
                            "tentprc_flag"                    : true
                        },
                        "general" : [
                            {
                                "item_sequence"                    : 1             /* (_row_state_ 값에 따라) [C] 불필요, [U,D] 는 필수 */
                                ,"line_type_code"                  : "lineType"
                                ,"material_code"                   : "material" 
                                ,"payterms_code"                   : "payterms"
                                ,"supplier_code"                   : "supplier"
                                ,"effective_start_date"            : null
                                ,"effective_end_date"              : null
                                ,"surrogate_type_code"             : "surrogate"
                                ,"currency_code"                   : "KRW"
                                ,"net_price"                       : 100
                                ,"vendor_pool_code"                : "VPCODE"
                                ,"market_code"                     : "market"
                                ,"net_price_approval_reason_code"  : "reason"
                                ,"maker_code"                      : "maker"
                                ,"incoterms"                       : "ico"
                                ,"_row_state_"                     : "C"		     /* C, U, D */
                            }
                        ]
                    }
                }

                // this.generalInfoTbl = this.byId("generalInfoTbl");
                // this.generalInfoList = that.generalInfoTbl.getModel("generalInfoList").getProperty("/GeneralView");
                // console.log("generalInfoList : " + this.generalInfoList);
                // procObj.param.general = this.generalInfoList;

                $.ajax({
                    url: "srv-api/odata/v4/sp.netpriceApprovalDetailV4Service/ApprovalSaveProc",
                    type: "POST",
                    data: JSON.stringify(procObj),
                    contentType: "application/json",
                    success: function (data) {
                        console.log('data:', data);
                        //console.log('data:', data.value[0]);
                       
                    },
                    error: function (e) {
                        var eMessage = "callProcError",
                            errorType,
                            eMessageDetail;
                       
                        //sMsg = oBundle.getText("returnMsg", [v_returnModel.return_msg]);
                        if (e.responseJSON.error.message == undefined || e.responseJSON.error.message == null) {
                            eMessage = "callProcError";
                            eMessageDetail = "callProcError";
                        } else {
                            eMessage = e.responseJSON.error.message.substring(0, 8);
                            eMessageDetail = e.responseJSON.error.message.substring(9);
                            errorType = e.responseJSON.error.message.substring(0, 1);
                            console.log('errorMessage!:', e.responseJSON.error.message.substring(9));
                            
                        }

                        console.log(eMessageDetail);
                    }
                });
            },
            /**
             * 저장
             */
            onDraft: function (sActionParam) {
                var that = this;
                var oDetailModel = this.getModel("detailModel");
                var oI18NModel = this.getModel("I18N");
                var oModel = this.getModel();
                var oData = $.extend(true, {}, oDetailModel.getData());
                var aDetails = oData.details;
                var sMessage = oI18NModel.getText("/NCM01001");

                // entity에 없는 필드 삭제(OData에 없는 property 전송 시 에러)
                delete oData.approval_requestor_empno_fk;

                // detail 데이터가 있을 경우 checked property 삭제(OData에 없는 property 전송 시 에러)
                if (aDetails) {
                    aDetails.forEach(function (oDetails) {
                        delete oDetails.checked;
                        //delete oDetails.basis;
                        delete oDetails.material_code_fk;
                        delete oDetails.supplier_local_name;
                        delete oDetails.purOrg;
                    });
                }

                // 상신일 경우 approval_status_code를 20으로 변경
                if (sActionParam === "approval") {
                    oData.approval_status_code = "20";
                    sMessage = oI18NModel.getText("/NCM01001");
                } else if (oData.approval_number) {
                    sMessage = oI18NModel.getText("/NPG00008");
                }

                // approval_status_code 값이 10이 아닌 20일 경우 approval number유무에 상관없이 상신
                // arppoval number가 없는 경우 저장
                if (!oData.approval_number) {
                    delete oData.approval_number;

                    oModel.create("/Base_Price_Arl_Master", oData, {
                        //groupId: "saveBasePriceArl",
                        success: function (data) {
                            // return 값이 있고 approval_number가 있는 경우에만 저장 완료
                            if (data && data.approval_number) {
                                MessageToast.show(sMessage);
                                // var oMaster = that._returnDataRearrange(data);
                                // oDetailModel.setData(oMaster);

                                this.onBack();
                            } else {
                                console.log('error', data);
                                MessageBox.error("에러가 발생했습니다.");
                            }
                        }.bind(this),
                        error: function (data) {
                            console.log('error', data);
                            MessageBox.error(JSON.parse(data.responseText).error.message.value);
                        }
                    });
                }
                // arppoval number가 있는 경우 수정
                else {
                    var sUpdatePath = oModel.createKey("/Base_Price_Arl_Master", this._getMasterKey(oData, "Master"));
                    oModel.update(sUpdatePath, oData, {
                        success: function (data) {
                            // if( data && data.approval_number ) {
                            MessageToast.show(sMessage);

                            // if( sActionParam === "approval" ) {
                            //     oDetailModel.setProperty("/approval_status_code", "20");
                            // }
                            //     var oMaster = that._returnDataRearrange(data);
                            //     oDetailModel.setData(oMaster);
                            // }

                            this.onBack();
                        }.bind(this),
                        error: function (data) {
                            console.log('error', data);
                            MessageBox.error(JSON.parse(data.responseText).error.message.value);
                        }
                    });
                }
            },

            /**
             * 삭제
             */
            onDelete: function () {
                var oI18nModel = this.getModel("I18N");

                MessageBox.confirm(oI18nModel.getText("/NCM00003"), {
                    title: "Delete",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            var oModel = this.getModel();
                            var sDeletePath = oModel.createKey("/Base_Price_Arl_Master", this._getMasterKey(this.getModel("detailModel").getData(), "Master"));

                            oModel.remove(sDeletePath, {
                                success: function (data) {
                                    MessageToast.show(oI18nModel.getText("/NCM01002"));
                                    this.onBack();
                                }.bind(this),
                                error: function (data) {
                                    console.log('remove error', data.message);
                                    MessageBox.error(JSON.parse(data.responseText).error.message.value);
                                }
                            });
                        }
                    }.bind(this)
                });
            },

            /**
             * 상신
             */
            onRequest: function () {
                var oI18nModel = this.getModel("I18N");

                MessageBox.confirm("요청 하시겠습니까?", {
                    title: "Request",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            this.onDraft("approval");
                        }
                    }.bind(this)
                });
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
