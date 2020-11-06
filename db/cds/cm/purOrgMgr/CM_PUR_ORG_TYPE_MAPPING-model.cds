namespace cm;
using { User } from '@sap/cds/common';
using util from '../../util/util-model';

entity Pur_Org_Type_Mapping {	
  key tenant_id : String(5)  not null @title: '테넌트ID';
  key company_code : String(10)  not null @title: '회사코드';
  key process_type_code : String(30)  not null @title: '프로세스유형코드';
    org_type_code : String(30)  not null @title: '조직유형코드';
    use_flag : Boolean  not null @title: '사용여부';
}	

extend Pur_Org_Type_Mapping with util.Managed;