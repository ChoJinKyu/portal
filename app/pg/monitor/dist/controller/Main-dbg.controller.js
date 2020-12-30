/**
 * 작성일 : 2020.10.29
 * 화면ID :
 * 
 * 작업 이력 
 * ===============================================================================
 * date           2020-11-06     
 * x1. delete 작업시 message confirm 작업 
 * x2. edit 버튼 작업시 uiModel 활용 으로 정리
 * x3. 각 버튼 처리 확인
 * x4. signalList 에서의 담당자 fragment 오픈 처리 (화면내에서 처리로 변경)
 * 
 * date           2020-11-09   
 * 1. 화면 기획서 문서와 담당자 확인 필요.
 * 2. 각종 버튼 이벤트 처리 완료시 메세지 처리
 * 3. History - 상세 테이블 바인딩 수정
 * 4. file upload 이벤트는 onChange 됨.
 * 5. save 저장시 각 오브젝트 컨트롤 값 가져오기.
 * 
 */

sap.ui.define([
  "sap/m/MessageBox",
  "sap/m/MessageToast",
  "pg/monitor/controller/BaseController",
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
  "sap/ui/model/odata/v2/ODataModel",
  "sap/m/UploadCollectionParameter",
  "sap/ui/core/format/FileSizeFormat",
  "sap/base/util/deepExtend"
], function (MessageBox, MessageToast, BaseController, Filter, FilterOperator, FilterType, Sorter, JSONModel, Token, MessageStrip, InvisibleMessage, library, compLibrary, SearchField, ColumnListItem, typeString, Label, Fragment, MockServer, ODataModel, UploadCollectionParameter, FileSizeFormat, deepExtend) {
  "use strict";

  var InvisibleMessageMode = library.InvisibleMessageMode;

  return BaseController.extend("pg.monitor.controller.Main", {
    onInit: function () {
      console.group("onInit");

      // var oModel = new sap.ui.model.odata.v2.ODataModel({ 
      //     serviceUrl: "https://lgcommondev-workspaces-ws-pj48p-app3.jp10.applicationstudio.cloud.sap/odata/v2/cm.ControlOptionMgrService"    

      // });

      //this.getContentDensityClass();

      //view page 초기 셋팅 (컨트롤 등)
      this._createView();

      //message setting
      this._setMessage();

      //this._upcollection();

      //this._getLoadData();

      //view page controls set key or item or values
      this._setSetData();

      console.groupEnd();
    },


    /**
     *  view에서 사용할 객체를 생성합니다.
     * @private
     */
    _createView: function () {
      console.group("_createView");

      this.oInvisibleMessage = InvisibleMessage.getInstance();

      var oUiModel = new JSONModel({
        bEditMode: false,
        busy: false
      });

      this.oViewParam = new JSONModel({
        signalList: false
      });

      this.setModel(oUiModel, "ui");

      this.byId("buttonEdit").addStyleClass("customerButton");
      this.byId("buttonDelete").addStyleClass("customerButton");
      this.byId("buttonSave").addStyleClass("customerButton");
      this.byId("buttonHistory").addStyleClass("customerButton");
      console.groupEnd();
    },

    /**
     * Initial UploadCollection
     * @private
     */
    _upcollection: function () {
      var sPath;

      // set mock data
      sPath = sap.ui.require.toUrl("uploadCollection.json");
      this.getView().setModel(new JSONModel(sPath));

      // Sets the text to the label
      this.byId("UploadCollection").addEventDelegate({
        onBeforeRendering: function () {
          this.byId("attachmentTitle").setText(this._getAttachmentTitleText());
        }.bind(this)
      });

      this.bIsUploadVersion = false;
    },

    /**
     * Note : controller.js 내부에서 사용될 메세지를 정의 합니다. (i18n 구성이후 변경)
     * @private
     */
    _setMessage: function () {
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
    _getLoadData: function (mid) {
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
    _setSetData: function () {
      console.group("_setSetData");
      var oView = this.getView(),
        oModel = this.getOwnerComponent().getModel("odata");

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

      //remo.setTextDirection("setTextDirection");//oModel.getProperty("/reMonitoringPurpose")
      oView.byId("reMonitoringPurpose").setValue(this._richTextEditor());
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
    _getToday: function () {
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
    _getUtcSapDate: function () {
      var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
        pattern: "yyyy-MM-dd'T'HH:mm"
      });

      var oNow = new Date();
      var utcDate = oDateFormat.format(oNow) + ":00Z";
      console.log("utcDate", utcDate);
      return utcDate;
    },

    /**
     * mainList에서 항목에 대한 추가 액션(추가, 삭제, 복사)일때 subList 테이블 초기화 해준다. 
     * refresh 등 odata4 에 대한 테이블 초기화 처리가 필요함
     * mainList 테이블에 종속된 데이타 동시 삭제 로직 handler 필요함 
     * @private
     */
    _setFilter: function () {
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

      switch (messageType) {
        case "i": msgType = "Information"; break;
        case "w": msgType = "Warning"; break;
        case "e": msgType = "Error"; break;
        case "s": msgType = "Success"; break;
        default: msgType = "Information";
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
    onEdit: function () {
      console.group("onEdit");
      var oUiModel = this.getModel("ui");

      console.log(oUiModel.getProperty("/bEditMode"));

      if (oUiModel.getProperty("/bEditMode")) {
        oUiModel.setProperty("/bEditMode", false);
      }
      else {
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
    onSignalListAddRow: function (oEvent) {
      console.group("onSignalListAddRow");

      var oModel = this.getOwnerComponent().getModel("odata"),
        oSignal = oModel.getProperty("/SignalCollection"),
        oTable = this.byId("signalList"),
        oNewData = {
          sid: Math.floor(Math.random() * 1000),
          condition: "LessThen",
          value1: Math.floor(Math.random() * 100),
          value2: Math.floor(Math.random() * 100),
          status: "A"
        };

      oSignal.push(oNewData);
      oModel.refresh(true);
      console.dir(oSignal);

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
                          
                          var idx = parseInt(oSelected[0].sPath.substring(oSelected[0].sPath.lastIndexOf('/') + 1));
                          oSignal.splice(idx, 1);
                      }

                      that.getView().setBusy(false);
                      oModel.setProperty("/SignalCollection", oSignal);  
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
    onDelete: function () {
      console.group("onDelete-");

      MessageBox.confirm("삭제 하시 겠습니까?", {
        title: "monitor Item Delete",
        initialFocus: sap.m.MessageBox.Action.CANCEL,
        onClose: function (sButton) {
          if (sButton === MessageBox.Action.OK) {

            MessageBox.show("삭제 확인", {
              icon: MessageBox.Icon.Sucess,
              title: "삭제 되었습니다.",
              actions: [MessageBox.Action.OK],
              styleClass: "sapUiSizeCompact"
            });


          } else if (sButton === MessageBox.Action.CANCEL) {
            return;
          };
        }
      });

      console.groupEnd();
    },

    /**
     * History Window
     * @public
     * @param {Event} oEvent 
     */
    onHistory: function (oEvent) {
      console.group("onHistory");

      var oPanel = this.byId("panelHistory");
      var bExpanded = oPanel.getExpanded();

      if (bExpanded) {
        oPanel.setExpanded(false);
      } else {
        oPanel.setExpanded(true);
      }

      // Note : Popover 작업시 참조
      // var oButton = oEvent.getSource();   
      // if (!this._HistoryPopover) {
      //     this._HistoryPopover = sap.ui.xmlfragment("historyPopover_id","pg.monitor.view.HistoryPopover", this);
      //     this.getView().addDependent(this._HistoryPopover);
      //     this._HistoryPopover.open();
      // }else{
      //   //this._HistoryPopover.open(oButton);//값 전달할때.
      //   this._HistoryPopover.open();
      // }

      console.groupEnd();
    },

    /**
     * HistoryPopover Clouse
     * @publci 
     */
    onHistoryPopoverClose: function () {

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
        text: "monitor"
      });

      return [oToken];
    },

    /**
     * History 테이블에서 아이템 선택
     * @public
     */
    onHistoryItemPress: function (oControlEvent) {
      console.group("onHistoryItemPress");

      var oTable = this.byId("historyDetailTable");
      var sPath = "odata>" + oControlEvent.oSource._aSelectedPaths[0] + "/modifyHistory";
      //var sPath = "odata>"+ oControlEvent.getParameters().listItem.oBindingContexts+"/modifyHistory";

      // Note : Popover 작업시 참조      
      // var oTemplate = this.byId("historyDetilListItem").clone();
      // oTable.bindItems(path, oTemplate);
      // var oValue = oEvent.getParameter("value");
      // var oBindingPath = oView.getModel().getProperty("/bindingValue");	//Get Hold of Model Key value that was saved
      // var oFilter = new sap.ui.model.Filter(oBindingPath, "Contains", oValue);
      // var oItems = oTable.getBinding("items");
      // oItems.filter(oFilter, "Application");

      console.groupEnd();
    },


    /**
     * 저장
     * @public
     */
    onSave: function () {
      console.group("onSave");
      //구분
      var comboBoxType = this.byId("comboBoxType").getSelectedItem().getKey();
      //시나리오
      var comboboxScenario = this.byId("comboboxScenario").getSelectedItem().getKey();

      //Active 0 Active, 1 In Active
      var radioActive = this.byId("radioActive").getSelectedIndex();

      //구매유형
      var comboBoxRawMaterials = this.byId("comboBoxRawMaterials").getSelectedItem().getKey();

      //회사
      var comboboxOffice = this.byId("comboboxOffice").getSelectedItem().getKey();

      //법인
      var conboBoxNatioinStatus = this.byId("conboBoxNatioinStatus").getSelectedItem().getKey();

      //담당자 selectedItem selectedRow            
      var aTokens = this.getView().byId("multiinputUser").getTokens();
      var multiinputUser = aTokens.map(function (oToken) {
        return oToken.getKey();
      }).join(",");

      //담당자 key와 동일한지 확인해야한다. 
      //this.getView().byId("userList");

      //담당자 리스트 
      //userList

      //모니터링 목적
      var reMonitoringPurpose = jQuery.sap.encodeHTML(this.byId("reMonitoringPurpose").getValue());

      //시나리오 설명
      var reMonitoringPurposeDetail = jQuery.sap.encodeHTML(this.byId("reMonitoringPurposeDetail").getValue());

      //운영방식
      //조회
      var checkBoxOMType1 = this.byId("checkBoxOMType1").getSelected() == true ? "1" : "0";
      //소명
      var checkBoxOMType2 = this.byId("checkBoxOMType2").getSelected() == true ? "1" : "0";
      //알람
      var checkBoxOMType3 = this.byId("checkBoxOMType3").getSelected() == true ? "1" : "0";

      //소스시스템
      var reSourceSystem = jQuery.sap.encodeHTML(this.byId("reSourceSystem").getValue());

      //소스시스템 상세설명
      var reSourceSystemDetail = jQuery.sap.encodeHTML(this.byId("reSourceSystemDetail").getValue());

      //condition this.byId("signalList").getItems()[0].getCells(0).mProperties.value; ComboBox
      //Value 1 this.byId("signalList").getItems()[0].getCells(1).mProperties.value; Input
      //Value 2 this.byId("signalList").getItems()[0].getCells(2).mProperties.value; Input
      //Department this.byId("signalList").getItems()[0].getCells(3).mProperties.value; ComboBox

      var signalLists = [];
      //var rows = this.byId("signalList").getRows();
     
      var oItems  = this.byId("signalList").getItems();
      //var items = oItems[i];
      debugger;
      for (var i = 0; i < oItems.length; i++) {
        var items = {
          "condition": oItems[i].getCells(0)[0].mProperties.selectedKey,
          "Value 1": oItems[i].getCells(0)[1].mProperties.value,
          "Value 2": oItems[i].getCells(0)[2].mProperties.value,
          "Department": oItems[i].getCells(0)[3].mProperties.selectedKey,
        }
       
        // debugger;
        // var oRows = {
        //   "condition": items.getCells(0)[0].mProperties.selectedKey,
        //   "Value1": items.getCells(0)[1].mProperties.value,
        //   "Value32": items.getCells(0)[2].mProperties.value,
        //   "Department": items.getCells(0)[3].mProperties.selectedKey
        // }

        signalLists.push(items);
      }

      //주기
      var multiComboBoxCycle = [];
      var multiComboBoxCycleItems = this.byId("multiComboBoxCycle").getSelectedItems();

      for (var item = 0; item < multiComboBoxCycleItems.length; item++) {

        var oItems = {

          "key": multiComboBoxCycleItems[item].mProperties.key,
          "text": multiComboBoxCycleItems[item].mProperties.text,
        }
        multiComboBoxCycle.push(oItems);
      }

      // 파일 업로드 체크 /용량, 파일명 길이, 허용파일 타입
      var oUploadCollection = this.byId("UploadCollection");
      var cFiles = oUploadCollection.getItems().length;

      if (cFiles > 0) {

        //				oUploadCollection.upload();

      }

      //this.byId("multiComboBoxCycle").getSelectedItems()[0].mProperties.key
      console.log("comboBoxType", comboBoxType);
      console.log("comboboxScenario", comboboxScenario);
      console.log("radioActive", radioActive);
      console.log("comboBoxRawMaterials", comboBoxRawMaterials);
      console.log("comboboxOffice", comboboxOffice);
      console.log("conboBoxNatioinStatus", conboBoxNatioinStatus);

      console.log("multiinputUser", multiinputUser);

      console.log("reMonitoringPurpose", reMonitoringPurpose);
      console.log("reMonitoringPurposeDetail", reMonitoringPurpose);
      console.log("checkBoxOMType1", checkBoxOMType1);
      console.log("checkBoxOMType2", checkBoxOMType2);
      console.log("checkBoxOMType3", checkBoxOMType3);
      console.log("reSourceSystem", reSourceSystem);
      console.log("reSourceSystemDetail", reSourceSystemDetail);
      //console.log("comboBoxType", comboBoxType);                        

      MessageBox.confirm("저장 하시 겠습니까?", {
        title: "Monitor Item Save",
        initialFocus: sap.m.MessageBox.Action.CANCEL,
        onClose: function (sButton) {
          if (sButton === MessageBox.Action.OK) {

            MessageBox.show("저장 확인", {
              icon: MessageBox.Icon.Sucess,
              title: "저장 되었습니다.",
              actions: [MessageBox.Action.OK],
              styleClass: "sapUiSizeCompact"
            });


          } else if (sButton === MessageBox.Action.CANCEL) {
            return;
          };
        }
      });

      console.groupEnd();
    },


    /**
     * UploadCollectionItem Delete 이벤트 
     * @public 
     */
    onFileItemDelete: function (oEvent) {
      console.group("onFileItemDelete");
      // var that = this;
      // var oUpModel = this.getModel("up"),
      //     oUpItems = oUpModel.getProperty("/items");

      //모델에서 삭제한다. 

      // 추가적인 모델 상태 변경확인을 위한 처리 
      // //json
      // for ( var i = oSelected.length - 1; i >= 0; i--) {
      //     //oSelected[0].getObject()

      //     var idx = parseInt(oSelected[0].sPath.substring(oSelected[0].sPath.lastIndexOf('/') + 1));
      //     //oData.lineitems.splice(idx, 1);
      //     oUpItems.splice(idx, 1);
      // }


      // var oFiles =  {
      //      "fileSize" : oEvent.getParameter("files")[0].size,
      //      "fileName" : oEvent.getParameter("files")[0].name
      // }

      // var oItems =  {
      //     "documentId" : Date.now().toString(),
      //     "visibleEdit" : true,
      //     "visibleDelete" : true,
      //     "fileName" : oEvent.getParameter("files")[0].size,
      //     "mimeType" : "image/jpg",
      //     "thumbnailUrl" : "",
      //     "url" : "",
      //     "attributes":[
      //         {
      //             "title":"File Size",
      //             "type" :"size",
      //             "text": oEvent.getParameter("files")[0].size
      //         }
      //     ],
      //     "selected": false
      // }

      console.groupEnd();
    },
    /**
     * 상태 변경 이벤트
     * @publci
     * @param {*} oEvent 
     */
    onChange: function (oEvent) {
      console.group("onChange");

      //instantupload 를 사용하지 않으므로 주석처리 
      // var uploadFiles = [];

      var oUploadCollection = oEvent.getSource();

      // Header Token
      var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
        name: "x-csrf-token",
        value: "securityTokenFromModel",
      });
      oUploadCollection.addHeaderParameter(oCustomerHeaderToken);

      // var maxSize = 10 * 1024 * 1024;//10MB 

      // var oFiles =  {
      //      "fileSize" : oEvent.getParameter("files")[0].size,
      //      "fileName" : oEvent.getParameter("files")[0].name
      // }

      // this.onFileItemDelete(oEvent);

      // MessageBox.show("등록할수 없는 파일 입니다.", {
      //     icon: MessageBox.Icon.ERROR,
      //     title: "첨부파일 체크 오류",
      //     actions: [MessageBox.Action.OK],
      //     styleClass: "sapUiSizeCompact"
      // });

      // uploadFiles.push(oFiles);

      // var oUploadCollection = oEvent.getSource();
      // // Header Token
      // var oCustomerHeaderToken = new UploadCollectionParameter({
      //   name: "x-csrf-token",
      //   value: "securityTokenFromModel"
      // });
      // oUploadCollection.addHeaderParameter(oCustomerHeaderToken);


      // oUploadCollection = this.byId("UploadCollection");
      // var oData = oUploadCollection.getModel().getData();
      // var aItems = jQuery.extend(true, {}, oData).items;
      // var sDocumentId = oEvent.getParameter("documentId");
      // jQuery.each(aItems, function(index) {
      //   if (aItems[index] && aItems[index].documentId === sDocumentId) {
      //     aItems.splice(index, 1);
      //   }
      // });
      // oModel.setData({
      //   "items": aItems
      // });	

      console.groupEnd();

    },

    /**
     * 파일 삭제
     * @public
     * @param {*} oEvent 
     */
    onFileDeleted: function (oEvent) {

      console.group("onFileDeleted");

      //json

      // var oData = this.getOwnerComponent().getModel("up").getData(),
      //     oModel = this.getOwnerComponent().getModel("up"),
      //     oUpItem = oModel.getProperty("/items"),
      //     oUploadCollection = this.byId("UploadCollection");


      //     oUploadCollection = this.byId("UploadCollection");
      //     var oData = oUploadCollection.getModel("up").getData();
      //     var aItems = jQuery.extend(true, {}, oData).items;
      //     debugger;
      //     var sDocumentId = oEvent.getParameter("documentId");
      //     jQuery.each(aItems, function(index) {
      //       if (aItems[index] && aItems[index].documentId === sDocumentId) {
      //         aItems.splice(index, 1);
      //       }
      //     });

      //     oModel.setProperty("/items", aItems);
      //     oUploadCollection.getBinding("items").refresh(true);



      //oModel.setData({
      //  "/items": aItems
      //});


      //oUploadCollection.refresh(true); 

      // var sUploadedFileName = oEvent.getParameter("files")[0].fileName;

      // for (var i = 0; i < oUploadCollection.getItems().length; i++) {          
      //   if (oUploadCollection.getItems()[i].getFileName() === sUploadedFileName) {
      //     oUploadCollection.removeItem(oUploadCollection.getItems()[i]);
      //     break;
      //   }
      // }

      // jQuery.each(oUpItem, function(index) {
      //   //Note : 파일 삭제 및 업로드 공통 규칙 추후 적용
      //   //if (aItems[index] && aItems[index].documentId === sDocumentId) {
      //     oUpItem.splice(index, 1);
      //}
      //oModel.setProperty("/items", oUpItem);  
      // oUploadCollection.refresh(true); 

      // var oData = oUploadCollection.getModel().getData();
      // var aItems = jQuery.extend(true, {}, oData).items;
      // var sDocumentId = oEvent.getParameter("documentId");
      // jQuery.each(aItems, function(index) {
      //   if (aItems[index] && aItems[index].documentId === sDocumentId) {
      //     aItems.splice(index, 1);
      //   }
      // });
      // oModel.setData({
      //   "items": aItems
      // });			

      MessageToast.show("Event fileDeleted triggered");
      console.groupEnd();
    },

    /**
     * 파일 사이즈 오류
     * @param {*} oEvent 
     */
    onFileSizeExceed: function (oEvent) {
      console.group("onFileSizeExceed");

      MessageBox.show("허용된 파일 사이즈가 아닙니다. 파일 허용 크기는 10메가 입니다.", {
        icon: MessageBox.Icon.ERROR,
        title: "파일 사이즈 오류",
        actions: [MessageBox.Action.OK],
        styleClass: "sapUiSizeCompact"
      });

      console.groupEnd();
    },

    /**
     * 파일 이름 길이 오류
     * @param {*} oEvent 
     */
    onFilenameLengthExceed: function (oEvent) {
      console.group("onFilenameLengthExceed");
      MessageBox.show("허용된 파일 이름 길이가 아닙니다.이름은 50자 이내 입니다.", {
        icon: MessageBox.Icon.ERROR,
        title: "파일 이름 오류",
        actions: [MessageBox.Action.OK],
        styleClass: "sapUiSizeCompact"
      });
      console.groupEnd();
    },

    /**
     * 파일 타입 오류
     */
    onTypeMissmatch: function (oEvent) {
      console.group("onTypeMissmatch");
      MessageBox.show("허용된 파일 타입이 아닙니다. 허용파일 목록 : gif, png, jpg, jpeg, doc, docx, xls, xlsx, hwp, pdf, ppt, pdf", {
        icon: MessageBox.Icon.ERROR,
        title: "파일 타입오류",
        actions: [MessageBox.Action.OK],
        styleClass: "sapUiSizeCompact"
      });
      console.groupEnd();
    },

    /**
     * 파일 업로드 시작
     * Note : 업로드에 대한 정책 확정시 마무리 작업
     * @public
     * @param {*} oEvent 
     */
    onStartUpload: function (oEvent) {
      var oUploadCollection = this.byId("UploadCollection");
      // var oTextArea = this.byId("TextArea");
      // var cFiles = oUploadCollection.getItems().length;
      // var uploadInfo = cFiles + " file(s)";

      if (cFiles > 0) {
        oUploadCollection.upload();

        // if (oTextArea.getValue().length === 0) {
        //   uploadInfo = uploadInfo + " without notes";
        // } else {
        //   uploadInfo = uploadInfo + " with notes";
        // }

        // MessageToast.show("Method Upload is called (" + uploadInfo + ")");
        // MessageBox.information("Uploaded " + uploadInfo);
        // oTextArea.setValue("");
      }
    },

    /**
     * 파일 업로드 시작
     * @public
     * @param {*} oEvent 
     */
    onBeforeUploadStarts: function (oEvent) {
      // Header Slug
      var oCustomerHeaderSlug = new UploadCollectionParameter({
        name: "slug",
        value: oEvent.getParameter("fileName")
      });
      oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
      setTimeout(function () {
        MessageToast.show("Event beforeUploadStarts triggered");
      }, 4000);
    },

    onUploadComplete: function (oEvent) {
      var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
      setTimeout(function () {
        var oUploadCollection = this.byId("UploadCollection");

        for (var i = 0; i < oUploadCollection.getItems().length; i++) {
          if (oUploadCollection.getItems()[i].getFileName() === sUploadedFileName) {
            oUploadCollection.removeItem(oUploadCollection.getItems()[i]);
            break;
          }
        }

        // delay the success message in order to see other messages before
        MessageToast.show("Event uploadComplete triggered");
      }.bind(this), 8000);
    },

    /**
     * 파일 선택 변경시 이벤트 발생
     * @public 
     */
    onSelectChange: function (oEvent) {
      var oUploadCollection = this.byId("UploadCollection");
      oUploadCollection.setShowSeparators(oEvent.getParameters().selectedItem.getProperty("key"));
    },

    /**
     * richTextEditor sample data
     * @pricate
     */
    _richTextEditor: function () {


      var sHtmlValue = '<p style="text-align: justify; background: white; font-size: 10pt; font-family: Calibri, sans-serif;"><strong><span style="font-size: 10.5pt; font-family: sans-serif; color: black;">Lorem ipsum dolor sit amet</span></strong>' +
        '<span style="font-size: 10.5pt; font-family: sans-serif; color: black;">, consectetur adipiscing elit. Suspendisse ornare, nibh nec gravida tincidunt, ipsum quam venenatis nisl, vitae venenatis urna sem eget ipsum. Ut cursus auctor leo et vulputate. ' +
        'Curabitur nec pretium odio, sed auctor felis. In vehicula, eros aliquam pharetra mattis, ante mi fermentum massa, nec pharetra arcu massa finibus augue. </span></p> ' +
        '<p style="margin: 0in 0in 11.25pt; text-align: justify; background: white; font-size: 10pt; font-family: Calibri, sans-serif;"><img style="float: left; padding-right: 1em;" src="img/wo.jpg" width="304" height="181">' +
        '<span style="font-size: 10.5pt; font-family: sans-serif; color: #0070c0;">Phasellus imperdiet metus est, in luctus erat fringilla ut. In commodo magna justo, sit amet ultrices ipsum egestas quis.</span><span style="font-size: 10.5pt; font-family: sans-serif; color: black;"> ' +
        'Nullam ac mauris felis. Sed tempor odio diam, nec ullamcorper lacus laoreet vitae. <strong>Aenean quam libero</strong>, varius eu ex eu, aliquet fermentum orci. Donec eget ante sed enim pretium tempus. <strong><em>Aliquam semper neque eu aliquam dictum</em></strong>. ' +
        'Nulla in convallis diam. Fusce molestie risus nec posuere ullamcorper. Fusce ut sodales tortor. <u>Morbi eget odio a augue viverra semper.</u></span></p>' +
        '<p style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Fusce dapibus sodales ornare. ' +
        'Nullam ac mauris felis. Sed tempor odio diam, nec ullamcorper lacus laoreet vitae. Aenean quam libero, varius eu ex eu, aliquet fermentum orci. Donec eget ante sed enim pretium tempus. Nullam laoreet metus ac enim placerat, nec tempor arcu finibus. ' +
        'Curabitur nec pretium odio, sed auctor felis. Nam eu neque faucibus, pharetra purus id, congue elit. Phasellus neque lectus, gravida at cursus at, pretium eu lorem. </span></p>' +
        '<ul>' +
        '<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Nulla non elit hendrerit, auctor arcu sit amet, tempor nisl.</span></li>' +
        '<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Morbi sed libero pulvinar, maximus orci et, hendrerit orci.</span></li>' +
        '<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Phasellus sodales enim nec sapien commodo mattis.</span></li>' +
        '<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Integer laoreet eros placerat pharetra euismod.</span></li>' +
        '</ul>' +
        '<p style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #c00000;">Ut vitae commodo ante. Morbi nibh dolor, ullamcorper sed interdum id, molestie vel libero. ' +
        'Proin volutpat dui eget ipsum scelerisque, a ullamcorper ipsum mattis. Cras sed elit sit amet diam convallis vehicula vitae ut nisl. Ut ornare dui ligula, id euismod lectus eleifend at. Nulla facilisi. In pharetra lectus et augue consequat vestibulum.</span></p>' +
        '<ol>' +
        '<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Proin id eros vel libero maximus dignissim ac et velit.</span></li>' +
        '<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">In non odio pharetra, dapibus augue quis, laoreet felis.</span></li>' +
        '</ol>' +
        '<p style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Donec a consectetur libero. Donec ut massa justo. Duis euismod varius odio in rhoncus. Nullam sagittis enim vel massa tempor, ' +
        'ut malesuada libero mollis. Vivamus dictum diam diam, quis rhoncus ex congue vel.</span></p>' +
        '<p style="text-align: center; font-size: 10pt; font-family: Calibri, sans-serif;" align="center"><em><span style="font-family: sans-serif; color: #a6a6a6;">"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."</span></em></p>' +
        '<p style="text-align: right; font-size: 10pt; font-family: Calibri, sans-serif;" align="right"><span style="font-family: sans-serif; color: #353535;">-</span> <strong><span style="font-family: sans-serif; color: #353535;">Sed in lacus dolor.</span></strong></p>';

      //sHtmlValue = jQuery.sap.encodeHTML(sHtmlValue);
      //sHtmlValue = $("<div/>").html(sHtmlValue).text();
      return sHtmlValue;
    },


    /**
     * system function
     * @private
     */
    onExit: function () {
      if (this._oPopover) {

        this._oPopover.destroy();
      }
    }

  });
});
