using { sp as supplierOrg } from '../../../../db/cds/sp/supplierMgr/SP_SUP_SUPPLIER_ROLE-model.cds';
namespace sp; 
@path : '/sp.supplierRoleService'
service supplierRoleService {
    entity supplierRole as projection on sp.Sup_Supplier_Role;
}