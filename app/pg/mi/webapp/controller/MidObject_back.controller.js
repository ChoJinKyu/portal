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
], function (BaseController, History, JSONModel, ManagedModel, ManagedListModel, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, MessageToast) {
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
                delay: 0
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

            var selectedItem = sap.ui.getCore().getModel("selectedItem");
            console.log("=================================================");
            console.log(selectedItem);

           
            this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);
            this.setModel(midObjectView, "midObjectView");
            
            this.setModel(midObjectData, "midObjectData");

            // this.setModel(new ManagedModel(), "master");
            // this.setModel(new ManagedListModel(), "details");

            this._setControl();

        
            this._midTable = this.byId("midTable");
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
            return;
            this.byId("inputMaterialCode").attachBrowserEvent('keypress', function (e) {
                if (e.which == 13) {
                    this.onMaterialCodeCheckOpen();
                }
            });

            //this.doFilter();
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
                                me._toShowMode();
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


            // this.getView().getModel().create(
            //     "/MIMaterialCodeText",{"tenant_id":midObjectData.getProperty("/tenant_id"), "code":"KO","code_name":""},{
            //     error: function (oError) { MessageToast.show(oError);  },
            //     success: function (oData, response) {
            //         MessageToast.show("ok");
            //        // oInput.setValue("");
            //        // that._setSaveButtons(false);
            //     }
            // });


            var oMidTable = this._midTable.getBinding("items");
            var oContext = oMidTable.create({
                    "tenant_id" : midObjectData.getProperty("/tenant_id"),
                    "code" : "KO",
                    "code_name" : ""
                });



            //json version
            // var oModel = this.getOwnerComponent().getModel(),
            //     oMaterial = oModel.getProperty("/Material"),
            //     oTable = this._midTable,
            //     oNewData = {
            //         Language: "Korean",
            //         Name: "철광석100" + Math.floor(Math.random() * 100),
            //         LanguageKey: "KO"
            //     };

            // oMaterial.push(oNewData);
            // oModel.refresh(true);

            console.groupEnd();

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
        },

        mySuccessHandler : function(){

        },
        myErrorHandler : function(){

        },
        /**
         * 행 삭제
         */
        onMidDelete: function () {

            console.group("[mid] onMidDelete");

            //json version --------------------------------------------

            var oModel = this.getOwnerComponent().getModel(),
                oMaterial = oModel.getProperty("/Material"),
                oData = oModel.getData(),
                oPath,
                that = this;

            var oSelected = this._midTable.getSelectedContexts();
            if (oSelected.length > 0) {

                MessageBox.confirm("선택한 항목을 삭제 하시겠습니까?", {
                    title: "삭제 확인",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {

                            //json
                            for (var i = oSelected.length - 1; i >= 0; i--) {

                                var idx = parseInt(oSelected[0].sPath.substring(oSelected[0].sPath.lastIndexOf('/') + 1));
                                oMaterial.splice(idx, 1);
                            }

                            that.getView().setBusy(false);
                            oModel.setProperty("/Material", oMaterial);
                            this._midTable.removeSelections();
                            oModel.refresh(true);

                            //MsgStrip 최상단에 있어 확인하기 어려움 메세지 박스 호출로 대체
                            MessageBox.show("삭제가 성공 하였습니다.", {
                                icon: MessageBox.Icon.ERROR,
                                title: "삭제 성공",
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
                MessageBox.show("삭제 할 항목을 선택 해야합니다.", {
                    icon: MessageBox.Icon.ERROR,
                    title: "항목 선택 오류",
                    actions: [MessageBox.Action.OK],
                    styleClass: "sapUiSizeCompact"
                });
            }

            oModel.setProperty("/Material", oMaterial);
            oModel.refresh(true);
            console.groupEnd();

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
         
            oTableBinding.filter([                
                new Filter("tenant_id", FilterOperator.EQ, midObjectData.getProperty("/tenant_id")),
                new Filter("company_code", FilterOperator.EQ, midObjectData.getProperty("/company_code")),
                new Filter("org_type_code", FilterOperator.EQ, midObjectData.getProperty("/org_type_code")),
                new Filter("org_code", FilterOperator.EQ, midObjectData.getProperty("/org_code")),
                new Filter("mi_material_code", FilterOperator.EQ, midObjectData.getProperty("/mi_material_code"))
            ]);
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
                oView = this.getView();
                
              
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
          

            if (oArgs.tenant_id == "new" ) {

                //It comes Add button pressed from the before page.
                //  var oMasterModel = this.getModel("master");
                //  oMasterModel.setData({
                //      tenant_id: "L2100"
                //  });

                this._toEditMode();
            } else {
               
                //var sServiceUrl = "/MIMaterialCodeList(tenant_id='"+ this._tenant_id+"',company_code='"+ this._company_code+"',org_type_code='"+ this._org_type_code+"',org_code='"+ this._tenant_id+"',mi_material_code='"+ this._tenant_id+"')"; 
                var sServiceUrl = "/MIMaterialCodeList(tenant_id='L2100',company_code='*',org_type_code='BU',org_code='BIZ00100',mi_material_code='LED-001-01')";
                //this._bindView(sServiceUrl);

                //oView.setBusy(true);

                //var oDetailModel = this.getModel("details");

                var oModel = this.getOwnerComponent().getModel(),
                oView = this.getView();
                oModel.read(sServiceUrl, {
                    success: function (oData) {
                      
                        //oView.setBusy(false);
                         /*{"__metadata":{"id":"http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MIMaterialCodeList(
                             tenant_id='L2100',
                             company_code='%2A',
                             org_type_code='BU',
                             org_code='BIZ00100',
                             mi_material_code='LED-001-01')",
                             "uri":"http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MIMaterialCodeList(tenant_id='L2100',company_code='%2A',org_type_code='BU'
                             ,org_code='BIZ00100',mi_material_code='LED-001-01')",
                             "type":"pg.marketIntelligenceService.MIMaterialCodeList"},
                             "tenant_id":"L2100",
                             "company_code":"*",
                             "org_type_code":"BU",
                             "org_code":"BIZ00100",
                             "mi_material_code":"LED-001-01",
                             "mi_material_code_text":"니켈",
                             "category":"Non-Ferrous Metal",
                             "category_text":"비철금속",
                             "use_flag":true,
                             "local_create_dtm":"2020-11-17T16:08:00.000Z",
                             "local_update_dtm":"2020-11-17T16:08:00.000Z","create_user_id":"Admin","update_user_id":"Admin",
                             "system_create_dtm":"2020-11-17T16:08:00.000Z","system_update_dtm":"2020-11-17T16:08:00.000Z"}
                         */

                        console.log("oData~~~~~~~"+JSON.stringify(oData));
                        
                        oView.byId("inputMaterialCode").setValue( oData.mi_material_code );
                        oView.byId("inputMaterialCode").setEditable(false);  
                        oView.byId("inputMaterialCode").setEnabled(true); 
                        oView.byId("buttonMaterialCheck").setVisible(false);

                    
                        oView.byId("comboBoxCategory_code").setSelectedKey(oData.category);
                        oView.byId("comboBoxCategory_code").setEnabled(true);
                        oView.byId("switchUse_flag").setState(oData.use_flag);
                        oView.byId("switchUse_flag").setEnabled(true);                     

                    }
                    
                });

                //this._toShowMode();
            }
            console.groupEnd();
        },

        onBeforeRebindTable : function(oEvent) {
            console.group("[mid] onBeforeRebindTable");
            var mBindingParams = oEvent.getParameter("bindingParams"),
                midObjectData = this.getModel("midObjectData");

             //tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100',mi_material_code='LED-001-01',
//              <d:tenant_id>L2100</d:tenant_id>
// <d:company_code>*</d:company_code>
// <d:org_type_code>BU</d:org_type_code>
// <d:org_code>BIZ00100</d:org_code>
// <d:mi_material_code>LED-001-01</d:mi_material_code>
// <d:language_code>EN</d:language_code>
// <d:mi_material_code_text>Lead</d:mi_material_code_text>
// <d:local_create_dtm>2020-11-17T16:18:00Z</d:local_create_dtm>
// <d:local_update_dtm>2020-11-17T16:18:00Z</d:local_update_dtm>
// <d:create_user_id>Admin</d:create_user_id>
// <d:update_user_id>Admin</d:update_user_id>
// <d:system_create_dtm>2020-11-17T16:18:00Z</d:system_create_dtm>
// <d:system_update_dtm>2020-11-17T16:18:00Z</d:system_update_dtm>

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

        _toEditMode: function () {
            console.group("_toEditMode");

            this.byId("page").setSelectedSection("pageSectionMain");
            //this.byId("page").setProperty("showFooter", true);
            // this.byId("pageEditButton").setEnabled(false);
            // this.byId("pageDeleteButton").setEnabled(false);
            // this.byId("pageNavBackButton").setEnabled(false);
            console.groupEnd();
        },

        _toShowMode: function () {
            console.group("_toEditMode");
            this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("page").setProperty("showFooter", false);
            // this.byId("pageEditButton").setEnabled(true);
            // this.byId("pageDeleteButton").setEnabled(true);
            // this.byId("pageNavBackButton").setEnabled(true);
            console.groupEnd();
        },

        _oFragments: {}

    });
});