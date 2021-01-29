sap.ui.define([
    "op/util/controller/BaseController",
    "op/util/controller/OPUi",
    "ext/lib/util/Multilingual",
    "ext/lib/model/ManagedListModel",
    "sap/ui/model/json/JSONModel",
    "ext/lib/formatter/DateFormatter",
    "cm/util/control/ui/EmployeeDialog",    
    "ext/lib/util/Validator",
    "sap/m/TablePersoController",
    "./MainListPersoService",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "ext/lib/util/ExcelUtil"
], function (BaseController, OPUi, Multilingual, ManagedListModel, JSONModel, DateFormatter, EmployeeDialog, Validator,
    TablePersoController, MainListPersoService,
    Filter, FilterOperator, MessageBox, MessageToast, Fragment, ExcelUtil) {
    "use strict";

    return BaseController.extend("op.pu.prMgt.controller.MainList", {

        dateFormatter: DateFormatter,
        validator: new Validator(),

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
        onInit: function () {
            
            var oOPUi = new OPUi({
                tenantId: "L2100",
                txnType: "CREATE",
                templateNumber: "TCT0001"
            });
            this.setModel(oOPUi.getModel(), "OPUI");

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");

            this.setModel(new ManagedListModel(), "list");
            this.setModel(new JSONModel(), "mainListViewModel");
            this.setModel(new JSONModel(), "excelModel");

            var today = new Date();
            this.getView().byId("searchRequestDate").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30));
            this.getView().byId("searchRequestDate").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));

            // oMultilingual.attachEvent("ready", function (oEvent) {
            //     var oi18nModel = oEvent.getParameter("model");
            //     this.addHistoryEntry({
            //         title: oi18nModel.getText("/prMgt"),   //구매..
            //         icon: "sap-icon://table-view",
            //         intent: "#Template-display"
            //     }, true);
            // }.bind(this));

            this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);

            this._doInitTablePerso();
            this.enableMessagePopover();
        },

        onRenderedFirst: function () {
            this.byId("pageSearchButton").firePress();
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

        onPrDeletePress: function () {
            var oTable = this.byId("mainTable"),
                oModel = this.getModel("list"),
                oView = this.getView(),
                data ={},
                //oSelected  = oTable.getSelectedItems(),
                oSelected = [],
                delPrData = [],
                chkArr =[],
                chkRow ="",
                j=0,
                checkBoxs = this.getView().getControlsByFieldGroupId("checkBoxs"),
                aItems = oTable.getSelectedItems(),
                aIndices = [];

            var that = this;

            //console.log("checkBoxs ::::", checkBoxs);
            //checkBoxs[0].mBindingInfos.fieldGroupIds.binding.aBindings[0].oContext.getObject()
            // for (var i = 0; i < checkBoxs.length; i++) {
            //     if (checkBoxs[i].getSelected() === true )
            //     {
            //         aIndices.push(checkBoxs[i].mBindingInfos.fieldGroupIds.binding.aBindings[0].oContext.getObject()) ;
            //     }
            // }

            var sendData = {}, aInputData=[];
            
            aItems.forEach(function(oItem){
                if (oItem.getBindingContext("list").getProperty("pr_create_status_code") == "10" )
                {
                //aIndices.push(oModel.getData().indexOf(oItem.getBindingContext("list").getObject()));
                 aIndices.push(oModel.getData().Pr_MstView.indexOf(oItem.getBindingContext("list").getObject()));
                 var oDeletingKey = {
                        tenant_id: oItem.getBindingContext("list").getProperty("tenant_id"),
                        company_code: oItem.getBindingContext("list").getProperty("company_code"),
                        pr_number: oItem.getBindingContext("list").getProperty("pr_number"),
                        pr_create_status_code: oItem.getBindingContext("list").getProperty("pr_create_status_code")           
                    } ;    
                 aInputData.push(oDeletingKey);
                }
            });

            sendData.inputData = aInputData;

            console.log("delPrList >>>>", aIndices);

            if (aIndices.length > 0) {
                MessageBox.confirm(("삭제하시겠습니까?"), {//this.getModel("I18N").getText("/NCM0104", oSelected.length, "${I18N>/DELETE}")
                    title: "Comfirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                       if (sButton === MessageBox.Action.OK) {
                        aIndices = aIndices.sort(function(a, b){return b-a;});
                        aIndices.forEach(function(nIndex){                            
                            oModel.removeRecord(nIndex);
                        });

                        that._fnCallAjax(
                            sendData,
                            "DeletePrProc",
                            function(result){
                                oView.setBusy(false);
                                if(result && result.value && result.value.length > 0 && result.value[0].return_code === "0000") {                                    
                                    that.byId("pageSearchButton").firePress();
                                }
                            }
                        );

                        } else if (sButton === MessageBox.Action.CANCEL) { 

                        };    
                    }
                });

            } else {
                MessageBox.error("선택된 임시저장 요청이 없습니다.");
            }
        },


         _fnCallAjax: function (sendData, targetName , callback) {            
            var that = this;            
            var url = "/op/pu/prMgt/webapp/srv-api/odata/v4/op.PrDeleteV4Service/" + targetName;

            $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify(sendData),
                contentType: "application/json",
                success: function (result){                     
                    if(result && result.value && result.value.length > 0) {
                        if(result.value[0].return_code === "0000") {
                            MessageToast.show(that.getModel("I18N").getText("/" + result.value[0].return_code));
                        }
                        MessageToast.show(result.value[0].return_msg);                        
                    }
                    callback(result);
                },
                error: function(e){
                    MessageToast.show("Call ajax failed");
                    callback(e);
                }
            });
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
                    name: "op.pu.prMgt.view.TemplateSelection",
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

        onDialogOpen: function (oEvent) {
   
            var oPR_TYPE2 = this.byId("SelectionPR_TYPE2")
                oPR_TYPE2.setSelectedKey("");
            this.onInitPR_TYPE3();           
        },

        onExit: function () {
            this.byId("dialogTemplateSelection").close();
        },

        onInitPR_TYPE3: function () {
            var that = this,
                oPR_TYPE3 = this.byId("SelectionPR_TYPE3"),
                oPR_TYPE = this.byId("SelectionPR_TYPE"),
                vPR_TYPE2Value = this.byId("SelectionPR_TYPE2").getSelectedKey(),
                //oPRTypeModel = new sap.ui.model.json.JSONModel(),
                oPRTypeModel3 = this.getModel("prtypeModel3"),   // 바인딩 할 데이터..   
                oServiceModel = this.getModel(),            

                aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                    new Filter("pr_type_code_2", FilterOperator.EQ, vPR_TYPE2Value)
                ];

            //this.setModel("oPRTypeModel",oPRTypeModel)

            oServiceModel.read("/Pr_TMapView", {
                filters: aFilters,
                success: function (oData) {
                    var oPRTypeData = [];
                    for (var i = 0; i < oData.results.length; i++) {
                        var oPRTypeRecord = {
                            "key": oData.results[i].pr_type_code_3,
                            "text": oData.results[i].pr_type_name_3,
                            "additionalText": oData.results[i].pr_type_name_3
                        };

                        var duplicate = false ;

                        for (var j = 0; j < oPRTypeData.length; j++) {
                            if (oPRTypeData[j].key !== oPRTypeRecord.key) continue ;
                                duplicate = true ;
                                break;
                        }
                        if (!duplicate)
                           oPRTypeData.push(oPRTypeRecord);

                        // if (oPRTypeData.indexOf(oPRTypeRecord) === -1) {
                        //     oPRTypeData.push(oPRTypeRecord);
                        // }

                    }
                    oPRTypeModel3.setData({"list": oPRTypeData });

                    var oItemTemplate = new sap.ui.core.ListItem({
                        key: "{prtypeModel3>key}",
                        text: "{prtypeModel3>text}",
                        additionalText: "{prtypeModel3>key}"
                    });

                    if(oPRTypeData.length === 1)  
                    {
                        oPR_TYPE3.setSelectedKey(oPRTypeData[0].key);                        
                    }    
                    else 
                    {   
                        oPR_TYPE3.setSelectedKey(null);
                        oPR_TYPE.setSelectedKey(null) ; 
                    }                        

                    oPR_TYPE3.bindItems({
                        path: "prtypeModel3>/list",
                        template: oItemTemplate
                    }, null, []);

                    that.onInitPR_TYPE();          
                                        
                    //console.log(oPR_TYPE3)

                    //oPRTypeModel.setData({Pr_TMapView : oData.results})
                    //selecComboData = oData.results;
                    //this.changeData(selecComboData);
                },
                error: function (oData) {
                    // oCodeMasterTable.setBusy(false);
                }                
            });            
        },


        onInitPR_TYPE: function () {
            var that = this,
                oPR_TYPE = this.byId("SelectionPR_TYPE"),
                vPR_TYPE2Value = this.byId("SelectionPR_TYPE2").getSelectedKey(),
                vPR_TYPE3Value = this.byId("SelectionPR_TYPE3").getSelectedKey(),
                //oPRTypeModel = new sap.ui.model.json.JSONModel(),
                oPRTypeModel = this.getModel("prtypeModel"),   // 바인딩 할 데이터..
                oServiceModel = this.getModel(),

                aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                    new Filter("pr_type_code_2", FilterOperator.EQ, vPR_TYPE2Value),
                    new Filter("pr_type_code_3", FilterOperator.EQ, vPR_TYPE3Value)
                ];

            //this.setModel("oPRTypeModel",oPRTypeModel)

            oServiceModel.read("/Pr_TMapView", {
                filters: aFilters,
                success: function (oData) {
                    var oPRTypeData = [];
                    for (var i = 0; i < oData.results.length; i++) {
                        var oPRTypeRecord = {
                            "key": oData.results[i].pr_type_code,
                            "text": oData.results[i].pr_type_name,
                            "additionalText": oData.results[i].pr_type_name
                        };

                        var duplicate = false ;

                        for (var j = 0; j < oPRTypeData.length; j++) {
                            if (oPRTypeData[j].key !== oPRTypeRecord.key) continue ;
                                duplicate = true ;
                                break;
                        }
                        if (!duplicate)
                           oPRTypeData.push(oPRTypeRecord);
                    }
                    oPRTypeModel.setData({ "list": oPRTypeData });

                    var oItemTemplate = new sap.ui.core.ListItem({
                        key: "{prtypeModel>key}",
                        text: "{prtypeModel>text}",
                        additionalText: "{prtypeModel>key}"
                    });
                   

                    if(oPRTypeData.length === 1)  
                    {
                        oPR_TYPE.setSelectedKey(oPRTypeData[0].key);
                    }
                    else    
                    {
                        oPR_TYPE.setSelectedKey(null);
                    }   

                    oPR_TYPE.bindItems({
                        path: "prtypeModel>/list",
                        template: oItemTemplate
                    }, null, []);
                    
                    that.onInitTemplate();
                    //oPRTypeModel.setData({Pr_TMapView : oData.results})
                    //selecComboData = oData.results;
                    //this.changeData(selecComboData);
                },
                error: function (oData) {
                    // oCodeMasterTable.setBusy(false);
                }
            });

        },


        onInitTemplate: function () {     
            
            
            var that = this,
                oSegmentButton = this.byId("searchUsageSegmentButton"),                
                vPR_TYPE2Value = this.byId("SelectionPR_TYPE2").getSelectedKey(),
                vPR_TYPE3Value = this.byId("SelectionPR_TYPE3").getSelectedKey(),
                vPR_TYPE_Value = this.byId("SelectionPR_TYPE").getSelectedKey(),
                oServiceModel = this.getModel(),

                aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                    new Filter("pr_type_code", FilterOperator.EQ, vPR_TYPE_Value),
                    new Filter("pr_type_code_2", FilterOperator.EQ, vPR_TYPE2Value),
                    new Filter("pr_type_code_3", FilterOperator.EQ, vPR_TYPE3Value)
                ];

            var oItemTemplate = new sap.m.SegmentedButtonItem({
                key: "{pr_template_number}",
                text: "{pr_template_name}"                
            });
            oSegmentButton.bindItems("/Pr_TMapView", oItemTemplate, null, aFilters);
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
        onPageSearchButtonPress: function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                // Search field's 'refresh' button has been pressed.
                // This is visible if you select any master list item.
                // In this case no new search is triggered, we only
                // refresh the list binding.
                this.onRefresh();
            } else {
                var aSearchFilters = this._getSearchStates();
                this._applySearch(aSearchFilters);
            }
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