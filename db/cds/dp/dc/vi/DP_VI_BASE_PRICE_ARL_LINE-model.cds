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
*************************************************/
namespace dp;	
using { User } from '@sap/cds/common';
using util from '../../../util/util-model';
	
entity VI_Base_Price_Arl_Line {	
  key tenant_id : String(5)  not null @title: '테넌트ID';		
  key arl_number : String(100)  not null @title: '품의서번호';	
  key line_number : Decimal  not null @title: '회사코드';		
        item_code : String(100)  not null @title: '품목코드';			
        supplier_code : String(100)  not null @title: '공급업체코드';				
	    basic_date : Date  not null @title: '기준일자';					
	    new_dom_basic_price : Decimal  @title:'신규내수기준단가';	
	    new_dom_basic_curr_code : String(3) @title:'신규내수기준통화코드';		
	    new_exp_basic_price : Decimal  @title:'신규수출기준단가';	 ;	
	    new_exp_basic_curr_code : String(3) @title:'신규수출기준통화코드';		
	    curr_dom_basic_price : String(3) @title:'현재내수기준단가';	
	    curr_dom_basic_curr_code : String(3) @title:'현재수출기준통화코드';		
	    curr_exp_basic_price : Decimal  @title:'현재수출기준단가';	
	    curr_exp_basic_curr_code : String(3)  ;	
	    dom_first_po_price : Decimal  @title:'내수최초구매단가';	
	    dom_first_po_price_curr_code : String(3)  @title:'내수최초구매단가';		
	    exp_first_po_price : Decimal  @title:'수출최초구매단가';			
	    exp_first_po_price_curr_code : String(3) @title:'수출최초구매단가통화코드';				
	    dom_first_po_price_start_date : Date  @title:'내수최초구매단가시작일자';					
	    exp_first_po_price_start_date : Date  @title:'수출최초구매단가시작일자';	
}	

extend VI_Base_Price_Arl_Line with util.Managed;