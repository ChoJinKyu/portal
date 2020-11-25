namespace xx;

using {User} from '@sap/cds/common';
using util from '../../util/util-model';

entity Message {
  key tenant_id         : String(5) not null  @title: '테넌트ID';
  key language_code     : String(30) not null @title: '언어코드';
  key message_code      : String(100) not null @title: '메시지코드';
      chain_code        : String(30) not null @title: '체인코드';
      group_code        : String(100) null     @title: '그룹코드';
      message_type_code : String(30) not null @title: '메시지타입코드';
      message_contents  : String(1000) not null @title: '메시지';
}
extend Message with util.Managed;
