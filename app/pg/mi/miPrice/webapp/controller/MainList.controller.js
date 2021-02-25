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

        onChangeData : function(oEvent){
            this.getModel("viewControl").setProperty("/enabled", true);

        },

        onChangeCombobox : function(oEvent){
            //if(!oEvent.mParameters.itemPressed == )
            var oBindingInfo = oEvent.getSource().getBindingInfo("selectedKey");
            var sPath = oBindingInfo.binding.getContext().sPath+"/"+oBindingInfo.binding.sPath;
            this.getModel("list").setProperty(sPath, "");
            if(oBindingInfo.binding.sPath === "termsdelv") this.onChangeData(oEvent);
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

                if(table.getSelectedIndices().length > 0){
                    table.getSelectedIndices().reverse().forEach(function (idx) {
                        model.markRemoved(idx);
                    });

                    table.clearSelection();
                }else{
                    MessageToast.show(this.getModel("I18N").getText("/NCM01010"));
                }
            
        },

        _validator : function(){
            var oModel = this.getModel("list");
            var oList = oModel.getChanges();
            var sEmptyMsg = this.getModel("I18N").getText("/ECM01002");
            var bReturn = true;
       
            oList.forEach( function (oRow) {
                
                var oValueStates = {};
                //필수값 체크
                var sMi_material_code = (oRow.mi_material_code === undefined || oRow.mi_material_code === null) ? "" : oRow.mi_material_code;
                var sMi_material_name = (oRow.mi_material_name === undefined || oRow.mi_material_name === null) ? "" : oRow.mi_material_name;
                var sCurrency_unit = (oRow.currency_unit === undefined || oRow.currency_unit === null) ? "" : oRow.currency_unit;
                var sQuantity_unit = (oRow.quantity_unit === undefined || oRow.quantity_unit === null) ? "" : oRow.quantity_unit;
                var sExchange_unit = (oRow.exchange_unit === undefined || oRow.exchange_unit === null) ? "" : oRow.exchange_unit;
                var sExchange = (oRow.exchange === undefined || oRow.exchange === null) ? "" : oRow.exchange;
                var sTermsdelv = (oRow.termsdelv === undefined || oRow.termsdelv === null) ? "" : oRow.termsdelv;
                var sSourcing_group_code = (oRow.sourcing_group_code === undefined || oRow.sourcing_group_code === null) ? "" : oRow.sourcing_group_code;
                var sDelivery_mm = (oRow.delivery_mm === undefined || oRow.delivery_mm === null) ? "" : oRow.delivery_mm;
                var sMi_date = (oRow.mi_date === undefined || oRow.mi_date === null) ? "" : oRow.mi_date;
                var sPrice = (oRow.price === undefined || oRow.price === null) ? "" : oRow.price.toString();

                if(sMi_material_code === "")oValueStates.mi_material_code = {valueState: "Error", valueStateText: sEmptyMsg}; //임시 공통 Validation 완성후 삭제
                else if(sMi_material_code !== "" && sMi_material_name === "")oValueStates.mi_material_code = {valueState: "Error", valueStateText: "등록이 안된 코드입니다"};
                else if(sMi_material_code.length > 40)oValueStates.mi_material_code = {valueState: "Error", valueStateText: "40자 이하의 값을 입력하십시오."}; //임시 공통 Validation 완성후 삭제
                
                if(sCurrency_unit === "")oValueStates.currency_unit = {valueState: "Error", valueStateText: sEmptyMsg}; //임시 공통 Validation 완성후 삭제
                if(sQuantity_unit === "")oValueStates.quantity_unit = {valueState: "Error", valueStateText: sEmptyMsg}; //임시 공통 Validation 완성후 삭제
                
                if(sExchange_unit.length > 40)oValueStates.exchange_unit = {valueState: "Error", valueStateText: "40자 이하의 값을 입력하십시오."};

                if(sExchange === "")oValueStates.exchange = {valueState: "Error", valueStateText: sEmptyMsg}; //임시 공통 Validation 완성후 삭제
                else if(sExchange.length > 40)oValueStates.exchange = {valueState: "Error", valueStateText: "40자 이하의 값을 입력하십시오."};  //임시 공통 Validation 완성후 삭제
                
                if(sSourcing_group_code.length > 10)oValueStates.sourcing_group_code = {valueState: "Error", valueStateText: "10자 이하의 값을 입력하십시오."};  //임시 공통 Validation 완성후 삭제
                if(sDelivery_mm.length > 10)oValueStates.delivery_mm = {valueState: "Error", valueStateText: "10자 이하의 값을 입력하십시오."};  //임시 공통 Validation 완성후 삭제
                
                if(sTermsdelv === "")oValueStates.termsdelv = {valueState: "Error", valueStateText: sEmptyMsg}; //임시 공통 Validation 완성후 삭제
                if(sMi_date === "")oValueStates.mi_date = {valueState: "Error", valueStateText: sEmptyMsg}; //임시 공통 Validation 완성후 삭제
                
                if(sPrice === "")oValueStates.price = {valueState: "Error", valueStateText: sEmptyMsg}; //임시 공통 Validation 완성후 삭제
                else if(sPrice.indexOf(".") > 0 && (sPrice.length - sPrice.indexOf(".")) > 6)oValueStates.price = {valueState: "Error", valueStateText: "소수점 5자리까지 유효합니다."}; 


                if('mi_material_code' in oValueStates || 'currency_unit' in oValueStates || 'quantity_unit' in oValueStates || 'exchange_unit' in oValueStates || 
                'sourcing_group_code' in oValueStates || 'exchange' in oValueStates || 'termsdelv' in oValueStates || 'delivery_mm' in oValueStates || 'mi_date' in oValueStates || 'price' in oValueStates){
                    bReturn = false;
                }

                oRow.__metadata = {_valueStates : oValueStates};
            });

            //if(!bReturn){
            oModel.setProperty("/MIMaterialPriceManagementView", oModel.getProperty("/MIMaterialPriceManagementView"));
            //}

            return bReturn;              
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

        //this.validator.setModel(this.getModel("list"), "list");
        //if(this.validator.validate(this.byId("mainTable"))){
        if(this._validator()){
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
                                    
                                    "use_flag": oRow["use_flag"] !== undefined ? oRow["use_flag"] : true,
                                    "tenant_id": oRow["tenant_id"] !== undefined ? oRow["tenant_id"] : "L2100",
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
            }else{
               console.log("checkRequire");
                return; 
            }
			
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
                //oSmtFilter.getControlByKey("mi_material_name").setValue(oMi_material_name.toUpperCase());       
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
                    //var oMi_material_nameFilter = new Filter("mi_material_name", FilterOperator.Contains, oMi_material_name);
                    var oMi_material_nameFilter = new Filter({
							path: "mi_material_name",
							operator: FilterOperator.Contains,
							value1: oMi_material_name,
							caseSensitive: false
					    });
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
            var sTenantId = "L2100";
            var sLanguageCode = "KO";
            var oExcelModel = this.getModel("excelModel"),
                oListModel = this.getModel("list"), 
                oViewControl = this.getModel("viewControl"),
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
                        var iDataLength = aData.length;
                        var iSuccessLength = 0;
                        that.validator.clearValueState(that.byId("mainTable"));
                        aData.reverse().forEach(function (oRow) {
                            var aKeys = Object.keys(oRow),
                                aValidKeys = ["currency_unit", "quantity_unit", "exchange", "termsdelv"],
                                oValueStates = {},
                                newObj = {};

                            //oRow.mi_date = new Date( oRow.mi_date );
                            aValidKeys.forEach(function(sValidKey){
                                var sValue = oRow[sValidKey];
                                var bRequired = true;
                                var sObjectPath = "";


                                // if(oRow["tenant_id"] === undefined || oRow["tenant_id"] === ""){
                                // }

                                if(sValue !== undefined && sValue !== ""){
                                    sValue = that.replaceSpecialCharacters(sValue);
                                    if(sValidKey === "currency_unit")sObjectPath = "/CurrencyUnitView(tenant_id='"+sTenantId+"',currency_code='"+sValue+"',language_code='"+sLanguageCode+"')";
                                    else if(sValidKey === "quantity_unit")sObjectPath = "/UnitOfMeasureView(tenant_id='"+sTenantId+"',uom_code='"+sValue+"',language_code='"+sLanguageCode+"')"
                                    else if(sValidKey === "exchange")sObjectPath = "/MIExchangeView(tenant_id='"+sTenantId+"',exchage='"+sValue+"')";
                                    else if(sValidKey === "termsdelv")sObjectPath = "/MITermsdelvView(tenant_id='"+sTenantId+"',termsdelv='"+sValue+"')";

                                    if(oModel.getObject(sObjectPath) === undefined){
                                        oRow[sValidKey] = "";
                                        oValueStates[sValidKey] = {valueState: "Error", valueStateText: "유효값이 아닙니다."};
                                    }

                                }else{
                                    //oValueStates[sValidKey] = {valueState: "Error", valueStateText: "필수 입력 값입니다."};
                                }
                            });

                            var iPrice = oRow.price;
                            if(iPrice !== undefined && iPrice !== ""){
                                if(!isNaN(iPrice)){//jQuery.isNumeric(iPrice)
                                    oRow.price = iPrice.toFixed(5);
                                    //oValueStates.price = {valueState: "Error", valueStateText: "소수점 5자리까지 유효합니다."};
                                }else{
                                    oRow.price = undefined;
                                    oValueStates.price = {valueState: "Error", valueStateText: "숫자만 입력가능합니다."};
                                }
                            }
    
                            var sMiDate = oRow.mi_date;
                            
                            if(sMiDate !== undefined && sMiDate !== ""){
                                var dMiDate,
                                sMiDate = sMiDate.toString();
                                if(sMiDate.length === 8){
                                    dMiDate = new Date(sMiDate.substr(0,4) + "-" + sMiDate.substr(4,2) + "-" + sMiDate.substr(6,2));
                                }else if(sMiDate.length === 10){
                                    dMiDate = new Date(sMiDate);
                                }

                                if(dMiDate instanceof Date)oRow.mi_date = dMiDate;
                                else {
                                    oRow.mi_date = "";
                                    oValueStates.mi_date = {valueState: "Error", valueStateText: "날짜타입이 아닙니다"};
                                }
                            }

                            that._getMiMaterial(oRow.mi_material_code).then(function(returnData) {

                                if(!returnData.result){
                                    oValueStates.mi_material_code = {valueState: "Error", valueStateText: "등록이 안된 코드입니다"};
                                }
                                oRow.mi_material_name = returnData.mi_material_name;
                                oRow.category_code = returnData.category_code;
                                oRow.category_name = returnData.category_name;
                                oRow.__metadata = {_valueStates : oValueStates};

                                oListModel.addRecord(oRow, "/MIMaterialPriceManagementView", 0);
                                oViewControl.setProperty("/enabled", true);

                                iSuccessLength ++;
                                if(iDataLength === iSuccessLength)MessageToast.show("업로드가 완료되었습니다.");
                                
                            });
                        });
                    }
                }
            });
        },

        /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */



        _getMiMaterial: function(mi_material_code) {
            var promise = jQuery.Deferred(),
            oModel = this.getModel(),
            oResult = {result:false, mi_material_name : "", category_code : "", category_name :""};

            oModel.read("/MIMatListView", {
                    filters: [new Filter("mi_material_code", FilterOperator.EQ, mi_material_code)],
                    success: function(oData) {
                        if(oData["results"].length > 0){
                            oResult = oData["results"][0];
                            oResult.result = true;
                        }
                        promise.resolve(oResult);
                        
                    }.bind(this),						
                    error: function(oData){						
                        //promise.reject(oData);
                        promise.reject(oResult);	
                    }
                });

            return promise;
        },




        replaceSpecialCharacters: function(sAttr) {
            var attribute = sAttr.toString();
        // replace the single quotes
            attribute = attribute.replace(/'/g, "''");

            attribute = attribute.replace(/%/g, "%25");
            attribute = attribute.replace(/\+/g, "%2B");
            attribute = attribute.replace(/\//g, "%2F");
            attribute = attribute.replace(/\?/g, "%3F");

            attribute = attribute.replace(/#/g, "%23");
            attribute = attribute.replace(/&/g, "%26");
            return attribute;
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
           //oEvent.getSource().getBindingInfo("value").binding.getContext().sPath
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
                //oCells[4].setText("");
                
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
                        //oCells[4].setText(oData["results"][0]["category_name"]);
                    }else {
                        oCells[2].setText("");
                        oCells[3].setText("");
                        //oCells[4].setText("");
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