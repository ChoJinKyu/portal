sap.ui.define([
    "./App.controller",
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
    "dp/util/control/ui/MaterialMasterDialog",
    "sap/m/Token"
],
    function (BaseController, ManagedListModel, TransactionManager, Validator, Formatter, DateFormatter,
        JSONModel, ODataModel, RichTextEditor, MessageBox, Fragment, Filter, FilterOperator, MessageToast, MaterialMasterDialog, Token) {
        "use strict";

        var sSelectedDialogPath, sTenantId, oOpenDialog;

        return BaseController.extend("sp.np.netPriceMgt.controller.BasePriceDetail", {
            dateFormatter: DateFormatter,

            onInit: function () {
                // Router설정. Detail 화면이 호출될 때마다 _getBasePriceDetail 함수 호출
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("NetPriceMgtDetail").attachPatternMatched(this._onRoutedThisPage, this);

                this.setModel(new JSONModel(), "detailModel");
                this.setModel(new JSONModel(), "detailViewModel");
                //this.setRichEditor();
            },

            /**
             * Base Price Detail 데이터 조회
            */
            _onRoutedThisPage: function () {
                var oView = this.getView();
                var oRootModel = this.getModel("rootModel");
                var oDetailModel = this.getModel("detailModel");
                var oDetailViewModel = this.getModel("detailViewModel");
                var oSelectedData = oRootModel.getProperty("/selectedData");
                var oApproverModel = this.getModel("approver");
                oDetailModel.setData({});
                //console.log(oRootModel.getProperty("/selectedData"));
                // Approval Line 초기화 시작
                //oApproverModel.setProperty("/entityName", "Approvers");
                //oApproverModel.setProperty("/Approvers", null);

                var oReferMulti = this.byId("referMulti");

                if (oReferMulti) {
                    oReferMulti.removeAllTokens();
                }
                // Approval Line 초기화 끝

                // 리스트 또는 품의진행상태조회에서 선택해서 넘어오는 경우
                if (oSelectedData) {
                    oDetailModel.setData({});
                    oDetailViewModel.setProperty("/viewMode", false);

                    var aMasterFilters = [];
                    aMasterFilters.push(new Filter("tenant_id", FilterOperator.EQ, oSelectedData.tenant_id));
                    //aMasterFilters.push(new Filter("approval_number", FilterOperator.EQ, oSelectedData.approval_number));
                    aMasterFilters.push(new Filter("approval_number", FilterOperator.EQ, "Temp*BUBIZ00000-0001"));

                    oView.setBusy(true);

                    // Master 조회
                    this._readData("/NpApprovalDetailMasterView", aMasterFilters, {}, function (data) {
                        console.log("master info:", data);

                        // Process에 표시될 상태 및 아이콘 데이터 세팅
                        //this.onSetProcessFlowStateAndIcon(oDetailViewModel, oMaster.approve_status_code);
                    }.bind(this));
                } else {// Create 버튼으로 넘어오는 경우

                    // 기준단가 기본 데이터 세팅
                    var oToday = new Date();
                    var oNewBasePriceData = {
                        "tenant_id": oRootModel.getProperty("/tenantId"),
                        "approval_number": "",
                        "approval_title": "",
                        "approval_type_code": oRootModel.getProperty("/selectedApprovalType"),   // V10: 신규, V20: 변경
                        "approve_status_code": "DR",    // DR: Draft
                        "requestor_empno": "5457",
                        //"request_date": this._changeDateString(oToday),
                        "details": []
                    };
                    oDetailModel.setData(oNewBasePriceData);
                    oDetailViewModel.setProperty("/detailsLength", 0);
                    oDetailViewModel.setProperty("/viewMode", true);

                    // 저장된 Approver가 없는 경우 Line 추가
                    this.onApproverAdd(0);

                    // Process에 표시될 상태 및 아이콘 데이터 세팅
                    this.onSetProcessFlowStateAndIcon(oDetailViewModel, oNewBasePriceData.approve_status_code);
                }

                // 생성버튼에서 선택한 유형(신규, 변경)의 Fragment 세팅
                this._setTableFragment(oRootModel.getProperty("/selectedApprovalType"));
            },

            /**
         * OData 호출
         */
            _readData: function (sCallUrlParam, aFiltersParam, oUrlParametersParam, fCallbackParam) {
                var oModel = this.getModel("detailService");
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
                console.log("//// onApproverAdd", oParam);
                var approver = this.getView().getModel('approver');
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
                console.log(" setSelectedApproval ", approver);
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

            /**
             * Base Price 라인 추가
             */
            onAddBasePrice: function () {
                var oDetailModel = this.getModel("detailModel");
                var aDetails = oDetailModel.getProperty("/details");
                var oToday = new Date();
                var aPrice = [{ market_code: "1", local_create_dtm: oToday, local_update_dtm: oToday },
                { market_code: "2", local_create_dtm: oToday, local_update_dtm: oToday }];

                // 화학일 경우 Domestic, Export 구분이 없어서 데이터 하나만 세팅. market_code는 0으로 
                if (sTenantId === "L2100") {
                    aPrice = [{ market_code: "0", local_create_dtm: oToday, local_update_dtm: oToday }];
                }

                aDetails.push({
                    base_date: oToday,
                    company_code: "LGCKR",
                    purOrg: this.getModel("rootModel").getProperty("/purOrg/LGCKR"),
                    org_code: "",
                    org_type_code: "PU",
                    au_code: "10",
                    base_price_ground_code: "10",
                    local_create_dtm: oToday,
                    local_update_dtm: oToday,
                    prices: aPrice
                });
                oDetailModel.refresh();
            },

            /**
             * detail 선택 데이터 체크
             */
            onRowSelectionChange: function (oEvent) {
                var oDetailModel = this.getModel("detailModel"),
                    oParameters = oEvent.getParameters(),
                    bSelectAll = !!oParameters.selectAll;

                // 전체 선택일 경우
                if (bSelectAll || oParameters.rowIndex === -1) {
                    var aDetails = oDetailModel.getProperty("/details");
                    aDetails.forEach(function (oDetail) {
                        oDetail.checked = bSelectAll;
                    });
                }
                // 단독 선택일 경우
                else {
                    var oDetail = oDetailModel.getProperty(oParameters.rowContext.getPath());
                    oDetail.checked = !oDetail.checked;
                }
            },

            /**
             * 체크된 detail 데이터 삭제
             */
            onDeleteDetailRow: function (oEvent) {
                var oDetailModel = this.getModel("detailModel"),
                    aDetails = oDetailModel.getProperty("/details"),
                    oDetailTable = oEvent.getSource().getParent().getParent();

                for (var i = aDetails.length - 1; 0 <= i; i--) {
                    if (aDetails[i].checked) {
                        aDetails.splice(i, 1);
                    }
                }

                oDetailModel.refresh();
                oDetailTable.clearSelection();
            },

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
