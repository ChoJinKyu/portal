//CM ORG
using {cm.Org_Tenant as OrgTenant} from '../../../../db/cds/cm/CM_ORG_TENANT-model';                // Tenant(회사)
using {cm.Org_Company as OrgCompany} from '../../../../db/cds/cm/CM_ORG_COMPANY-model';             // Company(법인)
using {cm.Org_Unit as OrgUnit} from '../../../../db/cds/cm/CM_ORG_UNIT-model';                      // Bizunit(사업본부)
using {cm.Org_Plant as OrgPlant} from '../../../../db/cds/cm/CM_ORG_PLANT-model';                   // Plant(플랜트)
using {cm.Org_Purchasing as OrgPurchasing} from '../../../../db/cds/cm/CM_ORG_PURCHASING-model';    // Purchasing(구매조직)
using {cm.Org_Division as OrgDivision} from '../../../../db/cds/cm/CM_ORG_DIVISION-model';          // Division(사업부)

//CM CODE
using {cm.Code_Mst as CodeMst} from '../../../../db/cds/cm/CM_CODE_MST-model';              // CodeMst(공통마스터코드)
using {cm.Code_Dtl as CodeDtl} from '../../../../db/cds/cm/CM_CODE_DTL-model';              // CodeDtl(공통코드상세)
using {cm.Code_Lng as CodeLng} from '../../../../db/cds/cm/CM_CODE_LNG-model';              // CodeLng(공통코드언어)
using {cm.Country_View as CountryView} from '../../../../db/cds/cm/CM_COUNTRY_VIEW-model';  // CountryView(국가/원산지)

//DP MM
using {dp.Mm_Material_Mst as MaterialMst} from '../../../../db/cds/dp/mm/DP_MM_MATERIAL_MST-model';          // Material Mst(자재일반)

//PG VP
using {pg.Vp_Vendor_Pool_Mst as VendorPoolMst} from '../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_MST-model';                // Vendor Pool Mst(Vendor Pool Mst)
using {pg.Vp_Vendor_Pool_Item_Dtl as VendorPoolItemDtl} from '../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_ITEM_DTL-model';  // Vendor Pool Item Dtl(Vendor Pool 품목연결상세)

// SP SM
using {sp.Sm_Supplier_Mst as SupplierMst} from '../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model';     // Supplier Mst(공급업체 Mst)

//PG IT
using {pg.It_Mst_Pur_Group as PurGroupMst} from '../../../../db/cds/pg/it/PG_IT_MST_PUR_GROUP-model';              // PRUCHASING GROUP Mst(구매그룹)
using {pg.It_Mst_Profit_Center as PctrMst} from '../../../../db/cds/pg/it/PG_IT_MST_PROFIT_CENTER-model';          // PROFIT CENTER Mst(손익센터)
using {pg.It_Mst_Payment_Terms as PayTermMst} from '../../../../db/cds/pg/it/PG_IT_MST_PAYMENT_TERMS-model';       // PAYMENT TERMS Mst(지급조건)
using {pg.It_Mst_Wbs as WbsMst} from '../../../../db/cds/pg/it/PG_IT_MST_WBS-model';                               // WBS Mst(프로젝트)
using {pg.It_Mst_Cost_Center as CctrMst} from '../../../../db/cds/pg/it/PG_IT_MST_COST_CENTER-model';              // COST CENTER Mst(코스트센터)
using {pg.It_Mst_Item_Category as ItemCategoryMst} from '../../../../db/cds/pg/it/PG_IT_MST_ITEM_CATEGORY-model';  // ITEM CATEGORY Mst(품목범주)
using {pg.It_Mst_Aa_Category as AaCategoryMst} from '../../../../db/cds/pg/it/PG_IT_MST_AA_CATEGORY-model';        // AA CATEGORY Mst(계정범주)

namespace pg;

