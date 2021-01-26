/**
 * * * *
 *
 * 1. namespace
 *
 * - 모듈코드 소문자로 작성
 * - 소모듈 존재시 대모듈.소모듈 로 작성
 *
 * 2. entity
 *
 * - 대문자로 작성
 * - 테이블명 생성을 고려하여 '\_' 추가
 *
 * 3. 컬럼(속성)
 *
 * - 소문자로 작성
 *
 * 4. .hdbview, .hdbfunction 등으로 이미 생성된 DB Object 사용시 entity 위에
 *    @cds.persistence.exists 명시
 * 5. namespace : dp
 * 6. entity : Tc_Mcst_Project_Part_Map_Mst
 * 7. entity description : 재료비의 프로젝트 Part Mapping Master
 * 8. history -. 2020.12.08 : 정정호 최초작성
 *
 * * * *
 */
namespace dp;

using {User} from '@sap/cds/common';
using util from '../../cm/util/util-model';
using {dp as Mcst_Project_Part_Map_Mst} from './DP_TC_MCST_PROJECT_PART_MAP_MST-model';
using {dp as Mcst_Project_Part_Map_Dtl} from './DP_TC_MCST_PROJECT_PART_MAP_DTL-model';
using {cm as hrEmp} from '../../cm/CM_HR_EMPLOYEE-model';

entity Tc_Mcst_Project_Part_Map_Mst {
    key tenant_id            : String(5) not null @title : '테넌트ID';
    key mapping_id           : Integer not null   @title : '매핑ID';
        department_type_code : String(30)         @title : '부서유형코드';
        creator_empno        : String(30)         @title : '생성자사번';
        eng_change_number    : String(30)         @title : '설계변경번호';
        change_reason        : String(1000)       @title : '변경사유';

        mappping_dtl         : Composition of many Mcst_Project_Part_Map_Dtl.Tc_Mcst_Project_Part_Map_Dtl
                                   on mappping_dtl.tenant_id = tenant_id
                                   and mappping_dtl.mapping_id = mapping_id;

        creator_person_info  : Association to hrEmp.Hr_Employee
                                   on creator_person_info.tenant_id = tenant_id
                                   and creator_person_info.employee_number = creator_empno; //담당자
}

extend Tc_Mcst_Project_Part_Map_Mst with util.Managed;
