sap.ui.define([
    "./BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/ManagedListModel",
    "ext/lib/formatter/DateFormatter",
    "sap/m/TablePersoController",
    "./ApprovalListPersoService",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/Fragment',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Token",
    "sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    'sap/ui/core/Element',
    "sap/ui/core/syncStyleClass",
    'sap/m/Label',
    'sap/m/SearchField',
    "ext/lib/util/Multilingual",
], function (BaseController, History, JSONModel, ManagedListModel, DateFormatter, TablePersoController, ApprovalListPersoService, Filter, FilterOperator, Fragment, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Token, Input, ComboBox, Item, Element, syncStyleClass, Label, SearchField, Multilingual) {
    "use strict";
    /**
     * @description 품의 목록 (총 품의 공통)
     * @date 2020.11.19 
     * @author jinseon.lee , daun.lee 
     */
    var toggleButtonId = "";
    var dialogId = "";

    return BaseController.extend("dp.moldApprovalList.controller.ApprovalList", {

        dateFormatter: DateFormatter,
        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the approvalList controller is instantiated.
		 * @public
		 */
        onInit: function () {
            var oViewModel,
                oResourceBundle = this.getResourceBundle();

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                headerExpanded: true,
                approvalListTableTitle: oResourceBundle.getText("approvalListTableTitle"),
                tableNoDataText: oResourceBundle.getText("tableNoDataText")
            });
            this.setModel(oViewModel, "approvalListView");

            // Add the approvalList page to the flp routing history
            this.addHistoryEntry({
                title: oResourceBundle.getText("approvalListViewTitle"),
                icon: "sap-icon://table-view",
                intent: "#Template-display"
            }, true);

            this._doInitSearch();
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedListModel(), "list");
            this.setModel(new ManagedListModel(), "orgMap");

            this.getRouter().getRoute("approvalList").attachPatternMatched(this._onRoutedThisPage, this);

            this._doInitTablePerso();

        },

        _doInitTablePerso: function () {
            // init and activate controller
            this._oTPC = new TablePersoController({
                table: this.byId("mainTable"),
                componentName: "moldApprovalList",
                persoService: ApprovalListPersoService,
                hasGrouping: true
            }).activate();
        },
        /**
         * @private
         * @see init 이후 바로 실행됨
         */
        onAfterRendering: function () {
            this.getModel().setDeferredGroups(["delete"]);
            this.byId("pageSearchButton").firePress();
            return;
        },

        /**
         * @private
         * @see 검색을 위한 컨트롤에 대하여 필요 초기화를 진행 합니다. 
         */
        _doInitSearch: function () {
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S";

            this.getView().setModel(this.getOwnerComponent().getModel());

            /** Date */
            var today = new Date();

            this.getView().byId("searchRequestDateS").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90));
            this.getView().byId("searchRequestDateS").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
            this.getView().byId("searchRequestDateE").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90));
            this.getView().byId("searchRequestDateE").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
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
        onMainTableUpdateFinished: function (oEvent) {
            // update the approvalList's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("approvalListTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("approvalListTableTitle");
            }
            this.getModel("approvalListView").setProperty("/approvalListTableTitle", sTitle);
        },

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onMainTablePersoButtonPressed: function (oEvent) {
            this._oTPC.openDialog();
        },

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onMainTablePersoRefresh: function () {
            ApprovalListPersoService.resetPersData();
            this._oTPC.refresh();
        },

		/**
		 * Event handler when a table add button pressed
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
        onMainTableAddButtonPress: function () {
            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
            this.getRouter().navTo("midPage", {
                layout: oNextUIState.layout,
                tenantId: "new",
                controlOptionCode: "code"
            });
        },

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
        onPageSearchButtonPress: function (oEvent) {
            //console.log(oEvent.getParameters());
            var aSearchFilters = this._getSearchStates();
            this._applySearch(aSearchFilters);
        },

		/**
		 * Event handler when pressed the item of table 
         * @description 목록 클릭시 이벤트 
		 * @param {sap.ui.base.Event} oEvent 
		 * @public
		 */
        onMainTableItemPress: function (oEvent) {

            var sPath = oEvent.getSource().getBindingContext("list").getPath(),
                oRecord = this.getModel("list").getProperty(sPath);
            console.log("oRecord >>>  ", oRecord);
            var that = this;
            that.getRouter().navTo("pssaObject", {

            });
            // if (oRecord.mold_id % 3 == 0) {
            //     that.getRouter().navTo("pssaCreateObject", {
            //         company: "[LGEKR] LG Electronics Inc."
            //         , plant: "[DFZ] Washing Machine"
            //     });
            // } else if (oRecord.mold_id % 3 == 2) {

            // } else {
            //     that.getRouter().navTo("pssaCreateObject", {
            //         company: "[LGEKR] LG Electronics Inc."
            //         , plant: "[DFZ] Washing Machine"
            //     });
            // }

        },



        ///////////////////// Multi Combo box event Start //////////////////////////
        /**
        * @private 
        * @see (멀티박스)Company와 Plant 부분 연관성 포함함
        */
        handleSelectionFinishComp: function (oEvent) {

            this.copyMultiSelected(oEvent);

            var params = oEvent.getParameters();
            var plantFilters = [];

            if (params.selectedItems.length > 0) {

                params.selectedItems.forEach(function (item, idx, arr) {

                    plantFilters.push(new Filter({
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, 'L1100'),
                            new Filter("company_code", FilterOperator.EQ, item.getKey())
                        ],
                        and: true
                    }));
                });
            } else {
                plantFilters.push(new Filter("tenant_id", FilterOperator.EQ, 'L1100'));
            }

            var filter = new Filter({
                filters: plantFilters,
                and: false
            });

            this.getView().byId("searchPlantS").getBinding("items").filter(filter, "Application");
            this.getView().byId("searchPlantE").getBinding("items").filter(filter, "Application");
        },


        handleSelectionFinishDiv: function (oEvent) {
            this.copyMultiSelected(oEvent);
        },

        copyMultiSelected: function (oEvent) {
            var source = oEvent.getSource();
            var params = oEvent.getParameters();

            var id = source.sId.split('--')[2];
            var idPreFix = id.substr(0, id.length - 1);
            var selectedKeys = [];
            console.log(idPreFix);


            params.selectedItems.forEach(function (item, idx, arr) {
                console.log(item.getKey());
                selectedKeys.push(item.getKey());
            });

            this.getView().byId(idPreFix + "E").setSelectedKeys(selectedKeys);
            this.getView().byId(idPreFix + "S").setSelectedKeys(selectedKeys);
        },

        ///////////////////// Multi Combo box event End //////////////////////////

        ///////////////////// ValueHelpDialog section Start //////////////////////////

        onValueHelpRequested: function (oEvent) {


            var path = '';
            this._oValueHelpDialog = sap.ui.xmlfragment("dp.moldApprovalList.view.ValueHelpDialogApproval", this);

            this._oBasicSearchField = new SearchField({
                showSearchButton: false
            });

            var oFilterBar = this._oValueHelpDialog.getFilterBar();
            oFilterBar.setFilterBarExpanded(false);
            oFilterBar.setBasicSearch(this._oBasicSearchField);

            if (oEvent.getSource().sId.indexOf("searchModel") > -1) {
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

                path = '/Models';

                this._oValueHelpDialog.setTitle('Model');
                this._oValueHelpDialog.setKey('model');
                this._oValueHelpDialog.setDescriptionKey('model');

            } else if (oEvent.getSource().sId.indexOf("searchPart") > -1) {
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

                path = '/PartNumbers';

                this._oValueHelpDialog.setTitle('Part No');
                this._oValueHelpDialog.setKey('mold_number');
                this._oValueHelpDialog.setDescriptionKey('spec_name');

            } else if (oEvent.getSource().sId.indexOf("searchRequester") > -1) {

                this._oInputModel = this.getView().byId("searchRequester");

                this.oColModel = new JSONModel({
                    "cols": [
                        {
                            "label": "Name",
                            "template": "english_employee_name"
                        },
                        {
                            "label": "ID",
                            "template": "user_id"
                        }
                    ]
                });

                path = '/Requestors';
                this._oValueHelpDialog.setTitle('Requester');
                this._oValueHelpDialog.setKey('user_id');
                // this._oValueHelpDialog.setDescriptionKey('english_employee_name');
            }


            var aCols = this.oColModel.getData().cols;



            this.getView().addDependent(this._oValueHelpDialog);

            this._oValueHelpDialog.getTableAsync().then(function (oTable) {

                oTable.setModel(this.getOwnerComponent().getModel());
                oTable.setModel(this.oColModel, "columns");

                if (oTable.bindRows) {
                    console.log(" Table.bindRows >>> ", oTable.bindRows);
                    oTable.bindAggregation("rows", path);
                }
                
                if (oTable.bindItems) {
                    console.log(" oTable.bindItems >>> ", oTable.bindItems);
                    oTable.bindAggregation("items", path, function () {
                        return new ColumnListItem({
                            cells: aCols.map(function (column) {
                                return new Label({ text: "{" + column.template + "}" });
                            })
                        });
                    });
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
            var sSearchQuery = this._oBasicSearchField.getValue(),
                aSelectionSet = oEvent.getParameter("selectionSet");
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


            var _tempFilters = [];

            if (this._oValueHelpDialog.oRows.sPath.indexOf('/Models') > -1) {
                // /Models
                _tempFilters.push(new Filter("tolower(model)", FilterOperator.Contains, "'" + sSearchQuery.toLowerCase().replace("'", "''") + "'"));

            } else if (this._oValueHelpDialog.oRows.sPath.indexOf('/PartNumbers') > -1) {
                //PartNumbers
                _tempFilters.push(new Filter({ path: "tolower(part_number)", operator: FilterOperator.Contains, value1: "'" + sSearchQuery.toLowerCase() + "'" }));
                _tempFilters.push(new Filter({ path: "tolower(mold_item_type_name)", operator: FilterOperator.Contains, value1: "'" + sSearchQuery.toLowerCase() + "'" }));
                _tempFilters.push(new Filter({ path: "tolower(spec_name)", operator: FilterOperator.Contains, value1: "'" + sSearchQuery.toLowerCase() + "'" }));
            }

            aFilters.push(new Filter({
                filters: _tempFilters,
                and: false
            }));

            this._filterTable(new Filter({
                filters: aFilters,
                and: true
            }));
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

        ///////////////////// ValueHelpDialog section Start //////////////////////////

        ///////////////////// List create button pop up event Start //////////////////////////

        dialogChangeComp: function (oEvent) {

            this.copySelected(oEvent);

            var source = oEvent.getSource();
            var plantFilter = [];

            plantFilter.push(new Filter({
                filters: [
                    new Filter("tenant_id", FilterOperator.EQ, 'L1100'),
                    new Filter("company_code", FilterOperator.EQ, source.getSelectedKey())
                ],
                and: true
            }));


            var filter = new Filter({
                filters: plantFilter,
                and: false
            });

            this.getView().byId("searchPlantF").getBinding("items").filter(filter, "Application");
        },


        copySelected: function (oEvent) {
            var source = oEvent.getSource();
            var selectedKey = source.getSelectedKey();
            console.log(source.getSelectedKey());
            this.getView().byId("searchPlantF").setSelectedKey(selectedKey);
        },


        /**
        * @public
        * @see 사용처 DialogCreate Fragment Open 이벤트
        */
        onDialogCreate: function () {
            var oView = this.getView();

            if (!this.pDialog) {
                this.pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "dp.moldApprovalList.view.DialogCreate",
                    controller: this
                }).then(function (oDialog) {
                    // connect dialog to the root view of this component (models, lifecycle)
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this.pDialog.then(function (oDialog) {
                oDialog.open();
            });

        },


        /**
        * @public
        * @see 사용처 create 팝업에서 나머지 버튼 비활성화 시키는 작업수행
        */
        onToggleHandleChange: function (oEvent) {
            var groupId = this.getView().getControlsByFieldGroupId("toggleButtons");
            var isPressedId;
            isPressedId = oEvent.getSource().getId();
            toggleButtonId = isPressedId;
            for (var i = 0; i < groupId.length; i++) {
                if (groupId[i].getId() != isPressedId) {
                    groupId[i].setPressed(false);
                }
            }

        },

        /**
        * @public
        * @see 사용처 create 팝업에서 select 버튼 press시 Object로 이동
        */
        handleConfirm: function (targetControl) {

            var id = toggleButtonId.split('--')[2];
            var page = ""
            console.log(id);
            if (id != "") {
                if (id == "localBudget") {
                    page = "beaCreateObject"
                } else if (id == "supplierSelection") {
                    page = "pssaCreateObject"
                }
            }
            console.log("page >>>", page);

            var groupId = this.getView().getControlsByFieldGroupId("toggleButtons");
            for (var i = 0; i < groupId.length; i++) {
                if (groupId[i].getPressed() == true) {
                    console.log(groupId[i].mProperties.text);
                    console.log(this.byId("searchCompanyF").getValue());
                    console.log(this.byId("searchPlantF").getValue());
                    this.getRouter().navTo(page, {
                        company: this.byId("searchCompanyF").getValue()
                        , plant: this.byId("searchPlantF").getValue()
                        ,
                    });
                }
            }
        },

        createPopupClose: function (oEvent) {
            console.log(oEvent);
            this.byId("dialogApprovalCategory").close();
        },

        /**
         * @public
         * @see 리스트 체크박스 제어기능
         */
        onColumnChecBox: function (oEvent) {
            var groupId = this.getView().getControlsByFieldGroupId("checkBoxs");
            var isChecked = oEvent.getSource().mProperties.selected;

            if (isChecked) {
                for (var i = 0; i < groupId.length; i++) {
                    groupId[i].setSelected(true);

                }
            } else {
                for (var i = 0; i < groupId.length; i++) {
                    groupId[i].setSelected(false);
                }
            }
        },

        onApplovalDeletePress: function () {
            var oTable = this.byId("mainTable"),
                oModel = this.getModel(),
                lModel = this.getModel("list"),
                oView = this.getView(),
                //oSelected  = oTable.getSelectedItems(),
                oSelected = [],
                checkBoxs = this.getView().getControlsByFieldGroupId("checkBoxs");
            console.log(checkBoxs);
            for (var i = 0; i < checkBoxs.length; i++) {
                if (checkBoxs[i].mProperties.selected == true) {
                    oSelected.push(i);
                }
            }

            if (oSelected.length > 0) {
                MessageBox.confirm(this.getModel("I18N").getText("/NCM0104", oSelected.length, "삭제"), {//this.getModel("I18N").getText("/NCM0104", oSelected.length, "${I18N>/DELETE}")
                    title: "Comfirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            oSelected.forEach(function (idx) {
                                console.log(lModel.getData().ApprovalMasters[idx]);
                                console.log(lModel.getData().ApprovalMasters[idx].__entity);
                                oModel.remove(lModel.getData().ApprovalMasters[idx].__entity, {
                                    groupId: "delete"
                                });
                            });

                            oModel.submitChanges({
                                groupId: "delete",
                                success: function () {
                                    oView.setBusy(false);
                                    MessageToast.show("Success to Delete.");
                                    this.onPageSearchButtonPress();
                                }.bind(this), error: function (oError) {
                                    oView.setBusy(false);
                                    MessageBox.error(oError.message);
                                }
                            });
                        }
                    }.bind(this)
                });

                //oTable.clearSelection();

            } else {
                MessageBox.error("선택된 행이 없습니다.");
            }

        },



        ///////////////////// List create button pop up event End //////////////////////////

        ///////////////////// List search section Start //////////////////////////

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function () {
            this.getModel("approvalListView").setProperty("/headerExpanded", true);
            this.setModel(new ManagedListModel(), "orgMap");
        },

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */
        _applySearch: function (aSearchFilters) {
            console.log(aSearchFilters);
            var oView = this.getView(),
                oModel = this.getModel("list");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
            oModel.read("/ApprovalMasters", {
                filters: aSearchFilters,
                success: function (oData) {
                    oView.setBusy(false);
                }
            });
        },

        _getSearchStates: function () {
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S"

            var aCompany = this.getView().byId("searchCompany" + sSurffix).getSelectedItems();
            var aPlant = this.getView().byId("searchPlant" + sSurffix).getSelectedItems();
            var sDateFrom = this.getView().byId("searchRequestDate" + sSurffix).getDateValue();
            var sDateTo = this.getView().byId("searchRequestDate" + sSurffix).getSecondDateValue();
            var sCategory = this.getView().byId("searchApprovalCategory" + sSurffix).getSelectedItems();
            var sSubject = this.getView().byId("searchSubject").getValue().trim();
            var sModel = this.getView().byId("searchModel").getValue().trim();
            var sPart = this.getView().byId("searchPart").getValue().trim();
            var sRequester = this.getView().byId("searchRequester").getValue().trim();
            var sStatus = this.getView().byId("searchStatus").getSelectedKey();


            var aSearchFilters = [];

            if (sCategory.length > 0) {
                var _tempFilters = [];

                sCategory.forEach(function (item, idx, arr) {
                    console.log(item.mProperties.key)
                    _tempFilters.push(new Filter("approval_type_code", FilterOperator.EQ, item.mProperties.key));
                });

                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }

            if (aCompany.length > 0) {
                var _tempFilters = [];

                aCompany.forEach(function (item, idx, arr) {
                    _tempFilters.push(new Filter("company_code", FilterOperator.EQ, item.mProperties.key));
                });

                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }

            if (aPlant.length > 0) {
                var _tempFilters = [];

                aPlant.forEach(function (item, idx, arr) {
                    _tempFilters.push(new Filter("org_code", FilterOperator.EQ, item.mProperties.key));
                });

                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }


            if (sDateFrom || sDateFrom) {
                var _tempFilters = [];

                _tempFilters.push(
                    new Filter({
                        path: "request_date",
                        operator: FilterOperator.BT,
                        value1: this.getFormatDate(sDateFrom),
                        value2: this.getFormatDate(sDateTo)
                    })
                );

                _tempFilters.push(new Filter("request_date", FilterOperator.EQ, ''));
                _tempFilters.push(new Filter("request_date", FilterOperator.EQ, null));

                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }

            if (sModel) {
                aSearchFilters.push(new Filter("tolower(model)", FilterOperator.Contains, "'" + sModel.toLowerCase().replace("'", "''") + "'"));
            }

            if (sPart) {
                aSearchFilters.push(new Filter("tolower(part_number)", FilterOperator.Contains, "'" + sPart.toLowerCase() + "'"));
            }

            if (sRequester) {
                aSearchFilters.push(new Filter("tolower(requestor_empno)", FilterOperator.Contains, "'" + sRequester.toLowerCase() + "'"));
            }

            if (sSubject) {
                aSearchFilters.push(new Filter("tolower(approval_title)", FilterOperator.Contains, "'" + sSubject.toLowerCase() + "'"));
            }

            if (sStatus) {
                aSearchFilters.push(new Filter("approve_status_code", FilterOperator.EQ, sStatus));
            }

            return aSearchFilters;
        },


        getFormatDate: function (date) {
            var year = date.getFullYear();              //yyyy
            var month = (1 + date.getMonth());          //M
            month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
            var day = date.getDate();                   //d
            day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
            return year + '' + month + '' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
        }

        ///////////////////// List search section End //////////////////////////
    });
});