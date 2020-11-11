namespace dp;	
using util from '../../util/util-model';  	
using {dp.Sc_Plan_Actual_Sum_His as Plan_Actual_Sum_His} from '../standardCommon/DP_SC_PLAN_ACTUAL_SUM_HIS-model';	
	
entity Sc_Plan_Actual_Sum_His {	
  key tenant_id : String(5)  not null;	
  key company_code : String(10)  not null;	
  key org_type_code : String(30)  not null;	
  key org_code : String(10)  not null;	
  key yyyy : String(4)  not null;	
  key category_code : String(200)  not null;	
  key sc_type : String(10)  not null;	
    progress_status : String(20)  ;	
  key version : Decimal  not null;	
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
extend Sc_Plan_Actual_Sum_His with util.Managed;	
