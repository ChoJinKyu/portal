sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/model/ManagedListModel",
    "sap/ui/model/json/JSONModel",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/util/Validator",
    "sap/m/TablePersoController",
    "./MainListPersoService",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "ext/lib/util/ExcelUtil"
], function (BaseController, Multilingual, ManagedListModel, JSONModel, DateFormatter, Validator,
    TablePersoController, MainListPersoService,
    Filter, FilterOperator, MessageBox, MessageToast, Fragment, ExcelUtil) {
    "use strict";

    var toggleButtonId = "";

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
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedListModel(), "list");
            this.setModel(new JSONModel(), "mainListViewModel");
            this.setModel(new JSONModel(), "excelModel");

            var today = new Date();
            this.getView().byId("searchRequestDate").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30));
            this.getView().byId("searchRequestDate").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));

            oMultilingual.attachEvent("ready", function (oEvent) {
                var oi18nModel = oEvent.getParameter("model");
                this.addHistoryEntry({
                    title: oi18nModel.getText("/prMgt"),   //제어옵션관리
                    icon: "sap-icon://table-view",
                    intent: "#Template-display"
                }, true);
            }.bind(this));

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
                tenantId: "new",
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
            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0),
                sPath = oEvent.getSource().getBindingContext("list").getPath(),
                oRecord = this.getModel("list").getProperty(sPath);

            this.getRouter().navTo("midPage", {
                layout: oNextUIState.layout,
                tenantId: oRecord.tenant_id,
                controlOptionCode: oRecord.control_option_code
            });

            if (oNextUIState.layout === "TwoColumnsMidExpanded") {
                this.getView().getModel("mainListViewModel").setProperty("/headerExpandFlag", false);
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
            var oView = this.getView(),
                oModel = this.getModel("list");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
            oModel.read("/Pr_MstView", {
                filters: aSearchFilters,
                success: function (oData) {
                    oView.setBusy(false);
                }
            });
        },

        _getSearchStates: function () {

            var sBsart = this.getView().byId("searchBsart").getSelectedKeys();
            // var sChain = this.getView().byId("searchChain").getSelectedKey(),
            // 	sKeyword = this.getView().byId("searchKeyword").getValue(),
            // 	sUsage = this.getView().byId("searchUsageSegmentButton").getSelectedKey();
            var aSearchFilters = [];
            for (var j = 0; j < sBsart.length; j++) {
                aSearchFilters.push(new Filter("control_option_name", FilterOperator.Contains, sBsart[j]));
            }

            // if (sBsart && sBsart.length > 0) {
            // 	aSearchFilters.push(new Filter("BSART", FilterOperator.Contains, sBsart));
            // }
            // if (sKeyword && sKeyword.length > 0) {
            // 	aSearchFilters.push(new Filter({
            // 		filters: [
            // 			new Filter("control_option_code", FilterOperator.Contains, sKeyword),
            // 			new Filter("control_option_name", FilterOperator.Contains, sKeyword)
            // 		],
            // 		and: false
            // 	}));
            // }
            // if(sUsage != "all"){
            // 	switch (sUsage) {
            // 		case "site":
            // 		aSearchFilters.push(new Filter("site_flag", FilterOperator.EQ, "true"));
            // 		break;
            // 		case "company":
            // 		aSearchFilters.push(new Filter("company_flag", FilterOperator.EQ, "true"));
            // 		break;
            // 		case "org":
            // 		aSearchFilters.push(new Filter("organization_flag", FilterOperator.EQ, "true"));
            // 		break;
            // 		case "user":
            // 		aSearchFilters.push(new Filter("user_flag", FilterOperator.EQ, "true"));
            // 		break;
            // 	}
            // }
            return aSearchFilters;
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