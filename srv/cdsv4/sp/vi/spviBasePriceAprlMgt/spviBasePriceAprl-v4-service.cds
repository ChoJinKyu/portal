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

 //양산품의ITEM
    type BasePriceAprlItemType : {
        tenant_id	              : String(5)    ;
        approval_number	          : String(50)   ;
        item_sequence	          : String(50)   ;
        company_code	          : String(10)   ;
        bizunit_code	          : String(10)   ;
        management_mprice_code	  : String(30)   ;
        base_year	              : String(4)    ;
        apply_start_yyyymm	      : String(6)    ;
        apply_end_yyyymm	      : String(6)    ;
        bizdivision_code	      : String(10)   ;
        plant_code	              : String(10)   ;
        supply_plant_code	      : String(10)   ;
        supplier_code	          : String(10)   ;
        material_code	          : String(40)   ;
        material_name	          : String(240)  ;
        vendor_pool_code	      : String(20)   ;
        currency_code	          : String(3)    ;
        material_price_unit 	  : Decimal	     ;
        buyer_empno	              : String(30)   ;
        base_price	              : Decimal	     ;
        pcst	                  : Decimal	     ;
        metal_net_price	          : Decimal	     ;
        coating_mat_net_price	  : Decimal	     ;
        fabric_net_price	      : Decimal	     ;

        local_create_dtm       : DateTime;
        local_update_dtm       : DateTime;
        create_user_id         : String(255);
        update_user_id         : String(255);
    };

    type BasePriceAprlDtlType : {
        tenant_id                        : String(5);
        approval_number                  : String(30);
        item_sequence                    : Decimal;
        metal_type_code                  : String(30);
        metal_net_price                  : Decimal(19, 4);

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
        BasePriceAprlMstType   : array of BasePriceAprlMstType;
        BasePriceAprlApproverType             : array of BasePriceAprlApproverType;
        BasePriceAprlRefererType              : array of BasePriceAprlRefererType;
        BasePriceAprlTypeType                 : array of BasePriceAprlTypeType;
        BasePriceAprlItemType                 : array of BasePriceAprlItemType;
        BasePriceAprlDtlType                  : array of BasePriceAprlDtlType;
        type_code   : String(10);
    }

    type OutputDataType : {
        return_code     : String(30);
        return_msg      : String(1000);
    };

    action SpViBasePriceAprlProc(inputData : InputAprlDataType) returns OutputDataType;

    type InputRequestorDataType : {
        cmd                           : String(30);        // only upsert
        BasePriceArlChangeRequestor   : array of BasePriceAprlChangeRequestorType;
        debug                         : Boolean;
    }

    type OutputDataChangeRequestorType : {
        return_code     : String(30);
        return_msg      : String(1000);
        return_param    : String(5000);
        return_rs       : array of BasePriceAprlChangeRequestorType;
    };

    action SpViBasePriceChangeRequestorProc(inputData : InputRequestorDataType) returns OutputDataChangeRequestorType;
}
