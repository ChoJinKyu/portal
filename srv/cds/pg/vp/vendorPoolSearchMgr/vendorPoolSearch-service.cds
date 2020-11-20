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
           s.org_type_code,
           s.org_code,
           s.vendor_pool_code,
           s.supplier_code,
           s.supeval_target_flag,
           s.supplier_op_plan_review_flag,
           s.supeval_control_flag,
           s.supeval_control_start_date,
           s.supeval_control_end_date,
           s.supeval_restrict_start_date,
           s.supeval_restrict_end_date,
           s.inp_code,
           s.supplier_rm_control_flag,
           s.supplier_base_portion_rate,
           s.vendor_pool_mapping_use_flag,
           s.register_reason,
           s.approval_number,
           m.supplier_local_name,
           m.supplier_english_name
    from   vpSupplier.Vp_Vendor_Pool_Supplier_Dtl s,
           vpSupplierMst.Vp_Vendor_Mst_View m
    where  s.tenant_id = m.tenant_id
    and    s.supplier_code = m.supplier_code
    ;
           
}