namespace ep;

using util from '../../util/util-model';

entity Guarantee {	
    key tenant_id : String(5)  not null;	
    key company_code : String(10)  not null;	
    key contract_number : String(100)  not null;	
    key contract_degree : Integer64  not null;	
    key warranty_separated_code : String(30)  not null;	
    key warranty_sequence : Decimal  not null;	
    progress_status_code : String(30);	
    warranty_agency_code : String(30);	
    insuarnce_amount : Decimal;	
    deposit_rate : Decimal;	
    warranty_start_date : Date;	
    warranty_end_date : Date;	
    warranty_bond_number : String(100);	
    attachment_group_number : String(100);	
}	

extend  Guarantee with util.Managed;	