using {ep as guarantee} from '../../../../db/cds/ep/po/EP_GI_GUARANTEE-model';

namespace ep;
@path : 'ep.guaranteeMgtService'
service GuaranteeMgtService {

    entity Guarantee as projection on guarantee.Gi_Guarantee;

}