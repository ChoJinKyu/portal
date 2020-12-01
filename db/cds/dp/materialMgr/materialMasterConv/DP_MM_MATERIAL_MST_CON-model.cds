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
  6. entity : Mm_Material_Mst_Con
  7. entity description : 자재마스터 컨버전
  8. history
  -. 2020.11.20 : 최미희 최초작성
*************************************************/

namespace dp;	
using util from '../../../util/util-model';	

entity Mm_Material_Mst_Con {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key interface_id : Integer64  not null @title: '인터페이스ID' ;	
    batch_id : Integer64  not null @title: '배치ID' ;	
    conv_prog_status_code : String(30)  not null @title: '컨버전진행상태코드' ;	
    conv_error_desc : String(500)   @title: '컨버전오류설명' ;	
    source_system_code : String(30)   @title: '소스시스템코드' ;	
    material_code : String(40)   @title: '자재코드' ;	
    material_type_code : String(10)   @title: '자재유형코드' ;	
    material_description : String(300)   @title: '자재내역' ;	
    material_spec : String(1000)   @title: '자재규격' ;	
    base_uom_code : String(3)   @title: '기준UOM코드' ;	
    material_group_code : String(10)   @title: '자재그룹코드' ;	
    purchasing_uom_code : String(3)   @title: '구매UOM코드' ;	
    variable_po_unit_indicator : String(1)   @title: '가변오더단위지시자' ;
    material_class_code : String(30)   @title: '자재클래스코드' ;	
    commodity_code : String(100)   @title: '커머디티코드' ;	
    maker_part_number : String(40)   @title: '제조자 부품 번호' ;	
    maker_code : String(10)   @title: '제조자번호' ;	
    maker_part_profile_code : String(30)   @title: '제조자부품 프로파일 코드' ;	
    maker_material_code : String(40)   @title: '제조자 자재코드' ;	
    org_type_code : String(2)   @title: '조직유형코드' ;	
    org_code : String(10)   @title: '조직코드' ;	
    material_status_code : String(10)   @title: '자재상태코드' ;	
    purchasing_group_code : String(3)   @title: '구매그룹코드' ;	
    batch_management_flag : Boolean   @title: '배치관리여부' ;	
    automatic_po_allow_flag : Boolean   @title: '자동구매오더허용여부' ;	
    hs_code : String(17)   @title: 'HS코드' ;	
    import_group_code : String(4)   @title: '수입그룹코드' ;	
    user_item_type_code : String(30)   @title: '사용자품목유형코드' ;	
    purchasing_item_flag : Boolean   @title: '구매품목여부' ;	
    purchasing_enable_flag : Boolean   @title: '구매가능여부' ;	
    osp_item_flag : Boolean   @title: '외주가공품목여부' ;	
    buyer_empno : String(30)   @title: '구매담당자사번' ;	
    eng_item_flag : Boolean   @title: '설계품목여부' ;	
    develope_person_empno : String(30)   @title: '개발담당자사번' ;	
    charged_osp_item_flag : Boolean   @title: '유상사급품목여부' ;	
    material_create_status_code : String(30)   @title: '자재생성상태코드' ;	
}	

extend Mm_Material_Mst_Con with util.Managed;