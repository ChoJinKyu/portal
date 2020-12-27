namespace ep;

@path : '/ep.LoiMgtV4Service'
service LoiMgtV4Service {
   
    type InputData : {
        tenant_id : String;
        company_code : String;
        loi_write_number: String;
        loi_item_number: String;
        quotation_number: String;
        quotation_item_number: String;
    };

    // Procedure 호출해서 header 저장
    // Header Multi Row
    // Test 데이터
    /*********************************
    {
        "sampleHeaders" : [
            {"tenant_id":"1000", "company_code":"C100", "loi_write_number":"121000000001", "loi_item_number":"1", "quotation_number":"100", "quotation_item_number":"100100"},
            {"tenant_id":"1000", "company_code":"C100", "loi_write_number":"121000000001", "loi_item_number":"2", "quotation_number":"100", "quotation_item_number":"100100"}
        ]
    }
    *********************************/
    action SaveLoiQuotationNumberProc (inputData : array of InputData) returns String;

    // LOI 발행현황 VOS 저장
    // Fiori Json Array 데이터 Ajax로 V4호출
    // URL : /ep.LoiMgtV4Service/SaveLoiVosProc
    /*********************************
    {"tenant_id":"1000", "company_code":"C100", "loi_write_number":"121000000001", "loi_item_number":"1", "supplier_opinion":"기타의견"}
    *********************************/
    action SaveLoiVosProc(
        tenant_id : String(5),
        company_code : String(10),
        loi_write_number: String(50),
        loi_item_number: String(50),
        supplier_opinion: String(3000)
    ) returns String;     

}
