namespace cm;
using { User } from '@sap/cds/common';
using util from '../../util/util-model';


entity Org_Division {
  key tenant_id : String(5)  not null @title: '테넌트ID';
  key bizdivision_code : String(10)  not null @title: '사업부코드';
    bizdivision_name : String(240)  not null @title: '사업부명';
    bizunit_code : String(10)  @title: '사업본부코드';
    use_flag : Boolean not null @title: '사용여부';
}

extend Org_Division with util.Managed;