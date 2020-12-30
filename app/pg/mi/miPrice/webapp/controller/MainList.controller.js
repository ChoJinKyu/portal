sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"ext/lib/model/TransactionManager",
	"ext/lib/model/ManagedListModel",
    "ext/lib/formatter/Formatter",
    "ext/lib/util/Validator",
    "ext/lib/util/ExcelUtil",
	"sap/m/TablePersoController",
	"./MainListPersoService",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"sap/m/ComboBox",
    "sap/ui/core/Item",
    "sap/ui/model/json/JSONModel"
], function (BaseController, Multilingual, TransactionManager, ManagedListModel, Formatter, Validator, ExcelUtil, TablePersoController, MainListPersoService, 
		Filter, FilterOperator, Sorter, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, JSONModel) {
	"use strict";

	// var oTransactionManager;

	return BaseController.extend("pg.mi.miPrice.controller.MainList", {

        formatter: Formatter,
        
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
            this.setModel(new ManagedListModel(), "list");
            
            this.setModel(new JSONModel(), "excelModel");

            //sheet.js cdn url
            jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.5/xlsx.full.min.js");

			oMultilingual.attachEvent("ready", function(oEvent){
				var oi18nModel = oEvent.getParameter("model");
				this.addHistoryEntry({
					title: oi18nModel.getText("/MESSAGE_MANAGEMENT"),
					icon: "sap-icon://table-view",
					intent: "#Template-display"
                }, true);
                
                var b = this.getView().byId("smartFilterBar").getContent()[0].getContent();
                $.each(b, function(index, item) {

                    if (item.sId.search("btnGo") !== -1) {
                        item.setText(this.oi18nModel.getText("/EXECUTE"));
                    }

                }.bind(this));
			}.bind(this));

           //this._doInitTablePerso();
            this.enableMessagePopover();
        },
        
        onRenderedFirst : function () {
            this.byId("pageSearchButton").firePress();
            // this.onPageSearchButtonPress();
        },

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */


		/**
		 * Event handler when a page state changed
		 * @param {sap.ui.base.Event} oEvent the page stateChange event
		 * @public
		 */
		onPageStateChange: function(oEvent){
			debugger;
		},


		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table updateFinished event
		 * @public
		 */
		onMainTableUpdateFinished : function (oEvent) {
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTablePersoButtonPressed: function(oEvent){
			//this._oTPC.openDialog();
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
			var forceSearch = function(){
				var aTableSearchState = this._getSearchStates();
				this._applySearch(aTableSearchState);
			}.bind(this);
			
			if(this.getModel("list").isChanged() === true){
				MessageBox.confirm(this.getModel("I18N").getText("/NCM0003"), {
					title : this.getModel("I18N").getText("/SEARCH"),
					initialFocus : sap.m.MessageBox.Action.CANCEL,
					onClose : function(sButton) {
						if (sButton === MessageBox.Action.OK) {
							forceSearch();
						}
					}.bind(this)
				});
			}else{
				forceSearch();
			}
		},

		onMainTableAddButtonPress: function(){
			var oTable = this.byId("mainTable"),
				oModel = this.getModel("list");
			oModel.addRecord({
                "amount": "",
                "category_code": "",
                "category_name": "",
                "currency_unit": "",
                "delivery_mm": "",
                "exchange": "",
                "exchange_unit": "",
                "mi_date": "",
                "mi_material_code": "",
                "mi_material_name": "",
                "quantity_unit": "",
                "sourcing_group_code": "",
                "termsdelv": ""

            }, "/MIMaterialPriceManagementView", 0);

            oModel.refresh(true);
            this.validator.clearValueState(this.byId("mainTable"));
		},

		onMainTableDeleteButtonPress: function(){
			var oTable = this.byId("mainTable"),
                oModel = this.getModel("list"),
                aItems = oTable.getSelectedItems(),
                aIndices = [];
			
			aItems.forEach(function(oItem){
				aIndices.push(oModel.getProperty("/MIMaterialPriceManagementView").indexOf(oItem.getBindingContext("list").getObject()));
			});
			aIndices = aIndices.sort(function(a, b){return b-a;});
			aIndices.forEach(function(nIndex){
				//oModel.removeRecord(nIndex);
				oModel.markRemoved(nIndex);
			});
            oTable.removeSelections(true);
            // this.validator.clearValueState(this.byId("mainTable"));

            // var [tId, mName] = arguments;
            // var table = this.byId(oTable);
            // var model = this.getView().getModel(oModel);
            // table.getSelectedIndices().reverse().forEach(function (idx) {
            //     model.markRemoved(idx);
            // });
        },
       
        onMainTableSaveButtonPress: function(){
			var oModel = this.getModel("list"),
                oView = this.getView(),
                table = this.byId("mainTable"),
                that = this;
			
			// if(!oModel.isChanged()) {
			// 	MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
			// 	return;
            // }

            // console.log( table.getBin)

            
        //    if(this.validator.validate(this.byId("mainTable")) !== true) return;

			MessageBox.confirm(this.getModel("I18N").getText("/NCM0004"), {
				title : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {

                        var oList = oModel.getChanges();
                        oList.forEach( function (oRow) {
                            // ["amount", "category_code", "category_name", "currency_unit", "delivery_mm", "exchange", "exchange_unit", "mi_date", "mi_material_code", "mi_material_name", "quantity_unit", "sourcing_group_code", "termsdelv", "__entity", "_row_state_"]
                            var aKeys = Object.keys(oRow);
                            if( oRow["_row_state_"] == "C" ){

                                delete oRow["_row_state_"];

                                var oItem = {
                                    "amount":  parseFloat(oRow["amount"] ),
                                    "currency_unit": oRow["currency_unit"],
                                    "delivery_mm": oRow["delivery_mm"],
                                    "exchange": oRow["exchange"],
                                    "exchange_unit": oRow["exchange_unit"],
                                    "mi_date": new Date(oRow["mi_date"]),
                                    "mi_material_code": oRow["mi_material_code"],
                                    "quantity_unit": oRow["quantity_unit"],
                                    "sourcing_group_code": oRow["sourcing_group_code"],
                                    "termsdelv": oRow["termsdelv"],
                                    
                                    "use_flag": true,
                                    "tenant_id": "L2100",
                                    "local_create_dtm": new Date(),
                                    "local_update_dtm": new Date(),
                                    "create_user_id": "Admin",
                                    "update_user_id": "Admin",
                                    "system_create_dtm": new Date(),
                                    "system_update_dtm": new Date()

                                };

                                // var b = {
                                //             // "groupId":"createGroup",
                                //             "groupId":"batchUpdateGroup",
                                //             "properties" : oItem
                                //     };
                                
                                // oView.getModel().createEntry("/MIMaterialPriceManagement", b);
                                oView.getModel().create("/MIMaterialPriceManagement", oItem , {
                                    groupId: "createRow",
                                    success: function (oData) {
                                        // oItem.__entity = sPath;
                                        // that.onPageSearchButtonPress();
                                        // that.onBeforeRebindTable();
                                        // oModel.refresh(true);
                                        that.byId("pageSearchButton").firePress();
                                    },
                                    error: function (aa, bb){

                                        
                                    }
                                });
                                

                            }else if ( oRow["_row_state_"] == "D" ){
                                delete oRow["_row_state_"];

                                var sPath = oView.getModel().createKey("/MIMaterialPriceManagement", {
                                    tenant_id: "L2100",//oRow["tenant_id"], 
                                    mi_material_code: oRow["mi_material_code"],
                                    exchange: oRow["exchange"],
                                    currency_unit: oRow["currency_unit"],
                                    quantity_unit: oRow["quantity_unit"],
                                    termsdelv: oRow["termsdelv"],
                                    mi_date: oRow["mi_date"]
                                });
                                oView.getModel().remove( sPath , {
                                    // groupId: "createRow",

                                    success: function (oData) {
                                        // oItem.__entity = sPath;
                                        // that.onPageSearchButtonPress();
                                        // that.onBeforeRebindTable();
                                        // oModel.refresh(true);
                                        that.byId("pageSearchButton").firePress();
                                    },
                                    error: function (aa, bb){

                                        
                                    }
                                });
                            }
                            
                        });

                        // oView.getModel().create("/MIMaterialPriceManagement", oItem , {
                        //     groupId: "createRow",
                        //     success: function (oData) {
                        //         // oItem.__entity = sPath;
                        //         // that.onPageSearchButtonPress();
                        //         // that.onBeforeRebindTable();
                        //         oModel.refresh(true);
                        //     },
                        //     error: function (aa, bb){

                                
                        //     }
                        // });

						// oView.setBusy(true);
						// oModel.submitChanges({
						// 	success: function(oEvent){
						// 		oView.setBusy(false);
                        //         MessageToast.show(this.getModel("I18N").getText("/NCM0005"));
                        //         this.byId("pageSearchButton").firePress();
                        //         //table.clearSelection().removeSelections(true);
						// 	}.bind(this)
						// });
					};
				}.bind(this)
			});
			
        }, 

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function(aTableSearchState) {
			var oView = this.getView(),
				oModel = this.getModel("list");
			oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
			oModel.read("/MIMaterialPriceManagementView", {
                filters: aTableSearchState,
                // sorters: [
				// 	new Sorter("chain_code"),
				// 	new Sorter("message_code"),
                //     new Sorter("language_code", true)
				// ],
				success: function(oData){
                    this.validator.clearValueState(this.byId("mainTable"));
					oView.setBusy(false);
				}.bind(this)
			});
            // ,
			// 	sorters: [
			// 		new Sorter("chain_code"),
			// 		new Sorter("message_code"),
			// 		new Sorter("language_code", true)
			// 	]
			//oTransactionManager.setServiceModel(this.getModel());
		},
		
		_getSearchStates: function(){
			// var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S",
			// 	chain = this.getView().byId("searchChain"+sSurffix).getSelectedKey(),
			// 	language = this.getView().byId("searchLanguage"+sSurffix).getSelectedKey(),
            //     keyword = this.getView().byId("searchKeyword"+sSurffix).getValue();
				
			var aTableSearchState = [];
			// if (chain && chain.length > 0) {
			// 	aTableSearchState.push(new Filter("chain_code", FilterOperator.EQ, chain));
			// }
			// if (language && language.length > 0) {
			// 	aTableSearchState.push(new Filter("language_code", FilterOperator.EQ, language));
			// }
			// if (keyword && keyword.length > 0) {
			// 	aTableSearchState.push(new Filter({
			// 		filters: [
			// 			new Filter("tolower(message_code)", FilterOperator.Contains, "'" + keyword.toLowerCase().replace("'","''") + "'"),
			// 			new Filter("tolower(message_contents)", FilterOperator.Contains, "'" + keyword.toLowerCase().replace("'","''") + "'")
			// 		],
			// 		and: false
			// 	}));
			// }
			return aTableSearchState;
		},
		
		_doInitTablePerso: function(){
			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.byId("mainTable"),
				componentName: "pg.mi.miPrice",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
        },
        /**
         * Smart Table Filter Event onBeforeRebindTable
         * @param {sap.ui.base.Event} oEvent 
         */
		onBeforeRebindTable: function (oEvent) {
		
            console.group("onBeforeRebindTable");

			var mBindingParams = oEvent.getParameter("bindingParams");
			var oSmtFilter = this.getView().byId("smartFilterBar");             //smart filter
			
            //combobox value
            // var oMi_tenant_id = oSmtFilter.getControlByKey("tenant_id").getSelectedKey();    
			var oMi_material_code = oSmtFilter.getControlByKey("mi_material_code").getSelectedKeys();
			var oMi_material_name = oSmtFilter.getControlByKey("mi_material_name").getValue();            
            var oCategory_code = oSmtFilter.getControlByKey("category_code").getSelectedKey();    
            var oExchange = oSmtFilter.getControlByKey("exchange").getValue();    
            var oMi_date = oSmtFilter.getControlByKey("mi_date").getValue();    

			
			// if (oMi_tenant_id.length > 0) {
			// 	var oMi_tenant_idFilter = new Filter("tenant_id", FilterOperator.EQ, oMi_tenant_id);
			// 	mBindingParams.filters.push(oMi_tenant_idFilter);
            // }

            // mBindingParams.filters.push(this.aFilterBase);
            
			if (oMi_material_code.length > 0) {
                for( var i = 0; i < oMi_material_code.length ; i ++ ) {
                    var oMi_material_codeFilter = new Filter("mi_material_code", FilterOperator.EQ, oMi_material_code[i]);
                    mBindingParams.filters.push(oMi_material_codeFilter);
                }
			}

			if (oMi_material_name.length > 0) {
				var oMi_material_nameFilter = new Filter("mi_material_name", FilterOperator.Contains, oMi_material_name);
				mBindingParams.filters.push(oMi_material_nameFilter);
			}

			if (oCategory_code.length > 0) {
				var oCategory_codeFilter = new Filter("category_code", FilterOperator.EQ, oCategory_code);
				mBindingParams.filters.push(oCategory_codeFilter);
			}
			
			// if (oUse_flag.length > 0) {
			// 	var oCodeFilter = new Filter("use_flag", FilterOperator.EQ, fOcode);
			// 	mBindingParams.filters.push(oCodeFilter);
			// }  
			
			console.groupEnd();              
        },
        onImportChange: function (_oEvent) {
            var oTable = _oEvent.getSource().getParent().getParent();
            var oModel = oTable.getModel();
            var oExcelModel = this.getModel("excelModel"),
                oListModel = this.getModel("list"), 
                that = this;
            
            oExcelModel.setData({});
            ExcelUtil.fnImportExcel({
                uploader: _oEvent.getSource(),
                file: _oEvent.getParameter("files") && _oEvent.getParameter("files")[0],
                model: oExcelModel,
                success: function () {
                    var aTableData = oModel.getProperty("/MIMaterialPriceManagementView") || [],
                        aCols = oTable.getAggregation("items")[1].getColumns(),//oTable.getColumns(),
                        oExcelData = this.model.getData();

                    if (oExcelData) {
                        var aData = oExcelData[Object.keys(oExcelData)[0]];

                        aData.forEach(function (oRow) {
                            var aKeys = Object.keys(oRow),
                                newObj = {};

                            oListModel.addRecord(oRow, "/MIMaterialPriceManagementView", 0);
							that.validator.clearValueState(that.byId("mainTable"));
                            // aCols.forEach(function (oCol, idx) {
                            //     debugger;
                            //     var sLabel = typeof oCol.getLabel === "function" ? oCol.getLabel().getText() : oCol.getHeader().getText();//As Grid or Responsible Table
                            //     var sName = oCol.data("bindName") || "";
                            //     var iKeyIdx = aKeys.indexOf(sLabel);
                            //     if (iKeyIdx > -1 && sName) {
                            //         var oValue = oRow[aKeys[iKeyIdx]];
                            //         if (oValue) {
                            //             oValue = oValue.toString();
                            //         }
                            //         newObj[sName] = oValue !== "N/A" ? oValue : "";
                            //     }
                            // });
                            // aTableData.push(newObj);
                        });
                        // oModel.setProperty("/MIMaterialPriceManagementView", aTableData);
                    }
                }
            });
        },
        onBeforeExport: function( oEvent ) {
            
        },
        onSuggestionItemSelected: function (oEvent) {
            console.log("onSuggestionItemSelected");
        },
        onSubmit: function (oEvent) {
            console.log("onSubmit");
            var codeTemp = oEvent.getParameter("value");

            var oView = this.getView(),
                oModel = this.getModel(),
                oEventTemp = oEvent,
                oCells = oEventTemp.getSource().getParent().getCells();

                oCells[2].setText("");
                oCells[3].setText("");
                oCells[4].setText("");
                
            //MIMatListView // mi_material_code
            
			oModel.read("/MIMatListView", {
                filters: [new Filter("mi_material_code", FilterOperator.EQ, codeTemp)],
                // sorters: [
				// 	new Sorter("chain_code"),
				// 	new Sorter("message_code"),
                //     new Sorter("language_code", true)
				// ],
				success: function(oData){
                    // 2,3,4
                    if( oData["results"].length > 0 ) {
                        oCells[2].setText(oData["results"][0]["mi_material_name"]);
                        oCells[3].setText(oData["results"][0]["category_code"]);
                        oCells[4].setText(oData["results"][0]["category_name"]);
                    }else {
                        oCells[2].setText("");
                        oCells[3].setText("");
                        oCells[4].setText("");
                    }
                    
				}.bind(this)
			});

        }


	});
});