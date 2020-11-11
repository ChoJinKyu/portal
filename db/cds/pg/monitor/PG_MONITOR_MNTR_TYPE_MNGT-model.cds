namespace pg;

using util from '../../util/util-model';

using { pg as Monitoring_Type_Management } from '../monitor/PG_MONITOR_MNTR_TYPE_MNGT-model';

entity Monitor_Mntr_Type_Mngt : util.Managed
{
    key company_code : String(10)
        @title : '회사코드';
    key scenario_code : String(10)
        @title : '시나리오';
    key tenant_id : String(5)
        @title : '테넌트ID';
    key type_management_header : Integer64
        @title : '유형 관리 Hearder';
    key type_management_item : Integer64
        @title : '유형 관리 Item';
    language_code : String(10)
        @title : '언어코드';
    type : String(10)
        @title : '유형';
    type_text : String(300)
        @title : '유형 내역';
}

annotate Monitor_Mntr_Type_Mngt with @Core.AcceptableMediaTypes : 
[
    ''
];
