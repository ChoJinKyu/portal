using { pg as vpTreeView } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_TREE_VIEW-model';
using { pg as vpDetailView } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_DETAIL_VIEW-model';
using { pg as vpSupplierDtl} from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_SUPPLIER_VIEW-model';
using { pg as vpMaterialDtl} from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_ITEM_DTL-model';
using { pg as vpMaterialMst} from '../../../../../db/cds/pg/vp/PG_VP_MATERIAL_MST_VIEW-model';
using { pg as vpManagerDtl } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_MANAGER_DTL-model';
using { cm as cmEmployeeMst } from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using { cm as cmDeptMst } from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model';
using { pg as vpSupplierMst } from '../../../../../db/cds/pg/vp/PG_VP_SUPPLIER_MST_VIEW-model';


//https://lgcommondev-workspaces-ws-xqwd6-app1.jp10.applicationstudio.cloud.sap/odata/v2/pg.vendorPoolMappingService/
//https://lgcommondev2-workspaces-ws-7bzzl-app1.jp10.applicationstudio.cloud.sap/odata/v2/pg.vendorPoolMappingService/vpManagerDtlView(tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00200',vendor_pool_code='VP201610280406',vendor_pool_person_empno='100')

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
               he.user_local_name,               
               he.user_english_name,
               he.job_title,
               hd.department_local_name,
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

        view vpManagerDtlParamView @(title : 'Vendor Pool Manager Mapping Parm View') (sTenant_id: String,sVendor_pool_code: String ) as
        select key md.tenant_id,
               md.company_code,
               md.org_type_code,
               md.org_code,
               md.vendor_pool_code,
               md.vendor_pool_person_empno,
               he.user_local_name,               
               he.user_english_name,
               he.job_title,
               hd.department_local_name,
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
        and    ifnull(md.vendor_pool_mapping_use_flag, true) = true
        and    he.tenant_id = :sTenant_id
        and    md.vendor_pool_code = :sVendor_pool_code;

        entity VpSupplierMstView @(title : '공급업체마스터 View') as projection on vpSupplierMst.Vp_Supplier_Mst_View;

        view VpDetailLngView @(title : 'Vendor Pool Detail Language View') as
        select  key mst.tenant_id,
                key mst.company_code,
                key mst.org_type_code,
                key mst.org_code,
                key mst.operation_unit_code,                
                key mst.vendor_pool_code,
                mst.operation_unit_name,
                mst.language_cd,
                mst.vendor_pool_local_name,
                mst.vendor_pool_english_name,
                mst.repr_department_code,
                mst.department_local_name,
                mst.parent_vendor_pool_code,
                mst.higher_level_path_name,
                mst.inp_type_code,
                mst.inp_type_name,
                mst.mtlmob_base_code,
                mst.mtlmob_base_name,
                mst.regular_evaluation_flag,
                mst.industry_class_code, 
                mst.industry_class_name,
                mst.sd_exception_flag,
                mst.vendor_pool_apply_exception_flag,
                mst.domestic_net_price_diff_rate,
                mst.dom_oversea_netprice_diff_rate,
                mst.equipment_grade_code,
                mst.equipment_grade_name,
                mst.equipment_type_code,
                mst.equipment_type_name,
                mst.vendor_pool_use_flag,
                mst.vendor_pool_desc,
                mst.vendor_pool_history_desc,
                mst.info_change_status
        from   vpDetailView.Vp_Vendor_Pool_Detail_View mst
        where  mst.language_cd = 'EN'
        ;  

    view vpTreeLngView @(title : 'Vendor Pool Tree Language View') as
        select  key mst.language_cd,
                key mst.tenant_id,
                key mst.company_code,
                key mst.org_type_code,
                key mst.org_code,
                key mst.operation_unit_code,
                key mst.vendor_pool_code,
                mst.vendor_pool_local_name,
                mst.vendor_pool_english_name,
                mst.parent_vendor_pool_code,
                mst.higher_level_path,
                mst.level_path,
                mst.repr_department_code,
                mst.department_local_name,
                mst.inp_type_code,
                mst.inp_type_name,
                mst.mtlmob_base_code,
                mst.mtlmob_base_name,
                mst.regular_evaluation_flag,
                mst.industry_class_code,
                mst.industry_class_name,
                mst.sd_exception_flag,
                mst.temp_type,
                mst.node_id,
                mst.parent_id,
                mst.path,
                mst.hierarchy_rank,
                mst.hierarchy_tree_size,
                mst.hierarchy_parent_rank,
                mst.hierarchy_level,
                mst.hierarchy_root_rank,
                mst.drill_state
        from   vpTreeView.Vp_Vendor_Pool_Tree_View mst
        where  mst.language_cd = 'EN'
        ;  

}