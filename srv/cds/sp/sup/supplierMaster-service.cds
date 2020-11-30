using { sp as supplierMaster } from '../../../../db/cds/sp/sup/SP_SUP_SUPPLIER_MST-model.cds';
namespace sp; 
@path : '/sp.supplierMasterService'
service supplierMasterService {
    entity supplierMaster as projection on sp.Sup_Supplier_Mst;
}