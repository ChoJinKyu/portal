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
            this.getModel("fundingApp");
        },

        onPageNavBackButtonPress : function() {
            this.getRouter().navTo("mainList", {}, true);
        },
        
        onInvestmentDtlAddButtonPress : function() {
            
            // var oTable = this.byId("investmentDtl");
            var oModel = this.getModel("applicationSup"),
                dtlModel = oModel.getProperty("/popUpInvestPlanDtl"),
                oTableModel = {};
                // oTableModel = oModel.getProperty("/items");

            oTableModel={
                            investment_item_name : "",
                            investment_item_purchasing_price : "",
                            investment_item_purchasing_qty : "",
                            investment_item_purchasing_amt : ""
                        };
                
            dtlModel.push(oTableModel);

            oModel.setProperty("/popUpInvestPlanDtl", dtlModel);
        },

        onPageSaveButtonPress : function() {
            alert("준비중");
        },
        
        onOpenInvestmentDtl : function(oEvent) {
            var oView = this.getView(),
                oModel = this.getModel("fundingApp"),
                bFilters = [],
                cFilters = [],
                that = this,
                rowPath = oEvent.getSource().getParent().getBindingContext("applicationSup").getPath();
            
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
            };

            bFilters.push(new Filter("funding_appl_number", FilterOperator.EQ, this.getModel("applicationSup").getProperty("/funding_appl_number")));
            bFilters.push(new Filter("investment_plan_sequence", FilterOperator.EQ, this.getModel("applicationSup").getProperty(rowPath+"/investment_plan_sequence")));

            this.pDialog.then(function (oDialog) {
                oModel.read("/SfFundingInvestPlanMst", {
                    filters : bFilters,
                    urlParameters:{
                        $expand: "invDtlList"
                    },
                    success: function(oRetrievedResult) {
                        that.getModel("applicationSup").setProperty("/popUpInvestPlanMst", oRetrievedResult.results[0]);

                        cFilters.push(new Filter("funding_appl_number", FilterOperator.EQ, oRetrievedResult.results[0].funding_appl_number));
                        cFilters.push(new Filter("investment_plan_sequence", FilterOperator.EQ, oRetrievedResult.results[0].investment_plan_sequence));

                        oModel.read("/SfFundingInvestPlanDtl", {
                            filters : cFilters,
                            success: function(Result) {
                                that.getModel("applicationSup").setProperty("/popUpInvestPlanDtl", Result.results);
                            },
                            error: function(oError) {
                                
                            }
                        })
                    },
                    error: function(oError) {
                        
                    }
                });
                oDialog.open();
            });
        },

        onInvestmentPlanAddButtonPress : function(oEvent) {
            var oView = this.getView(),
                checkNum = this.getModel("applicationSup").getProperty("/funding_appl_number"),
                that = this;

            if(!checkNum){
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
                    that.getModel("applicationSup").setProperty("/popUpInvestPlanMst", {});
                    that.getModel("applicationSup").setProperty("/popUpInvestPlanDtl", []);
                });
            }
        },

        onCreatePopupClose : function() {
            var oModel = this.getModel("fundingApp"),
                bFilters = [],
                that = this;

            this.byId("investmentPlanDetails").close();

            bFilters.push(new Filter("funding_appl_number", FilterOperator.EQ, this.getModel("applicationSup").getProperty("/funding_appl_number")));
            
            oModel.read("/SfFundingInvestPlanMst", {
                //Filter : 신청번호
                filters : bFilters,
                success: function(oRetrievedResult) {
                    that.getModel("applicationSup").setProperty("/investPlanMst", oRetrievedResult.results);
                },
                error: function(oError) {
                    
                }
            });
        },

        onSelectObject : function(oEvent) {
            
        },

        onPurchasingAtm : function(oEvent) {

            var rowBindingContext = oEvent.oSource.getParent().getBindingContext("applicationSup"),
                rowInvestmentPurchasingPrice = rowBindingContext.getObject().investment_item_purchasing_price,
                rowInvestmentPurchasingQty = rowBindingContext.getObject().investment_item_purchasing_qty,
                rowInvestmentPurchasingAmt = rowInvestmentPurchasingPrice*rowInvestmentPurchasingQty,
                dtlLength=rowBindingContext.getModel().getProperty("/popUpInvestPlanDtl").length,
                investmentPurchasingAmtSum = 0;

                rowBindingContext.getModel().setProperty(rowBindingContext.getPath() + "/investment_item_purchasing_amt", rowInvestmentPurchasingAmt);
                //rowBindingContext.getModel().getProperty("/popUpInvestPlanDtl")[0].investment_item_purchasing_amt
                for(var i= 0; i < dtlLength; i++){
                    investmentPurchasingAmtSum += parseInt(rowBindingContext.getModel().getProperty("/popUpInvestPlanDtl/"+i+"/investment_item_purchasing_amt"));
                };

                this.byId("investment_item_purchasing_amt_sum").setText(investmentPurchasingAmtSum);

        },

        _onComCodeListView : function(oEvent) {
            var that = this,
                tenant_id = "L1100",
                group_code = "SP_SF_FUNDING_REASON_CODE",
                language_cd = "KO";
            
            jQuery.ajax({
                url: "srv-api/odata/v4/sp.fundingApplicationSupV4Service/ComCodeListView(tenant_id='"+tenant_id+"',chain_code='SP',group_code='"+group_code+"',language_cd='"+language_cd+"')/Set",
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
                company_code = "LGEKR";

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