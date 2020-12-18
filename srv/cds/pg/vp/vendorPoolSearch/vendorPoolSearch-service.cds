using { pg as vpOperationOrg } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_OPERATION_ORG_VIEW-model';
using { pg as vpSearchView } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_SEARCH_VIEW-model';
using { pg as vpPopupView } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_POPUP_VIEW-model';
using { pg as vpMst } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_MST-model';

namespace pg; 
@path : '/pg.vendorPoolSearchService'
service VpSearchService {
    entity VpOperationOrg as projection on vpOperationOrg.Vp_Vendor_Pool_Operation_Org_View;
    entity vPSearchView as projection on vpSearchView.Vp_Vendor_Pool_Search_View;
    entity VpPopupView as projection on vpPopupView.Vp_Vendor_pool_Popup_View;
    entity VpMst as projection on vpMst.Vp_Vendor_Pool_Mst;
}