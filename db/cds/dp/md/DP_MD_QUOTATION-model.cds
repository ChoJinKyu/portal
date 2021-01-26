namespace dp;

using util from '../../cm/util/util-model';

entity Md_Quotation {
    key tenant_id           : String(5)     not null                @title : '테넌트ID';
    key mold_id             : String(100)   not null                @title: '금형ID' ;	
    key supplier_code       : String(10)    not null                @title: '공급업체코드' ;	
    key approval_number     : String(30)    not null                @title: '품의번호' ;	
    sequence                : Integer       not null                @title: '순번' ;	
    quotation_status_code   : String(30)                            @title: '견적상태코드' ;	
    quotation_amount        : Decimal(20,2) default 0 not null      @title: '견적금액' ;	
    mcst                    : Decimal(20,2) default 0 not null      @title: '재료비' ;	
    pcst                    : Decimal(20,2) default 0 not null      @title: '가공비' ;	
    profit                  : Decimal(20,2) default 0 not null      @title: '이익' ;	
    packing_cost            : Decimal(20,2) default 0 not null      @title: '포장비' ;	
    biz_trip_cost           : Decimal(20,2) default 0 not null      @title: '출장비' ;	
    spare_part_cost         : Decimal(20,2) default 0 not null      @title: '예비품비' ;	
    remark                  : String(3000)                          @title: '비고' ;	

}

extend Md_Quotation with util.Managed;