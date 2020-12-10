namespace op;	
// 작성 테스트 입니다.
using util from '../../cm/util/util-model';
using { op as mst } from './OP_PR_MST-model';

entity Pr_Dtl {	

    key tenant_id	            : String(5)     not null	 @title: '테넌트ID'; 
    key company_code	        : String(10)    not null	 @title: '회사코드'; 
    key org_type_code	        : String(2)		not null	 @title: '조직유형코드'; 
    key org_code	            : String(10)	not null	 @title: '조직코드'; 
    key pr_number	            : String(50)	not null	 @title: '구매요청번호'; 
        header : Association to mst.Pr_Mst
            on header.tenant_id = tenant_id 
            and header.company_code  =  company_code
            and header.org_type_code  =  org_type_code
            and header.org_code  =  org_code
            and header.pr_number  =  pr_number;   

    key pr_item_number			: String(5)     not null	 @title: '구매요청품목번호';  // 자릿수 추후 확인..       
        material_code			: String(40)    not null	 @title: '자재코드';         
        // 미등록컬럼			                     not null	  @title: '자재그룹'; 
        // 미등록컬럼			                     not null	  @title: '구매요청품명'; 
        // 미등록컬럼			                     not null	  @title: '구매요청수량'; 
        // 미등록컬럼			                     not null	  @title: '구매요청단위'; 
        txz01                   : String(30)   not null      @title: '구매요청 제품명'; 
        menge                   : Decimal      not null      @title: '구매요청 수량'; 	
        meins                   : String(30)   not null      @title: '구매요청 수량 단위'; 	
        preis                   : Decimal      not null      @title: '가격';

        request_date			: Date         not null	     @title: '요청일자'; 
        // 미등록컬럼                               not null	  @title: '납품요청일'; 
        // 미등록컬럼			                     not null	  @title: '결재요청일'; 
        // 미등록컬럼			                     not null	  @title: '결재완료일'; 
        buyer_empno			    : String(40)   not null	     @title: '구매담당자사번'; 
        // 미등록컬럼			                     not null	  @title: '구매그룹'; 
        // 미등록컬럼			                     not null	  @title: '예상가격'; 
        currency_code			: String(30)   not null      @title: '통화코드';	   
        // 미등록컬럼	                             not null	  @title: '가격단위'; 
        remark                  : String(50)   not null	     @title: '비고';  
}	

extend Pr_Dtl with util.Managed;