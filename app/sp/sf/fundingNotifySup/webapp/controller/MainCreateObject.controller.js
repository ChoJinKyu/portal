sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "jquery.sap.global",
    "sap/m/CheckBox"
], function (BaseController, Multilingual, JSONModel, History, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, MessageToast, jQuery, CheckBox) {

    "use strict";

    return BaseController.extend("sp.sf.fundingNotifySup.controller.MainCreateObject", {
        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");

            var oViewTableModel = new JSONModel(
                {items :[]}
            );

            this.setModel(new JSONModel(), "applicationSup");
            this.setModel(new JSONModel(), "transactionDivision");
            this.setModel(new JSONModel(), "contModel");

            this.getView().setModel(oViewTableModel, "localModel");

            this._onComCodeListView();
            this._onTransactionDivision();
            this.getRouter().getRoute("mainCreateObject").attachPatternMatched(this._onRoutedThisPage, this);
            
        },

        onAfterRendering: function(oEvent){
            this.setModel(this.getModel("fundingApp"), "createNotify");
        },

        onPageNavBackButtonPress : function() {
            this.getRouter().navTo("mainList", {}, true);
        },
        
        onInvestmentDtlAddButtonPress : function() {
            
            // var oTable = this.byId("investmentDtl");
            var oModel = this.getView().getModel("localModel"),
                oTableModel = oModel.getProperty("/items");
            
            oTableModel.push({
                            itemCode1 : "",
                            itemCode2 : "",
                            itemCode3 : "",
                            itemCode4 : "",
                            itemCode5 : ""
                        });

            oModel.setProperty("/items", oTableModel);
        },

        onPageSaveButtonPress : function() {
            alert("준비중");
        },

        onInvestmentPlanAddButtonPress : function(oEvent) {
            var oView = this.getView(),
                test = false;

            if(test){
                MessageBox.alert("저장하고 입력 하세요.");
            }else{
                if (!this.pDialog) {
                    this.pDialog = Fragment.load({
                        id: oView.getId(),
                        name: "sp.sf.fundingNotifySup.view.DialogCreate",
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
            }
        },

        onCreatePopupClose : function() {
            this.byId("investmentPlanDetails").close();
        },

        onSelectObject : function(oEvent) {
            
        },

        _onComCodeListView : function(oEvent) {
            var that = this;
            
            jQuery.ajax({
                url: "srv-api/odata/v4/sp.fundingApplicationSupV4Service/ComCodeListView(tenant_id='L1100',chain_code='SP',group_code='SP_SF_FUNDING_REASON_CODE',language_cd='KO')/Set",
                contentType: "application/json",
                success: function(oData){
                    var aArr=[];
                    for(var i = 0; i < oData.value.length; i++) {
                        that.byId("checkBoxContent").addItem(new CheckBox({text: oData.value[i].code  +". " + oData.value[i].code_name, selected:"{contModel>/detail/checkModel/" + i + "}"}));
                        aArr.push(false);
                    }
                    that.getModel("contModel").setProperty("/detail/checkModel", aArr);
                }
            });
        },

        _onTransactionDivision : function(oEvent) {
            var tenant_id = "L1100",
                company_code = "LGEKR"

            jQuery.ajax({
                url: "srv-api/odata/v4/sp.fundingApplicationSupV4Service/OrgCodeListView(tenant_id='"+tenant_id+"',company_code='"+ company_code +"')/Set", 
                contentType: "application/json",
                success: function(oData){ 
                    this.getModel("transactionDivision").setData(oData.value);
                }.bind(this)                        
            });
        },

        /**
         * When it routed to this page from the other page.
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onRoutedThisPage : function (oEvent) {
            this._fnInitControlModel();

            // this.onSelectObject(oEvent);
            var oArgs = oEvent.getParameter("arguments");

            this._sTenantId = oArgs.tenantId;
            this._sFundingNotifyNumber = oArgs.fundingNotifyNumber;
            this._sSupplierCode = oArgs.supplierCode;

            var oView = this.getView(),
                oModel = this.getModel("fundingApp"),
                that  = this,
                aFilters = [],
                bFilters = [];

            

            aFilters.push(new Filter("supplier_code", FilterOperator.EQ, this._sSupplierCode));
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this._sTenantId));
            aFilters.push(new Filter("funding_notify_number", FilterOperator.EQ, this._sFundingNotifyNumber));
            
            oModel.read("/SfFundingApplication", {
                //Filter : 공고번호, sub 정보
                filters : aFilters,
                success: function(oRetrievedResult) { 
                        var aArr = [];
                        var aCheckedData = that.getModel("contModel").getProperty("/detail/checkModel") || [];
                        if(!!oRetrievedResult.results[0]){
                            that.getModel("applicationSup").setData(oRetrievedResult.results[0]);
                            var aChecked = oRetrievedResult.results[0].funding_reason_code.split(",");
                            //var aChecked = test.split(",");
                            aChecked.forEach(function(item){
                                aArr.push(!!item);
                            });
                            bFilters.push(new Filter("funding_appl_number", FilterOperator.EQ, oRetrievedResult.results[0].funding_appl_number));
                            oModel.read("/SfFundingInvestPlanMst", {
                                //Filter : 공고번호, sub 정보
                                filters : bFilters,
                                success: function(oRetrievedResult) { 
                                    that.getModel("applicationSup").setProperty("/investPlanMst", oRetrievedResult.results);
                                },
                                error: function(oError) {
                                    
                                }
                            });
                            
                        }else{
                            aArr = aCheckedData.map(function(item){
                                return false;
                            });   
                        }
                        that.getModel("contModel").setProperty("/detail/checkModel", aArr);
                        //that.getModel("checkModel").setData(aArr);
                    
                    // }
                },
                error: function(oError) {
                    
                }
            });
        },
        _fnInitControlModel : function(){
            var oData = {
                createMode : null,
                editMode : null
            }

            var oContModel = this.getModel("contModel");
                oContModel.setProperty("/detail", oData);

            this.getModel("applicationSup").setData([]);
        },
        _fnSetEditMode : function(){
            this._fnSetMode("edit");
        },

        _fnSetCreateMode : function(){
            this._fnSetMode("create");
        },

        _fnSetMode : function(mode){
            var bCreate = null,
                bEdit = null;

            if(mode === "edit"){
                bCreate = false;
                bEdit = true;
            }else if(mode === "create"){
                bCreate = true;
                bEdit = false;
            }

            var oContModel = this.getModel("contModel");
            oContModel.setProperty("/detail/createMode", bCreate);
            oContModel.setProperty("/detail/editMode", bEdit);
        },

        _onCheckEmail: function (str) {                                                 

            var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

            if(!reg_email.test(str)) {
                return false;
            }else {
                return true;
            }
        }
    })
});