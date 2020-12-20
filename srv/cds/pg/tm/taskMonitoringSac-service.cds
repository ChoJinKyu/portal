//CM ORG
using {cm.Org_Tenant as OrgTenant} from '../../../../db/cds/cm/CM_ORG_TENANT-model';                // Tenant(회사)
using {cm.Org_Company as OrgCompany} from '../../../../db/cds/cm/CM_ORG_COMPANY-model';             // Company(법인)
using {cm.Org_Unit as OrgUnit} from '../../../../db/cds/cm/CM_ORG_UNIT-model';                      // Bizunit(사업본부)
using {cm.Org_Plant as OrgPlant} from '../../../../db/cds/cm/CM_ORG_PLANT-model';                   // Plant(플랜트)
using {cm.Org_Purchasing as OrgPurchasing} from '../../../../db/cds/cm/CM_ORG_PURCHASING-model';    // Purchasing(구매조직)
using {cm.Org_Division as OrgDivision} from '../../../../db/cds/cm/CM_ORG_DIVISION-model';          // Division(사업부)
//using {cm.Org_Operation as OrgOperation} from '../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';   // PurchaseOperation(구매운영조직)
//using {cm.Org_Type as OrgOrgType} from '../../../../db/cds/cm/CM_PUR_ORG_TYPE-model';               // OrgType(구매조직유형매핑)
//CM CODE
using {cm.Code_Dtl as CodeDtl} from '../../../../db/cds/cm/CM_CODE_DTL-model';                      // CodeDtl(사업본부)
using {cm.Code_Lng as CodeLng} from '../../../../db/cds/cm/CM_CODE_LNG-model';                      // CodeLng(플랜트)

namespace pg;

@path : '/pg.taskMonitoringSacService'
service taskMonitoringSacService {

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
            key tenant_id||'_'||code  as  ID : String
               ,code_name             as  Description
               ,code                  as  CODE
               ,tenant_id             as  TENANT_ID
               ,language_cd           as  LANGUAGE_CODE
        from  CmCodeDtlView
        where group_code  =  'PG_MI_EXCHANGE_CODE';

    // MiTermsdelvCode View: 인도조건코드
    view MiTermsdelvCodeView @(title : '인도조건코드 View') as
        select
            key tenant_id||'_'||code  as  ID : String
               ,code_name             as  Description
               ,code                  as  CODE
               ,tenant_id             as  TENANT_ID
               ,language_cd           as  LANGUAGE_CODE
        from  CmCodeDtlView
        where group_code  =  'PG_MI_TERMSDELV_CODE';

}
