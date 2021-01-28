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
  6. service : supplierMgt
  7. service description : 공급업체 Idea 관리
  8. history
  -. 2020.12.30 : 최미희 최초작성
*************************************************/
// 협력사제안관리
using { dp as Idea } from '../../../../../db/cds/dp/im/DP_IM_SUPPLIER_IDEA-model';
using { dp as Status } from '../../../../../db/cds/dp/im/DP_IM_SUPPLIER_IDEA_STATUS-model';
using { dp as Performance } from '../../../../../db/cds/dp/im/DP_IM_SUPPLIER_IDEA_PERFORMANCE-model';
using { dp as ideaMgtView } from '../../../../../db/cds/dp/im/DP_IM_SUPPLIER_IDEA_LIST_VIEW-model';
// Supplier 
using { sp as Supplier } from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model.cds';
// 공통코드
using { cm as Code } from '../../../../../db/cds/cm/CM_CODE_VIEW-model';
// 사업본부
using { cm as BizUnit } from '../../../../../db/cds/cm/CM_ORG_UNIT-model';
// Employee
using {cm.Hr_Employee as Employee} from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';

// User
using { cm as User }          from '../../../../../db/cds/cm/CM_USER-model';

namespace dp;
@path : '/dp.SupplierIdeaMgtService'

