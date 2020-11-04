namespace cm;

using util from '../../util/util-model';
using { cm as master } from './CM_CONTROL_OPTION_MST-model';

entity Control_Option_Dtl {
    
    key tenant_id: String(5) not null @title: '테넌트ID';
    key control_option_code: String(30) @title: '제어옵션코드';
    
    parent: Association to master.Control_Option_Mst
        on parent.tenant_id = tenant_id 
        and parent.control_option_code = control_option_code;

    key control_option_level_code: String(30) not null @title: '제어옵션레벨코드';
    key control_option_level_val: String(100) not null @title: '제어옵션레벨값';
    control_option_val: String(100) not null @title: '제어옵션값';
    
}

extend Control_Option_Dtl with util.Managed;