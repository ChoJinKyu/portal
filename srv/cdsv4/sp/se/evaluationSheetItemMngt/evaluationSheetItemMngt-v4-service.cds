namespace sp;

@path : '/sp.evaluationSheetItemMngtV4Service'
service EvaluationSheetItemMngtV4Service { 
    /* Return Type */
    type rtnMsg : {
        return_code: String(2);
 	    return_msg: String(1000);
    };
    
    /* Item Mst Type */
    type itemType : { 
        tenant_id: String(5);
        company_code: String(10);
        org_type_code: String(2);
        org_code: String(10);
        evaluation_operation_unit_code: String(30);
        evaluation_type_code: String(30);
        evaluation_article_code: String(15);
        regular_evaluation_id: String(100);
    };
    
    /* 평가항목 Add */
    action EvalSheetItemAddProc (ItemType : array of itemType
                                ,user_id : String(30)) returns array of rtnMsg;
    
    /* 평가항목 Delete */
    action EvalSheetItemDeleteProc (ItemType : array of itemType
                                   ,user_id : String(30)) returns array of rtnMsg;
    
    /* 평가항목 Copy */
    action EvalSheetItemCopyProc (tenant_id: String(5)
                                 ,company_code : String(10)
                                 ,org_type_code : String(2)
                                 ,org_code : String(10)
                                 ,evaluation_operation_unit_code : String(30)
                                 ,evaluation_type_code : String(30)
                                 ,regular_evaluation_id : String(100)
                                 ,user_id : String(255)
                                 ) returns array of rtnMsg;
}