@path : '/pg.individualSpendSacDService'
service individualSpendSacDService {

    // Entity List
    // View List

    // Tenant View: 회사
    view OrgTenantView @(title : '회사 마스터 View') as
        select
            key tenant_id       as  ID
               ,tenant_name     as  Description
               ,use_flag        as  USE_FLAG
        from OrgTenant;

    // Company View: 법인
    view OrgCompanyView @(title : '법인 마스터 View') as
        select
            key tenant_id       as  TENANT_ID
           ,key company_code    as  ID : String
               ,company_name    as  Description
               ,use_flag        as  USE_FLAG
               ,erp_type_code   as  ERP_TYPE_CODE
               ,currency_code   as  CURRENCY_CODE
               ,country_code    as  COUNTRY_CODE
               ,language_code   as  LANGUAGE_CODE
               ,affiliate_code  as  AFFILIATE_CODE
        from OrgCompany;

    // Unit View: 사업본부
    view OrgUnitView @(title : '사업본부 마스터 View') as
        select
            key tenant_id       as  TENANT_ID
           ,key bizunit_code    as  ID : String
               ,bizunit_name    as  Description
               ,use_flag        as  USE_FLAG
        from OrgUnit;

    // Plant View: 플랜트
    view OrgPlantView @(title : '플랜트 마스터 View') as
        select
            key tenant_id                       as  TENANT_ID
           ,key company_code||'_'||plant_code   as  ID : String
               ,plant_name                      as  Description
               ,plant_code                      as  PLANT_CODE
               ,company_code                    as  COMPANY_CODE
               ,use_flag                        as  USE_FLAG
               ,purchase_org_code               as  PURCHASING_ORG_CODE
               ,bizdivision_code                as  BIZDIVISION_CODE
               ,au_code                         as  AU_CODE
               ,hq_au_code                      as  HQ_AU_CODE
               ,master_org_flag                 as  MASTER_ORG_FLAG
               ,validation_org_flag             as  VALIDATION_ORG_FLAG
        from OrgPlant;

    // Supply Plant View: 공급플랜트
    view SupplyPlantView @(title : '공급플랜트 마스터 View') as
        select
            key tenant_id                       as  TENANT_ID
           ,key company_code||'_'||plant_code   as  ID : String
               ,plant_name                      as  Description
               ,plant_code                      as  SUPPLY_PLANT_CODE
               ,company_code                    as  COMPANY_CODE
               ,use_flag                        as  USE_FLAG
               ,purchase_org_code               as  PURCHASING_ORG_CODE
               ,bizdivision_code                as  BIZDIVISION_CODE
               ,au_code                         as  AU_CODE
               ,hq_au_code                      as  HQ_AU_CODE
               ,master_org_flag                 as  MASTER_ORG_FLAG
               ,validation_org_flag             as  VALIDATION_ORG_FLAG
        from OrgPlant;

    // Purchasing View: 구매조직
    view OrgPurchasingView @(title : '구매조직 View') as
        select
            key tenant_id           as  TENANT_ID
           ,key purchase_org_code   as  ID : String
               ,purchase_org_name   as  Description
               ,use_flag            as  USE_FLAG
        from OrgPurchasing;

    // Division View: 사업부
    view OrgDivisionView @(title : '사업부 View') as
        select
            key tenant_id           as  TENANT_ID
           ,key bizdivision_code    as  ID : String
               ,bizdivision_name    as  Description
               ,hq_au_flag          as  HQ_AU_FLAG
               ,bizunit_code        as  BIZUNIT_CODE
               ,use_flag            as  USE_FLAG
        from OrgDivision;

    // CodeMst View: 공통마스터코드
    view CmCodeMstView @(title : '공통마스터코드 View') as
        select
            key tenant_id
           ,key group_code
           ,    chain_code
           ,    group_name
           ,    group_description
           ,    maximum_column_size
           ,    use_flag
        from  CodeMst
        ;

    // CodeDtl View: 공통코드
    view CmCodeDtlView @(title : '공통코드 View') as
        select
            key cd.tenant_id
           ,key cd.group_code
           ,key cd.code
           ,    cl.code_name
           ,    cl.language_cd
           ,    cd.code_description
        from  CodeDtl  cd
              inner join CodeLng  cl
                  on  cd.tenant_id    =  cl.tenant_id
                  and cd.group_code   =  cl.group_code
                  and cd.code         =  cl.code
                  and cl.language_cd  =  'KO';

    // Material Mst View: 자재
    view DpMaterialMstView @(title : '자재 View') as
        select
            key tenant_id                       as  TENANT_ID
           ,key material_code                   as  ID : String
               ,material_desc                   as  Description
               ,material_type_code              as  MATERIAL_TYPE_CODE
               ,material_spec                   as  MATERIAL_SPEC
               ,base_uom_code                   as  BASE_UOM_CODE
               ,material_group_code             as  MATERIAL_GROUP_CODE
               ,purchasing_uom_code             as  PURCHASING_UOM_CODE
               ,variable_po_unit_indicator      as  VARIABLE_ORDER_UNIT_INDICATOR
               ,material_class_code             as  MATERIAL_CLASS_CODE
               ,commodity_code                  as  COMMODITY_CODE
               ,maker_part_number               as  MAKER_PART_NUMBER
               ,maker_code                      as  MAKER_CODE
               ,maker_part_profile_code         as  MAKER_PART_PROFILE_CODE
               ,maker_material_code             as  MAKER_MATERIAL_CODE
        from  MaterialMst;

    // Vendor Pool Mst View: Vendor Pool Mst
    view VpVendorPoolMstView @(title : 'Vendor Pool Mst View') as
        select
            key tenant_id                         as  TENANT_ID
           ,key company_code||'_'||org_type_code||'_'||org_code||'_'||vendor_pool_code  as  ID : String
               ,vendor_pool_desc                  as  Description
               ,vendor_pool_code                  as  VENDOR_POOL_CODE
               ,company_code                      as  COMPANY_CODE
               ,org_type_code                     as  ORG_TYPE_CODE
               ,org_code                          as  ORG_CODE
               ,vendor_pool_local_name            as  VENDOR_POOL_LOCAL_NAME
               ,vendor_pool_english_name          as  VENDOR_POOL_ENGLISH_NAME
               ,repr_department_code              as  REPR_DEPARTMENT_CODE
               ,operation_unit_code               as  OPERATION_UNIT_CODE
               ,inp_type_code                     as  INP_TYPE_CODE
               ,mtlmob_base_code                  as  MTLMOB_BASE_CODE
               ,regular_evaluation_flag           as  REGULAR_EVALUATION_FLAG
               ,industry_class_code               as  INDUSTRY_CLASS_CODE
               ,sd_exception_flag                 as  SD_EXCEPTION_FLAG
               ,vendor_pool_apply_exception_flag  as  VENDOR_POOL_APPLY_EXCEPTI_FLAG
               ,maker_material_code_mngt_flag     as  MAKER_MATERIAL_CODE_MNGT_FLAG
               ,domestic_net_price_diff_rate      as  DOMESTIC_NET_PRICE_DIFF_RATE
               ,dom_oversea_netprice_diff_rate    as  DOM_OVERSEA_NETPRICE_DIFF_RATE
               ,equipment_grade_code              as  EQUIPMENT_GRADE_CODE
               ,equipment_type_code               as  EQUIPMENT_TYPE_CODE
               ,vendor_pool_use_flag              as  VENDOR_POOL_USE_FLAG
               ,vendor_pool_history_desc          as  VENDOR_POOL_HISTORY_DESC
               ,parent_vendor_pool_code           as  PARENT_VENDOR_POOL_CODE
               ,leaf_flag                         as  LEAF_FLAG
               ,level_number                      as  LEVEL_NUMBER
               ,display_sequence                  as  DISPLAY_SEQUENCE
               ,register_reason                   as  REGISTER_REASON
               ,approval_number                   as  APPROVAL_NUMBER
        from  VendorPoolMst;

    // Vendor Pool Item Dtl View: Vendor Pool Item Dtl
    view VpVendorPoolItemDtlView @(title : 'Vendor Pool 품목상세연결 View') as
        select
            key vp.tenant_id                         as  TENANT_ID
           ,key vp.company_code||'_'||vp.org_type_code||'_'||vp.org_code||'_'||vp.vendor_pool_code||'_'||vp.material_code  as  ID : String
               ,mm.material_desc                     as  Description
               ,vp.material_code                     as  MATERIAL_CODE
               ,vp.company_code                      as  COMPANY_CODE
               ,vp.org_type_code                     as  ORG_TYPE_CODE
               ,vp.org_code                          as  ORG_CODE
               ,vp.vendor_pool_code                  as  VENDOR_POOL_CODE
               ,vp.vendor_pool_mapping_use_flag      as  VENDOR_POOL_MAPPING_USE_FLAG
               ,vp.register_reason                   as  REGISTER_REASON
               ,vp.approval_number                   as  APPROVAL_NUMBER
        from  VendorPoolItemDtl  vp
              inner join  MaterialMst mm
                  on  vp.tenant_id      =  mm.tenant_id
                  and vp.material_code  =  mm.material_code
        ;

    // Supplier Mst View: Supplier Mst
    view SpSupplierMstView @(title : 'Supplier Mst View') as
        select  
            key tenant_id                                       as  TENANT_ID
           ,key supplier_code                                   as  ID : String
               ,replace(supplier_local_name, char(10), '')      as  Description : String
               ,replace(supplier_local_name, char(10), '')      as  SUPPLIER_LOCAL_NAME : String
               ,replace(supplier_english_name, char(10), '')    as  SUPPLIER_ENGLISH_NAME : String
               ,tax_id                                          as  TAX_ID : String
               ,vat_number                                      as  VAT_NUMBER
               ,tax_id_except_flag                              as  TAX_ID_EXCEPTION_FLAG
               ,replace(tax_id_except_nm, char(10), '')         as  TAX_ID_EXCEPTION_NAME : String
               ,replace(tax_id_except_rsn, char(10), '')        as  TAX_ID_EXCEPTION_REASON : String
               ,duns_number                                     as  DUNS_NUMBER : String
               ,duns_number_4                                   as  DUNS_NUMBER_4 : String
               ,country_code                                    as  COUNTRY_CODE : String
               ,replace(country_name, char(10), '')             as  COUNTRY_NAME : String
               ,zip_code                                        as  ZIP_CODE : String
               ,replace(local_address_1, char(10), '')          as  LOCAL_ADDRESS_1 : String
               ,replace(local_address_2, char(10), '')          as  LOCAL_ADDRESS_2 : String
               ,replace(local_address_3, char(10), '')          as  LOCAL_ADDRESS_3 : String
               ,replace(local_address_4, char(10), '')          as  LOCAL_ADDRESS_4 : String
               ,replace(english_address_1, char(10), '')        as  ENGLISH_ADDRESS_1 : String
               ,replace(english_address_2, char(10), '')        as  ENGLISH_ADDRESS_2 : String
               ,replace(english_address_3, char(10), '')        as  ENGLISH_ADDRESS_3 : String
               ,replace(english_address_4, char(10), '')        as  ENGLISH_ADDRESS_4 : String
               ,replace(local_full_address, char(10), '')       as  LOCAL_FULL_ADDRESS : String
               ,replace(english_full_address, char(10), '')     as  ENGLISH_FULL_ADDRESS : String
               ,common_class_code                               as  COMMON_CLASS_CODE : String
               ,replace(common_class_name, char(10), '')        as  COMMON_CLASS_NAME : String
               ,affiliate_code                                  as  AFFILIATE_CODE : String
               ,replace(affiliate_code_name, char(10), '')      as  AFFILIATE_CODE_NAME : String
               ,individual_biz_flag                             as  INDIVIDUAL_BIZ_FLAG
               ,replace(individual_biz_desc, char(10), '')      as  INDIVIDUAL_BIZ_DESC : String
               ,company_register_number                         as  COMPANY_REGISTER_NUMBER : String
               ,company_class_code                              as  COMPANY_CLASS_CODE : String
               ,replace(company_class_name, char(10), '')       as  COMPANY_CLASS_NAME : String
               ,replace(repre_name, char(10), '')               as  REPRE_NAME : String
               ,replace(biz_type, char(10), '')                 as  BIZ_TYPE : String
               ,replace(industry, char(10), '')                 as  INDUSTRY : String
               ,biz_certi_attch_number                          as  BIZ_CERTI_ATTCH_NUMBER : String
               ,attch_number_2                                  as  ATTCH_NUMBER_2 : String
               ,attch_number_3                                  as  ATTCH_NUMBER_3 : String
               ,inactive_status_code                            as  INACTIVE_STATUS_CODE : String
               ,replace(inactive_status_name, char(10), '')     as  INACTIVE_STATUS_NAME : String
               ,inactive_date                                   as  INACTIVE_DATE
               ,replace(inactive_reason, char(10), '')          as  INACTIVE_REASON : String
               ,bp_status_code                                  as  BP_STATUS_CODE : String
               ,replace(bp_status_name, char(10), '')           as  BP_STATUS_NAME : String
               ,tel_number                                      as  TEL_NUMBER : String
               ,extens_number                                   as  EXTENS_NUMBER : String
               ,mobile_phone_number                             as  MOBILE_PHONE_NUMBER : String
               ,fax_number                                      as  FAX_NUMBER : String
               ,replace(url_address, char(10), '')              as  URL_ADDRESS : String
               ,replace(email_address, char(10), '')            as  EMAIL_ADDRESS : String
               ,fmytr_code                                      as  FMYTR_CODE : String
               ,replace(fmytr_name, char(10), '')               as  FMYTR_NAME : String
               ,credit_evaluation_interface_code                as  CREDIT_EVAL_IF_NO : String
        from  SupplierMst
        ;

    // Purchasing Group Mst View: 구매그룹
    view PgPurGroupView @(title : '구매그룹 View') as
        select
            key tenant_id   as  TENANT_ID
           ,key company_code||'_'||org_type_code||'_'||org_code||'_'||purchasing_group_code  as  ID : String
               ,purchasing_group_code_name           as  Description
               ,purchasing_group_code                as  PURCHASING_GROUP_CODE
        from  PurGroupMst
        ;

    // Profit Center Mst View: 손익센터
    view PgPctrMstView @(title : '손익센터 View') as
        select
            key tenant_id           as  TENANT_ID
           ,key company_code||'_'||org_type_code||'_'||org_code||'_'||prctr_code  as  ID : String
               ,prctr_name          as  Description
               ,prctr_code          as  PRCTR_CODE
        from  PctrMst
        ;

    // Payment Terms Mst View: 지불조건
    view PgPayTermsMstView @(title : '지불조건 View') as
        select
            key tenant_id   as  TENANT_ID
           ,key company_code||'_'||org_type_code||'_'||org_code||'_'||payterms_code  as  ID : String
               ,payterms_name           as  Description
               ,payterms_code           as  PAYMENT_TERMS_CODE
        from  PayTermMst
        ;

    // WBS Mst View: 프로젝트
    view PgWbsMstView @(title : '프로젝트 View') as
        select
            key tenant_id       as  TENANT_ID
           ,key company_code||'_'||org_type_code||'_'||org_code||'_'||project_code  as  ID : String
               ,project_name    as  Description
               ,project_code    as  PROJECT_CODE
        from  WbsMst
        ;

    // Cost Center Mst View: 코스트센터
    view PgCctrMstView @(title : '코스트센터 View') as
        select
            key tenant_id           as  TENANT_ID
           ,key company_code||'_'||org_type_code||'_'||org_code||'_'||cctr_code  as  ID : String
               ,cctr_code_name      as  Description
               ,cctr_code           as  CCTR_CODE
        from  CctrMst
        ;

    // IS Origin Code View: 원산지코드
    view IsOriginvCodeView @(title : '원산지코드 View') as
        select
            key tenant_id       as  TENANT_ID
           ,key country_code    as  ID : String
               ,country_name    as  Description
        from  CountryView
        ;

    // ITEM CATEGORY Mst View: 품목범주
    view PgItemCategoryMstView @(title : '품목범주 View') as
        select
            key tenant_id               as  TENANT_ID
           ,key company_code||'_'||org_type_code||'_'||org_code||'_'||po_item_category_code  as  ID : String
               ,po_item_category_name  as  Description
               ,po_item_category_code  as  PO_ITEM_CATEGORY_CODE
        from  ItemCategoryMst
        ;

    // AA CATEGORY Mst View: 계정범주
    view PgAaCategoryMstView @(title : '계정범주 View') as
        select
            key tenant_id                       as  TENANT_ID
           ,key company_code||'_'||org_type_code||'_'||org_code||'_'||account_assign_category_code  as  ID : String
               ,account_assign_category_name    as  Description
               ,account_assign_category_code    as  ACCOUNT_ASSIGN_CATEGORY_CODE
        from  AaCategoryMst
        ;

    // OpErpAcctAssignCategory View: ERP계정지정범주(계정범주코드)
    view OpErpAcctAssignCategoryView @(title : 'ERP계정지정범주(계정범주코드) View') as
        select
            key tenant_id       as  TENANT_ID
           ,key code            as  ID : String
               ,code_name       as  Description
               ,language_cd     as  LANGUAGE_CODE
        from  CmCodeDtlView
        where group_code  =  'OP_ERP_ACCT_ASSIGN_CATEGORY';

    // OpErpPoTypeCode View: ERP구매오더유형(PO유형)
    view OpErpPoTypeCodeView @(title : 'ERP구매오더유형(PO유형) View') as
        select
            key tenant_id       as  TENANT_ID
           ,key code            as  ID : String
               ,code_name       as  Description
               ,language_cd     as  LANGUAGE_CODE
        from  CmCodeDtlView
        where group_code  =  'OP_ERP_PO_TYPE_CODE';

    // OpErpItemCategoryCode View: ERP품목범주(품목범주코드)
    view OpErpItemCategoryCodeView @(title : 'ERP품목범주(품목범주코드) View') as
        select
            key tenant_id       as  TENANT_ID
           ,key code            as  ID : String
               ,code_name       as  Description
               ,language_cd     as  LANGUAGE_CODE
        from  CmCodeDtlView
        where group_code  =  'OP_ERP_ITEM_CATEGORY_CODE';

    // OpIncoterms View: 인코텀즈(인도조건)
    view OpIncotermsView @(title : '인코텀즈(인도조건) View') as
        select
            key tenant_id       as  TENANT_ID
           ,key code            as  ID : String
               ,code_name       as  Description
               ,language_cd     as  LANGUAGE_CODE
        from  CmCodeDtlView
        where group_code  =  'OP_INCOTERMS';

}