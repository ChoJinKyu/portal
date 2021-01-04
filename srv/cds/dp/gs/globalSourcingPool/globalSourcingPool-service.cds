/************************************************
  1. namespace
  - 모듈코드 소문자로 작성
  - 소모듈 존재시 대모듈.소모듈 로 작성
  2. entity
  - 대문자로 작성
  - 테이블명 생성을 고려하여 '_' 추가
  3. 컬럼(속성)
  - 소문자로 작성
  4. .hdbview, .hdbfunction 등으로 이미 생성된 DB Object 사용시
  entity 위에 @cds.persistence.exists 명시  
  
  5. namespace : db
  6. service : globalSourcingPoolMgt
  7. service description : Global Sourcing Pool 관리 서비스
  8. history
  -. 2020.12.28 : 최미희 최초작성
*************************************************/
using { dp as Category } from '../../../../../db/cds/dp/gs/DP_GS_SOURCING_POOL_CATEGORY-model';
using { dp as Evaluation } from '../../../../../db/cds/dp/gs/DP_GS_SOURCING_POOL_EVALUATION-model';
using { dp as Committee } from '../../../../../db/cds/dp/gs/DP_GS_SOURCING_POOL_COMMITTEE-model';
using { dp as CategoryView } from '../../../../../db/cds/dp/gs/DP_GS_SOURCING_POOL_CATEGORY_VIEW-model';
// Global Sourcing Supplier
using { dp as Supplier } from '../../../../../db/cds/dp/gs/DP_GS_SUPPLIER_GEN-model';
// HR Employee
using { cm as Employee } from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
// 공통코드
using { cm as Code } from '../../../../../db/cds/cm/CM_CODE_VIEW-model';
// Vendor Pool 
using { pg as VendorPool } from '../../../../../db/cds/pg/vp/PG_VP_VENDOR_POOL_EXPORT_MST_VIEW-model';


namespace dp;
@path : '/dp.GlobalSourcingPoolService'

