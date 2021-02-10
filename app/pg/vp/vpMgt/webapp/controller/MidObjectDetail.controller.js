sap.ui.define([
	"ext/lib/controller/BaseController",
	"sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/TreeListModel",
    "ext/lib/model/TransactionManager",
	"ext/lib/model/ManagedModel",
	"ext/lib/model/ManagedListModel",
	"ext/lib/formatter/DateFormatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/Text",
	"sap/m/Input",
    "sap/m/ComboBox",
    "ext/lib/util/Validator",
    "ext/lib/formatter/Formatter",
    "sap/ui/model/resource/ResourceModel",
    "ext/cm/util/control/ui/EmployeeDialog",
    "ext/cm/util/control/ui/DepartmentDialog",    
    "ext/pg/util/control/ui/SupplierDialogPop",   
    "sap/ui/layout/GridData",
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/ui/table/Column",  
    'sap/m/Label',   
    "ext/pg/util/control/ui/MaterialDialogPop",
], function (
    BaseController, 
    History, 
    JSONModel,
    TreeListModel, 
    TransactionManager, 
    ManagedModel, 
    ManagedListModel, 
    DateFormatter, 
    Filter, 
    FilterOperator, 
    Fragment, 
    MessageBox, 
    MessageToast, 
    Text, 
    Input, 
    ComboBox,
    Validator,
    Formatter,
    ResourceModel,
    EmployeeDialog,
    DepartmentDialog,
    SupplierDialogPop,
    GridData,
    VBox,
    HBox,
    Column,
    Label,
    MaterialDialogPop) {
    "use strict";
    
    var oTransactionManager;
    var that;
    var generaloDataRst = {};
	return BaseController.extend("pg.vp.vpMgt.controller.MidObjectDetail", {

        dateFormatter: DateFormatter,
        formatter: Formatter,



        validator: new Validator(),
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
		onInit : function () {
			// Model used to manipulate controlstates. The chosen values make sure,
			// detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var ReturnoData = {
				data: {
					return_code: "",
                    return_msg: ""
				}
			};
			var oModel = new JSONModel(ReturnoData);
            this.setModel(oModel,"returnModel");

            var i18nModel = new ResourceModel({
            bundleName: "pg.vp.vpMgt.i18n.i18n_en",
            supportedLocales: [""],
            fallbackLocale: ""
            });
            this.getView().setModel(i18nModel, "i18n");

			var oViewModel = new JSONModel({
					busy : true,
					delay : 0
                });
            this.setModel(new ManagedModel(), "geninfo");
            this.setModel(new ManagedListModel(), "suplist");
            this.setModel(new ext.lib.model.ManagedListModel(), "tmatlist");
			this.setModel(new ManagedListModel(), "matlist");
            this.setModel(new ManagedListModel(), "manlist");
            this.setModel(new ManagedListModel(), "psuplist");                

            this.getRouter().getRoute("midPageDetail").attachPatternMatched(this._onRoutedThisPageDtl, this);
			// this.setModel(oViewModel, "midObjectView");
            
            that = this;
            // this.setModel(new ManagedModel(), "VpDetailLngView");
            // this.setModel(new ManagedListModel(), "VpSupplierDtlView");
			// this.setModel(new ManagedListModel(), "vpMaterialDtlView");
            // this.setModel(new ManagedListModel(), "vpManagerDtlView");

            // oTransactionManager = new TransactionManager();
			// oTransactionManager.addDataModel(this.getModel("VpDetailLngView"));
            // oTransactionManager.addDataModel(this.getModel("VpSupplierDtlView"));
            // oTransactionManager.addDataModel(this.getModel("vpMaterialDtlView"));
            // oTransactionManager.addDataModel(this.getModel("vpManagerDtlView"));
		}, 

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

        handlemtlChang: function (event) {

            var mtl = this.getView().byId("general_inp_type_code").getSelectedKey();
            if (mtl == "MBLMOB") {
                this.byId("v_general_plan_base").setVisible(true);

            } else {
                this.byId("v_general_plan_base").setVisible(false);
            }

        },

		/**
		 * Event handler for Enter Full Screen Button pressed
		 * @public
		 */
		onPageEnterFullScreenButtonPress: function () {
			var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getRouter().navTo("midPage", {
				layout: sNextLayout, 
				tenantId: this._sTenantId,
				moldId: this._sMoldId
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
				tenantId: this._sTenantId,
				moldId: this._sMoldId
			});
		},
		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
		onPageNavBackButtonPress: function () {
			var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.getRouter().navTo("mainPage", {layout: sNextLayout});
            
            // this.getRouter().navTo("mainPage", {
            //     // layout: sap.f.LayoutType.TwoColumnsMidExpanded, 
            //     layout: sap.f.LayoutType.OneColumn
            // });             

		},

         /**
         * @public
         * @see 사용처 DialogCreate Fragment Open 이벤트
         */

         onDialogSupList: function (){
            var oView = this.getView();

			if (!this.pDialog) {
				this.pDialog = Fragment.load({
					id: oView.getId(),
					name: "pg.vp.vpMgt.view.DialogSupList",
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					return oDialog;
				});
			} 
			this.pDialog.then(function(oDialog) {
                oDialog.open();
                this.onAfterDialog();
			}.bind(this));
        },
        onAfterDialog:function(){
            
            var oView = this.getView(),
			    oModel = this.getModel("psuplist");
			oView.setBusy(true);
			oModel.setTransactionModel(this.getModel("mapping"));
			oModel.read("/VpSupplierMstView", {
				success: function(oData){
                    console.log("oData:"+ oData);
 					oView.setBusy(false);
                }.bind(this)
            });

        },        

        onSupSearchButtonPress :function (){
        
            var predicates = [];

            if (!!this.byId("s_pop_supplier_local_name").getValue()) {
                    predicates.push(new Filter("supplier_local_name", FilterOperator.Contains, this.byId("s_pop_supplier_local_name").getValue()));
                }
            console.log("_PopsupplySearch!!");
            var oView = this.getView(),
			    oModel = this.getModel("psuplist");
			oView.setBusy(true);
			oModel.setTransactionModel(this.getModel("mapping"));
			oModel.read("/VpSupplierMstView", {
				filters: predicates,
				success: function(oData){
                    console.log("oData:"+ oData);
 					oView.setBusy(false);
                }.bind(this)
            });


        },
        supPopupClose : function(oEvent){
          this.byId("addSupList").close();
        },


		/**
		 * Event handler for page edit button press
		 * @public
		 */

		
		/**
		 * Event handler for delete page entity
		 * @public
		 */
        onPageDeleteButtonPress: function(){
			var oView = this.getView(),
				me = this;
			MessageBox.confirm("Are you sure to delete?", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
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
        onDetailInputWithDeptValuePress: function(){
             this.oDetailDeptDialog = new DepartmentDialog({
                // id:"employeeDialog" ,
                title:"부서 검색",
                closeWhenApplied:true,
                items:{
                    filters: [
                    ]
                }

            });
            this.oDetailDeptDialog.open();
            this.oDetailDeptDialog.attachEvent("apply", function (oEvent) {
                //console.log("oEvent 여기는 팝업에 팝업에서 내려오는곳 : ", oEvent.mParameters.item.vendor_pool_code);
                that.byId("general_repr_department_name").setValue(null);
                that.byId("general_repr_department_code").setValue(null);
                // that.oSupplierCode.setValue(null);
                that.byId("general_repr_department_name").setValue(oEvent.mParameters.item.department_local_name);
                that.byId("general_repr_department_code").setValue(oEvent.mParameters.item.department_id);
            }.bind(this));
        },
        
        onDetailInputWithSupValuePress: function (oEvent) {
            var sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;
            that = this;
            this.oDetailSupDialog = new SupplierDialogPop({
                multiSelection: false,
                keyField: "supplier_code",
                textField: "supplier_local_name",
                filters: [
                    new VBox({
                        items: [
                            new Label({ text: this.getModel("I18N").getText("/KEYWORD") }),
                            new Input({placeholder : this.getModel("I18N").getText("/SUPPLIER_CODE")})
                        ],
                        layoutData: new GridData({ span: "XL2 L3 M5 S10" })
                    })
                ],
                columns: [
                    new Column({
                        width: "75%",
                        label: new Label({ text: this.getModel("I18N").getText("/VALUE") }),
                        template: new Text({ text: "supplier_local_name" })
                    }),
                    new Column({
                        width: "25%",
                        hAlign: "Center",
                        label: new Label({ text: this.getModel("I18N").getText("/CODE") }),
                        template: new Text({ text: "supplier_code" })
                    })
                ]
            });

            // Pop 내부에 값을 올려주기 위해 구성
            this.oDetailSupDialog.setContentWidth("300px");
            var sSearchObj = {};
            // sSearchObj.tanentId = "L2100";
            // sSearchObj.languageCd = "KO";

            // sSearchObj.supplierCode = that.byId("search_Sup_Code").getValue();
            // sSearchObj.orgCode = that.byId("search_Operation_ORG_E").getSelectedKey();
            // sSearchObj.orgUnitCode = that.byId("search_Operation_UNIT_E").getSelectedKey();
            sSearchObj.orgCode = that._sOrgCode;
            sSearchObj.orgUnitCode = that._sOperationUnitCode;
            // Pop의 open에 sSearchObj를 인자로 호출 
            this.oDetailSupDialog.open(sSearchObj);
            this.oDetailSupDialog.attachEvent("apply", function (oEvent) {
                var sModel = this.getModel("suplist");
                      
                sModel.setProperty(sPath + "/supplier_code", oEvent.mParameters.item.supplier_code);
                sModel.setProperty(sPath + "/supplier_local_name", oEvent.mParameters.item.supplier_local_name);
                sModel.setProperty(sPath + "/supplier_english_name", oEvent.mParameters.item.supplier_english_name);
                sModel.setProperty(sPath + "/supplier_company_code", oEvent.mParameters.item.company_code);
                sModel.setProperty(sPath + "/supplier_company_name", oEvent.mParameters.item.company_name);
                // sModel.setProperty(sPath + "/inactive_status_code", oEvent.mParameters.item.inactive_status_code);


            }.bind(this));
        
        },
        
        onDetailInputWithMatValuePress: function (oEvent) {
          var sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;    
            that = this;        
            this.oDetailMaterialDialog = new MaterialDialogPop({
                // id:"employeeDialog" ,
                title:"자재 검색",
                closeWhenApplied:true,
                items:{
                    filters: [
                    ]
                }

            });
            var sSearchObj = {};
            // sSearchObj.tanentId = "L2100";
            // sSearchObj.languageCd = "KO";

            // sSearchObj.supplierCode = that.byId("search_Sup_Code").getValue();
            // sSearchObj.orgCode = that.byId("search_Operation_ORG_E").getSelectedKey();
            // sSearchObj.orgUnitCode = that.byId("search_Operation_UNIT_E").getSelectedKey();
            sSearchObj.orgCode = that._sOrgCode;
            
            this.oDetailMaterialDialog.open(sSearchObj);
            this.oDetailMaterialDialog.attachEvent("apply", function (oEvent) {
                //console.log("oEvent 여기는 팝업에 팝업에서 내려오는곳 : ", oEvent.mParameters.item.vendor_pool_code);
                 var sModel = this.getModel("matlist");
                sModel.setProperty(sPath + "/material_code", oEvent.mParameters.item.material_code);
                sModel.setProperty(sPath + "/material_desc", oEvent.mParameters.item.material_desc);             

            }.bind(this));            
  
        },

        onDetailInputWithManValuePress: function (oEvent) {
            var sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;    
            that = this;        
            this.oDetailEmployeeDialog = new EmployeeDialog({
                // id:"employeeDialog" ,
                title:"직원 검색",
                closeWhenApplied:true,
                items:{
                    filters: [
                    ]
                }

            });
            this.oDetailEmployeeDialog.open();
            this.oDetailEmployeeDialog.attachEvent("apply", function (oEvent) {
                //console.log("oEvent 여기는 팝업에 팝업에서 내려오는곳 : ", oEvent.mParameters.item.vendor_pool_code);
                var sModel = this.getModel("manlist");

                    // if (!that.fnChkDupData(that.mngListTbl, "manlist", "/vpManagerDtlView", "vendor_pool_person_empno", empNo)) {

                        // sModel.setProperty(sPath + "/user_local_name", oEvent.mParameters.item.user_local_name);
                        // sModel.setProperty(sPath + "/user_english_name", oEvent.mParameters.item.user_english_name);
                        // sModel.setProperty(sPath + "/job_title", oEvent.mParameters.item.job_title);
                        // sModel.setProperty(sPath + "/vendor_pool_person_role_text", oEvent.mParameters.item.vendor_pool_person_role_text);
                        // sModel.setProperty(sPath + "/department_local_name", oEvent.mParameters.item.department_local_name);
                        // sModel.setProperty(sPath + "/department_english_name", oEvent.mParameters.item.department_english_name);
                        // sModel.setProperty(sPath + "/user_status_code", oEvent.mParameters.item.user_status_code); 

                //     } else {
                //         alert("중복 값이 있습니다.");
                //         sModel.setProperty(sPath + "/user_local_name", "");
                //         sModel.setProperty(sPath + "/user_english_name", "");
                //         sModel.setProperty(sPath + "/job_title", "");
                //         sModel.setProperty(sPath + "/vendor_pool_person_role_text", "");
                //         sModel.setProperty(sPath + "/department_local_name", "");
                //         sModel.setProperty(sPath + "/department_english_name", "");
                //         sModel.setProperty(sPath + "/user_status_code", "");
                //     }

                sModel.setProperty(sPath + "/user_local_name", oEvent.mParameters.item.user_local_name);
                sModel.setProperty(sPath + "/vendor_pool_person_empno", oEvent.mParameters.item.employee_number);
                // sModel.setProperty(sPath + "/user_english_name", oEvent.mParameters.item.user_english_name);
                sModel.setProperty(sPath + "/job_title", oEvent.mParameters.item.job_title);
                // sModel.setProperty(sPath + "/vendor_pool_person_role_text", oEvent.mParameters.item.vendor_pool_person_role_text);
                sModel.setProperty(sPath + "/department_local_name", oEvent.mParameters.item.department_local_name);
                // sModel.setProperty(sPath + "/department_english_name", oEvent.mParameters.item.department_english_name);
                // sModel.setProperty(sPath + "/user_status_code", oEvent.mParameters.item.user_status_code);                

            }.bind(this));
        },

		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onDetailSaveButtonPress: function(){
			 MessageToast.show("Do 1st Proc!");
            var doSave =  true;
             var oModel = this.getModel("vpMappingProc"),
                oView = this.getView(),   
                oBundle = this.getView().getModel("i18n").getResourceBundle(),                
                sMsg,
                v_returnModel,
                urlInfo = "srv-api/odata/v4/pg.VpMappingV4Service/VpMappingChangeTestProc";

            var inputInfo = {},
                vpMstList = [],
                vpSupplierList = [],
                vpItemList = [],
                vpManagerList = [];
                
                inputInfo = {
                    inputData: {
                        vpMst: [],
                        vpSupplier: [],
                        vpItem: [],
                        vpManager: [],
                        user_id: "testerId",
                        user_no: "testerNo"
                    }
                };   
            //_general_info Data add  
            
            var eval_flag = this.getView().byId("general_regular_evaluation_flag").getSelectedKey();
            var mngt_flag = this.getView().byId("general_maker_material_code_mngt_flag").getSelectedKey();
            var sd_flag = this.getView().byId("general_sd_exception_flag").getSelectedKey();
            // var vp_flag = this.getView().byId("general_vendor_pool_apply_exception_flag").getSelectedKey();

            if(eval_flag == "true"){
                eval_flag = true;
            }else{
                eval_flag = false;
            }
            if(mngt_flag == "true"){
                mngt_flag = true;
            }else{
                mngt_flag = false;
            }
            if(sd_flag == "true"){
                sd_flag = true;
            }else{
                sd_flag = false;
            }
            // if(vp_flag == "true"){
            //     vp_flag = true;
            // }else{
            //     vp_flag = false;
            // }                        

            vpMstList.push({
                tenant_id: generaloDataRst.tenant_id //auto set
                ,company_code: generaloDataRst.company_code //auto set
                ,org_type_code: generaloDataRst.org_type_code  //auto set
                ,org_code: generaloDataRst.org_code  //auto set
                ,vendor_pool_code: generaloDataRst.vendor_pool_code  //auto set
                ,vendor_pool_local_name : this.getView().byId("general_vendor_pool_local_name").getValue()// view value set
                ,vendor_pool_english_name : this.getView().byId("general_vendor_pool_english_name").getValue()//  view value set
                ,repr_department_code: this.getView().byId("general_repr_department_code").getValue()   // view value set            
                ,operation_unit_code : generaloDataRst.operation_unit_code  //auto set
                ,inp_type_code : this.getView().byId("general_inp_type_code").getSelectedKey()//  view value set
                ,mtlmob_base_code : this.getView().byId("general_plan_base").getSelectedKey()//  view value set
                // ,regular_evaluation_flag : this.getView().byId("general_regular_evaluation_flag").getState()//  view value set
                ,regular_evaluation_flag : eval_flag//  view value set
                ,industry_class_code : this.getView().byId("general_industry_class_code").getSelectedKey()//  view value set
                // ,sd_exception_flag : this.getView().byId("general_sd_exception_flag").getState()//  view value set
                // ,vendor_pool_apply_exception_flag : this.getView().byId("general_vendor_pool_apply_exception_flag").getState()//  view value set
                // ,maker_material_code_mngt_flag : this.getView().byId("general_maker_material_code_mngt_flag").getState()//  view value set                
                ,sd_exception_flag : sd_flag//  view value set
                // ,vendor_pool_apply_exception_flag : vp_flag//  view value set
                ,maker_material_code_mngt_flag : mngt_flag//  view value set
                ,domestic_net_price_diff_rate : parseFloat(this.getView().byId("general_domestic_net_price_diff_rate").getValue())// view value set
                ,dom_oversea_netprice_diff_rate : parseFloat(this.getView().byId("general_dom_oversea_netprice_diff_rate").getValue())// view value set
                // ,domestic_net_price_diff_rate : 10.0// view value set
                // ,dom_oversea_netprice_diff_rate : 10.0// view value set                
                ,equipment_grade_code : this.getView().byId("general_equipment_grade_code").getSelectedKey()//  view value set
                ,equipment_type_code : this.getView().byId("general_equipment_type_code").getSelectedKey()//   view value set
                ,vendor_pool_use_flag : true//  default
                ,vendor_pool_desc : this.getView().byId("general_vendor_pool_desc").getValue()//  view value set
                ,vendor_pool_history_desc : null//생략가능
                ,parent_vendor_pool_code : null//생략가능 
                // ,leaf_flag : true  //drill_state leaf = true
                // ,level_number : null  //hierarchy_level +1
                // ,display_sequence : null // 생략가능 default null
                // ,register_reason : "AAAAA" // 결재요청사유 생략
                // ,approval_number : "AAAAA" // 결재요청번호 생략
                ,crud_type_code : "U" // U

              
            });

            // inputInfo.inputData.vpMst = vpMstList;     
            
            // !that.fnChkDupData(that.metListTbl, "matlist", "/VpMaterialMst", "material_code", materialCode)
            // this.currentListObj = tblObj.getModel(modelName).getProperty(viewName);


            //supplier list data
            this.currnetSppObj = that.sppListTbl.getModel("suplist").getProperty("/VpSupplierDtlView")
            console.log("currnetSppObj : " + this.currnetSppObj);

            if (this.currnetSppObj.length > 0) {
                for (var i = 0; i < this.currnetSppObj.length; i++) {

                    var startDate = this.currnetSppObj[i].supeval_control_start_date;
                    var endDate = this.currnetSppObj[i].supeval_control_end_date;

                    if(startDate && !endDate || !startDate && endDate){

                        MessageToast.show("통제시작일과 통제종료일을 확인해 주세요"); 
                        doSave =  false;
                        
                    }

                    if(startDate){

                        startDate = this.currnetSppObj[i].supeval_control_start_date.toJSON().substring(0, 10)

                    }

                    if(endDate){

                        endDate = this.currnetSppObj[i].supeval_control_end_date.toJSON().substring(0, 10)

                    }


                    vpSupplierList.push({
                        tenant_id: generaloDataRst.tenant_id //auto set
                        ,company_code: this.currnetSppObj[i].supplier_company_code
                        ,org_type_code: generaloDataRst.org_type_code
                        ,org_code: generaloDataRst.org_code
                        // ,vendor_pool_code: this.currnetSppObj[i].vendor_pool_code
                        ,vendor_pool_code: generaloDataRst.vendor_pool_code
                        ,supplier_code: this.currnetSppObj[i].supplier_code
                        //,supeval_target_flag: false   //??협의대상(화면의 어떤항목인지 모름)
                        //,supplier_op_plan_review_flag: false   //??협의대상(화면의 어떤항목인지 모름)
                        ,supeval_control_flag: this.currnetSppObj[i].supeval_control_flag
                        ,supeval_control_start_date: startDate
                        ,supeval_control_end_date: endDate
                        //,supeval_restrict_start_date: "20210104"   //??협의대상(화면의 어떤항목인지 모름)
                        //,supeval_restrict_end_date: "20211229"   //??협의대상(화면의 어떤항목인지 모름)
                        //,inp_code: "AAA"  //??협의대상(화면의 어떤항목인지 모름)  
                        ,supplier_rm_control_flag: this.currnetSppObj[i].supplier_rm_control_flag
                        ,supplier_base_portion_rate: parseFloat(this.currnetSppObj[i].supplier_base_portion_rate)
                        ,vendor_pool_mapping_use_flag: this.currnetSppObj[i].vendor_pool_mapping_use_flag
                        ,register_reason: this.currnetSppObj[i].register_reason
                        ,approval_number: this.currnetSppObj[i].approval_number
                        ,crud_type_code : this.currnetSppObj[i]._row_state_   
                        
                    })
                }
            }

            //metrial list data
            this.currnetMetObj = that.metListTbl.getModel("matlist").getProperty("/vpMaterialDtlView")
            console.log("currnetMetObj : " + this.currnetMetObj);

            if (this.currnetMetObj.length > 0) {
                for (var i = 0; i < this.currnetMetObj.length; i++) {
                    vpItemList.push({
                            tenant_id: generaloDataRst.tenant_id //auto set
                            , company_code: this.currnetMetObj[i].company_code
                            , org_type_code: generaloDataRst.org_type_code
                            , org_code: generaloDataRst.org_code
                            , vendor_pool_code: generaloDataRst.vendor_pool_code
                            , material_code: this.currnetMetObj[i].material_code
                            , register_reason: this.currnetMetObj[i].register_reason
                            , approval_number: this.currnetMetObj[i].approval_number
                            , crud_type_code : this.currnetMetObj[i]._row_state_
                    })
                }
            }

            //manager list data
            this.currnetManObj = that.mngListTbl.getModel("manlist").getProperty("/vpManagerDtlView")
            console.log("currnetManObj : " + this.currnetManObj);

            if (this.currnetManObj.length > 0) {
                for (var i = 0; i < this.currnetManObj.length; i++) {
                    vpManagerList.push({
                            tenant_id: generaloDataRst.tenant_id //auto set
                            , company_code: this.currnetManObj[i].company_code
                            , org_type_code: generaloDataRst.org_type_code
                            , org_code: generaloDataRst.org_code
                            , vendor_pool_code: generaloDataRst.vendor_pool_code
                            , material_code: this.currnetManObj[i].material_code
                            , register_reason: this.currnetManObj[i].register_reason
                            , approval_number: this.currnetManObj[i].approval_number
                            , vendor_pool_person_empno: this.currnetManObj[i].vendor_pool_person_empno
                            // , vendor_pool_person_role_text: this.currnetManObj[i].vendor_pool_person_role_text
                            //, approval_number: ''  //안보냄    
                            //, register_reason: ''  //안보냄    
                            , crud_type_code : this.currnetManObj[i]._row_state_                                
                    })
                }
            }

            inputInfo.inputData.vpMst = vpMstList;   
            inputInfo.inputData.vpSupplier = vpSupplierList;   
            inputInfo.inputData.vpItem = vpItemList;                   
            inputInfo.inputData.vpManager = vpManagerList;

            if(!doSave){
                return false;
            }

            $.ajax({
                url: urlInfo,
                type: "POST",
                //datatype: "json",
                //data: input,
                data: JSON.stringify(inputInfo),
                contentType: "application/json",
                success: function (data) {
                    //MessageToast.show("Success 1st Proc!");
                    console.log('data:', data);
                    console.log('data:', data.value[0]);
                    v_returnModel = oView.getModel("returnModel").getData().data;
                    console.log('v_returnModel:', v_returnModel);
                    v_returnModel.return_code = data.value[0].return_code;
                    v_returnModel.return_msg = data.value[0].return_msg.substring(0, 8);
                    oView.getModel("returnModel").updateBindings(true);

                    //MessageToast.show(data.value[0].return_msg);
                    console.log(data.value[0].return_msg.substring(0, 8));
                    //sMsg = oBundle.getText("returnMsg", [data.value[0].return_msg]);
                    sMsg = oBundle.getText(data.value[0].return_msg.substring(0, 8));
                    //MessageToast.show(sMsg);
                    console.log(data.value[0].return_msg);
                    alert(sMsg);
                    MessageToast.show(sMsg);
                },
                error: function (e) {
                    var eMessage = "callProcError",
                        errorType,
                        eMessageDetail;

                    v_returnModel = oView.getModel("returnModel").getData().data;
                    console.log('v_returnModel_e:', v_returnModel);
                    v_returnModel.return_code = 'error';
                    v_returnModel.return_msg = e.responseJSON.error.message.substring(0, 8);

                    
                    //sMsg = oBundle.getText("returnMsg", [v_returnModel.return_msg]);
                    if(e.responseJSON.error.message == undefined || e.responseJSON.error.message == null){
                        eMessage = "callProcError";
                        eMessageDetail = "callProcError";
                    }else{
                        eMessage = e.responseJSON.error.message.substring(0, 8);
                        eMessageDetail = e.responseJSON.error.message.substring(9);
                        errorType = e.responseJSON.error.message.substring(0, 1);
                        console.log('errorMessage!:', e.responseJSON.error.message.substring(9));
                        
                        //MessageToast.show(eMessageDetail);
                    }

                    sMsg = oBundle.getText(eMessage);
                    if(errorType === 'E'){
                        alert(sMsg);                    
                    }else{
                        alert(eMessageDetail);                    
                    }
                    
                    
                    MessageToast.show(sMsg);                    
                }
            });

		},
		
		
		/**
		 * Event handler for cancel page editing
		 * @public
		 */
  

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		

        _onRoutedThisPageDtl: function(oEvent) {

            var oArgs = oEvent.getParameter("arguments"),
				oView = this.getView();
            // this.getView().setModel(this.getOwnerComponent().getModel());

            this._sTenantId = oArgs.tenantId;
			this._sVendorPool = oArgs.vendorPool;
            this._sOrgCode = oArgs.orgCode;
            this._sOperationUnitCode = oArgs.operationUnitCode;
            this._sTempType = oArgs.temptype;
            this._sDrill = oArgs.drill;

            var predicates = [];
            var predicates1 = [];
            var predicates2 = [];
            var predicates3 = [];
            if (!!this._sTenantId) {
                    predicates.push(new Filter("tenant_id", FilterOperator.EQ, this._sTenantId));
                    predicates1.push(new Filter("tenant_id", FilterOperator.EQ, this._sTenantId));
                    predicates2.push(new Filter("tenant_id", FilterOperator.EQ, this._sTenantId));
                    predicates3.push(new Filter("tenant_id", FilterOperator.EQ, this._sTenantId));
                }
            if (!!this._sOrgCode) {
                    predicates.push(new Filter("org_code", FilterOperator.EQ, this._sOrgCode));
                    predicates1.push(new Filter("org_code", FilterOperator.EQ, this._sOrgCode));
                    predicates2.push(new Filter("org_code", FilterOperator.EQ, this._sOrgCode));
                    predicates3.push(new Filter("org_code", FilterOperator.EQ, this._sOrgCode));
                }
            if (!!this._sOperationUnitCode) {
                    predicates1.push(new Filter("operation_unit_code", FilterOperator.EQ, this._sOperationUnitCode));
                }         
            if (!!this._sVendorPool) {
                    predicates.push(new Filter("vendor_pool_code", FilterOperator.EQ, this._sVendorPool));
                    predicates1.push(new Filter("vendor_pool_code", FilterOperator.EQ, this._sVendorPool));
                    predicates2.push(new Filter("vendor_pool_code", FilterOperator.EQ, this._sVendorPool));
                    predicates3.push(new Filter("vendor_pool_code", FilterOperator.EQ, this._sVendorPool));
                }  
            if (!!this._sTempType) {
                    predicates.push(new Filter("temp_type", FilterOperator.EQ, this._sTempType));
                }  

            predicates.push(new Filter("language_cd", FilterOperator.EQ, "KO"));
            this._generalInfo(predicates1);
            this._supplySearch(predicates);
            this._metrialSearch(predicates3);
            this._managerSearch(predicates2);

            // this.sppListTbl = this.byId("sppListTbl"); 
            this.sppListTbl = this.byId("sppListTbl");
            this.metListTbl = this.byId("metListTbl");
            this.mngListTbl = this.byId("mngListTbl");


            if(this._sDrill == "leaf"){
                this.byId("pageSubSection2").setVisible(true);
                this.byId("pageSubSection3").setVisible(true);
                this.byId("pageSubSection4").setVisible(true);

                // this.byId("v_derail_information").setVisible(true);
                this.byId("v_general_repr_department_code").setVisible(true);
                this.byId("v_general_industry_class_code").setVisible(true);
                this.byId("v_general_inp_type_code").setVisible(true);
                this.handlemtlChang(event);
                // this.byId("v_general_plan_base").setVisible(false);
                this.byId("v_general_regular_evaluation_flag").setVisible(true);
                this.byId("v_general_maker_material_code_mngt_flag").setVisible(true);
                this.byId("v_general_sd_exception_flag").setVisible(true);
                // this.byId("v_general_vendor_pool_apply_exception_flag").setVisible(true);
                this.byId("v_general_equipment_grade_code").setVisible(true);
                this.byId("v_general_equipment_type_code").setVisible(true);
                this.byId("v_general_dom_oversea_netprice_diff_rate").setVisible(true);
                this.byId("v_general_domestic_net_price_diff_rate").setVisible(true);


                if (this._sOperationUnitCode == "EQUIPMENT") {
                    this.byId("v_general_equipment_grade_code").setVisible(true);
                    this.byId("v_general_equipment_type_code").setVisible(true);
                    this.byId("v_general_dom_oversea_netprice_diff_rate").setVisible(false);
                    this.byId("v_general_domestic_net_price_diff_rate").setVisible(false);
                    // this.byId("equipment_box").setVisible(true);
                    // this.byId("rate_box").setVisible(false);
                } else {
                    this.byId("v_general_equipment_grade_code").setVisible(false);
                    this.byId("v_general_equipment_type_code").setVisible(false);
                    this.byId("v_general_dom_oversea_netprice_diff_rate").setVisible(true);
                    this.byId("v_general_domestic_net_price_diff_rate").setVisible(true);
                    // this.byId("equipment_box").setVisible(false);
                    // this.byId("rate_box").setVisible(true);                
                }

            }else{
                this.byId("pageSubSection2").setVisible(false);
                this.byId("pageSubSection3").setVisible(false);
                this.byId("pageSubSection4").setVisible(false);

                // this.byId("v_derail_information").setVisible(false);
                this.byId("v_general_repr_department_code").setVisible(false);
                this.byId("v_general_industry_class_code").setVisible(false);
                this.byId("v_general_inp_type_code").setVisible(false);
                this.byId("v_general_regular_evaluation_flag").setVisible(false);
                this.byId("v_general_maker_material_code_mngt_flag").setVisible(false);
                this.byId("v_general_sd_exception_flag").setVisible(false);
                // this.byId("v_general_vendor_pool_apply_exception_flag").setVisible(false);
                this.byId("v_general_equipment_grade_code").setVisible(false);
                this.byId("v_general_equipment_type_code").setVisible(false);
                this.byId("v_general_dom_oversea_netprice_diff_rate").setVisible(false);
                this.byId("v_general_domestic_net_price_diff_rate").setVisible(false);                
            }

        },

        //행추가
        supplierAddRow: function () {
            var oModel = this.getModel("suplist");
            oModel.addRecord({}, 0);
            this.validator.clearValueState(this.byId("sppListTbl"));
        },
        //행삭제
        supplierDelRow: function (oEvent) {
            var table = this.byId("sppListTbl"),
                model = this.getModel("suplist");
            table.getSelectedIndices().reverse().forEach(function (idx) {
                model.markRemoved(idx);
            });
        },
        //팝업에서 값 내려왔거나 서제스쳔선택되어서 change이벤트가 발생되었을떼에 실행되는 함수
        supplierChg: function (oEvent) {
            console.log("change1:" + oEvent.oSource.getProperty("selectedKey"));
            console.log("oItemPath:" + oEvent.getSource().getParent().getRowBindingContext().sPath);
            var sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;
            

            var supplierCode = oEvent.oSource.getProperty("selectedKey");
            var oView = this.getView();
            oView.setBusy(true);
            var oFilter = [];
            oFilter.push(new Filter("supplier_code", FilterOperator.Contains, supplierCode));
            oFilter.push(new Filter("language_cd", FilterOperator.Contains, "EN"));
            oFilter.push(new Filter("bizunit_code", FilterOperator.Contains, this._sOrgCode));
            var oModel = this.getModel("mapping");
            var sModel = this.getModel("suplist");
            oModel.read("/VpSupplierMstView", {
                filters: oFilter,
                success: function (oData) {
                    console.log("oData:" + oData);
                    if (oData.results.length === 1) {
                        var results = oData.results[0];
                        sModel.setProperty(sPath + "/supplier_code", results.supplier_code);
                        sModel.setProperty(sPath + "/supplier_local_name", results.supplier_local_name);
                        sModel.setProperty(sPath + "/supplier_english_name", results.supplier_english_name);
                        sModel.setProperty(sPath + "/supplier_company_code", results.supplier_company_code);
                        sModel.setProperty(sPath + "/supplier_company_name", results.supplier_company_name);
                    } else {
                        //
                    }
                    oView.setBusy(false);
                }.bind(this)
            });
        },   

        //=========================================//
        //머트리얼 행추가/삭제/체인지 : start
        //=========================================//
        //행추가
        materialAddRow: function () {
            var oModel = this.getModel("matlist");
            oModel.addRecord({"editYn": true}, 0);
            this.validator.clearValueState(this.byId("metListTbl"));
        },

        //행삭제
        materialDelRow: function (oEvent) {
            var table = this.byId("metListTbl"),
                model = this.getModel("matlist");
            table.getSelectedIndices().reverse().forEach(function (idx) {
                model.markRemoved(idx);
            });
        },

        //팝업에서 값 내려왔거나 서제스쳔선택되어서 change이벤트가 발생되었을떼에 실행되는 함수
        materialChg: function (oEvent) {
            console.log("change1:" + oEvent.oSource.getProperty("selectedKey"));
            console.log("oItemPath:" + oEvent.getSource().getParent().getRowBindingContext().sPath);
            var sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;

            var materialCode = oEvent.oSource.getProperty("selectedKey");
            var oView = this.getView();
            oView.setBusy(true);
            var oFilter = [];
            oFilter.push(new Filter("material_code", FilterOperator.EQ, materialCode));
            oFilter.push(new Filter("language_cd", FilterOperator.EQ, "EN"));
            oFilter.push(new Filter("org_code", FilterOperator.EQ, this._sOrgCode));
            var oModel = this.getModel("mapping");
            var sModel = this.getModel("matlist");
            oModel.read("/VpMaterialMst", {
                filters: oFilter,
                success: function (oData) {
                    if (!that.fnChkDupData(that.metListTbl, "matlist", "/vpMaterialDtlView", "material_code", materialCode)) {
                        if (oData.results.length === 1) {
                            var results = oData.results[0];
                            sModel.setProperty(sPath + "/material_code", results.material_code);
                            sModel.setProperty(sPath + "/material_desc", results.material_desc);
                        } else {
                        //
                        }
                    } else {
                        alert("중복 값이 있습니다.");
                        sModel.setProperty(sPath + "/material_code", "");
                        sModel.setProperty(sPath + "/material_desc", "");
                    }
                    oView.setBusy(false);
                }, error: function(e){
                    console.log("error:" + e);
                    oView.setBusy(false);
                }.bind(this)
            });
        },   
        //=========================================//
        //머트리얼 행추가/삭제/체인지 : end
        //=========================================//

        //=========================================//
        //매니저 행추가/삭제/체인지 : start
        //=========================================//
        //행추가
        managerAddRow: function () {
            var oModel = this.getModel("manlist");
            oModel.addRecord({"editYn": true}, 0);
            this.validator.clearValueState(this.byId("mngListTbl"));
        },

        //행삭제
        managerDelRow: function (oEvent) {
            var table = this.byId("mngListTbl"),
                model = this.getModel("manlist");
            table.getSelectedIndices().reverse().forEach(function (idx) {
                model.markRemoved(idx);
            });
        },

        //팝업에서 값 내려왔거나 서제스쳔선택되어서 change이벤트가 발생되었을떼에 실행되는 함수
        managerChg: function (oEvent) {
            console.log("change1:" + oEvent.oSource.getProperty("selectedKey"));
            console.log("oItemPath:" + oEvent.getSource().getParent().getRowBindingContext().sPath);
            var sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;
            

            var empNo = oEvent.oSource.getProperty("selectedKey");
            var oView = this.getView();
            oView.setBusy(true);
            var oFilter = [];
            oFilter.push(new Filter("vendor_pool_person_empno", FilterOperator.EQ, "'" + empNo.toString() + "'"));
            oFilter.push(new Filter("org_code", FilterOperator.EQ, this._sOrgCode));
            var oModel = this.getModel("mapping");
            var sModel = this.getModel("manlist");
            oModel.read("/vpManagerDtlView", {
                filters: oFilter,
                success: function (oData) {
                    if (!that.fnChkDupData(that.mngListTbl, "manlist", "/vpManagerDtlView", "vendor_pool_person_empno", empNo)) {
                        if (oData.results.length === 1) {
                            var results = oData.results[0];
                            sModel.setProperty(sPath + "/user_local_name", results.user_local_name);
                            sModel.setProperty(sPath + "/user_english_name", results.user_english_name);
                            sModel.setProperty(sPath + "/job_title", results.job_title);
                            // sModel.setProperty(sPath + "/vendor_pool_person_role_text", results.vendor_pool_person_role_text);
                            sModel.setProperty(sPath + "/department_local_name", results.department_local_name);
                            sModel.setProperty(sPath + "/department_english_name", results.department_english_name);
                            sModel.setProperty(sPath + "/user_status_code", results.user_status_code);
                        } else {
                            //
                        }
                    } else {
                        alert("중복 값이 있습니다.");
                        sModel.setProperty(sPath + "/user_local_name", "");
                        sModel.setProperty(sPath + "/user_english_name", "");
                        sModel.setProperty(sPath + "/job_title", "");
                        // sModel.setProperty(sPath + "/vendor_pool_person_role_text", "");
                        sModel.setProperty(sPath + "/department_local_name", "");
                        sModel.setProperty(sPath + "/department_english_name", "");
                        sModel.setProperty(sPath + "/user_status_code", "");
                    }

                    oView.setBusy(false);
                }, error: function(e){
                    console.log("error:" + e);
                    oView.setBusy(false);
                }.bind(this)
            });
        },  
        //=========================================//
        //매니저 행추가/삭제/체인지 : end
        //=========================================//

        //중복체크 함수
        //tblObj : 테이블 객체 ex)this.byId("테이블이름");
        //modelName : 테이블에 셋팅된 모델 이름
        //viewName : 모델에 set이름
        //keyName : 비교하고자 하는 key 이름 또는 ID
        //keyCode : 비교하고자 하는 코드
        //ex) that.metListTbl.getModel('matlist').getProperty("/vpMaterialDtlView");
        //return true or false default 'false'
        fnChkDupData: function(tblObj, modelName, viewName, keyName, keyCode) {
            //console.log("dupchk::::" + tblObj, modelName, viewName, keyName, keyCode);
            var result = false;
            this.currentListObj = tblObj.getModel(modelName).getProperty(viewName);
            if (this.currentListObj.length > 0) {
                for (var i = 0; i < this.currentListObj.length; i++) {
                    console.log(keyCode, eval("this.currentListObj[i]." + keyName));
                    if (keyCode === eval("this.currentListObj[i]." + keyName)) {
                        result = true;
                        break;
                    }
                }
            }
            console.log("result:" + result);
            return result;
        },


        //GeneralInfo 정보 셋팅 Routed Param aFilter
         _generalInfo: function(aFilter) {
            //alert(that.getView().byId("pop_operation_unit_name").getText());
            // var oView = this.getView("midDtlView");
			// var	oModel = this.getModel("geninfo");
            // oView.setBusy(true);
            var oView = this.getView("midDtlView");
            var	oModel = this.getView().getModel("mapping");
            var oFilter = [];
			oFilter.push(new Filter("tenant_id", FilterOperator.EQ, "L2100"));
			// oFilter.push(new Filter("company_code", FilterOperator.EQ, "*"));
            // oFilter.push(new Filter("org_type_code", FilterOperator.EQ, "BU"));
            oFilter.push(new Filter("org_code", FilterOperator.EQ, "BIZ00200"));
            oFilter.push(new Filter("operation_unit_code", FilterOperator.EQ, "EQUIPMENT"));
            oFilter.push(new Filter("vendor_pool_code", FilterOperator.EQ, "VP201610280406"));
            oView.setBusy(true);
            // oModel.setTransactionModel(this.getModel("mapping"));
			oModel.read("/VpDetailLngView", {
                
				filters: aFilter,
				success: function(oData){
                    oView.setBusy(false);
                    // var oDataRst = oData.results[0];
                    generaloDataRst = oData.results[0];
                    //sap.ui.getCore().byId("general_higher_level_path").setText(oDataRst.higher_level_path_name);
                    // that.getView().byId("general_higher_level_path").setText("234123rt234");
                    that.getView().byId("general_higher_level_path").setText(generaloDataRst.higher_level_path_name);
                    that.getView().byId("general_operation_unit_name").setText(generaloDataRst.operation_unit_name);
                    that.getView().byId("general_vendor_pool_local_name").setValue(generaloDataRst.vendor_pool_local_name);
                    that.getView().byId("general_vendor_pool_english_name").setValue(generaloDataRst.vendor_pool_english_name);
                    that.getView().byId("general_vendor_pool_desc").setValue(generaloDataRst.vendor_pool_desc);
                    that.getView().byId("general_repr_department_code").setValue(generaloDataRst.repr_department_code);
                    that.getView().byId("general_repr_department_name").setValue(generaloDataRst.department_local_name);
                    that.getView().byId("general_industry_class_code").setSelectedKey(generaloDataRst.industry_class_code);
                    that.getView().byId("general_inp_type_code").setSelectedKey(generaloDataRst.inp_type_code);

                    if (generaloDataRst.inp_type_code == "MBLMOB") {
                        that.byId("v_general_plan_base").setVisible(true);

                    } else {
                        that.byId("v_general_plan_base").setVisible(false);
                    }
                    var eval_flag;
                    var mngt_flag;
                    var sd_flag;
                    var vp_flag;

                    if (generaloDataRst.regular_evaluation_flag !== null) {
                        if(generaloDataRst.regular_evaluation_flag){
                            eval_flag = "true"
                        }else{
                            eval_flag = "false"
                        }
                        // eval_flag = generaloDataRst.regular_evaluation_flag ? "true" : "false"  ;
                    }else{
                        eval_flag = "false";
                    }

                    if (generaloDataRst.maker_material_code_mngt_flag !== null) {
                        if(generaloDataRst.maker_material_code_mngt_flag){
                            mngt_flag = "true"
                        }else{
                            mngt_flag = "false"
                        }
                        // mngt_flag = generaloDataRst.regular_evaluation_flag ? "true" : "false"  ;
                    }else{
                        mngt_flag = "false";
                    }

                    if (generaloDataRst.sd_exception_flag !== null) {
                        if(generaloDataRst.sd_exception_flag){
                            sd_flag = "true"
                        }else{
                            sd_flag = "false"
                        }                        
                        // sd_flag = generaloDataRst.regular_evaluation_flag ? "true" : "false"  ;
                    }else{
                        sd_flag = "false";
                    }
                    if (generaloDataRst.vendor_pool_apply_exception_flag !== null) {
                        if(generaloDataRst.vendor_pool_apply_exception_flag){
                            vp_flag = "true"
                        }else{
                            vp_flag = "false"
                        }                         
                        // vp_flag = generaloDataRst.regular_evaluation_flag ? "true" : "false"  ;
                    }else{
                        vp_flag = "false";
                    }
                    
                    that.getView().byId("general_plan_base").setSelectedKey(generaloDataRst.mtlmob_base_code);
                    that.getView().byId("general_regular_evaluation_flag").setSelectedKey(eval_flag);
                    that.getView().byId("general_maker_material_code_mngt_flag").setSelectedKey(mngt_flag);
                    that.getView().byId("general_sd_exception_flag").setSelectedKey(sd_flag);
                    // that.getView().byId("general_vendor_pool_apply_exception_flag").setSelectedKey(vp_flag);
                    that.getView().byId("general_equipment_grade_code").setSelectedKey(generaloDataRst.equipment_grade_code);
                    that.getView().byId("general_equipment_type_code").setSelectedKey(generaloDataRst.equipment_type_code);
                    that.getView().byId("general_dom_oversea_netprice_diff_rate").setValue(generaloDataRst.dom_oversea_netprice_diff_rate);
                    that.getView().byId("general_domestic_net_price_diff_rate").setValue(generaloDataRst.domestic_net_price_diff_rate);
				}
			});
        },

        chkReplaceChange: function (oEvent) {
            console.log("livechange!!");
            //var regex = /[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]/gi;     // 특수문자 제거 (한글 영어 숫자만)
            //var regex = /[^a-zA-Z0-9\s ]/gi;                   // 특수문자 제거 (영어 숫자만)
            var regex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;  //한글 제거 11/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g%^&*()_+|<

            var newValue = oEvent.getParameter("newValue");
            //$(this).val(v.replace(regexp,''));
            if (newValue !== "") {
                newValue = newValue.replace(regex, "");
                oEvent.oSource.setValue(null);
                oEvent.oSource.setValue(newValue);
            }
        },
        _supplySearch: function(aFilter) {


            console.log("_supplySearch!!");
            var oView = this.getView(),
			    oModel = this.getModel("suplist");
			oView.setBusy(true);
			oModel.setTransactionModel(this.getModel("mapping"));
			oModel.read("/VpSupplierDtlView", {
				filters: aFilter,
				success: function(oData){
                    console.log("oData:"+ oData);
					oView.setBusy(false);
                }.bind(this)
            });

        },
        
        _metrialSearch: function(aFilter) {
            console.log("_metrialSearch!!");
            var oView = this.getView(),
				oModel = this.getModel("matlist");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel("mapping"));
			oModel.read("/vpMaterialDtlView", {
				filters: aFilter,
				success: function(oData){
                    console.log(oData.results);
					oView.setBusy(false);
				}
            });

        },

        _managerSearch: function(aFilter) {
            var oView = this.getView(),
				oModel = this.getModel("manlist");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel("mapping"));
			oModel.read("/vpManagerDtlView", {
				filters: aFilter,
				success: function(oData){
					oView.setBusy(false);
				}
			});
        }        

        


	});
});