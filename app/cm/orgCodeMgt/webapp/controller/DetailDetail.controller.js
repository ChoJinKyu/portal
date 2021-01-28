sap.ui.define([
    "ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/f/LayoutType",
    "ext/lib/util/Validator",
    "ext/lib/model/ManagedListModel"
], function (Controller, Multilingual, Filter, FilterOperator, Sorter, MessageBox, MessageToast, LayoutType, Validator, ManagedListModel) {
	"use strict";

	return Controller.extend("cm.orgCodeMgt.controller.DetailDetail", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onCodeDetailMatched, this);

            // DetailDetail 언어별 코드명
            this.setModel(new ManagedListModel(), "languages");

            // 다국어 라벨/메시지
            //var oMultilingual = new Multilingual();
            //this.setModel(oMultilingual.getModel(), "I18N");
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
            oViewModel.setProperty("/detailDetail", $.extend(true, {}, oParam));

            var sTenantId = oParam.tenant_id;
            var sGroupCode = oParam.group_code;
            var sOrgCode = oParam.orgCode;
            var sCode = oParam.code;
            this._fnReadLanguages(sTenantId, sGroupCode, sOrgCode, sCode);
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
                tenant_id: oMasterData.tenant_id,
                org_code: oMasterData.code_control_org_type_code
            }
            
            oViewModel.setProperty("/detailDetail", oInitDetailData);

            var model = this.getModel('languages');
            model.setProperty("/OrgCodeLanguages", []);
            // 기본 레코드
            var oData = {
                code: "",
                code_name: "",
                group_code: "",
                language_cd: "EN",//아마도 local에서 가져와야 할듯
                tenant_id: "",
                org_code: "",
                local_create_dtm: new Date(),
                local_update_dtm: new Date()
            }
            model.addRecord(oData, "/OrgCodeLanguages", 0);
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

            //var sLayout = LayoutType.TwoColumnsMidExpanded;
            var sLayout = LayoutType.OneColumn;
            this._changeFlexibleColumnLayout(sLayout);
        },

        _changeFlexibleColumnLayout : function(layout){
            var oFclModel = this.getModel("fcl");
            oFclModel.setProperty("/layout", layout);
        },

		_onCodeDetailMatched: function (oEvent) {
            var sLayout = oEvent.getParameter("arguments").layout;
            // if(sLayout === "TwoColumnsMidExpanded"){
            //     return false;
            // }
            this._fnInitControlModel();
            
            var sTenantId = oEvent.getParameter("arguments").tenantId;
            var sGroupCode = oEvent.getParameter("arguments").groupCode;
            var sOrgCode = oEvent.getParameter("arguments").orgCode;
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
                this._fnReadLanguages(sTenantId, sGroupCode, sOrgCode, sCode);
            }

            //ScrollTop
            var oObjectPageLayout = this.getView().byId("objectPageLayout");
            var oFirstSection = oObjectPageLayout.getSections()[0];
            oObjectPageLayout.scrollToSection(oFirstSection.getId(), 0, -500);
        },

        _fnReadLanguages : function(tenantId, groupCode, orgCode, code){
            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, tenantId));
            aFilters.push(new Filter("group_code", FilterOperator.EQ, groupCode));
            aFilters.push(new Filter("org_code", FilterOperator.EQ, orgCode));
            aFilters.push(new Filter("code", FilterOperator.EQ, code));

            //var oViewModel = this.getModel('viewModel');
            // var oServiceModel = this.getModel();
            var oServiceModel = this.getModel("languages").setTransactionModel(this.getModel());
            oServiceModel.read("/OrgCodeLanguages",{
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
                if(Validator.isValid(this,"requiredField")){
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

            var sGroupId = "createDetail";
            oModel.setDeferredGroups([sGroupId]);
            oModel.create("/OrgCodeDetails", oParam, {
                groupId: sGroupId,
                success: function(data){
                    this._fnReadDetails(oParam.tenant_id, oParam.group_code);
                    this._fnSetReadMode();
                    MessageToast.show("Success to save.");
                }.bind(this),
                error: function(data){
                    console.log('error',data)
                }
            });

            var oLangModel = this.getModel("languages");            
            oLangModel.getProperty("/OrgCodeLanguages").forEach(function(item, i){
                oModel.createEntry("/OrgCodeLanguages", {
                    properties: {
                        "tenant_id": oParam.tenant_id,
                        "group_code": oParam.group_code,
                        "org_code":oParam.org_code,
                        "code": oParam.code,
                        "code_name": item.code_name,
                        "language_cd": item.language_cd
                    }
                });
            });
            
            
            oModel.submitChanges({
                groupId: sGroupId,
                success: function(data){
                    //this._fnSetReadMode();
                    //this.handleClose();
                    //MessageToast.show("Success to save.");
                }.bind(this),
                error: function(data){
                    console.log('Create error',data);
                    MessageToast.show("Fail to save.");
                }
            });            
        },

        _fnUpdateCodeDetail : function(){
            var oViewModel = this.getModel("viewModel");
            var oParam = oViewModel.getProperty("/detailDetail");
            var oKey = {
                tenant_id : oParam.tenant_id,
                group_code : oParam.group_code,
                code : oParam.code,
                org_code : oParam.org_code
            }

            var oModel = this.getModel();
            var sCreatePath = oModel.createKey("/OrgCodeDetails", oKey);
            oModel.update(sCreatePath, oParam, {
                success: function(data){
                    this._fnReadDetails(oParam.tenant_id, oParam.group_code);

                    var oLangModel = this.getModel("languages");
                    oLangModel.getProperty("/OrgCodeLanguages").forEach(function(item, i){
                        if(item["tenant_id"] === ""){
                            oLangModel.setProperty("/OrgCodeLanguages/"+i+"/tenant_id", oParam.tenant_id);
                            oLangModel.setProperty("/OrgCodeLanguages/"+i+"/group_code", oParam.group_code);
                            oLangModel.setProperty("/OrgCodeLanguages/"+i+"/code", oParam.code);
                            oLangModel.setProperty("/OrgCodeLanguages/"+i+"/org_code", oParam.org_code);
                        }                        
                    })

                    oLangModel.submitChanges({
                        groupId: "OrgCodeLanguages",
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
        model.setProperty("/entityName", "OrgCodeLanguages");

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
                org_code: "",
                local_create_dtm: new Date(),
                local_update_dtm: new Date()
            }
            model.addRecord(oData, "/OrgCodeLanguages", 0);
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
                org_code : oParam.org_code,
                code : oParam.code
            }

            var oModel = this.getModel();
            var sDeletePath = oModel.createKey("/OrgCodeDetails", oKey);
            
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
            oServiceModel.read("/OrgCodeDetails",{
                filters : aFilters,
                sorters : aSorter,
                success : function(data){
                    oViewModel.setProperty("/OrgCodeDetails", data.results);
                    // oCodeMasterTable.setBusy(false);
                },
                error : function(data){
                    // oCodeMasterTable.setBusy(false);
                }
            });
        },
	});
});
