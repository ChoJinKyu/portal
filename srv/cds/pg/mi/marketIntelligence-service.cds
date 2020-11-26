//Table
using {pg as MICateg} from '../../../../db/cds/pg/mi/PG_MI_CATEGORY-model';
using {pg as MICategText} from '../../../../db/cds/pg/mi/PG_MI_CATEGORY_LNG-model';
using {pg as MICategList} from '../../../../db/cds/pg/mi/PG_MI_CATEGORY_LIST-model';
using {pg as MIMatCode} from '../../../../db/cds/pg/mi/PG_MI_MATERIAL_CODE-model';
using {pg as MIMatCodetext} from '../../../../db/cds/pg/mi/PG_MI_MATERIAL_CODE_LNG-model';
using {pg as MIMatCodeList} from '../../../../db/cds/pg/mi/PG_MI_MATERIAL_CODE_LIST-model';
using {pg as MIMatPrcMngt} from '../../../../db/cds/pg/mi/PG_MI_MATERIAL_PRICE_MANAGEMENT-model';
using {pg as MICategHierStru} from '../../../../db/cds/pg/mi/PG_MI_CATEGORY_HICHY_STRU-model';
using {pg as MIMatCdBOMMngt} from '../../../../db/cds/pg/mi/PG_MI_MATERIAL_CODE_BOM_MNGT-model';
//View
using {pg as MIMatPrcMngtView} from '../../../../db/cds/pg/mi/PG_MI_MAT_PRC_MANAGEMENT_VIEW';
using {pg as MICategDetlView} from '../../../../db/cds/pg/mi/PG_MI_CATEGORY_DETAIL_VIEW';
using {pg as MIMatCostInfoView} from '../../../../db/cds/pg/mi/PG_MI_MATERIAL_COST_INFO_VIEW';
//Material
//using {dp. as MaterialDesc} from '../../../'
//Supplier
//using
//CM ORG
using {cm.Org_Tenant as OrgTenant} from '../../../../db/cds/cm/orgMgr/CM_ORG_TENANT-model';
using {cm.Org_Company as OrgCompany} from '../../../../db/cds/cm/orgMgr/CM_ORG_COMPANY-model';
using {cm.Pur_Operation_Org as OrgPurchasingOperation} from '../../../../db/cds/cm/purOrgMgr/CM_PUR_OPERATION_ORG-model';
//CM Code
using {cm.Code_Mst as codeMst} from '../../../../db/cds/cm/codeMgr/CM_CODE_MST-model';
using {cm.Code_Dtl as codeDtl} from '../../../../db/cds/cm/codeMgr/CM_CODE_DTL-model';
using {cm.Code_Lng as codeLng} from '../../../../db/cds/cm/codeMgr/CM_CODE_LNG-model';

namespace pg;

