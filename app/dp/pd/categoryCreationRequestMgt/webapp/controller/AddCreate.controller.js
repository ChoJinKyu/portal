sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "sap/ui/model/json/JSONModel",
    "ext/lib/util/Validator",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History",
    "sap/m/ColumnListItem",
    "sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    "sap/ui/richtexteditor/RichTextEditor",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/FilterType",
    "dp/util/control/ui/IdeaManagerDialog",
    "ext/lib/formatter/NumberFormatter",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "ext/lib/model/TreeListModel"
], function (BaseController, Multilingual, TransactionManager, ManagedModel, ManagedListModel, JSONModel, Validator, DateFormatter,
    Filter, FilterOperator, Fragment, MessageBox, MessageToast, History,
    ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, RichTextEditor, ODataModel,FilterType,IdeaManagerDialog,NumberFormatter,ODataV2ServiceProvider
    , TreeListModel) {
    "use strict";

    var oTransactionManager;

    return BaseController.extend("dp.pd.categoryCreationRequestMgt.controller.AddCreate", {

        dateFormatter: DateFormatter,
        numberFormatter: NumberFormatter,

        validator: new Validator(),

        loginUserId: new String,
        loginUserName: new String,
        tenant_id: new String,
        category_code: new String,
        category_group_code: new String,
        request_category_name: new String,
        similar_category_code: new String,
        pdPartCategoryLngArr: new Array,
        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {

            //로그인 세션 작업완료시 수정
            this.loginUserId = "TestUser";
            this.loginUserName = "TestUser";
            this.tenant_id = "L2101";
            this.viewType = false;


            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedModel(), "master");
            this.setModel(new ManagedModel(), "PdPartCategoryModel");
            this.setModel(new ManagedModel(), "pdPartCategoryLng");
            this.setModel(new ManagedModel(), "pdActivityStdDayView");

			var oViewModel = new JSONModel({
                    showMode: true,                    
                    editMode: false
				});

            this.setModel(oViewModel, "viewModel");
            

            
            oTransactionManager = new TransactionManager();
            oTransactionManager.addDataModel(this.getModel("master"));
            oTransactionManager.addDataModel(this.getModel("PdPartCategoryModel"));
            oTransactionManager.addDataModel(this.getModel("pdPartCategoryLng"));
            oTransactionManager.addDataModel(this.getModel("pdActivityStdDayView"));

            this.getRouter().getRoute("addCreatePage").attachPatternMatched(this._onRoutedThisPage, this);

            this.enableMessagePopover();

            

        },

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments"),
                oView = this.getView();
                
            this._sRequestNumber = oArgs.requestNumber;
            
            //세션에서 받아서 넣어 주어야 함
            this._sLanguageCd = "KO";
            //테스트용
            // this.category_code = "PC2012300001";


            var oMasterModel = this.getModel("master");
            oMasterModel.setProperty("/pdPartCategoryCreationRequestView", {});

            var oPdPartCategory = this.getModel("PdPartCategoryModel");
            var oPdPartCategoryLng = this.getModel("pdPartCategoryLng");
            var oPdActivityStdDayView = this.getModel("pdActivityStdDayView");

            
            this.validator.clearValueState(this.byId("midObjectForm"));
            this.onSearch(oArgs.requestNumber);
        },

        

        

		/**
		 * 조회
		 * @public
		 */
        onSearch: function (requestNumber) {
            var oView = this.getView();

            var sObjectPath = "/pdPartCategoryCreationRequestView(tenant_id='" + this.tenant_id + "',request_number='" + requestNumber + "')";
            var oMasterModel = this.getModel("master");
            var v_this = this;            
            var oPdPartCategory = this.getModel("PdPartCategoryModel");
            var oPdPartCategoryLng = this.getModel("pdPartCategoryLng");
            var oPdActivityStdDayView = this.getModel("pdActivityStdDayView");


            this.getModel("PdPartCategoryModel").setData({});
            this.getModel("pdPartCategoryLng").setData([]);
            this.getModel("pdActivityStdDayView").setData({});
            //테스트 에러로 
            //oView.setBusy(true);
            oMasterModel.setTransactionModel(this.getModel());
            oMasterModel.read(sObjectPath, {
                success: function (oData) {
                    // console.log("master");
                    // console.log(oData);
                    v_this.category_group_code = oData.category_group_code;
                    v_this.request_category_name = oData.request_category_name;
                    v_this.similar_category_code = oData.similar_category_code;

                    if(oData.create_category_code == null || oData.create_category_code == ""  ){
                        v_this.category_code = "new";
                        v_this.viewType = false;
                    }else{
                        v_this.category_code = oData.create_category_code;
                        v_this.viewType = true;
                    }
                    v_this.onSearchAfter(v_this.category_code);
                    
                    if(v_this.similar_category_code==null || v_this.similar_category_code =="" || v_this.similar_category_code == undefined){
                        v_this.similar_category_code = "new";
                    }
                    v_this.onSearchPdActivityStdDayView(v_this.similar_category_code);

                    if(v_this.viewType){
                        v_this._toShowMode();
                    }else{
                        v_this._toEditMode();
                    }

                    oView.setBusy(false);
                }
            });
            
            

        },

        onSearchAfter: function (category_code) {
            var oView = this.getView();
            var v_this = this;            
            var oPdPartCategory = this.getModel("PdPartCategoryModel");
            var oPdPartCategoryLng = this.getModel("pdPartCategoryLng");
            var oPdActivityStdDayView = this.getModel("pdActivityStdDayView");
           
            this.getModel("PdPartCategoryModel").setData({});
            this.getModel("pdPartCategoryLng").setData([]);
            this.getModel("pdActivityStdDayView").setData({});

            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this.tenant_id ));
            aFilters.push(new Filter("category_group_code", FilterOperator.EQ, this.category_group_code));
            aFilters.push(new Filter("category_code", FilterOperator.EQ, category_code));

            // console.log(aFilters);
            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.PartCategoryService/").read("/PdPartCategory", {
                filters: aFilters,
                success: function (oData) {
                    // console.log("PdPartCategory");
                    // console.log(oData);
                    //var oModel = new sap.ui.model.json.JSONModel(oData.results[0]);
                    if(oData.results.length > 0){
                        this.getModel("PdPartCategoryModel").setData(oData.results[0]);
                    }
                }.bind(this)
            });

    
            var aFilters2 = [];
            aFilters2.push(new Filter("tenant_id", FilterOperator.EQ, this.tenant_id ));
            aFilters2.push(new Filter("category_group_code", FilterOperator.EQ, this.category_group_code));
            aFilters2.push(new Filter("category_code", FilterOperator.EQ, category_code));
            // aFilters2.push(new Filter("language_cd", FilterOperator.EQ, this._sLanguageCd));
            
                    // console.log(aFilters2);
            //test
            // aFilters2.push(new Filter("category_code", FilterOperator.EQ, "PC2012300001"));

            // console.log(aFilters2);
            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.PartCategoryService/").read("/pdPartCategoryLng", {
                filters: aFilters2,
                success: function (oData) {
                    // console.log("pdPartCategoryLng");
                    // console.log(oData);
                    if( this.category_code =="new"){
                        oData.results = [{
                            "tenant_id": this.tenant_id,
                            "category_group_code": this.category_group_code,
                            "category_code": "new",
                            "language_cd": "KO",
                            "code_name": this.request_category_name,
                            "local_create_dtm": "",
                            "local_update_dtm": "",
                            "create_user_id": "",
                            "update_user_id": "",
                            "system_create_dtm": "",
                            "system_update_dtm": ""
                        }];
                    }
                    this.getModel("pdPartCategoryLng").setData(oData.results);
                    // console.log(this.getModel("pdPartCategoryLng"));
                    this.pdPartCategoryLngArr = oData.results;
                    
                    // var sTitle = this.getModel("I18N").getText("/LANGUAGE")+" ";

                    //console.log(sTitle+" ["+iTotalItems+"]");
                    //this.byId("pageSectionMain2").setTitle(sTitle+"("+oData.results.length+")");

                }.bind(this)
            });
                
        },

        onSearchPdActivityStdDayView: function (similar_category_code) {
            var oView = this.getView();
            var v_this = this;
            var oPdActivityStdDayView = this.getModel("pdActivityStdDayView");
           
            //테스트  pdPartCategoryCreationRequestView 에서 데이터를 가져오지 못하므로 임시 작업 
            //similar_category_code = "PC2012300007";

            var aFilters3 = [];
            aFilters3.push(new Filter("tenant_id", FilterOperator.EQ, this.tenant_id ));
            aFilters3.push(new Filter("category_group_code", FilterOperator.EQ, this.category_group_code));
            aFilters3.push(new Filter("category_code", FilterOperator.EQ, similar_category_code ));
            // aFilters3.push(new Filter("category_code", FilterOperator.EQ, this.similar_category_code ));


            // console.log("aFilters3");
            // console.log(aFilters3);
            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.activityStdDayService/").read("/pdActivityStdDayView", {
                filters: aFilters3,
                success: function (oData) {
                    console.log(oData);
                    console.log("pdActivityStdDayView End");
                    this.getModel("pdActivityStdDayView").setData(oData.results);
            
                    this.toTop();
                    
                }.bind(this)
            });
            this.toTop();
        },
        /**
         * 리스트 레코드 추가
         * @public
         */
        toTop: function () {
            //ScrollTop
            var oObjectPageLayout = this.getView().byId("page");
            var oFirstSection = oObjectPageLayout.getSections()[0];
            oObjectPageLayout.scrollToSection(oFirstSection.getId(), 0, -500);
        },

        
        /**
         * 리스트 레코드 추가
         * @public
         */
        onAdd: function () {
            this.pdPartCategoryLngArr.push({
                "tenant_id": this.tenant_id,
                "category_group_code": this.category_group_code,
                "category_code": "new",
                "language_cd": "KO",
                "code_name": "",
                "local_create_dtm": "",
                "local_update_dtm": "",
                "create_user_id": "",
                "update_user_id": "",
                "system_create_dtm": "",
                "system_update_dtm": ""
            });
            this.getModel("pdPartCategoryLng").setData(this.pdPartCategoryLngArr);
            
        },

        onDelete: function () {
            var oTable = this.byId("midTable2"),
                oModel = this.getModel("pdPartCategoryLng"),
                aItems = oTable.getSelectedItems(),
                aIndices = [];
            var v_this = this;
            var cntArr = [];
            aItems.forEach(function (oItem) {
                cntArr.push( oItem.getBindingContext("pdPartCategoryLng").sPath.split("/")[1] );

            });
            for(var i=cntArr.length-1; i > -1; i--){
                v_this.pdPartCategoryLngArr.splice( cntArr[i]  , 1);
            }
            this.getModel("pdPartCategoryLng").setData(v_this.pdPartCategoryLngArr);
            oTable.removeSelections(true);

        },



		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function () {
            
            // console.log("onPageSaveButtonPress start");
            var oView = this.getView(),
                v_this = this;
                
            if(this.validator.validate(this.byId("midObjectForm")) !== true) return;
            

            var oPdPartCategory = this.getModel("PdPartCategoryModel");
            var oPdPartCategoryLng = this.getModel("pdPartCategoryLng");
            var oPdActivityStdDayView = this.getModel("pdActivityStdDayView");
            var oTableLang = this.byId("midTable2");

            var oData = oPdPartCategory.oData;
            var CUType = "C";

            // console.log(oData);
            // console.log(this.byId("statusButton").getSelectedKey());

            // console.log("onPageSaveButtonPress 222222222222");
            // console.log(this.category_group_code);
            // console.log(this._sRequestNumber);
            // console.log(this.getView().byId("pGroupCategory").getValue());
            // console.log(this.getView().byId("sequence").getValue().trim());
            // console.log(this.getView().byId("statusButton").getSelectedKey());
            //20210209 설계자 요청으로 category_code 에 requestNumber를 마스터 데이터에 넣기로 함
                    // category_code     : this._sRequestNumber,
                    // parent_category_code        : oData.parent_category_code,
                    // sequence     : oData.sequence.trim(), ==> 0 으로 보내기로 함 
            var pdMstVal = {
					tenant_id       : this.tenant_id,
                    category_group_code   : this.category_group_code,
                    category_code     : this.category_code,
                    parent_category_code        : this.getView().byId("pGroupCategory").getValue(),
                    sequence     : "0",

                    active_flag  : this.getView().byId("statusButton").getSelectedKey(),
                    update_user_id  : this.loginUserId,
                    crud_type_code  : CUType
            };

            var input = {
                inputData : {
                    crud_type : CUType,
                    pdMst : pdMstVal,
                    pdDtl: [],
                    pdSD: []
                }
            };
            var pdDtlVal = [];
            
            for (var i = 0; i <  this.pdPartCategoryLngArr.length; i++) {
                pdDtlVal.push({
                    tenant_id: this.pdPartCategoryLngArr[i].tenant_id,
                    category_group_code: this.pdPartCategoryLngArr[i].category_group_code,
                    category_code: this.pdPartCategoryLngArr[i].category_code,
                    langauge_cd: this.pdPartCategoryLngArr[i].language_cd,
                    code_name: this.pdPartCategoryLngArr[i].code_name,
                    
                    update_user_id: this.loginUserId,
                    crud_type_code: CUType
                });
            }
            input.inputData.pdDtl = pdDtlVal;

            
            var pdSDVal = [];
            
            var oTableSd = this.byId("tableSd");
            var oDataSd = oPdActivityStdDayView.oData;
            
            for (var i = 0; i < oDataSd.length; i++) {
                
                if(oDataSd[i].s_grade_standard_days=="" ||  oDataSd[i].s_grade_standard_days==null || parseInt(oDataSd[i].s_grade_standard_days) == undefined || parseInt(oDataSd[i].s_grade_standard_days) == NaN){
                    oDataSd[i].s_grade_standard_days = "0";
                }
                if(oDataSd[i].a_grade_standard_days=="" ||  oDataSd[i].a_grade_standard_days==null || parseInt(oDataSd[i].a_grade_standard_days) == undefined || parseInt(oDataSd[i].a_grade_standard_days) == NaN){
                    oDataSd[i].a_grade_standard_days = "0";
                }
                if(oDataSd[i].b_grade_standard_days=="" ||  oDataSd[i].b_grade_standard_days==null || parseInt(oDataSd[i].b_grade_standard_days) == undefined || parseInt(oDataSd[i].b_grade_standard_days) == NaN){
                    oDataSd[i].b_grade_standard_days = "0";
                }
                if(oDataSd[i].c_grade_standard_days=="" ||  oDataSd[i].c_grade_standard_days==null || parseInt(oDataSd[i].c_grade_standard_days) == undefined || parseInt(oDataSd[i].c_grade_standard_days) == NaN){
                    oDataSd[i].c_grade_standard_days = "0";
                }
                if(oDataSd[i].d_grade_standard_days=="" ||  oDataSd[i].d_grade_standard_days==null || parseInt(oDataSd[i].d_grade_standard_days) == undefined || parseInt(oDataSd[i].d_grade_standard_days) == NaN){
                    oDataSd[i].d_grade_standard_days = "0";
                }
                pdSDVal.push({
                    tenant_id: oDataSd[i].tenant_id,
                    activity_code: oDataSd[i].activity_code,
                    category_group_code: oDataSd[i].category_group_code,
                    
                    // category_code: oDataSd[i].category_code,
                    category_code: "new",
                    s_grade_standard_days: oDataSd[i].s_grade_standard_days.trim(),

                    a_grade_standard_days: oDataSd[i].a_grade_standard_days.trim(),
                    b_grade_standard_days: oDataSd[i].b_grade_standard_days.trim(),
                    c_grade_standard_days: oDataSd[i].c_grade_standard_days.trim(),
                    d_grade_standard_days: oDataSd[i].d_grade_standard_days.trim(),

                    active_flag: oDataSd[i].active_flag.toString(),
                    update_user_id: this.loginUserId,
                    crud_type_code: CUType
                });
            }
            input.inputData.pdSD = pdSDVal;


            var url = "srv-api/odata/v4/dp.partCategoryV4Service/PdPartCategorySaveProc";
            
            console.log(input);
			oTransactionManager.setServiceModel(this.getModel());
			MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
				title : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
                        //oView.setBusy(true);
                        $.ajax({
                            url: url,
                            type: "POST",
                            data: JSON.stringify(input),
                            contentType: "application/json",
                            success: function (rst) {
                                // console.log(rst);
                                if(rst.return_code =="OK"){
                                    sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                    v_this.onPageNavBackButtonPress();
                                }else{
                                    // console.log(rst);
                                    MessageBox.error("error : "+rst.return_msg );
                                }
                            },
                            error: function (rst) {
                                // console.log(rst);
                                MessageBox.error("error : "+rst.return_msg );
                            }
                        });
					};
				}
            });
            this.validator.clearValueState(this.byId("midObjectForm"));
            

        },

        _toShowMode: function () {
            var oMasterModel = this.getModel("master");
            var oPartCategoryService = this.getModel("partCategoryService");
            var oData = oPartCategoryService.oData;

            this.getView().getModel("viewModel").setProperty("/showMode", true);
            this.getView().getModel("viewModel").setProperty("/editMode", false);
            this.byId("page").setProperty("showFooter", true);
            
            this.byId("pageNavBackButton").setVisible(true);
            this.byId("pageSaveButton").setEnabled(false);
            this.byId("pageCancelButton").setEnabled(false);
            this.byId("pageListButton").setEnabled(true);
        },
        
        _toEditMode: function () {
            this.getView().getModel("viewModel").setProperty("/showMode", false);
            this.getView().getModel("viewModel").setProperty("/editMode", true);
            var oMasterModel = this.getModel("master")
            this.byId("page").setProperty("showFooter", true);
            this.byId("pageNavBackButton").setVisible(false);
            this.byId("pageSaveButton").setEnabled(true);
            this.byId("pageCancelButton").setEnabled(true);
            this.byId("pageListButton").setEnabled(false);
        },

        

		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageListButtonPress: function () {
            this.validator.clearValueState(this.byId("midObjectForm"));
            this.onPageNavBackButtonPress.call(this);
        },

		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelButtonPress: function () {
            this.validator.clearValueState(this.byId("midObjectForm"));
            // if (this._sRequestNumber !== "new"){
            //     this._toShowMode();
            // }else{
                this.getRouter().navTo("mainPage", {}, true);
            // }
        },

		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
        onPageNavBackButtonPress: function () {
            this.validator.clearValueState(this.byId("midObjectForm"));
            var sPreviousHash = History.getInstance().getPreviousHash();
            this.getRouter().navTo("mainPage", {}, true);
        },

		/**
		 * Event handler for page edit button press
		 * @public
		 */
        onPageEditButtonPress: function () {
            this._toEditMode();
        },


        processIconStr (obj , obj2){
            if(obj == obj2){
                if(obj = "아이디어"){
                    return "sap-icon://circle-task-2";
                }
            }
            return "";
        },


        
        /**
         * function : 아이디어 관리자 팝업 Call 함수
         * date : 2021/01/14
         */
        onIdeaManagerDialogPress : function(){
            
            if(!this.oSearchIdeaManagerDialog){
                this.oSearchIdeaManagerDialog = new IdeaManagerDialog({
                    title: this.getModel("I18N").getText("/SEARCH_IDEA_MANAGER"),
                    multiSelection: false,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, this.tenant_id)
                        ]
                    }
                });
                this.oSearchIdeaManagerDialog.attachEvent("apply", function(oEvent){ 
                    this.byId("ideaManager").setValue(oEvent.getParameter("item").idea_manager_name);
                    // this.byId("ideaManager").setValue(oEvent.getParameter("item").idea_manager_name+"("+oEvent.getParameter("item").idea_manager_empno+")");
                    this.byId("ideaManagerId").setValue(oEvent.getParameter("item").idea_manager_empno);
                    
                }.bind(this));
                }
            this.oSearchIdeaManagerDialog.open();

        }




        , onMilestoneButtonPress: function (oEvent) {
            if(oEvent.getSource().getPressed() ){
                oEvent.getSource().setText("No");
            }else{
                oEvent.getSource().setText("Yes");
            }
        }


        
        , onSearchPartCategory: function (oEvent) {
           // var oArgs = oEvent.getParameter("arguments");
        
            this.setObj = "searchField";
            var oView = this.getView();
            if(oEvent == 1){
                this.setObj = "pGroupCategory";
            }
            if (!this.treeDialog) {
                this.treeDialog = Fragment.load({
                    id: oView.getId(),
                    name: "dp.pd.categoryCreationRequestMgt.view.PartCategory",
                    controller: this
                }).then(function (tDialog) {
                    oView.addDependent(tDialog);
                    return tDialog;
                }.bind(this));
            }

            this.treeDialog.then(function (tDialog) {
                tDialog.open();
                this.onDialogTreeSearch();
            }.bind(this));
        }

        , onDialogTreeSearch: function (oEvent) {

            var treeFilter = [];


            treeFilter.push(new Filter({
                filters: [
                    new Filter("tenant_id", FilterOperator.EQ, "L2101"),
                    new Filter("category_group_code", FilterOperator.EQ, "CO")
                ],
                and: false
            }));
            
            this.treeListModel = new TreeListModel(this.getView().getModel());
            this.treeListModel
                .read("/pdPartCategoryView", {
                     filters: treeFilter
                })
                // 성공시
                .then((function (jNodes) {
                    this.getView().setModel(new JSONModel({
                        "pdPartCategoryView": {
                            "nodes": jNodes
                        }
                    }), "tree");
                }).bind(this))
                // 실패시
                .catch(function (oError) {
                })
                // 모래시계해제
                .finally((function () {
                }).bind(this));

        }

        , selectPartCategoryValue: function (oEvent) {
            if( oEvent.getParameters().rowContext.sPath != undefined){
                var row = this.getView().getModel("tree").getObject(oEvent.getParameters().rowContext.sPath);
                if(this.setObj == "pGroupCategory"){
                    if(row.drill_state == "leaf"){
                        MessageToast.show("Parent Category만 선택할 수 있습니다.");
                        return;
                    } else {
                        this.getView().byId(this.setObj).setValue(  row.category_code );
                        //this.onSearchPdActivityStdDayView(row.category_code);
                    }
                }else{
                    if(row.drill_state != "leaf"){
                        MessageToast.show("Leaf Category만 선택할 수 있습니다.");
                        return;
                    } else {
                        this.getView().byId(this.setObj).setValue(  row.category_code );
                        this.onSearchPdActivityStdDayView(row.category_code);
                    }
                }
            }
            this.partCategoryPopupClose();
            
        }
        
        , partCategoryPopupClose: function (oEvent) {
            this.byId("PartCategory").close();
        }

        
        
    });
});