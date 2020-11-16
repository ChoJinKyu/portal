namespace dp;	
using util from '../../util/util-model';  	
using {dp as planActualHis} from '../standardCommon/DP_SC_PLAN_ACTUAL_SUM_HIS-model';	

entity Sc_Plan_Actual_Sum {	
  key tenant_id : String(5)  not null;	
  key company_code : String(10)  not null;	
  key org_type_code : String(30)  not null;	
  key org_code : String(10)  not null;	
  key yyyy : String(4)  not null;	

    children: Composition of many planActualHis.Sc_Plan_Actual_Sum_His
        on children.tenant_id = tenant_id 
        and children.company_code = company_code
        and children.org_type_code = org_type_code
        and children.org_code = org_code
        and children.yyyy = yyyy
        and children.category_code = category_code
        and children.sc_type = sc_type;

  key category_code : String(200)  not null;	
  key sc_type : String(10)  not null;	
    progress_status : String(20)  ;	
    jan : Decimal default 0 ;	
    feb : Decimal default 0 ;	
    mar : Decimal default 0 ;	
    apr : Decimal default 0 ;	
    may : Decimal default 0 ;	
    jun : Decimal default 0 ;	
    jul : Decimal default 0 ;	
    aug : Decimal default 0 ;	
    sep : Decimal default 0 ;	
    oct : Decimal default 0 ;	
    nov : Decimal default 0 ;	
    dec : Decimal default 0 ;	
}	
extend Sc_Plan_Actual_Sum with util.Managed;	
