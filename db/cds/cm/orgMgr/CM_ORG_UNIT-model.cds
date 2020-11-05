namespace cm;
using { User } from '@sap/cds/common';
using util from '../../util/util-model';


entity Org_Unit {
  key tenant_id : String(5)  not null @title: '테넌트ID';
  key bizunit_code : String(10)  not null @title: '사업본부코드';
    bizunit_name : String(240)  not null @title: '사업본부명';
    use_flag : Boolean not null @title: '사용여부'; 
}

extend Org_Unit with util.Managed;