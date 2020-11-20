namespace dp;	
using util from '../../util/util-model';  	
// using {dp as planActualHis} from '../standardCommon/DP_SC_PLAN_ACTUAL_SUM_HIS-model';	
	
entity Sc_Plan_Actual_Sum_His {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key yyyy : String(4)  not null @title: '년도' ;	
  key category_code : String(200)  not null @title: '카테고리 코드' ;	
  key sc_type : String(10)  not null @title: '표준화공용화유형' ;	
    progress_status : String(20)   @title: '진행상태' ;	
  key version : Decimal default 1 not null @title: '버전' ;	
    jan : Decimal   @title: '1월' ;	
    feb : Decimal   @title: '2월' ;	
    mar : Decimal   @title: '3월' ;	
    apr : Decimal   @title: '4월' ;	
    may : Decimal   @title: '5월' ;	
    jun : Decimal   @title: '6월' ;	
    jul : Decimal   @title: '7월' ;	
    aug : Decimal   @title: '8월' ;	
    sep : Decimal   @title: '9월' ;	
    oct : Decimal   @title: '10월' ;	
    nov : Decimal   @title: '11월' ;	
    dec : Decimal   @title: '12월' ;	
}	
extend Sc_Plan_Actual_Sum_His with util.Managed;	
