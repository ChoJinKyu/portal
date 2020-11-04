using cm.Org_Tenant from '../../../../db/cds/cm/orgMgr/CM_ORG_TENANT-model';
using cm.Org_Company from '../../../../db/cds/cm/orgMgr/CM_ORG_COMPANY-model';
using cm.Org_Purchasing from '../../../../db/cds/cm/orgMgr/CM_ORG_PURCHASING-model';
using cm.Org_Plant from '../../../../db/cds/cm/orgMgr/CM_ORG_PLANT-model';
using cm.Org_Division from '../../../../db/cds/cm/orgMgr/CM_ORG_DIVISION-model';
using cm.Org_Business from '../../../../db/cds/cm/orgMgr/CM_ORG_BUSINESS-model';

namespace cm;
@path : '/cm.OrgMgrService'
service OrgMgrService {
    entity Org_Tenant as projection on cm.Org_Tenant;
    entity Org_Company as projection on cm.Org_Company;
    entity Org_Purchasing as projection on cm.Org_Purchasing;
    entity Org_Plant as projection on cm.Org_Plant;
    entity Org_Division as projection on cm.Org_Division;
    entity Org_Business as projection on cm.Org_Business;
}