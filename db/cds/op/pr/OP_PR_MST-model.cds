namespace op;	
// 작성 테스트 입니다.
using util from '../../cm/util/util-model';
using { op as dtl } from './OP_PR_DTL-model';

entity Pr_Mst {	

    key tenant_id	            : String(5)     not null	 @title: '테넌트ID'; 
    key company_code	        : String(10)    not null	 @title: '회사코드'; 
    key org_type_code	        : String(2)		not null	 @title: '조직유형코드'; 
    key org_code	            : String(10)	not null	 @title: '조직코드'; 
    key pr_number	            : String(50)	not null	 @title: '구매요청번호'; 
        items : Composition of many dtl.Pr_Dtl
                on  items.tenant_id = tenant_id 
                and items.company_code = company_code 
                and items.org_type_code = org_type_code 
                and items.org_code = org_code 
                and items.pr_number = pr_number  ;
        pr_type_code_1	        : String(30)	not null	 @title: '구매요청유형코드1'; 
        pr_type_code_2	        : String(30)	not null	 @title: '구매요청유형코드2'; 
        pr_type_code_3	        : String(30)	not null	 @title: '구매요청유형코드3'; 
        pr_template_number  	: String(10)	not null	 @title: '구매요청템플릿번호'; 
        pr_create_system_code	: String(30)	not null	 @title: '구매요청생성시스템코드'; 
        requestor_empno	        : String(30)	not null	 @title: '요청자사번'; 
        requestor_name	        : String(50)	not null	 @title: '요청자명'; 
        request_date	        : Date		    not null	 @title: '요청일자'; 
        pr_create_status_code	: String(30)	not null	 @title: '구매요청생성상태코드'; 
        pr_header_text	        : String(200)	not null	 @title: '구매요청헤더텍스트'; 
        approval_number	        : String(50)	not null	 @title: '품의번호'; 
        erp_interface_flag	    : Boolean	    not null	 @title: 'ERP인터페이스여부'; 
        erp_pr_type_code	    : String(30)	not null	 @title: 'ERP구매요청유형'; 
        erp_pr_number	        : String(50)	not null	 @title: 'ERP구매요청번호'; 
}	

extend Pr_Mst with util.Managed;