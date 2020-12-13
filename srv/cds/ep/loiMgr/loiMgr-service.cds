using {ep as loiMst} from '../../../../db/cds/ep/loiMgr/EP_LI_MST-model';
using {ep as loiDtl} from '../../../../db/cds/ep/loiMgr/EP_LI_DTL-model';
using {ep as loiVd} from '../../../../db/cds/ep/loiMgr/EP_LI_SUPPLIER-model';
using {ep as loiVdSel} from '../../../../db/cds/ep/loiMgr/EP_LI_SUPPLIER_SELECTION-model';
using {ep as loiPub} from '../../../../db/cds/ep/loiMgr/EP_LI_PUBLISH-model';
using {ep as loiPubItemView} from '../../../../db/cds/ep/loiMgr/EP_LI_PUBLISH_ITEM_VIEW-model';
using {ep as loiReqDetailView} from '../../../../db/cds/ep/loiMgr/EP_LI_REQUEST_DETAIL_VIEW-model';

namespace ep;

@path : 'ep.LoiMgrService'
service LoiMgrService {
    entity LoiMst               as projection on loiMst.Li_Mst;
    entity LoiDtl               as projection on loiDtl.Li_Dtl;
    entity LoiVendor            as projection on loiVd.Li_Supplier;
    entity LoiVendorSelection   as projection on loiVdSel.Li_Supplier_Selection;
    entity LoiPublish           as projection on loiPub.Li_Publish;
    entity LOIPublishItemView   as projection on loiPubItemView.Li_Publish_Item_View;
    entity LOIRequestDetailView as projection on loiReqDetailView.Li_Request_Detail_View;

    view LOIRequestView as
        select
            key mst.tenant_id,
            key mst.company_code,
            key mst.loi_write_number,
                mst.loi_number,
                mst.request_date,
                mst.loi_request_title,
                mst.loi_publish_purpose_desc,
                mst.loi_request_status_code,
                mst.investment_review_flag,
                pub.buyer_empno,
                pub.publish_date
            //pub.supplier_code
        from loiMst.Li_Mst as mst
        left outer join LOIPublishItemView as pub
        on  mst.tenant_id        = pub.tenant_id
        and mst.company_code     = pub.company_code
        and mst.loi_write_number = pub.loi_write_number;

}
