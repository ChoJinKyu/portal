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

        /**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            console.group("[mid] onInit");

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


            var midTaleData = new JSONModel({
                items : []
            });
           
            this.getOwnerComponent().setModel(new ManagedListModel(), "codeText");

    
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
                        }else{
                       
                            inputMaterialCode.setValueState("Error");
                            MessageToast.show("중복된 자재코드 입니다.");
                            inputMaterialCode.setValueStateText("중복된 자재코드 입니다.");
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
            
            
            oView.setBusy(true);

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

           // var jCodeTextData = new JSONModel();
            //var jModel = this.getOwnerComponent().getModel("jdata");

            
            var oCodeTextModel = this.getOwnerComponent().getModel("codeText");
                oCodeTextModel.setTransactionModel(oModel);
                oCodeTextModel.read("/MIMaterialCodeText", {
					filters: aFilters,
					success: function(oData){

					}
                });
                
                debugger;
                /*
            sServiceUrl = "/MIMaterialCodeText"; 
            oModel.read(sServiceUrl, {
                async : false,
                filters : aFilters,                    
                success: function (rData, reponse) {
                    console.log("MIMaterialCodeText to json oData~~~~~~~"+JSON.stringify(reponse.data.results[0]));  
                    //"http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MIMaterialCodeText(tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100',mi_material_code='LED-001-01',language_code='AA')"

                    jCodeTextData.setData(reponse.data.results);                  
                    that.getOwnerComponent().setModel({jCodeText : jCodeTextData});

                    //var arrData = [];
                    //for(var i=0;i<reponse.data.results.length;i++){

                    //신규가 아닐때만 진행
                    //if(!bNew) {
                            // var path="MIMaterialCodeText(tenant_id='"+reponse.data.results[i].tenant_id;
                            // path += "',company_code='" +reponse.data.results[i].company_code;
                            // path += "',org_code='" +reponse.data.results[i].org_code;
                            // path += "',mi_material_code='" +reponse.data.results[i].mi_material_code;
                            // path += "',language_code='" +reponse.data.results[i].language_code+"')";
                            


                           
                        //}
                   // }
           
                    
                }
            });
            */

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

            oView.setBusy(false);

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
                buttonMidEdit = this.getView().byId("buttonMidEdit");
            var pageMode = midObjectView.getProperty("/mode");

            
            if(!pageMode){
                this._onPageMode(true);
                buttonMidEdit.setText("Show");}
            else{
                this._onPageMode(false);
                buttonMidEdit.setText("Edit");
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
            if (oSelected.length > 0) {
    
                for ( var i = oSelected.length - 1; i >= 0; i--) {
                    var idx = parseInt(oSelected[0].sPath.substring(oSelected[0].sPath.lastIndexOf('/') + 1));
                    
                    //json 데이타 바로 삭제일때.    
                    //oModel.splice(idx, 1);

                    //json 업데이트 
                    oModel.oData[idx].state="D"
                }

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
                oModel = this.getOwnerComponent().getModel("jCodeText");
            var items = {
                    "tenant_id": midObjectData.getProperty("/tenant_id"),
                    "company_code": midObjectData.getProperty("/tenant_id"),
                    "org_type_code": midObjectData.getProperty("/tenant_id"),
                    "org_code": midObjectData.getProperty("/tenant_id"),
                    "mi_material_code": midObjectData.getProperty("/tenant_id"),
                    "language_code": "",
                    "mi_material_code_name": "",
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date(),
                    "create_user_id": "Admin",
                    "update_user_id": "Admin",
                    "system_create_dtm": new Date(),
                    "system_update_dtm": new Date(),
                    "state" : "C"
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
         * MIMaterialCodeList update
         */
		onMidUpdate : function () {
            console.group("onMidUpdate");

            var mode = this.getView().getModel("midObjectView").getProperty("/mode"),
                ojCodeTextModel = this.getOwnerComponent().getModel("jCodeText"),
                midObjectData = this.getModel("midObjectData"),
                midObjectView = this.getModel("midObjectView"),
                oTable = sap.ui.core.Fragment.byId("Change_id","midTableChange"),
                oModel=this.getOwnerComponent().getModel();


            if(!midObjectView.getProperty("/mcheck")){

                MessageBox.show("자재코드 중복을 먼저 체크 하셔야 합니다.", {
                    icon: MessageBox.Icon.WARNING,
                    title: "자재 코드 확인",
                    actions: [MessageBox.Action.OK],
                    styleClass: "sapUiSizeCompact"
                });   

                return;

            }

            

            var that = this.getView().getController();
            
            var deleteGroup = [];
            var updateGroup = [];
            var createGroup = [];
            var batchChanges = [];  


            //var mi_material_code = "LED-001-01";

            /**언어 삭제 */
            oTable.getSelectedItems().forEach(function(oItem){

                var sPath = oItem.getBindingContextPath();	
                var mParameters = {"groupId":"deleteGroup"};

                debugger;

                oItem.getBindingContext().getModel().remove(sPath, mParameters);

            });
            
            //var oModel = this.getView().getModel();
            oModel.setHeaders({  
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json", 
                "DataServiceVersion": "2.0",
                "Accept": "application/atom+xml,application/atomsvc+xml,application/xml"
                });   

            oModel.submitChanges({
                  groupId: "deleteGroup", 
                success: this._handleDeleteSuccess.bind(this),
                error: this._handleDeleteError.bind(this)
             });


           /**언어 수정  실패
            * The request dispatcher does not allow the HTTP method used for the request.
            * 
           */
          /*
            oModel.setDeferredGroups(oModel.getDeferredGroups().concat(["taleGroupId"]));
            //content type application/atom+xml 

            // var headers= {   
            //     "X-Requested-With": "XMLHttpRequest",  
            //     "Content-Type": "application/atom+xml",  
            //     "DataServiceVersion": "2.0",   
            //     "Accept": "application/atom+xml,application/atomsvc+xml,application/xml",  
            //     "X-CSRF-Token": header_xcsrf_token  
            //    };
               oModel.setHeaders({  
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/xml", 
                "DataServiceVersion": "2.0",
                "Accept": "application/atom+xml,application/atomsvc+xml,application/xml"
                });  
	        var mParameters = {
	   
                    "tenant_id": "L2100",
                    "company_code": "*",
                    "org_type_code": "BU",
                    "org_code": "BIZ00100",
                    "mi_material_code": "LED-001-01",
                    "language_code": "AA",
                    "mi_material_code_name": "테스트 자제1",
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date(),
                    "create_user_id": "Admin",
                    "update_user_id": "Admin",
                    "system_create_dtm": new Date(),
                    "system_update_dtm": new Date()
               
            };           

            //데이타를 바로 등록 
            oModel.update("/MIMaterialCodeText", mParameters);    
            oModel.setUseBatch(true);
            oModel.submitChanges({
                groupId: "taleGroupId", 
                success: this._handleCreateSuccess.bind(this),
                error: this._handleCreateError.bind(this)
            });
            oModel.refresh();  

            return;
*/


            /**언어 등록 성공 */
            /*
            oModel.setDeferredGroups(oModel.getDeferredGroups().concat(["taleGroupId"]));

	        var mParameters = {
	   
                    "tenant_id": "L2100",
                    "company_code": "*",
                    "org_type_code": "BU",
                    "org_code": "BIZ00100",
                    "mi_material_code": "LED-001-01",
                    "language_code": "AA",
                    "mi_material_code_name": "테스트 자제",
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date(),
                    "create_user_id": "Admin",
                    "update_user_id": "Admin",
                    "system_create_dtm": new Date(),
                    "system_update_dtm": new Date()
               
            };           

            //데이타를 바로 등록 
            oModel.create("/MIMaterialCodeText", mParameters);    
            oModel.setUseBatch(true);
            oModel.submitChanges({
                groupId: "taleGroupId", 
                success: this._handleCreateSuccess.bind(this),
                error: this._handleCreateError.bind(this)
            });
            oModel.refresh();  

            return;

            */
            //MIMaterialCodeList 성공 
            /*
            var mi_material_code = "BIZ00122";
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
			this.getModel().createEntry("/MIMaterialCodeList", mParameters);
			//this.getView().byId("mainTable").setBindingContext(oEntry1);

			this.getModel().setUseBatch(true);
	    	this.getModel().submitChanges({
				groupId: "createGroup", 
			  success: this._handleCreateSuccess.bind(this),
			  error: this._handleCreateError.bind(this)
            });
            */



            //실패
            /*
            oModel.setDeferredGroups(oModel.getDeferredGroups().concat(["tableGroupId"]));
            oModel.setChangeGroups({
                "MIMaterialCodeText": {
                    groupId: "tableGroupId", 
                    single: true
                }
            });
	        var mParameters = {
	        	"groupId":"tableGroupId",
	        	"properties" : {
                        "tenant_id": midObjectData.getProperty("/tenant_id"),
                        "company_code": midObjectData.getProperty("/company_code"),
                        "org_type_code": midObjectData.getProperty("/tenant_id"),
                        "org_code": midObjectData.getProperty("/org_code"),
                        "mi_material_code": midObjectData.getProperty("/mi_material_code"),
                        "language_code": "CN",
                        "mi_material_code_name": "CNA",
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date(),
                        "create_user_id": "Admin",
                        "update_user_id": "Admin",
                        "system_create_dtm": new Date(),
                        "system_update_dtm": new Date()    
                } 
            };           

            debugger;
            this.getModel().create("/MIMaterialCodeText", mParameters);             
			this.getModel().setUseBatch(true);
	    	this.getModel().submitChanges({
			    groupId: "tableGroupId", 
                success: this._handleCreateSuccess.bind(this),
                error: this._handleCreateError.bind(this)
            });
            return;
            */
            //언어별 테이블 내용을 각 타입별로 저장한다. 
            for (var idx = 0; idx < oTable.getItems().length; idx++){
                 var groupType  = "updateGroup";
                 var items = oTable.getItems()[idx];
                 var state = items.getCells()[0].mProperties.text;
                 var language_code = items.getCells()[1].mProperties.selectedKey;
                 var mi_material_code_name = items.getCells()[1].mProperties.value;

                 var odataMethod = "PUT";

                if (state=="D") { groupType="deleteGroup"; odataMethod ="DELETE" }
                else if (state=="C") { groupType="createGroup"; odataMethod ="POST"}

                var mParameters = {
                                       
                        "tenant_id": midObjectData.getProperty("/tenant_id"),
                        "company_code": midObjectData.getProperty("/company_code"),
                        "org_type_code": midObjectData.getProperty("/tenant_id"),
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
                            
                };

                // var oContext = oModel.createEntry("/Products", 
                // { properties: { ID:99, Name:"Product", Description:"new Product", ReleaseDate:new Date(), Price:"10.1", Rating:1} }
                // );

                 oModel.setChangeGroups({
                    "MIMaterialCodeText": {
                        groupId: "updateGroup", 
                        single: true
                    }
                });

             
                if(state=="R"){
                   // this.getModel().update("/MIMaterialCodeText", mParameters);    
                }
                else if(state=="C"){
                  //  this.getModel().create("/MIMaterialCodeText", mParameters);    
                }
                else if(state=="D"){
                   // this.getModel().delete("/MIMaterialCodeText", mParameters);    
                }
                //this.getModel().update("/MIMaterialCodeTexttenant_id='L2100',company_code='*',org_type_code='BU',org_code='BIZ00100',mi_material_code='"+ midObjectData.getProperty("/mi_material_code") +"',language_code='EN')", mParameters);   
                this.getModel().update("/MIMaterialCodeText", mParameters); 
             
            };

            this.getModel().setUseBatch(true);
            this.getModel().submitChanges({
                groupId: ["updateGroup"], 
                success: this._handleUpdateSuccess.bind(this),
                error: this._handleUpdateError.bind(this)
            });

          
    
	        console.groupEnd();
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
		_handleCreateSuccess: function(oData) {
            MessageBox.show("저장 확인", {
                icon: MessageBox.Icon.SUCCESS,
                title: "저장에 성공 하였습니다.",
                actions: [MessageBox.Action.OK],
                styleClass: "sapUiSizeCompact"
            });            
			MessageToast.show("저장에 성공 하였습니다.");
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