sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
	"ext/lib/util/Validator",
    "sap/ui/model/json/JSONModel",
    "ext/lib/core/service/ODataXhrService",
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
    "sap/m/ObjectStatus"
], function (BaseController, Multilingual, Validator, JSONModel, ODataXhrService, TransactionManager, ManagedModel, ManagedListModel, DateFormatter, 
	Filter, FilterOperator, Fragment, MessageBox, MessageToast, 
	ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, ObjectStatus) {
    
    "use strict";

    var oTransactionManager;
    
	return BaseController.extend("pg.md.mdCategory.controller.mdCategoryDetail", {  
        dateFormatter: DateFormatter,
        
        validator: new Validator(),

		formatter: (function(){
			return {
				toYesNo: function(oData){
					return oData === true ? "YES" : "NO"
				},
			}
        })(),
        
        onInit: function () {
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            
            var oViewModel = new JSONModel({
					busy : true,
					delay : 0
                });
                
            this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);
            this.setModel(oViewModel, "midObjectView");
        
			this.setModel(new ManagedModel(), "master");
            this.setModel(new ManagedListModel(), "details");
            
			oTransactionManager = new TransactionManager();
			oTransactionManager.addDataModel(this.getModel("master")); 
            oTransactionManager.addDataModel(this.getModel("details"));
            
			this.getModel("master").attachPropertyChange(this._onMasterDataChanged.bind(this));

			this._initTableTemplates();
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
		onPageEnterFullScreenButtonPress: function () {
			var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getRouter().navTo("midPage", {
                layout: sNextLayout, 
                company_code: this._sCompany_code,
                org_type_code: this._sOrg_type_code,
                org_code: this._sOrg_code,
                spmd_category_code: this._sSpmd_category_code,
				spmd_category_sort_sequence: this._sSpmd_category_sort_sequence
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
                company_code: this._sCompany_code,
                org_type_code: this._sOrg_type_code,
                org_code: this._sOrg_code,
                spmd_category_code: this._sSpmd_category_code,
				spmd_category_sort_sequence: this._sSpmd_category_sort_sequence
			});
        },
        
		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
		onPageNavBackButtonPress: function () {
			var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.getRouter().navTo("mainPage", {layout: sNextLayout});
		},

		/**
		 * Event handler for page edit button press
		 * @public
		 */
		onPageEditButtonPress: function(){
			this._toEditMode();
		},

		onMidTableAddButtonPress: function(){
			var oTable = this.byId("midTable"),
				oDetailsModel = this.getModel("details");
			oDetailsModel.addRecord({
				"tenant_id": "L2100",
				"company_code": this._sCompany_code,
				"org_type_code": this._sOrg_type_code,
				"org_code": this._sOrg_code,
				"spmd_category_code": this._sSpmd_category_code,
				"language_code": "",
				"spmd_category_code_name": ""
			}, "/MdCategoryLng");
		},

		onMidTableDeleteButtonPress: function(){
			var oTable = this.byId("midTable"),
				oModel = this.getModel("details"),
				aItems = oTable.getSelectedItems(),
				aIndices = [];
			aItems.forEach(function(oItem){
				aIndices.push(oModel.getProperty("/MdCategoryLng").indexOf(oItem.getBindingContext("details").getObject()));
			});
			aIndices = aIndices.sort(function(a, b){return b-a;});
			aIndices.forEach(function(nIndex){
				//oModel.removeRecord(nIndex);
				oModel.markRemoved(nIndex);
			});
			oTable.removeSelections(true);
		},
        
        onMidTableFilterPress: function() {
            this._MidTableApplyFilter();
        },

		
        /**
         * Event handler for delete page entity
         * @public
         */
        onPageDeleteButtonPress: function () {
            var oView = this.getView(),
                oMasterModel = this.getModel("master"),
                that = this;
            MessageBox.confirm(this.getModel("I18N").getText("/NCM00003"), {
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                if (sButton === MessageBox.Action.OK) {
                    oView.setBusy(true);
                    oMasterModel.removeData();
                    oMasterModel.setTransactionModel(that.getModel());
                    oMasterModel.submitChanges({
                    success: function (ok) {
                        oView.setBusy(false);
                        that.onPageNavBackButtonPress();
                        that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                        MessageToast.show(that.getModel("I18N").getText("/NCM01002"));
                    }
                    });
                };
                }
            });
        },
        
		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function(){
            var oView = this.getView(),
                oMasterModel = this.getModel("master"),
                oDetailsModel = this.getModel("details"),
                lngArr = oDetailsModel.getProperty("/MdCategoryLng"),
                lngLength = lngArr.length,
                that = this;

            if (this._sSpmd_category_code !== "new"){
                if ( !oMasterModel.isChanged() && !oDetailsModel.isChanged() ) {
                    MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
                    return;                
                }
            }

            if(this.validator.validate(this.byId("midObjectForm1Edit")) !== true) return;
            if(this.validator.validate(this.byId("midTable")) !== true) return;

			MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
				title : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        
                        if(that._sSpmd_category_code !== "new"){
                            oTransactionManager.submit({						
                                success: function(ok){
                                    that._toShowMode();
                                    oView.setBusy(false);
                                    that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                    MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
                                }
                            });

                        }else{//신규생성 채번-저장
                            $.ajax({
                            //new ODataXhrService.ajax({ 
                                url: "pg/md/mdCategory/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdNewCategoryCode(tenant_id='L2100',company_code='*',org_type_code='BU',org_code='"+this._sOrg_code+"')/Set", 
                                type: "GET", 
                                contentType: "application/json", 
                                success: function(data){ 
                                    var categoryCode = data.value[0].spmd_category_code;
                                    that.getModel("master").setProperty("/spmd_category_code", categoryCode); 
                                    //Lng 갯수만큼 categoryCode 매핑
                                    if(lngLength>0){
                                        for(var idx=0; idx<lngLength; idx++){
                                            lngArr[idx].spmd_category_code = categoryCode;
                                        }
                                    }
                                    // that.getModel("details").setProperty("/spmd_category_code", categoryCode); 
                                    
                                    oTransactionManager.submit({  
                                        success: function(ok){ 
                                            that._toShowMode(); 
                                            oView.setBusy(false); 
                                            that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress(); 
                                            MessageToast.show(that.getModel("I18N").getText("/NCM01001")); 
                                        },
                                        error: function(e){
                                            console.log(e);
                                        }
                                    }); 
                                } 
                            }) 

                        }
					};
				}
            });
            this.validator.clearValueState(this.byId("midObjectForm1Edit"));
            this.validator.clearValueState(this.byId("midTable"));
		},
		
		
		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelEditButtonPress: function(){
                             
            var oView = this.getView();
            var sSpmd_category_code = this._sSpmd_category_code;
            if (sSpmd_category_code === "new"){
                this.onPageNavBackButtonPress();
            }else if (sSpmd_category_code !== "new"){   

                var sObjectPath = "/MdCategory(tenant_id='"      + "L2100" 
                                        + "',company_code='"      + this._sCompany_code  
                                        + "',org_type_code='"      + this._sOrg_type_code 
                                        + "',org_code='"           + this._sOrg_code 
                                        + "',spmd_category_code='" + this._sSpmd_category_code
                                        + "')";
                var oMasterModel = this.getModel("master");
                oView.setBusy(true);
                oMasterModel.setTransactionModel(this.getModel());
                oMasterModel.read(sObjectPath, {
                    success: function(oData){
                        oView.setBusy(false);
                    }
                });

                oView.setBusy(true);
                var oDetailsModel = this.getModel("details");
                oDetailsModel.setTransactionModel(this.getModel());

                oDetailsModel.read("/MdCategoryLng", {
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
                        new Filter("company_code", FilterOperator.EQ, this._sCompany_code),
                        new Filter("org_type_code", FilterOperator.EQ, this._sOrg_type_code),
                        new Filter("org_code", FilterOperator.EQ, this._sOrg_code),
                        new Filter("spmd_category_code", FilterOperator.EQ, this._sSpmd_category_code)                        
                    ],
                    success: function(oData){
                        oView.setBusy(false);
                    }
                });
                this._toShowMode();                
            }
            this.validator.clearValueState(this.byId("midObjectForm1Edit"));
            this.validator.clearValueState(this.byId("midTable"));
        },


		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onRoutedThisPage: function(oEvent){
			var oArgs = oEvent.getParameter("arguments"),
				oView = this.getView();
            this._sCompany_code = oArgs.company_code;
            this._sOrg_type_code = oArgs.org_type_code;
            this._sOrg_code = oArgs.org_code;
            this._sSpmd_category_code = oArgs.spmd_category_code;
            // this._sSpmd_category_code_name = oArgs.spmd_category_code_name;
            // this._sRgb_font_color_code = oArgs.rgb_font_color_code;
            // this._sRgb_cell_clolor_code = oArgs.rgb_cell_clolor_code;
            this._sSpmd_category_sort_sequence = oArgs.spmd_category_sort_sequence;
            
			// this.getModel("midObjectView").setProperty("/isAddedMode", false);
            if(oArgs.spmd_category_code == "new" ){
				var oMasterModel = this.getModel("master");
				oMasterModel.setData({
                    "tenant_id": "L2100",
                    "company_code": this._sCompany_code,
                    "org_type_code": this._sOrg_type_code,
                    "org_code": this._sOrg_code,
                    "spmd_category_code": "",
                    "spmd_category_code_name": "",
                    "rgb_font_color_code": "",
                    "rgb_cell_clolor_code": "",
                    "spmd_category_sort_sequence": this._sSpmd_category_sort_sequence
                }, "/MdCategory");
                
				var oDetailsModel = this.getModel("details");
				oDetailsModel.setTransactionModel(this.getModel());
				oDetailsModel.setData([], "/MdCategoryLng");
				oDetailsModel.addRecord({
                    "tenant_id": "L2100",
                    "company_code": this._sCompany_code,
                    "org_type_code": this._sOrg_type_code,
                    "org_code": this._sOrg_code,
                    "spmd_category_code": "",
					"language_code": "",
					"spmd_category_code_name": "",
				}, "/MdCategoryLng");
                this._toEditMode();
                
			}else{   
                var sObjectPath = "/MdCategory(tenant_id='"      + "L2100"  
                                        + "',company_code='"      + this._sCompany_code  
                                        + "',org_type_code='"      + this._sOrg_type_code 
                                        + "',org_code='"           + this._sOrg_code 
                                        + "',spmd_category_code='" + this._sSpmd_category_code 
                                        // + "',spmd_category_code_name='" + this._sSpmd_category_code_name 
                                        // + "',rgb_font_color_code='" + this._sRgb_font_clolor_code  
                                        // + "',rgb_cell_clolor_code='" + this._sRgb_cell_clolor_code  
                                        // + "',spmd_category_sort_sequence='" + this._sSpmd_category_sort_sequence  
                                        + "')";
                var oMasterModel = this.getModel("master");
                oView.setBusy(true);
                oMasterModel.setTransactionModel(this.getModel());
                oMasterModel.read(sObjectPath, {
                    success: function(oData){
                        oView.setBusy(false);
                    }
                });

                oView.setBusy(true);
                var oDetailsModel = this.getModel("details");
                oDetailsModel.setTransactionModel(this.getModel());

                oDetailsModel.read("/MdCategoryLng", {
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
                        new Filter("company_code", FilterOperator.EQ, this._sCompany_code),
                        new Filter("org_type_code", FilterOperator.EQ, this._sOrg_type_code),
                        new Filter("org_code", FilterOperator.EQ, this._sOrg_code),
                        new Filter("spmd_category_code", FilterOperator.EQ, this._sSpmd_category_code)
                        // new Filter("language_code", FilterOperator.EQ, 'EN')
                    ],
                    success: function(oData){
                        oView.setBusy(false);
                    }
                });
                this._toShowMode();
            }
            this.validator.clearValueState(this.byId("midObjectForm1Edit"));
            this.validator.clearValueState(this.byId("midTable"));
			oTransactionManager.setServiceModel(this.getModel());
			// oTransactionManager.setServiceModel(this.getModel("detail"));
		},


		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		_onMasterDataChanged: function(oEvent){
            var oMasterModel = this.getModel("master");
            var oDetailsModel = this.getModel("details");

            var company_code = oMasterModel.getProperty("/company_code");
            var org_type_code = oMasterModel.getProperty("/org_type_code");
            var org_code = oMasterModel.getProperty("/org_code");
            var spmd_category_code = oMasterModel.getProperty("/spmd_category_code");
            var tenant_id = "L2100";
            
            var oDetailsData = oDetailsModel.getData();
            oDetailsData.MdCategoryLng.forEach(function(oItem, nIndex){
                oDetailsModel.setProperty("/MdCategoryLng/"+nIndex+"/company_code", company_code);
                oDetailsModel.setProperty("/MdCategoryLng/"+nIndex+"/org_type_code", org_type_code);
                oDetailsModel.setProperty("/MdCategoryLng/"+nIndex+"/org_code", org_code);
                oDetailsModel.setProperty("/MdCategoryLng/"+nIndex+"/spmd_category_code", spmd_category_code);
                oDetailsModel.setProperty("/MdCategoryLng/"+nIndex+"/tenant_id", tenant_id);
            });
			
		},

		_toEditMode: function(){
			var FALSE = false;
            this._showFormFragment('detailEditMode');
			this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("page").setProperty("showFooter", !FALSE);
            
            this.byId("pageCancelButton").setEnabled(!FALSE);
            this.byId("pageEditButton").setEnabled(FALSE);
            if (this._sSpmd_category_code == "new"){
                this.byId("pageDeleteButton").setEnabled(FALSE);
            }else{
                this.byId("pageDeleteButton").setEnabled(!FALSE);
            }
            this.byId("pageSaveButton").setEnabled(!FALSE);
			this.byId("pageNavBackButton").setEnabled(FALSE);

			this.byId("midTableAddButton").setEnabled(!FALSE);
			this.byId("midTableDeleteButton").setEnabled(!FALSE);
            this.byId("midTableSearchField").setEnabled(FALSE);
            
			this.byId("midTable").setMode(sap.m.ListMode.SingleSelectLeft);
			this._bindMidTable(this.oEditableTemplate, "Edit");
		},

		_toShowMode: function(){
			var TRUE = true;
            this._showFormFragment('detailShowMode');
			this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("page").setProperty("showFooter", TRUE);
            
            this.byId("pageCancelButton").setEnabled(!TRUE);
            this.byId("pageEditButton").setEnabled(TRUE);
            this.byId("pageDeleteButton").setEnabled(!TRUE);
            this.byId("pageSaveButton").setEnabled(!TRUE);
			this.byId("pageNavBackButton").setEnabled(TRUE);

			this.byId("midTableAddButton").setEnabled(!TRUE);
			this.byId("midTableDeleteButton").setEnabled(!TRUE);
            this.byId("midTableSearchField").setEnabled(TRUE);
            
			this.byId("midTable").setMode(sap.m.ListMode.None);
			this._bindMidTable(this.oReadOnlyTemplate, "Navigation");
        },
        
		_initTableTemplates: function(){
			this.oReadOnlyTemplate = new ColumnListItem({
				cells: [
					new Text({
						text: "{details>_row_state_}"
					}), 
					new ObjectIdentifier({
						text: "{details>language_code}"
					}), 
					new ObjectIdentifier({
						text: "{details>spmd_category_code_name}"
					})
				],
				type: sap.m.ListType.Inactive
            });
            

            //language_code : comboBox
            var oLanguageCode = new ComboBox({
                    selectedKey: "{details>language_code}",
                    required : true
                });
                oLanguageCode.bindItems({
                    path: 'util>/Code',
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
                        // new Filter("company_code", FilterOperator.EQ, 'G100'),
                        new Filter("group_code", FilterOperator.EQ, 'CM_LANG_CODE')
                    ],
                    template: new Item({
                        key: "{util>code}",
                        text: "{util>code_name}"
                    })
                }); 


			this.oEditableTemplate = new ColumnListItem({
				cells: [
					new ObjectStatus({
                        icon:{ path:'details>_row_state_', formatter: this.formattericon
                                }                              
                    }),
                    oLanguageCode,
					new Input({
						value: {
							path: "details>spmd_category_code_name",
                            type: 'sap.ui.model.type.String',
                            constraints: {
                                maxLength: 50
                            }
						},
						required: true
					})
				]
            });
		},

		_bindMidTable: function(oTemplate, sKeyboardMode){
			this.byId("midTable").bindItems({
				path: "details>/MdCategoryLng",
				template: oTemplate
			}).setKeyboardMode(sKeyboardMode);
		},

		_oFragments: {},
		_showFormFragment : function (sFragmentName) {
            var oPageSubSection = this.byId("pageSubSection1");
            this._loadFragment(sFragmentName, function(oFragment){
				oPageSubSection.removeAllBlocks();
				oPageSubSection.addBlock(oFragment);
			})
        },
        _loadFragment: function (sFragmentName, oHandler) {
			if(!this._oFragments[sFragmentName]){
				Fragment.load({
					id: this.getView().getId(),
					name: "pg.md.mdCategory.view." + sFragmentName,
					controller: this 
				}).then(function(oFragment){
					this._oFragments[sFragmentName] = oFragment;
					if(oHandler) oHandler(oFragment);
				}.bind(this));
			}else{
				if(oHandler) oHandler(this._oFragments[sFragmentName]);
			}
        },
        

        _MidTableApplyFilter: function() {

            var oView = this.getView(),
				sValue = oView.byId("midTableSearchField").getValue(),
				oFilter = new Filter("spmd_category_code_name", FilterOperator.Contains, sValue);

			oView.byId("midTable").getBinding("items").filter(oFilter, sap.ui.model.FilterType.Application);

        }
	});
});