namespace dp;

using util from '../../cm/util/util-model';

// 자산
entity Md_Repair_Cost_Config {
    key tenant_id : String(5)  not null                     @title : '테넌트ID';	
    key company_code : String(10)  not null                 @title : '회사코드';	
    key org_code : String(10)  not null                     @title : '조직코드';	
    key item_type : String(30)  not null                    @title : '항목구분(Labor Cost : P, Material Cost : M)';	
    key item_code : String(30)  not null                    @title : '항목코드';	
    key item_size : String(100)  not null                   @title : '항목크기';	
        item_sequence : Integer  not null                   @title : '품목순번';	
        item_name : String(100)  not null                   @title : '항목명';	
        net_price : Decimal  not null                       @title : '단가';		
}

extend Md_Repair_Cost_Config with util.Managed;
