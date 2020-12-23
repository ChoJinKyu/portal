/************************************************
  1. namespace
  - 모듈코드 소문자로 작성
  - 소모듈 존재시 대모듈.소모듈 로 작성
  2. entity
  - 대문자로 작성
  - 테이블명 생성을 고려하여 '_' 추가
  3. 컬럼(속성)
  - 소문자로 작성
  4. .hdbview, .hdbfunction 등으로 이미 생성된 DB Object 사용시 entity 위에 @cds.persistence.exists 명시    
  5. namespace : pg
  6. entity : It_Mst_St_Loc
  7. entity description : 저장위치 마스터 업무용 (SAC)
  8. history
  -. 2020.12.23 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity It_Mst_St_Loc {
    key tenant_id     : String(5) not null  @title : '테넌트ID';
    key company_code  : String(10) not null @title : '회사코드';
    key org_type_code : String(30) not null @title : '조직유형코드';
    key org_code      : String(10) not null @title : '조직코드';
    key plant_code    : String(6) not null  @title : '플랜트코드';
    key sl_code       : String(6) not null  @title : '저장위치코드';
        sl_name       : String(24)          @title : '저장위치명';
}

extend It_Mst_St_Loc with util.Managed;