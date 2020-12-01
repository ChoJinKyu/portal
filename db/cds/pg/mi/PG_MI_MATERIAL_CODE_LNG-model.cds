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
  6. entity : MI_Material_Code_Lng
  7. entity description : 시황자재코드 내역
  8. history
  -. 2020.11.16 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';
using {pg as MI_Code_Text} from '../mi/PG_MI_MATERIAL_CODE_LNG-model';

entity MI_Material_Code_Lng {
    key tenant_id             : String(5) not null  @title : '회사코드';
    key company_code          : String(10) not null @title : '법인코드';
    key org_type_code         : String(30) not null @title : '조직유형코드';
    key org_code              : String(10) not null @title : '조직코드';
    key mi_material_code      : String(40) not null @title : '시황자재코드';
    key language_code         : String(4) not null  @title : '언어코드';
        mi_material_code_name : String(240)         @title : '시황자재코드명';
}

extend MI_Material_Code_Lng with util.Managed;
