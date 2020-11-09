using { ep as loiMst } from '../../../../db/cds/ep/loiMgr/EP_LOI_MST-model';
using { ep as loiDtl } from '../../../../db/cds/ep/loiMgr/EP_LOI_DTL-model';
using { ep as loiVd } from '../../../../db/cds/ep/loiMgr/EP_LOI_VENDOR-model';
using { ep as loiVdSel } from '../../../../db/cds/ep/loiMgr/EP_LOI_VENDOR_SELECTION-model';
using { ep as loiPub } from '../../../../db/cds/ep/loiMgr/EP_LOI_PUBLISH-model';

namespace ep;
@path : 'ep.LoiMgrService'
service LoiMgrService {
    entity LoiMst as projection on loiMst.Loi_Mst;
    entity LoiDtl as projection on loiDtl.Loi_Dtl;
    entity LoiVendor as projection on loiVd.Loi_Vendor;
    entity LoiVendorSelection as projection on loiVdSel.Loi_Vendor_Selection;
    entity LoiPublish as projection on loiPub.Loi_Publish;	
	
	view LOIPublishItemView as
        select 		
            dtl.tenant_id,	
            dtl.company_code,	
            dtl.loi_write_number,	
            dtl.loi_item_number,	
            pub.purchasing_person_id,	
            pub.publish_date,	
            pub.vendor_code	
        from loiPub.Loi_Publish as pub		
        join loiDtl.Loi_Dtl as dtl		
            on pub.tenant_id = dtl.tenant_id
            and pub.company_code = dtl.company_code
            and pub.loi_publish_number = dtl.loi_publish_number	
	;

	view LOIRequestView as
        select 
            mst.tenant_id,
            mst.company_code,
            mst.loi_write_number,
            mst.loi_number,
            mst.loi_request_title,
            mst.progress_status_code,
            pub.purchasing_person_id,	
            pub.publish_date,	
            pub.vendor_code	
        from loiMst.Loi_Mst as mst
        left outer join LOIPublishItemView as pub on mst.tenant_id = pub.tenant_id
                and mst.company_code = pub.company_code
                and mst.loi_write_number = pub.loi_write_number           
	;
	
}