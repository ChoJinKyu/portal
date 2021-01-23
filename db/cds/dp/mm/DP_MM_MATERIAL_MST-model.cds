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
  6. entity : Mm_Material_Mst
  7. entity description : 자재마스터 기본속성
  8. history
  -. 2020.11.25 : 최미희 최초작성
  -. 2021.01.23 : 최미희 필드추가
       - DELETE_MARK
*************************************************/
namespace dp;	
using util from '../../cm/util/util-model';	

entity Mm_Material_Mst {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key material_code : String(40)  not null @title: '자재코드' ;	
    material_type_code : String(10)   @title: '자재유형코드' ;	
    material_desc : String(300)   @title: '자재내역' ;	
    material_spec : String(1000)   @title: '자재규격' ;	
    base_uom_code : String(3)   @title: '기준UOM코드' ;	
    material_group_code : String(10)   @title: '자재그룹코드' ;	
    purchasing_uom_code : String(3)   @title: '구매UOM코드' ;	
    variable_po_unit_indicator : String(1)   @title: '가변오더단위지시자' ;	
    material_class_code : String(30)   @title: '자재클래스코드' ;	
    commodity_code : String(100)   @title: '커머디티코드' ;	
    maker_part_number : String(40)   @title: '제조사 부품 번호' ;	
    maker_code : String(10)   @title: '제조사 코드' ;	
    maker_part_profile_code : String(30)   @title: '제조사 부품 프로파일 코드' ;	
    maker_material_code : String(40)   @title: '제조사 자재코드' ;
    delete_mark : Boolean @title: 'SAP 삭제표시';
}
extend Mm_Material_Mst with util.Managed;
