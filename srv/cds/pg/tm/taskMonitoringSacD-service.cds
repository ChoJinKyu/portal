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

//DP MM
using {dp.Mm_Material_Mst as MaterialMst} from '../../../../db/cds/dp/mm/DP_MM_MATERIAL_MST-model';          // Material Mst(자재일반)

//PG VP
using {pg.Vp_Vendor_Pool_Mst as VendorPoolMst} from '../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_MST-model';                // Vendor Pool Mst(Vendor Pool Mst)
using {pg.Vp_Vendor_Pool_Item_Dtl as VendorPoolItemDtl} from '../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_ITEM_DTL-model';  // Vendor Pool Item Dtl(Vendor Pool 품목연결상세)

// SP SM
using {sp.Sm_Supplier_Mst as SupplierMst} from '../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model';     // Supplier Mst(공급업체 Mst)

namespace pg;

@path : '/pg.taskMonitoringSacDService'
service taskMonitoringSacDService {

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
            key tenant_id||'_'||company_code  as  ID : String
               ,company_name                  as  Description
               ,company_code                  as  COMPANY_CODE
               ,tenant_id                     as  TENANT_ID
               ,use_flag                      as  USE_FLAG
               ,erp_type_code                 as  ERP_TYPE_CODE
               ,currency_code                 as  CURRENCY_CODE
               ,country_code                  as  COUNTRY_CODE
               ,language_code                 as  LANGUAGE_CODE
               ,affiliate_code                as  AFFILIATE_CODE
        from OrgCompany;

    // Unit View: 사업본부
    view OrgUnitView @(title : '사업본부 마스터 View') as
        select
            key tenant_id||'_'||bizunit_code  as  ID : String
               ,bizunit_name                  as  Description
               ,bizunit_code                  as  BIZUNIT_CODE
               ,tenant_id                     as  TENANT_ID
               ,use_flag                      as  USE_FLAG
        from OrgUnit;

    // Plant View: 플랜트
    view OrgPlantView @(title : '플랜트 마스터 View') as
        select
            key tenant_id||'_'||plant_code  as  ID : String
               ,plant_name                  as  Description
               ,plant_code                  as  PLANT_CODE
               ,tenant_id                   as  TENANT_ID
               ,use_flag                    as  USE_FLAG
               ,purchase_org_code           as  PURCHASING_ORG_CODE
               ,bizdivision_code            as  BIZDIVISION_CODE
               ,au_code                     as  AU_CODE
               ,hq_au_code                  as  HQ_AU_CODE
               ,master_org_flag             as  MASTER_ORG_FLAG
               ,validation_org_flag         as  VALIDATION_ORG_FLAG
        from OrgPlant;

    // Purchasing View: 구매조직
    view OrgPurchasingView @(title : '구매조직 View') as
        select
            key tenant_id||'_'||purchase_org_code  as  ID : String
               ,purchase_org_name                  as  Description
               ,purchase_org_code                  as  PURCHAING_ORG_CODE
               ,tenant_id                          as  TENANT_ID
               ,use_flag                           as  USE_FLAG
        from OrgPurchasing;

    // Division View: 사업부
    view OrgDivisionView @(title : '사업부 View') as
        select
            key tenant_id||'_'||bizdivision_code  as  ID : String
               ,bizdivision_name                  as  Description
               ,bizdivision_code                  as  BIZDIVISION_CODE
               ,tenant_id                         as  TENANT_ID
               ,hq_au_flag                        as  HQ_AU_FLAG
               ,bizunit_code                      as  BIZUNIT_CODE
               ,use_flag                          as  USE_FLAG
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
            key tenant_id||'_'||material_code  as  ID : String
               ,material_desc                  as  Description
               ,material_code                  as  MATERIAL_CODE
               ,tenant_id                      as  TENANT_ID
               ,material_type_code             as  MATERIAL_TYPE_CODE
               ,material_spec                  as  MATERIAL_SPEC
               ,base_uom_code                  as  BASE_UOM_CODE
               ,material_group_code            as  MATERIAL_GROUP_CODE
               ,purchasing_uom_code            as  PURCHASING_UOM_CODE
               ,variable_po_unit_indicator     as  VARIABLE_ORDER_UNIT_INDICATOR
               ,material_class_code            as  MATERIAL_CLASS_CODE
               ,commodity_code                 as  COMMODITY_CODE
               ,maker_part_number              as  MAKER_PART_NUMBER
               ,maker_code                     as  MAKER_CODE
               ,maker_part_profile_code        as  MAKER_PART_PROFILE_CODE
               ,maker_material_code            as  MAKER_MATERIAL_CODE
        from  MaterialMst;

    // Vendor Pool Mst View: Vendor Pool Mst
    view VpVendorPoolMstView @(title : 'Vendor Pool Mst View') as
        select
            key tenant_id||'_'||vendor_pool_code  as  ID : String
               ,vendor_pool_desc                  as  Description
               ,vendor_pool_code                  as  VENDOR_POOL_CODE
               ,tenant_id                         as  TENANT_ID
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
            key vp.tenant_id||'_'||vp.material_code  as  ID : String
               ,mm.material_desc                     as  Description
               ,vp.material_code                     as  MATERIAL_CODE
               ,vp.tenant_id                         as  TENANT_ID
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
            key tenant_id||'_'||supplier_code     as  ID : String
               ,supplier_local_name               as  Description
               ,supplier_code                     as  SUPPLIER_CODE
               ,tenant_id                         as  TENANT_ID
               ,supplier_local_name               as  SUPPLIER_LOCAL_NAME
               ,supplier_english_name             as  SUPPLIER_ENGLISH_NAME
               ,tax_id                            as  TAX_ID
               ,vat_number                        as  VAT_NUMBER
               ,tax_id_except_flag                as  TAX_ID_EXCEPTION_FLAG
               ,tax_id_except_nm                  as  TAX_ID_EXCEPTION_NAME
               ,tax_id_except_rsn                 as  TAX_ID_EXCEPTION_REASON
               ,duns_number                       as  DUNS_NUMBER
               ,duns_number_4                     as  DUNS_NUMBER_4
               ,country_code                      as  COUNTRY_CODE
               ,country_name                      as  COUNTRY_NAME
               ,zip_code                          as  ZIP_CODE
               ,local_address_1                   as  LOCAL_ADDRESS_1
               ,local_address_2                   as  LOCAL_ADDRESS_2
               ,local_address_3                   as  LOCAL_ADDRESS_3
               ,local_address_4                   as  LOCAL_ADDRESS_4
               ,english_address_1                 as  ENGLISH_ADDRESS_1
               ,english_address_2                 as  ENGLISH_ADDRESS_2
               ,english_address_3                 as  ENGLISH_ADDRESS_3
               ,english_address_4                 as  ENGLISH_ADDRESS_4
               ,local_full_address                as  LOCAL_FULL_ADDRESS
               ,english_full_address              as  ENGLISH_FULL_ADDRESS
               ,common_class_code                 as  COMMON_CLASS_CODE
               ,common_class_name                 as  COMMON_CLASS_NAME
               ,affiliate_code                    as  AFFILIATE_CODE
               ,affiliate_code_name               as  AFFILIATE_CODE_NAME
               ,individual_biz_flag               as  INDIVIDUAL_BIZ_FLAG
               ,individual_biz_desc               as  INDIVIDUAL_BIZ_DESC
               ,company_register_number           as  COMPANY_REGISTER_NUMBER
               ,company_class_code                as  COMPANY_CLASS_CODE
               ,company_class_name                as  COMPANY_CLASS_NAME
               ,repre_name                        as  REPRE_NAME
               ,biz_type                          as  BIZ_TYPE
               ,industry                          as  INDUSTRY
               ,biz_certi_attch_number            as  BIZ_CERTI_ATTCH_NUMBER
               ,attch_number_2                    as  ATTCH_NUMBER_2
               ,attch_number_3                    as  ATTCH_NUMBER_3
               ,inactive_status_code              as  INACTIVE_STATUS_CODE
               ,inactive_status_name              as  INACTIVE_STATUS_NAME
               ,inactive_date                     as  INACTIVE_DATE
               ,inactive_reason                   as  INACTIVE_REASON
               ,bp_status_code                    as  BP_STATUS_CODE
               ,bp_status_name                    as  BP_STATUS_NAME
               ,tel_number                        as  TEL_NUMBER
               ,extens_number                     as  EXTENS_NUMBER
               ,mobile_phone_number               as  MOBILE_PHONE_NUMBER
               ,fax_number                        as  FAX_NUMBER
               ,url_address                       as  URL_ADDRESS
               ,email_address                     as  EMAIL_ADDRESS
               ,fmytr_code                        as  FMYTR_CODE
               ,fmytr_name                        as  FMYTR_NAME
               ,credit_evaluation_interface_code  as  CREDIT_EVAL_IF_NO
        from  SupplierMst;

}