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
  6. entity : MI_Material_Price_Management
  7. entity description : 시황자재 가격관리
  8. history
  -. 2020.11.11 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../util/util-model';
using {pg as MI_Mat_Code_Attr} from '../mi/PG_MI_MATERIAL_PRICE_MANAGEMENT-model';

entity MI_Material_Price_Management {
    key tenant_id          : String(5) not null  @title : '테넌트ID';
    key company_code       : String(10) not null @title : '회사코드';
    key mi_material_code   : String(10) not null @title : '시황자재코드';
    key category           : String(10) not null @title : '범주';
        use_flag           : Boolean not null    @title : '사용여부';
        mi_management_unit : String(5)           @title : '시황관리단위';
        exchange           : String(10)          @title : '거래소';
        currency_unit      : String(30)          @title : '통화단위';
        quantity_unit      : String(10)          @title : '수량단위';
        exchange_unit      : String(40)          @title : '거래소단위';
        terms              : String(10)          @title : '인도조건';
        sourcing_group     : String(10)          @title : '소싱그룹';
        delivery_month     : String(6)           @title : '인도월';
        mi_date            : Date                @title : '시황일자';
        amount             : Decimal(17, 3)      @title : '금액';

}

extend MI_Material_Price_Management with util.Managed;
