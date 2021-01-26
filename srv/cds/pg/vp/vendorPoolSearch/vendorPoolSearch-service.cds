using { pg as vpOperationOrg } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_OPERATION_ORG_VIEW-model';
using { pg as vpSearchView } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_SEARCH_VIEW-model';
using { pg as vpPopupView } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_POPUP_VIEW-model';
using { pg as vpMst } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_MST-model';
using { pg as vpMaxLevel } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_MAX_LEVEL_VIEW-model';

namespace pg; 
@path : '/pg.vendorPoolSearchService'
service VpSearchService {
    entity VpOperationOrg as projection on vpOperationOrg.Vp_Vendor_Pool_Operation_Org_View;
    entity vPSearchView as projection on vpSearchView.Vp_Vendor_Pool_Search_View;
    entity VpPopupView as projection on vpPopupView.Vp_Vendor_pool_Popup_View;
    entity VpMst as projection on vpMst.Vp_Vendor_Pool_Mst;

    view vpSearchOrderView @(title : 'Vendor Pool Search Ordery by View') as
        select  key tenant_id,
                key company_code,
                key org_type_code,
                key org_code,                
                key operation_unit_code,
                key vendor_pool_code,
                operation_unit_name,                
                language_cd,
                vendor_pool_local_name,
                vendor_pool_english_name,
                vendor_pool_level1_name,
                vendor_pool_level2_name,
                vendor_pool_level3_name,
                vendor_pool_level4_name,
                vendor_pool_level5_name,
                higher_level_path,
                level_path,
                info_change_status,
                inp_type_code,
                inp_type_name,
                equipment_grade_code,
                equipment_grade_name,
                equipment_type_code,
                equipment_type_name,
                supplier_quantity,
                supplier_code,
                supplier_local_name,
                supplier_english_name,
                supplier_company_code,
                supplier_company_name,
                supplier_type_name,
                supplier_flag,
                maker_flag,
                supplier_status_name,
                supeval_control_flag,
                supeval_control_start_date,
                supeval_control_end_date,
                temp_type,
                supplier_rm_control_flag,
                sd_exception_flag,
                vendor_pool_apply_exception_flag,
                maker_material_code_mngt_flag,
                repr_department_code,
                repr_department_name,
                managers_name,
                hierarchy_rank,
                vendor_pool_path_code,
                vendor_pool_path_name
        from   vpSearchView.Vp_Vendor_Pool_Search_View
        order by vendor_pool_path_name
        ;
    
    @readonly
    view vpMaxLevelView as 
        select
            key mst.language_cd,
            key mst.tenant_id,
            key mst.org_code,
            key mst.operation_unit_code,
            mst.max_level                
        from
            vpMaxLevel.Vp_Vendor_Pool_Max_Level_View(
                p_tenant_id: 'L2100',
                p_language_code: 'KO'
            ) mst
        ;        
}