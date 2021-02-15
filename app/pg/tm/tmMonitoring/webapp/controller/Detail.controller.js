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
    "cm/util/control/ui/EmployeeDialog",

], function (BaseController, History, MessageBox, MessageToast, Filter, FilterOperator, FilterType, Sorter, JSONModel, ColumnListItem, Fragment, TransactionManager, Formatter, Validator, Multilingual, ManagedModel, ManagedListModel, EmployeeDialog) {
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

            //return Model
            var returnData = {
                data: {
                    return_code: "",
                    return_msg: ""
                }
            };
            var returnModel = new JSONModel(returnData);
            this.setModel(returnModel, "returnModel");

            //DetailMatched
            var oOwnerComponent = this.getOwnerComponent();
            this.oRouter = oOwnerComponent.getRouter();
            this.oRouter.getRoute("detail").attachPatternMatched(this._onDetailMatched, this);

            //지표 테이블 edit/show 모드 설정
            this._initTableTemplates();


            // I18N 모델 
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            i18nModel = this.getModel("I18N");
            //master
            this.setModel(new JSONModel(), "masterModel");
            //manager model
            this.setModel(new JSONModel(), "managerModel");


        },

        _onDetailMatched: function (oEvent) {
            var oView = this.getView();
            this.scenario_number = oEvent.getParameter("arguments")["scenario_number"],
                this.tenant_id = oEvent.getParameter("arguments")["tenant_id"],
                this.company_code = oEvent.getParameter("arguments")["company_code"],
                this.bizunit_code = oEvent.getParameter("arguments")["bizunit_code"],
                this.manager = oEvent.getParameter("arguments")["manager"],
                this.manager_local_name = oEvent.getParameter("arguments")["manager_local_name"];

            //validator 초기화
            this.validator.clearValueState(this.byId("simpleform_edit"));

            if (this.scenario_number === "New") {
                this.getModel("DetailView").setProperty("/isEditMode", true);
                this.getModel("DetailView").setProperty("/isCreate", true);

                this.getModel("masterModel").setData({});
                this.getModel("managerModel").setData({});
                this.byId("multiInputWithEmployeeValueHelp").removeAllTokens();
                this.removeRichTextEditorValue();
                this._toEditMode();

            } else {
                this.getModel("DetailView").setProperty("/isEditMode", false);
                this.getModel("DetailView").setProperty("/isCreate", false);
                var scenario_number = this.scenario_number + "l";
                this.bindPath = "/TaskMonitoringMasterView(scenario_number=" + scenario_number + ",tenant_id='" + this.tenant_id + "',company_code='" + this.company_code + "',bizunit_code='" + this.bizunit_code + "')";
                // oView.bindElement(this.bindPath);
                var masterData = this.getModel().getProperty(this.bindPath)
                this.getModel("masterModel").setData({ masterData });


                //담당자 조회
                var aFilters = [
                    new Filter("tenant_id", FilterOperator.Contains, this.tenant_id),
                    new Filter("scenario_number", FilterOperator.EQ, this.scenario_number)
                ];
                this.getOwnerComponent().getModel().read("/TaskMonitoringManagerView", {
                    filters: aFilters,
                    success: function (data) {
                        if (data && data.results) {
                            this.getModel("managerModel").setProperty("/manager", data.results);
                        }
                    }.bind(this),
                    error: function (data) {
                        console.log("error", data);
                    }
                });

                var managerNames = this.manager_local_name.split(';');
                var managerCodes = this.manager.split(';');
                var oTokens = [];
                if (managerNames[0] !== " ") {
                    for (var i = 0; i < managerNames.length; i++) {
                        // @ts-ignore
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

                this._toShowMode();

                oView.getModel().read("/TaskMonitoringMaster(tenant_id='" + this.tenant_id + "',scenario_number=" + this.scenario_number + "l" + ")", {
                    success: function (oData) {
                        this.detailData = oData;
                        this.byId("reMonitoringPurpose").setValue(decodeURIComponent(escape(window.atob(this.detailData.monitoring_purpose))));
                        this.byId("reMonitoringScenario").setValue(decodeURIComponent(escape(window.atob(this.detailData.scenario_desc))));
                        this.byId("reSourceSystemDetail").setValue(decodeURIComponent(escape(window.atob(this.detailData.source_system_desc))));

                    }.bind(this),
                    error: function () {

                    }
                });

            }

        },

        removeRichTextEditorValue: function () {
            this._richTextEditorDefaultSetting("reMonitoringPurpose");
            this._richTextEditorDefaultSetting("reMonitoringScenario");
            this._richTextEditorDefaultSetting("reSourceSystemDetail");
            this.byId("reMonitoringPurpose").setValue("");
            this.byId("reMonitoringScenario").setValue("");
            this.byId("reSourceSystemDetail").setValue("");
        },

        // removeFormattedTextValue: function () {
        //     this.byId("PurposeFormattedText").setHtmlText("");
        //     this.byId("ScenarioDescFormattedText").setHtmlText("");
        //     this.byId("ReSourceSystemFormattedText").setHtmlText("");
        // },

        _richTextEditorDefaultSetting: function (Id) {
            var fontId = this.byId(Id).getAggregation("_toolbarWrapper").getAggregation("_toolbar").getAggregation("content")[5].getId();
            this.byId(Id).getAggregation("_toolbarWrapper").getAggregation("_toolbar").getAggregation("content")[5].setSelectedItemId(fontId + "Verdana");
            var fontSizeId = this.byId(Id).getAggregation("_toolbarWrapper").getAggregation("_toolbar").getAggregation("content")[6].getId();
            this.byId(Id).getAggregation("_toolbarWrapper").getAggregation("_toolbar").getAggregation("content")[6].setSelectedItemId(fontSizeId + "2");
            this.byId(Id).getAggregation("_toolbarWrapper").getAggregation("_toolbar").getAggregation("content")[7].setIconColor("black");
            this.byId(Id).getAggregation("_toolbarWrapper").getAggregation("_toolbar").getAggregation("content")[8].getAggregation("_textButton")._image.setColor("white")

        },

        /**
         * signalList Insert Data(Items)
         * signalList Row Insert
         * Note: sid 및 value 값 수정 필요 
         * Odata 바인딩 작업시 변경이 필요할수 있음
         * @public
         */
        // @ts-ignore
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
                        //필수입력항목 검사
                        if (that.validator.validate(that.byId("simpleform_edit")) !== true) {
                            MessageToast.show(i18nModel.getText("/ECM01002"));
                            return;
                        }
                        that._CallUpsertProc();
                    }

                }
            });

        },


        htmlEncoding: function (value) {
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
                this.getView().getModel().refresh(true);
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
                            // that._resetView();

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
            var company_combo = this.byId("company_edit_combo");                            //법인  
            // @ts-ignore
            var bizunit_combo = this.byId("bizunit_edit_combo");                          //사업본부
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
                }),
                templateShareable: true
            });
            bizunit_combo.bindAggregation("items", {
                path: "/OrgUnitView",
                sorter: bizunitSorter,
                filters: aFiltersComboBox,
                // @ts-ignore
                template: new sap.ui.core.Item({
                    key: "{bizunit_code}",
                    text: "{bizunit_name}",
                }),
                templateShareable: true
            });
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
                            var empNo = oItems[i].getAggregation("cells")[1].getProperty("text");
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
         * Cancel 버튼 
         * @public
         */
        onPageCancelEditButtonPress: function () {
            this.onNavToBack();
        },

        /**
         * Edit 버튼 
         * Edit모드로 변경
         * @public
         */
        onPageEditButtonPress: function () {
            this._toEditMode();
        },

        // //view에 있는 value reset
        // _resetView: function () {
        //     //담당자 multiInput reset
        //     this.byId("multiInputWithEmployeeValueHelp").removeAllTokens();
        //     //richTextEditorValue reset
        //     this.removeRichTextEditorValue();
        //     this.removeFormattedTextValue();
        //     //refresh
        //     this.getView().getModel().refresh();
        //     //담당자 테이블
        //     this.byId("managerListTable").getBinding("items").filter(new Filter("employee_number", FilterOperator.Contains, " "));
        //     //tokens remove
        //     this.byId("combo_purchasing_type").removeAllSelectedItems();
        //     this.byId("company_edit_combo").removeAllSelectedItems();
        //     this.byId("bizunit_edit_combo").removeAllSelectedItems();
        //     this.byId("multiInputWithEmployeeValueHelp").removeAllTokens();
        //     this.byId("multicombo_cycle").removeAllSelectedItems();

        // },

        /**
        * Edit모드일 때 설정 
        */
        _toEditMode: function () {

            this.getModel("DetailView").setProperty("/isEditMode", true);
            // this._showFormFragment('Detail_Edit');
            // this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("page").setProperty("showFooter", true);
            this.byId("managerListTable").setMode(sap.m.ListMode.MultiSelect);
            this.byId("signalList").setMode(sap.m.ListMode.MultiSelect);
            this._bindMidTable(this.oEditableTemplate, "Edit");

        },

        /**
         * Show모드일 때 설정 
         */
        _toShowMode: function () {
            this.getModel("DetailView").setProperty("/isEditMode", false);
            // this._showFormFragment('Detail_Show');
            // this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("page").setProperty("showFooter", true);
            // signal table
            this._bindMidTable(this.oReadOnlyTemplate, "Navigation");
            this.byId("signalList").setMode(sap.m.ListMode.None);
            // 담당자 table
            this.byId("managerListTable").setMode(sap.m.ListMode.None);

        },

        /**
        * signal 테이블 template 
        */
        _initTableTemplates: function () {
            var that = this;
            //지표 테이블
            this.oReadOnlyTemplate = new ColumnListItem({
                cells: [
                    // @ts-ignore
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
                    // @ts-ignore
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
                            var status = oEvent.getSource().getParent().getAggregation("cells")[0].getIcon();
                            if (status !== "sap-icon://add") {
                                oEvent.getSource().getParent().getAggregation("cells")[0].setIcon("sap-icon://accept");
                            }


                        }
                    }),
                    // @ts-ignore
                    new sap.m.Input({
                        width: "80%",
                        type: "Text",
                        value: "{monitoring_indicator_start_value}",
                        liveChange: function (oEvent) {
                            if (status !== "sap-icon://add") {
                                oEvent.getSource().getParent().getAggregation("cells")[0].setIcon("sap-icon://accept");
                            }

                        }
                    }),
                    // @ts-ignore
                    new sap.m.Input({
                        width: "80%",
                        type: "Text",
                        value: "{monitoring_indicator_last_value}",
                        liveChange: function (oEvent) {
                            if (status !== "sap-icon://add") {
                                oEvent.getSource().getParent().getAggregation("cells")[0].setIcon("sap-icon://accept");
                            }


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
                            if (status !== "sap-icon://add") {
                                oEvent.getSource().getParent().getAggregation("cells")[0].setIcon("sap-icon://accept");
                            }


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
                            if (status !== "sap-icon://add") {
                                oEvent.getSource().getParent().getAggregation("cells")[0].setIcon("sap-icon://accept");
                            }

                        }
                        // ,
                        // required: true
                    }),
                ]

            });


        },

        onChangeAuthorityFlag: function (oEvent) {
            var status = oEvent.getSource().getParent().getAggregation("cells")[0].getIcon();
            if (status !== "sap-icon://add") {
                oEvent.getSource().getParent().getAggregation("cells")[0].setIcon("sap-icon://accept");
            }
            if (oEvent.getSource().getSelectedKey() === "TKMTINC002") {
                oEvent.getSource().getParent().getAggregation("cells")[6].setSelectedKey("%");
            } else if (oEvent.getSource().getSelectedKey() === "TKMTINC001") {
                oEvent.getSource().getParent().getAggregation("cells")[6].setSelectedKey("COUNT");
            }

        },
        /**
        * 지표 테이블, 담당자 테이블 bindItems
        */
        _bindMidTable: function (oTemplate, sKeyboardMode) {
            if (this.getModel("DetailView").getProperty("/isCreate") === false) {
                var aFilters = [
                    new Filter("tenant_id", FilterOperator.Contains, this.tenant_id),
                    new Filter("scenario_number", FilterOperator.EQ, this.scenario_number)
                ];
            }
            this.setModel(new JSONModel, "signalModel");
            this.getModel("signalModel").setProperty("/signalData");
            this.byId("signalList").bindItems({
                path: "signalModel>/signalData",
                filters: aFilters,
                template: oTemplate
            }).setKeyboardMode(sKeyboardMode);

        },

        /**
        * Detail_Edit, Detail_Show Fragment load 
        */

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
        //             name: "pg.tm.tmMonitoring.view." + sFragmentName,
        //             controller: this
        //         }).then(function (oFragment) {
        //             this._oFragments[sFragmentName] = oFragment;
        //             if (oHandler) oHandler(oFragment);
        //         }.bind(this));

        //     } else {
        //         if (oHandler) oHandler(this._oFragments[sFragmentName]);
        //     }
        // },

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
                // @ts-ignore
                this.oEmployeeMultiSelectionValueHelp.attachEvent("apply", function (oEvent) {
                    var defToken = this.byId("multiInputWithEmployeeValueHelp").getTokens();
                    this.byId("multiInputWithEmployeeValueHelp").setTokens(oEvent.getSource().getTokens());
                    // var that = this;
                    var oTable = oEvent.getSource().oDialog.oTable;
                    var selectedIndices = oTable.getSelectedIndices();

                    var selectedEntries = [];
                    var tableData = oTable.getModel().getData();
                    for (var index = 0; index < selectedIndices.length; index++) {
                        var tableIndex = selectedIndices[index];
                        var tableRow = tableData[tableIndex];
                        selectedEntries.push(tableRow);
                    }

                    // @ts-ignore
                    var afterToken = oEvent.getSource().getTokens();
                    //삭제
                    var manager_table = this.byId("managerListTable");
                    var tableItems = this.byId("managerListTable").getItems();
                    var resultDelete = defToken.filter(function (each1) {
                        return afterToken.every(function (each2) {
                            return each1.getProperty("key") !== each2.getProperty("key");
                        });
                    });

                    resultDelete.forEach(function (deleteItem) {
                        tableItems.forEach(function (tableItem) {
                            if (tableItem.getAggregation("cells")[1].getProperty("text") === deleteItem.getProperty("key")) {
                                if (tableItem.getAggregation("cells")[0].getIcon() === "sap-icon://add") {
                                    manager_table.removeItem(tableItem);
                                } else {
                                    tableItem.getAggregation("cells")[0].setIcon("sap-icon://decline");
                                }
                            }
                        });

                    });

                    //생성
                    var resultAdd = selectedEntries.filter(function (each1) {
                        return defToken.every(function (each2) {
                            return each1.employee_number !== each2.getProperty("key");
                        });
                    });
                    var that = this;
                    resultAdd.forEach(function (item) {
                        // @ts-ignore
                        var segmentItemYes = new sap.m.SegmentedButtonItem({ text: "Yes", key: "Yes" });
                        // @ts-ignore
                        var segmentItemNo = new sap.m.SegmentedButtonItem({ text: "No", key: "No" });
                        // @ts-ignore
                        var lisItemForTable = new sap.m.ColumnListItem({
                            cells: [
                                // @ts-ignore
                                new sap.m.ObjectStatus({
                                    icon: "sap-icon://add"
                                }),
                                //사번
                                // @ts-ignore
                                new sap.m.Text({
                                    text: item.employee_number
                                }),
                                // @ts-ignore
                                new sap.m.Text({
                                    text: item.user_local_name
                                }),
                                // @ts-ignore
                                new sap.m.Text({
                                    text: item.email_id
                                }),
                                // @ts-ignore
                                new sap.m.Text({
                                    text: item.department_local_name
                                }),
                                // @ts-ignore
                                new sap.m.Text({
                                    text: item.job_title
                                }),
                                new sap.m.Text({
                                    text: ""
                                }),
                                // @ts-ignore
                                new sap.m.SegmentedButton({
                                    items: [segmentItemYes, segmentItemNo],
                                    selectedKey: "No"
                                })
                            ]

                        });

                        that.byId("managerListTable").addItem(lisItemForTable);

                    });

                }.bind(this));
            }
            this.oEmployeeMultiSelectionValueHelp.open();
            this.oEmployeeMultiSelectionValueHelp.setTokens(this.byId("multiInputWithEmployeeValueHelp").getTokens());
        },
        //담당자 token 삭제
        onTokenUpdate: function (oEvent) {
            var removedTokens = oEvent.getParameter("removedTokens");
            var tableItems = this.byId("managerListTable").getItems();
            var that = this;
            tableItems.forEach(function (tableItem) {
                if (tableItem.getAggregation("cells")[1].getProperty("text") === removedTokens[0].getProperty("key")) {
                    if (tableItem.getAggregation("cells")[0].getIcon() === "sap-icon://add") {
                        that.byId("managerListTable").removeItem(tableItem);
                    }
                    tableItem.getAggregation("cells")[0].setIcon("sap-icon://decline");
                }
            });

        },

        //모니터링 시나리오 Delete 버튼
        onPressDelete: function () {
            var that = this;
            MessageBox.confirm(i18nModel.getText("/NCM00003"), {
                title: i18nModel.getText("/CONFIRM"),
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        that._CallDeleteProc();
                    } else if (sButton === MessageBox.Action.CANCEL) {
                        return;
                    };
                }
            });
        },

        //Delete 프로시저 호출
        _CallDeleteProc: function () {
            //return model
            var that = this;
            var oModel = this.getView().getModel();
            var oView = this.getView(),
                v_returnModel,
                urlInfo = "srv-api/odata/v4/pg.TaskMonitoringV4Service/deleteTaskMonitoringMasterProc"; // delete
            var inputInfo =
            {
                "InputData": [
                    { "tenant_id": this.tenant_id, "scenario_number": Number(this.scenario_number) }
                ]
            };
            // console.log(inputInfo);
            $.ajax({
                url: urlInfo,
                type: "POST",
                data: JSON.stringify(inputInfo),
                contentType: "application/json",
                success: function (data) {
                    sap.m.MessageToast.show(i18nModel.getText("/NCM01002"));
                    that.getRouter().navTo("main", {}, true);
                   
                    // that._resetView();
                    //refresh
                    oModel.refresh(true);
                    // console.log('data:', data);
                },
                error: function (e) {
                    sap.m.MessageToast.show(i18nModel.getText("/EPG00001"));
                    v_returnModel = oView.getModel("returnModel").getData().data;
                    console.log('v_returnModel_e:', v_returnModel);
                }
            });

        },

        //Upsert 프로시저 호출
        _CallUpsertProc: function () {
            var oView = this.getView(),
                oModel = oView.getModel(),
                that = this,
                v_returnModel,
                oBundle = this.getView().getModel("i18n").getResourceBundle(),
                urlInfo = "srv-api/odata/v4/pg.TaskMonitoringV4Service/upsertTaskMonitoringMasterProc"; // upsert Proc
            //richTextEditor
            var monitoringPurposeValue = this.byId("reMonitoringPurpose").getValue(),
                scenarioDescValue = this.byId("reMonitoringScenario").getValue(),
                sourceSystemDescValue = this.byId("reSourceSystemDetail").getValue(),
                language_code = ["KO", "EN"];
            if (this.scenario_number !== "New") {
                var scenario_number = Number(this.scenario_number);
            } else {
                scenario_number = null
            }
            // 마스터 
            var masterObj = {
                "tenant_id": "L2100",
                "scenario_number": scenario_number,
                "monitoring_type_code": this.byId("combo_monitoring_type").getSelectedKey(),
                "activate_flag": this.byId("segmentButton_activate").getSelectedKey() === 'Yes' ? true : false,
                "monitoring_purpose": this.htmlEncoding(monitoringPurposeValue),
                "scenario_desc": this.htmlEncoding(scenarioDescValue),
                "source_system_desc": this.htmlEncoding(sourceSystemDescValue),
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date(),
                "create_user_id": "Admin",
                "update_user_id": "Admin",
                "system_create_dtm": new Date(),
                "system_update_dtm": new Date()
            };
            //시나리오
            var scenarioArr = [];
            for (var code of language_code) {
                var scenarioObj = {
                    "tenant_id": "L2100",
                    "scenario_number": scenario_number,
                    "language_code": code,
                    "scenario_name": this.byId("Input_scenarioName").getValue(),
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date(),
                    "create_user_id": "Admin",
                    "update_user_id": "Admin",
                    "system_create_dtm": new Date(),
                    "system_update_dtm": new Date()
                };
                scenarioArr.push(scenarioObj);
            }
            //구매유형 
            var purchasing_types = this.byId("combo_purchasing_type").getSelectedItems(),
                purchasingTypeArr = [];
            purchasing_types.forEach(function (type) {
                for (code of language_code) {
                    var purchasingTypeObj = {
                        "tenant_id": "L2100",
                        "scenario_number": scenario_number,
                        "monitoring_purchasing_type_code": type.getProperty("key"),
                        "language_code": code,
                        "monitoring_purchasing_type_name": type.getProperty("text"),
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date(),
                        "create_user_id": "Admin",
                        "update_user_id": "Admin",
                        "system_create_dtm": new Date(),
                        "system_update_dtm": new Date()
                    };
                    purchasingTypeArr.push(purchasingTypeObj);
                }
            });
            //법인 
            var companyCodes = this.byId("company_edit_combo").getSelectedKeys(),
                companyArr = [];
            companyCodes.forEach(function (code) {
                var companyObj = {
                    "tenant_id": "L2100",
                    "scenario_number": scenario_number,
                    "company_code": code,
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date(),
                    "create_user_id": "Admin",
                    "update_user_id": "Admin",
                    "system_create_dtm": new Date(),
                    "system_update_dtm": new Date()
                };
                companyArr.push(companyObj);
            });
            //사업본부 
            // @ts-ignore
            var bizunitCodes = this.byId("bizunit_edit_combo").getSelectedKeys(),
                bizunitArr = [];
            for (code of bizunitCodes) {
                var bizunitObj = {
                    "tenant_id": "L2100",
                    "scenario_number": scenario_number,
                    "bizunit_code": code,
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date(),
                    "create_user_id": "Admin",
                    "update_user_id": "Admin",
                    "system_create_dtm": new Date(),
                    "system_update_dtm": new Date()
                };
                bizunitArr.push(bizunitObj);
            }
            //구분 
            var TypeArr = [];
            for (code of language_code) {
                var typeObj = {
                    "tenant_id": "L2100",
                    "scenario_number": scenario_number,
                    "monitoring_type_code": this.byId("combo_monitoring_type").getSelectedKey(),
                    "language_code": code,
                    "monitoring_type_name": this.byId("combo_monitoring_type").getValue(),
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date(),
                    "create_user_id": "Admin",
                    "update_user_id": "Admin",
                    "system_create_dtm": new Date(),
                    "system_update_dtm": new Date()
                };
                TypeArr.push(typeObj);
            }
            //담당자
            var managerTableItems = this.byId("managerListTable").getItems(),
                managerArr = [];
            for (var m = 0; m < managerTableItems.length; m++) {
                var statusIcon = managerTableItems[m].getAggregation("cells")[0].getIcon(),
                    managerNo = managerTableItems[m].getAggregation("cells")[1].getProperty("text"),
                    authorityFlagValue = managerTableItems[m].getAggregation("cells")[7].getSelectedKey();
                if (statusIcon !== "sap-icon://decline") {
                    var managerCreateObj = {
                        "tenant_id": "L2100",
                        "scenario_number": scenario_number,
                        "monitoring_manager_empno": managerNo,
                        "monitoring_super_authority_flag": authorityFlagValue === 'Yes' ? true : false,
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date(),
                        "create_user_id": "Admin",
                        "update_user_id": "Admin",
                        "system_create_dtm": new Date(),
                        "system_update_dtm": new Date()
                    };
                    managerArr.push(managerCreateObj);
                }
            };
            //운영방식
            var operationModeArr = [],
                search_flag = {},
                calling_flag = {},
                alarm_flag = {},
                operationDataArr = [];
            if (this.byId("search_flag").getSelected() === true) {
                search_flag.operation_mode_code = "TKMTOMC001";
                search_flag.operation_mode_name = "조회";
                operationModeArr.push(search_flag);
            }
            if (this.byId("calling_flag").getSelected() === true) {
                calling_flag.operation_mode_code = "TKMTOMC002";
                calling_flag.operation_mode_name = "소명";
                operationModeArr.push(calling_flag);
            }
            if (this.byId("alarm_flag").getSelected() === true) {
                alarm_flag.operation_mode_code = "TKMTOMC003";
                alarm_flag.operation_mode_name = "알람";
                operationModeArr.push(alarm_flag);
            }

            operationModeArr.forEach(function (operationMode) {
                for (var code of language_code) {
                    var operationObj = {
                        "tenant_id": "L2100",
                        "scenario_number": scenario_number,
                        "monitoring_operation_mode_code": operationMode.operation_mode_code,
                        "language_code": code,
                        "monitoring_operation_mode_name": operationMode.operation_mode_name,
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date(),
                        "create_user_id": "Admin",
                        "update_user_id": "Admin",
                        "system_create_dtm": new Date(),
                        "system_update_dtm": new Date()
                    }
                    operationDataArr.push(operationObj);
                }
            });

            var inputInfo = {
                "InputData":
                {
                    "tenant_id": "L2100",
                    "sourceMaster": [masterObj],
                    "sourceScenario": scenarioArr,
                    "sourceCompany": companyArr,
                    "sourceBizunit": bizunitArr,
                    "sourcePurchasingType": purchasingTypeArr,
                    "sourceTypeCode": TypeArr,
                    "sourceManager": managerArr,
                    "sourceOperation": operationDataArr
                }
            };
            // console.log(inputInfo);

            $.ajax({
                url: urlInfo,
                type: "POST",
                data: JSON.stringify(inputInfo),
                contentType: "application/json",
                success: function (data) {
                    sap.m.MessageToast.show(i18nModel.getText("/NCM01001"));
                    that.getRouter().navTo("main", {}, true);
                    oModel.refresh(true);
                     oView.getModel("managerModel").refresh(true);
                    // that._resetView();
                    // console.log('data:', data);
                },
                error: function (e) {
                    sap.m.MessageToast.show(i18nModel.getText("/EPG00003"));
                    var v_returnModel = oView.getModel("returnModel").getData().data;
                    // console.log('v_returnModel_e:', v_returnModel);
                }
            });
        }


    });
});