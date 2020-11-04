using { pg as vpSearchView } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_SEARCH_VIEW-model';

namespace pg; 
@path : '/pg.vendorPoolSearchService'
service VpSearchService {
    entity vPSearchView as projection on vpSearchView.Vp_Vendor_Pool_Search_View;
}