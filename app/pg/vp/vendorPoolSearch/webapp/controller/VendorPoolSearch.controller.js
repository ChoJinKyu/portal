sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/Text",
        "sap/m/Input",
        "sap/m/ColumnListItem",
        "sap/m/ObjectIdentifier",        
        
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, JSONModel, MessageToast, MessageBox, Filter, FilterOperator) {
		"use strict";

        // var tenant;
        // var company;
        // var org_type_code;
        // var org_code;
        // var pool_code;

		return BaseController.extend("pg.vendorPoolSearch.controller.VendorPoolSearch", {


            isValNull: function (p_val) {
                if(!p_val || p_val == "" || p_val == null){
                    return true
                }else{
                    return false;
                }
            },

			onInit: function () {
                // this.byId("VpSupplierTable").setEditable(true);
                // this.byId("t2_vent2_company_codedor_code").setEditable(true);
                // this.byId("t2_operation_org_type_code").setEnabled(true);
                // this.byId("t2_operation_org_code").setEnabled(true);
                // this.byId("t2_vendor_pool_code").setEnabled(true);
                // this.byId("t2_vendor_code").setEnabled(true);
                // this.getView().byId("VpSupplierTable").setEditable(true);

            },
            
            onSearch: function () {

                var filters = [];

                var search_repr_department_code = this.getView().byId("search_repr_department_code").getValue();
                var search_evaluation_operation_unit_code = this.getView().byId("search_evaluation_operation_unit_code").getValue();
                var search_managers_name = this.getView().byId("search_managers_name").getValue();
                var search_vendor_pool_code = this.getView().byId("search_vendor_pool_code").getValue();
                var search_vendor_code = this.getView().byId("search_vendor_code").getValue();
                var search_vendor_type_name = "";

                if(!this.isValNull(search_repr_department_code)){
                    filters.push(new Filter("repr_department_code", FilterOperator.Contains, search_repr_department_code));
                }
                
                if(!this.isValNull(search_evaluation_operation_unit_code)){
                    filters.push(new Filter("evaluation_operation_unit_code", FilterOperator.Contains, search_evaluation_operation_unit_code));
                }
                
                if(!this.isValNull(search_managers_name)){
                    filters.push(new Filter("managers_name", FilterOperator.Contains, search_managers_name));
                }
                
                if(!this.isValNull(search_vendor_code)){
                    filters.push(new Filter("vendor_code", FilterOperator.Contains, search_vendor_code));
                }
                if(!this.isValNull(search_vendor_pool_code)){
                    filters.push(new Filter("vendor_pool_code", FilterOperator.Contains, search_vendor_pool_code));
                }

                var oBinding = this.byId("vendorPoolSearchTable").getBinding("rows"); 
                
                this.getView().setBusy(true);
                oBinding.filter(filters);
                this.getView().setBusy(false);    

            },

            onMstTableItemPress : function (oEvent) {

                var v_vendor_code = oEvent.getSource().getBindingContext().getValue('vendor_pool_code');

                    if(!this.isValNull(v_vendor_code))
                    {
                        var filters = [];
                        filters.push(new Filter("vendor_pool_code"   , FilterOperator.EQ, v_vendor_code));
                        var supBinding = this.byId("VpSupplierTable").getBinding("items");
                        supBinding.resetChanges();
                        this.getView().setBusy(true);
                        supBinding.filter(filters);
                        this.getView().setBusy(false);
                    }
                    // this._retrieveParam.dtlParam = v_vendor_code;
            },
            onSupAddRow : function () {
                
                var supBinding = this.byId("VpSupplierTable").getBinding("items");
                var oContext = supBinding.create({
                        "tenant_id" : "L2100",
                        "company_code" : "*",
                        "org_type_code" : "70",
                        "org_code" : "LGCKR2000",
                        "vendor_pool_code" : "VP201610260088",
                        "local_create_dtm": "2020-11-09T00:00:00Z",
                        "local_update_dtm": "2020-11-09T00:00:00Z"
                    });
      			// this.byId("t2_vendor_code").setEditable(true);

                    /*
                        ,
                        "local_create_dtm" : "2020-10-13T00:00:00Z",
                        "local_update_dtm" : "2020-10-13T00:00:00Z",
                        "create_user_id" : "Admin",
                        "update_user_id" : "Admin",
                        "system_create_dtm" : "2020-10-13T00:00:00Z",
                        "system_update_dtm" : "2020-10-13T00:00:00Z"
                        */

            },
			onSupSave : function () {
                var supBinding = this.byId("VpSupplierTable").getBinding("items");

                if (!supBinding.hasPendingChanges()) {
                    MessageBox.error("수정한 내용이 없습니다.");
                    return;
                }

                var oView = this.getView();
                var fnSuccess = function () {
                    oView.setBusy(false);
                    MessageToast.show("저장 되었습니다.");
                    this.onDtlRefresh();
                }.bind(this);

                var fnError = function (oError) {
                    oView.setBusy(false);
                    MessageBox.error(oError.message);
                }.bind(this);


                MessageBox.confirm("저장 하시 겠습니까?", {
                    title : "Comfirmation",
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            oView.setBusy(true);
                            oView.getModel().submitBatch("SupplierUpdateGroup").then(fnSuccess, fnError);
                        } else if (sButton === MessageBox.Action.CANCEL) {
                            
                        };
                    }
                });
            },     

            onDtlRefresh : function () {
                var supBinding = this.byId("VpSupplierTable").getBinding("items");
                var viewBinding = this.byId("vendorPoolSearchTable").getBinding("items");
                
                this.getView().setBusy(true);
                viewBinding.onRefresh();
                this.getView().setBusy(false);
            },                   

            onSupDeleteRow : function () {

                var supSelected  = this.byId("VpSupplierTable").getSelectedContexts();
                var supBinding = this.byId("VpSupplierTable").getBinding("items");
                var supTable  = this.byId("VpSupplierTable");
                // supTable.getContextByIndex(0).setSelected(true);
                // var tt = supTable.isIndexSelected(0)
                // supTable.getContextByIndex(0).getRows();


                // var rows = supTable.getRows();

                // supTable[3].getRows().some(function (oRows) {
                //         oRows.setSelected(true);
                // });


                // this.byId("VpSupplierTable").set

                alert(" supBinding : " + supBinding);
                alert(" supBinding : " + supTable);
                // alert(" supt : " + supt);
                // alert(" rows : " + rows);

                
                // this.getView().byId("VpSupplierTable").setValue()
                //this.byId("codeMstTable").getSelectedItems()
                // var oSelected  = this.byId("codeMstTable").getSelectedContexts();
                if (supSelected.length > 0) {

                    for(var idx = 0; idx < supSelected.length; idx++){
                        //oSelected[idx].delete("$auto");

                        var oView = this.getView();
                        oView.setBusy(true);

                        supSelected[idx].delete("$auto").then(function () {
                            oView.setBusy(false);
                            MessageToast.show("삭제 되었습니다.");
                            // this.onSearch();
                            this.onDtlRefresh();
                        }.bind(this), function (oError) {
                            oView.setBusy(false);
                            MessageBox.error(oError.message);
                        });

                    }

                    /*
                    var oView = this.getView();
                    oView.setBusy(true);

                    oSelected.getBindingContext().delete("$auto").then(function () {
                        oView.setBusy(false);
                        MessageToast.show("삭제 되었습니다.");
                        this.onRefresh();
                    }.bind(this), function (oError) {
                        oView.setBusy(false);
                        MessageBox.error(oError.message);
                    });
                //     */
                    
                }else{
                    MessageBox.error("선택된 행이 없습니다.");
                }
            },

		});
	});
