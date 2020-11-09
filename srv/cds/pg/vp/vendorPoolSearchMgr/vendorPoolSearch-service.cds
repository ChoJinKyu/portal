using { pg as vpSearchView } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_SEARCH_VIEW-model';
using { pg as vpSupplier } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_SUPPLIER_DTL-model';
using { pg as vpSupplierMst } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_MST_VIEW-model';

namespace pg; 
@path : '/pg.vendorPoolSearchService'
service VpSearchService {
    entity vPSearchView as projection on vpSearchView.Vp_Vendor_Pool_Search_View;
    entity VpSupplier as projection on vpSupplier.Vp_Vendor_Pool_Supplier_Dtl;
    entity VpSupplierMst as projection on vpSupplierMst.Vp_Vendor_Mst_View;

    view VpSupplierDtlView as
    select s.tenant_id,
           s.company_code,
           s.operation_org_type_code,
           s.operation_org_code,
           s.vendor_pool_code,
           s.vendor_code,
           s.evaluation_target_flag,
           s.review_pass_flag,
           s.evaluation_control_flag,
           s.evaluation_control_start_date,
           s.evaluation_control_end_date,
           s.evaluation_restrict_start_date,
           s.evaluation_restrict_end_date,
           s.inp_code,
           s.rm_control_flag,
           s.supplier_base_portion_rate,
           s.use_flag,
           s.register_reason_text,
           s.register_approval_request_number,
           m.vendor_name,
           m.vendor_englis_name
    from   vpSupplier.Vp_Vendor_Pool_Supplier_Dtl s,
           vpSupplierMst.Vp_Vendor_Mst_View m
    where  s.tenant_id = m.tenant_id
    and    s.vendor_code = m.vendor_code
    ;
           
}