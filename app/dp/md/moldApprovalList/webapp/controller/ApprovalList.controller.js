sap.ui.define([
    "ext/lib/controller/BaseController",
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
    "sap/m/SegmentedButtonItem",
    'sap/ui/core/Element',
    "sap/ui/core/syncStyleClass",
    'sap/m/Label',
    'sap/m/SearchField',
    "ext/lib/util/Multilingual",
    "sap/ui/model/odata/v2/ODataModel",
    "ext/lib/util/ExcelUtil",
    "ext/lib/util/Validator",
    "sap/ui/model/Sorter"
], function (BaseController, History, JSONModel, ManagedListModel, DateFormatter, TablePersoController, ApprovalListPersoService, Filter
    , FilterOperator, Fragment, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text
    , Token, Input, ComboBox, Item, SegmentedButtonItem, Element, syncStyleClass, Label, SearchField, Multilingual, ODataModel, ExcelUtil
    , Validator, Sorter) {
    "use strict";
    /**
     * @description 품의 목록 (총 품의 공통)
     * @date 2020.11.19 
     * @author daun.lee 
     */
     
    var toggleButtonId = "";
    var path = '';
    var approvalTarget ='';
    // this를 변수로 담기 위해 선언함
    var appThis;
    return BaseController.extend("dp.md.moldApprovalList.controller.ApprovalList", {
        
        dateFormatter: DateFormatter,
        validator: new Validator(),

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        
		/**
		 * Called when the approvalList controller is instantiated.
		 * @public
		 */
        onInit: function () {
            
            appThis = this;
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
            this.setModel(new ManagedListModel(), "list_temp");
            this.setModel(new ManagedListModel(), "orgMap");
            this.setModel(new ManagedListModel(), "requestors");
            this.setModel(new ManagedListModel(), "SegmentedItem");
            this.setModel(new JSONModel(), "excelModel");
            this.getView().setModel(this.oServiceModel, 'supplierModel');
            
            
        
            this.getRouter().getRoute("approvalList").attachPatternMatched(this._onRoutedThisPage, this);

            this._doInitTablePerso();
        },
        
        /**
		 * @description 각 품의서에 돌아올때 재조회 기능
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
        onBackToList: function (){
            if(appThis){
                appThis.byId("pageSearchButton").firePress();
            }
        },
               
        /**
         * @private
         * @see init 이후 바로 실행됨
         */
        onAfterRendering: function () {
            
            this.getModel().setDeferredGroups(["delete"]);
            //this.byId("pageSearchButton").firePress();
            return;
        },

        /**
         * @private
         * @see 검색을 위한 컨트롤에 대하여 필요 초기화를 진행 합니다. 
         */
        _doInitSearch: function (oEvent) {
            this.getView().setModel(this.getOwnerComponent().getModel());

            this.setPlant('LGESL');

            /** Date */
            var today = new Date();

            //접속자 법인 사업부로 바꿔줘야함
            this.getView().byId("searchCompanyS").setSelectedKeys(['LGESL']);
            this.getView().byId("searchCompanyE").setSelectedKeys(['LGESL']);
            this.getView().byId("searchPlantS").setSelectedKeys(['A040']);
            this.getView().byId("searchPlantE").setSelectedKeys(['A040']);
            // this.getView().byId("searchCompanyS").setSelectedKeys(['LGEKR']);
            // this.getView().byId("searchCompanyE").setSelectedKeys(['LGEKR']);
            // this.getView().byId("searchPlantS").setSelectedKeys(['DFZ']);
            // this.getView().byId("searchPlantE").setSelectedKeys(['DFZ']);
            // this.getView().byId("searchApprovalCategoryS").setSelectedKeys(['I']);
            // this.getView().byId("searchApprovalCategoryE").setSelectedKeys(['I']);

            this.getView().byId("searchRequestDateS").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90));
            this.getView().byId("searchRequestDateS").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
            this.getView().byId("searchRequestDateE").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90));
            this.getView().byId("searchRequestDateE").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
        },


        setPlant: function(companyCode){
            // session에서 받아오는 tenant_id를 변수로 저장함
            var sTenant_id='L2101';
            var filter = new Filter({
                            filters: [
                                    new Filter("tenant_id", FilterOperator.EQ, sTenant_id),
                                    new Filter("company_code", FilterOperator.EQ, companyCode)
                                ],
                                and: true
                        });

            var bindItemInfo = {
                path: '/Divisions',
                filters: filter,
                template: new Item({
                key: "{org_code}", text: "[{org_code}] {org_name}"
                })
            };
            
            console.log( bindItemInfo)    ;
            this.getView().byId("searchPlantS").bindItems(bindItemInfo);
            this.getView().byId("searchPlantE").bindItems(bindItemInfo);
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
            
            var oTable = this.byId("mainTable");
            // 모든 컬럼의 정보를 변수에 담음
            var columns = oTable.getColumns();
            //  Perso Dialog에서 노출시키지 않기 위해 실제로 테이블에서 체크박스 컬럼을 삭제함
            oTable.removeColumn(this.byId("mainColumnChkBox"));
            this._oTPC.openDialog();
            // 다이알로그 오픈이후 컬럼배치를 원복하기 위해 모든 컬럼 삭제후 다시 투입
            oTable.removeAllColumns();
            columns.forEach(function(item){
                oTable.addColumn(item);
            });

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


        _doInitTablePerso: function () {
            var oTable = this.byId("mainTable");
            // 모든 컬럼의 정보를 변수에 담음
            var columns = oTable.getColumns();
            //  Perso Dialog에서 노출시키지 않기 위해 실제로 테이블에서 체크박스 컬럼을 삭제함
            oTable.removeColumn(this.byId("mainColumnChkBox"));

            // init and activate controller
            this._oTPC = new TablePersoController({
                table: this.byId("mainTable"),
                componentName: "moldApprovalList",
                persoService: ApprovalListPersoService,
                hasGrouping: true,
            }).activate();
            // dialog display이후 컬럼 재배치 하기위해 전부 삭제하고 다시 그려준다.
            oTable.removeAllColumns();
            columns.forEach(function(item){
                oTable.addColumn(item);
            });

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
            var that = this;
            var approvalTarget = "";
            var approvalTypeCode = "";
            if(oRecord.approval_type_code == "B"){
                approvalTarget = "budgetExecutionApproval"
                approvalTypeCode ="B"
            }if(oRecord.approval_type_code == "V"){
                approvalTarget = "purchaseOrderLocalApproval"
                approvalTypeCode ="V"
            }if(oRecord.approval_type_code == "E"){
                approvalTarget = "participatingSupplierSelection"
                approvalTypeCode ="E"
            }if(oRecord.approval_type_code == "I"){
                approvalTarget = "moldRecepitApproval"
                approvalTypeCode ="I"
            }if(oRecord.approval_type_code == "A"){ 
                var Cancellation = this.getView().getModel('Cancellation');
                Cancellation.setProperty("/approvalNumber", null);
                Cancellation.setProperty("/isCreate", false);
                approvalTarget = "pssCancelApproval"
                approvalTypeCode ="A"
            }

            that.getRouter().navTo(approvalTarget , {
                company_code: oRecord.company_code
                , plant_code: oRecord.org_code
                , approval_type_code: approvalTypeCode
                , approval_number: oRecord.approval_number
            });

        },



        ///////////////////// Multi Combo box event Start //////////////////////////
        /**
        * @private 
        * @see (멀티박스)Company와 Plant 부분 연관성 포함함
        */
        handleSelectionFinishComp: function (oEvent) {
            this.copyMultiSelected(oEvent);
            // session에서 받아오는 tenant_id를 변수로 저장함
            var sTenant_id='L2101';

            var params = oEvent.getParameters();
            var plantFilters = [];

            if (params.selectedItems.length > 0) {

                params.selectedItems.forEach(function (item, idx, arr) {

                    plantFilters.push(new Filter({
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, sTenant_id),
                            new Filter("company_code", FilterOperator.EQ, item.getKey())
                        ],
                        and: true
                    }));
                }.bind(this));
            } else {
                plantFilters.push(
                    new Filter("tenant_id", FilterOperator.EQ, sTenant_id)
                );
            }
 
            var filter = new Filter({
                filters: plantFilters,
                and: false
            });

            var bindItemInfo = {
                path: '/Divisions',
                filters: filter,
                template: new Item({
                key: "{org_code}", text: "[{org_code}] {org_name}"
                })
            };

            this.getView().byId("searchPlantS").bindItems(bindItemInfo);
            this.getView().byId("searchPlantE").bindItems(bindItemInfo);

            // this.getView().byId("searchPlantS").getBinding("items").filter(filter, "Application");
            // this.getView().byId("searchPlantE").getBinding("items").filter(filter, "Application");
        },


        handleSelectionFinishDiv: function (oEvent) {
            this.copyMultiSelected(oEvent);
        },

        copyMultiSelected: function (oEvent) {
            var source = oEvent.getSource();
            var params = oEvent.getParameters();

            var sIds =source.sId.split('--');
            var id = sIds[sIds.length-1];
           
            var idPreFix = id.substr(0, id.length - 1);
            var selectedKeys = [];



            params.selectedItems.forEach(function (item, idx, arr) {

                selectedKeys.push(item.getKey());
            });
            console.log("selectedKeys >>>>", selectedKeys);
            this.getView().byId(idPreFix + "E").setSelectedKeys(selectedKeys);
            this.getView().byId(idPreFix + "S").setSelectedKeys(selectedKeys);
        },

        ///////////////////// Multi Combo box event End //////////////////////////

        ///////////////////// ValueHelpDialog section Start //////////////////////////

        onValueHelpRequested: function (oEvent) {


            //var path = '';

            // var schFilter = [new Filter("tenant_id", FilterOperator.EQ, 'L2101')];
            //     this._bindView("/Requestors", "requestors", schFilter, function(oData){
                    
            //     });
            
            this._oValueHelpDialog = sap.ui.xmlfragment("dp.md.moldApprovalList.view.ValueHelpDialogApproval", this);

            this._oBasicSearchField = new SearchField({
                showSearchButton: false
            });

            var oFilterBar = this._oValueHelpDialog.getFilterBar();
            oFilterBar.setFilterBarExpanded(false);
            oFilterBar.setBasicSearch(this._oBasicSearchField);
            

            if (oFilterBar) {
				oFilterBar.variantsInitialized();
			}

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

            } else if (oEvent.getSource().sId.indexOf("searchMoldNo") > -1) {
                //part
                this._oInputModel = this.getView().byId("searchMoldNo");

                this.oColModel = new JSONModel({
                    "cols": [
                        {
                            "label": "Mold No",
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

                this._oValueHelpDialog.setTitle('Mold No');
                this._oValueHelpDialog.setKey('mold_number');
                this._oValueHelpDialog.setDescriptionKey('spec_name');

            } else if (oEvent.getSource().sId.indexOf("searchRequestor") > -1) {

                this._oInputModel = this.getView().byId("searchRequestor");

                this.oColModel = new JSONModel({
                    "cols": [
                        {
                            "label": "Name",
                            //"template": "requestors>english_employee_name"
                            "template": "user_english_name"
                        },
                        {
                            "label": "ID",
                            //"template": "requestors>user_id"
                            "template": "email_id"
                        }
                    ]
                });

                //path = 'requestors>/Requestors';
                path = '/Requestors';
                this._oValueHelpDialog.setTitle('Requestor');
                this._oValueHelpDialog.setKey('email_id');
                this._oValueHelpDialog.setDescriptionKey('user_english_name');
               
            }


            var aCols = this.oColModel.getData().cols;



            this.getView().addDependent(this._oValueHelpDialog);

            this._oValueHelpDialog.getTableAsync().then(function (oTable) {

                oTable.setModel(this.getOwnerComponent().getModel());
                oTable.setModel(this.oColModel, "columns");

                if (oTable.bindRows) {
                    oTable.bindAggregation("rows", path);
                }
                
                if (oTable.bindItems) {
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
            oFilterBar.search();
            //this.onFilterBarSearch(oFilterBar.search());
            

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
                }else{
                     aResult.push(new Filter({
                        path: oControl.mProperties.name,
                        operator: FilterOperator.Contains,
                        value1: oControl.mProperties.selectedKey
                    }));
      
                    
                }
                
                return aResult;
            },
            []);
            
            
            var _tempFilters = [];

            if (path.indexOf("Models") > -1) {
                // /Models
                //_tempFilters.push(new Filter({ path: "tolower(tenant_id)", operator: FilterOperator.Contains, value1: "'" + sSearchQuery.toLowerCase() + "'" }));
                _tempFilters.push(new Filter("tolower(model)", FilterOperator.Contains, "'" + sSearchQuery.toLowerCase().replace("'", "''") + "'"));

            } else if (path.indexOf("PartNumbers") > -1) {
                //PartNumbers
               //_tempFilters.push(new Filter({ path: "tolower(tenant_id)", operator: FilterOperator.Contains, value1: "'" + sSearchQuery.toLowerCase() + "'" }));
                _tempFilters.push(new Filter({ path: "tolower(mold_number)", operator: FilterOperator.Contains, value1: "'" + sSearchQuery.toLowerCase() + "'" }));
                _tempFilters.push(new Filter({ path: "tolower(mold_item_type_name)", operator: FilterOperator.Contains, value1: "'" + sSearchQuery.toLowerCase() + "'" }));
                _tempFilters.push(new Filter({ path: "tolower(spec_name)", operator: FilterOperator.Contains, value1: "'" + sSearchQuery.toLowerCase() + "'" }));
            }

            else if (path.indexOf("Requestors") > -1) {
                //Requestors
                //_tempFilters.push(new Filter({ path: "tolower(tenant_id)", operator: FilterOperator.Contains, value1: "'" + sSearchQuery.toLowerCase() + "'" }));
                _tempFilters.push(new Filter({ path: "tolower(email_id)", operator: FilterOperator.Contains, value1: "'" + sSearchQuery.toLowerCase() + "'" }));
                _tempFilters.push(new Filter({ path: "tolower(user_english_name)", operator: FilterOperator.Contains, value1: "'" + sSearchQuery.toLowerCase() + "'" }));
            }


            aFilters.push(new Filter({
                filters: _tempFilters,
                and: false
            }));

            this._filterTable(new Filter({
                filters: aFilters,
                and: true
            }));

            // 필터 버튼 visible false 처리..
            var searchFilterBtn = this.getView().getControlsByFieldGroupId("listFilterBar")[7];
            searchFilterBtn.setVisible(false);

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
        /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */
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

        dialogChangeComp: function (oEvent) {
            this.copySelected(oEvent);
            var source = oEvent.getSource();
            var sTenant_id='L2101';
            var filter = new Filter({
                            filters: [
                                    new Filter("tenant_id", FilterOperator.EQ, sTenant_id),
                                    new Filter("company_code", FilterOperator.EQ, source.getSelectedKey())
                                ],
                                and: true
                        });

            var bindItemInfo = {
                    path: 'dpMdUtil>/Divisions',
                    filters: filter,
                    template: new Item({
                        key: "{dpMdUtil>org_code}", text: "[{dpMdUtil>org_code}] {dpMdUtil>org_name}"
                    })
                };
            
            console.log( bindItemInfo)    ;
            this.getView().byId("searchPlantF").bindItems(bindItemInfo);
        },


        copySelected: function (oEvent) {
            var source = oEvent.getSource();
            var selectedKey = source.getSelectedKey();
            //this.getView().byId("searchPlantF").setSelectedKey(selectedKey);
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
                    name: "dp.md.moldApprovalList.view.DialogCreate",
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
            this.onToggleHandleInit();

        },

        /**
        * @public
        * @see 사용처 create 팝업 로딩시 입력값 초기화 작업
        */
        onToggleHandleInit: function () {
            var groupId = this.getView().getControlsByFieldGroupId("toggleButtons");
            if(!(this.byId("searchCompanyF") == undefined) || !(this.byId("searchPlantF") == undefined)){
                this.byId("searchCompanyF").setSelectedKey("");
                this.byId("searchPlantF").setSelectedKey("");
            }
            for (var i = 0; i < groupId.length; i++) {
                groupId[i].setPressed(false);
            }

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

            var sId = toggleButtonId.split('--');
            var id = sId[sId.length-1];
            var page = ""
            var appTypeCode = "";
            var company_code = this.byId("searchCompanyF").getSelectedKey();
            var plant_code = this.byId("searchPlantF").getSelectedKey();
            if(this.validator.validate( this.byId('dialogCreateForm') ) !== true){
                MessageBox.error("필수 입력 항목입니다.");
                return;
            } 
            
            if(id.indexOf("localBudget") > -1){
                approvalTarget = "budgetExecutionApproval"
                appTypeCode = "B"
            }else if(id.indexOf("supplierSelection") > -1){
                approvalTarget = "participatingSupplierSelection"
                appTypeCode = "E"
            }else if(id.indexOf("localOrder") > -1){
                approvalTarget = "purchaseOrderLocalApproval"
                appTypeCode = "V"
            }else if(id.indexOf("receipt") > -1){
                approvalTarget ="moldRecepitApproval"
                appTypeCode = "I"
            }else if(id.indexOf("export") > -1){
                appTypeCode ="X"  
            }else if(id.indexOf("repModCompletion") > -1){ // 7. 개조 & 수리 완료 보고
                approvalTarget ="rrcrReport"
                appTypeCode ="C"
            }
            
            

            // else if(id.indexOf("importBudget") > -1){
            //     appTypeCode ="E"
            // }else if(id.indexOf("importOrder") > -1){
            //     appTypeCode ="E"
            // }else if(id.indexOf("importCompletion") > -1){
            //     appTypeCode ="E"
            // }else if(id.indexOf("repModCompletion") > -1){
            //     appTypeCode ="E"
            // }else if(id.indexOf("otherIn") > -1){
            //     appTypeCode ="E"
            // }else if(id.indexOf("otherOut") > -1){
            //     appTypeCode ="E"
            // }else if(id.indexOf("prodSupplierAmend") > -1){
            //     appTypeCode ="E"
            // }else if(id.indexOf("itemCancel") > -1){
            //     appTypeCode ="E"
            // }
           
            var groupId = this.getView().getControlsByFieldGroupId("toggleButtons");
            var apprSelection = 0;
            for (var i = 0; i < groupId.length; i++) {
                if (groupId[i].getPressed() == true) {
                    apprSelection = apprSelection+1;
                }
            }
            
            if(apprSelection > 0){
                this.getRouter().navTo(approvalTarget, {
                    company_code: company_code
                    , plant_code: plant_code
                    , approval_type_code: appTypeCode
                    , approval_number: "New"
                });
            }else{
                MessageBox.error("품의서 유형을 선택해주세요");
                return;
            }
                
            
        },

        createPopupClose: function (oEvent) {
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
                data ={},
                //oSelected  = oTable.getSelectedItems(),
                oSelected = [],
                delApprData = [],
                chkArr =[],
                chkRow ="",
                j=0,
                checkBoxs = this.getView().getControlsByFieldGroupId("checkBoxs");

            var that = this;
            for (var i = 0; i < checkBoxs.length; i++) {
                
                if (checkBoxs[i].mProperties.selected == true) {
                    chkRow = checkBoxs[i].mBindingInfos.fieldGroupIds.binding.aBindings[0].oContext.getPath();
                    chkRow = chkRow.substring(11);
                    
                    chkArr.push(parseInt(chkRow));
                    delApprData.push({
                        approval_number : lModel.getData().Approvals[chkArr[j]].approval_number
                        ,tenant_id : lModel.getData().Approvals[chkArr[j]].tenant_id
                        ,company_code : lModel.getData().Approvals[chkArr[j]].company_code
                        ,org_code : lModel.getData().Approvals[chkArr[j]].org_code
                        ,approval_type_code : lModel.getData().Approvals[chkArr[j]].approval_type_code
                    })
                    oSelected.push(i);
                    
                    j=j+1;
                }
            }
            console.log("delApprData >>>>", delApprData);

            if (oSelected.length > 0) {
                MessageBox.confirm(("삭제하시겠습니까?"), {//this.getModel("I18N").getText("/NCM0104", oSelected.length, "${I18N>/DELETE}")
                    title: "Comfirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            if(delApprData.length > 0){
                                data = {
                                    inputData : { 
                                        approvalMaster : delApprData 
                                    } 
                                }
                                that.callAjax(data,"deleteApproval");
                            }
                        }
                    }
                });

            } else {
                MessageBox.error("선택된 행이 없습니다.");
            }

        },

        callAjax : function (data,fn) {  
             
            var that = this;
            //  /dp/md/moldApprovalList/webapp/srv-api/odata/v2/dp.MoldApprovalListService/RefererSearch
            //  "xx/sampleMgr/webapp/srv-api/odata/v4/xx.SampleMgrV4Service/SaveSampleHeaderMultiProc"
            var url = "/dp/md/moldApprovalList/webapp/srv-api/odata/v4/dp.MoldApprovalV4Service/"+fn;
            that.onLoadThisPage();
            $.ajax({
                url: url,
                type: "POST",
                //datatype: "json",
                data : JSON.stringify(data),
                contentType: "application/json",
                success: function(result){
                    console.log("DeleteResult>>>> " , result);
                    MessageToast.show(that.getModel("I18N").getText("/"+result.messageCode));
                    if(result.resultCode > -1){
                        that.onLoadThisPage(result);
                    }
                    that.onPageSearchButtonPress();
                },
                error: function(e){
                    
                }
            });
        }, 

        onLoadThisPage : function () { 
            var oTable = this.byId("mainTable")
            , oModel = this.getModel("list"); 
            
            oModel.refresh(true); 
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

            this._segmentSrch();

        },
        
        _segmentSrch : function (){
            // session에서 받아오는 tenant_id를 변수로 저장함
            var sTenant_id='L2101'; 
            var oView = this.getView(),
                oModel = this.getModel("SegmentedItem") ,
                codeName = this.getModel('I18N').getText("/ALL")
                ;
            
             var aSearchFilters = [];
                aSearchFilters.push(new Filter("tenant_id", FilterOperator.EQ, sTenant_id));
                aSearchFilters.push(new Filter("group_code", FilterOperator.EQ, 'CM_APPROVE_STATUS'));

            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel("util"));
            oModel.read("/Code", {
                filters: aSearchFilters,
                success: function (oData) {     
                    oModel.addRecord({
                        code: ""
                      ,  code_name: "All"   
                      ,  group_code: "CM_APPROVE_STATUS"
                      ,  parent_code: null
                      ,  parent_group_code: null
                      ,  sort_no: "0"
                    },"/Code",0);
                    oView.setBusy(false);
                    
                }
            });
        } ,

        /**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
        onPageSearchButtonPress: function (oEvent) {

            this.validator.validate( this.byId('pageSearchFormE'));
            if(this.validator.validate( this.byId('pageSearchFormS') ) !== true) return;

            var aSearchFilters = this._getSearchStates();
            this._applySearch(aSearchFilters);
        },

        /**
        * @public
        * @see List search 할 값 필터링 관련 메소드 
        */
        _getSearchStates: function () {
            // session에서 받아오는 tenant_id를 변수로 저장함
            var sTenant_id='L2101'; 
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S"

            var aCompany = this.getView().byId("searchCompany" + sSurffix).getSelectedKeys();
            var aPlant = this.getView().byId("searchPlant" + sSurffix).getSelectedKeys();
            var sDateFrom = this.getView().byId("searchRequestDate" + sSurffix).getDateValue();
            var sDateTo = this.getView().byId("searchRequestDate" + sSurffix).getSecondDateValue();
            var sCategory = this.getView().byId("searchApprovalCategory" + sSurffix).getSelectedKeys();
            var sSubject = this.getView().byId("searchSubject").getValue().trim();
            var sModel = this.getView().byId("searchModel").getValue().trim();
            var sMoldNo = this.getView().byId("searchMoldNo").getValue().trim();
            var sRequestor = this.getView().byId("searchRequestor").getValue().trim();
            var sStatus = this.getView().byId("searchStatus").getSelectedKey();
            var sMoldSeq = this.getView().byId("searchMoldSeq").getValue().trim();
            var aSearchFilters = [];
            
            if (sCategory.length > 0) {
                var _tempFilters = [];

                sCategory.forEach(function (item, idx, arr) {
                    _tempFilters.push(new Filter("approval_type_code", FilterOperator.EQ, item));
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
                    _tempFilters.push(new Filter("company_code", FilterOperator.EQ, item));
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
                    _tempFilters.push(new Filter("org_code", FilterOperator.EQ, item));
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
                aSearchFilters.push(new Filter("tolower(model)", FilterOperator.Contains, "'"+sModel.toLowerCase().replace("'","''")+"'"));
            }
            
            if (sMoldNo) {
				aSearchFilters.push(new Filter("tolower(mold_number)", FilterOperator.Contains, "'"+sMoldNo.toLowerCase().replace("'","''")+"'"));
            }

            if (sRequestor) {
                aSearchFilters.push(new Filter("tolower(email_id)", FilterOperator.Contains, "'" + sRequestor.toLowerCase() + "'"));
            }

            if (sSubject) {
                aSearchFilters.push(new Filter("tolower(approval_title)", FilterOperator.Contains, "'" + sSubject.toLowerCase() + "'"));
            }

            if (sStatus) {
                aSearchFilters.push(new Filter("approve_status_code", FilterOperator.EQ, sStatus));
            }

            if (sMoldSeq) {
                aSearchFilters.push(new Filter("tolower(mold_sequence)", FilterOperator.Contains, "'"+sMoldSeq.toLowerCase().replace("'","''")+"'"));
            }

            
            aSearchFilters.push(new Filter("tenant_id", FilterOperator.EQ, sTenant_id));
            return aSearchFilters;
        },


        getFormatDate: function (date) {
            var year = date.getFullYear();              //yyyy
            var month = (1 + date.getMonth());          //M
            month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
            var day = date.getDate();                   //d
            day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
            return year + '' + month + '' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
        },

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */
        
        _applySearch: function (aSearchFilters) {
            console.log("aSearchFilters :::", aSearchFilters);
            //aSearchFilters.push(n)
            // var aSorter = [];
            // aSorter.push(new Sorter("approval_number", true));
            this.setModel(new ManagedListModel(), "list");
            var oView = this.getView(),
                oModel = this.getModel("list_temp"),
                nModel = this.getModel("list") 
                ;
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
            oModel.read("/Approvals", {
                filters: aSearchFilters,
                success: function (oData) {
                    if( oModel.getData().Approvals != undefined && oModel.getData().Approvals.length > 0 ){
                        var approval_number = ""; 
                        var idx = 0; 
                        for(var i = 0 ; i < oModel.getData().Approvals.length ; i++){
                            if(approval_number !== oModel.getData().Approvals[i].approval_number){
                                nModel.addRecord(oModel.getData().Approvals[i] , "/Approvals", idx);
                                approval_number = oModel.getData().Approvals[i].approval_number;
                                idx++;
                            }
                        }


                    }               
                    nModel.refresh(true);
                    oView.setBusy(false);       
                }
                
            });
           
            
 
        },

        ///////////////////// List search section End //////////////////////////
        
        /**
        * @public
        * @see 사용처 : 리스트에서 Excel Export 버튼 클릭시
        */
        onExportPress: function (_oEvent) {
            var sTableId = _oEvent.getSource().getParent().getParent().getId();
            if (!sTableId) { return; }

            var oTable = this.byId(sTableId);
            //var sFileName = oTable.title || this.byId("page").getTitle(); //file name to exporting
            var sFileName = "MOLD APPROVAL LIST"
            //var oData = this.getModel("list").getProperty("/Message"); //binded Data
            var oData = oTable.getModel("list").getProperty("/Approvals");
            ExcelUtil.fnExportExcel({
                fileName: sFileName || "SpreadSheet",
                table: oTable,
                data: oData
            });
        }    
        
    });
});