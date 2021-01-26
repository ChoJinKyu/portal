/*******************************************************************
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
  6. entity : Mm_Unit_Of_Measure_Lng
  7. entity description : UOM(언어)
  8. history
  -. 2020.11.25 : 최미희 최초작성
  -. 2021.01.26 : 최미희 컬럼 추가(system_uom_code, system_uom_name)
**********************************************************************/
namespace dp;
using util from '../../cm/util/util-model'; 
using { dp as Uom } from './DP_MM_UNIT_OF_MEASURE-model';	
	
entity Mm_Unit_Of_Measure_Lng {	
  key tenant_id : String(5)  not null @title: 'Tenant ID' ;	
  key uom_code : String(5)  not null @title: 'UOM코드(SAP:Commercial UOM, Oracle:UOM)' ;

      parent: Association to Uom.Mm_Unit_Of_Measure
        on parent.tenant_id = tenant_id 
        and parent.uom_code = uom_code;

  key language_code : String(4)  not null @title: 'Language' ;	
    uom_name : String(30)  @title: 'UOM명(SAP:Commercial UOM, Oracle:UOM)' ;	
    uom_desc : String(50)  @title: 'UOM설명' ;	  
    system_uom_code : String(3) @title: 'SAP UOM Code';
    system_uom_name : String(30) @title: 'SAP UOM Name';  	
    commercial_uom_code : String(5)  @title: '상업UOM코드' ;	
    technical_uom_code : String(6)   @title: '기술UOM코드' ;	
    commercial_uom_name : String(30)   @title: '상업UOM명' ;	
    technical_uom_name : String(30)   @title: '기술UOM명' ;	
}	

extend Mm_Unit_Of_Measure_Lng with util.Managed;