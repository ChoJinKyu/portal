sap.ui.define([
    "sap/ui/base/EventProvider",
    "ext/lib/model/I18nModel",
    "sap/ui/model/odata/v2/ODataModel",
    'sap/m/SearchField',
    "sap/ui/model/json/JSONModel",
    'sap/m/Token',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Item",
    "sap/m/MessageToast"
], function (EventProvider, I18nModel, ODataModel, SearchField, JSONModel, Token, Filter, FilterOperator, Item, MessageToast) {
    "use strict";
    
    var that;
    
    var NonPriceInf = EventProvider.extend("sp.sc.scQBPages.NonPriceInf", {

        

        init: function(oThis){
            that = oThis;
            // if(!that._NPSelectIndex){
                var NPInfPopupUtil = new JSONModel({ type: "1" });
                that.getView().setModel(NPInfPopupUtil, "NPInfPopupUtil");
            // }
            
        },
        showNonPriceInfo: function(){
            
            if(!that._NonPriceInfPopup){
                that._NonPriceInfPopup = sap.ui.xmlfragment("NonPriceInf", "sp.sc.scQBPages.view.NonPriceInf", this);
                that.getView().addDependent(that._NonPriceInfPopup);
            
            }
            
            that._NonPriceInfPopup.open();
            
        },
        NonPricePopupBeforeClose: function (e) {
            // @ts-ignore
            that._NPSelectIndex = undefined;
        },
        NonPricePopupBeforeOpen: function (e) {
            // 
                var tab = e.oSource.getContent()[0].getItems()[2].getItems()[0].getContent()[0];
                tab.destroyItems();
                // 조회용
                // @ts-ignore
                if (that._NPSelectIndex >= 0) {
                    // @ts-ignore
                    console.log("조회 번호", that._NPSelectIndex);
                    var oModel = that.getView().getModel("viewModel");
                    // @ts-ignore
                    var oNPHeader = oModel.oData.NPHeader[that._NPSelectIndex];
                    // var oHeader = oNPHeaderModel.oData

                    var h1;
                    var h4;
                    var h5;
                    if (oNPHeader.h1 == "Commercial") {
                        h1 = "1";
                    } else if (oNPHeader.h1 == "Technical") {
                        h1 = "2";
                    }
                    if (oNPHeader.h4 == "Date") {
                        h4 = "1";
                    } else if (oNPHeader.h4 == "Number") {
                        h4 = "2";
                    } else if (oNPHeader.h4 == "Text") {
                        h4 = "3";
                    }
                    // console.log()
                    if (oNPHeader.h5 == "Automatic") {
                        h5 = "1";
                    }else{  //None
                        h5 = "2";
                    }
                    

                    for (var i = 0; i < oNPHeader.item.length; i++) {
                        var aa = oNPHeader.item[i];
                        var addItem = this._NPFirstLine();
                        var oCells = addItem.getCells();
                        // @ts-ignore
                        oCells[0].setText(String(i + 1));
                        
                        if (h4 == "1") {
                            // @ts-ignore
                            oCells[1].setValue(aa.v1);
                            // @ts-ignore
                            oCells[2].setValue(aa.v2);
                            // @ts-ignore
                            oCells[3].setValue(aa.v3);

                        } else if (h4 == "2") {
                            // @ts-ignore
                            oCells[4].setValue(aa.v1);
                            // @ts-ignore
                            oCells[5].setValue(aa.v2);
                            // @ts-ignore
                            oCells[6].setValue(aa.v3);

                        } else if (h4 == "3") {
                            // @ts-ignore
                            oCells[7].setValue(aa.v1);
                            // @ts-ignore
                            oCells[8].setValue(aa.v2);
                        }
                        tab.addItem(addItem);
                    }

                    var NPHeaderStr = new JSONModel({
                        h1: h1, h2: oNPHeader.h2, h3: oNPHeader.h3,
                        h4: h4, h5: h5, h6: oNPHeader.h6
                    });

                    var aa = that.getView().getModel("NPInfPopupUtil");
                    aa.setData({ type: h4, enabled: false });

                    console.log("NPHeaderStr = ", NPHeaderStr);
                } else {      //신규 생성용

                    var NPHeaderStr = new JSONModel({
                        h1: "1", h2: "", h3: "",
                        h4: "1", h5: "1", h6: ""
                    });

                    var aa = that.getView().getModel("NPInfPopupUtil");
                    aa.setData({ type: "1" });

                    var newLine = this._NPFirstLine();
                    tab.addItem(newLine);



                }
                that.getView().setModel(NPHeaderStr, "NPHeaderModel");

                //버튼 생성

                // @ts-ignore
                var CloseButton = new sap.m.Button({
                    // type: sap.m.ButtonType.Emphasized,
                    text: "취소",
                    press: function (e) {
                        that._NonPriceInfPopup.close();
                        this._NPTableClear(e);
                    }.bind(this)
                });
                // @ts-ignore
                var ApplyButton = new sap.m.Button({
                    type: sap.m.ButtonType.Emphasized,
                    text: "적용",
                    press: function (e) {
                        var oHeader = this._getNPPopupData(e);
                        var validationCheck = this._ApplyValidationCheck(e, oHeader);
                        if(validationCheck == false) return;
                        if (that._NPSelectIndex >= 0) {
                            this._NPTableArrayUpdate(oHeader);
                        } else {
                            this._NPTableArrayAdd(oHeader);
                        }
                        that._NonPriceInfPopup.close();
                        this._NPTableClear(e);
                    }.bind(this)
                });
                // @ts-ignore
                that._NonPriceInfPopup.setBeginButton(CloseButton); 
                // @ts-ignore
                that._NonPriceInfPopup.setEndButton(ApplyButton);
            },
            selectNPTypeChange: function (e) {
                var typeFlagModel = that.getView().getModel("NPInfPopupUtil");
                
                var oKey = e.getParameters().selectedItem.mProperties.key;
                var typeFlag = { type: oKey };
                // that.getView().getModel("NPInfPopupUtil").oData.type = oKey;
                
                // @ts-ignore
                typeFlagModel.setData(typeFlag);
                
                var tab = e.oSource.getParent().getParent().getParent().getParent().getItems()[2].getItems()[0].getContent()[0];
                var oItems = tab.getItems();
                for (var i = 0; i < oItems.length; i++) {
                    var oItem = oItems[i];
                    oItem.destroy();
                }
                var newLine = this._NPFirstLine();
                tab.addItem(newLine);
            },
            _NPNone: function (e){
                // Header 초기화
                var PVbox = e.oSource.getParent().getContent()[0].getItems()[0];
                var sValueState = "None";

                var h1 = PVbox.getItems()[0].getItems()[0].getItems()[1];
                var h2 = PVbox.getItems()[0].getItems()[1].getItems()[1];
                var h3 = PVbox.getItems()[1].getItems()[0].getItems()[1];
                var h4 = PVbox.getItems()[2].getItems()[0].getItems()[1];
                var h5 = PVbox.getItems()[2].getItems()[1].getItems()[1];
                var h6 = PVbox.getItems()[2].getItems()[2].getItems()[1];

                h1.setValueState(sValueState);
                h2.setValueState(sValueState);
                h3.setValueState(sValueState);
                h4.setValueState(sValueState);
                h5.setValueState(sValueState);
                h6.setValueState(sValueState);

                // Item  초기화
                var tab = e.oSource.getParent().getContent()[0].getItems()[2].getItems()[0].getContent()[0];
                var oItems = tab.getItems();
                for(var i=0; i<oItems.length; i++){
                    var oItem = oItems[i];
                    var oCells = oItem.getCells();
                    for(var j=1; j<oCells.length; j++){
                        var oCell = oCells[j];
                        oCell.setValueState(sValueState);
                    }
                }

                

            },
            _NPTableArrayAdd: function (NPHeaderData) {
                var oModel = that.getView().getModel("viewModel");
                // @ts-ignore
                var oNPHeader = oModel.oData.NPHeader;

                oNPHeader.push(NPHeaderData);
                oModel.refresh(true);

            },
            _NPTableArrayUpdate: function (NPHeaderData) {
                var oModel = that.getView().getModel("viewModel");
                // @ts-ignore
                var oNPHeader = oModel.oData.NPHeader;

                // @ts-ignore
                oNPHeader[that._NPSelectIndex] = NPHeaderData;


                oModel.refresh(true);
                // console.log("oRow = ",oRow);
                console.log("oNPHeader = ", oNPHeader);

            },
            _ApplyValidationCheck: function (e, inputHeader){

                this._NPNone(e);

                var oHeader = inputHeader;
                var oItems = inputHeader.item;
                console.log("oItems == ", oItems);
                var flag = true;
                var errorObject = []
                // @ts-ignore
                var oPopupType = that.getView().getModel("NPInfPopupUtil").oData.type;

                // Header 부분 입력 값 확인
                if(oHeader.h1.length < 1){
                    flag = false;
                    errorObject.push("h1");
                }
                if(oHeader.h2.length < 1){
                    flag = false;
                    errorObject.push("h2");
                }
                if(oHeader.h4.length < 1){
                    flag = false;
                    errorObject.push("h4");
                }
                if(oHeader.h5.length < 1){
                    flag = false;
                    errorObject.push("h5");
                }
                if(oHeader.h6.length < 1 ){
                    flag = false;
                    errorObject.push("h6");
                }else{
                    var ItemCheckFlag = this._NPCheckItem(e, oPopupType, oHeader.h6);
                    if(ItemCheckFlag == false){
                        flag = ItemCheckFlag;
                    }
                }

                
                // // if(ItemCheckFlag == false){
                // //     flag = false;
                // // }
                // // target score 값이 공백이 아니어야 함.
                // if(oHeader.h6.length < 1 || !ItemCheckFlag){
                //     flag = false;
                //     errorObject.push("h6");
                // }


                var errItemObject = [];

                

                // Item 부분 입력 값 확인
                for(var i=0; i<oItems.length; i++){
                    // @ts-ignore
                    // @ts-ignore
                    var oItem = oItems[i];
                    var Iflag = true;
                    var oErrorRow = [];
                    if(oItems[i].v1.length < 1){
                        Iflag = false;
                        oErrorRow.push("1");
                    }
                    if(oItems[i].v2.length < 1){
                        Iflag = false;
                        oErrorRow.push("2");
                    }
                    if(oPopupType != "3"){
                        if(oItems[i].v3.length < 1 ){
                            Iflag = false;
                            oErrorRow.push("3");
                        }
                    }

                    if(Iflag == false){
                        flag = false;
                        errItemObject.push({index: i, value:oErrorRow});
                    }
                }

                
                
                console.log("errItemObject ====== ", errItemObject);
                
                if(flag == false){
                    this._NPError(e, errorObject, errItemObject, oPopupType);
                }
                
                // var ItemCheckFlag = this._NPCheckItem(e, oPopupType, oHeader.h6);
                // if(ItemCheckFlag == false){
                //     flag = false;
                // }

                return flag;

            },
            _NPError: function (e, errorObject, errItemObject, oPopupType){
                // Header Error 표시
                var eObjects = errorObject;
                var PVbox = e.oSource.getParent().getContent()[0].getItems()[0];
                var sValueState = "Error";
                
                var h1 = PVbox.getItems()[0].getItems()[0].getItems()[1];
                var h2 = PVbox.getItems()[0].getItems()[1].getItems()[1];
                var h3 = PVbox.getItems()[1].getItems()[0].getItems()[1];
                var h4 = PVbox.getItems()[2].getItems()[0].getItems()[1];
                var h5 = PVbox.getItems()[2].getItems()[1].getItems()[1];
                var h6 = PVbox.getItems()[2].getItems()[2].getItems()[1];


                for(var i=0; i<eObjects.length; i++){
                    var eOb = eObjects[i];
                    if(eOb == "h1"){
                        h1.setValueState(sValueState);
                        h1.setValueStateText("필수 입력")
                    }else if(eOb == "h2"){
                        h2.setValueState(sValueState);
                        h2.setValueStateText("필수 입력")
                    }else if(eOb == "h3"){
                        h3.setValueState(sValueState);
                        h3.setValueStateText("필수 입력")
                    }else if(eOb == "h4"){
                        h4.setValueState(sValueState);
                        h4.setValueStateText("필수 입력")
                    }else if(eOb == "h5"){
                        h5.setValueState(sValueState);
                        h5.setValueStateText("필수 입력")
                    }else if(eOb == "h6"){
                        h6.setValueState(sValueState);
                        h6.setValueStateText("필수 입력")
                    }
                }

                // Item  초기화
                var tab = e.oSource.getParent().getContent()[0].getItems()[2].getItems()[0].getContent()[0];
                var oItems = tab.getItems();
                // oPopupType 
                //     1일 때, 1,2,3 
                //     2일 때, 4,5,6
                //     3일 때. 7,8
                
                var IntType = parseInt(oPopupType);


                for(var k=0; k<errItemObject.length; k++){
                    var errItem = errItemObject[k];
                    var oItem = oItems[errItem.index];
                    var oCells = oItem.getCells();
                    // var oValue = errItem.
                    for(var j=0; j<errItem.value.length; j++){
                        var CellNumber = errItem.value[j];
                        CellNumber = parseInt(CellNumber) + (3*IntType -3);
                        oCells[CellNumber].setValueState("Error");
                        oCells[CellNumber].setValueStateText("필수 입력")
                    }

                    console.log("errItem === ", errItem);
                }

            },
            _NPCheckItem: function (e, oPopupType, oTargetScore ){
                var tab = e.oSource.getParent().getContent()[0].getItems()[2].getItems()[0].getContent()[0];
                var oItems = tab.getItems();
                var IntType = oPopupType;
                var flag = true;
                
                // // Item  초기화
                // var tab = e.oSource.getParent().getContent()[0].getItems()[2].getItems()[0].getContent()[0];
                // var oItems = tab.getItems();
                // for(var i=0; i<oItems.length; i++){
                //     var oItem = oItems[i];
                //     var oCells = oItem.getCells();
                //     for(var j=1; j<oCells.length; j++){
                //         var oCell = oCells[j];
                //         oCell.setValueState("None");
                //     }
                // }

                if(oItems.length < 1){
                    flag = false;
                    MessageToast.show("평가 항목을 입력해 주세요.");
                    // alert("Item = 0!!!");
                }
                // if( oTargetScore != "" ) {

                    // Target Score : Item 점수 비교 => Target Score >= Item 점수
                    var Inth6 = parseInt(oTargetScore);
                    
                    for(var i=0; i<oItems.length; i++){
                        var oItem = oItems[i];
                        var oCell;
                        if(IntType == "1"){
                            oCell = oItem.getCells()[3];
                            
                            if(oItem.getCells()[1].getValue() > oItem.getCells()[2].getValue()){
                                oItem.getCells()[1].setValueState("Error");
                                oItem.getCells()[1].setValueStateText("ToDate가 From보다 클 수 없음");
                                oItem.getCells()[2].setValueState("Error");
                                oItem.getCells()[2].setValueStateText("ToDate가 From보다 클 수 없음");
                                flag = false;
                                console.log("from : to =====", oItem.getCells()[1].getValue(), " : ",oItem.getCells()[2].getValue());
                            }
                        }else if(IntType == "2"){
                            oCell = oItem.getCells()[6];
                        }else if(IntType == "3"){
                            oCell = oItem.getCells()[8];
                        }
                        var value = oCell.getValue();
    
                        if(parseInt(value) > Inth6){
                            flag = false;
                            oCell.setValueState("Error");
                            oCell.setValueStateText("Each score value must be less than Target Score");
                        }
                        console.log("index ==== ",i);
                        console.log("targetScore : 점수 ==== ", Inth6, " : ", parseInt(value));
                    }
                // }else {
                //     flag = false;
                // }

                return flag;

            },
            _getNPPopupData: function (e) {
                var PVbox = e.oSource.getParent().getContent()[0].getItems()[0];
                
                var oNPHeaderData = {};
                oNPHeaderData.h1 = PVbox.getItems()[0].getItems()[0].getItems()[1].getSelectedItem().getText();
                oNPHeaderData.h2 = PVbox.getItems()[0].getItems()[1].getItems()[1].getValue();
                oNPHeaderData.h3 = PVbox.getItems()[1].getItems()[0].getItems()[1].getValue();
                oNPHeaderData.h4 = PVbox.getItems()[2].getItems()[0].getItems()[1].getSelectedItem().getText();
                oNPHeaderData.h5 = PVbox.getItems()[2].getItems()[1].getItems()[1].getSelectedItem().getText();
                oNPHeaderData.h6 = PVbox.getItems()[2].getItems()[2].getItems()[1].getValue();



                var typeFlagModel = that.getView().getModel("NPInfPopupUtil");
                // @ts-ignore
                var typeFlag = typeFlagModel.oData.type;


                var tab = e.oSource.getParent().getContent()[0].getItems()[2].getItems()[0].getContent()[0];
                var oItems = tab.getItems();
                var oItemArray = [];
                for (var i = 0; i < oItems.length; i++) {
                    var oItem = oItems[i];
                    var sItem = {};

                    if (typeFlag == "1") {
                        sItem.v1 = oItem.getCells()[1].getValue();
                        sItem.v2 = oItem.getCells()[2].getValue();
                        sItem.v3 = oItem.getCells()[3].getValue();
                    } else if (typeFlag == "2") {
                        sItem.v1 = oItem.getCells()[4].getValue();
                        sItem.v2 = oItem.getCells()[5].getValue();
                        sItem.v3 = oItem.getCells()[6].getValue();
                    } else if (typeFlag == "3") {
                        sItem.v1 = oItem.getCells()[7].getValue();
                        sItem.v2 = oItem.getCells()[8].getValue();
                    }
                    oItemArray.push(sItem);
                }

                oNPHeaderData.item = oItemArray;

                console.log("Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", oNPHeaderData);

                return oNPHeaderData;



                // return oNPHeaderData ;
                // 


            },
            _NPTableClear: function (e) {
                // Header부분 clear

                var PVbox = e.oSource.getParent().getContent()[0].getItems()[0];
                // var oNPHeaderData = { h1: "", h2 : "", h3 : "", h4 : "", h5 : "", h6 : ""};

                // PVbox.getItems()[0].getItems()[0].getItems()[1].setSele
                PVbox.getItems()[0].getItems()[0].getItems()[1].setSelectedKey("1")
                PVbox.getItems()[0].getItems()[1].getItems()[1].setValue("");
                PVbox.getItems()[1].getItems()[0].getItems()[1].setValue("");
                PVbox.getItems()[2].getItems()[0].getItems()[1].setSelectedKey("1");
                PVbox.getItems()[2].getItems()[1].getItems()[1].setSelectedKey("1");
                PVbox.getItems()[2].getItems()[2].getItems()[1].setValue("");

                // Item 부분 clear
                var tab = e.oSource.getParent().getContent()[0].getItems()[2].getItems()[0].getContent()[0];
                var oItems = tab.getItems();
                for (var i = 0; i < oItems.length; i++) {
                    var oItem = oItems[i];
                    oItem.destroy();
                }
                var newLine = this._NPFirstLine();
                tab.addItem(newLine);

            },
            _NPFirstLine: function () {
                var newLine = new sap.m.ColumnListItem();

                // @ts-ignore
                newLine.addCell(new sap.m.Text({ text: "1" }));
                // @ts-ignore
                newLine.addCell(new sap.m.DatePicker({ value: "2015-11-23", valueFormat: "yyyy-MM-dd", displayFormat: "long" }));
                // @ts-ignore
                newLine.addCell(new sap.m.DatePicker({ value: "2015-11-23", valueFormat: "yyyy-MM-dd", displayFormat: "long" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "50", type: "Number" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "1" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "1.2" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "100", type: "Number"  }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "사업자등록증" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "50", type: "Number"  }));

                return newLine;
            },
            onNonPriceItemAdd: function (e) {
                var tab = e.oSource.getParent().getParent();
                var newLine = new sap.m.ColumnListItem();
                var oIndex = e.oSource.getParent().getParent().getItems().length + 1;

                // @ts-ignore
                newLine.addCell(new sap.m.Text({ text: String(oIndex) }));
                // @ts-ignore
                newLine.addCell(new sap.m.DatePicker({ value: "2015-11-23", valueFormat: "yyyy-MM-dd", displayFormat: "long" }));
                // @ts-ignore
                newLine.addCell(new sap.m.DatePicker({ value: "2015-11-23", valueFormat: "yyyy-MM-dd", displayFormat: "long" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "" }));
                // @ts-ignore
                newLine.addCell(new sap.m.Input({ value: "" }));

                tab.addItem(newLine);
            },
            onNonPriceItemDelete: function (e) {
                var tab = e.oSource.getParent().getParent();
                var oDeleteItems = tab.getSelectedItems();

                for (var i = 0; i < oDeleteItems.length; i++) {
                    var oDeleteItem = oDeleteItems[i];
                    oDeleteItem.destroy();
                }

                var oItems = tab.getItems();
                for (var i = 0; i < oItems.length; i++) {
                    var oItem = oItems[i];
                    oItem.getCells()[0].setText(String(i + 1));
                }
            },
            destroy: function(){
                that._NonPriceInfPopup.destroy();
                that._NonPriceInfPopup = undefined;
            }
    });

    return NonPriceInf;
});