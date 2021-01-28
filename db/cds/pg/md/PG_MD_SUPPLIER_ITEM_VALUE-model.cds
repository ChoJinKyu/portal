namespace pg;

using util from '../../cm/util/util-model';


entity Md_Supplier_Item_Value {
    key tenant_id            : String(5) not null  @title : '테넌트ID';
    key company_code         : String(10) not null @title : '회사코드';
    key org_type_code        : String(30) not null @title : '조직유형코드';
    key org_code             : String(10) not null @title : '조직코드';
    key supplier_code        : String(10) not null @title : '공급업체코드';
        supplier_nickname    : String(100)         @title : '공급업체별칭';
        info_input_type_code : String(30)          @title : '정보입력구분코드';
        spmd_attr_001        : String(100)         @title : 'spmd_attr_001';
        spmd_attr_002        : String(100)         @title : 'spmd_attr_002';
        spmd_attr_003        : String(100)         @title : 'spmd_attr_003';
        spmd_attr_004        : String(100)         @title : 'spmd_attr_004';
        spmd_attr_005        : String(100)         @title : 'spmd_attr_005';
        spmd_attr_006        : String(100)         @title : 'spmd_attr_006';
        spmd_attr_007        : String(100)         @title : 'spmd_attr_007';
        spmd_attr_008        : String(100)         @title : 'spmd_attr_008';
        spmd_attr_009        : String(100)         @title : 'spmd_attr_009';
        spmd_attr_010        : String(100)         @title : 'spmd_attr_010';
        spmd_attr_011        : String(100)         @title : 'spmd_attr_011';
        spmd_attr_012        : String(100)         @title : 'spmd_attr_012';
        spmd_attr_013        : String(100)         @title : 'spmd_attr_013';
        spmd_attr_014        : String(100)         @title : 'spmd_attr_014';
        spmd_attr_015        : String(100)         @title : 'spmd_attr_015';
        spmd_attr_016        : String(100)         @title : 'spmd_attr_016';
        spmd_attr_017        : String(100)         @title : 'spmd_attr_017';
        spmd_attr_018        : String(100)         @title : 'spmd_attr_018';
        spmd_attr_019        : String(100)         @title : 'spmd_attr_019';
        spmd_attr_020        : String(100)         @title : 'spmd_attr_020';
        spmd_attr_021        : String(100)         @title : 'spmd_attr_021';
        spmd_attr_022        : String(100)         @title : 'spmd_attr_022';
        spmd_attr_023        : String(100)         @title : 'spmd_attr_023';
        spmd_attr_024        : String(100)         @title : 'spmd_attr_024';
        spmd_attr_025        : String(100)         @title : 'spmd_attr_025';
        spmd_attr_026        : String(100)         @title : 'spmd_attr_026';
        spmd_attr_027        : String(100)         @title : 'spmd_attr_027';
        spmd_attr_028        : String(100)         @title : 'spmd_attr_028';
        spmd_attr_029        : String(100)         @title : 'spmd_attr_029';
        spmd_attr_030        : String(100)         @title : 'spmd_attr_030';
        spmd_attr_031        : String(100)         @title : 'spmd_attr_031';
        spmd_attr_032        : String(100)         @title : 'spmd_attr_032';
        spmd_attr_033        : String(100)         @title : 'spmd_attr_033';
        spmd_attr_034        : String(100)         @title : 'spmd_attr_034';
        spmd_attr_035        : String(100)         @title : 'spmd_attr_035';
        spmd_attr_036        : String(100)         @title : 'spmd_attr_036';
        spmd_attr_037        : String(100)         @title : 'spmd_attr_037';
        spmd_attr_038        : String(100)         @title : 'spmd_attr_038';
        spmd_attr_039        : String(100)         @title : 'spmd_attr_039';
        spmd_attr_040        : String(100)         @title : 'spmd_attr_040';
        spmd_attr_041        : String(100)         @title : 'spmd_attr_041';
        spmd_attr_042        : String(100)         @title : 'spmd_attr_042';
        spmd_attr_043        : String(100)         @title : 'spmd_attr_043';
        spmd_attr_044        : String(100)         @title : 'spmd_attr_044';
        spmd_attr_045        : String(100)         @title : 'spmd_attr_045';
        spmd_attr_046        : String(100)         @title : 'spmd_attr_046';
        spmd_attr_047        : String(100)         @title : 'spmd_attr_047';
        spmd_attr_048        : String(100)         @title : 'spmd_attr_048';
        spmd_attr_049        : String(100)         @title : 'spmd_attr_049';
        spmd_attr_050        : String(100)         @title : 'spmd_attr_050';

}


extend Md_Supplier_Item_Value with util.Managed;
