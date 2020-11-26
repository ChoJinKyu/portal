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
    "sap/ui/core/ValueState",
    "./Validator",
    "sap/base/Log"
], function (BaseController, History, JSONModel, ManagedModel, ManagedListModel, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, MessageToast, ValueState, Validator, Log) {
    "use strict";

    return BaseController.extend("pg.mi.controller.MidObject", {

        dateFormatter: DateFormatter,

        /**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            console.group("[mid] onInit");

            // Attaches validation handlers
            sap.ui.getCore().attachValidationError(function (oEvent) {
                oEvent.getParameter("element").setValueState(ValueState.Error);
            });
            sap.ui.getCore().attachValidationSuccess(function (oEvent) {
                oEvent.getParameter("element").setValueState(ValueState.None);
            });

            //mode = 수정화면에서의 (true 수정, false 보기 )
            //pageMode 등록화면에서의 (true 신규, false 수정화면)
            var midObjectView = new JSONModel({
                busy: true,
                delay: 0,
                mode : false,
                pageMode : false,
                mcheck : false
            });

            var midObjectData = new JSONModel({
                tenant_id: "",
                company_code: "",
                org_type_code: "",
                org_code: "",
                category_name : "",
                category_code : "",
                mi_material_code: "",                
                mi_material_code_name: "",                
                use_flag: true,
                filters : []            
            });

            // JSON dummy data
            var oData = {
                text   : null,
                number : 0,
                date   : null
            };
            var jsonoModel = new JSONModel();
            jsonoModel.setData(oData);

            this.getView().setModel(jsonoModel);

            var midTaleData = new JSONModel({
                items : []
            });
           
    
            this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);

            this.setModel(midObjectView, "midObjectView");            
            this.setModel(midObjectData, "midObjectData");

            // this.setModel(new ManagedModel(), "master");
            // this.setModel(new ManagedListModel(), "details");          
   
            console.groupEnd();
        },

        isValNull: function (p_val) {
            if(!p_val || p_val == "" || p_val == null){
                return true
            }else{
                return false;
            }
        },

        /**
         * midTable filter
         */
        _setTableFilters : function(midTale) {
            console.group("_setTableFilters");
            Log.info("_setTableFilters >  midTale : " + midTale );
            /**
             * 모든 작업은 공통 모듈을 사용하지 않아도 된다. 
             * 모든 테이블을 스마트 테이블로 가야 가야하는가? 리포트 뷰형은 스마트 테이블을 사용한다. 
             * 
             */
            var midObjectData = this.getModel("midObjectData");

            //sample 'LED-001-01'
            var oModel = this.getOwnerComponent().getModel(),
                oBinding = midTale.getBinding("items"),
                aFilters = [];
                midTale.setModel(oModel);
           
            var oFilter = new sap.ui.model.Filter("mi_material_code", sap.ui.model.FilterOperator.EQ, midObjectData.getProperty("/mi_material_code"));
            aFilters.push(oFilter);
            oBinding.filter(aFilters);

            console.groupEnd();
        },

		_formFragments: {},
                
        /**
         * Fragment 설정
         * @param {String} sFragmentName 
         */
		_getFormFragment: function (sFragmentName) {
            console.log("_getFormFragment");
            //https://sapui5.netweaver.ondemand.com/#/entity/sap.ui.layout.form.SimpleForm/sample/sap.ui.layout.sample.SimpleForm354/code/Page.controller.js

			var oFormFragment = this._formFragments[sFragmentName];

			if (oFormFragment) {
				return oFormFragment;
            }

            oFormFragment = sap.ui.xmlfragment(sFragmentName+"_id", "pg.mi.view." + sFragmentName, this);

            this._formFragments[sFragmentName] = oFormFragment;
            
            return this._formFragments[sFragmentName];

		},

		_showFormFragment : function (sFragmentName) {
            console.group("_showFormFragment");

            var oPage = this.byId("page"),
                midObjectData = this.getModel("midObjectData"),
                midObjectView = this.getModel("midObjectView");


            var pageMode = midObjectView.getProperty("/pageMode");
            
            if(!pageMode){ console.log("new");}

            this.getView().setBusy(true);

            oPage.removeAllContent();
            
            oPage.insertContent(this._getFormFragment(sFragmentName));
            

            //var midTable = sap.ui.core.Fragment.byId("Change_id","midTableDisplay ", this);
            // if(sFragmentName=="Change"){
            //     this._setTableFilters(midTable);
            // }else{
            //     midTable = sap.ui.core.Fragment.byId("Display_id","midTableChange", this);
            //     this._setTableFilters(midTable);
            // }
            this.getView().setBusy(false);
            this.getModel("midObjectView").setProperty("/mode", false);

            console.groupEnd();
        },

        /**
         * 자재코드 확인
         * @public
         */
        onMaterialCodeCheckOpen : function () {
            console.group("onMaterialCodeCheckOpen");

            var midObjectData = this.getModel("midObjectData"),
                midObjectView = this.getModel("midObjectView"),
                oModel = this.getOwnerComponent().getModel(),            
                sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer",
                inputMaterialCode = sap.ui.core.Fragment.byId("Change_id","inputMaterialCode").getValue();

            var bMaterialCode = false;

            if(this.isValNull(inputMaterialCode)){
               
                MessageBox.show("자재코드를 먼저 입력 하셔야 합니다.", {
                    icon: MessageBox.Icon.WARNING,
                    title: "자재 코드 확인",
                    actions: [MessageBox.Action.OK],
                    styleClass: "sapUiSizeCompact"
                });                  
                return;
            }
            else{

                var aFilters = [
                    new sap.ui.model.Filter("tenant_id", sap.ui.model.FilterOperator.EQ,  midObjectData.getProperty("/tenant_id")),
                    new sap.ui.model.Filter("company_code", sap.ui.model.FilterOperator.EQ,  midObjectData.getProperty("/company_code")),
                    new sap.ui.model.Filter("org_type_code", sap.ui.model.FilterOperator.EQ,  midObjectData.getProperty("/org_type_code")),
                    new sap.ui.model.Filter("org_code", sap.ui.model.FilterOperator.EQ,  midObjectData.getProperty("/org_code")),
                    new sap.ui.model.Filter("mi_material_code", sap.ui.model.FilterOperator.EQ,  inputMaterialCode)
                ];
                var inputMaterialCode = sap.ui.core.Fragment.byId("Change_id","inputMaterialCode"); 
                var sServiceUrl ="/MIMaterialCodeList";
                var itemLength = 0;               
                oModel.read(sServiceUrl, {
                    async : false,
                    filters : aFilters,                    
                    success: function (rData, reponse) {

                        console.log("자재건수 :" + reponse.data.results.length);  
                        
                        itemLength = reponse.data.results.length;

                        if(itemLength < 1){

                            midObjectView.setProperty("/mcheck", true);
                            midObjectView.setProperty("/mode", false);

                            inputMaterialCode.setValueState("Success");
                            inputMaterialCode.setValueStateText("사용할수 있는 자재 코드 입니다.");
                            MessageToast.show("사용할수 있는 자재 코드 입니다.");
                            inputMaterialCode.openValueStateMessage();
                            //inputMaterialCode.setValueState("Error");
                            //MessageToast.show("사용할수 있는 자재 코드 입니다..");
                            //inputMaterialCode.setValueStateText("중복된 자재코드 입니다.");

/*
                            MessageBox.show(
                                '사용가능한 시황자재 코드 입니다.',
                                {
                                    icon: MessageBox.Icon.SUCCESS,
                                    title: "사용할수 있는 자재 코드 입니다.",
                                    actions: ["Cancel", "Confirm"],
                                    emphasizedAction: "Confirm",
                                    onClose: function (sButton) {
                                        if (sButton === "Cancel") {
                                            console.log("Cancel");
                                        }
                                        else if(sButton === "Confirm") {
                                            console.log("Confirm");
                                           
                                            inputMaterialCode.setValueState("Success");
                                            inputMaterialCode.setValueStateText("");

                                        }
                                    },                    
                                    initialFocus: "Confirm",
                                    styleClass: sResponsivePaddingClasses
                                }
                            );
                            */
                        }else{
                       
                            inputMaterialCode.setValueState("Error");
                            //MessageToast.show("중복된 자재코드 입니다.");
                            inputMaterialCode.setValueStateText("중복된 자재코드 입니다.");
                            inputMaterialCode.openValueStateMessage();
                        }                             
                        
                    }
                
                });

            }
   

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
            var sNextLayout = this.getOwnerComponent().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/fullScreen");
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
            var sNextLayout = this.getOwnerComponent().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
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
            var sNextLayout = this.getOwnerComponent().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            
            this._onExit();
            
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
            console.group("onPageDeleteButtonPress");
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
            console.groupEnd();
        },

		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function () {
            console.group("onPageSaveButtonPress");
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
            console.groupEnd();

        },


		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelEditButtonPress: function () {
            console.group("onPageCancelEditButtonPress");
            this._toShowMode();
            console.groupEnd();
        },

        // doFilter : function(oEvent) {
        //     console.group("doFilter");
        //     var comboBoxcategory_code_code = this.getView().byId("comboBoxcategory_code_code"), 
        //     oBindingComboBox = comboBoxcategory_code_code.getBinding("items"),
        //     midObjectData = this.getModel("midObjectData");

        //      oBindingComboBox.filter([                
        //          new Filter("tenant_id", FilterOperator.EQ, midObjectData.getProperty("/tenant_id"))
        //      ]);
        //     console.groupEnd();
        //     //comboBoxcategory_code_code.attachChange(function () { oTable.getBinding("rows").filter(new sap.ui.model.Filter("payment", sap.ui.model.FilterOperator.EQ, oDropDown.getValue())); });
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
                midObjectView = this.getModel("midObjectView"),
                oView = this.getView(),
                that = this;
                
            var oModel = this.getOwnerComponent().getModel();
            
            var aFilters = [
                new sap.ui.model.Filter("tenant_id", sap.ui.model.FilterOperator.EQ,  oArgs.tenant_id),
                new sap.ui.model.Filter("company_code", sap.ui.model.FilterOperator.EQ,  oArgs.company_code),
                new sap.ui.model.Filter("org_type_code", sap.ui.model.FilterOperator.EQ,  oArgs.org_type_code),
                new sap.ui.model.Filter("org_code", sap.ui.model.FilterOperator.EQ,  oArgs.org_code),
                new sap.ui.model.Filter("mi_material_code", sap.ui.model.FilterOperator.EQ,  oArgs.mi_material_code)
            ];
            
            
            this.getView().setBusy(true);

            
            this.getView().byId("buttonMidEdit").setVisible(true);
            this.getView().byId("buttonMidDelete").setVisible(true);
            this.getView().byId("buttonSave").setVisible(true);

            //신규 등록 
            var bNew = false;
            if(oArgs.mi_material_code=="new") {
                console.log("new item===============");
                midObjectView.setProperty("/pageMode", true);
                bNew = true;
             
                midObjectData.setProperty("/tenant_id", oArgs.tenant_id);
                midObjectData.setProperty("/company_code", oArgs.company_code);
                midObjectData.setProperty("/org_type_code", oArgs.org_type_code);
                midObjectData.setProperty("/org_code", oArgs.org_code);

                //버튼 감추기 
                this.getView().byId("buttonMidEdit").setVisible(false);
                this.getView().byId("buttonMidDelete").setVisible(false);
                    
                that._onPageMode(true);

            }else{
                //자재중복 체크 가정
                midObjectView.setProperty("/mcheck", true);
                midObjectView.setProperty("/pageMode", false);

                //초기 display
                this.getView().byId("buttonMidEdit").setVisible(true);
                this.getView().byId("buttonMidEdit").setText("Edit");
                this.getView().byId("buttonMidDelete").setVisible(false);
                this.getView().byId("buttonSave").setVisible(false);


                that._onPageMode(false);


            }
            var sServiceUrl ="/MIMaterialCodeList";
            
            oModel.read(sServiceUrl, {
                async : false,
                filters : aFilters,                    
                success: function (rData, reponse) {

                    console.log("MIMaterialCodeList to json oData~~~~~~~"+JSON.stringify(reponse.data.results[0]));  
                    var oData = reponse.data.results[0];

                    //신규가 아닐때만 진행
                    if(!bNew) {
                        
                        midObjectData.setData(reponse.data.results[0]);                  
                        that.setModel(midObjectData, "midObjectData");
                    }
                    //show
                }
            });

            var jCodeText = new JSONModel();
            //var jModel = this.getOwnerComponent().getModel("jdata");
            
            sServiceUrl = "/MIMaterialCodeText"; 
            oModel.read(sServiceUrl, {
                async : false,
                filters : aFilters,                    
                success: function (rData, reponse) {
                    console.log("MIMaterialCodeText to json oData~~~~~~~"+JSON.stringify(reponse.data.results[0]));  
                    //"http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MIMaterialCodeText(tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100',mi_material_code='LED-001-01',language_code='AA')"
                    var arrData = [];
                    jCodeText.setData(reponse.data.results);                  
                    //that.setModel(jCodeText, "jCodeText");
                    that.getOwnerComponent().setModel(jCodeText,"jCodeText");
                    // for(var i=0;i<reponse.data.results.length;i++){

                    // //신규가 아닐때만 진행
                    // //if(!bNew) {
                    //         var path="MIMaterialCodeText(tenant_id='"+reponse.data.results[i].tenant_id;
                    //         path += "',company_code='" +reponse.data.results[i].company_code;
                    //         path += "',org_code='" +reponse.data.results[i].org_code;
                    //         path += "',mi_material_code='" +reponse.data.results[i].mi_material_code;
                    //         path += "',language_code='" +reponse.data.results[i].language_code+"')";
                            


                    //         var item = {
                    //             "contextpath" : path,
                    //             "tenant_id":  reponse.data.results[i].tenant_id,
                    //             "company_code":  reponse.data.results[i].company_code,
                    //             "org_type_code":  reponse.data.results[i].org_type_code,
                    //             "org_code":  reponse.data.results[i].org_code,
                    //             "mi_material_code":  reponse.data.results[i].mi_material_code,
                    //             "language_code":  reponse.data.results[i].language_code,
                    //             "mi_material_code_name":  reponse.data.results[i].mi_material_code_name,
                    //             "local_create_dtm": reponse.data.results[i].local_create_dtm,
                    //             "local_update_dtm": reponse.data.results[i].local_update_dtm,
                    //             "create_user_id": reponse.data.results[i].create_user_id,
                    //             "update_user_id": reponse.data.results[i].update_user_id,
                    //             "system_create_dtm": reponse.data.results[i].system_create_dtm,
                    //             "system_update_dtm": reponse.data.results[i].system_update_dtm,
                    //             "state" : "R"
                    //         };
                            
                    //         arrData.push(item);
                    //     //}
                    // }

                    // jCodeText.setData(arrData);                    
                    // that.getOwnerComponent().setModel(jCodeText,"jCodeText");
                }
            });

            var jLanguageView = new JSONModel();
            var lFilters = [
                new sap.ui.model.Filter("tenant_id", sap.ui.model.FilterOperator.EQ,  oArgs.tenant_id)
            ];
            sServiceUrl = "/LanguageView"; 
            oModel.read(sServiceUrl, {
                async : false,
                filters : lFilters,                    
                success: function (rData, reponse) {
                    console.log("LanguageView to json oData~~~~~~~"+JSON.stringify(reponse.data.results[0]));  
                    jLanguageView.setData(reponse.data.results);                    
                    that.getOwnerComponent().setModel(jLanguageView,"jLanguageView");
                }
            });


            var jMICategoryView = new JSONModel();
            var lFilters = [
                new sap.ui.model.Filter("tenant_id", sap.ui.model.FilterOperator.EQ,  oArgs.tenant_id),
                new sap.ui.model.Filter("company_code", sap.ui.model.FilterOperator.EQ,  oArgs.company_code),
                new sap.ui.model.Filter("org_type_code", sap.ui.model.FilterOperator.EQ,  oArgs.org_type_code),
                new sap.ui.model.Filter("org_code", sap.ui.model.FilterOperator.EQ,  oArgs.org_code)
            ];
            sServiceUrl = "/MICategoryView"; 
            oModel.read(sServiceUrl, {
                async : false,
                filters : lFilters,                    
                success: function (rData, reponse) {
                    console.log("MICategoryView to json oData~~~~~~~"+JSON.stringify(reponse.data.results[0]));  
                    jMICategoryView.setData(reponse.data.results);                    
                    that.getOwnerComponent().setModel(jMICategoryView,"jMICategoryView");
                }
            });

            this.getView().setBusy(false);

            console.groupEnd();
        },

        /**
         * Note : Smart Table Filter 값 참조후 작업
         */
        onBeforeRebindTable : function(oEvent) {
            console.group("[mid] onBeforeRebindTable");
            var mBindingParams = oEvent.getParameter("bindingParams"),
                midObjectData = this.getModel("midObjectData");

            mBindingParams.filters.push(new Filter("tenant_id", FilterOperator.EQ, midObjectData.getProperty("mi_material_code")));
            
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
                   
                    //oView.setBusy(false);
                    //this.setLog("oData~~~~~~~"+JSON.stringify(oData));
                    this.getView().byId("inputMaterialCode").setValue( oData.mi_material_code_text );
                   // this.getView().byId("buttonMaterialCheck").setEnable(false);
                }
            });
        },

        /**
         * 화면에서 Edit 버튼 이벤트 수정모드 전환
         * @public
         */
        onEdit : function(){
            var midObjectView = this.getModel("midObjectView"),
                midObjectData = this.getModel("midObjectData"),
                pageMode = midObjectView.getProperty("/mode"),
                oView = this.getView();
            
            
            
            //false edit true show
            if(!pageMode){
             
                this._onPageMode(true);
                oView.byId("buttonMidEdit").setVisible(true);
                oView.byId("buttonMidEdit").setText("Show");
                oView.byId("buttonMidDelete").setVisible(true);
                oView.byId("buttonSave").setVisible(true);

                var inputMaterialCode = sap.ui.core.Fragment.byId("Change_id","inputMaterialCode"); 
                var buttonMaterialCheck = sap.ui.core.Fragment.byId("Change_id","buttonMaterialCheck"); 
                var switchUse_flag = sap.ui.core.Fragment.byId("Change_id","switchUse_flag"); 

                inputMaterialCode.setValue(midObjectData.getProperty("/mi_material_code"));
                inputMaterialCode.setEnabled(false);
                buttonMaterialCheck.setVisible(false);                   
                switchUse_flag.setState(midObjectData.getProperty("/use_flag"));
                
            }
            else{

                this._onPageMode(false);
                oView.byId("buttonMidEdit").setVisible(true);
                oView.byId("buttonMidEdit").setText("Edit");
                oView.byId("buttonMidDelete").setVisible(false);
                oView.byId("buttonSave").setVisible(false);

                var textMaterialCode = sap.ui.core.Fragment.byId("Display_id","textMaterialCode"); 
                var textcategoryName = sap.ui.core.Fragment.byId("Display_id","textcategoryName"); 
                var textUseflag = sap.ui.core.Fragment.byId("Display_id","textUseflag"); 
               
                textMaterialCode.setText(midObjectData.getProperty("/mi_material_code"));
                textcategoryName.setText(midObjectData.getProperty("/category_code"));                  
                var useText = midObjectData.getProperty("/use_flag");
                var vText="미사용";
                if(useText){
                    vText = "사용";
                }
                textUseflag.setText(vText);
            }
        },

        /**
         * 초기 실행과 버튼이벤트 구분을 위한 function
         * @param {*} modeType 
         */
        _onPageMode : function(modeType){

            //_onPageMode"pageMode"
            if(!modeType){ 
                this._toShowMode(); 
            }
            else{
                this._toEditMode();
            }
        },

        /**
         * 수정화면 처리
         * @private
         */
        _toEditMode: function () {
            console.group("_toEditMode");

            this._showFormFragment("Change");

            if(!this.getModel("midObjectView").getProperty("/pageMode")){
                this.getModel("midObjectView").setProperty("/mode", true);
            }
            else{
                this.getModel("midObjectView").setProperty("/mode", false);
            }
            console.groupEnd();
        },

        /**
         * 보기화면 처리
         * @private
         */
        _toShowMode: function () {
            console.group("_toShowMode");
            this._showFormFragment("Display");
            this.getModel("midObjectView").setProperty("/mode", false);
            console.groupEnd();
        },
        
        /**
         * MIMaterialCodeText Row Item 삭제 Json Verson
         * @public
         */
        onMidTableDelete : function (oEvent) {
            console.group("onMidTableDelete");
    
            var oModel = this.getOwnerComponent().getModel("jCodeText"),
                oTable = sap.ui.core.Fragment.byId("Change_id","midTableChange"),
                that = this;
            
            var oSelected  = oTable.getSelectedContexts();

            //Edit 작업시 진행할 삭제된 행 정보를 담는다. 
                
            var deleteOModel = new JSONModel();
            deleteOModel = {
                item : [],
                flag : false
            };
  
            if (oSelected.length > 0) {
    
                for ( var i = 0;i<oSelected.length ; i++) {
                    var idx = parseInt(oSelected[0].sPath.substring(oSelected[0].sPath.lastIndexOf('/') + 1));

                    //property
                    if(oSelected[0].sPath.length>4){
                        var sServicePath = oModel.oData[idx].__metadata.uri;
                        var arrS = sServicePath.split("pg.marketIntelligenceService");
                        var sUrl = arrS[1];    

                        deleteOModel.item.push(sUrl);
                        deleteOModel.setProperty("/flag" , true);
                        oModel.oData.splice(idx, 1);
                    }else{
                        oModel.oData.splice(idx, 1);
                    }
                       


  

                    oModel.refresh();

                    //json 업데이트 
                    //oModel.oData[idx].state="D"
                }
            
                this.getOwnerComponent().setModel(deleteOModel, "deleteOModel");
        
                that.getView().setBusy(false);                       
                oTable.removeSelections();
                oModel.refresh(true);  

                /*

                var msg = "삭제하시겠습니까?";
                this.getView().setBusy(true);
    
                MessageBox.confirm(msg, {
                    title : "삭제확인",                        
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            console.log("delete ok")
                            for ( var i = oSelected.length - 1; i >= 0; i--) {
                                var idx = parseInt(oSelected[0].sPath.substring(oSelected[0].sPath.lastIndexOf('/') + 1));
                                //json 데이타 바로 삭제일때.    
                                //oModel.splice(idx, 1);
                                debugger;
                                //json 업데이트 
                                oModel.oData[idx].state="D"
                            }

                            that.getView().setBusy(false);                       
                            oTable.removeSelections();
                            oModel.refresh(true);  
                            
                            //MsgStrip 최상단에 있어 확인하기 어려움 메세지 박스 호출로 대체
                            MessageBox.show("삭제 성공", {
                                icon: MessageBox.Icon.ERROR,
                                title: "삭제가 성공 하였습니다.",
                                actions: [MessageBox.Action.OK],
                                styleClass: "sapUiSizeCompact"
                            });                                
    
                        } else if (sButton === MessageBox.Action.CANCEL) {
                        
                            this.getView().setBusy(false);
                            return;
                        };
                    }
                });   
                */                       
    
            } else {

                MessageToast.show("삭제가 취소 되었습니다.");
                // MessageBox.show(this.errorDeleteRowChooice, {
                //     icon: MessageBox.Icon.ERROR,
                //     title: this.errorCheckChangeCopyRowTitle,
                //     actions: [MessageBox.Action.OK],
                //     styleClass: "sapUiSizeCompact"
                // });
            }
    
            console.groupEnd();
        },
  
       /**
         * 행 삭제 Odata v2 Verson
         * Note :행삭제
         */
        xonMidTableDelete: function () {
            console.group("[mid] onMidTableDelete");
            
            var oModel = this.getOwnerComponent().getModel("jCodeText"),
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
         * table 삭제 액션 Odata v2 Version 
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
         * Note : 언어 추가  midTable 행을 추가 저장한다. 
         * 이미 저장되어 있는 키를 확인하여 업데이트 한다. 
         */
		onMidTableCreate : function () {
            console.group("onMidTableCreate");

            var midObjectData = this.getModel("midObjectData"),   
                midObjectView = this.getModel("midObjectView"),   
                oModel = this.getOwnerComponent().getModel("jCodeText");

            var oMi_material_code = midObjectData.getProperty("/mi_material_code");

            //신규
            var mode = "U";
            if(!midObjectView.getProperty("/pageMode")){
                oMi_material_code = sap.ui.core.Fragment.byId("Change_id","inputMaterialCode"); []
                mode = "C";
            }

            var items = {
                    "tenant_id": midObjectData.getProperty("/tenant_id"),
                    "company_code": midObjectData.getProperty("/company_code"),
                    "org_type_code": midObjectData.getProperty("/org_type_code"),
                    "org_code": midObjectData.getProperty("/org_code"),
                    "mi_material_code": oMi_material_code,
                    "language_code": "",
                    "mi_material_code_name": "",
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date(),
                    "create_user_id": "Admin",
                    "update_user_id": "Admin",
                    "system_create_dtm": new Date(),
                    "system_update_dtm": new Date(),
                    "mode" : mode
            };
 
            oModel.oData.push(items);
            oModel.refresh(true);

            //odata version
            /*
            oModel.setDeferredGroups(oModel.getDeferredGroups().concat(["taleGroupId"]));

	        var mParameters = {
	        	"groupId":"createGroup",
	        	"properties" : {
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
                } 
            };           
           
            //데이타를 바로 등록 
            this.getModel().createEntry("/MIMaterialCodeText", mParameters);    
            this.getModel().setUseBatch(true);
            this.getModel().submitChanges({
                groupId: "taleGroupId", 
                success: this._handleCreateSuccess.bind(this),
                error: this._handleCreateError.bind(this)
            });
                   
            */
			console.groupEnd();
        } ,
        
        /**
         * MIMaterialCodeList create or update
         */
		onMidUpdate : function () {

            console.log("call function ========== onMidUpdate");

            var validator = new Validator();
  
            
              validator.validate(this.byId("page"));
              
            var mode = this.getView().getModel("midObjectView").getProperty("/mode"),
                ojCodeTextModel = this.getOwnerComponent().getModel("jCodeText"),
                midObjectData = this.getModel("midObjectData"),
                midObjectView = this.getModel("midObjectView"),
                oTable = sap.ui.core.Fragment.byId("Change_id","midTableChange"),
                oModel=this.getOwnerComponent().getModel(),
                mcheck = midObjectView.getProperty("/mcheck"),
                bFlag = false;

       

            if(!mcheck){

                MessageBox.show("자재코드 중복을 먼저 체크 하셔야 합니다.", {
                    icon: MessageBox.Icon.WARNING,
                    title: "자재 코드 확인",
                    actions: [MessageBox.Action.OK],
                    styleClass: "sapUiSizeCompact",
                    onClose: function (sButton) {
                        
                    },                      
                }); 
            }else {

    
                var inputMaterialCode = sap.ui.core.Fragment.byId("Change_id","inputMaterialCode"); 
                var comboBoxCategory_code = sap.ui.core.Fragment.byId("Change_id","comboBoxCategory_code"); 
                var switchUse_flag = sap.ui.core.Fragment.byId("Change_id","switchUse_flag"); 

                var categorySelectedKey = comboBoxCategory_code.getSelectedKey();
                var categoryValue = comboBoxCategory_code.getValue();
                var bNullFlag = true;
                var msg="";


                if(this.isValNull(inputMaterialCode.getValue())){
                       
                    inputMaterialCode.setValueState("Error");                    
                    inputMaterialCode.setValueStateText("자재코드는 필수 입니다.");
                    inputMaterialCode.openValueStateMessage();

                }

                if(this.isValNull(categorySelectedKey)){
               
                    // var allItem = comboBoxCategory_code.getItems();
                    // var arr = [];
                    // var value = comboBoxCategory_code.getValue().trim();
                    // for (var i = 0; i < allItem.length; i++) {
                    //     arr.push(allItem[i].getText())}
                    // if (arr.indexOf(value) < 0) {
                    //     comboBoxCategory_code.setValueState("Error")
                    //     comboBoxCategory_code.setValueStateText("카테고리를 선택 해야 합니다..");
                    //     comboBoxCategory_code.setValue();
                    // } else {
                    //     comboBoxCategory_code.setValueState("None")
                    // } 

                    comboBoxCategory_code.setValueState("Error")
                    comboBoxCategory_code.openValueStateMessage();                  
                    comboBoxCategory_code.setValueStateText("카테고리를 선택 해야 합니다..");
                    
                    msg += "카테고리를 선택 해야 합니다.\n";
                }

                if(oTable.getItems().length<1){
                    msg += "언어정보를 한건이라도 등록 해야 합니다.";               
                }
                
                if(msg!=""){
                    MessageBox.show(msg, {
                        icon: MessageBox.Icon.ERROR,
                        title: "입력값 확인",
                        actions: [MessageBox.Action.OK],
                        styleClass: "sapUiSizeCompact"
                    });   
                    return;
                }

                var groupID = "createGroup";

                //if( oModel.hasPendingChanges() ) {
                //신규가 아니라면 

                var operationMode = "create";
                //업데이트
                if(!midObjectView.getProperty("/pageMode")){
                    groupID = "updateGroup";   
                    operationMode = "update"; 

                }

                oModel.setDeferredGroups(oModel.getDeferredGroups().concat([groupID]));
                var mi_material_code_name, 
                vMi_material_code_name="";

         
                var bUpdate = false;
                var arrTParameters= [];
                var carrTParameters= [];
                //언어별 테이블 내용을 각 타입별로 저장한다.     
                for (var idx = 0; idx < oTable.getItems().length; idx++){

                    var items = oTable.getItems()[idx];
                    var state = items.getCells()[0].mProperties.text;

                    var language_code = items.getCells()[0].mProperties.selectedKey;
                    mi_material_code_name = items.getCells()[1].mProperties.value;
                
                    if(language_code=="KO"){
                        vMi_material_code_name = mi_material_code_name;
                    }

                    //키 값은 제외 한다.
                    var tParameters = {                        
                            "mi_material_code_name": mi_material_code_name,
                            "local_create_dtm": new Date(),
                            "local_update_dtm": new Date(),
                            "create_user_id": "Admin",
                            "update_user_id": "Admin",
                            "system_create_dtm": new Date(),
                            "system_update_dtm": new Date()                          
                    };

                    //테이블 아이템 등록일때.
                    var cParameters = {
                        "groupId": groupID,
                        "properties" : {   
                            "tenant_id": midObjectData.getProperty("/tenant_id"),
                            "company_code": midObjectData.getProperty("/company_code"),
                            "org_type_code": midObjectData.getProperty("/org_type_code"),
                            "org_code": midObjectData.getProperty("/org_code"),
                            "mi_material_code": midObjectData.getProperty("/mi_material_code"),
                            "language_code": language_code,
                            "mi_material_code_name": mi_material_code_name,
                            "local_create_dtm": new Date(),
                            "local_update_dtm": new Date(),
                            "create_user_id": "Admin",
                            "update_user_id": "Admin",
                            "system_create_dtm": new Date(),
                            "system_update_dtm": new Date()  
                        }  
                    };

                    if(operationMode=="update"){
                        arrTParameters.push(tParameters);

                        //업데이트 모드에서 행 추가 
                        carrTParameters.push(cParameters);
                        bUpdate = true;
                    }else{
                        oModel.createEntry("/MIMaterialCodeText", cParameters); 
                    }
                }

                //KO가 없다면 한건이라도 등록한다. 
                if(vMi_material_code_name==""){
                    vMi_material_code_name = mi_material_code_name;
                }
                
                var mParameters = {
                    "groupId": groupID,
                    "properties" : {
                        "tenant_id": midObjectData.getProperty("/tenant_id"),
                        "company_code": midObjectData.getProperty("/company_code"),
                        "org_type_code": midObjectData.getProperty("/org_type_code"),
                        "org_code": midObjectData.getProperty("/org_code"),
                        "mi_material_code": inputMaterialCode.getValue(),
                        "mi_material_code_name": inputMaterialCode.getValue(),
                        "category_code": categorySelectedKey,
                        "category_name": categoryValue,
                        "use_flag": switchUse_flag.getState(),
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date(),
                        "create_user_id": "Admin",
                        "update_user_id": "Admin",
                        "system_create_dtm": new Date(),
                        "system_update_dtm": new Date()
                    }
                };	      
               
                if(operationMode=="update"){
               
                    if(bUpdate){
                        var oData = new JSONModel();
                        oData.setData(ojCodeTextModel.getData()); 
                        
                        for (var idx = 0; idx < oTable.getItems().length; idx++){

                            var sPath = oTable.getItems()[idx].getBindingContextPath();
                            var replaceSPatch = sPath.replace("/","");
                  
                            if(oData.oData[replaceSPatch].hasOwnProperty("__metadata")){
                                var sServicePath = oData.oData[replaceSPatch].__metadata.uri;
                                var arrS = sServicePath.split("pg.marketIntelligenceService");
                                var sUrl = arrS[1];                                    
                                oModel.update(sUrl, arrTParameters[idx], {groupId: groupID});
                            }
                        }

                        for (var idx = 0; idx < oTable.getItems().length; idx++){
                           
                        }

                        //작업을 완료하고 비워 준다. 
                        arrTParameters = null;
                 
                    //삭제에 담아둔 행을 삭제 한다. 
                    var deleteOModel = this.getOwnerComponent().getModel("deleteOModel");
                    
                    if(typeof deleteOModel!=="undefined"){
                        
                        if(deleteOModel.flag){
                            if(deleteOModel.item.length>0){
                                for(var idx =0; idx< deleteOModel.item.length;idx++){
                                    var sServicePath = deleteOModel.item[idx];
                                    oModel.remove(sServicePath, {groupId: groupID});
                                }
                                //작업을 마치고 비워준다. 
                                deleteOModel.setData([]);
                            }

                        }
                    }

                    oModel.submitChanges({
                        groupId: groupID, 
                        success: this._handleUpdateSuccess.bind(this),
                        error: this._handleUpdateError.bind(this)
                    });
                                     
                    
                }else{

                    oModel.createEntry("/MIMaterialCodeList", mParameters);
                    
                    oModel.setUseBatch(true);
                    oModel.submitChanges({
                        groupId: groupID, 
                        success: this._handleCreateSuccess.bind(this),
                        error: this._handleCreateError.bind(this)
                    });                    
                }

                //oModel.setDeferredGroups(oModel.getDeferredGroups().concat([groupID]));

                oModel.refresh(); 
            }

	 
        },


        /**
         * MIMaterialCodeList new item create
         */
        onMainSave : function() {
            debugger;
            console.group("onMainSave");
			var mi_material_code = "BIZ00121";
	        var mParameters = {
	        	"groupId":"createGroup",
	        	"properties" : {
					"tenant_id": midObjectData.getProperty("/tenant_id"),
					"company_code": midObjectData.getProperty("/company_code"),
					"org_type_code": midObjectData.getProperty("/org_type_code"),
					"org_code": midObjectData.getProperty("/org_code"),
					"mi_material_code": this.getView().byId("inputMaterialCode").getValue(),
					"mi_material_code_text": this.getView().byId("mi_material_code_text").getValue(),
					"category_code": this.getView().byId("comboBoxCategory_code").getValue(),
					"category_name": this.getView().byId("comboBoxCategory_code").getText(),
					"use_flag": this.getView().byId("switchUse_flag").getState(),
					"local_create_dtm": new Date(),
					"local_update_dtm": new Date(),
					"create_user_id": "Admin",
					"update_user_id": "Admin",
					"system_create_dtm": new Date(),
					"system_update_dtm": new Date()
	        	}
            };					
            //switchUse_flag
			var oEntry = this.getModel().createEntry("/MIMaterialCodeList", mParameters);
			//this.getView().byId("mainTable").setBindingContext(oEntry);

			this.getModel().setUseBatch(true);
	    	this.getModel().submitChanges({
			  groupId: "createGroup", 
			  success: this._handleCreateSuccess.bind(this),
			  error: this._handleCreateError.bind(this)
            });
            console.groupEnd();
        },

		_onExit : function () {
			for (var sPropertyName in this._formFragments) {
				if (!this._formFragments.hasOwnProperty(sPropertyName) || this._formFragments[sPropertyName] == null) {
					return;
				}

				this._formFragments[sPropertyName].destroy();
				this._formFragments[sPropertyName] = null;
			}
        },
                

		_handleCreateSuccess: function(oData) {
            MessageBox.show("저장 확인", {
                icon: MessageBox.Icon.SUCCESS,
                title: "저장에 성공 하였습니다.",  
                actions: [MessageBox.Action.OK],
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        var sNextLayout = this.getOwnerComponent().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
                        this._onExit();
                        this.getRouter().navTo("mainPage", { layout: sNextLayout });
                    }
                }
            });            
			//MessageToast.show("저장에 성공 하였습니다.");
		},
		_handleCreateError: function(oError) {
			MessageBox.error("저장에 실패 하였습니다.");
        },
		_handleUpdateSuccess: function(oData) {
            MessageBox.show("수정 확인", {
                icon: MessageBox.Icon.SUCCESS,
                title: "수정에 성공 하였습니다.",
                actions: [MessageBox.Action.OK],
                styleClass: "sapUiSizeCompact"
            });     
		},
		_handleUpdateError: function(oError) {
            MessageBox.show("수정 실패 확인", {
                icon: MessageBox.Icon.ERROR,
                title: "수정에 실패 하였습니다.",
                actions: [MessageBox.Action.OK],
                styleClass: "sapUiSizeCompact"
            });     
        },
        /**
         * 삭제 성공
         * @param {ODATA} oData 
         * @private
         */
		_handleDeleteSuccess: function(oData) {
            MessageBox.show("삭제 실패 확인", {
                icon: MessageBox.Icon.ERROR,
                title: "삭제가 실패 하였습니다.",
                actions: [MessageBox.Action.OK],
                styleClass: "sapUiSizeCompact"
            });   
			//this.getView().byId("buttonMainTableDelete").setEnabled(false);
        },
        
        /**
         * 삭제실패
         * @param {Event} oError 
         * @private
         */
		_handleDeleteError: function(oError) {
            MessageBox.show("삭제 실패 확인", {
                icon: MessageBox.Icon.ERROR,
                title: "삭제가 실패 하였습니다.",
                actions: [MessageBox.Action.OK],
                styleClass: "sapUiSizeCompact"
            });  
		}
    });
});