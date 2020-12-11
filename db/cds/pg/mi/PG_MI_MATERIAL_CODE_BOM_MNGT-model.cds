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
  6. entity : MI_Material_Code_Bom_Mngt
  7. entity description : 자재별 시황자재 BOM 관리
  8. history
  -. 2020.11.04 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';
using {pg as MI_Mat_Cd_BOM_Mngt} from '../mi/PG_MI_MATERIAL_CODE_BOM_MNGT-model';

entity MI_Material_Code_Bom_Mngt {
    key tenant_id             : String(5) not null  @title : '회사코드';
    key company_code          : String(10) not null @title : '법인코드';
    key org_type_code         : String(30) not null @title : '조직유형코드';
    key org_code              : String(10) not null @title : '조직코드';
    key material_code         : String(40) not null @title : '자재코드';
        material_desc         : String(300)         @title : '자재내역';
    key supplier_code         : String(15) not null @title : '공급업체코드';
        supplier_local_name   : String(240)         @title : '공급업체로컬명';
        supplier_english_name : String(240)         @title : '공급업체영문명';
        base_quantity         : Decimal             @title : '기준수량';
        processing_cost       : Decimal             @title : '가공비';
        pcst_currency_unit    : String(30)          @title : '가공비통화단위';
    key mi_material_code      : String(40) not null @title : '시황자재코드';

        mi_material_codes     : Association to pg.MI_Material_Code
                                    on  mi_material_codes.tenant_id        = tenant_id
                                    and mi_material_codes.company_code     = company_code
                                    and mi_material_codes.org_type_code    = org_type_code
                                    and mi_material_codes.org_code         = org_code
                                    and mi_material_codes.mi_material_code = mi_material_code;

        mi_material_name      : String(240)         @title : '시황자재명';
        category_code         : String(40)          @title : '카테고리코드';

        category_codes        : Association to pg.MI_Category_Hichy_Stru
                                    on  category_codes.tenant_id     = tenant_id
                                    and category_codes.company_code  = company_code
                                    and category_codes.org_type_code = org_type_code
                                    and category_codes.org_code      = org_code
                                    and category_codes.category_code = category_code;

        category_name         : String(240)         @title : '카테고리명';
        reqm_quantity_unit    : String(3)           @title : '소요수량단위';
        reqm_quantity         : Decimal             @title : '소요수량';
        currency_unit         : String(30)          @title : '통화단위';
        mi_base_reqm_quantity : Decimal             @title : '시황기준소요수량';
        quantity_unit         : String(3)           @title : '수량단위';
        exchange              : String(10)          @title : '거래소';
        termsdelv             : String(10)          @title : '인도조건';
        use_flag              : Boolean not null    @title : '사용여부';
}

extend MI_Material_Code_Bom_Mngt with util.Managed;
