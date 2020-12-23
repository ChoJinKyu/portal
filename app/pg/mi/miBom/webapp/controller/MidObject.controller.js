sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "ext/lib/util/ValidatorUtil",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/ValueState",
    "ext/lib/util/Validator"
], function (BaseController, JSONModel, ValidatorUtil, Filter, FilterOperator, MessageBox, MessageToast, ValueState, Validator) {
    "use strict";
    return BaseController.extend("pg.mi.miBom.controller.MidObject", {


        validator: new Validator(),

		formatter: (function(){
			return {
				toYesNo: function(oData){
					return oData === true ? "YES" : "NO"
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
            mi_bom_id : 0,
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
                mi_material_code : "",
                currency_unit : "",
                quantity_unit : "",
                exchange : "",
                termsdelv : "",
                language_code : "KO"
            },
            serviceName : {
                marketIntelligenceService : "pg.marketIntelligenceService", //main Service
                mIMaterialCodeBOMManagementView: "/MIMaterialCodeBOMManagementView",  //자재별 시황자재 BOM 조회 View
                mIMaterialCodeBOMManagementItem:"/MIMaterialCodeBOMManagementItem",//자재별 시황자재 BOM 관리 Item
                mIMaterialCodeBOMManagementHeader:"/MIMaterialCodeBOMManagementHeader",//자재별 시황자재 BOM 관리 Header
                mIMaterialCostInformationView: "/MIMaterialCostInformationView",  //시황자재 가격관리
                mIMaterialPriceManagementView : "/MIMaterialPriceManagementView", //시황자재 가격관리 View
                mICategoryDetailView : "/MICategoryDetailView", //카테고리 상세내용
                orgCodeView: "/OrgCodeView", //관리조직 View
                currencyUnitView : "/CurrencyUnitView", //통화단위 View
                mIMaterialCodeList : "/MIMaterialCodeList", //자재코드 View(검색)
                unitOfMeasureView : "/UnitOfMeasureView", //수량단위 View
                materialView : "/MaterialView", //자재
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
                read : "　",    //테이블 아이템 기존 존재 데이타 로드
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
                Prd : "PRD",

            }            
        },
        _imsiData : {
            vendor : "KR01818401",
            vendor_name: "한국유나이티드제약(주)",
            material_code : "1000005",
            material_desc : "OLEIC ACID",
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
                    radioButtonGroup : "",
                    input_material_code : "",
                    string:null,
                    create_user_id: this._sso.user.id,
                    update_user_id: this._sso.user.id,
                    system_create_dtm : new Date(),
                    number:0                    
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

            //var mModel = new JSONModel("m", this._settingsModel);
            //this.getView().setModel(mModel); 
            // Attaches validation handlers
            sap.ui.getCore().attachValidationError(function (oEvent) {
                oEvent.getParameter("element").setValueState(ValueState.Error);
            });
            sap.ui.getCore().attachValidationSuccess(function (oEvent) {
                oEvent.getParameter("element").setValueState(ValueState.None);
            });

            //pageMode C Create, V View, E Edit
            var oUi = new JSONModel({
                busy: false,
                delay: 0,
                changeItem : false,
                readMode : true,
                editMode : false,                
                createMode : false
            });
            var  _deleteItem = new JSONModel({"delData":[]});
            
            this.setModel(_deleteItem, "_deleteItem");
            this.setModel(oUi, "oUi");

            this._fnControlSetting();

            this._fnSetReadMode();
            
   
            //개발일때. 
            //수정대상
            this._controlMode(this._m.controlMode.Qa);

            this._Page = this.getView().byId("page");
            this._Page.setFloatingFooter(true);


            console.groupEnd();
        },

        /**
         * control object filter 
         * @private
         */
        _fnControlSetting : function() {
            console.log("_fnControlSetting");
            var comboBox_pcst_currency_unit = this.getView().byId("comboBox_pcst_currency_unit");            
            var oBindingComboBox = comboBox_pcst_currency_unit.getBinding("items");

            var aFiltersComboBox = [
                new Filter("tenant_id", "EQ", this._m.filter.tenant_id),
                new Filter("language_code", "EQ", this._m.filter.language_code)
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

        _fnSetCreateMode : function(){
            this._fnSetMode("create");
        },

        _fnSetMode : function(mode){
            var bRead = false,
            bCreate = false,
            bEdit = false;

            if(mode === "read"){
                bRead = true;
                bCreate = false,
                bEdit = false;
            }else if(mode === "create"){
                bRead = false;
                bCreate = true,
                bEdit = false;
            }else if(mode === "edit"){
                bRead = false;
                bCreate = false,
                bEdit = true;
            }

            var oUi = this.getModel("oUi");
            oUi.setProperty("/readMode", bRead);
            oUi.setProperty("/createMode", bCreate);
            oUi.setProperty("/editMode", bEdit);
        },

        /**
         * _isNull Check
         * @private
         */        
        _isNull: function (p_val) {
            if (!p_val || p_val == "" || p_val == null) {
                return true
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

            //var sInputValue = oEvent.getSource().getValue();
            var _oUiData = this.getModel("_oUiData"),
                materialTable = this.getModel("materialTable");
            _oUiData.setProperty("/radioButtonGroup", this.getView().byId("radioButtonGroup").getSelectedIndex());

			// create value help dialog
			if (!this._valueHelpMaterialDialog) {

                this._valueHelpMaterialDialog = sap.ui.xmlfragment(
                    this._m.fragementId.materialDialog, 
                    this._m.fragementPath.materialDialog,this
                );
              
                this.getView().addDependent(this._valueHelpMaterialDialog);

            }                
            
            //기존 검색 데이타 초기화
            this.setModelNullAndUpdateBindings(materialTable);

			this._openValueHelpMaterialDialog();
		},

        /**
         * 아이템 선택후 가격정보 선택
         * @param {*} radioButtonGroup 
         */
		_openValueHelpMaterialDialog: function (radioButtonGroup) {
            // open value help dialog filtered by the input value
            //기존 모델 초기화 
            this.setArrayModelNullAndUpdateBindings("materialTable");

			this._valueHelpMaterialDialog.open();
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
                that = this,

                //onValueHelpMaterialDialogApply
                comboBox_materialView=this._findFragmentControlId(this._m.fragementId.materialDialog, "comboBox_materialView").getSelectedKey(),
                comboBox_supplierView=this._findFragmentControlId(this._m.fragementId.materialDialog, "comboBox_supplierView").getSelectedKey(),
                input_material_desc=this._findFragmentControlId(this._m.fragementId.materialDialog, "input_material_desc").getValue(),
                input_supplier_local_name=this._findFragmentControlId(this._m.fragementId.materialDialog, "input_supplier_local_name").getValue();
                //input_hidden_supplier_english_name=this._findFragmentControlId(this._m.fragementId.materialDialog, "input_supplier_local_name").getValue();
        
             var sFilters = [
                new Filter("tenant_id", FilterOperator.EQ,  this._m.filter.tenant_id)
            ];

            comboBox_materialView = "";
            if(_oUiData.getProperty("/radioButtonGroup")==0){

                sFilters.push(new Filter("tenant_id", FilterOperator.Contains, this._m.filter.tenant_id));
                if(comboBox_materialView.length>0){
                    sFilters.push(new Filter("material_code", FilterOperator.Contains, comboBox_materialView));
                }
                if(input_material_desc.length>0){
                    sFilters.push(new Filter("material_desc", FilterOperator.Contains, input_material_desc));
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
                            materialTable.oData[i].supplier_local_name = that._imsiData.supplier_code;
                        }
                        that.getOwnerComponent().setModel(materialTable, "materialTable");                                         
                    }
                });
            }else{
  
                sFilters.push(new Filter("tenant_id", FilterOperator.Contains, this._m.filter.tenant_id));                
                if(comboBox_supplierView.length>0){
                    sFilters.push(new Filter("supplier_code", FilterOperator.Contains, comboBox_supplierView));
                }
                if(input_supplier_local_name.length>0){
                    sFilters.push(new Filter("supplier_local_name", FilterOperator.Contains, input_supplier_local_name));
                }

                oModel.read(this._m.serviceName.supplierView, {
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
                            materialTable.oData[i].material_code = that._imsiData.material_code;
                            materialTable.oData[i].material_desc = that._imsiData.material_desc;

                        }

                        that.getOwnerComponent().setModel(materialTable, "materialTable");                                         
                    }
                });
            }
         
            var oMaterialTableList = new JSONModel([]);
            this.getOwnerComponent().setModel(oMaterialTableList, "materialTableList");

           // 
		},

        /**
         * 소요수량단위
         * @public
         */
        onReqmQuantityUnit : function(oEvent) {
            console.log("onReqmQuantityUnit");
            var obj = oEvent.getSource().oParent.oParent.getBindingContextPath(),
            midList = this.getModel("midList");
            this._selectedIndex = parseInt(obj.substring(1));

			if (!this._valueHelpReqmQuantityUnit) {

                this._valueHelpReqmQuantityUnit = sap.ui.xmlfragment(
                    this._m.fragementId.reqmQuantityUnit, 
                    this._m.fragementPath.reqmQuantityUnit,this
                );
                this.getView().addDependent(this._valueHelpReqmQuantityUnit);
            }   
            this._openValueHelpReqmQuantityUnit();
            
            
            var uom_name = this._findFragmentControlId(this._m.fragementId.reqmQuantityUnit, "searchField_uom_name");    
            uom_name.setValue(midList.oData[this._selectedIndex].reqm_quantity_unit);            
            this.onUomNameSearch();
         },

        /**
         * 소요량 단위 검색
         * @param {*} oEvent 
         */
        onUomNameSearch : function (oEvent){
            console.log("onUomNameSearch");
            var unitOfMeasureView = new JSONModel(),            
                oModel = this.getOwnerComponent().getModel(),
                oUnitOfMeasureView = this.getModel("unitOfMeasureView"),
                that = this,
                searchField_uom_name = this._findFragmentControlId(this._m.fragementId.reqmQuantityUnit, "searchField_uom_name").getValue(),
                reqmTable= this._findFragmentControlId(this._m.fragementId.reqmQuantityUnit, "reqmTable");             
                
            var andFilter = [
                new Filter("tenant_id", FilterOperator.EQ, this._m.filter.tenant_id),
                new Filter("language_code", FilterOperator.EQ, this._m.filter.language_code)                
            ];

            var orFilter = [                
                new Filter("uom_name", FilterOperator.Contains, searchField_uom_name),
                new Filter("uom_code", FilterOperator.Contains, searchField_uom_name)
            ];
            andFilter.push(new sap.ui.model.Filter(orFilter, false));

            //기존 검색 데이타 초기화
            this.setModelNullAndUpdateBindings(oUnitOfMeasureView);

            oModel.read(this._m.serviceName.unitOfMeasureView, {
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
            var unitOfMeasureView = this.getModel("unitOfMeasureView")
            this.setModelNullAndUpdateBindings(unitOfMeasureView);
			this._valueHelpReqmQuantityUnit.open();
		},

        /**
         * 소요량 단위 close
         */
        closeValueHelpReqmQuantityUnit : function(evt){
			this._valueHelpReqmQuantityUnit.close();
        },

        /**
         * 소요량 단위  Apply 선택
         */
        onReqmQuantityUnitApply : function () {
            console.log("onReqmQuantityUnitApply");
            var reqmTable =  this._findFragmentControlId(this._m.fragementId.reqmQuantityUnit, "reqmTable"), 
            midList = this.getModel("midList"),
                that = this;            

            if(reqmTable.getSelectedItems().length<1){
                this._showMessageBox(
                    "선택 확인",
                    "항목을 선택 하여 주십시요.",
                    this._m.messageType.Warning,
                    function(){return;}
                );
                return;
            }

            var uom_code = reqmTable.getSelectedItems()[0].getCells()[0].mProperties.text;
            var uom_name = reqmTable.getSelectedItems()[0].getCells()[1].mProperties.text;

            midList.oData[this._selectedIndex].reqm_quantity_unit = uom_code;
            midList.refresh(true);
            this.closeValueHelpReqmQuantityUnit();
		},
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
            var sNextLayout = this.getOwnerComponent().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");

            this._onExit();

            this.getRouter().navTo("mainPage", { layout: sNextLayout });
            console.groupEnd();
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
         * 아이템 추가나 삭제시 사용할 자재 정보 (실시간 체크로 변경)
         */
        _onHiddenMidServiceRead : function(){
            console.log("_onMidServiceRead");
            
            var that = this,
                oModel = this.getOwnerComponent().getModel(),
                oMidList = new JSONModel(),
                oUiData = new JSONModel(),
                sServiceUrl = this._m.serviceName.mIMaterialCodeBOMManagementView, //read는 master 페이지와 동일하게 사용한다. 
                aFilters = [
                new Filter("tenant_id", FilterOperator.EQ, this._m.filter.tenant_id),
                new Filter("mi_bom_id", FilterOperator.EQ, this._m.filter.mi_bom_id)
            ];

            oModel.read(sServiceUrl, {
                async: false,
                filters: aFilters,
                success: function (rData, reponse) {
                  
                    if(reponse.data.results.length>0){
                        oMidList.setData(reponse.data.results);
                        that.getOwnerComponent().setModel(oMidList, "_midList");
                    }
                }
            });
        },
        /**
         * 자재정보 MIMaterialCodeBOMManagement Read dev121212
         * mIMaterialCodeBOMManagementView 동일하게 리스트에서 사용 mIMaterialCodeBOMManagement cud에서 사용
         * @private
         */
        _onMidServiceRead : function(){
            console.log("_onMidServiceRead");
            
            var that = this,
                oModel = this.getOwnerComponent().getModel(),
                oMidList = new JSONModel(),
                oUiData = new JSONModel(),
                sServiceUrl = this._m.serviceName.mIMaterialCodeBOMManagementView, //read는 master 페이지와 동일하게 사용한다. 
                aFilters = [
                new Filter("tenant_id", FilterOperator.EQ, this._m.filter.tenant_id),
                new Filter("material_code", FilterOperator.EQ, this._m.filter.material_code),
                new Filter("supplier_code", FilterOperator.EQ, this._m.filter.supplier_code),
                new Filter("mi_bom_id", FilterOperator.EQ, this._m.filter.mi_bom_id),
                new Filter("mi_material_code", FilterOperator.EQ, this._m.filter.mi_material_code),
                new Filter("currency_unit", FilterOperator.EQ, this._m.filter.currency_unit),
                new Filter("quantity_unit", FilterOperator.EQ, this._m.filter.quantity_unit),
                new Filter("exchange", FilterOperator.EQ, this._m.filter.exchange),
                new Filter("termsdelv", FilterOperator.EQ, this._m.filter.termsdelv)                 
            ];
            console.log(sServiceUrl);
            console.log(aFilters);
            this._setBusy(true);
            oModel.read(sServiceUrl, {
                async: false,
                filters: aFilters,
                success: function (rData, reponse) {
                    for(var i=0;i< reponse.data.results.length;i++){

                        var oData = reponse.data.results[i];

                        if(i==0){
                            oUiData.setData(oData);
                            oUiData.tenant_name =  "";
                            //create new mi_bom_id,  update load mi_bom_id
                            that._m.mi_bom_id = oData.mi_bom_id;
                            that.getOwnerComponent().setModel(oUiData, "oUiData");
                        }
                    }

                    oMidList.setData(reponse.data.results);

                    for(var i=0;i<reponse.data.results.length;i++){
                       oMidList.oData[i].itemMode = that._m.itemMode.read;
                       oMidList.oData[i].odataMode = that._m.odataMode.yes;
                    }
                    that.getOwnerComponent().setModel(oMidList, "midList");
                    that._setBusy(false);
                }
            });
        },     

        /**
         * jsoon model data null initial
         * @private
         */
        _initialModel : function() {
          
                var arrayModel = [
                    "oUiData",
                    "_oUi",
                    "_oUiData",
                    "_deleteItem",
                    "_deleteItemOdata",
                    "midList",
                    "oUi",
                    "materialTable",
                    "oMaterialTableList",
                    "mIMaterialCostInformationView",
                    "mIMatListView",
                    "oMidList",
                    "unitOfMeasureView" 
                ];

              
                this.setArrayModelNullAndUpdateBindings(arrayModel);
        },


        _initialControlValue : function(){
            this.getView().byId("input_base_quantity").setValue("");
            this.getView().byId("input_processing_cost").setValue("");
            this.getView().byId("input_hidden_material_code").setValue("");
            this.getView().byId("input_hidden_material_desc").setValue("");
            this.getView().byId("input_hidden_supplier_code").setValue("");
            this.getView().byId("input_hidden_supplier_local_name").setValue("");
            this.getView().byId("input_hidden_supplier_english_name").setValue("");
            this.getView().byId("input_material_code").setValue("");
        },

        
        _initialFilter : function(){
            this._m.filter.tenant_id = "";
            this._m.filter.material_code = "";
            this._m.filter.supplier_code = "";
            this._m.filter.mi_bom_id = "";
            this._m.filter.mi_material_code = "";
            this._m.filter.currency_uni = "";
            this._m.filter.quantity_unit = "";
            this._m.filter.exchange = "";
            this._m.filter.termsdelv = "";
        },

        _setInit : function(){
            this._initialModel();
            this._initialControlValue();
            this._initialFilter();
        },
		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function (oEvent) {
            console.log("_onRoutedThisPage");

            this._setInit();
            this._onPageClearValidate();

            var _oUiData = this.getModel("_oUiData"),
                oArgs = oEvent.getParameter("arguments"),
                oModel = this.getOwnerComponent().getModel();

            function guid() {
                function s4() {
                    return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            }
            
            this._m.mi_bom_id = guid();
            this._m.filter.tenant_id = oArgs.tenant_id;
            this._m.filter.material_code = oArgs.material_code;
            this._m.filter.supplier_code = oArgs.supplier_code;
            this._m.filter.mi_bom_id = oArgs.mi_bom_id;
            this._m.filter.mi_material_code = oArgs.mi_material_code;
            this._m.filter.currency_unit = oArgs.currency_unit;
            this._m.filter.quantity_unit = oArgs.quantity_unit;
            this._m.filter.exchange = oArgs.exchange;
            this._m.filter.termsdelv = oArgs.termsdelv;
    
            if (this._m.filter.material_code == "new") {
                console.log("=============== new item ===============");
                var oModel = this.getModel("midList");   
                if(oModel){
                    oModel.setData(null);     
                    oModel.updateBindings(true);
                }
                
                this._fnSetCreateMode();
                
            }else{

                
                if(this._m.filter.material_code.length>0){
                
                    this._onMidServiceRead();

                    //항목 추가나  수정시 사용.
                    //this._onHiddenMidServiceRead();

                    this._fnSetReadMode();
                }
                else {
                    this._fnSetEditMode();
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
            this._fnSetReadMode(); 
        },

        /**
         * 작업 취소? 리스트 이동..
         */
        onCancel : function () {
            var that = this;

            MessageBox.confirm("작업내용을 취소 하게 됩니다. 취소 하시 겠습니까?", {
                title : "Create",
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        var sNextLayout = that.getView().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
                        that._onExit();
                        that.getRouter().navTo("mainPage", { layout: sNextLayout });
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
            this._fnSetEditMode();         
        },

        /**
         * 항목 선택
         */
        onMaterialChange : function(oEvent){
            var obj = oEvent.getSource().oParent.oParent.getBindingContextPath(),
                midList =this.getModel("midList"),
                that = this;

            this._selectedIndex = parseInt(obj.substring(1)); 

            this.onMaterialDetail(true);

            var searchField_material_code = this._findFragmentControlId(this._m.fragementId.materialDetail, "searchField_material_code");
            searchField_material_code.setValue(midList.oData[this._selectedIndex].mi_material_code);            
            
            this.onMaterialSearch();
    

        },

        /**
         * 시황자제 및 가격정보 선택
         * @public
         */
        onMaterialDetail : function (bflag) {
            console.log("call funtion onMaterialDetail");

            var oUi = this.getModel("oUi");
			if (!this._valueHelpMaterialDetail) {
                this._valueHelpMaterialDetail = sap.ui.xmlfragment(this._m.fragementId.materialDetail, this._m.fragementPath.materialDetail, this);
                this.getView().addDependent(this._valueHelpMaterialDetail);
            }          

            this._openValueHelpMaterialDetail();

            var searchField_material_code = this._findFragmentControlId(this._m.fragementId.materialDetail, "searchField_material_code");
            var searchField_category_name = this._findFragmentControlId(this._m.fragementId.materialDetail, "searchField_category_name");

            oUi.setProperty("/changeItem", bflag);

            if(!bflag){
                searchField_material_code.setValue("");
                searchField_category_name.setValue("");
            }
                                          
        },

        /**
         * 시황자재 선택, 시황자재 가겨정보 선택 Fragment open
         * @private
         */
        _openValueHelpMaterialDetail : function () {

            //기존 load 모델 초기화
            var arrayModel = [               
                "mIMaterialCostInformationView",
                "mIMatListView"
            ];
          
            this.setArrayModelNullAndUpdateBindings(arrayModel);
            this._valueHelpMaterialDetail.open();
        },
       
        /**
         * Exit
         * @private
         */
        _onExit: function () {
  
            for (var sPropertyName in this._formFragments) {
                if (!this._formFragments.hasOwnProperty(sPropertyName) || this._formFragments[sPropertyName] == null) {
                    return;
                }

                this._setInit();
               
                this._formFragments[sPropertyName].destroy();
                this._formFragments[sPropertyName] = null;
            }
        },

        _handleCreateSuccess: function (oData) {
            var that = this;
            MessageBox.show("저장 성공 하였습니다.", {
                icon: MessageBox.Icon.SUCCESS,
                title: "저장 확인",
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
                searchField_material_code = this._findFragmentControlId(this._m.fragementId.materialDetail, "searchField_material_code").getValue(),
                searchField_category_name = this._findFragmentControlId(this._m.fragementId.materialDetail, "searchField_category_name").getValue(),
                oTable = this._findFragmentControlId(this._m.fragementId.materialDetail, "leftTable");
                
           
            var andFilter = [
                new Filter("tenant_id", FilterOperator.EQ, this._m.filter.tenant_id)
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

            var sServiceUrl = this._m.serviceName.mIMatListView;
            var leftTable =  this._findFragmentControlId(this._m.fragementId.materialDetail, "leftTable");            
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
            this._setSelectedRightTableItem();
        },
          

        _setSelectedRightTableItem : function (){
            console.log("_setSelectedRightTableItem");
            var rightTable = this._findFragmentControlId(this._m.fragementId.materialDetail, "rightTable"),
            midList =this.getModel("midList");
            
            for (var idx = 0; idx < rightTable.getItems().length; idx++) {
                var items = rightTable.getItems()[idx];
                var currency_unit = items.getCells()[0].mProperties.text;
                var quantity_unit = items.getCells()[1].mProperties.text;
                var exchange = items.getCells()[2].mProperties.text;
                var termsdelv = items.getCells()[3].mProperties.text;

                if(midList.oData[this._selectedIndex]){
                    if(currency_unit==midList.oData[this._selectedIndex].currency_unit &&
                        quantity_unit==midList.oData[this._selectedIndex].quantity_unit &&
                        exchange==midList.oData[this._selectedIndex].exchange &&
                        termsdelv==midList.oData[this._selectedIndex].termsdelv
                    ){
                        items.setSelected(true);
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

            var oModel = this.getOwnerComponent().getModel(),
                leftTable =  this._findFragmentControlId(this._m.fragementId.materialDetail, "leftTable"),
                aFilter = [],
                that = this;
            
            var tenant_id = leftTable.getSelectedItems()[0].getCells()[0].mProperties.text;
            var mi_material_code = leftTable.getSelectedItems()[0].getCells()[2].mProperties.text; 
            
           
            aFilter.push(new Filter("tenant_id", FilterOperator.EQ, tenant_id));
            aFilter.push(new Filter("mi_material_code", FilterOperator.EQ, mi_material_code));
            
            
            var sServiceUrl = this._m.serviceName.mIMaterialCostInformationView;
            
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
            var leftTable =  this._findFragmentControlId(this._m.fragementId.materialDetail, "leftTable"), 
                rightTable = this._findFragmentControlId(this._m.fragementId.materialDetail, "rightTable"),
                oModel = this.getModel(),
                oUi = this.getModel("oUi"),
                that = this;            

            if(rightTable.getSelectedItems().length<1){
                this._showMessageBox(
                    "선택 확인",
                    "항목을 선택 하여 주십시요.",
                    this._m.messageType.Warning,
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
            var material_code = this.getView().byId("input_hidden_material_code").getValue();
            var material_desc = this.getView().byId("input_hidden_material_desc").getValue(); //자재명
            var supplier_code = this.getView().byId("input_hidden_supplier_code").getValue();
            var supplier_local_name = this.getView().byId("input_hidden_supplier_local_name").getValue();
            var supplier_english_name = this.getView().byId("input_hidden_supplier_english_name").getValue();

      
            //구성 MIMaterialCodeBOMManagementView
            //this._m.filter 및 -1 값은 아직 준비되지 않음 추가 변경. 12/17
            //tenant_name 제외
            var items = {
                "tenant_id": tenant_id,
                "material_code": material_code,
                "material_desc": material_desc,
                "supplier_code": supplier_code,
                "supplier_local_name": supplier_local_name,
                "supplier_english_name": supplier_english_name,
                "base_quantity": "-1",  
                "processing_cost": "-1", 
                "pcst_currency_unit": "-1",
                "mi_bom_id": this._m.mi_bom_id,
                "mi_material_code": mi_material_code,
                "mi_material_name": mi_material_name,
                "category_code": category_code,
                "category_name": category_name,
                "reqm_quantity_unit": quantity_unit, //소요수량단위 //기본값 으로 수량단위와 동일하게 셋팅
                "reqm_quantity": 0, //사용자 입력
                "currency_unit": currency_unit,
                "mi_base_reqm_quantity": "0.0",//시황기준소요수량
                "quantity_unit": quantity_unit,
                "exchange": exchange,
                "termsdelv": termsdelv,
                "use_flag": true, 
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date(),
                "create_user_id": this._sso.user.id,
                "update_user_id": this._sso.user.id,
                "system_create_dtm": new Date(),
                "system_update_dtm": new Date(),
                "itemMode" : that._m.itemMode.create,
                "odataMode" : that._m.odataMode.yes                
            };
            // 
            //등록되어 있는 자재인지 확인한다. 


            var andFilter = [];
            andFilter.push(new Filter("tenant_id", FilterOperator.EQ, items.tenant_id));
            andFilter.push(new Filter("mi_bom_id", FilterOperator.EQ, items.mi_bom_id));
            andFilter.push(new Filter("mi_material_code", FilterOperator.EQ, items.mi_material_code));
            andFilter.push(new Filter("currency_unit", FilterOperator.EQ, currency_unit));
            andFilter.push(new Filter("quantity_unit", FilterOperator.EQ, quantity_unit));
            andFilter.push(new Filter("exchange", FilterOperator.EQ, exchange));
            andFilter.push(new Filter("termsdelv", FilterOperator.EQ, termsdelv));
          
            that.getModel().read(that._m.serviceName.mIMaterialCodeBOMManagementItem, {
                async: false,
                filters: andFilter,                
                success: function(oData, reponse) {
                
                    if(reponse.data.results.length>0){
                            that._showMessageToast("이미 등록된 항목 입니다.");
                    }else{
                        that.onMidListItemAdd(items);
                        that.onMaterialDetailClose();
                    }         
                             
                },
                error: function(data){
                    console.log('error',data)
                },
            });
         
        },
        
        /**
         * 자재코드/서플라이어 검색후 Dialog Apply 
         */
        onValueHelpMaterialDialogApply : function () {
            console.log("onValueHelpMaterialDialogApply");
            var oTable = this._findFragmentControlId(this._m.fragementId.materialDialog, "materialTable"),            
                oSelected = oTable.getSelectedContexts(),
                _oUiData = this.getModel("_oUiData"),                
                midTable = this.getModel("midTable");

                //테이블에 충분한 데이타가 있다면 Record로 찻는다. 
                //oRecord
            
            if(oSelected.length<1){
                this._showMessageBox(
                    "선택 확인",
                    "항목을 선택 하여 주십시요.",
                    this._m.messageType.Warning,
                    function(){return;}
                );
                return;
            }

            var aSelectedItems = oTable.getSelectedItems(),
                vendor = aSelectedItems[0].getCells()[0].getText(),
                vendor_name= aSelectedItems[0].getCells()[1].getText(),
                material_code= aSelectedItems[0].getCells()[2].getText(),
                material_desc= aSelectedItems[0].getCells()[3].getText(),
                supplier_code= aSelectedItems[0].getCells()[4].getText(),
                supplier_local_name= aSelectedItems[0].getCells()[5].getText();

            var sourceName = "[" + material_code + "] ";
            sourceName = sourceName.concat(material_desc);
            sourceName = sourceName.concat(" / ");
            sourceName = sourceName.concat(" [");
            sourceName = sourceName.concat(supplier_code);
            sourceName = sourceName.concat("] ");
            sourceName = sourceName.concat(supplier_local_name);

            var input_material_code = this.byId("input_material_code");
            input_material_code.setValue(sourceName);

            var input_hidden_material_code = this.byId("input_hidden_material_code");
            var input_hidden_material_desc = this.byId("input_hidden_material_desc");
            var input_hidden_supplier_code = this.byId("input_hidden_supplier_code");
            var input_hidden_supplier_local_name = this.byId("input_hidden_supplier_local_name");
            //var input_hidden_supplier_english_name = this.byId("input_hidden_supplier_english_name");                                                

            input_hidden_material_code.setValue(material_code);
            input_hidden_material_desc.setValue(material_desc);
            input_hidden_supplier_code.setValue(supplier_code);
            input_hidden_supplier_local_name.setValue(supplier_local_name);
            //input_hidden_supplier_english_name.setValue(material_code);

            this.onMaterialDialog_close();
        },

        /**
         * 자재 및 서플라이어 검색창 Close
         */
        onMaterialDialog_close : function (){
            this._valueHelpMaterialDialog.close();
        },
        /**     
         * 시황재재 선택 및 가격정보 선택 페이지 close
         * @public
         */
        onMaterialDetailClose : function() {
            this._valueHelpMaterialDetail.close();
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
                this.setModel(omidList,"midList");
                return;
            }

            if(midList.oData!=null){
                for(var i=0;i<midList.oData.length;i++){
                    if(midList.oData[i].mi_material_code == items.mi_material_code  &&
                        midList.oData[i].category_code == items.category_code  &&
                        midList.oData[i].currency_unit == items.currency_unit &&
                        midList.oData[i].quantity_unit == items.quantity_unit &&
                        midList.oData[i].exchange == items.exchange &&
                        midList.oData[i].termsdelv == items.termsdelv
                        ){
                        bCheck = false;
                        this._showMessageToast("이미 등록된 항목 입니다.");
                        return;
                    }
                }

                //item Update
                if(oUi.getProperty("/changeItem") == bCheck == oUi.getProperty("/editMode")){
                    this.onMidListItemUpdate(items);
                    return;
                }

            }else{
              
                var omidList = new JSONModel();
                omidList.setData([items]);
                this.setModel(omidList,"midList");
                return;
            }

            if(bCheck){
                midList.oData.push(items);
                midList.refresh(true);
            }
        },

        onMidListItemUpdate : function (items) {
            return;
            var midList = this.getModel("midList");
           
            if( midList.oData[this._selectedIndex] ){
                midList.oData[this._selectedIndex].mi_material_code = items.mi_material_code;
                midList.oData[this._selectedIndex].mi_material_name = items.mi_material_name;
                midList.oData[this._selectedIndex].category_code = items.category_code;
                midList.oData[this._selectedIndex].category_name = items.category_name;
                midList.oData[this._selectedIndex].currency_unit = items.currency_unit;
                midList.oData[this._selectedIndex].quantity_unit = items.quantity_unit;
                midList.oData[this._selectedIndex].exchange = items.exchange;
                midList.oData[this._selectedIndex].termsdelv = items.termsdelv;
                
                midList.refresh(true);
                this.onMaterialDetailClose();
            }

        },        

        /**
         * midTable 항목(열) 삭제 
         * @public 
         */
        onMidListItemDelete : function () {
            console.log("onMidListItemDelete");
            var oModel = this.getOwnerComponent().getModel("midList"),
                _deleteItem = this.getModel("_deleteItem"),
                that = this,
                oTable = this.getView().byId("midTable"),
                oSelected = oTable.getSelectedContexts();
                
            if(oSelected.length<1){
                this._showMessageBox(
                    "선택 확인",
                    "삭제할 항목을 선택 하여 주십시요.",
                    this._m.messageType.Warning,
                    function(){return;}
                );
                return;
            }
            that._setBusy(true);
            var _deleteItemOdata = _deleteItem.getProperty("/delData");
            for(var i=0;i<oSelected.length;i++){

                var idx = parseInt(oSelected[i].sPath.substring(oSelected[i].sPath.lastIndexOf('/') + 1));
                
                if(oModel.oData[idx].itemMode == this._m.itemMode.read){
                    _deleteItemOdata.push(oModel.oData[idx]);
                }

                oModel.oData.splice(idx, 1);              
            }
            //_deleteItem.setProperty("/oData", _deleteItemOdata);
            
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
                onClose: closeEvent,
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
            var _oUi = this.getModel("oUi"),
                bCheckValidate = true;

            if(_oUi.getProperty("/createMode")){
                bCheckValidate =  this.validator.validate(this.byId(this._m.page));
                if(bCheckValidate) {
                    this.validator.clearValueState(this.byId(this._m.page));
                }
            }
            
            bCheckValidate =  this.validator.validate(this.byId("midTable"));
            if(bCheckValidate){
                this.validator.clearValueState(this.byId("midTable"));
            }
            return bCheckValidate;

        },

        /**
         * midTable required live check
         */
        onRequiredCheckTable : function() {            
            //if(this.validator.validate(this.byId("midTable"))){
                this.validator.clearValueState(this.byId("midTable"));
           // }
        },
        /**
         * Clear Validate
         * @private 
         */
        _onPageClearValidate: function(){
            this.validator.clearValueState(this.byId("page"));
            this.validator.clearValueState(this.byId("midTable"));
        },
        

        /**
         * 필수값 체크
         * @private
         */
        _checkData : function(){
            console.log("call function ==================== _checkData : function(){====================");
            var oUi = this.getModel("oUi"),
                bValueCheckFlag = true;

            var oTable = this.getView().byId("midTable");

            for (var idx = 0; idx < oTable.getItems().length; idx++) {
                
                var items = oTable.getItems()[idx];

                //6 소요량 단위  소요량  사용여부
                var reqm_quantity_unit = items.getCells()[5].mAggregations.items[0].mProperties.value,
                    reqm_quantity = items.getCells()[6].mAggregations.items[0].mProperties.value,
                    use_flag = items.getCells()[7].mAggregations.items[0].mProperties.selectedKey;
                    
                    

                if(reqm_quantity_unit.length<1){
                    this._showMessageToast("소요량 단위를 선택 하여 주십시요.")
                   
                    bValueCheckFlag  =false;
                    return false;
                }

                if(reqm_quantity.length<1){
                    this._showMessageToast("소요량 을 입력 하여 주십시요.");
                    bValueCheckFlag  =false;
                    return false;
                }

                if(use_flag.length<1){
                    this._showMessageToast("Use Flag 를 선택하여 주십시요.")
                    
                    bValueCheckFlag  =false;
                    return false;
                    
                }
            }
            return bValueCheckFlag;

        },
        /**
          * 버튼 액션 저장
          */
        onSaveAction : function(){
            console.log("call function ==================== onMidSave ====================");
            // this.getView().getModel().attachPropertyChange(this._propertyChanged.bind(this));
             var oUi = this.getModel("oUi");
             var bCreateFlag = oUi.getProperty("/createMode");
 
             if(!this._onPageValidate()){
                return;
             }

            if(!this._checkData()){
                return false;
            }

            if(bCreateFlag){
                if(ValidatorUtil.isValid(this.getView(),"requiredField")){
                    MessageBox.confirm("추가 하시 겠습니까?", {
                         title : "Create",
                         initialFocus : sap.m.MessageBox.Action.CANCEL,
                         onClose : function(sButton) {
                             if (sButton === MessageBox.Action.OK) {
                                 this._onSave();
                             }else{
                                 return;
                             }
                         }.bind(this)
                     });
                 }else{
                     console.log("checkRequire")
                 }
             }else{
                 MessageBox.confirm("수정 하시 겠습니까?", {
                     title : "Update",
                     initialFocus : sap.m.MessageBox.Action.CANCEL,
                     onClose : function(sButton) {
                         if (sButton === MessageBox.Action.OK) {
                             this._onSave();
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

            console.log("call function ==================== onMidSave ====================");

            var oUi = this.getModel("oUi"),
                bCreateFlag = oUi.getProperty("/createMode"),
                bEditFlag = oUi.getProperty("/editMode"),
                that = this,
                oModel = this.getModel(),
                midList = this.getModel("midList"),
                updateHeader = 0, 
                createHeader = 0,
                updateItem = 0, 
                createItem = 0, 
                deleteItem = 0;
                //that._setBusy(true);



            for(var i=0;i<midList.oData.length;i++){
                //Crate
                if(bCreateFlag){
                    //material_code, supplier_code, 기준수량, 가공비, 가공비 통화
                    midList.oData[i].material_code = that.byId("input_hidden_material_code").getValue(),
                    midList.oData[i].supplier_code = that.byId("input_hidden_supplier_code").getValue(),
                    midList.oData[i].base_quantity = that.byId("input_base_quantity").getValue(),
                    midList.oData[i].processing_cost = that.byId("input_processing_cost").getValue(),
                    midList.oData[i].pcst_currency_unit = that.byId("comboBox_pcst_currency_unit").getSelectedKey();
                   
                    if(i==0){
                        if(that._fnCreateEntryHeader(oModel, midList.oData[i])){
                            createHeader++;
                        }
                    }

                    if(that._fnCreateEntryItem(oModel, midList.oData[i])){
                        createItem++;
                    }
                }
                else {  //Update
                    if(i==0){

                        if(that._fnUpdateHeader(oModel, midList.oData[i])){
                            updateHeader++;    
                        }
                    }

                    if((midList.oData[i].itemMode==this._m.itemMode.create))
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

            this._currentDeleitem = 0;
            if(deleteItem>0){  

                this._currentDeleitem = deleteItem;
                
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

                    Promise.all([ this.readChecklistEntity(oDeleteInfoOdata)
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
        },

        readChecklistEntity: function(oDeleteInfoOdata) {
            var that = this;
                      
            return new Promise(
              function(resolve, reject) {

                that.getModel().read(that._m.serviceName.mIMaterialCodeBOMManagementItem, {
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
            var oData  = values[0].results;
            var oModel = this.getModel();
            var that = this;

            var oDeleteMIMaterialCodeBOMManagementHeaderKey = {
                tenant_id : that._m.filter.tenant_id,
                material_code : that._m.filter.material_code,
                supplier_code : that._m.filter.supplier_code,
                mi_bom_id : that._m.filter.mi_bom_id
            };

            if(oData.length>0){
                if(this._currentDeleitem == oData.length){
                    var deleteOdataPath = oModel.createKey(
                        "/MIMaterialCodeBOMManagementHeader",
                        oDeleteMIMaterialCodeBOMManagementHeaderKey);
                                            
                        debugger;
                    oModel.remove(deleteOdataPath,{ 
                            groupId: "pgGroup" 
                        }
                    );   
                    that._setUseBatch();
                }
            }
        },

        deleteChecklistError: function(reason) {
            console.log(" deleteChecklistError reason : " + reason)		
        },

        _setUseBatch : function () {
            var oModel = this.getModel(),
                that = this;
                oModel.setUseBatch(true);
                oModel.submitChanges({
                    groupId: that._m.groupID,
                    success: that._handleCreateSuccess.bind(this),
                    error: that._handleCreateError.bind(this)
                });

                oModel.refresh(true); 
                // this._onMidServiceRead();
                 this._fnSetReadMode();
                that._onExit();  
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
                    "use_flag": oData.use_flag == "true" ?  true : false,
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
    
            var headerParameters = {
                "groupId": this._m.groupID,
                "properties": {
                    "tenant_id": oData.tenant_id,
                    "material_code": oData.material_code,
                    "supplier_code": oData.supplier_code,
                    "base_quantity": oData.base_quantity,
                    "processing_cost": oData.processing_cost,
                    "pcst_currency_unit": oData.pcst_currency_unit,
                    "mi_bom_id": oData.mi_bom_id,
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date(),
                    "create_user_id": this._sso.user.id,
                    "update_user_id": this._sso.user.id,
                    "system_create_dtm": new Date(),
                    "system_update_dtm": new Date()  
                }
            };
            try{
                oModel.createEntry(this._m.serviceName.mIMaterialCodeBOMManagementHeader, headerParameters);
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
  
            var createEntryItemParameters = {
                "groupId": this._m.groupID,
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
                    "use_flag": oData.use_flag == "true" ?  true : false,
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date(),
                    "create_user_id": this._sso.user.id,
                    "update_user_id": this._sso.user.id,
                    "system_create_dtm": new Date(),
                    "system_update_dtm": new Date()  
                }
            };
            try{
                oModel.createEntry(this._m.serviceName.mIMaterialCodeBOMManagementItem, createEntryItemParameters);
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
            var oKey = {
                tenant_id : oData.tenant_id,
                company_code : oData.company_code,
                org_type_code : oData.org_type_code,
                org_code: oData.org_code,
                material_code : oData.material_code,
                supplier_code : oData.supplier_code,
                mi_bom_id : oData.mi_bom_id
            }

            var updateHeaderParameters = {
                "pcst_currency_unit": oData.pcst_currency_unit,
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date(),
                "create_user_id": this._sso.user.id,
                "update_user_id": this._sso.user.id,
                "system_create_dtm": new Date(),
                "system_update_dtm": new Date()
            }            

            try{
                var sUpdatePath = oModel.createKey(this._m.serviceName.mIMaterialCodeBOMManagementHeader, oKey);
                oModel.update(sUpdatePath, 
                    updateHeaderParameters, 
                    { groupId: this._m.groupID } );
                return true;
            }catch(error){
                return false;
            }            
        },

        /**
         * Update
         * @private
         */
        _fnUpdateItem : function( oModel, oData) {
            var oKey = {
                tenant_id : oData.tenant_id,
                mi_bom_id : oData.mi_bom_id,
                mi_material_code : oData.mi_material_code,
                currency_unit : oData.currency_unit,
                quantity_unit : oData.quantity_unit,
                exchange : oData.exchange,
                termsdelv : oData.termsdelv
            }

            var updateItemParameters = {  
                "reqm_quantity_unit" : oData.reqm_quantity_unit,
                "reqm_quantity" : oData.reqm_quantity,
                "use_flag" : oData.use_flag == "true" ?  true : false,
                "local_create_dtm" : new Date(),
                "local_update_dtm" : new Date()
            }

            try{
                var sUpdatePath = oModel.createKey(this._m.serviceName.mIMaterialCodeBOMManagementItem, oKey);
                oModel.update(sUpdatePath, 
                    updateItemParameters, 
                    { groupId: this._m.groupID } );
                return true;
            }catch(error){
                return false;
            }
        },


        _fnDeleteHeader : function(oModel, oData) {            
            var oKey = {
                tenant_id : oData.tenant_id,
                material_code : oData.material_code,
                supplier_code : oData.supplier_code,
                mi_bom_id : oData.mi_bom_id
            }

            try{
                var sDeletePath = oModel.createKey(this._m.serviceName.mIMaterialCodeBOMManagementHeader, oKey);
                oModel.remove(sDeletePath,{ groupId: this._m.groupID } );
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
            var oKey = {
                tenant_id : oData.tenant_id,
                mi_bom_id : oData.mi_bom_id,
                mi_material_code : oData.mi_material_code,
                currency_unit : oData.currency_unit,
                quantity_unit : oData.quantity_unit,
                exchange : oData.exchange,
                termsdelv : oData.termsdelv

            }

            try{
                var sDeletePath = oModel.createKey(this._m.serviceName.mIMaterialCodeBOMManagementItem, oKey);
                oModel.remove(sDeletePath,{ groupId: this._m.groupID } );
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
                MessageBox.confirm("해당 항목을 삭제 하시겠습니까?", {
                    title: "삭제 확인",                                    
                    onClose: this._deleteAction.bind(this),                                    
                    actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
                    textDirection: sap.ui.core.TextDirection.Inherit    
                });
        },

        /**
         * delete MIMaterialCodeBOMManagementItem
         */
        _deleteMIMaterialCodeBOMManagementItem : function () {
            var oModel = this.getOwnerComponent().getModel(),
                _deleteItem = this.getModel("_deleteItem"),
                that = this,
                deleteItem=0,
                _deleteItemOdata = _deleteItem.getProperty("/delData");

            //table item delete action _deleteItem odata push data
            if(_deleteItemOdata.length>0){
                var oDeleteMIMaterialCodeBOMManagementItemKey,
                    oDeleteMIMaterialCodeBOMManagementItemPath;
                
                //적재 할때 신규는 담지 않는다. (수정이나 신규시 아이템 추가는 바로 삭제)
                for(var i=0;i<_deleteItemOdata.length;i++){
                    
                    //_fnDeleteItem 사용해도됨.
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
                            this._m.serviceName.mIMaterialCodeBOMManagementItem,
                            oDeleteMIMaterialCodeBOMManagementItemKey
                    );

                    try{
                        oModel.remove(
                            oDeleteMIMaterialCodeBOMManagementItemPath, 
                            { 
                                groupId: this._m.groupID 
                            }
                        );
                        deleteItem++; 
                    }catch(error){
                        that._showMessageBox(
                            "삭제 실패",
                            error,
                            this._m.messageType.Error,
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
                midList = that.getModel("midList");
            
			if(oAction === MessageBox.Action.DELETE) {
                //oView.busy(true);
                //삭제대상 item delete
                //사용자가 항목에서 임시로 삭제한 데이타가 있는지 확인
                var deleteHeader = 0;
                var deleteItem = that._deleteMIMaterialCodeBOMManagementItem();
                
                //midList model 데이타 삭제
                if(midList.oData!=null){
                    //item delete
                    for(var i=0;i<midList.oData.length;i++){ 
                        if(that._fnDeleteItem(oModel, midList.oData[i])) deleteItem++;
                    }   
                    //header delete
                    if(that._fnDeleteHeader(oModel, midList.oData[0])) deleteHeader++;
                }           

                if(deleteItem>0 || deleteHeader>0){
                    
                    oModel.submitChanges({
                        groupId: that._m.groupID, 
                        success: that._handleDeleteSuccess.bind(this),
                        error: that._handleDeleteError.bind(this)
                    });

                    oModel.refresh(true);
                    
                    console.log("deleteItem=========", deleteItem);
                    console.log("deleteHeader=========", deleteHeader);
                }
                //oView.busy(false);
            } 
        },

        _handleCreateError: function (oError) {
            this._showMessageBox(
                "저장 실패",
                "저장 실패 하였습니다.",
                this._m.messageType.Error,
                function(){return;}
            );
        },

        _handleUpdateSuccess: function (oData) {
            MessageBox.show("수정에 성공 하였습니다.", {
                icon: MessageBox.Icon.SUCCESS,
                title: "수정 성공",
                actions: [MessageBox.Action.OK],
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        var sNextLayout = that.getView().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
                        that._onExit();
                        that.getRouter().navTo("mainPage", { layout: sNextLayout });
                    }
                }
            });
        },
        
        _handleUpdateError: function (oError) {
            this._showMessageBox(
                "수정 실패",
                "수정 실패 하였습니다.",
                this._m.messageType.Error,
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
            MessageBox.show("삭제가 성공 하였습니다.", {
                icon: MessageBox.Icon.SUCCESS,
                title: "삭제 성공.",
                actions: [MessageBox.Action.OK],
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        var sNextLayout = that.getView().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
                        that._onExit();
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
            this._showMessageBox(
                "삭제 실패",
                "삭제 실패 하였습니다.",
                this._m.messageType.Error,
                function(){return;}
            );
        },
        _setBusy : function (bIsBusy) {
			var oModel = this.getView().getModel("oUi");
			oModel.setProperty("/busy", bIsBusy);
		}	              
           
    });
});