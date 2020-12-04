using { pg as vpSupplierDtl} from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_SUPPLIER_DTL-model';
using { pg as vpSupplierMst} from '../../../../../db/cds/pg/vp/PG_VP_SUPPLIER_MST_VIEW-model';
using { pg as vpMaterialDtl} from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_ITEM_DTL-model';
using { pg as vpMaterialMst} from '../../../../../db/cds/pg/vp/PG_VP_MATERIAL_MST_VIEW-model';

//using { pg as vpMstType } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_MST_TYPE-model';
//using { pg as vpSupplierType } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_SUPPLIER_TYPE-model';
//using { pg as vpItemType } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_ITEM_TYPE-model';
//using { pg as vpManagerType } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_MANAGER_TYPE-model';
//using { pg as vpOutType } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_PROC_OUT_TYPE-model';

namespace pg; 
@path : '/pg.vendorPoolMappingService'
service VpMappingService {

    view vpSupplierDtlView @(title : 'Vendor Pool Supplier Mapping View') as
        select key sv.language_cd,
               key sd.tenant_id,
               key sd.company_code,
               key sd.org_type_code,
               key sd.org_code,
               key sd.vendor_pool_code,
               key sd.supplier_code,
               sv.supplier_local_name,
               sv.supplier_english_name,
               sv.company_code supplier_company_code,
               sv.company_name supplier_company_name,
               sv.supplier_status_code,
               sd.supeval_control_flag,
               sd.supeval_control_start_date,
               sd.supeval_control_end_date,
               sd.supplier_rm_control_flag,
               sd.supplier_base_portion_rate,
               sd.vendor_pool_mapping_use_flag,
               sd.register_reason,
               sd.approval_number
        from   vpSupplierDtl.Vp_Vendor_Pool_Supplier_Dtl sd,
               vpSupplierMst.Vp_Supplier_Mst_View sv
        where  sd.tenant_id = sv.tenant_id
        and    map(sd.company_code, '*', sv.company_code, sd.company_code) = sv.company_code
        and    sd.org_code = sv.bizunit_code
        and    sd.supplier_code = sv.supplier_code
        group by sv.language_cd,
                 sd.tenant_id,
                 sd.company_code,
                 sd.org_type_code,
                 sd.org_code,
                 sd.vendor_pool_code,
                 sd.supplier_code,
                 sv.supplier_local_name,
                 sv.supplier_english_name,
                 sv.company_code,
                 sv.company_name,
                 sv.supplier_status_code,
                 sd.supeval_control_flag,
                 sd.supeval_control_start_date,
                 sd.supeval_control_end_date,
                 sd.supplier_rm_control_flag,
                 sd.supplier_base_portion_rate,
                 sd.vendor_pool_mapping_use_flag,
                 sd.register_reason,
                 sd.approval_number
        ;
    
    view vpMaterialDtlView @(title : 'Vendor Pool Material Mapping View') as
        select mv.language_cd,
               md.tenant_id,
               md.company_code,
               md.org_type_code,
               md.org_code,
               md.vendor_pool_code,
               md.material_code,
               mv.material_desc,
               md.vendor_pool_mapping_use_flag,
               md.register_reason,
               md.approval_number,
               local_update_dtm,
               update_user_id
        from   vpMaterialDtl.Vp_Vendor_Pool_Item_Dtl md,
               vpMaterialMst.Vp_Material_Mst_View mv
        where  md.tenant_id = mv.tenant_id
        and    map(md.company_code, '*', mv.company_code, md.company_code) = mv.company_code
        and    md.org_code = mv.bizunit_code
        and    md.material_code = mv.material_code
        and    ifnull(md.vendor_pool_mapping_use_flag, true) = true
        group by mv.language_cd,
                 md.tenant_id,
                 md.company_code,
                 md.org_type_code,
                 md.org_code,
                 md.vendor_pool_code,
                 md.material_code,
                 mv.material_desc,
                 md.vendor_pool_mapping_use_flag,
                 md.register_reason,
                 md.approval_number,
                 local_update_dtm,
                 update_user_id
        ;       

//    entity VpMstType @(title : '협력사풀 테이블타입') as projection on vpMstType.Vp_Vendor_Pool_Mst_Type;
//    entity VpSupplierType @(title : '협력사풀 공급업체 테이블타입') as projection on vpSupplierType.Vp_Vendor_Pool_Supplier_Type;
//    entity VpItemType @(title : '협력사풀 품목 테이블타입') as projection on vpItemType.Vp_Vendor_Pool_Item_Type;
//    entity VpManagerType @(title : '협력사풀 담당자 테이블타입') as projection on vpManagerType.Vp_Vendor_Pool_Manager_Type;
//    entity VpOutType @(title : '협력사풀 변경 Out Parameter 테이블타입') as projection on vpOutType.Vp_Vendor_Pool_Proc_Out_Type;

//    action VpVendorPoolChangeProc (vpMst : array of VpMstType, vpSupplier: array of VpSupplierType, vpItem: array of VpItemType, vpManager: array of VpManagerType, user_id: String(255), user_no: String(255)) returns array of VpOutType;
}