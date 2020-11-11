sap.ui.define([
		// "sap/ui/core/mvc/Controller",
        "cm/countryMgr/controller/BaseController",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/m/MessageStrip",
        "sap/ui/core/format/DateFormat",
        "sap/ui/thirdparty/jquery",         
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/FilterType",
        "sap/ui/model/Sorter",
        "sap/ui/model/json/JSONModel"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, MessageBox, MessageToast, MessageStrip, DateFormat, jquery, Filter, FilterOperator, FilterType, Sorter, JSONModel) {
		"use strict";

		return Controller.extend("cm.countryMgr.controller.countryMgr", {
            
            _setMessage : function() {
                console.group("_setMessage");
                this.errorCheckChangeMainRow = "메인 테이블에서 항목을 선택해주세요.";
                this.errorHasUIChangesSave = "상세 테이블에서 저장하지 않은 변경 내용이 있습니다. [취소] 또는 상세 [저장] 이후 항목 을 선택할수 있습니다.";
                this.errorIsHasUIChangesCancelSave = "저장되지 않은 수정 작업이 모두 취소 됩니다.";
                this.confirmCancelSave = "저장되지 않은 수정 작업이 모두 취소 됩니다.";
                this.confirmCancelTitle = "취소 확인";
                this.sucessCancel = "취소가 성공 하였습니다.";
                this.errorSubHasUIChangeCreateRow = "상세 테이블에서 저장하지 않은 변경 내용이 있습니다. 변경 내용을 저장후 행추가 가능합니다.";
                this.errorUIChangeCopyRow = "상세 테이블에서 저장하지 않은 변경 내용이 있습니다. 변경 내용을 저장후 행복사 가능합니다."
                this.errorCheckChangeCopyRow = "행복사는 선택 항목이 하나여야 합니다.";
                this.errorCheckChangeCopyRowTitle = "항목 선택 오류";
                this.errorDeleteRowChooice = "삭제할 항목을 선택해야 합니다.";
                this.confirmAllDeleteRow = "선택된 항목을 삭제 하시 겠습니까? 하위 등록된 데이타도 같이 삭제 됩니다.";
                this.confirmDeleteRow = "선택된 항목을 삭제 하시 겠습니까?";
                this.confirmDeleteRowTitle = "삭제 확인";
                this.sucessDelete = "삭제가 성공 하였습니다.";
                this.sucessSave = "저장이 성공 하였습니다.";
                this.noChangeContent = "수정한 내용이 없습니다.";
                this.confirmSave = "저장 하시 겠습니까?";
                this.confirmSaveTitle = "저장 확인";                
                console.groupEnd();
            },
            
            onInit: function () {
                console.group("onInit");

                 //message 를 정의. 
                this._setMessage();

                this._retrieveParam = new JSONModel({
                    mstParam : "",
                    dtlParam : "",
                    lngParam : ""
                });      

                this._createView();          

                console.groupEnd();

            },
           
             /**
             * @private
             * @see view에서 사용할 객체를 생성합니다.
             */
            _createView : function() {
                console.group("_createView");

                var oView = this.getView();

                // var oUiModel = new JSONModel({ 
                //             filterCommonID : "",
                //             filterValue : "",
                //             hasUIChanges : false,  
                //             bSearch : false,
                //             bNewRow : true,
                //             bOldRow : false,
                //             bAdd : true,
                //             bDelete : false,                                                    
                //             bCopy : false,
                //             bSave : true,
                //             bSelect : false,
                //             bCheck : false,
                //             subListCount : 0,
                //             bSubCheck : false,
                //             bSubListTrue : false,
                //             bEvent : "",

                // });     
                
                //선택값과 필수값을 저장 및 체크 합니다. 
                var oMainModel = new JSONModel({ 
                            data : [],
                            selectrow : [],
                            // country_codeEmpty : true, 
                            // control_option_nameEmpty : true
                });  

                // var oSubModel = new JSONModel({ 
                //             data : [],
                //             selectrow : [],
                //             // country_codeEdit : true,
                //             // country_nameEdit : true
                // });                    

                // this.setModel(oUiModel, "ui");     
                this.setModel(oMainModel, "mainModel");
                // this.setModel(oSubModel, "subModel");
 
                console.groupEnd();
            },


			onSearch: function () {

                var filters = [];  
                var filters2 = [];        
                var search_language_code = "", // 대표언어
                    search_date_type = "",  // 날짜형식
                    search_number_type = "",   // 숫자형식
                    search_sub_country_code = "";   // 숫자형식


                var search_country_code = this.getView().byId("search_country_code").getValue(),
                    search_country_name = this.getView().byId("search_country_name").getValue(),
                    search_iso_code = this.getView().byId("search_iso_code").getValue();


                // 필터 추가 
                // if(this.byId("search_language_code").getSelectedItem()){
                //     search_language_code = this.byId("search_language_code").getSelectedItem().getKey();
                // }

                // if(this.byId("search_date_type").getSelectedItem()){
                //     search_date_type = this.byId("search_date_type").getSelectedItem().getKey();
                // }

                // if(this.byId("search_number_type").getSelectedItem()){
                //     search_number_type = this.byId("search_number_type").getSelectedItem().getKey();
                // }



                if(!this.isValNull(search_country_code)){
                    filters.push(new Filter("country_code", FilterOperator.Contains, search_country_code));
                }

                // if(!this.isValNull(search_country_name)){
                //     filters.push(new Filter("date_format_code", FilterOperator.Contains, search_country_name));
                // }

                if(!this.isValNull(search_iso_code)){


                    filters.push(new Filter("iso_code", FilterOperator.Contains, search_iso_code));
                }

                // if(!this.isValNull(search_language_code)){
                //     filters.push(new Filter("language_code", FilterOperator.Contains, search_language_code));
                // }

                // if(!this.isValNull(search_date_type)){
                //     filters.push(new Filter("date_format_code", FilterOperator.Contains, search_date_type));
                // }

                // if(!this.isValNull(search_number_type)){
                //     filters.push(new Filter("number_format_code", FilterOperator.Contains, search_number_type));
                // }

                var mstBinding = this.byId("mainList").getBinding("rows");
                var subBinding = this.byId("subList").getBinding("rows");
                mstBinding.resetChanges();
                subBinding.resetChanges();
                // this._retrieveParam.mstParam = "";
                // this._retrieveParam.dtlParam = "";
                // this._retrieveParam.lngParam = "";

                this.getView().setBusy(true);
                mstBinding.filter(filters);
                this.getView().setBusy(false);

            },


            /**
             *  mainList row select event
             * @public
             * @param {*} oEvent 
             */
            onCellClick : function (oEvent) {       
                console.group("onCellClick");
                    //search_country_name = this.getView().byId("search_country_name").getValue(),
                // console.log(oEvent.getSource());
                // var oMainList = this.byId("mainList"),
                //         oRow = oMainList.getRows(),
                //         idx = oEvent.getParameter("rowIndex");
                // var v_searchCond = { //rows[idx].getRowBindingContext().getValue("tenant_id"
                //     country_code : oEvent.getSource().getBindingContext().getValue('country_code')
                //     // tenant_id : oRow[idx].getCells()[0].mProperties.value
                //     //oRow[idx].getRowBindingContext().getValue('tenant_id')
                // };
                // this._onSubListBinding(v_searchCond);
                var oMainModel = this.getView().getModel("mainModel"),
                    oUiModel = this.getView().getModel("ui"), 
                    oView = this.getView(),
                    oSubList = this.byId("subList");

                var oBinding = oSubList.getBinding("rows");
                if (oBinding.hasPendingChanges()) {
                    //MessageToast.show(this.errorHasUIChangesSave);
                    this._showMsgStrip("e", this.errorHasUIChangesSave);
                    return;
                }
                                
                var rowIndex = oEvent.getParameter("rowIndex"),
                    oTable = this.byId("mainList");         

                console.log("Indices: " + oTable.getSelectedIndices());

                var rowsBinding = this.byId("mainList").getBinding("rows"),
                    rows = oTable.getRows();

                console.log("rowIndex",rowIndex);

                //기존 선택된 값을 초기화 한다. 
                oMainModel.setProperty("/data","");
                oMainModel.setProperty("/selectrow","");
                            
                oUiModel.setProperty("/bSelect", rowIndex>-1 ? true : false);
                //oUiModel.setProperty("/bSubSelected", false);
               
                var oCheckRow = new JSONModel({ 
                            tenant_id : "",
                            country_code : "",
                            language_code : ""
                });  
                
                oCheckRow.tenant_id = rows[rowIndex].getCells()[0].mProperties.value;
                oCheckRow.country_code = rows[rowIndex].getCells()[1].mProperties.value;
                oCheckRow.language_code = rows[rowIndex].getCells()[4].mProperties.value;
                
                oMainModel.setProperty("/selectrow", oCheckRow);                 
                
                //array에 저장한후 벨류 체크가 필요할시 진행한다.
                oMainModel.setProperty("/data", oCheckRow);

                //mainList 에서 선택된 상태를 넣어준다. 
                
                //oUiModel.setProperty
                console.group("selectRow");
                console.dir(oMainModel.getProperty("/selectrow"));
                console.groupEnd();   

                this._onSubListBinding(rowIndex);  

                this._setButtonState();

                console.groupEnd();        
            },


            /**
             * subList 테이블 아이템을 바인딩 한다. 
             * @private
             * @param {*} oMainListContext rowIndex
             */
            _onSubListBinding : function (p_searchCond){//rowIndex
                console.group("_onSubListBinding");

                var v_tenant_id = p_searchCond.tenant_id;
                var v_country_code = p_searchCond.country_code;  
                var v_language_code = p_searchCond.language_code;               
                
                var filters = [];
                filters.push(new Filter("tenant_id"   , FilterOperator.EQ, v_tenant_id));
                filters.push(new Filter("country_code", FilterOperator.EQ, v_country_code));  
                filters.push(new Filter("language_code", FilterOperator.EQ, v_language_code));                  

                var dtlBinding = this.byId("subList").getBinding("rows");
                dtlBinding.resetChanges();
                //체크박스 클리어를 위해
                var oTable = this.byId("subList");
                oTable.removeSelections(true);
                this.getView().setBusy(true);
                dtlBinding.filter(filters);
                this.getView().setBusy(false);


                // var oMainModel = this.getModel("mainModel"),
                //     oView = this.getView(),
                //     oSubList = this.byId("subList");                

                // var oSelectRow = oMainModel.getProperty("/selectrow");
                // console.log("oSelectRow.tenant_id", oSelectRow.tenant_id);
                // console.log("oSelectRow.country_code", oSelectRow.country_code);
                // console.log("oSelectRow.language_code", oSelectRow.language_code);
                    
                // //sub model filter
                // var oFilter1 = new Filter("tenant_id", FilterOperator.EQ, oSelectRow.tenant_id),   
                //     oFilter2 = new Filter("country_code", FilterOperator.EQ, oSelectRow.country_code),   
                //     oFilter3 = new Filter("language_code", FilterOperator.EQ, oSelectRow.language_code);                                   

                // var oBinding = oSubList.getBinding("rows");

                //     oBinding.filter([                
                //         oFilter1,
                //         oFilter2,
                //         oFilter3
                //     ]);

                console.groupEnd();
            },  
   
           
            /**
             * @private
             * @see View 에 있는 버튼 상태 컨트롤 각종 액션 처리 상태에 따라 활성화와 비활성화 상태값을 설정.
             */
            _setButtonState : function (){                
                console.group("_setButtonState");
                var oUiModel = this.getModel("ui"),
                    oTable= this.getView().byId("mainList"); 
                /**
                 * 1. 메인 리스트 행추가 버튼은 처음 검색결과과 출력된후 활성화 된다.
                 * 2. 메인 리스트 행복사 버튼은 선택한 로우가 하나 일때 활성화 된다.
                 * 3. 메인 리스트 삭제 버튼은 선택한 로우가 하나 이상일때 활성화 된다.
                 * 4. 메인 리스트 저장 버튼은 검색결과가 활성화 될때 동시 활성화 된다. 
                 */
                
                 //선택된 row들 idx[]
                var indices = oTable.getSelectedIndices()
                console.log("table rowindices", indices);    

                /*
                상태 테그로 모두 관리 한다. 
                검색을 실행하여 리스트가 바인딩 된 상태
                리스트 항목을 선택한 상태
                리스트 항목을 체크한 상태
                리스트 항목을 선택도 하고 체크도 한 상태 
                */
                var bSelect = oUiModel.getProperty("/bSubListTrue"),
                    bSearch =  oUiModel.getProperty("/bSearch"); //검색출력상태
                
                //row를 선택한 상태
                if(bSearch==true){
                    oUiModel.setProperty("/bAdd", true); 
                    oUiModel.setProperty("/bSave", true);
                }

                if(oUiModel.getProperty("/bCheck")){
                    //검색 출력이 있는 상태에서 체크를 선택한 상태 
                    if( indices.length > 0 ) {
                        oUiModel.setProperty("/bAdd", true); 
                        oUiModel.setProperty("/bCopy", true); 
                        oUiModel.setProperty("/bDelete", true);
                        oUiModel.setProperty("/bModify", true); 
                        
                        //체크한 Row수 체크 
                        if(indices.length>1){
                            oUiModel.setProperty("/bCopy", false); 
                            oUiModel.setProperty("/bModify", false); 
                        } 
                
                    }else{//검색 출력 있지만 체크 선택 안함
                        oUiModel.setProperty("/bCopy", false); 
                        oUiModel.setProperty("/bDelete", false);
                        oUiModel.setProperty("/bModify", false); 
                    } 
                }else{//검색 출력상태 아님
                    if(!oUiModel.getProperty("/bSubListTrue")){
                        oUiModel.setProperty("/bSubCheck", false); 
                    } else {
                        //subList 상태 체크 
                        indices = this.getView().byId("subList").getSelectedIndices().length;

                        console.log("sublist indices length" , indices);
                        if( indices > 0 ) {
                            oUiModel.setProperty("/bSubCheck", true); 
                        } else {
                            oUiModel.setProperty("/bSubCheck", false);
                        }
                    }
                }

                console.groupEnd();
            },

            /**
             * table 행추가, 신규 Row
             * @public
             * @param {mainlist, sublist} tableType 
             */
            onCreateRow : function (tableType) {
                console.group("onCreate");   

                var tableName = tableType,
                    bSub = false, //tableName:Main-false / sub-true
                    oContext;
               
                console.log("tableName: " + tableName);

                if(tableName!="mainList"){ bSub = true; }

                var oUiModel = this.getModel("ui");
                var oTable = this.byId(tableName);
                
                // var dtlVal = this._retrieveParam.dtlParam;
                var oBinding = oTable.getBinding("rows"),
                    today = this._getToday(),
                    utcDate = this._getUtcSapDate(); 

                if(!bSub){
                    if (oBinding.hasPendingChanges()) {
                        this._showMsgStrip("e", this.errorSubHasUIChangeCreateRow);
                        //MessageToast.show(this.errorSubHasUIChangeCreateRow);
                        return;
                    }

                    oContext = oBinding.create({
                        "tenant_id": "",//dtlVal.tenant_id,
                        "country_code": "",//dtlVal.country_code,
                        "iso_code": "",
                        "eu_code": "",
                        "language_code": "",
                        "date_format_code": this._getToday(),
                        "number_format_code": "",
                        "currency_code": "",
                        "local_create_dtm": utcDate,
                        "local_update_dtm": utcDate,
                        "create_user_id": "Admin",
                        "update_user_id": "Admin"
                    });

                }else{          
                    //사용자가 행을 추가 했음을 알려준다. 
                    // this._setUIChanges(null, false);
                    console.log("test1");
                    var oMainList = this.byId("mainList"),
                        oRow = oMainList.getRows(),
                        oView = this.getView(),
                        oSubList = this.byId("subList");  
                    var indices = oMainList.getSelectedIndices(); 

                    console.log("test2");
                    if(indices.length<1){
                        MessageBox.show(this.errorCheckChangeMainRow, {
                            icon: MessageBox.Icon.ERROR,
                            title: this.errorCheckChangeCopyRowTitle,
                            actions: [MessageBox.Action.OK],
                            styleClass: "sapUiSizeCompact"
                        });
                        return;

                    }
                    console.log("test3"); 

                    for (var i = 0; i < indices.length; i++) {
                        var idx = indices[i];     
                        if (oMainList.isIndexSelected(idx)) { 
                    console.log("test4");
                            this.getView().setBusy(true);

                            oContext = oBinding.create({
                                "tenant_id": oRow[idx].getRowBindingContext().getValue("tenant_id"),
                                "country_code": oRow[idx].getRowBindingContext().getValue("country_code"),
                                "language_code": oRow[idx].getRowBindingContext().getValue("language_code"),                    
                                "country_name": "",
                                "description": "",
                                "local_create_dtm": utcDate,
                                "local_update_dtm": utcDate,
                                "create_user_id": "Admin",
                                "update_user_id": "Admin"
                            }); 
                             
                            
                    console.log("test5");
                            oMainList.getContextByIndex(idx);
                            this.getView().setBusy(false);
                        }
                    }  
                }

                // this.getView().setBusy(true);
                oUiModel.setProperty("/bEvent", "AddRow");   

                oContext.created().then(function () {
                    oBinding.refresh();                    
                });

                //focus 이동
                oTable.getRows().some(function (oRows) {
                    if (oRows.getBindingContext() === oContext) {
                        oRows.focus();
                        oRows.setSelected(true);       
                        return true;
                    }
                });
                if(!bSub){
                    this._subListFilter(); 
                }
                // this.getView().setBusy(false);

                this._setButtonState();
                console.groupEnd();
            }, 

                       
            /**             
             * @public
             * @param {mainlist, sublist} tableType 
             */
            onDelete : function (tableType) {
                console.group("onDelete");

                var tableName = tableType,
                    bSub = false; //tableName:Main-false / sub-true

                var oTable = this.byId(tableName),
                  oUiModel = this.getModel("ui"),
                      that = this; 
                 
                var indices = oTable.getSelectedIndices();  
                if(indices.length<1){
                    MessageBox.show(this.errorDeleteRowChooice, {
                        icon: MessageBox.Icon.ERROR,
                        title: this.errorCheckChangeCopyRowTitle,
                        actions: [MessageBox.Action.OK],
                        styleClass: "sapUiSizeCompact"
                    });

                }else{

                    var msg = this.confirmAllDeleteRow;
                   

                    MessageBox.confirm(msg, {
                        title : this.confirmDeleteRowTitle,                        
                        initialFocus : sap.m.MessageBox.Action.CANCEL,
                        onClose : function(sButton) {
                            if (sButton === MessageBox.Action.OK) {
                                //for (var i = 0; i < indices.length; i++) {
                                for (var i = indices.length; i >= 0; i--) {
                                    var idx = indices[i];     
                                    if (oTable.isIndexSelected(idx)) { 
                                        that.getView().setBusy(true);
                                        oTable.getContextByIndex(idx).delete("$auto").then(function () {   
                                            
                                           
                                            that._showMsgStrip("s", that.sucessDelete);
                                        
                                            //MessageToast.show(this.sucessDelete);
                                            
                                            oTable.clearSelection();  
                                        }.bind(this), function (oError) {
                                            MessageBox.error(oError.message);
                                        });
                                        that.getView().setBusy(false);
                                    }
                                }
                            } else if (sButton === MessageBox.Action.CANCEL) {
                                return;
                            };
                        }
                    });                    
                 }
                 console.groupEnd();
            },



            /**
             *행복사 :  리스트 내용중 체크된 항목이 하나일때만 반응 ref :  onChangeRow
             * site_yn, company_yn, role_yn, organization_yn, user_yn 컬럼은 복사하지 않습니다.
             * @public 
             */
            onCopyRow : function (oEvent) {
                console.group("onCopyRow");
                var oTable = this.byId("mainList"),
                    oBinding = oTable.getBinding("rows"),  
                    rows = oTable.getRows(), 
                    indices = oTable.getSelectedIndices(),                    
                    today = this._getToday(),
                    utcDate = this._getUtcSapDate();    

                 var oUiModel = this.getModel("ui");

                console.log("indices", indices);        

                if(indices.length>1){
                    MessageBox.show(this.errorCheckChangeCopyRow, {
                        icon: MessageBox.Icon.ERROR,
                        title: this.errorCheckChangeCopyRowTitle,
                        actions: [MessageBox.Action.OK],
                        styleClass: "sapUiSizeCompact"
                    });
                    return;
                }
                var mainModel = this.getModel("mainModel");

                for (var i = 0; i < indices.length; i++) {
                    var idx = indices[i];     
                    if (oTable.isIndexSelected(idx)) { 
                        this.getView().setBusy(true);
                            
                        var oContext = oBinding.create({
                                "tenant_id": rows[idx].getRowBindingContext().getValue("tenant_id"),
                                "country_code": rows[idx].getRowBindingContext().getValue("country_code"),
                                "iso_code": rows[idx].getRowBindingContext().getValue("iso_code"),
                                "eu_code": rows[idx].getRowBindingContext().getValue("eu_code"),
                                "language_code": rows[idx].getRowBindingContext().getValue("language_code"),
                                "date_format_code": rows[idx].getRowBindingContext().getValue("date_format_code"),
                                "number_format_code": rows[idx].getRowBindingContext().getValue("number_format_code"),
                                "currency_code": rows[idx].getRowBindingContext().getValue("currency_code"),
                                "local_create_dtm": utcDate,
                                "local_update_dtm": utcDate,
                                "create_user_id": "Admin",
                                "update_user_id": "Admin"

                                // "tenant_id": rows[idx].getRowBindingContext().getValue("tenant_id"),
                                // "message_code": rows[idx].getRowBindingContext().getValue("message_code"),
                                // "language_code": rows[idx].getRowBindingContext().getValue("language_code"),
                                // "chain_code": rows[idx].getRowBindingContext().getValue("chain_code"),
                                // "message_type_code": rows[idx].getRowBindingContext().getValue("message_type_code"),
                                // "message_contents": rows[idx].getRowBindingContext().getValue("message_contents"),
                                // "local_create_dtm": "2020-10-13T00:00:00Z",
                                // "local_update_dtm": "2020-10-13T00:00:00Z",
                                // "create_user_id": "Admin",
                                // "update_user_id": "",
                                // "system_create_dtm": "2020-10-13T00:00:00Z",
                                // "system_update_dtm": "2020-10-13T00:00:00Z",
                        });
                        
                        oTable.getContextByIndex(idx);
                        this.getView().setBusy(false);
                    }
                }

                

                oUiModel.setProperty("/bEvent", "AddRow"); 
                
                oTable.clearSelection();

                this.getView().setBusy(true);

                oContext.created().then(function () {
                    oBinding.refresh();
                });

                //focus 이동
                oTable.getRows().some(function (oRows) {
                    if (oRows.getBindingContext() === oContext) {
                        oRows.focus();
                        oRows.setSelected(true);
                        return true;
                    }
                });

                this.getView().setBusy(false);

                console.groupEnd();
            },



            /**
             * @public
             * @param {mainlist, sublist} tableType 
             * @see main 과 sub 테이블의 변경 내용을 저장 합니다. 
             */
            onSave : function (tableType) {
                console.group("onSave");

                var tableName = tableType,
                    bSub = false, //tableName:Main-false / sub-true
                    oUpdateGroupId;

                var oTable = this.byId(tableName);                    
                var mstBinding = oTable.getBinding("rows");

                if(tableName!="mainList"){ bSub = true; }
                if (!mstBinding.hasPendingChanges()) {
                    MessageBox.error("수정한 내용이 없습니다.");
                    return;
                }

                var oView = this.getView();
                var fnSuccess = function () {
                    oView.setBusy(false);
                    MessageToast.show("저장 되었습니다.");
                    this.onMstRefresh(tableName);
                    oView.refresh();
                }.bind(this);

                var fnError = function (oError) {
                    oView.setBusy(false);
                    MessageBox.error(oError.message);
                }.bind(this);

                if(!bSub){
                    oUpdateGroupId = "MainUpdateGroup";
                }else{
                    oUpdateGroupId = "SubUpdateGroup";
                }

                MessageBox.confirm("저장 하시 겠습니까?", {
                    title : "Comfirmation",
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            oView.setBusy(true);
                            oView.getModel().submitBatch(oUpdateGroupId).then(fnSuccess, fnError);
                        } else if (sButton === MessageBox.Action.CANCEL) {
                            
                        };
                    }
                });     

                console.groupEnd();
            },   
            
            
            /**
             * @public
             * @param {mainlist, sublist} tableType 
             */
            onMstRefresh : function (tableType) {
                var tableName = tableType;
                var mstBinding = this.byId(tableName).getBinding("rows");
                this.getView().setBusy(true);
                mstBinding.refresh();
                this.getView().setBusy(false);
            },


            /**                
             * MessageStript 출력
             * type ["Information", "Warning", "Error", "Success"]
             * 약어 i, w, e, s
             *  */    
            _showMsgStrip: function (messageType, message) {
                console.group("onShowMsgStrip");
                
                var oMs = sap.ui.getCore().byId("msgStrip"),
                    msgType = "Information";
                    
                switch(messageType){
                    case "i" : msgType = "Information"; break;
                    case "w" : msgType = "Warning"; break;
                    case "e" : msgType = "Error"; break;
                    case "s" : msgType = "Success"; break;
                    default : msgType = "Information";
                }
                //i, w, e, s                
                //messageType ["Information", "Warning", "Error", "Success"];

                if (oMs) {
                    oMs.destroy();
                }
                this._generateMsgStrip(msgType, message);
                console.groupEnd();
            },

            _generateMsgStrip: function (messageType, message) {
                console.group("_generateMsgStrip");

                //i, w, e, s
                //["Information", "Warning", "Error", "Success"];

                var oVC = this.byId("oVerticalContent"),
                    oMsgStrip = new MessageStrip("msgStrip", {
                        text: message,
                        showCloseButton: true,
                        showIcon: true,
                        type: messageType
                    });

                this.oInvisibleMessage.announce("New Message " + messageType + " " + message, InvisibleMessageMode.Assertive);
                oVC.addContent(oMsgStrip);
                
                console.groupEnd();
            },          

            
            /**
             * today
             * @private
             * @return yyyy-mm-dd
             */
            _getToday : function(){
                var date_ob = new Date();
                var date = ("0" + date_ob.getDate()).slice(-2);
                var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                var year = date_ob.getFullYear();

                console.log(year + "-" + month + "-" + date);
                return year + "-" + month + "-" + date;
            },
            
            /**
             * UTC 기준 DATE를 반환합니다.
             * @private
             * @return "yyyy-MM-dd'T'HH:mm:ss"
             */
            _getUtcSapDate : function(){
                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "yyyy-MM-dd'T'HH:mm"
                });
                
                var oNow = new Date();
                var utcDate = oDateFormat.format(oNow)+":00Z"; 
                console.log("utcDate",utcDate);
                return utcDate;
            }
		});
    });

