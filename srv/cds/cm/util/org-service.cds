
using { cm.Org_Tenant as Org_Tenant } from '../../../../db/cds/cm/orgMgr/CM_ORG_TENANT-model';
using { cm.Org_Company as Org_Company } from '../../../../db/cds/cm/orgMgr/CM_ORG_COMPANY-model';
using { cm.Org_Purchasing as Org_Purchasing } from '../../../../db/cds/cm/orgMgr/CM_ORG_PURCHASING-model';
using { cm.Org_Plant as Org_Plant } from '../../../../db/cds/cm/orgMgr/CM_ORG_PLANT-model';
using { cm.Org_Division as Org_Division } from '../../../../db/cds/cm/orgMgr/CM_ORG_DIVISION-model';
using { cm.Org_Unit as Org_Unit } from '../../../../db/cds/cm/orgMgr/CM_ORG_UNIT-model';

namespace cm.util;

@path : '/cm.util.OrgService'
service OrgService {

    entity Tenant        as projection on Org_Tenant;
    entity Company       as projection on Org_Company;
    entity Plant         as projection on Org_Plant;
    
    entity Purchasing    as projection on Org_Purchasing;
    entity Division      as projection on Org_Division;
    entity Unit          as projection on Org_Unit;

}
