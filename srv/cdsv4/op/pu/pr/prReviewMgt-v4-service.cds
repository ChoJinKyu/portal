namespace op;

@path : '/op.prReviewMgtV4Service'
service PrReviewMgtV4Service {

    /* PR Item Type */
    type inPrItemType {
        transaction_code : String(1);
        tenant_id : String(5);
        company_code : String(10);
        pr_number : String(50);
        //pr_item_number : Integer64;
        pr_item_number : String(10);
    };

    /* Return Type */
    type outType {
        return_code : String(2);
        return_msg  : String(1000);
    };

    /* PR Review 재작성 요청 및 마감, 구매담당자 변경 */
    action callPrReviewSaveProc (jobType : String(30)
                                ,prItemTbl : array of inPrItemType
                                ,buyerEmpno : String(30)
                                ,buyerDepartmentCode : String(30)
                                ,processedReason : String(1000)
                                ,userId : String(255)) returns array of outType;
}