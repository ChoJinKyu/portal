sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/m/Dialog",
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/IconPool", 
        "sap/m/DialogType",
       	"sap/m/Button",
    	"sap/m/ButtonType",
    	"sap/m/List",
        "sap/m/StandardListItem",
        "sap/ui/thirdparty/jquery",
        "sap/ui/table/RowSettings",
        "sap/m/Text"
        

	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, JSONModel, MessageToast, MessageBox, Filter, FilterOperator) {
		"use strict";

		return BaseController.extend("cm.hrEmployeeMgr.controller.hrEmployeeMgr", {

            isValNull: function (p_val) {
                if(!p_val || p_val == "" || p_val == null){
                    return true
                }else{
                    return false;
                }
            },

            onInit: function () {
                this._retrieveParam = new JSONModel({
                    mstParam : "",
                    dtlParam : "",
                    lngParam : ""
                });                
                
            },

            onAfterRendering: function () {

                //debugger
                // search_use_yn
                // this.byId("search_use_yn").getBinding("items")

            },

            onUpdate: function () {

                var oTable = this.byId("hremployeeTable"),     
                    // that = this,
                    // oBinding = oTable.getBinding("rows"),                    
                    // rows = oTable.getRows(), 
                    // oUiModel = this.getModel("ui"),
                    // indices = oTable.getSelectedIndices();     
                    selectedRow = oTable.getSelectedIndices();


                    alert("selectedRow : " + selectedRow);
               


            },


			onSearch: function () {

                var filters = [];

                var comboBox_use_yn = this.byId("search_comboBox_use_yn").getSelectedItem().getKey();               
                var company_name = this.getView().byId("search_assign_company_name").getValue();
                var email_id = this.getView().byId("search_email_id").getValue();
                var tenant_id = this.getView().byId("search_tenant_id").getValue();
                var assign_type_code = this.getView().byId("search_assign_type_code").getValue();
                var user_korean_name = this.getView().byId("search_user_korean_name").getValue();
                var job_title = this.getView().byId("search_job_title").getValue();
                var user_english_name = this.getView().byId("search_user_english_name").getValue();

                // 필터 추가 
                if(!this.isValNull(comboBox_use_yn)){
                    filters.push(new Filter("search_comboBox_use_yn", FilterOperator.Contains, comboBox_use_yn));
                }

                if(!this.isValNull(company_name)){
                    filters.push(new Filter("search_assign_company_name", FilterOperator.Contains, company_name));
                }

                if(!this.isValNull(email_id)){
                    filters.push(new Filter("search_email_id", FilterOperator.Contains, email_id));
                }

                if(!this.isValNull(tenant_id)){
                    filters.push(new Filter("search_tenant_id", FilterOperator.Contains, tenant_id));
                }

                if(!this.isValNull(assign_type_code)){
                    filters.push(new Filter("search_assign_type_code", FilterOperator.Contains, assign_type_code));
                }

                if(!this.isValNull(user_korean_name)){
                    filters.push(new Filter("search_user_korean_name", FilterOperator.Contains, user_korean_name));
                }

                if(!this.isValNull(job_title)){
                    filters.push(new Filter("search_job_title", FilterOperator.Contains, job_title));
                }
                if(!this.isValNull(user_english_name)){
                    filters.push(new Filter("search_user_english_name", FilterOperator.Contains, user_english_name));
                }


                var mstBinding = this.byId("hremployeeTable").getBinding("items");
                //var mstBinding = this.byId("codeMstTable").getBinding("rows");
                mstBinding.resetChanges();
                this._retrieveParam.mstParam = "";
                this._retrieveParam.dtlParam = "";
                this._retrieveParam.lngParam = "";

                this.getView().setBusy(true);
                mstBinding.filter(filters);
                this.getView().setBusy(false);

            },

			onMstTableItemPress : function (oEvent) {

                var v_searchCond = {
                    tenant_id : oEvent.getSource().getBindingContext().getValue('tenant_id'),
                    employee_number   : oEvent.getSource().getBindingContext().getValue('employee_number'),
                    email_id  : oEvent.getSource().getBindingContext().getValue('email_id'),
                    user_korean_name    : oEvent.getSource().getBindingContext().getValue('user_korean_name'),    
                    user_english_name  : oEvent.getSource().getBindingContext().getValue('user_english_name'),
                    local_create_dtm    : oEvent.getSource().getBindingContext().getValue('local_create_dtm'),
                    local_finish_dtm  : oEvent.getSource().getBindingContext().getValue('local_create_dtm'),
                    assign_company_name    : oEvent.getSource().getBindingContext().getValue('assign_company_name')                
                };

                // var oSelectedItem = oEvent.getSource();
                // var oContext = oSelectedItem.getBindingContext();
                // var sPath = oContext.getPath();
                // var oProductDetailPanel = this.getView().byId("currencyDetail");
                // oProductDetailPanel.bindElement({ path: sPath, model: "Currency" });

                alert("email_id : " + oEvent.getSource().getBindingContext().getValue('email_id'));

                this.getView().byId("i_employee_number").setValue(oEvent.getSource().getBindingContext().getValue('employee_number'));
                this.getView().byId("i_tenant_id").setValue("");
                this.getView().byId("i_user_korean_name").setValue("");                
                this.getView().byId("i_user_english_name").setValue("");                
                this.getView().byId("i_email_id").setValue( oEvent.getSource().getBindingContext().getValue('email_id'));
                this.getView().byId("i_user_lang").setValue("");

                this.fn_searchCodeDtl(v_searchCond);

            }, 
            
			fn_searchCodeDtl : function (p_searchCond) {                

                var v_employee_number = p_searchCond.employee_number;

                var oView = this.getView(),
				that  = this;
                
                var oControl = oView.byId("i_employee_number");

                oControl.getBinding("value").setContext(null);

                oControl.getBinding("value").setContext(v_employee_number);

                alert("v_employee_number : " + v_employee_number);

                // if(!this.isValNull(v_employee_number) ){
                //     var filters = [];
                //     filters.push(new Filter("employee_number"   , FilterOperator.EQ, v_employee_number));

                //     var dtlBinding = this.byId("employeeDetail").getBinding("items");
                //     dtlBinding.resetChanges();
                //     this.getView().setBusy(true);
                //     dtlBinding.filter(filters);
                //     this.getView().setBusy(false);

                // }

                


                this._retrieveParam.dtlParam = p_searchCond;

            },

            handleChange: function (oEvent) {
			var oValidatedComboBox = oEvent.getSource(),
				sSelectedKey = oValidatedComboBox.getSelectedKey(),
				sValue = oValidatedComboBox.getValue();

                var tctenantid = this.getView().byId("c_tenant_id");            

               alert("sSelectedKey : " +  sSelectedKey + " ||sValue : " + sValue );

                if(sSelectedKey=="Y")
                {
                    tctenantid.setVisible(true);
                }
                else{
                    tctenantid.setVisible(false);
                }




		}

		});
	});
