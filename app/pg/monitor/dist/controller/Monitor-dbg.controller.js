/**
 * 작성일 : 2020.11.11
 * 화면ID : 
 */


// @ts-ignore
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    'sap/m/MessageStrip',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "pg/monitor/controller/BaseController"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, Filter, FilterOperator, FilterType, MessageStrip, MessageBox, MessageToast, BaseController) {
        "use strict";

        return BaseController.extend("pg.monitor.controller.Monitor", {
            onInit: function () {

                // comparisonChart JSON Model
                var chartData = {
                    "OperationCNT": [
                        {
                            title: "소명",
                            value: 23
                        },
                        {
                            title: "알람",
                            value: 34,
                        },
                        {
                            title: "조회",
                            value: 20
                        }
                    ],
                    "ColumnMicroChart": [
                        {
                            type: "원재료",
                            value: 10
                        },
                        {
                            type: "설비",
                            value: 20
                        },
                        {
                            type: "본사",
                            value: 5
                        }
                    ]

                };
                // @ts-ignore
                var chartModel = new sap.ui.model.json.JSONModel(chartData);
                this.getView().byId("comChart").setModel(chartModel, "chartModel");
                this.getView().byId("columnChart").setModel(chartModel, "chartModel");

                var sPath = "/MonitoringMasterView/$count";
                var oModel = this.getView().getModel();
                var nemeric = this.getView().byId("numeric");
                oModel.read(sPath, {
                    success: function (oData, oResponse) {
                        var count = oData;
                        nemeric.setValue(count);
                    },
                    error: function (oError) { /* do something */ }
                });
            },

            /**
             * 미니차트 표시 버튼 press event
             * @public
             */
            onPress_ShowingPanel: function () {
                var hLayout = this.getView().byId("h_layout"); //panel control
                hLayout.setVisible(!hLayout.getVisible());
                // 버튼 text 변경 ( panel visible : 미니차트 숨기기 | panel unvisible : 미니차트 표시 )
                var btn = this.getView().byId("btn_showChart");
                btn.setText(hLayout.getVisible() === false ? "Show MiniCharts" : "Hide MiniCharts");
            },

            /**
            * export Excel
            * @public
            */
            onBeforeExport: function (oEvt) {
                var mExcelSettings = oEvt.getParameter("exportSettings");

                // Disable Worker as Mockserver is used in Demokit sample
                mExcelSettings.worker = false;
            },

            /** table sort dialog 
             * @public
             */
            onSort: function () {
                var oSmartTable = this._getSmartTable();
                if (oSmartTable) {
                    oSmartTable.openPersonalisationDialog("Sort");
                }
            },

            /** table filter dialog 
            * @public
            */
            onFilter: function () {
                var oSmartTable = this._getSmartTable();
                if (oSmartTable) {
                    oSmartTable.openPersonalisationDialog("Filter");
                }
            },

            /** table group dialog
             * @public
             */
            onGroup: function () {
                var oSmartTable = this._getSmartTable();
                if (oSmartTable) {
                    oSmartTable.openPersonalisationDialog("Group");
                }
            },

            /** table columns dialog
             * @public 
             */
            onColumns: function () {
                var oSmartTable = this._getSmartTable();
                if (oSmartTable) {
                    oSmartTable.openPersonalisationDialog("Columns");
                }
            },

            /** table columns dialog
            * @private 
            */
            _getSmartTable: function () {
                if (!this._oSmartTable) {
                    this._oSmartTable = this.getView().byId("LineItemsSmartTable");
                }
                return this._oSmartTable;
            },

            /** smart filter에서 항목 콤보박스 선택항목 변경시 항목값 multiInput 바인딩 변경
             * @public 
             */
            onPressCategory: function (oEvent) {
                var combo = this.getView().byId("distribution_combo");
                var multiInput = this.getView().byId("distribution_input");
                var value = oEvent.getSource().getProperty("value");
                if (value === "구분") {
                    multiInput.bindAggregation("suggestionItems", {
                        path: "/Products",
                        // @ts-ignore
                        template: new sap.ui.core.Item({
                            key: "{ProductID}",
                            text: "{ProductID}"
                        })
                    });
                } else if (value === "시나리오") {
                    multiInput.bindAggregation("suggestionItems", {
                        path: "/Products",
                        // @ts-ignore
                        template: new sap.ui.core.Item({
                            key: "{SupplierID}",
                            text: "{SupplierID}"
                        })
                    });
                } else {
                    multiInput.bindAggregation("suggestionItems", {
                        path: "/Products",
                        // @ts-ignore
                        template: new sap.ui.core.Item({
                            key: "{UnitPrice}",
                            text: "{UnitPrice}"
                        })
                    });


                }
            },


            // onExit: function () {
            //     if (this._oPopover) {
            //         this._oPopover.destroy();
            //     }
            // },

            /** 운영방식별 generic tile popover press event
             * @public
             */
            onPopoverPress: function (oEvent) {
                var oTile = oEvent.getSource();
                if (!this._oPopover) {
                    Fragment.load({
                        name: "pg.test.view.Popover",
                        controller: this
                    }).then(function (oPopover) {
                        this._oPopover = oPopover;
                        this.getView().addDependent(this._oPopover);
                        this._oPopover.openBy(oTile);
                    }.bind(this));
                } else {
                    this._oPopover.openBy(oTile);
                }
            },

            /** popover close event
            * @public
            */
            onCloseButton: function (oEvent) {
                this._oPopover.close();
            },

            // _odataRead: function () {
            //     //count 값 조회
            //     var oModel = this.getView().getModel();
            //     // @ts-ignore
            //     var promise = jQuery.Deferred();
            //     oModel.read('/Products/$count', {
            //         success: function (odata, oResponse) {
            //             promise.resolve(odata);
            //         }.bind(this),
            //         error: function (cc, vv) {
            //             console.log('error');
            //         }
            //     });
            //     return promise;
            // },

            /** smart table 'beforeRebindTable' event(table filter)
             *  @public
             */
            onBeforeRebindTable: function (oEvent) {
                var mBindingParams = oEvent.getParameter("bindingParams");
                var oSmtFilter = this.getView().byId("smartFilterBar");             //smart filter
                var companyCombo = oSmtFilter.getControlByKey("company_combo");     //회사 콤보박스
                var corpCombo = oSmtFilter.getControlByKey("corp_combo");           //법인 콤보박스
                var businessCombo = oSmtFilter.getControlByKey("business_combo");   //사업본부 콤보박스

                //combobox value
                var companyValue = companyCombo.getValue();     //회사 콤보박스 value
                var corpValue = corpCombo.getValue();           //법인 콤보박스 value
                var businessValue = businessCombo.getValue();   //사업본부 콤보박스 value

                if (companyValue.length > 0) {
                    var companyFilter = new Filter("tenant_name", FilterOperator.EQ, companyValue);
                    mBindingParams.filters.push(companyFilter);
                }
                if (companyValue.length > 0) {
                    var corpFilter = new Filter("company_name", FilterOperator.EQ, corpValue);
                    mBindingParams.filters.push(companyFilter);
                }
                if (companyValue.length > 0) {
                    var businessFilter = new Filter("business_name", FilterOperator.EQ, companyValue);
                    mBindingParams.filters.push(companyFilter);

                }
                // if (corpValue.length > 0) {
                //     var corpFilter = new Filter("company_name", FilterOperator.EQ, corpValue);
                //     mBindingParams.filters.push(corpFilter);
                // }
                // if (businessValue.length > 0) {
                //     var businessFilter = new Filter("", FilterOperator.EQ, businessValue);
                //     mBindingParams.filters.push(businessFilter);
                // }
                // if (distriValue.length > 0) {
                //     var distriFilter = new Filter("", FilterOperator.EQ, distriValue);
                //     mBindingParams.filters.push(distriFilter);
                // }

            },

            /** Delete 버튼 event - 테이블에서 선택한 행 삭제 기능
             * @public
             */
            onDelete: function () {
                var oTable = this.getView().byId("MasterTable"); //마스터 테이블
                MessageBox.confirm("삭제하시겠습니까?", {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        if (sAction === MessageBox.Action.OK) {
                            var oItems = oTable.getSelectedItems();
                            for (var i = 0; i < oItems.length; i++) {
                                oTable.removeItem(oItems[i]);
                            }
                            MessageToast.show("삭제가 완료되었습니다.");
                        }

                    }
                });

            },

            /** Copy 버튼 event - 테이블에서 선택한 행 copy 기능
            * @public
            */
            onCopy: function () {
                var oTable = this.getView().byId("MasterTable"); //마스터 테이블
                var oItems = oTable.getSelectedItems();
                if (oItems.length > 1) {
                    MessageBox.warning("1개의 행만 선택해주세요.");
                }
            },
            //     _showMsgStrip: function () {
            //         // @ts-ignore
            //         var oMs = sap.ui.getCore().byId("msgStrip");

            //         if (oMs) {
            //             oMs.destroy();
            //         }
            //         this._generateMsgStrip();
            //     },
            //     _generateMsgStrip: function () {
            // 	// var aTypes = ["Information", "Warning", "Error", "Success"];
            // 	var	sText = "1개의 행만 선택해주세요.",
            // 		oVC = this.byId("oVerticalContent"),
            // 		oMsgStrip = new MessageStrip("msgStrip", {
            // 			text: sText,
            // 			showCloseButton: !(Math.round(Math.random())),
            // 			showIcon: !(Math.round(Math.random())),
            // 			type: "Warning"
            // 		});

            // 	this.oInvisibleMessage.announce("New Information Bar of type " + sType + " " + sText, InvisibleMessageMode.Assertive);
            // 	oVC.addContent(oMsgStrip);
            // }

            /** Register view로 Navigate 기능 
            * @public
            */
            onNavToRegister: function (oEvent) {
                // @ts-ignore
                //var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                // oRouter.navTo("New_KPI");
                var itemPath = oEvent.getSource().getBindingContext().getPath();
                // var oPressedItem = this.getView().getModel().getProperty(itemPath);
                // var id = oEvent.getSource().getBindingContext().getObject();
                // /MonitoringMasterView_02(scenario_code='S000000001',tenant_id='L2100',company_code='LGCKR')"
                var scenario_code = oEvent.getSource().getBindingContext().getProperty("scenario_code");
                var tenant_id = oEvent.getSource().getBindingContext().getProperty("tenant_id");
                var company_code = oEvent.getSource().getBindingContext().getProperty("company_code");
                this.getRouter().navTo("Register", {
                    scenario_code: "S000000001",
                    tenant_id: "L2100",
                    company_code: "LGCKR"
                });
            },
            onChangeCombo: function (oEvent) {
                var oSelectedkey = oEvent.getSource().getSelectedKey();
                var corp_combo = this.getView().byId("corp_combo");             //법인 
                var business_combo = this.getView().byId("business_combo");     //사업본부
                var oBindingComboBox = corp_combo.getBinding("items");
                var aFiltersComboBox = [];
                var oFilterComboBox = new sap.ui.model.Filter("tenant_id", "EQ", oSelectedkey);
                aFiltersComboBox.push(oFilterComboBox);
                // oBindingComboBox.filter(aFiltersComboBox);
                corp_combo.bindAggregation("items", {
                    path: "/OrgCompanyView",
                    filters: aFiltersComboBox,
                    // @ts-ignore
                    template: new sap.ui.core.Item({
                        key: "{company_code}",
                        text: "{company_name}"
                    })
                });
                business_combo.bindAggregation("items", {
                    path: "/OrgUnitView",
                    filters: aFiltersComboBox,
                    // @ts-ignore
                    template: new sap.ui.core.Item({
                        key: "{bizunit_code}",
                        text: "{bizunit_name}"
                    })
                });

            },

            onChangeCorpCombo: function (oEvent) {
                var oSelectedkey = this.getView().byId("company_combo").getSelectedKey();
                var business_combo = this.getView().byId("business_combo");
                var oBindingComboBox = business_combo.getBinding("items");
                var aFiltersComboBox = [];
                var oFilterComboBox = new sap.ui.model.Filter("tenant_id", "EQ", oSelectedkey);
                aFiltersComboBox.push(oFilterComboBox);
                // oBindingComboBox.filter(aFiltersComboBox);
                business_combo.bindAggregation("items", {
                    path: "/OrgUnitView",
                    filters: aFiltersComboBox,
                    // @ts-ignore
                    template: new sap.ui.core.Item({
                        key: "{bizunit_code}",
                        text: "{bizunit_name}"
                    })
                });
            },
            onChangeTenant: function (oEvent) {
                var tenant_id = oEvent.oSource.getSelectedItem().getBindingContexts();
                var company_combo = this.getView().byId("company_combo");
                var oBindingComboBox = company_combo.getBinding("items");
                var aFiltersComboBox = [];
                var oFilterComboBox = new sap.ui.model.Filter("tenant_id", "Contains", tenant_id);
                aFiltersComboBox.push(oFilterComboBox);
                oBindingComboBox.filter(aFiltersComboBox);
            }



        });
    });
