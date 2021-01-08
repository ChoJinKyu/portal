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
  6. service : supplierIdeaBasicDataMgt
  7. service description : 공급업체 Idea 기본정보 
  8. history
  -. 2021.01.07 : 최미희 최초작성
*************************************************/
// 협력사제안관리
using { dp as Role } from '../../../../../db/cds/dp/im/DP_IM_SUPPLIER_IDEA_ROLE_ASSIGN-model';

// 공통코드
using { cm as Code } from '../../../../../db/cds/cm/CM_CODE_VIEW-model';
// 사업본부
using { cm as BizUnit } from '../../../../../db/cds/cm/CM_ORG_UNIT-model';
// Employee
using {cm as Employee} from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';

namespace dp;
@path : '/dp.SupplierIdeaBasicDataMgtService'

service SupplierIdeaBasicDataMgtService {

    entity RoleAssign as projection on Role.Im_Supplier_Idea_Role_Assign;

    @readonly
    view RoleAssignView as
    select  key sir.tenant_id,
            key sir.company_code,
            key sir.idea_role_code,
            key sir.role_person_empno,
            emp.user_local_name as role_person_empname: String(240),
            cd1.code_name as idea_role_name: String(240),
            sir.bizunit_code,
            biz.bizunit_name,
            sir.idea_product_group_code,
            cd2.code_name as idea_product_group_name: String(240),
            sir.effective_start_date,
            sir.effective_end_date
    from Role.Im_Supplier_Idea_Role_Assign sir 
    left join Employee.Hr_Employee emp 
    on emp.tenant_id = sir.tenant_id
    and emp.employee_number = sir.role_person_empno
    left join BizUnit.Org_Unit biz   
    on biz.tenant_id = sir.tenant_id
    and biz.bizunit_code = sir.bizunit_code
    left join Code.Code_View cd1
    on cd1.tenant_id = sir.tenant_id
    and cd1.group_code = 'DP_IM_IDEA_ROLE'
    and cd1.code = sir.idea_role_code
    and cd1.language_cd = 'KO'
    left join Code.Code_View cd2 
    on cd2.tenant_id = sir.tenant_id
    and cd2.group_code = 'DP_IM_IDEA_ROLE'
    and cd2.code = sir.idea_product_group_code
    and cd2.language_cd = 'KO'
    ;

}