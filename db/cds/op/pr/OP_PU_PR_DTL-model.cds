namespace op.pu;	

using util from '../../cm/util/util-model';
using { op.pu as mst } from './OP_PU_PR_MST-model';
using { op.pu as accounts } from './OP_PU_PR_ACCOUNT-model';
using { op.pu as services } from './OP_PU_PR_SERVICE-model';

entity Pr_Dtl {	

    key tenant_id				: String(5)     not null	 @title: '테넌트id';
    key company_code			: String(10)    not null	 @title: '회사코드';
    key pr_number				: String(50)    not null	 @title: '구매요청번호';
    key pr_item_number			: String(10)    not null	 @title: '구매요청품목번호';
    
        mst : Association to mst.Pr_Mst
            on mst.tenant_id = tenant_id 
            and mst.company_code  =  company_code
            and mst.pr_number  =  pr_number;       

        accounts : Composition of many accounts.Pr_Account
			on  accounts.tenant_id = tenant_id 
			and accounts.company_code = company_code 
			and accounts.pr_number = pr_number  
            and accounts.pr_item_number = pr_item_number  ;	

        services : Composition of many services.Pr_Service
			on  services.tenant_id = tenant_id 
			and services.company_code = company_code 
			and services.pr_number = pr_number  
            and services.pr_item_number = pr_item_number  ;	            

        org_type_code			: String(2)     not null	 @title: '조직유형코드';
        org_code				: String(10)    not null	 @title: '조직코드';
        material_code			: String(40)    not null	 @title: '자재코드';
        material_group_code		: String(10)    not null	 @title: '자재그룹코드';
        pr_desc					: String(100)   not null	 @title: '구매요청내역';
        pr_quantity				: Decimal		not null	 @title: '구매요청수량';
        pr_unit					: String(3)     not null	 @title: '구매요청단위';
        request_date			: Date			not null	 @title: '요청일자';
        delivery_request_date	: Date			not null	 @title: '납품요청일자';
        buyer_empno				: String(30)    not null	 @title: '구매담당자사번';
        purchasing_group_code	: String(3)     not null	 @title: '구매그룹코드';
        estimated_price			: Decimal		not null	 @title: '예상가격';
        currency_code			: String(3)     not null	 @title: '통화코드';
        price_unit				: String(3)    	not null	 @title: '가격단위';
        remark					: String(3000)  not null	 @title: '비고';
        attch_group_number		: String(100)   not null	 @title: '첨부파일그룹번호';
    }	

extend Pr_Dtl with util.Managed;