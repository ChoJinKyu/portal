namespace op;	

using util from '../../../cm/util/util-model';
using { op.Pu_Pr_Template_Lng as tpll } from './OP_PU_PR_TEMPLATE_LNG-model';
using { op.Pu_Pr_Template_Dtl as tpld } from './OP_PU_PR_TEMPLATE_DTL-model';

entity Pu_Pr_Template_Mst {	 
    key tenant_id           : String(5)      not null @title: '테넌트ID' ;	
    key pr_template_number  : String(10)     not null @title: '구매요청템플릿번호' ;
    
    tplls : Composition of many tpll
            on tplls.tenant_id = tenant_id
               and tplls.pr_template_number = pr_template_number ;

    tplds : Composition of many tpld
            on tplds.tenant_id = tenant_id
               and tplds.pr_template_number = pr_template_number ;

        erp_interface_flag  : Boolean        not null @cds.on.insert:false @title: 'ERP인터페이스여부' ;	
        default_template_number : String(10)          @title: '기본템플릿번호' ;	
        use_flag            : Boolean        not null @cds.on.insert:false @title: '사용여부' ;	
        approval_flag       : Boolean        not null @cds.on.insert:false @title: '품의여부' ;	
        default_template_flag : Boolean               @cds.on.insert:false @title: '기본템플릿여부' ; 
    }	

extend Pu_Pr_Template_Mst with util.Managed;    

