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
 * 5. namespace : pg
 * 6. entity : Monitor_Mntr_Type_Mngt
 * 7. entity description : 모니터링 시나리오 유형
 * 8. history -. 2020.11.04 : 디포커스 김종현 최초작성
 *
 * * * *
 */
namespace pg;

using util from '../../util/util-model';
using {pg as Monitoring_Type_Management} from '../monitor/PG_MONITOR_MNTR_TYPE_MNGT-model';

entity Monitor_Mntr_Type_Mngt {
    key tenant_id              : String(5)  @title : '테넌트ID';
    key company_code           : String(10) @title : '회사코드';
    key scenario_code          : String(10) @title : '시나리오';
    key type_management_header : Integer64  @title : '유형 관리 Hearder';
    key type_management_item   : Integer64  @title : '유형 관리 Item';
        type                   : String(10) @title : '유형';
        language_code          : String(10) @title : '언어코드';
        type_text              : String(300)@title : '유형 내역';
}

extend Monitor_Mntr_Type_Mngt with util.Managed;