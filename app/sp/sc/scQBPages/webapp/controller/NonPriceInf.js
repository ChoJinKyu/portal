// @ts-nocheck
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
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (EventProvider, I18nModel, ODataModel, SearchField, JSONModel, Token, Filter, FilterOperator, Item, MessageToast, MessageBox) {
    "use strict";

    var that;

    var NonPriceInf = EventProvider.extend("sp.sc.scQBPages.NonPriceInf_ori", {



        init: function (oThis) {
            that = oThis;
            // if(!that._NPSelectIndex){
            var NPInfPopupUtil = new JSONModel({ type: "1" });
            that.getView().setModel(NPInfPopupUtil, "NPInfPopupUtil");
            // }

        },
        // onExit: function() {
        //     console.log( "onExit!!!!!!!!!");
        //     if (that._NonPriceInfPopup) {
        //         that._NonPriceInfPopup.destroy(true);
        //     }

        // },
        showNonPriceInfo: function () {

            if (!that._NonPriceInfPopup) {
                that._NonPriceInfPopup = sap.ui.xmlfragment("NonPriceInf", "sp.sc.scQBPages.view.NonPriceInf", this);
                that.getView().addDependent(that._NonPriceInfPopup);

            }

            that._NonPriceInfPopup.open();

        },
        NonPricePopupBeforeClose: function (e) {

            that._NPSelectIndex = undefined;
        },
        NonPricePopupBeforeOpen: function (e) {
            // 
            this._NPNone(e.oSource);
            var tab = e.oSource.getContent()[0].getItems()[2].getItems()[0].getContent()[0];
            tab.destroyItems();

            this._isEditMode = that.getView().getModel("propInfo").getData().isEditMode; //propInfo>/isEditMode

            // 조회용

            if (that._NPSelectIndex >= 0) {

                console.log("조회 번호", that._NPSelectIndex);
                var oModel = that.getView().getModel("NegoHeaders"); //viewModel

                var oNPHeader = that._selectedNPItem;//oModel.getData().ItemsNonPrice[that._NPSelectIndex];
                // var oNPHeader = oModel.oData.NPHeader[that._NPSelectIndex];
                // var oHeader = oNPHeaderModel.oData

                var h1;
                var h4;
                var h5;
                // if (oNPHeader.nonpr_supeval_attr_type_code == "Commercial") {
                //     h1 = "1";
                // } else if (oNPHeader.nonpr_supeval_attr_type_code == "Technical") {
                //     h1 = "2";
                // }
                // if (oNPHeader.nonpr_supeval_attr_val_type_cd == "Date") {
                //     h4 = "DATE";
                // } else if (oNPHeader.nonpr_supeval_attr_val_type_cd == "Number") {
                //     h4 = "NUMBER";
                // } else if (oNPHeader.nonpr_supeval_attr_val_type_cd == "Text") {
                //     h4 = "TEXT";
                // }
                h1 = (oNPHeader.nonpr_supeval_attr_type_code).toUpperCase();
                h4 = (oNPHeader.nonpr_supeval_attr_val_type_cd).toUpperCase();
                h5 = (oNPHeader.nonpr_score_comput_method_code).toUpperCase();
                // console.log()
                // if (oNPHeader.nonpr_score_comput_method_code == "Automatic") {
                //     h5 = "1";
                // } else {  //None
                //     h5 = "2";
                // }

                //oNPHeader.item
                for (var i = 0; i < oNPHeader.ItemsNonPriceDtl.length; i++) {
                    var aa = oNPHeader.ItemsNonPriceDtl[i];
                    var addItem = this._NPFirstLine();
                    var oCells = addItem.getCells();

                    oCells[0].setText(String(i + 1));

                    oCells[1].setDateValue( new Date(aa.supeval_from_date) );
                    oCells[2].setDateValue( new Date(aa.supeval_to_date) );
                    oCells[3].setValue(aa.supeval_from_value);
                    oCells[4].setValue(aa.supeval_to_value);
                    oCells[5].setValue(aa.supeval_text_value);
                    oCells[6].setValue(aa.supeval_score);

                    // if (h4 == "1") {

                    //     oCells[1].setValue(aa.v1);

                    //     oCells[2].setValue(aa.v2);

                    //     oCells[3].setValue(aa.v3);

                    // } else if (h4 == "2") {

                    //     oCells[4].setValue(aa.v1);

                    //     oCells[5].setValue(aa.v2);

                    //     oCells[6].setValue(aa.v3);

                    // } else if (h4 == "3") {

                    //     oCells[7].setValue(aa.v1);

                    //     oCells[8].setValue(aa.v2);
                    // }
                    tab.addItem(addItem);
                }

                var NPHeaderStr = new JSONModel({
                    h1: h1, 
                    h2: oNPHeader.nonpr_requirements_text, 
                    h3: oNPHeader.note_content,
                    h4: h4, 
                    h5: h5, 
                    h6: oNPHeader.target_score
                });

                var aa = that.getView().getModel("NPInfPopupUtil");
                aa.setData({ type: h4, enabled: false });

                console.log("NPHeaderStr = ", NPHeaderStr);
            } else {      //신규 생성용

                var NPHeaderStr = new JSONModel({
                    h1: "COMMERCIAL", h2: "", h3: "",
                    h4: "DATE", h5: "AUTOMATIC", h6: ""
                });

                var aa = that.getView().getModel("NPInfPopupUtil");
                aa.setData({ type: "DATE" });

                var newLine = this._NPFirstLine();
                // tab.addItem(newLine);



            }
            that.getView().setModel(NPHeaderStr, "NPHeaderModel");

            //버튼 생성


            var CloseButton = new sap.m.Button({
                // type: sap.m.ButtonType.Emphasized,
                text: "취소",
                press: function (e) {
                    that._NonPriceInfPopup.close();                    
                    this._NPTableClear(e);
                }.bind(this)
            });

            var ApplyButton = new sap.m.Button({
                type: sap.m.ButtonType.Emphasized,
                text: "적용",
                visible: this._isEditMode,
                press: function (e) {
                    var oHeader = this._getNPPopupData(e);
                    var validationCheck = this._ApplyValidationCheck(e, oHeader);
                    debugger;
                    if (validationCheck == false) return;
                    if (that._NPSelectIndex >= 0) {
                        this._NPTableArrayUpdate(oHeader);
                    } else {
                        this._NPTableArrayAdd(oHeader);
                    }
                    that._NonPriceInfPopup.close();
                    this._NPTableClear(e);
                }.bind(this)
            });

            that._NonPriceInfPopup.setBeginButton(CloseButton);

            that._NonPriceInfPopup.setEndButton(ApplyButton);
        },
        selectNPTypeChange: function (e) {
            var typeFlagModel = that.getView().getModel("NPInfPopupUtil");

            var oKey = e.getParameters().selectedItem.mProperties.key;
            var typeFlag = { type: oKey };
            // that.getView().getModel("NPInfPopupUtil").oData.type = oKey;


            typeFlagModel.setData(typeFlag);

            var tab = e.oSource.getParent().getParent().getParent().getParent().getItems()[2].getItems()[0].getContent()[0];
            var oItems = tab.getItems();
            for (var i = 0; i < oItems.length; i++) {
                var oItem = oItems[i];
                oItem.destroy();
            }
            var newLine = this._NPFirstLine();
            // tab.addItem(newLine);
        },
        _NPNone: function (e) {
            // Header 초기화
            var PVbox = e.getContent()[0].getItems()[0];
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
            var tab = e.getContent()[0].getItems()[2].getItems()[0].getContent()[0];
            var oItems = tab.getItems();
            for (var i = 0; i < oItems.length; i++) {
                var oItem = oItems[i];
                var oCells = oItem.getCells();
                for (var j = 1; j < oCells.length; j++) {
                    var oCell = oCells[j];
                    oCell.setValueState(sValueState);
                }
            }

        },
        _NPTableArrayAdd: function (NPHeaderData) {
            var oModel = that.getView().getModel("NegoHeaders");//that.getView().getModel("viewModel");

            var oNPHeader = oModel.getData().ItemsNonPrice;// oModel.oData.NPHeader;

            oNPHeader.push(NPHeaderData);
            oModel.refresh(true);

            that.getView().byId("tableNonPrice").setVisibleRowCountMode("Fixed");
            that.getView().byId("tableNonPrice").setVisibleRowCount( oNPHeader.length );


        },
        _NPTableArrayUpdate: function (NPHeaderData) {
            var oModel = that.getView().getModel("NegoHeaders");//that.getView().getModel("viewModel");

            var oNPHeader = oModel.getData().ItemsNonPrice;// oModel.oData.NPHeader;

            oNPHeader[that._NPSelectIndex] = NPHeaderData;

            oModel.refresh(true);
            // console.log("oRow = ",oRow);
            console.log("oNPHeader = ", oNPHeader);

        },
        _ApplyValidationCheck: function (e, inputHeader) {

            this._NPNone(e.oSource.getParent());

            var oHeader = inputHeader;
            var oItems = inputHeader.ItemsNonPriceDtl;//inputHeader.item;
            console.log("oItems == ", oItems);
            var flag = true;
            var errorObject = []

            var oPopupType = that.getView().getModel("NPInfPopupUtil").oData.type;

            // Header 부분 입력 값 확인
            if (oHeader.nonpr_supeval_attr_type_code.length < 1) {
                flag = false;
                errorObject.push("h1");
            }
            if (oHeader.nonpr_requirements_text.length < 1) {
                flag = false;
                errorObject.push("h2");
            }
            if (oHeader.nonpr_supeval_attr_val_type_cd.length < 1) {
                flag = false;
                errorObject.push("h4");
            }
            if (oHeader.nonpr_score_comput_method_code.length < 1) {
                flag = false;
                errorObject.push("h5");
            }
            if (oHeader.target_score.length < 1) {
                flag = false;
                errorObject.push("h6");
            } else {
                var ItemCheckFlag = this._NPCheckItem(e, oPopupType, oHeader.target_score);
                if (ItemCheckFlag == false) {
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

            // var type = that.getView().getMode("NPHeaderModel").h4;

            // Item 부분 입력 값 확인
            for (var i = 0; i < oItems.length; i++) {

                var oItem = oItems[i];
                var Iflag = true;
                var oErrorRow = [];

                var checkTemp1 = oPopupType === "DATE" ? "supeval_from_date" : oPopupType === "NUMBER" ? "supeval_from_value" : "supeval_text_value";
                var checkTemp2 = oPopupType === "DATE" ? "supeval_to_date" : oPopupType === "NUMBER" ? "supeval_to_value" : "supeval_score";
                var checkTemp3 = "supeval_score";

                if (oItems[i][checkTemp1] === null || oItems[i][checkTemp1].length < 1) {
                    Iflag = false;
                    oErrorRow.push("1");
                }
                if (oItems[i][checkTemp2] === null || oItems[i][checkTemp2].length < 1) {
                    Iflag = false;
                    oErrorRow.push("2");
                }
                if (oPopupType != "3") {
                    if (oItems[i][checkTemp3].length < 1) {
                        Iflag = false;
                        oErrorRow.push("3");
                    }
                }
                // if (oItems[i].v1.length < 1) {
                //     Iflag = false;
                //     oErrorRow.push("1");
                // }
                // if (oItems[i].v2.length < 1) {
                //     Iflag = false;
                //     oErrorRow.push("2");
                // }
                // if (oPopupType != "3") {
                //     if (oItems[i].v3.length < 1) {
                //         Iflag = false;
                //         oErrorRow.push("3");
                //     }
                // }

                if (Iflag == false) {
                    flag = false;
                    errItemObject.push({ index: i, value: oErrorRow });
                }
            }



            console.log("errItemObject ====== ", errItemObject);

            if (flag == false) {
                this._NPError(e, errorObject, errItemObject, oPopupType);
            }

            // var ItemCheckFlag = this._NPCheckItem(e, oPopupType, oHeader.h6);
            // if(ItemCheckFlag == false){
            //     flag = false;
            // }

            return flag;

        },
        _NPError: function (e, errorObject, errItemObject, oPopupType) {
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


            for (var i = 0; i < eObjects.length; i++) {
                var eOb = eObjects[i];
                if (eOb == "h1") {
                    h1.setValueState(sValueState);
                    h1.setValueStateText("필수 입력")
                } else if (eOb == "h2") {
                    h2.setValueState(sValueState);
                    h2.setValueStateText("필수 입력")
                } else if (eOb == "h3") {
                    h3.setValueState(sValueState);
                    h3.setValueStateText("필수 입력")
                } else if (eOb == "h4") {
                    h4.setValueState(sValueState);
                    h4.setValueStateText("필수 입력")
                } else if (eOb == "h5") {
                    h5.setValueState(sValueState);
                    h5.setValueStateText("필수 입력")
                } else if (eOb == "h6") {
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


            for (var k = 0; k < errItemObject.length; k++) {
                var errItem = errItemObject[k];
                var oItem = oItems[errItem.index];
                var oCells = oItem.getCells();
                
                // target score
                oCells[6].setValueState("Error");
                oCells[6].setValueStateText("필수 입력")

                // var oValue = errItem.
                // for (var j = 0; j < errItem.value.length; j++) {
                //     var CellNumber = errItem.value[j];
                //     CellNumber = parseInt(CellNumber) + (3 * IntType - 3);
                //     oCells[CellNumber].setValueState("Error");
                //     oCells[CellNumber].setValueStateText("필수 입력")
                // }

                console.log("errItem === ", errItem);
            }

        },
        _NPCheckItem: function (e, oPopupType, oTargetScore) {
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

            if (oItems.length < 1) {
                flag = false;
                MessageToast.show("평가 항목을 입력해 주세요.");
                // alert("Item = 0!!!");
            }
            // if( oTargetScore != "" ) {

            // Target Score : Item 점수 비교 => Target Score >= Item 점수
            var Inth6 = parseInt(oTargetScore);


            for (var i = 0; i < oItems.length; i++) {
                var oItem = oItems[i];
                var oCell = oItem.getCells()[6];
                if (IntType == "DATE") {
                    // oCell = oItem.getCells()[3];

                    // Date 값 validation check
                    if (oItem.getCells()[1].isValidValue() == false) {
                        oItem.getCells()[1].setValueState("Error");
                        oItem.getCells()[1].setValueStateText("Date Type Check");
                        flag = false;
                        continue;
                    }
                    if (oItem.getCells()[2].isValidValue() == false) {
                        oItem.getCells()[2].setValueState("Error");
                        oItem.getCells()[2].setValueStateText("Date Type Check");
                        flag = false;
                        continue;
                    }

                    // if(oItem.getCells()[1].getDateValue() == null || oItem.getCells()[2].getDateValue() == null ){
                    //     oItem.getCells()[1].setValueState("Error");
                    //     oItem.getCells()[1].setValueStateText("필수 입력");
                    //     oItem.getCells()[2].setValueState("Error");
                    //     oItem.getCells()[2].setValueStateText("필수 입력");

                    //     flag = false;
                    //     continue;
                    // }

                    if (oItem.getCells()[1].getDateValue() > oItem.getCells()[2].getDateValue() ){//&& oItem.getCells()[1].getDateValue() != null && oItem.getCells()[2].getDateValue() != null) {
                        oItem.getCells()[1].setValueState("Error");
                        // oItem.getCells()[1].setValueStateText("'Response Value From'은 'Response Value To'보다 클 수 없습니다.");
                        oItem.getCells()[1].setValueStateText("'Response Value From' must be less than 'Response Value To'");
                        oItem.getCells()[2].setValueState("Error");
                        oItem.getCells()[2].setValueStateText("'Response Value From' must be less than 'Response Value To'");

                        flag = false;
                        console.log("from : to =====", oItem.getCells()[1].getValue(), " : ", oItem.getCells()[2].getValue());
                    }
                // } else if (IntType == "2") {
                //     oCell = oItem.getCells()[6];
                // } else if (IntType == "3") {
                //     oCell = oItem.getCells()[8];
                }else if( IntType == "NUMBER") {
                    if( Number(oItem.getCells()[3].getValue()) > Number(oItem.getCells()[4].getValue()) ){//&& oItem.getCells()[1].getDateValue() != null && oItem.getCells()[2].getDateValue() != null) {
                        oItem.getCells()[3].setValueState("Error");
                        oItem.getCells()[3].setValueStateText("'Response Value From' must be less than 'Response Value To'");
                        oItem.getCells()[4].setValueState("Error");
                        oItem.getCells()[4].setValueStateText("'Response Value From' must be less than 'Response Value To'");

                        flag = false;
                        console.log("from : to =====", oItem.getCells()[3].getValue(), " : ", oItem.getCells()[4].getValue());
                    }
                }
                var value = oCell.getValue();

                if (parseInt(value) > Inth6) {
                    flag = false;
                    oCell.setValueState("Error");
                    oCell.setValueStateText("Each score value must be less than Target Score");
                }
                console.log("index ==== ", i);
                console.log("targetScore : 점수 ==== ", Inth6, " : ", parseInt(value));
            }
            // }else {
            //     flag = false;
            // }

            return flag;

        },
        _getNPPopupData: function (e) {
            var PVbox = e.oSource.getParent().getContent()[0].getItems()[0];

            var oNPHeaderData = {
                _row_state_                         : that._selectedNPItem === null ? "C" : "",
                nonpr_supeval_attr_type_code        : PVbox.getItems()[0].getItems()[0].getItems()[1].getSelectedItem().getKey(),
                nonpr_supeval_attr_type             : {nonpr_supeval_attr_type_nm      : PVbox.getItems()[0].getItems()[0].getItems()[1].getSelectedItem().getText() },
                nonpr_requirements_text             : PVbox.getItems()[0].getItems()[1].getItems()[1].getValue(),
                note_content                        : PVbox.getItems()[1].getItems()[0].getItems()[1].getValue(),
                nonpr_supeval_attr_val_type_cd      : PVbox.getItems()[2].getItems()[0].getItems()[1].getSelectedItem().getKey(),
                nonpr_supeval_value_type            : { nonpr_supeval_attr_type_name    : PVbox.getItems()[2].getItems()[0].getItems()[1].getSelectedItem().getText() },
                nonpr_score_comput_method_code      : PVbox.getItems()[2].getItems()[1].getItems()[1].getSelectedItem().getKey(),
                nonpr_score_comput_method           : { nonpr_score_comput_method_name  : PVbox.getItems()[2].getItems()[1].getItems()[1].getSelectedItem().getText() },
                target_score                        : PVbox.getItems()[2].getItems()[2].getItems()[1].getValue(),

                nonpr_item_number                   : that._selectedNPItem.nonpr_item_number,
                nego_header_id                      : that._selectedNPItem.nego_header_id,
                tenant_id                           : that._selectedNPItem.tenant_id

            };
            // oNPHeaderData._row_state_                       = that._selectedNPItem === null ? "C" : "";//"C";
            // oNPHeaderData.nonpr_supeval_attr_type_code      = PVbox.getItems()[0].getItems()[0].getItems()[1].getSelectedItem().getKey();//.toUpperCase();
            // oNPHeaderData.nonpr_supeval_attr_type.nonpr_supeval_attr_type_nm= PVbox.getItems()[0].getItems()[0].getItems()[1].getSelectedItem().getText();
            // oNPHeaderData.nonpr_requirements_text           = PVbox.getItems()[0].getItems()[1].getItems()[1].getValue();
            // oNPHeaderData.note_content                      = PVbox.getItems()[1].getItems()[0].getItems()[1].getValue();
            // oNPHeaderData.nonpr_supeval_attr_val_type_cd    = PVbox.getItems()[2].getItems()[0].getItems()[1].getSelectedItem().getKey();//.toUpperCase();
            // oNPHeaderData.nonpr_supeval_value_type.nonpr_supeval_attr_type_name= PVbox.getItems()[2].getItems()[0].getItems()[1].getSelectedItem().getText();
            // oNPHeaderData.nonpr_score_comput_method_code    = PVbox.getItems()[2].getItems()[1].getItems()[1].getSelectedItem().getKey();//.toUpperCase();
            // oNPHeaderData.nonpr_score_comput_method.nonpr_score_comput_method_name= PVbox.getItems()[2].getItems()[1].getItems()[1].getSelectedItem().getText();
            // oNPHeaderData.target_score                      = PVbox.getItems()[2].getItems()[2].getItems()[1].getValue();

            // oNPHeaderData.h1 = PVbox.getItems()[0].getItems()[0].getItems()[1].getSelectedItem().getText();
            // oNPHeaderData.h2 = PVbox.getItems()[0].getItems()[1].getItems()[1].getValue();
            // oNPHeaderData.h3 = PVbox.getItems()[1].getItems()[0].getItems()[1].getValue();
            // oNPHeaderData.h4 = PVbox.getItems()[2].getItems()[0].getItems()[1].getSelectedItem().getText();
            // oNPHeaderData.h5 = PVbox.getItems()[2].getItems()[1].getItems()[1].getSelectedItem().getText();
            // oNPHeaderData.h6 = PVbox.getItems()[2].getItems()[2].getItems()[1].getValue();

            var typeFlagModel = that.getView().getModel("NPInfPopupUtil");

            var typeFlag = typeFlagModel.oData.type;


            var tab = e.oSource.getParent().getContent()[0].getItems()[2].getItems()[0].getContent()[0];
            var oItems = tab.getItems();
            var oItemArray = [];
            for (var i = 0; i < oItems.length; i++) {
                var oItem = oItems[i];
                var sItem = {};

                sItem.supeval_from_date     = oItem.getCells()[1].getDateValue();
                sItem.supeval_to_date       = oItem.getCells()[2].getDateValue();
                sItem.supeval_from_value    = oItem.getCells()[3].getValue();
                sItem.supeval_to_value      = oItem.getCells()[4].getValue();
                sItem.supeval_text_value    = oItem.getCells()[5].getValue();
                sItem.supeval_score         = oItem.getCells()[6].getValue();

                sItem.nonpr_item_number     = oNPHeaderData.nonpr_item_number;
                sItem.nego_header_id        = oNPHeaderData.nego_header_id;
                sItem.tenant_id             = oNPHeaderData.tenant_id;
                    
                //  if (typeFlag == "1") {
                //     sItem.v1 = oItem.getCells()[1].getValue();
                //     sItem.v2 = oItem.getCells()[2].getValue();
                //     sItem.v3 = oItem.getCells()[3].getValue();
                // } else if (typeFlag == "2") {
                //     sItem.v1 = oItem.getCells()[4].getValue();
                //     sItem.v2 = oItem.getCells()[5].getValue();
                //     sItem.v3 = oItem.getCells()[6].getValue();
                // } else if (typeFlag == "3") {
                //     sItem.v1 = oItem.getCells()[7].getValue();
                //     sItem.v2 = oItem.getCells()[8].getValue();
                // }
                oItemArray.push(sItem);
            }

            // oNPHeaderData.item = oItemArray;
            oNPHeaderData.ItemsNonPriceDtl = oItemArray;

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
            PVbox.getItems()[0].getItems()[0].getItems()[1].setSelectedKey("COMMERCIAL");
            PVbox.getItems()[0].getItems()[1].getItems()[1].setValue("");
            PVbox.getItems()[1].getItems()[0].getItems()[1].setValue("");
            PVbox.getItems()[2].getItems()[0].getItems()[1].setSelectedKey("DATE");
            PVbox.getItems()[2].getItems()[1].getItems()[1].setSelectedKey("AUTOMATIC");
            PVbox.getItems()[2].getItems()[2].getItems()[1].setValue("");

            // Item 부분 clear
            var tab = e.oSource.getParent().getContent()[0].getItems()[2].getItems()[0].getContent()[0];
            var oItems = tab.getItems();
            for (var i = 0; i < oItems.length; i++) {
                var oItem = oItems[i];
                oItem.destroy();
            }
            var newLine = this._NPFirstLine();
            // tab.addItem(newLine);

        },
        _NPFirstLine: function () {
            

            var newLine = new sap.m.ColumnListItem();
            var oDatePicker = new sap.m.DatePicker();
            oDatePicker.setDisplayFormat("yyyy/MM/dd");
            oDatePicker.setPlaceholder("YYYY/MM/DD");
            oDatePicker.setEditable(this._isEditMode);

            // <ObjectStatus icon="{
            //     path: 'NegoHeaders>_row_state_',
            //     formatter: '.formatter.toModelStateColumnIcon'
            // }" />
            // newLine.addCell(new sap.m.ObjectStatus({icon: {
            //     path: 'NegoHeaders>_row_state_',
            //     formatter: '.formatter.toModelStateColumnIcon'
            // }}));

            newLine.addCell(new sap.m.Text({ text: "1" }));

            newLine.addCell(oDatePicker.clone());

            newLine.addCell(oDatePicker.clone());

            // newLine.addCell(new sap.m.Input({ value: "", type: "Number" }));

            newLine.addCell(new sap.m.Input({ value: "", type: "Number" , editable: this._isEditMode}));

            newLine.addCell(new sap.m.Input({ value: "", type: "Number" , editable: this._isEditMode}));

            // newLine.addCell(new sap.m.Input({ value: "", type: "Number" }));

            newLine.addCell(new sap.m.Input({ value: "" , editable: this._isEditMode}));

            newLine.addCell(new sap.m.Input({ value: "", type: "Number" , editable: this._isEditMode}));

            return newLine;
        },
        onNonPriceItemAdd: function (e) {
            var tab = e.oSource.getParent().getParent();
            var newLine = new sap.m.ColumnListItem();
            var oIndex = e.oSource.getParent().getParent().getItems().length + 1;

            var oDatePicker = new sap.m.DatePicker(
                //     {
                //     change: function (e) {
                //         var flag;
                //         var oId = e.getParameters().id,
                //             sValue = e.getParameter("value"),
                //             bValid = e.getParameter("valid");
                //         var oInput = e.getSource();
                //         if (bValid) {
                //             oInput.setValueState("None");
                //         } else {
                //             oInput.setValueState("Error");
                //         }
                //     }
                // }
            );
            oDatePicker.setDisplayFormat("yyyy/MM/dd");
            oDatePicker.setPlaceholder("YYYY/MM/DD");
            oDatePicker.setEditable(this._isEditMode);

            // newLine.addCell(new sap.m.ObjectStatus({icon: {
            //     path: 'NegoHeaders>_row_state_',
            //     formatter: '.formatter.toModelStateColumnIcon'
            // }}));

            newLine.addCell(new sap.m.Text({ text: String(oIndex) }));

            newLine.addCell(oDatePicker.clone());

            newLine.addCell(oDatePicker.clone());

            // newLine.addCell(new sap.m.Input({ value: "", type: "Number" }));

            newLine.addCell(new sap.m.Input({ value: "", type: "Number" , editable: this._isEditMode}));

            newLine.addCell(new sap.m.Input({ value: "", type: "Number" , editable: this._isEditMode}));

            // newLine.addCell(new sap.m.Input({ value: "", type: "Number" }));

            newLine.addCell(new sap.m.Input({ value: "" , editable: this._isEditMode}));

            newLine.addCell(new sap.m.Input({ value: "", type: "Number" , editable: this._isEditMode}));

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
        destroy: function () {
            that._NonPriceInfPopup.destroy();
            that._NonPriceInfPopup = undefined;
        },
        createConfirmBox: function () {

            MessageBox.confirm("Sprint#3 에 적용됩니다.", {});
        },
    });

    return NonPriceInf;
});