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
  6. entity : It_Mst_Gl_Account
  7. entity description : GL계정 마스터 업무용 (SAC)
  8. history
  -. 2020.12.23 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity It_Mst_Gl_Account {
    key tenant_id             : String(5) not null  @title : '테넌트ID';
    key company_code          : String(10) not null @title : '회사코드';
    key org_type_code         : String(30) not null @title : '조직유형코드';
    key org_code              : String(10) not null @title : '조직코드';
    key chart_of_account_code : String(6) not null  @title : '계정과목표코드';
    key gl_account_number     : String(15) not null @title : 'GL계정번호';
        gl_account_desc       : String(30)          @title : 'GL계정내역';  
}

extend It_Mst_Gl_Account with util.Managed;