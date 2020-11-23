namespace ep;	
using util from '../../util/util-model'; 	
	
	
entity Project {	
  key tenant_id : String(5)  not null;	
  key company_code : String(10)  not null;	
  key project_number : String(50)  not null;	
    project_name : String(100)  ;	
    ep_purchasing_type_code : String(30)  ;	
    plant_code : String(10)  ;	
    bizunit_code : String(10)  ;	
    bizdivision_code : String(10)  ;	
    remark : String(3000)  ;	
}	
extend Project with util.Managed;	