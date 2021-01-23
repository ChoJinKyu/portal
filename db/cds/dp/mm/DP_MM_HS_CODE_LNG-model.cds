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
  6. entity : Mm_Hs_Code_Lng
  7. entity description : HS 코드 (언어)
  8. history
  -. 2021.01.23 : 최미희 최초작성
*************************************************/
namespace dp;	
using util from '../../cm/util/util-model';	
using { dp as HsCode } from './DP_MM_HS_CODE-model';

entity Mm_Hs_Code_Lng {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key country_code : String(30)  not null @title: '국가코드' ;	
  key hs_code : String(17)  not null @title: 'HS코드' ;	

   parent: Association to HsCode.Mm_Hs_Code
        on parent.tenant_id = tenant_id 
        and parent.country_code = country_code
        and parent.hs_code = hs_code;

  key language_code : String(4)  not null @title: '언어코드' ;	
    hs_text : String(500)   @title: 'HS텍스트' ;	
    hs_text1 : String(50)   @title: 'HS텍스트1' ;	
    hs_text2 : String(50)   @title: 'HS텍스트2' ;	
    hs_text3 : String(50)   @title: 'HS텍스트3' ;	
    hs_text4 : String(50)   @title: 'HS텍스트4' ;	
    hs_text5 : String(50)   @title: 'HS텍스트5' ;	
    hs_text6 : String(50)   @title: 'HS텍스트6' ;	
    hs_text7 : String(50)   @title: 'HS텍스트7' ;	
}

extend Mm_Hs_Code_Lng with util.Managed;