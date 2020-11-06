namespace cm;
using { User } from '@sap/cds/common';
using util from '../../util/util-model';


entity Org_Purchasing {
    key tenant_id           : String(5)  not null @title: '테넌트ID';
    key purchase_org_code   : String(10)  not null @title: '구매조직코드';
    purchase_org_name : String(240)  not null @title: '구매조직명';
    use_flag : Boolean not null @title: '사용여부'; 
}

extend Org_Purchasing with util.Managed;