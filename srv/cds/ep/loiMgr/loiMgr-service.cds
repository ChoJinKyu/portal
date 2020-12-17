using { ep as loiMst } from '../../../../db/cds/ep/loiMgr/EP_LI_MST-model';
using { ep as loiDtl } from '../../../../db/cds/ep/loiMgr/EP_LI_DTL-model';
using { ep as loiVd } from '../../../../db/cds/ep/loiMgr/EP_LI_SUPPLIER-model';
using { ep as loiVdSel } from '../../../../db/cds/ep/loiMgr/EP_LI_SUPPLIER_SELECTION-model';
using { ep as loiPub } from '../../../../db/cds/ep/loiMgr/EP_LI_PUBLISH-model';
using { ep as loiPubItemView } from '../../../../db/cds/ep/loiMgr/EP_LI_PUBLISH_ITEM_VIEW-model';
using { ep as loiReqDetailView} from '../../../../db/cds/ep/loiMgr/EP_LI_REQUEST_DETAIL_VIEW-model';
using { ep as loiReqListView} from '../../../../db/cds/ep/loiMgr/EP_LI_REQUEST_LIST_VIEW-model';

namespace ep;

@path : 'ep.LoiMgrService'
service LoiMgrService {
    entity LoiMst as projection on loiMst.Li_Mst;
    entity LoiDtl as projection on loiDtl.Li_Dtl;
    entity LoiVendor as projection on loiVd.Li_Supplier;
    entity LoiVendorSelection as projection on loiVdSel.Li_Supplier_Selection;
    entity LoiPublish as projection on loiPub.Li_Publish;	
	
	entity LOIPublishItemView as projection on loiPubItemView.Li_Publish_Item_View;	
    entity LOIRequestDetailView as projection on loiReqDetailView.Li_Request_Detail_View;
    entity LOIRequestListView as projection on loiReqListView.Li_Request_List_View;

    view LoiNumberGroupbyView as
        select
        key tenant_id,
        key company_code,
        key loi_number
        from loiMst.Li_Mst 
        group by tenant_id, company_code, loi_number;
}
