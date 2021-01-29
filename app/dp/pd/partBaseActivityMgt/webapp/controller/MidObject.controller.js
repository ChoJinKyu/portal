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
    "sap/f/LayoutType"
], function (BaseController, Multilingual, Validator, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter, 
	Filter, FilterOperator, Fragment, MessageBox, MessageToast, 
	ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, ObjectStatus, LayoutType) {
		
	"use strict";

	var oTransactionManager;

	return BaseController.extend("dp.pd.partBaseActivityMgt.controller.MidObject", {

        dateFormatter: DateFormatter,
        
        validator: new Validator(),
        
        tenant_id: new String,
        loginUserId: new String,
        loginUserName: new String,

		formatter: (function(){
			return {
				toYesNo: function(oData){
					return oData === true ? "YES" : "NO"
				},
			}
		})(),

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
		onInit : function () {

            //로그인 세션 작업완료시 수정
            this.tenant_id = "L2100";
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
            this.setModel(new ManagedListModel(), "languages");
            this.setModel(new ManagedListModel(), "category");

			oTransactionManager = new TransactionManager();
			oTransactionManager.addDataModel(this.getModel("master"));
            oTransactionManager.addDataModel(this.getModel("languages"));
            oTransactionManager.addDataModel(this.getModel("category"));

			this.getModel("master").attachPropertyChange(this._onMasterDataChanged.bind(this));

            // this._initTableTemplates();
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
        onPageDeleteButtonPress: function(){
			var oView = this.getView(),
				oMasterModel = this.getModel("master"),
				that = this;
			MessageBox.confirm("Are you sure to delete?", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						oMasterModel.removeData();
						oMasterModel.setTransactionModel(that.getModel());
						oMasterModel.submitChanges({
							success: function(ok){
								oView.setBusy(false);
                                that.onPageNavBackButtonPress.call(that);
                                that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
								MessageToast.show("Success to delete.");
							}
						});
					};
				}
			});
		},

		onLngTableAddButtonPress: function(){
			var oTable = this.byId("lngTable"),
				oLanguagesModel = this.getModel("languages");
			oLanguagesModel.addRecord({
				"tenant_id": this._sTenantId,
				"activity_code": this._sActivityCode,
				"language_code": "",
				"code_name": ""			
			}, "/PdPartBaseActivityLng");
		},

		onLngTableDeleteButtonPress: function(){
			var oTable = this.byId("lngTable"),
				oModel = this.getModel("languages"),
				aItems = oTable.getSelectedItems(),
				aIndices = [];
			aItems.forEach(function(oItem){
				aIndices.push(oModel.getProperty("/PdPartBaseActivityLng").indexOf(oItem.getBindingContext("languages").getObject()));
			});
			aIndices = aIndices.sort(function(a, b){return b-a;});
			aIndices.forEach(function(nIndex){
				//oModel.removeRecord(nIndex);
				oModel.markRemoved(nIndex);
			});
			oTable.removeSelections(true);
		},
		
		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function(){
            // var oView = this.getView(),
            //     oMasterModel = this.getModel("master"),
            //     oDetailsModel = this.getModel("details"),
            //     that = this;

            // if (this._sTenantId !== "new"){
            //     if(!oMasterModel.isChanged() && !oDetailsModel.isChanged()) {
            //         MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
            //         return;
            //     }
            // }
                
            // if(this.validator.validate(this.byId("midObjectForm1Edit")) !== true) return;
            // if(this.validator.validate(this.byId("midTable")) !== true) return;

			// MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
			// 	title : this.getModel("I18N").getText("/SAVE"),
			// 	initialFocus : sap.m.MessageBox.Action.CANCEL,
			// 	onClose : function(sButton) {
			// 		if (sButton === MessageBox.Action.OK) {
			// 			oView.setBusy(true);
			// 			oTransactionManager.submit({						
			// 				success: function(ok){
			// 					that._toShowMode();
            //                     oView.setBusy(false);
            //                     that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
			// 					MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
			// 				}
			// 			});
			// 		};
			// 	}
            // });
            // this.validator.clearValueState(this.byId("midObjectForm1Edit"));
            // this.validator.clearValueState(this.byId("midTable"));
           
            var oView = this.getView();
            var oMasterModel = this.getModel("master");
            var oLanguagesModel = this.getModel("languages");
            // var oCategoryModel = this.getModel("category");
            var v_this = this;
                
            var oMasterData = oMasterModel.oData;
            var oLngData = oLanguagesModel.oData;
            // var oCateData = oCategoryModel.oData;
           
            var CUType = "C";            
                var inputData = {
                    inputdata : {}
                };
            if (this._sActivityCode !== "new"){
                CUType = "U";              
                
            }
            // if(oLngData.vi_amount==null){
            //     oLngData.vi_amount = "0";
            // }
            // if(oLngData.monthly_mtlmob_quantity==null){
            //     oLngData.monthly_mtlmob_quantity = "0";
            // }
            // if(oLngData.monthly_purchasing_amount==null){
            //     oLngData.monthly_purchasing_amount = "0";
            // }
            // if(oLngData.annual_purchasing_amount==null){
            //     oLngData.annual_purchasing_amount = "0";
            // }

            inputData.inputdata = {
                tenant_id                            : oMasterData.tenant_id,
                activity_code                        : oMasterData.activity_code,
                description                          : oMasterData.description,
                active_flag                          : oMasterData.active_flag,
                update_user_id                       : this.loginUserId,
                crud_type_code                       : CUType,

                supplier_code                        : oLngData.supplier_code              ,
                idea_create_user_id                  : this.loginUserId                 ,
                bizunit_code                         : oLngData.bizunit_code               ,
                idea_product_group_code              : oLngData.idea_product_group_code    ,
                idea_type_code                       : oLngData.idea_type_code             ,

                idea_period_code                     : oLngData.idea_period_code           ,
                idea_manager_empno                   : oLngData.idea_manager_empno         ,
                idea_part_desc                       : oLngData.idea_part_desc             ,
                current_proposal_contents            : oLngData.current_proposal_contents  ,
                change_proposal_contents             : oLngData.change_proposal_contents   ,
                
                idea_contents                        : oLngData.idea_contents              ,
                attch_group_number                   : oLngData.attch_group_number         ,
                create_user_id                       : this.loginUserId                 ,
                update_user_id                       : this.loginUserId                 ,
                material_code                        : oLngData.material_code         ,
                
                purchasing_uom_code                  : oLngData.purchasing_uom_code         ,
                currency_code                        : oLngData.currency_code         ,
                vi_amount                            : oLngData.vi_amount         ,
                monthly_mtlmob_quantity              : oLngData.monthly_mtlmob_quantity         ,
                monthly_purchasing_amount            : oLngData.monthly_purchasing_amount         ,
                
                annual_purchasing_amount             : oLngData.annual_purchasing_amount         ,
                perform_contents                     : oLngData.perform_contents         ,
                crd_type_code                        : CUType
            }

            if(this.validator.validate(this.byId("midObjectForm")) !== true) return;

            var url = "srv-api/odata/v4/dp.SupplierIdeaMgtV4Service/SaveIdeaProc";
            
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
                            data: JSON.stringify(inputData),
                            contentType: "application/json",
                            success: function (rst) {
                                console.log(rst);
                                if(rst.return_code =="S"){
                                    sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                    if( flag == "D"){
                                        v_this.onSearch(rst.return_msg );
                                    }else if( flag == "R"){
                                        v_this.onPageNavBackButtonPress();
                                    }
                                }else{
                                    console.log(rst);
                                    sap.m.MessageToast.show( "error : "+rst.return_msg );
                                }
                            },
                            error: function (rst) {
                                    console.log("eeeeee");
                                    console.log(rst);
                                    sap.m.MessageToast.show( "error : "+rst.return_msg );
                                    v_this.onSearch(rst.return_msg );
                            }
                        });
					};
				}
            });
            this.validator.clearValueState(this.byId("midObjectForm"));
		},
		
		
		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelEditButtonPress: function(){
			// if(this.getModel("midObjectView").getProperty("/createMode") == true){
			// 	this.onPageNavBackButtonPress.call(this);
			// }else{
			// 	this._toShowMode();
            // }
            var oView = this.getView();            

            if (this._sActivityCode === "new"){
                this.handleClose();
            }else if (this._sActivityCode !== "new"){
                
                this.getModel("contModel").setProperty("/createMode", false);                
                this._bindView("/PdPartBaseActivity(tenant_id='" + this._sTenantId + "',activity_code='" + this._sActivityCode + "')");
                oView.setBusy(true);
                
                var oLanguagesModel = this.getModel("languages");
                var oCategoryModel = this.getModel("category");

                oLanguagesModel.setTransactionModel(this.getModel());	
                oCategoryModel.setTransactionModel(this.getModel());

                oLanguagesModel.read("/PdPartBaseActivityLng", {
					filters: [
						new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
						new Filter("activity_code", FilterOperator.EQ, this._sActivityCode),
					],
					success: function(oData){
						oView.setBusy(false);
					}
                });
                
                oCategoryModel.read("/PdPartBaseActivityCategory", {
					filters: [
						new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
						new Filter("activity_code", FilterOperator.EQ, this._sActivityCode),
					],
					success: function(oData){
						oView.setBusy(false);
					}
                });
                
                this._toShowMode();
            }
            this.validator.clearValueState(this.byId("pageSubSection1"));
            this.validator.clearValueState(this.byId("lngTable"));
        },

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		_onMasterDataChanged: function(oEvent){
			if(this.getModel("contModel").getProperty("/createMode") == true){
				var oMasterModel = this.getModel("master");
                var oLanguagesModel = this.getModel("languages");
                var oCategoryModel = this.getModel("category");

				var sTenantId = oMasterModel.getProperty("/tenant_id");
                var olanguagesData = oLanguagesModel.getData();
				olanguagesData.PdPartBaseActivityLng.forEach(function(oItem, nIndex){
					oLanguagesModel.setProperty("/PdPartBaseActivityLng/"+nIndex+"/tenant_id", sTenantId);
					oLanguagesModel.setProperty("/PdPartBaseActivityLng/"+nIndex+"/activity_code", sActivityCode);
                });

                var sActivityCode = oMasterModel.getProperty("/activity_code");
                var oCategoryData = oCategoryModel.getData();
                oCategoryData.PdPartBaseActivityCategory.forEach(function(oItem, nIndex){
					oCategoryModel.setProperty("/PdPartBaseActivityCategory/"+nIndex+"/tenant_id", sTenantId);
					oCategoryModel.setProperty("/PdPartBaseActivityCategory/"+nIndex+"/activity_code", sActivityCode);
				});
				//oLanguagesModel.setData(olanguagesData);
			}
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
            this._sActivityCode = oArgs.activityCode;
            
            this._fnInitControlModel();

			if(this._sActivityCode == "new"){
				//It comes Add button pressed from the before page.
				this.getModel("contModel").setProperty("/createMode", true);

				var oMasterModel = this.getModel("master");
				oMasterModel.setData({
                    "tenant_id": this._sTenantId,
                    "activity_code": "",                    
                    "description": "",
                    "active_flag": true					
                }, "/PdPartBaseActivity");
                
				var oLanguagesModel = this.getModel("languages");
				oLanguagesModel.setTransactionModel(this.getModel());
				oLanguagesModel.setData([], "/PdPartBaseActivityLng");
				oLanguagesModel.addRecord({
					"tenant_id": this._sTenantId,
					"activity_code": this._sActivityCode,
					"language_code": "",
					"code_name": ""			
                }, "/PdPartBaseActivityLng");
                
                var oCategoryModel = this.getModel("category");
				oCategoryModel.setTransactionModel(this.getModel());
				oCategoryModel.setData([], "/PdPartBaseActivityCategory");
				oCategoryModel.addRecord({
					"tenant_id": this._sTenantId,
					"activity_code": this._sActivityCode,
					"category_group_code": "",
					"category_code": ""			
                }, "/PdPartBaseActivityCategory");
                
				this._toEditMode();
			}else{
				this.getModel("contModel").setProperty("/createMode", false);

				this._bindView("/PdPartBaseActivity(tenant_id='" + this._sTenantId + "',activity_code='" + this._sActivityCode + "')");
				oView.setBusy(true);
				var oLanguagesModel = this.getModel("languages");
				oLanguagesModel.setTransactionModel(this.getModel());
				oLanguagesModel.read("/PdPartBaseActivityLng", {
					filters: [
						new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
						new Filter("activity_code", FilterOperator.EQ, this._sActivityCode),
					],
					success: function(oData){
						oView.setBusy(false);
					}
                });
                
                var oCategoryModel = this.getModel("category");
				oCategoryModel.setTransactionModel(this.getModel());
				oCategoryModel.read("/PdPartBaseActivityCategory", {
					filters: [
						new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
						new Filter("activity_code", FilterOperator.EQ, this._sActivityCode),
					],
					success: function(oData){
						oView.setBusy(false);
					}
                });
                
				this._toShowMode();
			}
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
			this.byId("lngTableAddButton").setEnabled(true);
            this.byId("lngTableDeleteButton").setEnabled(true);
                      
            
            this.getView().getModel("contModel").setProperty("/editMode", true);
            this.getView().getModel("contModel").setProperty("/readMode", false);
		},

		_toShowMode: function(){		
			
			// this.byId("page").setSelectedSection("pageSectionMain");			
			this.byId("pageEditButton").setEnabled(true);			
            this.byId("pageSaveButton").setEnabled(false);
            this.byId("pageCancelButton").setEnabled(false);
            this.byId("pageDeleteButton").setEnabled(false);
			this.byId("lngTableAddButton").setEnabled(false);
            this.byId("lngTableDeleteButton").setEnabled(false);           

            this.getView().getModel("contModel").setProperty("/editMode", false);
            this.getView().getModel("contModel").setProperty("/readMode", true);
            
		}

	});
});