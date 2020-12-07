using { ep as loiMst } from '../../../../db/cds/ep/loiMgr/EP_LI_MST-model';
using { ep as loiDtl } from '../../../../db/cds/ep/loiMgr/EP_LI_DTL-model';
using { ep as loiVd } from '../../../../db/cds/ep/loiMgr/EP_LI_SUPPLIER-model';
using { ep as loiVdSel } from '../../../../db/cds/ep/loiMgr/EP_LI_SUPPLIER_SELECTION-model';
using { ep as loiPub } from '../../../../db/cds/ep/loiMgr/EP_LI_PUBLISH-model';

namespace ep;
@path : 'ep.LoiMgrService'
service LoiMgrService {
    entity LoiMst as projection on loiMst.Li_Mst;
    entity LoiDtl as projection on loiDtl.Li_Dtl;
    entity LoiVendor as projection on loiVd.Li_Supplier;
    entity LoiVendorSelection as projection on loiVdSel.Li_Supplier_Selection;
    entity LoiPublish as projection on loiPub.Li_Publish;	
	
	view LOIPublishItemView as
        select 		
            dtl.tenant_id,	
            dtl.company_code,	
            dtl.loi_write_number,	
            dtl.loi_item_number,	
            pub.buyer_empno,	
            pub.publish_date,	
            pub.supplier_code	
        from loiPub.Li_Publish as pub		
        join loiDtl.Li_Dtl as dtl		
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
            mst.loi_request_status_code,
            pub.buyer_empno,	
            pub.publish_date,	
            pub.supplier_code	
        from loiMst.Li_Mst as mst
        left outer join LOIPublishItemView as pub on mst.tenant_id = pub.tenant_id
                and mst.company_code = pub.company_code
                and mst.loi_write_number = pub.loi_write_number           
	;

	
}