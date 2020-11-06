namespace cm;
using { User } from '@sap/cds/common';
using util from '../../util/util-model';

entity Pur_Operation_Org {	
  key tenant_id : String(5)  not null @title: '테넌트ID';	
  key company_code : String(10)  not null @title: '회사코드';
  key org_type_code : String(30)  not null @title: '조직유형코드';
  key operation_org_code : String(10)  not null @title: '운영조직코드';	
    operation_org_name : String(10)  not null @title: '운영조직명';
    purchase_org_code : String(10) @title: '구매조직코드';
    plant_code : String(10) @title: '플랜트코드';
    affiliate_code : String(10) @title: '관계사코드';
    bizdivision_code : String(10) @title: '사업부코드';
    bizunit_code : String(10) @title: '사업본부코드';
    au_code : String(10) @title: 'AU코드';
    hq_au_code : String(10) @title: 'HQAU코드';
    use_flag : Boolean  not null @title: '사용여부';
}	

extend Pur_Operation_Org with util.Managed;