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
  -. 2021.02.24 : 디포커스 최상호 수정
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';
using {pg as MI_Code_Attr} from '../mi/PG_MI_MATERIAL_CODE-model';
using {pg as Categ_Code} from './PG_MI_CATEGORY_HICHY_STRU-model';

entity MI_Material_Code {
    key tenant_id        : String(5) not null  @title : '회사코드';
    key mi_material_code : String(40) not null @title : '시황자재코드';
        category_code    : String(40) not null @title : '카테고리코드';

        category_codes   : Association to Categ_Code.MI_Category_Hichy_Stru
                               on category_codes.tenant_id = tenant_id
                               and category_codes.category_code = category_code;

        use_flag         : Boolean not null    @title : '사용여부';
}

extend MI_Material_Code with util.Managed;
