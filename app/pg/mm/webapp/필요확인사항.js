/*
MIMaterialCostInformationView 데이타 확인되지 않고 있음


팝업 닫기 버튼 필요 

KR00008	이지금
https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap/pg/mi/webapp/srv-api/odata/v2/pg.marketIntelligenceService/OrgCodeView?$filter=org_code eq 'KR00008'
1. 질문 내역 초기 실행시 
초기 Create의 정보는 어떻게 선택할것인가.? (mi, mm )
onMainTableCreate

maint list view 화면 작성
수정 예정====

mi, mm 모두 수정해야함 
-mi 메인에서 항목 삭제시 언어도 삭제해야함 

--controller

--view
controll 파일 작업
자재별 시황자재 BOM 등록 view ,.controller 작업
참조 삭제시 json등록 데이타라도 바로 삭제 하지 않는다. 

sap.ui.core.Fragment.byId("Change_id", "inputMaterialCode").getValue();

https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap/pg/mi/webapp/srv-api/odata/v2/pg.marketIntelligenceService/MIMaterialCodeBOMManagement/?$filter=


                       <Label text="{midObjectData>/tenant_name}"  class="sapUiTinyMarginBegin sapUiLargeMarginEnd" design="Bold"/>
                                    <Label text="Create :"  class="sapUiLargeMarginBegin"/>
                                    <Label text="{midObjectData>/create}" class="sapUiTinyMarginBegin sapUiLargeMarginEnd" design="Bold"/>
                                    <Label text="Create Data :" class="sapUiLargeMarginBegin" />
                                    <Label text="{midObjectData>/createdata}"  class="sapUiTinyMarginBegin"  design="Bold"/>    


                            <FlexBox height="40px" alignItems="Start" justifyContent="Start">
                                    <Label text="관리조직 :" />
                                    <Label text="LGE_MC" class="sapUiTinyMarginBegin sapUiLargeMarginEnd" design="Bold"/>
                                    <Label text="Create :" class="sapUiLargeMarginBegin"/>
                                    <Label text="LGE_MC" class="sapUiTinyMarginBegin sapUiLargeMarginEnd" design="Bold"/>
                                    <Label text="Create Data :" class="sapUiLargeMarginBegin" />
                                    <Label text="2020-08-02" class="sapUiTinyMarginBegin"  design="Bold"/>                                                                                                        
                            </FlexBox>  

                        <FlexBox
				class="ne-flexbox2"
				renderType="List"
				justifyContent="SpaceBetween"
				alignItems="Center">
                            <layout:VerticalLayout>
                                <ObjectStatus title="관리조직" design="Bold" text="LGE_MC"/>                        
                            </layout:VerticalLayout>
                            <layout:VerticalLayout>
                                <ObjectStatus title="Create" design="Bold" text="Je..."/>                        
                            </layout:VerticalLayout>
                            <layout:VerticalLayout>
                                <ObjectStatus title="Create Date" design="Bold" text="2020-08-02"/>                        
                            </layout:VerticalLayout>
                        </FlexBox>           

                                <VBox>   
                                <HBox>
                                 <Label text="자재정보" design="Bold" class="sapMLabelNoText" required="true" labelFor="inputMaterialCode"/>                              
                                </HBox>   
                                <HBox >  
                                        	<RadioButtonGroup id="rbg1" columns="3" width="100%">
                                                <RadioButton id="RB1-1" text="자재명/코드" />
                                                <RadioButton id="RB1-2" text="공급업체/코드" />
                                            </RadioButtonGroup>                                            
                                </HBox>  
                                 <HBox width="100%">        
                                            <Input text="ss"/>
                                        </HBox>
                                    </VBox>
$filter=Alias eq 'random' 
---data
자재명 뷰 
MaterialView
sap.m.PopinDisplay.Block Inside the table popin, header is displayed at the first line and cell content is displayed at the next line.
sap.m.PopinDisplay.Inline Inside the table popin, cell content is displayed next to the header in the same line.
sap.m.PopinDisplay.WithoutHeader Inside the table popin, only the cell content will be visible.

OrgTenantView Tent정보 

테이블 리스트 
https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap/pg/mi/webapp/srv-api/odata/v2/pg.marketIntelligenceService/MIMaterialCodeBOMManagement/?$filter=material_desc eq 'Cathode Active Material LCH20D' 

material_code,material_desc,supplier_code,base_quantity,processing_cost,mi_material_code,mi_material_name,category_name,reqm_quantity_unit,reqm_quantity,currency_unit,mi_base_reqm_quantity,quantity_unit,exchange,termsdelv,use_flag
entity MI_Material_Code_Bom_Mngt {
    key tenant_id             : String(5) not null  @title : '회사코드';
    key company_code          : String(10) not null @title : '법인코드';
    key org_type_code         : String(30) not null @title : '조직유형코드';
    key org_code              : String(10) not null @title : '조직코드';
    key material_code         : String(40) not null @title : '자재코드';
        material_desc  : String(300)         @title : '자재내역';
    key supplier_code         : String(15) not null @title : '공급업체코드';
        supplier_local_name   : String(240)         @title : '공급업체로컬명';
        supplier_english_name : String(240)         @title : '공급업체영문명';
        base_quantity         : Decimal not null    @title : '기준수량';
        processing_cost       : Decimal not null    @title : '가공비';
        pcst_currency_unit    : String(30) not null @title : '가공비통화단위';
    key mi_material_code      : String(40) not null @title : '시황자재코드';
        mi_material_name : String(240)         @title : '시황자재코드명';
        category_code         : String(40)          @title : '카테고리코드';
        category_name         : String(240)         @title : '카테고리명';
        reqm_quantity_unit    : String(3) not null  @title : '소요수량단위';
        reqm_quantity         : Decimal not null    @title : '소요수량';
        currency_unit         : String(30) not null @title : '통화단위';
        mi_base_reqm_quantity : Decimal not null    @title : '시황기준소요수량';
        quantity_unit         : String(3) not null  @title : '수량단위';
        exchange              : String(10) not null @title : '거래소';
        termsdelv             : String(10) not null @title : '인도조건';
        use_flag              : Boolean not null    @title : '사용여부';


https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap/pg/mi/webapp/srv-api/odata/v2/pg.marketIntelligenceService/MIMaterialCodeBOMManagement/?$format=json


manifest.json back

{
  "_version": "1.12.0",
  "sap.app": {
    "id": "pg.mm",
    "type": "application",
    "i18n": "i18n/i18n.properties",
    "title": "{{appTitle}}",
    "description": "{{appDescription}}",
    "applicationVersion": {
      "version": "1.0.0"
    },
    "ach": "set-ach",
    "resources": "resources.json",
    "dataSources": {
      "mainService": {
        "uri": "srv-api/odata/v2/pg.marketIntelligenceService/",
        "type": "OData",
        "settings": {
          "odataVersion": "2.0"
        }
      },
      "commonUtilService": {
        "uri": "srv-api/odata/v2/util.CommonService/",
        "type": "OData",
        "settings": {
          "odataVersion": "2.0"
        }
      }
    }
  },
  "sap.fiori": {
    "registrationIds": [],
    "archeType": "transactional"
  },
  "sap.ui": {
    "technology": "UI5",
    "icons": {
      "icon": "sap-icon://task",
      "favIcon": "",
      "phone": "",
      "phone@2": "",
      "tablet": "",
      "tablet@2": ""
    },
    "deviceTypes": {
      "desktop": true,
      "tablet": true,
      "phone": true
    }
  },
  "sap.ui5": {
    "rootView": {
      "viewName": "pg.mm.view.App",
      "type": "XML",
      "async": true,
      "id": "app"
    },
    "dependencies": {
      "minUI5Version": "1.66.0",
      "libs": {
        "sap.ui.core": {},
        "sap.m": {},
        "sap.f": {}
      }
    },
    "contentDensities": {
      "compact": true,
      "cozy": true
    },
    "handleValidation": true,
    "models": {
      "i18n": {
        "type": "sap.ui.model.resource.ResourceModel",
        "settings": {
          "bundleName": "pg.mm.i18n.i18n"
        }
      },
      "util": {
        "dataSource": "commonUtilService",
        "preload": true,
        "settings": {
          "defaultBindingMode": "TwoWay",
          "defaultCountMode": "Inline",
          "refreshAfterChange": false,
          "useBatch": true
        }
      },
      "": {
        "dataSource": "mainService",
        "preload": true,
        "settings": {
          "defaultBindingMode": "TwoWay",
          "defaultCountMode": "Inline",
          "refreshAfterChange": true,
          "useBatch": true
        }
      }
    },
    "resourceRoots": {
      "ext.lib": "../../../lib"
    },
    "routing": {
      "config": {
        "routerClass": "sap.m.routing.Router",
        "viewType": "XML",
        "viewPath": "pg.mm.view",
        "controlId": "fcl",
				"transition": "slide",
        "bypassed": {
          "target": [
            "notFound"
          ]
        },
        "async": true
      },
      "routes": [
          {
              "pattern": ":layout:",
              "name": "mainPage",
              "target": [
                  "mainObject"
              ]
          },
          {  
              "pattern": "midObject/{layout}/{tenant_id}/{company_code}/{org_type_code}/{org_code}/{mi_material_code}",
              "name": "midPage",
              "target": [
                  "mainObject",
                  "midObject"
              ]
          }
      ],
      "targets": {
          "mainObject": {
              "viewName": "MainList",
              "controlAggregation": "beginColumnPages"
          },
          "midObject": {
              "viewName": "MidObject",
              "controlAggregation": "midColumnPages"
          },
          "notFound": {
            "viewName": "MidObjectNotFound",
            "viewId": "notFound"
          }
      }
    }
  },
  "sap.cloud": {
    "public": true,
    "service": "sppCap_ui_dev"
  }
}