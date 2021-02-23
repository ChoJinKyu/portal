sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "ext/lib/util/Multilingual",
    "sap/ui/model/json/JSONModel"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, MessageBox, Multilingual, JSON) {
        "use strict";

        var micacodeArray = [];     //중복 체크용
        var deleteArray = [];       //DB 삭제용
        var deleteItems = [];       //화면 Item 삭제용
        var data;                  //view setModel용
        var oMaster;                //master 화면 컨트롤용
        var doubleFlag = "";
        var that;
        var textModel;   // I18N 모델 저장
        var langArray = []; //언어 저장

        var nodeIdTemp = 0;      // create시 node_id 생성용 (max node_id 조회후 처리) / update시 넘겨받은 node_id
        var parentNodeIdTemp = null;    // create시 0레벨 : null / 1레벨: 넘겨받은 node_id || update 시 넘겨받은 parent_node_id

        return Controller.extend("pg.mi.miCategory.controller.Detail", {
            onInit: function () {
                that = this;
                var oOwnerComponent = this.getOwnerComponent();

                this.oRouter = oOwnerComponent.getRouter();
                this.oModel = oOwnerComponent.getModel();
                var oMultilingual = new Multilingual();
                this.getView().setModel(oMultilingual.getModel(), "I18N");



                // this.oRouter.getRoute("master").attachPatternMatched(this._onProductMatched, this);
                this.oRouter.getRoute("Detail").attachPatternMatched(this._onProductMatched2, this);

                this._tab = this.getView().byId("midTable");
            },
            _flagUpdate: function (vflag) {
                var oView = this.getView();
                var json = new sap.ui.model.json.JSONModel();
                data = { "flag": vflag };
                json.setData(data);
                oView.setModel(json, "util");

            },
            _bind: function (oBinding, afilters) {
                if (afilters[0].oValue1 == undefined) {
                    return;
                }
                oBinding.filter(afilters);
                console.log("bind");
                return true;
            },
            _read: function (sPath, filter) {
                console.log(sPath);
                sPath = String(sPath);
                var promise = jQuery.Deferred();
                var oModel = this.getView().getModel();

                oModel.read(sPath, {
                    filters: filter,
                    method: "GET",
                    async: false,
                    success: function (data) {
                        promise.resolve(data);
                    }.bind(this),
                    error: function (data) {
                        alert("error");
                    }

                });
                return promise;
            },

            _onProductMatched2: function (e) {
                if (doubleFlag == "X") {
                    doubleFlag = "";
                    return;
                }
                console.log("_onProductMatched2 : ");

                oMaster = this.getView().getModel("master");
                deleteArray = [];       //DB 삭제용
                deleteItems = [];       //화면 Item 삭제용
                var items = this.getView().byId("midTable").getItems();
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    item.destroy();
                }


                //메시지 정보
                if (textModel == undefined) {
                    textModel = this.getView().getModel("I18N");
                    console.log("textModel : ", textModel);
                } else {

                }

                // console.log(e);
                this._cate = e.getParameter("arguments").tenant_id;

                // {tenant_id},{company_code},{org_code},{org_type_code},{category_code}
                this._tenant_id = e.getParameter("arguments").tenant_id;
                this._company_code = e.getParameter("arguments").company_code;
                this._org_code = e.getParameter("arguments").org_code;
                this._org_type_code = e.getParameter("arguments").org_type_code;
                this._category_code = e.getParameter("arguments").category_code;
                this._category_name = e.getParameter("arguments").category_name;
                this._use_flag = e.getParameter("arguments").use_flag;
                this._lflag = e.getParameter("arguments").lflag;
                this.parent_category_code = e.getParameter("arguments").p_category_code;
                this._parent_node_id = e.getParameter("arguments").p_node_id;




                var oBinding = this.getView().byId("midTable").getBinding("items");
                var afilters = [];


                this.getView().byId("edit_ParentCategoryCode").setText(this.parent_category_code);
                // this.getView().byId("show_ParentCategoryCode").setText(this.parent_category_code);

                // 스위치
                var useflag = this._use_flag === "false" ? false : true;
                var useFlagText = useflag === true ? "Yes" : "No";
                // this.getView().byId("switchUsed").setState(useflag);
                this.getView().byId("SegmentButtonUsed").setSelectedKey(String(this._use_flag));
                if (this._lflag == "0" || this._lflag == "1") {
                    this.getView().byId("SegmentButtonUsed").setSelectedKey("true");
                }

                this.getView().byId("textUsed").setText(useFlagText);
                if (this._lflag == "S") {

                    //Category 정보 조회 후 setModel
                    var oPath = "/MICategoryHierarchyStructure(tenant_id='" + this._tenant_id + "',category_code='" + this._category_code + "')";
                    this.getView().getModel().read(oPath, {
                        success: function (data) {
                            var oCategoryData = data;
                            var oJson = new JSON();
                            oJson.setData(oCategoryData);
                            this.getView().setModel(oJson, "MICategory");

                        }.bind(this)
                    }, this);
                    // var oCategoryData = this.getView().getModel().getProperty(oPath);



                    this._category_code = e.getParameter("arguments").category_code;
                    var newfilter = new Filter("category_code", FilterOperator.EQ, this._category_code);

                } else {
                    var newfilter = new Filter();
                    // this._category_code =  null ;



                }


                // this._company_code = this.getView().byId("buttonUsed").getSelectedKey() === "Yes" ? true : false,

                this._flagUpdate(this._lflag);
                afilters.push(newfilter);
                // oBinding.filter(afilters);

                var items = this.getView().byId("midTable").getItems();
                // if(items.length >0 ){
                //     for(var i=0; i<items.length; i++){
                //         var item = items[i];
                //         item.destroy();
                //     }
                // }
                this._bind(oBinding, afilters);
                console.log("bind 후");




                // oBinding.filter(afilters)

                // var btUsedKey = this.getView().byId("buttonUsed");


                if (this._lflag == "S") {



                    // 1레벨 시, parent_category_code visible
                    var levelData = oMaster.getData();
                    if (this.parent_category_code != " ") {
                        levelData.level = 1;
                        oMaster.setData(levelData);
                    } else {
                        levelData.level = 0;
                        oMaster.setData(levelData);
                    }

                    this.getView().byId("inputCode").setValue(this._category_code);
                    this.getView().byId("textCode").setText(this._category_code);

                    // 조회 중 상태로 수정
                    var oScr = this.getView().getModel("sm");
                    var oScrData = oScr.getData();
                    oScrData.screen = "S";
                    oScr.setData(oScrData);


                    // 수정모드일 경우, main list 에서 넘겨받은 node_id
                    nodeIdTemp = e.getParameter("arguments").node_id;
                    //    parentNodeIdTemp = e.getParameter("arguments").parent_node_id ;

                    //조회시 header 정보 보이게
                    this.getView().byId("headerContentId").setVisible(true);


                } else {
                    //생성시 header 정보 안보이게
                    this.getView().byId("headerContentId").setVisible(false);

                    if (items.length > 0) {
                        for (var i = 0; i < items.length; i++) {
                            var item = items[i];
                            item.destroy();
                        }
                    }

                    this.getView().byId("inputCode").setValue("");
                    this.getView().byId("inputCode").setValueState("None");
                    var oScr = this.getView().getModel("sm");
                    oScr.setData({ "screen": "U" });
                    var tab = this.getView().byId("midTable");
                    // var items = tab.getItems();
                    // if(items.length == 0){
                    // this.getView().getModel().refresh();
                    console.log("add");
                    this.onMidTableAddButtonPress();

                    // 신규 생성시 에만 max(node_id)+1 조회하여 생성시에 node id 로 처리하기
                    this.getView().getModel().read("/MIMaxNodeIDView", {
                        method: "GET",
                        async: false,
                        success: function (data) {
                            if (data) {
                                nodeIdTemp = parseInt(data.results[0].max_node_id);
                            }
                        }.bind(this),
                        error: function (data) {
                            alert("error");
                        }

                    });

                    // pattern 에 node_id,parent_node_id 추가
                    if (this._lflag == "1")    // 1레벨 생성
                    {
                        parentNodeIdTemp = this._parent_node_id;
                        // this.getView().byId("switchUsed").setState(true);
                        this.getView().byId("SegmentButtonUsed").setSelectedKey("Yes");

                    } else if (this._lflag == "0")    // 0레벨 생성
                    {
                        parentNodeIdTemp = null;
                        // this.getView().byId("switchUsed").setState(true);
                        this.getView().byId("SegmentButtonUsed").setSelectedKey("Yes");
                    }


                    // }
                    // this.$().onMidTableAddButtonPress();
                    // var columnListItemNewLine = new sap.m.ColumnListItem( {
                    // type: sap.m.ListType.Inactive,
                    // unread: false,
                    // vAlign: "Middle",
                    // cells: [
                    //     new sap.m.ComboBox({ value: " " }),

                    //     new sap.m.Input({ type: "Text", value: ""})
                    //     ]
                    // });
                    // this._tab.insertItem(columnListItemNewLine, 0);

                    // this._tab.getItems()[0].getCells()[0].addItem(new sap.ui.core.Item({ key: "KO", text: "KO"}));
                    // this._tab.getItems()[0].getCells()[0].addItem(new sap.ui.core.Item({ key: "EN", text: "EN"}));

                }
                // btUsedKey.setSelectedKey(this._use_flag);


                // var items = this._tab.getItems();
                // for(var i=0; i<items.length; i++){
                //     var item = items[i];
                //     var flagitem = item.sId.search("midTable");
                //     if(flagitem == -1){
                //         this._tab.removeItem(i);
                //     }
                // }



                var oModel = this.getView().getModel();



                oModel.read("/MICategoryHierarchyStructure", {
                    method: "GET",
                    async: false,
                    success: function (data) {
                        micacodeArray = [];
                        for (var i = 0; i < data.results.length; i++) {
                            micacodeArray.push(data.results[i].category_code);
                        }



                        console.log(micacodeArray);
                    }.bind(this),
                    error: function (data) {
                        alert("error");
                    }

                });
                doubleFlag = "X";
                if (this._lflag == "1") {
                    oMaster.setData({ "level": 1 });
                }


            },
            onAttachmentDeletePress: function () {
                // var tab = this.getView().byId("midTable");


            },
            updateStarted: function (e) {
                // return;
            },
            updateFinished: function (e) {
                // this._tab.addItem(this._item);
                // var oBinding = this.getView().byId("midTable").getBinding("items");
                // var afilters = [];
                // if(this._category_code == undefined || this._category_code == null){
                //     return;
                // }
                // var filter = new Filter("category_code", "EQ", this._category_code);


                // return;
                // alert("111");
            },
            // onMidTableUpdateFinished: function(e){
            //     var table = this.getView().byId("midTable") ;


            // },
            // onAfterRendering: function(e){
            //     // alert("1");
            // },
            // popinChanged: function(e){

            // },
            onMidTableAddButtonPress: function () {
                var table = this.getView().byId("midTable");
                var oModel = this.getView().getModel();
                // var columnListItemNewLine = new sap.m.ColumnListItem( {
                //     type: sap.m.ListType.Inactive,
                //     unread: false,
                //     vAlign: "Middle",
                //     cells: [
                //         new sap.m.ComboBox({ value: " " }),
                //         new sap.m.Text({ }),
                //         new sap.m.Input({ type: "Text", value: ""})
                //         ]
                // });

                var newLine = new sap.m.ColumnListItem();
                var oSelect = new sap.m.Select({ width: "10rem" });
                if (langArray.length == 0) {
                    var oFilter = new Filter("tenant_id", "EQ", "L2100");
                    oModel.read("/LanguageView", {
                        filters: [oFilter],
                        success: (function (data) {
                            langArray = data.results;
                            for (var i = 0; i < data.results.length; i++) {
                                var dataRow = data.results[i];
                                var oCode = dataRow.code;
                                var oCodeName = dataRow.code_name;
                                oSelect.addItem(new sap.ui.core.Item({ key: oCode, text: oCode + " - " + oCodeName }));
                            }
                            oSelect.setSelectedKey("KO");
                        })
                    }, this);
                } else {
                    for (var i = 0; i < langArray.length; i++) {
                        var dataRow = langArray[i];
                        var oCode = dataRow.code;
                        var oCodeName = dataRow.code_name;
                        oSelect.addItem(new sap.ui.core.Item({ key: oCode, text: oCode + " - " + oCodeName }));
                    }
                    oSelect.setSelectedKey("KO");

                }

                // oSelect.addItem(new sap.ui.core.Item({ key: "KO", text: "KO"}));
                // oSelect.addItem(new sap.ui.core.Item({ key: "EN", text: "EN"}));
                // oSelect.addItem(new sap.ui.core.Item({ key: "CN", text: "CN"}));
                // oSelect.setSelectedKey("KO");

                // var combo =  new sap.m.ComboBox( );
                // combo.addItem(new sap.ui.core.Item({ key: "KO", text: "KO"}));
                // combo.addItem(new sap.ui.core.Item({ key: "EN", text: "EN"}));
                // combo.addItem(new sap.ui.core.Item({ key: "CN", text: "CN"}));
                // combo.setSelectedKey("KO");

                // newLine.addCell( new sap.m.Text( {text : "L2100", visible:false, enabled:false}));
                // newLine.addCell( new sap.m.Text( {text : "*", visible:false, enabled:false}));
                // newLine.addCell( new sap.m.Text( {text : "BU", visible:false, enabled:false}));
                // newLine.addCell( new sap.m.Text( {text : "BIZ00100", visible:false, enabled:false}));
                newLine.addCell(oSelect);
                newLine.addCell(new sap.m.Text());
                newLine.addCell(new sap.m.Input());

                // var data = {
                //     tenant_id : "L2100",
                //     company_code : "*",
                //     org_type_code : "BU",
                //     org_code : "BIZ00100",
                //     category_code : this._category_code,
                //     language_code : "KO",
                //     category_name : "",
                //     local_create_dtm:  new Date(),
                //     local_update_dtm: new Date(),
                //     create_user_id: "Admin",
                //     update_user_id: "Admin",
                //     system_create_dtm: new Date(),
                //     system_update_dtm: new Date()
                // }
                // var setData = {
                //         "groupId":"createGroup",
                //         "properties" : data
                //     };
                // this._pro = oModel.createEntry("/MICategoryText", setData); 
                // // this.getView().setBindingContext(this._pro.sPath);

                // table.bindAggregation("items", this._pro.sPath, newLine);	

                // var model = this.getOwnerComponent().getModel();
                // var currentRows = model.getProperty(this._pro.sPath);
                // var newRows = currentRows.concat(newLine);
                // model.setProperty(this._pro.sPath, newRows);


                // this._createEntry = oModel.createEntry("/MICategoryText",{  groupId:"batchCreateGroup"})

                // this._tab.insertItem(newLine, 0);   
                this._tab.insertItem(newLine, 0);
                // this._item = newLine;
                // this.getView().getModel().setProperty("/MICategoryText/1", newLine);
                // this._pro = oModel.createEntry("/MICategoryText", setData); 
                // this.getView().setBindingContext("/MICategoryText/1");
                // table.bindItems("/MICategoryText", newLine , null, null);
                // this._tab.insertItem(columnListItemNewLine, 0);
                // // this._tab.addItem(columnListItemNewLine);
                // // var leng = this._tab.getItems().length - 1;

                // this._tab.getItems()[0].getCells()[0].addItem(new sap.ui.core.Item({ key: "KO", text: "KO"}));
                // this._tab.getItems()[0].getCells()[0].addItem(new sap.ui.core.Item({ key: "EN", text: "EN"}));
                // this._tab.getItems()[0].getCells()[0].addItem(new sap.ui.core.Item({ key: "CN", text: "CN"}));
                // this._tab.getItems()[0].getCells()[0].setSelectedKey("KO");

                // var oModel = this.getView().getModel();

                // var data = {
                //     tenant_id : "L2100",
                //     company_code : "*",
                //     org_type_code : "BU",
                //     org_code : "BIZ00100",
                //     category_code : "TEST",
                //     language_code : "KO",
                //     category_name : "TEST",
                //     local_create_dtm:  new Date(),
                //     local_update_dtm: new Date(),
                //     create_user_id: "Admin",
                //     update_user_id: "Admin",
                //     system_create_dtm: new Date(),
                //     system_update_dtm: new Date()
                // }
                // var setData = {
                //         "groupId":"createGroup",
                //         "properties" : data
                //     };
                // // oModel.setRefreshAfterChange(false);
                // this._pro = oModel.createEntry("MICategoryText", setData);
                // this.getView().setBindingContext(this._pro);



                // this._tab.getItems()[0].getCells()[0].setValue("English");

            },
            onPageDeleteButtonPress: function () {
                var that = this;
                var dFlag;
                // alert(textModel.getText("CONFIRM"));

                MessageBox.confirm(textModel.getText("/NCM00003"), {
                    // @ts-ignore
                    title: textModel.getText("/CONFIRM"),//that.getModel("I18N").getText("/SAVE"),
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        // this._tenant_id = e.getParameter("arguments").tenant_id;
                        // this._company_code = e.getParameter("arguments").company_code;
                        // this._org_code = e.getParameter("arguments").org_code;
                        // this._org_type_code = e.getParameter("arguments").org_type_code;
                        // this._category_code = e.getParameter("arguments").category_code;
                        // alert(that._tenant_id,that._company_code,that._org_code,that._org_type_code,that._category_code);
                        var deleteModelPath = "/MICategoryHierarchyStructure(tenant_id='" + that._tenant_id + "',category_code='" + that._category_code + "')";
                        var item = that.getView().getModel().getProperty(deleteModelPath);
                        var oFilters = [];
                        var oArrayHiePath = [];
                        var oFiltersMetaCode = [];
                        var oModel = that.getView().getModel();
                        

                        if (sButton === MessageBox.Action.OK) {

                            // 0level 삭제시, 1level 조회
                            var oFilter1 = new sap.ui.model.Filter("category_code", sap.ui.model.FilterOperator.EQ, item.category_code);

                            if (item.hierarchy_level == 1) {
                                oFilters.push(new sap.ui.model.Filter({ filters: [oFilter1], bAnd: false }));
                            } else {
                                var oFilter2 = new sap.ui.model.Filter("parent_category_code", sap.ui.model.FilterOperator.EQ, item.category_code);
                                oFilters.push(new sap.ui.model.Filter({ filters: [oFilter1, oFilter2], bAnd: false }));
                            }

                            var read0 = that._read("/MICategoryHierarchyStructure", oFilters);
                            read0.then(function (data) {
                                var oFilters0 = [];
                                for (var i = 0; i < data.results.length; i++) {
                                    var getdata = data.results[i];
                                    oFilters0.push(new sap.ui.model.Filter("category_code", sap.ui.model.FilterOperator.EQ, getdata.category_code));
                                    var gdata = String(getdata.__metadata.uri);
                                    var pathIndex = gdata.search("/MICategoryHierarchyStructure");
                                    var dpath = gdata.substring(pathIndex);
                                    oArrayHiePath.push(dpath);
                                    // oModel.remove(dpath, {"groupId":"batchUpdateGroup"});
                                }
                                oFiltersMetaCode.push(new sap.ui.model.Filter({ filters: oFilters0, bAnd: false }));

                                // MIMaterialCodeList에서 category_code 사용 중인지 확인
                                var read1 = that._read("/MIMaterialCode", oFiltersMetaCode);
                                read1.then(function (data) {
                                    if (data.results.length > 0) {
                                        sap.m.MessageToast.show(textModel.getText("/NPG00017"));
                                        oTreeTable.setEnableSelectAll(false);
                                        oModel.refresh();
                                        console.log("사용중, 데이터있음");
                                        console.log(data.results);
                                        return;
                                    } else {
                                        console.log("미사용중, 데이터없음");
                                    }
                                    var read2 = that._read("/MICategoryText", oFiltersMetaCode);
                                    read2.then(function (data) {

                                        // MICategoryHierarchyStructure 삭제

                                        for (var i = 0; i < oArrayHiePath.length; i++) {
                                            oModel.remove(oArrayHiePath[i], { "groupId": "deleteId" });
                                        }
                                        for (var i = 0; i < data.results.length; i++) {
                                            var getdata = data.results[i];
                                            console.log(getdata.language_code);
                                            var gdata = String(getdata.__metadata.uri);
                                            var pathIndex = gdata.search("/MICategoryText");
                                            var dpath = gdata.substring(pathIndex);
                                            oModel.remove(dpath, { "groupId": "deleteId" });
                                        }
                                        oModel.setUseBatch(true);
                                        oModel.submitChanges({
                                            async: false,
                                            // groupId: "changes",
                                            // groupId:"batchUpdateGroup",
                                            success: function (oData, oResponse) {
                                                sap.m.MessageToast.show(textModel.getText("/NCM01002"));
                                                console.log("oData", oData);
                                                console.log(" oResponse", oResponse);
                                                oModel.refresh();
                                                oMaster.setData({ "level": 0, "indices": 0 });
                                                that.getOwnerComponent().getRouter().navTo("Master", {
                                                    lflag: "M",
                                                    category_code: item.category_code,
                                                    use_flag: true
                                                });

                                                
                                                //count 조회 용
                                                var read1 = that._read("/MICategoryHierarchyStructureView", []);
                                                read1.then(function(data){
                                                    that.getView().getModel("Main").oData.count = data.results.length;
                                                    that.getView().getModel("Main").refresh(true);
                                                });

                                                var oFCL = that.getView().getParent().getParent();
                                                oFCL.setLayout();

                                                // oFCL.setLayout();
                                            },
                                            error: function (cc, vv) {
                                                sap.m.MessageToast.show(textModel.getText("/EPG00003"));
                                                // sap.m.MessageToast.show("Save failed! MICategoryHierarchyStructure");
                                                console.log("cc", cc);
                                                console.log("vv", vv);
                                            }
                                        });

                                    });
                                });
                            });
                        }
                        else {
                            return;
                        }
                    }
                });
            },
            onMidTableDeleteButtonPress: function () {
                // alert("1");
                var tab = this.getView().byId("midTable");
                var items = tab.getSelectedItems();
                // items.getBinding()
                deleteArray = tab.getSelectedContextPaths();
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    // tab.removeItem(item);

                    deleteItems.push(item);
                    item.destroy();
                    // var dpath = item.getBindingContextPath();
                    // deleteArray.push(dpath);
                }
                console.log(deleteArray);

            },
            onPageEditButtonPress: function () {
                this._flagUpdate("U");
                var oScr = this.getView().getModel("sm");
                oScr.setData({ "screen": "U" });

                //input 필드에 값 채우기
                var items = this.getView().byId("midTable").getItems();

                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var value = item.getCells()[1].getText();
                    item.getCells()[2].setValue(value);
                }



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
                // useFlag = this.getView().byId("buttonUsed").getSelectedKey() === "Yes" ? true : false,
                // @ts-ignore
                var oView = this.getView(),
                    that = this,
                    // useFlag = this.getView().byId("switchUsed").getState(),
                    useFlag = this.getView().byId("SegmentButtonUsed").getSelectedKey(),
                    oModel = this.getView().getModel();
                var tabItems = that.getView().byId("midTable").getItems();
                console.log("useFlag :", useFlag);
                useFlag = useFlag === "true" ? true : false;
                console.log("useFlag :", useFlag);
                var useFlagText = useFlag === true ? "Yes" : "No";

                var oLangK = 0;
                var oLangE = 0;
                var oLangC = 0;
                for (var i = 0; i < tabItems.length; i++) {
                    var item = tabItems[i];
                    var cells = item.getCells();
                    var cellLang = cells[0];
                    var csId = cells[0].sId;
                    if (csId.search("select") == -1) {
                        var lang = cellLang.getText();
                    } else {
                        lang = cellLang.getSelectedKey();
                    }
                    switch (lang) {
                        case "KO":
                            oLangK = oLangK + 1;
                            continue;
                        case "EN":
                            oLangE = oLangE + 1;
                            continue;
                        case "CN":
                            oLangC = oLangC + 1;
                            continue;
                    }
                }
                if (oLangK > 1 || oLangC > 1 || oLangE > 1) {
                    sap.m.MessageToast.show(textModel.getText("/NPG00018"));
                    console.log(oLangK);
                    console.log(oLangE);
                    console.log(oLangC);
                    return;
                }

                //키 언어 입력 필수(KO)
                if (oLangK < 1) {
                    sap.m.MessageToast.show(textModel.getText("/NPG00019"));
                    return;
                }


                if (this._lflag == "0" || this._lflag == "1") {

                } else {
                    this._codeCheck = true;
                }

                if (this._codeCheck != true) {
                    sap.m.MessageToast.show(textModel.getText("/NPG00021"));
                    return;
                }

                for (var i = 0; i < tabItems.length; i++) {
                    var item = tabItems[i];

                    var cells = item.getCells();
                    var categoryNameValue = cells[2].getValue();
                    var categoryNameValue2 = categoryNameValue.replace(" ", "");
                    if (categoryNameValue2.length < 1) {
                        sap.m.MessageToast.show(textModel.getText("/NPG00020"));
                        return;
                    }
                }





                var oItem = {
                    "tenant_id": this._tenant_id,     //String(5) not null  @title : '회사코드';
                    // "company_code"    : this._company_code,     //String(10) not null @title : '법인코드';
                    // "org_type_code"   : this._org_type_code,     //String(30) not null @title : '조직유형코드';
                    // "org_code"        : this._org_code,     //String(10) not null @title : '조직코드';
                    "node_id": nodeIdTemp,      //Integer not null    @title : '노드ID';
                    "sort_sequence": String(nodeIdTemp),
                    "hierarchy_level": parseInt(this._lflag),      //Integer             @title : '계층레벨';
                    "category_code": this.getView().byId("inputCode").getValue(),//"testCode1",     //String(40) not null @title : '카테고리코드';
                    // "category_name"   : this.getView().byId("inputName").getValue(), //String(240)         @title : '카테고리명';
                    //"category_name"   : category_name, //String(240)         @title : 'KO인 카테고리 name';
                    "parent_node_id": parseInt(parentNodeIdTemp),      //Integer             @title : '상위노드ID';
                    "parent_category_code": this._lflag === "0" ? null : this.parent_category_code,   //String(40)          @title : '상위카테고리코드';
                    // "filter_category_code" : this.getView().byId("inputCode").getValue(),//String(500)         @title : '필터카테고리코드';
                    "drillstate": this._lflag === "0" ? "expanded" : "leaf",     //String(10)          @title : '노드상태';
                    "use_flag": useFlag,   //Boolean not null    @title : '사용여부';

                    "create_user_id": "Admin",
                    "update_user_id": "Admin",
                    "system_create_dtm": new Date(),
                    "system_update_dtm": new Date(),
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date()
                }
                //(tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100',category_code='Raw%20Materials')
                // filter column 처리 위해 0 레벨인 경우에는 parent category 찾아서 추가되는 1레벨 category code 추가해줌
                var parentTargetPath = "(tenant_id='" + oItem.tenant_id + "',company_code='" + oItem.company_code + "',org_type_code='" + oItem.org_type_code + "',org_code='" + oItem.org_code + "',category_code='" + oItem.parent_category_code + "')";
                var tempProp = this.getView().getModel().getProperty("/MICategoryHierarchyStructure" + parentTargetPath);

                if (tempProp !== undefined) {
                    var tempFilterCode = (tempProp.hierarchy_level === 0 && tempProp.filter_category_code === null) ? tempProp.category_code : "";
                    tempProp.filter_category_code = tempFilterCode + ";" + oItem.category_code;
                }

                // if(this.validator.validate(this.byId("page")) !== true) return;
                // if( !this._isUseCreate ) {
                //     MessageBox.confirm("카테고리 사용여부 확인필요", {
                //         onClose : function(sButton) {
                //             return;
                //         }
                //     });
                // }
                // @ts-ignore
                // MessageBox.confirm(that.getModel("I18N").getText("/NCM0004"), {
                var oFCL = this.getView().getParent().getParent();
                var oScr = this.getView().getModel("sm");
                MessageBox.confirm(this.getView().getModel("I18N").getText("/NCM00001"), {
                    // @ts-ignore
                    title: this.getView().getModel("I18N").getText("/CONFIRM"),//that.getModel("I18N").getText("/SAVE"),
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            var oModel = that.getView().getModel();
                            if (data.flag == "U") {
                                //treeTable 수정
                                parentNodeIdTemp = that._parent_node_id;

                                var updatePath = "/MICategoryHierarchyStructure(tenant_id='" + that._tenant_id + "',category_code='"
                                    + that._category_code + "')";
                                if (that._parent_category_code == " ") {

                                }

                                var updateItem = {
                                    "node_id": parseInt(nodeIdTemp),      //Integer not null    @title : '노드ID';
                                    "sort_sequence": String(nodeIdTemp),
                                    "hierarchy_level": that.parent_category_code == " " ? 0 : 1,      //Integer             @title : '계층레벨';
                                    "parent_node_id": that.parent_category_code == " " ? null : parseInt(parentNodeIdTemp),      //Integer             @title : '상위노드ID';
                                    "parent_category_code": that.parent_category_code == " " ? null : that.parent_category_code,   //String(40)          @title : '상위카테고리코드';
                                    "drillstate": that.parent_category_code == " " ? "expanded" : "leaf",     //String(10)          @title : '노드상태';
                                    "use_flag": useFlag,   //Boolean not null    @title : '사용여부';
                                    "create_user_id": "Admin",
                                    "update_user_id": "Admin",
                                    "system_create_dtm": new Date(),
                                    "system_update_dtm": new Date(),
                                    "local_create_dtm": new Date(),
                                    "local_update_dtm": new Date()
                                }
                                var updateResult = that._update(updatePath, updateItem);
                                updateResult.then(function (data) {
                                    console.log(data);
                                });




                                //text 생성/삭제/수정
                                for (var i = 0; i < deleteArray.length; i++) {
                                    var removepath = deleteArray[i];
                                    that.getView().getModel().remove(removepath, { "groupId": "batchUpdateGroup" });
                                }
                                var items = that.getView().byId("midTable").getItems();
                                for (var i = 0; i < items.length; i++) {
                                    var item = items[i];


                                    var cells = item.getCells();
                                    var csId = cells[0].sId;
                                    var micatext = {
                                        "tenant_id": that._tenant_id,
                                        // "company_code"  : that._company_code,
                                        // "org_type_code" : that._org_type_code,
                                        // "org_code"      : that._org_code,
                                        "category_code": that.getView().byId("inputCode").getValue(),
                                        "language_code": "",
                                        "category_name": "",
                                        "local_create_dtm": new Date(),
                                        "local_update_dtm": new Date(),
                                        "create_user_id": "Admin",
                                        "update_user_id": "Admin",
                                        "system_create_dtm": new Date(),
                                        "system_update_dtm": new Date()
                                    };
                                    if (csId.search("select") == -1) {   //수정
                                        var sPath = item.getBindingContextPath();
                                        var upItem = that.getView().getModel().getProperty(sPath);
                                        micatext.language_code = cells[0].getText();
                                        micatext.category_name = cells[2].getValue();
                                        micatext.local_create_dtm = new Date(upItem.local_create_dtm);
                                        micatext.create_user_id = upItem.create_user_id;
                                        micatext.system_create_dtm = new Date(upItem.system_create_dtm);

                                        var result = that._update(sPath, micatext);

                                        result.then(function (data) {
                                            console.log(data);
                                        });

                                    } else { //생성
                                        var lang_code = cells[0].getSelectedKey();
                                        var cate_text = cells[2].getValue();
                                        micatext.language_code = lang_code;
                                        micatext.category_name = cate_text;

                                        console.log(micatext);
                                        var b = {
                                            // "groupId":"createGroup",
                                            "groupId": "batchCreateGroup",
                                            "properties": micatext
                                        };
                                        console.log(b);
                                        oModel.createEntry("/MICategoryText", b);

                                    }

                                }
                                for (var i = 0; i < items.length; i++) {
                                    var item = items[i];

                                    var cells = item.getCells();
                                    var csId = cells[0].sId;
                                    var category_text;
                                    var lang_code;

                                    if (csId.search("select") != -1) { // 생성 row
                                        lang_code = cells[0].getSelectedKey();
                                        category_text = cells[2].getValue();
                                    } else {                          // 수정 row
                                        lang_code = cells[0].getText();
                                        category_text = cells[2].getValue();
                                    }
                                    if (lang_code == "KO") {
                                        break;
                                    }
                                }

                                // oScr.setData({"screen":"M"});
                                oModel.setUseBatch(true);
                                oModel.submitChanges({
                                    async: false,
                                    success: function (oData, oResponse) {
                                        sap.m.MessageToast.show(textModel.getText("/NCM01001"));
                                        console.log("oData", oData);
                                        console.log(" oResponse", oResponse);
                                        // oFCL.setLayout();
                                        oScr.setData({ "screen": "D" });
                                        var items = that._tab.getItems();
                                        for (var i = 0; i < items.length; i++) {
                                            var item = items[i];
                                            item.destroy();
                                        }
                                        oModel.refresh();
                                        // that.getView().byId("midTable").getBinding("items");
                                        var utilModel = that.getView().getModel("util");
                                        var utilData = utilModel.getData();
                                        utilData.flag = "S";
                                        utilModel.setData(utilData);
                                        useFlagText = useFlag === true ? "Yes" : "No";
                                        that.getView().byId("textUsed").setText(useFlagText);
                                        oScr.setData({ "screen": "M" });
                                        // that.getView().byId("switchUsed").setState(useFlag);
                                        // console.log(String(useFlag));

                                        // that.getView().byId("SegmentButtonUsed").setSelectedKey(String(useFlag));
                                        that.getOwnerComponent().getRouter().navTo("Master", {
                                            lflag: "U",
                                            category_code: that.getView().byId("inputCode").getValue(),
                                            use_flag: false
                                        });
                                    },
                                    error: function (cc, vv) {
                                        // sap.m.MessageToast.show("Save failed!MICategoryHie");
                                        sap.m.MessageToast.show(textModel.getText("/EPG00003"));
                                        console.log("cc", cc);
                                        console.log("vv", vv);
                                    }
                                });

                                // that.getOwnerComponent().getRouter().navTo("Master", {
                                //     lflag: "U",
                                //     category_name: category_text,
                                //     use_flag: useFlag
                                // });


                            } else {
                                // Category 생성

                                oView.getModel().create('/MICategoryHierarchyStructure', oItem, {
                                    method: "POST",
                                    success: function () {

                                        // eslint-disable-next-line no-undef
                                        // alert("success");

                                        //조회에서 micategorytext 테이블
                                        var items = that.getView().byId("midTable").getItems();
                                        for (var i = 0; i < items.length; i++) {
                                            var item = items[i];

                                            var cells = item.getCells();
                                            var csId = cells[0].sId;
                                            if (csId.search("select") == -1) {
                                                continue;
                                            }
                                            var lang_code = cells[0].getSelectedKey();
                                            var cate_text = cells[2].getValue();
                                            var micatext = {
                                                "tenant_id": that._tenant_id,
                                                // "company_code"  : that._company_code,
                                                // "org_type_code" : that._org_type_code,
                                                // "org_code"      : that._org_code,
                                                "category_code": that.getView().byId("inputCode").getValue(),
                                                "language_code": lang_code,
                                                "category_name": cate_text,
                                                "local_create_dtm": new Date(),
                                                "local_update_dtm": new Date(),
                                                "create_user_id": "Admin",
                                                "update_user_id": "Admin",
                                                "system_create_dtm": new Date(),
                                                "system_update_dtm": new Date()
                                            };
                                            console.log(micatext);
                                            var b = {
                                                // "groupId":"createGroup",
                                                "groupId": "batchCreateGroup",
                                                "properties": micatext
                                            };
                                            console.log(b);
                                            oModel.createEntry("/MICategoryText", b);

                                            // oFCL.setLayout();
                                        }

                                        oModel.setUseBatch(true);
                                        oModel.submitChanges({
                                            async: false,
                                            // groupId: "changes",
                                            groupId: "batchCreateGroup",
                                            success: function (oData, oResponse) {
                                                sap.m.MessageToast.show(textModel.getText("/NCM01001"));
                                                console.log("oData", oData);
                                                console.log(" oResponse", oResponse);
                                                oFCL.setLayout();

                                                var items = that._tab.getItems();
                                                for (var i = 0; i < items.length; i++) {
                                                    var item = items[i];
                                                    // var flagitem = item.sId.search("midTable");
                                                    // if(flagitem == -1){
                                                    // that._tab.removeItem(i);
                                                    item.destroy();
                                                    // }
                                                }
                                                oModel.refresh();
                                                oScr.setData({ "screen": "M" });

                                                that.getOwnerComponent().getRouter().navTo("Master", {
                                                    lflag: "C",
                                                    category_code: that.getView().byId("inputCode").getValue(),
                                                    use_flag: false
                                                });


                                            },
                                            error: function (cc, vv) {
                                                sap.m.MessageToast.show(textModel.getText("/EPG00003"));
                                                // sap.m.MessageToast.show("Save failed!MICategoryText");
                                                console.log("cc", cc);
                                                console.log("vv", vv);
                                            }
                                        });

                                    },
                                    error: function () {
                                        // eslint-disable-next-line no-undef
                                        alert("error");
                                    }
                                });


                            }
                        }


                    }
                });







                // ------------------ //

                // var oModel = this.getView().getModel();
                // var tab = this.getView().byId("midTable");

                // if(this.getView().byId("buttonUsed").getSelectedKey() == "Yes"){
                //     var use_flag = true;
                // }else{
                //     var use_flag = false;
                // }
                // //멈춤
                // if(this._lflag == "S"){ // 업데이트 저장
                //     this._flagUpdate("S");
                // }else{  // 생성
                //     var oFCL = this.getView().getParent().getParent();
                //     oFCL.setLayout();
                // }
                // // sap.ui.getCore().byId("myList").getBinding("items").refresh();
                // // tab.getBinding("items").refresh(true);
                // // tab.getBinding.refresh(true);
                // // this.getView().getElementBinding().refresh(true);
                // // this.getView().getModel();
                // return;

                //  //생성
                // if(this._lflag == "0"){
                //     var parent_category_code = null,
                //         parent_category_name = null;


                // }else if(this._lflag == "S"){
                //                     //조회에서 micategorytext 테이블
                //                     var items =  this.getView().byId("midTable").getItems();
                //                     for(var i=0; i<items.length; i++){
                //                         var item = items[i];

                //                         var cells = item.getCells();
                //                         var csId = cells[0].sId;
                //                         if( csId.search("select") == -1){
                //                             continue;
                //                         }
                //                         var lang_code = cells[0].getValue();
                //                         var cate_text = cells[1].getValue();
                //                         var micatext = { 
                //                             "tenant_id"     : this._tenant_id,
                //                             "company_code"  : this._company_code,
                //                             "org_type_code" : this._org_type_code,
                //                             "org_code"      : this._org_code,
                //                             "category_code" : this.getView().byId("inputCode").getValue(),
                //                             "language_code" : lang_code,
                //                             "category_name" : cate_text,
                //                             "local_create_dtm": new Date(),
                //                             "local_update_dtm": new Date(),
                //                             "create_user_id": "Admin",
                //                             "update_user_id": "Admin",
                //                             "system_create_dtm": new Date(),
                //                             "system_update_dtm": new Date()
                //                         };
                //                         console.log(micatext);
                //                         var b = {
                //                                 // "groupId":"createGroup",
                //                                 "groupId":"batchUpdateGroup",
                //                                 "properties" : micatext
                //                         };
                //                         console.log(b);
                //                         oModel.createEntry("/MICategoryText", b);
                //                     // }

                //                     oModel.setUseBatch(true);
                //                     oModel.submitChanges({
                //                         async: false,
                //                         // groupId: "changes",
                //                         groupId:"batchUpdateGroup",
                //                         success: function (oData, oResponse) {
                //                             sap.m.MessageToast.show("Save completed.");
                //                             console.log("oData", oData);
                //                             console.log(" oResponse",  oResponse);
                //                         },
                //                         error: function (cc, vv) {
                //                             sap.m.MessageToast.show("Save failed!MICategoryText");
                //                             console.log("cc", cc);
                //                             console.log("vv",  vv);
                //                         }
                //                     });



                // var micatext = { 
                //     "tenant_id"     : this._tenant_id,
                //     "company_code"  : this._company_code
                //     "org_type_code" : this._org_type_code
                //     "org_code"      : this._org_code
                //     "category_code" : 
                //     "language_code" : 
                //     "category_name" : 
                // };

                // }







                // this._tenant_id = e.getParameter("arguments").tenant_id;
                // this._company_code = e.getParameter("arguments").company_code;
                // this._org_code = e.getParameter("arguments").org_code;
                // this._org_type_code = e.getParameter("arguments").org_type_code;
                // this._category_code = e.getParameter("arguments").category_code;
                // this._category_name = e.getParameter("arguments").category_name;
                // this._use_flag = e.getParameter("arguments").use_flag;
                // this._lflag = e.getParameter("arguments").lflag;
            },
            //카테고리 코드 중복 체크
            usedCheckTextChange: function (e) {


                var oView = this.getView();
                var json = new sap.ui.model.json.JSONModel();
                var inputCode = this.getView().byId("inputCode");


                // oInput.getBinding("value")

                if (this._lflag != "S") {
                    // 소문자 -> 대문자 변환
                    var tempValue = inputCode.getValue().toUpperCase();
                    // 공백 제거
                    tempValue = tempValue.replaceAll(" ", "");

                    inputCode.setValue(tempValue);
                    
                    // var value = e.getParameters().value;
                    var value = inputCode.getValue();
                    var result = micacodeArray.includes(value);

                    // 정규식 패턴 적용 (영문,숫자,'-' 만 가능. 영문은 무조건 대문자로)
                    var regExp = /^[A-Za-z0-9-]{1,}$/;
                    var result2 = regExp.test(value);



                    // 중복 확인
                    if (result == true) {
                        // data.flag = "t";
                        // json.setData(data);
                        // oView.setModel(json, "util");
                        inputCode.setValueState("Error");
                        inputCode.setValueStateText("사용불가(중복)");

                    } else if (result == false) {
                        // if(data.flag == "f"){ return ;}

                        // data.flag = "f";
                        // json.setData(data);
                        // oView.setModel(json, "util");


                        if (value) {
                            if (result2 == false) {
                                inputCode.setValueState("Error");
                                inputCode.setValueStateText("영문/숫자/특수문자('-'만 가능)");
                            } else {
                                inputCode.setValueState("Success");
                                inputCode.setValueStateText("사용가능");

                            }

                        } else {
                            inputCode.setValueState("Error");
                            inputCode.setValueStateText("값을 넣어주세요.");
                        }

                    }

                    if (inputCode.getValueState() == "Success") {
                        this._codeCheck = true;
                    } else {
                        this._codeCheck = false;
                    }

                    // a.includes("d")



                }


                // if(result == true ){
                //     data.flag = "t";
                //     json.setData(data);
                //     oView.setModel(json, "util");
                //     // @ts-ignore
                //     inputCode.setValueState("Error");
                //     // @ts-ignore
                //     inputCode.setValueStateText("사용불가(중복)");    

                // }else if(result == false){
                //     // if(data.flag == "f"){ return ;}

                //     data.flag = "f";
                //     json.setData(data);
                //     oView.setModel(json, "util");


                //     if(value && regExp.test(value) ){
                //         // @ts-ignore
                //         inputCode.setValueState("Success");
                //         // @ts-ignore
                //         inputCode.setValueStateText("사용가능");      
                //     }else{
                //         // @ts-ignore
                //         inputCode.setValueState("Error");
                //         // @ts-ignore
                //         inputCode.setValueStateText("영문/숫자/특수문자('-'만 가능)");
                //     } 

                // }



            },

            onPageCancelButtonPress: function () {
                var that = this;

                MessageBox.confirm(textModel.getText("/NCM00002"), {
                    // @ts-ignore
                    title: textModel.getText("/CONFIRM"),//that.getModel("I18N").getText("/SAVE"),
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {


                            var items = that.getView().byId("midTable").getItems();
                            for (var i = 0; i < items.length; i++) {
                                var item = items[i];
                                item.destroy();
                            }

                            var oScr = that.getView().getModel("sm");
                            oScr.setData({ "screen": "M" });
                            that.getOwnerComponent().getRouter().navTo("Master",
                                {
                                    lflag: " ",
                                    category_code: " ",
                                    use_flag: false
                                });


                            var oFCL = that.getView().getParent().getParent();
                            oFCL.setLayout();
                        }
                        else {
                            return;
                        }
                    }
                });



                // for(var i=0; i<deleteItems.length; i++){
                //     var deleteItem = deleteItems[i];
                //     this.getView().byId("midTable").addItem(deleteItem);
                // }
                // this.getView().byId("midTable").getModel().refresh(true);
                // var items = this.getView().byId("midTable").getItems();

                // var oScr = this.getView().getModel("sm");
                // oScr.setData({"screen":"M"});
                // this.getOwnerComponent().getRouter().navTo("Master", 
                //     {
                //         lflag: " ",
                //         category_name: " ",
                //         use_flag: false
                //     });

                // // for(var i=0; i<items.length; i++){
                // //     var item = items[i];
                // //     // var flagitem = item.sId.search("midTable");
                // //     // if(flagitem == -1){
                // //         // that._tab.removeItem(i);
                // //     item.destroy();
                // //     // }
                // // }
                // // // this.getView().byId("midTable").refreshItems(true);

                // var oFCL = this.getView().getParent().getParent();
                // oFCL.setLayout();
                // // this.getOwnerComponent().getRouter().navTo("Master");
            },
            onPageNavBackButtonPress: function () {
                var items = this.getView().byId("midTable").getItems();
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    item.destroy();
                }
                var oScr = this.getView().getModel("sm");
                oScr.setData({ "screen": "M" });
                // this.getOwnerComponent().getRouter().navTo("Master");
                var oFCL = this.getView().getParent().getParent();
                oFCL.setLayout();
                this.getOwnerComponent().getRouter().navTo("Master",
                    {
                        lflag: " ",
                        category_code: " ",
                        use_flag: false
                    });
                // this.oRouter.navTo("RouteApp");

                // var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
                // this.getRouter().navTo("mainPage", {layout: sNextLayout});
            }


        });
    });
