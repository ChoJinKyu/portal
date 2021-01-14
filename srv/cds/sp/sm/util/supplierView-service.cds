using {sp as supplView} from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_VIEW-model';

namespace sp;

@path : '/sp.supplierViewService'
service supplierViewService {

    view supplierView @(title : '공급업체 View') as select from supplView.Sm_Supplier_View;
}
