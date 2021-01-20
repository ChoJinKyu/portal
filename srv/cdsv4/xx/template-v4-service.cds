namespace xx;

using {xx.V4Message as message} from '../../../db/cds/xx/template/XX_V4_MESSAGE-model';

@path : '/xx.TemplateV4Service'
service TemplateV4Service {

    entity Message as projection on message;

}
