namespace ep;


using {ep as test} from '../../../../db/cds/ep/testMgr/EP_TEST_MST-model';

@path : '/ep.testMgrService'
service TestMgrService {

    entity TestMstEtty as projection on test.Test_Mst;

}