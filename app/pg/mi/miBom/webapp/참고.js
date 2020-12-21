

저장하였습니다.
MessageToast.show(this.getModel("I18N").getText("/NCM0005"));

onSelectedLeftTableItem

        // if(searchField_material_code!=""){
            //     this.onSelectedLeftTableItem();
            // }



onInit: function() {
    const route = this.getOwnerComponent().getRouter().getRoute("thisPage");
    route.attachPatternMatched(this.onPagePatternMatched, this);
  },
  
  onPagePatternMatched: function() {
    this.byId("page").scrollTo(0);
  },

removeSelections(true)

comboBoxCategory_code

onUomNameSearch

https://sapui5.netweaver.ondemand.com/#/entity/sap.m.MultiInput/sample/sap.m.sample.MultiInputValueHelp

this._selectedIndex = parseInt(obj.substring(1)); 
this.onMaterialDetail(true);
var searchField_material_code = this._findFragmentControlId(this._m.fragementId.materialDetail, "searchField_material_code");
searchField_material_code.setValue(midList.oData[this._selectedIndex].mi_material_code);            
this.onMaterialSearch();


searchField_material_code = this._findFragmentControlId(this._m.fragementId.materialDetail, "searchField_material_code").getValue(),
                  
var oFirstItem = leftTable.getItems()[0];
var venitems=leftTable.getItems();
venitems[0].setSelected(true);
that.onSelectedLeftTableItem();

                                      
                    var oFirstItem = leftTable.getItems()[0];

                    var venitems=leftTable.getItems();

                    venitems[0].setSelected(true);
                    
                    that.onSelectedLeftTableItem();



midList.oData[this._selectedIndex].reqm_quantity_unit = uom_code;

this._selectedIndex

mIMatCategListView
_deleteItemOdata
"/MIMaterialCodeBOMManagementItem(tenant_id='L2100',
company_code='*',
org_type_code='BU',
org_code='BIZ00100',
mi_bom_id='2',
mi_material_code='A001-01-01',
currency_unit=null,
quantity_unit=null,
exchange=null,
termsdelv=null)"
 
"tenant_name": "-1", 
"org_type_code": "-1", 
"org_code": "-1", 
					// return new Promise(
					// 	function(resolve, reject) {
                    // 					that.getModel().read(that._m.serviceName.mIMater
                    ialCodeBOMManagementItem, {
					// 					  filters: sFilters,
					// 					  success: function(oData, reponse) {
					// 						  if(reponse.data.results.length>0){
					// 							  that._m.deleteCheckItemCount = reponse.data.results.length;
					// 							  console.log("=========== length", reponse.data.results.length)
					// 						  }									
					// 						  resolve(oData);
					// 					  },
					// 					  error: function(oResult) {
					// 						reject(oResult);
					// 					  }
					// 					});
					// 		});
					// },


					// Promise.all([ this.readChecklistEntity(sFilters)
					// ]).then(this._setUseBatch.bind(that), this._setUseBatch.bind(that));

					// oModel.read(that._m.serviceName.mIMaterialCodeBOMManagementItem, {
					// 	async: false,
					// 	filters: sFilters,
					// 	success: function (rData, reponse) {
					// 		if(reponse.data.results.length>0){

					// 			//삭제할 Item총수가 현재 남아 있는 아이템과 같을때 Header 까지 같이 실행한다.
					// 			//비동기로..먼저 지나간다...
					// 			if(reponse.data.results.length == deleteItemCount){

					// 				var oDeleteMIMaterialCodeBOMManagementHeaderPath = oModel.createKey(
					// 					that._m.serviceName.mIMaterialCodeBOMManagementHeader,
					// 					mIMaterialCodeBOMManagementHeaderKey
					// 				);

					// 				oModel.remove(
					// 					oDeleteMIMaterialCodeBOMManagementHeaderPath, 
					// 					{ 
					// 						groupId: that._m.groupID 
					// 					}
					// 				);
					// 				_nDeleteHeaderItem++; 
					// 				console.log("-----------_nDeleteHeaderItem--------", _nDeleteHeaderItem);
					// 			}
					// 		}
					// 	}
                    // });
                    

"/MIMaterialCodeBOMManagementView(tenant_id='L2100',
company_code='*',org_type_code='BU',
org_code='BIZ00100',
material_code='PRIACT0001',
supplier_code='KR01820500',
mi_bom_id='1',
mi_material_code='A001-01-01',
currency_unit='USD',
quantity_unit='TON',
exchange='ICIS',
termsdelv='CFR%20KOR')"

