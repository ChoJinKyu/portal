// @ts-ignore
sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/m/ColumnListItem",
    "sap/ui/core/Fragment",
    "ext/lib/model/TransactionManager",
    "ext/lib/formatter/Formatter",
    "ext/lib/util/Validator",
    "ext/lib/util/Multilingual",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "ext/cm/util/control/ui/EmployeeDialog"
    // @ts-ignore
], function (BaseController, History, MessageBox, MessageToast, Filter, FilterOperator, FilterType, Sorter, JSONModel, ColumnListItem,
    Fragment, TransactionManager, Formatter, Validator, Multilingual, ManagedModel, ManagedListModel, EmployeeDialog) {
    "use strict";


    var i18nModel; //i18n 모델
    return BaseController.extend("pg.tm.tmMonitoring.controller.Detail", {

        formatter: Formatter,
        validator: new Validator(),

        //수정
        onInit: function () {
            //DetailView Model
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });

            this.setModel(oViewModel, "DetailView");

            //DetailMatched
            var oOwnerComponent = this.getOwnerComponent();
            this.oRouter = oOwnerComponent.getRouter();
            this.oRouter.getRoute("detail").attachPatternMatched(this._onDetailMatched, this);

            //테이블 edit/show 모드 설정
            this._initTableTemplates();

            //주기 text
            // @ts-ignore
            this.cycleText = new sap.m.Text({
                text: "{=${monitoring_cycle_name}.replaceAll(';', ', ')}",
            });


            //주기 multicombobox
            // @ts-ignore
            this.cycle_multibox = new sap.m.MultiComboBox({
                width: "100%",
                selectedKeys: "{=${monitoring_cycle_code}.split(';')}",
                placeholder: "{I18N>/CYCLE}",
                items: {
                    path: '/TaskMonitoringCycleCodeView',
                    // @ts-ignore
                    template: new sap.ui.core.ListItem({
                        key: "{code}",
                        text: "{code_name}"
                    })
                }
            });


            // I18N 모델 
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            i18nModel = this.getModel("I18N");


        },

        _onDetailMatched: function (oEvent) {
            var oView = this.getView();
            oView.getModel().refresh(true);
            this.scenario_number = oEvent.getParameter("arguments")["scenario_number"],
                this.tenant_id = oEvent.getParameter("arguments")["tenant_id"],
                this.company_code = oEvent.getParameter("arguments")["company_code"],
                this.bizunit_code = oEvent.getParameter("arguments")["bizunit_code"],
                this.manager = oEvent.getParameter("arguments")["manager"],
                this.manager_local_name = oEvent.getParameter("arguments")["manager_local_name"];

            //senario_number max view
            oView.getModel().read("/TaskMonitoringMaxScenarioNumberView", {
                success: function (oData) {
                    this.senario_number_max = parseInt(oData.results[0].max_scenario_number);
                }.bind(this),
                error: function () { }
            });

            //필수입력항목 검사 결과 초기화
            this.validator.clearValueState(sap.ui.getCore().byId("simpleform_edit"));

            if (this.scenario_number === "New") {
                this.getModel("DetailView").setProperty("/isEditMode", true);
                this.getModel("DetailView").setProperty("/isCreate", true);
                oView.bindElement("/TaskMonitoringMasterView");

                this._toEditMode();

            } else {
                this.getModel("DetailView").setProperty("/isEditMode", false);
                this.getModel("DetailView").setProperty("/isCreate", false);
                var scenario_number = this.scenario_number + "l";
                this.bindPath = "/TaskMonitoringMasterView(scenario_number=" + scenario_number + ",tenant_id='" + this.tenant_id + "',company_code='" + this.company_code + "',bizunit_code='" + this.bizunit_code + "')";
                oView.bindElement(this.bindPath);

                //담당자 조회
                var managerNames = this.manager_local_name.split(';');
                var managerCodes = this.manager.split(';');
                var oTokens = [];
                if (managerNames[0] !== " ") {
                    for (var i = 0; i < managerNames.length; i++) {
                        var defToken = new sap.m.Token({
                            key: managerCodes[i],
                            text: managerNames[i]
                        });
                        oTokens.push(defToken);
                    };
                    this.byId("multiInputWithEmployeeValueHelp").setTokens(oTokens);
                } else {
                    this.byId("multiInputWithEmployeeValueHelp").removeAllTokens();
                }

                var detail_info_Path = "/TaskMonitoringMaster(tenant_id='" + this.tenant_id + "',scenario_number=" + this.scenario_number + "l" + ")";
                var monitoringVBox = this.byId("monitoringVBox");
                var scenarioVBox = this.byId("scenarioVBox");
                var systemVBox = this.byId("systemVBox");
                monitoringVBox.bindElement(detail_info_Path);
                scenarioVBox.bindElement(detail_info_Path);
                systemVBox.bindElement(detail_info_Path);

                this._toShowMode();

                oView.getModel().read("/TaskMonitoringMaster(tenant_id='" + this.tenant_id + "',scenario_number=" + this.scenario_number + "l" + ")", {
                    success: function (oData) {
                        this.detailData = oData;
                        this.PurposeFormattedText = this.detailData.monitoring_purpose === '' ? null : decodeURIComponent(escape(window.atob(this.detailData.monitoring_purpose)));
                        this.ScenarioDescFormattedText = this.detailData.scenario_desc === '' ? null : decodeURIComponent(escape(window.atob(this.detailData.scenario_desc)));
                        this.ReSourceSystemFormattedText = this.detailData.source_system_desc === '' ? null : decodeURIComponent(escape(window.atob(this.detailData.source_system_desc)));
                        this.byId("PurposeFormattedText").setHtmlText(this.PurposeFormattedText === null ? 'No Description' : this.PurposeFormattedText);
                        this.byId("ScenarioDescFormattedText").setHtmlText(this.ScenarioDescFormattedText === null ? 'No Description' : this.ScenarioDescFormattedText);
                        this.byId("ReSourceSystemFormattedText").setHtmlText(this.ReSourceSystemFormattedText === null ? 'No Description' : this.ReSourceSystemFormattedText);
                    }.bind(this),
                    error: function () {
                        this.byId("PurposeFormattedText").setHtmlText("No Description");
                        this.byId("ScenarioDescFormattedText").setHtmlText("No Description");
                        this.byId("ReSourceSystemFormattedText").setHtmlText("No Description");
                    }
                });

            }

        },

        removeRichTextEditorValue: function () {
            this._defaultSetting("reMonitoringPurpose");
            this._defaultSetting("reMonitoringScenario");
            this._defaultSetting("reSourceSystemDetail");
            this.byId("reMonitoringPurpose").setValue("");
            this.byId("reMonitoringScenario").setValue("");
            this.byId("reSourceSystemDetail").setValue("");
        },

        removeFormattedTextValue: function () {
            this.byId("PurposeFormattedText").setHtmlText("");
            this.byId("ScenarioDescFormattedText").setHtmlText("");
            this.byId("ReSourceSystemFormattedText").setHtmlText("");
        },

        _defaultSetting: function (Id) {
            var fontId = this.byId(Id).getAggregation("_toolbarWrapper").getAggregation("_toolbar").getAggregation("content")[5].getId();
            this.byId(Id).getAggregation("_toolbarWrapper").getAggregation("_toolbar").getAggregation("content")[5].setSelectedItemId(fontId + "Verdana");
            var fontSizeId = this.byId(Id).getAggregation("_toolbarWrapper").getAggregation("_toolbar").getAggregation("content")[6].getId();
            this.byId(Id).getAggregation("_toolbarWrapper").getAggregation("_toolbar").getAggregation("content")[6].setSelectedItemId(fontSizeId + "2");
            this.byId(Id).getAggregation("_toolbarWrapper").getAggregation("_toolbar").getAggregation("content")[7].setIconColor("black");
            // this.byId(Id).getAggregation("_toolbarWrapper").getAggregation("_toolbar").getAggregation("content")[8].setActiveIconColor("white");

        },


        /**
         * signalList Insert Data(Items)
         * signalList Row Insert
         * Note: sid 및 value 값 수정 필요 
         * Odata 바인딩 작업시 변경이 필요할수 있음
         * @public
         */
        // @ts-ignore
        onSignalListAddRow: function (oEvent) {
            var obj = {
                tenant_id: this.tenant_id,
                scenario_number: this.scenario_number,
                monitoring_indicator_id: "",
                monitoring_indicator_sequence: "",
                monitoring_ind_number_cd: "",
                monitoring_ind_condition_cd: "",
                monitoring_indicator_start_value: "",
                monitoring_indicator_last_value: "",
                monitoring_indicator_grade: "",
                monitoring_ind_compare_base_cd: "",
                local_create_dtm: new Date(),
                local_update_dtm: new Date(),
                create_user_id: "Admin",
                update_user_id: "Admin",
                system_create_dtm: new Date(),
                system_update_dtm: new Date()
            };
            var oModel = this.getView().getModel();
            var retContext = oModel.createEntry("/TaskMonitoringIndicatorNumberDetail", {
                properties: obj,
                success: function () { },
                error: function () { }
            });
            var lisItemForTable = this.oEditableTemplate.clone();
            lisItemForTable.setBindingContext(retContext);
            var signalTable = this.byId("signalList");
            lisItemForTable.getAggregation("cells")[0].setIcon("sap-icon://add");
            signalTable.addItem(lisItemForTable);
        },

        /**
         * SignalList Row Item 삭제
         * Note: Odata 바인딩 작업시 변경이 필요할수 있음
         * @public
         */
        // @ts-ignore
        onSignalListDelete: function (oEvent) {
            var oTable = this.getView().byId("signalList"); //signal 테이블
            MessageBox.confirm(i18nModel.getText("/NCM00003"), {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        var oItems = oTable.getSelectedItems();
                        for (var i = 0; i < oItems.length; i++) {
                            if (oItems[i].getAggregation("cells")[0].getIcon() === "sap-icon://add") {
                                oTable.removeItem(oItems[i]);
                            }
                            oItems[i].getAggregation("cells")[0].setIcon("sap-icon://decline");
                            oItems[i].bindProperty("selected", "false");

                        }

                    }

                }
            });
        },


        /**
         * view item 삭제
 
         */
        onDelete: function () {
            console.group("onDelete-");
            var that = this;

            var odata = this.getView().getModel().oData[this.bindPath.replace('/', '')];
            var oModel = this.getView().getModel();
            oModel.setDeferredGroups(["DeleteGroup"]);
            var language_code = ["KO", "EN"];
            MessageBox.confirm(i18nModel.getText("/NCM00003"), {
                title: i18nModel.getText("/CONFIRM"),
                // @ts-ignore
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        //TaskMonitoringMaster 마스터
                        var masterPath = "/TaskMonitoringMaster(tenant_id='" + that.tenant_id + "',scenario_number=" + that.scenario_number + ")";
                        oModel.remove(masterPath, { groupId: "DeleteGroup" });

                        //TaskMonitoringTypeCodeLanguage 구분
                        for (var i = 0; i < language_code.length; i++) {
                            var typePath = "/TaskMonitoringTypeCodeLanguage(tenant_id='" + that.tenant_id + "',scenario_number=" + that.scenario_number + ",monitoring_type_code='" + odata.monitoring_type_code +
                                "',language_code='" + language_code[i] + "')";
                            oModel.remove(typePath, { groupId: "DeleteGroup" });

                        }
                        //TaskMonitoringPurchasingTypeCodeLanguage 유형
                        var purchasing_types = odata.monitoring_purchasing_type_code.split(';');
                        for (i = 0; i < purchasing_types.length; i++) {
                            for (var m = 0; m < language_code.length; m++) {
                                var purchasingTypePath = "/TaskMonitoringPurchasingTypeCodeLanguage(tenant_id='" + that.tenant_id + "',scenario_number=" + that.scenario_number +
                                    ",monitoring_purchasing_type_code='" + purchasing_types[i] + "',language_code='" + language_code[m] + "')"
                                oModel.remove(purchasingTypePath, { groupId: "DeleteGroup" });

                            }
                        }
                        //TaskMonitoringSenarioNumberLanguage 시나리오
                        for (i = 0; i < language_code.length; i++) {
                            var scenarioPath = "/TaskMonitoringSenarioNumberLanguage(tenant_id='" + that.tenant_id + "',scenario_number=" + that.scenario_number + ",language_code='" + language_code[i] + "')";
                            oModel.remove(scenarioPath, { groupId: "DeleteGroup" });
                        }
                        //TaskMonitoringCompanyCode 법인
                        var companyItems = odata.company_code.split(';');
                        companyItems.forEach(function (item) {
                            var companyPath = "/TaskMonitoringCompanyCode(tenant_id='" + that.tenant_id + "',scenario_number=" + that.scenario_number + ",company_code='" + item + "')";
                            oModel.remove(companyPath, { groupId: "DeleteGroup" });
                        });
                        //TaskMonitoringBizunitCode 사업본부
                        var bizunitItems = odata.bizunit_code.split(';');
                        bizunitItems.forEach(function (item) {
                            var bizunitPath = "/TaskMonitoringBizunitCode(tenant_id='" + that.tenant_id + "',scenario_number=" + that.scenario_number + ",bizunit_code='" + item + "')";
                            oModel.remove(bizunitPath, { groupId: "DeleteGroup" });
                        });
                        //TaskMonitoringOperationModeLanguage 운영방식
                        var operation_mode_code_arr = [];
                        if (odata.operation_mode_display_flag === "true") {
                            var operation_mode_code = "TKMTOMC001";
                            operation_mode_code_arr.push(operation_mode_code);
                        }
                        if (odata.operation_mode_calling_flag === "true") {
                            operation_mode_code = "TKMTOMC002"
                            operation_mode_code_arr.push(operation_mode_code);
                        }
                        if (odata.operation_mode_alram_flag === "true") {
                            operation_mode_code = "TKMTOMC003"
                            operation_mode_code_arr.push(operation_mode_code);
                        }
                        if (operation_mode_code_arr.length !== 0) {
                            for (i = 0; i < operation_mode_code_arr.length; i++) {
                                for (m = 0; m < language_code.length; m++) {
                                    var operationPath = "/TaskMonitoringOperationModeLanguage(tenant_id='" + that.tenant_id + "',scenario_number=" + that.scenario_number +
                                        ",monitoring_operation_mode_code='" + operation_mode_code_arr[i] + "',language_code='" + language_code[m] + "')";
                                    oModel.remove(operationPath, { groupId: "DeleteGroup" });
                                }
                            }
                        }

                        //TaskMonitoringCycleCodeLanguage 주기
                        if (odata.monitoring_cycle_code !== "") {
                            var cycleItems = odata.monitoring_cycle_code.split(';');
                            for (i = 0; i < cycleItems.length; i++) {
                                for (m = 0; m < language_code.length; m++) {
                                    var cyclePath = "/TaskMonitoringCycleCodeLanguage(tenant_id='" + that.tenant_id + "',scenario_number=" + that.scenario_number +
                                        ",monitoring_cycle_code='" + cycleItems[i] + "',language_code='" + language_code[m] + "')";
                                    oModel.remove(cyclePath, { groupId: "DeleteGroup" });
                                }
                            }
                        }


                        //TaskMonitoringManagerDetail 담당자
                        if (odata.manager !== "") {
                            var managerItems = odata.manager.split(';');
                            managerItems.forEach(function (manager) {
                                var managerPath = "/TaskMonitoringManagerDetail(tenant_id='" + that.tenant_id + "',scenario_number=" + that.scenario_number + ",monitoring_manager_empno='" + manager + "')";
                                oModel.remove(managerPath, { groupId: "DeleteGroup" });
                            });

                        }

                        oModel.submitChanges({
                            groupId: "DeleteGroup",
                            async: false,
                            success: function (oData, oResponse) {
                                sap.m.MessageToast.show(i18nModel.getText("/NCM01002"));
                                that.getRouter().navTo("main", {}, true);
                                //refresh
                                oModel.refresh(true);
                            },
                            error: function (cc, vv) {
                                sap.m.MessageToast.show(i18nModel.getText("/EPG00001"));
                            }
                        });




                    } else if (sButton === MessageBox.Action.CANCEL) {
                        return;
                    };
                }
            });


        },

        _deleteEntry: function (entitySet, deleteCode) {
            var oModel = this.getView().getModel();
            var that = this;
            var language_code = ["KO", "EN"];
            if (entitySet == "TaskMonitoringCompanyCode") {
                var keyPath = "/TaskMonitoringCompanyCode(tenant_id='" + this.tenant_id + "',scenario_number=" + this.scenario_number + "l" + ",company_code='" + deleteCode + "')";
            }
            if (entitySet == "TaskMonitoringBizunitCode") {
                keyPath = "/TaskMonitoringBizunitCode(tenant_id='" + this.tenant_id + "',scenario_number=" + this.scenario_number + "l" + ",bizunit_code='" + deleteCode + "')";
            }
            if (entitySet == "TaskMonitoringManagerDetail") {
                keyPath = "/TaskMonitoringManagerDetail(tenant_id='" + this.tenant_id + "',scenario_number=" + this.scenario_number + "l" + ",monitoring_manager_empno='" + deleteCode + "')";
            }
            if (entitySet == "TaskMonitoringCycleCodeLanguage") {
                language_code.forEach(function (code) {
                    keyPath = "/TaskMonitoringCycleCodeLanguage(tenant_id='" + that.tenant_id + "',scenario_number=" + that.scenario_number + "l" + ",monitoring_cycle_code='" + deleteCode + "',language_code='" + code + "')";
                    oModel.remove(keyPath, { "groupId": "UpdateGroup" });
                });
            }
            else if (entitySet == "TaskMonitoringTypeCodeLanguage") {
                language_code.forEach(function (code) {
                    keyPath = "/TaskMonitoringTypeCodeLanguage(tenant_id='" + that.tenant_id + "',scenario_number=" + that.scenario_number + "l" + ",monitoring_type_code='" + deleteCode + "',language_code='" + code + "')";
                    oModel.remove(keyPath, { "groupId": "UpdateGroup" });
                });
            }
            else if (entitySet == "TaskMonitoringOperationModeLanguage") {
                language_code.forEach(function (code) {
                    keyPath = "/TaskMonitoringOperationModeLanguage(tenant_id='" + that.tenant_id + "',scenario_number=" + that.scenario_number + "l" + ",monitoring_operation_mode_code='" + deleteCode + "',language_code='" + code + "')";
                    oModel.remove(keyPath, { "groupId": "UpdateGroup" });
                });
            }
            else if (entitySet == "TaskMonitoringPurchasingTypeCodeLanguage") {
                language_code.forEach(function (code) {
                    keyPath = "/TaskMonitoringPurchasingTypeCodeLanguage(tenant_id='" + that.tenant_id + "',scenario_number=" + that.scenario_number + "l" + ",monitoring_purchasing_type_code='" + deleteCode + "',language_code='" + code + "')";
                    oModel.remove(keyPath, { "groupId": "UpdateGroup" });
                });
            }
            else {
                oModel.remove(keyPath, { "groupId": "UpdateGroup" });
            }


        },


        _createEntry: function (entitySet, createCode) {
            var oItem = {};
            var oModel = this.getView().getModel();
            var language_code = ["KO", "EN"];
            oItem.tenant_id = this.tenant_id;
            oItem.scenario_number = this.scenario_number;
            oItem.local_create_dtm = new Date();
            oItem.local_update_dtm = new Date();
            oItem.create_user_id = "Admin";
            oItem.update_user_id = "Admin";
            oItem.system_create_dtm = new Date();
            oItem.system_update_dtm = new Date();
            var b = {
                "groupId": "UpdateGroup",
                "properties": oItem
            };
            if (entitySet == "TaskMonitoringCompanyCode") {
                oItem.company_code = createCode;

            }
            if (entitySet == "TaskMonitoringBizunitCode") {
                oItem.bizunit_code = createCode;
            }
            if (entitySet == "TaskMonitoringCycleCodeLanguage") {
                oItem.monitoring_cycle_code = createCode;
                var odata = oModel.oData["TaskMonitoringCycleCodeView(tenant_id='" + oItem.tenant_id + "',code='" + createCode + "')"];
                language_code.forEach(function (code) {
                    oItem.language_code = code;
                    oItem.monitoring_cycle_name = odata.code_name;
                    oModel.createEntry("/" + entitySet, b);
                });
            } else if (entitySet == "TaskMonitoringTypeCodeLanguage") {
                oItem.monitoring_type_code = createCode;
                var odata = oModel.oData["TaskMonitoringTypedCodeView(tenant_id='" + oItem.tenant_id + "',code='" + createCode + "')"];
                oItem.monitoring_type_name = odata.code_name;
                for (var i = 0; i < language_code.length; i++) {
                    oItem.language_code = language_code[i];
                    oModel.createEntry("/" + entitySet, b);
                }
            } else if (entitySet == "TaskMonitoringPurchasingTypeCodeLanguage") {
                oItem.monitoring_purchasing_type_code = createCode;
                var odata = oModel.oData["TaskMonitoringPurchaingTypeCodeView(tenant_id='" + oItem.tenant_id + "',code='" + createCode + "')"];
                oItem.monitoring_purchasing_type_name = odata.code_name;
                for (var i = 0; i < language_code.length; i++) {
                    oItem.language_code = language_code[i];
                    oModel.createEntry("/" + entitySet, b);
                }
            }
            else if (entitySet == "TaskMonitoringOperationModeLanguage") {
                oItem.monitoring_operation_mode_code = createCode;
                language_code.forEach(function (code) {
                    oItem.language_code = code;
                    oModel.createEntry("/" + entitySet, b);
                });
            } else {
                oModel.createEntry("/" + entitySet, b);
            }

        },

        //수정 기능 처리 전에 before,after 데이터 비교
        _compareData: function (before, after, entitySet) {
            var resultBefore = before.filter(function (a) {
                return after.indexOf(a) === -1;
            });
            var resultAfter = after.filter(function (b) {
                return before.indexOf(b) === -1;
            });
            //삭제
            if (resultBefore.length !== 0) {
                for (var d = 0; d < resultBefore.length; d++) {
                    this._deleteEntry(entitySet, resultBefore[d]);
                }
            }
            //생성
            if (resultAfter.length !== 0) {
                for (var c = 0; c < resultAfter.length; c++) {
                    this._createEntry(entitySet, resultAfter[c]);
                }
            }


        },

        onChangeAuthorityFlag: function (oEvent) {
            oEvent.getSource().getParent().getAggregation("cells")[0].setIcon("sap-icon://accept");
        },
        /**
        * 시나리오 저장 기능
        * @public
        */
        onPressSaveBtn: function () {
            var that = this;
            MessageBox.confirm(i18nModel.getText("/NCM00001"), {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        that._SaveScenario();


                    }

                }
            });

        },
        _SaveScenario: function () {
            var oModel = this.getView().getModel();
            var that = this;
            var language_code = ["KO", "EN"];
            // 모델 그룹 등록
            oModel.setDeferredGroups(["CreateGroup", "UpdateGroup"]);
            //필수입력항목 검사
            if (this.validator.validate(sap.ui.getCore().byId("simpleform_edit")) !== true) {
                MessageToast.show(i18nModel.getText("/ECM01002"));
                return;
            }
            //richTextEditor
            var monitoringPurposeValue = this.byId("reMonitoringPurpose").getValue();
            var scenarioDescValue = this.byId("reMonitoringScenario").getValue();
            var sourceSystemDescValue = this.byId("reSourceSystemDetail").getValue();
            if (this.scenario_number === "New") {
                var tenant_id = sap.ui.getCore().byId("tenant_edit_combo").getSelectedKey();
                var senario_number = String(this.senario_number_max);

                // 마스터 테이블 TaskMonitoringMaster
                var masterObj = {
                    tenant_id: tenant_id,
                    scenario_number: senario_number,
                    monitoring_type_code: sap.ui.getCore().byId("combo_monitoring_type").getSelectedKey(),
                    activate_flag: sap.ui.getCore().byId("segmentButton_activate").getSelectedKey() === 'Yes' ? true : false,
                    monitoring_purpose: this.htmlEncoding(monitoringPurposeValue, this.byId("reMonitoringPurpose").getId()),
                    scenario_desc: this.htmlEncoding(scenarioDescValue, this.byId("reMonitoringScenario").getId()),
                    source_system_desc: this.htmlEncoding(sourceSystemDescValue, this.byId("reSourceSystemDetail").getId()),
                    local_create_dtm: new Date(),
                    local_update_dtm: new Date(),
                    create_user_id: "Admin",
                    update_user_id: "Admin",
                    system_create_dtm: new Date(),
                    system_update_dtm: new Date()
                }

                var createMaster = {
                    "groupId": "CreateGroup",
                    "properties": masterObj
                };

                oModel.createEntry("/TaskMonitoringMaster", createMaster);

                // 구분 테이블 TaskMonitoringTypeCodeLanguage
                for (var i = 0; i < language_code.length; i++) {
                    var typeObj = {
                        "tenant_id": tenant_id,
                        "scenario_number": senario_number,
                        "monitoring_type_code": sap.ui.getCore().byId("combo_monitoring_type").getSelectedKey(),
                        "language_code": language_code[i],
                        "monitoring_type_name": sap.ui.getCore().byId("combo_monitoring_type").getValue(),
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date(),
                        "create_user_id": "Admin",
                        "update_user_id": "Admin",
                        "system_create_dtm": new Date(),
                        "system_update_dtm": new Date()
                    }


                    var createType = {
                        "groupId": "CreateGroup",
                        "properties": typeObj
                    };

                    oModel.createEntry("/TaskMonitoringTypeCodeLanguage", createType);

                }

                //유형 테이블 TaskMonitoringPurchasingTypeCodeLanguage
                var purchasing_types = sap.ui.getCore().byId("combo_purchasing_type").getSelectedItems();
                for (i = 0; i < purchasing_types.length; i++) {
                    for (var m = 0; m < language_code.length; m++) {
                        var purchasingTypeObj = {
                            tenant_id: tenant_id,
                            scenario_number: senario_number,
                            monitoring_purchasing_type_code: purchasing_types[i].getProperty("key"),
                            language_code: language_code[m],
                            monitoring_purchasing_type_name: purchasing_types[i].getProperty("text"),
                            local_create_dtm: new Date(),
                            local_update_dtm: new Date(),
                            create_user_id: "Admin",
                            update_user_id: "Admin",
                            system_create_dtm: new Date(),
                            system_update_dtm: new Date()
                        }


                        var createPurchasingType = {
                            "groupId": "CreateGroup",
                            "properties": purchasingTypeObj
                        };

                        oModel.createEntry("/TaskMonitoringPurchasingTypeCodeLanguage", createPurchasingType);
                    }
                }

                //시나리오 테이블 TaskMonitoringSenarioNumberLanguage
                for (var i = 0; i < language_code.length; i++) {
                    var scenarioObj = {
                        "tenant_id": tenant_id,
                        "scenario_number": senario_number,
                        "language_code": language_code[i],
                        "scenario_name": sap.ui.getCore().byId("Input_scenarioName").getValue(),
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date(),
                        "create_user_id": "Admin",
                        "update_user_id": "Admin",
                        "system_create_dtm": new Date(),
                        "system_update_dtm": new Date()
                    }


                    var createScenario = {
                        "groupId": "CreateGroup",
                        "properties": scenarioObj
                    };

                    oModel.createEntry("/TaskMonitoringSenarioNumberLanguage", createScenario);

                }

                //법인 테이블 TaskMonitoringCompanyCode
                var companyItems = sap.ui.getCore().byId("company_edit_combo").getSelectedKeys();
                companyItems.forEach(function (item) {
                    var companyObj = {
                        tenant_id: tenant_id,
                        scenario_number: senario_number,
                        company_code: item,
                        local_create_dtm: new Date(),
                        local_update_dtm: new Date(),
                        create_user_id: "Admin",
                        update_user_id: "Admin",
                        system_create_dtm: new Date(),
                        system_update_dtm: new Date()
                    }

                    var createCompany = {
                        "groupId": "CreateGroup",
                        "properties": companyObj
                    };

                    oModel.createEntry("/TaskMonitoringCompanyCode", createCompany);

                });

                //사업본부 TaskMonitoringBizunitCode
                var bizunitItems = sap.ui.getCore().byId("bizunit_edit_combo").getSelectedKeys();
                bizunitItems.forEach(function (item) {
                    var bizunitObj = {
                        tenant_id: tenant_id,
                        scenario_number: senario_number,
                        bizunit_code: item,
                        local_create_dtm: new Date(),
                        local_update_dtm: new Date(),
                        create_user_id: "Admin",
                        update_user_id: "Admin",
                        system_create_dtm: new Date(),
                        system_update_dtm: new Date()
                    }

                    var createBizunit = {
                        "groupId": "CreateGroup",
                        "properties": bizunitObj
                    };

                    oModel.createEntry("/TaskMonitoringBizunitCode", createBizunit);

                });


                // 담당자 TaskMonitoringManagerDetail
                var managerItems = this.byId("managerListTable").getItems();
                managerItems.forEach(function (manager) {
                    var managerCode = manager.getBindingContext().getProperty("employee_number");

                    var sPath = "/TaskMonitoringManagerDetail(tenant_id='" + tenant_id + "', scenario_number=" + senario_number + ",monitoring_manager_empno='" + managerCode + "')";
                    var managerObj = {
                        tenant_id: tenant_id,
                        scenario_number: senario_number,
                        monitoring_manager_empno: managerCode,
                        monitoring_super_authority_flag: manager.getAggregation("cells")[5].getSelectedKey() === 'Yes' ? true : false,
                        local_create_dtm: new Date(),
                        local_update_dtm: new Date(),
                        create_user_id: "Admin",
                        update_user_id: "Admin",
                        system_create_dtm: new Date(),
                        system_update_dtm: new Date()
                    }
                    if (manager.getAggregation("cells")[0].getProperty("text") === "sap-icon://add") {

                        var createManager = {
                            "groupId": "CreateGroup",
                            "properties": managerObj
                        };
                        oModel.createEntry("/TaskMonitoringManagerDetail", createManager);
                    } else if (manager.getAggregation("cells")[0].getProperty("icon") === "sap-icon://decline") {

                        oModel.remove(sPath, { groupId: "DeleteGroup" });
                    }
                });

                //운영방식 TaskMonitoringOperationModeLanguage
                var operation_mode_code_arr = [],
                    operation_mode_name_arr = [];
                if (this.byId("search_flag").getSelected() === true) {
                    var operation_mode_code = "TKMTOMC001",
                        operation_mode_name = "조회"
                    operation_mode_code_arr.push(operation_mode_code);
                    operation_mode_name_arr.push(operation_mode_name);
                }
                if (this.byId("calling_flag").getSelected() === true) {
                    operation_mode_code = "TKMTOMC002"
                    operation_mode_name = "소명"
                    operation_mode_code_arr.push(operation_mode_code);
                    operation_mode_name_arr.push(operation_mode_name);
                }
                if (this.byId("alarm_flag").getSelected() === true) {
                    operation_mode_code = "TKMTOMC003"
                    operation_mode_name = "알람"
                    operation_mode_code_arr.push(operation_mode_code);
                    operation_mode_name_arr.push(operation_mode_name);
                }
                for (var i = 0; i < operation_mode_code_arr.length; i++) {
                    for (var m = 0; m < language_code.length; m++) {
                        var operationObj = {
                            tenant_id: tenant_id,
                            scenario_number: senario_number,
                            monitoring_operation_mode_code: operation_mode_code_arr[i],
                            language_code: language_code[m],
                            monitoring_operation_mode_name: operation_mode_name_arr[i],
                            local_create_dtm: new Date(),
                            local_update_dtm: new Date(),
                            create_user_id: "Admin",
                            update_user_id: "Admin",
                            system_create_dtm: new Date(),
                            system_update_dtm: new Date()
                        }
                        var createOperation = {
                            "groupId": "CreateGroup",
                            "properties": operationObj
                        };
                        oModel.createEntry("/TaskMonitoringOperationModeLanguage", createOperation);
                    }
                }


                //주기 TaskMonitoringCycleCodeLanguage
                var cycleItems = this.cycle_multibox.getSelectedItems();
                for (var i = 0; i < cycleItems.length; i++) {
                    for (var m = 0; m < language_code.length; m++) {
                        var cycleObj = {
                            tenant_id: tenant_id,
                            scenario_number: senario_number,
                            monitoring_cycle_code: cycleItems[i].getProperty("key"),
                            monitoring_cycle_name: cycleItems[i].getProperty("text"),
                            language_code: language_code[m],
                            local_create_dtm: new Date(),
                            local_update_dtm: new Date()
                        }
                        var createCycle = {
                            "groupId": "CreateGroup",
                            "properties": cycleObj
                        };

                        oModel.createEntry("/TaskMonitoringCycleCodeLanguage", createCycle);

                    }
                }


                oModel.submitChanges({
                    groupId: "CreateGroup",
                    async: false,
                    success: function (oData, oResponse) {
                        sap.m.MessageToast.show(i18nModel.getText("/NCM01001"));
                        that.getRouter().navTo("main", {}, true);
                        //refresh
                        oModel.refresh(true);


                    },
                    error: function (cc, vv) {
                        sap.m.MessageToast.show(i18nModel.getText("/EPG00003"));
                    }
                });

            } else {
                tenant_id = this.tenant_id;
                senario_number = this.scenario_number;

                //Update 
                //마스터 테이블
                var master_uPath = "/TaskMonitoringMaster(tenant_id='" + tenant_id + "',scenario_number=" + senario_number + ")";
                var selectedTypeCode = sap.ui.getCore().byId("combo_monitoring_type").getSelectedKey();

                var masterUpdateObj = {
                    monitoring_type_code: selectedTypeCode,
                    activate_flag: sap.ui.getCore().byId("segmentButton_activate").getSelectedKey() === 'Yes' ? true : false,
                    monitoring_purpose: this.htmlEncoding(monitoringPurposeValue, this.byId("reMonitoringPurpose").getId()),
                    scenario_desc: this.htmlEncoding(scenarioDescValue, this.byId("reMonitoringScenario").getId()),
                    source_system_desc: this.htmlEncoding(sourceSystemDescValue, this.byId("reSourceSystemDetail").getId()),
                    local_update_dtm: new Date(),
                    update_user_id: "Admin",
                    system_update_dtm: new Date()
                }
                oModel.update(master_uPath, masterUpdateObj, { "groupId": "UpdateGroup" }, {
                    async: false,
                    method: "PUT"
                });
                //구분
                var odata = this.getView().getModel().getProperty(this.bindPath);
                this._deleteEntry("TaskMonitoringTypeCodeLanguage", odata.monitoring_type_code);
                this._createEntry("TaskMonitoringTypeCodeLanguage", selectedTypeCode);
                //구매유형
                var before = odata.monitoring_purchasing_type_code.split(';');
                var after = sap.ui.getCore().byId("combo_purchasing_type").getSelectedKeys();
                this._compareData(before, after, "TaskMonitoringPurchasingTypeCodeLanguage");
                //법인 
                before = odata.company_code.split(';');
                after = sap.ui.getCore().byId("company_edit_combo").getSelectedKeys();
                this._compareData(before, after, "TaskMonitoringCompanyCode");
                //사업본부
                before = odata.bizunit_code.split(';');
                after = sap.ui.getCore().byId("bizunit_edit_combo").getSelectedKeys();
                this._compareData(before, after, "TaskMonitoringBizunitCode");
                //운영
                var operation_mode_code_arr = [];
                if (odata.operation_mode_display_flag === "true") {
                    var operation_mode_code = "TKMTOMC001";
                    operation_mode_code_arr.push(operation_mode_code);
                }
                if (odata.operation_mode_calling_flag === "true") {
                    operation_mode_code = "TKMTOMC002"
                    operation_mode_code_arr.push(operation_mode_code);
                }
                if (odata.operation_mode_alram_flag === "true") {
                    operation_mode_code = "TKMTOMC003"
                    operation_mode_code_arr.push(operation_mode_code);
                }

                var afterOperation = [];
                if (this.byId("search_flag").getSelected() === true) {
                    operation_mode_code = "TKMTOMC001";
                    afterOperation.push(operation_mode_code);
                }
                if (this.byId("calling_flag").getSelected() === true) {
                    operation_mode_code = "TKMTOMC002"
                    afterOperation.push(operation_mode_code);
                }
                if (this.byId("alarm_flag").getSelected() === true) {
                    operation_mode_code = "TKMTOMC003"
                    afterOperation.push(operation_mode_code);
                }

                this._compareData(operation_mode_code_arr, afterOperation, "TaskMonitoringOperationModeLanguage");
                //담당자 
                var managerTableItems = this.byId("managerListTable").getItems();
                for (var m = 0; m < managerTableItems.length; m++) {
                    var statusIcon = managerTableItems[m].getAggregation("cells")[0].getIcon();
                    var managerCode = managerTableItems[m].getBindingContext().getProperty("employee_number");
                    var authorityFlagValue = managerTableItems[m].getAggregation("cells")[5].getSelectedKey();
                    if (statusIcon === "sap-icon://add") {
                        var managerCreateObj = {
                            tenant_id: tenant_id,
                            scenario_number: senario_number,
                            monitoring_manager_empno: managerCode,
                            monitoring_super_authority_flag: authorityFlagValue === 'Yes' ? true : false,
                            local_create_dtm: new Date(),
                            local_update_dtm: new Date(),
                            create_user_id: "Admin",
                            update_user_id: "Admin",
                            system_create_dtm: new Date(),
                            system_update_dtm: new Date()
                        }
                        var b = {
                            "groupId": "UpdateGroup",
                            "properties": managerCreateObj
                        };
                        oModel.createEntry("TaskMonitoringManagerDetail", b);

                    } else if (statusIcon === "sap-icon://accept") {
                        var manager_uPath = "/TaskMonitoringManagerDetail(tenant_id='" + tenant_id + "',scenario_number=" + senario_number + ",monitoring_manager_empno='" + managerCode + "')";
                        var managerUpdateObj = {
                            monitoring_super_authority_flag: managerTableItems[m].getAggregation("cells")[5].getSelectedKey() === 'Yes' ? true : false,
                            local_update_dtm: new Date(),
                            update_user_id: "Admin",
                            system_update_dtm: new Date()
                        }
                        oModel.update(manager_uPath, managerUpdateObj, { "groupId": "UpdateGroup" }, {
                            async: false,
                            method: "PUT"
                        });
                    } else if (statusIcon === "sap-icon://decline") {
                        this._deleteEntry("TaskMonitoringManagerDetail", managerCode);
                    }

                }


                //주기
                before = odata.monitoring_cycle_code.split(';');
                after = this.cycle_multibox.getSelectedKeys();
                this._compareData(before, after, "TaskMonitoringCycleCodeLanguage");
                //submitChanges
                oModel.submitChanges({
                    groupId: "UpdateGroup",
                    success: function () {
                        sap.m.MessageToast.show(i18nModel.getText("/NPG00008"));
                        that.getRouter().navTo("main", {}, true);
                        //refresh
                        oModel.refresh(true);

                    }, error: function () {
                        sap.m.MessageToast.show(i18nModel.getText("/EPG00002"));
                    }
                });

            }

            this.removeRichTextEditorValue();
            this.removeFormattedTextValue();
        },

        htmlEncoding: function (value, sId) {
            // return window.btoa(value);
            return btoa(unescape(encodeURIComponent(value)))
        },

        /**
        * 메인화면으로 이동
        * @public
        */
        onNavToBack: function () {
            var that = this;
            var sPreviousHash = History.getInstance().getPreviousHash();

            if (that.getModel("DetailView").getProperty("/isEditMode") === false) {
                if (sPreviousHash !== undefined) {
                    // eslint-disable-next-line sap-no-history-manipulation
                    history.go(-1);
                } else {
                    that.getRouter().navTo("main", {}, true);
                }

            } else {
                MessageBox.confirm(i18nModel.getText("/NPG00013"), {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        if (sAction === MessageBox.Action.OK) {

                            if (sPreviousHash !== undefined) {
                                // eslint-disable-next-line sap-no-history-manipulation
                                history.go(-1);
                            } else {
                                that.getRouter().navTo("main", {}, true);
                            }

                            that.getView().getModel().refresh(true);
                            that.removeFormattedTextValue();
                            that.removeRichTextEditorValue();
                        }

                    }
                });

            }

        },


        /**
         * 회사,법인, 사업본부 filter 기능
         * 법인, 사업본부 items가 tenant_id값으로 filter됨
         * @public
         */
        onChangeTenant: function (oEvent) {
            var oSelectedkey = oEvent.getSource().getSelectedKey();
            if (oSelectedkey === "") {
                oSelectedkey = this.tenant_id;
            }
            // var oSelectedkey = sap.ui.getCore().byId("tenant_edit_combo").getSelectedKey();
            var company_combo = sap.ui.getCore().byId("company_edit_combo");                            //법인  
            // @ts-ignore
            var bizunit_combo = sap.ui.getCore().byId("bizunit_edit_combo");                          //사업본부
            // var oCompanyBindingComboBox = company_combo.getBinding("items");                       //법인 items
            var aFiltersComboBox = [];
            // @ts-ignore
            var oFilterComboBox = new sap.ui.model.Filter("tenant_id", "EQ", oSelectedkey);
            aFiltersComboBox.push(oFilterComboBox);
            // oCompanyBindingComboBox.filter(aFiltersComboBox);
            var companySorter = new sap.ui.model.Sorter("company_name", false);        //sort Ascending
            var bizunitSorter = new sap.ui.model.Sorter("bizunit_name", false);        //sort Ascending

            company_combo.bindAggregation("items", {
                path: "/OrgCompanyView",
                sorter: companySorter,
                filters: aFiltersComboBox,
                // @ts-ignore
                template: new sap.ui.core.Item({
                    key: "{company_code}",
                    text: "{company_name}"
                })
            });
            bizunit_combo.bindAggregation("items", {
                path: "/OrgUnitView",
                sorter: bizunitSorter,
                filters: aFiltersComboBox,
                // @ts-ignore
                template: new sap.ui.core.Item({
                    key: "{bizunit_code}",
                    text: "{bizunit_name}"
                })
            });
        },

        /**
        * 담당자 popup Save 기능
        * 선택한 담당자가 담당자 테이블에 추가됨
        * @public
        */
        onPressManagerDialogSave: function (oEvent) {
            // @ts-ignore
            var oTable = sap.ui.getCore().byId("dialog_manager--managerDialogTable");
            var managerTable = this.byId("managerListTable");
            var managers = managerTable.getItems();
            var managerId = [];
            var managerNames = [];
            managers.forEach(function (manager) {
                if (manager.getAggregation("cells")[0].getProperty("icon") !== "sap-icon://decline") {
                    managerId.push(manager.getAggregation("cells")[1].getProperty("text"));
                    managerNames.push(manager.getAggregation("cells")[2].getProperty("text"));
                }

            });

            var items = oTable.getSelectedItems();
            for (var i = 0; i < items.length; i++) {
                var tableContext = items[i].getBindingContext();
                var data = oTable.getModel().getProperty(tableContext.getPath());

                if (!managerId.includes(data.employee_number)) {

                    var segmentItemYes = new sap.m.SegmentedButtonItem({ text: "Yes", key: "Yes" });
                    var segmentItemNo = new sap.m.SegmentedButtonItem({ text: "No", key: "No" });

                    var lisItemForTable = new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Text({
                                text: "sap-icon://add"
                            }),
                            // new sap.m.Text({
                            //     text: data.employee_number
                            // }),
                            // @ts-ignore
                            new sap.m.Text({
                                text: data.employee_name
                            }),
                            // @ts-ignore
                            new sap.m.Text({
                                text: data.job_title
                            }),
                            // @ts-ignore
                            new sap.m.Text({
                                text: data.mobile_phone_number
                            }),
                            // @ts-ignore
                            new sap.m.Text({
                                text: data.department_id
                            }),
                            new sap.m.SegmentedButton({
                                items: [segmentItemYes, segmentItemNo],
                                selectedKey: "No"
                            })
                        ]

                    });

                    managerTable.addItem(lisItemForTable);
                    managerNames.push(data.employee_name);
                    this.byId("managerInput").setValue(managerNames);
                }

            }

            this.onPressManagerDialogClose();

        },


        /**
        * 담당자 테이블 delete 기능
        * 선택한 담당자 row delete
        * @public
        */
        onPressManagerDelete: function () {
            var managerTable = this.byId("managerListTable"); //담당자 테이블
            var that = this;
            MessageBox.confirm(i18nModel.getText("/NCM00003"), {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        var oItems = managerTable.getSelectedItems();
                        for (var i = 0; i < oItems.length; i++) {
                            var empNo = oItems[i].getBindingContext().getProperty("employee_number");
                            var tokens = that.byId("multiInputWithEmployeeValueHelp").getTokens();
                            tokens.forEach(function (token) {
                                if (token.getProperty("key") === empNo) {
                                    that.byId("multiInputWithEmployeeValueHelp").removeToken(token);
                                }
                            });
                            if (oItems[i].getAggregation("cells")[0].getIcon() === "sap-icon://add") {
                                managerTable.removeItem(oItems[i]);
                            }
                            oItems[i].getAggregation("cells")[0].setIcon("sap-icon://decline");
                            oItems[i].bindProperty("selected", "false");


                        }

                    }


                }
            });

        },

        /**
         * footer Cancel 버튼 기능
         * @public
         */
        onPageCancelEditButtonPress: function () {
            this.onNavToBack();
        },

        /**
         * footer Edit 버튼 기능
         * Edit모드로 변경
         * @public
         */
        onPageEditButtonPress: function () {
            this._toEditMode();



        },

        /**
        * Edit모드일 때 설정 
        */
        _toEditMode: function () {
            this.getModel("DetailView").setProperty("/isEditMode", true);
            this._showFormFragment('Detail_Edit');
            this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("page").setProperty("showFooter", true);
            //첨부파일
            this.byId("UploadCollection").setUploadEnabled(true);
            //담당자
            this.byId("managerVBox").setVisible(false);
            var btn = this.byId("managerTableBtn");
            btn.setIcon("sap-icon://expand-all");
            this.byId("managerListTable").setMode(sap.m.ListMode.MultiSelect);

            this.byId("managerListTable").setMode(sap.m.ListMode.MultiSelect);
            this._bindMidTable(this.oEditableManagerTemplate, "Edit");
            // signal table
            this.byId("signalList").setMode(sap.m.ListMode.MultiSelect);
            this._bindMidTable(this.oEditableTemplate, "Edit");
            // @ts-ignore
            //주기 text -> multicombobox로 변경
            this.byId("cycleVBox").removeItem(this.cycleText);
            this.byId("cycleVBox").insertItem(this.cycle_multibox, 1);
            //회사,법인,사업본부 SelectionChange Event
            if (this.scenario_number !== "New") {
                sap.ui.getCore().byId("tenant_edit_combo").fireSelectionChange();
            }
            //회사, 법인 combobox item reset
            sap.ui.getCore().byId("company_edit_combo").removeAllItems();
            sap.ui.getCore().byId("bizunit_edit_combo").removeAllItems();
            //remove description
            if (this.scenario_number === "New") {
                this.removeRichTextEditorValue();
            } else {
                this.removeRichTextEditorValue();
                //richTextEditor
                this.byId("reMonitoringPurpose").setValue(this.PurposeFormattedText === '' ? null : this.PurposeFormattedText);
                this.byId("reMonitoringScenario").setValue(this.ScenarioDescFormattedText === '' ? null : this.ScenarioDescFormattedText);
                this.byId("reSourceSystemDetail").setValue(this.ReSourceSystemFormattedText === '' ? null : this.ReSourceSystemFormattedText);
            }

        },

        /**
         * Show모드일 때 설정 
         */
        _toShowMode: function () {
            this.getModel("DetailView").setProperty("/isEditMode", false);
            this._showFormFragment('Detail_Show');
            this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("page").setProperty("showFooter", true);
            var btn = this.byId("managerTableBtn");
            btn.setIcon("sap-icon://collapse-all");
            // signal table
            this._bindMidTable(this.oReadOnlyTemplate, "Navigation");
            this.byId("signalList").setMode(sap.m.ListMode.None);
            // 담당자 table
            this.byId("managerListTable").setMode(sap.m.ListMode.None);
            this._bindMidTable(this.oReadOnlyManagerTemplate, "Navigation");
            //주기 multicombobox -> text로 변경
            this.byId("cycleVBox").removeItem(this.cycle_multibox);
            this.byId("cycleVBox").insertItem(this.cycleText, 1);



        },

        /**
        * signal 테이블 template 
        */
        _initTableTemplates: function () {
            var that = this;
            //지표 테이블
            this.oReadOnlyTemplate = new ColumnListItem({
                cells: [
                    new sap.m.ObjectStatus({
                        icon: "",
                        width: "10%"
                    }),
                    // @ts-ignore
                    new sap.m.Text({
                        text: "{monitoring_ind_number_cd_name}",
                        width: "30%"
                    }),
                    // @ts-ignore
                    new sap.m.Text({
                        text: "{monitoring_ind_condition_cd} ({monitoring_ind_condition_cd_name})"
                    }),
                    // @ts-ignore
                    new sap.m.Text({
                        text: "{monitoring_indicator_start_value}"
                    }),
                    // @ts-ignore
                    new sap.m.Text({
                        text: "{monitoring_indicator_last_value}"
                    }),
                    // @ts-ignore
                    new sap.m.Text({
                        text: "{monitoring_indicator_grade_name}"
                    }),
                    // @ts-ignore
                    new sap.m.Text({
                        text: "{monitoring_ind_compare_base_cd_name}"
                    })
                ],
                // @ts-ignore
                type: sap.m.ListType.Inactive
            });

            this.oEditableTemplate = new ColumnListItem({
                cells: [
                    new sap.m.ObjectStatus({
                        icon: ""
                    }),
                    // @ts-ignore
                    new sap.m.ComboBox({
                        width: "80%",
                        selectedKey: "{monitoring_ind_number_cd}",
                        items: {
                            path: '/TaskMonitoringIndicatorNumberCodeView',
                            // @ts-ignore
                            template: new sap.ui.core.Item({
                                key: "{code}",
                                text: "{code_name}"
                            })
                        },
                        selectionChange: function (oEvent) {
                            var status = oEvent.getSource().getParent().getAggregation("cells")[0].getIcon();
                            if (status !== "sap-icon://add") {
                                oEvent.getSource().getParent().getAggregation("cells")[0].setIcon("sap-icon://accept");
                            }
                            if (oEvent.getSource().getSelectedKey() === "TKMTINC002") {
                                oEvent.getSource().getParent().getAggregation("cells")[6].setSelectedKey("%");
                            } else if (oEvent.getSource().getSelectedKey() === "TKMTINC001") {
                                oEvent.getSource().getParent().getAggregation("cells")[6].setSelectedKey("COUNT");
                            }

                        }

                        // ,
                        // required: true
                    }),
                    // @ts-ignore
                    new sap.m.ComboBox({
                        width: "80%",
                        selectedKey: {
                            path: 'monitoring_ind_condition_cd',
                            // @ts-ignore
                            type: new sap.ui.model.type.String,
                        },
                        items: {
                            path: '/TaskMonitoringIndicatorComparisonConditionCodeView',
                            // @ts-ignore
                            template: new sap.ui.core.Item({
                                key: "{code}",
                                text: "{code} ({code_name})"
                            })
                        },
                        selectionChange: function (oEvent) {
                            oEvent.getSource().getParent().getAggregation("cells")[0].setIcon("sap-icon://accept");
                        }
                    }),
                    // @ts-ignore
                    new sap.m.Input({
                        width: "80%",
                        type: "Text",
                        value: "{monitoring_indicator_start_value}",
                        liveChange: function (oEvent) {
                            oEvent.getSource().getParent().getAggregation("cells")[0].setIcon("sap-icon://accept");
                        }
                    }),
                    // @ts-ignore
                    new sap.m.Input({
                        width: "80%",
                        type: "Text",
                        value: "{monitoring_indicator_last_value}",
                        liveChange: function (oEvent) {
                            oEvent.getSource().getParent().getAggregation("cells")[0].setIcon("sap-icon://accept");

                        }
                    }),
                    // @ts-ignore
                    new sap.m.ComboBox({
                        width: "80%",
                        selectedKey: "{monitoring_indicator_grade}",
                        items: {
                            path: "/TaskMonitoringIndicatorComparisionGradeCodeView",
                            // @ts-ignore
                            template: new sap.ui.core.Item({
                                key: "{code}",
                                text: "{code_name}"
                            })
                        },
                        selectionChange: function (oEvent) {
                            oEvent.getSource().getParent().getAggregation("cells")[0].setIcon("sap-icon://accept");

                        }
                        // ,
                        // required: true
                    }),
                    // @ts-ignore
                    new sap.m.ComboBox({
                        width: "80%",
                        selectedKey: "{monitoring_ind_compare_base_cd}",
                        items: {
                            path: "/TaskMonitoringIndicatorComparisionBasicCodeView",
                            // @ts-ignore
                            template: new sap.ui.core.Item({
                                key: "{code}",
                                text: "{code_name}"
                            })
                        },
                        selectionChange: function (oEvent) {
                            oEvent.getSource().getParent().getAggregation("cells")[0].setIcon("sap-icon://accept");
                        }
                        // ,
                        // required: true
                    }),
                ]

            });


            //담당자 테이블 (Show)
            this.oReadOnlyManagerTemplate = new ColumnListItem({
                cells: [
                    //status
                    new sap.m.ObjectStatus({
                        icon: ""
                    }),
                    // // @ts-ignore
                    // new sap.m.Text({
                    //     text: "{employee_number}"
                    // }),
                    // @ts-ignore
                    new sap.m.Text({
                        text: "{employee_name}"
                    }),
                    // @ts-ignore
                    new sap.m.Text({
                        text: "{job_title}"
                    }),
                    // @ts-ignore
                    new sap.m.Text({
                        text: "{mobile_phone_number}"
                    }),
                    // @ts-ignore
                    new sap.m.Text({
                        text: "{department_id}"
                    }),
                    // @ts-ignore
                    new sap.m.Text({
                        text: "{=${monitoring_super_authority_flag} === true ? 'Yes' : 'No'}"
                    })
                ],
                // @ts-ignore
                type: sap.m.ListType.Inactive
            });

            //담당자 테이블 (Edit)
            var segmentItemYes = new sap.m.SegmentedButtonItem({ text: "Yes", key: "Yes" });
            var segmentItemNo = new sap.m.SegmentedButtonItem({ text: "No", key: "No" });
            this.oEditableManagerTemplate = new ColumnListItem({
                cells: [
                    //status
                    new sap.m.ObjectStatus({
                        icon: ""
                    }),
                    // // @ts-ignore
                    // new sap.m.Text({
                    //     text: "{employee_number}"
                    // }),
                    // @ts-ignore
                    new sap.m.Text({
                        text: "{employee_name}"
                    }),
                    // @ts-ignore
                    new sap.m.Text({
                        text: "{job_title}"
                    }),
                    // @ts-ignore
                    new sap.m.Text({
                        text: "{mobile_phone_number}"
                    }),
                    // @ts-ignore
                    new sap.m.Text({
                        text: "{department_id}"
                    }),
                    // @ts-ignore
                    new sap.m.SegmentedButton({
                        items: [segmentItemYes, segmentItemNo],
                        selectedKey: "{=${monitoring_super_authority_flag} === true? 'Yes' : 'No'}",
                        selectionChange: function (oEvent) {
                            var status = oEvent.getSource().getParent().getAggregation("cells")[0].getIcon();
                            if (status !== "sap-icon://add") {
                                oEvent.getSource().getParent().getAggregation("cells")[0].setIcon("sap-icon://accept");
                            }
                        }
                    })
                ]
            });
        },

        /**
        * 지표 테이블, 담당자 테이블 bindItems
        */
        _bindMidTable: function (oTemplate, sKeyboardMode) {
            if (oTemplate === this.oReadOnlyTemplate || oTemplate === this.oEditableTemplate) {
                this.byId("signalList").bindItems({
                    path: "/TaskMonitoringIndicatorNumberView",
                    filters: [
                        new Filter("tenant_id", FilterOperator.Contains, this.tenant_id),
                        new Filter("scenario_number", FilterOperator.EQ, this.scenario_number)
                    ],
                    template: oTemplate
                }).setKeyboardMode(sKeyboardMode);
            } else {
                this.byId("managerListTable").bindItems({
                    path: "/TaskMonitoringManagerView",
                    filters: [
                        new Filter("tenant_id", FilterOperator.Contains, this.tenant_id),
                        new Filter("scenario_number", FilterOperator.EQ, this.scenario_number)
                    ],
                    template: oTemplate
                }).setKeyboardMode(sKeyboardMode);
            }

        },

        /**
        * Detail_Edit, Detail_Show Fragment load 
        */
        _oFragments: {},
        _showFormFragment: function (sFragmentName) {
            var oPageSubSection = this.byId("pageSubSection1");
            this._loadFragment(sFragmentName, function (_oFragments) {
                oPageSubSection.removeAllBlocks();
                oPageSubSection.addBlock(_oFragments);

            })
        },

        _loadFragment: function (sFragmentName, oHandler) {
            if (!this._oFragments[sFragmentName]) {
                var _oFragments = this._oFragments[sFragmentName];
                // @ts-ignore
                _oFragments = sap.ui.xmlfragment("pg.tm.tmMonitoring.view." + sFragmentName, this);

                this._oFragments[sFragmentName] = _oFragments;
                if (oHandler) { oHandler(_oFragments) };

            } else {
                if (oHandler) oHandler(this._oFragments[sFragmentName]);
            }
        },

        /**
         * 담당자 테이블 열기/닫기 버튼 기능(visible 값 변경)
         * Show 모드일 때는 펼쳐지고 Edit 모드일 때 접힘 
         * @public
         */
        onPressManagerTable: function (sFragmentName, oHandler) {
            var hbox = this.byId("managerVBox");
            hbox.setVisible(!hbox.getVisible());
            var btn = this.byId("managerTableBtn");
            btn.setIcon(hbox.getVisible() === false ? "sap-icon://expand-all" : "sap-icon://collapse-all");
        },

        onMultiInputWithEmployeeValuePress: function () {
            if (!this.oEmployeeMultiSelectionValueHelp) {
                this.oEmployeeMultiSelectionValueHelp = new EmployeeDialog({
                    title: "Choose Employees",
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2100")
                        ]
                    }
                });
                this.oEmployeeMultiSelectionValueHelp.attachEvent("apply", function (oEvent) {
                    var defToken = this.byId("multiInputWithEmployeeValueHelp").getTokens();
                    this.byId("multiInputWithEmployeeValueHelp").setTokens(oEvent.getSource().getTokens());

                    var afterToken = oEvent.getSource().getTokens();
                    var selectedItems = oEvent.getParameter("items");
                    //삭제
                    var tableItems = this.byId("managerListTable").getItems();
                    var resultDelete = defToken.filter(function (each1) {
                        return selectedItems.every(function (each2) {
                            return each1.getProperty("key") !== each2.employee_number;
                        });
                    });
                    resultDelete.forEach(function (deleteItem) {
                        tableItems.forEach(function (tableItem) {
                            if (tableItem.getBindingContext().getProperty("employee_number") === deleteItem.getProperty("key")) {
                                tableItem.getAggregation("cells")[0].setIcon("sap-icon://decline");
                            }
                        });

                    });

                    //생성
                    var resultAdd = selectedItems.filter(function (each1) {
                        return defToken.every(function (each2) {
                            return each1.employee_number !== each2.getProperty("key");
                        });
                    });

                    resultAdd.forEach(function (item) {
                        var segmentItemYes = new sap.m.SegmentedButtonItem({ text: "Yes", key: "Yes" });
                        var segmentItemNo = new sap.m.SegmentedButtonItem({ text: "No", key: "No" });
                        var lisItemForTable = new sap.m.ColumnListItem({
                            cells: [
                                new sap.m.ObjectStatus({
                                    icon: "sap-icon://add"
                                }),
                                // @ts-ignore
                                new sap.m.Text({
                                    text: item.user_local_name
                                }),
                                // @ts-ignore
                                new sap.m.Text({
                                    text: ""
                                }),
                                // @ts-ignore
                                new sap.m.Text({
                                    text: ""
                                }),
                                // @ts-ignore
                                new sap.m.Text({
                                    text: item.department_id
                                }),
                                new sap.m.SegmentedButton({
                                    items: [segmentItemYes, segmentItemNo],
                                    selectedKey: "No"
                                })
                            ]

                        });
                        var managerObj = {
                            tenant_id: "L2100",
                            scenario_number: this.scenario_number,
                            employee_number: item.employee_number,
                            employee_name: "No",
                            job_title: new Date(),
                            mobile_phone_number: "",
                            department_id: "",
                            monitoring_super_authority_flag: false,
                            local_update_dtm: "2021-01-15T16:28:03Z",
                            create_user_id: "Admin",
                            update_user_id: "Admin",
                            system_create_dtm: "2021-01-15T16:28:03Z",
                            system_update_dtm: "2021-01-15T16:28:03Z"

                        }
                        var retContext = this.getView().getModel().createEntry("/TaskMonitoringManagerView", {
                            properties: managerObj,
                            success: function () { },
                            error: function () { }
                        });

                        this.byId("managerListTable").addItem(lisItemForTable);
                        lisItemForTable.setBindingContext(retContext);

                    }.bind(this));

                }.bind(this));
            }
            this.oEmployeeMultiSelectionValueHelp.open();
            this.oEmployeeMultiSelectionValueHelp.setTokens(this.byId("multiInputWithEmployeeValueHelp").getTokens());
        }
        // onTokenUpdate: function (oEvent) {
        //     var removedTokens = oEvent.getParameter("removedTokens");
        //     var tableItems = this.byId("managerListTable").getItems();

        //     tableItems.forEach(function (tableItem) {
        //         if (tableItem.getBindingContext().getProperty("employee_number") === removedTokens.getProperty("key")) {
        //             if (tableItem.getAggregation("cells")[0].getIcon() === "sap-icon://add") {
        //                 tableItem.getAggregation("cells")[0].setIcon("sap-icon://decline");
        //             }

        //         }
        //     });

        // }

    });
});