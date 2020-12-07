sap.ui.define([
    "ext/lib/controller/BaseController",
	"sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "ext/lib/util/ValidatorUtil",
    "./Master.controller"
], function (BaseController, JSONModel, Filter, Sorter, FilterOperator, MessageBox, MessageToast, ValidatorUtil, Master) {
	"use strict";

	return BaseController.extend("cm.codeManagement.controller.Detail", {
		onInit: function () {
            
			// var oExitButton = this.getView().byId("exitFullScreenBtn"),
			// 	oEnterButton = this.getView().byId("enterFullScreenBtn");
			this.oRouter = this.getOwnerComponent().getRouter();
			// this.oModel = this.getOwnerComponent().getModel();

			this.oRouter.getRoute("master").attachPatternMatched(function(){console.log("master")}, this);
			// this.oRouter.getRoute("master").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").attachPatternMatched(this._onDetailMatched, this);
			this.oRouter.getRoute("detailDetail").attachPatternMatched(function(){console.log("detailDetail")}, this);
			// this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onProductMatched, this);

			// [oExitButton, oEnterButton].forEach(function (oButton) {
			// 	oButton.addEventDelegate({
			// 		onAfterRendering: function () {
			// 			if (this.bFocusFullScreenButton) {
			// 				this.bFocusFullScreenButton = false;
			// 				oButton.focus();
			// 			}
			// 		}.bind(this)
			// 	});
			// }, this);
        },

        onAfterRendering : function(){
            // var oData = {
            //     readMode : true,
            //     editMode : false
            // }
            // var oContModel = this.getModel("contModel");
            // oContModel.setProperty("/detail", oData);
            // oContModel.setProperty("/detail", {});
        },

        _fnInitControlModel : function(){
            var oData = {
                readMode : null,
                createMode : null,
                editMode : null,
                footer : true
            }

            var oContModel = this.getModel("contModel");
            oContModel.setProperty("/detail", oData);
        },

        _fnSetReadMode : function(){
            this._fnSetMode("read");
        },

        _fnSetEditMode : function(){
            this._fnSetMode("edit");
        },

        _fnSetCreateMode : function(){
            this._fnSetMode("create");
        },

        _fnSetMode : function(mode){
            var bRead = null,
            bCreate = null,
            bEdit = null;

            if(mode === "read"){
                bRead = true;
                bCreate = false,
                bEdit = false;
            }else if(mode === "create"){
                bRead = false;
                bCreate = true,
                bEdit = true;
            }else if(mode === "edit"){
                bRead = false;
                bCreate = false,
                bEdit = true;
            }

            var oContModel = this.getModel("contModel");
            oContModel.setProperty("/detail/readMode", bRead);
            oContModel.setProperty("/detail/createMode", bCreate);
            oContModel.setProperty("/detail/editMode", bEdit);
        },

        onEditPress : function(){
            this._fnSetEditMode();
            this.onTenantChange();
        },

        onCancelPress : function(){
            this._fnSetReadMode();

            var oViewModel = this.getModel("viewModel");
            var oParam = oViewModel.getProperty("/detailClone");
            oViewModel.setProperty("/detail", oParam);
        },

        _fnSetCreateData : function(){
            var oInitData = {
                chain_code: "",
                group_code: "",
                group_description: "",
                group_name: "",
                tenant_id: "L2100",
                use_flag: true
                // CodeDetails: []
            };

            var oViewModel = this.getModel("viewModel");
            oViewModel.setProperty("/detail", oInitData);
            
            oViewModel.setProperty("/CodeDetails", []);
        },

		onHandleItemPress: function (oEvent) {
			// var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(2),
			// 	supplierPath = oEvent.getSource().getBindingContext("products").getPath(),
			// 	supplier = supplierPath.split("/").slice(-1).pop();

			// this.oRouter.navTo("detailDetail", {layout: oNextUIState.layout,
            //     product: this._product, supplier: supplier});
            this._fnShowFooter(false);

            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(2);
            
            var oViewModel = this.getModel('viewModel');
            var sPath = oEvent.getSource().getBindingContextPath();
            var oTargetData = oViewModel.getProperty(sPath);

            oViewModel.setProperty("/detailDetail", $.extend(true, {}, oTargetData));
            oViewModel.setProperty("/detailDetailClone", $.extend(true, {}, oTargetData));

            var oNavParam = {
                layout: oNextUIState.layout,
                tenantId : oTargetData.tenant_id,
                companyCode : oTargetData.company_code,
                groupCode : oTargetData.group_code,
                code : oTargetData.code
            };
            this.getRouter().navTo("detailDetail", oNavParam);
        },
        
		handleClose: function () {
			//var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("master", {layout: 'OneColumn'});
        },
        
        onAddDetailDetailPress : function(){
            this._fnShowFooter(false);
            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(2);
            
            this.getRouter().navTo("detailDetail", {layout: oNextUIState.layout});
        },

        _fnMasterSearch : function(){
            var oBeginColumnPage = this.getView().getParent().getParent().getBeginColumnPages()[0];
            var oSearchBtn = oBeginColumnPage.byId('btn_search');
            oSearchBtn.firePress();
        },

        onSavePress : function(){
            var oContModel = this.getModel("contModel");
            var bCreateFlag = oContModel.getProperty("/detail/createMode");

            if(bCreateFlag){
                if(ValidatorUtil.isValid(this.getView(),"requiredField")){
                    MessageBox.confirm("추가 하시 겠습니까?", {
                        title : "Create",
                        initialFocus : sap.m.MessageBox.Action.CANCEL,
                        onClose : function(sButton) {
                            if (sButton === MessageBox.Action.OK) {
                                this._fnCreateCodeMaster();
                            }
                        }.bind(this)
                    });
                }else{
                    console.log("checkRequire")
                }
            }else{
                MessageBox.confirm("수정 하시 겠습니까?", {
                    title : "Update",
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            this._fnUpdateCodeMaster();
                        }
                    }.bind(this)
                });
            }
        },

        _fnCreateCodeMaster : function(){
            
            var oViewModel = this.getModel("viewModel");
            var oParam = oViewModel.getProperty("/detail");

            var oModel = this.getModel();
            oModel.create("/CodeMasters", oParam, {
                success: function(data){
                    this._fnMasterSearch();
                    this._fnSetReadMode();
                }.bind(this),
                error: function(data){
                    console.log('error',data)
                    alert("에라")
                }
            });
        },

        _fnUpdateCodeMaster : function(){
            var oViewModel = this.getModel("viewModel");
            var oParam = oViewModel.getProperty("/detail");
            var oKey = {
                tenant_id : oParam.tenant_id,
                group_code : oParam.group_code
            }

            var oModel = this.getModel();
            var sCreatePath = oModel.createKey("/CodeMasters", oKey);
            oModel.update(sCreatePath, oParam, {
                success: function(data){
                    this._fnMasterSearch();
                    this._fnSetReadMode();
                }.bind(this),
                error: function(data){
                    console.log('error',data)
                }
            });
        },

        onDeletePress : function(){
            MessageBox.confirm("삭제 하시 겠습니까?", {
                title : "Comfirmation",
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        this._fnDeleteCodeMaster();
                    } else if (sButton === MessageBox.Action.CANCEL) {
                        
                    };
                }.bind(this)
            });
        },

        _fnDeleteCodeMaster : function(){
            var oViewModel = this.getModel("viewModel");
            var oParam = oViewModel.getProperty("/detail");
            var oKey = {
                tenant_id : oParam.tenant_id,
                group_code : oParam.group_code
            }

            var oModel = this.getModel();
            var sCreatePath = oModel.createKey("/CodeMasters", oKey);
            oModel.remove(sCreatePath, {
                success: function(){
                    // var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0);
                    // var sLayout = oNextUIState.layout;
                    this._fnMasterSearch();
                    MessageToast.show("Success to save.");
                    var sLayout = "OneColumn";
                    this.getRouter().navTo("master", {layout: sLayout});
                }.bind(this),
                error: function(){
                    console.log('remove error')
                }
            });
        },

		_onDetailMatched: function (oEvent) {
            this._fnInitControlModel();

            var sTenantId = oEvent.getParameter("arguments").tenantId;
            var sGroupCode = oEvent.getParameter("arguments").groupCode;

            var bCreateMode = true;
            if(sTenantId && sGroupCode){
                bCreateMode = false;
            }
            
            if(bCreateMode){
                this._fnSetCreateMode();
                this._fnSetCreateData();
                this.onTenantChange();
            }else{
                this._fnSetReadMode();
                this._fnReadDetails(sTenantId, sGroupCode);
            }

            //ScrollTop
            var oObjectPageLayout = this.getView().byId("objectPageLayout");
            var oFirstSection = oObjectPageLayout.getSections()[0];
            oObjectPageLayout.scrollToSection(oFirstSection.getId(), 0, -500);
        },

        _fnReadDetails : function(tenantId, groupCode){
            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, tenantId));
            aFilters.push(new Filter("group_code", FilterOperator.EQ, groupCode));

            var aSorter = [];
            aSorter.push(new Sorter("sort_no", false));

            var oViewModel = this.getModel('viewModel');
            var oServiceModel = this.getModel();
            oServiceModel.read("/CodeDetails",{
                filters : aFilters,
                sorters : aSorter,
                success : function(data){
                    oViewModel.setProperty("/CodeDetails", data.results);
                    // oCodeMasterTable.setBusy(false);
                },
                error : function(data){
                    // oCodeMasterTable.setBusy(false);
                }
            });
        },

        chainFormatter : function(code){
            this._fnGetChainList();
            // console.log('chainFormatter',code)
            var oViewModel = this.getModel("viewModel");
            // var aChain = this._fnGetChainList();
            // console.log('aChain',aChain)
            return code;
            // aChain.forEach(function(item){
            //     if(this.code === code){
            //         return code + " : " + this.code_description;
            //     }
            // })
        },

        _fnShowFooter : function(flag){
            var oContModel = this.getModel("contModel");
            oContModel.setProperty("/detail/footer", flag);
        },

        _fnGetChainList : function(){
            var oViewModel = this.getModel("viewModel");
            var aChain = oViewModel.getProperty("/chainList");

            if(!aChain){
                var oUtilModel = this.getModel('util');
                oUtilModel.read('/CodeDetails',{
                    filters : [
                        new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                        new Filter("group_code", FilterOperator.EQ, "CM_CHAIN_CD")
                    ],
                    success : function(data){
                        oViewModel.setProperty("/chainList",data.results);
                        aChain = data.results;
                        // console.log('oUtilModel success',data.results)
                    },
                    error : function(data){
                        // console.log('oUtilModel error',data)
                    }
                })
            }

            return aChain;
        },

        onTenantChange : function(oEvent){
            // var sTenant = oEvent.getSource().getSelectedKey();
            var oViewModel = this.getModel("viewModel");
            var sTenant = oViewModel.getProperty("/detail/tenant_id");
            var aFilters = [
                new Filter("tenant_id", FilterOperator.EQ, sTenant),
                new Filter("group_code", FilterOperator.EQ, 'CM_CHAIN_CD')
            ];
            var oItemTemplate = new sap.ui.core.ListItem({
                key : "{util>code}",
                text : "{util>code_description}",
                additionalText : "{util>code}"
            });

            var oChain = this.byId("chain_code");
            oChain.setSelectedKey(null);
            oChain.bindItems("util>/CodeDetails", oItemTemplate, null, aFilters);
        }
	});
});
