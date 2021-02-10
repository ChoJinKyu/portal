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
    'sap/ui/export/library',
	'sap/ui/export/Spreadsheet',
    "sap/ui/model/json/JSONModel"
], function (BaseController, Multilingual, TransactionManager, ManagedListModel, Formatter, Validator, ExcelUtil, TablePersoController, MainListPersoService, 
		Filter, FilterOperator, Sorter, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item,exportLibrary, Spreadsheet, JSONModel) {
	"use strict";

    // var oTransactionManager;
    
    var EdmType = exportLibrary.EdmType;

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
            this.setModel(new JSONModel({enabled : false}), "viewControl");
            this.setModel(new JSONModel(), "excelModel");

            //sheet.js cdn url
            jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.5/xlsx.full.min.js");

			oMultilingual.attachEvent("ready", function(oEvent){
				var oi18nModel = oEvent.getParameter("model");
				this.addHistoryEntry({
					title: oi18nModel.getText("/MIPRICE_TITLE"),
					icon: "sap-icon://table-view",
					intent: "#Template-display"
                }, true);
                
                // var b = this.getView().byId("smartFilterBar").getContent()[0].getContent();
                // $.each(b, function(index, item) {

                //     if (item.sId.search("btnGo") !== -1) {
                //         item.setText(this.oi18nModel.getText("/EXECUTE"));
                //     }

                // }.bind(this));
            }.bind(this));

            this.getView().byId("smartFilterBar")._oSearchButton.setText("조회");
            
           //this._doInitTablePerso();
            this.enableMessagePopover();
        },
        
        onRenderedFirst : function () {
            this.isFirst = true;
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
				MessageBox.confirm(this.getModel("I18N").getText("/NCM00005"), {
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
                oModel = this.getModel("list"),
                oViewControl = this.getModel("viewControl");
			oModel.addRecord({
                "price": "",
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
            oViewControl.setProperty("/enabled", true);
		},

		onMainTableDeleteButtonPress: function(){
            //--- m Table 일 경우,
			// var oTable = this.byId("mainTable"),
            //     oModel = this.getModel("list"),
            //     aItems = oTable.getSelectedItems(),
            //     aIndices = [];
			
			// aItems.forEach(function(oItem){
			// 	aIndices.push(oModel.getProperty("/MIMaterialPriceManagementView").indexOf(oItem.getBindingContext("list").getObject()));
			// });
			// aIndices = aIndices.sort(function(a, b){return b-a;});
			// aIndices.forEach(function(nIndex){
			// 	//oModel.removeRecord(nIndex);
			// 	oModel.markRemoved(nIndex);
			// });
            // oTable.removeSelections(true);
            // -----------------//
            // this.validator.clearValueState(this.byId("mainTable"));

            // var [tId, mName] = arguments;
            // var table = this.byId(oTable);
            // var model = this.getView().getModel(oModel);
            // table.getSelectedIndices().reverse().forEach(function (idx) {
            //     model.markRemoved(idx);
            // });

            var table = this.byId("mainTable"),
                model = this.getModel("list");
            table.getSelectedIndices().reverse().forEach(function (idx) {
                model.markRemoved(idx);
            });

            table.clearSelection();
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

			MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
				title : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {

                        var oList = oModel.getChanges();
                        oList.forEach( function (oRow) {
                            if( oRow["price"] == null || oRow["price"].length == 0 ) {
                                MessageToast.show(that.getModel("I18N").getText("/ECM01010"))
                                return;
                            }

                            // ["price", "category_code", "category_name", "currency_unit", "delivery_mm", "exchange", "exchange_unit", "mi_date", "mi_material_code", "mi_material_name", "quantity_unit", "sourcing_group_code", "termsdelv", "__entity", "_row_state_"]
                            var aKeys = Object.keys(oRow);
                            if( oRow["_row_state_"] == "C" ){

                                delete oRow["_row_state_"];

                                var oItem = {
                                    "price":  parseFloat(oRow["price"] ),
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
                                        MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
                                        that.byId("pageSearchButton").firePress();
                                    },
                                    error: function (aa, bb){
                                        if( aa.statusCode == "409" ) {
                                            MessageToast.show(that.getModel("I18N").getText("/ECM01004"));
                                        }else {
                                            MessageToast.show(that.getModel("I18N").getText("/EPG00003"));
                                        }
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
                                        MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
                                        that.byId("pageSearchButton").firePress();
                                    },
                                    error: function (aa, bb){
                                        MessageToast.show(that.getModel("I18N").getText("/EPG00001")); 
                                    }
                                });
                            }else if( oRow["_row_state_"] == "U" ){

                                delete oRow["_row_state_"];

                                var oItem = {
                                    "price":  parseFloat(oRow["price"] ),
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

                                var path = oView.getModel().createKey("/MIMaterialPriceManagement", {
                                    tenant_id:          oItem.tenant_id,
                                    mi_material_code:   oItem.mi_material_code,
                                    exchange:           oItem.exchange,
                                    currency_unit:      oItem.currency_unit,
                                    quantity_unit:      oItem.quantity_unit,
                                    termsdelv:          oItem.termsdelv,
                                    mi_date:            oItem.mi_date
                                });
                                
                                // oView.getModel().createEntry("/MIMaterialPriceManagement", b);
                                oView.getModel().update( path , oItem , {
                                    groupId: "updateRow",
                                    method: "PUT",
                                    success: function (oData) {
                                        // oItem.__entity = sPath;
                                        // that.onPageSearchButtonPress();
                                        // that.onBeforeRebindTable();
                                        // oModel.refresh(true);
                                        MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
                                        that.byId("pageSearchButton").firePress();
                                    },
                                    error: function (aa, bb){
                                        MessageToast.show(that.getModel("I18N").getText("/EPG00002")); 
                                        
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
                    this.byId("mainTable").clearSelection();
                    this._setTableHeader();
					oView.setBusy(false);
				}.bind(this)
			});
        },
        
        _setTableHeader: function(){
            var sHeader = this.byId("smartTable_MainTable_ResponsiveTable").getHeader();
            var iCount = this.byId("mainTable").getBinding("rows").iLength;
            this.byId("smartTable_MainTable_ResponsiveTable").getToolbar().getContent()[0].setText(sHeader+" ("+iCount+")");
        },
		
		_getSearchStates: function(){
			var aTableSearchState = [];
            if( this.isFirst ) {
                // 최초 실행시 빈 모델 바인딩 시키기 위함.
                var oMi_material_codeFilter = new Filter("mi_material_code", FilterOperator.EQ, "ZASDFAWEGJWAEOFJAWEJWEAASDLKFJAS");
                aTableSearchState.push(oMi_material_codeFilter);

                var oModel = this.getView().getModel();
                oModel.setSizeLimit(1000);

                this.isFirst = false;
            }else {

                var oSmtFilter = this.getView().byId("smartFilterBar");             //smart filter
                
                //combobox value
                // var oMi_tenant_id = oSmtFilter.getControlByKey("tenant_id").getSelectedKey();    
                var oMi_material_code = oSmtFilter.getControlByKey("mi_material_code").getSelectedKeys();
                var oMi_material_name = oSmtFilter.getControlByKey("mi_material_name").getValue();       
                oSmtFilter.getControlByKey("mi_material_name").setValue(oMi_material_name.toUpperCase());       
                var oCategory_code = oSmtFilter.getControlByKey("category_code").getSelectedKeys();    
                var oExchange = oSmtFilter.getControlByKey("exchange").getSelectedKeys();    
                var oTermsdelv = oSmtFilter.getControlByKey("termsdelv").getSelectedKeys();    
                var oMi_date = oSmtFilter.getControlByKey("mi_date").getValue();    
                
                if (oMi_material_code.length > 0) {
                    for( var i = 0; i < oMi_material_code.length ; i ++ ) {
                        var oMi_material_codeFilter = new Filter("mi_material_code", FilterOperator.EQ, oMi_material_code[i]);
                        aTableSearchState.push(oMi_material_codeFilter);
                    }
                }
    
                if (oMi_material_name.length > 0) {
                    var oMi_material_nameFilter = new Filter("mi_material_name", FilterOperator.Contains, oMi_material_name);
                    aTableSearchState.push(oMi_material_nameFilter);
                }
    
                if (oCategory_code.length > 0) {
                    for( var i = 0; i < oCategory_code.length ; i ++ ) {
                        var oCategory_codeFilter = new Filter("category_code", FilterOperator.EQ, oCategory_code[i]);
                        aTableSearchState.push(oCategory_codeFilter);
                    }
                }
                
                if (oExchange.length > 0) {
                    for( var i = 0; i < oExchange.length ; i ++ ) {
                        var oExchangeFilter = new Filter("exchange", FilterOperator.EQ, oExchange[i]);
                        aTableSearchState.push(oExchangeFilter);
                    }
                }  
                
                if (oTermsdelv.length > 0) {
                    for( var i = 0; i < oTermsdelv.length ; i ++ ) {
                        var oTermsdelvFilter = new Filter("termsdelv", FilterOperator.EQ, oTermsdelv[i]);
                        aTableSearchState.push(oTermsdelvFilter);
                    }
                } 

                if(oMi_date.length > 0){
                    console.log(oMi_date);

                    oSmtFilter.getControlByKey("mi_date").getFrom().setHours("09","00","00","00");  
                    oSmtFilter.getControlByKey("mi_date").getTo().setHours("09","00","00","00");  

                    var fromDate = oSmtFilter.getControlByKey("mi_date").getFrom();  
                    var toDate = oSmtFilter.getControlByKey("mi_date").getTo();
                    
                    console.log("fromDate:"+fromDate+" \ntoDate:"+toDate);

                    var oMi_dateFilter = new Filter("mi_date", FilterOperator.BT, fromDate, toDate);
                    aTableSearchState.push(oMi_dateFilter);

                }

            }
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

			// var mBindingParams = oEvent.getParameter("bindingParams");
			// var oSmtFilter = this.getView().byId("smartFilterBar");             //smart filter
			
            // //combobox value
            // // var oMi_tenant_id = oSmtFilter.getControlByKey("tenant_id").getSelectedKey();    
			// var oMi_material_code = oSmtFilter.getControlByKey("mi_material_code").getSelectedKeys();
			// var oMi_material_name = oSmtFilter.getControlByKey("mi_material_name").getValue();            
            // var oCategory_code = oSmtFilter.getControlByKey("category_code").getSelectedKey();    
            // var oExchange = oSmtFilter.getControlByKey("exchange").getValue();    
            // var oMi_date = oSmtFilter.getControlByKey("mi_date").getValue();    
            
			// if (oMi_material_code.length > 0) {
            //     for( var i = 0; i < oMi_material_code.length ; i ++ ) {
            //         var oMi_material_codeFilter = new Filter("mi_material_code", FilterOperator.EQ, oMi_material_code[i]);
            //         mBindingParams.filters.push(oMi_material_codeFilter);
            //     }
			// }

			// if (oMi_material_name.length > 0) {
			// 	var oMi_material_nameFilter = new Filter("mi_material_name", FilterOperator.Contains, oMi_material_name);
			// 	mBindingParams.filters.push(oMi_material_nameFilter);
			// }

			// if (oCategory_code.length > 0) {
			// 	var oCategory_codeFilter = new Filter("category_code", FilterOperator.EQ, oCategory_code);
			// 	mBindingParams.filters.push(oCategory_codeFilter);
			// }
			
			// if (oExchange.length > 0) {
			// 	var oExchangeFilter = new Filter("exchange", FilterOperator.Contains, oExchange);
			// 	mBindingParams.filters.push(oExchangeFilter);
            // }  
            
            // if (oMi_date.length > 0 ) {
            //     var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
            //         pattern: "yyyy-MM-ddTHH:mm:ss"
            //     });
            //     var oDate = oDateFormat.format(oDateFormat.parse(oMi_date));

			// 	var oMi_dateFilter = new Filter("mi_date", FilterOperator.EQ, new Date(oDate));
			// 	mBindingParams.filters.push(oMi_dateFilter);
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

                            oRow.mi_date = new Date( oRow.mi_date );

                            oListModel.addRecord(oRow, "/MIMaterialPriceManagementView", 0);
							that.validator.clearValueState(that.byId("mainTable"));

                        });
                    }
                }
            });
        },
        onBeforeExport: function( oEvent ) {
            
        },
        onLiveChange: function (oEvent) {
            console.log("onLiveChange");
            var codeTemp = oEvent.getParameter("value");

            this._setColumnbind( codeTemp, oEvent.getSource().getParent().getCells() );

        },
        onSuggestionItemSelected: function (oEvent) {
            console.log("onSuggestionItemSelected");

             var codeTemp = oEvent.getParameter("selectedItem").getProperty("text");

            this._setColumnbind( codeTemp , oEvent.getSource().getParent().getCells());

        },
        onSubmit: function (oEvent) {

            // setTimeout(function() {
            //     console.log('Works! : ' + oEvent );
            // }.bind(oEvent), 3000);
           var codeTemp = oEvent.getParameter("value");

           this._setColumnbind( codeTemp , oEvent.getSource().getParent().getCells());
            

        },

        onCheck: function(oEvent){
            var oViewControl = this.getModel("viewControl");
            
            oViewControl.setProperty("/enabled", 
            oEvent.getSource().getSelectedIndices().length > 0 || this.getModel("list").getChanges().length > 0);

        },

        _setColumnbind: function( value , oCells ) {
            // var codeTemp = oEvent.getParameter("value");

             console.log("_setColumnbind >> " + value);

            var oView = this.getView(),
                oModel = this.getModel() ;//,
                // oEventTemp = oEvent,
                // oCells = oEventTemp.getSource().getParent().getCells();

                oCells[2].setText("");
                oCells[3].setText("");
                oCells[4].setText("");
                
            //MIMatListView // mi_material_code
            
			oModel.read("/MIMatListView", {
                filters: [new Filter("mi_material_code", FilterOperator.EQ, value)],
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
        },


        createColumnConfig: function() {
			return [
				{
					label: this.getModel("I18N").getText("/MI_MATERIAL_CODE"),
					property: 'mi_material_code',
					width: '15'
				},
				{
					label: this.getModel("I18N").getText("/MI_MATERIAL_NAME"),
					property: 'mi_material_name',
					width: '25'
				},
				{
					label: this.getModel("I18N").getText("/CATEGORY_CODE"),
					property: 'category_code',
					width: '15'
				},
				{
					label: this.getModel("I18N").getText("/CATEGORY_NAME"),
					property: 'category_name',
					width: '15'
                },
                {
					label: this.getModel("I18N").getText("/CURRENCY_UNIT"),
					property: 'currency_unit',
					width: '15'
                },
                {
					label: this.getModel("I18N").getText("/QUANTITY_UNIT"),
					property: 'quantity_unit',
					width: '15'
                },
                {
					label: this.getModel("I18N").getText("/EXCHANGE_UNIT"),
					property: 'exchange_unit',
					width: '15'
                },
                {
					label: this.getModel("I18N").getText("/EXCHANGE_CODE"),
					property: 'exchange',
					width: '15'
                },
                {
					label: this.getModel("I18N").getText("/TERMS_OF_DELIVERY"),
					property: 'termsdelv',
					width: '15'
                },
                {
					label: this.getModel("I18N").getText("/SOURCING_GROUP_CODE"),
					property: 'sourcing_group_code',
					width: '15'
                },
				{
					label: this.getModel("I18N").getText("/DELIVERY_MM"),
					property: 'delivery_mm',
					width: '15'
                },
                {
					label: this.getModel("I18N").getText("/MI_DATE"),
					property: 'mi_date',
                    type: EdmType.Date,
                    format: 'yyyy/mm/dd',
					width: '15'
                },
                 {
					label: this.getModel("I18N").getText("/PRICE"),
					property: 'price',
                    type: EdmType.Number,
                    scale: 3,
					width: '15'
                }
            ];
		},
        onExport: function() {
			var aCols, aProducts, oSettings, oSheet;

			aCols = this.createColumnConfig();
			aProducts = this.getView().getModel("list").getProperty('/MIMaterialPriceManagementView');

			oSettings = {
				workbook: { columns: aCols },
				dataSource: aProducts,
				fileName: this.byId("smartTable_MainTable_ResponsiveTable").getHeader()
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then( function() {
					// MessageToast.show('Spreadsheet export has finished');
				})
				.finally(oSheet.destroy);
		}


	});
});