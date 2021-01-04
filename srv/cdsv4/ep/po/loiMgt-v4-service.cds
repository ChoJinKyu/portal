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

    // (단일 Header에 multi Detail) 가 multi
    // Test 데이터
    /*********************************
    {
        "inputData": [
            {
                "header_id" : 103,
                "cd" : "CD103",
                "name": "NAME103",
                "details": [
                    {"detail_id" : 1003, "header_id" : 103, "cd" : "CD1003", "name": "NAME1003"},
                    {"detail_id" : 1004, "header_id" : 103, "cd" : "CD1004", "name": "NAME1004"}
                ]
            },
            {
                "header_id" : 104,
                "cd" : "CD104",
                "name": "NAME104",
                "details": [
                    {"detail_id" : 1005, "header_id" : 104, "cd" : "CD1003", "name": "NAME1005"},
                    {"detail_id" : 1006, "header_id" : 104, "cd" : "CD1004", "name": "NAME1006"}
                ]
            }
        ]
    }
    *********************************/

    type SavedDetails : {
        tenant_id : String;
        company_code : String;
        loi_write_number: String;
        loi_item_number: String;
    };

    type hdSaveType {
        tenant_id : String;
        company_code : String;
        loi_selection_number : String;
        loi_selection_title: String;
        loi_selection_status_code: String;
        special_note: String;
        attch_group_number: String;
        approval_number: String;
        buyer_empno: String;
        purchasing_department_code: String;
        remark: String;
        org_type_code: String;
        org_code: String;   
        user_id: String;     
        details:  array of SavedDetails;
    }

    //LOI업체선정 등록 - 항목의 업체선정번호 null처리
    action SaveLoiSupplySelectionProc (inputData : hdSaveType) returns String;   

    type lssDelType {
        tenant_id : String;
        company_code : String;
        loi_selection_number : String;
        user_id: String;     
        details:  array of SavedDetails;
    }

    //LOI업체선정 삭제 - 항목의 업체선정번호 null처리
    action DeleteLoiSupplySelectionProc (inputData : lssDelType) returns String;       

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
    
    action SaveLoiRmkProc(
        tenant_id : String(5),
        company_code : String(10),
        loi_write_number: String(50),
        loi_item_number: String(50),
        remark: String(3000)
    ) returns String;       


    type SavedHeaders : {
        tenant_id                   : String;
        company_code                : String;
        loi_write_number            : String;
        loi_number                  : String;
        loi_request_title           : String;
        loi_publish_purpose_desc    : String;
        special_note                : String;
        requestor_empno             : String;
        request_department_code     : String;
       // request_date                : Date;
        
    };

    type SavedReqDetails : {
        tenant_id           : String;
        company_code        : String;
        loi_write_number    : String;
        loi_item_number     : String;
        item_sequence       : String;
        ep_item_code        : String;
        item_desc           : String;
        unit                : String;
        request_quantity    : String;
        currency_code       : String;
        request_amount      : String;
        supplier_code       : String;
        buyer_empno         : String;
        remark              : String;
        row_state           : String;
    };


    // Procedure 호출해서 header/Detail 저장
    // Header 단건, Detail multi
    // Test 데이터
    /*********************************
    {
        "inputData" : {
            "savedHeaders" : [
               {"tenant_id":"1000", "company_code":"C100", "loi_write_number":"121000000001", "loi_number":"LOI2020-001", "loi_request_title":"LOI 1st", "loi_publish_purpose_desc":"test"},
            
            ],
            "savedReqDetails" : [
                {"tenant_id":"1000", "company_code":"C100", "loi_write_number":"121000000001", "loi_item_number":"1", "item_sequence":"10", "ep_item_code":"itemcode1", "item_desc":"itemcode1", "unit":"EA", "request_quantity":"2", "currency_code":"KRW", "request_amount":"10000", "buyer_empno":"", "remark":"remark01"},
                {"tenant_id":"1000", "company_code":"C100", "loi_write_number":"121000000001", "loi_item_number":"2", "item_sequence":"20", "ep_item_code":"itemcode1", "item_desc":"itemcode1", "unit":"EA", "request_quantity":"2", "currency_code":"KRW", "request_amount":"10000", "buyer_empno":"", "remark":"remark02"},
                {"tenant_id":"1000", "company_code":"C100", "loi_write_number":"121000000001", "loi_item_number":"3", "item_sequence":"30", "ep_item_code":"itemcode1", "item_desc":"itemcode1", "unit":"EA", "request_quantity":"2", "currency_code":"KRW", "request_amount":"10000", "buyer_empno":"", "remark":"remark03"}
            
            
            ]
        }
    }
    *********************************/
    type saveReturnType {
        savedHeaders : array of SavedHeaders;
        savedReqDetails : array of SavedReqDetails;
    }

    action SaveLoiRequestMultiEntitylProc (inputData : saveReturnType) returns saveReturnType; 

    
    type DeleteDetails : {
        tenant_id : String;
        company_code : String;
        loi_write_number: String;
        loi_item_number: String;
    };
    
    type reqMulDelType {
        tenant_id : String;
        company_code : String;
        loi_write_number : String; 
    }

    type reqDelType {
        tenant_id : String;
        company_code : String;
        loi_write_number : String; 
        details:  array of DeleteDetails;
    }

    //LOI 발행요청 MST & DTL 삭제
    action DeleteLoiMulEntityProc (inputData : reqMulDelType) returns String;     


}
