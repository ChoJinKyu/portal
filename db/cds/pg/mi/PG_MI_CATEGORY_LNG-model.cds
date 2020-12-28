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
  6. entity : MI_Category_Lng
  7. entity description : 범주 내역
  8. history
  -. 2020.11.16 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';
using {pg as Categ_Text} from '../mi/PG_MI_CATEGORY_LNG-model';
using {pg as Categ_Code} from './PG_MI_CATEGORY_HICHY_STRU-model';

entity MI_Category_Lng {
  key tenant_id      : String(5) not null  @title : '회사코드';
  key category_code  : String(40) not null @title : '카테고리코드';

      category_codes : Association to Categ_Code.MI_Category_Hichy_Stru
                         on  category_codes.tenant_id     = tenant_id
                         and category_codes.category_code = category_code;

  key language_code  : String(4) not null  @title : '언어코드';
      category_name  : String(240)         @title : '카테고리명';
}

extend MI_Category_Lng with util.Managed;
