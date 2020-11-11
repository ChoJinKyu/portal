using {ep as guarantee} from '../../../../db/cds/ep/guaranteeMgr/EP_GUARANTEE-model';

namespace ep;
@path : '/ep.guaranteeMgrService'
service GuaranteeMgrService {

    entity Guarantee as projection on guarantee.Guarantee;

}