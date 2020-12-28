namespace dp;	
 
@cds.persistence.exists
entity Pd_Get_Cm_Code_Combo_View {	
  key code: String(30) @title: '코드';
      display_name : String(300) @title: '코드:값';
      code_name : String(240) @title: '코드명';
}