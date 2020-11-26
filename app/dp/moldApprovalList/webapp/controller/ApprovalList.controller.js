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
], function (BaseController, History, JSONModel, ManagedListModel, DateFormatter, TablePersoController, ApprovalListPersoService, Filter, FilterOperator, Fragment, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Token, Input, ComboBox, Item, Element, syncStyleClass, Label, SearchField) {
	"use strict";
   /**
    * @description 품의 목록 (총 품의 공통)
    * @date 2020.11.19 
    * @author jinseon.lee , daun.lee 
    */
    var toggleButtonId ="";
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
		onInit : function () {
			var oViewModel,
				oResourceBundle = this.getResourceBundle();

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				headerExpanded: true,
				approvalListTableTitle : oResourceBundle.getText("approvalListTableTitle"),
				tableNoDataText : oResourceBundle.getText("tableNoDataText")
			});
			this.setModel(oViewModel, "approvalListView");

			// Add the approvalList page to the flp routing history
			this.addHistoryEntry({
				title: oResourceBundle.getText("approvalListViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#Template-display"
			}, true);
			
            this._doInitSearch();

			this.setModel(new ManagedListModel(), "list");
			
			this.getRouter().getRoute("approvalList").attachPatternMatched(this._onRoutedThisPage, this);

            this._doInitTablePerso();
            
        },

        _doInitTablePerso: function(){
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
        onAfterRendering : function () {
			this.byId("pageSearchButton").firePress();
			return;
        },

        /**
         * @private
         * @see 검색을 위한 컨트롤에 대하여 필요 초기화를 진행 합니다. 
         */
		_doInitSearch: function(){
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S";

            this.getView().setModel(this.getOwnerComponent().getModel());

            /** Date */
            var today = new Date();
            
            this.getView().byId("searchRequestDateS").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()-90));
            this.getView().byId("searchRequestDateS").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
            this.getView().byId("searchRequestDateE").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()-90));
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
		onMainTableUpdateFinished : function (oEvent) {
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
		onMainTablePersoButtonPressed: function(oEvent){
			this._oTPC.openDialog();
		},

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTablePersoRefresh : function() {
			ApprovalListPersoService.resetPersData();
			this._oTPC.refresh();
		},

		/**
		 * Event handler when a table add button pressed
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		onMainTableAddButtonPress: function(){
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
		onPageSearchButtonPress : function (oEvent) {
            //console.log(oEvent.getParameters());
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
         * @description 목록 클릭시 이벤트 
		 * @param {sap.ui.base.Event} oEvent 
		 * @public
		 */
		onMainTableItemPress: function(oEvent) {

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
        
        ///////////////////////////// sap.ui table version ////////////////////////
        /**
         * @private 
         * @see 리스트에서 create 버튼을 제외한 각각의 팝업 오픈
         */
        approvalDialogOpen: function (oEvent){
            var oView = this.getView();
            var oButton = oEvent.getSource();
            var id = oButton.getId();
            var page ="";
            if(id.indexOf("Model") != -1){
                page = "dp.moldApprovalList.view.DialogModel";
                dialogId = "DialogModel";
            }else if(id.indexOf("MoldPartNo") != -1){
                page = "dp.moldApprovalList.view.DialogMoldPartNo";
                dialogId = "DialogMoldPartNo";
            }else if(id.indexOf("Requester") != -1){
                page = "dp.moldApprovalList.view.DialogRequester";
                dialogId = "DialogRequester";
            }
            this._oDialog = Fragment.load({
                id: oView.getId(),
                name: ""+page,
                controller: this
            }).then(function (oDialog) {
                // connect dialog to the root view of this component (models, lifecycle)
                oView.addDependent(oDialog);
                return oDialog;
            });
            this._oDialog.then(function(oDialog) {
                oDialog.open();
                
			});
		
        },

        /**
         * @private 
         * @see approvalDialogOpen 함수에서 오픈한 팝업 닫기
         */
        onHandleClose: function (){
            this.byId(dialogId).close();
            this.byId(dialogId).destroy();
        },

        /**
         * @private 
         * @see approvalDialogOpen 팝업에서 apply버튼 클릭시
         */
        onHandleApply : function () {

            var oTable = this.byId("modelTable");
            var aItems = oTable.getSelectedItems();
            var oInput = this.byId("searchModel");
            console.log(aItems);
            if(aItems != ""){
                aItems.forEach(function(oItem){   
                    console.log(" nItem >>>>> getText 1 " ,  oItem.getCells()[0].getText());  
                    oInput.setValue(oItem.getCells()[0].getText());
                });
            }else{
                oInput.setValue("");
            }
            this.byId(dialogId).close();
            this.byId(dialogId).destroy();
        },

        ///////////////////////////// sap.ui table version end ////////////////////////


        onValueHelpRequested : function (oEvent) {
      
            var path = '';
           
            this._oBasicSearchField = new SearchField({
				showSearchButton: true
            });
            
            this._oValueHelpDialog = sap.ui.xmlfragment("dp.moldApprovalList.view.ValueHelpDialog", this);

            var oFilterBar = this._oValueHelpDialog.getFilterBar();
			oFilterBar.setFilterBarExpanded(false);
			oFilterBar.setBasicSearch(this._oBasicSearchField);

            if(oEvent.getSource().sId.indexOf("searchModel") > -1){
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

            }else if(oEvent.getSource().sId.indexOf("searchMoldPartNo") > -1){
                //part
                this._oInputModel = this.getView().byId("searchMoldPartNo");

                this.oColModel = new JSONModel({
                    "cols": [
                        {
                            "label": "Part No",
                            "template": "part_number"
                        },
                        {
                            "label": "Description",
                            "template": "spec_name"
                        }
                    ]
                });

                path = '/PartNumbers';

                this._oValueHelpDialog.setTitle('Part No');
                this._oValueHelpDialog.setKey('part_number');
                this._oValueHelpDialog.setDescriptionKey('spec_name');
            }

            var aCols = this.oColModel.getData().cols;

            console.log('this._oValueHelpDialog.getKey()',this._oValueHelpDialog.getKey());
            
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
            

        },

        
        /**
         * @private 
         * @see approvalDialogOpen 팝업에서 apply버튼 클릭시
         */
        onValueHelpOkPress: function (oEvent) {
            var aTokens = oEvent.getParameter("tokens");
            console.log(aTokens[0].getKey());
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

			aFilters.push(new Filter({
				filters: [
					new Filter({ path: "model", operator: FilterOperator.Contains, value1: sSearchQuery })
					// new Filter({ path: "Name", operator: FilterOperator.Contains, value1: sSearchQuery }),
					// new Filter({ path: "Category", operator: FilterOperator.Contains, value1: sSearchQuery })
				],
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
        
         /**
         * @public
         * @see 사용처 DialogCreate Fragment Open 이벤트
         */
        onDialogCreate: function (){
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
			this.pDialog.then(function(oDialog) {
				oDialog.open();
			});
		
        },
        

         /**
         * @public
         * @see 사용처 create 팝업에서 나머지 버튼 비활성화 시키는 작업수행
         */ 
        onToggleHandleChange : function(oEvent){
            var groupId = this.getView().getControlsByFieldGroupId("toggleButtons");
            var isPressedId;
            isPressedId =oEvent.getSource().getId();
            toggleButtonId = isPressedId;
            for(var i=0; i<groupId.length; i++){
                if(groupId[i].getId() != isPressedId){
                    groupId[i].setPressed(false);
                }
            }
           
        },

         /**
         * @public
         * @see 사용처 create 팝업에서 select 버튼 press시 Object로 이동
         */ 
        handleConfirm : function(targetControl){
            console.log(toggleButtonId);
            var groupId = this.getView().getControlsByFieldGroupId("toggleButtons");
            for(var i=0; i<groupId.length; i++){
                if(groupId[i].getPressed() == true){
                    console.log(groupId[i].mProperties.text);
                    console.log(this.byId("searchCompanyF").getValue());
                    console.log(this.byId("searchPlantF").getValue());
                    this.getRouter().navTo("pssaCreateObject", {
                        company: this.byId("searchCompanyF").getValue()
                        , plant: this.byId("searchPlantF").getValue()
                        , 
                    });
                }    
            }
        },

        createPopupClose: function (oEvent){
            console.log(oEvent);
            this.byId("dialogApprovalCategory").close();
        },

       

        /* Affiliate End */

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onRoutedThisPage: function(){
			this.getModel("approvalListView").setProperty("/headerExpanded", true);
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
			oModel.read("/MoldMasterSpec", {
				filters: aSearchFilters,
				success: function(oData){
					oView.setBusy(false);
				}
			});
		},
		
		_getSearchStates: function(){
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S"
            
            var aCompany = this.getView().byId("searchCompany"+sSurffix).getSelectedItems();

            var sDateFrom = this.getView().byId("searchRequestDate"+sSurffix).getDateValue();
            var sDateTo = this.getView().byId("searchRequestDate"+sSurffix).getSecondDateValue();

			var sModel = this.getView().byId("searchModel").getValue().trim();
            var	sPart = this.getView().byId("searchMoldPartNo").getValue().trim();
            // var	sFamilyPart = this.getView().byId("searchFamilyPart").getValue().trim();
            // var	sStatus = this.getView().byId("searchStatus").getSelectedKey();
            
            var aSearchFilters = [];
            var companyFilters = [];
            
            if(aCompany.length > 0){

                aCompany.forEach(function(item, idx, arr){
                    companyFilters.push(new Filter("company_code", FilterOperator.EQ, item.mProperties.key ));
                });

                aSearchFilters.push(
                    new Filter({
                        filters: companyFilters,
                        and: false
                    })
                );
            }

            var dateFilters = [];

            dateFilters.push(
                new Filter({
                    path: "mold_spec_register_date",
                    operator: FilterOperator.BT,
                    value1: this.getFormatDate(sDateFrom),
                    value2: this.getFormatDate(sDateTo)
                })
            );

            dateFilters.push(new Filter("mold_spec_register_date", FilterOperator.EQ, ''));
            dateFilters.push(new Filter("mold_spec_register_date", FilterOperator.EQ, null));

            aSearchFilters.push(
                new Filter({
                    filters: dateFilters,
                    and: false
                })
            );

			if (sModel) {
				aSearchFilters.push(new Filter("model", FilterOperator.StartsWith, sModel));
            }
            
            if (sPart) {
				aSearchFilters.push(new Filter("part_number", FilterOperator.StartsWith, sPart));
            }
            
            // if (sFamilyPart) {
			// 	aSearchFilters.push(new Filter("family_part_numbers", FilterOperator.Contains, sFamilyPart));
            // }
            
            // if (sStatus) {
			// 	aSearchFilters.push(new Filter("mold_spec_status_code", FilterOperator.EQ, sStatus));
            // }
            
            console.log(aSearchFilters);

			return aSearchFilters;
		},
		
		
        getFormatDate: function (date){
            console.log(date);
            var year = date.getFullYear();              //yyyy
            var month = (1 + date.getMonth());          //M
            month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
            var day = date.getDate();                   //d
            day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
            return  year + '' + month + '' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
        }

	});
});