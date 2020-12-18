using { sp as supplierOrg } from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_ROLE-model.cds';
namespace sp; 
@path : '/sp.supplierRoleService'
service supplierRoleService {
    entity supplierRole as projection on sp.Sm_Supplier_Role;
}