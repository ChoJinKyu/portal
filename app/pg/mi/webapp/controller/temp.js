
MidObject.controller.js:159 _showFormFragment
남은작업  11월 23일에 진행해야할 작업 ===============================
-main page
팬딩 처리 안되고있음 (삭제나 수정을 담아 둘수 있기만함...)
CRUD 테스트 완료. 
필터 -전체- 처리.
초기 (검색) 리스트 실행 처리 
스마트 필터 콤보박스 리스트 확인
 
-mid page
팬딩처리 안되고있음 
CRUD 테트스 완료. 
Language 리스트에서 저장한 값 셀렉트 작업
Fragment 작업


수정시 수정 화면에서 오브젝트들 값 채워주어야 한다. 
state = "{midObjectData>/use_flag}"
main page
> onMainTableItemPress


mid page 

_onRoutedThisPage


var midObjectData = new JSONModel({
    tenant_id: "",
    company_code: "",
    org_type_code: "",
    org_code: "",
    category_text : "",
    category : "",
    mi_material_code: "",                
    use_flag: "",
    filters : []            
});


if(sFragmentName=="Change"){
                            
                
    
}else{
    sap.ui.core.Fragment.byId("Change_id","account_pop_code").getValue();
    oView.byId("textMaterialCode").setText(midObjectData.getProperty("/mi_material_code"));
    oView.byId("textcategory_codeName").setText(midObjectData.getProperty("/category_code"));
    oView.byId("textUse_flag").setText(midObjectData.getProperty("/use_flag") == "true" ? "사용" : "미사용" );

    
    textMaterialCode
}



            //sap.ui.core.Fragment.byId("account_pop_id","account_pop_code").getValue();
            this._showFormFragment("Display");
  
            //this.byId("page").setSelectedSection("pageSectionMain");
            //this.byId("page").setProperty("showFooter", false);
            // this.byId("pageEditButton").setEnabled(true);
            // this.byId("pageDeleteButton").setEnabled(true);
            // this.byId("pageNavBackButton").setEnabled(true);

            this._setTableFilters("midTableDisplay", midObjectData.getProperty("/mi_material_code")); 

            
           // this._midTable = this.getView().byId("midTable");

            //this.byId("page").setSelectedSection("pageSectionMain");
            //this.byId("page").setProperty("showFooter", true);
            // this.byId("pageEditButton").setEnabled(false);
            // this.byId("pageDeleteButton").setEnabled(false);
            // this.byId("pageNavBackButton").setEnabled(false);

            oView.byId("inputMaterialCode").setValue(midObjectData.getProperty("/mi_material_code"));
            oView.byId("comboBoxcategory_code_code").setSelectedKey(midObjectData.getProperty("/category_code_code"));           
            oView.byId("switchUse_flag").setState(midObjectData.getProperty("/use_flag")=="true" ? true : false );
           
            //this._setTableFilters("midTableChange", midObjectData.getProperty("/mi_material_code"));       
           
            this.getView().byId("inputMaterialCode").setValue( oData.mi_material_code_text );
            this.getView().byId("buttonMaterialCheck").setEnable(false);

            
83
MIMatListView(tenant_id='L2100',company_code='*',
org_type_code='BU',org_code='BIZ00100',
mi_material_code='ALU-001-01')
http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MIMaterialCodeList(tenant_id='L2100',company_code='*',org_type_code='BU',org_code='BIZ00100',mi_material_code='LED-001-01')/?$format=json


oEvent.getSource().getCells()[0].mAggregations.customData[0]
onEdit
this._showFormFragment("Display");
_toEditMode
var midObjectData = this.getModel("midObjectData");

MIMaterialCodeText


"tenant_id": midObjectData.getProperty("/tenant_id"),
"company_code": midObjectData.getProperty("/tenant_id"),
"org_type_code": midObjectData.getProperty("/tenant_id"),
"org_code": midObjectData.getProperty("/tenant_id"),
"mi_material_code": midObjectData.getProperty("/tenant_id"),
"language_code":  this.getView().byId("language_code").getValue(),
"mi_material_code_text": this.getView().byId("mi_material_code_text").getValue(),
"local_create_dtm": new Date(),
"local_update_dtm": new Date(),
"create_user_id": "Admin",
"update_user_id": "Admin",
"system_create_dtm": new Date(),
"system_update_dtm": new Date()



midObjectData.setProperty("/tenant_id", oArgs.tenant_id);
<core:CustomData key="tenant_id" value="{tenant_id}"/>
<core:CustomData key="company_code" value="{company_code}"/>
<core:CustomData key="org_code" value="{org_code}"/>
<core:CustomData key="org_type_code" value="{org_type_code}"/>
<core:CustomData key="category_code" value="{category_code}"/>

