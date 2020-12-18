namespace xx;

using {sap.common.CodeList as CodeList} from '@sap/cds/common';
using util from '../../cm/util-model';


type MessageType : Association to xx.common.MessageTypes;

context common {
  entity MessageTypes @(
    cds.autoexpose
  ) {
    key code: String(30) @(title : 'Message Type Code');
        code_name: String(100) @(title : 'Message Type Name');
  }
}

entity V4Message {
  key tenant_id         : String(5) not null  @title: '테넌트ID';
  key language_code     : String(30) not null @title: '언어코드';
  key message_code      : String(100) not null @title: '메시지코드';
      chain_code        : String(30) not null @title: '체인코드';
      message_type : xx.MessageType not null @title: '메시지타입코드';
      message_contents  : String(1000) not null @title: '메시지';
}
