namespace dp.util;
using { dp as supplierView } from '../../../../../db/cds/dp/util/DP_SUPPLIER_VIEW-model';

@path: '/dp.util.SupplierSelectionService'
service SupplierSelectionService {
    
    entity Suppliers as projection on supplierView.Supplier_View;

}