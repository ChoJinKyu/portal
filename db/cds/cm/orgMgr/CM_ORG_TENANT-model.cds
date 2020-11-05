namespace cm;
using { User } from '@sap/cds/common';
using util from '../../util/util-model';


entity Org_Tenant {
  key tenant_id : String(5)  not null @title: '테넌트ID';
    tenant_name : String(240)  not null @title: '테넌트명';
    use_flag : Boolean not null @title: '사용여부';
}

extend Org_Tenant with util.Managed;
