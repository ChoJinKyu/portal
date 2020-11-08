namespace xx;

using {xx as messageMgr} from '../../../db/cds/xx/messageMgr/XX_MESSAGE-model';

@path : '/xx.MessageMgrService'
service MessageMgrService {

    entity Message as projection on messageMgr.Message;

}

annotate MessageMgrService.Message with @(
  UI: {
    SelectionFields: [ tenant_id, message_code, language_code, chain_code, message_type_code, message_contents ],
    LineItem: [
      { Value: language_code, Label: 'Languate Code'},
      { Value: message_code, Label:'Message Code'},
      { Value: chain_code, Label:'Chain' },
      { Value: message_type_code, Label:'Message Type Code' },
      { Value: message_contents, Label:'Content'},
    ]
  }
);
