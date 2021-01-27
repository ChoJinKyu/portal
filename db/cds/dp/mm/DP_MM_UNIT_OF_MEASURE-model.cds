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
  6. entity : Mm_Uom_Class
  7. entity description : UOM 클래스
  8. history
  -. 2020.11.25 : 최미희 최초작성
  -. 2021.01.26 : 최미희 컬럼 추가(system_uom_code, system_uom_name)
*************************************************/
namespace dp;	
using util from '../../cm/util/util-model'; 	
	
entity Mm_Unit_Of_Measure {	
  key tenant_id : String(5)  not null @title: 'Tenant ID' ;	
  key uom_code : String(5)  not null @title: 'UOM코드(SAP:Commercial UOM, Oracle:UOM)' ;	
    uom_name : String(30)   @title: 'UOM명(SAP:Commercial UOM, Oracle:UOM)' ;	
    base_unit_flag : Boolean  not null @title: '기본단위여부' ;	
    uom_class_code : String(10)   @title: 'UOM Class Code' ;	
    uom_desc : String(50)   @title: 'UOM설명' ;	
    disable_date : Date   @title: '불가일자' ;    
    decimal_places : Decimal(10,0)   @title: '소수자리수' ;	
    floating_decpoint_index : Decimal(10,0)   @title: '부동소수점지수' ;	
    conversion_numerator : Decimal(10,0)   @title: '환산 분자' ;	
    conversion_denominator : Decimal(10,0)   @title: '환산 분모' ;	
    conversion_index : Decimal(10,0)   @title: '환산 지수' ;
    conversion_addition_constant : Decimal(10,0)   @title: '환산 추가 상수' ;	
    decplaces_rounding : Decimal(10,0)   @title: '소수자리수 반올림' ;    	
    conversion_rate : Decimal   @title: '환산비율' ;
 /*   system_uom_code : String(5) @title: 'SAP UOM Code(PK)';
    system_uom_name : String(30) @title: 'SAP UOM Name';
    commercial_uom_code : String(3)   @title: '상업UOM코드' ;	
    technical_uom_code : String(6)   @title: '기술UOM코드' ;	
    commercial_uom_name : String(30)   @title: '상업UOM명' ;	
    technical_uom_name : String(30)   @title: '기술UOM명' ;	    
    family_unit_flag : Boolean   @title: '가족 단위 여부' ;	
    uom_iso_code : String(3)   @title: 'UOM ISO 코드' ;	
    uom_iso_primary_code_flag : Boolean   @title: 'UOM ISO 1차코드여부' ;	
    commercial_unit_flag : Boolean   @title: '상업단위여부' ;	
    value_base_commitment_flag : Boolean   @title: '값기준 약정 여부' ;	
*/    
}	

extend Mm_Unit_Of_Measure with util.Managed;