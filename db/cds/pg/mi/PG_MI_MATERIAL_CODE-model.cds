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
  6. entity : MI_Material_Code
  7. entity description : 시황자재코드 속성
  8. history
  -. 2020.11.16 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../util/util-model';
using {pg as MI_Code_Attr} from '../mi/PG_MI_MATERIAL_CODE-model';

entity MI_Material_Code {
    key tenant_id        : String(5) not null  @title : '회사코드';
    key company_code     : String(10) not null @title : '법인코드';
    key org_type_code    : String(30) not null @title : '조직유형코드';
    key org_code         : String(10) not null @title : '조직코드';
    key mi_material_code : String(40) not null @title : '시황자재코드';
    key category_code    : String(40) not null @title : '카테고리코드';
        use_flag         : Boolean not null    @title : '사용여부';
}

extend MI_Material_Code with util.Managed;
