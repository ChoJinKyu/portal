namespace dp;	
using util from '../../cm/util/util-model';  	
// using {dp as DpcodeMst} from '../pd/DP_CODE_MST-model';	
	
entity Code_Mst {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key group_code : String(30)  not null @title: '그룹코드' ;	
    group_name : String(240)   @title: '그룹명' ;	
    group_description : String(500)   @title: '그룹설명' ;	
    active_flag : Boolean   @title: '활성여부' ;	
}	
extend Code_Mst with util.Managed;	
