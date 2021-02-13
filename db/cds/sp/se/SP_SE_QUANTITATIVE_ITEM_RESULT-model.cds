namespace sp;	
using util from '../../cm/util/util-model'; 

entity Se_Quantitative_Item_Result {
    key tenant_id                : String(5) not null  @title : '테넌트ID';
    key company_code             : String(10) not null @title : '회사코드';
    key org_type_code            : String(2) not null  @title : '조직유형코드';
    key org_code                 : String(10) not null @title : '조직코드';
    key supplier_code            : String(10) not null @title : '공급업체코드';
    key qttive_item_code         : String(15) not null @title : '정량항목코드';
    key qttive_item_create_date  : String(8) not null  @title : '정량항목생성일자';
        qttive_item_actual_value : String(100)         @title : '정량항목실적값';
        qttive_item_type_value   : String(10)          @title : '정량항목유형값';
}	
extend Se_Quantitative_Item_Result with util.Managed;