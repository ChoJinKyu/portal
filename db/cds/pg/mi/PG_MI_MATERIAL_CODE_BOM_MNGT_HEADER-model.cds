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
  6. entity : MI_Material_Code_Bom_Mngt_Header
  7. entity description : 자재별 시황자재 BOM 관리 Header
  8. history
  -. 2020.12.14 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';
using {pg as MI_Mat_Cd_BOM_Mngt_Header} from '../mi/PG_MI_MATERIAL_CODE_BOM_MNGT_HEADER-model';

entity MI_Material_Code_Bom_Mngt_Header {
    key tenant_id          : String(5) not null   @title : '회사코드';
    key material_code      : String(40) not null  @title : '자재코드';
    key supplier_code      : String(15) not null  @title : '공급업체코드';
        base_quantity      : Decimal              @title : '기준수량';
        base_quantity_unit : String(3)            @title : '기준수량단위';
        processing_cost    : Decimal              @title : '가공비';
        pcst_currency_unit : String(30)           @title : '가공비통화단위';
    key mi_bom_id          : String(100) not null @title : '시황자재명세서ID';
}

extend MI_Material_Code_Bom_Mngt_Header with util.Managed;
