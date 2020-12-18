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
  6. entity : MI_Material_Code_Bom_Mngt_Item
  7. entity description : 자재별 시황자재 BOM 관리 Item
  8. history
  -. 2020.12.14 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';
using {pg as MI_Mat_Cd_BOM_Mngt_Item} from '../mi/PG_MI_MATERIAL_CODE_BOM_MNGT_ITEM-model';

entity MI_Material_Code_Bom_Mngt_Item {
    key tenant_id          : String(5) not null   @title : '회사코드';
    key mi_bom_id          : String(100) not null @title : '시황자재명세서ID';
    key mi_material_code   : String(40) not null  @title : '시황자재코드';
        reqm_quantity_unit : String(3)            @title : '소요수량단위';
        reqm_quantity      : Decimal              @title : '소요수량';
    key currency_unit      : String(30)           @title : '통화단위';
    key quantity_unit      : String(3)            @title : '수량단위';
    key exchange           : String(10)           @title : '거래소';
    key termsdelv          : String(10)           @title : '인도조건';
        use_flag           : Boolean not null     @title : '사용여부';
}

extend MI_Material_Code_Bom_Mngt_Item with util.Managed;
