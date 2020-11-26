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
  6. entity : Mm_Uom_Class_Lng
  7. entity description : UOM 클래스(언어)
  8. history
  -. 2020.11.25 : 최미희 최초작성
*************************************************/
namespace dp;	
using util from '../../../util/util-model';  	
using { dp as uomclass } from './DP_MM_UOM_CLASS-model';
	
entity Mm_Uom_Class_Lng {	
  key tenant_id : String(5)  not null @title: 'Tenant ID' ;	
  key uom_class_code : String(10)  not null @title: 'UOM Class Code' ;

    parent: Association to uomclass.Mm_Uom_Class
        on parent.tenant_id = tenant_id 
        and parent.uom_class_code = uom_class_code;

  key language_code : String(4)  not null @title: 'Language' ;	
    uom_class_name : String(20)  not null @title: 'UOM Class Name' ;	
    uom_class_desc : String(50)   @title: 'UOM클래스설명' ;	
}	


extend Mm_Uom_Class_Lng with util.Managed;