service GlobalSourcingPoolService {

    entity SourcingCategory as projection on Category.Gs_Sourcing_Pool_Category;
    entity SourcingEvaluation as projection on Evaluation.Gs_Sourcing_Pool_Evaluation;
    entity SourcingCommittee as projection on Committee.Gs_Sourcing_Pool_Committee;

    entity SourcingPoolCategoryView @(title : 'Global Sourcing Pool Category View') as projection on CategoryView.Gs_Sourcing_Pool_Category_View;
    
    view SourcingPoolEvaluationView as
    select key evl.tenant_id,
           key evl.sourcing_supplier_nickname,
           key evl.company_code,
           key evl.org_type_code,
           key evl.org_code,
           key evl.evaluation_sequence,
           evl.evaluation_date,
           evl.evaluation_person_empno,
           emp.user_local_name  as evaluation_person_empname : String(240),
           evl.price_score,
           evl.financial_score,
           evl.technical_score,
           evl.quality_score,
           evl.evaluation_score,
           evl.sourcing_evaluation_result_code,
           cd.code_name   as sourcing_evaluation_result_name : String(240),
           evl.attch_group_number 
    from  Evaluation.Gs_Sourcing_Pool_Evaluation evl 
    left join Employee.Hr_Employee  emp
    on emp.tenant_id = evl.tenant_id
    and emp.employee_number = evl.evaluation_person_empno
    left outer join Code.Code_View cd
    on cd.tenant_id = evl.tenant_id
    and cd.group_code = 'DP_GS_EVALUATION_RESULT'
    and cd.code = evl.sourcing_evaluation_result_code
    and cd.language_cd = 'KO'
    ;

    view SourcingPoolCommitteeView as
    select key com.tenant_id,
           key com.sourcing_supplier_nickname,
           key com.company_code,
           key com.org_type_code,
           key com.org_code,
           key com.evaluation_sequence,
           com.progress_date,
           com.attendants_desc, 
           com.committee_result_code,
           cd.code_name   as committee_result_name : String(240),
           com.remark,
           com.attch_group_number
    from Committee.Gs_Sourcing_Pool_Committee com 
    left outer join Code.Code_View cd
    on cd.tenant_id = com.tenant_id
    and cd.group_code = 'DP_GS_COMMITTEE_RESULT'
    and cd.code = com.committee_result_code
    and cd.language_cd = 'KO'
    ;
    

    view SourcingPoolAllView as
    select key gsg.tenant_id,
           key gsg.sourcing_supplier_nickname,
           gsg.develop_date,
           gsg.developer_empno,
           emp.user_local_name  as developer_empname : String(240),
           cat.company_code,
           cat.org_type_code,
           cat.org_code,
           cat.vendor_pool_code,
           vp.operation_unit_code,
           vp.vendor_pool_local_name,
           vp.vendor_pool_english_name,
           vp.vendor_pool_display_name,
           vp.vendor_pool_level1_code,
           vp.vendor_pool_level1_name,
           vp.vendor_pool_level2_code,
           vp.vendor_pool_level2_name,
           vp.vendor_pool_level3_code,
           vp.vendor_pool_level3_name,
           vp.vendor_pool_level4_code,
           vp.vendor_pool_level4_name,
           vp.vendor_pool_level5_code,
           vp.vendor_pool_level5_name,
           cat.child_part_desc,
           evl.evaluation_sequence,
           evl.evaluation_date,
           evl.evaluation_person_empno,
           emp1.user_local_name  as evaluation_person_empname : String(240),
           evl.price_score,
           evl.financial_score,
           evl.technical_score,
           evl.quality_score,
           evl.evaluation_score,
           evl.sourcing_evaluation_result_code,
           cd1.code_name as sourcing_evaluation_result_name : String(240),
           evl.attch_group_number   as evalu_attch_group_number : String(100),
           com.progress_date,
           com.attendants_desc, 
           com.committee_result_code,
           cd2.code_name   as committee_result_name : String(240),
           com.remark,
           com.attch_group_number  as commit_attch_group_number : String(100)
    from Supplier.Gs_Supplier_Gen gsg
    left join Employee.Hr_Employee  emp
    on emp.tenant_id = gsg.tenant_id
    and emp.employee_number = gsg.developer_empno
    left outer join Category.Gs_Sourcing_Pool_Category cat
    on cat.tenant_id = gsg.tenant_id
    and cat.sourcing_supplier_nickname = gsg.sourcing_supplier_nickname
    left outer join VendorPool.Vp_Vendor_Pool_Export_Mst_View vp
    on vp.tenant_id = cat.tenant_id
    and vp.vendor_pool_code = cat.vendor_pool_code
    and vp.company_code = cat.company_code
    and vp.org_type_code = cat.org_type_code
    and vp.org_code = cat.org_code
    left outer join Evaluation.Gs_Sourcing_Pool_Evaluation evl 
    on evl.tenant_id = cat.tenant_id
    and evl.sourcing_supplier_nickname = cat.sourcing_supplier_nickname
    and evl.company_code = cat.company_code
    and evl.org_type_code = cat.org_type_code
    and evl.org_code = cat.org_code
    left join Employee.Hr_Employee  emp1
    on emp1.tenant_id = evl.tenant_id
    and emp1.employee_number = evl.evaluation_person_empno
    left outer join Code.Code_View cd1
    on cd1.tenant_id = evl.tenant_id
    and cd1.group_code = 'DP_GS_EVALUATION_RESULT'
    and cd1.code = evl.sourcing_evaluation_result_code
    and cd1.language_cd = 'KO'
    left outer join Committee.Gs_Sourcing_Pool_Committee com
    on com.tenant_id = evl.tenant_id
    and com.sourcing_supplier_nickname = evl.sourcing_supplier_nickname
    and com.company_code = evl.company_code
    and com.org_type_code = evl.org_type_code
    and com.org_code = evl.org_code
    and com.evaluation_sequence = evl.evaluation_sequence
    left outer join Code.Code_View cd2
    on cd2.tenant_id = com.tenant_id
    and cd2.group_code = 'DP_GS_COMMITTEE_RESULT'
    and cd2.code = com.committee_result_code
    and cd2.language_cd = 'KO'
    ;
    
}
