sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/f/LayoutType",
    // "ext/lib/util/ValidatorUtil",
    "ext/lib/model/ManagedListModel"
], function (Controller, Filter, FilterOperator, Sorter, MessageBox, MessageToast, LayoutType, /*ValidatorUtil,*/ ManagedListModel) {
	"use strict";

	return Controller.extend("cm.codeMgt.controller.DetailDetail", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onCodeDetailMatched, this);

            this.setModel(new ManagedListModel(), "languages");
        },
        
        onBeforeRendering : function(){
            // this._fnGetLanguage();
        },

        _fnGetLanguage : function(){
            var that = this;
            return new Promise(function(reselve, reject){
                var oUtilModel = that.getModel("util");
                var oViewModel = that.getModel("viewModel");
                var aLanguages = oViewModel.getProperty("/languageList");

                if(aLanguages && aLanguages.length > 0){
                    reselve(aLanguages);
                }else{
                    var aFilters = [];
                    aFilters.push(new Filter("tenant_id", FilterOperator.EQ, 'L2100'));
                    aFilters.push(new Filter("group_code", FilterOperator.EQ, 'CM_LANG_CODE'));
                    oUtilModel.read("/Code",{
                        filters : aFilters,
                        success : function(data){
                            aLanguages = data.results;
                            oViewModel.setProperty("/languageList", aLanguages);
                            reselve(aLanguages);
                        },
                        error : function(data){
                            reject(data);
                            // oCodeMasterTable.setBusy(false);
                        }
                    });
                }

            });
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
            var sCode = oParam.code;
            this._fnReadLanguages(sTenantId, sGroupCode, sCode);
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
                sort_no: 0,
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

            var aLanguages = oViewModel.getProperty("/languageList");
            aLanguages.forEach(function(item,i){
                var oData = {
                    code: "",
                    code_name: "",
                    group_code: "",
                    language_cd: item.code,
                    tenant_id: "",
                    local_create_dtm: new Date(),
                    local_update_dtm: new Date()
                }
                model.addRecord(oData, "/CodeLanguages", i);
            });


            /*
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
            // model.addRecord(oData, "/CodeLanguages", 0);
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

            // var sLayout = LayoutType.EndColumnFullScreen;
            var sLayout = LayoutType.MidColumnFullScreen;
			this._changeFlexibleColumnLayout(sLayout);
        },
        
		handleExitFullScreen: function () {
			var oContModel = this.getModel("contModel");
            oContModel.setProperty("/detailDetail/visibleFullScreenBtn", true);

            // var sLayout = LayoutType.ThreeColumnsEndExpanded;
            var sLayout = LayoutType.TwoColumnsMidExpanded;
            this._changeFlexibleColumnLayout(sLayout);
        },
        
		handleClose: function () {
            var oContModel = this.getModel("contModel");
            oContModel.setProperty("/detail/footer", true);

            // var sLayout = LayoutType.TwoColumnsMidExpanded;
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
            var sCode = oEvent.getParameter("arguments").code;

            var bCreateMode = true;
            if(sTenantId && sGroupCode && sCode){
                bCreateMode = false;
            };

            var that = this;
            this._fnGetLanguage().then(function(languageList){
                if(bCreateMode){
                    that._fnSetCreateMode();
                    that._fnSetCreateData();
                }else{
                    that._fnSetReadMode();
                    that._fnReadLanguages(sTenantId, sGroupCode, sCode);
                }
            });

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
            var oServiceModel = this.getModel("languages");
            oServiceModel.setTransactionModel(this.getModel());
            var that = this;
            oServiceModel.read("/CodeLanguages",{
                filters : aFilters,
                success : function(data){
                    var aCodeLanguages = oServiceModel.getProperty("/CodeLanguages");
                    aCodeLanguages.forEach(function(item, i){
                        var sPath = "/CodeLanguages/"+i+"/language_name";
                        var sLanguageText = that.languageText(item.language_cd);
                        oServiceModel.setProperty(sPath, sLanguageText);
                    })
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

        isValidMinLangCnt : function(){
            var bReturn = false;
            var oLangModel = this.getModel('languages');
            var aLangData = oLangModel.getProperty("/CodeLanguages");
            aLangData.some(function(item){
                if(item._row_state_ !== "D"){
                    bReturn = true;
                    return true;
                }
            })

            return bReturn;
        },

        onSavePress : function(){
            if(!this.isValidMinLangCnt()){
                MessageBox.warning("언어코드는 1개 이상 필수 등록하여야 합니다.");
                return;
            }

            var oContModel = this.getModel("contModel");
            var bCreateFlag = oContModel.getProperty("/detailDetail/createMode");
            if(bCreateFlag){
                // if(ValidatorUtil.isValid(this,"requiredField")){ 
                    // ValidatorUtil 삭제
                    MessageBox.confirm("추가 하시 겠습니까?", {
                        title : "Create",
                        initialFocus : sap.m.MessageBox.Action.CANCEL,
                        onClose : function(sButton) {
                            if (sButton === MessageBox.Action.OK) {
                                this._fnCreateCodeDetail();
                            }
                        }.bind(this)
                    });
                // }else{
                //     console.log("checkRequire")
                // }
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
                    this._fnReadDetails(oParam.tenant_id, oParam.group_code);
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
                            // this._fnSetReadMode();
                            this.handleClose();
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
                    this._fnReadDetails(oParam.tenant_id, oParam.group_code);

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

        languageText : function(langCode){
            var sLangText = "";
            var oViewModel = this.getModel("viewModel");
            var aLanguages = oViewModel.getProperty("/languageList");
            aLanguages.forEach(function(item){
                if(item.code === langCode){
                    sLangText = item.code_name;
                    return false;
                }
            });
            return sLangText;
        }
	});
});
