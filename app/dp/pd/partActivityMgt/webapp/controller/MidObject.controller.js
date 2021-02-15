sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
	"ext/lib/util/Validator",
	"sap/ui/model/json/JSONModel",
	"ext/lib/model/TransactionManager",
	"ext/lib/model/ManagedModel",
	"ext/lib/model/ManagedListModel",
	"ext/lib/formatter/DateFormatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"sap/m/ComboBox",
    "sap/ui/core/Item",
    "sap/m/ObjectStatus",
    "sap/f/LayoutType",
    "dp/util/control/ui/ActivityCodeDialog"
], function (BaseController, Multilingual, Validator, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter, 
	Filter, FilterOperator, Fragment, MessageBox, MessageToast, 
	ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, ObjectStatus, LayoutType, ActivityCodeDialog) {
		
	"use strict";

	var oTransactionManager;

	return BaseController.extend("dp.pd.partActivityMgt.controller.MidObject", {

        dateFormatter: DateFormatter,
        
        validator: new Validator(),
        
        tenant_id: new String,
        loginUserId: new String,
        loginUserName: new String,		

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
		onInit : function () {

            //로그인 세션 작업완료시 수정
            this.tenant_id = "L2101";
            this.loginUserId = "TestUser";
            this.loginUserName = "TestUser";            

            var oMultilingual = new Multilingual();
			this.setModel(oMultilingual.getModel(), "I18N");
			this.setModel(new ManagedListModel(), "list");
			// Model used to manipulate controlstates. The chosen values make sure,
			// detail page shows busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
					busy : true,
                    delay : 0,
                    screen: ""                    
				});
			this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);
			this.setModel(oViewModel, "midObjectView");
			
			this.setModel(new ManagedModel(), "master");
            // this.setModel(new ManagedListModel(), "languages");            

			oTransactionManager = new TransactionManager();
			oTransactionManager.addDataModel(this.getModel("master"));
            // oTransactionManager.addDataModel(this.getModel("languages"));            

			this.getModel("master").attachPropertyChange(this._onMasterDataChanged.bind(this));
            
            this.enableMessagePopover();
        }, 

        formattericon: function(sState){
            switch(sState){
                case "D":
                    return "sap-icon://decline";
                break;
                case "U": 
                    return "sap-icon://accept";
                break;
                case "C": 
                    return "sap-icon://add";
                break;
            }
            return "";
        },

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler for Enter Full Screen Button pressed
		 * @public
		 */
		
		handleFullScreen: function () {
            var oContModel = this.getModel("contModel");
            oContModel.setProperty("/midObject/visibleFullScreenBtn", false);

            // var sLayout = LayoutType.EndColumnFullScreen;
            var sLayout = LayoutType.MidColumnFullScreen;
			this._changeFlexibleColumnLayout(sLayout);
        },
        
		handleExitFullScreen: function () {
			var oContModel = this.getModel("contModel");
            oContModel.setProperty("/midObject/visibleFullScreenBtn", true);

            // var sLayout = LayoutType.ThreeColumnsEndExpanded;
            var sLayout = LayoutType.TwoColumnsMidExpanded;
            this._changeFlexibleColumnLayout(sLayout);
        },
        
		handleClose: function () {
            var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.getRouter().navTo("mainPage", {layout: sNextLayout});
        },

        _changeFlexibleColumnLayout : function(layout){
            var oFclModel = this.getModel("fcl");
            oFclModel.setProperty("/layout", layout);
        },

		/**
		 * Event handler for page edit button press
		 * @public
		 */
		onPageEditButtonPress: function(){
			this._toEditMode();
		},
		
		/**
		 * Event handler for delete page entity
		 * @public
		 */
        onPageDeleteEditButtonPress: function(){
			this.onPageSaveButtonPress("D");
        },
        
        onDialogActivityPress : function(){

            if(!this.oSearchActivityDialog){
                this.oSearchActivityDialog = new ActivityCodeDialog({
                    title: "Select Activity",
                    multiSelection: false,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2101")
                        ]
                    }
                });
                this.oSearchActivityDialog.attachEvent("apply", function(oEvent){ 
                    console.log(oEvent.getParameter("item"));
                    this.byId("searchActivityInput").setValue(oEvent.getParameter("item").activity_code);
                    this.byId("searchActivityName").setValue(oEvent.getParameter("item").activity_name);
                }.bind(this));
            }

            this.oSearchActivityDialog.open();

        },

		// onLngTableAddButtonPress: function(){
		// 	var oTable = this.byId("lngTable"),
		// 		oLanguagesModel = this.getModel("languages");
		// 	oLanguagesModel.addRecord({
		// 		"tenant_id": this._sTenantId,
		// 		"activity_code": this._sActivityCode,
		// 		"language_code": "",
		// 		"code_name": ""			
		// 	}, "/PdPartBaseActivityLng", 0);
		// },

		// onLngTableDeleteButtonPress: function(){
		// 	var oTable = this.byId("lngTable"),
		// 		oModel = this.getModel("languages"),
		// 		aItems = oTable.getSelectedItems(),
		// 		aIndices = [];
		// 	aItems.forEach(function(oItem){
		// 		aIndices.push(oModel.getProperty("/PdPartBaseActivityLng").indexOf(oItem.getBindingContext("languages").getObject()));
		// 	});
		// 	aIndices = aIndices.sort(function(a, b){return b-a;});
		// 	aIndices.forEach(function(nIndex){
		// 		//oModel.removeRecord(nIndex);
		// 		oModel.markRemoved(nIndex);
		// 	});
		// 	oTable.removeSelections(true);
        // },
        
        onInputChange: function(oEvent){
           
            // var _oInput = oEvent.getSource();
            // var val = _oInput.getValue();
            //     val = val.replace(/[^\d]/g, '');
            this.byId("searchActivityName").setValue("");                          
                
        },
		
		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function(CUDType){
           
            var oView = this.getView();
            var oMasterModel = this.getModel("master");
            // var oLanguagesModel = this.getModel("languages");
            
            var v_this = this;            
                
            var oMasterData = oMasterModel.oData;
            // var oLngData = oLanguagesModel.oData;            

            // var oLngTable = this.byId("lngTable");            
           
            var CUType = CUDType;

            if(CUType === "U" ){
                if(!oMasterModel.isChanged()) {
                        MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
                        return;
                }
            }

            if(CUType !== "D") {
                if(this._sActivityCode !== "new"){
                    CUType = "U";                
                } else {
                    CUType = "C";
                }
            }  

            console.log(CUType);
            
            var attachmentMandatoryFlag = "false";
            var approveMandatoryFlag = "false";
            var activeFlg = "false";           

            console.log(oMasterData.attachment_mandatory_flag);
            if (oMasterData.attachment_mandatory_flag === "true") {
                attachmentMandatoryFlag = "true";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
            }
            if (oMasterData.approve_mandatory_flag === "true") {
                approveMandatoryFlag = "true";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
            }
            if (oMasterData.active_flag === "true") {
                activeFlg = "true";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
            }            

            var pdMstVal = {
					tenant_id                   : oMasterData.tenant_id,
                    company_code                : oMasterData.company_code,
                    // org_type_code               : oMasterData.org_type_code,
                    org_code                    : oMasterData.org_code,                    
                    part_project_type_code      : oMasterData.part_project_type_code,

                    activity_code               : oMasterData.activity_code,
                    // category_group_code         : oMasterData.category_group_code,
                    sequence                    : oMasterData.sequence,
                    develope_event_code         : oMasterData.develope_event_code,
                    actual_role_code            : oMasterData.actual_role_code,

                    activity_complete_type_code : oMasterData.activity_complete_type_code,
                    job_type_code               : oMasterData.job_type_code,
                    attachment_mandatory_flag   : attachmentMandatoryFlag,
                    approve_mandatory_flag      : approveMandatoryFlag,
                    active_flag                 : activeFlg,

                    update_user_id  : this.loginUserId,
                    crud_type_code  : CUType
            };
            
            console.log(pdMstVal);
            

            // var input = {
            //     inputData : {
            //         crud_type : CUType,
            //         pdMst : pdMstVal,
            //         pdDtl: []
            //     }
            // };

            var input = {
                inputData : {
                    crud_type : CUType,
                    pdMst : pdMstVal
                }
            };

            // var pdDtlVal = [];
            
            // for (var i = 0; i <  oLngTable.getItems().length; i++) {
            //     pdDtlVal.push({
            //         tenant_id: oLngData.PdPartBaseActivityLng[i].tenant_id,
            //         activity_code: oLngData.PdPartBaseActivityLng[i].activity_code,
            //         language_cd: oLngData.PdPartBaseActivityLng[i].language_cd,
            //         code_name: oLngData.PdPartBaseActivityLng[i].code_name,
            //         update_user_id: this.loginUserId,                        
            //         crud_type_code: oLngData.PdPartBaseActivityLng[i]._row_state_
            //     });
            // }

            // input.inputData.pdDtl = pdDtlVal;                      

            if(this.validator.validate(this.byId("page")) !== true) return;

            var url = "srv-api/odata/v4/dp.partActivityV4Service/PdpartActivitySaveProc";
            
            // console.log(inputData);
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
                                    if(CUType === "D") {
                                        v_this.handleClose.call(v_this);
                                        v_this.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                        MessageToast.show(v_this.getModel("I18N").getText("/NCM01002"));                                       
                                    } else if(CUType === "C"){
                                        v_this.handleClose.call(v_this);
                                        v_this.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                        MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                    }else {
                                        MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                        // 저장 후 재조회
                                        v_this.getModel("contModel").setProperty("/createMode", false);                
                                        v_this._bindView("/pdPartactivityTemplateView(tenant_id='" + v_this._sTenantId + "',company_code='" + v_this._sCompanyCode
                                        + "',org_type_code='" + v_this._sOrgTypeCode + "',org_code='" + v_this._sOrgCode + "',part_project_type_code='" + v_this._sPartProjectTypeCode 
                                        + "',activity_code='" + v_this._sActivityCode + "')");

                                        v_this._toShowMode();                                
                                        v_this.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                    }
                                    // sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                    // v_this._toShowMode();                                
                                    // v_this.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                    
                                }else{
                                    console.log(rst);
                                    // sap.m.MessageToast.show( "error : "+rst.return_msg );
                                    MessageBox.error(rst.return_msg);
                                }
                            },
                            error: function (rst) {
                                    console.log("eeeeee");
                                    console.log(rst);
                                    MessageBox.error("예기치 않은 오류가 발생하였습니다.");
                                    // sap.m.MessageToast.show( "error : "+rst.return_msg );
                                    // v_this.onSearch(rst.return_msg );
                            }
                        });
					};
				}
            });
            this.validator.clearValueState(this.byId("page"));
		},
		
		
		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelEditButtonPress: function(){
			
            var oView = this.getView();            

            if (this._sActivityCode === "new"){
                this.handleClose();
            }else if (this._sActivityCode !== "new"){
                
                this.getModel("contModel").setProperty("/createMode", false);                
                
                // this._bindView("/pdPartactivityTemplateView(tenant_id='" + this._sTenantId + "',company_code='" + this._sCompanyCode
                // + "',org_type_code='" + this._sOrgTypeCode + "',org_code='" + this._sOrgCode + "',part_project_type_code='" + this._sPartProjectTypeCode 
                // + "',activity_code='" + this._sActivityCode + "',category_group_code='" + this._sCategoryGroupCode + "')");
                this._bindView("/pdPartactivityTemplateView(tenant_id='" + this._sTenantId + "',company_code='" + this._sCompanyCode
                + "',org_type_code='" + this._sOrgTypeCode + "',org_code='" + this._sOrgCode + "',part_project_type_code='" + this._sPartProjectTypeCode 
                + "',activity_code='" + this._sActivityCode + "')");
                
                // oView.setBusy(true);
                
                // var oLanguagesModel = this.getModel("languages");                

                // oLanguagesModel.setTransactionModel(this.getModel());               

                // oLanguagesModel.read("/PdPartBaseActivityLng", {
				// 	filters: [
				// 		new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
				// 		new Filter("activity_code", FilterOperator.EQ, this._sActivityCode),
				// 	],
				// 	success: function(oData){
				// 		oView.setBusy(false);
				// 	}
                // });
                
                this._toShowMode();
            }
            this.validator.clearValueState(this.byId("page"));
            // this.validator.clearValueState(this.byId("lngTable"));
        },

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		_onMasterDataChanged: function(oEvent){
			// if(this.getModel("contModel").getProperty("/createMode") == true){
			// 	var oMasterModel = this.getModel("master");
            //     var oLanguagesModel = this.getModel("languages");                
            //     var sTenantId = oMasterModel.getProperty("/tenant_id");
            //     var sActivityCode = oMasterModel.getProperty("/activity_code");

            //     var olanguagesData = oLanguagesModel.getData();
			// 	olanguagesData.PdPartBaseActivityLng.forEach(function(oItem, nIndex){
			// 		oLanguagesModel.setProperty("/PdPartBaseActivityLng/"+nIndex+"/tenant_id", sTenantId);
			// 		oLanguagesModel.setProperty("/PdPartBaseActivityLng/"+nIndex+"/activity_code", sActivityCode);
            //     });               
                
			// 	//oLanguagesModel.setData(olanguagesData);
			// }
		},

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onRoutedThisPage: function(oEvent){
			var oArgs = oEvent.getParameter("arguments"),
				oView = this.getView();
			this._sTenantId = oArgs.tenantId;
            this._sCompanyCode = oArgs.companyCode;
            this._sOrgTypeCode = oArgs.orgTypeCode;
            this._sOrgCode = oArgs.orgCode;
            this._sPartProjectTypeCode = oArgs.partProjectTypeCode;
            this._sActivityCode = oArgs.activityCode;
            // this._sCategoryGroupCode = oArgs.categoryGroupCode;
            this._slayout = oArgs.layout;
            
            this._fnInitControlModel();

            //Flexible 넓은 화면 레이아웃 일 때 Main List 화면 테이블의 컬럼을 줄이기 위한 설정
            if(this._slayout === "TwoColumnsMidExpanded" ){
                this.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("local_update_dtm").setVisible(false);
                this.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("update_user_id").setVisible(false);
            }

			if(this._sActivityCode == "new"){
				//It comes Add button pressed from the before page.
                this.getModel("contModel").setProperty("/createMode", true);
                

				var oMasterModel = this.getModel("master");
				oMasterModel.setData({
                    "tenant_id": this._sTenantId,
                    "company_code": "",                    
                    "org_type_code": "",
                    "org_code": "",
                    "part_project_type_code": "",
                    "activity_code": "",
                    "category_group_code": "",
                    "attachment_mandatory_flag": true,
                    "approve_mandatory_flag": true,
                    "active_flag": true			
                }, "/pdPartactivityTemplateView");
                
				// var oLanguagesModel = this.getModel("languages");
				// oLanguagesModel.setTransactionModel(this.getModel());
				// oLanguagesModel.setData([], "/PdPartBaseActivityLng");
				// oLanguagesModel.addRecord({
				// 	"tenant_id": this._sTenantId,
				// 	"activity_code": this._sActivityCode,
				// 	"language_code": "",
				// 	"code_name": ""			
                // }, "/PdPartBaseActivityLng");
                
				this._toEditMode();
			}else{
				this.getModel("contModel").setProperty("/createMode", false);

                // this._bindView("/pdPartactivityTemplateView(tenant_id='" + this._sTenantId + "',company_code='" + this._sCompanyCode
                // + "',org_type_code='" + this._sOrgTypeCode + "',org_code='" + this._sOrgCode + "',part_project_type_code='" + this._sPartProjectTypeCode 
                // + "',activity_code='" + this._sActivityCode + "',category_group_code='" + this._sCategoryGroupCode + "')");
                this._bindView("/pdPartactivityTemplateView(tenant_id='" + this._sTenantId + "',company_code='" + this._sCompanyCode
                + "',org_type_code='" + this._sOrgTypeCode + "',org_code='" + this._sOrgCode + "',part_project_type_code='" + this._sPartProjectTypeCode 
                + "',activity_code='" + this._sActivityCode + "')");
                
				// oView.setBusy(true);
				// var oLanguagesModel = this.getModel("languages");
				// oLanguagesModel.setTransactionModel(this.getModel());
				// oLanguagesModel.read("/PdPartBaseActivityLng", {
				// 	filters: [
				// 		new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
				// 		new Filter("activity_code", FilterOperator.EQ, this._sActivityCode),
				// 	],
				// 	success: function(oData){
				// 		oView.setBusy(false);
				// 	}
                // });
                
				this._toShowMode();
            }
            this.validator.clearValueState(this.byId("page"));
			oTransactionManager.setServiceModel(this.getModel());
        },
        
        _fnInitControlModel : function(){
            var oData = {
                readMode : null,
                createMode : null,
                editMode : null
            }

            var oContModel = this.getModel("contModel");
            oContModel.setProperty("/midObject", oData);            
            oContModel.setProperty("/midObject/visibleFullScreenBtn", true);
        },

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView : function (sObjectPath) {
			var oView = this.getView(),
				oMasterModel = this.getModel("master");
			oView.setBusy(true);
			oMasterModel.setTransactionModel(this.getModel());
			oMasterModel.read(sObjectPath, {
				success: function(oData){
					oView.setBusy(false);
				}
			});
		},

		_toEditMode: function(){
           
			// this.byId("page").setSelectedSection("pageSectionMain");			
			this.byId("pageEditButton").setEnabled(false);			
            this.byId("pageSaveButton").setEnabled(true);
            this.byId("pageCancelButton").setEnabled(true);
            this.byId("pageDeleteButton").setEnabled(true);
			// this.byId("lngTableAddButton").setEnabled(true);
            // this.byId("lngTableDeleteButton").setEnabled(true);                      
            
            this.getView().getModel("contModel").setProperty("/editMode", true);
            this.getView().getModel("contModel").setProperty("/readMode", false);
		},

		_toShowMode: function(){		
			
			// this.byId("page").setSelectedSection("pageSectionMain");			
			this.byId("pageEditButton").setEnabled(true);			
            this.byId("pageSaveButton").setEnabled(false);
            this.byId("pageCancelButton").setEnabled(false);
            this.byId("pageDeleteButton").setEnabled(false);
			// this.byId("lngTableAddButton").setEnabled(false);
            // this.byId("lngTableDeleteButton").setEnabled(false);           

            this.getView().getModel("contModel").setProperty("/editMode", false);
            this.getView().getModel("contModel").setProperty("/readMode", true);
            
		}

	});
});