pg.marketIntelligenceService.MIMaterialCodeText' with key(s) 
'tenant_id=L2100,mi_material_code=2-EH1,language_code=EN' not found"}}} 
-  sap.ui.model.odata.v2.ODataModel

a.open()
a.setBusyIndicatorDelay(40000);

            oViewModel = new JSONModel({
                selectedrows : [],
                timeZoneCountryInput : "",
                busy : false,
                hasUIChanges : false,
                usernameEmpty : true,
                order : 0
            });

            _setBusy : function (bIsBusy) {
                var oModel = this.getView().getModel("oUi");
                oModel.setProperty("/busy", bIsBusy);
            },
            _setUIChanges : function (bHasUIChanges) {
                if (this._bTechnicalErrors) {
                    // If there is currently a technical error, then force 'true'.
                    bHasUIChanges = true;
                } else if (bHasUIChanges === undefined) {
                    bHasUIChanges = this.getView().getModel().hasPendingChanges();
                }
                var oModel = this.getView().getModel("timeModel");
                oModel.setProperty("/hasUIChanges", bHasUIChanges);
            },


                    this._setBusy(false);
                    MessageToast.show("저장 업데이트 완료");
                    this._setUIChanges(false);

                    var oTable = this.byId(tableName);                    
                    var oBinding = oTable.getBinding("items");
    
                    if(tableName!="mainList"){ bSub = true; }
                    if (!oBinding.hasPendingChanges()) {
                        MessageBox.error("수정한 내용이 없습니다.");
                        return;
                    }
                                         //focus 이동
                oTable.getRows().some(function (oRows) {
                    if (oRows.getBindingContext() === oContext) {
                        oRows.focus();
                        oRows.setSelected(true);       
                        return true;
                    }
                });               
"tenant_id": "L2100",
"company_code": "*",
"org_type_code": "BU",
"org_code": "BIZ00100",
"org_name": "석유화학"

_deleteMIMaterialCodeBOMManagementItem
MIMaterialCodeBOMManagementHeader(
    tenant_id='L2100',
company_code='%2A',
org_type_code='BU',
org_code='BIZ00100',
material_code='PRIACT0001',
supplier_code='KR01818601',
mi_bom_id='2')

MIMaterialCodeBOMManagementItem(
    tenant_id='L2100',
    company_code='%2A',
    org_type_code='BU',
    org_code='BIZ00100',
    mi_bom_id='1',
    mi_material_code='A001-01-01')
    "tenant_id": "L2100",
    "company_code": "*",
    "org_type_code": "BU",
    "org_code": "BIZ00100",
    "mi_bom_id": "1",
    "mi_material_code": "A001-01-01",
    "reqm_quantity_unit": "TON",
    "reqm_quantity": "10",
    "currency_unit": "USD",
    "quantity_unit": "TON",
    "exchange": "ICIS",
    "termsdelv": "CFR KOR",
    "use_flag": true,
    "local_create_dtm": "/Date(1606750140000)/",
    "local_update_dtm": "/Date(1606750140000)/",
    "create_user_id": "Admin",
    "update_user_id": "Admin",
    "system_create_dtm": "/Date(1606750140000)/",
    "system_update_dtm": "/Date(1606750140000)/" 
            
            업데이트, 삭제 시에 해더와 아이템은  mi_bom_id 는 부모의 키를 갖는다. 
            //material_code, supplier_code, 기준수량, 가공비, 가공비 통화
            var material_code = this.byId("input_hidden_material_code"),
            supplier_code = this.byId("input_hidden_supplier_code"),
            base_quantity = this.byId("input_base_quantity"),
            processing_cost = this.byId("input_processing_cost"),
            pcst_currency_unit = this.byId("comboBox_pcst_currency_unit");



