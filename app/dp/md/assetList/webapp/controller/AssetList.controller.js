sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/model/ManagedListModel",
    "ext/lib/util/Multilingual",
    "ext/lib/util/Validator",
    "ext/lib/util/ExcelUtil",
    "cm/util/control/ui/EmployeeDialog",
    "dp/md/util/controller/ModelDeveloperSelection",
    "./AssetListPersoService",
    "sap/ui/base/ManagedObject",
    "sap/ui/core/routing/History",
    "sap/ui/core/Element",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    "sap/ui/table/Column",
    "sap/ui/table/Row",
    "sap/ui/table/TablePersoController",
    "sap/ui/core/Item",
    "sap/m/ComboBox",
    "sap/m/ColumnListItem",
    "sap/m/Input",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/ObjectIdentifier",
    'sap/m/SearchField',
    "sap/m/Text",
    "sap/m/Token"
], function (BaseController, DateFormatter, ManagedListModel, Multilingual, Validator, ExcelUtil, EmployeeDialog, ModelDeveloperSelection, AssetListPersoService,
    ManagedObject, History, Element, Fragment, JSONModel, Filter, FilterOperator, Sorter, Column, Row, TablePersoController, Item,
    ComboBox, ColumnListItem, Input, MessageBox, MessageToast, ObjectIdentifier, SearchField, Text, Token) {
    "use strict";

    return BaseController.extend("dp.md.assetList.controller.AssetList", {

        dateFormatter: DateFormatter,

        validator: new Validator(),

        modelDeveloperSelection: new ModelDeveloperSelection(),

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the assetList controller is instantiated.
		 * @public
		 */
        onInit: function () {
            var oViewModel,
                oResourceBundle = this.getResourceBundle();
            
            console.log(" session >>> " , this.getSessionUserInfo().TENANT_ID);
            // Model used to manipulate control states
            oViewModel = new JSONModel({
                assetListTableTitle: oResourceBundle.getText("assetListTableTitle"),
                tableNoDataText: oResourceBundle.getText("tableNoDataText")
            });
            this.setModel(oViewModel, "assetListView");

            // Add the assetList page to the flp routing history
            this.addHistoryEntry({
                title: oResourceBundle.getText("assetListViewTitle"),
                icon: "sap-icon://table-view",
                intent: "#Template-display"
            }, true);

            this._doInitSearch();
            //this._doInitTablePerso();

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedListModel(), "list");
            this.setModel(new ManagedListModel(), "SegmentedItem");

            

            this._oTPC = new TablePersoController({
                customDataKey: "assetList",
                persoService: AssetListPersoService
            }).setTable(this.byId("moldMstTable"));
            
            this.getRouter().getRoute("assetList").attachPatternMatched(this._onRoutedThisPage, this);
        },

        onMainTablePersoButtonPressed: function (event) {
            this._oTPC.openDialog();

        },

        onAfterRendering: function () {
            //this.getModel().setDeferredGroups(["bindReceipt", "cancelBind", "delete", "receipt"]);
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
            this.setPlant('LGESL');
            //접속자 법인 사업부로 바꿔줘야함
            this.getView().byId("searchCompanyS").setSelectedKeys(['LGESL']);
            this.getView().byId("searchCompanyE").setSelectedKeys(['LGESL']);
            this.getView().byId("searchPlantS").setSelectedKeys(['A040']);
            this.getView().byId("searchPlantE").setSelectedKeys(['A040']);
            
        },

        

        _onRoutedThisPage : function(){
            this.getModel("assetListView").setProperty("/headerExpanded", true);
            this._segmentSrch();
        },

        _segmentSrch : function (){
            // session에서 받아오는 tenant_id를 변수로 저장함
            var sTenant_id=this.getSessionUserInfo().TENANT_ID;
            var oView = this.getView(),
                oModel = this.getModel("SegmentedItem") ,
                codeName = this.getModel('I18N').getText("/ALL")
                ;
            var aSearchFilters = [];
                aSearchFilters.push(new Filter("tenant_id", FilterOperator.EQ, sTenant_id));
                aSearchFilters.push(new Filter("group_code", FilterOperator.EQ, 'DP_MD_ASSET_STATUS'));


            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel("util"));
            oModel.read("/Code", {
                filters: aSearchFilters,
                success: function (oData) {     
                    oModel.addRecord({
                        code: ""
                      ,  code_name: codeName   
                      ,  group_code: "DP_MD_ASSET_STATUS"
                      ,  parent_code: null
                      ,  parent_group_code: null
                      ,  sort_no: "0"
                    },"/Code",0);
                    oView.setBusy(false);
                    
                }
            });
        } ,

        setPlant: function(companyCode){
            // session에서 받아오는 tenant_id를 변수로 저장함
            var sTenant_id=this.getSessionUserInfo().TENANT_ID;

            var filter = new Filter({
                    filters: [
                            new Filter("tenant_id", FilterOperator.EQ, sTenant_id),
                            new Filter("company_code", FilterOperator.EQ, companyCode)
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


            this.getView().byId("searchPlantS").bindItems(bindItemInfo);
            this.getView().byId("searchPlantE").bindItems(bindItemInfo);
        },
       
        /**
        * @private 
        * @see (멀티박스)Company와 Plant 부분 연관성 포함함
        */
        handleSelectionFinishComp: function (oEvent) {
            // session에서 받아오는 tenant_id를 변수로 저장함
            var sTenant_id=this.getSessionUserInfo().TENANT_ID;
            this.copyMultiSelected(oEvent);

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
                });
            } else {
                plantFilters.push(
                    new Filter("tenant_id", FilterOperator.EQ, sTenant_id)
                );
            }
 
            var filter = new Filter({
                filters: plantFilters,
                and: false
            });

            var bindInfo = {
                    path: 'dpMdUtil>/Divisions',
                    filters: filter,
                    template: new Item({
                    key: "{dpMdUtil>org_code}", text: "[{dpMdUtil>org_code}] {dpMdUtil>org_name}"
                    })
                };
            
            this.getView().byId("searchPlantS").bindItems(bindInfo);
            this.getView().byId("searchPlantE").bindItems(bindInfo);

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
            this.getView().byId(idPreFix + "E").setSelectedKeys(selectedKeys);
            this.getView().byId(idPreFix + "S").setSelectedKeys(selectedKeys);
        },



		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onMoldMstTablePersoButtonPressed: function (oEvent) {
            this._oTPC.openDialog();
        },

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onMoldMstTablePersoRefresh: function () {
            AssetListPersoService.resetPersData();
            this._oTPC.refresh();
        },

		
		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
        onPageSearchButtonPress: function () {
            this.validator.validate( this.byId('pageSearchFormE'));
            if(this.validator.validate( this.byId('pageSearchFormS') ) !== true) return;

            var aTableSearchState = this._getSearchStates();
            this._applySearch(aTableSearchState);
        },

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
        _applySearch: function (aTableSearchState) {
            console.log("aTableSearchState >>>>>" , aTableSearchState)
            this.setModel(new ManagedListModel(), "list");
            var oView = this.getView(),
                oModel = this.getModel("list");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
            oModel.read("/Assets", {
                filters: aTableSearchState,
                success: function (oData) {
                   oView.setBusy(false);
                }.bind(this)
            });
        },

        _getSearchStates: function () {
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S",
                company = this.getView().byId("searchCompany" + sSurffix).getSelectedKeys(),
                plant = this.getView().byId("searchPlant" + sSurffix).getSelectedKeys(),
                status = this.getView().byId("searchAssetsStatus" + sSurffix).getSelectedKey(),
                signal = this.getView().byId("searchSignal"+ sSurffix).getSelectedKey(),
                model = this.getView().byId("searchModel").getValue(),
                moldNo = this.getView().byId("searchMoldNumber").getValue(),
                description = this.getView().byId("searchDescription").getValue(),
                assetNumber = this.getView().byId("searchAssetNumber").getValue(),
                secondVendor = this.getView().byId("searchSecondVendor").getValue(),
                thirdVendor = this.getView().byId("searchThirdVendor").getValue();
                // familyPartNo = this.getView().byId("searchFamilyPartNo").getValue();

            var aTableSearchState = [];


             if (company.length > 0) {
                var _tempFilters = [];
                company.forEach(function (item) {
                    _tempFilters.push(new Filter("company_code", FilterOperator.EQ, item));
                });

                aTableSearchState.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }
           

            if (plant.length > 0) {
                var _tempFilters = [];
                plant.forEach(function (item) {
                    _tempFilters.push(new Filter("org_code", FilterOperator.EQ, item));
                });

                aTableSearchState.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }

            if (status) {
                aTableSearchState.push(new Filter("asset_status_code", FilterOperator.EQ, status));
            }

            // 관련 테이블 정의가 되지 않은 관계로 추후 반영
            // if (signal) {
            //     aTableSearchState.push(new Filter("signal", FilterOperator.EQ, status));
            // }
            
            if (model) {
                aTableSearchState.push(new Filter("tolower(model)", FilterOperator.Contains, "'" + model.toLowerCase() + "'"));
            }
            if (moldNo) {
                aTableSearchState.push(new Filter("mold_number", FilterOperator.Contains, moldNo.toUpperCase()));
            }
            if (description) {
                aTableSearchState.push(new Filter("tolower(class_desc)", FilterOperator.Contains, "'" + description.toLowerCase() + "'"));
            }
            if (assetNumber) {
                aTableSearchState.push(new Filter("tolower(asset_number)", FilterOperator.Contains, "'" + assetNumber.toLowerCase() + "'"));
            }
            if (secondVendor) {
                aTableSearchState.push(new Filter("tolower(secondary_supplier_name)", FilterOperator.Contains, "'" + secondVendor.toLowerCase() + "'"));
            }
            if (thirdVendor) {
                aTableSearchState.push(new Filter("tolower(tertiary_supplier_name)", FilterOperator.Contains, "'" + thirdVendor.toLowerCase() + "'"));
            }
            return aTableSearchState;
        },
        
        /**
        * @private 
        * @see (멀티박스)리스트 moldNumber 항목선택시 remodelRepairMgtList 컴포넌트 디테일로 이동
        */
        handleLinkPress: function (){
            var pull_url = window.location.href;
            var complete_url;
            var targetPath = "/dp/md/remodelRepairMgtList/webapp/#/rrMgtDetail/code"
            complete_url=pull_url.split(pull_url.substring(pull_url.indexOf("/dp"),pull_url.length));
            complete_url[0] = complete_url[0]+targetPath;
            window.location.href=complete_url[0];
        },
        
        _doInitTablePerso: function () {
            // init and activate controller
            this._oTPC = new TablePersoController({
                table: this.byId("moldMstTable"),
                componentName: "assetList",
                persoService: AssetListPersoService,
                hasGrouping: true
            }).activate();
        }

    });
});