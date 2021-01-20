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
 * 6. entity : Tc_Mcst_Project_Addition_Info
 * 7. entity description : 재료비의 프로젝트 추가 정보(물동/판가/가공비/판관비)
 * 8. history -. 2020.12.08 :정우준 global temporary test
 *
 * * * *
 */

namespace dp;

@Catalog.tableType : #GLOBAL_TEMPORARY
entity Tc_Gt_Pjt_Addition_Info {
    tenant_id            : String(5)   @title : '테넌트ID';
    project_code         : String(30)  @title : '프로젝트코드';
    model_code           : String(40)  @title : '모델코드';
    version_number       : String(30)  @title : '버전번호';
    addition_type_code   : String(30)  @title : '추가유형코드';
    period_code          : String(30)  @title : '기간코드';
    addition_type_value  : String(10)  @title : '추가유형값';
}