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
  6. entity : MI_Category_Hichy_Stru
  7. entity description : Category 계층구조
  8. history
  -. 2020.11.20 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';
using {pg as Categ_Hier_Str} from '../mi/PG_MI_CATEGORY_HICHY_STRU-model';

entity MI_Category_Hichy_Stru {
    key tenant_id            : String(5) not null  @title : '회사코드';
        node_id              : Integer not null    @title : '노드ID';
        hierarchy_level      : Integer             @title : '계층레벨';
    key category_code        : String(40) not null @title : '카테고리코드';
        parent_node_id       : Integer             @title : '상위노드ID';
        parent_category_code : String(40)          @title : '상위카테고리코드';
        sort_sequence        : String              @title : '정렬순서';
        drillstate           : String(10)          @title : '노드상태';
        use_flag             : Boolean not null    @title : '사용여부';
}

extend MI_Category_Hichy_Stru with util.Managed;
