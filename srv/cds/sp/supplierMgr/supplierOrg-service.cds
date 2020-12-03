using { sp as supplierOrg } from '../../../../db/cds/sp/supplierMgr/SP_SM_SUPPLIER_ORG-model.cds';
namespace sp; 
@path : '/sp.supplierOrgService'
service supplierOrgService {
    entity supplierOrg as projection on sp.Sm_Supplier_Org;
}
