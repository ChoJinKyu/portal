sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/model/ManagedListModel",
    "sap/ui/model/json/JSONModel",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/formatter/NumberFormatter",
    "cm/util/control/ui/EmployeeDialog",    
    "ext/lib/util/Validator",
    "sap/m/TablePersoController",
    "./MainListPersoService",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "ext/lib/util/ExcelUtil",
    "dp/util/control/ui/MaterialMasterDialog",
], function (BaseController, Multilingual, ManagedListModel, JSONModel, DateFormatter, NumberFormatter, EmployeeDialog, Validator,
    TablePersoController, MainListPersoService,
    Filter, FilterOperator, MessageBox, MessageToast, Fragment, ExcelUtil, MaterialMasterDialog) {
    "use strict";

    var toggleButtonId = "";

    return BaseController.extend("op.pu.prReviewMgt.controller.MainList", {

        dateFormatter: DateFormatter,
        numberFormatter: NumberFormatter,
        validator: new Validator(),

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
        onInit: function () {
            // 다국어
            this.setModel(new Multilingual().getModel(), "I18N");
            // 조회조건
            this.setModel(new JSONModel({
                tenant_id: "L2100",
                company_code: null,
                pr_type_code: [],
                pr_number: null,
                pr_item_number: null,
                org_type_code: null,
                org_code: [],
                material_code: null,
                material_group_code: null,
                pr_desc: null,
                pr_quantity: null,
                pr_unit: null,
                requestor_empno: null,
                requestor_name: null,
                request_date: [null, null],
                accept_date: [null, null],
                delivery_request_date: null,
                buyer_empno: null,
                purchasing_group_code: null,
                estimated_price: null,
                currency_code: null,
                price_unit: null,
                pr_progress_status_code: [],
                remark: null,
                attch_group_number: null,
                delete_flag: null,
                closing_flag: null,
                item_category_code: null,
                account_assignment_category_code: null,
                sloc_code: null
            }), "jSearch");
            //this.setModel(new ManagedListModel(), "list");
            // this.setModel(new JSONModel(), "mainListViewModel");
            // this.setModel(new JSONModel(), "excelModel");

            // var today = new Date();
            // this.getView().byId("searchRequestDate").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30));
            // this.getView().byId("searchRequestDate").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));

            // oMultilingual.attachEvent("ready", function (oEvent) {
            //     var oi18nModel = oEvent.getParameter("model");
            //     this.addHistoryEntry({
            //         title: oi18nModel.getText("/prReviewMgt"),   //구매..
            //         icon: "sap-icon://table-view",
            //         intent: "#Template-display"
            //     }, true);
            // }.bind(this));

            // this.getRouter().getRoute("mainPage").attachPatternMatched(function() {
            //     this.getModel("mainListViewModel").setProperty("/headerExpanded", true);
            // }, this);

            // this._doInitTablePerso();
            // this.enableMessagePopover();
        },

        onRenderedFirst: function () {
            //this.byId("pageSearchButton").firePress();
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
        // 공통 다이얼로그 호출
        onValueHelpRequest: function() {
            // Declare
            var [event, bindings] = arguments;
            var [model, paths] = bindings.split(">");
            var Dialog = this.onValueHelpRequest[bindings];
            // Dialog Set
            !Dialog
            &&
            (Dialog = this.onValueHelpRequest[bindings] = new MaterialMasterDialog({
                title: "Choose MaterialMaster",
                MultiSelection: true,
                items: {
                    filters: [
                        new Filter("tenant_id", "EQ", "L2100")
                    ]
                }
            }))
            .attachEvent("apply", (function (oEvent) {
                // Default - material_code
                this.getModel(model).setProperty(
                    paths, 
                    oEvent.mParameters.item[paths.split("/")[paths.split("/").length-1]]
                );
            }).bind(this));
            // Dialog Open
            Dialog.open();
        },
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
            // update the mainList's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("mainListTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("mainListTableTitle");
            }
            this.getModel("mainListViewModel").setProperty("/mainListTableTitle", sTitle);
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
            MainListPersoService.resetPersData();
            this._oTPC.refresh();
        },

        onExportPress: function (_oEvent) {
            var sTableId = _oEvent.getSource().getParent().getParent().getId();
            if (!sTableId) { return; }

            var oTable = this.byId(sTableId);
            //var sFileName = oTable.title || this.byId("page").getTitle(); //file name to exporting
            var sFileName = "PR List"
            var oData = oTable.getModel("list").getProperty("/Pr_MstView");
            console.log(oTable);
            console.log(sFileName);
            console.log(oData);
            ExcelUtil.fnExportExcel({
                fileName: sFileName || "SpreadSheet",
                table: oTable,
                data: oData
            });
        },


		/**
		 * Event handler when a table add button pressed
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
        /**
         * @description : Popup 창 : 품의서 Participating Supplier 항목의 Add 버튼 클릭
         */
        onMainTableAddDialogPress: function (oEvent) {
            console.group("handleTableSelectDialogPress");

            var oView = this.getView();
            var oButton = oEvent.getSource(); 

            if (!this._oDialogTableSelect) {
                this._oDialogTableSelect = Fragment.load({
                    id: oView.getId(),
                    name: "op.pu.prReviewMgt.view.TemplateSelection",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }

            this._oDialogTableSelect.then(function (oDialog) {               
                oDialog.open();
            });
        },

        onExit: function () {
            this.byId("dialogTemplateSelection").close();
        },

        onMainTableAddButtonPress: function () {
            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1); 
            
            if(this.validator.validate(this.byId("SelectionPR_TYPE2")) !== true) return;
            if(this.validator.validate(this.byId("SelectionPR_TYPE3")) !== true) return;
            if(this.validator.validate(this.byId("SelectionPR_TYPE")) !== true) return;
            if(this.validator.validate(this.byId("searchUsageSegmentButton")) !== true) return;
            
            oNextUIState.layout = "MidColumnFullScreen";
            this.getRouter().navTo("midCreate", {
                layout: oNextUIState.layout,
                vMode: "NEW",
                tenantId: "L2100",
                company_code: "LGCKR",                
                pr_type_code: this.byId("SelectionPR_TYPE").getSelectedKey(),
                pr_type_code_2: this.byId("SelectionPR_TYPE2").getSelectedKey(),
                pr_type_code_3: this.byId("SelectionPR_TYPE3").getSelectedKey(),
                pr_template_number: this.byId("searchUsageSegmentButton").getSelectedKey(),
            });

            this.byId("dialogTemplateSelection").close();
        },

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
        onSearch: function (oEvent) {
            // Call Service
            (function _search(){
                var oDeferred = new $.Deferred();
                var jSearch = this.getModel("jSearch").getData();
                this.getView()
                    .setBusy(true)
                    .getModel().read("/Pr_ReviewListView", $.extend({
                        filters: Object.keys(jSearch)
                            // EQ, BT 만 해당
                            .filter(
                                path => 
                                    // Primitive
                                    typeof jSearch[path] == "boolean" || typeof jSearch[path] == "number" ||
                                    (jSearch[path] && typeof jSearch[path] == "string") || 
                                    // Array 형태
                                    (jSearch[path] instanceof Array && jSearch[path].length > 0 && (jSearch[path][0] || jSearch[path][1])) ||
                                    // Object (연산자필드포함)
                                    (jSearch[path] && jSearch[path]["Contains"])
                            )
                            .reduce(function(acc, path) {
                                return [
                                    ...acc, 
                                    jSearch[path] instanceof Array
                                    ? new Filter(path, FilterOperator.BT, (jSearch[path][0]), (jSearch[path][1]))
                                    : (jSearch[path] && jSearch[path]["Contains"])
                                    ? new Filter(path, FilterOperator.Contains, jSearch[path])
                                    : new Filter(path, FilterOperator.EQ, jSearch[path])
                                ]
                            }, []),
                    }, {
                        success: oDeferred.resolve,
                        error: oDeferred.reject
                    }));
                    return oDeferred.promise();
                }).call(this)
                // 성공시
                .done((function (oData) {
                    //console.log(">>>>>>>>>>> oData", oData);
                    this.getView().setModel(new JSONModel({
                        "Pr_ReviewListView": oData.results
                    }), "list");
                }).bind(this))
                // 실패시
                .fail(function (oError) {
                })
                // 모래시계해제
                .always((function () {
                    this.getView().setBusy(false);
                }).bind(this));
        },

		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
        onMainTableItemPress: function (oEvent) {
          
            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
                sPath = oEvent.getSource().getBindingContext("list").getPath(),
                oRecord = this.getModel("list").getProperty(sPath);

            this.getRouter().navTo("midView", {
                layout: oNextUIState.layout,
                vMode: "VIEW",
                tenantId: oRecord.tenant_id,
                company_code: oRecord.company_code,
                pr_number: oRecord.pr_number
            });

            if (oNextUIState.layout === "TwoColumnsMidExpanded") {   
                this.getModel("mainListViewModel").setProperty("/headerExpanded", false);             
                //this.getView().getModel("mainListViewModel").setProperty("/headerExpandFlag", false);
            }

            var oItem = oEvent.getSource();
            oItem.setNavigated(true);
            var oParent = oItem.getParent();
            // store index of the item clicked, which can be used later in the columnResize event
            this.iIndex = oParent.indexOfItem(oItem);
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function () {
            this.getModel("mainListViewModel").setProperty("/headerExpanded", true);
        },

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */
        _applySearch: function (aSearchFilters) {
            var that = this;
            var oView = this.getView(),
                oModel = this.getModel("list");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
            oModel.read("/Pr_MstView", {
                filters: aSearchFilters,
                success: function (oData) {
                    oView.setBusy(false);
                    // 조회 버튼 클릭시 체크박스 초기화..
                    that.byId("mainTable").removeSelections();
                }
            });

        },

        _getSearchStates: function () {

            var aSearchFilters = [];     

            var sDateFrom = this.getView().byId("searchRequestDate").getDateValue();
            var sDateTo = this.getView().byId("searchRequestDate").getSecondDateValue();
            var sPR_TYPE_CODE = this.getView().byId("searchPR_TYPE_CODE").getSelectedKeys();
            var sPR_TEMPLATE_NUMBER = this.getView().byId("searchPR_TEMPLATE_NUMBER").getSelectedKeys();
            var sPrNumber = this.getView().byId("searchPrNumber").getValue();
            var sPr_create_status = this.getView().byId("SearchPr_create_status").getSelectedKeys();
            var sDepartment = this.getView().byId("searchRequestDepartmentS").getValue();

            var sRequestor = this.getView().byId("multiInputWithEmployeeValueHelp").getTokens();

            var sPr_desc = this.getView().byId("searchPr_desc").getValue();
            var _tempFilters = [];

            if (sDateFrom || sDateTo) {
                _tempFilters = [];    
                _tempFilters.push(
                    new Filter({
                        path: "request_date",
                        operator: FilterOperator.BT,
                        value1: this.getFormatDate(sDateFrom),
                        value2: this.getFormatDate(sDateTo)
                    })
                );               
                 //_tempFilters.push(new Filter("request_date", FilterOperator.BT, "2020-01-01", "2021-01-31"));

                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }
            
            if (sPR_TYPE_CODE.length > 0) {
                _tempFilters = [];

                sPR_TYPE_CODE.forEach(function (item, idx, arr) {
                    _tempFilters.push(new Filter("pr_type_code", FilterOperator.EQ, item));
                });

                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }

            if (sPR_TEMPLATE_NUMBER.length > 0) {
                _tempFilters = [];

                sPR_TEMPLATE_NUMBER.forEach(function (item, idx, arr) {
                    _tempFilters.push(new Filter("pr_template_number", FilterOperator.EQ, item));
                });

                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }

            if (sPrNumber) {
                _tempFilters = [];
                _tempFilters.push(new Filter("pr_number", FilterOperator.Contains, sPrNumber));
                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }
           
            if (sPr_create_status.length > 0) {
                _tempFilters = [];

                sPr_create_status.forEach(function (item, idx, arr) {
                    _tempFilters.push(new Filter("pr_create_status_code", FilterOperator.EQ, item));
                });

                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }


            if (sDepartment) {
                _tempFilters = [];
                _tempFilters.push(new Filter("requestor_department_code", FilterOperator.EQ, sDepartment));
                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }

            if (sRequestor.length > 0) {
                _tempFilters = [];

                sRequestor.forEach(function (item) {
                    _tempFilters.push(new Filter("requestor_empno", FilterOperator.EQ, item.getKey()));
                });

                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }

            if (sPr_desc) {
                _tempFilters = [];
                _tempFilters.push(new Filter("pr_desc", FilterOperator.Contains, sPr_desc));
                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }
            
            return aSearchFilters;
        },
        onInputWithEmployeeValuePress: function(){
            this.byId("employeeDialog").open();
        },

        onEmployeeDialogApplyPress: function(oEvent){
            this.byId("inputWithEmployeeValueHelp").setValue(oEvent.getParameter("item").user_local_name);
        },
        
         onMultiInputWithEmployeeValuePress: function(){
            if(!this.oEmployeeMultiSelectionValueHelp){
                this.oEmployeeMultiSelectionValueHelp = new EmployeeDialog({
                    title: "Choose Employees",
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2100")
                        ]
                    }
                });
                this.oEmployeeMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                    this.byId("multiInputWithEmployeeValueHelp").setTokens(oEvent.getSource().getTokens());
                }.bind(this));
            }
            this.oEmployeeMultiSelectionValueHelp.open();
            this.oEmployeeMultiSelectionValueHelp.setTokens(this.byId("multiInputWithEmployeeValueHelp").getTokens());
        },
        getFormatDate: function (date) {
            var year = date.getFullYear();              //yyyy
            var month = (1 + date.getMonth());          //M
            month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
            var day = date.getDate();                   //d
            day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
            return year + '-' + month + '-' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
        },

        _doInitTablePerso: function () {
            // init and activate controller
            this._oTPC = new TablePersoController({
                table: this.byId("mainTable"),
                componentName: "PrMgt",
                persoService: MainListPersoService,
                hasGrouping: true
            }).activate();
        }

        


    });
});