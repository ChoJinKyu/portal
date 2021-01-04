/************************************************
  1. namespace
  - 모듈코드 소문자로 작성
  - 소모듈 존재시 대모듈.소모듈 로 작성
  2. entity
  - 대문자로 작성
  - 테이블명 생성을 고려하여 '_' 추가
  3. 컬럼(속성)
  - 소문자로 작성
  4. .hdbview, .hdbfunction 등으로 이미 생성된 DB Object 사용시
  entity 위에 @cds.persistence.exists 명시  
  
  5. namespace : db
  6. entity : Mm_Material_Val
  7. entity description : 자재마스터 평가속성 
  8. history
  -. 2020.11.25 : 최미희 최초작성
*************************************************/
namespace dp;	
using util from '../../cm/util/util-model';	
using { dp as MtlMst } from './DP_MM_MATERIAL_MST-model';

entity Mm_Material_Val {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key material_code : String(40)  not null @title: '자재코드' ;

    parent: Association to MtlMst.Mm_Material_Mst
        on parent.tenant_id = tenant_id 
        and parent.material_code = material_code;

  key company_code : String(10)  not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key valuation_area_code : String(30)  not null @title: '평가영역코드' ;	
  key valuation_class_code : String(30)  not null @title: '평가클래스코드' ;
    valuation_type_code : String(30)   @title: '평가유형코드' ;	
    material_price_unit : Decimal(5,0)   @title: '가격단위' ;	
    moving_average_price : Decimal   @title: '이동평균가격' ;	
    standard_price : Decimal   @title: '표준가격' ;	
}

extend Mm_Material_Val with util.Managed;