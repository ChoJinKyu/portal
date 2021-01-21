sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/f/library",						
    "sap/ui/model/Filter",						
    "sap/m/MessageBox",
    "ext/lib/util/Multilingual",
    "sap/ui/core/ListItem",
    "sap/m/SegmentedButtonItem"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * 2021-01-20 개발시작
     * A61987
     */
	function (Controller, fioriLibrary, Filter, MessageBox, Multilingual, ListItem, SegmentedButtonItem) {
        "use strict";
        
        var textModel;   // I18N 모델 저장

		return Controller.extend("sp.se.evaluationItemMngt.controller.Master", {
            /***
             * 최초 한번 Init 설정
             */
			onInit: function () {
                var oView,oMultilingual;
                
                oView = this.getView();
                oMultilingual = new Multilingual();
                textModel = oMultilingual.getModel();
                oView.setModel(textModel, "I18N");
                
                this._bindOrgCodeComboItem();
                this._setEvaluExecuteModeItem();

                this.getOwnerComponent().getRouter().getRoute("Master").attachPatternMatched(this._onProductMatched, this);
            }
            /***
             * Master Pattern Matched Evnet
             * 해당 패턴이 일치할때마다 이벤트 발생
             * @param e > Event 객체
             */
            , _onProductMatched: function (e) {
                var oArgs, oComponent, oViewModel;

                oArgs = e.getParameter("arguments");
                oComponent = this.getOwnerComponent();
                oViewModel = oComponent.getModel("viewModel");

                oViewModel.setProperty("/App/layout", "OneColumn");
            }
            /***
             * 세션 유저정보를 가져온다.
             */
            , _getUserSession : function(){
                var oUserInfo;
                
                oUserInfo = {
                    loginUserId : "TestUser",
                    tenantId : "L2100",
                    companyCode : "LGCKR",
                    orgTypeCode : "BU",
                    orgCode : "BIZ00000",
                    evalPersonEmpno : "5706"
                };

                return oUserInfo;
            }
            /***
             * 평가조직 (orgCode) 콤보박스 아이템 바인딩
             * 1. 세션유저 정보를 가지고 아이템을 구성한다.
             * 2. 첫번째 아이템으로 선택해준다.
             */
            , _bindOrgCodeComboItem : function(){
                var oComboOrgCode, aFilters, oUserInfo;

                oComboOrgCode = this.byId("orgCode");
                oUserInfo = this._getUserSession();
                aFilters = [
                    new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                    new Filter("company_code", "EQ", oUserInfo.companyCode),
                    new Filter("evaluation_op_unt_person_empno", "EQ", oUserInfo.evalPersonEmpno)
                ];

                oComboOrgCode.bindItems({
                    path : "/UserEvalOrgView",
                    filters : aFilters,
                    template : new ListItem({ text : "{org_name}", key : "{org_code}", additionalText : "{org_code}" })
                });

                this.getOwnerComponent().getModel().read("/UserEvalOrgView",{
                    filters : aFilters,
                    urlParameters : {
                        $top : 1
                    },
                    success : function(oData){
                        var aResults, sOrgCode;

                        aResults = oData.results;
                        if(!aResults.length){
                            return;
                        }
                        sOrgCode = aResults[0].org_code;

                        oComboOrgCode.setSelectedKey(sOrgCode);
                        this._bindUnitComboItem(sOrgCode);
                    }.bind(this),
                    error : function(){
                        
                    }
                });
            }
            /***
             * 평가운영단위 (unitCode) 콤보박스 아이템 바인딩
             * 1. 세션유저 정보를 가지고 아이템을 구성한다.
             * 2. 첫번째 아이템으로 선택해준다.
             */
            , _bindUnitComboItem : function(sOrgCode){
                var oComboUnitCode, aFilters, oUserInfo;

                oComboUnitCode = this.byId("unitCode");
                oUserInfo = this._getUserSession();
                aFilters = [
                    new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                    new Filter("company_code", "EQ", oUserInfo.companyCode),
                    new Filter("evaluation_op_unt_person_empno", "EQ", oUserInfo.evalPersonEmpno),
                    new Filter("org_code", "EQ", sOrgCode)
                ];

                oComboUnitCode.bindItems({
                    path : "/UserEvalUnitView",
                    filters : aFilters,
                    template : new ListItem({ 
                        text : "{evaluation_operation_unit_name}", 
                        key : "{evaluation_operation_unit_code}", 
                        additionalText : "{evaluation_operation_unit_code}" 
                    })
                });

                this.getOwnerComponent().getModel().read("/UserEvalUnitView",{
                    filters : aFilters,
                    urlParameters : {
                        $top : 1
                    },
                    success : function(oData){
                        var aResults, sEvalOperationUnitCode;

                        aResults = oData.results;
                        if(!aResults.length){
                            return;
                        }
                        sEvalOperationUnitCode = aResults[0].evaluation_operation_unit_code;

                        oComboUnitCode.setSelectedKey(sEvalOperationUnitCode);
                        this._bindEavluTypeItem(sOrgCode, sEvalOperationUnitCode);
                    }.bind(this),
                    error : function(){
                        
                    }
                });
            }
            /***
             * 평가유형 (eavluType) 콤보박스 아이템 바인딩
             * 1. 세션유저 정보를 가지고 아이템을 구성한다.
             * 2. 첫번째 아이템으로 선택해준다.
             */
            , _bindEavluTypeItem : function(sOrgCode, sEvaluOperationUnitCode ){
                var oBtnEavluType, aFilters, oUserInfo;

                oBtnEavluType = this.byId("evaluType");
                oUserInfo = this._getUserSession();
                aFilters = [
                    new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                    new Filter("company_code", "EQ", oUserInfo.companyCode),
                    new Filter("evaluation_operation_unit_code", "EQ", sEvaluOperationUnitCode),
                    new Filter("org_code", "EQ", sOrgCode)
                ];

                oBtnEavluType.bindItems({
                    path : "/UserEvalType",
                    filters : aFilters,
                    template : new SegmentedButtonItem({ 
                        text : "{evaluation_type_name}", 
                        key : "{evaluation_type_code}"
                    })
                });

                this.getOwnerComponent().getModel().read("/UserEvalType",{
                    filters : aFilters,
                    urlParameters : {
                        $top : 1
                    },
                    success : function(oData){
                        var aResults, sEvaluTypeCode;

                        aResults = oData.results;
                        if(!aResults.length){
                            return;
                        }
                        sEvaluTypeCode = aResults[0].evaluation_type_code;

                        oBtnEavluType.setSelectedKey(sEvaluTypeCode);
                    },
                    error : function(){
                        
                    }
                });
            }
            /***
             * 평가조직 (orgCode) 콤보박스 아이템 바인딩
             * 1. 세션유저 정보를 가지고 아이템을 구성한다.
             * 2. 첫번째 아이템으로 선택해준다.
             */
            , _setEvaluExecuteModeItem : function(){
                var oBtnEvaluExecuteMode, aFilters, oUserInfo;

                oBtnEvaluExecuteMode = this.byId("evaluExecuteMode");
                oUserInfo = this._getUserSession();
                aFilters = [
                    new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                    new Filter("group_code", "EQ", "SP_SE_EVAL_ARTICLE_TYPE_CODE")
                ];

                oBtnEvaluExecuteMode.destroyItems();
                this.getOwnerComponent().getModel("common").read("/Code",{
                    filters : aFilters,
                    success : function(oData){
                        var aResults, sOrgCode;

                        aResults = oData.results;
                        oBtnEvaluExecuteMode.addItem(
                            new SegmentedButtonItem({ 
                                text : "All", 
                                key : ""
                            })
                        );
                        if(!aResults.length){
                            return;
                        }
                        aResults.forEach(function(item){
                            oBtnEvaluExecuteMode.addItem(
                                new SegmentedButtonItem({ 
                                    text : item.code_name, 
                                    key : item.sort_no
                                })
                            );
                        });
                        oBtnEvaluExecuteMode.setSelectedKey("");
                    }.bind(this),
                    error : function(){
                        
                    }
                });
            }
            /***
             * 신규 생성 이벤트
             * @param oEvent - 이벤트 객체
             * @param sBtnGubun - 버튼 구분자
             */
            , onPressCreate : function(oEvent, sBtnGubun){
                var oNavParam;

                oNavParam = {};
                oNavParam.new = "Y";

                if(sBtnGubun === "SameLevel"){
                    oNavParam.level = "same";
                }else if(sBtnGubun === "LowLevel"){
                    oNavParam.level = "low";
                }
                //leaf
                this.getOwnerComponent().getRouter().navTo("Detail", oNavParam);
            }
//             _filterSearch: function(e){
//                 this._selectArrayClear();
//                 var filter_category_code;
//                 var filter_category_name;
//                 var filter_create_date;

//                 this._expande = undefined; //toggleOpen 초기화
//                 filter_category_code = this.getView().byId("filterCategoryCode").getValue();
//                 filter_category_name = this.getView().byId("filterCategoryName").getValue();
//                 filter_create_date = this.getView().byId("filterCreateDate").getValue();

//                 var tab = this.getView().byId("treeTable");
//                 this.getView().getModel().refresh();
//                 var oBinding = tab.getBinding("rows");
//                 var oFilters = [];
//                 var pOfilters = [];

//                 resultFilters = [];
                
//                 initModel = [];
//                 var rowCount = 0;
//                 var parentRowCount = 0;
                
//                 //2020/12/19 - 2020/12/21
//                 if(filter_create_date.length > 0){
//                     var a = filter_create_date.replaceAll(" ", "");
//                     var fromDate = new Date( a.substring(0, 10) );
//                     var toDate = new Date( a.substring(11, 22) );

//                     var inputDate = toDate.getDate();
//                     toDate.setDate(inputDate + 1);

//                     oFilters.push(new Filter("system_create_dtm", FilterOperator.BT, fromDate, toDate));
//                 }
                
//                 oFilters.push(new Filter("category_code", "Contains", filter_category_code));
//                 oFilters.push(new Filter("category_name", "Contains", filter_category_name));

//                 
//                 var read0 = this._read("/evaluationItemMngtHierarchyStructureView", oFilters);
//                 read0.then(function(data){
//                     var reArray = data.results;
//                     for(var i=0; i<reArray.length; i++ ){
//                         var row = reArray[i];
//                         initModel.push(row);
//                         if(row.hierarchy_level == 0){
//                             resultFilters.push(new Filter("category_code", "EQ", row.category_code));
//                             // parentRowCount = parentRowCount + 1;
//                         }else{
//                             resultFilters.push(new Filter("category_code", "EQ", row.category_code));
//                             resultFilters.push(new Filter("category_code", "EQ", row.parent_category_code));
//                         }
//                     }
//                     rowCount = reArray.length;

//                     if(reArray.length == 0){
//                         // alert("Data가 없습니다.");
//                         // return;
//                         resultFilters.push(new Filter("category_code", "EQ", ""));
//                     }
                    
//                     oBinding.filter( resultFilters , sap.ui.model.FilterType.Application); 
//                     tab.collapseAll();
//                     this._oScr.setData({"screen" : "M"});
//                 });

//                 this.getView().byId("treeTable").getBinding("rows").attachDataReceived(function(data, aa){
//                     firstRowCount = 0;
//                     var secondRowCount = 0;
//                     for(var i=0; i<data.mParameters.data.results.length; i++){
//                         var oRow = data.mParameters.data.results[i];
//                         for(var j=0; j<initModel.length; j++){
//                             var initRow = initModel[j];
//                             if(initRow.node_id == oRow.node_id){
//                                 break;
//                             }
//                             if(initModel.length == j + 1){
//                                 initModel.push(oRow);
//                             }
//                         }
//                     }
                    
//                     if(this._expande == true || this._expande == false){
//                         return;
//                     }else{
//                         var resultCount = data.mParameters.data.results.length;
//                     }

//                 }.bind(this));
//             },
//             filterSearch: function(e) {

//                 //기존
//                 this._oScr = this.getView().getModel("sm");
//                 var oFCL = this.getView().getParent().getParent();
//                 this._oScr.setData({"screen" : "M"});
//                 oFCL.setLayout();
//                 this._selectArrayClear();
//                 var filter_category_code;
//                 var filter_category_name;
//                 var filter_create_date;

//                 this._expande = undefined; //toggleOpen 초기화
//                 if(e == "R"){
//                     filter_category_code = this.getView().byId("filterCategoryCode").getValue();
//                     filter_category_name = this.getView().byId("filterCategoryName").getValue();
//                     filter_create_date = this.getView().byId("filterCreateDate").getValue();
//                 }else{
//                     filter_category_code = e.getParameters()[0].selectionSet[0].getValue();
//                     filter_category_name = e.getParameters()[0].selectionSet[1].getValue();
//                     filter_create_date = e.getParameters()[0].selectionSet[2].getValue();
//                 }

//                 var tab = this.getView().byId("treeTable");
//                 this.getView().getModel().refresh();
//                 var oBinding = tab.getBinding("rows");
//                 var oFilters = [];
//                 var pOfilters = [];

//                 resultFilters = [];
                
//                 initModel = [];
//                 var rowCount = 0;
//                 var parentRowCount = 0;
                
//                 //2020/12/19 - 2020/12/21
//                 if(filter_create_date.length > 0){

//                     this.byId("smartFilterBar").getControlByKey("system_create_dtm").getFrom().setHours("09","00","00","00");  
//                     this.byId("smartFilterBar").getControlByKey("system_create_dtm").getTo().setHours("09","00","00","00");  

//                     var fromDate = this.byId("smartFilterBar").getControlByKey("system_create_dtm").getFrom();  
//                     var toDate = this.byId("smartFilterBar").getControlByKey("system_create_dtm").getTo();


//                     oFilters.push(new Filter("system_create_dtm", FilterOperator.BT, fromDate, toDate));
//                 }
                
//                 oFilters.push(new Filter("category_code", "Contains", filter_category_code));
//                 oFilters.push(new Filter("category_name", "Contains", filter_category_name));

//                 
//                 var read0 = this._read("/evaluationItemMngtHierarchyStructureView", oFilters);
//                 read0.then(function(data){
//                     var reArray = data.results;
//                     for(var i=0; i<reArray.length; i++ ){
//                         var row = reArray[i];
//                         initModel.push(row);
//                         if(row.hierarchy_level == 0){
//                             resultFilters.push(new Filter("category_code", "EQ", row.category_code));
//                             // parentRowCount = parentRowCount + 1;
//                         }else{
//                             resultFilters.push(new Filter("category_code", "EQ", row.category_code));
//                             resultFilters.push(new Filter("category_code", "EQ", row.parent_category_code));
//                         }
//                     }
//                     rowCount = reArray.length;

//                     if(reArray.length == 0){
//                         resultFilters.push(new Filter("category_code", "EQ", ""));
//                     }
                    
//                     oBinding.filter( resultFilters , sap.ui.model.FilterType.Application); 
//                     tab.collapseAll();
//                 });

//                 this.getView().byId("treeTable").getBinding("rows").attachDataReceived(function(data, aa){
//                     firstRowCount = 0;
//                     var secondRowCount = 0;
//                     for(var i=0; i<data.mParameters.data.results.length; i++){
//                         var oRow = data.mParameters.data.results[i];
//                         for(var j=0; j<initModel.length; j++){
//                             var initRow = initModel[j];
//                             if(initRow.node_id == oRow.node_id){
//                                 break;
//                             }
//                             if(initModel.length == j + 1){
//                                 initModel.push(oRow);
//                             }
//                         }
//                     }
                    
//                     if(this._expande == true || this._expande == false){
//                         return;
//                     }else{
//                         var resultCount = data.mParameters.data.results.length;
//                     }

//                 }.bind(this));



//             },
//             onMainTableexpandAll: function(e) {
//                 var table = this.getView().byId("treeTable");
//                 table.expandToLevel(1);
//             },
//             onMainTablecollapseAll: function(e){
//                 this.getView().byId("treeTable").collapseAll();
//             },
//             _getScreenFlagModel: function(){
//                 this._oScr = this.getView().getModel("sm");
//                 if(this._oScr != undefined){
//                     this._screenFlag = this._oScr.oData.screen;
//                 }
//             },
//             onMainTableCreate0ButtonPress: function() {
//                 var oFCL = this.getView().getParent().getParent();
//                 if (oFCL.getLayout() === "TwoColumnsBeginExpanded") {
//                     oFCL.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
//                 } else {
//                     oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
//                 }
//                 this._setNav(" ", " ", "Yes", "0", " ", " ", " ");
//             },
//             liveCategoryCode: function(e){

//                 // 대문자만 사용
//                 var inputCode = this.getView().byId("filterCategoryCode");

//                 inputCode.setValue(inputCode.getValue().toUpperCase());
//             },
//             onMainTableCreate1ButtonPress: function() {
//                 var oFCL = this.getView().getParent().getParent();
//                 // @ts-ignore
//                 if (oFCL.getLayout() === "TwoColumnsBeginExpanded") {
//                     // @ts-ignore
//                     oFCL.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
//                 } else {
//                     // @ts-ignore
//                     oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
//                 }
//                 var oTreeTable = this.getView().byId("treeTable");
//                 // @ts-ignore
//                 var oPath = selectArray[0];
//                 var item = this.getView().getModel().getProperty(oPath);
                
//                 this._setNav(item.category_code, " ", "Yes", "1", item.category_code, item.node_id, item.node_id );
//             },
            , treeTableCellClick: function(e){

                var index = e.getParameters().rowIndex;
                if(index <16){
                    if(this.getView().byId("treeTable").getRows()[index].getCells()[0].getText().length == 0 ){
                        return;
                    }
                }
                oMaster = this.getView().getModel("master");
                this._sPath = e.getParameters().rowBindingContext.sPath;
                var item = this.getView().getModel().getProperty(this._sPath);
                var pa_cate = item.parent_category_code;
                if (pa_cate == null){
                    pa_cate = " ";
                }
                var level = item.hierarchy_level;

                if(item.hierarchy_level == 0){
                    item.parent_node_id = " ";
                }


                var oTab =  this.getView().byId("treeTable");
                var that = this;
                this._getScreenFlagModel();
                var selectedRowInfo = this.getView().byId("treeTable").getRows()[index];
                // 수정 작업일 때
                if(this._screenFlag == "U" ){
                    MessageBox.confirm(textModel.getText("/NCM00006"), {
                        async : true,
                        title : textModel.getText("/CONFIRM"),//that.getModel("I18N").getText("/SAVE"),
                        initialFocus : sap.m.MessageBox.Action.CANCEL,
                        onClose : function(sButton) {
                            if (sButton === MessageBox.Action.OK) {
                                var selectedRowInfo = oTab.getRows()[index];
                                that._oScr.setData({"screen" : "M"});
                                that._setNav(item.category_code, " ", item.use_flag, "S", pa_cate, item.node_id, item.parent_node_id);
                            }else{
                                return;
                            }   
                        }
                    });
                }else{ // 그외
                    this._oScr.setData({"screen" : "S"});
                    oMaster.setData({"level": level,  "indices": 0});
                    this._setNav(item.category_code, " ",item.use_flag, "S", pa_cate, item.node_id, item.parent_node_id);
                }
                
            },
//             _selectArrayClear: function(){
                
//                 oMaster = this.getView().getModel("master");
//                 if(oMaster == undefined){
//                     return;
//                 }
//                 this.getView().byId("treeTable").clearSelection();
//                 selectArray=[];
                
//                 oMaster.setData({"level":2, "indices": 0});

//             },
//             _setNav: function( p_cate, p_name, p_use, lflag, pa_cate, node_id, p_node_id ) {

//                 // this._selectArrayClear();
//                 var oFCL = this.getView().getParent().getParent();
//                 if (oFCL.getLayout() === "TwoColumnsBeginExpanded") {
//                     oFCL.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
//                 } else {
//                     oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
//                 }
                
//                 var aa = { "tenant_id" : "L2100",
//                             "company_code" : "*",
//                             "org_code" : "BIZ00100",
//                             "org_type_code" : "BU",
//                             "category_code" : p_cate,
//                             "category_name" : p_name,
//                             "use_flag" : p_use,
//                             "lflag" : lflag
//                 }
                

//                 this.getOwnerComponent().getRouter().navTo("Detail", {
//                     tenant_id: aa.tenant_id,
//                     company_code: aa.company_code,
//                     org_code: aa.org_code,
//                     org_type_code: aa.org_type_code,
//                     category_code: aa.category_code,
//                     category_name: aa.category_name,
//                     use_flag: aa.use_flag,
//                     lflag: aa.lflag,
//                     p_category_code: pa_cate,
//                     node_id : node_id,
//                     p_node_id : p_node_id
//                 });

//             },						
//             _read: function(sPath, filter){						
//                 sPath = String(sPath);						
//                 var promise = jQuery.Deferred();						
//                 var oModel = this.getView().getModel();						
                        
//                 oModel.read(sPath, {	
//                     filters: filter,
//                     method: "GET",						
//                     async: false,						
//                     success: function(data){						
//                         promise.resolve(data);						
//                     }.bind(this),						
//                     error: function(data){						
//                         promise.reject(data);
//                     }						
                        
//                 });						
//                 return promise;						
//             },
//             sort: function(e){
//             },
//             _dataReceived: function(data){

//             },
//             firstVisibleRowChanged: function(e){
//             },
//             onMainTableDeleteButtonPress: function() {
                
//                 var oTreeTable = this.getView().byId("treeTable"); 
//                 // @ts-ignore
//                 var otreeIndices = oTreeTable.getSelectedIndices();
//                 var oModel = this.getView().getModel();
//                 var oFilters = [];  //부모 노드 검색용
//                 var oFiltersMetaCode = [];  // MIMaterialCodeList 조회용
//                 var oArrayHiePath = []; // evaluationItemMngtHierarchyStructure 삭제 경로
//                 var that = this;
                
//                 MessageBox.confirm(textModel.getText("/NCM00003"), {
                    
//                     // @ts-ignore
//                     title : "확인",//that.getModel("I18N").getText("/SAVE"),
//                     initialFocus : sap.m.MessageBox.Action.CANCEL,
//                     onClose : function(sButton) {
//                         if (sButton === MessageBox.Action.OK) {
//                              //MiMetarialCode 조회( 사용 중인지 확인 )
//                             for(var i=0; i<selectArray.length; i++){
//                                 var selectStr = selectArray[i];
//                                 var oItem = this.getView().getModel().getProperty(selectStr);
//                                 var oFilter1 = new sap.ui.model.Filter("category_code", sap.ui.model.FilterOperator.EQ, oItem.category_code);
//                                 if(oItem.hierarchy_level==0){
//                                     var oFilter2 = new sap.ui.model.Filter("parent_category_code", sap.ui.model.FilterOperator.EQ, oItem.category_code);
//                                     oFilters.push(new sap.ui.model.Filter({filters:[oFilter1, oFilter2], bAnd:false}));
//                                 }else{
//                                     oFilters.push(new sap.ui.model.Filter({filters:[oFilter1], bAnd:false}));
//                                 }
                                
//                             }
//                             var filters = [];
//                             filters.push(new Filter(oFilters,false));
                            
//                             //부모 노드 검색
//                             var read0 = this._read("/evaluationItemMngtHierarchyStructure", filters );
//                             read0.then(function(data) {
//                                 var oFilters0 = [];
//                                 for( var i=0; i<data.results.length; i++){
//                                     var getdata = data.results[i];
//                                     oFilters0.push(new sap.ui.model.Filter("category_code", sap.ui.model.FilterOperator.EQ, getdata.category_code));
//                                     // oFiltersMetaCode.push(new sap.ui.model.Filter("category_code", sap.ui.model.FilterOperator.EQ, getdata.category_code));
//                                     var gdata = String(getdata.__metadata.uri);
//                                     var pathIndex = gdata.search("/evaluationItemMngtHierarchyStructure");
//                                     var dpath = gdata.substring(pathIndex);
//                                     oArrayHiePath.push(dpath);
//                                 oFiltersMetaCode.push(new sap.ui.model.Filter({filters:oFilters0, bAnd:false}));

//                                 // MIMaterialCodeList에서 category_code 사용 중인지 확인
//                                 var read1 = that._read("/MIMaterialCode", oFiltersMetaCode);
//                                 read1.then(function(data) {
//                                     if(data.results.length >0){
//                                         sap.m.MessageToast.show(textModel.getText("/NPG00017"));
//                                         return;
//                                     }else{
                                        
//                                     }
                                    
//                                     var read2 = that._read("/evaluationItemMngtText", oFiltersMetaCode);
//                                     read2.then(function(data) {


//                                         for(var i=0; i<oArrayHiePath.length; i++){
//                                             oModel.remove(oArrayHiePath[i], {"groupId":"deleteId"});
//                                         }
//                                         for(var i=0; i<data.results.length; i++){
//                                             var getdata = data.results[i];
//                                             var gdata = String(getdata.__metadata.uri);
//                                             var pathIndex = gdata.search("/evaluationItemMngtText");
//                                             var dpath = gdata.substring(pathIndex);
//                                             oModel.remove(dpath, {"groupId":"deleteId"});
//                                         }
//                                         // var rowCount = that.getView().byId("treeTable").getBinding().getLength();
                                        
//                                         oModel.setUseBatch(true);
//                                         oModel.submitChanges({
//                                             async: false,
//                                             groupId: "deleteId",
//                                             // groupId:"batchUpdateGroup",
//                                             success: function (oData, oResponse) {
//                                                 sap.m.MessageToast.show(textModel.getText("/NCM01002"));
                                                
//                                                 oMaster.setData({"level":0, "indices": 0});
                                                
//                                                 oModel.refresh();

//                                                 that.onAfterRendering("D");
//                                             },
//                                             error: function (cc, vv) {
//                                                 sap.m.MessageToast.show("Save failed! evaluationItemMngtHierarchyStructure");

//                                                 return;
//                                             }
//                                         });
//                                     });
//                                 });	
                                
//                             });	
//                         }
//                     }.bind(this)
//                 });
//             },
//             _message: function() {
//                 var result = jQuery.Deferred();
//                 MessageBox.confirm(textModel.getText("/NCM00006"), {
//                         async : false,
//                         title : textModel.getText("CONFIRM"),//that.getModel("I18N").getText("/SAVE"),
//                         initialFocus : sap.m.MessageBox.Action.CANCEL,
//                         onClose : function(sButton) {
//                             if (sButton === MessageBox.Action.OK) {
//                                 result.resolve(true);
                                
//                             }else{
//                                 result.resolve(false);
//                             }  
                            
//                         }
//                     });
//                 return result.promise();
//             },
//             onPageSearchButtonPress: function() { 
                
//                 //비동기 message
//                 $.when(this._message()).then(function(data){
                    
//                 });



                
//                  // @ts-ignore
//                 var filterValue = this.getView().byId("searchCategoryCode").getValue();
                
//                 var oTreeTable = this.getView().byId("treeTable");
//                 var oBinding = oTreeTable.getBinding("rows");
//                 // var filterArray = [];

//                 // @ts-ignore
//                 var oFilter1 = new sap.ui.model.Filter("filter_category_code", sap.ui.model.FilterOperator.Contains, filterValue);
                
//                 // @ts-ignore
//                 oBinding.filter([oFilter1], sap.ui.model.FilterType.Application);




//             },
//             treeTableSelection: function(e) {
//                 oMaster = this.getView().getModel("master");
//                 var tab = this.getView().byId("treeTable");
//                 if(e.mParameters.rowIndex == -1){return};

//                 var buttonC0 = this.getView().byId("mainTableCreate0Button");
//                 var buttonC1 = this.getView().byId("mainTableCreate1Button");
//                 var buttonD = this.getView().byId("mainTableDeleteButton");
//                 var rowInd = this.getView().byId("treeTable").getSelectedIndices().length;
//                 var index = this.getView().byId("treeTable").getSelectedIndices()[0];
                
//                 var indices = this.getView().byId("treeTable").getSelectedIndices();

//                 var selectPath = e.getParameters().rowContext.sPath;
//                 var selectFlag = false;

//                 if(rowInd == 0 ){
//                     selectArray = [];
//                 }else{
//                     var dIndex = 0;
//                     for(var i=0; i<selectArray.length; i++){
//                         if(selectArray[i] == selectPath ){
//                             selectFlag = true;
//                             dIndex = i;
//                             break;
//                         }
//                     }
//                     if(selectFlag == true){
//                         selectArray.splice(dIndex, 1);
//                         selectFlag = false;
//                     }else{
//                         selectArray.push(e.getParameters().rowContext.sPath); 
//                     }
//                 }
//                 var that = this;
                
//                 if(rowInd == 1){
                    
//                     var rowPath = selectArray[0];

//                     var level = this.getView().getModel().getObject(rowPath).hierarchy_level;
//                     if(level == 0){
//                         this._cPath = rowPath;
//                     }
//                 }else{
//                     level = 0;
//                 }
//                 this._getScreenFlagModel();
//                 var oFCL = this.getView().getParent().getParent();
                
//                 oMaster.setData({"level":level, "indices": selectArray.length});
//             }
		});
	});
