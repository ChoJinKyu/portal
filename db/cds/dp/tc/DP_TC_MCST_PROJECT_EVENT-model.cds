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
 * 6. entity : Tc_Project_Event
 * 7. entity description : 재료비의 프로젝트 개발 Event 단계
 * 8. history -. 2020.12.08 : 정정호 최초작성
 *
 * * * *
 */
namespace dp;

using {User} from '@sap/cds/common';
using util from '../../cm/util/util-model';
using {dp as Mcst_Project} from './DP_TC_MCST_PROJECT-model';


entity Tc_Mcst_Project_Event {
    key tenant_id           : String(5) not null  @title : '테넌트ID';
    key project_code        : String(30) not null @title : '프로젝트코드';
    key model_code          : String(40) not null @title : '모델코드';
    key version_number      : String(30) not null @title : '버전번호';
    key develope_event_code : String(30) not null @title : '개발이벤트코드';
        start_date          : Date                @title : '시작일자';
        end_date            : Date                @title : '종료일자';
        sequence            : String              @title : '순서';
/*
        mcst_event_ref      : Association[1.. * ] to Mcst_Project.Tc_Mcst_Project
                                  on  mcst_event_ref.tenant_id      = tenant_id
                                  and mcst_event_ref.project_code   = project_code
                                  and mcst_event_ref.model_code     = model_code
                                  and mcst_event_ref.version_number = version_number;
*/
}

extend Tc_Mcst_Project_Event with util.Managed;
