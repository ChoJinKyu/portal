namespace sp;

@cds.persistence.exists
entity Se_Eval_Sheet_Eval_Item_Opt_view {
    key tenant_id           : String(5) not null @title: '테넌트ID';
    key company_code        : String(10) not null @title: '회사코드';
    key org_type_code       :String(2) not null @title:'운영조직유형코드';
    key org_code            : String(10) not null @title: '운영조직코드';
    key evaluation_operation_unit_code    : String(30) not null @title: '운영단위코드';
    evaluation_type_code    : String(30) not null @title: '평가유형코드';
    evaluation_article_code : String(30) not null @title: '평가항목코드';
    scle_display_text1      : String(100) @title: 'Scale1구간';
    opt_range_value1        : Decimal @title: 'Scale1 Range 값';
    scle_display_text2      : String(100) @title: 'Scale2구간';
    opt_range_value2        : Decimal @title: 'Scale2 Range 값';
    scle_display_text3      : String(100) @title: 'Scale3구간';
    opt_range_value3        : Decimal @title: 'Scale3 Range 값';
    scle_display_text4      : String(100) @title: 'Scale4구간';
    opt_range_value4        : Decimal @title: 'Scale4 Range 값';
    scle_display_text5      : String(100) @title: 'Scale5구간';
    opt_range_value5        : Decimal @title: 'Scale5 Range 값';
    scle_display_text6      : String(100) @title: 'Scale6구간';
    opt_range_value6        : Decimal @title: 'Scale6 Range 값';
    scle_display_text7      : String(100) @title: 'Scale7구간';
    opt_range_value7        : Decimal @title: 'Scale7 Range 값';
    scle_display_text8      : String(100) @title: 'Scale8구간';
    opt_range_value8        : Decimal @title: 'Scale8 Range 값';
    scle_display_text9      : String(100) @title: 'Scale9구간';
    opt_range_value9        : Decimal @title: 'Scale9 Range 값';
    scle_display_text10     : String(100) @title: 'Scale10구간';
    opt_range_value10       : Decimal @title: 'Scale10 Range 값';
}