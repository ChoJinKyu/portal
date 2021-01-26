namespace op;	

using util from '../../../cm/util/util-model';
using { op.Pu_Pr_Dtl as dtl } from './OP_PU_PR_DTL-model';

entity Pu_Pr_Service {	

    key tenant_id				: String(5)     not null	 @title: '테넌트id';
    key company_code			: String(10)    not null	 @title: '회사코드';
    key pr_number				: String(50)    not null	 @title: '구매요청번호';
    key pr_item_number  : Integer64     not null    @title: '구매요청품목번호' ;
    key service_sequence		: Decimal		not null	 @title: '서비스순번';
        dtl : Association to dtl
            on dtl.tenant_id = tenant_id 
            and dtl.company_code  =  company_code
            and dtl.pr_number  =  pr_number
            and dtl.pr_item_number  =  pr_item_number;  
            service_desc : String(100)   @title: '서비스내역' ;	
        pr_quantity     : Decimal   @title: '구매요청수량' ;	
        unit            : String(3) @title: '단위' ;	
        net_price       : Decimal   @title: '단가' ;	
        gross_amount    : Decimal   @title: '총금액' ;	
        currency_code   : String(3) @title: '통화코드' ;	
    }	
extend Pu_Pr_Service with util.Managed;