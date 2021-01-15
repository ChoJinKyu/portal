namespace dp;

@path : '/dp.BasePriceArlV4Service'
service BasePriceArlV4Service {

    type BasePriceArlMstType : {
        tenant_id       : String(5);
        approval_number : String(30);
        details         : array of BasePriceArlDtlType;
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
    };

    type InputDataType : {
        basePriceArlMst   : array of BasePriceArlMstType;
    }

    type OutputDataType : {
        return_code     : String(30);
        return_msg      : String(5000);
        return_rs       : array of BasePriceArlMstType;
    };

    action DpViBasePriceArlMergeProc(inputData : InputDataType) returns OutputDataType;
}
