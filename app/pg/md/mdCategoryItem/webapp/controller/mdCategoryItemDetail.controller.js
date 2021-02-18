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
    
	return BaseController.extend("pg.md.mdCategoryItem.controller.mdCategoryItemDetail", {  
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
            
            
            // this.viewModel = new JSONModel({
            //     MdCategoryItem : []
            // });
            // this.getView().setModel(this.viewModel, "master");
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
				spmd_character_code: this._sSpmd_character_code
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
				spmd_character_code: this._sSpmd_character_code
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
				"spmd_character_code": this._sSpmd_character_code,
				"language_code": "",
				"spmd_character_code_name": "",
				"spmd_character_desc": ""
			}, "/MdCategoryItemLng");
		},

		onMidTableDeleteButtonPress: function(){
			var oTable = this.byId("midTable"),
				oModel = this.getModel("details"),
				aItems = oTable.getSelectedItems(),
				aIndices = [];
			aItems.forEach(function(oItem){
				aIndices.push(oModel.getProperty("/MdCategoryItemLng").indexOf(oItem.getBindingContext("details").getObject()));
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
            MessageBox.confirm(this.getModel("I18N").getText("/NPG10008"), {
                title: this.getModel("I18N").getText("/DELETE"),
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

        _onPageLngCheckData: function () {
            // check master
            var oMasterModel = this.getModel("master");
            var oDetailsModel = this.getModel("details");
            var oDetailsData = oDetailsModel.getData();
            var oDetailsTable = this.byId("midTable");

            var aCheckLng = [];

            for (var i = 0; i < oDetailsTable.getItems().length; i++) {
                
                if ( oDetailsModel.getProperty("/MdCategoryItemLng/"+i)._row_state_ === "C" )
                {                    
                    aCheckLng.push(oDetailsTable.getItems()[i].getCells()[1].getSelectedKey() );
                }             
            }

            for (var i = 0; i < aCheckLng.length; i++) {
                for (var j = 0; j < oDetailsTable.getItems().length; j++) {
                    if ( oDetailsModel.getProperty("/MdCategoryItemLng/"+j)._row_state_ == null )
                    {                    
                        if (aCheckLng[i] === oDetailsTable.getItems()[j].getCells()[1].getSelectedKey())
                        {
			                MessageToast.show(this.getModel("I18N").getText("/NPG10017")); //언어중복
                            return false;
                        }
                    }             
                }
                
            }

            return true;

        },

		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function(){
            var oView = this.getView(),
                oMasterModel = this.getModel("master"),
                oDetailsModel = this.getModel("details"),
                temp = oMasterModel.oData,
                lngArr = oDetailsModel.getProperty("/MdCategoryItemLng"),
                lngLength = lngArr.length,
                that = this;

            if (this._sSpmd_character_code !== "new"){
                if ( !oMasterModel.isChanged() && !oDetailsModel.isChanged() ) {
                    MessageToast.show(this.getModel("I18N").getText("/NPG10010"));
                    return;                
                }
            }

            if(this.validator.validate(this.byId("midObjectForm1Edit")) !== true) return;
            if(this.validator.validate(this.byId("midTable")) !== true) return;
            
            var tempData = oMasterModel.getData();
            if(tempData != null){
                delete tempData.org_infos;
                oMasterModel.setData(tempData,"/MdCategoryItem");
            }
            if (!that._onPageLngCheckData()) {
                return;
            }

			MessageBox.confirm(this.getModel("I18N").getText("/NPG10007"), {
				title : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);

                        
                        if(that._sSpmd_character_code !== "new"){
                            oTransactionManager.submit({						
                                success: function(ok){
                                    that._toShowMode();
                                    oView.setBusy(false);
                                    that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                    MessageToast.show(that.getModel("I18N").getText("/NCM01001"));

                                    that.onPageNavBackButtonPress(); 
                                }
                            });

                        }else{
                            $.ajax({
                            //new ODataXhrService.ajax({ 
                                url: "pg/md/mdCategory/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdNewCategoryItemCode(tenant_id='L2100',company_code='"+that._sCompany_code+"',org_type_code='"+that._sOrg_type_code+"',org_code='"+that._sOrg_code+"')/Set", 
                                type: "GET", 
                                contentType: "application/json", 
                                success: function(data){ 

                                    var characterCode = data.value[0].spmd_character_code;
                                    var serialNo = data.value[0].spmd_character_serial_no;
                                    temp.spmd_character_code = characterCode; 
                                    temp.spmd_character_serial_no = serialNo+""; 
                                    
                                    if(lngLength>0){
                                        for(var idx=0; idx<lngLength; idx++){
                                            lngArr[idx].spmd_character_code = characterCode;
                                        }
                                    }
                                    // that.getModel("details").setProperty("/spmd_category_code", categoryCode); 
                                    oTransactionManager.submit({  
                                        success: function(ok){ 
                                            that._toShowMode(); 
                                            oView.setBusy(false); 
                                            that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress(); 
                                            MessageToast.show(that.getModel("I18N").getText("/NCM01001")); 
                                            
                                            that.onPageNavBackButtonPress(); 
                                        },
                                        error: function(e){
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
            var oView = this.getView(),
                oMasterModel = this.getModel("master"),
                oDetailsModel = this.getModel("details");

            if ( !oMasterModel.isChanged() && !oDetailsModel.isChanged() ) {//변경 건 없을 경우 :바로 이동   
                this.onPageCancelEdit();          
            }else{
                MessageBox.confirm(this.getModel("I18N").getText("/NPG10009"), {
                    title: this.getModel("I18N").getText("/EDIT_CANCEL"),
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: (function (sButton) {
                        if (sButton === MessageBox.Action.OK) {

                            this.onPageCancelEdit(); 
                        }
                    }).bind(this)
                })    
            } 

        },

        onPageCancelEdit: function() {
            var oView = this.getView();
            var sSpmd_character_code = this._sSpmd_character_code;
            if (sSpmd_character_code === "new"){
                this.onPageNavBackButtonPress();
            }else if (sSpmd_character_code !== "new"){   

                var sObjectPath = "/MdCategoryItem(tenant_id='"      + "L2100" 
                                        + "',company_code='"      + this._sCompany_code  
                                        + "',org_type_code='"      + this._sOrg_type_code 
                                        + "',org_code='"           + this._sOrg_code 
                                        + "',spmd_category_code='" + this._sSpmd_category_code
                                        + "',spmd_character_code='" + this._sSpmd_character_code
                                        // + "',spmd_character_sort_seq='" + this._sSpmd_character_sort_seq 
                                        + "')";
                var oMasterModel = this.getModel("master");
                oView.setBusy(true);
                oMasterModel.setTransactionModel(this.getModel());
                oMasterModel.read(sObjectPath, {
                    urlParameters: {
                        "$expand": "org_infos"
                    },
                    success: function(oData){
                        oView.setBusy(false);
                    }
                });	
                
                oView.setBusy(true);
                var oDetailsModel = this.getModel("details");
                oDetailsModel.setTransactionModel(this.getModel());

                oDetailsModel.read("/MdCategoryItemLng", {
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
                        new Filter("company_code", FilterOperator.EQ, this._sCompany_code),
                        new Filter("org_type_code", FilterOperator.EQ, this._sOrg_type_code),
                        new Filter("org_code", FilterOperator.EQ, this._sOrg_code),
                        new Filter("spmd_category_code", FilterOperator.EQ, this._sSpmd_category_code),
                        new Filter("spmd_character_code", FilterOperator.EQ, this._sSpmd_character_code)
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
            this._sSpmd_character_code = oArgs.spmd_character_code;
            this._sSpmd_character_sort_seq = oArgs.spmd_character_sort_seq;
            
			// this.getModel("midObjectView").setProperty("/isAddedMode", false);
            if(oArgs.spmd_character_code == "new" ){
				var oMasterModel = this.getModel("master");
				oMasterModel.setData({
                    "tenant_id": "L2100",
                    "company_code": this._sCompany_code,
                    "org_type_code": this._sOrg_type_code,
                    "org_code": this._sOrg_code,
                    "spmd_category_code": this._sSpmd_category_code ,
                    "spmd_character_code": "",
                    "spmd_character_sort_seq": this._sSpmd_character_sort_seq 
                }, "/MdCategoryItem");
                
				var oDetailsModel = this.getModel("details");
				oDetailsModel.setTransactionModel(this.getModel());
				oDetailsModel.setData([], "/MdCategoryItemLng");
				oDetailsModel.addRecord({
                    "tenant_id": "L2100",
                    "company_code": this._sCompany_code,
                    "org_type_code": this._sOrg_type_code,
                    "org_code": this._sOrg_code,
                    "spmd_category_code": this._sSpmd_category_code ,
                    "spmd_character_code": "",
					"language_code": "",
					"spmd_character_code_name": "",
					"spmd_character_desc": ""
				}, "/MdCategoryItemLng");
                this._toEditMode();
                
			}else{   

                // var oView = this.getView();
                // var that = this;
                // var url = "pg/md/mdCategoryItem/webapp/srv-api/odata/v4/pg.md.MdCategoryV4Service/MdItemListConditionView(language_code='KO')/Set"
                //         +"?$filter=tenant_id eq 'L2100' and "
                //         +"company_code eq '"+ this._sCompany_code +"' and "
                //         +"org_type_code eq '"+ this._sOrg_type_code +"' and "
                //         +"org_code eq '"+ this._sOrg_code +"' and "
                //         +"spmd_category_code eq '"+ this._sSpmd_category_code +"' and "
                //         +"spmd_character_code eq '"+ this._sSpmd_character_code +"' ";   
                // console.log(url);      

                // $.ajax({
                //     url: url,
                //     type: "GET",
                //     contentType: "application/json",
                //     success: function(data){
                //         var v_list = oView.getModel("master").getData();
                //         v_list.MdCategoryItem = data.value[0];
                //         oView.getModel("master").updateBindings(true); 
                //     },
                //     error: function(e){ 
                        
                //     }
                // });

                var sObjectPath = "/MdCategoryItem(tenant_id='"      + "L2100" 
                                        + "',company_code='"      + this._sCompany_code  
                                        + "',org_type_code='"      + this._sOrg_type_code 
                                        + "',org_code='"           + this._sOrg_code 
                                        + "',spmd_category_code='" + this._sSpmd_category_code 
                                        + "',spmd_character_code='" + this._sSpmd_character_code 
                                        // + "',spmd_character_sort_seq='" + this._sSpmd_character_sort_seq  //error
                                        + "')";
                var oMasterModel = this.getModel("master");
                oView.setBusy(true);
                oMasterModel.setTransactionModel(this.getModel());
                oMasterModel.read(sObjectPath, {
                    urlParameters: {
                        "$expand": "org_infos"
                    },
                    success: function(oData){
                        oView.setBusy(false);
                    }
                });

                oView.setBusy(true);
                var oDetailsModel = this.getModel("details");
                oDetailsModel.setTransactionModel(this.getModel());

                oDetailsModel.read("/MdCategoryItemLng", {
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
                        new Filter("company_code", FilterOperator.EQ, this._sCompany_code),
                        new Filter("org_type_code", FilterOperator.EQ, this._sOrg_type_code),
                        new Filter("org_code", FilterOperator.EQ, this._sOrg_code),
                        new Filter("spmd_category_code", FilterOperator.EQ, this._sSpmd_category_code),
                        new Filter("spmd_character_code", FilterOperator.EQ, this._sSpmd_character_code)
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
            
            // setTimeout(this.setPageLayout(), 500);
            //ScrollTop
            var oObjectPageLayout = this.getView().byId("page");   
            var oFirstSection = oObjectPageLayout.getSections()[0]; 
            // var oFirstSection = this.getView().byId("pageSectionMain");
            oObjectPageLayout.scrollToSection(oFirstSection, 0, -500);
		},

        // setPageLayout : function(){ //fragment 없애야함
        //     var oObjectPageLayout = this.getView().byId("page");
        //     var oFirstSection = oObjectPageLayout.getSections()[0];
        //     oObjectPageLayout.scrollToSection(oFirstSection.getId(), 0, -500);          
        // },


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
            var spmd_character_code = oMasterModel.getProperty("/spmd_character_code");
            var tenant_id = "L2100";
            
            var oDetailsData = oDetailsModel.getData();
            oDetailsData.MdCategoryItemLng.forEach(function(oItem, nIndex){
                oDetailsModel.setProperty("/MdCategoryItemLng/"+nIndex+"/company_code", company_code);
                oDetailsModel.setProperty("/MdCategoryItemLng/"+nIndex+"/org_type_code", org_type_code);
                oDetailsModel.setProperty("/MdCategoryItemLng/"+nIndex+"/org_code", org_code);
                oDetailsModel.setProperty("/MdCategoryItemLng/"+nIndex+"/spmd_category_code", spmd_category_code);
                oDetailsModel.setProperty("/MdCategoryItemLng/"+nIndex+"/spmd_character_code", spmd_character_code);
                oDetailsModel.setProperty("/MdCategoryItemLng/"+nIndex+"/tenant_id", tenant_id);
            });
			
		},

		_toEditMode: function(){
			var FALSE = false;
            // this._showFormFragment('detailEditMode');
			// this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("page").setProperty("showFooter", !FALSE);
            this.getView().byId("labelCharCodeName").setRequired(!FALSE);
            this.byId("retrieveCharCodeName").setVisible(FALSE);
            this.byId("editCharCodeName").setVisible(!FALSE);
            this.byId("retrieveCharDesc").setVisible(FALSE);
            this.byId("editCharDesc").setVisible(!FALSE);
            
            this.byId("pageCancelButton").setVisible(!FALSE);
			this.byId("pageEditButton").setVisible(FALSE);
            if (this._sSpmd_character_code == "new"){
                this.byId("pageDeleteButton").setVisible(FALSE);
            }else{
                this.byId("pageDeleteButton").setVisible(!FALSE);
            }
            this.byId("pageSaveButton").setVisible(!FALSE);
			this.byId("pageNavBackButton").setVisible(FALSE);

			this.byId("midTableAddButton").setVisible(!FALSE);
			this.byId("midTableDeleteButton").setVisible(!FALSE);
            
			this.byId("midTable").setMode(sap.m.ListMode.MultiSelect);
			this._bindMidTable(this.oEditableTemplate, "Edit");
		},

		_toShowMode: function(){
			var TRUE = true;
            // this._showFormFragment('detailShowMode');
			// this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("page").setProperty("showFooter", TRUE);
            this.getView().byId("labelCharCodeName").setRequired(!TRUE);
            this.byId("retrieveCharCodeName").setVisible(TRUE);
            this.byId("editCharCodeName").setVisible(!TRUE);
            this.byId("retrieveCharDesc").setVisible(TRUE);
            this.byId("editCharDesc").setVisible(!TRUE);
            
            this.byId("pageCancelButton").setVisible(!TRUE);
            this.byId("pageEditButton").setVisible(TRUE);
            this.byId("pageDeleteButton").setVisible(!TRUE);
            this.byId("pageSaveButton").setVisible(!TRUE);
			this.byId("pageNavBackButton").setVisible(TRUE);

			this.byId("midTableAddButton").setVisible(!TRUE);
			this.byId("midTableDeleteButton").setVisible(!TRUE);
            
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
						text: "{details>spmd_character_code_name}"
					}), 
					new Text({
						text: "{details>spmd_character_desc}"
					})
				],
				type: sap.m.ListType.Inactive
            });
            

            //language_code : comboBox
            var oLanguageCode = new ComboBox({
                    selectedKey: "{details>language_code}",
                    required : true,
                    textAlign: "Center",
                    editable: "{= ${details>_row_state_} === 'C' ? true : false}"
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
                        icon:{ path:'details>_row_state_', formatter: this.formattericon }                              
                    }),
                    oLanguageCode,
					new Input({
						value: {
							path: "details>spmd_character_code_name",
                            type: 'sap.ui.model.type.String',
                            constraints: {
                                maxLength: 50
                            }
						},
                        required: true,
                        maxLength: 50
					}),
					new Input({
						value: {
							path: "details>spmd_character_desc",
                            type: 'sap.ui.model.type.String',
                            constraints: {
                                maxLength: 50
                            }
                        },
                        maxLength: 50
					})
				]
            });
		},

		_bindMidTable: function(oTemplate, sKeyboardMode){
			this.byId("midTable").bindItems({
				path: "details>/MdCategoryItemLng",
				template: oTemplate
			}).setKeyboardMode(sKeyboardMode);
		},

		// _showFormFragment : function (sFragmentName) {
        //     var oPageSubSection = this.byId("pageSubSection1");
        //     this._loadFragment(sFragmentName, function(oFragment){
		// 		oPageSubSection.removeAllBlocks();
		// 		oPageSubSection.addBlock(oFragment);
		// 	})
        // },
        // _loadFragment: function (sFragmentName, oHandler) {
        //     Fragment.load({
        //         id: this.getView().getId(),
        //         name: "pg.md.mdCategoryItem.view." + sFragmentName,
        //         controller: this 
        //     }).then(function(oFragment){
        //         if(oHandler) oHandler(oFragment);
        //     }.bind(this));
        // }
	});
});