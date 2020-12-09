using { pg as vpTreeView } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_TREE_VIEW-model';
using { pg as vpDetailView } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_DETAIL_VIEW-model';
using { pg as vpSupplierDtl} from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_SUPPLIER_VIEW-model';
using { pg as vpMaterialDtl} from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_ITEM_DTL-model';
using { pg as vpMaterialMst} from '../../../../../db/cds/pg/vp/PG_VP_MATERIAL_MST_VIEW-model';
using { pg as vpManagerDtl } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_MANAGER_DTL-model';
using { cm as cmEmployeeMst } from '../../../../../db/cds/cm/hrEmployeeMgr/CM_HR_EMPLOYEE-model';
using { cm as cmDeptMst } from '../../../../../db/cds/cm/hrDeptMgr/CM_HR_DEPARTMENT-model';
using { pg as vpSupplierMst } from '../../../../../db/cds/pg/vp/PG_VP_SUPPLIER_MST_VIEW-model';


//https://lgcommondev-workspaces-ws-xqwd6-app1.jp10.applicationstudio.cloud.sap/odata/v2/pg.vendorPoolMappingService/


//using { pg as vpMstType } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_MST_TYPE-model';
//using { pg as vpSupplierType } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_SUPPLIER_TYPE-model';
//using { pg as vpItemType } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_ITEM_TYPE-model';
//using { pg as vpManagerType } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_MANAGER_TYPE-model';
//using { pg as vpOutType } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_PROC_OUT_TYPE-model';

namespace pg; 
@path : '/pg.vendorPoolMappingService'
service VpMappingService {
    
    entity VpTreeView @(title : '협력사풀 Tree View') as projection on vpTreeView.Vp_Vendor_Pool_Tree_View;

    entity VpDetailView @(title : '협력사풀 공급업체 View') as projection on vpDetailView.Vp_Vendor_Pool_Detail_View;
    entity VpSupplierDtlView @(title : '협력사풀 공급업체 View') as projection on vpSupplierDtl.Vp_Vendor_Pool_Supplier_View;
    
    view vpMaterialDtlView @(title : 'Vendor Pool Material Mapping View') as
        select key mv.language_cd,
               key md.tenant_id,
               key md.company_code,
               key md.org_type_code,
               key md.org_code,
               key md.vendor_pool_code,
               key md.material_code,
               mv.material_desc,
               md.vendor_pool_mapping_use_flag,
               md.register_reason,
               md.approval_number,
               md.local_update_dtm,
               md.update_user_id
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

    view vpManagerDtlView @(title : 'Vendor Pool Manager Mapping View') as
        select key md.tenant_id,
               key md.company_code,
               key md.org_type_code,
               key md.org_code,
               key md.vendor_pool_code,
               key md.vendor_pool_person_empno,
               he.user_korean_name,
               he.user_english_name,
               he.job_title,
               hd.department_korean_name,
               hd.department_english_name,
               he.user_status_code,
               md.vendor_pool_person_role_text,
               md.vendor_pool_mapping_use_flag,
               md.local_update_dtm,
               md.update_user_id
        from   vpManagerDtl.Vp_Vendor_Pool_Manager_Dtl md,
               cmEmployeeMst.Hr_Employee he,
               cmDeptMst.Hr_Department hd
        where  md.tenant_id = he.tenant_id
        and    md.vendor_pool_person_empno = he.employee_number
        and    he.tenant_id = hd.tenant_id
        and    he.department_id = hd.department_id
        and    ifnull(md.vendor_pool_mapping_use_flag, true) = true;

        entity VpSupplierMstView @(title : '공급업체마스터 View') as projection on vpSupplierMst.Vp_Supplier_Mst_View;


//    entity VpMstType @(title : '협력사풀 테이블타입') as projection on vpMstType.Vp_Vendor_Pool_Mst_Type;
//    entity VpSupplierType @(title : '협력사풀 공급업체 테이블타입') as projection on vpSupplierType.Vp_Vendor_Pool_Supplier_Type;
//    entity VpItemType @(title : '협력사풀 품목 테이블타입') as projection on vpItemType.Vp_Vendor_Pool_Item_Type;
//    entity VpManagerType @(title : '협력사풀 담당자 테이블타입') as projection on vpManagerType.Vp_Vendor_Pool_Manager_Type;
//    entity VpOutType @(title : '협력사풀 변경 Out Parameter 테이블타입') as projection on vpOutType.Vp_Vendor_Pool_Proc_Out_Type;

//    action VpVendorPoolChangeProc (vpMst : array of VpMstType, vpSupplier: array of VpSupplierType, vpItem: array of VpItemType, vpManager: array of VpManagerType, user_id: String(255), user_no: String(255)) returns array of VpOutType;
}