sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/f/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "ext/lib/util/Multilingual"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, fioriLibrary, Filter, FilterOperator, MessageBox, Multilingual) {
        "use strict";
        var oMaster;
        var oModels;
        var selectArray = [];    //선택 row path 저장
        var firstRowCount = 0;   //첫화면 row count 저장
        var initModel = [];
        var doubleFlag = false;
        var resultFilters = [];
        var oMultilingual;
        var textModel;   // I18N 모델 저장


        return Controller.extend("pg.mi.miCategory.controller.Master", {
            onInit: function () {

                console.log("onInit");
                this._lflag = "X";

                var data;
                var oView = this.getView();
                oMultilingual = new Multilingual();
                this.getView().setModel(oMultilingual.getModel(), "I18N");
                var that = this;
                this.getView().byId("smartFilterBar")._oSearchButton.setText("조회");
                // oMultilingual.attachEvent("ready", function(oEvent){
                //     var oi18nModel = oEvent.getParameter("model");
                //     var searchText = oi18nModel.getText("/SEARCH");
                //     this.getView().byId("smartFilterBar")._oSearchButton.setText(String(searchText));
                // }, this);

                // oMultilingual.attachEvent("ready", function(e){
                //     var oi18nModel = e.getParameter("model");
                //     var searchText = oi18nModel.getText("/SEARCH");
                //     this.getView().byId("smartFilterBar")._oSearchButton.setText(searchText); // 검색 버튼 Text 변경
                // }, this);

                // oMultilingual.attachEvent("ready", function(oEvent){

                //     var oi18nModel = oEvent.getParameter("model");
                //     // this.addHistoryEntry({
                //     //     title: oi18nModel.getText("/MESSAGE_MANAGEMENT"),
                //     //     icon: "sap-icon://table-view",
                //     //     intent: "#Template-display"
                //     // }, true);

                //     // Smart Filter Button 명 처리 START
                //     var b = that.getView().byId("smartFilterBar").getContent()[0].getContent();
                //     $.each(b, function(index, item) {
                //         if (item.sId.search("btnGo") !== -1) {
                //             item.setText(oi18nModel.getText("/SEARCH"));
                //             console.log(oi18nModel.getText("/SEARCH"));
                //         }
                //     }.bind(this));
                //     // Smart Filter Button 명 처리 END
                //     // //  this.getView().byId("smartFilterBar")._oSearchButton.setText(oi18nModel.getText("/SEARCH"));
                //     // var searchText = oi18nModel.getText("/SEARCH");
                //     // if(searchText != undefined){
                //     // that.getView().byId("smartFilterBar")._oSearchButton.setText(searchText);
                //     //         console.log("smartFilterBar : ",oi18nModel.getText("/SEARCH"));

                //     // }
                // }.bind(this));


                this.oView = this.getView();
                this._bDescendingSort = false;
                // this.oProductsTable = this.oView.byId("productsTable");
                this.oRouter = this.getOwnerComponent().getRouter();




                // this.oRouter.attachRouteMatched(this._onProductMatched.bind(this));
                // this.oTable = this.getView().byId("level_table");
                // this.getOwnerComponent();

                // this.oModel = this.getOwnerComponent().getModel();

                // // this.oRouter.getRoute("master").attachPatternMatched(this._onProductMatched, this);
                // this.oRouter.getRoute("Master").attachPatternMatched(this._onProductMatched, this);

                // var oRouter = this.getRouter();
                // this.oRouter.initialize();
                this.oRouter.attachBeforeRouteMatched(this._onProductMatched, this);


                // this.getView().byId("smartFilterBar")._oSearchButton.setText(); // 검색 버튼 Text 변경
            },
            _filterSearch: function (e) {
                this._selectArrayClear();
                var filter_category_code;
                var filter_category_name;
                var filter_create_date;

                this._expande = undefined; //toggleOpen 초기화
                //filterCategoryCode   filterCategoryName    filterCreateDate
                // if(e == "R"){
                filter_category_code = this.getView().byId("filterCategoryCode").getValue();
                filter_category_name = this.getView().byId("filterCategoryName").getValue();
                filter_create_date = this.getView().byId("filterCreateDate").getValue();
                // }else{
                //     filter_category_code = e.getParameters()[0].selectionSet[0].getValue();
                //     filter_category_name = e.getParameters()[0].selectionSet[1].getValue();
                //     filter_create_date = e.getParameters()[0].selectionSet[2].getValue();
                // }

                var tab = this.getView().byId("treeTable");
                this.getView().getModel().refresh();
                var oBinding = tab.getBinding("rows");
                var oFilters = [];
                var pOfilters = [];

                resultFilters = [];

                initModel = [];
                var rowCount = 0;
                var parentRowCount = 0;

                //2020/12/19 - 2020/12/21
                if (filter_create_date.length > 0) {
                    console.log(filter_create_date);
                    var a = filter_create_date.replaceAll(" ", "");
                    var fromDate = new Date(a.substring(0, 10));
                    var toDate = new Date(a.substring(11, 22));
                    console.log(toDate);

                    var inputDate = toDate.getDate();
                    toDate.setDate(inputDate + 1);

                    oFilters.push(new Filter("system_create_dtm", FilterOperator.BT, fromDate, toDate));
                }

                oFilters.push(new Filter("category_code", "Contains", filter_category_code));
                oFilters.push(new Filter("category_name", "Contains", filter_category_name));


                // pOfilters.push(new Filter({filters:oFilters, bAnd:false}));
                var read0 = this._read("/MICategoryHierarchyStructureView", oFilters);
                read0.then(function (data) {
                    console.log("filter = ", data);
                    var reArray = data.results;
                    for (var i = 0; i < reArray.length; i++) {
                        var row = reArray[i];
                        initModel.push(row);
                        if (row.hierarchy_level == 0) {
                            resultFilters.push(new Filter("category_code", "EQ", row.category_code));
                            // parentRowCount = parentRowCount + 1;
                        } else {
                            resultFilters.push(new Filter("category_code", "EQ", row.category_code));
                            resultFilters.push(new Filter("category_code", "EQ", row.parent_category_code));
                        }
                    }
                    rowCount = reArray.length;

                    if (reArray.length == 0) {
                        // alert("Data가 없습니다.");
                        // return;
                        resultFilters.push(new Filter("category_code", "EQ", ""));
                    }

                    oBinding.filter(resultFilters, sap.ui.model.FilterType.Application);
                    tab.collapseAll();
                    this._oScr.setData({ "screen": "M" });
                });

                this.getView().byId("treeTable").getBinding("rows").attachDataReceived(function (data, aa) {
                    firstRowCount = 0;
                    var secondRowCount = 0;
                    for (var i = 0; i < data.mParameters.data.results.length; i++) {
                        var oRow = data.mParameters.data.results[i];
                        for (var j = 0; j < initModel.length; j++) {
                            var initRow = initModel[j];
                            if (initRow.node_id == oRow.node_id) {
                                break;
                            }
                            if (initModel.length == j + 1) {
                                initModel.push(oRow);
                            }
                        }
                    }

                    if (this._expande == true || this._expande == false) {
                        return;
                    } else {
                        var resultCount = data.mParameters.data.results.length;
                    }

                }.bind(this));
            },
            filterSearch: function (e) {


                // // 수정 작업일 때
                // if(this._screenFlag == "U" ){
                //     var oMessage = this._message();
                //     oMessage.then(function(data){
                //         if(data == true){

                //         }else{

                //         }
                //     }, this);

                // }else{ // 그외
                //     this._oScr.setData({"screen" : "S"});
                //     oMaster.setData({"level": level,  "indices": 0});
                //     this._setNav(item.category_code, " ",item.use_flag, "S", pa_cate, item.node_id, item.parent_node_id);
                // }


                // var para = e;
                // var that = this;
                // $.when(this._message()).then(function(data){
                //     if(data == true){
                //         that._filterSearch(para);
                //         // that._oScr.setData({"screen" : "M"});
                //     }else{
                //         // that._oScr.setData({"screen" : "S"});
                //         return;
                //     }
                //     console.log("search : ",data);
                // }, this);



                //기존
                this._oScr = this.getView().getModel("sm");
                console.log("this._oScr : ", this._oScr);
                var oFCL = this.getView().getParent().getParent();
                this._oScr.setData({ "screen": "M" });
                oFCL.setLayout();
                this._selectArrayClear();
                var filter_category_code;
                var filter_category_name;
                var filter_create_date;

                this._expande = undefined; //toggleOpen 초기화
                //filterCategoryCode   filterCategoryName    filterCreateDate
                if (e == "R") {
                    filter_category_code = this.getView().byId("filterCategoryCode").getValue();
                    filter_category_name = this.getView().byId("filterCategoryName").getValue();
                    filter_create_date = this.getView().byId("filterCreateDate").getValue();
                } else {
                    filter_category_code = e.getParameters()[0].selectionSet[0].getValue();
                    filter_category_name = e.getParameters()[0].selectionSet[1].getValue();
                    filter_create_date = e.getParameters()[0].selectionSet[2].getValue();
                }

                var tab = this.getView().byId("treeTable");
                this.getView().getModel().refresh();
                var oBinding = tab.getBinding("rows");
                var oFilters = [];
                var pOfilters = [];

                resultFilters = [];

                initModel = [];
                var rowCount = 0;
                var parentRowCount = 0;

                //2020/12/19 - 2020/12/21
                if (filter_create_date.length > 0) {
                    console.log(filter_create_date);
                    // var a = filter_create_date.replaceAll(" ", "");
                    // var fromDate = new Date( a.substring(0, 10) );
                    // var toDate = new Date( a.substring(11, 22) );
                    // console.log(toDate);

                    // var inputDate = toDate.getDate();
                    // toDate.setDate(inputDate + 1);

                    this.byId("smartFilterBar").getControlByKey("system_create_dtm").getFrom().setHours("09", "00", "00", "00");
                    this.byId("smartFilterBar").getControlByKey("system_create_dtm").getTo().setHours("09", "00", "00", "00");

                    var fromDate = this.byId("smartFilterBar").getControlByKey("system_create_dtm").getFrom();
                    var toDate = this.byId("smartFilterBar").getControlByKey("system_create_dtm").getTo();
                    var addTime = 1000 * 60 * 60 * 24 - 1;  //24시간 - 0.001초
                    var toTime = toDate.getTime();
                    var sumTime = toTime + addTime;
                    toDate.setTime(sumTime);

                    console.log("fromData ~ toDate", fromDate, " ~ ", toDate);

                    oFilters.push(new Filter("system_create_dtm", FilterOperator.BT, fromDate, toDate));
                }

                oFilters.push(new Filter("category_code", "Contains", filter_category_code));
                oFilters.push(new Filter("category_name", "Contains", filter_category_name));


                // pOfilters.push(new Filter({filters:oFilters, bAnd:false}));
                var read0 = this._read("/MICategoryHierarchyStructureView", oFilters);
                read0.then(function (data) {
                    console.log("filter = ", data);
                    var reArray = data.results;
                    for (var i = 0; i < reArray.length; i++) {
                        var row = reArray[i];
                        initModel.push(row);
                        if (row.hierarchy_level == 0) {
                            resultFilters.push(new Filter("category_code", "EQ", row.category_code));
                            // parentRowCount = parentRowCount + 1;
                        } else {
                            resultFilters.push(new Filter("category_code", "EQ", row.category_code));
                            resultFilters.push(new Filter("category_code", "EQ", row.parent_category_code));
                        }
                    }
                    rowCount = reArray.length;

                    if (reArray.length == 0) {
                        // alert("Data가 없습니다.");
                        // return;
                        resultFilters.push(new Filter("category_code", "EQ", ""));
                    }

                    oBinding.filter(resultFilters, sap.ui.model.FilterType.Application);
                    tab.collapseAll();
                });

                this.getView().byId("treeTable").getBinding("rows").attachDataReceived(function (data, aa) {
                    firstRowCount = 0;
                    var secondRowCount = 0;
                    for (var i = 0; i < data.mParameters.data.results.length; i++) {
                        var oRow = data.mParameters.data.results[i];
                        for (var j = 0; j < initModel.length; j++) {
                            var initRow = initModel[j];
                            if (initRow.node_id == oRow.node_id) {
                                break;
                            }
                            if (initModel.length == j + 1) {
                                initModel.push(oRow);
                            }
                        }
                    }

                    if (this._expande == true || this._expande == false) {
                        return;
                    } else {
                        var resultCount = data.mParameters.data.results.length;
                    }

                }.bind(this));

                //기존 끝

                // 테스트 =======================================================
                // this.getView().byId("treeTable").getBinding("rows").fireDataReceived(function(data, aa){
                //     console.log("fireDataReceived : ",this.getView().byId("treeTable").getBinding("rows").getLength());    
                // }.bind(this));

                // this.getView().byId("treeTable").getBinding("rows").fireDataRequested(function(data, aa){
                //     console.log("fireDataRequested : ",this.getView().byId("treeTable").getBinding("rows").getLength());    
                // }.bind(this));

                // this.getView().byId("treeTable").getBinding("rows").updateRequired(function(data, aa){
                //     console.log("updateRequired : ",this.getView().byId("treeTable").getBinding("rows").getLength());    
                // }.bind(this));

                // this.getView().byId("treeTable").getBinding("rows").detachDataReceived(function(data, aa){
                //     console.log("detachDataReceived : ",this.getView().byId("treeTable").getBinding("rows").getLength());    
                // }.bind(this));








                // 테스트 =======================================================




                // for( var i=0; i<initModel.length; i++){
                //     if(initModel[i].hierarchy_level == 0){
                //         firstRowCount = firstRowCount + 1;
                //     }else{
                //         if(this._expande == true){
                //             secondRowCount = secondRowCount + 1;
                //         }
                //     }
                // }
                // var resultRowCount = firstRowCount + secondRowCount ;




                //
                // oFilters.push(new Filter("category_code", "Contains", filter_category_code));


                // pOfilters.push(new Filter({filters:oFilters, bAnd:false}));
                // $.when(this._read("/MICategoryHierarchyStructure", pOfilters )).then(function(data){
                //     console.log("filter = ",data);
                // });

                // oFilters.push(new Filter("category_code", "Contains", filter_category_code));
                // // oFilters.push(new Filter("parent_category_code", "Contains", filter_category_code));

                // oBinding.filter(oFilters, sap.ui.model.FilterType.Application);

                // oFilters.push(new Filter("path_code", "Contains", filter_category_code));
                // oFilters.push(new Filter("path_name", "Contains", filter_category_name));
                // // oFilters.push(new Filter("path_code", "Contains", filter_category_code));


                // oBinding.filter(oFilters, sap.ui.model.FilterType.Application);

            },
            // _dataReceived: function(fn, oListener){
            //         console.log("attachDataReceived");
            //         // if(bindResultFlag == true){

            //         //     console.log("binding결과,",resultIndex);
            //         //     if(resultIndex >= 0){
            //         //         var sId = this.getView().byId("treeTable").getRows()[resultIndex].getId();
            //         //         $("#"+sId).css("background-color", "green");
            //         //     }

            //         // }
            // },
            onMainTableexpandAll: function (e) {
                var table = this.getView().byId("treeTable");
                table.expandToLevel(1);
                // table.setVisibleRowCount(initModel.length);
                console.log(initModel);
                // this.onMainTablecollapseAll();
                // var rows = table.getRows();
                // for(var i=rows.length-1; i>=0; i--){
                //     var index = i;
                //     table.expand(index);
                // }
            },
            stateChange: function (e) {
                // alert("stateChange");
            },
            onMainTablecollapseAll: function (e) {
                this.getView().byId("treeTable").collapseAll();
                // this.getView().byId("treeTable").setVisibleRowCount(firstRowCount);
                // alert(firstRowCount); 
            },
            _getScreenFlagModel: function () {
                this._oScr = this.getView().getModel("sm");
                if (this._oScr != undefined) {
                    this._screenFlag = this._oScr.oData.screen;
                }
            },
            _onProductMatched: function (e) {

                // oMultilingual.getModel()

                this._selectArrayClear();
                var oModel = this.getView().getModel();


                this._getScreenFlagModel();

                oMaster = this.getView().getModel("master");

                if (oMaster == undefined) {
                    return;
                }
                if (this._oScr.oData.screen != "D") {
                    oMaster.setData({ "level": 0, "indices": 0 });
                }







                // var aa = this.getView().getModel("I18N").getText("/NCM00001");
                if (textModel == undefined) {
                    textModel = this.getView().getModel("I18N");
                    console.log("textModel : ", textModel);
                    console.log("search : ", textModel.getText("/SEARCH"));
                } else {

                }



                // console.log("attachDataReceived")
                // this.getView().byId("treeTable").getBinding("rows").attachDataReceived(this._dataReceived);



                // this.getView().byId("treeTable").getBinding("rows").attachDataReceived(function(e){
                //     console.log("attachDataReceived");


                // }, this);

                // this.getView().byId("treeTable").getBinding("rows").attachDataReceived(this._dataReceived, this);
                var tab = this.getView().byId("treeTable");
                // tab._getSelectAllCheckbox().setVisible(false)

                // oModels.refresh();
                // tab.setEnableSelectAll(false);
                // this.getView().byId("mainTableCreate0Button").setEnabled(true);
                // this.getView().byId("mainTableCreate1Button").setEnabled(false);
                // this.getView().byId("mainTableDeleteButton").setEnabled(false);

                //  lflag: data.flag,
                //                     category_name: cate_text,
                //                     use_flag: useFlag

                var lflag = e.getParameter("arguments").lflag;
                this._lflag = null;
                var category_code = e.getParameter("arguments").category_code;
                this._category_code = category_code;
                var use_flag = e.getParameter("arguments").use_flag;
                if (use_flag == "true") {
                    use_flag = true;
                } else {
                    use_flag = false;
                }

                if (lflag == "C" || lflag == "U") {
                    // this._lflag = "X";
                    var oModel = this.getView().getModel();
                    oModel.refresh(true);

                    var tab = this.getView().byId("treeTable");
                    // this.getView().byId("treeTable").collapseAll(); 
                    // MICategoryHierarchyStructure(tenant_id='L2100',category_code='T32')
                    var cPath = "/MICategoryHierarchyStructure(tenant_id='L2100',category_code='" + this._category_code
                        + "')";

                    // tab.expand(this._cIndex);
                    var current_row = oModel.getProperty(cPath);
                    if (current_row.hierarchy_level == 1) {
                        this._lflag = "A";  //1레벨 생성
                        this.parent_category_code = current_row.parent_category_code;

                        // var filter = new Filter("parent_node_id", "EQ", current_row.parent_node_id);
                        // var read = this._read("/MICategoryHierarchyStructure", [filter]);
                        // this.addRowCount = 0;

                        // read.then(function(data){
                        //     this.addRowCount = data.results.length;

                        // });

                        //     this.getView().byId("treeTable").setVisibleRowCount(firstRowCount + addRowCount);
                        // }.bind(this));
                        var parentPath = "/MICategoryHierarchyStructure(tenant_id='L2100',category_code='" + current_row.parent_category_code
                            + "')";
                        var parentRow = oModel.getProperty(parentPath);

                        // parentRow
                    } else {
                        // firstRowCount = firstRowCount + 1;
                        // tab.setVisibleRowCount(firstRowCount);
                        // this._lflag = "X";
                    }

                    // var parent_code = oModel.getProperty(this._cPath);

                    // var length = tab.getBinding("rows").getLength();
                    // length = length + 1;




                    //                     var oFCL = this.getView().getParent().getParent();
                    //                     var item = this.getView().getModel().getProperty(this._sPath);
                    //                     if( item == undefined || item == null )
                    //                     {
                    //                         return;  
                    //                     }

                    //                     var updateData = {
                    //                         // "category_name": category_name,
                    //                         "use_flag": use_flag,
                    //                         "parent_node_id"  : parseInt(item.parent_node_id),
                    //                         "parent_category_code" : item.parent_category_code,
                    //                         "filter_category_code" : item.filter_category_code,
                    //                         "hierarchy_level" : parseInt(item.hierarchy_level),
                    //                         "drillstate": item.drillstate,
                    //                         "sort_sequence": item.sort_sequence,
                    //                         "node_id": parseInt(item.node_id),
                    //                         "local_create_dtm": item.local_create_dtm,
                    //                         "local_update_dtm": new Date(),
                    //                         "create_user_id": item.create_user_id,
                    //                         "update_user_id": "Admin",
                    //                         "system_create_dtm": item.system_create_dtm,
                    //                         "system_update_dtm": new Date()
                    //                     }; 



                    //                     oModel.update(this._sPath, updateData , { "groupId":"batchUpdateGroup"});

                    //                     oModel.setUseBatch(true);
                    //                     oModel.submitChanges({
                    //                         async: false,
                    //                         // groupId: "changes",
                    //                         // groupId:"batchCreateGroup",
                    //                         success: function (oData, oResponse) {
                    //         //                     oModel.submitChanges({
                    //         //                         async: false,
                    //         //                         // groupId: "changes",
                    //         //                         groupId:"batchUpdateGroup",
                    //         //                         success: function (oData, oResponse) {
                    //         //                             


                    //         //                         }.bind(this),
                    //         //                         error: function (cc, vv) {
                    //         //                             sap.m.MessageToast.show("Save failed!MICategoryText");
                    //         //                             console.log("cc", cc);
                    //         //                             console.log("vv",  vv);
                    //         //                         }
                    //         //                     });
                    //                             sap.m.MessageToast.show("Save completed.");
                    //                             console.log("oData", oData);
                    //                             console.log(" oResponse",  oResponse);
                    //                             oFCL.setLayout()
                    //                             oModel.refresh();
                    //                             

                    //                             // oFCL.setLayout();
                    //                         }.bind(this),
                    //                         error: function (cc, vv) {
                    //                             sap.m.MessageToast.show("Save failed!MICategoryText");
                    //                             console.log("cc", cc);
                    //                             console.log("vv",  vv);
                    //                         }
                    //                     });
                    //                     lflag="X";
                } else if (lflag == "D") {


                    oModel.remove(this._sPath, { "groupId": "deleteId" });

                    oModel.setUseBatch(true);
                    oModel.submitChanges({
                        async: false,
                        // groupId: "changes",
                        groupId: "deleteId",
                        success: function (oData, oResponse) {
                            sap.m.MessageToast.show(textModel.getText("/NCM01002"));
                            oModel.refresh(true);
                        },
                        error: function (cc, vv) {
                            // sap.m.MessageToast.show("Save failed!MICategoryText");
                            sap.m.MessageToast.show(textModel.getText("/EPG00001"));
                            console.log("cc", cc);
                            console.log("vv", vv);
                        }
                    });

                } else {
                    this._lflag = "X";
                    var smModel = this.getView().getModel("sm");
                    var smData = smModel.getData();
                    smData.screen = "M";
                    smModel.setData(smData);
                }





            },
            onMainTableCreate0ButtonPress: function () {
                var oFCL = this.getView().getParent().getParent();
                if (oFCL.getLayout() === "TwoColumnsBeginExpanded") {
                    oFCL.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
                } else {
                    oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
                }
                this._setNav(" ", " ", "Yes", "0", " ", " ", " ");
            },
            liveCategoryCode: function (e) {

                // 대문자만 사용
                var inputCode = this.getView().byId("filterCategoryCode");

                inputCode.setValue(inputCode.getValue().toUpperCase());
                debugger;
            },
            onMainTableCreate1ButtonPress: function () {
                var oFCL = this.getView().getParent().getParent();
                // @ts-ignore
                if (oFCL.getLayout() === "TwoColumnsBeginExpanded") {
                    // @ts-ignore
                    oFCL.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
                } else {
                    // @ts-ignore
                    oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
                }
                var oTreeTable = this.getView().byId("treeTable");
                // @ts-ignore
                var oPath = selectArray[0];
                // var selectedRowInfo = oTreeTable.getRows()[oTreeTable.getSelectedIndex()].getAggregation("cells");
                // //p_cate, p_name, p_use, lflag
                // var index = this.getView().byId("treeTable").getSelectedIndex();
                // var itemPath = this.getView().byId("treeTable").getRows()[index].getRowBindingContext().sPath;
                var item = this.getView().getModel().getProperty(oPath);
                // oMaster.setData({"level": 1,  "indices": 0});

                this._setNav(item.category_code, " ", "Yes", "1", item.category_code, item.node_id, item.node_id);
            },
            treeTableCellClick: function (e) {

                var index = e.getParameters().rowIndex;
                if (index < 16) {
                    if (this.getView().byId("treeTable").getRows()[index].getCells()[0].getText().length == 0) {
                        return;
                    }
                }
                oMaster = this.getView().getModel("master");
                this._sPath = e.getParameters().rowBindingContext.sPath;
                var item = this.getView().getModel().getProperty(this._sPath);
                var pa_cate = item.parent_category_code;
                if (pa_cate == null) {
                    pa_cate = " ";
                }
                var level = item.hierarchy_level;

                if (item.hierarchy_level == 0) {
                    item.parent_node_id = " ";
                }


                var oTab = this.getView().byId("treeTable");
                var that = this;
                this._getScreenFlagModel();
                var selectedRowInfo = this.getView().byId("treeTable").getRows()[index];
                // 수정 작업일 때
                if (this._screenFlag == "U") {
                    MessageBox.confirm(textModel.getText("/NCM00006"), {
                        async: true,
                        title: textModel.getText("/CONFIRM"),//that.getModel("I18N").getText("/SAVE"),
                        initialFocus: sap.m.MessageBox.Action.CANCEL,
                        onClose: function (sButton) {
                            if (sButton === MessageBox.Action.OK) {
                                var selectedRowInfo = oTab.getRows()[index];
                                that._oScr.setData({ "screen": "M" });
                                that._setNav(item.category_code, " ", item.use_flag, "S", pa_cate, item.node_id, item.parent_node_id);
                            } else {
                                return;
                            }
                        }
                    });
                } else { // 그외
                    this._oScr.setData({ "screen": "S" });
                    oMaster.setData({ "level": level, "indices": 0 });
                    this._setNav(item.category_code, " ", item.use_flag, "S", pa_cate, item.node_id, item.parent_node_id);
                }

            },
            // mainTableItemPress: function(e) {


            //     var eId = e.oSource.oParent.sId;
            //     var index = eId.replace("container-miCategory---fcl--beginView--treeTable-rows-row", "");
            //     // alert(index);


            //     var tab = this.getView().byId("treeTable");
            //     var row = tab.getRows()[index];


            //     this._setNav( row.getCells()[0].getText(), row.getCells()[1].getText(), row.getCells()[2].getText(),  "S" );


            // },
            _selectArrayClear: function () {

                oMaster = this.getView().getModel("master");
                if (oMaster == undefined) {
                    return;
                }
                this.getView().byId("treeTable").clearSelection();
                selectArray = [];

                oMaster.setData({ "level": 2, "indices": 0 });

            },
            _setNav: function (p_cate, p_name, p_use, lflag, pa_cate, node_id, p_node_id) {

                // this._selectArrayClear();
                var oFCL = this.getView().getParent().getParent();
                if (oFCL.getLayout() === "TwoColumnsBeginExpanded") {
                    oFCL.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);
                } else {
                    oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
                }

                var aa = {
                    "tenant_id": "L2100",
                    "company_code": "*",
                    "org_code": "BIZ00100",
                    "org_type_code": "BU",
                    "category_code": p_cate,
                    "category_name": p_name,
                    "use_flag": p_use,
                    "lflag": lflag
                }


                this.oRouter.navTo("Detail", {
                    tenant_id: aa.tenant_id,
                    company_code: aa.company_code,
                    org_code: aa.org_code,
                    org_type_code: aa.org_type_code,
                    category_code: aa.category_code,
                    category_name: aa.category_name,
                    use_flag: aa.use_flag,
                    lflag: aa.lflag,
                    p_category_code: pa_cate,
                    node_id: node_id,
                    p_node_id: p_node_id
                });

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
                        promise.reject(data);
                    }

                });
                return promise;
            },
            sort: function (e) {
                console.log("sort");
            },
            _dataReceived: function (data) {
                console.log("dataReceived");
                // function(data, aa){
                //     firstRowCount = 0;
                //     var secondRowCount = 0;
                //     for(var i=0; i<data.mParameters.data.results.length; i++){
                //         var oRow = data.mParameters.data.results[i];
                //         for(var j=0; j<initModel.length; j++){
                //             var initRow = initModel[j];
                //             if(initRow.node_id == oRow.node_id){
                //                 break;
                //             }
                //             if(initModel.length == j + 1){
                //                 initModel.push(oRow);
                //             }
                //         }
                //     }

                //     // for( var i=0; i<initModel.length; i++){
                //     //     if(initModel[i].hierarchy_level == 0){
                //     //         firstRowCount = firstRowCount + 1;
                //     //     }else{
                //     //         if(this._expande == true){
                //     //             secondRowCount = secondRowCount + 1;
                //     //         }
                //     //     }
                //     // }
                //     // var resultRowCount = firstRowCount + secondRowCount ;

                //     if(this._expande == true || this._expande == false){
                //         return;
                //     //     var resultCount = this.getView().byId("treeTable").getBinding().getLength() + data.mParameters.data.results.length;
                //     // }if(this._expande == false){
                //     //     resultCount = this.getView().byId("treeTable").getBinding().getLength() - data.mParameters.data.results.length;
                //     }else{
                //         var resultCount = data.mParameters.data.results.length;
                //     }
                //     // tab.setVisibleRowCount(resultCount);


                // }



                // var result = jQuery.Deferred();
                // this.getView().byId("treeTable").getBinding("rows").attachDataReceived(function(data, aa){
                //     result.resolve(data.mParameters.data.results);
                //     return result.promise();
                // }.bind(this));
                // return result.promise();
            },
            firstVisibleRowChanged: function (e) {
                // console.log("firstVisibleRowChanged");
                // console.log(this.getView().byId("treeTable").getBinding("rows").getLength());
                // this.getView().byId("treeTable").setVisibleRowCount(this.getView().byId("treeTable").getBinding("rows").getLength());
                // this.getView().byId("treeTable").getRows()[20].getCells()[0].getText();
            },
            // toggleOpenState: function(e){
            //     var tab = this.getView().byId("treeTable");
            //     var rowLength = tab.getBinding().getLength();
            //     // tab.getRows()[15].getDomRef().scrollIntoView();
            //     // // alert(rowLength);
            //     this._expande = e.getParameters().expanded;
            //     var openFlag = "";


            //     // var result = this.getView().byId("treeTable").getBinding("rows").attachDataReceived(function(data, aa){

            //     //     return data.mParameters.data.results

            //     // }.bind(this));
            //     // var result = this._dataReceived();
            //     // result.then(function(data){
            //     //     var reArray = data;
            //     //     console.log(data);
            //     //     for(var i=0; i<reArray.length; i++){
            //     //         initModel.push(reArray[i]);
            //     //         firstRowCount = firstRowCount + 1;
            //     //     }
            //     //     openFlag= "X";
            //     // }.bind(this));
            //     // if(openFlag == "X"){
            //     //     return;
            //     // }


            //     var path = e.getParameters().rowContext.sPath;
            //     var row = this.getView().getModel().getProperty(path);
            //     var resultCount = 0;
            //     var node_id = row.node_id;

            //     for(var i=0; i<initModel.length; i++){
            //         var data = initModel[i];
            //         if(data.parent_node_id == node_id){
            //             resultCount = resultCount + 1;
            //         }
            //     }


            //     if(this._expande == true){
            //         resultCount = rowLength + resultCount;
            //     }else{

            //         resultCount = rowLength - resultCount;

            //     }

            //     // tab.setVisibleRowCount(resultCount);


            //     // this.getView().byId("treeTable").getBinding("rows").attachDataReceived(function(data, aa){
            //     //     // firstRowCount 
            //     //     var addRowCount = data.mParameters.data.results.length;
            //     //     var resultRowCount = firstRowCount + addRowCount;
            //     //     tab.setVisibleRowCount(resultRowCount);


            //     // }.bind(this));



            // },
            onMainTableDeleteButtonPress: function () {

                var oTreeTable = this.getView().byId("treeTable");
                // @ts-ignore
                var otreeIndices = oTreeTable.getSelectedIndices();
                var oModel = this.getView().getModel();
                var oFilters = [];  //부모 노드 검색용
                var oFiltersMetaCode = [];  // MIMaterialCodeList 조회용
                var oArrayHiePath = []; // MICategoryHierarchyStructure 삭제 경로
                var that = this;




                MessageBox.confirm(textModel.getText("/NCM00003"), {

                    // @ts-ignore
                    title: "확인",//that.getModel("I18N").getText("/SAVE"),
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            //MiMetarialCode 조회( 사용 중인지 확인 )
                            for (var i = 0; i < selectArray.length; i++) {
                                var selectStr = selectArray[i];
                                // var selectPath = oTreeTable.getContextByIndex(selectArray[i]).getPath();
                                var oItem = this.getView().getModel().getProperty(selectStr);
                                var oFilter1 = new sap.ui.model.Filter("category_code", sap.ui.model.FilterOperator.EQ, oItem.category_code);
                                // var oFilter = new sap.ui.model.Filter({sPath:"category_code", sOperator:"EQ",oValue1: oItem.category_code, bAnd: false});
                                //  var oFilter = new sap.ui.model.Filter({filters: [ "category_code", "EQ",oItem.category_code],and: false});

                                // oFilters.push(oFilter,true);
                                if (oItem.hierarchy_level == 0) {
                                    // oFilter =new sap.ui.model.Filter({filters: [ "parent_category_code", "EQ", oItem.category_code],and: false});
                                    var oFilter2 = new sap.ui.model.Filter("parent_category_code", sap.ui.model.FilterOperator.EQ, oItem.category_code);
                                    oFilters.push(new sap.ui.model.Filter({ filters: [oFilter1, oFilter2], bAnd: false }));
                                } else {
                                    oFilters.push(new sap.ui.model.Filter({ filters: [oFilter1], bAnd: false }));
                                }
                                // oFilters.push(oFilter);

                            }
                            var filters = [];
                            filters.push(new Filter(oFilters, false));

                            //부모 노드 검색
                            var read0 = this._read("/MICategoryHierarchyStructure", filters);
                            read0.then(function (data) {
                                var oFilters0 = [];
                                for (var i = 0; i < data.results.length; i++) {
                                    var getdata = data.results[i];
                                    oFilters0.push(new sap.ui.model.Filter("category_code", sap.ui.model.FilterOperator.EQ, getdata.category_code));
                                    // oFiltersMetaCode.push(new sap.ui.model.Filter("category_code", sap.ui.model.FilterOperator.EQ, getdata.category_code));
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
                                        // oTreeTable.setEnableSelectAll(false);
                                        // oModel.refresh();
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
                                        // var rowCount = that.getView().byId("treeTable").getBinding().getLength();

                                        oModel.setUseBatch(true);
                                        oModel.submitChanges({
                                            async: false,
                                            groupId: "deleteId",
                                            // groupId:"batchUpdateGroup",
                                            success: function (oData, oResponse) {
                                                sap.m.MessageToast.show(textModel.getText("/NCM01002"));
                                                console.log("oData", oData);
                                                console.log(" oResponse", oResponse);

                                                oMaster.setData({ "level": 0, "indices": 0 });

                                                // rowCount = rowCount - oArrayHiePath.length;
                                                // firstRowCount = firstRowCount - oArrayHiePath.length;
                                                // that.getView().byId("treeTable").setVisibleRowCount( rowCount );
                                                // var read = that._read("/MICategoryHierarchyStructure", null);
                                                // initModel = [];
                                                // firstRowCount = 0;
                                                // read.then(function(data){
                                                //     for(var i=0; i<data.results.length; i++){
                                                //         initModel.push(data.results[i]);
                                                //         if(data.results[i].hierarchy_level == 0){
                                                //             firstRowCount = firstRowCount + 1;
                                                //         }
                                                //     }
                                                //     that.getView().byId("treeTable").setVisibleRowCount(firstRowCount);


                                                // });
                                                oModel.refresh();

                                                that.onAfterRendering("D");
                                                // that.getView().byId("treeTable").getBinding("rows").filter( resultFilters , sap.ui.model.FilterType.Application); 
                                                // oFCL.setLayout();
                                            },
                                            error: function (cc, vv) {
                                                sap.m.MessageToast.show(textModel.getText("/EPG00001"));
                                                // sap.m.MessageToast.show("Save failed! MICategoryHierarchyStructure");
                                                console.log("cc", cc);
                                                console.log("vv", vv);

                                                return;
                                            }
                                        });
                                    });
                                });

                            });
                        }
                    }.bind(this)
                });
            },
            _message: function () {
                var result = jQuery.Deferred();
                MessageBox.confirm(textModel.getText("/NCM00006"), {
                    async: false,
                    title: textModel.getText("CONFIRM"),//that.getModel("I18N").getText("/SAVE"),
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            result.resolve(true);

                        } else {
                            result.resolve(false);
                        }

                    }
                });
                return result.promise();
            },
            onPageSearchButtonPress: function () {

                //비동기 message
                $.when(this._message()).then(function (data) {
                    console.log("search : ", data);
                });




                // @ts-ignore
                var filterValue = this.getView().byId("searchCategoryCode").getValue();

                var oTreeTable = this.getView().byId("treeTable");
                var oBinding = oTreeTable.getBinding("rows");
                // var filterArray = [];

                // @ts-ignore
                var oFilter1 = new sap.ui.model.Filter("filter_category_code", sap.ui.model.FilterOperator.Contains, filterValue);

                // @ts-ignore
                oBinding.filter([oFilter1], sap.ui.model.FilterType.Application);

                //     var tab = this.getView().byId("treeTable");
                //     // var oBinding = tab.getBinding("rows");

                //     var afilters = [];
                //     var filterCateName = this.getView().byId("searchCategoryName").getValue();

                //     var filter = new Filter("category_name", FilterOperator.Contains, filterCateName);
                //     afilters.push(filter);
                //     // var oBinding = tab.bindRows(afilters);
                //     // tab.getBinding("rows").filter(afilters, "Application");

                //     // var oModel = this.getView().getModel();
                //     // oModel.bindTree("", "", "", afilters);

                //     // tab.filter(tab.getColumns()[1], filterCateName);



                // //    tab.getBinding("rows").filter(filterCateName ? new Filter({
                // //         path: "category_name",
                // //         operator: "Contains",
                // //         value1: filterCateName,
                // //     }) : null);



            },
            onAfterRendering: function (e) {



                //  oMultilingual.attachEvent("ready", function(oEvent){

                //     var oi18nModel = oEvent.getParameter("model");
                //     // this.addHistoryEntry({
                //     //     title: oi18nModel.getText("/MESSAGE_MANAGEMENT"),
                //     //     icon: "sap-icon://table-view",
                //     //     intent: "#Template-display"
                //     // }, true);

                //     // Smart Filter Button 명 처리 START
                //     var b = this.getView().byId("smartFilterBar").getContent()[0].getContent();
                //     $.each(b, function(index, item) {
                //         if (item.sId.search("btnGo") !== -1) {
                //             item.setText("조회");
                //             console.log(oi18nModel.getText("/SEARCH"));
                //         }
                //     }.bind(this));
                //     // Smart Filter Button 명 처리 END
                //     // //  this.getView().byId("smartFilterBar")._oSearchButton.setText(oi18nModel.getText("/SEARCH"));
                //     // var searchText = oi18nModel.getText("/SEARCH");
                //     // if(searchText != undefined){
                //     // that.getView().byId("smartFilterBar")._oSearchButton.setText(searchText);
                //     //         console.log("smartFilterBar : ",oi18nModel.getText("/SEARCH"));

                //     // }
                // }.bind(this));

                console.log(" oMultilingual.getModel() 2: ", oMultilingual.getModel());
                if (textModel != undefined) {
                    console.log(" search onafter ", textModel.getText("/SEARCH"));
                }



                if (e != "D") {
                    var sId = e.getParameters().id;
                    var afterFlag = sId.search("Master");

                    var oLength = this.getView().byId("treeTable").getRows().length;
                    console.log("onAfterRendering, row:", oLength);

                } else {
                    afterFlag = 1;
                }




                // alert(afterFlag);
                if (afterFlag == -1 || this._lflag == "X") {
                    return;
                }


                // this.getView().byId("treeTable").getBinding("rows").filter( resultFilters , sap.ui.model.FilterType.Application); 
                this.filterSearch("R");
                this._lflag = "X";
                if (e != "D") {
                    this.getView().byId("treeTable").expandToLevel(1);
                }

                // this.getView().byId("treeTable").getBinding().attachDataReceived(function(){
                //     console.log("aaa : ",this.getView().getModel("I18N"));
                // }, this);

                return;

                // this.getView().byId("treeTable").collapseAll();
                console.log("onAfterRendering");
                firstRowCount = 0;
                console.log("firstRowCount=", firstRowCount);
                initModel = [];
                var parentModel = [];
                var childModel = [];
                var oExpand;
                // console.log(initModel);
                var that = this;

                var read = this._read("/MICategoryHierarchyStructure", null);
                var bindResultFlag = false;
                var resultIndex;
                var resultRowCount = 0;
                var openIndex;
                read.then(function (data) {
                    this.addRowCount = 0;
                    for (var i = 0; i < data.results.length; i++) {
                        initModel.push(data.results[i]);
                        if (data.results[i].hierarchy_level == 0) {
                            firstRowCount = firstRowCount + 1;
                            parentModel.push(data.results[i]);
                        }
                        if (data.results[i].parent_category_code == this.parent_category_code) {
                            this.addRowCount = this.addRowCount + 1;
                            childModel.push(data.results[i]);
                        }

                    }

                    console.log("read,parentModel=", parentModel);
                    console.log("read,firstRowCount=", firstRowCount);
                    if (this._lflag == "A") {    // 1레벨 생성 할 때, 부모노드 오픈
                        resultRowCount = firstRowCount + this.addRowCount;
                    } else {
                        resultRowCount = firstRowCount;
                    }
                    this._lflag == "X"
                    // this.getView().byId("treeTable").setVisibleRowCount(resultRowCount);

                    for (var i = 0; i < parentModel.length; i++) {
                        var c_code = parentModel[i].category_code;
                        if (c_code == this.parent_category_code) {
                            openIndex = i;
                            break;
                        }
                    }
                    // for(var i=0; i<parentModel.length; i++){
                    //     var c_code = parentModel[i].category_code;
                    //     if(c_code == this._category_code){
                    //         resultIndex = i;
                    //         break;
                    //     }
                    // }

                    for (var i = 0; i < childModel.length; i++) {
                        if (childModel[i].category_code == this._category_code) {
                            var j = i + 1;
                            resultIndex = openIndex + j;
                            break;
                        }
                    }
                    if (openIndex != undefined) {
                        oExpand = this.getView().byId("treeTable").expand(openIndex);
                        console.log(oExpand);
                        // var sId = this.getView().byId("treeTable").getRows()[this.openIndex].getId();
                        // $("#"+sId).css("background-color", "green");
                        // resultIndex=this.openIndex;
                        bindResultFlag = true;
                        // this.getView().byId("treeTable").getRows()[this.openIndex].addStyleClass("cell_create_row");

                    }




                }.bind(this));
                // this.bindResultFlag = bindResultFlag;
                if (bindResultFlag == true) {
                    this.getView().byId("treeTable").getBinding("rows").attachDataReceived(function () {
                        console.log("dataReceived");


                        var rows = this.getView().byId("treeTable").getRows();
                        console.log("rows.length : ", rows.length);
                        console.log("rows : ", rows);
                        console.log("parentModel.length : ", parentModel.length);
                        // if(rows.length > parentModel.length ){
                        if (parentModel.length > 0) {

                            console.log("this.category_code : ", this._category_code);
                            var aaa = 100
                            var j = 0;
                            while (true) {
                                setTimeout(() => {
                                    for (var i = 0; i < rows.length; i++) {
                                        var row = rows[i];
                                        if (row.getCells()[0].getText() == this._category_code) {
                                            var sId = row.getId();
                                            $("#" + sId).css("background-color", "green");
                                            var firstIndex = row.getIndex();
                                            console.log("firstIndex : ", firstIndex);
                                            row.getDomRef().scrollIntoView();

                                            setTimeout(() => {
                                                $("#" + sId).css("background-color", "white");
                                            }, 4000);

                                            break;
                                        }
                                    }
                                    console.log("aaaaaa");
                                    j = j + 1;
                                }, aaa);
                                console.log("bbb");
                                if (j = 10) {
                                    break;
                                }
                            }
                            for (var i = 0; i < rows.length; i++) {
                                var row = rows[i];
                                if (row.getCells()[0].getText() == this._category_code) {
                                    var sId = row.getId();
                                    $("#" + sId).css("background-color", "green");
                                    setTimeout(() => {
                                        $("#" + sId).css("background-color", "white");
                                    }, 4000);
                                }
                            }
                        }
                    }.bind(this));
                    var rows = this.getView().byId("treeTable").getRows();
                    console.log("rows : ", rows.length);
                }



            },
            // change: function(e){
            //     console.log("change");
            // },
            attachDataReceived: function (e) {

                alert("1");
                console.log("change : ", e);

            },
            treetablefilter: function (e) {
                console.log(e.getParameters);
            },
            treeTableSelection: function (e) {
                // var smFlag = this.getView().getModel("sm").oData.screen;
                // if(smFlag != "M"){
                //     var index2 = e.getParameters().rowIndex;
                //     this.getView().byId("treeTable").clearSelection();
                //     alert("디테일 화면이 있으면 사용 불가");
                //     return;
                // }
                // var index = e.getParameters().rowIndex;
                // selectArray = [];
                oMaster = this.getView().getModel("master");
                var tab = this.getView().byId("treeTable");
                if (e.mParameters.rowIndex == -1) { return };

                var buttonC0 = this.getView().byId("mainTableCreate0Button");
                var buttonC1 = this.getView().byId("mainTableCreate1Button");
                var buttonD = this.getView().byId("mainTableDeleteButton");
                var rowInd = this.getView().byId("treeTable").getSelectedIndices().length;
                var index = this.getView().byId("treeTable").getSelectedIndices()[0];

                var indices = this.getView().byId("treeTable").getSelectedIndices();

                var selectPath = e.getParameters().rowContext.sPath;
                var selectFlag = false;

                if (rowInd == 0) {
                    selectArray = [];
                } else {
                    // for(var i=0; i<selectArray.length; i++){
                    // if(selectArray[i] == selectPath ){
                    //     selectFlag = true;
                    //     break;
                    // }
                    // }
                    // if(selectFlag == true){
                    //     selectArray.splice(i);
                    // }else{
                    //     selectArray.push(e.getParameters().rowContext.sPath); 
                    // }
                    var dIndex = 0;
                    for (var i = 0; i < selectArray.length; i++) {
                        if (selectArray[i] == selectPath) {
                            selectFlag = true;
                            dIndex = i;
                            break;
                        }
                    }
                    if (selectFlag == true) {
                        selectArray.splice(dIndex, 1);
                        // selectArray.pop(selectArray[dIndex]);
                        selectFlag = false;
                    } else {
                        selectArray.push(e.getParameters().rowContext.sPath);
                    }
                }








                for (var i = 0; i < indices.length; i++) {
                    var vIndex = indices[i];

                    // var category_code = tab.getRows()[vIndex].getCells()[0].getText();
                    // var tenant_id = "L2100";
                    // /MICategoryHierarchyStructure(tenant_id='L2100',category_code='T1A1')
                    // var oPath = "/MICategoryHierarchyStructure(tenant_id='"+tenant_id+"',category_code='"+category_code+"')";


                    // selectArray.push(oStr);



                }
                console.log("selectArray:", selectArray);

                var that = this;

                if (rowInd == 1) {

                    var rowPath = selectArray[0];

                    var level = this.getView().getModel().getObject(rowPath).hierarchy_level;
                    if (level == 0) {
                        this._cPath = rowPath;
                        // this._cIndex = index;
                    }
                } else {
                    level = 0;
                }
                this._getScreenFlagModel();
                var oFCL = this.getView().getParent().getParent();

                oMaster.setData({ "level": level, "indices": selectArray.length });
                // // 수정 작업일 때
                // if(this._screenFlag != "M"  ){
                //     if(this._screenFlag == "D"){
                //         var qText = "조회 화면을 종료 하겠습니까?";
                //     }else{
                //         var qText = "진행중인 작업을 종료 하시겠습니까?"
                //     }

                //     MessageBox.confirm(qText, {
                //         async : true,
                //         title : "확인",//that.getModel("I18N").getText("/SAVE"),
                //         initialFocus : sap.m.MessageBox.Action.CANCEL,
                //         onClose : function(sButton) {
                //             if (sButton === MessageBox.Action.OK) {
                //                 if(rowInd == 0){
                //                     buttonC0.setEnabled(true);
                //                     buttonC1.setEnabled(false);
                //                     buttonD.setEnabled(false);
                //                 }else if(rowInd == 1){
                //                     buttonC0.setEnabled(false);
                //                     buttonD.setEnabled(true);
                //                     if(level == 0){
                //                         buttonC1.setEnabled(true);
                //                     }else{
                //                         buttonC1.setEnabled(false);
                //                     }
                //                 }else if(rowInd > 1){
                //                     buttonC0.setEnabled(false);
                //                     buttonC1.setEnabled(false);
                //                     buttonD.setEnabled(true);
                //                 }
                //                 oFCL.setLayout();
                //                 that._oScr.setData({"screen" : "M"});
                //             }else{
                //                 return;
                //             }   
                //         }
                //     });
                // }else{ // 그외
                //     if(rowInd == 0){
                //         buttonC0.setEnabled(true);
                //         buttonC1.setEnabled(false);
                //         buttonD.setEnabled(false);
                //     }else if(rowInd == 1){
                //         buttonC0.setEnabled(false);
                //         buttonD.setEnabled(true);
                //         if(level == 0){
                //             buttonC1.setEnabled(true);
                //         }else{
                //             buttonC1.setEnabled(false);
                //         }
                //     }else if(rowInd > 1){
                //         buttonC0.setEnabled(false);
                //         buttonC1.setEnabled(false);
                //         buttonD.setEnabled(true);
                //     }
                // }
            }
        });
    });
