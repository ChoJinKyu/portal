namespace dp;

using util from '../../cm/util/util-model';

// 자산
entity Md_Repair_Cost {
    key tenant_id : String(5)  not null                     @title : '테넌트ID';	
    key repair_request_number : String(100)  not null       @title : '수선요청번호';	
    key repair_supplier_code : String(10)  not null         @title : '수선공급업체코드';	
    key repair_sequence : Integer  not null                 @title : '수선순번';	
        item_type : String(30)                              @title : '항목구분';	
        item_code : String(30)                              @title : '항목코드';	
        item_name : String(100)                             @title : '항목명';	
        item_size : String(100)                             @title : '항목크기';	
        quotation_quantity : Decimal                        @title : '견적수량';	
        quotation_net_price : Decimal                       @title : '견적단가';	
        quotation_amount : Decimal                          @title : '견적금액';	
        agreement_quantity : Decimal                        @title : '합의수량';	
        agreement_net_price : Decimal                       @title : '합의단가';	
        agreement_amount : Decimal                          @title : '합의금액';	
        tran_tonnage : Decimal                              @title : '운송톤수';	
        tran_count : Decimal                                @title : '운송건수';	
        tran_amount : Decimal                               @title : '운송금액';	
}

extend Md_Repair_Cost with util.Managed;
