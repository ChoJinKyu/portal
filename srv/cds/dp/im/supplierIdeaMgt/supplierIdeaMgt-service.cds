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
using { dp as Performance } from '../../../../../db/cds/dp/im/DP_IM_SUPPLIER_IDEA_PERFORMANCE-model';
// Supplier 
using { sp as Supplier } from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model.cds';
// 공통코드
using { cm as Code } from '../../../../../db/cds/cm/CM_CODE_VIEW-model';
// 사업본부
using { cm as BizUnit } from '../../../../../db/cds/cm/CM_ORG_UNIT-model';
// Employee
using {cm.Hr_Employee as Employee} from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';

namespace dp;
@path : '/dp.SupplierIdeaMgtService'

service SupplierIdeaMgtService {

    entity SupplierIdea as projection on Idea.Im_Supplier_Idea;
    entity SupplierPerform as projection on Performance.Im_Supplier_Idea_Performance;
 
    @readonly
    view IdeaListView as
    select  key isi.tenant_id,
            key isi.company_code,
            key isi.idea_number,
            isi.idea_title,
            isi.idea_progress_status_code,
            cd3.code_name as idea_progress_status_name : String(240),
            isi.supplier_code,
            ssm.supplier_local_name,
            isi.idea_create_user_id,
            '홍길동'   as idea_create_user_local_name : String(240),
            isi.bizunit_code,
            out.bizunit_name,
            isi.idea_product_group_code,
            cd2.code_name as idea_product_group_name : String(240),
            isi.idea_type_code,
            cd1.code_name  as idea_type_name : String(240),
            isi.idea_period_code,
            cd4.code_name as idea_period_name : String(240),
            isi.idea_manager_empno,
            emp.user_local_name as idea_manager_local_name : String(240),
            isi.idea_part_desc,
            isi.current_proposal_contents,
            isi.change_proposal_contents,
            isi.idea_contents,
            isi.attch_group_number,
            isp.material_code,
            isp.purchasing_uom_code,
            isp.monthly_mtlmob_quantity,
            isp.currency_code,
            isp.vi_amount,
            isp.monthly_purchasing_amount,
            isp.annual_purchasing_amount,
            isp.perform_contents
    from Idea.Im_Supplier_Idea   isi 
    inner join Supplier.Sm_Supplier_Mst  ssm 
    on ssm.tenant_id = isi.tenant_id
    and ssm.supplier_code = isi.supplier_code
    inner join Employee emp 
    on emp.tenant_id = isi.tenant_id
    and emp.employee_number = isi.idea_manager_empno
    left outer join Performance.Im_Supplier_Idea_Performance isp 
    on isp.tenant_id = isi.tenant_id
    and isp.company_code = isi.company_code
    and isp.idea_number = isi.idea_number  
    left outer join BizUnit.Org_Unit out 
    on out.tenant_id = isi.tenant_id
    and out.bizunit_code = isi.bizunit_code
    left outer join Code.Code_View cd1
    on cd1.tenant_id = isi.tenant_id
    and cd1.group_code = 'DP_IM_IDEA_TYPE'
    and cd1.code = isi.idea_type_code
    and cd1.language_cd = 'KO'
    left outer join Code.Code_View cd2
    on cd1.tenant_id = isi.tenant_id
    and cd1.group_code = 'DP_IM_IDEA_PRODUCT_GROUP'
    and cd1.code = isi.idea_product_group_code
    and cd1.language_cd = 'KO'
    left outer join Code.Code_View cd3
    on cd1.tenant_id = isi.tenant_id
    and cd1.group_code = 'DP_IM_IDEA_PROGRESS_STATUS'
    and cd1.code = isi.idea_progress_status_code
    and cd1.language_cd = 'KO'
    left outer join Code.Code_View cd4
    on cd1.tenant_id = isi.tenant_id
    and cd1.group_code = 'DP_IM_IDEA_PERIOD'
    and cd1.code = isi.idea_period_code
    and cd1.language_cd = 'KO'
    ;   
  
    view IdeaView as
    select  key isi.tenant_id,
            key isi.company_code,
            key isi.idea_number,
            isi.idea_title,
            isi.idea_progress_status_code,
            cd3.code_name as idea_progress_status_name : String(240),
            isi.supplier_code,
            ssm.supplier_local_name,
            isi.idea_create_user_id,
            '홍길동'   as idea_create_user_local_name : String(240),
            isi.bizunit_code,
            out.bizunit_name,
            isi.idea_product_group_code,
            cd2.code_name as idea_product_group_name : String(240),
            isi.idea_type_code,
            cd1.code_name  as idea_type_name : String(240),
            isi.idea_period_code,
            cd4.code_name as idea_period_name : String(240),
            isi.idea_manager_empno,
            emp.user_local_name as idea_manager_local_name : String(240),
            isi.idea_part_desc,
            isi.current_proposal_contents,
            isi.change_proposal_contents,
            isi.idea_contents,
            isi.attch_group_number,
            isp.material_code,
            isp.purchasing_uom_code,
            isp.monthly_mtlmob_quantity,
            isp.currency_code,
            isp.vi_amount,
            isp.monthly_purchasing_amount,
            isp.annual_purchasing_amount,
            isp.perform_contents
        from Idea.Im_Supplier_Idea   isi 
        inner join Supplier.Sm_Supplier_Mst  ssm 
        on ssm.tenant_id = isi.tenant_id
        and ssm.supplier_code = isi.supplier_code
        inner join Employee emp 
        on emp.tenant_id = isi.tenant_id
        and emp.employee_number = isi.idea_manager_empno
        left outer join Performance.Im_Supplier_Idea_Performance isp 
        on isp.tenant_id = isi.tenant_id
        and isp.company_code = isi.company_code
        and isp.idea_number = isi.idea_number  
        left outer join BizUnit.Org_Unit out 
        on out.tenant_id = isi.tenant_id
        and out.bizunit_code = isi.bizunit_code
        left outer join Code.Code_View cd1
        on cd1.tenant_id = isi.tenant_id
        and cd1.group_code = 'DP_IM_IDEA_TYPE'
        and cd1.code = isi.idea_type_code
        and cd1.language_cd = 'KO'
        left outer join Code.Code_View cd2
        on cd1.tenant_id = isi.tenant_id
        and cd1.group_code = 'DP_IM_IDEA_PRODUCT_GROUP'
        and cd1.code = isi.idea_product_group_code
        and cd1.language_cd = 'KO'
        left outer join Code.Code_View cd3
        on cd1.tenant_id = isi.tenant_id
        and cd1.group_code = 'DP_IM_IDEA_PROGRESS_STATUS'
        and cd1.code = isi.idea_progress_status_code
        and cd1.language_cd = 'KO'
        left outer join Code.Code_View cd4
        on cd1.tenant_id = isi.tenant_id
        and cd1.group_code = 'DP_IM_IDEA_PERIOD'
        and cd1.code = isi.idea_period_code
        and cd1.language_cd = 'KO'
    ;   
}
