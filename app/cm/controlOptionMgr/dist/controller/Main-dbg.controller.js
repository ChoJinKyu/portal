/**
 * Title : 공통 > 제어옵션 관리 
 * Contents : 
 * 1. view 화면에서 호출되는 function @public
 * 2. controller 내부에서 사용되는 function @private
 * 3. 첫 검색이후 행추가 버튼 활성화 
 * 4. 취소 버튼 활성화는 필수값에 대한 수정이 있을때 반응.
  
 * Issue : 
 * 완료 : 1. ODATA4 형식에서 직접 바인딩한 날짜 값들의 형식을 지켜야 하기때문에 저장시 해당 형태로 
 * Date 형태로 입력해야하며 이때 발생하는 System Date 값도 전달 되는 이슈가 있습니다.  
 * cds 에서 처리 완료.
 *  
 * 2. 삭제할 아이템 선택과 수정한 데이타 동시 저장시 group id 지정 및 auto 시도시 실패 
 * 현재는 별도의 액션 처리로 수정, 삭제를 별도로 처리 합니다. 
 * 
 * 3. tenant_id, company_code 등 고정 값으로 등록된 값은 검색값으로 변경  
 * Remaining work :
 *  1. i18n 작업 ref function : _setMessage
 *  2. 조회 폼 작업
 *  3. 조회결과값에 대한 mainList 필터 작업
 *  4. hasUIChanges 작업
 * 4. 하위 데이타를 삭제하면 부모 데이타도 동시에 삭제됨.
 */
