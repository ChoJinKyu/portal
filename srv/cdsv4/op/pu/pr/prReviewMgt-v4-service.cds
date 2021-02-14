namespace op;

@path : '/op.prReviewMgtV4Service'
service PrReviewMgtV4Service {

    /* PR Item Type */
    type PrItemType {
        transaction_code : String(1);
        tenant_id : String(5);
        company_code : String(10);
        pr_number : String(50);
        //pr_item_number : Integer64;
        pr_item_number : String(10);
    };

    /* Return Type */
    type OutType {
        return_code : String(2);
        return_msg  : String(1000);
    };

    /* Procedure Input Type */
    type ProcInputType : {
        jobType : String(30);
        prItemTbl : array of PrItemType;
        buyerEmpno : String(30);
        buyerDepartmentCode : String(30);
        processedReason : String(1000);
        employeeNumber : String(30);
    };

    /* PR Review 재작성 요청 및 마감, 구매담당자 변경 */
    action CallPrReviewSaveProc(inputData : ProcInputType) returns array of OutType;

    /* Procedure Validation Input Type */
    type ProcVldtInputType : {
        jobType : String(30);
        prItemTbl : array of PrItemType;
        employeeNumber : String(30);
    };

    /* PR Review Validation Check */
    action CallPrReviewVldtProc(inputData : ProcVldtInputType) returns array of OutType;

}