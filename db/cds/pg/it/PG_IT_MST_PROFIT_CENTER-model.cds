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
  6. entity : It_Mst_Profit_Center
  7. entity description : 손익센터 마스터 업무용 (SAC)
  8. history
  -. 2020.12.23 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity It_Mst_Profit_Center {
    key tenant_id                 : String(5) not null  @title : '테넌트ID';
    key company_code              : String(10) not null @title : '회사코드';
    key org_type_code             : String(30) not null @title : '조직유형코드';
    key org_code                  : String(10) not null @title : '조직코드';
    key prctr_code                : String(30) not null @title : '손익센터코드';
    key effective_end_date        : Date not null       @title : '유효종료일자';
    key mngt_accounting_area_code : String(30) not null @title : '관리회계영역코드';
        prctr_name                : String(30)          @title : '손익센터명';
}

extend It_Mst_Profit_Center with util.Managed;