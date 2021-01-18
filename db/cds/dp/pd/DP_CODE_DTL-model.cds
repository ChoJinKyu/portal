namespace dp;	
using util from '../../cm/util/util-model';  	
// using {dp as DpcodeMst} from '../pd/DP_CODE_DTL-model';	
	
entity Code_Dtl {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key group_code : String(30)  not null @title: '그룹코드' ;	
  key code : String(30)  not null @title: '코드' ;	
    code_description : String(300)   @title: '코드설명' ;	
    sort_no : Decimal default 1  @title: '소팅번호' ;	
    start_date : Date   @title: '시작일' ;	
    end_date : Date   @title: '종료일' ;	
    parent_group_code : String(30)   @title: '상위그룹코드' ;	
    parent_code : String(30)   @title: '상위코드' ;	
    attributte_1 : String(500)   @title: '속성1' ;	
    attributte_2 : String(500)   @title: '속성2' ;	
    attributte_3 : String(500)   @title: '속성3' ;	
    attributte_4 : String(500)   @title: '속성4' ;	
    attributte_5 : String(500)   @title: '속성5' ;	
}	
extend Code_Dtl with util.Managed;	