@path : '/pg.marketIntelligenceService'
service marketIntelligenceService {

    // Entity List
    entity MICategory @(title : '카테고리속성')                           as projection on MICateg.MI_Category;
    entity MICategoryText @(title : '카테고리명')                        as projection on MICategText.MI_Category_Lng;
    entity MICategoryList @(title : '카테고리 List')                    as projection on MICategList.MI_Category_List;
    entity MIMaterialCode @(title : '시황자재 속성')                      as projection on MIMatCode.MI_Material_Code;
    entity MIMaterialCodeText @(title : '시황자재명')                    as projection on MIMatCodetext.MI_Material_Code_Lng;
    entity MIMaterialCodeList @(title : '시황자재 List')                as projection on MIMatCodeList.MI_Material_Code_List;
    entity MIMaterialPriceManagement @(title : '시황자재 가격관리')         as projection on MIMatPrcMngt.MI_Material_Price_Management;
    entity MICategoryHierarchyStructure @(title : 'Category 계층구조')  as projection on MICategHierStru.MI_Category_Hichy_Stru;
    entity MIMaterialCodeBOMManagement @(title : '자제별 시황자재 BOM 관리') as projection on MIMatCdBOMMngt.MI_Material_Code_Bom_Mngt;
    // View List
    view MIMaterialPriceManagementView @(title : '시황자재 가격관리 View') as select from MIMatPrcMngtView.MI_Mat_Prc_Management_View;
    view MICategoryDetailView @(title : '카테고리 상세내용 View') as select from MICategDetlView.MI_Cateogry_Detail_View;
    view MIMaterialCostInformationView @(title : '시황자재 가격정보 View') as select from MIMatCostInfoView.MI_Material_Cost_Info_View;

    // Tenant View: 회사
    view OrgTenantView @(title : '회사 View') as
        select
            key tenant_id, //회사코드
                tenant_name //회사코드명
        from OrgTenant;

    // Company View: 법인
    view OrgCompanyView @(title : '법인 View') as
        select
            key tenant_id, //회사코드
            key company_code, //법인코드
                company_name //법인코드명
        from OrgCompany;

    // Organizaiton Type Code View: 조직유형코드
    view OrgTypeCodeView @(title : '조직유형코드 View') as
        select
            key tenant_id, //회사코드
            key code, //조직유형코드
                code_name //조직유형코드명
        from codeLng
        where
                group_code  = 'CM_ORG_TYPE_CODE'
            and language_cd = 'KO';

    // Organizaiton Code View: 조직코드
    view OrgCodeView @(title : '조직코드 View') as
        select
            key tenant_id, //회사코드
            key company_code, //법인코드
            key org_type_code, //조직유형코드
            key org_code, //조직코드
                org_name //조직코드명
        from OrgPurchasingOperation;

    // MI Material Code View: 시황자재
    view MIMatCodeView @(title : '시황자재코드 View') as
        select
            key tenant_id, //회사코드
            key company_code, //법인코드
            key org_type_code, //조직유형코드
            key org_code, //조직코드
            key mi_material_code, //시황자재
                mi_material_code_name //시황자재명
        from MIMaterialCodeText
        where
            language_code = 'KO';

    // MI Parent Category View: Category
    view MIParentCategoryView @(title : '상위 Category View') as
        select
            key main.tenant_id     as tenant_id, //회사코드
            key main.company_code  as company_code, //법인코드
            key main.org_type_code as org_type_code, //조직유형코드
            key main.org_code      as org_code, //조직코드
            key main.category_code as category_code, //Category
                main.category_name as category_name //Category명
        from MICategoryText as main
        left join MICategory as catg
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

    // MI Category View: Category
    view MICategoryView @(title : 'Category View') as
        select
            key main.tenant_id     as tenant_id, //회사코드
            key main.company_code  as company_code, //법인코드
            key main.org_type_code as org_type_code, //조직유형코드
            key main.org_code      as org_code, //조직코드
            key main.category_code as category_code, //Category
                main.category_name as category_text //Category명
        from MICategoryText as main
        left join MICategory as catg
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

    // Use Y/N View: 사용여부
    view UseYNView @(title : '사용여부 View') as
        select
            key tenant_id, //회사코드
            key code, //사용여부
                code_name //사용여부명
        from codeLng
        where
                group_code  = 'CM_USE_FLAG'
            and language_cd = 'KO';

    // Language View: 언어
    view LanguageView @(title : '사용여부 View') as
        select
            key tenant_id, //회사코드
            key code, //언어코드
                code_name //언어코드명
        from codeLng
        where
                group_code  = 'CM_LANG_CODE'
            and language_cd = 'KO';

    // MI Material Category List View: 시황자재 Category List
    view MIMatCategListView @(title : '시황자재 Category List View') as
        select
            key main.tenant_id            as tenant_id, //회사코드
            key main.company_code         as company_code, //법인코드
            key main.org_type_code        as org_type_code, //조직유형코드
            key main.org_code             as org_code, //조직코드
            key main.parent_category_code as parent_category_code, //상위Category
                prtCatgText.category_name as parent_category_name, //상위Category명
            key main.category_code        as category_code, //Category
                catgText.category_name    as category_name, //Category명
                main.use_flag             as use_flag //사용여부
        from MICategory as main
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

    // MI Material List View: 시황자재 List
    view MIMatListView @(title : '시황자재 List View') as
        select
            key main.tenant_id                as tenant_id, //회사코드
            key main.company_code             as company_code, //법인코드
            key main.org_type_code            as org_type_code, //조직유형코드
            key main.org_code                 as org_code, //조직코드
            key main.mi_material_code         as mi_material_code, //시황자재
                matText.mi_material_code_name as mi_material_code_name, //시황자재명
                main.category_code            as category_code, //Category
                catg.category_name            as category_name, //Category명
                main.use_flag                 as use_flag //사용여부
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
            matText.mi_material_code_name,
            main.category_code,
            catg.category_name,
            main.use_flag;

    // Material View: 자재
    // view MaterialView @(title: '자재 View') as
    // 	select
    // 			tenant_id,
    // 			material_code,
    // 			language_code,
    // 			material_description
    // 	from 	dp_mm_material_desc_lng
    // 	order by
    // 			tenant_id,
    // 			material_code
    // 	;

    // // Supplier View: 공급업체
    // view SupplierView @(title: '공급업체 View') as
    // 	select
    // 			distinct tenant_id,
    // 			supplier_code,
    // 			supplier_local_name,
    // 			supplier_english_name
    // 	from	sp_sp_sup_supplier_mst
    // 	order by
    // 			tenant_id,
    // 			supplier_code
    // 	;

    // Category&MI Material View: 카테고리&시황자재 View
    view CategoryMIMaterialView @(title : '카테고리&시황자재 View') as
        select
            key mi_mat_cd.tenant_id                  as tenant_id,
            key mi_mat_cd.company_code               as company_code,
            key mi_mat_cd.org_type_code              as org_type_code,
            key mi_mat_cd.org_code                   as org_code,
            key mi_mat_cd.mi_material_code           as mi_material_code,
                mi_mat_cd_lang.language_code         as mi_material_language_code,
                mi_mat_cd_lang.mi_material_code_name as mi_material_code_name,
                mi_mat_cd.category_code              as category_code,
                mi_cat_lang.language_code            as category_code_language_code,
                mi_cat_lang.category_name            as category_name
        from MIMaterialCode as mi_mat_cd
        left join MIMaterialCodeText as mi_mat_cd_lang
            on  mi_mat_cd.tenant_id        = mi_mat_cd_lang.tenant_id
            and mi_mat_cd.company_code     = mi_mat_cd_lang.company_code
            and mi_mat_cd.org_type_code    = mi_mat_cd_lang.org_type_code
            and mi_mat_cd.org_code         = mi_mat_cd_lang.org_code
            and mi_mat_cd.mi_material_code = mi_mat_cd_lang.mi_material_code
        left join MICategoryText as mi_cat_lang
            on  mi_mat_cd.tenant_id     = mi_cat_lang.tenant_id
            and mi_mat_cd.company_code  = mi_cat_lang.company_code
            and mi_mat_cd.org_type_code = mi_cat_lang.org_type_code
            and mi_mat_cd.org_code      = mi_cat_lang.org_code
            and mi_mat_cd.category_code = mi_cat_lang.category_code
        group by
            mi_mat_cd.tenant_id,
            mi_mat_cd.company_code,
            mi_mat_cd.org_type_code,
            mi_mat_cd.org_code,
            mi_mat_cd.mi_material_code,
            mi_mat_cd_lang.language_code,
            mi_mat_cd_lang.mi_material_code_name,
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
