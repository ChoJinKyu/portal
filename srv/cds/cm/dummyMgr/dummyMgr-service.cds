using { cm as dummyMgr } from '../../../../db/cds/cm/dummyMgr/CM_DUMMY-model';
using { cm as copyMgr } from '../../../../db/cds/cm/dummyMgr/CM_COPY-model';

namespace cm;

service DummyMgrService {

    entity Dummy as projection on dummyMgr.Dummy; 
    entity Copy as projection on copyMgr.Copy;

}