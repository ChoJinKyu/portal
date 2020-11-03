/**
 * 작성일 : 2020.10.21
 * 화면ID :
 * 
 * x1. delete 작업시 message confirm 작업 
 * x2. edit 버튼 작업시 uiModel 활용 으로 정리
 * 3. 각 버튼 처리 확인
 * 4. signalList 에서의 담당자 fragment 오픈 처리
 * 5. 화면 기획서 문서와 담당자 확인 필요.
 * 6. 각종 버튼 이벤트 처리 완료시 메세지 처리
 * 7. History - 상세 테이블 바인딩 수정
 */

sap.ui.define([      
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "pg/purchaseMgr/controller/BaseController",         
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/m/Token",        
    "sap/m/MessageStrip",
    "sap/ui/core/InvisibleMessage", 
    "sap/ui/core/library",
    "sap/ui/comp/library",
    "sap/m/SearchField",
    "sap/m/ColumnListItem",
    "sap/m/SearchField",
    "sap/ui/model/type/String",
    "sap/m/Label",
    "sap/ui/core/Fragment",
    "sap/ui/core/util/MockServer",
    "sap/ui/model/odata/v2/ODataModel"
    ], function ( MessageBox, MessageToast,  Controller, Filter, FilterOperator, FilterType, Sorter, JSONModel, Token, MessageStrip, InvisibleMessage, library, compLibrary, SearchField, ColumnListItem, typeString, Label, Fragment, MockServer, ODataModel) {
    "use strict";
    
    var InvisibleMessageMode = library.InvisibleMessageMode;
    
    return Controller.extend("pg.purchaseMgr.controller.Main", {
        onInit: function () {
            console.group("onInit");

         //this.getContentDensityClass();

            //view page 초기 셋팅 (컨트롤 등)
            this._createView();

            //message setting
            this._setMessage();

            //조회나 수정 페이지 일경우 사용자 데이타 로드 
            //this._getLoadData();

            //view page controls set key or item or values
            this._setSetData();

            console.groupEnd();
        },
                

        /**
         *  view에서 사용할 객체를 생성합니다.
         * @private
         */
        _createView : function() {
            console.group("_createView");
            
            this.oInvisibleMessage = InvisibleMessage.getInstance();
            
            var oUiModel = new JSONModel({                          
                bEditMode : false,
                busy : false
            });     

            this.oViewParam = new JSONModel({
                signalList : false
            }); 

            this.setModel(oUiModel, "ui");     

            console.groupEnd();
        },   

        /**
         * Note : controller.js 내부에서 사용될 메세지를 정의 합니다. (i18n 구성이후 변경)
         * @private
         */
        _setMessage : function() {
            console.group("_setMessage");
           
            this.errorDeleteRowChooice = "삭제할 항목을 선택해야 합니다.";
            this.confirmAllDeleteRow = "선택된 항목을 삭제 하시 겠습니까? 하위 등록된 데이타도 같이 삭제 됩니다.";
            this.confirmDeleteRow = "선택된 항목을 삭제 하시 겠습니까?";
            this.confirmDeleteRowTitle = "삭제 확인";
            this.sucessDelete = "삭제가 성공 하였습니다.";

            console.groupEnd();                
        },            

        /**
         * 화면에 필요한 데이타 로드 
         * Note: manifest.jso 파일 model설정으로 참고 (이외 참조 model 사용시 작업)
         * @private
         * @param (String) : mid
         */
        _getLoadData : function(mid) {
          console.group("_getLoadData");

          //var oView = this.getView();  
          
          
          console.groupEnd();
        },

        /**
         * 선택한 대상에 맞는 데이타 컨트롤에 셋팅
         * 사용자가 선택한 항목에 대한 값을 컨트롤에 셋팅한다. 배열 객체는 직접 바인딩 한다. 
         * Note : manifest.json에서 실제 데이타 모델로 변경필요, table 모델에 따라 변경필요.
         * 배열로 구성된 데이타 부분은 직접 바인딩 함
         * @private
         * @param (String) : mid
         */
        _setSetData : function(){
          console.group("_setSetData");
          var oView = this.getView(),
              oModel =this.getOwnerComponent().getModel("odata");

          //oModel = sap.ui.core.getModel("odata");
          console.dir(oModel);              
          //구분
          oView.byId("comboBoxType").setSelectedKey(oModel.getProperty("/comboBoxType"));

          //시나리오
          oView.byId("comboboxScenario").setSelectedKey(oModel.getProperty("/comboboxScenario"));
          
          //Active 0 Active, 1 In Active
          var oRadioSelectIndex = oModel.getProperty("/radioActive");
          oRadioSelectIndex = parseInt(oRadioSelectIndex);
          oView.byId("radioActive").setSelectedIndex(oRadioSelectIndex);
          
          //구매유형
          oView.byId("comboBoxRawMaterials").setSelectedKey(oModel.getProperty("/comboBoxRawMaterials"));

          //회사
          oView.byId("comboboxOffice").setSelectedKey(oModel.getProperty("/comboboxOffice"));
          
          //법인
          oView.byId("conboBoxNatioinStatus").setSelectedKey(oModel.getProperty("/conboBoxNatioinStatus"));

          //모니터링 목적 
          ///richTextEditor : setValue getValue setEditable setEditorType setRequired setTextDirection setValue
          oView.byId("reMonitoringPurpose").setHeight("150px");

          //remo.setTextDirection("setTextDirection");
          oView.byId("reMonitoringPurpose").setValue(oModel.getProperty("/reMonitoringPurpose"));
          //시나리오 설명
          oView.byId("reMonitoringPurposeDetail").setValue(oModel.getProperty("/reMonitoringPurposeDetail"));
          //운영방식 
          //checkbox getSelected() getText() setSelected() editable

          oView.byId("checkBoxOMType1").setSelected(oModel.getProperty("/checkBoxOMType1"));
          oView.byId("checkBoxOMType2").setSelected(oModel.getProperty("/checkBoxOMType2"));
          oView.byId("checkBoxOMType3").setSelected(oModel.getProperty("/checkBoxOMType3"));
          
          //소스시스템
          oView.byId("reSourceSystem").setValue(oModel.getProperty("/reSourceSystem"));
          //소스시스템 상세설명
          oView.byId("reSourceSystemDetail").setValue(oModel.getProperty("/reSourceSystemDetail"));
    
          //Collection---------------
          //담당자
          //UserCollection

          //주기
          //KeysSelected

          //시그널
          //Signal
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
         * mainList에서 항목에 대한 추가 액션(추가, 삭제, 복사)일때 subList 테이블 초기화 해준다. 
         * refresh 등 odata4 에 대한 테이블 초기화 처리가 필요함
         * mainList 테이블에 종속된 데이타 동시 삭제 로직 handler 필요함 
         * @private
         */
        _setFilter : function(){
            console.group("_setFilter");
            var oList = this.byId("mainList");  
          
            //sub model filter
            var oFilter1 = new Filter("tenant_id", FilterOperator.EQ, "0000");  

            var oBinding = oList.getBinding("rows");

                oBinding.filter([                
                    oFilter1
                ]);
            console.groupEnd();
        },            
       /**                
         * MessageStript 출력
         * type ["Information", "Warning", "Error", "Success"]
         * 약어 i, w, e, s
         * @private
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

        /**
         * Strip Message 호출
         * @private
         * @param {String} messageType 
         * @param {String} message 
         */
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
         * view EditMode
         * @public
         */
        onEdit : function () {
            console.group("onEdit");
            var oUiModel = this.getModel("ui");

            console.log(oUiModel.getProperty("/bEditMode")); 

            if(oUiModel.getProperty("/bEditMode")){                                 
                oUiModel.setProperty("/bEditMode", false);      
            }
            else{
                oUiModel.setProperty("/bEditMode", true); 
            }
            console.groupEnd();
        },
        
        /**
         * signalList Insert Data(Items)
         * signalList Row Insert
         * Note: sid 및 value 값 수정 필요 
         * Odata 바인딩 작업시 변경이 필요할수 있음
         * @public
         */
        onSignalListAddRow : function(oEvent) {
            console.group("onSignalListAddRow");
            
            var oModel = this.getOwnerComponent().getModel("odata"),
                oSignal = oModel.getProperty("/SignalCollection"),
                oTable = this.byId("signalList"),
                oNewData = {
                            sid : Math.floor(Math.random() * 1000),
                            condition : "LessThen",
                            value1 : Math.floor(Math.random() * 100),
                            value2 : Math.floor(Math.random() * 100),
                            status : "A"
            };   
                       
            oSignal.push(oNewData);
            oModel.refresh(true);
            console.dir(oSignal);

            //oTable.setSelectedIndex(oSignal.length-1);
            //focus 안됨...
            // var oRows = oTable.getRows();
            // var oCell = oRows[oSignal.length-1].getCells()[1]; 
            // oCell.setFocus(); 

            /**odata4 */
            // var oModel = this.getOwnerComponent().getModel("odata"),
            //     oSignal = oModel.getProperty("/SignalCollection"),
            //     oTable = this.byId("signalList"),
            //     oBinding = oTable.getBinding("rows");                  
            
            //     var oContext = oBinding.create({
            //         "sid" : Math.floor(Math.random() * 1000),
            //         "condition" : "LessThen",
            //         "value1" : Math.floor(Math.random() * 100),                        
            //         "value2" : Math.floor(Math.random() * 100),
            //         "status" : "A"
            //     });

            //     oTable.clearSelection();

            //     this.getView().setBusy(true);

            //     oContext.created().then(function () {
            //         oBinding.refresh();
            //     });

            //     //focus 이동
            //     oTable.getRows().some(function (oRows) {
            //         if (oRows.getBindingContext() === oContext) {
            //             oRows.focus();
            //             oRows.setSelected(true);
            //             return true;
            //         }
            //     });

            //     this.getView().setBusy(false);
            
            console.groupEnd();
        },

        /**
         * SignalList Row Item 삭제
         * Note: Odata 바인딩 작업시 변경이 필요할수 있음
         * @public
         */
        onSignalListDelete : function (oEvent) {
            console.group("onSignalListDelete");

            var oModel = this.getOwnerComponent().getModel("odata"),
                oSignal = oModel.getProperty("/SignalCollection"),
                oTable = this.byId("signalList"),
                oData = oModel.getData(),
                oPath,
                that = this;

            var oSelected  = this.byId("signalList").getSelectedContexts();
            if (oSelected.length > 0) {

                var msg = this.confirmDeleteRow;
                this.getView().setBusy(true);

                MessageBox.confirm(msg, {
                    title : this.confirmDeleteRowTitle,                        
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            console.log("delete ok")

                            //json
                            for ( var i = oSelected.length - 1; i >= 0; i--) {
                                //oSelected[0].getObject()
                                
                                var idx = parseInt(oSelected[0].sPath.substring(oSelected[0].sPath.lastIndexOf('/') + 1));
                                //oData.lineitems.splice(idx, 1);
                                oSignal.splice(idx, 1);
                            }
                            
                            //odata v4
                            // for (var i = 0; i < oIindices.length; i++) {
                            //     var idx = oIindices[i];     
                            //     if (oTable.isIndexSelected(idx)) { 
                            //         that.getView().setBusy(true);
                            //         oTable.getContextByIndex(idx).delete("$auto").then(function () {   
                            //             that._showMsgStrip("s", that.sucessDelete);
                            //             //MessageToast.show(this.sucessDelete);
                            //             oTable.clearSelection();  
                            //         }.bind(this), function (oError) {
                            //             MessageBox.error(oError.message);
                            //         });
                            //         that.getView().setBusy(false);
                            //     }
                            // }

                            that.getView().setBusy(false);
                            oModel.setProperty("/SignalCollection", oSignal);  
                            oTable.clearSelection();   
                            oTable.removeSelections();
                            oModel.refresh(true);  
                            
                            //MsgStrip 최상단에 있어 확인하기 어려움 메세지 박스 호출로 대체
                            MessageBox.show(that.confirmDeleteRowTitle, {
                                icon: MessageBox.Icon.ERROR,
                                title: that.sucessDelete,
                                actions: [MessageBox.Action.OK],
                                styleClass: "sapUiSizeCompact"
                            });                                

                        } else if (sButton === MessageBox.Action.CANCEL) {
                           
                            this.getView().setBusy(false);
                            return;
                        };
                    }
                });                          

            } else {
                 MessageBox.show(this.errorDeleteRowChooice, {
                    icon: MessageBox.Icon.ERROR,
                    title: this.errorCheckChangeCopyRowTitle,
                    actions: [MessageBox.Action.OK],
                    styleClass: "sapUiSizeCompact"
                });
            }

            oModel.setProperty("/SignalCollection", oSignal);  
            oTable.clearSelection();   
            oModel.refresh(true);  
            
            console.groupEnd();
        },

        /**
         * view item 삭제
         * @private
         */
        onDelete : function () {
            console.group("onDelete-");
        
               // MessageToast.show("삭제 되었습니다.");

              //  MessageBox.error("선택된 행이 없습니다.");
            console.groupEnd();
        },

        /**
         * History Window
         * @public
         * @param {Event} oEvent 
         */  
        onHistory : function (oEvent){
            console.group("onHistory");

            var oButton = oEvent.getSource();   
           
            if (!this._HistoryPopover) {

                this._HistoryPopover = sap.ui.xmlfragment("historyPopover_id","pg.purchaseMgr.view.HistoryPopover", this);
                this.getView().addDependent(this._HistoryPopover);
                this._HistoryPopover.open();
            }else{
              //this._HistoryPopover.open(oButton);//값 전달할때.
              this._HistoryPopover.open();
            }

            console.groupEnd();
        },

        /**
         * HistoryPopover Clouse
         * @publci 
         */
        onHistoryPopoverClose : function () {

            this._HistoryPopover.close();

            this._HistoryPopover.destroy();
            this._HistoryPopover = null;
        },
        /**
         * history button setTokens
         * @private 
         */
        _getDefaultTokens: function () {
            
            var oToken = new Token({
                key: "HistoryData",
                text: "PurchaseMgr"
            });

            return [oToken];
        },

        /**
         * History 테이블에서 아이템 선택
         * @public
         */
        onHistoryItemPress : function (oControlEvent) {
            console.group("onHistoryItemPress");

            var oTable = this.byId("historyDetailTable");
            var sPath = "odata>" + oControlEvent.oSource._aSelectedPaths[0] + "/modifyHistory";
            //var sPath = "odata>"+ oControlEvent.getParameters().listItem.oBindingContexts+"/modifyHistory";
            
            // debugger;
            // var oTemplate = this.byId("historyDetilListItem").clone();
            // debugger;
            // oTable.bindItems(path, oTemplate);

            // // var oValue = oEvent.getParameter("value");
            // // var oBindingPath = oView.getModel().getProperty("/bindingValue");	//Get Hold of Model Key value that was saved
            // // var oFilter = new sap.ui.model.Filter(oBindingPath, "Contains", oValue);
            // // var oItems = oTable.getBinding("items");
            // // oItems.filter(oFilter, "Application");

            console.groupEnd(); 
        },


        /**
         * 저장
         * @public
         */
        onSave : function () {

            this.byId("comboBoxType").setSelectedKey
            var comboBoxType = this.byId("box0").getSelectedItem().getKey();
            debugger;
        },


         /** ------------------------------------------------------------
         * Search Control
         * -------------------------------------------------------------
         */

        /**
         * system function
         * @private
         */
        onExit : function () {
            if (this._oPopover) {
                this._oPopover.destroy();
            }
        },
        
    });
});
