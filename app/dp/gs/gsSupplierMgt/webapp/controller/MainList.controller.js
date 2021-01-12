sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/util/Validator",
	"sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "sap/f/LayoutType",
	"ext/lib/formatter/DateFormatter",
	"sap/m/TablePersoController",
	"./MainListPersoService",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"sap/m/ComboBox",
    "sap/ui/core/Item",
    "ext/lib/util/ExcelUtil",
    "sap/ui/core/Fragment"
], function (BaseController, Multilingual, Validator, History, JSONModel, TransactionManager, ManagedModel,
    ManagedListModel, LayoutType, DateFormatter, TablePersoController, MainListPersoService, Filter, FilterOperator, 
    MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, ExcelUtil, Fragment) {
    "use strict";
    
    var oTransactionManager;

	return BaseController.extend("dp.gs.gsSupplierMgt.controller.MainList", {

        dateFormatter: DateFormatter,
        
        validator: new Validator(),

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
		onInit : function () {            

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");

			var oViewModel,
				oResourceBundle = this.getResourceBundle();

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				headerExpanded: true,
				mainListTableTitle : oResourceBundle.getText("mainListTableTitle"),
				tableNoDataText : oResourceBundle.getText("tableNoDataText")
			});
			this.setModel(oViewModel, "mainListView");

			// Add the mainList page to the flp routing history
			this.addHistoryEntry({
				title: oResourceBundle.getText("mainListViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#Template-display"
			}, true);
			
            this.setModel(new ManagedListModel(), "list");
            this.setModel(new ManagedModel(), "master");
            
            oTransactionManager = new TransactionManager();
			oTransactionManager.addDataModel(this.getModel("master"));
			
			this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);

			this._doInitTablePerso();
        },

        onRenderedFirst : function () {
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
		onMainTableUpdateFinished : function (oEvent) {
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
			this.getModel("mainListView").setProperty("/mainListTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTablePersoButtonPressed: function(oEvent){
			this._oTPC.openDialog();
		},

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTablePersoRefresh : function() {
			MainListPersoService.resetPersData();
			this._oTPC.refresh();
		},		

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
		onPageSearchButtonPress : function (oEvent) {
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
		onMainTableItemPress: function(oEvent) {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
				sPath = oEvent.getSource().getBindingContext("list").getPath(),
				oRecord = this.getModel("list").getProperty(sPath);

			// this.getRouter().navTo("midPage", {
			// 	layout: LayoutType.OneColumn,
			// 	tenantId: oRecord.tenant_id,
			// 	uomCode: oRecord.uom_code
            // });
            
            this.getRouter().navTo("suppliePage", {
				layout: LayoutType.OneColumn,
				tenantId: oRecord.tenant_id,
                ssn: oRecord.sourcing_supplier_nickname,
                mode: "show"
			});

            if(oNextUIState.layout === 'TwoColumnsMidExpanded'){
                this.getView().getModel('mainListView').setProperty("/headerExpandFlag", false);
            }

			var oItem = oEvent.getSource();
			oItem.setNavigated(true);
			var oParent = oItem.getParent();
			// store index of the item clicked, which can be used later in the columnResize event
			this.iIndex = oParent.indexOfItem(oItem);
        },

        onEditSupplierPress: function(oEvent) {
			// var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
			// 	sPath = oEvent.getSource().getBindingContext("list").getPath(),
            //     oRecord = this.getModel("list").getProperty(sPath);	

            var oItem= this.byId("mainTable").getSelectedItem();

            if(oItem == null){
                MessageBox.alert("수정할 공급업체를 선택해 주세요.");
                return false;
            }

            var oEntry = oItem.getBindingContext("list").getObject();           
            
            this.getRouter().navTo("suppliePage", {
				layout: LayoutType.OneColumn,
				tenantId: oEntry.tenant_id,
                ssn: oEntry.sourcing_supplier_nickname,
                mode: "show"
			});
            
        },

        onEditEvaluationPress: function(oEvent) {

			MessageBox.alert("준비중입니다.");
            
        },
        
        onExportPress: function (_oEvent) {
            var sTableId = _oEvent.getSource().getParent().getParent().getId();
            if (!sTableId) { return; }

            var oTable = this.byId(sTableId);
            //var sFileName = oTable.title || this.byId("page").getTitle(); //file name to exporting
            var sFileName = "Unit Of Measure";
            var oData = this.getModel("list").getProperty("/Uom"); //binded Data
            // var oData = oTable.getModel().getProperty("/Uom");
            ExcelUtil.fnExportExcel({
                fileName: sFileName || "SpreadSheet",
                table: oTable,
                data: oData
            });
        },

        /**
        * @public
        * @see 사용처 DialogCreate Fragment Open 이벤트
        */
        onAddSupplierPress: function () {
            var oView = this.getView();

            var oMasterModel = this.getModel("master");
				oMasterModel.setData({
                    "tenant_id": "L2100",
                    "sourcing_supplier_nickname": ""                    
                }, "/SupplierGen");
            oTransactionManager.setServiceModel(this.getModel());

            if (!this.pDialog) {
                this.pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "dp.gs.gsSupplierMgt.view.DialogCreate",
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

        createPopupClose: function (oEvent) {            
            this.byId("dialogAddSupplier").close();
        },

        /**
        * @public
        * @see 사용처 create 팝업에서 Next 버튼 press시 저장 후 Object로 이동
        */
        createPopupSave: function () {           
                
            var oView = this.getView(),                               
                that = this;
            var tenantId = "L2100";           
            
            var ssn = this.getView().byId("ssn").getValue(); 
            var email = this.getView().byId("email").getValue();  
            // var ssn = "ZKH"  
            
            if(this.validator.validate(this.byId("dialogAddSupplier")) !== true) return;       
            // this.byId("dialogAddSupplier").close();
            // this.getRouter().navTo("suppliePage", {
			// 	layout: LayoutType.OneColumn,
			// 	tenantId: tenantId,
            //     ssn: ssn,
            //     mode: "edit"
            // });
            
            var chkEmail = this.CheckEmail(email);
            if(!chkEmail){
                MessageBox.alert("이메일 형식이 잘못되었습니다.");
                return false;
            }

			MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
				title : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						oTransactionManager.submit({						
							success: function(ok){								
                                oView.setBusy(false);
                                // that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
                                    that.byId("dialogAddSupplier").close();
                                    that.byId("pageSearchButton").firePress();
                                    // var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/fullScreen");
                                    that.getRouter().navTo("suppliePage", {
                                        layout: LayoutType.OneColumn,
                                        tenantId: tenantId,
                                        ssn: ssn,
                                        mode: "edit"
                                    });
							}
						});
					};
				}
            });
            this.validator.clearValueState(this.byId("dialogAddSupplier"));            
            
        },     
        
        onDupChk: function () {            
            MessageBox.alert("준비중입니다.");
        },

        CheckEmail: function (str) {                                                 

            var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

            if(!reg_email.test(str)) {                            

                return false;         

            }else {                       

                return true;         

            }
        },

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onRoutedThisPage: function(){            
            this.getModel("mainListView").setProperty("/headerExpanded", true);      
            var sThisViewId = this.getView().getId();
            var oFcl = this.getOwnerComponent().getRootControl().byId("fcl");
            oFcl.to(sThisViewId);      
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */
		_applySearch: function(aSearchFilters) {
			var oView = this.getView(),
				oModel = this.getModel("list");
			oView.setBusy(true);
			oModel.setTransactionModel(this.getModel());
			oModel.read("/SupplierGen", {
				filters: aSearchFilters,
				success: function(oData){
					oView.setBusy(false);
				}
			});
		},
		
		_getSearchStates: function(){
            var sTenantId = "L2100"               
			
            var aSearchFilters = [];
            
            aSearchFilters.push(new Filter("tenant_id", FilterOperator.EQ, sTenantId));
			
			return aSearchFilters;
		},
		
		_doInitTablePerso: function(){
			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.byId("mainTable"),
				componentName: "gsSupplierMgt",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
        }
        
        // onMainTableFilterPress: function() {
        //     this._MainTableApplyFilter();
        // },

        // _MainTableApplyFilter: function() {

        //     var oView = this.getView(),
		// 		sValue = oView.byId("mainTableSearchField").getValue(),
		// 		oFilter = new Filter("uom_code", FilterOperator.Contains, sValue);

		// 	oView.byId("mainTable").getBinding("items").filter(oFilter, sap.ui.model.FilterType.Application);

        // }


	});
});