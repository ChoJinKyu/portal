sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "ext/lib/util/ValidatorUtil",
    "ext/lib/model/ManagedListModel"
], function (Controller, Filter, FilterOperator, Sorter, MessageBox, MessageToast, ValidatorUtil, ManagedListModel) {
	"use strict";

	return Controller.extend("cm.codeManagement.controller.DetailDetail", {
		onInit: function () {
			var oExitButton = this.getView().byId("exitFullScreenBtn"),
				oEnterButton = this.getView().byId("enterFullScreenBtn");

			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();

			this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onSupplierMatched, this);

            this.setModel(new ManagedListModel(), "languages");

        //     this.getView()
        //   .setBusy(true)
        //   .getModel("languages")
        //   .setTransactionModel(this.getView().getModel())
        //   .read("/TimeZone", {
        //     filters: predicates,
        //     success: (function (oData) {
        //       this.getView().setBusy(false);
        //     }).bind(this)
        //   });


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
            // oContModel.setProperty("/detailDetail", oData);
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
            oContModel.setProperty("/detailDetail/readMode", bRead);
            oContModel.setProperty("/detailDetail/createMode", bCreate);
            oContModel.setProperty("/detailDetail/editMode", bEdit);
        },

        onEditPress : function(){
            this._fnSetEditMode();
        },

        onCancelPress : function(){
            this._fnSetReadMode();

            var oViewModel = this.getModel("viewModel");
            var oParam = oViewModel.getProperty("/detailDetailClone");
            oViewModel.setProperty("/detailDetail", oParam);
        },

        _fnSetCreateData : function(){
            var oViewModel = this.getModel("viewModel");
            var oMasterData = oViewModel.getProperty("/detail");

            var oInitDetailData = {
                code: "",
                code_description: "",
                group_code: oMasterData.group_code,
                parent_code: "",
                parent_group_code: "",
                remark: "",
                sort_no: "",
                start_date: new Date(),
                end_date: new Date(2099,11,31),
                local_create_dtm: new Date(),
                local_update_dtm: new Date(),
                tenant_id: oMasterData.tenant_id
            }
            
            var oViewModel = this.getModel("viewModel");
            oViewModel.setProperty("/detailDetail", oInitDetailData);

            var model = this.getModel('languages');
            model.setProperty("/CodeLanguages", []);
            // 기본 레코드
            var oData = {
                code: "",
                code_name: "",
                group_code: "",
                language_cd: "EN",//아마도 local에서 가져와야 할듯
                tenant_id: "",
                local_create_dtm: new Date(),
                local_update_dtm: new Date()
            }
            model.addRecord(oData, "/CodeLanguages", 0);

            /*
            var aInitLangData = [
                {
                    code: "",
                    code_name: "",
                    group_code: oMasterData.group_code,
                    language_cd: "EN",
                    tenant_id: oMasterData.tenant_id,
                    local_create_dtm: new Date(),
                    local_update_dtm: new Date()
                }
            ]
            oViewModel.setProperty("/CodeLanguages", aInitLangData);
            */
        },

		handleAboutPress: function () {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(3);
			this.oRouter.navTo("page2", {layout: oNextUIState.layout});
		},
		handleFullScreen: function () {
			this.bFocusFullScreenButton = true;
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/endColumn/fullScreen");
			this.oRouter.navTo("detailDetail", {layout: sNextLayout, product: this._product, supplier: this._supplier});
		},
		handleExitFullScreen: function () {
			this.bFocusFullScreenButton = true;
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/endColumn/exitFullScreen");
			this.oRouter.navTo("detailDetail", {layout: sNextLayout, product: this._product, supplier: this._supplier});
		},
		handleClose: function () {
            var oContModel = this.getModel("contModel");
            oContModel.setProperty("/detail/footer", true);

			// var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/endColumn/closeColumn");
			this.oRouter.navTo("detailDetail", {layout: "TwoColumnsMidExpanded"});
		},
		_onSupplierMatched: function (oEvent) {
            var sLayout = oEvent.getParameter("arguments").layout;
            if(sLayout === "TwoColumnsMidExpanded"){
                return false;
            }

            this._fnInitControlModel();
            
            console.log('detaildetail',oEvent.getParameter("arguments"))
            
            var sTenantId = oEvent.getParameter("arguments").tenantId;
            var sGroupCode = oEvent.getParameter("arguments").groupCode;
            var sCode = oEvent.getParameter("arguments").code;

            var bCreateMode = true;
            if(sTenantId && sGroupCode && sCode){
                bCreateMode = false;
            };

            if(bCreateMode){
                this._fnSetCreateMode();
                this._fnSetCreateData();
            }else{
                this._fnSetReadMode();
                this._fnReadLanguages(sTenantId, sGroupCode, sCode);
            }

            //ScrollTop
            var oObjectPageLayout = this.getView().byId("objectPageLayout");
            var oFirstSection = oObjectPageLayout.getSections()[0];
            oObjectPageLayout.scrollToSection(oFirstSection.getId(), 0, -500);
        },

        _fnReadLanguages : function(tenantId, groupCode, code){
            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, tenantId));
            aFilters.push(new Filter("group_code", FilterOperator.EQ, groupCode));
            aFilters.push(new Filter("code", FilterOperator.EQ, code));

            var oViewModel = this.getModel('viewModel');
            // var oServiceModel = this.getModel();
            var oServiceModel = this.getModel("languages").setTransactionModel(this.getModel());
            oServiceModel.read("/CodeLanguages",{
                filters : aFilters,
                success : function(data){
                    // oViewModel.setProperty("/languages", data.results);
                    // oCodeMasterTable.setBusy(false);
                },
                error : function(data){
                    // oCodeMasterTable.setBusy(false);
                }
            });
        },
        
        _fnInitControlModel : function(){
            var oData = {
                readMode : null,
                createMode : null,
                editMode : null
            }

            var oContModel = this.getModel("contModel");
            oContModel.setProperty("/detailDetail", oData);
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
            oContModel.setProperty("/detailDetail/readMode", bRead);
            oContModel.setProperty("/detailDetail/createMode", bCreate);
            oContModel.setProperty("/detailDetail/editMode", bEdit);
        },

        onSavePress : function(){
            var oContModel = this.getModel("contModel");
            var bCreateFlag = oContModel.getProperty("/detailDetail/createMode");

            if(bCreateFlag){
                if(ValidatorUtil.isValid(this,"requiredField")){
                    MessageBox.confirm("추가 하시 겠습니까?", {
                        title : "Create",
                        initialFocus : sap.m.MessageBox.Action.CANCEL,
                        onClose : function(sButton) {
                            if (sButton === MessageBox.Action.OK) {
                                this._fnCreateCodeDetail();
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
                            this._fnUpdateCodeDetail();
                        }
                    }.bind(this)
                });
            }
        },

        _fnCreateCodeDetail : function(){
            
            var oViewModel = this.getModel("viewModel");
            var oParam = oViewModel.getProperty("/detailDetail");

            var oModel = this.getModel();
            oModel.create("/CodeDetails", oParam, {
                groupId: "createDetail",
                success: function(data){
                    console.log(data)
                    // this._fnSetReadMode();
                }.bind(this),
                error: function(data){
                    console.log('error',data)
                }
            });

            /*
            var aCodeLanguages = oViewModel.getProperty("/CodeLanguages");
            aCodeLanguages.forEach(function(item){
                item.code = oParam.code;
                console.log(item)
                oModel.create("/CodeLanguages", item, {
                    groupId: "createDetail",
                    success: function(data){
                        // this._fnSetReadMode();
                    }.bind(this),
                    error: function(data){
                        console.log('error',data)
                        alert("에라")
                    }
                });
            });
            */

            oModel.submitChanges({
                groupId: "createDetail",
                success: function(data){
                    var oLangModel = this.getModel("languages");
                    oLangModel.getProperty("/CodeLanguages").forEach(function(item, i){
                        oLangModel.setProperty("/CodeLanguages/"+i+"/tenant_id", oParam.tenant_id);
                        oLangModel.setProperty("/CodeLanguages/"+i+"/group_code", oParam.group_code);
                        oLangModel.setProperty("/CodeLanguages/"+i+"/code", oParam.code);
                    })
                    oLangModel.submitChanges({
                        groupId: "CodeLanguages",
                        success: (function (oEvent) {
                            this._fnSetReadMode();
                            MessageToast.show("Success to save.");
                        }.bind(this))
                    });
                }.bind(this),
                error: function(data){
                    console.log('Create error',data)
                    alert("에라")
                }
            })
        },

        _fnUpdateCodeDetail : function(){
            var oViewModel = this.getModel("viewModel");
            var oParam = oViewModel.getProperty("/detailDetail");
            var oKey = {
                tenant_id : oParam.tenant_id,
                group_code : oParam.group_code,
                code : oParam.code
            }

            var oModel = this.getModel();
            var sCreatePath = oModel.createKey("/CodeDetails", oKey);
            oModel.update(sCreatePath, oParam, {
                success: function(data){
                    var oLangModel = this.getModel("languages");
                    oLangModel.getProperty("/CodeLanguages").forEach(function(item, i){
                        if(item["tenant_id"] === ""){
                            oLangModel.setProperty("/CodeLanguages/"+i+"/tenant_id", oParam.tenant_id);
                            oLangModel.setProperty("/CodeLanguages/"+i+"/group_code", oParam.group_code);
                            oLangModel.setProperty("/CodeLanguages/"+i+"/code", oParam.code);
                        }                        
                    })

                    oLangModel.submitChanges({
                        groupId: "CodeLanguages",
                        success: function (data) {
                            this._fnSetReadMode();
                            MessageToast.show("Success to update.");
                        }.bind(this)
                    });

                }.bind(this),
                error: function(data){
                    console.log('error',data)
                }
            });
        //    var oViewModel = this.getModel("viewModel");
        //     var oParam = oViewModel.getProperty("/detailDetail");
        /*
            var oParam = {
                code: "P",
                code_name: "테스트",
                group_code: "DP_MD_MOLD_CAVITY",
                language_cd: "KO",
                tenant_id: "L1100",
            };

            var oModel = this.getModel();
            oModel.create("/CodeLanguages", oParam, {
                success: function(data){
                    console.log(data)
                    alert("Yes!!Yes!!Yes!!Yes!!")
                    // this._fnSetReadMode();
                }.bind(this),
                error: function(data){
                    console.log('error',data)
                    alert("에라")
                }
            });
            */
        },

        onDelLangPress: function (oEvent) {
        var table = oEvent.getSource().getParent().getParent().getParent();
        var model = this.getView().getModel(table.getBindingInfo('items').model);
        model.setProperty("/entityName", "CodeLanguages");

        table.getSelectedItems().reverse().forEach(function(item){
            var iSelectIndex = table.indexOfItem(item);
            if(iSelectIndex > -1){
                console.log('del : ',iSelectIndex)
                model.markRemoved(iSelectIndex);
            }
        });

        table.removeSelections(true);

        // table
        //   .getSelectedIndices()
        //   .reverse()
        //   // 삭제
        //   .forEach(function (idx) {
        //     model.markRemoved(idx);
        //   });
        // table
        //   .clearSelection()
        //   .removeSelections(true);
        },
        onAddLangPress: function (oEvent) {
            var table = oEvent.getSource().getParent().getParent().getParent();
            var model = this.getModel(table.getBindingInfo('items').model);
            // 레코드추가
            var oData = {
                code: "",
                code_name: "",
                group_code: "",
                language_cd: "",
                tenant_id: "",
                local_create_dtm: new Date(),
                local_update_dtm: new Date()
            }
            model.addRecord(oData, "/CodeLanguages", 0);
        },

        onAddLangPressT : function(oEvent){
            var oViewModel = this.getModel('viewModel');
            var oDetailData = oViewModel.getProperty("/detailDetail");
            var oInitLangData = {
                code: "",
                code_name: "",
                group_code: oDetailData.group_code,
                language_cd: "EN",
                tenant_id: oDetailData.tenant_id,
                local_create_dtm: new Date(),
                local_update_dtm: new Date()
            };
            
            var aCodeLanguages = oViewModel.getProperty("/CodeLanguages");
            aCodeLanguages.unshift(oInitLangData);
            oViewModel.setProperty("/CodeLanguages", aCodeLanguages)
        },

        onDeletePress : function(){
            MessageBox.confirm("삭제 하시 겠습니까?", {
                title : "Comfirmation",
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        this._fnDeleteCodeDetail();
                    } else if (sButton === MessageBox.Action.CANCEL) {
                        
                    };
                }.bind(this)
            });
        },

        _fnDeleteCodeDetail : function(){
            var oViewModel = this.getModel("viewModel");
            var oParam = oViewModel.getProperty("/detailDetail");
            var oKey = {
                tenant_id : oParam.tenant_id,
                group_code : oParam.group_code,
                code : oParam.code
            }

            var oModel = this.getModel();
            var sDeletePath = oModel.createKey("/CodeDetails", oKey);

            var oDetailContrller = sap.ui.controller("cm.codeManagement.controller.Detail");
            this._fnReadDetails(oParam.tenant_id, oParam.group_code);
            MessageToast.show("Success to delete.");
                    this.handleClose();
            /*
            oModel.remove(sDeletePath, {
                success: function(){
                    // var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0);
                    // var sLayout = oNextUIState.layout;
                    MessageToast.show("Success to delete.");
                    this.handleClose();
                    _fnReadDetails
                }.bind(this),
                error: function(){
                    console.log('remove error')
                }
            });
            */
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
	});
});
