
/************************************************
  ---------Service정의 Rule  ------------------
  1. 선언부(Using)
    - '체인명(pg)'만 주고 as 이후는 Naming은 소문자로 시작
  2. namespace
    -  체인 소문자로 작성
    -  체인하위의 소모듈 존재시 체인.소모듈 로 작성
  
  3. entity
    - 선언부 이름을 사용하되 첫 글자는 대문자로 변경하여 사용하고 as projection on 이후에는 선언부 이름.모델 파일에 정의된 Entity명으로 정의
  
  4. 서비스에서 정의하는 View는 첫글자는 대문자로 시작하고 끝은 View를 붙인다  
  5. 서비스에서 정의하는 View의 컬럼(속성)
    - 소문자로 작성

*  화면 및 서비스 확인을 위한 wap서버 올릴때 명령어 ==>  mvn spring-boot:run
   
  --------- 현 Service 설명 -------------------
  1. service       : VpMappingService
  2. description   : Vendor Pool 상세 정보 Mapping
  3. history
    -. 2020.11.28 : 이상재 최초작성
*************************************************/
using { pg as vpTreeView } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_TREE_LNG_VIEW-model';
using { pg as vpDetailView } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_DETAIL_VIEW-model';
using { pg as vpSupplierDtl} from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_SUPPLIER_VIEW-model';
using { pg as vpSupplierPopupDtl} from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_SUPPLIER_POPUP_VIEW-model';
using { pg as vpMaterialDtl} from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_ITEM_DTL-model';
using { pg as vpMaterialMst} from '../../../../../db/cds/pg/vp/PG_VP_MATERIAL_MST_VIEW-model';
using { pg as vpManagerDtl } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_MANAGER_DTL-model';
using { cm as cmEmployeeMst } from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using { cm as cmDeptMst } from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model';
using { pg as vpSupplierMst } from '../../../../../db/cds/pg/vp/PG_VP_SUPPLIER_MST_VIEW-model';
using { pg as vpTreeDrillType } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_LEAF_INFO_VIEW-model';
using { cm as sppUserSession} from '../../../../../db/cds/cm/util/CM_SPP_USER_SESSION_VIEW-model';

