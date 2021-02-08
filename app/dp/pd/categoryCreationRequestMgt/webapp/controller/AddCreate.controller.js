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
            console.log(oArgs);
            this._sRequestNumber = oArgs.requestNumber;         
            this.category_code =   oArgs.categoryCode;
            
            //세션에서 받아서 넣어 주어야 함
            this._sLanguageCd = "KO";
            //테스트용
            // this.category_code = "PC2012300001";


            if( oArgs.categoryCode =="new"){
                this.viewType = false;
            }else{
                this.viewType = true;
            }
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


            //테스트 에러로 
            //oView.setBusy(true);
            oMasterModel.setTransactionModel(this.getModel());
            oMasterModel.read(sObjectPath, {
                success: function (oData) {
                    console.log("master");
                    console.log(oData);
                    v_this.category_group_code = oData.category_group_code;
                    v_this.request_category_name = oData.request_category_name;
                    v_this.similar_category_code = oData.similar_category_code;
                    v_this.onSearchAfter(v_this.category_code);
                    oView.setBusy(false);
                }
            });
            
            
            if(this.viewType){
                v_this._toShowMode();
            }else{
                v_this._toEditMode();
            }
            

        },

        onSearchAfter: function (category_code) {
            var oView = this.getView();
            var v_this = this;            
            var oPdPartCategory = this.getModel("PdPartCategoryModel");
            var oPdPartCategoryLng = this.getModel("pdPartCategoryLng");
            var oPdActivityStdDayView = this.getModel("pdActivityStdDayView");
           
            console.log("category_code:::;"+category_code);
            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this.tenant_id ));
            aFilters.push(new Filter("category_group_code", FilterOperator.EQ, this.category_group_code));
            aFilters.push(new Filter("category_code", FilterOperator.EQ, category_code));

            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.PartCategoryService/").read("/PdPartCategory", {
                filters: aFilters,
                success: function (oData) {
                    console.log("PdPartCategory");
                    console.log(oData);
                    //var oModel = new sap.ui.model.json.JSONModel(oData.results[0]);

                    this.getModel("PdPartCategoryModel").setData(oData.results);
                }.bind(this)
            });

    
            var aFilters2 = [];
            aFilters2.push(new Filter("tenant_id", FilterOperator.EQ, this.tenant_id ));
            aFilters2.push(new Filter("category_group_code", FilterOperator.EQ, this.category_group_code));
            aFilters2.push(new Filter("category_code", FilterOperator.EQ, category_code));
            // aFilters2.push(new Filter("language_cd", FilterOperator.EQ, this._sLanguageCd));
            //test
            aFilters2.push(new Filter("category_code", FilterOperator.EQ, "PC2012300001"));

            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.PartCategoryService/").read("/pdPartCategoryLng", {
                filters: aFilters2,
                success: function (oData) {
                    console.log("pdPartCategoryLng");
                    console.log(oData);
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
                    this.pdPartCategoryLngArr = oData.results;
                }.bind(this)
            });

            if(this.similar_category_code==null || this.similar_category_code =="" || this.similar_category_code == undefined){
                this.similar_category_code = "new";
            }
            this.onSearchPdActivityStdDayView(this.similar_category_code);
                
        },

        onSearchPdActivityStdDayView: function (similar_category_code) {
            var oView = this.getView();
            var v_this = this;
            var oPdActivityStdDayView = this.getModel("pdActivityStdDayView");
           
            //테스트  pdPartCategoryCreationRequestView 에서 데이터를 가져오지 못하므로 임시 작업 
            similar_category_code = "PC2012300037";

            var aFilters3 = [];
            aFilters3.push(new Filter("tenant_id", FilterOperator.EQ, this.tenant_id ));
            aFilters3.push(new Filter("category_group_code", FilterOperator.EQ, this.category_group_code));
            aFilters3.push(new Filter("category_code", FilterOperator.EQ, similar_category_code ));
            // aFilters3.push(new Filter("category_code", FilterOperator.EQ, this.similar_category_code ));

            console.log(aFilters3);

            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.activityStdDayService/").read("/pdActivityStdDayView", {
                filters: aFilters3,
                success: function (oData) {
                    console.log("pdActivityStdDayView");
                    console.log(oData);
                    this.getModel("pdActivityStdDayView").setData(oData.results);
                    
                }.bind(this)
            });
            
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
                // aIndices.push(oItem.getBindingContext("pdPartCategoryLng") )  ;
                cntArr.push( oItem.getBindingContext("pdPartCategoryLng").sPath.split("/")[1] );

            });
            for(var i=cntArr.length-1; i > -1; i--){
                v_this.pdPartCategoryLngArr.splice( cntArr[i]  , 1);
            }
            this.getModel("pdPartCategoryLng").setData(v_this.pdPartCategoryLngArr);
            oTable.removeSelections(true);

            console.log(v_this.pdPartCategoryLngArr);
        },



		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function () {
            
            console.log("onPageSaveButtonPress start");
            var oView = this.getView(),
                v_this = this;
                
            if(this.validator.validate(this.byId("midObjectForm")) !== true) return;
            

            var oPdPartCategory = this.getModel("PdPartCategoryModel");
            var oPdPartCategoryLng = this.getModel("pdPartCategoryLng");
            var oPdActivityStdDayView = this.getModel("pdActivityStdDayView");
            var oTableLang = this.byId("midTable2");
            

            // if (this.category_code =! "new"){
            //     CUType = "U";
            //     if(!oPdPartCategory.isChanged() ) {
            //         MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
            //         return;
            //     }
            // }

            var oData = oPdPartCategory.oData;
            var CUType = "C";

            console.log("onPageSaveButtonPress 11111111");
            console.log(oData);
            console.log(this.byId("statusButton").getSelectedKey());
            var pdMstVal = {
					tenant_id       : this.tenant_id,
                    category_group_code   : this.category_group_code,
                    category_code     : "new",
                    parent_category_code        : oData.parent_category_code,
                    sequence     : oData.sequence.trim(),

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
            
            console.log("onPageSaveButtonPress 222222222");
            console.log(this.pdPartCategoryLngArr);
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
            
            console.log("onPageSaveButtonPress 212121212121");
            var oTableSd = this.byId("tableSd");
            var oDataSd = oPdActivityStdDayView.oData;
            console.log(oPdActivityStdDayView);
            console.log(oTableSd);
            
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
                    category_code: oDataSd[i].category_code,                    
                    s_grade_standard_days: oDataSd[i].s_grade_standard_days,

                    a_grade_standard_days: oDataSd[i].a_grade_standard_days,
                    b_grade_standard_days: oDataSd[i].b_grade_standard_days,
                    c_grade_standard_days: oDataSd[i].c_grade_standard_days,
                    d_grade_standard_days: oDataSd[i].d_grade_standard_days,

                    active_flag: oDataSd[i].active_flag.toString(),
                    update_user_id: this.loginUserId,
                    crud_type_code: CUType
                });
            }
            input.inputData.pdSD = pdSDVal;


            console.log("onPageSaveButtonPress 3333333333");
            

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
                                console.log(rst);
                                if(rst.return_code =="OK"){
                                    sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                    v_this.onPageNavBackButtonPress();
                                }else{
                                    // console.log(rst);
                                    sap.m.MessageToast.show( "error : "+rst.return_msg );
                                }
                            },
                            error: function (rst) {
                                    // console.log("eeeeee");
                                    console.log(rst);
                                    sap.m.MessageToast.show( "error : "+rst.return_msg );
                                    // v_this.onSearch(rst.return_msg );
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
            if (this._sRequestNumber !== "new"){
                this._toShowMode();
            }else{
                this.getRouter().navTo("mainPage", {}, true);
            }
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
            var oButton = oEvent.getSource(),
                oView = this.getView();

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
                console.log( row);
                this.getView().byId("searchField").setValue( "[" + row.category_code + " ] " + row.category_name);
                // this.getView().byId("similarCategoryCode").setValue( "[" + row.category_code + " ] " + row.category_name);
                console.log(this.getView().byId("searchField").getValue());
                this.onSearchPdActivityStdDayView(row.category_code);
            }

            this.partCategoryPopupClose();
        }
        
        , partCategoryPopupClose: function (oEvent) {
            this.byId("PartCategory").close();
        }

        
        
    });
});