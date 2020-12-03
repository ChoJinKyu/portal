using { sp as supplierMaster } from '../../../../db/cds/sp/supplierMgr/SP_SM_SUPPLIER_MST-model.cds';
namespace sp; 
@path : '/sp.supplierMasterService'
service supplierMasterService {
    entity supplierMaster as projection on sp.Sm_Supplier_Mst;
}