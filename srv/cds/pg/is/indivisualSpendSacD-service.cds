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
using {pg.It_Mst_Gl_Account as GlAccountMst} from '../../../../db/cds/pg/it/PG_IT_MST_GL_ACCOUNT-model';           // GL ACCOUNT Mst(GL계정)

//PG MD
using {pg.Md_Material_Item_Value as MaterialItemValue} from '../../../../db/cds/pg/md/PG_MD_MATERIAL_ITEM_VALUE-model';        // Material Item Value(자재특성값)

namespace pg;

@path : '/pg.individualSpendSacDService'
service individualSpendSacDService {

    // Entity List
    // entity MdMaterialItemValue @(title : '자재별 특성 정보') as projection on MaterialItemValue;
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
           ,key case when ascii(code) = 0 then '_B' else code end  as  ID : String
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

    // GL ACCOUNT Mst View: GL계정
    view PgGlAccountMstView @(title : 'GL계정 View') as
        select
            key tenant_id           as  TENANT_ID
           ,key company_code||'_'||org_type_code||'_'||org_code||'_'||coa_code||'_'||gl_account_code  as  ID : String
               ,gl_account_desc     as  Description
               ,coa_code            as  COA_CODE
               ,gl_account_code     as  GL_ACCOUNT_CODE
               ,company_code        as  COMPANY_CODE
               ,org_type_code       as  ORG_TYPE_CODE
               ,org_code            as  ORG_CODE
        from  GlAccountMst
        ;

    // MdMaterialItemValue View @(title : '자재별 특성 정보')
    view MdMaterialItemValueView @(title : '자재별 특성 정보 View') as
        select
            key a.tenant_id         as  TENANT_ID
           ,key a.company_code||'_'||a.org_type_code||'_'||a.org_code||'_'||a.material_code||'_'||a.supplier_code  as  ID : String
               ,b.material_desc     as  Description
               ,a.vendor_pool_code  as vendor_pool_code
               ,a.material_code     as material_code
               ,a.supplier_code     as supplier_code
               ,a.use_flag          as use_flag
               ,a.mapping_flag      as mapping_flag
               ,a.spmd_attr_001     as spmd_attr_001
               ,a.spmd_attr_002     as spmd_attr_002
               ,a.spmd_attr_003     as spmd_attr_003
               ,a.spmd_attr_004     as spmd_attr_004
               ,a.spmd_attr_005     as spmd_attr_005
               ,a.spmd_attr_006     as spmd_attr_006
               ,a.spmd_attr_007     as spmd_attr_007
               ,a.spmd_attr_008     as spmd_attr_008
               ,a.spmd_attr_009     as spmd_attr_009
               ,a.spmd_attr_010     as spmd_attr_010
               ,a.spmd_attr_011     as spmd_attr_011
               ,a.spmd_attr_012     as spmd_attr_012
               ,a.spmd_attr_013     as spmd_attr_013
               ,a.spmd_attr_014     as spmd_attr_014
               ,a.spmd_attr_015     as spmd_attr_015
               ,a.spmd_attr_016     as spmd_attr_016
               ,a.spmd_attr_017     as spmd_attr_017
               ,a.spmd_attr_018     as spmd_attr_018
               ,a.spmd_attr_019     as spmd_attr_019
               ,a.spmd_attr_020     as spmd_attr_020
               ,a.spmd_attr_021     as spmd_attr_021
               ,a.spmd_attr_022     as spmd_attr_022
               ,a.spmd_attr_023     as spmd_attr_023
               ,a.spmd_attr_024     as spmd_attr_024
               ,a.spmd_attr_025     as spmd_attr_025
               ,a.spmd_attr_026     as spmd_attr_026
               ,a.spmd_attr_027     as spmd_attr_027
               ,a.spmd_attr_028     as spmd_attr_028
               ,a.spmd_attr_029     as spmd_attr_029
               ,a.spmd_attr_030     as spmd_attr_030
               ,a.spmd_attr_031     as spmd_attr_031
               ,a.spmd_attr_032     as spmd_attr_032
               ,a.spmd_attr_033     as spmd_attr_033
               ,a.spmd_attr_034     as spmd_attr_034
               ,a.spmd_attr_035     as spmd_attr_035
               ,a.spmd_attr_036     as spmd_attr_036
               ,a.spmd_attr_037     as spmd_attr_037
               ,a.spmd_attr_038     as spmd_attr_038
               ,a.spmd_attr_039     as spmd_attr_039
               ,a.spmd_attr_040     as spmd_attr_040
               ,a.spmd_attr_041     as spmd_attr_041
               ,a.spmd_attr_042     as spmd_attr_042
               ,a.spmd_attr_043     as spmd_attr_043
               ,a.spmd_attr_044     as spmd_attr_044
               ,a.spmd_attr_045     as spmd_attr_045
               ,a.spmd_attr_046     as spmd_attr_046
               ,a.spmd_attr_047     as spmd_attr_047
               ,a.spmd_attr_048     as spmd_attr_048
               ,a.spmd_attr_049     as spmd_attr_049
               ,a.spmd_attr_050     as spmd_attr_050
               ,a.spmd_attr_051     as spmd_attr_051
               ,a.spmd_attr_052     as spmd_attr_052
               ,a.spmd_attr_053     as spmd_attr_053
               ,a.spmd_attr_054     as spmd_attr_054
               ,a.spmd_attr_055     as spmd_attr_055
               ,a.spmd_attr_056     as spmd_attr_056
               ,a.spmd_attr_057     as spmd_attr_057
               ,a.spmd_attr_058     as spmd_attr_058
               ,a.spmd_attr_059     as spmd_attr_059
               ,a.spmd_attr_060     as spmd_attr_060
               ,a.spmd_attr_061     as spmd_attr_061
               ,a.spmd_attr_062     as spmd_attr_062
               ,a.spmd_attr_063     as spmd_attr_063
               ,a.spmd_attr_064     as spmd_attr_064
               ,a.spmd_attr_065     as spmd_attr_065
               ,a.spmd_attr_066     as spmd_attr_066
               ,a.spmd_attr_067     as spmd_attr_067
               ,a.spmd_attr_068     as spmd_attr_068
               ,a.spmd_attr_069     as spmd_attr_069
               ,a.spmd_attr_070     as spmd_attr_070
               ,a.spmd_attr_071     as spmd_attr_071
               ,a.spmd_attr_072     as spmd_attr_072
               ,a.spmd_attr_073     as spmd_attr_073
               ,a.spmd_attr_074     as spmd_attr_074
               ,a.spmd_attr_075     as spmd_attr_075
               ,a.spmd_attr_076     as spmd_attr_076
               ,a.spmd_attr_077     as spmd_attr_077
               ,a.spmd_attr_078     as spmd_attr_078
               ,a.spmd_attr_079     as spmd_attr_079
               ,a.spmd_attr_080     as spmd_attr_080
               ,a.spmd_attr_081     as spmd_attr_081
               ,a.spmd_attr_082     as spmd_attr_082
               ,a.spmd_attr_083     as spmd_attr_083
               ,a.spmd_attr_084     as spmd_attr_084
               ,a.spmd_attr_085     as spmd_attr_085
               ,a.spmd_attr_086     as spmd_attr_086
               ,a.spmd_attr_087     as spmd_attr_087
               ,a.spmd_attr_088     as spmd_attr_088
               ,a.spmd_attr_089     as spmd_attr_089
               ,a.spmd_attr_090     as spmd_attr_090
               ,a.spmd_attr_091     as spmd_attr_091
               ,a.spmd_attr_092     as spmd_attr_092
               ,a.spmd_attr_093     as spmd_attr_093
               ,a.spmd_attr_094     as spmd_attr_094
               ,a.spmd_attr_095     as spmd_attr_095
               ,a.spmd_attr_096     as spmd_attr_096
               ,a.spmd_attr_097     as spmd_attr_097
               ,a.spmd_attr_098     as spmd_attr_098
               ,a.spmd_attr_099     as spmd_attr_099
               ,a.spmd_attr_100     as spmd_attr_100
               ,a.spmd_attr_101     as spmd_attr_101
               ,a.spmd_attr_102     as spmd_attr_102
               ,a.spmd_attr_103     as spmd_attr_103
               ,a.spmd_attr_104     as spmd_attr_104
               ,a.spmd_attr_105     as spmd_attr_105
               ,a.spmd_attr_106     as spmd_attr_106
               ,a.spmd_attr_107     as spmd_attr_107
               ,a.spmd_attr_108     as spmd_attr_108
               ,a.spmd_attr_109     as spmd_attr_109
               ,a.spmd_attr_110     as spmd_attr_110
               ,a.spmd_attr_111     as spmd_attr_111
               ,a.spmd_attr_112     as spmd_attr_112
               ,a.spmd_attr_113     as spmd_attr_113
               ,a.spmd_attr_114     as spmd_attr_114
               ,a.spmd_attr_115     as spmd_attr_115
               ,a.spmd_attr_116     as spmd_attr_116
               ,a.spmd_attr_117     as spmd_attr_117
               ,a.spmd_attr_118     as spmd_attr_118
               ,a.spmd_attr_119     as spmd_attr_119
               ,a.spmd_attr_120     as spmd_attr_120
               ,a.spmd_attr_121     as spmd_attr_121
               ,a.spmd_attr_122     as spmd_attr_122
               ,a.spmd_attr_123     as spmd_attr_123
               ,a.spmd_attr_124     as spmd_attr_124
               ,a.spmd_attr_125     as spmd_attr_125
               ,a.spmd_attr_126     as spmd_attr_126
               ,a.spmd_attr_127     as spmd_attr_127
               ,a.spmd_attr_128     as spmd_attr_128
               ,a.spmd_attr_129     as spmd_attr_129
               ,a.spmd_attr_130     as spmd_attr_130
               ,a.spmd_attr_131     as spmd_attr_131
               ,a.spmd_attr_132     as spmd_attr_132
               ,a.spmd_attr_133     as spmd_attr_133
               ,a.spmd_attr_134     as spmd_attr_134
               ,a.spmd_attr_135     as spmd_attr_135
               ,a.spmd_attr_136     as spmd_attr_136
               ,a.spmd_attr_137     as spmd_attr_137
               ,a.spmd_attr_138     as spmd_attr_138
               ,a.spmd_attr_139     as spmd_attr_139
               ,a.spmd_attr_140     as spmd_attr_140
               ,a.spmd_attr_141     as spmd_attr_141
               ,a.spmd_attr_142     as spmd_attr_142
               ,a.spmd_attr_143     as spmd_attr_143
               ,a.spmd_attr_144     as spmd_attr_144
               ,a.spmd_attr_145     as spmd_attr_145
               ,a.spmd_attr_146     as spmd_attr_146
               ,a.spmd_attr_147     as spmd_attr_147
               ,a.spmd_attr_148     as spmd_attr_148
               ,a.spmd_attr_149     as spmd_attr_149
               ,a.spmd_attr_150     as spmd_attr_150
               ,a.spmd_attr_151     as spmd_attr_151
               ,a.spmd_attr_152     as spmd_attr_152
               ,a.spmd_attr_153     as spmd_attr_153
               ,a.spmd_attr_154     as spmd_attr_154
               ,a.spmd_attr_155     as spmd_attr_155
               ,a.spmd_attr_156     as spmd_attr_156
               ,a.spmd_attr_157     as spmd_attr_157
               ,a.spmd_attr_158     as spmd_attr_158
               ,a.spmd_attr_159     as spmd_attr_159
               ,a.spmd_attr_160     as spmd_attr_160
               ,a.spmd_attr_161     as spmd_attr_161
               ,a.spmd_attr_162     as spmd_attr_162
               ,a.spmd_attr_163     as spmd_attr_163
               ,a.spmd_attr_164     as spmd_attr_164
               ,a.spmd_attr_165     as spmd_attr_165
               ,a.spmd_attr_166     as spmd_attr_166
               ,a.spmd_attr_167     as spmd_attr_167
               ,a.spmd_attr_168     as spmd_attr_168
               ,a.spmd_attr_169     as spmd_attr_169
               ,a.spmd_attr_170     as spmd_attr_170
               ,a.spmd_attr_171     as spmd_attr_171
               ,a.spmd_attr_172     as spmd_attr_172
               ,a.spmd_attr_173     as spmd_attr_173
               ,a.spmd_attr_174     as spmd_attr_174
               ,a.spmd_attr_175     as spmd_attr_175
               ,a.spmd_attr_176     as spmd_attr_176
               ,a.spmd_attr_177     as spmd_attr_177
               ,a.spmd_attr_178     as spmd_attr_178
               ,a.spmd_attr_179     as spmd_attr_179
               ,a.spmd_attr_180     as spmd_attr_180
               ,a.spmd_attr_181     as spmd_attr_181
               ,a.spmd_attr_182     as spmd_attr_182
               ,a.spmd_attr_183     as spmd_attr_183
               ,a.spmd_attr_184     as spmd_attr_184
               ,a.spmd_attr_185     as spmd_attr_185
               ,a.spmd_attr_186     as spmd_attr_186
               ,a.spmd_attr_187     as spmd_attr_187
               ,a.spmd_attr_188     as spmd_attr_188
               ,a.spmd_attr_189     as spmd_attr_189
               ,a.spmd_attr_190     as spmd_attr_190
               ,a.spmd_attr_191     as spmd_attr_191
               ,a.spmd_attr_192     as spmd_attr_192
               ,a.spmd_attr_193     as spmd_attr_193
               ,a.spmd_attr_194     as spmd_attr_194
               ,a.spmd_attr_195     as spmd_attr_195
               ,a.spmd_attr_196     as spmd_attr_196
               ,a.spmd_attr_197     as spmd_attr_197
               ,a.spmd_attr_198     as spmd_attr_198
               ,a.spmd_attr_199     as spmd_attr_199
               ,a.spmd_attr_200     as spmd_attr_200
               ,a.spmd_attr_201     as spmd_attr_201
               ,a.spmd_attr_202     as spmd_attr_202
               ,a.spmd_attr_203     as spmd_attr_203
               ,a.spmd_attr_204     as spmd_attr_204
               ,a.spmd_attr_205     as spmd_attr_205
               ,a.spmd_attr_206     as spmd_attr_206
               ,a.spmd_attr_207     as spmd_attr_207
               ,a.spmd_attr_208     as spmd_attr_208
               ,a.spmd_attr_209     as spmd_attr_209
               ,a.spmd_attr_210     as spmd_attr_210
               ,a.spmd_attr_211     as spmd_attr_211
               ,a.spmd_attr_212     as spmd_attr_212
               ,a.spmd_attr_213     as spmd_attr_213
               ,a.spmd_attr_214     as spmd_attr_214
               ,a.spmd_attr_215     as spmd_attr_215
               ,a.spmd_attr_216     as spmd_attr_216
               ,a.spmd_attr_217     as spmd_attr_217
               ,a.spmd_attr_218     as spmd_attr_218
               ,a.spmd_attr_219     as spmd_attr_219
               ,a.spmd_attr_220     as spmd_attr_220
               ,a.spmd_attr_221     as spmd_attr_221
               ,a.spmd_attr_222     as spmd_attr_222
               ,a.spmd_attr_223     as spmd_attr_223
               ,a.spmd_attr_224     as spmd_attr_224
               ,a.spmd_attr_225     as spmd_attr_225
               ,a.spmd_attr_226     as spmd_attr_226
               ,a.spmd_attr_227     as spmd_attr_227
               ,a.spmd_attr_228     as spmd_attr_228
               ,a.spmd_attr_229     as spmd_attr_229
               ,a.spmd_attr_230     as spmd_attr_230
               ,a.spmd_attr_231     as spmd_attr_231
               ,a.spmd_attr_232     as spmd_attr_232
               ,a.spmd_attr_233     as spmd_attr_233
               ,a.spmd_attr_234     as spmd_attr_234
               ,a.spmd_attr_235     as spmd_attr_235
               ,a.spmd_attr_236     as spmd_attr_236
               ,a.spmd_attr_237     as spmd_attr_237
               ,a.spmd_attr_238     as spmd_attr_238
               ,a.spmd_attr_239     as spmd_attr_239
               ,a.spmd_attr_240     as spmd_attr_240
               ,a.spmd_attr_241     as spmd_attr_241
               ,a.spmd_attr_242     as spmd_attr_242
               ,a.spmd_attr_243     as spmd_attr_243
               ,a.spmd_attr_244     as spmd_attr_244
               ,a.spmd_attr_245     as spmd_attr_245
               ,a.spmd_attr_246     as spmd_attr_246
               ,a.spmd_attr_247     as spmd_attr_247
               ,a.spmd_attr_248     as spmd_attr_248
               ,a.spmd_attr_249     as spmd_attr_249
               ,a.spmd_attr_250     as spmd_attr_250
               ,a.spmd_attr_251     as spmd_attr_251
               ,a.spmd_attr_252     as spmd_attr_252
               ,a.spmd_attr_253     as spmd_attr_253
               ,a.spmd_attr_254     as spmd_attr_254
               ,a.spmd_attr_255     as spmd_attr_255
               ,a.spmd_attr_256     as spmd_attr_256
               ,a.spmd_attr_257     as spmd_attr_257
               ,a.spmd_attr_258     as spmd_attr_258
               ,a.spmd_attr_259     as spmd_attr_259
               ,a.spmd_attr_260     as spmd_attr_260
               ,a.spmd_attr_261     as spmd_attr_261
               ,a.spmd_attr_262     as spmd_attr_262
               ,a.spmd_attr_263     as spmd_attr_263
               ,a.spmd_attr_264     as spmd_attr_264
               ,a.spmd_attr_265     as spmd_attr_265
               ,a.spmd_attr_266     as spmd_attr_266
               ,a.spmd_attr_267     as spmd_attr_267
               ,a.spmd_attr_268     as spmd_attr_268
               ,a.spmd_attr_269     as spmd_attr_269
               ,a.spmd_attr_270     as spmd_attr_270
               ,a.spmd_attr_271     as spmd_attr_271
               ,a.spmd_attr_272     as spmd_attr_272
               ,a.spmd_attr_273     as spmd_attr_273
               ,a.spmd_attr_274     as spmd_attr_274
               ,a.spmd_attr_275     as spmd_attr_275
               ,a.spmd_attr_276     as spmd_attr_276
               ,a.spmd_attr_277     as spmd_attr_277
               ,a.spmd_attr_278     as spmd_attr_278
               ,a.spmd_attr_279     as spmd_attr_279
               ,a.spmd_attr_280     as spmd_attr_280
               ,a.spmd_attr_281     as spmd_attr_281
               ,a.spmd_attr_282     as spmd_attr_282
               ,a.spmd_attr_283     as spmd_attr_283
               ,a.spmd_attr_284     as spmd_attr_284
               ,a.spmd_attr_285     as spmd_attr_285
               ,a.spmd_attr_286     as spmd_attr_286
               ,a.spmd_attr_287     as spmd_attr_287
               ,a.spmd_attr_288     as spmd_attr_288
               ,a.spmd_attr_289     as spmd_attr_289
               ,a.spmd_attr_290     as spmd_attr_290
               ,a.spmd_attr_291     as spmd_attr_291
               ,a.spmd_attr_292     as spmd_attr_292
               ,a.spmd_attr_293     as spmd_attr_293
               ,a.spmd_attr_294     as spmd_attr_294
               ,a.spmd_attr_295     as spmd_attr_295
               ,a.spmd_attr_296     as spmd_attr_296
               ,a.spmd_attr_297     as spmd_attr_297
               ,a.spmd_attr_298     as spmd_attr_298
               ,a.spmd_attr_299     as spmd_attr_299
               ,a.spmd_attr_300     as spmd_attr_300
        from  MaterialItemValue  a
              inner join MaterialMst  b
                  on  a.tenant_id      =  b.tenant_id
                  and a.material_code  =  b.material_code
        where  a.supplier_code  <>  '*'
        ;


}