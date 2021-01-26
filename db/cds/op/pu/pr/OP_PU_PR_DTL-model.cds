namespace op;	

using util from '../../../cm/util/util-model';
using { op.Pu_Pr_Mst as mst } from './OP_PU_PR_MST-model';
using { op.Pu_Pr_Account as accounts } from './OP_PU_PR_ACCOUNT-model';
using { op.Pu_Pr_Service as services } from './OP_PU_PR_SERVICE-model';

entity Pu_Pr_Dtl {	

    key tenant_id       : String(5)     not null	@title: '테넌트id';
    key company_code    : String(10)    not null	@title: '회사코드';
    key pr_number		: String(50)    not null	@title: '구매요청번호';
    key pr_item_number  : Integer64     not null    @title: '구매요청품목번호' ;	

    
        mst : Association to mst
            on mst.tenant_id = tenant_id 
            and mst.company_code  =  company_code
            and mst.pr_number  =  pr_number;       

        accounts : Composition of many accounts
			on  accounts.tenant_id = tenant_id 
			and accounts.company_code = company_code 
			and accounts.pr_number = pr_number  
            and accounts.pr_item_number = pr_item_number  ;	

        services : Composition of many services
			on  services.tenant_id = tenant_id 
			and services.company_code = company_code 
			and services.pr_number = pr_number  
            and services.pr_item_number = pr_item_number  ;	            

            org_type_code   : String(2)         @title: '조직유형코드' ;	
            org_code        : String(10)        @title: '조직코드' ;	
            material_code   : String(40)        @title: '자재코드' ;	
            material_group_code : String(10)    @title: '자재그룹코드' ;	
            pr_desc         : String(100)       @title: '구매요청내역' ;	
            pr_quantity     : Decimal           @title: '구매요청수량' ;	
            pr_unit         : String(3)         @title: '구매요청단위' ;	
            requestor_empno : String(30)        @title: '요청자사번' ;	
            requestor_name  : String(50)        @title: '요청자명' ;	
            request_date    : Date              @title: '요청일자' ;	
            delivery_request_date : Date        @title: '납품요청일자' ;	
            approval_date           : Date      @title: '결재일자' ;
            buyer_empno     : String(30)        @title: '구매담당자사번' ;	
            buyer_department_code : String(30)  @title: '구매부서코드' ;
            purchasing_group_code : String(3)   @title: '구매그룹코드' ;	
            estimated_price : Decimal           @title: '예상가격' ;	
            currency_code   : String(3)         @title: '통화코드' ;	
            price_unit      : Decimal           @title: '가격단위' ;	
            pr_progress_status_code : String(30)        @title: '구매요청진행상태코드' ;	
            remark          : String(3000)      @title: '비고' ;	
            attch_group_number : String(100)    @title: '첨부파일그룹번호' ;	
            delete_flag     : Boolean   not null   @cds.on.insert: false   @title: '삭제여부' ;	
            closing_flag    : Boolean   not null   @cds.on.insert: false   @title: '마감여부' ;	
            item_category_code : String(2)               @title: '품목범주코드' ;	
            account_assignment_category_code : String(2) @title: '계정지정범주코드' ;	
            sloc_code       : String(4)                  @title: '저장위치코드' ;	
            supplier_code   : String(10)                 @title: '공급업체코드' ;	


    }	

extend Pu_Pr_Dtl with util.Managed;