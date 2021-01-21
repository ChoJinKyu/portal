// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "ext/lib/util/Multilingual",
    "sap/ui/model/json/JSONModel",
    "../controller/SupplierSelection",
    // "dp/util/control/ui/MaterialMasterDialog"
    "../controller/MaterialMasterDialog",
    // "../contorller/NonPriceInf"

],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, MessageBox, Multilingual, JSON, SupplierSelection, MaterialMasterDialog) {
        // function (Controller, Filter, FilterOperator,MessageBox, Multilingual, JSON, SupplierSelection, MaterialMasterDialog) {
        "use strict";

        return Controller.extend("sp.sc.scQBCreate.controller.DetailPage2", {
            supplierSelection: new SupplierSelection(),

            onInit: function () {

                this.oRouter = this.getOwnerComponent().getRouter();
                // this.oRouter.attachBeforeRouteMatched(this._onProductMatched, this);
                this.oRouter.getRoute("detailPage2").attachPatternMatched(this._onProductMatched, this);

                // var oRichTextEditor = new sap.ui.richtexteditor.RichTextEditor("myRTE", {
                // 		editorType: new sap.ui.richtexteditor.EditorType.TinyMCE4,
                // 		width: "100%",
                // 		height: "600px",
                // 		customToolbar: true,
                // 		showGroupFont: true,
                // 		showGroupLink: true,
                // 		showGroupInsert: true,
                // 		value: "",
                // 		ready: function () {
                // 			this.addButtonGroup("styleselect").addButtonGroup("table");
                // 		}
                // 	});

                // 	this.getView().byId("abcd").addContent(oRichTextEditor);

                var temp = {
                    "list": [
                        {
                            "key": 0,
                            "col1": "cm",
                            "col2": "cm",
                            "col3": "cm",
                            "col4": "cm",
                            "col5": "cm",
                            "col6": "cm",
                            "col7": "cm",
                            "col8": "cm",
                            "col9": "cm",
                            "col10": "cm",
                            "col11": "cm",
                            "col12": "cm",
                            "col13": "cm",
                            "col14": "cm",
                            "col15": "cm",
                            "col16": "cm",
                            "col17": "cm",
                            "col18": "cm",
                            "col19": "cm",
                            "col20": "cm",
                            "col21": "cm",
                            "col22": "cm",
                            "col23": "cm",
                            "col24": "cm",
                            "col25": "cm",
                            "col26": "cm",
                            "col27": "cm",
                            "col28": "cm",
                            "col29": "cm",
                            "col30": "cm",
                            "col31": "cm",
                            "col32": "cm",
                            "col33": "cm",
                            "col34": "cm"
                        },
                        {
                            "key": 1,
                            "col1": "cm",
                            "col2": "cm",
                            "col3": "cm",
                            "col4": "cm",
                            "col5": "cm",
                            "col6": "cm",
                            "col7": "cm",
                            "col8": "cm",
                            "col9": "cm",
                            "col10": "cm",
                            "col11": "cm",
                            "col12": "cm",
                            "col13": "cm",
                            "col14": "cm",
                            "col15": "cm",
                            "col16": "cm",
                            "col17": "cm",
                            "col18": "cm",
                            "col19": "cm",
                            "col20": "cm",
                            "col21": "cm",
                            "col22": "cm",
                            "col23": "cm",
                            "col24": "cm",
                            "col25": "cm",
                            "col26": "cm",
                            "col27": "cm",
                            "col28": "cm",
                            "col29": "cm",
                            "col30": "cm",
                            "col31": "cm",
                            "col32": "cm",
                            "col33": "cm",
                            "col34": "cm"
                        },
                        {
                            "key": 3,
                            "col1": "cm",
                            "col2": "cm",
                            "col3": "cm",
                            "col4": "cm",
                            "col5": "cm",
                            "col6": "cm",
                            "col7": "cm",
                            "col8": "cm",
                            "col9": "cm",
                            "col10": "cm",
                            "col11": "cm",
                            "col12": "cm",
                            "col13": "cm",
                            "col14": "cm",
                            "col15": "cm",
                            "col16": "cm",
                            "col17": "cm",
                            "col18": "cm",
                            "col19": "cm",
                            "col20": "cm",
                            "col21": "cm",
                            "col22": "cm",
                            "col23": "cm",
                            "col24": "cm",
                            "col25": "cm",
                            "col26": "cm",
                            "col27": "cm",
                            "col28": "cm",
                            "col29": "cm",
                            "col30": "cm",
                            "col31": "cm",
                            "col32": "cm",
                            "col33": "cm",
                            "col34": "cm"
                        }
                    ],
                    "propInfo": {
                        outCome: "etc"
                    },
                    "slist": [],
                    "NPHeader": []
                };

                // var oModel = new JSONModel(temp.list);
                this.getView().setModel(new JSON(temp));
                this.getView().setModel(new JSON(temp.propInfo), "propInfo");
                this.getView().setModel(new JSON(temp.sTable), "sTable");

                var NPHeader = { "list": [{ h1: "AAAAA" }] };
                this._NPHeaderTemp = {
                    h1: "1",
                    h2: "RFQ",
                    h3: "",
                    h4: "",
                    h5: "",
                    h6: "",
                    h7: "",
                    Item: [],
                };
                this._NPItemTemp = { v1: "", v2: "", v3: "" };
                this.getView().setModel(new JSON(temp.NPHeader), "NPHeader");
                // this.getView().getModel().refresh();
                // this.getView().getModel().refresh(true);
                this.getView().getModel("NPHeader").refresh(true);
                // this.byId("tableNonPrice").setModel( new JSON(NPHeader), "NPHeader" );

            },
            onNavBack: function (e) {
                this.getOwnerComponent().getRouter().navTo("mainPage", {});
            },
            mTableOnCellClick: function (e) {
                alert("1");
                var oIndex = e.getParameters().rowIndex;
                var oPath = this.getView().byId("table1").getContextByIndex(oIndex).sPath;

                var oItem = this.getView().getModel().getProperty(oPath);
                var oKey = oItem.key;

                var oFilter = new Filter("key", "EQ", oKey);
                var oBinding = this.getView().byId("table_spacific").getBinding("items");
                oBinding.filter([oFilter]);


            },
            _onProductMatched: function (e) {

                this.getView().byId("panel_Header").setExpanded(true);
                this.getView().byId("panel_Control").setExpanded(true);
                this.getView().byId("panel_Content").setExpanded(true);

                console.log("_onProductMatched ");

                var datapickerOnSitePre = this.byId("datapickerOnSitePre");
                datapickerOnSitePre.setDateValue(new Date());

                this._type = e.getParameter("arguments").type;
                this._outcome = e.getParameter("arguments").outcome;

                var flag = e.mParameters.selected;
                var fromDate = this.getView().byId("periodFromDatePicker");
                var toDate = this.getView().byId("periodToDatePicker");


                var insertDate = new Date();
                var insertDate2 = new Date();
                fromDate.setDateValue(insertDate);
                fromDate.setEnabled(false);
                insertDate2.setHours(insertDate.getHours() + 120);
                toDate.setDateValue(insertDate2);

                //type, outcome 작업
                if (this._type == "2") {
                    this.byId("inputType").setValue("Competitive Bidding");
                } else {
                    this.byId("inputType").setValue("2-Step Bidding");
                }

                if (this._outcome == "1") {
                    this.byId("inputOutcome").setValue("BPA");
                } else if (this._outcome == "2") {
                    this.byId("inputOutcome").setValue("Tentative Price");
                } else if (this._outcome == "3") {
                    this.byId("inputOutcome").setValue("Supplier Development");
                } else if (this._outcome == "4") {
                    this.byId("inputOutcome").setValue("Investment PO");
                } else if (this._outcome == "5") {
                    this.byId("inputOutcome").setValue("Budget Price");
                } else if (this._outcome == "6") {
                    this.byId("inputOutcome").setValue("Negotiation Price");
                } else if (this._outcome == "7") {
                    this.byId("inputOutcome").setValue("Subsidiary Dev Unit Price");
                }


            },
            onPageEditButtonPress: function () {

                // //input 필드에 값 채우기
                // var items = this.getView().byId("midTable").getItems();

                // for(var i=0; i<items.length; i++){
                //     var item = items[i];
                //     var value = item.getCells()[1].getText();
                //     item.getCells()[2].setValue(value);
                // } 
            },
            _update: function (uPath, uArray) {

                var oModel = that.getView().getModel();
                var result;
                var promise = jQuery.Deferred();

                oModel.update(uPath, uArray, { "groupId": "batchUpdateGroup" }, {
                    async: false,
                    method: "POST",
                    success: function (data) {
                        promise.resolve(data);
                    }.bind(that),
                    error: function (data) {
                        promise.reject(data);
                    }

                });
                return promise;
            },
            onPageSaveButtonPress: function () {
                debugger;

            },
            //카테고리 코드 중복 체크
            usedCheckTextChange: function (e) {

            },

            onPageCancelButtonPress: function () {

            },
            onPageNavBackButtonPress: function () {
                //     var items = this.getView().byId("midTable").getItems();
                //     for(var i=0; i<items.length; i++){
                //         var item = items[i];
                //         item.destroy();
                //     }
                //     var oScr = this.getView().getModel("sm");
                //     oScr.setData({"screen":"M"});
                //     // this.getOwnerComponent().getRouter().navTo("Master");
                //     var oFCL = this.getView().getParent().getParent();
                //     oFCL.setLayout();
                //     this.getOwnerComponent().getRouter().navTo("Master", 
                //         {
                //             lflag: " ", 
                //             category_code: " ",
                //             use_flag: false
                //         });
                //     // this.oRouter.navTo("RouteApp");

                //     // var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
                //     // this.getRouter().navTo("mainPage", {layout: sNextLayout});
                // }

            },
            selectImmediately: function (e) {
                var flag = e.mParameters.selected;
                var fromDate = this.getView().byId("periodFromDatePicker");
                var toDate = this.getView().byId("periodToDatePicker");
                var insertDate = new Date();
                var insertDate2 = new Date();
                insertDate2.setHours(insertDate.getHours() + 120);
                toDate.setDateValue(insertDate2);

                if (flag == false) {
                    fromDate.setDateValue(new Date());
                    toDate.setDateValue(new Date());
                    fromDate.setEnabled(true);

                } else {
                    fromDate.setDateValue(insertDate);
                    fromDate.setEnabled(false);
                }
            },
            onSupplierResult: function (pToken) {

                // oSuppValueHelpDialog.close();
                // // $().sapui.k.setValue("aaa");
                // var oParent = oEvent.oSource.getParent().getController().getView();
                // oEvent.oSource.getParent().getController().onTest("1");
                // var specificTable = oParent.byId("table_spacific");
                // var addItem = oParent.byId("columnListItem_spacific").clone();
                // addItem.getCells()[0].setText("1");
                // addItem.getCells()[1].setText(aTokens[0].getKey());
                // addItem.getCells()[2].setText(aTokens[0].getText());
                // alert( this._oIndex);
                if (this._oIndex != null) {
                    var osTable = this.getView().getModel().oData.slist;

                    for (var i = 0; i < pToken.length; i++) {
                        var oData = {};
                        oData.key = this._oIndex;
                        oData.col1 = pToken[i].mProperties.key;
                        oData.col2 = pToken[i].mProperties.text;
                        osTable.push(oData);
                        console.log(this._oIndex, " : ", oData)
                    }

                    var bLength = this.getView().byId("table1").getRows()[this._oIndex].getCells()[13].getValue();
                    bLength = parseInt(bLength);
                    this.getView().byId("table1").getRows()[this._oIndex].getCells()[13].setValue(pToken.length + bLength);

                    // this.supplierSelection.onValueHelpSuppAfterClose();

                } else {
                    var oIndices = this._Indices;
                    for (var j = 0; j < oIndices.length; j++) {
                        var oInd = oIndices[j];

                        var osTable = this.getView().getModel().oData.slist;

                        for (var i = 0; i < pToken.length; i++) {
                            var oData2 = {};
                            oData2.key = oInd;
                            oData2.col1 = pToken[i].mProperties.key;
                            oData2.col2 = pToken[i].mProperties.text;
                            osTable.push(oData2);
                            console.log(j, " + ", i, " : ", oData2);
                        }

                        var bLength = this.getView().byId("table1").getRows()[oInd].getCells()[13].getValue();
                        bLength = parseInt(bLength);
                        this.getView().byId("table1").getRows()[oInd].getCells()[13].setValue(pToken.length + bLength);

                    }
                }




                // this.getView().getModel().refresh(true);



                // this.getView().byId("table_spacific").getModel().bindRows("/slist");




            },
            onSupplierButtonPress: function (e) {
                // var oIndex = e.getParameters().rowIndex;
                var oIndex = e.oSource.getParent().getIndex();
                var oPath = this.getView().byId("table1").getContextByIndex(oIndex).sPath;

                var oItem = this.getView().getModel().getProperty(oPath);
                var oKey = oItem.key;

                var oFilter = new Filter("key", "EQ", oKey);
                var oBinding = this.getView().byId("table_spacific").getBinding("items");
                oBinding.filter([oFilter]);

                this.getView().getModel().refresh(true);
            },
            onSupplierAllButton: function (e) {
                this._Indices = e.oSource.getParent().getParent().getSelectedIndices();
                this._oIndex = null;

                this.supplierSelection.showSupplierSelection(this, e, "L1100", "", true);

            },

            onSupplierPress: function (e) {
                debugger;
                this._oIndex = e.oSource.getParent().getIndex();

                this.supplierSelection.showSupplierSelection(this, e, "L1100", "", true);







                // $().sapui.k.setValue("aaa");
                // this.supplierSelection.showSupplierSelection(this, e, "L1100", "", true);
                // async function aa() {
                //     this.supplierSelection.showSupplierSelection(this, e, "L1100", "", true);
                //     var bb = this.supplierSelection.onValueHelpSuppOkPress("");
                //     return bb;
                // };

                // async function cc(){
                //     var dd = await aa();
                //     return dd;
                // }

                // cc().then(console.log);



                // alert("123");
                // function abc() {

                // };

                // async function getSupplier(that) {
                //     var aa = this.supplierSelection.showSupplierSelection(that, e, "L1100", "", true);
                //     return console.log('aa = ',aa);
                // }

                // async function bb(that) {
                //     var aa1 = await getSupplier(that);

                //     return aa1;
                // }

                // bb(this).then(console.log);
                // var bb = await getSupplier();

                // console.log(aa);
                //  if (!this._isAddPersonalPopup) {
                //     this._ManagerDialog = sap.ui.xmlfragment("valueHelpDialogSupplier", "sp.sc.scQBMgt.view.SupplierSelection", this);
                //     this.getView().addDependent(this._ManagerDialog);
                //     this._isAddPersonalPopup = true;
                // }

                // this._ManagerDialog.open();

            },
            onPartNoPress(e) {
                debugger;
                var materialItem;
                this._partnoIndex = e.oSource.getParent().getIndex();

                if (!this.oSearchMultiMaterialMasterDialog) {
                    this.oSearchMultiMaterialMasterDialog = new MaterialMasterDialog({
                        title: "Choose MaterialMaster",
                        MultiSelection: true,
                        items: {
                            filters: [
                                new Filter("tenant_id", "EQ", "L1100")
                            ]
                        }
                    });
                    this.oSearchMultiMaterialMasterDialog.attachEvent("apply", function (oEvent) {
                        materialItem = oEvent.mParameters.item;

                        this.getView().byId("table1").getRows()[this._partnoIndex].getCells()[5].setValue(materialItem.material_code);
                        this.getView().byId("table1").getRows()[this._partnoIndex].getCells()[6].setText(materialItem.material_desc);
                        console.log("materialItem : ", materialItem);

                    }.bind(this));

                }
                this.oSearchMultiMaterialMasterDialog.open();

            },
            onAddNonPrice(e) {
                if (!this._NonPriceInfPopup) {
                    this._NonPriceInfPopup = sap.ui.xmlfragment("NonPriceInf", "sp.sc.scQBCreate.view.NonPriceInf", this);
                    var NPInfPopupUtil = new JSON({ type: "1" });
                    this.getView().setModel(NPInfPopupUtil, "NPInfPopupUtil");


                    this.getView().addDependent(this._NonPriceInfPopup);
                    // this._isAddPersonalPopup = true;
                }
                if (!this._NPFirstLineItem) {
                    this._NPFirstLineItem = this._NPFirstLine();
                }

                this._NonPriceInfPopup.open();

            },
            _getNPPopupData(e) {
                var PVbox = e.oSource.getParent().getContent()[0].getItems()[0];
                
                var oNPHeaderData = {};
                oNPHeaderData.h1 = PVbox.getItems()[0].getItems()[0].getItems()[1].getSelectedItem().getText();
                oNPHeaderData.h2 = PVbox.getItems()[0].getItems()[1].getItems()[1].getValue();
                oNPHeaderData.h3 = PVbox.getItems()[1].getItems()[0].getItems()[1].getValue();
                oNPHeaderData.h4 = PVbox.getItems()[2].getItems()[0].getItems()[1].getSelectedItem().getText();
                oNPHeaderData.h5 = PVbox.getItems()[2].getItems()[1].getItems()[1].getSelectedItem().getText();
                oNPHeaderData.h6 = PVbox.getItems()[2].getItems()[2].getItems()[1].getValue();




                // var oNPHeaderData = {   h1: "AA",
                //                         h2: "A",
                //                         h3: "B",
                //                         h4: "C",
                //                         h5: "E",
                //                         h6: "F"
                //     };


                var typeFlagModel = this.getView().getModel("NPInfPopupUtil");
                var typeFlag = typeFlagModel.oData.type;


                var tab = e.oSource.getParent().getContent()[0].getItems()[1].getItems()[0].getContent()[0];
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
                // debugger;


            },
            _NPTableArrayAdd(NPHeaderData) {
                var oModel = this.getView().getModel();
                var oNPHeader = oModel.oData.NPHeader;

                oNPHeader.push(NPHeaderData);
                oModel.refresh(true);

            },
            _NPTableArrauUpdate(NPHeaderData) {
                var oModel = this.getView().getModel();
                var oNPHeader = oModel.oData.NPHeader;

                oNPHeader[this._NPSelectIndex] = NPHeaderData;


                oModel.refresh(true);
                // console.log("oRow = ",oRow);
                console.log("oNPHeader = ", oNPHeader);

            },
            _NPTableClear(e) {
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
                var tab = e.oSource.getParent().getContent()[0].getItems()[1].getItems()[0].getContent()[0];
                var oItems = tab.getItems();
                for (var i = 0; i < oItems.length; i++) {
                    var oItem = oItems[i];
                    oItem.destroy();
                }
                var newLine = this._NPFirstLine();
                tab.addItem(newLine);

            },
            onDeleteNonPrice(e) {
                var tab = this.byId("tableNonPrice");
                var oIndices = tab.getSelectedIndices();
                oIndices.reverse();
                var oNPHeader = this.getView().getModel().oData.NPHeader;
                for (var i = 0; i < oIndices.length; i++) {
                    var oIndex = oIndices[i];
                    oNPHeader.splice(oIndex, 1);
                }

                this.getView().getModel().refresh(true);
                tab.clearSelection();
            },
            onNonPriceInfCancel(e) {
                this._NonPriceInfPopup.close();
            },
            _NPCreateHeader() {
                var oTempHeader = this._NPHeaderTemp;
                return oTempHeader;
            },
            selectNPTypeChange(e) {
                var typeFlagModel = this.getView().getModel("NPInfPopupUtil");
                var oKey = e.getParameters().selectedItem.mProperties.key;
                var typeFlag = { type: oKey };
                typeFlagModel.setData(typeFlag);

                var tab = e.oSource.getParent().getParent().getParent().getParent().getItems()[1].getItems()[0].getContent()[0];
                var oItems = tab.getItems();
                for (var i = 0; i < oItems.length; i++) {
                    var oItem = oItems[i];
                    oItem.destroy();
                }
                var newLine = this._NPFirstLine();
                tab.addItem(newLine);
            },
            onNonPriceItemAdd(e) {
                var tab = e.oSource.getParent().getParent();
                var newLine = new sap.m.ColumnListItem();
                var oIndex = e.oSource.getParent().getParent().getItems().length + 1;

                newLine.addCell(new sap.m.Text({ text: String(oIndex) }));
                newLine.addCell(new sap.m.DatePicker({ value: "2015-11-23", valueFormat: "yyyy-MM-dd", displayFormat: "long" }));
                newLine.addCell(new sap.m.DatePicker({ value: "2015-11-23", valueFormat: "yyyy-MM-dd", displayFormat: "long" }));
                newLine.addCell(new sap.m.Input({ value: "" }));
                newLine.addCell(new sap.m.Input({ value: "" }));
                newLine.addCell(new sap.m.Input({ value: "" }));
                newLine.addCell(new sap.m.Input({ value: "" }));
                newLine.addCell(new sap.m.Input({ value: "" }));
                newLine.addCell(new sap.m.Input({ value: "" }));

                tab.addItem(newLine);
            },
            onNonPriceItemDelete(e) {
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
            _NPFirstLine() {
                var newLine = new sap.m.ColumnListItem();

                newLine.addCell(new sap.m.Text({ text: "1" }));
                newLine.addCell(new sap.m.DatePicker({ value: "2015-11-23", valueFormat: "yyyy-MM-dd", displayFormat: "long" }));
                newLine.addCell(new sap.m.DatePicker({ value: "2015-11-23", valueFormat: "yyyy-MM-dd", displayFormat: "long" }));
                newLine.addCell(new sap.m.Input({ value: "50", type: "Number" }));
                newLine.addCell(new sap.m.Input({ value: "1" }));
                newLine.addCell(new sap.m.Input({ value: "1.2" }));
                newLine.addCell(new sap.m.Input({ value: "100", type: "Number"  }));
                newLine.addCell(new sap.m.Input({ value: "사업자등록증" }));
                newLine.addCell(new sap.m.Input({ value: "50", type: "Number"  }));

                return newLine;
            },
            onPressNPSelectButton(e) {
                this._NPSelectIndex = e.oSource.getParent().getIndex();
                this._NonPriceInfPopup.open();
            },
            NonPricePopupBeforeOpen(e) {
                var tab = e.oSource.getContent()[0].getItems()[1].getItems()[0].getContent()[0];
                tab.destroyItems();
                // 조회용
                if (this._NPSelectIndex >= 0) {
                    console.log("조회 번호", this._NPSelectIndex);
                    var oModel = this.getView().getModel();
                    var oNPHeader = oModel.oData.NPHeader[this._NPSelectIndex];
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
                    h5 = "1";

                    for (var i = 0; i < oNPHeader.item.length; i++) {
                        var aa = oNPHeader.item[i];
                        var addItem = this._NPFirstLine();
                        var oCells = addItem.getCells();
                        oCells[0].setText(String(i + 1));
                        debugger;
                        if (h4 == "1") {
                            oCells[1].setValue(aa.v1);
                            oCells[2].setValue(aa.v2);
                            oCells[3].setValue(aa.v3);

                        } else if (h4 == "2") {
                            oCells[4].setValue(aa.v1);
                            oCells[5].setValue(aa.v2);
                            oCells[6].setValue(aa.v3);

                        } else if (h4 == "3") {
                            oCells[7].setValue(aa.v1);
                            oCells[8].setValue(aa.v2);
                        }
                        tab.addItem(addItem);
                    }

                    var NPHeaderStr = new JSON({
                        h1: h1, h2: oNPHeader.h2, h3: oNPHeader.h3,
                        h4: h4, h5: h5, h6: oNPHeader.h6
                    });

                    var aa = this.getView().getModel("NPInfPopupUtil");
                    aa.setData({ type: h4, enabled: false });

                    console.log("NPHeaderStr = ", NPHeaderStr);
                } else {      //신규 생성용

                    var NPHeaderStr = new JSON({
                        h1: "1", h2: "", h3: "",
                        h4: "1", h5: "1", h6: ""
                    });

                    var aa = this.getView().getModel("NPInfPopupUtil");
                    aa.setData({ type: "1" });

                    var newLine = this._NPFirstLine();
                    tab.addItem(newLine);



                    // this.getView().getModel("NPInfPopupUtil").refresh(true);

                }
                this.getView().setModel(NPHeaderStr, "NPHeaderModel");

                //버튼 생성

                var ApplyButton = new sap.m.Button({
                    type: sap.m.ButtonType.Emphasized,
                    text: "Apply",
                    press: function (e) {
                        // this.onNonPriceInfApplyPress();
                        var oHeader = this._getNPPopupData(e);
                        var validationCheck = this._ApplyValidationCheck(e, oHeader);
                        if(validationCheck == false) return;
                        if (this._NPSelectIndex >= 0) {
                            this._NPTableArrauUpdate(oHeader);
                        } else {
                            this._NPTableArrayAdd(oHeader);
                        }
                        this._NonPriceInfPopup.close();
                        this._NPTableClear(e);
                    }.bind(this)
                });
                var CloseButton = new sap.m.Button({
                    type: sap.m.ButtonType.Emphasized,
                    text: "Close",
                    press: function (e) {
                        this._NonPriceInfPopup.close();
                        this._NPTableClear(e);
                    }.bind(this)
                });
                this._NonPriceInfPopup.setBeginButton(ApplyButton);
                this._NonPriceInfPopup.setEndButton(CloseButton);


            },
            _ApplyValidationCheck(e, inputHeader){

                this._NPNone(e);

                var oHeader = inputHeader;
                var oItems = inputHeader.item;
                console.log("oItems == ", oItems);
                var flag = true;
                var errorObject = []
                var oPopupType = this.getView().getModel("NPInfPopupUtil").oData.type;

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
                // if(oHeader.h6.length < 1){
                //     flag = false;
                //     errorObject.push("h6");
                // }

                var errItemObject = [];

                

                // Item 부분 입력 값 확인
                for(var i=0; i<oItems.length; i++){
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
                
                var ItemCheckFlag = this._NPCheckItem(e, oPopupType, oHeader.h6);
                if(ItemCheckFlag == false){
                    flag = false;
                }

                return flag;

            },
            _NPNone(e){
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
                var tab = e.oSource.getParent().getContent()[0].getItems()[1].getItems()[0].getContent()[0];
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
            _NPCheckItem(e, oPopupType, oTargetScore ){
                var tab = e.oSource.getParent().getContent()[0].getItems()[1].getItems()[0].getContent()[0];
                var oItems = tab.getItems();
                var IntType = oPopupType;
                var flag = true;
                
                // // Item  초기화
                // var tab = e.oSource.getParent().getContent()[0].getItems()[1].getItems()[0].getContent()[0];
                // var oItems = tab.getItems();
                // for(var i=0; i<oItems.length; i++){
                //     var oItem = oItems[i];
                //     var oCells = oItem.getCells();
                //     for(var j=1; j<oCells.length; j++){
                //         var oCell = oCells[j];
                //         oCell.setValueState("None");
                //     }
                // }

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
                        oCell.setValueStateText("Target Score보다 클 수 없음");
                    }
                    console.log("index ==== ",i);
                    console.log("targetScore : 점수 ==== ", Inth6, " : ", parseInt(value));
                }

                return flag;

            },
            _NPError(e, errorObject, errItemObject, oPopupType){
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
                var tab = e.oSource.getParent().getContent()[0].getItems()[1].getItems()[0].getContent()[0];
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
            NonPricePopupBeforeClose(e) {
                this._NPSelectIndex = undefined;
            }
        });
    });