namespace pg; 
@path : '/pg.vendorPoolMappingService'
service VpMappingService {
    
    //entity VpTreeView @(title : '협력사풀 Tree View') as projection on vpTreeView.Vp_Vendor_Pool_Tree_View;

    entity VpDetailView @(title : '협력사풀 공급업체 View') as projection on vpDetailView.Vp_Vendor_Pool_Detail_View;

    entity VpSupplierDtlView @(title : '협력사풀 공급업체 View') as projection on vpSupplierDtl.Vp_Vendor_Pool_Supplier_View;    

    //entity VpMaterialMst @(title : '협력사풀 품목마스터 View') as projection on vpMaterialMst.Vp_Material_Mst_View;

    view VpMaterialMst @(title : '협력사풀 품목마스터 View') as
        select  key m.bizunit_code,
                key m.language_cd,
                key m.tenant_id,
                key m.company_code,
                key m.org_type_code,
                key m.org_code,
                key m.material_code,
                m.material_desc
        from   vpMaterialMst.Vp_Material_Mst_View m
                join sppUserSession.Spp_User_Session_View ssn
                on     m.tenant_id    = ssn.TENANT_ID
                and    m.language_cd  = ssn.LANGUAGE_CODE
        ; 
    
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
        from   vpMaterialDtl.Vp_Vendor_Pool_Item_Dtl md
                join vpMaterialMst.Vp_Material_Mst_View mv
                on     md.tenant_id     = mv.tenant_id
                and    map(md.company_code, '*', mv.company_code, md.company_code) = mv.company_code
                and    md.org_code      = mv.bizunit_code
                and    md.material_code = mv.material_code
                join sppUserSession.Spp_User_Session_View ssn
                on     md.tenant_id    = ssn.TENANT_ID
                and    mv.language_cd  = ssn.LANGUAGE_CODE
        where   ifnull(md.vendor_pool_mapping_use_flag, true) = true
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
        from   vpManagerDtl.Vp_Vendor_Pool_Manager_Dtl md
                join cmEmployeeMst.Hr_Employee he
                on     md.tenant_id                = he.tenant_id
                and    md.vendor_pool_person_empno = he.employee_number               
                join cmDeptMst.Hr_Department hd
                on     he.tenant_id       = hd.tenant_id
                and    he.department_code = hd.department_code
                join sppUserSession.Spp_User_Session_View ssn
                on     md.tenant_id    = ssn.TENANT_ID                
        where  ifnull(md.vendor_pool_mapping_use_flag, true) = true;        

        //entity VpSupplierMstView @(title : '공급업체마스터 View') as projection on vpSupplierMst.Vp_Supplier_Mst_View;

        view VpSupplierMstView @(title : '공급업체마스터 View') as
        select  key bizunit_code,
                key language_cd,
                key tenant_id,
                key company_code,
                company_name,
                key org_type_code,
                key org_code,
                key supplier_code,
                supplier_local_name,
                supplier_english_name,
                supplier_type_code,
                supplier_type_name,
                inactive_status_code,
                inactive_status_name,
                supplier_register_status_code,
                supplier_register_status_name,
                supplier_flag,
                maker_flag,
                supplier_old_supplier_code,
                maker_old_supplier_code
        from   vpSupplierMst.Vp_Supplier_Mst_View m
                join sppUserSession.Spp_User_Session_View ssn
                on     m.tenant_id    = ssn.TENANT_ID
                and    m.language_cd  = ssn.LANGUAGE_CODE
        ; 

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
                mst.info_change_status,
                mst.maker_material_code_mngt_flag
        from   vpDetailView.Vp_Vendor_Pool_Detail_View mst
                join sppUserSession.Spp_User_Session_View ssn
                on     mst.tenant_id    = ssn.TENANT_ID                
                and    mst.language_cd  = ssn.LANGUAGE_CODE        
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
                mst.drill_state,
                mst.vendor_pool_path_code,
                mst.vendor_pool_path_name
        from   vpTreeView.Vp_Vendor_Pool_Tree_Lng_View(
                    p_language_code: 'KO'
                ) mst        
        ;  

        @readonly
        view vpInfoLeafView as 
            select
                key mst.language_cd,
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
                mst.drill_state,
                mst.vendor_pool_path_code,
                mst.vendor_pool_path_name
            from
                vpTreeDrillType.Vp_Vendor_Pool_Leaf_Info_View(
                    p_language_code: 'KO',
                    p_drill_type: 'leaf'
                ) mst
        ;

        @readonly
        view vpInfoExpandedView as 
            select
                key mst.language_cd,
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
                mst.drill_state,
                mst.vendor_pool_path_code,
                mst.vendor_pool_path_name
            from
                vpTreeDrillType.Vp_Vendor_Pool_Leaf_Info_View(
                    p_language_code: 'KO',
                    p_drill_type: 'expanded'
                ) mst
        ;

        @readonly
        view vpInfoDrillAllView as 
            select
                key mst.language_cd,
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
                mst.drill_state,
                mst.vendor_pool_path_code,
                mst.vendor_pool_path_name
            from
                vpTreeDrillType.Vp_Vendor_Pool_Leaf_Info_View(
                    p_language_code: 'KO',
                    p_drill_type: 'ALL'
                ) mst
        ;

        @readonly
        view vpSupplierPopupDtlView as 
            select
                     key mst.language_cd                            
                    ,key mst.temp_type                              
                    ,key mst.tenant_id                              
                    ,key mst.company_code                           
                    ,key mst.org_type_code                          
                    ,key mst.org_code                               
                    ,key mst.vendor_pool_code                       
                    ,key mst.supplier_code                          
                    ,mst.org_type_name
                    ,mst.supplier_local_name                        
                    ,mst.supplier_english_name                      
                    ,mst.supplier_company_code                      
                    ,mst.supplier_company_name                      
                    ,mst.inactive_status_code                       
                    ,mst.supeval_control_flag                       
                    ,mst.supeval_control_start_date                 
                    ,mst.supeval_control_end_date                   
                    ,mst.supplier_rm_control_flag                   
                    ,mst.supplier_base_portion_rate                 
                    ,mst.vendor_pool_level1_code                    
                    ,mst.vendor_pool_level2_code                    
                    ,mst.vendor_pool_level3_code                    
                    ,mst.vendor_pool_level4_code                    
                    ,mst.vendor_pool_level5_code                    
                    ,mst.vendor_pool_level1_name
                    ,mst.vendor_pool_level2_name
                    ,mst.vendor_pool_level3_name
                    ,mst.vendor_pool_level4_name
                    ,mst.vendor_pool_level5_name
                    ,mst.supplier_flag
                    ,mst.maker_flag
                    ,mst.supplier_old_supplier_code
                    ,mst.maker_old_supplier_code
                    ,mst.vendor_pool_mapping_use_flag               
                    ,mst.register_reason                            
                    ,mst.approval_number                            
                    ,mst.local_update_dtm                           
                    ,mst.update_user_id                             
            from
                vpSupplierPopupDtl.Vp_Vendor_Pool_Supplier_Popup_View(
                    p_language_code: 'KO',
                    p_tenant_id: 'L2100',
                    p_company_code: '*'
                ) mst
        ;

}