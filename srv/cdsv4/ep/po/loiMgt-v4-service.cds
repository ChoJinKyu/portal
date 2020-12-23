namespace ep;

@path : '/ep.LoiMgtV4Service'
service LoiMgtV4Service {
   
    // type SavedHeaders : {
    //     tenant_id : String;
    //     company_code : String;
    //     loi_write_number: String;
    //     loi_item_number: String;
    //     supplier_opinion: String;
    // };

    // // Procedure 호출해서 header 저장
    // // Header Multi Row
    // // Test 데이터
    // /*********************************
    // {
    //     "sampleHeaders" : [
    //         {"header_id" : 106, "cd": "eeee11", "name": "eeee11"},
    //         {"header_id" : 107, "cd": "eeee12", "name": "eeee12"}
    //     ]
    // }
    // *********************************/
    // action SaveLoiVosProc (sampleHeaders : array of SavedHeaders) returns array of SavedHeaders;

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
