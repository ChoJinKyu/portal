using {sp as ckTxFunc} from '../../../../db/cds/sp/sm/SP_SM_CHECK_TAXID_FUNC-model';

namespace sp;

@path : '/sp.supplierManagementV4Service'
service supplierManagementV4Service {

    //Check Tad ID Function
    entity CheckTaxIDFunction(tenant_id : String(5), tax_id : String(30)) as
        select from ckTxFunc.Sm_Check_Taxid_Func (
            tenant_id : : tenant_id, tax_id : : tax_id
        );

    type MakerRestnReq : {
        tenant_id                  : String(5);
        maker_request_sequence     : Integer64;
        maker_request_type_code    : String(30);
        maker_progress_status_code : String(30);
        requestor_empno            : String(30);
        tax_id                     : String(30);
        supplier_code              : String(10);
        supplier_local_name        : String(240);
        supplier_english_name      : String(240);
        country_code               : String(2);
        country_name               : String(30);
        vat_number                 : String(30);
        zip_code                   : String(20);
        local_address_1            : String(240);
        local_address_2            : String(240);
        local_address_3            : String(240);
        local_full_address         : String(1000);
        english_address_1          : String(240);
        english_address_2          : String(240);
        english_address_3          : String(240);
        english_full_address       : String(1000);
        affiliate_code             : String(10);
        affiliate_code_name        : String(50);
        company_class_code         : String(30);
        company_class_name         : String(50);
        repre_name                 : String(30);
        tel_number                 : String(50);
        email_address              : String(240);
        supplier_status_code       : String(30);
        supplier_status_name       : String(50);
        biz_certi_attch_number     : String(100);
        attch_number_2             : String(100);
        attch_number_3             : String(100);
        local_create_dtm           : DateTime;
        local_update_dtm           : DateTime;
        create_user_id             : String(255);
        update_user_id             : String(255);
        system_create_dtm          : DateTime;
        system_update_dtm          : DateTime;
    };

    type UpsertInputType : {
        tenant_id           : String(5);
        sourceMakerRestnReq : array of MakerRestnReq;
    };

    type UpsertOutType : {
        returncode    : String(2);
        returnmessage : String(5000);
    };

    action upsertMakerRestnReqProc(InputData : UpsertInputType) returns array of UpsertOutType;

}
