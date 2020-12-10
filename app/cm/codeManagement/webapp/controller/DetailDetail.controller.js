sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/f/LayoutType",
    "ext/lib/util/ValidatorUtil",
    "ext/lib/model/ManagedListModel"
], function (Controller, Filter, FilterOperator, Sorter, MessageBox, MessageToast, LayoutType, ValidatorUtil, ManagedListModel) {
	"use strict";

	return Controller.extend("cm.codeManagement.controller.DetailDetail", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onCodeDetailMatched, this);

            this.setModel(new ManagedListModel(), "languages");
        },
        
        onAfterRendering : function(){

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
            oContModel.setProperty("/detailDetail/visibleFullScreenBtn", true);
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

		handleFullScreen: function () {
            var oContModel = this.getModel("contModel");
            oContModel.setProperty("/detailDetail/visibleFullScreenBtn", false);

            var sLayout = LayoutType.EndColumnFullScreen;
			this._changeFlexibleColumnLayout(sLayout);
        },
        
		handleExitFullScreen: function () {
			var oContModel = this.getModel("contModel");
            oContModel.setProperty("/detailDetail/visibleFullScreenBtn", true);

            var sLayout = LayoutType.ThreeColumnsEndExpanded;
            this._changeFlexibleColumnLayout(sLayout);
        },
        
		handleClose: function () {
            var oContModel = this.getModel("contModel");
            oContModel.setProperty("/detail/footer", true);

            var sLayout = LayoutType.TwoColumnsMidExpanded;
            this._changeFlexibleColumnLayout(sLayout);
        },

        _changeFlexibleColumnLayout : function(layout){
            var oFclModel = this.getModel("fcl");
            oFclModel.setProperty("/layout", layout);
        },

		_onCodeDetailMatched: function (oEvent) {
            var sLayout = oEvent.getParameter("arguments").layout;
            if(sLayout === "TwoColumnsMidExpanded"){
                return false;
            }
            this._fnInitControlModel();
            
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
            
            oModel.remove(sDeletePath, {
                success: function(){
                    MessageToast.show("Success to delete.");
                    this._fnReadDetails(oParam.tenant_id, oParam.group_code);
                    this.handleClose();
                }.bind(this),
                error: function(){
                    console.log('remove error')
                }
            });
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
