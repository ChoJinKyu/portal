namespace cm;

using util from './util/util-model';
using {cm as master} from './CM_CODE_MST-model';
using {cm as language} from './CM_CODE_LNG-model';

entity Code_Dtl {

    key tenant_id           : String(5) not null        @title : '테넌트ID';
    key group_code          : String(30) not null       @title : '그룹코드';

        parent              : Association to master.Code_Mst
                                on  parent.tenant_id  = tenant_id
                                and parent.group_code = group_code;

        children            : Composition of many language.Code_Lng
                                on  children.tenant_id  = tenant_id
                                and children.group_code = group_code
                                and children.code       = code;

    key code                : String(30) not null       @title : '코드';
        code_description    : String(300) not null      @title : '코드설명';
        sort_no             : Decimal not null          @title : '정렬번호';
        start_date          : Date not null             @title : '시작일';
        end_date            : Date not null             @title : '종료일';
        parent_group_code   : String(30) null           @title : '상위그룹코드';
        parent_code         : String(30) null           @title : '상위코드';
        remark              : String(500) null          @title : '비고';
        color_type_code     : String(30) null           @title : '색상구분코드';

}

extend Code_Dtl with util.Managed;
