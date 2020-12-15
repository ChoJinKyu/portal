//CM ORG
using {cm.Org_Tenant as OrgTenant} from '../../../../db/cds/cm/orgMgr/CM_ORG_TENANT-model';     // Tenant(회사)
using {cm.Org_Company as OrgCompany} from '../../../../db/cds/cm/orgMgr/CM_ORG_COMPANY-model';  // Company(법인)
using {cm.Org_Unit as OrgUnit} from '../../../../db/cds/cm/orgMgr/CM_ORG_UNIT-model';           // Bizunit(사업본부)
using {cm.Org_Plant as OrgPlant} from '../../../../db/cds/cm/orgMgr/CM_ORG_PLANT-model';                    // Plant(플랜트)

namespace pg;

@path : '/pg.taskMonitoringSacService'
service taskMonitoringSacService {

    // Entity List
    // View List

    // Tenant View: 회사
    view OrgTenantView @(title : '회사 마스터 View') as
        select
            key tenant_id,
                tenant_name
        from OrgTenant;

    // Company View: 법인
    view OrgCompanyView @(title : '법인 마스터 View') as
        select
            key tenant_id,
            key company_code,
                company_name
        from OrgCompany;

    // Unit View: 사업부분
    view OrgUnitView @(title : '사업본부 마스터 View') as
        select
            key tenant_id,
            key bizunit_code,
                bizunit_name
        from OrgUnit;

    // Plant View: 플랜트
    view OrgPlantView @(title : '플랜트 마스터 View') as
        select
            key tenant_id,
            key company_code,
            key plant_code,
                plant_name,
                use_flag,
                purchase_org_code,
                bizdivision_code,
                au_code,
                hq_au_code,
                master_org_flag,
                validation_org_flag
        from OrgPlant;

}