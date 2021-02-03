namespace sp;

@path : '/sp.evaluationItemMngtV4Service'
service EvaluationItemMngtV4Service { 
    /* Return Type */
    type rtnMsg : {
        return_code: String(2);
 	    return_msg: String(1000);
    };
    /* Item Mst Type */
    type itemType : { 
        transaction_code: String(1);
        tenant_id: String(5);
        company_code: String(10);
        org_type_code: String(2);
        org_code: String(10);
        evaluation_operation_unit_code: String(30);
        evaluation_type_code: String(30);
        evaluation_article_code: String(15);
        evaluation_execute_mode_code: String(30);
        evaluation_article_type_code: String(30);
        evaluation_distrb_scr_type_cd: String(30);
        evaluation_result_input_type_cd: String(30);
        qttive_item_uom_code: String(30);
        qttive_eval_article_calc_formula: String(1000);
        evaluation_article_desc: String(3000);
        sort_sequence: Decimal;
    };

    /* Scale Type */
    type scleType : {
        transaction_code: String(1);
        tenant_id: String(5);
        company_code: String(10);
        org_type_code: String(2);
        org_code: String(10);
        evaluation_operation_unit_code: String(30);
        evaluation_type_code: String(30);
        evaluation_article_code: String(15);
        option_article_number: String(10);
        option_article_name: String(240);
        option_article_start_value: String(100);
        option_article_end_value: String(100);
        evaluation_score: Decimal;
        sort_sequence: Decimal;
    };

    /* 평가항목저장*/
    action CreateEvalItemSaveProc(tenant_id: String(5)
                                 ,company_code : String(10)
                                 ,org_type_code : String(2)
                                 ,org_code : String(10)
                                 ,evaluation_operation_unit_code : String(30)
                                 ,evaluation_type_code : String(30)
                                 ,parent_evaluation_article_code : String(15)
                                 ,evaluation_article_name : String(240)
                                 ,evaluation_article_lvl_attr_cd : String(30)
                                 ,user_id : String(255)
                                 ) returns array of rtnMsg;

    /* 평가항목 상세 저장 */
    action EvalItemSaveProc (ItemType : array of itemType
                            ,ScleType : array of scleType
                            ,user_id : String(30)) returns array of rtnMsg;
}