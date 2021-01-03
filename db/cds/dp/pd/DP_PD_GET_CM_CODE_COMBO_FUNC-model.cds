namespace dp;	
 
@cds.persistence.exists
entity Pd_Get_Cm_Code_Combo_Func(tenant_id: String(5), language_cd: String(30), group_code: String(30)) {	
  key code: String(30) @title: '코드';
      display_name : String(300) @title: '코드:값';
      code_name : String(240) @title: '코드명';
      sort_no : Decimal @title: '소팅순서';
}