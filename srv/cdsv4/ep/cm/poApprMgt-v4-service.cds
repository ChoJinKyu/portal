namespace ep;

@path : '/ep.PoApprMgtV4Service'
service PoApprMgtV4Service {
   
    type SavedForexItems : {
        tenant_id : String;
        company_code : String;
        po_number : String;
        forex_declare_status_code : String;
        declare_scheduled_date : Date;		
		declare_date : Date;			
		attch_group_number : String;	
		remark : String;	
        update_user_id : String;
    };

    type ResultForexItems : {
        tenant_id : String;
        company_code : String;
        po_number : String;
        result_code : String;
    };    

    // Procedure 호출해서 외환신고품목 저장
    // 외환신고품목은 한건씩 저장이나 확장을 위해 Multi Row 형태로 구현
    action SavePoForexDeclarationProc (forexItems : array of SavedForexItems) returns array of ResultForexItems;
}