namespace op;	

using util from '../../../cm/util/util-model';
using { op.Pu_Pr_Template_Mst as tplm } from './OP_PU_PR_TEMPLATE_MST-model';

entity Pu_Pr_Template_Lng {	 
    key tenant_id              : String(5)   not null @title: '테넌트ID' ;	
    key pr_template_number     : String(10)  not null @title: '구매요청템플릿번호' ;	
    key language_code          : String(4)   not null @title: '언어코드' ;	

    	
    tplm : Association to tplm
        on tplm.tenant_id = tenant_id 
        and tplm.pr_template_number  =  pr_template_number;  

        pr_template_name      : String(100)  not null @title: '구매요청템플릿명' ;		
    }	
extend Pu_Pr_Template_Lng with util.Managed;    

