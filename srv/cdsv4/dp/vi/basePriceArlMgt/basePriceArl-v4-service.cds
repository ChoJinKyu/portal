namespace dp;

@path : '/dp.BasePriceArlV4Service'
service BasePriceArlV4Service {

    type BasePriceArlMstType : {
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

        // Approvers              : array of BasePriceArlApproverType;
        // Referers               : array of BasePriceArlRefererType;
        details                : array of BasePriceArlDtlType;

        local_create_dtm       : DateTime;
        local_update_dtm       : DateTime;
        create_user_id         : String(255);
        update_user_id         : String(255);
    };

    type BasePriceArlApproverType : {
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

    type BasePriceArlRefererType : {
        tenant_id              : String(5);
        approval_number        : String(30);
        referer_empno          : String(30);

        local_create_dtm       : DateTime;
        local_update_dtm       : DateTime;
        create_user_id         : String(255);
        update_user_id         : String(255);
    };

    type BasePriceArlDtlType : {
        tenant_id              : String(5);
        approval_number        : String(30);
        item_sequence          : Decimal;
        company_code           : String(10);
        org_type_code          : String(2);
        org_code               : String(10);
        au_code                : String(10);
        material_code          : String(40);
        supplier_code          : String(10);
        base_date              : Date;
        base_price_ground_code : String(30);

        prices                 : array of BasePriceArlPriceType;

        local_create_dtm       : DateTime;
        local_update_dtm       : DateTime;
        create_user_id         : String(255);
        update_user_id         : String(255);
    };

    type BasePriceArlPriceType : {
        tenant_id                        : String(5);
        approval_number                  : String(50);
        item_sequence                    : Decimal;
        market_code                      : String(30);
        new_base_price                   : Decimal(19, 4);
        new_base_price_currency_code     : String(3);
        current_base_price               : Decimal(19, 4);
        current_base_price_currency_code : String(3);
        first_purchasing_net_price       : Decimal(19, 4);
        first_pur_netprice_curr_cd       : String(3);
        first_pur_netprice_str_dt        : Date;

        local_create_dtm       : DateTime;
        local_update_dtm       : DateTime;
        create_user_id         : String(255);
        update_user_id         : String(255);
    };

    type cmdType : String enum { insert; upsert; delete; };

    type InputDataType : {
        cmd               : cmdType;
        basePriceArlMst   : array of BasePriceArlMstType;
    }

    type OutputDataType : {
        return_code     : String(30);
        return_msg      : String(5000);
        return_rs       : array of BasePriceArlMstType;
    };

    action DpViBasePriceArlMergeProc(inputData : InputDataType) returns OutputDataType;
}
