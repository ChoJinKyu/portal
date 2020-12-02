using cm.Org_Tenant from '../../../../db/cds/cm/orgMgr/CM_ORG_TENANT-model';
using cm.Org_Company from '../../../../db/cds/cm/orgMgr/CM_ORG_COMPANY-model';
using cm.Org_Purchasing from '../../../../db/cds/cm/orgMgr/CM_ORG_PURCHASING-model';
using cm.Org_Plant from '../../../../db/cds/cm/orgMgr/CM_ORG_PLANT-model';
using cm.Org_Division from '../../../../db/cds/cm/orgMgr/CM_ORG_DIVISION-model';
using cm.Org_Unit from '../../../../db/cds/cm/orgMgr/CM_ORG_UNIT-model';

namespace cm;

@path : '/cm.OrgMgrService'
service OrgMgrService {
  entity Org_Tenant        as projection on cm.Org_Tenant;
  entity Org_Company       as projection on cm.Org_Company;
  entity Org_Purchasing    as projection on cm.Org_Purchasing;
  entity Org_Plant         as projection on cm.Org_Plant;
  entity Org_Division      as projection on cm.Org_Division;
  entity Org_Unit          as projection on cm.Org_Unit;
  entity cm_org_purchasing as projection on cm.Org_Purchasing;
  entity cm_org_plant      as projection on cm.Org_Plant;
  entity cm_org_division   as projection on cm.Org_Division;
  entity cm_org_unit       as projection on cm.Org_Unit;

  view organization as
      select from (
        select
          tenant_id,
          bizunit_code as code,
          bizunit_name as name,
          'BU'         as type
        from cm_org_unit

      union all

        select
          tenant_id,
          purchase_org_code as code,
          purchase_org_name as name,
          'PU'              as type
        from cm_org_purchasing

      union all

        select
          tenant_id,
          plant_code as code,
          plant_name as name,
          'PL'       as type
        from cm_org_plant

      union all

        select
          tenant_id,
          bizdivision_code as code,
          bizdivision_name as name,
          'AU'             as type
        from cm_org_division
      ) o {
        key tenant_id,
        key code,
            type : String
      }
}
