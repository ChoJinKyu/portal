sap.ui.define([
        "cm/msgMgr/controller/BaseController",
		"sap/base/Log",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/ui/core/format/DateFormat",        
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/FilterType",
        "sap/ui/model/Sorter",
        "sap/ui/model/json/JSONModel",
        "sap/ui/thirdparty/jquery",
        "sap/m/Token",
        "cm/msgMgr/model/formatter",
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, Log, MessageBox, MessageToast, DateFormat, Filter, FilterOperator, FilterType, Sorter, JSONModel, jquery, Token, formatter) {
		"use strict";

		return Controller.extend("cm.msgMgr.controller.mainView", {
            formatter: formatter,
			
            _setMessage : function() {
                console.group("_setMessage");
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
                this.sUpdate_user_id = "" ;        
                console.groupEnd();
            },

			onInit: function () {

                console.clear();

                 //message 를 정의. 
                this._setMessage();

                this._retrieveParam = new JSONModel({
                    mstParam : "",
                    dtlParam : "",
                    lngParam : ""
                }); 

                this._createView();
                this._bTechnicalErrors = false;
                //this.onSearch();
                console.groupEnd();
            },
           
             /**
             * @private
             * @see view에서 사용할 객체를 생성합니다.
             */
            _createView : function() {
                console.group("_createView");

                var oView = this.getView();

                var oUiModel = new JSONModel({ 
                            filterCommonID : "",
                            filterValue : "",
                            hasUIChanges : false,  
                            bSearch : false,
                            bNewRow : true,
                            bOldRow : false,
                            bAdd : true,
                            bDelete : false,                                                    
                            bCopy : false,
                            bModify : false,
                            bSave : true,
                            bSelect : false,
                            bCheck : false,
                            subListCount : 0,
                            bSubCheck : false,
                            bSubListTrue : false,
                            bEvent : "",

                });     
                
                var oMainModel = new JSONModel({ 
                            data : [],
                            selectrow : []
                });  

                var oSubModel = new JSONModel({ 
                            data : [],
                            selectrow : []
                });                  

                this.setModel(oUiModel, "ui");     
                this.setModel(oMainModel, "mainModel");
 

                console.groupEnd();
            },

            onSearch  : function() {

                var filters = [];

                var search_chain_code = "";
                var search_language_code = "";

                // var search_use_yn = "";


                var search_message_code = this.getView().byId("search_message_code").getValue();
                var search_message_contents = this.getView().byId("search_message_contents").getValue();
                

                if(this.byId("search_chain_code").getSelectedItem()){
                    search_chain_code = this.byId("search_chain_code").getSelectedItem().getKey();
                }

                if(this.byId("search_language_code").getSelectedItem()){
                    search_language_code = this.byId("search_language_code").getSelectedItem().getKey();
                }

                // if(this.byId("search_use_yn").getSelectedItem()){
                //     search_use_yn = this.byId("search_use_yn").getSelectedItem().getKey();
                // }

                // 필터 추가 
                if(!this.isValNull(search_chain_code)){
                    filters.push(new Filter("chain_code", FilterOperator.Contains, search_chain_code));
                }

                if(!this.isValNull(search_language_code)){
                    filters.push(new Filter("language_code", FilterOperator.Contains, search_language_code));
                }

                if(!this.isValNull(search_message_code)){
                    filters.push(new Filter("message_type_code", FilterOperator.Contains, search_message_code));
                }

                if(!this.isValNull(search_message_contents)){
                    filters.push(new Filter("message_contents", FilterOperator.Contains, search_message_contents));
                }

                var oBinding = this.byId("mainList").getBinding("rows"); 

                this.getView().setBusy(true);
                oBinding.filter(filters);
                this.getView().setBusy(false);                
            },

            /**
             * @param {*} oEvent 
             * @see 항목 (mainList 체크박스) 선택시 발생하는 이벤트 
             */
            onCheck : function(oEvent) {
                
                console.group("onCheck");
                var oTable = this.byId("mainList"),
                    oUiModel = this.getModel("ui"),
                    bSubCheck;

                //main과 sub를 구분합니다.      
                if(oEvent.getSource().sId.indexOf("mainList") < 0){
                    oTable = this.byId("subList");                    
                    bSubCheck = true;
                }else{
                    //main에서의 체크 
                    oUiModel.setProperty("/bCheck", true);
                }
                
                var oBinding = oTable.getBinding("rows"),
                    oModel,                      
                    oSelectedRow;
                    
                if(oEvent.getParameter("rowContext")=="undefined") {                  
                    return;
                }

                if(bSubCheck){
                    console.log("subList row change event");
                    oSelectedRow = oEvent.getParameter("rowContext");                    
                    oModel = oSelectedRow.getObject();
                    oUiModel.setProperty("/bSubCheck", bSubCheck);

                }else{
                    console.log("mainList row change event");
                }
                this._setButtonState();
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
                    bSearch =  oUiModel.getProperty("/bSearch"); 
                
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
                
                    }else{
                        oUiModel.setProperty("/bCopy", false); 
                        oUiModel.setProperty("/bDelete", false);
                        oUiModel.setProperty("/bModify", false); 
                    } 
                }else{
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
             * @public
             * @param {*} oEvent 
             * @see table 행추가, 신규 Row
             */
            onCreateRow : function (oEvent) {

                console.group("onCreate");   

                var tableName="mainList",
                    bSub = false,
                    oContext;
                
                console.log("tableName: " + tableName);

                var oUiModel = this.getModel("ui"), 
                    oTable = this.byId(tableName);

                var oBinding = oTable.getBinding("rows"),
                    today = this._getToday(),
                    utcDate = this._getUtcSapDate(); 

                oContext = oBinding.create({
                        "tenant_id": "",
                        "message_code": "",
                        "language_code": "",
                        "chain_code": "CM",
                        "message_type_code": "",
                        "message_contents": "",
                        "local_create_dtm": "2020-10-13T00:00:00Z",
                        "local_update_dtm": "2020-10-13T00:00:00Z",
                        "create_user_id": "Admin",
                        "update_user_id": "",
                        "system_create_dtm": "2020-10-13T00:00:00Z",
                        "system_update_dtm": "2020-10-13T00:00:00Z",
                    });
                    
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
              
                // @ts-ignore
                this._setButtonState();

                console.groupEnd();
            },            
            /**             
             * @public
             * @param {mainlist, sublist} tableType 
             */
            onDelete : function () {
                console.group("onDelete");

                var oTable = this.byId("mainList"),
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
                                for (var i = 0; i < indices.length; i++) {
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
                    that = this,                   
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
                        that.getView().setBusy(true);
                            
                        var oContext = oBinding.create({
                                "tenant_id": rows[idx].getRowBindingContext().getValue("tenant_id"),
                                "message_code": rows[idx].getRowBindingContext().getValue("message_code"),
                                "language_code": rows[idx].getRowBindingContext().getValue("language_code"),
                                "chain_code": rows[idx].getRowBindingContext().getValue("chain_code"),
                                "message_type_code": rows[idx].getRowBindingContext().getValue("message_type_code"),
                                "message_contents": rows[idx].getRowBindingContext().getValue("message_contents"),
                                "local_create_dtm": "2020-10-13T00:00:00Z",
                                "local_update_dtm": "2020-10-13T00:00:00Z",
                                "create_user_id": "Admin",
                                "update_user_id": "",
                                "system_create_dtm": "2020-10-13T00:00:00Z",
                                "system_update_dtm": "2020-10-13T00:00:00Z",
                        });
                        
                        oTable.getContextByIndex(idx);
                        that.getView().setBusy(false);
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
             *행복사 :  리스트 내용중 체크된 항목이 하나일때만 반응 ref :  onChangeRow
             * site_yn, company_yn, role_yn, organization_yn, user_yn 컬럼은 복사하지 않습니다.
             * @public 
             */
            onModifyRow : function (oEvent) {

                console.group("onModifyRow");
                 var oTable = this.byId("mainList"),     
                      that = this,
                      oBinding = oTable.getBinding("rows"),                    
                      rows = oTable.getRows(), 
                      oUiModel = this.getModel("ui"),
                      indices = oTable.getSelectedIndices();                   

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

                oUiModel.setProperty("/bEvent", "ModifyRow"); 
                
                //oTable.clearSelection();

                this.getView().setBusy(true);

                oUiModel.setProperty("/bEvent", "ModifyRow"); 

                for (var i = 0; i < indices.length; i++) {
                    var idx = indices[i];     
                    if (oTable.isIndexSelected(idx)) { 
                        that.getView().setBusy(true);
                            rows[idx].getRowBindingContext().setProperty("update_user_id", "M");
                        //oTable.getContextByIndex(idx);
                        that.getView().setBusy(false);
                    }
                }
                
                this.getView().setBusy(false);

                console.groupEnd();
            },
            
            OnClick : function(oEvent) {
               
            },

            onCellClick(oEvent)
            {
                console.group("onCellClick");
                 var oTable = this.byId("mainList"),     
                      that = this,
                      oBinding = oTable.getBinding("rows"),                    
                      rows = oTable.getRows(), 
                      oUiModel = this.getModel("ui");

                 

                
                if (rows[oEvent.mParameters.rowIndex].getRowBindingContext() === null)
                {
                      return;
                }

                oUiModel.setProperty("/bEvent", "ModifyRow"); 

                that.getView().setBusy(true);

                    if (rows[oEvent.mParameters.rowIndex].getRowBindingContext().getValue("update_user_id") === 'M')              
                    {
                        rows[oEvent.mParameters.rowIndex].getRowBindingContext().setProperty("update_user_id", "Modify");
                    }
                    else
                    {
                        switch (oEvent.mParameters.columnIndex)
                        {
                            case "3" :
                            case "4" :
                            case "5" :
                                 this.sUpdate_user_id = "Modify" ;
                                 rows[oEvent.mParameters.rowIndex].getRowBindingContext().setProperty("update_user_id", "M");
                            default :
                        }                       
                    }
   

                that.getView().setBusy(false);
     
                console.groupEnd();     
            },
            OnLiveChange(oEvent){
                var sNewValue = oEvent.getParameter("value");
            },

            /**
             * @public
             * @param {*} oEvent 
             * @see main 과 sub 테이블의 변경 내용을 저장 합니다. 
             */
            onSave : function () {
                console.group("onSave");

                 var mstBinding = this.byId("mainList").getBinding("rows");

                if (!mstBinding.hasPendingChanges()) {
                    MessageBox.error("수정한 내용이 없습니다.");
                    return;
                }

                var oView = this.getView();
                var fnSuccess = function () {
                    oView.setBusy(false);
                    MessageToast.show("저장 되었습니다.");
                    this.onSearch();
                }.bind(this);

                var fnError = function (oError) {
                    oView.setBusy(false);
                    MessageBox.error(oError.message);
                }.bind(this);


                MessageBox.confirm("저장 하시 겠습니까?", {
                    title : "Comfirmation",
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            oView.setBusy(true);
                            oView.getModel().submitBatch("MainUpdateGroup").then(fnSuccess, fnError);
                        } else if (sButton === MessageBox.Action.CANCEL) {
                            
                        };
                    }
                });     

                console.groupEnd();
            },
            
            /**
             * @private
             * @param  sGroupId 
             */
            _submitBatch : function (sGroupId) {                
                this._submitCheck(sGroupId);
                console.group("_submitBatch");
                
                var oView = this.getView();

                function resetBusy() {
                    oView.setBusy(false);
                    oView.getModel("ui").setProperty("/hasUIChanges", oView.getModel().hasPendingChanges());
                }
                
                var fnSuccess = function () {
                    oView.setBusy(false);
                    oView.getModel("ui").setProperty("/hasUIChanges", oView.getModel().hasPendingChanges());
                    
                    //저장성공이후 취소 버튼을 활성화 한다. (취소버튼은 버튼 상태 함수에서 처리 하지 않음.)

                    if(sGroupId=="SubUpdateGroup"){
                        oView.getModel("ui").setProperty("/hasSubUiChanges", false);
                    } else {
                        oView.getModel("ui").setProperty("/hasMainUiChanges", false);
                    }
                    
                    this._showMsgStrip("s", this.sucessSave);

                    //main, sub 구분 작업
                    //this._setUIChanges(null, false);
                    
                    //MessageToast.show(this.sucessSave);                   
                }.bind(this);

                var fnError = function (oError) {
                    //this._setBusy(false);
                    
                    MessageBox.error(oError.message);
                }.bind(this);
                                
                return oView.getModel().submitBatch(sGroupId).then(fnSuccess, fnError);
               // return oView.getModel().submitBatch(sGroupId).then(resetBusy, resetBusy);

                console.groupEnd();
            },


            /**
             * @private
             * @see today 
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
             * @private
             * @scc UTC 기준 DATE를 반환합니다.
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
            },  

            isValNull: function (p_val) {
                if(!p_val || p_val == "" || p_val == null){
                    return true
                }else{
                    return false;
                }
            }  
		});
	});