service SupplierIdeaMgtService {

    entity SupplierIdea as projection on Idea.Im_Supplier_Idea;
    entity SupplierPerform as projection on Performance.Im_Supplier_Idea_Performance;
    entity IdeaStatus  as projection on Status.Im_Supplier_Idea_Status;

 
    
    view IdeaMgtView as select from ideaMgtView.Im_Supplier_Idea_List_View;
    
    view IdeaListView as 
    select  key idea.tenant_id,
            key idea.company_code,
            key idea.idea_number,
            idea.idea_title,
            idea.idea_date,
            idea.idea_progress_status_code,
            (select cd.code_name 
             from Code.Code_View cd
             where cd.tenant_id = idea.tenant_id
             and cd.group_code = 'DP_IM_IDEA_PROGRESS_STATUS'
             and cd.code = idea.idea_progress_status_code
             and cd.language_cd = 'KO')  as idea_progress_status_name : String(240),
            idea.supplier_code,
            ssm.supplier_local_name,
            idea.idea_create_user_id,
            '홍길동'   as idea_create_user_local_name : String(240),
            idea.bizunit_code,
            (select bizunit_name
             from BizUnit.Org_Unit out 
             where out.tenant_id = idea.tenant_id
             and out.bizunit_code = idea.bizunit_code
             ) as bizunit_name : String(240) ,
            idea.idea_product_group_code,
            (select cd.code_name 
             from Code.Code_View cd
             where cd.tenant_id = idea.tenant_id
             and cd.group_code = 'DP_IM_IDEA_PRODUCT_GROUP'
             and cd.code = idea.idea_product_group_code
             and cd.language_cd = 'KO') as idea_product_group_name : String(240),
            idea.idea_type_code,
            (select cd.code_name 
             from Code.Code_View cd
             where cd.tenant_id = idea.tenant_id
             and cd.group_code = 'DP_IM_IDEA_TYPE'
             and cd.code = idea.idea_type_code
             and cd.language_cd = 'KO')  as idea_type_name : String(240),
            idea.idea_period_code,
            (select cd.code_name 
             from Code.Code_View cd
             where cd.tenant_id = idea.tenant_id
             and cd.group_code = 'DP_IM_IDEA_PERIOD'
             and cd.code = idea.idea_period_code
             and cd.language_cd = 'KO') as idea_period_name : String(240),
            idea.idea_manager_empno,
            (select user_local_name
            from Employee emp 
            where emp.tenant_id = idea.tenant_id
            and emp.employee_number = idea.idea_manager_empno) as idea_manager_local_name : String(240),
            idea.idea_part_desc,
            idea.current_proposal_contents,
            idea.change_proposal_contents,
            idea.idea_contents,
            idea.attch_group_number,
            idea.material_code,
            idea.purchasing_uom_code,
            idea.monthly_mtlmob_quantity,
            idea.currency_code,
            idea.vi_amount,
            idea.monthly_purchasing_amount,
            idea.annual_purchasing_amount,
            idea.perform_contents,
            idea.color_type_code
    from IdeaMgtView as idea
    inner join Supplier.Sm_Supplier_Mst  ssm 
    on ssm.tenant_id = idea.tenant_id
    and ssm.supplier_code = idea.supplier_code
    ;
      
    view IdeaView as
    select  key isi.tenant_id,
            key isi.company_code,
            key isi.idea_number,
            isi.idea_title,
            isi.idea_date,
            isi.idea_progress_status_code,
            (select cd.code_name 
             from Code.Code_View cd
             where cd.tenant_id = isi.tenant_id
             and cd.group_code = 'DP_IM_IDEA_PROGRESS_STATUS'
             and cd.code = isi.idea_progress_status_code
             and cd.language_cd = 'KO') as idea_progress_status_name : String(240),
            isi.supplier_code,
            ssm.supplier_local_name,
            isi.idea_create_user_id,
            '홍길동'   as idea_create_user_local_name : String(240),
            isi.bizunit_code,
            (select bizunit_name
             from BizUnit.Org_Unit out 
             where out.tenant_id = isi.tenant_id
             and out.bizunit_code = isi.bizunit_code
             ) as bizunit_name : String(240) ,
            isi.idea_product_group_code,
            (select cd.code_name 
             from Code.Code_View cd
             where cd.tenant_id = isi.tenant_id
             and cd.group_code = 'DP_IM_IDEA_PRODUCT_GROUP'
             and cd.code = isi.idea_product_group_code
             and cd.language_cd = 'KO') as idea_product_group_name : String(240),
            isi.idea_type_code,
            (select cd.code_name 
             from Code.Code_View cd
             where cd.tenant_id = isi.tenant_id
             and cd.group_code = 'DP_IM_IDEA_TYPE'
             and cd.code = isi.idea_type_code
             and cd.language_cd = 'KO')  as idea_type_name : String(240),
            isi.idea_period_code,
            (select cd.code_name 
             from Code.Code_View cd
             where cd.tenant_id = isi.tenant_id
             and cd.group_code = 'DP_IM_IDEA_PERIOD'
             and cd.code = isi.idea_period_code
             and cd.language_cd = 'KO') as idea_period_name : String(240),
            isi.idea_manager_empno,
            (select user_local_name
            from Employee emp 
            where emp.tenant_id = isi.tenant_id
            and emp.employee_number = isi.idea_manager_empno) as idea_manager_local_name : String(240),
            isi.idea_part_desc,
            isi.current_proposal_contents,
            isi.change_proposal_contents,
            isi.idea_contents,
            isi.attch_group_number,
            isi.material_code,
            isi.purchasing_uom_code,
            isi.monthly_mtlmob_quantity,
            isi.currency_code,
            isi.vi_amount,
            isi.monthly_purchasing_amount,
            isi.annual_purchasing_amount,
            isi.perform_contents
        from Idea.Im_Supplier_Idea   isi 
        inner join Supplier.Sm_Supplier_Mst  ssm 
        on ssm.tenant_id = isi.tenant_id
        and ssm.supplier_code = isi.supplier_code
        inner join Employee emp 
        on emp.tenant_id = isi.tenant_id
        and emp.employee_number = isi.idea_manager_empno
        ;

            
    view IdeaStatusView as
    select  key sis.tenant_id,
            key sis.company_code,
            key sis.idea_number,
            key sis.status_change_sequence,
            sis.idea_progress_status_code,
            (select cd.code_name
             from Code.Code_View cd
             where cd.tenant_id = sis.tenant_id
             and cd.group_code = 'DP_IM_IDEA_PROGRESS_STATUS'
             and cd.code = sis.idea_progress_status_code
             and cd.language_cd = 'KO'
             ) as idea_progress_status_name: String(240),
            sis.status_change_user_id,
            usr.user_name as status_change_user_name: String(240),
            sis.status_change_date_time,
            sis.status_change_comment
    from Status.Im_Supplier_Idea_Status sis 
    left join User.User usr 
    on usr.tenant_id = sis.tenant_id
    and usr.user_id = sis.status_change_user_id
    ;
}