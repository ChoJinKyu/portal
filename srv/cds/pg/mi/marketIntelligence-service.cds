//Table
using {pg as MICategHierStru} from '../../../../db/cds/pg/mi/PG_MI_CATEGORY_HICHY_STRU-model';
using {pg as MICategText} from '../../../../db/cds/pg/mi/PG_MI_CATEGORY_LNG-model';
using {pg as MIMatCode} from '../../../../db/cds/pg/mi/PG_MI_MATERIAL_CODE-model';
using {pg as MIMatCodetext} from '../../../../db/cds/pg/mi/PG_MI_MATERIAL_CODE_LNG-model';
using {pg as MIExchange} from '../../../../db/cds/pg/mi/PG_MI_EXCHANGE_LNG-model';
using {pg as MITermsdelv} from '../../../../db/cds/pg/mi/PG_MI_TERMSDELV_LNG-model';
using {pg as MIMatPrcMngt} from '../../../../db/cds/pg/mi/PG_MI_MATERIAL_PRICE_MANAGEMENT-model';
using {pg as MIMatCdBOMMngt} from '../../../../db/cds/pg/mi/PG_MI_MATERIAL_CODE_BOM_MNGT-model';
//View
using {pg as MIMatPrcMngtView} from '../../../../db/cds/pg/mi/PG_MI_MAT_PRC_MANAGEMENT_VIEW-model';
using {pg as MICategDetlView} from '../../../../db/cds/pg/mi/PG_MI_CATEGORY_DETAIL_VIEW-model';
using {pg as MIMatCostInfoView} from '../../../../db/cds/pg/mi/PG_MI_MATERIAL_COST_INFO_VIEW-model';
using {pg as MICategHierStrView} from '../../../../db/cds/pg/mi/PG_MI_CATEGORY_HICHY_STRU_VIEW-model';
using {pg as MIMatCdBOMMngeView} from '../../../../db/cds/pg/mi/PG_MI_MAT_CODE_BOM_MANAGEMENT_VIEW-model';
using {pg as MIMaxNIDView} from '../../../../db/cds/pg/mi/PG_MI_MAX_NODE_ID_VIEW-model';
//Material
using {dp.Mm_Material_Desc_Lng as MaterialDesc} from '../../../../db/cds/dp/mm/DP_MM_MATERIAL_DESC_LNG-model';
//Supplier
using {sp.Sm_Supplier_Mst as SupplierMaster} from '../../../../db/cds/sp/supplierMgr/SP_SM_SUPPLIER_MST-model';
//CM ORG
using {cm.Org_Tenant as OrgTenant} from '../../../../db/cds/cm/orgMgr/CM_ORG_TENANT-model';
using {cm.Org_Company as OrgCompany} from '../../../../db/cds/cm/orgMgr/CM_ORG_COMPANY-model';
using {cm.Pur_Operation_Org as OrgPurchasingOperation} from '../../../../db/cds/cm/purOrgMgr/CM_PUR_OPERATION_ORG-model';
//CM Code
using {cm.Code_Mst as CodeMst} from '../../../../db/cds/cm/codeMgr/CM_CODE_MST-model';
using {cm.Code_Dtl as CodeDtl} from '../../../../db/cds/cm/codeMgr/CM_CODE_DTL-model';
using {cm.Code_Lng as CodeLng} from '../../../../db/cds/cm/codeMgr/CM_CODE_LNG-model';
//Unit Code
using {cm.Currency_Lng as CurrencyLanguage} from '../../../../db/cds/cm/currencyMgr/CM_CURRENCY_LNG-model';
using {dp.Mm_Unit_Of_Measure_Lng as UnitOfMeasure} from '../../../../db/cds/dp/mm/DP_MM_UNIT_OF_MEASURE_LNG-model';

namespace pg;