-기획서 참고 재 확인.
http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MIMaterialCodeList/?$format=json
http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MIMaterialCodeList(tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100',mi_material_code='LED-001-01')

MIMaterialCodeText tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100',mi_material_code='ALU-001-01',language_code='EN'
MICategoryView(tenant_id='L2100',company_code='*',org_type_code='BU',org_code='BIZ00100',category='Non-Ferrous%20Metal'): {__metadata: {…}, tenant_id: "L2100", company_code: "*", org_type_code: "BU", org_code: "BIZ00100", …}
MIMatListView(tenant_id='L2100',company_code='*',org_type_code='BU',org_code='BIZ00100',mi_material_code='ALU-001-01'): {__metadata: {…}, tenant_id: "L2100", company_code: "*", org_type_code: "BU", org_code: "BIZ00100", …}
MIMatListView(tenant_id='L2100',company_code='*',org_type_code='BU',org_code='BIZ00100',mi_material_code='COP-001-01'): {__metadata: {…}, tenant_id: "L2100", company_code: "*", org_type_code: "BU", org_code: "BIZ00100", …}
MIMatListView(tenant_id='L2100',company_code='*',org_type_code='BU',org_code='BIZ00100',mi_material_code='LED-001-01'): {__metadata: {…}, tenant_id: "L2100", company_code: "*", org_type_code: "BU", org_code: "BIZ00100", …}
MIMatListView(tenant_id='L2100',company_code='*',org_type_code='BU',org_code='BIZ00100',mi_material_code='NIC-001-01'): {__metadata: {…}, tenant_id: "L2100", company_code: "*", org_type_code: "BU", org_code: "BIZ00100", …}
MIMatListView(tenant_id='L2100',company_code='*',org_type_code='BU',org_code='BIZ00100',mi_material_code='TIN-001-01'): {__metadata: {…}, tenant_id: "L2100", company_code: "*", org_type_code: "BU", org_code: "BIZ00100", …}
UseYNView(tenant_id='L2100',code='FALSE'): {__metadata: {…}, tenant_id: "L2100", code: "FALSE", code_name: "미사용"}
UseYNView(tenant_id='L2100',code='TRUE'): {__metadata: {…}, tenant_id: "L2100", code: "TRUE", code_name: "사용"}

/**
         * midTable filter
         */

        

        _setTableFilters : function() {

            /**
             * 모든 작업은 공통 모듈을 사용하지 않아도 된다. 
             * 모든 테이블을 스마트 테이블로 가야 가야하는가? 리포트 뷰형은 스마트 테이블을 사용한다. 
             * 
             */
            var midObjectData = this.getModel("midObjectData");

            //sample 'LED-001-01'
            var oModel = this.getOwnerComponent().getModel();
            this._midTable.setModel(oModel);
            var oBinding = this._midTable.getBinding("items");
            var aFilters = [new sap.ui.model.Filter("tenant_id", sap.ui.model.FilterOperator.EQ, midObjectData.getProperty("/tenant_id"))];
            // var aFilters = [
            //     new sap.ui.model.Filter("tenant_id", sap.ui.model.FilterOperator.EQ, midObjectData.getProperty("/tenant_id")),
            //     new sap.ui.model.Filter("company_code", sap.ui.model.FilterOperator.EQ, midObjectData.getProperty("/company_code")),
            //     new sap.ui.model.Filter("org_type_code", sap.ui.model.FilterOperator.EQ, midObjectData.getProperty("/org_type_code")),
            //     new sap.ui.model.Filter("org_code", sap.ui.model.FilterOperator.EQ, midObjectData.getProperty("/org_code")),
            //     new sap.ui.model.Filter("mi_material_code", sap.ui.model.FilterOperator.EQ, midObjectData.getProperty("/mi_material_code"))
            //     ];
            //aFilters.push(aFilters);
            oBinding.filter(aFilters);
        },
            //var oContext = this.getView().getModel().createEntry("MIMaterialCodeText",oData);
            //this._midTable.setBindingContext(oContext);
           // console.log(oContext);    
            // this.getView().getModel().create(
            //     "/MIMaterialCodeText",{"tenant_id":midObjectData.getProperty("/tenant_id"), "code":"KO","code_name":""},{
            //     error: function (oError) { MessageToast.show(oError);  },
            //     success: function (oData, response) {
            //         MessageToast.show("ok");
            //        // oInput.setValue("");
            //        // that._setSaveButtons(false);
            //     }
            // });

          
            //     var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
            //         pattern: "yyyy-MM-dd'T'HH:mm"
            //     });
                
            //     var oNow = new Date();
            //     var utcDate = oDateFormat.format(oNow)+":00Z"; 
               
               
          
            // var oMidTable = this._midTable.getBinding("items");
            // var oContext = oMidTable.create({
            //     "tenant_id": "L2100",
            //     "company_code": "*",
            //     "org_type_code": "BU",
            //     "org_code": "BIZ00100",
            //     "mi_material_code": "ALU-001-01",
            //     "language_code": "",
            //     "mi_material_code_text": "",
            //     "local_create_dtm": utcDate,
            //     "local_update_dtm": utcDate,
            //     "create_user_id": "Admin",
            //     "update_user_id": "Admin",
            //     "system_create_dtm": utcDate,
            //     "system_update_dtm": utcDate
            //     });

            //             this.byId("lineItemsList").addItem( new sap.m.ColumnListItem(XXXX));

            // this.byId("lineItemsList").removeItem(oEvent.getParameter("listItem"));



            // this._midTable.addItem( new sap.m.ColumnListItem(XXXX));

            // var retContext = oModel.createEntry("/LanguageView", {

            //     properties: newData,
                
            //     success: function() {
                
            //     },
                
            //     error: function() {
                
            //     }
                
            //     });

            //json version
            // var oModel = this.getOwnerComponent().getModel(),
            //     oLanguageView = oModel.getProperty("/LanguageView"),
            //     oTable = this._midTable,
            //     oNewData = {
            //         tenant_id: midObjectData.getProperty("/tenant_id"),
            //         code: "KO",
            //         code_name: ""
            //     };

            //  oLanguageView.push(oNewData);
            //  oModel.refresh(true);


            
            //odata version
           // var oBinding = this._midTable.getBinding("items");
            // var oContext = oBinding.create({  
            //         "tenant_id": midObjectData.getProperty("/tenant_id"),
            //         "code": "KO",
            //         "code_name": "" 
            //     });
            // var oModel=this._midTable.getModel();

            //     var oData = {
            //         tenant_id: midObjectData.getProperty("/tenant_id"),
            //         code: "KO",
            //         code_name: "" 
            //     }
            //     oModel.createEntry("/MIMaterialCodeText", oData);

                //focus 이동
                // this._midTable.getItems().some(function (oItems) {
                //   if (oItems.getBindingContext() === oContext) {
                //       oItems.focus();
                //       oItems.setSelected(true);       
                //       return true;
                //   }
                // });          

                console.groupEnd();

                439


                this._setControl();



                ====add row 테스트 


		/**
		 * Table Add Row 안됨..
		 * @param {*} retContext 
		 */
		onPageTableSaveButtonPress : function(retContext) {
			console.group("onPageTableSaveButtonPress");

			//안됨..
			// var _mainTableClone = this._mainTable.clone();
			// _mainTableClone.setBindingContext(retContext);
			
			// //this._mainTable.addItem(_mainTableClone);		
			// this._mainTable.addItem( new sap.m.ColumnListItem(_mainTableClone));

			console.groupEnd();
        },                
        


20201124 오전 1시 완료버젼 
        =======================================================



        sap.ui.define([
            "./BaseController",
            "sap/ui/core/routing/History",
            "sap/ui/model/json/JSONModel",
            "ext/lib/model/ManagedModel",
            "ext/lib/model/ManagedListModel",
            "ext/lib/formatter/DateFormatter",
            "sap/ui/model/Filter",
            "sap/ui/model/FilterOperator",
            "sap/ui/core/Fragment",
            "sap/m/MessageBox",
            "sap/m/MessageToast",
            "sap/base/Log"
        ], function (BaseController, History, JSONModel, ManagedModel, ManagedListModel, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, MessageToast, Log) {
            "use strict";
        
            return BaseController.extend("pg.mi.controller.MidObject", {
        
                dateFormatter: DateFormatter,
        
                /* =========================================================== */
                /* lifecycle methods                                           */
                /* =========================================================== */
        
                /**
                 * Called when the midObject controller is instantiated.
                 * @public
                 */
                onInit: function () {
                    console.group("[mid] onInit");
        
                    var midObjectView = new JSONModel({
                        busy: true,
                        delay: 0,
                        mode : false
                    });
        
                    var midObjectData = new JSONModel({
                        tenant_id: "",
                        company_code: "",
                        org_type_code: "",
                        org_code: "",
                        mi_material_code: "",                
                        use_flag: "",
                        filters : []            
                    });
        
                    //var selectedItem = sap.ui.getCore().getModel("selectedItem");
                    //console.log(selectedItem);
        
                   
                    this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);
        
                    this.setModel(midObjectView, "midObjectView");            
                    this.setModel(midObjectData, "midObjectData");
        
                    // this.setModel(new ManagedModel(), "master");
                    // this.setModel(new ManagedListModel(), "details");          
           
                    
                    
                    console.groupEnd();
                },
        
                /**
                 * midTable filter
                 */
                _setTableFilters : function(tableName, mi_material_code) {
        
                    Log.info("_setTableFilters >  tableName : " + tableName );
                    /**
                     * 모든 작업은 공통 모듈을 사용하지 않아도 된다. 
                     * 모든 테이블을 스마트 테이블로 가야 가야하는가? 리포트 뷰형은 스마트 테이블을 사용한다. 
                     * 
                     */
                    var midObjectData = this.getModel("midObjectData"),
                        midTale = this.getView().byId(tableName);
        
                    //sample 'LED-001-01'
                    var oModel = this.getOwnerComponent().getModel(),
                        oBinding = midTale.getBinding("items"),
                        aFilters = [];
                        midTale.setModel(oModel);
                   
                    var oFilter = new sap.ui.model.Filter("mi_material_code", sap.ui.model.FilterOperator.EQ, mi_material_code);
                    aFilters.push(oFilter);
                    oBinding.filter(aFilters);
        
                },
        
                _formFragments: {},
                        
                /**
                 * Note : 작업중
                 * @param {String} sFragmentName 
                 */
                _getFormFragment: function (sFragmentName) {
                    console.log("call function _getFormFragment");
                    //https://sapui5.netweaver.ondemand.com/#/entity/sap.ui.layout.form.SimpleForm/sample/sap.ui.layout.sample.SimpleForm354/code/Page.controller.js
        
                    var oFormFragment = this._formFragments[sFragmentName];
        
                    if (oFormFragment) {
                        return oFormFragment;
                    }
                    
                    oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "pg.mi.view." + sFragmentName);
        
                    this._formFragments[sFragmentName] = oFormFragment;
                    return this._formFragments[sFragmentName];
        
                },
        
                _showFormFragment : function (sFragmentName) {
                    console.group("_showFormFragment");
                   
        
                    //var oObjectPageSubSection = this.getView().byId("ObjectPageSubSection");
        
                    //oObjectPageSubSection.removeAllBlocks();
                    //oObjectPageSubSection.insertBlock(this._getFormFragment(sFragmentName));
        
                    var oPage = this.byId("page");
                    oPage.removeAllContent();
                    oPage.insertContent(this._getFormFragment(sFragmentName));
                    
                    this.getModel("midObjectView").setProperty("/mode", false);
        
                    console.groupEnd();
                },
        
                /**
                 * 
                 */
                onMaterialCodeCheckOpen : function () {
                    console.group("onMaterialCodeCheckOpen");
                    //inputMaterialCode
                    
                    console.groupEnd();
                },
                /**
                 * 컨트롤 셋팅
                 * @public
                 */
                _setControl: function () {
                    console.group("[mid] _setControl");
           
                    this.byId("inputMaterialCode").attachBrowserEvent('keypress', function (e) {
                        if (e.which == 13) {
                            this.onMaterialCodeCheckOpen();
                        }
                    });
        
                    console.groupEnd();
                },
         
        
                /* =========================================================== */
                /* event handlers                                              */
                /* =========================================================== */
        
               
        
                
                /**
                 * Event handler for Enter Full Screen Button pressed
                 * @public
                 */
                onPageEnterFullScreenButtonPress: function () {
                    var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/fullScreen");
                    this.getRouter().navTo("midPage", {
                        layout: sNextLayout,
                        tenant_id: this._stenant_id,
                        controlOptionCode: this._sControlOptionCode
                    });
                },
                /**
                 * Event handler for Exit Full Screen Button pressed
                 * @public
                 */
                onPageExitFullScreenButtonPress: function () {
                    var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
                    this.getRouter().navTo("midPage", {
                        layout: sNextLayout,
                        tenant_id: this._stenant_id,
                        controlOptionCode: this._sControlOptionCode
                    });
                },
                /**
                 * Event handler for Nav Back Button pressed
                 * @public
                 */
                onPageNavBackButtonPress: function () {
                    var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
                    this.getRouter().navTo("mainPage", { layout: sNextLayout });
                },
        
                /**
                 * Event handler for page edit button press
                 * @public
                 */
                onPageEditButtonPress: function () {
                    //this._toEditMode();
                },
        
                /**
                 * Event handler for delete page entity
                 * @public
                 */
                onPageDeleteButtonPress: function () {
                    var oView = this.getView(),
                        me = this;
                    MessageBox.confirm("Are you sure to delete?", {
                        title: "Comfirmation",
                        initialFocus: sap.m.MessageBox.Action.CANCEL,
                        onClose: function (sButton) {
                            if (sButton === MessageBox.Action.OK) {
                                me.getView().getBindingContext().delete('$direct').then(function () {
                                    me.onNavBack();
                                }, function (oError) {
                                    MessageBox.error(oError.message);
                                });
                            };
                        }
                    });
                },
        
                /**
                 * Event handler for saving page changes
                 * @public
                 */
                onPageSaveButtonPress: function () {
                    var oView = this.getView(),
                        me = this;
                    MessageBox.confirm("Are you sure ?", {
                        title: "Comfirmation",
                        initialFocus: sap.m.MessageBox.Action.CANCEL,
                        onClose: function (sButton) {
                            if (sButton === MessageBox.Action.OK) {
                                oView.setBusy(true);
                                oView.getModel("master").submitChanges({
                                    success: function (ok) {
                                        //me._toShowMode();
                                        oView.setBusy(false);
                                        MessageToast.show("Success to save.");
                                    }
                                });
                            };
                        }
                    });
        
                },
        
        
                /**
                 * Event handler for cancel page editing
                 * @public
                 */
                onPageCancelEditButtonPress: function () {
                    this._toShowMode();
                },
        
                /**
                 * 신규행 추가
                 * @public
                 */
                onMidCreate: function () {
                    console.group("onMidCreate");
                    var midObjectData = this.getModel("midObjectData");
                    
                    var mParameters = {
                        "tenant_id": "L2100",
                        "company_code": "*",
                        "org_type_code": "BU",
                        "org_code": "BIZ00100",
                        "mi_material_code": "ALU-001-01",
                        "language_code": "CN",
                        "mi_material_code_text": "Aluminum",
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date(),
                        "create_user_id": "Admin",
                        "update_user_id": "Admin",
                        "system_create_dtm": new Date(),
                        "system_update_dtm": new Date()
                        };
        
        
                    this.getModel().setData("/MIMaterialCodeText", mParameters);    
                    this.getModel().refresh(true);
                    //var oEntry = this.getModel().createEntry("/MIMaterialCodeText", mParameters);
        
                    // this.getModel().setUseBatch(true);
                    // this.getModel().submitChanges({
                    // 	groupId: "createGroup", 
                    //   success: this._handleCreateSuccess.bind(this),
                    //   error: this._handleCreateError.bind(this)
                    // });
                
                    console.groupEnd();
        
                },
        
                mySuccessHandler : function(){
        
                },
                myErrorHandler : function(){
        
                },
        
         
        
                // doFilter : function(oEvent) {
                //     console.group("doFilter");
                //     var comboBoxCategory_code = this.getView().byId("comboBoxCategory_code"), 
                //     oBindingComboBox = comboBoxCategory_code.getBinding("items"),
                //     midObjectData = this.getModel("midObjectData");
        
                //      oBindingComboBox.filter([                
                //          new Filter("tenant_id", FilterOperator.EQ, midObjectData.getProperty("/tenant_id"))
                //      ]);
                //     console.groupEnd();
                //     //comboBoxCategory_code.attachChange(function () { oTable.getBinding("rows").filter(new sap.ui.model.Filter("payment", sap.ui.model.FilterOperator.EQ, oDropDown.getValue())); });
                // },		
                        
                /**
                 * midtable updateFinished
                 */
                onMitTableUpdateFinished : function(){
                    
                    var oTableBinding = this._midTable.getBinding("items"),
                        midObjectData = this.getModel("midObjectData");
                 
                    // oTableBinding.filter([                
                    //     new Filter("tenant_id", FilterOperator.EQ, midObjectData.getProperty("/tenant_id")),
                    //     new Filter("company_code", FilterOperator.EQ, midObjectData.getProperty("/company_code")),
                    //     new Filter("org_type_code", FilterOperator.EQ, midObjectData.getProperty("/org_type_code")),
                    //     new Filter("org_code", FilterOperator.EQ, midObjectData.getProperty("/org_code")),
                    //     new Filter("mi_material_code", FilterOperator.EQ, midObjectData.getProperty("/mi_material_code"))
                    // ]);
                },
                   
        
                /* =========================================================== */
                /* internal methods                                            */
                /* =========================================================== */
        
                /**
                 * When it routed to this page from the other page.
                 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
                 * @private
                 */
                _onRoutedThisPage: function (oEvent) {
                    console.group("[mid] _onRoutedThisPage"); 
                    
                    var oArgs = oEvent.getParameter("arguments"),
                    midObjectData = this.getModel("midObjectData"),
                        oView = this.getView(),
                        that = this;
                      
                        midObjectData.setProperty("/tenant_id", oArgs.tenant_id);
                        midObjectData.setProperty("/company_code", oArgs.company_code);
                        midObjectData.setProperty("/org_type_code", oArgs.org_type_code);
                        midObjectData.setProperty("/org_code", oArgs.org_code);
                        midObjectData.setProperty("/mi_material_code", oArgs.mi_material_code);                
                        midObjectData.setProperty("/use_flag", oArgs.use_flag);
        
                        console.log("tenant_id", oArgs.tenant_id);
                        console.log("company_code", oArgs.company_code);
                        console.log("org_type_code", oArgs.org_type_code);
                        console.log("mi_material_code", oArgs.mi_material_code);
                        console.log("org_code", oArgs.org_code);
                        console.log("use_flag", oArgs.use_flag);
                    
        
                       //Note 전달받은 주소값으로 수정한다. 
                        //var sServiceUrl = "/MIMaterialCodeList(tenant_id='"+oArgs.tenant_id+"',company_code='"+oArgs.company_code+"',org_type_code='"+oArgs.org_type_cod+"',org_code='"+oArgs.org_code+"',mi_material_code='"+oArgs.mi_material_code+"')";
                        var sServiceUrl = "/MIMaterialCodeList(tenant_id='"+oArgs.tenant_id+"',company_code='"+oArgs.company_code+"',org_type_code='"+oArgs.org_type_code+"',org_code='"+oArgs.org_code+"',mi_material_code='"+oArgs.mi_material_code+"')";
                        //this._bindView(sServiceUrl);
                        //oView.setBusy(true);
                        //var oDetailModel = this.getModel("details");
                        var oModel = this.getOwnerComponent().getModel(),
                        oView = this.getView(),
                        midObjectDataModel = this.getModel("midObjectData"),
                        that = this;
        
                        oModel.read(sServiceUrl, {
                            success: function (oData) {
        
                                console.log("oData~~~~~~~"+JSON.stringify(oData));  
                                
                                midObjectDataModel.setProperty("mi_material_code", oData.mi_material_code)
                                midObjectDataModel.setProperty("company_code", oData.company_code)
                                midObjectDataModel.setProperty("org_type_code", oData.org_type_code)
                                midObjectDataModel.setProperty("org_code", oData.org_code)
                                midObjectDataModel.setProperty("mi_material_code", oData.mi_material_code)
                                midObjectDataModel.setProperty("use_flag", oData.use_flag)
                                
                                //전달된 자재코드가 없을때 신규
                                //Note tenant_id='L2100',company_code='*',org_type_code='BU',org_code='BIZ00100' 다음 기본 키 값을 어떻게 설정할지 확인해야한다. 
        
                                that.onPageMode(false);
                            }
                            
                        });
        
                    console.groupEnd();
                },
        
                onBeforeRebindTable : function(oEvent) {
                    console.group("[mid] onBeforeRebindTable");
                    var mBindingParams = oEvent.getParameter("bindingParams"),
                        midObjectData = this.getModel("midObjectData");
        
                    mBindingParams.filters.push(new Filter("tenant_id", FilterOperator.EQ, "L2100"));
                    
                    // mBindingParams.filters.push(new Filter("company_code", FilterOperator.EQ, midObjectData.getProperty("company_code")));
                     //mBindingParams.filters.push(new Filter("org_type_code", FilterOperator.EQ, midObjectData.getProperty("org_type_code")));          
                     //mBindingParams.filters.push(new Filter("org_code", FilterOperator.EQ, midObjectData.getProperty("org_code")));   
                     //mBindingParams.filters.push(new Filter("mi_material_code", FilterOperator.EQ, midObjectData.getProperty("mi_material_code")));
                   
                
                     console.groupEnd();
                },
                /**
                 * Binds the view to the object path.
                 * @function
                 * @param {string} sServiceUrl path to the object to be bound
                 * @private
                 */
                _bindView: function (sServiceUrl) {
                    
                    var oView = this.getView();
                    // oModel = this.getModel("master");
                    // oView.setBusy(true);
                    // oModel.setTransactionModel(this.getModel());
                                   
                    var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
                    oModel.read(sServiceUrl, {
                        success: function (oData) {
                            debugger;
                            //oView.setBusy(false);
                            //this.setLog("oData~~~~~~~"+JSON.stringify(oData));
                            this.getView().byId("inputMaterialCode").setValue( oData.mi_material_code_text );
                            this.getView().byId("buttonMaterialCheck").setEnable(false);
                        }
                    });
                },
        
                onEdit : function(){
                    var midObjectView = this.getModel("midObjectView"),
                        buttonMidEdit = this.getView().byId("buttonMidEdit");
                    var pageMode = midObjectView.getProperty("/mode");
                    if(!pageMode){this.onPageMode(true);buttonMidEdit.setText("Show");}
                    else{this.onPageMode(false);buttonMidEdit.setText("Edit");}
                },
        
                onPageMode : function(modeType){
        
                    if(!modeType){ this._toShowMode(); }
                    else{this._toEditMode();}
                },
        
                _toEditMode: function () {
                    console.group("_toEditMode");
                    var oView = this.getView(),
                        midObjectData = this.getModel("midObjectData");
        
                    this._showFormFragment("Change");
        
                   // this._midTable = this.getView().byId("midTable");
        
                    //this.byId("page").setSelectedSection("pageSectionMain");
                    //this.byId("page").setProperty("showFooter", true);
                    // this.byId("pageEditButton").setEnabled(false);
                    // this.byId("pageDeleteButton").setEnabled(false);
                    // this.byId("pageNavBackButton").setEnabled(false);
        
                    alert(midObjectData.getProperty("/category"));
                    oView.byId("inputMaterialCode").setValue(midObjectData.getProperty("/mi_material_code"));
                    oView.byId("comboBoxCategory_code").setSelectedKey(midObjectData.getProperty("/category_code"));           
                    oView.byId("switchUse_flag").setState(midObjectData.getProperty("/use_flag")=="true" ? true : false );
                    this._setTableFilters("midTableChange", midObjectData.getProperty("/mi_material_code"));       
                    this.getModel("midObjectView").setProperty("/mode", true);
                    console.groupEnd();
                },
        
                _toShowMode: function () {
                    console.group("_toShowMode");
                    var oView = this.getView(),
                    midObjectData = this.getModel("midObjectData");
                    
                    this._showFormFragment("Display");
                    this.byId("textMaterialCode").setText(midObjectData.getProperty("/mi_material_code"));
                    this.byId("textCategoryName").setText(midObjectData.getProperty("/category"));
                    this.byId("textUse_flag").setText(midObjectData.getProperty("/use_flag") == "true" ? "사용" : "미사용" );
        
                    //this.byId("page").setSelectedSection("pageSectionMain");
                    //this.byId("page").setProperty("showFooter", false);
                    // this.byId("pageEditButton").setEnabled(true);
                    // this.byId("pageDeleteButton").setEnabled(true);
                    // this.byId("pageNavBackButton").setEnabled(true);
        
                    this._setTableFilters("midTableDisplay", midObjectData.getProperty("/mi_material_code")); 
        
                    this.getModel("midObjectView").setProperty("/mode", false);
                    
                    console.groupEnd();
                },
                
        
               /**
                 * 행 삭제
                 * Note :행삭제
                 */
                onMidTableDelete: function () {
                    console.group("[mid] onMidTableDelete");
                    
                    var oModel = this.getOwnerComponent().getModel(),
                        oView = this.getView(),
                        oTable = oView.byId("midTableChange"),
                        oData = oModel.getData(),
                        oPath,
                        that = this;
                        
                    var oSelected = oTable.getSelectedContexts();   
                    if (oSelected.length > 0) { 
                                    
                        MessageBox.confirm("선택한 항목을 삭제 하시겠습니까?", {
                            title: "삭제 확인",                                    
                            onClose: this._deleteAction.bind(this),                                    
                            actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
                            textDirection: sap.ui.core.TextDirection.Inherit    
                        });
                    
                    }
                    console.groupEnd();               
                },
        
               /**
                 * 삭제 액션
                 * @param {sap.m.MessageBox.Action} oAction 
                 */
                _deleteAction: function(oAction) {
                    console.group("_deleteAction");
                    var oView = this.getView(),
                        oTable = oView.byId("midTableChange");
        
                    if(oAction === sap.m.MessageBox.Action.DELETE) {
                        oTable.getSelectedItems().forEach(function(oItem){
                            var sPath = oItem.getBindingContextPath();	
                      
                            var mParameters = {"groupId":"deleteGroup"};
                            oItem.getBindingContext().getModel().remove(sPath, mParameters);
                        });
                        
                        var oModel = this.getView().getModel();
                        oModel.submitChanges({
                              groupId: "deleteGroup", 
                            success: this._handleDeleteSuccess,
                            error: this._handleDeleteError
                         });
                    }
                    console.groupEnd();
                },
                        
                /**
                 * MIMaterialCodeText create
                 * Note : midTable 행을 저장한다. 
                 * 이미 저장되어 있는 키를 확인하여 업데이트 한다. 
                 */
                onMidTableCreate : function () {
                    console.group("onMidTableCreate");
                    
                    ///this.onMainSave();
        
                    var mParameters1 = {
                    "tenant_id": "L2100",
                    "company_code": "*",
                    "org_type_code": "BU",
                    "org_code": "BIZ00100",
                    "mi_material_code": "LED-001-01",
                    "language_code": "DN",
                    "mi_material_code_text": "D_NAluminum",
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date(),
                    "create_user_id": "Admin",
                    "update_user_id": "Admin",
                    "system_create_dtm": new Date(),
                    "system_update_dtm": new Date()
                    };
        
        
                    // create/
                    var oEntry1 = this.getModel().create("/MIMaterialCodeText", mParameters1);
                            
                    //this.getView().byId("midTable").setBindingContext(oEntry);
        
                    this.getModel().setUseBatch(true);
                    this.getModel().submitChanges({
                        groupId: "crateGroup", 
                        success: this._handleCreateSuccess.bind(this),
                        error: this._handleCreateError.bind(this)
                    });
                                 
                    console.groupEnd();
                } ,
                
                /**
                 * MIMaterialCodeList update
                 */
                onMidUpdate : function () {
                     console.group("onMidUpdate");
        
            
                    var mi_material_code = "BIZ00121";
                    var mParameters = {
                        "groupId":"updateGroup",
                        "properties" : {
                            "tenant_id": "L2100",
                            "company_code": "*",
                            "org_type_code": "BU",
                            "org_code": "BIZ00100",
                            "mi_material_code": "BIZ00121",
                            "mi_material_code_text": "BIZ00121",
                            "category": "Non-Ferrous Metal",
                            "category_text": "비철금속",
                            "use_flag": true,
                            "local_create_dtm": new Date(),
                            "local_update_dtm": new Date(),
                            "create_user_id": "Admin",
                            "update_user_id": "Admin",
                            "system_create_dtm": new Date(),
                            "system_update_dtm": new Date()
                        }
                    };		
                    
                    //Note : update 안되고 있음 확인 필요
                    // var ServiceURL="/MIMaterialCodeList(tenant_id='L2100',company_code='*',org_type_code='BU',org_code='BIZ00130',mi_material_code='BIZ00121'";
                    // var oModel = this.getOwnerComponent().getModel();
                    // oModel.loadDataNew(ServiceURL, this._handleUpdateSuccess, this._handleUpdateError, mParameters, true, "PUT");
        
                    var sPatch = "/MIMaterialCodeList(tenant_id='L2100',company_code='*',org_type_code='BU',org_code='BIZ00130',mi_material_code='BIZ00121')";
                    var oEntry = this.getModel().update(sPatch, mParameters);
                            
                    //this.getView().byId("midTable").setBindingContext(oEntry);
        
                    this.getModel().setUseBatch(true);
                    this.getModel().submitChanges({
                        groupId: "updateGroup", 
                        success: this._handleUpdateSuccess.bind(this),
                        error: this._handleUpdateError.bind(this)
                    });
            
                    console.groupEnd();
                } ,
        
        
                /**
                 * MIMaterialCodeList create
                 */
                onMainSave : function() {
                    
                    var mi_material_code = "BIZ00121";
                    var mParameters = {
                        "groupId":"createGroup",
                        "properties" : {
                            "tenant_id": "L2100",
                            "company_code": "*",
                            "org_type_code": "BU",
                            "org_code": "BIZ00130",
                            "mi_material_code": mi_material_code,
                            "mi_material_code_text": "",
                            "category": "Non-Ferrous Metal",
                            "category_text": "비철금속",
                            "use_flag": true,
                            "local_create_dtm": new Date(),
                            "local_update_dtm": new Date(),
                            "create_user_id": "Admin",
                            "update_user_id": "Admin",
                            "system_create_dtm": new Date(),
                            "system_update_dtm": new Date()
                        }
                    };					
                    var oEntry = this.getModel().createEntry("/MIMaterialCodeList", mParameters);
                    //this.getView().byId("mainTable").setBindingContext(oEntry);
        
                    this.getModel().setUseBatch(true);
                    this.getModel().submitChanges({
                        groupId: "createGroup", 
                      success: this._handleCreateSuccess.bind(this),
                      error: this._handleCreateError.bind(this)
                    });
                },
                _handleCreateSuccess: function(oData) {
                    MessageToast.show("저장에 성공 하였습니다.");
                },
                _handleCreateError: function(oError) {
                    MessageBox.error("저장에 실패 하였습니다.");
                },
                _handleUpdateSuccess: function(oData) {
                    MessageToast.show("수정에 성공 하였습니다.");
                },
                _handleUpdateError: function(oError) {
                    MessageBox.error("수정에 실패 하였습니다.");
                },
                /**
                 * 삭제 성공
                 * @param {ODATA} oData 
                 * @private
                 */
                _handleDeleteSuccess: function(oData) {
                    MessageToast.show("삭제가 성공 하였습니다.");
                    this.getView().byId("buttonMainTableDelete").setEnabled(false);
                },
                
                /**
                 * 삭제실패
                 * @param {Event} oError 
                 * @private
                 */
                _handleDeleteError: function(oError) {
                    MessageToast.show("삭제가 실패 되었습니다.");
                }
            });
        });



        items="{
            path : 'cc>/CodeCombo',
            filters : [
                {path : 'tenant_id', operator : 'EQ', value1 : '1000'},
                {path : 'company_code', operator : 'EQ', value1 : 'G100'},
                {path : 'group_code', operator : 'EQ', value1 : 'CM_CHAIN_CD'},
                {path : 'language_cd', operator : 'EQ', value1 : 'KO'}                                                                        
            ]
        }"
        

        _onCreateModeMetadataLoaded: function() {
			console.group("_onCreateModeMetadataLoaded");
			this.getView().getModel().setUseBatch(true);
			this.getView().getModel().setDeferredGroups(["updateGroup","deleteGroup","createGroup"]);
            
            this.getView().getModel().setChangeGroups({
			  "MIMaterialCodeList": {
			    groupId: "updateGroup",
			    changeSetId: "updateGroup"
			  }
			});
            this.getView().getModel().attachPropertyChange(this._propertyChanged.bind(this));
            
			console.groupEnd();
        },
        

        신규라인 
        https://blogs.sap.com/2016/06/15/create-an-add-item-in-a-table-with-sapui5/

        oModel.setDeferredGroups(oModel.getDeferredGroups().concat(["taleGroupId"]));


        onMidTableCreate : function () {
            
            console.group("onMidTableCreate");

            var midObjectData = this.getModel("midObjectData"),
                oModel = this.getView().getModel();
        
            oModel.setDeferredGroups(oModel.getDeferredGroups().concat(["tableGroupId"]));

	        var mParameters = {
	        	"groupId":"tableGroupId",
	        	"properties" : {
                    "tenant_id": midObjectData.getProperty("/tenant_id"),
                    "company_code":  midObjectData.getProperty("/company_code"),
                    "org_type_code": midObjectData.getProperty("/org_type_code"),
                    "org_code": midObjectData.getProperty("/org_code"),
                    "mi_material_code": midObjectData.getProperty("/mi_material_code"),
                    "language_code": "KO",
                    "mi_material_code_name": "",
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date(),
                    "create_user_id": "Admin",
                    "update_user_id": "Admin",
                    "system_create_dtm": new Date(),
                    "system_update_dtm": new Date()
                } 
            };           
   
            
            //에러는 나지 않지만 행추가는 되지 않음 2
            //this.getModel().createEntry("/MIMaterialCodeText", mParameters);      
            // this.getModel().refresh(true);
            // create/createEntry


            /*데이타를 바로 등록 1*/
            this.getModel().create("/MIMaterialCodeText", mParameters);             
			this.getModel().setUseBatch(true);
	    	this.getModel().submitChanges({
			    groupId: "tableGroupId", 
                success: this._handleCreateSuccess.bind(this),
                error: this._handleCreateError.bind(this)
            });
            //submitBatch

            /*행추가 후 등록 테스트중 
            https://blogs.sap.com/2016/06/15/create-an-add-item-in-a-table-with-sapui5/
            var retContext = oModel.createEntry("/MIMaterialCodeText", {
                properties: mParameters,
                success: this._handleCreateSuccess.bind(this),
                error: this._handleCreateError.bind(this)                
            });


            var midTable = sap.ui.core.Fragment.byId("Change_id","midTableChange", this);

            //var lisItemForTable = midTable.clone();

            //var lisItemForTable.setBindingContext(retContext);
            midTable.setBindingContext(retContext);
            midTable.addItem(lisItemForTable);

            // this.byId("lineItemsList").addItem( new sap.m.ColumnListItem(XXXX));
            // this.byId("lineItemsList").removeItem(oEvent.getParameter("listItem"));

            //return;
            //this.getView().byId("midTable").setBindingContext(oEntry);
            */
                         
			console.groupEnd();
        } ,
        "https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap:443/odata/
        v2/pg.marketIntelligenceService/
        MIMaterialCodeText(tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100',mi_material_code='ALU-001-01',language_code='EN')",

        http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MIMaterialCodeText/?$format=json

        http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MIMaterialCodeText/?$filter=mi_material_code%20eq%20%27ALU-001-01%27

        "tenant_id": midObjectData.getProperty("/tenant_id"),
        "company_code":  midObjectData.getProperty("/company_code"),
        "org_type_code": midObjectData.getProperty("/org_type_code"),
        "org_code": midObjectData.getProperty("/org_code"),
        "mi_material_code": midObjectData.getProperty("/mi_material_code"),
        "language_code": "CO",
        "mi_material_code_name": "",
        "local_create_dtm": new Date(),
        "local_update_dtm": new Date(),
        "create_user_id": "Admin",
        "update_user_id": "Admin",
        "system_create_dtm": new Date(),
        "system_update_dtm": new Date()



        var aFilters = [
            new sap.ui.model.Filter("tenant_id", sap.ui.model.FilterOperator.EQ,  oArgs.tenant_id),
            new sap.ui.model.Filter("company_code", sap.ui.model.FilterOperator.EQ,  oArgs.company_code),
            new sap.ui.model.Filter("org_type_code", sap.ui.model.FilterOperator.EQ,  oArgs.org_type_code),
            new sap.ui.model.Filter("org_code", sap.ui.model.FilterOperator.EQ,  oArgs.org_code),
            new sap.ui.model.Filter("mi_material_code", sap.ui.model.FilterOperator.EQ,  oArgs.mi_material_code)
        ];

        //var sServiceUrl = "+oArgs.org_type_cod+"',org_code='"+oArgs.org_code+"',mi_material_code='"+oArgs.mi_material_code+"')";
        //var sServiceUrl = "/MIMaterialCodeList/?$f(tenant_id='"+oArgs.tenant_id+"',company_code='"+oArgs.company_code+"',org_type_code='"+oArgs.org_type_code+"',org_code='"+oArgs.org_code+"',mi_material_code='"+oArgs.mi_material_code+"')";

        // MIMaterialCodeList(tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100'
        // ,mi_material_code='LED-001-01')

        var sServiceUrl ="/MIMaterialCodeList";

        var oModel = this.getOwnerComponent().getModel(),
        oView = this.getView(),
        midObjectDataModel = this.getModel("midObjectData"),
        that = this;
       
        midObjectView.setProperty("pageMode", false);

        //var sServiceUrl = "/MIMaterialCodeList(tenant_id='"+oArgs.tenant_id+"',company_code='"+oArgs.company_code+"',org_type_code='"+oArgs.org_type_code+"',org_code='"+oArgs.org_code+"',mi_material_code='"+oArgs.mi_material_code+"')";

        var oModel = this.getOwnerComponent().getModel();

        var aFilters = [
            new sap.ui.model.Filter("tenant_id", sap.ui.model.FilterOperator.EQ,  oArgs.tenant_id),
            new sap.ui.model.Filter("company_code", sap.ui.model.FilterOperator.EQ,  oArgs.company_code),
            new sap.ui.model.Filter("org_type_code", sap.ui.model.FilterOperator.EQ,  oArgs.org_type_code),
            new sap.ui.model.Filter("org_code", sap.ui.model.FilterOperator.EQ,  oArgs.org_code),
            new sap.ui.model.Filter("mi_material_code", sap.ui.model.FilterOperator.EQ,  oArgs.mi_material_code)
        ];

        var sServiceUrl ="/MIMaterialCodeList";

        oModel.read(sServiceUrl, {
            async : false,
            filters : aFilters,
            success: function (oData, reponse) {

                console.log("oData~~~~~~~"+JSON.stringify(reponse.data.results));  

                var odata = reponse.data.results;
           
                midObjectData.setProperty("/tenant_id", odata.tenant_id);
                midObjectData.setProperty("/company_code", odata.company_code);
                midObjectData.setProperty("/org_type_code", odata.org_type_code);
                midObjectData.setProperty("/org_code", odata.org_code);
                midObjectData.setProperty("/category_name", odata.category_name);
                midObjectData.setProperty("/category_code", odata.category_code);
                midObjectData.setProperty("/mi_material_code", odata.mi_material_code);                
                midObjectData.setProperty("/mi_material_code_name", odata.mi_material_code_name);                
                midObjectData.setProperty("/use_flag", odata.use_flag);
           

                debugger;
                //show
                that._onPageMode(false);
            }
            
        });


                var bFilters = [
                    new sap.ui.model.Filter("tenant_id", sap.ui.model.FilterOperator.EQ,  oArgs.tenant_id),
                    new sap.ui.model.Filter("company_code", sap.ui.model.FilterOperator.EQ,  oArgs.company_code),
                    new sap.ui.model.Filter("org_type_code", sap.ui.model.FilterOperator.EQ,  oArgs.org_type_code),
                    new sap.ui.model.Filter("org_code", sap.ui.model.FilterOperator.EQ,  oArgs.org_code),
                    new sap.ui.model.Filter("mi_material_code", sap.ui.model.FilterOperator.EQ,  oArgs.mi_material_code)
                ];                




                var oModel = this.getOwnerComponent().getModel("jCodeText"),
                oTable = sap.ui.core.Fragment.byId("Change_id","midTableChange"),
                that = this;
                


                ar aBatch = [];

                var oModel = this.getView().getModel();
                
                var mNewAccessoryItem = {
                
                "AccessoryId" : 12345,
                
                "SerialNo" : 444444444444444444,
                
                };
                
                aBatch.push(oModel.createBatchOperation("/AccessoryItemSet", "POST", mNewAccessoryItem));
                
                oModel.addBatchChangeOperations(aBatch);
                
                ...
                
                // Add more batch operations...
                
                ...
                
                // Submit
                
                oModel.submitBatch(
                
                jQuery.proxy(function(mResponse){ //succes
                
                ...
                
                }, this),
                
                jQuery.proxy(function(mResponse){ //failure
                
                ...
                
                }, this)
                
                );
                
                



                var sGroupId =(newDate()).getTime();
var requestParams ={};
requestParams.groupId = sGroupId;

oModel.setDeferredGroups([sGroupId]);

var calls = items.length;

for(var i=0;i< itemsToSave.length; i++){
	var item = itemsToSave[i];
	oModel.update("/" + entityName + ("(" + item.getId() + ")"), item, requestParams);
}
oModel.submitChanges({
			groupId: sGroupId,
			success:function(){...},
			error:function(){...}

});


oDataModel.setChangeGroups({
    sPath: { groupId: sGroupId } });


oDataModel.setDeferredGroups([sGroupId]);

aFormObject.forEach(function(element, index, array) {
     oDataModel.update(sPath + "("+ID+")", element, {groupId: sGroupId});
});


oDataModel.submitChanges({ groupId: sGroupId, success: function() {}, error : function() {} });



https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap/pg/mi/webapp/srv-api/odata/v2/pg.marketIntelligenceService/MIMaterialCodeText/?$format=json



debugger;
var aTableItems = this._getSmartTableById().getTable().getItems();
var aPartnerIDs = [];

// test code
// aTableItems.forEach(function(oItem){
// 	aPartnerIDs.push(oItem.getCells()[0].getValue());
// });

// 주석 제거 사용가능 
/*stat
var mi_material_code = "BIZ00121";
var mParameters = {
    "groupId":"createGroup",
    "properties" : {
        "tenant_id": "L2100",
        "company_code": "*",
        "org_type_code": "BU",
        "org_code": "BIZ00100",
        "mi_material_code": mi_material_code,
        "mi_material_code_name": "",
        "category_code": "Non-Ferrous Metal",
        "category_name": "비철금속",
        "use_flag": true,
        "local_create_dtm": new Date(),
        "local_update_dtm": new Date(),
        "create_user_id": "Admin",
        "update_user_id": "Admin",
        "system_create_dtm": new Date(),
        "system_update_dtm": new Date()
    }
};					
var oEntry1 = this.getModel().createEntry("/MIMaterialCodeList", mParameters);
this.getView().byId("mainTable").setBindingContext(oEntry3);

// this.getModel().setUseBatch(true);
// this.getModel().submitChanges({
// 	groupId: "createGroup", 
//   success: this._handleCreateSuccess.bind(this),
//   error: this._handleCreateError.bind(this)
// });
            
*/
//"midObject/{layout}/{tenant_id}/{company_code}/{org_type_code}/{org_code}/{mi_material_code}",
debugger;
this.getRouter().navTo("midPage", {
    layout: oNextUIState.layout, 
    tenant_id: "L2100",
    company_code: "*",
    org_type_code: "BU",
    org_code: "BIZ00100",
    mi_material_code: "new"				
});

var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
if(oNextUIState.layout === 'TwoColumnsMidExpanded'){
    this.getView().getModel('mainListView').setProperty("/headerExpandFlag", false);
}

var oItem = oEvent.getSource();
oItem.setNavigated(true);
var oParent = oItem.getParent();
// store index of the item clicked, which can be used later in the columnResize event
this.iIndex = oParent.indexOfItem(oItem);







=================mainContrl


			
	        //var aTableItems = this._getSmartTableById().getTable().getItems();
			//var aPartnerIDs = [];

			// test code
	        // aTableItems.forEach(function(oItem){
	        // 	aPartnerIDs.push(oItem.getCells()[0].getValue());
			// });
			
			// 주석 제거 사용가능 
			/*stat
			var mi_material_code = "BIZ00121";
	        var mParameters = {
	        	"groupId":"createGroup",
	        	"properties" : {
					"tenant_id": "L2100",
					"company_code": "*",
					"org_type_code": "BU",
					"org_code": "BIZ00100",
					"mi_material_code": mi_material_code,
					"mi_material_code_name": "",
					"category_code": "Non-Ferrous Metal",
					"category_name": "비철금속",
					"use_flag": true,
					"local_create_dtm": new Date(),
					"local_update_dtm": new Date(),
					"create_user_id": "Admin",
					"update_user_id": "Admin",
					"system_create_dtm": new Date(),
					"system_update_dtm": new Date()
	        	}
			};					
			var oEntry1 = this.getModel().createEntry("/MIMaterialCodeList", mParameters);
			this.getView().byId("mainTable").setBindingContext(oEntry3);

			// this.getModel().setUseBatch(true);
	    	// this.getModel().submitChanges({
			// 	groupId: "createGroup", 
			//   success: this._handleCreateSuccess.bind(this),
			//   error: this._handleCreateError.bind(this)
			// });
						
			*/
			//"midObject/{layout}/{tenant_id}/{company_code}/{org_type_code}/{org_code}/{mi_material_code}",




