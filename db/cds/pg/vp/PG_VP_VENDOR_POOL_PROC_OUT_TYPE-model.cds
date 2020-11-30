namespace pg;	
 
@cds.persistence.exists
entity Vp_Vendor_Pool_Proc_Out_Type {	
 return_code: String(2);
 return_msg: String(5000);
}