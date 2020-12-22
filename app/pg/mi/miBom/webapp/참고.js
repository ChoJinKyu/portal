readChecklistItemEntity(oDeleteInfoOdata[i]).then(function(oDeleteInfoOdata) {
    var that = this;
    console.log(" >>>>>>>>>>>>>>>>>>> readChecklistItemEntity then <<<<<<<<<<<<<<<<<<<<<<<< ");
    console.log("oDeleteInfoOdata.delete_bom_item_count : " + oDeleteInfoOdata.delete_bom_item_count);
    console.log("oDeleteInfoOdata.resultCount : " + oDeleteInfoOdata.resultCount);
    var _deleteItemOdata = _deleteItem.getProperty("/delData");
    //남아 있는 아이템과 삭제하는 아이템갯수가 같을때만 헤더정보를 삭제한다.
    if(oDeleteInfoOdata.resultCount == oDeleteInfoOdata.delete_bom_item_count){

        console.log(" >>>>>>>>>>>>>>>>>>> oModel.remove Header <<<<<<<<<<<<<<<<<<<<<<<< ");
        console.log("delete odata path : ", oDeleteInfoOdata.deleteOdataPath);
        
        oModel.remove(oDeleteInfoOdata.deleteOdataPath,{ 
                groupId: "pgGroup" 
            }
        );
    }
}); //readChecklistItemEntity end


_fnSetDeleteMode

that.getOwnerComponent().setModel(oMidList, "_midList");



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


a.open()
a.setBusyIndicatorDelay(40000);

            
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

3: constructor {sPath: "mi_bom_id", sOperator: "EQ", oValue1: "1", oValue2: undefined, _bMultiFilter: false}
4: constructor {sPath: "mi_material_code", sOperator: "EQ", oValue1: "A001-01-01", oValue2: undefined, _bMultiFilter: false}
5: constructor {sPath: "currency_unit", sOperator: "EQ", oValue1: "USD", oValue2: undefined, _bMultiFilter: false}
6: constructor {sPath: "quantity_unit", sOperator: "EQ", oValue1: "MT", oValue2: undefined, _bMultiFilter: false}
7: constructor {sPath: "exchange", sOperator: "EQ", oValue1: "Platts%20", oValue2: undefined, _bMultiFilter: false}
8: constructor {sPath: "termsdelv", sOperator: "EQ", oValue1: "FOB%20KOR", oValue2: undefined, _bMultiFilter: false}
length: 9
__proto__: Array(0)

tenant_id eq 'L2100' and material_code eq 'PRIACT0001' and supplier_code eq 'KR01820500' and mi_bom_id eq '1' and mi_material_code eq 'A001-01-01' and currency_unit eq 'USD' and quantity_unit eq 'MT' and exchange='Platts%20' and termsdelv eq 'FOB%20KOR'
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


