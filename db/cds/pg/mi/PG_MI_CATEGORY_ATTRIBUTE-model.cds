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
  6. entity : Category_Attribute
  7. entity description : 시황자재 범주 속성
  8. history
  -. 2020.11.11 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../util/util-model';
using {pg as MI_Categ_Attr} from '../mi/PG_MI_CATEGORY_ATTRIBUTE-model';
using {pg as MI_Categ_Text} from '../mi/PG_MI_CATEGORY_TEXT-model';

entity Category_Attribute {
    key tenant_id       : String(5) not null  @title : '테넌트ID';
    key company_code    : String(10) not null @title : '회사코드';
    key category        : String(10) not null @title : '범주';
        parent_category : String(10)          @title : '상위범주';
        use_flag        : Boolean not null    @title : '사용여부';
}

extend Category_Attribute with util.Managed;
