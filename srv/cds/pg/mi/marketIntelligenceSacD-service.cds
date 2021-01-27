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
using {cm.Currency as Currency} from '../../../../db/cds/cm/CM_CURRENCY-model';             // Currency(통화)
using {cm.Currency_Lng as CurrencyLng} from '../../../../db/cds/cm/CM_CURRENCY_LNG-model';  // Currency Lng(통화언어)

//DP MM
using {dp.Mm_Material_Mst as MaterialMst} from '../../../../db/cds/dp/mm/DP_MM_MATERIAL_MST-model';          // Material Mst(자재일반)
// using {dp.Mm_Unit_Of_Measure as UnitOfMeasure} from '../../../../db/cds/dp/mm/DP_MM_UNIT_OF_MEASURE-model';  // Unit Of Measure(측정단위)

//PG VP
using {pg.Vp_Vendor_Pool_Mst as VendorPoolMst} from '../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_MST-model';                // Vendor Pool Mst(Vendor Pool Mst)
using {pg.Vp_Vendor_Pool_Item_Dtl as VendorPoolItemDtl} from '../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_ITEM_DTL-model';  // Vendor Pool Item Dtl(Vendor Pool 품목연결상세)

//PG MI
using {pg.MI_Material_Code as MaterialCode} from '../../../../db/cds/pg/mi/PG_MI_MATERIAL_CODE-model';  // Material Code(시황자재)
using {pg.MI_Material_Code_Lng as MaterialCodeLng} from '../../../../db/cds/pg/mi/PG_MI_MATERIAL_CODE_LNG-model';  // Material Code Lng(시황자재언어코드)

// SP SM
using {sp.Sm_Supplier_Mst as SupplierMst} from '../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model';     // Supplier Mst(공급업체 Mst)

namespace pg;

@path : '/pg.marketIntelligenceSacDService'
service marketIntelligenceSacDService {

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

    // Currency View: 통화
    view CmCurrencyView @(title : '통화 View') as
        select
            key cc.tenant_id                as  TENANT_ID
           ,key cc.currency_code            as  ID : String
               ,cl.currency_code_desc       as  Description
               ,cc.effective_start_date     as  EFFECTIVE_START_DATE
               ,cc.effective_end_date       as  EFFECTIVE_END_DATE
               ,cc.use_flag                 as  USE_FLAG
               ,cc.scale                    as  SCALE
               ,cc.extension_scale          as  EXTENSION_SCALE
        from  Currency  cc
              inner join CurrencyLng  cl
                  on  cc.tenant_id      =  cl.tenant_id
                  and cc.currency_code  =  cl.currency_code
                  and cl.language_code  =  'KO';

    // 시황자재코드 View: 시황자재코드
    view PgMaterialCodeView @(title : '시황자재코드 View') as
        select
            key mc.tenant_id            as  TENANT_ID
           ,key mc.category_code||'_'||mc.mi_material_code  as  ID : String 
        //    ,key mc.company_code||'_'||mc.org_type_code_code||'_'||mc.org_code||'_'||mc.category_code||'_'||mc.mi_material_code  as  ID : String
               ,mc.mi_material_code     as  MI_MATERIAL_CODE
               ,ml.mi_material_name     as  Description
               ,mc.category_code        as  CATEGORY_CODE
               ,mc.use_flag             as  USE_FLAG
        from  MaterialCode  mc
              inner join MaterialCodeLng  ml
                  on  mc.tenant_id         =  ml.tenant_id
                  and mc.mi_material_code  =  ml.mi_material_code
                  and ml.language_code  =  'KO';

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

    // MiExchangeCode View: 거래소코드
    view MiExchangeCodeView @(title : '거래소코드 View') as
        select
            key tenant_id       as  TENANT_ID 
           ,key code            as  ID : String
               ,code_name       as  Description
               ,language_cd     as  LANGUAGE_CODE
        from  CmCodeDtlView
        where group_code  =  'PG_MI_EXCHANGE_CODE';

    // MiTermsdelvCode View: 인도조건코드
    view MiTermsdelvCodeView @(title : '인도조건코드 View') as
        select
            key tenant_id       as  TENANT_ID
           ,key code            as  ID : String
               ,code_name       as  Description
               ,language_cd     as  LANGUAGE_CODE
        from  CmCodeDtlView
        where group_code  =  'PG_MI_TERMSDELV_CODE';

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

    // Unit Of Measure View: 측정단위
    // view DpUOMView @(title : 'UOM View') as
    //     select
    //         key tenant_id                       as  TENANT_ID
    //        ,key uom_code                        as  ID : String
    //            ,technical_uom_name              as  Description
    //            ,commercial_uom_code             as  COMMERCIAL_UOM_CODE
    //            ,technical_uom_code              as  TECHNICAL_UOM_CODE
    //            ,commercial_uom_name             as  COMMERCIAL_UOM_NAME
    //            ,technical_uom_name              as  TECHNICAL_UOM_NAME
    //            ,base_unit_flag                  as  BASE_UNIT_FLAG
    //            ,uom_class_code                  as  UOM_CLASS_CODE
    //            ,uom_desc                        as  UOM_DESCRIPTION
    //            ,decimal_places                  as  DECIMAL_PLACES
    //            ,floating_decpoint_index         as  FLOATING_DECPOINT_INDEX
    //            ,conversion_numerator            as  CONVERSION_NUMERATOR
    //            ,conversion_denominator          as  CONVERSION_DENOMINATOR
    //            ,conversion_index                as  CONVERSION_INDEX
    //            ,conversion_rate                 as  CONVERSION_RATE
    //            ,conversion_addition_constant    as  CONVERSION_ADDITION_CONSTANT
    //            ,decplaces_rounding              as  DECPLACES_ROUNDING
    //            ,family_unit_flag                as  FAMILY_UNIT_FLAG
    //            ,uom_iso_code                    as  UOM_ISO_CODE
    //            ,uom_iso_primary_code_flag       as  UOM_ISO_PRIMARY_CODE_FLAG
    //            ,commercial_unit_flag            as  COMMERCIAL_UNIT_FLAG
    //            ,value_base_commitment_flag      as  VALUE_BASE_COMMITMENT_FLAG
    //            ,disable_date                    as  DISABLE_DATE
    //     from  UnitOfMeasure;

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

}