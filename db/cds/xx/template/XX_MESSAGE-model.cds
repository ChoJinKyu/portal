using util from '../../cm/util/util-model';

namespace xx;

entity Message {
    key tenant_id         : String(5) not null    @title : '테넌트ID';
    key message_code      : String(100) not null  @title : '메시지코드';
    key language_code     : String(30) not null   @title : '언어코드';
        chain_code        : String(30) not null   @title : '체인코드';
        message_type_code : String(30) not null   @title : '메시지타입코드';
        message_contents  : String(1000) not null @title : '메시지';
}

extend Message with util.Managed;

/*
extend Message with Managed_Local;
aspect Managed_Local {
    test_dtm: DateTime null @cds.on.update: $local_now @title: '로컬등록시간';
}
*/
