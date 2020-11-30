using { sp as supplierOrg } from '../../../../db/cds/sp/sup/SP_SUP_SUPPLIER_ORG-model.cds';
namespace sp; 
@path : '/sp.supplierOrgService'
service supplierOrgService {
    entity supplierOrg as projection on sp.Sup_Supplier_Org;
}