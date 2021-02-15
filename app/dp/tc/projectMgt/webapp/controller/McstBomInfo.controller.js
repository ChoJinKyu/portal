sap.ui.define([
  "ext/lib/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "ext/lib/model/ManagedListModel",
  "ext/lib/formatter/DateFormatter",
  "ext/lib/formatter/NumberFormatter",
  "ext/lib/formatter/Formatter",
  "ext/lib/util/Multilingual",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageBox",
  "sap/m/MessageToast",
  "sap/ui/model/Sorter",
  "sap/ui/core/Fragment",
  "dp/tc/projectMgt/custom/TcMaterialMasterDialog",
  "ext/lib/util/ExcelUtil"
],
  function (BaseController, JSONModel, ManagedListModel, DateFormatter, NumberFormatter, Formatter, Multilingual, Filter, FilterOperator, MessageBox, MessageToast, Sorter, Fragment, TcMaterialMasterDialog, ExcelUtil) {
    "use strict";

    return BaseController.extend("dp.tc.projectMgt.controller.McstBomInfo", {

          dateFormatter: DateFormatter
          
        , numberFormatter: NumberFormatter

        , formatter: Formatter

        , I18N : null

        , oUerInfo : {user_id : "A60262"}

        , onInit: function () {
            let oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.I18N = this.getModel("I18N");
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("McstBomInfo").attachPatternMatched(this.onAttachPatternMatched, this);
            this.setModel(new ManagedListModel(), "partListModel");
        }

        , onAfterRendering: function () {
            let sId = this.byId("dpBomInfo").getHeader().sId;
            jQuery("#"+sId).removeClass("sapFDynamicPageHeaderWithContent");
        }

        , onBeforeRendering: function() {
        }
        
        , onBeforeShow: function() {
        }

        , onAttachPatternMatched: function(oEvent) {

            this.getView().byId("itbProgress").setSelectedKey("2");

            let oParam = {};
            if(oEvent) {
                oParam = oEvent.getParameter("arguments");
            } else {
                oParam.tenant_id    = this.getModel("detailModel").getProperty("/tenant_id");
                oParam.project_code = this.getModel("detailModel").getProperty("/project_code");
                oParam.model_code   = this.getModel("detailModel").getProperty("/model_code");
                oParam.version_number = this.getModel("detailModel").getProperty("/version_number");
            }
            console.log("detailModel data", this.getModel("detailModel").getData());
            this._getPartList(oParam);
        }

        /**
         * 조회 버튼 클릭
         * */
        , onSearchButtonPress: function(oEvent) {
            this._getPartList();
        }

        /**
         * Project 상세정보 read 후 model 에 set 한다.
         */
        , _getPartList: function (oParam) {
            var oTable = this.byId("tblPartListTable");
            //let oDataModel = this.getModel("mcstBomMgtModel");//McsBomMgtService V2 OData Service
            let oManagedListModel = this.getModel("partListModel");
                oManagedListModel.setTransactionModel(this.getModel("mcstBomMgtModel"));
            let aFilters = [];
            let sTenantId, sProjectCode, sModelCode, sVersionNumber;
            if(oParam) {
                sTenantId = oParam.tenant_id;
                sProjectCode = oParam.project_code;
                sModelCode = oParam.model_code;
                sVersionNumber = oParam.version_number;
            } else {
                sTenantId = this.getModel("detailModel").getProperty("/tenant_id");
                sProjectCode = this.getModel("detailModel").getProperty("/project_code");
                sModelCode = this.getModel("detailModel").getProperty("/model_code");
                sVersionNumber = this.getModel("detailModel").getProperty("/version_number");
            }
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, sTenantId));
            aFilters.push(new Filter("project_code", FilterOperator.EQ, sProjectCode));
            aFilters.push(new Filter("model_code", FilterOperator.EQ, sModelCode));
            aFilters.push(new Filter("version_number", FilterOperator.EQ, sVersionNumber));

            oTable.setBusy(true);
            oManagedListModel.read("/PartListView", {
                fetchAll: true,
                filters: aFilters,
                sorters: [
					new Sorter("project_code"),
                    new Sorter("model_code"),
					new Sorter("version_number")
				],
				success: function(oData, bHasMore){
                    console.log("/PartListView", oData);
					oTable.clearSelection();
                    if(oTable.getBusy()) oTable.setBusy(false);
				}.bind(this),
				fetchAllSuccess: function(aData, aErrors){
					oTable.setBusy(false);
				}.bind(this)
            });
        }

        /**
         * Icon Tab 선택시 발생하는 event
         */
        , onTabSelect: function(oEvent) {
            if(oEvent.getParameter("selectedKey") ==="1") {
                let oParam = {
                    tenant_id : this.getModel("detailModel").getProperty("/tenant_id"),
                    project_code : this.getModel("detailModel").getProperty("/project_code"),
                    model_code : this.getModel("detailModel").getProperty("/model_code"),
                    version_number : this.getModel("detailModel").getProperty("/version_number"),
                    view_mode : "READ"
                };
                this.getRouter().navTo("McstProjectInfo", oParam);
            } else if(oEvent.getParameter("selectedKey") ==="2") {
                return;
            }
        }

        /**
         * 뒤로 가기 기능
         */
        , onBackPress: function(oEvent) {
            this.getRouter().navTo("ProjectMgtList", {});
        }

        /**
         * BOM List Table updated event
         */
        , onBomListTableUpdateFinished: function(oEvent) {

        }

        , onPartListAddButtonPress: function(){
			var oModel = this.getModel("partListModel");
			oModel.addRecord({
				"material_code": "",
				"material_desc": "",
				"uom_name": "",
				"material_reqm_quantity": "",
				"change_info_text": "",
                "material_reqm_diff_quantity": "",
                "eng_change_number": "",
                "tenant_id": this.getModel("detailModel").getProperty("/tenant_id"),
                "model_code": this.getModel("detailModel").getProperty("/model_code"),
                "project_code": this.getModel("detailModel").getProperty("/project_code"),
                "version_number": this.getModel("detailModel").getProperty("/version_number")
            }, "/partListModel", 0);
            this.byId("tblPartListTable").clearSelection();
		},
      
		onPartListDeleteButtonPress: function(){
			var oTable = this.byId("tblPartListTable"),
                model = this.getModel("partListModel");

            if(oTable.getSelectedIndices().length === 0) { 
                MessageToast.show(this.I18N.getText("/NCM01008"), {at: "center center"});//데이터를 선택해 주세요.
                return; 
            } // skip
            
            //Mapping 된 데이터가 있는지 checking
            //var aList = this.getModel("partListModel").getProperty("/PartListView");
            var aSelIndics = oTable.getSelectedIndices();
            var validFlag = true;
            $.each(aSelIndics, function(nIdx, nRowIdx) {
                let oCnxt = oTable.getContextByIndex(nRowIdx);
                let sPath = oCnxt.getPath();
                let oRow = oTable.getModel("partListModel").getProperty(sPath);
                if(oRow.mapping_id) {
                    // MessageToast.show("맵핑된 데이터가 있습니다. 맵핑 삭제 후 데이터 삭제가 가능합니다.", {at: "center center"});
                    MessageToast.show(this.I18N.getText("/NDP40001"), {at: "center center"});//이미 매핑된 자재가 있습니다. 매핑정보를 먼저 삭제하십시오.

                    validFlag = false;
                    return false;
                }
            }.bind(this));
            if(!validFlag) {
                return;
            }

            oTable.getSelectedIndices().reverse().forEach(function (idx) {
                model.markRemoved(idx);
            });
			this.byId("tblPartListTable").clearSelection();
        },
        
        onMatCodeChange: function(oEvent) {
            //debugger;
            var oCnxt = oEvent.getSource().getBindingContext("partListModel")
            if(oCnxt.getObject("material_code")) {
                oCnxt.getModel()
                oCnxt.getModel().setProperty(oCnxt.getPath()+"/material_desc", "");
                oCnxt.getModel().setProperty(oCnxt.getPath()+"/uom_code", "");
                oCnxt.getModel().setProperty(oCnxt.getPath()+"/material_reqm_quantity", "");
            }

        },

        onMaterialCodeValueHelpPress: function(oEvent) {
            var oInputCntl;
            oEvent.getSource().getParent().getAggregation("items").forEach(function(oCntl) {
                if(oCntl.getVisible() && oCntl instanceof sap.m.Input) {
                    oInputCntl = oCntl;
                }
            });
            if(!this.oSearchMatDialog) {
                this.oSearchMatDialog = new TcMaterialMasterDialog({
                    title: this.I18N.getText("/MATERIAL_CODE"),
                    multiSelection: false,
                    closeWhenApplied: false,
                    loadWhenOpen: false,
                    tenantId: this.getModel("detailModel").getProperty("/tenant_id"),
                    company_code: this.getModel("detailModel").getProperty("/company_code"),
                    org_type_code: this.getModel("detailModel").getProperty("/org_type_code"),
                    org_code: this.getModel("detailModel").getProperty("/org_code"),
                    searchCode: (oInputCntl && oInputCntl.getValue() || "") || ""
                });

                this.oSearchMatDialog.attachEvent("apply", function(oSelEvent) {

                    var rtData = oSelEvent.getParameter("item");

                    //duplication checking
                    var aPartList = this.getModel("partListModel").getProperty("/PartListView");
                    var bDupl = false;
                    $.each(aPartList, function(nIdx, oRow) {
                        if(oRow._row_state_ !== "D" && oRow.material_code === rtData.material_code) {
                            MessageToast.show(this.I18N.getText("/ECM01501", [this.I18N.getText("/MATERIAL_CODE")]), {at: "center center"});//{0} 이(가) 이미 등록되어 있습니다.
                            bDupl = true;
                            return false;
                        }
                    }.bind(this));
                    if(!bDupl) {
                        let sPath = oInputCntl.getParent().getParent().getRowBindingContext().getPath();
                        this.getModel("partListModel").setProperty(sPath, {
                            _row_state_ : "C",
                            material_code : rtData.material_code,
                            material_desc : rtData.material_desc,
                            uom_code : rtData.base_uom_code,
                            company_code : this.getModel("detailModel").getProperty("/company_code"),
                            buyer_empno : this.getModel("detailModel").getProperty("/buyer_empno")
                        });
                        this.oSearchMatDialog.close();
                        this.oSearchMatDialog = null;
                    }
                    
                }.bind(this));

                this.oSearchMatDialog.attachEvent("cancel", function(oSelEvent) {
                    this.oSearchMatDialog = null;
                }.bind(this));

                this.oSearchMatDialog.open();
            }
        },

        onCompareBomPress: function() {
            MessageToast.show("준비중", {at: "center center"});
        },

        onBomInfoMappingPress: function(oEvent) {
            if(this.getModel("bomMappingModel")) {
                this.getModel("bomMappingModel").setData({});
            }
            
            var oTable = this.byId("tblPartListTable");
            var aSelIndics = oTable.getSelectedIndices();

            if (aSelIndics.length < 0) { return; }//check selection

            if (!this._checkValidMapping(oTable, aSelIndics)) { return; }//check validation

            this.setModel(new JSONModel, "bomMappingModel");
            var oBomMppingModel = this.getModel("bomMappingModel");
            var aAsisData = [];
            var aTobeData = [];
            aSelIndics.forEach(function(nRowIdx, idx) {
                let oCnxt = oTable.getContextByIndex(nRowIdx);
                let sPath = oCnxt.getPath();
                let oRow = oTable.getModel("partListModel").getProperty(sPath);
                if(oRow.change_info_code === "Old") {
                    aAsisData.push( {material_code : oRow.material_code} );
                } else if(oRow.change_info_code === "New") {
                    aTobeData.push({material_code : oRow.material_code, change_reason : ""});
                }
                if(idx === 0) {
                    oBomMppingModel.setProperty("/tenant_id", oRow.tenant_id);
                    oBomMppingModel.setProperty("/project_code", oRow.project_code);
                    oBomMppingModel.setProperty("/model_code", oRow.model_code);
                    oBomMppingModel.setProperty("/version_number", oRow.version_number);
                    oBomMppingModel.setProperty("/mapping_id", oRow.mapping_id);
                    oBomMppingModel.setProperty("/department_type_code", oRow.department_type_code);
                    //oBomMppingModel.setProperty("/creator_empno", oRow.creator_empno);
                    oBomMppingModel.setProperty("/creator_empno", oRow.creator_empno || "100000");//추후 세션정보로 셋팅
                    oBomMppingModel.setProperty("/creator_local_name", "김구매");//추후 세션정보로 셋팅

                    oBomMppingModel.setProperty("/eng_change_number", oRow.eng_change_number);
                    oBomMppingModel.setProperty("/change_reason", oRow.change_reason);
                }
            }.bind(this));
            oBomMppingModel.setProperty("/Asis/", aAsisData);
            oBomMppingModel.setProperty("/Tobe/", aTobeData);

            this._openBomMappingDialog(oBomMppingModel);
        },

        onChangeNumberLinkPress: function(oEvent) {
            if(this.getModel("bomMappingModel")) {
                this.getModel("bomMappingModel").setData({});
            }
            //var sNum = oEvent.getSource().getText();
            // if(!sNum) {
            //     MessageToast.show("Need Change Code!", {at : "center center"});
            //     return;
            // }
            var oCnxt = oEvent.getSource().getParent().getRowBindingContext();
            var oTable = this.byId("tblPartListTable");
            oTable.setBusy(true);
            let oDataModel = this.getModel("mcstBomMgtModel");//McstBomMgtService V2 OData Service
            //let oKey = {tenant_id : oCnxt.getObject("tenant_id"), mapping_id : oCnxt.getObject("mapping_id")};
            //let sReadPath = oDataModel.createKey("/mcstProjectPartMapDtlView", oKey);
            var aFilters = [
                new Filter("tenant_id", FilterOperator.EQ, oCnxt.getObject("tenant_id")),
                new Filter("mapping_id", FilterOperator.EQ, oCnxt.getObject("mapping_id"))
            ];
            oDataModel.read("/mcstProjectPartMapMstView", {
                filters : aFilters,
                //urlParameters : { "$expand" : "mappping_dtl,creator_person_info" },
                success : function(data){
                    oTable.setBusy(false);
                    console.log("mcstProjectPartMapDtlView", data);
                    //debugger;
                    if( data.results && data.results.length > 0 ) {
                        this.setModel(new JSONModel, "bomMappingModel");
                        var oBomMppingModel = this.getModel("bomMappingModel");
                        var aAsisData = [];
                        var aTobeData = []; 
                        data.results.forEach(function(oRow, nIdx) {
                            if(nIdx === 0) {
                                oBomMppingModel.setProperty("/tenant_id", oRow.tenant_id);

                                oBomMppingModel.setProperty("/project_code", oCnxt.getProperty("project_code"));
                                oBomMppingModel.setProperty("/model_code", oCnxt.getProperty("model_code"));
                                oBomMppingModel.setProperty("/version_number", oCnxt.getProperty("version_number"));

                                oBomMppingModel.setProperty("/mapping_id", oRow.mapping_id);
                                oBomMppingModel.setProperty("/department_type_code", oRow.department_type_code);
                                oBomMppingModel.setProperty("/creator_empno", oRow.creator_empno);
                                oBomMppingModel.setProperty("/creator_local_name", oRow.creator_person_info);
                                oBomMppingModel.setProperty("/eng_change_number", oRow.eng_change_number);
                                oBomMppingModel.setProperty("/change_reason", oRow.change_reason);
                            }
                            if(oRow.change_info_code === "Old") {
                                aAsisData.push({material_code : oRow.material_code, material_desc : oRow.material_desc});
                            } else if(oRow.change_info_code === "New") {
                                aTobeData.push({material_code : oRow.material_code, material_desc : oRow.material_desc, change_reason : oRow.remark});
                            }
                        });
                        oBomMppingModel.setProperty("/Asis/", aAsisData);
                        oBomMppingModel.setProperty("/Tobe/", aTobeData);
                        this._openBomMappingDialog(oBomMppingModel);
                    }

                }.bind(this),
                error : function(data){
                    oTable.setBusy(false);
                    console.log("error", data);
                }
            });
        },

        onBomMappingExit : function(oEvent) {
            this._oDialogBomMapping.then(function (oDialog) {
                oDialog.close();
                this.getView().getModel("bomMappingModel").setData({});
            }.bind(this));
        },

        onBomMappingDeletePress : function() {
            MessageBox.confirm(this.I18N.getText("/NCM00003"), {//삭제 하시겠습니까?
                title : "Delete",
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        this._bomMappingDelete();
                    }
                }.bind(this)
            });
        },

        _bomMappingDelete: function() {
            var oBomMappingModel = this.getModel("bomMappingModel");
            var oBomMappData = oBomMappingModel.getData();
            var oInputData = {
                inputData : {
                    tenant_id            : oBomMappData.tenant_id,
                    project_code         : oBomMappData.project_code,
                    model_code           : oBomMappData.model_code,
                    version_number       : oBomMappData.version_number,
                    mapping_id           : oBomMappData.mapping_id,
                    user_id              : this.oUerInfo.user_id
                }
            }
            var targetName = "TcDeleteMcstBomProc";
            var url = "/dp/tc/projectMgt/webapp/srv-api/odata/v4/dp.McstBomMgtV4Service/" + targetName;
            $.ajax({
                url: url,
                type: "POST",
                data : JSON.stringify(oInputData),
                contentType: "application/json",
                success: function(data){
                    console.log("create Proc callback Data", data);
                    MessageToast.show(this.I18N.getText("/NCM01002"), {at: "center center"});//삭제하였습니다.
                    if(data.return_code === "OK") {
                        this.onBomMappingExit();
                        this._getPartList();
                    } else {
                        MessageToast.show(data.return_msg, {at: "Center Center"});
                    }
                }.bind(this),
                error: function(e){
                    console.log("error", e);
                    let failMsg = this.I18N.getText("/EPG00001");//삭제 실패 하였습니다.
                    let eMessage = JSON.parse(e.responseText).error.message;
                    MessageBox.show(failMsg+"\n\n" + "["+eMessage+"]", {at: "Center Center"});
                }.bind(this)
            });
        },

        onBomMappingSavePress: function() {
            var oBomMappingModel = this.getModel("bomMappingModel");
            var oBomMappData = oBomMappingModel.getData();
            let sItem = "";
            if(!oBomMappData.department_type_code) {
                sItem = this.I18N.getText("/CHARGE_DEPT");
                //MessageToast.show(this.I18N.getText("/EDP30001", [sItem], {at: "center center"}));
                MessageToast.show(sItem +" 는(은) 필수 입력값 입니다.", {at : "center center"});
                return;
            }
            if(!oBomMappData.creator_empno) {
                sItem = this.I18N.getText("/CHARGE_PERSON");
                //MessageToast.show(this.I18N.getText("/EDP30001", [sItem], {at: "center center"}));
                MessageToast.show(sItem +" 는(은) 필수 입력값 입니다.", {at : "center center"});
                return;
            }
            // if(!oBomMappData.eng_change_number) {
            //     sItem = "ECO/ECR No.";
            //     //MessageToast.show(this.I18N.getText("/EDP30001", [sItem], {at: "center center"}));
            //     MessageToast.show(sItem +" 는(은) 필수 입력값 입니다.", {at : "center center"});
            //     return;
            // }
            if(!oBomMappData.change_reason) {
                sItem = this.I18N.getText("/MAPPING_RSN");
                //MessageToast.show(this.I18N.getText("/EDP30001", [sItem], {at: "center center"}));
                MessageToast.show(sItem +" 는(은) 필수 입력값 입니다.", {at : "center center"});
                return;
            }

            MessageBox.confirm(this.I18N.getText("/NCM00001"), {//저장 하시겠습니까?
                title : "Save",
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        this._bomMappingSave();
                    }
                }.bind(this)
            });
        },

        /**
         * BOM Mapping 저장
         */
        _bomMappingSave: function() {
            var oBomMappingModel = this.getModel("bomMappingModel");
            var oBomMappData = oBomMappingModel.getData();
            var aOldData = oBomMappingModel.getProperty("/Asis");
            var aNewData = oBomMappingModel.getProperty("/Tobe");
            //저장시 material_desc 는 빼야 한다.
            var aSaveNewData = [];
            aNewData.forEach(function(oRow) {
                aSaveNewData.push({material_code : oRow.material_code, change_reason : oRow.change_reason});
            });

            var oInputData = {
                inputData : {
                    tenant_id            : oBomMappData.tenant_id,
                    //project_code         : oBomMappData.project_code,
                    //model_code           : oBomMappData.model_code,
                    //version_number       : oBomMappData.version_number,
                    user_id              : this.oUerInfo.user_id,
                    //old_tbl              : aOldData,
                    new_tbl              : aSaveNewData,
                    department_type_code : oBomMappData.department_type_code,
                    creator_empno        : oBomMappData.creator_empno,
                    eng_change_number    : oBomMappData.eng_change_number,
                    change_reason        : oBomMappData.change_reason
                }
            }
            //mapping_id 가 있으면 update 없으면 create
            if(oBomMappData.mapping_id) {//update
                oInputData.inputData.mapping_id = oBomMappData.mapping_id;
            } else {//create
                oInputData.inputData.old_tbl = aOldData;
                oInputData.inputData.project_code = oBomMappData.project_code;
                oInputData.inputData.model_code = oBomMappData.model_code;
                oInputData.inputData.version_number = oBomMappData.version_number;
            }
            
            var targetName = oInputData.inputData.mapping_id ? "TcUpdateMcstBomProc" : "TcCreateMcstBomProc";
            var url = "/dp/tc/projectMgt/webapp/srv-api/odata/v4/dp.McstBomMgtV4Service/" + targetName;
            $.ajax({
                url: url,
                type: "POST",
                data : JSON.stringify(oInputData),
                contentType: "application/json",
                success: function(data){
                    console.log("create Proc callback Data", data);
                    if(data.return_code === "OK") {
                        MessageToast.show(this.I18N.getText("/NCM01001"), {at: "center center"});//저장하였습니다.
                        this.onBomMappingExit();
                        this._getPartList();
                    } else {
                        MessageToast.show(data.return_msg, {at: "Center Center"});
                    }
                }.bind(this),
                error: function(e){
                    console.log("error", e);
                    let eMessage = JSON.parse(e.responseText).error.message;
                    MessageBox.show("Mapping failed.\n\n" + "["+eMessage+"]", {at: "Center Center"});
                }
            });
        },

        onBomInfo: function() {
            MessageToast.show("준비중", {at: "center center"});
        },

        onDraftPress: function() {
            var aList = this.getModel("partListModel").getProperty("/PartListView");
            if(!this._checkValidDraft(aList)) { return; }
            MessageBox.confirm(this.I18N.getText("/NCM00001"), {
                title : "Draft",
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        this._draftApply();
                    }
                }.bind(this)
            });
        },

        /**
         * Draft 저장
         */
        _draftApply: function() {
            //partListModel>/PartListView
            var aList = this.getModel("partListModel").getProperty("/PartListView");
            var aPartList = [];
            aList.forEach(function(oRow) {
                if(oRow._row_state_) {
                    let oObj = {
                        tenant_id : this.getModel("detailModel").getProperty("/tenant_id"),
                        project_code : this.getModel("detailModel").getProperty("/project_code"),
                        model_code : this.getModel("detailModel").getProperty("/model_code"),
                        version_number : this.getModel("detailModel").getProperty("/version_number"),
                        material_code : oRow.material_code,
                        commodity_code : oRow.commodity_code,
                        uom_code : oRow.uom_code,
                        material_reqm_quantity : parseFloat(oRow.material_reqm_quantity),
                        buyer_empno : oRow.buyer_empno,
                        mapping_id : oRow.mapping_id,
                        crud_type_code : oRow._row_state_
                    };
                    aPartList.push(oObj);
                }
            }.bind(this));
            var oInputData = { 
                    inputData : {
                            partList : aPartList,
                            user_id : this.oUerInfo.user_id
                    }
                };
            var targetName = "TcSaveMcstPartListProc";
            var url = "/dp/tc/projectMgt/webapp/srv-api/odata/v4/dp.McstBomMgtV4Service/" + targetName;
            $.ajax({
                url: url,
                type: "POST",
                data : JSON.stringify(oInputData),
                contentType: "application/json",
                success: function(data){
                    console.log("draft Proc callback Data", data);
                    if(data.return_code === "OK") {
                        MessageToast.show(this.I18N.getText("/NCM01001"), {at: "center center"});//저장하였습니다.
                        this._getPartList();
                    } else {
                        MessageToast.show(data.return_msg, {at: "Center Center"});
                    }
                }.bind(this),
                error: function(e){
                    console.log("error", e);
                    let eMessage = JSON.parse(e.responseText).error.message;
                    MessageBox.show("Draft failed.\n\n" + "["+eMessage+"]", {at: "Center Center"});
                }
            });

        },

        onSaveNext: function() {
            MessageToast.show("준비중", {at: "center center"});            
        },
        
        onImportSheet: function() {
            MessageToast.show("준비중", {at: "center center"});            
        },

        onExportSheet: function() {
            //MessageToast.show("준비중", {at: "center center"});
            var oTable = this.byId("tblPartListTable");
            var oData = this.getModel("partListModel").getProperty("/PartListView");
            var sFileName = this.I18N.getText("/BOM");
            debugger;
            ExcelUtil.fnExportExcel({
                fileName: sFileName || "SpreadSheet",
                table: oTable,
                data: oData
            });

        },

        onInputWithEmployeeValuePress: function(oEvent){
            //let oDialog = this.byId("employeeDialogBomMapping");
            let oDialog = sap.ui.core.Fragment.byId("fragmentBomMapping","employeeDialogBomMapping")
            let sModelName = oEvent.getSource().data("modelName");
            let sCodePath = oEvent.getSource().data("codePath");
            let sTextPath = oEvent.getSource().data("textPath");
            let oModelNameTemplate = new sap.ui.core.CustomData({key:"modelName"});
                oModelNameTemplate.setValue(sModelName);
            let oCodePathTemplate = new sap.ui.core.CustomData({key:"codePath"});
                oCodePathTemplate.setValue(sCodePath);
            let oTextPathTemplate = new sap.ui.core.CustomData({key:"textPath"});
                oTextPathTemplate.setValue(sTextPath);

            oDialog.addCustomData(oModelNameTemplate);
            oDialog.addCustomData(oCodePathTemplate);
            oDialog.addCustomData(oTextPathTemplate);
            oDialog.open();
        },

        onEmployeeDialogApplyPress: function(oEvent){
            //debugger;
            let sModelName  = oEvent.getSource().data("modelName");
            let sCodePath = oEvent.getSource().data("codePath");
            let sTextPath = oEvent.getSource().data("textPath");
            this.getModel(sModelName).setProperty(sCodePath, oEvent.getParameter("item").employee_number);
            this.getModel(sModelName).setProperty(sTextPath, oEvent.getParameter("item").user_local_name);
        },

        _openBomMappingDialog : function(bomMappingModel) {
            
            if (!this._oDialogBomMapping) {
                this._oDialogBomMapping = Fragment.load({
                    id: "fragmentBomMapping",
                    name: "dp.tc.projectMgt.view.BomMapping",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }
            this._oDialogBomMapping.then(function (oDialog) {
                oDialog.open();
            }.bind(this));

        },

        /**
         * BOM Mapping 팝업 오픈 전 validation checking :
         * Old or New 인 데이터인지 확인
         * mapping-info 가 없는 데이터인지 확인 - 이미 맵핑된 데이터는 안됨
         * Old Mat. 과 New Mat. 이 모두 복수개 일 수 없다. Old or New 중 꼭 하나는 선택한 갯수가 한개 이어야 한다.
         */
        _checkValidMapping: function(oTable, aSelIndics) {
            oTable.getModel("partListModel");
            var rtFlag = true;
            var nOldCnt = 0;
            var nNewCnt = 0;
            $.each(aSelIndics, function(idx, nRowIdx) {
                let oCnxt = oTable.getContextByIndex(nRowIdx);
                let sPath = oCnxt.getPath();
                let oRow = oTable.getModel("partListModel").getProperty(sPath);

                nOldCnt = oRow.change_info_code === "Old" ? nOldCnt + 1 : nOldCnt;
                nNewCnt = oRow.change_info_code === "New" ? nNewCnt + 1 : nNewCnt;

                if(oRow.change_info_code != "Old" && oRow.change_info_code != "New") {
                    //MessageToast.show("선택한 데이터의 변경정보를 확인해 주세요.", {at: "center center"});
                    MessageToast.show(this.I18N.getText("/NDP40003"), {at: "center center"});//변경정보가 New&Old인 자재만 매핑할 수 있습니다.(1:N 또는 N:1 매핑가능)
                    rtFlag = false;
                    return false;
                }

                if(oRow.mapping_id) {
                    //MessageToast.show("선택한 데이터 중 이미 Mapping 된 데이터가 있습니다.", {at: "center center"});
                    MessageToast.show(this.I18N.getText("/NDP40002"), {at: "center center"});//이미 매핑된 자재가 있습니다.
                    rtFlag = false;
                    return false;
                }

                if(nOldCnt > 1 && nNewCnt > 1) {
                    //MessageToast.show("Mapping 대상 데이터의 Old/New 모두 복수 선택될 수 없습니다.", {at: "center center"});
                    MessageToast.show(this.I18N.getText("/NDP40003"), {at: "center center"});//변경정보가 New&Old인 자재만 매핑할 수 있습니다.(1:N 또는 N:1 매핑가능)
                    rtFlag = false;
                    return false;
                }
            }.bind(this));

            if(rtFlag && (nOldCnt === 0 || nNewCnt === 0)) {
                //MessageToast.show("Mapping 대상 데이터의 Old/New 는 최소 하나 이상이어야 합니다.", {at: "center center"});
                MessageToast.show(this.I18N.getText("/NDP40003"), {at: "center center"});//변경정보가 New&Old인 자재만 매핑할 수 있습니다.(1:N 또는 N:1 매핑가능)
                rtFlag = false;
            }

             return rtFlag;
        },

        /**
         * Draft Validation checking
         */
        _checkValidDraft: function(aList) {
            var rs = true;
            var bHavingData = false;
            $.each(aList, function(nIdx, oRow) {
                if(oRow._row_state_) {
                    bHavingData = true;
                    return false;
                }
            });
            if(!bHavingData) {
                MessageToast.show(this.I18N.getText("/NCM01006"), {at : "center center"});//변경된 데이터가 없습니다.
                return false;
            }
            $.each(aList, function(nIdx, oRow) {
                if(!oRow.material_code) {
                    MessageToast.show(this.I18N.getText("/MATERIAL_CODE") + " 는(은) 필수 입력값 입니다.", {at : "center center"});
                    rs = false;
                    return false;
                } else if(!oRow.uom_code) {
                    MessageToast.show(this.I18N.getText("/UNIT") + " 는(은) 필수 입력값 입니다.", {at : "center center"});
                    rs = false;
                    return false;
                } else if(!oRow.material_reqm_quantity) {
                    MessageToast.show(this.I18N.getText("/REQ_QTY") + " 는(은) 필수 입력값 입니다.", {at : "center center"});
                    rs = false;
                    return false;
                }
            }.bind(this));
            return rs;
        }
    });
  }
);