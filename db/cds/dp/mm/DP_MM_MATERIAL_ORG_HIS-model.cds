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
  6. entity : Mm_Material_Org_His
  7. entity description : 자재마스터 조직속성 이력
  8. history
  -. 2020.11.25 : 최미희 최초작성
*************************************************/
namespace dp;	
using util from '../../cm/util/util-model';	

entity Mm_Material_Org_His {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;
  key material_code : String(40)  not null @title: '자재코드' ;	
  key company_code : String(10)  not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key history_sequence : Integer  not null @title: '이력순번' ;	
    material_status_code : String(10)   @title: '자재상태코드' ;	
    purchasing_group_code : String(3)   @title: '구매그룹코드' ;	
    batch_management_flag : Boolean default FALSE  @title: '배치관리여부' ;	
    automatic_po_allow_flag : Boolean default FALSE  @title: '자동구매오더허용여부' ;	
    hs_code : String(17)   @title: 'HS코드' ;	
    import_group_code : String(4)   @title: '수입그룹코드' ;	
    user_item_type_code : String(30)   @title: '사용자품목유형코드' ;	
    purchasing_item_flag : Boolean default FALSE  @title: '구매품목여부' ;	
    purchasing_enable_flag : Boolean default FALSE  @title: '구매가능여부' ;	
    osp_item_flag : Boolean default FALSE  @title: '외주가공품여부' ;	
    buyer_empno : String(30)   @title: '구매담당자사번' ;	
    eng_item_flag : Boolean default FALSE  @title: '설계품목여부' ;	
}

extend Mm_Material_Org_His with util.Managed;