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
  6. entity : Mm_Material_Class_Con
  7. entity description : 자재클래스 컨버전
  8. history
  -. 2021.01.22 : 최미희 최초작성
*************************************************/
namespace dp;	
using util from '../../cm/util/util-model';	

entity Mm_Material_Class_Con {	
  key tenant_id : String(5)  not null @title: 'Tenant ID' ;	
  key interface_id : Integer64  not null @title: '인터페이스ID' ;	
    group_id : Integer64  not null @title: '그룹ID' ;	
    conv_prog_status_code : String(30)  not null @title: '컨버전진행상태코드' ;	
    conv_error_desc : String(500)   @title: '컨버전오류설명' ;	
    source_system_code : String(30)   @title: '소스시스템코드' ;	
    material_class_code : String(40)   @title: '자재클래스코드' ;	
    language_code : String(4)   @title: '언어코드' ;	
    material_class_name : String(100)   @title: '자재클래스명' ;	
    material_class_desc : String(1000)   @title: '자재클래스 설명' ;	
    use_flag : Boolean @title: '사용여부';
}

extend Mm_Material_Class_Con with util.Managed;