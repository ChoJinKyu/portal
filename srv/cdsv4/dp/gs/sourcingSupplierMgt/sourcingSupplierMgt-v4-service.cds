using { dp as SupplierF } from '../../../../../db/cds/dp/gs/DP_GS_CHECK_SUPPLIER_UNIQUE_FUNC-model';

namespace dp;
@path : '/dp.GsSupplierMgtV4Service'
service GsSupplierMgtV4Service {

    entity GsCheckSupplierUniqueFunc(I_TENANT_ID : String, I_SUPPLIER_NICKNAME : String) as
    select from SupplierF.Gs_Check_Supplier_Unique_Func(I_TENANT_ID: :I_TENANT_ID, I_SUPPLIER_NICKNAME: :I_SUPPLIER_NICKNAME)

}
