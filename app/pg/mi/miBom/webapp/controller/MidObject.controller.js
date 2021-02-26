sap.ui.define([
    "./BaseController",
    "ext/lib/util/Multilingual",    
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/ValueState",
    "ext/lib/util/Validator",
    "sap/ui/core/Fragment"
], function (BaseController, Multilingual, JSONModel, Filter, FilterOperator, MessageBox, MessageToast, ValueState, Validator, Fragment) {
    "use strict";
    return BaseController.extend("pg.mi.miBom.controller.MidObject", {
        validator: new Validator(),
		formatter: (function(){
			return {
				toYesNo: function(oData){
					return oData === true ? "YES" : "NO";
				},
			}
        })(),

        _getUid : function( ){
           
            function s4() {
                return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

        },

        dataPath : "resources",
        _m : {  //수정대상 등록된 필터값들은 삭제한다. 
            page : "page",
            groupID : "pgGroup",
            mi_bom_id : "",
            fragementPath : {
                materialDetail : "pg.mi.miBom.view.MaterialDetail",
                materialDialog : "pg.mi.miBom.view.MaterialDialog",
                reqmQuantityUnit : "pg.mi.miBom.view.ReqmQuantityUnit"
            },            
            fragementId : {
                materialDetail : "MaterialDetail_ID",
                materialDialog : "MaterialDialog_ID",
                reqmQuantityUnit : "ReqmQuantityUnit_ID"
            },
            input : {
                input_material_code : "input_material_code",
            },
            button : {
                buttonMidTableCreate : "buttonMidTableCreate",
                buttonMidTableDelete : "buttonMidTableDelete",
                buttonMidDelete: "buttonMidDelete",
                buttonMidEdit: "buttonMidEdit",
                buttonSave: "buttonSave"
            },
            tableItem : {
                items : "items" //or rows
            },
            filter : {  
                tenant_id : "L2100",
                material_code : "",
                supplier_code : "",
                mi_bom_id : "",               
                language_code : "KO"
            },
            serviceName : {
                marketIntelligenceService : "pg.marketIntelligenceService", //main Service
                mIMaterialCodeBOMManagementView: "/MIMaterialCodeBOMManagementView",  //자재별 시황자재 BOM 조회 View
                mIMaterialCodeBOMManagementHeaderView: "/MIMaterialCodeBOMManagementHeaderView",  //자재별 시황자재 BOM 조회 View(2020/12/29 변경)
                mIMaterialCodeBOMManagementItem:"/MIMaterialCodeBOMManagementItem",//자재별 시황자재 BOM 관리 Item
                mIMaterialCodeBOMManagementHeader:"/MIMaterialCodeBOMManagementHeader",//자재별 시황자재 BOM 관리 Header
                mIMaterialCostInformationView: "/MIMaterialCostInformationView",  //시황자재 가격관리
                mIMaterialPriceManagementView : "/MIMaterialPriceManagementView", //시황자재 가격관리 View
                mICategoryDetailView : "/MICategoryDetailView", //카테고리 상세내용
                orgCodeView: "/OrgCodeView", //관리조직 View
                currencyUnitView : "/CurrencyUnitView", //통화단위 View
                mIMaterialCodeList : "/MIMaterialCodeList", //자재코드 View(검색)
                unitOfMeasureView : "/UnitOfMeasureView", //수량단위 View
                // materialView : "/MaterialView", //자재
                materialView : "/MaterialNSupplierView", //자재 수정 kbg
                mIMatListView : "/MIMatListView", //가격정보(1.시황자재 선택)
                supplierView : "/SupplierView", //공급업체
                mIMatCategListView : "/MIMatCategListView" //12/7 변경
            },
            processMode : {
                create : "C", //신규, 
                read : "R",   //보기
                edit : "E"    //수정
            },
            pageModeText : {
                edit : "Edit", //Change Fragment 호출 상태
                show : "Show"  //Edit Fragment 호출 상태
            },
            itemMode : {
                create : "C",  //테이블 아이템 신규등록
                read : "R",    //테이블 아이템 기존 존재 데이타 로드
                update : "U",  //업데이트 상태
                delete : "D"   //삭제 상태 
            },
            odataMode : {
                yes : "Y",     //테이블 아이템 이 odata에서 load 한것
                no : "N"       //json 에서 임으로 생성한 아이템
            },
            messageType : {
                Warning : sap.ui.core.MessageType.Warning,
                Error : sap.ui.core.MessageType.Error,
                Information : sap.ui.core.MessageType.Information,
                None : sap.ui.core.MessageType.None,
                Success : sap.ui.core.MessageType.Success                
            },
            controlMode : {
                Dev : "Dev",
                Qa : "QA",
                Prd : "PRD"

            }            
        },

        _imsiData : {
            vendor : "KR01818401",
            vendor_name: "한국유나이티드제약(주)",
            material_code : "1000164",
            material_desc : "ANTIMONY TRIOXIDE (SB2O3) WHITE 99.5%",
            supplier_code : "KR01818401",
            supplier_local_name : "한국유나이티드제약(주)",
            supplier_english_name : "korea"
        },

        _sso : { //수정대상 공통 사용자 정보 확인될시 //MaterialDialog
            user : {
                id : "Admin",
                name : "Hong Gil-dong"
            },
            dept : {
                tenant_id : "L2100",
                company_code : "*",
                org_type_code : "BU",
                org_code : "BIZ00100"
            },
            selectedIndex : 0         
        },

        /**
         * Mode : Dev, Qa, Prd  
         * @private
         */
        _controlMode : function (sMode) {
            console.log(" --------------- _controlMode");

            //_oUiData 사용자 지정
            //oUiData 메인에서 선택한 자재 정보 

            if(sMode == this._m.controlMode.Dev){
                console.log("=================== Dev ====================")
                /**
                 * 사용자 세션이나 정보에 다음값이 셋팅 되어 있다는 가정 Test
                 */

                var _oUiData = new JSONModel({
                    org_name: "",
                    create: "",
                    createdate: "",
                    update:"",
                    updatedate:"",
                    material_code :"",
                    material_desc :"",
                    supplier_code :"",
                    supplier_local_name :"",
                    processing_cost :"",
                    pcst_currency_unit :"",
                    base_quantity : "",
                    base_quantity_unit: "",
                    radioButtonGroup : "",
                    input_material_code : "",
                    string:null,
                    create_user_id: this._sso.user.id,
                    update_user_id: this._sso.user.id,
                    system_create_dtm : new Date(),
                    number:1                    
                });

                
                this.setModel(_oUiData, "_oUiData");


            }else{
                var _oUiData = new JSONModel({
                    tenant_name: "",
                    radioButtonGroup:0,
                    material_code : "",
                    supplier_code : ""
                });
                
                this.setModel(_oUiData, "_oUiData");
                                
                this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);
            }

        },
        /**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            console.group("[mid] onInit");

            var that = this;
            var oMultilingual = new Multilingual();
            that.setModel(oMultilingual.getModel(), "I18N");
                        
            //var mModel = new JSONModel("m", this._settingsModel);
            //this.getView().setModel(mModel); 
            // Attaches validation handlers
            sap.ui.getCore().attachValidationError(function (oEvent) {
                oEvent.getParameter("element").setValueState(ValueState.Error);
            });
            sap.ui.getCore().attachValidationSuccess(function (oEvent) {
                oEvent.getParameter("element").setValueState(ValueState.None);
            });

            //this.byId("label").attachBrowserEvent("click", showValueHelp);

            //header title hide
            $(".sapMBarPH sapMBarContainer").hide(); 
            //header title hide
            $("#__xmlview1--page-intHeader-BarPH").hide();
            //pageMode C Create, V View, E Edit
            var oUi = new JSONModel({
                busy: false,
                delay: 0,
                changeItem : false,
                readMode : true,
                editMode : false,                
                createMode : false,
                deleteMode : false
            });
            var  _deleteItem = new JSONModel({"delData":[]});
            that.setModel(_deleteItem, "_deleteItem");

            that.setModel(oUi, "oUi");

            that.getOwnerComponent().setModel(new JSONModel(), "originalModel");
            //that.getOwnerComponent().setModel(new JSONModel(), "midList");
            //that.getOwnerComponent().setModel(new JSONModel(), "oUiData");
            that._fnControlSetting();

            that._fnSetReadMode();
            
   
            //개발일때. 
            //수정대상
            that._controlMode(that._m.controlMode.Qa);

            that._Page = that.getView().byId("page");
            that._Page.setFloatingFooter(true);

            var oModel = that.getOwnerComponent().getModel();
            oModel.setSizeLimit(1000);


            console.groupEnd();
        },

        /**
         * control object filter 
         * @private
         */
        _fnControlSetting : function() {
            console.log("_fnControlSetting");
            var that = this;
            var comboBox_pcst_currency_unit = that.getView().byId("comboBox_pcst_currency_unit");            
            var oBindingComboBox = comboBox_pcst_currency_unit.getBinding("items");

            var aFiltersComboBox = [
                new Filter("tenant_id", "EQ", that._m.filter.tenant_id),
                new Filter("language_code", "EQ", that._m.filter.language_code)
            ];
              
           // oBindingComboBox.filter(aFiltersComboBox);  
        },

        /** display mode setting  */

        _fnSetReadMode : function(){
            this._fnSetMode("read");
        },

        _fnSetEditMode : function(){
            this._fnSetMode("edit");
        },

        _fnSetCopyMode : function() {
            this._fnSetMode("copy");
        },

        _fnSetDeleteMode : function(){
            this._fnSetMode("delete");
        },        

        _fnSetCreateMode : function(){
            this._fnSetMode("create");
        },

        _fnSetMode : function(mode){
            var bRead = false,
                bCreate = false,
                bEdit = false,
                bCopy = false,
                bDelete = false;

            if(mode === "read"){
                bRead = true;
            }else if(mode === "create"){
                bCreate = true;
            }else if(mode === "edit"){
                bEdit = true;
            }else if(mode ==="delete"){
                bDelete = true;                
            }
            else if(mode ==="copy"){
                bCopy = true;                
            }            

            var oUi = this.getModel("oUi");
            oUi.setProperty("/readMode", bRead);
            oUi.setProperty("/createMode", bCreate);
            oUi.setProperty("/editMode", bEdit);
            oUi.setProperty("/deleteMode", bDelete);
            oUi.setProperty("/copyMode", bCopy);
        },

        /**
         * _isNull Check
         * @private
         */        
        _isNull: function (p_val) {
            if (!p_val || p_val == "" || p_val == null) {
                return true;
            } else {
                return false;
            }
        },

        // _setPropertyBind : function(){

		// 	var binding=new sap.ui.model.json.JSONPropertyBinding(model,"/country");
		// 	var statesSelect=this.getView().byId("statesSelect");
		// 	binding.attachChange(function(e){
		// 	});
		// },

        /** Fragments control setting  */

        _formFragments: {},

        /**
         * Fragment 설정
         * @param {String} oProcessMode 
         */
        _getFormFragment: function (oProcessMode) {
            console.log("_getFormFragment : oProcessMode-> ", oProcessMode);
            
            var oFragementId = this._m.fragementId.display;
            var oFragementPath = this._m.fragementPath.display;
            switch(oProcessMode){
                case this._m.processMode.create:
                    oFragementPath = this._m.fragementPath.create;
                    oFragementId = this._m.fragementId.create;
                break;
                case this._m.processMode.edit:
                    oFragementPath = this._m.fragementPath.change;
                    oFragementId = this._m.fragementId.change;
                break;
                case this._m.processMode.display:
                    oFragementPath = this._m.fragementPath.display;
                    oFragementId = this._m.fragementId.display;
                break;                    
            }

            var oFormFragment = this._formFragments[oFragementId];

            if (oFormFragment) {
                return oFormFragment;
            }

            oFormFragment = sap.ui.xmlfragment(oFragementId, oFragementPath, this);

            this._formFragments[oFragementId] = oFormFragment;

            return this._formFragments[oFragementId];

            console.groupEnd();
        },

        /**
         * Fragment Show
         * @private
         */
        _showFormFragment: function (oProcessMode) {
            console.group("_showFormFragment");

            var oPage = this.byId(this._m.page);

            this._setBusy(true);

            oPage.removeAllContent();

            oPage.insertContent(this._getFormFragment(oProcessMode));

            this._setBusy(false);

            console.groupEnd();
        },
       
                
        /**
         * 자재정보 검색 MaterialDialog.fragment open
         * @public
         */
		handleValueHelpMaterial: function (oEvent) {
            console.log("handleValueHelpMaterial");
            //var sInputValue = oEvent.getSource().getValue();
            var _oUiData = this.getModel("_oUiData"),
                materialTable = this.getModel("materialTable");
            var that = this;    
            _oUiData.setProperty("/radioButtonGroup", that.getView().byId("radioButtonGroup").getSelectedIndex());

            var oView = that.getView();   

			if (!that._valueHelpMaterialDialog) {

                that._valueHelpMaterialDialog = Fragment.load({
                    id: that._m.fragementId.materialDialog,
                    name: that._m.fragementPath.materialDialog,
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }               

            that.setModelNullAndUpdateBindings(materialTable);

            that._valueHelpMaterialDialog.then(function(oDialog) {
				oDialog.open();
            });
		},

        /**
         * 아이템 선택후 가격정보 선택
         * @param {*} radioButtonGroup 
         */
		_openValueHelpMaterialDialog: function (radioButtonGroup) {
            console.log("_openValueHelpMaterialDialog");
            var that = this;
            // open value help dialog filtered by the input value
            //기존 모델 초기화 
            that.setArrayModelNullAndUpdateBindings("materialTable");
		},

        /**
         * MaterialDialog Search 자재코드 검색(자재, 공급)
         * @public 
         * @param {*} oEvent 
         */
		onValueHelpMaterialDialogSearch: function (oEvent) {
            console.log("_onValueHelpMaterialDialogSearch");

            //기존 검색된 모델 값이 존재할경우 삭제 
            //that.getOwnerComponent().setModel(rigthTable, "rigthTable"); 
            //comboBox_vendorView=this._findFragmentControlId(this._m.materialDialog, "comboBox_vendorView").getSelectedKey(), 
            var oModel = this.getModel(),
                _oUiData = this.getModel("_oUiData"),
                materialTable = new JSONModel(),
                that = this;
                
            var oComboBox_materIalView = that._findFragmentControlId(that._m.fragementId.materialDialog, "comboBox_materialView"),
                oCcomboBox_supplierView= that._findFragmentControlId(that._m.fragementId.materialDialog, "comboBox_supplierView"),
                comboBox_materialView=oComboBox_materIalView.getSelectedKey(),
                comboBox_supplierView=oCcomboBox_supplierView.getSelectedKey(),
                input_material_desc=that._findFragmentControlId(that._m.fragementId.materialDialog, "input_material_desc").getValue().toUpperCase(),
                input_supplier_local_name=that._findFragmentControlId(that._m.fragementId.materialDialog, "input_supplier_local_name").getValue().toUpperCase();
                //input_hidden_supplier_english_name=this._findFragmentControlId(this._m.fragementId.materialDialog, "input_supplier_local_name").getValue();
        
             var sFilters = [
                new Filter("tenant_id", FilterOperator.EQ,  that._m.filter.tenant_id)
            ];
            if(comboBox_materialView.length>0){
                sFilters.push(new Filter("material_code", FilterOperator.Contains, comboBox_materialView));
            }
            if(input_material_desc.length>0){
                sFilters.push(new Filter("material_desc", FilterOperator.Contains, input_material_desc));
            }
            if(comboBox_supplierView.length>0){
                sFilters.push(new Filter("supplier_code", FilterOperator.Contains, comboBox_supplierView));
            }
            if(input_supplier_local_name.length>0){
                sFilters.push(new Filter("supplier_local_name", FilterOperator.Contains, input_supplier_local_name));
            }
            oModel.read(this._m.serviceName.materialView, {
                    async: false,
                    filters: sFilters,
                    success: function (rData, reponse) {

                        //가격정보 Vendor 자재코드 자재명 공급업체 공급업체명
                        materialTable.setData(reponse.data.results); 

                        //등록 구분
                        for(var i=0;i<reponse.data.results.length;i++){
                            materialTable.oData[i].itemMode = that._m.itemMode.read;
                            materialTable.oData[i].odataMode = that._m.odataMode.yes;
                            //dev12121715 강제 등록
                            materialTable.oData[i].vendor = that._imsiData.vendor;
                            materialTable.oData[i].vendor_name = that._imsiData.vendor_name;
                            materialTable.oData[i].supplier_code = that._imsiData.supplier_code;
                            materialTable.oData[i].supplier_local_name = that._imsiData.supplier_local_name;

                        }
                        that.getOwnerComponent().setModel(materialTable, "materialTable");                                         
                    }
                });

            // if(_oUiData.getProperty("/radioButtonGroup")==0){

            //     if(comboBox_materialView.length>0){
            //         sFilters.push(new Filter("material_code", FilterOperator.Contains, comboBox_materialView));
            //     }
            //     if(input_material_desc.length>0){
            //         sFilters.push(new Filter("material_desc", FilterOperator.Contains, input_material_desc));
            //     }
  
            //     oModel.read(this._m.serviceName.materialView, {
            //         async: false,
            //         filters: sFilters,
            //         success: function (rData, reponse) {

            //             //가격정보 Vendor 자재코드 자재명 공급업체 공급업체명
            //             materialTable.setData(reponse.data.results); 

            //             //등록 구분
            //             for(var i=0;i<reponse.data.results.length;i++){
            //                 materialTable.oData[i].itemMode = that._m.itemMode.read;
            //                 materialTable.oData[i].odataMode = that._m.odataMode.yes;
            //                 //dev12121715 강제 등록
            //                 materialTable.oData[i].vendor = that._imsiData.vendor;
            //                 materialTable.oData[i].vendor_name = that._imsiData.vendor_name;
            //                 materialTable.oData[i].supplier_code = that._imsiData.supplier_code;
            //                 materialTable.oData[i].supplier_local_name = that._imsiData.supplier_local_name;
            //             }
            //             that.getOwnerComponent().setModel(materialTable, "materialTable");                                         
            //         }
            //     });
            // }else{
  
            //     sFilters.push(new Filter("tenant_id", FilterOperator.Contains, that._m.filter.tenant_id));                
            //     if(comboBox_supplierView.length>0){
            //         sFilters.push(new Filter("supplier_code", FilterOperator.Contains, comboBox_supplierView));
            //     }
            //     if(input_supplier_local_name.length>0){
            //         sFilters.push(new Filter("supplier_local_name", FilterOperator.Contains, input_supplier_local_name));
            //     }

            //     oModel.read(that._m.serviceName.supplierView, {
            //         async: false,
            //         filters: sFilters,
            //         success: function (rData, reponse) {
    
            //        //가격정보 Vendor 자재코드 자재명 공급업체 공급업체명
            //        materialTable.setData(reponse.data.results); 

            //         //등록 구분
            //         for(var i=0;i<reponse.data.results.length;i++){
            //                 materialTable.oData[i].itemMode = that._m.itemMode.read;
            //                 materialTable.oData[i].odataMode = that._m.odataMode.yes;
            //                 //dev12121715 강제 등록
            //                 materialTable.oData[i].vendor = that._imsiData.vendor;
            //                 materialTable.oData[i].vendor_name = that._imsiData.vendor_name;
            //                 materialTable.oData[i].material_code = that._imsiData.material_code;
            //                 materialTable.oData[i].material_desc = that._imsiData.material_desc;

            //             }

            //             that.getOwnerComponent().setModel(materialTable, "materialTable");                                         
            //         }
            //     });
            // }
         
            var oMaterialTableList = new JSONModel([]);
            that.getOwnerComponent().setModel(oMaterialTableList, "materialTableList");

           // 
		},

        /**
         * 소요수량단위
         * @public
         */
        onReqmQuantityUnit : function(oEvent) {
            console.log("onReqmQuantityUnit");
            var obj = oEvent.getSource().oParent.oParent.getBindingContextPath(),
                that = this,
                midList = that.getModel("midList");

            that._selectedIndex = parseInt(obj.substring(1));

            var oView = that.getView();   

			if (!that._valueHelpReqmQuantityUnit) {

                that._valueHelpReqmQuantityUnit = Fragment.load({
                    id: that._m.fragementId.reqmQuantityUnit,
                    name: that._m.fragementPath.reqmQuantityUnit,
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });

            }   
            // that._openValueHelpReqmQuantityUnit();
            var unitOfMeasureView = that.getModel("unitOfMeasureView");
            that.setModelNullAndUpdateBindings(unitOfMeasureView);

            that._valueHelpReqmQuantityUnit.then(function(oDialog) {
                oDialog.open();
                var uom_name = that._findFragmentControlId(that._m.fragementId.reqmQuantityUnit, "searchField_uom_name");    
                uom_name.setValue(midList.oData[that._selectedIndex].reqm_quantity_unit);     
                 that.onUomNameSearch();             
            });
            
  

           
         },

        /**
         * 소요량 단위 검색
         * @param {*} oEvent 
         */
        onUomNameSearch : function (oEvent){
            console.log("onUomNameSearch");
            var unitOfMeasureView = new JSONModel(),            
                that = this,
                oModel = that.getOwnerComponent().getModel(),
                oUnitOfMeasureView = that.getModel("unitOfMeasureView"),                
                searchField_uom_name = that._findFragmentControlId(that._m.fragementId.reqmQuantityUnit, "searchField_uom_name").getValue().toUpperCase(),
                reqmTable= that._findFragmentControlId(that._m.fragementId.reqmQuantityUnit, "reqmTable");             
                
            var andFilter = [
                new Filter("tenant_id", FilterOperator.EQ, that._m.filter.tenant_id),
                new Filter("language_code", FilterOperator.EQ, that._m.filter.language_code)                
            ];

            var orFilter = [                
                new Filter("uom_name", FilterOperator.Contains, searchField_uom_name),
                new Filter("uom_code", FilterOperator.Contains, searchField_uom_name)
            ];
            andFilter.push(new sap.ui.model.Filter(orFilter, false));

            //기존 검색 데이타 초기화
            that.setModelNullAndUpdateBindings(oUnitOfMeasureView);

            oModel.read(that._m.serviceName.unitOfMeasureView, {
                async: false,
                filters: andFilter,
                success: function (rData, reponse) {
                    if(reponse.data.results.length>0){
                        unitOfMeasureView.setData(reponse.data.results); 
                        that.getOwnerComponent().setModel(unitOfMeasureView, "unitOfMeasureView");
                        
                        var oFirstItem = reqmTable.getItems()[0];
                        var venitems=reqmTable.getItems();
                        venitems[0].setSelected(true);
                    }
                }
            });
        },
        /**
         * 소요량 단위 선택 openValueHelp
         */
		_openValueHelpReqmQuantityUnit: function () {
            //기존 모델 초기화 
            var that = this;
            var unitOfMeasureView = that.getModel("unitOfMeasureView");
         
            that.setModelNullAndUpdateBindings(unitOfMeasureView);

            that._valueHelpReqmQuantityUnit.then(function(oDialog) {
                oDialog.open();
            });

		},

        /**
         * 소요량 단위 close
         */
        _closeValueHelpReqmQuantityUnit : function(evt){
            var that = this;
            that._valueHelpReqmQuantityUnit.then(function(oDialog) {
                oDialog.close();
                //oDialog.destroy();
            });             

			//that._valueHelpReqmQuantityUnit.close(); 
        },

        /**
         * 소요량 단위  Apply 선택
         */
        onReqmQuantityUnitApply : function () {
            console.log("onReqmQuantityUnitApply");
            var that = this;
            var mTitle = this.getModel("I18N").getText("/OPTION") + " " + this.getModel("I18N").getText("/CONFIRM");
            var reqmTable =  that._findFragmentControlId(that._m.fragementId.reqmQuantityUnit, "reqmTable"); 
            var midList = that.getModel("midList");
                

            if(reqmTable.getSelectedItems().length<1){
                that._showMessageBox(
                    mTitle,
                    that.getModel("I18N").getText("/NPG00016"),
                    that._m.messageType.Warning,
                    function(){return;}
                );
                return;
            }

            var uom_code = reqmTable.getSelectedItems()[0].getCells()[0].mProperties.text;
            var uom_name = reqmTable.getSelectedItems()[0].getCells()[1].mProperties.text;

            midList.oData[that._selectedIndex].reqm_quantity_unit = uom_code;
            midList.refresh(true);
            that._closeValueHelpReqmQuantityUnit();
		},
		/**
		 * Event handler for Enter Full Screen Button pressed
		 * @public
		 */
        onPageEnterFullScreenButtonPress: function () {
            var sNextLayout = this.getOwnerComponent().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/fullScreen");
            var that = this;
            that.getRouter().navTo("midPage", {
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
            var that = this;
            var sNextLayout = that.getView().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
            that.getRouter().navTo("midPage", {
                layout: sNextLayout,
                tenant_id: that._stenant_id,
                controlOptionCode: that._sControlOptionCode
            });
        },
		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
        onPageNavBackButtonPress: function () {
            console.group("onPageNavBackButtonPress");
            var that = this;
            var sNextLayout = that.getOwnerComponent().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");

            that._onExit();

            that.getRouter().navTo("mainPage", { layout: sNextLayout });
            console.groupEnd();
        },

		/**
		 * Event handler for delete page entity
		 * @public
		 */
        onPageDeleteButtonPress: function () {
            console.group("onPageDeleteButtonPress");
            var that = this;
            var oView = that.getView();
                
            MessageBox.confirm("Are you sure to delete?", {
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        that.getView().getBindingContext().delete('$direct').then(function () {
                            that.onNavBack();
                        }, function (oError) {
                            MessageBox.error(oError.message);
                        });
                    };
                }
            });
            console.groupEnd();
        },


        /**
         * midtable updateFinished
         */
        onMitTableUpdateFinished: function () {
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        readChecklistItemEntity(itemData) {
            var that = this;
            return new Promise(function(resolve, reject) {

                console.log("readChecklistItemEntity Promise filter :", itemData.filter);
                
                that.getModel().read(that._m.serviceName.mIMaterialCodeBOMManagementItem, {
                    filters: itemData.filter,
                    success: function(oData, reponse) {
                        itemData.resultCount = reponse.data.results.length;
                        resolve(itemData);
                    },
                    error: function(oResult) {
                    reject(oResult);
                    }
                });
            });
        },
        /**
         * 자재가 mIMaterialCodeBOMManagementHeaderView 속해 있는지 확인
         * call function onValueHelpMaterialDialogApply
         */
        _checkMIMaterialCodeBOMManagementHeaderViewService : function(tenant_id, material_code, supplier_code){
            console.log("_checkMIMaterialCodeBOMManagementHeaderViewService");
            
            var that = this,
                oModel = that.getOwnerComponent().getModel(),
                oMidList = new JSONModel(),
                oUiData = new JSONModel(),
                sServiceUrl = that._m.serviceName.mIMaterialCodeBOMManagementHeaderView, //read는 master 페이지와 동일하게 사용한다. 
                aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, that._m.filter.tenant_id),
                    new Filter("material_code", FilterOperator.EQ, that._m.filter.material_code),
                    new Filter("supplier_code", FilterOperator.EQ, that._m.filter.supplier_code)
                ];

            oModel.read(sServiceUrl, {
                async: false,
                filters: aFilters,
                success: function (rData, reponse) {
                  
                    if(reponse.data.results.length>0){
                        return reponse.data.results.length;
                    }else{
                        return 0;
                    }
                }
            });
        },

        /**
         * MIMaterialCodeBOMManagementHeader Service Load
         */
        _mIMaterialCodeBOMManagementHeaderServiceLoad : function() {
           console.log("_mIMaterialCodeBOMManagementHeaderServiceLoad");
            var that = this,
                oUiData = new JSONModel(),
                oModel = that.getOwnerComponent().getModel(),
                sServiceUrl = that._m.serviceName.mIMaterialCodeBOMManagementHeader, 
                aFilters = [
                new Filter("tenant_id", FilterOperator.EQ, that._m.filter.tenant_id),
                new Filter("material_code", FilterOperator.EQ, that._m.filter.material_code),
                new Filter("supplier_code", FilterOperator.EQ, that._m.filter.supplier_code),
                new Filter("mi_bom_id", FilterOperator.EQ, that._m.filter.mi_bom_id)          
            ];

            oModel.read(sServiceUrl, {
                async: false,
                filters: aFilters,
                success: function (rData, reponse) {
                    if(reponse.data.results.length>0){
                        var oData = reponse.data.results[0];

                        that._m.mi_bom_id = oData.mi_bom_id;

                        oUiData.setData(oData);
                        that.getOwnerComponent().setModel(oUiData, "oUiData");
                        that.getOwnerComponent().getModel("originalModel").setProperty("/oUiData", $.extend(true, {}, oData));//JSON.parse(JSON.stringify(oData))
                        //that.getOwnerComponent().getModel("oUiData").setData($.extend(true, {}, oData));
                        

                        //item //item 서비스를 사용하지 않고 MIMaterialCodeBOMManagementView 를 이용한다. 12/29
                        that._mIMaterialCodeBOMManagementViewServiceLoad();
                    }
                }
            });
        },

        /**
         * MIMaterialCodeBOMManagementView Service Load
         */
        _mIMaterialCodeBOMManagementViewServiceLoad : function() {
        console.log("_mIMaterialCodeBOMManagementViewServiceLoad");
            var that = this,
                oModel = that.getOwnerComponent().getModel(),
                oMidListModel = new JSONModel(),
                sServiceUrl = that._m.serviceName.mIMaterialCodeBOMManagementView, //read는 master 페이지와 동일하게 사용한다. 
                aFilters = [
                new Filter("tenant_id", FilterOperator.EQ, that._m.filter.tenant_id),
                new Filter("material_code", FilterOperator.EQ, that._m.filter.material_code),
                new Filter("supplier_code", FilterOperator.EQ, that._m.filter.supplier_code),
                new Filter("mi_bom_id", FilterOperator.EQ, that._m.filter.mi_bom_id)          
            ];
            
            oModel.read(sServiceUrl, {
                async: false,
                filters: aFilters,
                success: function (rData, reponse) {

                    if(reponse.data.results.length>0){                        
                        
                        var _deleteItem = that.getModel("_deleteItem");
                        _deleteItem.setProperty("/delData",[]);

                        var oMidList = reponse.data.results;

                        for(var i=0;i<oMidList.length;i++){
                            oMidList[i].itemMode = that._m.itemMode.read;
                            oMidList[i].odataMode = that._m.odataMode.yes;
                        }

                         oMidListModel.setData(oMidList);
                        that.getOwnerComponent().setModel(oMidListModel, "midList");


                        that.getOwnerComponent().getModel("originalModel").setProperty("/midList", $.extend(true, {}, oMidList));//JSON.parse(JSON.stringify(oMidList))
                        //that.getOwnerComponent().getModel("midList").setData($.extend(true, {}, oMidList));
                        
                    }
                }
            });
        },

        /**
         * 자재정보 MIMaterialCodeBOMManagement Read dev121212
         * mIMaterialCodeBOMManagementHeaderView 동일하게 리스트에서 사용 mIMaterialCodeBOMManagement cud에서 사용
         * @private
         */
        _onMidServiceRead : function(){
            console.log("_onMidServiceRead");
            var that = this;
            //header
            that._mIMaterialCodeBOMManagementHeaderServiceLoad();
            
        },     

        /**
         * jsoon model data null initial
         * @private
         */
        _initialModel : function() {
          console.log("_initialModel");
          var that = this;
                var arrayModel = [
                    "oUiData",
                    "_oUi",
                    "_oUiData",
                    "_deleteItem",
                    "_deleteItemOdata",
                    "midList",
                    "oUi",
                    "delData",
                    "materialTable",
                    "oMaterialTableList",
                    "mIMaterialCostInformationView",
                    "mIMatListView",
                    "oMidList",
                    "unitOfMeasureView" 
                ];

              
                that.setArrayModelNullAndUpdateBindings(arrayModel);
        },


        _initialControlValue : function(){
            console.log("_initialControlValue");
            var that = this;
            //that._fragmentDistory();
            
            that.getView().byId("input_base_quantity").setValue("1");
            that.getView().byId("input_processing_cost").setValue("");
            that.getView().byId("input_hidden_material_code").setValue("");
            that.getView().byId("input_hidden_material_desc").setValue("");
            that.getView().byId("input_hidden_supplier_code").setValue("");
            that.getView().byId("input_hidden_supplier_local_name").setValue("");
            that.getView().byId("input_hidden_supplier_english_name").setValue("");
            that.getView().byId("input_material_code").setValue("");

            // var oComboBox_materIalView = this._findFragmentControlId(this._m.fragementId.materialDialog, "comboBox_materialView"),
            //     oComboBox_supplierView = this._findFragmentControlId(this._m.fragementId.materialDialog, "comboBox_supplierView");

            //  oComboBox_materIalView.setSelectedItems([]);
            //  oComboBox_supplierView.setSelectedItems([]);
            // this._findFragmentControlId(this._m.fragementId.materialDialog, "input_material_desc").setValue("")
            // this._findFragmentControlId(this._m.fragementId.materialDialog, "input_supplier_local_name").setValue("");
          
        },

        
        _initialFilter : function(){
            console.log("_initialFilter");

            var that = this;

            that._m.filter.tenant_id = "";
            that._m.filter.material_code = "";
            that._m.filter.supplier_code = "";
            that._m.filter.mi_bom_id = "";
            that._m.filter.mi_material_code = "";
            that._m.filter.currency_uni = "";
            that._m.filter.quantity_unit = "";
            that._m.filter.exchange = "";
            that._m.filter.termsdelv = "";
        },

        _setInit : function(){
            console.log("_setInit");
            var that = this;
            that._initialModel();
            that._initialControlValue();
            that._initialFilter();
        },

        _fnGuid : function(){

            function guid() {
                function s4() {
                    return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            };

            return guid();
        },
        /**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function (oEvent) {
            console.log("_onRoutedThisPage");
            var that = this;
            that._setInit();
            that._onPageClearValidate();

            var _oUiData = this.getModel("_oUiData"),
                oArgs = oEvent.getParameter("arguments"),
                oModel = this.getOwnerComponent().getModel();

                //처음 생성부터 this.getView().getId() 하면 더 간단함.
                 that._m.fragementId.materialDialog = this.getView().getId();
                 that._m.fragementId.materialDetail  = this.getView().getId();      
                 that._m.fragementId.reqmQuantityUnit = this.getView().getId();  

                that._m.filter.tenant_id = oArgs.tenant_id;
                that._m.filter.material_code = oArgs.material_code;
                that._m.filter.supplier_code = oArgs.supplier_code;
                that._m.filter.mi_bom_id = oArgs.mi_bom_id;
    
            if (that._m.filter.material_code == "new") {
                console.log("=============== new item ===============");
                var oModel = that.getModel("midList");   

                if(oModel){
                    oModel.setData(null);     
                    oModel.updateBindings(true);
                }
                
                that._fnSetCreateMode();

                var oUiData = new JSONModel({pcst_currency_unit:"KRW", base_quantity_unit: ""});
                that.getOwnerComponent().setModel(oUiData, "oUiData");

            }else{

                
                if(that._m.filter.material_code.length>0){
                
                    that._onMidServiceRead();

                    //항목 추가나  수정시 사용.
                    //this._onHiddenMidServiceRead();

                    that._fnSetReadMode();
                }
                else {
                    that._fnSetEditMode();
                }
            } 
        
            //자재정보 MIMaterialCodeBOMManagement Read

       //this.getView().setBusy(false);            
        },

       /**
         * Read, Edit 버튼 토글 
         * @public
         */
        onRead : function () {
            var that = this;
            that._fnSetReadMode(); 
        },

        /**
         * 작업 취소? 리스트 이동..
         */
        onCancel : function () {
            var that = this;
            var oUiData = this.getOwnerComponent().getModel("originalModel").getProperty("/oUiData");                            
            var aMidList = this.getOwnerComponent().getModel("originalModel").getProperty("/midList");
            var bCreateMode = this.getModel("oUi").getProperty("/createMode");
            MessageBox.confirm(that.getModel("I18N").getText("/NPG00013"), {
                title : that.getModel("I18N").getText("/CANCEL"),
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        if(bCreateMode){
                            var sNextLayout = that.getView().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
                            that._onExit();
                            that.getRouter().navTo("mainPage", { layout: sNextLayout });
                         }else{
                             
                            that.getOwnerComponent().getModel("oUiData").setData(oUiData);
                            that.getOwnerComponent().getModel("midList").setData(aMidList);
                            this._fnSetReadMode();
                         }                         
                    }else{
                        return;
                    }
                }.bind(this)
            });            
        },

        /**
         * Read, Edit 버튼 토글 
         * @public
         */
        onEdit: function () {
            var that = this;
            that._fnSetEditMode();         
        },

        /**
         * 화면에서 버튼 이벤트 수정모드 전환
         * @public
         */        
        onCopy : function () {
            console.log("onCopy");
            var that = this;
            var oUiData = that.getModel("oUiData");

            that._fnSetCopyMode();  

            that.getView().byId("input_base_quantity").setValue(oUiData.getProperty("/base_quantity"));
            that.getView().byId("input_processing_cost").setValue(oUiData.getProperty("/processing_cost"));

        },

        /**
         * 항목 선택
         */
        onMaterialChange : function(oEvent){
            var obj = oEvent.getSource().oParent.oParent.getBindingContextPath(),
                midList =this.getModel("midList"),
                that = this;

                that._selectedIndex = parseInt(obj.substring(1)); 

                that.onMaterialDetail(true);
        },

        /**
         * 시황자제 및 가격정보 선택
         * @public
         */
        onMaterialDetail : function (bflag) {
            console.log("call funtion onMaterialDetail");
            var that = this;
            var oUi = that.getModel("oUi");
            var oView = that.getView();   
            var midList =this.getModel("midList");

            // if( that.getView().byId("input_hidden_material_code").getValue().length < 0 ) {
            //     this._showMessageBox(
            //         "",
            //         that.getModel("I18N").getText("/NCM01010"),
            //         that._m.messageType.Warning,
            //         function(){return;}
            //     );
            //     return;
            // }

			if (!that._valueHelpMaterialDetail) {

                that._valueHelpMaterialDetail = Fragment.load({
                    id: that._m.fragementId.materialDetail,
                    name: that._m.fragementPath.materialDetail,
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }          

            var arrayModel = [               
                        "mIMaterialCostInformationView",
                        "mIMatListView"
                    ];
          
            that.setArrayModelNullAndUpdateBindings(arrayModel);

            that._valueHelpMaterialDetail.then(function(oDialog) {

                oDialog.open();

                var searchField_material_code = that._findFragmentControlId(that._m.fragementId.materialDetail, "searchField_material_code");
                var searchField_category_name = that._findFragmentControlId(that._m.fragementId.materialDetail, "searchField_category_name");

                oUi.setProperty("/changeItem", bflag);

                if(bflag){
                    var searchField_material_code = that._findFragmentControlId(that._m.fragementId.materialDetail, "searchField_material_code");
                    searchField_material_code.setValue(midList.oData[that._selectedIndex].mi_material_code);            
                    
                    that.onMaterialSearch();
                }

                if(!bflag){
                    searchField_material_code.setValue("");
                    searchField_category_name.setValue("");
                }                
            });            

        },

        /**
         * 시황자재 선택, 시황자재 가겨정보 선택 Fragment open
         * @private
         */
        _openValueHelpMaterialDetail : function () {

            //기존 load 모델 초기화
            var that = this;
            var arrayModel = [               
                "mIMaterialCostInformationView",
                "mIMatListView"
            ];
          
            that.setArrayModelNullAndUpdateBindings(arrayModel);
            that._valueHelpMaterialDetail.then(function(oDialog) {
                oDialog.open();
            });
            //that._valueHelpMaterialDetail.open();
        },
       
        /**
         * Exit
         * @private
         */
        _onExit: function () {
            var that = this;
            that._setInit();
                       
            // this.getView().getModel('oUi').setProperty("/isEnabled", true);
        },

        _fragmentDistory : function(){
            var that = this;

            // if (that._valueHelpMaterialDetail) {
            //     that._valueHelpMaterialDetail.destroy(true);
            // }
            // if (that._valueHelpMaterialDialog) {
            //     that._valueHelpMaterialDialog.destroy(true);
            // }
            // if (that._valueHelpReqmQuantityUnit) {
            //     that._valueHelpReqmQuantityUnit.destroy(true);
            // }

        },

        _handleCreateSuccess: function (oData) {
            console.log("_handleCreateSuccess");
            var that = this;
            var mTitle = that.getModel("I18N").getText("/SAVE") + " " + that.getModel("I18N").getText("/SUCCESS");
            MessageBox.show(that.getModel("I18N").getText("/NCM01001"), {
                icon: MessageBox.Icon.SUCCESS,
                title: mTitle,
                actions: [MessageBox.Action.OK],
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        var sNextLayout = that.getView().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
                        that._onExit();
                        that.getRouter().navTo("mainPage", { layout: sNextLayout });
                    }
                }
            });
            //MessageToast.show("저장에 성공 하였습니다.");
        },

        _findFragmentControlId : function (fragmentID, controlID) {
            return sap.ui.core.Fragment.byId(fragmentID, controlID);
        },

        /**
         * Fragment  ============================================================ 
         */

        /**
         * 시황자재 선택 자재 이름 및 코드 검색 / 카테고리 이름 검색
         * @param {Event} oEvent 
         */
        onMaterialSearch : function (oEvent) {
            console.log("onMaterialSearch");
            var oModel = this.getOwnerComponent().getModel(),
                aFilter = [],
                that = this,
                searchField_material_code = that._findFragmentControlId(that._m.fragementId.materialDetail, "searchField_material_code").getValue().toUpperCase(),
                searchField_category_name = that._findFragmentControlId(that._m.fragementId.materialDetail, "searchField_category_name").getValue().toUpperCase(),
                oTable = that._findFragmentControlId(that._m.fragementId.materialDetail, "leftTable");
                
           
            var andFilter = [
                new Filter("tenant_id", FilterOperator.EQ, that._m.filter.tenant_id)
            ];
            var orFilter = [];
            
            if(searchField_category_name.length>0){
                orFilter.push(new Filter("category_name", FilterOperator.Contains, searchField_category_name));
            }
            if(searchField_material_code.length>0){
                orFilter.push(new Filter("mi_material_code", FilterOperator.Contains, searchField_material_code));
                orFilter.push(new Filter("mi_material_name", FilterOperator.Contains, searchField_material_code));
            }

            if(orFilter.length>0){
                andFilter.push(new sap.ui.model.Filter(orFilter, false));
            }

            var sServiceUrl = that._m.serviceName.mIMatListView;
            var leftTable =  that._findFragmentControlId(that._m.fragementId.materialDetail, "leftTable");            
            var mIMatListView = new JSONModel();
            oModel.read(sServiceUrl, {
                async: false,
                filters: andFilter,
                success: function (rData, reponse) {

                    //console.log( sServiceUrl + " json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));
                    mIMatListView.setData(reponse.data.results);

                    that.getOwnerComponent().setModel(mIMatListView, "mIMatListView");  
                  
                    var oFirstItem = leftTable.getItems()[0];

                    var venitems=leftTable.getItems();

                    if(venitems.length>0){
                        venitems[0].setSelected(true);

                        that.onSelectedLeftTableItem();
                    }

                    return reponse.data.results.length;             
                }
            });
        },

  
        onRightTableUpdateFinished : function () {
            console.log("onRightTableUpdateFinished");
            var that = this;
            that._setSelectedRightTableItem();
        },
          
        _setSelectedRightTableItem : function (){
            console.log("_setSelectedRightTableItem");
            var that = this;
            var rightTable = that._findFragmentControlId(this._m.fragementId.materialDetail, "rightTable"),
                midList =that.getModel("midList"),
                oUi = that.getModel("oUi");
            
            for (var idx = 0; idx < rightTable.getItems().length; idx++) {
                var items = rightTable.getItems()[idx];
                var currency_unit = items.getCells()[0].mProperties.text;
                var quantity_unit = items.getCells()[1].mProperties.text;
                var exchange = items.getCells()[2].mProperties.text;
                var termsdelv = items.getCells()[3].mProperties.text;

                if(oUi.getProperty("/changeItem")){
                    if(midList.oData[that._selectedIndex]){
                        if(currency_unit==midList.oData[that._selectedIndex].currency_unit &&
                            quantity_unit==midList.oData[that._selectedIndex].quantity_unit &&
                            exchange==midList.oData[that._selectedIndex].exchange &&
                            termsdelv==midList.oData[that._selectedIndex].termsdelv
                        ){
                            items.setSelected(true);
                        }
                    }
                }
    
            }
        },

        /**
         * 시황자재 > 가격정보 선택
         * @public
         */
        onSelectedLeftTableItem : function (oEvent) {
            console.log("onSelectedLeftTableItem");
            var that = this;
            var oModel = that.getOwnerComponent().getModel(),
                leftTable =  that._findFragmentControlId(this._m.fragementId.materialDetail, "leftTable"),
                aFilter = [],
                that = that;
            
            var tenant_id = leftTable.getSelectedItems()[0].getCells()[0].mProperties.text;
            var mi_material_code = leftTable.getSelectedItems()[0].getCells()[2].mProperties.text; 
            
           
            aFilter.push(new Filter("tenant_id", FilterOperator.EQ, tenant_id));
            aFilter.push(new Filter("mi_material_code", FilterOperator.EQ, mi_material_code));
            
            
            var sServiceUrl = that._m.serviceName.mIMaterialCostInformationView;
            
            var mIMaterialCostInformationView = new JSONModel();
            oModel.read(sServiceUrl, {
                async: false,
                filters: aFilter,
                success: function (rData, reponse) {
                    //console.log( sServiceUrl + " json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));
                    mIMaterialCostInformationView.setData(reponse.data.results);
                    that.getOwnerComponent().setModel(mIMaterialCostInformationView, "mIMaterialCostInformationView");
                }
            });
        },


        /**
         * 시황자재 > 가격정보 에서 Apply 선택
         * @param {Event} oEvent  아이템 선택 후 등록 
         */
        onMaterialDetailApply : function () {
            console.log("onMaterialDetailApply");
            var that = this;
            var leftTable =  that._findFragmentControlId(that._m.fragementId.materialDetail, "leftTable"), 
                rightTable = that._findFragmentControlId(that._m.fragementId.materialDetail, "rightTable"),
                oModel = that.getModel(),
                oUi = that.getModel("oUi"),
                mTitle = that.getModel("I18N").getText("/OPTION") + " " + that.getModel("I18N").getText("/CONFIRM");            

            if(rightTable.getSelectedItems().length<1){
                that._showMessageBox(
                    mTitle,
                    that.getModel("I18N").getText("/NPG00016"),
                    that._m.messageType.Warning,
                    function(){return;}
                );
                return;
            }

            var leftTablePath = leftTable.getSelectedItems();

            var tenant_id = leftTable.getSelectedItems()[0].getCells()[0].mProperties.text;
            var category_code = leftTable.getSelectedItems()[0].getCells()[1].mProperties.text; 
            var mi_material_code = leftTable.getSelectedItems()[0].getCells()[2].mProperties.text; 
            var mi_material_name = leftTable.getSelectedItems()[0].getCells()[3].mProperties.text; //시황자재명
            var category_name = leftTable.getSelectedItems()[0].getCells()[4].mProperties.text; 

            var currency_unit = rightTable.getSelectedItems()[0].getCells()[0].mProperties.text;
            var quantity_unit = rightTable.getSelectedItems()[0].getCells()[1].mProperties.text;
            var exchange = rightTable.getSelectedItems()[0].getCells()[2].mProperties.text;
            var termsdelv = rightTable.getSelectedItems()[0].getCells()[3].mProperties.text;

            //자재정보 선택을 참조한다. 
            var material_code = that.getView().byId("input_hidden_material_code").getValue();
            var material_desc = that.getView().byId("input_hidden_material_desc").getValue(); //자재명
            var supplier_code = that.getView().byId("input_hidden_supplier_code").getValue();
            var supplier_local_name = that.getView().byId("input_hidden_supplier_local_name").getValue();
            var supplier_english_name = that.getView().byId("input_hidden_supplier_english_name").getValue();

 
            var items = {
                "tenant_id": tenant_id,
                "material_code": material_code,
                "material_desc": material_desc,
                "supplier_code": supplier_code,
                "supplier_local_name": supplier_local_name,
                "supplier_english_name": supplier_english_name,
                "mi_material_code": mi_material_code,
                "mi_material_name": mi_material_name,
                "category_code": category_code,
                "category_name": category_name,
                "base_quantity": "-1",  
                "processing_cost": "-1", 
                "pcst_currency_unit": "-1", 
                "currency_unit": currency_unit,
                "quantity_unit": quantity_unit,
                "exchange": exchange,
                "termsdelv": termsdelv,
                "mi_bom_id": that._m.mi_bom_id,
                "use_flag": true,
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date(),
                "create_user_id": that._sso.user.id,
                "update_user_id": that._sso.user.id,
                "system_create_dtm": new Date(),
                "system_update_dtm": new Date(),
                "itemMode" : that._m.itemMode.create,
                "odataMode" : that._m.odataMode.yes     ,
                "reqm_quantity_unit" : that.getView().getModel("NewMaterial").oData.uom_code // 20210223 kbg 추가
            };
            // 
            //등록되어 있는 자재인지 확인한다. 
            
            var andFilter = [];
            andFilter.push(new Filter("tenant_id", FilterOperator.EQ, items.tenant_id));
            andFilter.push(new Filter("mi_material_code", FilterOperator.EQ, items.mi_material_code));
            andFilter.push(new Filter("mi_bom_id", FilterOperator.EQ, items.mi_bom_id));

            that.getModel().read(that._m.serviceName.mIMaterialCodeBOMManagementItem, {
                async: false,
                filters: andFilter,                
                success: function(oData, reponse) {
                
                    //if(reponse.data.results.length>0){
 
                        that.onMidListItemAdd(items);
                        //that.onMaterialDetailClose();
                       
                   //}         
                },
                error: function(data){
                    console.log('error',data);
                },
            });
         
        },
        

        // itemChecklistEntity: function(andFilter) {
        //     var that = this;
                      
        //     return new Promise(
        //       function(resolve, reject) {

        //         that.getModel().read(that._m.serviceName.mIMaterialCodeBOMManagementItem, {
        //             filters:andFilter,
        //             success: function(oData, reponse) {
        //                 resolve(oData);
        //             },
        //             error: function(oResult) {
        //                 reject(oResult);
        //             }
        //         });

        //     });
        // },

        // createItemCheckAction: function(values) {
        //     var oData  = values[0].results;
        //     var oModel = this.getModel();
        //     var oUi = this.getModel("oUi");
        //     var that = this;


        //     if(oData.length>0){
        //         that._showMessageToast("이미 등록된 항목 입니다.");
        //     }else{
               
        //         that.onMidListItemAdd(items);
        //         that.onMaterialDetailClose();                        
        //     }
        // },

        /**
         * 자재코드/서플라이어 검색후 Dialog Apply 
         */
        onValueHelpMaterialDialogApply : function () {
            console.log("onValueHelpMaterialDialogApply");
            var that = this;
            var oTable = that._findFragmentControlId(that._m.fragementId.materialDialog, "materialTable"),
                mTitle = that.getModel("I18N").getText("/OPTION") + " " + that.getModel("I18N").getText("/CONFIRM"),              
                oSelected = oTable.getSelectedContexts();

            if(oSelected.length<1){
                that._showMessageBox(
                    mTitle,
                    that.getModel("I18N").getText("/NPG00016"),
                    that._m.messageType.Warning,
                    function(){return;}
                );
                return;
            }

            // 20210223 kbg 추가
            // this.MaterialModel = new JSONModel();
            var oPath = oTable.getSelectedContextPaths();
            this.oMaterialData =  oTable.getModel("materialTable").getProperty(oPath[0]);

            var aSelectedItems = oTable.getSelectedItems();
            that._MaterialApply(aSelectedItems);
            
        },

        _MaterialApply : function(aSelectedItems){

            // var vendor = aSelectedItems[0].getCells()[0].getText(),
            //     vendor_name= aSelectedItems[0].getCells()[1].getText(),
            //     material_code= aSelectedItems[0].getCells()[2].getText(),
            //     material_desc= aSelectedItems[0].getCells()[3].getText(),
            //     supplier_code= aSelectedItems[0].getCells()[4].getText(),
            //     supplier_local_name= aSelectedItems[0].getCells()[5].getText();

            //20210223 kbg 수정
            var vendor = aSelectedItems[0].getCells()[0].getText(),
                vendor_name= aSelectedItems[0].getCells()[1].getText(),
                material_code= aSelectedItems[0].getCells()[3].getText(), 
                material_desc= aSelectedItems[0].getCells()[4].getText(),
                supplier_code= aSelectedItems[0].getCells()[5].getText(),
                supplier_local_name= aSelectedItems[0].getCells()[6].getText();

            
            
            var that = this;
             

            function MakeQuerablePromise(promise) {
                if (promise.isResolved) return promise;

                var isPending = true;
                var isRejected = false;
                var isFulfilled = false;
            
                var result = promise.then(
                    function(v) {
                        isFulfilled = true;
                        isPending = false;
                        return v; 
                    }, 
                    function(e) {
                        isRejected = true;
                        isPending = false;
                        throw e; 
                    }
                );
            
                result.isFulfilled = function() { return isFulfilled; };
                result.isPending = function() { return isPending; };
                result.isRejected = function() { return isRejected; };
                return result;
            }

            //아이템 조사와 Header 최종 조사 내용을 실행한다. 
            function readChecklistItemEntity(ofilter) {
                return new Promise(function(resolve, reject) {
                    that.getModel().read(that._m.serviceName.mIMaterialCodeBOMManagementHeader, {
                        filters: ofilter,
                        success: function(oData) {		
                            resolve(oData);
                        },
                        error: function(oResult) {
                            reject(oResult);
                        }
                    });
                });
            };


            var filters = [
                new Filter("tenant_id", FilterOperator.EQ, that._m.filter.tenant_id),
                new Filter("material_code", FilterOperator.EQ, material_code),
                new Filter("supplier_code", FilterOperator.EQ, supplier_code)
            ];

            var readChecklistPromise =  MakeQuerablePromise(readChecklistItemEntity(filters));

            readChecklistPromise.then(function(data){

                if(readChecklistPromise.isFulfilled()){
                           
                    if(data.results.length>0){
                    //생성할 데이타가 이미 존재 합니다.
                        that._showMessageToast(that.getModel("I18N").getText("/NCM01011"));
                    }else{
                        var sourceName = "[" + material_code + "] ";
                        sourceName = sourceName.concat(material_desc);
                        sourceName = sourceName.concat(" / ");
                        sourceName = sourceName.concat(" [");
                        sourceName = sourceName.concat(supplier_code);
                        sourceName = sourceName.concat("] ");
                        sourceName = sourceName.concat(supplier_local_name);
            
                        var input_material_code = that.getView().byId("input_material_code");
                        input_material_code.setValue(sourceName);
                        input_material_code.setValueState(ValueState.None);
            
                        var input_hidden_material_code = that.getView().byId("input_hidden_material_code");
                        var input_hidden_material_desc = that.getView().byId("input_hidden_material_desc");
                        var input_hidden_supplier_code = that.getView().byId("input_hidden_supplier_code");
                        var input_hidden_supplier_local_name = that.getView().byId("input_hidden_supplier_local_name");
                        //var input_hidden_supplier_english_name = this.byId("input_hidden_supplier_english_name");                                                
            
                        input_hidden_material_code.setValue(material_code);
                        input_hidden_material_desc.setValue(material_desc);
                        input_hidden_supplier_code.setValue(supplier_code);
                        input_hidden_supplier_local_name.setValue(supplier_local_name);

                        // 20210223 추가 kbg _oUiData>/uom_code
                        that.getView().setModel(new JSONModel(that.oMaterialData), "NewMaterial");
                        that.getView().getModel("oUiData").setProperty("/base_quantity_unit" ,that.oMaterialData.uom_code );
                        debugger;
                        // this.getView().getModel("_oUiData").oData.uom_code = 

                        
                        that.onMaterialDialog_close();
                    }
                }
            });

        },


        /**
         * 자재 및 서플라이어 검색창 Close
         */
        onMaterialDialog_close : function (){
            var that = this;
            that._valueHelpMaterialDialog.then(function(oDialog) {
                oDialog.close();
                //song Fragment destory (팝업창 소거하지 않을경우 페이지 이동하더래도 남아 있는 컨트롤 객체로 에러 방지)
                //oDialog.destroy();
            });                    
           // that.getView().byId("materialDialog").close();
           // that._valueHelpMaterialDialog.close();
        },
        /**     
         * 시황재재 선택 및 가격정보 선택 페이지 close
         * @public
         */
        onMaterialDetailClose : function() {
            var that = this;
            that._valueHelpMaterialDetail.then(function(oDialog) {
                oDialog.close();
                //oDialog.destroy();
            }); 
            //that.byId("materialDetail").close();
        },
        
        /**
         * 
         * 시황자재 리스트 아이템 추가. 
         * @public
         */
        onMidListItemAdd : function(items){
            
            var midList = this.getModel("midList"),
                oUi= this.getModel("oUi"),
                that = this;
            
            var bCheck = true;

            //Create
            if(midList==null){
                var omidList = new JSONModel();
                omidList.setData([items]);
                that.setModel(omidList,"midList");                
                 that.onMaterialDetailClose();
                return;
            }

            if(midList.oData!=null){
                for(var i=0;i<midList.oData.length;i++){
                    if(midList.oData[i].tenant_id == items.tenant_id  &&
                        midList.oData[i].mi_material_code == items.mi_material_code  &&
                        midList.oData[i].mi_bom_id == items.mi_bom_id 
                        ){
                            //추가일경우
                            if(!oUi.getProperty("/changeItem")){
                               bCheck = false; 
                            }
                        }
                }
                //oUi.getProperty("/changeItem") == true && bCheck == true && oUi.getProperty("/editMode") == true
                //item Update 시황자재에서 아이템 업데이트를 사용할때 사용
                if(oUi.getProperty("/changeItem") == true){
                    that.onMidListItemUpdate(items);
                    that.onMaterialDetailClose();
                    return;
                }else{
                    if(!bCheck){
                        that._showMessageToast(that.getModel("I18N").getText("/NPG00022"));
                    }
                }

            }else{
                

              
                var omidList = new JSONModel();
                omidList.setData([items]);
                that.setModel(omidList,"midList");
                that.onMaterialDetailClose();
                return;
                
            }

            // 20210223 kbg 추가
            items.uom_code = this.getView().getModel("NewMaterial").oData.uom_code;
            // items.base_quantity_unit = 

            if(bCheck){
                midList.oData.push(items);
                midList.refresh(true);
                that.onMaterialDetailClose();
                
            }
            that.onMaterialDetailClose();
        },

        onMidListItemUpdate : function (items) {
            console.log("onMidListItemUpdate");
            var that = this;
            var midList = that.getModel("midList");
           
            if( midList.oData[that._selectedIndex] ){
                midList.oData[that._selectedIndex].currency_unit = items.currency_unit;
                midList.oData[that._selectedIndex].quantity_unit = items.quantity_unit;
                midList.oData[that._selectedIndex].exchange = items.exchange;
                midList.oData[that._selectedIndex].termsdelv = items.termsdelv;
                
                midList.refresh(true);
                that.onMaterialDetailClose();
            }

        },        

        /**
         * midTable 항목(열) 삭제 
         * @public 
         */
        onMidListItemDelete : function () {
            console.log("onMidListItemDelete");
            
            var that = this,
                oModel = that.getModel("midList"),
                _deleteItem = that.getModel("_deleteItem"),                
                oTable = that.getView().byId("midTable"),
                oSelected = oTable.getSelectedContexts(),
                mTitle = that.getModel("I18N").getText("/OPTION") + " " + that.getModel("I18N").getText("/CONFIRM");
                
            if(oSelected.length<1){
                this._showMessageBox(
                    mTitle,
                    that.getModel("I18N").getText("/NCM01010"),
                    that._m.messageType.Warning,
                    function(){return;}
                );
                return;
            }
            that._setBusy(true);

            var _deleteItemOdata = _deleteItem.getProperty("/delData");
            
            function fnUndefined(t){
                if (t === undefined) return true;
                else return false;
            }

            for(var i=0;i<oSelected.length;i++){

                var idx = parseInt(oSelected[i].sPath.substring(oSelected[i].sPath.lastIndexOf('/') + 1));
                if(oModel.oData[idx].itemMode == that._m.itemMode.read){
                    _deleteItemOdata.push(oModel.oData[idx]);
                }
            }

            _deleteItem.setProperty("/delData", _deleteItemOdata);

            for ( var i = oSelected.length - 1; i >= 0; i--) {

                if(!fnUndefined(oSelected[i])){
                    var idx = parseInt(oSelected[i].sPath.substring(oSelected[i].sPath.lastIndexOf('/') + 1));                    
                    oModel.oData.splice(idx, 1); 
                }
            }
                      
            that._setBusy(false);
            oTable.removeSelections();
            oTable.getBinding("items").refresh();
            oModel.refresh(true);               
        },

        /**
         * Odata Create, Update, Delete  ============================================================ 
         */
        /**
         * MESSAGE
         * @param {String} title 
         * @param {String} content 
         * @param {sap.ui.core.MessageType} type 
         * @param {function} closeEvent 
         */
        _showMessageBox : function(title, content, type, closeEvent){
            MessageBox.show(content, {
                icon: type,
                title: title,
                actions: [MessageBox.Action.OK],
                styleClass: "sapUiSizeCompact",
                onClose: closeEvent
            });
        },

        /**
         *MessageToast 
         * @param {*} content 
         */
        _showMessageToast : function(content){
            MessageToast.show(content);
        },        

        /**
         * Validate
         * @private 
         */
        _onPageValidate: function(){
            var that = this;
            var _oUi = that.getModel("oUi"),
                bCheckValidate = true;

            if(_oUi.getProperty("/createMode")==true || _oUi.getProperty("/copyMode")==true){
                bCheckValidate =  that.validator.validate(that.byId(that._m.page));
                if(bCheckValidate) {
                    that.validator.clearValueState(that.byId(that._m.page));
                }else{
                    return false;
                }
            }
            
            bCheckValidate =  that.validator.validate(that.byId("midTable"));
            if(bCheckValidate){
                that.validator.clearValueState(that.byId("midTable"));
            }else{
                return false;
            }
            return bCheckValidate;
        },

        /**
         * midTable required live check
         */
        onRequiredCheckTable : function() {  
            var that = this;          
            //if(this.validator.validate(this.byId("midTable"))){
                that.validator.clearValueState(that.byId("midTable"));
           // }
        },
        /**
         * Clear Validate
         * @private 
         */
        _onPageClearValidate: function(){
            var that = this; 
            that.validator.clearValueState(that.byId("page"));
            that.validator.clearValueState(that.byId("midTable"));
        },
        
        _guidFragmentId : function(){

            function guid() {
                function s4() {
                    return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
                }
                return s4() + s4();
            };

            return guid();
              
        },

        /**
         * 필수값 체크
         * @private
         */
        _checkData : function(){
            console.log("call function ==================== _checkData : function(){====================");
            var that = this;
            var oUi = that.getModel("oUi"),
                bValueCheckFlag = true;

            var oTable = that.getView().byId("midTable");

            var tableCoutnt = 0;

            if(oTable.getItems().length<1){
                 that._showMessageToast(that.getModel("I18N").getText("/EPG00013")); 
                bValueCheckFlag  =false;                              
                return false;
            }

            for (var idx = 0; idx < oTable.getItems().length; idx++) {
                
                var items = oTable.getItems()[idx];

                //6 소요량 단위  소요량  사용여부
                // var reqm_quantity_unit = items.getCells()[5].mAggregations.items[0].mProperties.value,
                var reqm_quantity_unit = items.getCells()[5].mAggregations.items[0].mProperties.text, //20210223 kbg 수정
                    reqm_quantity = items.getCells()[6].mAggregations.items[0].mProperties.value,
                    use_flag = items.getCells()[7].mAggregations.items[0].mProperties.selectedKey;

                if(reqm_quantity_unit.length<1){
                    that._showMessageToast(that.getModel("I18N").getText("/NPG00005"));
                    bValueCheckFlag  =false;
                    return false;
                }

                if(reqm_quantity.length<1){
                    that._showMessageToast(that.getModel("I18N").getText("/NPG00005"));
                    bValueCheckFlag  =false;
                    return false;
                }

                // if(use_flag.length<1){
                //     that._showMessageToast(that.getModel("I18N").getText("/NPG00001"));
                //     bValueCheckFlag  =false;
                //     return false;
                    
                // }
                tableCoutnt++;
            }
            if(tableCoutnt<1){

                that._showMessageToast(that.getModel("I18N").getText("/NPG00024"));
                bValueCheckFlag = false;
            } 

            return bValueCheckFlag;

        },
        /**
          * 버튼 액션 저장
          */
        onSaveAction : function(){
            console.log("call function ==================== onMidSave ====================");
            // this.getView().getModel().attachPropertyChange(this._propertyChanged.bind(this));
             var that = this;
             var oUi = that.getModel("oUi");
             var bCreateFlag = oUi.getProperty("/createMode");
             var bCopyFlag = oUi.getProperty("/copyMode");
 
             var bValidate = that._onPageValidate();
             console.log("bValidate", bValidate);

             if(!bValidate){
                 return false;
             }

            if(!that._checkData()){
                return false;
            }

            if(bCreateFlag){

                    MessageBox.confirm(that.getModel("I18N").getText("/NPG00014"), {
                        title : "Create",
                        initialFocus : sap.m.MessageBox.Action.CANCEL,
                        onClose : function(sButton) {
                            if (sButton === MessageBox.Action.OK) {
                                that._onSave();
                            }else{
                                return;
                            }
                        }.bind(this)
                    });
               
             }
             else if(bCopyFlag){

                MessageBox.confirm(that.getModel("I18N").getText("/NPG00025"), {
                    title : that.getModel("I18N").getText("/NPG00026"),
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            that._onSave();
                        }else{
                            return;
                        }
                    }.bind(this)
                });
             }
             else{
                MessageBox.confirm(that.getModel("I18N").getText("/NPG00007"), {
                    title : that.getModel("I18N").getText("/UPDATE"),
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            that._onSave();
                        }else{
                            return;
                        }
                    }.bind(this)
                });
            }
        },

         /**
          * 저장
          */
         _onSave: function () {

            console.log("call function ==================== _onSave ====================");
            var that = this;
            var oUi = this.getModel("oUi"),
                bCreateFlag = oUi.getProperty("/createMode"),
                bCopyFlag = oUi.getProperty("/copyMode"),
                bEditFlag = oUi.getProperty("/editMode"),                
                oModel = that.getModel(),
                midList = that.getModel("midList"),
                updateHeader = 0, 
                createHeader = 0,
                updateItem = 0, 
                createItem = 0,
                copyBomId = "" ,
                createBomId = "",
                deleteItem = 0;
                //that._setBusy(true);

            if(bCreateFlag==true || bCopyFlag ==true){
                createBomId = that._fnGuid();
            }


            var _headerCount = 0;
            for(var i=0;i<midList.oData.length;i++){
                
                if((typeof midList.oData[i].use_flag)=='string'){
                    midList.oData[i].use_flag = midList.oData[i].use_flag ==="true" ?  true: false;
                }

                //Crate , Copy
                if(bCreateFlag==true || bCopyFlag ==true){
                    //material_code, supplier_code, 기준수량, 가공비, 가공비 통화
                    midList.oData[i].material_code = that.byId("input_hidden_material_code").getValue(),
                    midList.oData[i].supplier_code = that.byId("input_hidden_supplier_code").getValue(),
                    midList.oData[i].base_quantity = that.byId("input_base_quantity").getValue(),
                    midList.oData[i].base_quantity_unit = that.byId("input_base_quantity_unit").getValue(),//that.getView().getModel("NewMaterial").getData().uom_code,//
                    midList.oData[i].processing_cost = that.byId("input_processing_cost").getValue(),
                    midList.oData[i].pcst_currency_unit = that.byId("comboBox_pcst_currency_unit").getSelectedKey();
                    midList.oData[i].mi_bom_id =  createBomId;
 
                    if(_headerCount==0){
                        if(that._fnCreateEntryHeader(oModel, midList.oData[i])){
                            createHeader++;
                            _headerCount = 1;
                        }
                    }

                    if(that._fnCreateEntryItem(oModel, midList.oData[i])){
                        createItem++;
                    }
                }
                else {  //Update
                    midList.oData[i].pcst_currency_unit = that.byId("comboBox_pcst_currency_unit").getSelectedKey();   
                    midList.oData[i].processing_cost = that.byId("input_processing_cost").getValue();
                    
                    var _deleteItem = that.getModel("_deleteItem"),                        
                        _deleteItemOdata = _deleteItem.getProperty("/delData");
                           
                    if(_deleteItemOdata.length>0){
                        if(midList.oData[i].itemMode==this._m.itemMode.create){
                            // 자재를 삭제후 다시 동일 자재를 등록하고자 할경우
                            for(var idx=0;idx<_deleteItemOdata.length;idx++){

                                if(_deleteItemOdata[idx].mi_material_code == midList.oData[i].mi_material_code){
                                    midList.oData[i].itemMode=this._m.itemMode.read; //Delete-> Insert보다 수정모드로 변경하여 처리 함
                                    _deleteItemOdata.splice(idx, 1);
                                    break;
                                }
                            }
                        }
                    }

                    if(_headerCount==0){

                        midList.oData[i].material_code = that._m.filter.material_code;
                        midList.oData[i].supplier_code = that._m.filter.supplier_code;
                        midList.oData[i].mi_bom_id = that._m.filter.mi_bom_id;
                        if(that._fnUpdateHeader(oModel, midList.oData[i])){
                            updateHeader++; 
                            _headerCount=1;   
                        }
                    }

                    if((midList.oData[i].itemMode==that._m.itemMode.create))
                    {
                        if(that._fnCreateEntryItem(oModel, midList.oData[i])){
                            createItem++;
                        }

                    }else{                       
 
                       
                        if(that._fnUpdateItem(oModel, midList.oData[i])){
                            updateItem++;
                        }
                    }
                }    
            }

            deleteItem = that._deleteMIMaterialCodeBOMManagementItem();    

            console.log("createHeader==================================", createHeader);
            console.log("updateHeader =================================", updateHeader);
            console.log("createItem==================================", createItem);
            console.log("updateItem =================================", updateItem);
            console.log("deleteItem =================================", deleteItem);

            
            that._currentDeleitem = 0;
            //&& createItem<1
            if(deleteItem>0 && createItem<1 ){  
                that._currentDeleitem = deleteItem;
                
                var oFilter = [
                    new Filter("tenant_id", FilterOperator.EQ, that._m.filter.tenant_id),
                    new Filter("mi_bom_id", FilterOperator.EQ, that._m.filter.mi_bom_id)
                ];
    
                var oDeleteInfoOdata = {
                    filter : oFilter,
                    delete_bom_item_count : deleteItem,
                    tenant_id  : that._m.filter.tenant_id,
                    material_code  : that._m.filter.material_code,
                    supplier_code : that._m.filter.supplier_code,
                    mi_bom_id  : that._m.filter.mi_bom_id
                };                


                if(bEditFlag){
                    Promise.all([ that.readChecklistEntity(oDeleteInfoOdata)
                    ]).then(that.deleteCheckAction.bind(that),
                            that.deleteChecklistError.bind(that));
                }
            }
            else{

                //실행건수가 있을때만 실행 
                if( createItem > 0 || updateItem > 0 || deleteItem>0){
                    console.log("======================= setUseBatch =========================");
                    that._setUseBatch();
                } 
            }    
            var _deleteItem = that.getModel("_deleteItem");
            _deleteItem.setProperty("/delData",[]);  
        },

        readChecklistEntity: function(oDeleteInfoOdata) {
            var that = this;
                      
            return new Promise(
              function(resolve, reject) {

                that.getModel().read("/MIMaterialCodeBOMManagementItem", {
                    filters: oDeleteInfoOdata.filter,
                    success: function(oData, reponse) {
                        resolve(oData);
                    },
                    error: function(oResult) {
                        reject(oResult);
                    }
                });

            });
        },

        deleteCheckAction: function(values) {
            console.log("deleteCheckAction");
            var that = this;
            var oData  = values[0].results;
            var oModel = that.getModel();
            var oUiData = that.getModel("oUiData");

            if(oData.length>0){
                if(that._currentDeleitem == oData.length){
             
					var oDeleteMIMaterialCodeBOMManagementHeaderKey = {
						tenant_id : oUiData.oData.tenant_id,
						material_code: oUiData.oData.material_code,
						supplier_code: oUiData.oData.supplier_code,
						mi_bom_id: oUiData.oData.mi_bom_id
                    };
                                        
                    //that._fnSetDeleteMode();
                    var deleteOdataPath = oModel.createKey(
                        "/MIMaterialCodeBOMManagementHeader",
                        oDeleteMIMaterialCodeBOMManagementHeaderKey);

                    oModel.remove(deleteOdataPath,{ 
                            groupId: "pgGroup" 
                        }
                    );   
                }

                that._setUseBatch();
            }
        },

        deleteChecklistError: function(reason) {
            console.log(" deleteChecklistError reason : " + reason)		
        },

        _setUseBatch : function () {
            var that = this;
            var oModel = that.getModel(),
                oUi = that.getModel("oUi");

                oModel.setUseBatch(true);
                if(oUi.getProperty("/deleteMode")){
                    oModel.submitChanges({
                        groupId: that._m.groupID,
                        success: that._handleDeleteSuccess.bind(this),
                        error: that._handleDeleteError.bind(this)
                    });
                }else if(oUi.getProperty("/editMode")){
                    oModel.submitChanges({
                        groupId: that._m.groupID,
                        success: that._handleUpdateSuccess.bind(this),
                        error: that._handleUpdateError.bind(this)
                    });
                }else if(oUi.getProperty("/copyMode")){
                    oModel.submitChanges({
                        groupId: that._m.groupID,
                        success: that._handleCopySuccess.bind(this),
                        error: that._handleCopyError.bind(this)
                    });
                }else{
                    oModel.submitChanges({
                        groupId: that._m.groupID,
                        success: that._handleCreateSuccess.bind(this),
                        error: that._handleCreateError.bind(this)
                    });
                }

                setTimeout(oModel.refresh(true), 1000);
                setTimeout(that._fnSetReadMode(), 1000);
                setTimeout(that._onExit(), 1000);
               
                that._setBusy(false);   
        },
        /*
        * MaterialDetail.fragment  에서 값을 받아 테이블에 등록 처리 
         */
        _fnMarteialCreateItem : function (oModel, oData) {
            console.log("_fnMarteialCreateItem");
            var createItemParameters = {
                    "tenant_id": oData.tenant_id,
                    "org_code": oData.org_code,
                    "material_code": oData.material_code,
                    "material_desc": oData.material_desc,
                    "supplier_code": oData.supplier_code,
                    "supplier_local_name": oData.supplier_local_name,
                    "supplier_english_name": oData.supplier_english_name,
                    "base_quantity": oData.base_quantity,
                    "processing_cost": oData.processing_cost,
                    "pcst_currency_unit": oData.pcst_currency_unit,
                    "mi_bom_id": this._m.mi_bom_id,
                    "mi_material_code": oData.mi_material_code,
                    "mi_material_name": oData.mi_material_name,
                    "category_code": oData.category_code,
                    "category_name": oData.category_name,
                    "reqm_quantity_unit": oData.reqm_quantity_unit,
                    "reqm_quantity": oData.reqm_quantity,
                    "currency_unit": oData.currency_unit,
                    "mi_base_reqm_quantity": oData.mi_base_reqm_quantity,
                    "quantity_unit": oData.quantity_unit,
                    "exchange": oData.exchange,
                    "termsdelv": oData.termsdelv,
                    "use_flag": oData.use_flag,
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date(),
                    "create_user_id": this._sso.user.id,
                    "update_user_id": this._sso.user.id,
                    "system_create_dtm": new Date(),
                    "system_update_dtm": new Date(),
                    "itemMode" : "C",
                    "odataMode" : "N"                      
            };
            
            //midTable 모델에 추가. 
        },

        //

        /**
         * MIMaterialCodeBOMManagementHeader CreateEntry Header
         * @param {*} oModel 
         * @param {*} oData 
         */
        _fnCreateEntryHeader : function(oModel, oData){
            console.log("_fnCreateHeader");
            var that = this;
            var headerParameters = {
                "groupId": that._m.groupID,
                "properties": {
                    "tenant_id": oData.tenant_id,
                    "material_code": oData.material_code,
                    "supplier_code": oData.supplier_code,
                    "base_quantity": oData.base_quantity,
                    "base_quantity_unit": oData.base_quantity_unit,
                    "processing_cost": oData.processing_cost,
                    "pcst_currency_unit": oData.pcst_currency_unit,
                    "mi_bom_id": oData.mi_bom_id,
                    "local_create_dtm": new Date(),
                    "create_user_id": that._sso.user.id
                }
            };
            try{
                oModel.createEntry(that._m.serviceName.mIMaterialCodeBOMManagementHeader, headerParameters);
                return true;
            }catch(error){
                return false;
            }
  
        },
        /**
         * MIMaterialCodeBOMManagementItem CreateEntryItem
         * @private
         */
        _fnCreateEntryItem : function(oModel, oData) {
            var that = this;
            var createEntryItemParameters = {
                "groupId": that._m.groupID,
                "properties": {
                    "tenant_id": oData.tenant_id,
                    "mi_bom_id": oData.mi_bom_id,
                    "mi_material_code": oData.mi_material_code,
                    "reqm_quantity_unit": oData.reqm_quantity_unit,
                    "reqm_quantity": oData.reqm_quantity,
                    "currency_unit": oData.currency_unit,
                    "quantity_unit": oData.quantity_unit,
                    "exchange": oData.exchange,
                    "termsdelv": oData.termsdelv,
                    "use_flag": oData.use_flag,
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date(),
                    "create_user_id": that._sso.user.id,
                    "update_user_id": that._sso.user.id,
                    "system_create_dtm": new Date(),
                    "system_update_dtm": new Date()
                }
            };
            try{
                oModel.createEntry(that._m.serviceName.mIMaterialCodeBOMManagementItem, createEntryItemParameters);
                return true;
            }catch(error){
                return false;
            }

        },

        /**
         * MIMaterialCodeBOMManagementHeader update Header
         * @param {*} oModel 
         * @param {*} oData 
         */        
        _fnUpdateHeader : function( oModel, oData) {
            var that = this;
            
            var oKey = {
                tenant_id : oData.tenant_id,
                material_code : oData.material_code,
                supplier_code : oData.supplier_code,
                mi_bom_id : oData.mi_bom_id
            };

            var updateHeaderParameters = {
                "pcst_currency_unit": oData.pcst_currency_unit,
                "processing_cost"   : oData.processing_cost,
                "local_update_dtm": new Date(),
                "update_user_id": that._sso.user.id
            };            

            try{
                var sUpdatePath = oModel.createKey(that._m.serviceName.mIMaterialCodeBOMManagementHeader, oKey);
                oModel.update(sUpdatePath, 
                    updateHeaderParameters, 
                    { groupId: that._m.groupID } );
                return true;
            }catch(error){
                return false;
            }            
        },

        /**
         * MIMaterialCodeBOMManagementItem Update
         * @private
         */
        _fnUpdateItem : function( oModel, oData) {
            var that = this;
            var oKey = {
                tenant_id : oData.tenant_id,
                mi_bom_id : oData.mi_bom_id,
                mi_material_code : oData.mi_material_code
            }

            var updateItemParameters = {  
                "reqm_quantity_unit": oData.reqm_quantity_unit,
                "reqm_quantity": oData.reqm_quantity,
                "currency_unit": oData.currency_unit,
                "quantity_unit": oData.quantity_unit,
                "exchange": oData.exchange,
                "termsdelv": oData.termsdelv,
                "use_flag" : oData.use_flag,
                "local_update_dtm" : new Date()
            };

            try{
                var sUpdatePath = oModel.createKey(that._m.serviceName.mIMaterialCodeBOMManagementItem, oKey);
                oModel.update(sUpdatePath, 
                    updateItemParameters, 
                    { groupId: that._m.groupID } );
                return true;
            }catch(error){
                return false;
            }
        },


        _fnDeleteHeader : function(oModel, oData) {     
            var that = this;       
            var oKey = {
                tenant_id : oData.tenant_id,
                material_code : oData.material_code,
                supplier_code : oData.supplier_code,
                mi_bom_id : oData.mi_bom_id
            }

            try{
                var sDeletePath = oModel.createKey(that._m.serviceName.mIMaterialCodeBOMManagementHeader, oKey);
                oModel.remove(sDeletePath,{ groupId: that._m.groupID } );
                return true;
            }catch(error){
                return false;
            }      

        },
        /**
         * _fnDeleteItem
         * @private
         */
        _fnDeleteItem : function( oModel, oData) {
            var that = this;
            var oKey = {
                tenant_id : oData.tenant_id,
                mi_bom_id : oData.mi_bom_id,
                mi_material_code : oData.mi_material_code 
            };

            try{
                var sDeletePath = oModel.createKey(that._m.serviceName.mIMaterialCodeBOMManagementItem, oKey);
                oModel.remove(sDeletePath,{ groupId: that._m.groupID } );
                return true;
            }catch(error){
                return false;
            }            
        },   
        

        /**
         * MIMaterialCodeBOMManagement Delete
         * @param {sap.ui.base.Event} oEvent 
         */
        onDeleteAction : function (oEvent){
            console.log("onMidDelete");   
            var that = this;   
            var mTitle = that.getModel("I18N").getText("/DELETE") + " " + that.getModel("I18N").getText("/CONFIRM");      
                MessageBox.confirm(that.getModel("I18N").getText("/NCM00003"), {
                    title: mTitle,                                    
                    onClose: that._deleteAction.bind(this),                                    
                    actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
                    textDirection: sap.ui.core.TextDirection.Inherit    
                });
        },

        /**
         * delete MIMaterialCodeBOMManagementItem
         */
        _deleteMIMaterialCodeBOMManagementItem : function () {
            console.log("_deleteMIMaterialCodeBOMManagementItem");
            var that = this;
            var oModel = that.getOwnerComponent().getModel(),
                _deleteItem = that.getModel("_deleteItem"),
                deleteItem=0,
                _deleteItemOdata = _deleteItem.getProperty("/delData");

            //table item delete action _deleteItem odata push data
            if(_deleteItemOdata.length>0){
                var oDeleteMIMaterialCodeBOMManagementItemKey,
                    oDeleteMIMaterialCodeBOMManagementItemPath;
                
                //적재 할때 신규는 담지 않는다. (수정이나 신규시 아이템 추가는 바로 삭제)
                for(var i=0;i<_deleteItemOdata.length;i++){
                    
                    oDeleteMIMaterialCodeBOMManagementItemKey = {
                        tenant_id : _deleteItemOdata[i].tenant_id,
                        mi_material_code: _deleteItemOdata[i].mi_material_code,
                        mi_bom_id:  _deleteItemOdata[i].mi_bom_id,
                        currency_unit:  _deleteItemOdata[i].currency_unit,
                        quantity_unit:  _deleteItemOdata[i].quantity_unit,
                        exchange:  _deleteItemOdata[i].exchange,
                        termsdelv:  _deleteItemOdata[i].termsdelv
                    }
                
                    oDeleteMIMaterialCodeBOMManagementItemPath = oModel.createKey(
                        that._m.serviceName.mIMaterialCodeBOMManagementItem,
                            oDeleteMIMaterialCodeBOMManagementItemKey
                    );

                    try{
                        oModel.remove(
                            oDeleteMIMaterialCodeBOMManagementItemPath, 
                            { 
                                groupId: that._m.groupID 
                            }
                        );
                        deleteItem++; 
                    }catch(error){
                        var mTitle = that.getModel("I18N").getText("/DELETE") + " " + that.getModel("I18N").getText("/FAILURE");
                        that._showMessageBox(
                            mTitle,
                            error,
                            that._m.messageType.Error,
                            function(){return;}
                        ); 
                    }

                    //해더에 속한 아이템을 확인한다. 
                }

                return deleteItem;
            }else{
                return 0;
            }
        },
        /**
         * mainTable Delete Action
         * @param {sap.m.MessageBox.Action} oAction 
         */
		_deleteAction: function(oAction) {
            console.log("_deleteAction");
            var that = this,
                oModel = that.getModel(),
                oView = that.getView(),
                midList = that.getModel("midList"),
                oUi = that.getModel("oUi"),
                bEditFlag = oUi.getProperty("/editMode");
            
			if(oAction === MessageBox.Action.DELETE) {
                //oView.busy(true);
                //삭제대상 item delete
                //사용자가 항목에서 임시로 삭제한 데이타가 있는지 확인

                that._fnSetDeleteMode();

                var deleteHeader = 0;
                var deleteItem = that._deleteMIMaterialCodeBOMManagementItem();
                
                //midList model 데이타 삭제
                if(midList.oData!=null){
                    //item delete
                    for(var i=0;i<midList.oData.length;i++){ 
                        if(that._fnDeleteItem(oModel, midList.oData[i])){
                            deleteItem++;
                        } 
                    }   

                    //that._deleteMIMaterialCodeBOMManagementItem();
                    //header delete
                    //if(that._fnDeleteHeader(oModel, midList.oData[0])) deleteHeader++;
                }           

                that._currentDeleitem = 0;
                if(deleteItem>0){  
                    that._currentDeleitem = deleteItem;
                    var oFilter = [
                        new Filter("tenant_id", FilterOperator.EQ, that._m.filter.tenant_id),
                        new Filter("mi_bom_id", FilterOperator.EQ, that._m.filter.mi_bom_id)
                    ];
                    var oDeleteInfoOdata = {
                        filter : oFilter,
                        delete_bom_item_count : deleteItem,
                        tenant_id  : that._m.filter.tenant_id,
                        material_code  : that._m.filter.material_code,
                        supplier_code : that._m.filter.supplier_code,
                        mi_bom_id  : that._m.filter.mi_bom_id
                    };                
    
                    if(bEditFlag){
                        Promise.all([ that.readChecklistEntity(oDeleteInfoOdata)
                        ]).then(that.deleteCheckAction.bind(that),
                                that.deleteChecklistError.bind(that));
                    }
                }                
                // if(deleteItem>0 || deleteHeader>0){
                    
                //     oModel.submitChanges({
                //         groupId: that._m.groupID, 
                //         success: that._handleDeleteSuccess.bind(this),
                //         error: that._handleDeleteError.bind(this)
                //     });

                //     oModel.refresh(true);
                    
                //     console.log("deleteItem=========", deleteItem);
                //     console.log("deleteHeader=========", deleteHeader);
                // }
                //oView.busy(false);
            } 
        },

        _handleCreateError: function (oError) {
            var that = this;
            var mTitle = that.getModel("I18N").getText("/SAVE") + " " + that.getModel("I18N").getText("/FAILURE");
            that._showMessageBox(
                mTitle,
                that.getModel("I18N").getText("/EPG00003"),
                that._m.messageType.Error,
                function(){return;}
            );
        },

        _handleUpdateSuccess: function (oData) {
            var that = this;
            var mTitle = that.getModel("I18N").getText("/UPDATE") + " " + that.getModel("I18N").getText("/SUCCESS");
            MessageBox.show(that.getModel("I18N").getText("/NPG00008"), {
                icon: MessageBox.Icon.SUCCESS,
                title: mTitle,
                actions: [MessageBox.Action.OK],
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        var sNextLayout = that.getView().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
                        setTimeout(that._onExit(),500);
                        that.getRouter().navTo("mainPage", { layout: sNextLayout });
                    }
                }
            });
        },
       
        
        _handleUpdateError: function (oError) {
            var that = this;
            var mTitle = that.getModel("I18N").getText("/UPDATE") + " " + that.getModel("I18N").getText("/FAILURE");
            this._showMessageBox(
                mTitle,
                that.getModel("I18N").getText("/EPG00002"),
                that._m.messageType.Error,
                function(){return;}
            );
        },

        _handleCopySuccess: function (oData) {
            var that = this;
            MessageBox.show(that.getModel("I18N").getText("/COPY_SUCCESS"), {
                icon: MessageBox.Icon.SUCCESS,
                title: that.getModel("I18N").getText("/NPG00026"),
                actions: [MessageBox.Action.OK],
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        var sNextLayout = that.getView().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
                        setTimeout(that._onExit(),500);
                        that.getRouter().navTo("mainPage", { layout: sNextLayout });
                    }
                }
            });
        },
       
        
        _handleCopyError: function (oError) {
            var that = this;
            this._showMessageBox(
                that.getModel("I18N").getText("/COPY") + " " + that.getModel("I18N").getText("/FAILURE"),
                that.getModel("I18N").getText("/COPY_FAILURE"),
                function(){return;}
            );
        },

        /**
         * 삭제 성공
         * @param {ODATA} oData 
         * @private
         */
        _handleDeleteSuccess: function (oData) {
            var that = this;
            var mTitle = that.getModel("I18N").getText("/DELETE") + " " + that.getModel("I18N").getText("/SUCCESS");
            MessageBox.show(that.getModel("I18N").getText("/NCM01002"), {
                icon: MessageBox.Icon.SUCCESS,
                title: mTitle,
                actions: [MessageBox.Action.OK],
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        var sNextLayout = that.getView().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
                        setTimeout(that._onExit(),500);
                        that.getRouter().navTo("mainPage", { layout: sNextLayout });
                    }
                }
            });
        },

        /**
         * 삭제실패
         * @param {Event} oError 
         * @private
         */
        _handleDeleteError: function (oError) {
            var that = this;
            var mTitle = that.getModel("I18N").getText("/DELETE") + " " + that.getModel("I18N").getText("/FAILURE");            
            that._showMessageBox(
                mTitle,
                that.getModel("I18N").getText("/EPG00001"),
                that._m.messageType.Error,
                function(){return;}
            );
        },
        _setBusy : function (bIsBusy) {
            var that = this;
			var oModel = that.getView().getModel("oUi");
			oModel.setProperty("/busy", bIsBusy);
        },
        
        _checkNumber : function (oEvent) {
            var _oInput = oEvent.getSource();
            var val = _oInput.getValue();
            val = val.replace(/[^\d]/g, '');
            _oInput.setValue(val);
        },

        onExit: function() {
            var that = this;
            that._fragmentDistory();            
            // if (this.dialogFrafment) {
            //     this.dialogFrafment.destroy(true);
            // }

        },
        
        onPressUseFlag: function (e) {
            var pressed = e.getSource().getPressed();
            var oContext = e.getSource().getParent().getParent().getBindingContext("midList");
            var sPath = oContext.getPath();

            var oBinding = oContext.getModel().getProperty(sPath);

            e.getSource().setProperty("text", pressed ? "YES":"NO");

            oBinding.use_flag = pressed;

        }        
           
    });
});