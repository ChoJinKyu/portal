namespace sp;

@path : '/sp.spviBasePriceArlV4Service'
service spviBasePriceArlV4Service {
    //품의마스터
    type BasePriceAprlMstType : {
        tenant_id              : String(5);
        approval_number        : String(30);
        chain_code             : String(30);
        approval_type_code     : String(30);
        approval_title         : String(300);
        approval_contents      : LargeString;
        approve_status_code    : String(30);
        requestor_empno        : String(30);
        request_date           : String(8);
        attch_group_number     : String(100);
        local_create_dtm       : DateTime;
        local_update_dtm       : DateTime;
        create_user_id         : String(255);
        update_user_id         : String(255);
    };

    //양산가품의서유형
    type BasePriceAprlTypeType : {
        tenant_id              : String(5);
        approval_number        : String(30);
        net_price_type_code    : String(30);
        local_create_dtm       : DateTime;
        local_update_dtm       : DateTime;
        create_user_id         : String(255);
        update_user_id         : String(255);
    };

    //품의승인자 
    type BasePriceAprlApproverType : {
        tenant_id              : String(5);
        approval_number        : String(30);
        approve_sequence       : String(10);
        approver_empno         : String(30);
        approver_type_code     : String(30);
        approve_status_code    : String(30);

        local_create_dtm       : DateTime;
        local_update_dtm       : DateTime;
        create_user_id         : String(255);
        update_user_id         : String(255);
    };

//품의참조자
    type BasePriceAprlRefererType : {
        tenant_id              : String(5);
        approval_number        : String(30);
        referer_empno          : String(30);

        local_create_dtm       : DateTime;
        local_update_dtm       : DateTime;
        create_user_id         : String(255);
        update_user_id         : String(255);
    };

 //양산품의예외ITEM
    type BasePriceAprlItemExcType : {
        tenant_id	              : String(5)    ;
        approval_number	          : String(50)   ;
        item_sequence	          : Decimal   ;
        company_code	          : String(10)   ;
        bizunit_code	          : String(10)   ;
        base_year	              : String(4)    ;
        apply_start_yyyymm	      : String(6)    ;
        apply_end_yyyymm	      : String(6)    ;
        bizdivision_code	      : String(10)   ;
        plant_code	              : String(10)   ;
        supplier_code	          : String(10)   ;
        material_code	          : String(40)   ;
        material_name	          : String(240)  ;
        vendor_pool_code	      : String(20)   ;
        currency_code	          : String(3)    ;
        base_price_exception_reason   : String(300);
	    apply_flag                    : String(1);
    
        local_create_dtm       : DateTime;
        local_update_dtm       : DateTime;
        create_user_id         : String(255);
        update_user_id         : String(255);
    };

    type BasePriceAprlChangeRequestorType : {
        tenant_id              : String(5);
        approval_number        : String(30);
        changer_empno          : String(30);
        creator_empno          : String(30);

        local_create_dtm       : DateTime;
        local_update_dtm       : DateTime;
        create_user_id         : String(255);
        update_user_id         : String(255);
    };

    //type CmdType : String enum { insert; upsert; delete; };

    type InputAprlDataType : {
        BasePriceAprlMstType        : array of BasePriceAprlMstType;
        BasePriceAprlApproverType   : array of BasePriceAprlApproverType;
        BasePriceAprlRefererType    : array of BasePriceAprlRefererType;
        BasePriceAprlTypeType       : array of BasePriceAprlTypeType;
        BasePriceAprlItemExcType    : array of BasePriceAprlItemExcType;
        type_code                   : String(10);
    }



    type OutputDataType : {
        return_code     : String(30);
        return_msg      : String(1000);
    };

    action SpViBasePriceAprlExcProc(inputData : InputAprlDataType) returns OutputDataType;
    action SpViBasePriceAprlExcUpdateProc(inputData : InputAprlDataType) returns OutputDataType;
    
      type InputAprlDataType1 : {
        BasePriceAprlMstType        : array of BasePriceAprlMstType;
    }

    action SpViBasePriceAprlExcDeleteProc(inputData : InputAprlDataType1) returns OutputDataType;


    
}
