namespace xx;

using {xx as message} from '../../../db/cds/xx/template/XX_MESSAGE-model';
using {xx as controlOptionMgr} from '../../../db/cds/xx/template/XX_CONTROL_OPTION_DTL-model';

@path : '/xx.TemplateService'
service TemplateService {

    entity Message as projection on message.Message;
    entity ControlOptionMasters as projection on controlOptionMgr.Control_Option_Mst;
    entity ControlOptionDetails as projection on controlOptionMgr.Control_Option_Dtl;

}

annotate TemplateService.Message with @(
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
