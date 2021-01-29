namespace ep;

@path : '/ep.UcContractMgtV4Service'
service UcContractMgtV4Service {

    type OutType : {
        returncode    : String(2);
        returnmessage : String(500);
        savedkey      : String(50);
    };

    type InputData : {
        tenant_id                      : String;
        company_code                   : String;
        net_price_contract_document_no : String;
        net_price_contract_degree      : Decimal;
        delete_reason                  : String;
    };

    action NetContractEndProc(inputData : array of InputData) returns array of OutType;

}
