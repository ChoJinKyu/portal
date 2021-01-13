sap.ui.define([
  "ext/lib/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "ext/lib/model/ManagedListModel",
  "ext/lib/util/Multilingual",
  "ext/lib/formatter/DateFormatter",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/ui/core/Fragment",
  "sap/ui/core/Item"
],
  function (BaseController, JSONModel, ManagedListModel, Multilingual, DateFormatter, Filter, FilterOperator
         , MessageToast, MessageBox, Fragment, Item) {
    "use strict";

    return BaseController.extend("dp.tc.projectMgt.controller.ProjectMgtList", {
        dateFormatter: DateFormatter,

        onInit: function () {
            let oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            //this.setModel(new JSONModel(), "listModel");
            var oFilterModel = {
                company_code : {operator: 'EQ', value: ''},
                bizdivision_code : {operator: 'EQ', value: ''},
                project_code : {operator: 'Contains', value: ''},
                model_code: {operator: 'Contains', value: ''},
                product_group_code : {operator: 'EQ', value: ''},
                project_status_code : {operator: 'EQ', value: ''},
                massprod_start_date : {operator: 'BT', start: null, end: null},
                project_grade_code : {operator: 'EQ', value: ''},
                project_develope_event_code : {operator: 'EQ', value: ''},
                buyer_name : {operator: 'Contains', value: ''}
            };
            
            this.setModel(new JSONModel(oFilterModel), "filterModel");
            this.setModel(new JSONModel(), "updateModel");

            //this.getRouter().getRoute("ProjectMgtList").attachPatternMatched(this._getProjectMgtList, this);
        }

        /**
         * Search 버튼 클릭 시 List 조회
         */
        , onSearch: function () {
            
            var oFilterModel = this.getModel("filterModel"),
                oFilterData = oFilterModel.getData(),
                aFilters = [];

            if(!oFilterData.company_code.value) {
                MessageToast.show("회사는 필수 조회조건 입니다.", {at: "Center Center"});
                return;
            }
            //filterModel>/divistion/value
            if(!oFilterData.bizdivision_code.value) {
                MessageToast.show("사업부는 필수 조회조건 입니다.", {at: "Center Center"});
                return;
            }

            Object.keys(oFilterData).forEach(function(sKey) {
                var oTemp = oFilterData[sKey];
                if(oTemp.value || oTemp.start) {
                    if(oTemp.operator === "EQ" || oTemp.operator === "Contains") {
                        aFilters.push(new Filter(sKey, FilterOperator[oTemp.operator], oTemp.value));
                    } else if(oTemp.operator === "BT") {
                        //aFilters.push(new Filter(sKey, FilterOperator[oTemp.operator], oTemp.start, oTemp.end));
                        aFilters.push(new Filter(sKey, FilterOperator.BT, oTemp.start, this._getNowDayAndTimes(true, oTemp.end)));
                    }

                }
            }.bind(this));

            this._getProjectMgtList(aFilters);
        }
        
        /**
         * Input Enter 시 조회 적용
         */
        , onLiveChangeInput: function(oEvent) {
            let newValue = oEvent.getParameter("newValue");
            var keycode = (oEvent.keyCode ? oEvent.keyCode : oEvent.which);
            if(keycode === '13'){
                this.onSearch();
            }
        }

        , onExcelExportPress: function() {
            MessageToast.show("준비중", {at: "Center Center"});
            return;
        }

        /**
         * Cell 클릭 후 상세화면으로 이동
         */
        , onCellClickPress: function() {
            //this._goLastesProjView();
        }

        /**
         * RowAction 클릭 후 상세화면으로 이동
         */
        , onRowActionPress: function(oEvent) {
            var oContext = oEvent.getParameter("row").getBindingContext("listModel");
            this._goLastesProjView(oContext);
        }

        /**
         * RowAction 목표재료비 상세화면으로 이동
         */
        , onDetailPopRowActionPress: function(oEvent) {
            MessageToast.show("준비중", {at: "Center Center"});
            return;
            const view_mode = "VIEW";
            this.getView().getModel("popupListModel").setProperty("/cost_type", oEvent.getSource().data("cost_type"));
            this.getView().getModel("popupListModel").setProperty("/detail_mode", view_mode);
            var oContext = oEvent.getParameter("row").getBindingContext("listModel");
            this._goMcstProjView(oContext, oEvent.getSource().data("cost_type"));
        }

        /**
         * Date 데이터를 String 타입으로 변경. 예) 2020-10-10T00:00:00
         */
        , _getNowDayAndTimes: function (bTimesParam, oDateParam) {
            let oDate = oDateParam || new Date(),
                iYear = oDate.getFullYear(),
                iMonth = oDate.getMonth()+1,
                iDate = oDate.getDate(),
                iHours = oDate.getHours(),
                iMinutes = oDate.getMinutes(),
                iSeconds = oDate.getSeconds();
 
            let sReturnValue = "" + iYear + "-" + this._getPreZero(iMonth) + "-" + this._getPreZero(iDate) + "T";
            let sTimes = "" + this._getPreZero(iHours) + ":" + this._getPreZero(iMinutes) + ":" + this._getPreZero(iSeconds);

            if( bTimesParam ) {
                sReturnValue += sTimes;
            }else {
                sReturnValue += "00:00:00";
            }

            return sReturnValue;
        }

        /**
         * 넘겨진 Parameter가 10이하이면 숫자앞에 0을 붙여서 return
         */
        , _getPreZero: function (iDataParam) {
            return (iDataParam<10 ? "0"+iDataParam : iDataParam);
        }

        /**
         * 입력/수정하는 화면으로 이동
         */
        , _goLastesProjView: function(oContext) {
            if(!oContext) {
                return;
            }
            var oNavParam = {
                tenant_id : oContext.getObject("tenant_id"),
                project_code : oContext.getObject("project_code"),
                model_code : oContext.getObject("model_code")
            };
            this.getRouter().navTo("ProjectInfo", oNavParam);
        }
        /**
         * 상세 페이지로 이동
         */
        , _goDetailView: function (oEvent) {
            MessageToast.show("준비중", {at: "Center Center"});
            return;
            var oNavParam = {

            };
            this.getRouter().navTo("detail", oNavParam);
            //this.getOwnerComponent().getRouter().navTo("ProjectMgtDetail");
        }
        
        /**
         * MCST 프로젝트 상세 화면으로 이동
         */
        , _goMcstProjView: function(oContext, cost_type) {
            const view_mode = "READ";
            let oModel = oContext.getModel();
            let oObj = oModel.getProperty(oContext.getPath());

            var oNavParam = {
                tenant_id: oObj.tenant_id,
                project_code: oObj.project_code,
                model_code: oObj.model_code,
                cost_type: cost_type,
                view_mode: view_mode
            };

            this.getRouter().navTo("McstProjectMgtDetail", oNavParam);
        }

        /**
         * Table 의 선택된 index 를 리턴
         * @param {object} _oTable
         */
        , _getSelectedIndex: function(_oTable) {
            if(!_oTable) { alert("invalid Table!"); }
            
            var iIdx = _oTable.getSelectedIndex();
            
            if(iIdx < 0) {
                MessageBox.alert("데이터가 선택되지 않았습니다.");
                return -1;
            }
            return iIdx;
        }

        /**
         * Project Management List 조회
         */
        , _getProjectMgtList: function(filtersParam) {
            let oView = this.getView();
            let oModel = this.getModel();
            filtersParam =  Array.isArray(filtersParam) ? filtersParam : [];
            oView.setBusy(true);
            oModel.read("/ProjectView", {
                filters : filtersParam,
                success : function(data){
                    oView.setBusy(false);

                    oView.getModel("listModel").setData(data);
                    oView.byId("mainTable").clearSelection();
                },
                error : function(data){
                    oView.setBusy(false);
                    console.log("error", data);
                }
            });
        }

        /**
         * 상태 InforLabel colorScheme 설정
         * @param {stirng} statusCode
         */
        , formatStatusColor: function(_code) {
            if(_code === "ACCEPT") {
                return 1;
            } else if(_code === "DRAFT") {
                return 5;
            } else if(_code === "CONFIRMED") {
                return 9;
            } else {
                return 4;
            }
        }

        , onSelectionChange: function(oEvent) {
            var oTable = this.getView().byId("mainTable"),
            iSelectedIndex = oEvent.getSource().getSelectedIndex();

            oTable.setSelectedIndex(iSelectedIndex);
        }

        , onLinkPress: function(oEvent) {
            //MessageToast.show("Go to Detail!", {at: "Center Center"});
            this.getOwnerComponent().getRouter().navTo("ProjectInfo");
            return;

        }

        , _goProgressView: function(oEvent) {
            MessageToast.show("준비중", {at: "Center Center"});
            return;
        }


        /********************************************************************************** */
        /* 견적 재료비 생성, 목표 재료비 생성, 진척 관리 Dialog 창 Action  (Starat)             */
        /********************************************************************************** */

        /**
         * 견적재료비 생성 클릭
         * @param {event} oEvent
         */
        , onEstimateCreatePress: function (oEvent) {
            this.onGoalCreatePress(oEvent);
        }

        /**
         * 예상 재료비 작성 Dialog 오픈 
         * @param {event} oEvent
         */
        , onProgressMgtPress: function (oEvent) {
            //MessageToast.show("준비중", { at: "Center Center" });
            //return;
            this.onGoalCreatePress(oEvent);
        }

        /**
         * 목표재료비 작성 Dialog 오픈
         * @param {event} oEvent
         */
        , onGoalCreatePress: function (oEvent) {
            var oView = this.getView();
            var oTable = oView.byId("mainTable");
            var nSelIdx = this._getSelectedIndex(oTable);

            if (nSelIdx < 0) { return; }//skip

            var oButton = oEvent.getSource();
            if (!this._oDialogTableSelect) {
                this._oDialogTableSelect = Fragment.load({
                    id: oView.getId(),
                    name: "dp.tc.projectMgt.view.DetailPopup",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this._oDialogTableSelect.then(function (oDialog) {
                oDialog.open();
                this.onGetDialogData();

            }.bind(this));

        }
        /** 
         *  목표재료비 Dialog 창 데이터 추출  
         */
        , onGetDialogData: function (oEvent) {
            var oView = this.getView("detailPopupTable");
            //var oModel = this.getModel();
            var oModel = this.getModel("detailListModel");   //manifest에 등록한 모델을 가져오면 해당 서비스를 사용할수 있다.
            var oTable = oView.byId("mainTable");
            var nSelIdx = this._getSelectedIndex(oTable);
            var oContext = oTable.getContextByIndex(nSelIdx);
            var sPath = oContext.getPath();
            var oData = oTable.getBinding().getModel().getProperty(sPath);

            var aFilters = [];
            
            if (aFilters) {
                aFilters.push(new Filter("tenant_id", FilterOperator.EQ, oData.tenant_id));
                aFilters.push(new Filter("project_code", FilterOperator.EQ, oData.project_code));
                aFilters.push(new Filter("model_code", FilterOperator.EQ, oData.model_code));
            }

            oView.setBusy(true);
            oModel.read("/McstProject", {  
                filters: aFilters,
                urlParameters: {
                    "$expand": "mcst_status_text,mcst_text"
                },
                success: function (data) {
                    oView.setBusy(false);

                    if (data) {
                        oView.getModel("popupListModel").setData(data);
                    }
                }.bind(this),
                error: function (data) {
                    oView.setBusy(false);
                    console.log('error', data);
                }
            });
        }

        /**
         * Dialog Close
         */
        , onClose: function (oEvent) {
            this._oDialogTableSelect.then(function (oDialog) {
                this.getView().byId("detailPopupTable").clearSelection();
                oDialog.close();
            }.bind(this));
        }

        /**
        * Dialog Copy
        */
        , onCopy: function (oEvent) {
            MessageToast.show("준비중", {at: "Center Center"});
            return;
        }

        /**
        * Dialog Create
        */
        , onDialogCreate: function (oEvent) {
            MessageToast.show("준비중", {at: "Center Center"});
            return;
            this._goCreateView();
        }

        /**
         * Dialog창 테이블 Index값 세팅 
         */
        , onSelectDialogChange: function (oEvent) {
            var oTable = this.getView().byId("detailPopupTable"),
                iSelectedIndex = oEvent.getSource().getSelectedIndex();

            oTable.setSelectedIndex(iSelectedIndex);
        }

        /**
         * Dialog(견적재료비 생성, 목표 재료비 생성, 진척관리) > Create(작성) > 입력/수정하는 화면으로 이동
         */
        , _goCreateView: function (oEvent) {
            //var iSelIdx = this._getSelectedIndex(this.getView().byId("detailPopupTable"));

            //if (iSelIdx < 0) { return; }//skip
            var index = 0;
            let oTable = this.getView().byId("detailPopupTable");
            let oContext = oTable.getContextByIndex(index);
            let oModel = oContext.getModel();
            let oObj = oModel.getProperty(oContext.getPath());

            var oNavParam = {
                tenant_id: oObj.tenant_id,
                project_code: oObj.project_code,
                model_code: oObj.model_code
            };

            this.getRouter().navTo("McstProjectMgtDetail", oNavParam);
            //this.getRouter().navTo("ProjectInfo", oNavParam);
        }

        /********************************************************************************** */
        /* 견적 재료비 생성, 목표 재료비 생성, 진척 관리 Dialog 창 Action  (End)               */
        /********************************************************************************** */  


        , onAddModelPress: function() {
            MessageToast.show("준비중", {at: "Center Center"});
            return;
        }

        /**
         * 재료비 산출제외 Dialog 오픈
         * @param {event} oEvent
         */
        , onExcludeCalPress : function (oEvent) {
            var oView = this.getView();
            var oTable = oView.byId("mainTable");
            var nSelIdx = this._getSelectedIndex(oTable);

            if(nSelIdx < 0) { return; }//skip

            var oContext = oTable.getContextByIndex(nSelIdx);
            var sPath = oContext.getPath();
            var oData = oTable.getBinding().getModel().getProperty(sPath);
            var updateData = {
                tenant_id : oData.tenant_id,
                company_code : oData.company_code,
                project_code : oData.project_code,
                model_code : oData.model_code,
                mcst_excl_flag : oData.mcst_excl_flag,
                mcst_excl_reason : oData.mcst_excl_reason
            };
            this.getModel("updateModel").setData(updateData);

            var oButton = oEvent.getSource();
			if (!this._oDialogExceptCal) {
				this._oDialogExceptCal = Fragment.load({ 
                    id: oView.getId(),
					name: "dp.tc.projectMgt.view.ExcludeMaterialCost",
					controller: this
				}).then(function (oDialog) {
				    oView.addDependent(oDialog);
					return oDialog;
				}.bind(this));
            } 
            
            this._oDialogExceptCal.then(function(oDialog) { 
                oDialog.open();
			});
        }

        , onExcludeCalExit: function () {
            this.getModel("updateModel").setData({});
            this.byId("dialogExclusion").close();
        }

        , onExcludeCalSavePress: function() {
            //MessageToast.show("Update Service", {at: "Center Center"});
            var oApplyData = this.getModel("updateModel").getProperty("/");
            if(!oApplyData.mcst_excl_reason) {
                MessageBox.alert("제외 사유를 입력하세요.", {at: "Center Center"});
                return;
            }
            let oParam = {
                oODataModel : this.getModel(),
                inData : oApplyData,// 저장할 데이터 row
                sEntityName : "Project",
                bOnlyField : true
            };
            var oProjectData = this._fnGetEntityFromMetadata(oParam)
                oProjectData.mcst_excl_flag = true;
            var oKey = {
                tenant_id : oProjectData.tenant_id,
                company_code : oProjectData.company_code,
                project_code : oProjectData.project_code,
                model_code : oProjectData.model_code
            }
            var oDataModel = this.getModel();
            var sCreatePath = oDataModel.createKey("/Project", oKey);

            oDataModel.update(sCreatePath, oProjectData, {
                success: function(data){
                    MessageBox.show("적용되었습니다.", {at: "Center Center"});
                    this.onSearch();
                    this.byId("dialogExclusion").close();

                }.bind(this),
                error: function(data){
                    console.log('error',data)
                }
            });
            
        }

        , onChangeCompnay: function(oEvent){

            //this.copyMultiSelected(oEvent);
            var oComboSnap = this.getView().byId("cbxSnapDivision");
            var oComboExpand = this.getView().byId("cbxExpandDivision");

            var sCompCode = oEvent.getSource().getSelectedItem().getKey();
            var filter = new Filter({
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, 'L2100' )
                                //,new Filter("company_code", FilterOperator.EQ, sCompCode )
                            ],
                            and: true
                         });
            var oBindingInfo = oComboSnap.getBindingInfo("items");
            var bindInfo = {
                    path: '/Division',
                    filters: filter,
                    template: oBindingInfo.template
                };

            oComboSnap.bindItems(bindInfo);
            oComboExpand.bindItems(bindInfo);

        }

        /**
         * @param {object} oODataModel OData 통신 모델
         * @param {string} sEntityName 호출 Entity 명
         * @param {boolean} bOnlyField 해당 property만 리턴할지 여부
         */
        , _getEntityProperty: function(oODataModel, sEntityTypeName, bOnlyField) {
            var oServiceMetadata, aProperty, aEntityType;

            oServiceMetadata = oODataModel.getServiceMetadata();
            aProperty = [];
            if(!oServiceMetadata) {
                return aProperty;
            }
            aEntityType = oServiceMetadata.dataServices.schema[0].entityType.filter( function(i) {return i.name === sEntityTypeName; } );
            if(aEntityType.length) {
                aProperty = aEntityType[0].property;
            }
            if(bOnlyField) {
                aProperty = aProperty.map( function(row) {return row.name} );
            }
            
            return aProperty;
        }

        /**
         * 모델 Entity 값을 param data 와 비교하여 같은 property value 를 리턴한다.
         * @param {Object} oParam : oODataModel OData통신모델, inData 적용할 데이터, sEntityName 호출 Entity명, bOnlyField 해당 Property만 리턴 할지 여부
         */
        , _fnGetEntityFromMetadata: function(oParam) {
            var oView, oUseData, oSaveData, aUseProperties;

            oView = this.getView();
            oUseData = oParam.inData;
            aUseProperties = this._getEntityProperty(oParam.oODataModel, oParam.sEntityName, oParam.bOnlyField);
            oSaveData = {};

            aUseProperties.forEach(function(field) {
                if(oUseData[field]) {
                    oSaveData[field] = oUseData[field];
                }
            });

            return oSaveData;
        }

        /**
		 * deepcopy 하는 함수
		 * @param {object} obj 복사할 data
		 * @return {object} 복사된 data
		**/
		, fnDeepcopy: function(obj){
			var copy;
			if(Array.isArray(obj)){
				copy = [];
			} else {
				copy = {};
			}
			if(typeof obj === "object" && obj !== null && !(obj instanceof Date)){
				for(var attr in obj){
					if(obj.hasOwnProperty(attr)){
						if(attr === "__metadata"){
							continue;
						}
						copy[attr] = this.fnDeepcopy({data:obj[attr]});
					}
				}
			} else {
				copy = obj;
			}
			return copy;
		}
    
    });
  }
);