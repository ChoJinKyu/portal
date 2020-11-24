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
                category_name : "",
                category_code : "",
                mi_material_code: "",                
                mi_material_code_name: "",                
                use_flag: "",
                filters : []            
            });
           
    
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
         * Fragment 설정
         * @param {String} sFragmentName 
         */
		_getFormFragment: function (sFragmentName) {
            console.log("call function _getFormFragment");
            //https://sapui5.netweaver.ondemand.com/#/entity/sap.ui.layout.form.SimpleForm/sample/sap.ui.layout.sample.SimpleForm354/code/Page.controller.js

			var oFormFragment = this._formFragments[sFragmentName];

			if (oFormFragment) {
				return oFormFragment;
            }

            oFormFragment = sap.ui.xmlfragment(sFragmentName+"_id", "pg.mi.view." + sFragmentName);

            this._formFragments[sFragmentName] = oFormFragment;
            
            return this._formFragments[sFragmentName];

		},

		_showFormFragment : function (sFragmentName) {
            console.group("_showFormFragment");

            var oPage = this.byId("page"),
                midObjectData = this.getModel("midObjectData");
            
            oPage.removeAllContent();
            
            oPage.insertContent(this._getFormFragment(sFragmentName));
            

            if(sFragmentName=="Change"){
                sap.ui.core.Fragment.byId("Change_id","inputMaterialCode").setText(midObjectData.getProperty("/mi_material_code"));
                sap.ui.core.Fragment.byId("Change_id","comboBoxCategory_code").setkey(midObjectData.getProperty("/category_code"));
                sap.ui.core.Fragment.byId("Change_id","switchUse_flag").setState(midObjectData.getProperty("/use_flag"));
            }else{

                debugger;
                var vUseFlag = "미사용";
                if(midObjectData.getProperty("/use_flag")=="true") { vUseFlag = "사용";}
                sap.ui.core.Fragment.byId("Display_id","textMaterialCode").setText(midObjectData.getProperty("/mi_material_code"));
                sap.ui.core.Fragment.byId("Display_id","textcategoryName").setText(midObjectData.getProperty("/category_name"));
                sap.ui.core.Fragment.byId("Display_id","textUseflag").setText(vUseFlag);
            }

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
                oView = this.getView(),
                that = this;
              
                var midObjectData = new JSONModel({
                    tenant_id: "",
                    company_code: "",
                    org_type_code: "",
                    org_code: "",
                    category_name : "",
                    category_code : "",
                    mi_material_code: "",                
                    mi_material_code_name: "",                
                    use_flag: "",
                    filters : []            
                });


              

                //var sServiceUrl = "/MIMaterialCodeList(tenant_id='"+oArgs.tenant_id+"',company_code='"+oArgs.company_code+"',org_type_code='"+oArgs.org_type_cod+"',org_code='"+oArgs.org_code+"',mi_material_code='"+oArgs.mi_material_code+"')";
                var sServiceUrl = "/MIMaterialCodeList(tenant_id='"+oArgs.tenant_id+"',company_code='"+oArgs.company_code+"',org_type_code='"+oArgs.org_type_code+"',org_code='"+oArgs.org_code+"',mi_material_code='"+oArgs.mi_material_code+"')";
                
                // MIMaterialCodeList(tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100'
                // ,mi_material_code='LED-001-01')

                var oModel = this.getOwnerComponent().getModel(),
                oView = this.getView(),
                midObjectDataModel = this.getModel("midObjectData"),
                that = this;

               
                oModel.read(sServiceUrl, {
                    success: function (oData) {

                        console.log("oData~~~~~~~"+JSON.stringify(oData));  
                        debugger;
                        midObjectData.setProperty("/tenant_id", oData.tenant_id);
                        midObjectData.setProperty("/company_code", oData.company_code);
                        midObjectData.setProperty("/org_type_code", oData.org_type_code);
                        midObjectData.setProperty("/org_code", oData.org_code);
                        midObjectData.setProperty("/category_name", oData.category_name);
                        midObjectData.setProperty("/category_code", oData.category_code);
                        midObjectData.setProperty("/mi_material_code", oData.mi_material_code);                
                        midObjectData.setProperty("/mi_material_code_name", oData.mi_material_code_name);                
                        midObjectData.setProperty("/use_flag", oData.use_flag);
                   
                        that._onPageMode(false);
                    }
                    
                });

               // that._onPageMode(false);

            console.groupEnd();
        },

        /**
         * Note : Smart Table Filter 값 참조후 작업
         */
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
                   
                    //oView.setBusy(false);
                    //this.setLog("oData~~~~~~~"+JSON.stringify(oData));
                    this.getView().byId("inputMaterialCode").setValue( oData.mi_material_code_text );
                    this.getView().byId("buttonMaterialCheck").setEnable(false);
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
            if(!pageMode){this._onPageMode(true);buttonMidEdit.setText("Show");}
            else{this._onPageMode(false);buttonMidEdit.setText("Edit");}
        },

        /**
         * 초기 실행과 버튼이벤트 구분을 위한 function
         * @param {*} modeType 
         */
        _onPageMode : function(modeType){

            if(!modeType){ this._toShowMode(); }
            else{this._toEditMode();}
        },

        /**
         * 수정화면 처리
         * @private
         */
        _toEditMode: function () {
            console.group("_toEditMode");
            this._showFormFragment("Change");
            this.getModel("midObjectView").setProperty("/mode", true);
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
         * table 삭제 액션
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
            var midObjectData = this.getModel("midObjectData");
            ///this.onMainSave();

	        var mParameters = {
	        	"groupId":"createGroup",
	        	"properties" : {
                    "tenant_id": midObjectData.getProperty("/tenant_id"),
                    "company_code": midObjectData.getProperty("/company_code"),
                    "org_type_code": midObjectData.getProperty("/org_type_code"),
                    "org_code": midObjectData.getProperty("/org_code"),
                    "mi_material_code": midObjectData.getProperty("/mi_material_code"),
                    "language_code": this.getView().byId("language_code").getValue(),
                    "mi_material_code_text": this.getView().byId("mi_material_code_text").getValue(),
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date(),
                    "create_user_id": "Admin",
                    "update_user_id": "Admin",
                    "system_create_dtm": new Date(),
                    "system_update_dtm": new Date()
                } 
            };           

            // create/
            this.getModel().create("/MIMaterialCodeText", mParameters);
                    
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
            var mode = this.getView().getModel("midObjectView").getProperty("/mode");

            if(!mode) {
                this.onMainSave();
                return;
            }

	        var mParameters = {
	        	"groupId":"updateGroup",
	        	"properties" : {
					"tenant_id": midObjectData.getProperty("/tenant_id"),
					"company_code": midObjectData.getProperty("/company_code"),
					"org_type_code": midObjectData.getProperty("/org_type_code"),
					"org_code": midObjectData.getProperty("/org_code"),
					"mi_material_code": midObjectData.getProperty("/mi_material_code"),
					"mi_material_code_text": midObjectData.getProperty("/mi_material_code_text"),
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
            //oView.byId("switchUse_flag").setState
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
         * MIMaterialCodeList new item create
         */
        onMainSave : function() {
            
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