//material_code, supplier_code, 기준수량, 가공비, 가공비 통화
                        var material_code = this.byId("input_hidden_material_code"),
                            supplier_code = this.byId("input_hidden_supplier_code"),
                            base_quantity = this.byId("input_base_quantity"),
                            processing_cost = this.byId("input_processing_cost"),
                            pcst_currency_unit = this.byId("comboBox_pcst_currency_unit"),
                                                        
                        midList.oData[i].pcst_currency_unit = pcst_currency_unit.getSelectedKey();
                        midList.oData[i].pcst_currency_unit = pcst_currency_unit.getSelectedKey();
                        midList.oData[i].pcst_currency_unit = pcst_currency_unit.getSelectedKey();
                        midList.oData[i].pcst_currency_unit = pcst_currency_unit.getSelectedKey();

var oModel = card_view.byId("main_Table").getModel();
var oData = oModel.getData(); 


        dateFormatter: DateFormatter,
        dataPath : "resources",
        _m : {
            page : "page",
            fragementPath : {
                change : "pg.mm.view.Change",
                display : "pg.mm.view.Display",
                materialDetail : "pg.mm.view.MaterialDetail",
                materialDialog : "pg.mm.view.MaterialDialog",
                supplierDialog : "pg.mm.view.SupplierDialog"
            },            
            fragementId : {
                change : "Change_ID",
                display : "Display_ID",
                materialDetail : "MaterialDetail_ID",
                materialDialog : "MaterialDialog_ID",
                supplierDialog : "SupplierDialog_ID"
            },
            input : {
                inputMultiInput : "multiInput",
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
                company_code : "company_code",
                org_type_code : "org_type_code",
                org_code : "org_code"
            },
            serviceName : {
                mIMaterialPriceManagement: "/mIMaterialPriceManagement",  //자재리스트
                mIMaterialCodeBOMManagement: "/MIMaterialCodeBOMManagement",  //mainList
                orgCodeView: "/orgCodeView", //관리조직 View
                currencyUnitView : "/CurrencyUnitView", //통화단위 View
                mIMaterialCodeList : "/MIMaterialCodeList", //자재코드 View
                unitOfMeasureView : "/UnitOfMeasureView", //수량단위 View
                enrollmentMaterialView : "/EnrollmentMaterialView", //자재코드  등록View
                enrollmentSupplierView : "/EnrollmentSupplierView", //공급업체  등록View
            },
            jsonTestData : {
                values : [{
                    name : "tenant",
                    value : "/tenant.json"
                },{
                    name : "company",
                    value : "/company.json"
                }]
            },
            midObjectData : {
                tenant_id: "L2100",
                company_code: "*",
                org_type_code: "BU",
                org_code: "BIZ00100",
                material_code: "ERCA00006AA", //자재코드 (시황자재코드와 다름 값이 있다면 View Mode)
                create_user_id: "Admin",
                system_create_dtm: "Admin"
            },
            processMode : {
                create : "C", //신규, 
                view : "V",   //보기
                edit : "E"    //수정
            },
            pageMode : {
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
            midObjectView : {
                busy: true,
                delay: 0,
                pageMode: "V"
            }
        },

        _sso : {
            user : {
                id : "Admin",
                name : "Hong Gil-dong"
            },
            dept : {
                team_name : "구매팀",
                team_code : "0000",
                tenant_id : "L2100",
                tenant_name : "LG 화확"  
            }          
        },

/*
      //담당자 selectedItem selectedRow            
      var aTokens = this.getView().byId("multiinputUser").getTokens();
      var multiinputUser = aTokens.map(function (oToken) {
        return oToken.getKey();
      }).join(",");


  //Active 0 Active, 1 In Active
      var oRadioSelectIndex = oModel.getProperty("/radioActive");
      oRadioSelectIndex = parseInt(oRadioSelectIndex);
      oView.byId("radioActive").setSelectedIndex(oRadioSelectIndex);

==================================================== set
    _setSetData: function () {
      console.group("_setSetData");
      var oView = this.getView(),
        oModel = this.getOwnerComponent().getModel("odata");

      //oModel = sap.ui.core.getModel("odata");
      console.dir(oModel);

      //구분
      oView.byId("comboBoxType").setSelectedKey(oModel.getProperty("/comboBoxType"));

      //시나리오
      oView.byId("comboboxScenario").setSelectedKey(oModel.getProperty("/comboboxScenario"));

      //Active 0 Active, 1 In Active
      var oRadioSelectIndex = oModel.getProperty("/radioActive");
      oRadioSelectIndex = parseInt(oRadioSelectIndex);
      oView.byId("radioActive").setSelectedIndex(oRadioSelectIndex);

      //구매유형
      oView.byId("comboBoxRawMaterials").setSelectedKey(oModel.getProperty("/comboBoxRawMaterials"));

      //회사
      oView.byId("comboboxOffice").setSelectedKey(oModel.getProperty("/comboboxOffice"));

      //법인
      oView.byId("conboBoxNatioinStatus").setSelectedKey(oModel.getProperty("/conboBoxNatioinStatus"));

      //모니터링 목적 
      ///richTextEditor : setValue getValue setEditable setEditorType setRequired setTextDirection setValue
      oView.byId("reMonitoringPurpose").setHeight("150px");

      //remo.setTextDirection("setTextDirection");//oModel.getProperty("/reMonitoringPurpose")
      oView.byId("reMonitoringPurpose").setValue(this._richTextEditor());
      //시나리오 설명
      oView.byId("reMonitoringPurposeDetail").setValue(oModel.getProperty("/reMonitoringPurposeDetail"));
      //운영방식 
      //checkbox getSelected() getText() setSelected() editable

      oView.byId("checkBoxOMType1").setSelected(oModel.getProperty("/checkBoxOMType1"));
      oView.byId("checkBoxOMType2").setSelected(oModel.getProperty("/checkBoxOMType2"));
      oView.byId("checkBoxOMType3").setSelected(oModel.getProperty("/checkBoxOMType3"));

      //소스시스템
      oView.byId("reSourceSystem").setValue(oModel.getProperty("/reSourceSystem"));
      //소스시스템 상세설명
      oView.byId("reSourceSystemDetail").setValue(oModel.getProperty("/reSourceSystemDetail"));



============get

     //조회
      var checkBoxOMType1 = this.byId("checkBoxOMType1").getSelected() == true ? "1" : "0";
      //소명
      var checkBoxOMType2 = this.byId("checkBoxOMType2").getSelected() == true ? "1" : "0";
      //알람
      var checkBoxOMType3 = this.byId("checkBoxOMType3").getSelected() == true ? "1" : "0";

           //pageMode C Create, V View, E Edit
            var midObjectView = new JSONModel({
                busy: true,
                delay: 0,
                pageMode:"V"
            });

            /**
             * Note 사용자 세션이나 정보에 다음값이 셋팅 되어 있다는 가정
             */

            var midObjectData = new JSONModel({
                tenant_id: "L2100",
                company_code: "*",
                org_type_code: "BU",
                org_code: "BIZ00100",
                material_code: "ERCA00006AA" //자재코드 (시황자재코드와 다름 값이 있다면 View Mode)
            });
            http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MIMaterialCodeBOMManagementView/?$top=5&filter=org_code%20eq%20%27BIZ00100%27&$format=json

            
자재별 시황자재 BOM	관리조직	OrgCodeView	View	조직유형코드/조직유형명, 조직코드/조직명 조회 View
자재	MaterialView	View	자재코드/자재명 조회 View
공급업체	SupplierView	View	공급업체코드/공급업체로컬명/공급업체영문명 조회 View
자재별 시황자재 BOM	MIMaterialCodeBOMManagementView	View	자재별 시황자재 BOM 조회 View
자재별 시황자재 BOM 관리 Header	MIMaterialCodeBOMManagementHeader	Table	자재별 시황자재 BOM Header 정보 저장 Table
자재별 시황자재 BOM 관리 Item	MIMaterialCodeBOMManagementItem	Table	자재별 시황자재 BOM Item 정보 저장 Table
시황자재 가격관리	MIMaterialPriceManagementView	View	시황자재 List 정보 조회 View
시황자재 가격정보	MIMaterialCostInformationView	View	시황자재 가격정보 조회 View

http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MICategoryDetailView/?$top=5&$format=json
카테고리 상세내용	MICategoryDetailView	View	시황자재 가격정보 상세조회 View
"tenant_id": "L2100",
"company_code": "*",
"org_type_code": "BU",
"org_code": "BIZ00100",
"mi_material_code": "A001-01-01",
"mi_material_name": "원유(서부텍사스중질유)",
"category_code": "FEEDSTOCK",
"category_name": "NA",
"reqm_quantity_unit": null,
"reqm_quantity": null,
"use_flag": true,
"currency_unit": "USD",
"quantity_unit": "MT",
"exchange": "Platts",
"termsdelv": "CFR China",
"mi_date": "/Date(1595289600000)/",
"amount": "632.600"


//마스터 페이지 변경내역 없음.
http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MIMaterialCodeBOMManagementView/?$format=json&$top=5
MIMaterialCodeBOMManagementView ===================================
        "tenant_id": "L2100",
        "company_code": "*",
        "org_type_code": "BU",
        "org_code": "BIZ00100",
        "material_code": "PRIACT0002",
        "material_desc": "MODIPER A1401",
        "supplier_code": "KR01812701",
        "supplier_local_name": "삼성전자 평택공장",
        "supplier_english_name": null,
        "base_quantity": "1",
        "processing_cost": "75000",
        "pcst_currency_unit": "KRW",
        "mi_material_code": "A001-01-01",
        "mi_material_name": "원유(서부텍사스중질유)",
        "category_code": "FEEDSTOCK",
        "category_name": "NA",
        "reqm_quantity_unit": "TON",
        "reqm_quantity": "10",
        "currency_unit": "USD",
        "mi_base_reqm_quantity": "10000",
        "quantity_unit": "TON",
        "exchange": "ICIS",
        "termsdelv": "CFR KOR",
        "use_flag": true
        key tenant_id             : String(40)    @title : '회사코드';
        key company_code          : String(240)   @title : '법인코드';
        key org_type_code         : String(40)    @title : '조직유형코드';
        key org_code              : String(240)   @title : '조직코드';
        key material_code         : String(40)    @title : '자재코드';
            material_desc         : String(240)   @title : '자재명';
        key supplier_code         : String(10)    @title : '공급업체코드';
            supplier_local_name   : String(240)   @title : '공급업체로컬명';
            supplier_english_name : String(240)   @title : '공급업체영문명';
            base_quantity         : Decimal(17, 3)@title : '기준수량';
            processing_cost       : Decimal(17, 3)@title : '가공비';
            pcst_currency_unit    : String(30)    @title : '가공비통화단위';
        key mi_material_code      : String(40)    @title : '시황자재코드';
            mi_material_name      : String(240)   @title : '시황자재명';
            category_code         : String(40)    @title : '카테고리코드';
            category_name         : String(240)   @title : '카테고리코드명';
            reqm_quantity_unit    : String(10)    @title : '소요수량단위';
            reqm_quantity         : Decimal(17, 3)@title : '소요수량';
        key currency_unit         : String(30)    @title : '통화단위';
            mi_base_reqm_quantity : Decimal(17, 3)@title : '시황자재기준소요수량';
        key quantity_unit         : String(10)    @title : '수량단위';
        key exchange              : String(10)    @title : '거래소';
        key termsdelv             : String(10)    @title : '인도조건';
            use_flag              : Boolean       @title : '사용여부';

            http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MaterialView/?$format=json&$top=5            
=============MaterialView
        "tenant_id": "L1100",
        "material_code": "6910BLC0006",
        "material_desc": "Primary Cell Battery,Lithium"

        http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MIMaterialCodeBOMManagementHeader/?$format=json&$top=5
        /MIMaterialCodeBOMManagementHeader(
        tenant_id='L2100',
        company_code='%2A',
        org_type_code='BU',
        org_code='BIZ00100',
        material_code='PRIACT0001',
        supplier_code='KR01820500',
        mi_bom_id='1')",

============= MIMaterialCodeBOMManagementHeader
"tenant_id": "L2100",
"company_code": "*",
"org_type_code": "BU",
"org_code": "BIZ00100",
"material_code": "PRIACT0001",
"supplier_code": "KR01820500",
"base_quantity": "1",
"processing_cost": "50000",
"pcst_currency_unit": "KRW",
"mi_bom_id": "1",
"local_create_dtm": "/Date(1606750140000)/",
"local_update_dtm": "/Date(1606750140000)/",
"create_user_id": "Admin",
"update_user_id": "Admin",
"system_create_dtm": "/Date(1606750140000)/",
"system_update_dtm": "/Date(1606750140000)/"

http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MIMaterialCodeBOMManagementItem/?$format=json&$top=5
=============  MIMaterialCodeBOMManagementItem

"tenant_id": "L2100",
"company_code": "*",
"org_type_code": "BU",
"org_code": "BIZ00100",
"mi_bom_id": "1",
"mi_material_code": "A001-01-01",
"reqm_quantity_unit": "TON",
"reqm_quantity": "10",
"currency_unit": "USD",
"quantity_unit": "TON",
"exchange": "ICIS",
"termsdelv": "CFR KOR",
"use_flag": true, 
"local_create_dtm": "/Date(1606750140000)/",
"local_update_dtm": "/Date(1606750140000)/",
"create_user_id": "Admin",
"update_user_id": "Admin",
"system_create_dtm": "/Date(1606750140000)/",
"system_update_dtm": "/Date(1606750140000)/"


if(comboboxUse_unitOfMeasureView.length<1){
<ComboBox   placeholder="선택"
    visible="{=!${oUi>/readMode}}" 
    items ="{
        path : '/UnitOfMeasureView',
        filters : [
                {path : 'tenant_id', 
                operator : 'EQ', 
                value1 : 'L2100'},  
                {path : 'language_code', 
                operator : 'EQ', 
                value1 : 'KO'}                                                                                                                                                                
        ]
    }"
    selectedKey="TON">  
<items> 
<core:ListItem key="{uom_code}" text="{uom_name}"/>
</items>
</ComboBox>                            







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







            
<Dialog title="Category 선택">
		<content>
        
        <VBox class="sapUiSmallMarginBegin" width="500px">
            <SearchField id="searchField_category_name" 
                            width="90%"
                            required="true" 
                            search=".onCategorySearch" 
                            selectOnFocus="false"
                            placeholder="Search Name or Code"
                            class="sapUiTinyMarginTop sapUiTinyMarginBegin" />
             <Table  id="reqmTable"
                    mode="SingleSelectLeft"
                    items="{mICategoryHierarchyStructure>/}"
                    noDataText="No Data"
                    class="sapUiSmallMargin sapUiSmallMarginTop"
            >
                <columns>
                    <Column hAlign="Center" ><header><Label text="Code"/></header></Column>
                    <Column hAlign="Center" ><header><Label text="Name"/></header></Column>                                                                                                                    
                </columns>
                <items>
                    <ColumnListItem type="Active">
                        <cells>
                            <Text text="{mICategoryHierarchyStructure>category_code}"/>
                            <Text text="{mICategoryHierarchyStructure>category_name}"/>
                        </cells>
                    </ColumnListItem>
                </items>
            </Table>                      
        </VBox>
		</content>
			<beginButton>
				<Button type="Transparent"  text="Cancel" press=".closeCategorySearchApply" />
               
			</beginButton>
            <endButton>
             <Button  text="Apply" 
             type="Emphasized"
             press=".onCategorySearchApply" />
            </endButton>
	</Dialog>

var input_mi_material_code = this.getView().byId("input_mi_material_code").getValue(),
input_category_code = this.getView().byId("input_category_code").getValue(),            
input_category_text = this.getView().byId("input_category_text").getValue();  



category_code
mICategoryView>/ category_text
<Text text="{mICategoryView>category_code}"/>
<Text text="{mICategoryView>category_text}"/>
<SelectDialog
id="valueHelpDialog"
title="Products"
class="sapUiPopupWithPadding"
items="{/ProductCollection}"
search="_handleValueHelpSearch"
confirm="_handleValueHelpClose"
cancel="_handleValueHelpClose"
multiSelect="true">
<StandardListItem
    icon="{ProductPicUrl}"
    iconDensityAware="false"
    iconInset="false"
    title="{Name}"
    description="{ProductId}" />
</SelectDialog>