sap.ui.define([        
        "sap/base/Log",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/ui/core/format/DateFormat",
        "cm/controlOptionMgr/controller/BaseController",         
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/FilterType",
        "sap/ui/model/Sorter",
        "sap/ui/model/json/JSONModel",
        "sap/ui/table/RowSettings",
        "sap/ui/thirdparty/jquery",
        "sap/m/Token",        
        "sap/m/MessageStrip",
        "sap/ui/core/InvisibleMessage", 
        "sap/ui/core/library"
    ], function (Log, MessageBox, MessageToast, DateFormat, Controller, Filter, FilterOperator, FilterType, Sorter, JSONModel, RowSettings, jquery, Token, MessageStrip, InvisibleMessage, library) {
        "use strict";
        var InvisibleMessageMode = library.InvisibleMessageMode;
		return Controller.extend("cm.controlOptionMgr.controller.Main", {  

           	onInit: function () {  
                // Note : 초기 i18n 누락으로 인한 오류메세지 삭제용 입니다.  
                // 초기 에러 확인이 필요할시 삭제 
                //console.clear();       
                console.group("onInit");

                //message 를 정의. 
                this._setMessage();

                //view 에서 사용할 기본정보 셋팅. 
                this._createView();

                //작업진행중 에러 상태
                this._bTechnicalErrors = false; 

                //검색 컨트롤
                this._searchControlInit();

                console.groupEnd();
            },

            /**
             * Note : controller.js 내부에서 사용될 메세지를 정의 합니다. (i18n 구성이후 변경)
             * @private
             */
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
                console.groupEnd();
            },
  
           
            /**
             * Note : View 에 있는 버튼 상태 컨트롤 각종 액션 처리 상태에 따라 활성화와 비활성화 상태값을 설정.
             * @private
             */
            _setButtonState : function (){                
                //console.group("_setButtonState");

                //업무조건에 따라 활성화와 비활성화를 결정 합니다. 
                //업무확인후 추가 작업 필요함.    
                
                //main
                // enabled="{=${ui>/bAdd}}"
                // enabled="{=${ui>/bCopy}}"						
                // enabled="{=${ui>/bDelete}}"
                // enabled="{=${ui>/bSave}}" 							
                // enabled="{=${ui>/hasMainUIChanges}}"    

                //sub
                // enabled="{=${ui>/bSelect}}"
                // enabled="{=${ui>/bSubCheck}}"
                // enabled="{=${ui>/bSelect}}"
                // enabled="{=${ui>/hasSubUiChanges}}"
        
                return;
                
                var oUiModel = this.getModel("ui"),
                    oTable= this.getView().byId("mainList"); 
                /**
                 * 1. 메인 리스트 행추가 버튼은 처음 검색결과과 출력된후 활성화 된다.
                 * 2. 메인 리스트 행복사 버튼은 선택한 로우가 하나 일때 활성화 된다.
                 * 3. 메인 리스트 삭제 버튼은 선택한 로우가 하나 이상일때 활성화 된다.
                 * 4. 메인 리스트 저장 버튼은 검색결과가 활성화 될때 동시 활성화 된다. 
                 * 5. 서브 리스트 버튼들은 행선택 이 있을때에만 활성화 된다. 
                 */
                 //subLis에서의 row check box 클릭 
                if(oUiModel.getProperty("/bSubCheck")){
                     oTable= this.getView().byId("subList"); 
                }
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
                        
                        //체크한 Row수 체크 
                        if(indices.length>1){
                            oUiModel.setProperty("/bCopy", false); 
                        } 
                
                    }else{
                        oUiModel.setProperty("/bCopy", false); 
                        oUiModel.setProperty("/bDelete", false);
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
             * subList 에서 dataReceived 발생 이벤트
             * @public 
             * @param {*} oEvent 
             */
            onDataEvents : function (oEvent) {
                console.group("onDataEvents");
                var oUiModel = this.getModel("ui"),
                    oTable= this.getView().byId("subList"); 
                
                var aSalesOrderIDs = [],
                    oSource = oEvent.getSource();

                if (oEvent.getId() === "dataReceived"){
                    console.log("dataReceived event");

                    var subListlength = oSource.iMaxLength;
                    console.log("subListlength", subListlength);

                    //event 순서로 인한하여 buttonState 에서 컨트롤 하지 않습니다.
                    if(subListlength>0){
                        oUiModel.setProperty("/bSubListTrue", true);
                    }
                    else{
                        oUiModel.setProperty("/bSubListTrue", false); 
                    }         
                }
                console.groupEnd();
            },         
 
             /**
             *  view에서 사용할 객체를 생성합니다.
             * @private
             */
            _createView : function() {
                console.group("_createView");
                
                this.oInvisibleMessage = InvisibleMessage.getInstance();

                var oView = this.getView();
                var oUiModel = new JSONModel({ 
                            filterCommonID : "",
                            filterValue : "",
                            hasUIChanges : false,
                            hasMainUIChanges : false,
                            hasSubUiChanges : false,  
                            bSearch : false,
                            bAdd : true,
                            bDelete : true,                                                    
                            bCopy : true,
                            bSelect : true,
                            bCheck : true,
                            subListCount : 0,
                            bSubCheck : false,
                            bSubListTrue : false                                                        
                });     
                
                //선택값과 필수값을 저장 및 체크 합니다. 
                var oMainModel = new JSONModel({ 
                            data : [],
                            selectrow : [],
                            control_option_codeEmpty : true, 
                            control_option_nameEmpty : true
                });  

                var oSubModel = new JSONModel({ 
                            data : [],
                            selectrow : [],
                            control_option_level_codeEdit : true,
                            control_option_valEdit : true
                });                  

                this.setModel(oUiModel, "ui");     
                this.setModel(oMainModel, "mainModel");     
                this.setModel(oSubModel, "subModel"); 
                console.groupEnd();
            },

            /**
             * 검색
             * Note : code master를 활용하여 검색을 구성합니다. 체인과 사용여부만 작업
             * @public
             */
            onSearch : function () {
                console.group("onSearch");

                //체인
                //this.byId("search_chain_code").getSelectedItem().getKey();

                var oUiModel = this.getModel("ui"),
                    mainListBinding = this.byId("mainList").getBinding("rows"),
                    subListBinding = this.byId("mainList").getBinding("rows"); 

                oUiModel.setProperty("/bSearch", true);

                //검색값 작업해야함. 체인,공통,제어옵션,회사 ,제어옵션명,조직,역할,유효여부,로그인
                var oFilter1 = new Filter("tenant_id", FilterOperator.EQ, "1000"),   
                    oFilter2 = new Filter("company_code", FilterOperator.EQ, "G100"),
                    oSubFilter = new Filter("tenant_id", FilterOperator.EQ, "0000");   

                this.getView().setBusy(true);

                mainListBinding.resetChanges();
                subListBinding.resetChanges();
                
                mainListBinding.filter([                
                    oFilter1,
                    oFilter2
                ]);

                // subListBinding.filter([                
                //     oSubFilter
                // ]);  
                this._setButtonState();

                this.getView().setBusy(false);
                
                console.groupEnd();
            },
            /**
             *  mainList row select event
             * @public
             * @param {*} oEvent 
             */
            onCellClick : function (oEvent) {       
                console.group("onCellClick");
                
                var oMainModel = this.getView().getModel("mainModel"),
                    oUiModel = this.getView().getModel("ui"), 
                    oView = this.getView(),
                    oSubList = this.byId("subList"),
                    currentRowContext = oEvent.getParameter("rowContext");

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
                            company_code : "",
                            chain_code : "",
                            control_option_code : ""
                });  
                /*
                    tenant_id : master key
                    company_code : master key
                    control_option_code : master
                    chani_code : master key
                */
                oCheckRow.tenant_id = rows[rowIndex].getCells()[0].mProperties.value;
                oCheckRow.company_code = rows[rowIndex].getCells()[1].mProperties.value;
                oCheckRow.chain_code = rows[rowIndex].getCells()[2].mProperties.value;
                oCheckRow.control_option_code = rows[rowIndex].getCells()[3].mProperties.value;
                
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
             * 항목 (mainList 체크박스) 선택시 발생하는 이벤트 
             * @param {*} oEvent 
             */
            onCheck : function(tableType) {
                console.group("onCheck");

                var tableName = tableType,                
                    oUiModel = this.getModel("ui"),
                    bSub = false,
                    oTable,
                    that = this;


                if(tableName!="mainList"){ bSub = true; } else {  oUiModel.setProperty("/bCheck", true); }
                console.log("tableName: " + tableName);
                oTable = this.byId(tableName);

                if(bSub) {
                    console.log("subList row change event");
                    oUiModel.setProperty("/bSubCheck", bSub);
                } else {
                    console.log("mainList row change event");
                }

                this._setButtonState();
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
            },
                      
            /**
             * 작업 취소버튼 클릭시 발생 ref : onInputChange
             * @param {mainlist, sublist} tableType 
             */
            onCancelChanges : function (tableType) {
                console.group("onCancelChanges");
              
                var tableName = tableType,
                    bSub = false,
                    that = this;
               
                console.log("tableName: " + tableName);

                if(tableName!="mainList"){ bSub = true; }

                MessageBox.confirm(this.errorIsHasUIChangesCancelSave, {
                    title: this.confirmCancelTitle,
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            if(!bSub){
                                that.getView().getModel().resetChanges("MainUpdateGroup");
                            } else {
                                that.getView().getModel().resetChanges("SubUpdateGroup");         
                            }
                            
                            //MessageToast.show(this.sucessCancel);
                            that._setUIChanges(null, false);
                            that._showMsgStrip("s", that.sucessCancel);

                        } else if (sButton === MessageBox.Action.CANCEL) {
                            return;
                        };
                    }
                });          

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
                    bSub = false,
                    oContext,
                    that = this;
               
                console.log("tableName: " + tableName);

                if(tableName!="mainList"){ bSub = true; }

                var oUiModel = this.getModel("ui"), 
                    oTable = this.byId(tableName);

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
                        "tenant_id": "1000",
                        "company_code": "G100",
                        "control_option_code": "",
                        "chain_code": "CM",
                        "control_option_name": "",
                        "start_date": this._getToday(),
                        "end_date": "9999-12-31",
                        "site_yn": false,
                        "company_yn": false,
                        "role_yn": false,
                        "organization_yn": false,
                        "user_yn": false,
                        "local_create_dtm": utcDate,
                        "local_update_dtm": utcDate,
                        "update_user_id": "Admin"
                    });

                }else{
                
                    //사용자가 행을 추가 했음을 알려준다. 
                    this._setUIChanges(null, false); 

                    var oMainModel = this.getModel("mainModel"),
                        oView = this.getView(),
                        oSubList = this.byId("subList");                

                        oContext = oBinding.create({
                            "tenant_id": oMainModel.getProperty("/selectrow/tenant_id"),
                            "company_code": oMainModel.getProperty("/selectrow/company_code"),
                            "control_option_code": oMainModel.getProperty("/selectrow/control_option_code"),                    
                            "control_option_level_code": "",
                            "control_option_level_val": "",
                            "control_option_val": "",
                            "local_create_dtm": utcDate,
                            "local_update_dtm": utcDate,
                            "update_user_id": "Admin"
                        });                    
                }

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
                if(!bSub){
                    that._subListFilter(); 
                }
                this.getView().setBusy(false);
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

                console.log("indices", indices);
        
                if (this.byId("subList").getBinding("rows").hasPendingChanges()) {
                    this._showMsgStrip("e", this.errorUIChangeCopyRow);
                    return;
                }

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
                var oContext = oBinding.create({
                        "tenant_id": mainModel.tenant_id,
                        "company_code": mainModel.company_code,
                        "control_option_code": mainModel.control_option_code,
                        "chain_code": mainModel.chain_code,
                        "control_option_name": mainModel.control_option_name,
                        "start_date": mainModel.start_date,
                        "end_date": mainModel.end_date,                        
                        "site_yn": false,
                        "company_yn": false,
                        "role_yn": false,
                        "organization_yn": false,
                        "user_yn": false,
                        "local_create_dtm": utcDate,
                        "local_update_dtm": utcDate
                });
                
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
             */
            onDelete : function (tableType) {
                console.group("onDelete");

                var tableName = tableType,
                    oTable,
                    bSub = false,
                    that = this;

                if(tableName!="mainList") { bSub = true; }

                    oTable = this.byId(tableType);           
                 
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
                    if(!bSub){
                        msg = this.confirmDeleteRow;
                    }

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
                                            
                                            //Note : 실제 하위 데이타 삭제 프로세스가 있으면 하위 과정은 생략해도 된다. 
                                            if(!bSub){
                                                 that._subListFilter();    
                                            }
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
             * subList 테이블 아이템을 바인딩 한다. 
             * @private
             * @param {*} oMainListContext rowIndex
             */
            _onSubListBinding : function (rowIndex){
                console.group("_onSubListBinding");

                var oMainModel = this.getModel("mainModel"),
                    oView = this.getView(),
                    oSubList = this.byId("subList");                

                var oSelectRow = oMainModel.getProperty("/selectrow");
                console.log("oSelectRow.tenant_id", oSelectRow.tenant_id);
                console.log("oSelectRow.company_code", oSelectRow.company_code);
                console.log("oSelectRow.control_option_code", oSelectRow.control_option_code);
                    
                //sub model filter
                var oFilter1 = new Filter("tenant_id", FilterOperator.EQ, oSelectRow.tenant_id),   
                    oFilter2 = new Filter("company_code", FilterOperator.EQ, oSelectRow.company_code),   
                    oFilter3 = new Filter("control_option_code", FilterOperator.EQ, oSelectRow.control_option_code);                                   

                var oBinding = oSubList.getBinding("rows");

                    oBinding.filter([                
                        oFilter1,
                        oFilter2,
                        oFilter3
                    ]);

                console.groupEnd();
            },  

            /**
             * Row 안에서의 사용자 입력값이나 선택값이 있으면 이벤트 처리 됩니다.
             * 필수 값에 대한 체크만 진행함.
             * @public
             */
            onInputChange: function (oEvent) {
                console.group("onInputChange");
                var oModel = this.getView().getModel("mainModel"),
                    bMainTable = true,
                    tempValue;

                if(oEvent!=null){
                    if(oEvent.getSource().sId.indexOf("control_option_level_code")>-1){
                        oModel = this.getView().getModel("subModel");   
                        bMainTable = false;                 
                    } else if(oEvent.getSource().sId.indexOf("control_option_level_val")>-1){
                        oModel = this.getView().getModel("subModel");  
                        bMainTable = false;                 
                    }
                }else{
                    oEvent = null;
                }

                if (oEvent.getParameter("escPressed")) {
                    this._setUIChanges(oEvent, false);  //Model에게 [변경]내역을 위임한다.
                } else {
                    this._setUIChanges(oEvent, true);

                    if (bMainTable) {
                        //input box
                        if (oEvent.getSource().getParent().getBindingContext().getProperty("control_option_code")) {
                            oModel.setProperty("/control_option_codeEmpty", false);   //저장 전 필수값 확인시 필요
                        }
                        if (oEvent.getSource().getParent().getBindingContext().getProperty("control_option_name")) {
                            oModel.setProperty("/control_option_nameEmpty", false);
                        }
                    } else {

                        if (oEvent.getSource().getParent().getBindingContext().getProperty("control_option_level_code")) {
                            oModel.setProperty("/control_option_level_codeEdit", false);
                        }

                        tempValue = oEvent.getSource().getParent().getBindingContext().getProperty("control_option_val");

                        if (oEvent.getSource().getParent().getBindingContext().getProperty("control_option_val")) {
                            oModel.setProperty("/control_option_valEdit", false);

                            //Note : 키값을 변경하지 못하게 처리 합니다. 
                            //임시 입니다.  control_option_level_val값만 변경해서 저장시 control_option_val 값필수 값으로 요구하여
                            //해결전까지 임시로 이전값을 수정했다고 강제로 넣어줍니다.

                            oEvent.getSource().getParent().getBindingContext().setProperty("control_option_val", tempValue);
                            //this.byId("control_option_val").value= "1";
                            //l;this.byId("control_option_val").value;              
                        }
                    }
                }
                console.groupEnd();
            },
   
            /**
             * Ui에서의 수정사항이 있는지 체크 합니다. 
             * @param {*} oEvent 
             * @param {*} bHasUIChanges 
             */
            _setUIChanges : function (oEvent, bHasUIChanges) {
                console.group("_setUIChanges");

                var vProperty = "/hasMainUIChanges";

                if(oEvent!=null){
                    if(oEvent.getSource().sId.indexOf("control_option_level_code")>-1){
                        vProperty = "/hasSubUiChanges";
                    }   
                    if(oEvent.getSource().sId.indexOf("control_option_level_val")>-1){
                        vProperty = "/hasSubUiChanges";
                    }         
                } else {
                       this.getModel("ui").setProperty("/hasUIChanges", bHasUIChanges);
                       this.getModel("ui").setProperty("/hasMainUIChanges", bHasUIChanges);
                       this.getModel("ui").setProperty("/hasSubUiChanges", bHasUIChanges);                    
                }

                // if (this._bTechnicalErrors) {                    
                //     bHasUIChanges = true;
                // } else if (bHasUIChanges === undefined) {
                    bHasUIChanges = this.getView().getModel().hasPendingChanges();
                // }

                console.log("bHasUIChanges", bHasUIChanges);
                
                var oUiModel = this.getModel("ui");
                
                oUiModel.setProperty(vProperty, bHasUIChanges);

                console.groupEnd();
            },

            /**
             * @public
             * @param {*} oEvent 
             * @see main 과 sub 테이블의 변경 내용을 저장 합니다. 
             */
            onSave : function (tableType) {
                console.group("onSave");
                var tableName = tableType,
                    sGroupId = "MainUpdateGroup",
                    bSub = false,
                    that = this,
                    oTable,                    
                    oContext;
                    
               
                console.log("tableName: " + tableName);

                oTable = this.byId(tableName);

                if(tableName!="mainList"){ 
                    bSub = true; 
                    sGroupId = "SubUpdateGroup";
                    console.log("sub save");
                }else{
                    console.log("main save");
                }
                
                var rows = oTable.getRows(),
                    indices = oTable.getSelectedIndices(),         
                    oBinding = oTable.getBinding("rows"),
                    oUiModel = this.getView().getModel("ui"),
                    that = this;

                if (!oBinding.hasPendingChanges()) {
                   MessageBox.error(this.noChangeContent);
                   return;
                }                 

                MessageBox.confirm(this.confirmSave, {
                    title : this.confirmSaveTitle,
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            that._submitBatch(sGroupId);  
                            
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
                
                //oView.setBusy(true);

                // Note : 동시에 진행하니 에러남.
                // 그룹아이디로 진행해도 에러남.
                // var oTable = this.byId("mainList"),         
                // indices = oTable.getSelectedIndices(); 

                // for (var i = 0; i < indices.length; i++) {
                //     var idx = indices[i];     
                //     if (oTable.isIndexSelected(idx)) { 
                //         oTable.getContextByIndex(idx).delete("$auto").then(function () {   
                //                 //MessageToast.show("삭제");
                //         }.bind(this), function (oError) {
                //             MessageBox.error(oError.message);
                //         });
                //     }
                // }
                                
                return oView.getModel().submitBatch(sGroupId).then(fnSuccess, fnError);
               // return oView.getModel().submitBatch(sGroupId).then(resetBusy, resetBusy);

                console.groupEnd();
            },

            /**
             * mainList에서 항목에 대한 추가 액션(추가, 삭제, 복사)일때 subList 테이블 초기화 해준다. 
             * refresh 등 odata4 에 대한 테이블 초기화 처리가 필요함
             * mainList 테이블에 종속된 데이타 동시 삭제 로직 handler 필요함 
             * @private
             */
            _subListFilter : function(){
                console.group("subListFilter");
                var oSubList = this.byId("subList");  
              
                //sub model filter
                var oFilter1 = new Filter("tenant_id", FilterOperator.EQ, "0000");  
   
                var oBinding = oSubList.getBinding("rows");

                    oBinding.filter([                
                        oFilter1
                    ]);
                console.groupEnd();
            },

            /** ------------------------------------------------------------
             * Search Control
             * -------------------------------------------------------------
             */

             /**
              * @private
              * @see 검색을 위한 컨트롤에 대하여 필요 초기화를 진행 합니다. 
              */
            _searchControlInit : function () {
                console.group("_searchControlInit");
                //회사 
                this._oMultiInput = this.getView().byId("multiInput_office");
                this._oMultiInput.setTokens(this._getDefaultTokens());

                //Note : 해당 모델은 검색에 대한 화면 확인용 임시 데이타 입니다. 
                this.oColModel = new JSONModel(sap.ui.require.toUrl("cm/controlOptionMgr/localService/mockdata") + "/columnsModel.json");
                this.oOfficeModel = new JSONModel(sap.ui.require.toUrl("cm/controlOptionMgr/localService/mockdata") + "/offices.json");
                this.setModel(this.oOfficeModel, "officeModel");                

                console.groupEnd();
            },

            /**
             * @private 
             * @see multiInput_office setTokens
             */
            _getDefaultTokens: function () {
                
                var oToken = new Token({
                    key: "LG-1400",
                    text: "LG CNS"
                });

                return [oToken];
            },

            /**
             * @public 
             * @see multiInput_office Fragment View 컨트롤 valueHelp
             */
            onValueHelpRequested : function () {
                console.group("onValueHelpRequested");

                var aCols = this.oColModel.getData().cols;

                this._oValueHelpDialog = sap.ui.xmlfragment("cm.controlOptionMgr.view.ValueHelpDialogOffice", this);
                this.getView().addDependent(this._oValueHelpDialog);

                this._oValueHelpDialog.getTableAsync().then(function (oTable) {
                    oTable.setModel(this.oOfficeModel);
                    oTable.setModel(this.oColModel, "columns");

                    if (oTable.bindRows) {
                        oTable.bindAggregation("rows", "/OfficeCollection");
                    }

                    if (oTable.bindItems) {
                        oTable.bindAggregation("items", "/OfficeCollection", function () {
                            return new ColumnListItem({
                                cells: aCols.map(function (column) {
                                    return new Label({ text: "{" + column.template + "}" });
                                })
                            });
                        });
                    }
                    this._oValueHelpDialog.update();
                }.bind(this));

                this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
                this._oValueHelpDialog.open();
                    console.groupEnd();
            },

            /**
             * @public 
             * @see 사용처 ValueHelpDialogOffice Fragment 선택후 확인 이벤트
             */
            onValueHelpOkPress : function (oEvent) {
                var aTokens = oEvent.getParameter("tokens");
                this.multiInput_office = this.getView().byId("multiInput_office");
                this.multiInput_office.setTokens(aTokens);
                this._oValueHelpDialog.close();
            },

            /**
             * @public 
             * @see 사용처 ValueHelpDialogOffice Fragment 취소 이벤트
             */
           	onValueHelpCancelPress: function () {
			    this._oValueHelpDialog.close();
            },

            /**
             * @public
             * @see 사용처 ValueHelpDialogOffice Fragment window.close after 이벤트
             */
            onValueHelpAfterClose: function () {
			    this._oValueHelpDialog.destroy();
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
            }
                    
        });
});
