using { ep as forexDeclarationView} from '../../../../db/cds/ep/cm/EP_PO_FOREX_DECLARATION_VIEW-model';

namespace ep;

@path : '/ep.PoApprMgtV4Service'
service PoApprMgtV4Service {
   
    type SavedForexItems : {
        tenant_id : String;
        company_code : String;
        po_number : String;
        forex_declare_status_code : String;
        //declare_scheduled_date : Date;		
		//declare_date : Date;
        declare_scheduled_date : String;		
		declare_date : String;			
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

    view ForexDeclarationSummaryView (tenant_id : String, company_code : String, purchasing_department_code : String, buyer_empno : String, po_start_date : Date, po_end_date : Date) as
    select key '회사' as group_type : String(50)
        , ifnull(sum(todo_count),0) as todo_count : Integer64
        , ifnull(sum(standby_count),0) as standby_count : Integer64     
        , ifnull(sum(ongoing_count),0) as ongoing_count : Integer64
        , ifnull(sum(complete_count),0) as complete_count : Integer64
    from (
        select count(1) as todo_count
            , map(pfv.forex_declare_status_code,'920010',count(1),0) as standby_count              
            , map(pfv.forex_declare_status_code,'920020',count(1),0) as ongoing_count
            , map(pfv.forex_declare_status_code,'920030',count(1),0) as complete_count
        from forexDeclarationView.Po_Forex_Declaration_View as pfv
        where pfv.tenant_id = :tenant_id
        and pfv.company_code = :company_code
        and pfv.po_date between :po_start_date and :po_end_date
        group by pfv.forex_declare_status_code   
    ) as A
    union all
    select key '부서' as group_type : String(50)
        , ifnull(sum(todo_count),0) as todo_count : Integer64
        , ifnull(sum(standby_count),0) as standby_count : Integer64         
        , ifnull(sum(ongoing_count),0) as ongoing_count : Integer64
        , ifnull(sum(complete_count),0) as complete_count : Integer64
    from (
        select count(1) as todo_count
            , map(pfv.forex_declare_status_code,'920010',count(1),0) as standby_count           
            , map(pfv.forex_declare_status_code,'920020',count(1),0) as ongoing_count
            , map(pfv.forex_declare_status_code,'920030',count(1),0) as complete_count
        from forexDeclarationView.Po_Forex_Declaration_View as pfv
        where pfv.tenant_id = :tenant_id
        and pfv.company_code = :company_code
        and pfv.purchasing_department_code = :purchasing_department_code
        and pfv.po_date between :po_start_date and :po_end_date
        group by pfv.forex_declare_status_code   
    ) as B
    union all
    select key '담당자' as group_type : String(50)
        , ifnull(sum(todo_count),0) as todo_count : Integer64
        , ifnull(sum(standby_count),0) as standby_count : Integer64         
        , ifnull(sum(ongoing_count),0) as ongoing_count : Integer64
        , ifnull(sum(complete_count),0) as complete_count : Integer64
    from (
        select count(1) as todo_count
            , map(pfv.forex_declare_status_code,'920010',count(1),0) as standby_count           
            , map(pfv.forex_declare_status_code,'920020',count(1),0) as ongoing_count
            , map(pfv.forex_declare_status_code,'920030',count(1),0) as complete_count
        from forexDeclarationView.Po_Forex_Declaration_View as pfv
        where pfv.tenant_id = :tenant_id
        and pfv.company_code = :company_code
        and pfv.buyer_empno = :buyer_empno
        and pfv.po_date between :po_start_date and :po_end_date
        group by pfv.forex_declare_status_code   
    ) as C
    ;

}