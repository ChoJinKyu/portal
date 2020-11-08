namespace xx;

using {User} from '@sap/cds/common';
using util from '../../util/util-model';

entity Message {
  key tenant_id         : String(5) not null  @title : '테넌트ID';
  key message_code      : String(30) not null @title : '메시지코드';
  key language_code     : String(30) not null @title : '언어코드';
      chain_code        : String(30) not null;
      message_type_code : String(30) not null;
      message_contents  : String(1000) not null;
}

extend Message with util.Managed;
