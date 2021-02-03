namespace op;	

using util from '../../../cm/util/util-model';
using { op.Pu_Pr_Dtl as dtl } from './OP_PU_PR_DTL-model';

entity Pu_Pr_Account {	

    key tenant_id				: String(5)     not null	 @title: '테넌트id';
    key company_code			: String(10)    not null	 @title: '회사코드';
    key pr_number				: String(50)    not null	 @title: '구매요청번호';
    key pr_item_number          : Integer64     not null     @title: '구매요청품목번호' ;
    key account_sequence		: Integer64		not null	 @title: '계정순번';
        
        dtl : Association to dtl
            on dtl.tenant_id = tenant_id 
            and dtl.company_code  =  company_code
            and dtl.pr_number  =  pr_number
            and dtl.pr_item_number  =  pr_item_number;       

            service_sequence : Integer64           @title: '서비스순번' ;	
            account_code    : String(40)  not null  @title: '계정코드' ;	
            cctr_code       : String(10)            @title: '비용부서코드' ;	
            wbs_code        : String(30)            @title: 'WBS코드' ;	
            asset_number    : String(30)            @title: '자산번호' ;	
            order_number    : String(30)            @title: '오더번호' ;	
            pr_quantity     : Decimal(30,10)        @title: '구매요청수량' ;	
            distrb_rate     : Decimal(30,10)        @title: '배분율' ;	
    }	

extend Pu_Pr_Account with util.Managed;