@path : '/pg.marketIntelligenceService'
service marketIntelligenceService {

    // Entity List
    entity MICategoryHierarchyStructure @(title : 'Category 계층구조')  as projection on MICategHierStru.MI_Category_Hichy_Stru;
    entity MICategoryText @(title : '카테고리명') as projection on MICategText.MI_Category_Lng;
    entity MIMaterialCode @(title : '시황자재 속성') as projection on MIMatCode.MI_Material_Code;
    entity MIMaterialCodeText @(title : '시황자재명') as projection on MIMatCodetext.MI_Material_Code_Lng;
    entity Exchange @(title : '거래소명') as projection on MIExchange.MI_Exchange_Lng;
    entity TermsOfDelivery @(title : '인도조건명') as projection on MITermsdelv.MI_Termsdelv_Lng;
    entity MIMaterialPriceManagement @(title : '시황자재 가격관리') as projection on MIMatPrcMngt.MI_Material_Price_Management;    
    entity MIMaterialCodeBOMManagement @(title : '자재별 시황자재 BOM 관리') as projection on MIMatCdBOMMngt.MI_Material_Code_Bom_Mngt;
    // View List
    view MIMaterialPriceManagementView @(title : '시황자재 가격관리 View') as select from MIMatPrcMngtView.MI_Mat_Prc_Management_View;
    view MICategoryDetailView @(title : '카테고리 상세내용 View') as select from MICategDetlView.MI_Cateogry_Detail_View;
    view MIMaterialCostInformationView @(title : '시황자재 가격정보 View') as select from MIMatCostInfoView.MI_Material_Cost_Info_View;
    view MICategoryHierarchyStructureView @(title : '시황자재 카테고리 계층구조 View') as select from MICategHierStrView.MI_Cateogry_Hichy_Stru_View;
    view MIMaterialCodeBOMManagementView @(title : '자재별 시황자재 BOM 관리 View') as select from MIMatCdBOMMngeView.MI_Mat_Code_BOM_Management_View;
    view MIMaxNodeIDView @(title : '최대노드ID View')  as select from MIMaxNIDView.MI_Max_Node_ID_View;

    // Tenant View
    view OrgTenantView @(title : '회사코드 View') as
        select
            key tenant_id, //회사코드
                tenant_name //회사코드명
        from OrgTenant;

    // Company View
    view OrgCompanyView @(title : '법인코드 View') as
        select
            key tenant_id, //회사코드
            key company_code, //법인코드
                company_name //법인코드명
        from OrgCompany;

    // Organizaiton Type Code View
    view OrgTypeCodeView @(title : '조직유형코드 View') as
        select
            key tenant_id, //회사코드
            key code, //조직유형코드
                code_name //조직유형코드명
        from CodeLng
        where
                group_code  = 'CM_ORG_TYPE_CODE'
            and language_cd = 'KO';

    // Organizaiton Code View
    view OrgCodeView @(title : '조직코드 View') as
        select
            key tenant_id, //회사코드
            key company_code, //법인코드
            key org_type_code, //조직유형코드
            key org_code, //조직코드
                org_name //조직코드명
        from OrgPurchasingOperation;

    // MI Material Code View
    view MIMatCodeView @(title : '시황자재코드 View') as
        select
            key tenant_id, //회사코드
            key company_code, //법인코드
            key org_type_code, //조직유형코드
            key org_code, //조직코드
            key mi_material_code, //시황자재
                mi_material_name //시황자재명
        from MIMaterialCodeText
        where
            language_code = 'KO';

    // MI Parent Category View
    view MIParentCategoryView @(title : '상위카테고리코드 View') as
        select
            key main.tenant_id     as tenant_id, //회사코드
            key main.company_code  as company_code, //법인코드
            key main.org_type_code as org_type_code, //조직유형코드
            key main.org_code      as org_code, //조직코드
            key main.category_code as category_code, //카테고리코드
                main.category_name as category_name //카테고리명
        from MICategoryText as main
        left join MICategoryHierarchyStructure as catg
            on  main.tenant_id     = catg.tenant_id
            and main.company_code  = catg.company_code
            and main.org_type_code = catg.org_type_code
            and main.org_code      = catg.org_code
            and main.category_code = catg.category_code
        where
                main.language_code        =  'KO'
            and catg.parent_category_code is null
        group by
            main.tenant_id,
            main.company_code,
            main.org_type_code,
            main.org_code,
            main.category_code,
            main.category_name;

    // MI Category View
    view MICategoryView @(title : '카테고리 View') as
        select
            key main.tenant_id     as tenant_id, //회사코드
            key main.company_code  as company_code, //법인코드
            key main.org_type_code as org_type_code, //조직유형코드
            key main.org_code      as org_code, //조직코드
            key main.category_code as category_code, //카테고리코드
                main.category_name as category_text //카테고리명
        from MICategoryText as main
        left join MICategoryHierarchyStructure as catg
            on  main.tenant_id     = catg.tenant_id
            and main.company_code  = catg.company_code
            and main.org_type_code = catg.org_type_code
            and main.org_code      = catg.org_code
            and main.category_code = catg.category_code
        where
                main.language_code        =      'KO'
            and catg.parent_category_code is not null
        group by
            main.tenant_id,
            main.company_code,
            main.org_type_code,
            main.org_code,
            main.category_code,
            main.category_name;

    // Use Y/N View
    view UseYNView @(title : '사용여부 View') as
        select
            key tenant_id, //회사코드
            key code, //사용여부
                code_name //사용여부명
        from CodeLng
        where
                group_code  = 'CM_TF_FLAG'
            and language_cd = 'EN';

    // Language View
    view LanguageView @(title : '언어코드 View') as
        select
            key tenant_id, //회사코드
            key code, //언어코드
                code_name //언어코드명
        from CodeLng
        where
                group_code  = 'CM_LANG_CODE'
            and language_cd = 'KO';

    // Currency Unit View
    view CurrencyUnitView @(title : '통화단위코드 View') as
        select
            key tenant_id, //회사코드
            key currency_code, //통화단위코드
            key language_code, //언어코드
                currency_code_name //통화단위코드명
        from CurrencyLanguage;

    // Unit of Measure View
    view UnitOfMeasureView @(title : '수량단위코드 View') as
        select
            key tenant_id, //회사코드
            key uom_code, //수량단위코드
            key language_code, //언어코드
                uom_name //수량단위코드명
        from UnitOfMeasure;

    // MI Material Category List View
    view MIMatCategListView @(title : '시황자재 상위카테고리/카테고리 List View') as
        select
            key main.tenant_id            as tenant_id, //회사코드
            key main.company_code         as company_code, //법인코드
            key main.org_type_code        as org_type_code, //조직유형코드
            key main.org_code             as org_code, //조직코드
                main.parent_category_code as parent_category_code, //상위카테고리코드
                prtCatgText.category_name as parent_category_name, //상위카테고리명
            key main.category_code        as category_code, //카테고리코드
                catgText.category_name    as category_name, //카테고리명
                main.use_flag             as use_flag //사용여부
        from MICategoryHierarchyStructure as main
        left join MICategoryText as prtCatgText
            on  main.tenant_id            = prtCatgText.tenant_id
            and main.company_code         = prtCatgText.company_code
            and main.org_type_code        = prtCatgText.org_type_code
            and main.org_code             = prtCatgText.org_code
            and main.parent_category_code = prtCatgText.category_code
            and prtCatgText.language_code = 'KO'
        left join MICategoryText as catgText
            on  main.tenant_id         = catgText.tenant_id
            and main.company_code      = catgText.company_code
            and main.org_type_code     = catgText.org_type_code
            and main.org_code          = catgText.org_code
            and main.category_code     = catgText.category_code
            and catgText.language_code = 'KO'
        group by
            main.tenant_id,
            main.company_code,
            main.org_type_code,
            main.org_code,
            main.parent_category_code,
            prtCatgText.category_name,
            main.category_code,
            catgText.category_name,
            main.use_flag;

    // MI Material List View
    view MIMatListView @(title : '시황자재 List View') as
        select
            key main.tenant_id           as tenant_id, //회사코드
            key main.company_code        as company_code, //법인코드
            key main.org_type_code       as org_type_code, //조직유형코드
            key main.org_code            as org_code, //조직코드
            key main.mi_material_code    as mi_material_code, //시황자재
                matText.mi_material_name as mi_material_name, //시황자재명
                main.category_code       as category_code, //카테고리코드
                catg.category_name       as category_name, //카테고리명
                main.use_flag            as use_flag //사용여부
        from MIMaterialCode as main
        left join MIMaterialCodeText as matText
            on  main.tenant_id        = matText.tenant_id
            and main.company_code     = matText.company_code
            and main.org_type_code    = matText.org_type_code
            and main.org_code         = matText.org_code
            and main.mi_material_code = matText.mi_material_code
            and matText.language_code = 'KO'
        left join MICategoryText as catg
            on  main.tenant_id     = catg.tenant_id
            and main.company_code  = catg.company_code
            and main.org_type_code = catg.org_type_code
            and main.org_code      = catg.org_code
            and main.category_code = catg.category_code
            and catg.language_code = 'KO'
        group by
            main.tenant_id,
            main.company_code,
            main.org_type_code,
            main.org_code,
            main.mi_material_code,
            matText.mi_material_name,
            main.category_code,
            catg.category_name,
            main.use_flag;

    // Material View
    view MaterialView @(title : '자재코드 조회 View') as
        select distinct
            key tenant_id, //회사코드
            key material_code, //자재코드
                material_desc //자재코드명
        from MaterialDesc
        order by
            tenant_id,
            material_code;

    // // Supplier View
    view SupplierView @(title : '공급업체 조회 View') as
        select distinct
            key tenant_id, //회사코드
            key supplier_code, //공급업체코드
                supplier_local_name, //공급업체로컬명
                supplier_english_name //공급업체영어명
        from SupplierMaster
        order by
            tenant_id,
            supplier_code;

    // Category&MI Material View
    view CategoryMIMaterialView @(title : '카테고리&시황자재 View') as
        select
            key mi_mat_cd.tenant_id             as tenant_id, //회사코드
            key mi_mat_cd.company_code          as company_code, //법인코드
            key mi_mat_cd.org_type_code         as org_type_code, //조직유형코드
            key mi_mat_cd.org_code              as org_code, //조직코드
            key mi_mat_cd.mi_material_code      as mi_material_code, //시황자재코드
                mi_mat_cd_lang.mi_material_name as mi_material_name, //시황자재명
                mi_mat_cd.category_code         as category_code, //카테고리코드
                mi_cat_lang.category_name       as category_name //카테고리명
        from MIMaterialCode as mi_mat_cd
        left join MIMaterialCodeText as mi_mat_cd_lang
            on  mi_mat_cd.tenant_id             = mi_mat_cd_lang.tenant_id
            and mi_mat_cd.company_code          = mi_mat_cd_lang.company_code
            and mi_mat_cd.org_type_code         = mi_mat_cd_lang.org_type_code
            and mi_mat_cd.org_code              = mi_mat_cd_lang.org_code
            and mi_mat_cd.mi_material_code      = mi_mat_cd_lang.mi_material_code
            and mi_mat_cd_lang.language_code    = 'KO'
        left join MICategoryText as mi_cat_lang
            on  mi_mat_cd.tenant_id         = mi_cat_lang.tenant_id
            and mi_mat_cd.company_code      = mi_cat_lang.company_code
            and mi_mat_cd.org_type_code     = mi_cat_lang.org_type_code
            and mi_mat_cd.org_code          = mi_cat_lang.org_code
            and mi_mat_cd.category_code     = mi_cat_lang.category_code
            and mi_cat_lang.language_code   = 'KO'
        group by
            mi_mat_cd.tenant_id,
            mi_mat_cd.company_code,
            mi_mat_cd.org_type_code,
            mi_mat_cd.org_code,
            mi_mat_cd.mi_material_code,
            mi_mat_cd_lang.language_code,
            mi_mat_cd_lang.mi_material_name,
            mi_mat_cd.category_code,
            mi_cat_lang.language_code,
            mi_cat_lang.category_name;

// Procedure 사용
/*type MiMaterialPriceManagementPtype{
    cud_flag : String(1);
    tenant_id : String(5);
    company_code : String(10);
    org_type_code : String(30);
    org_code : String(10);
    mi_material_code : String(40);
    mi_material_code_text : String(240);
category : String(40);
category_text : String(240);
use_flag : Boolean;
exchange : String(10);
currency_unit : String(30);
quantity_unit : String(10);
exchange_unit : String(40);
terms : String(10);
sourcing_group : String(10);
delivery_month : String(10);
mi_date : Date;
amount : Decimal(17, 3);
};

action MiMaterialPriceManagement (value : array of MiMaterialPriceManagementPtype) returns String;
*/
}
