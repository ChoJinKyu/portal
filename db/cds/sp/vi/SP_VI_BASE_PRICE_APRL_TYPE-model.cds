namespace sp;	

using util from '../../cm/util/util-model';

entity Vi_Base_Price_Aprl_Type {	
  key tenant_id : String(5)  not null;	
  key approval_number : String(50)  not null;	
      net_price_type_code : String(50)  not null;	

};

extend Vi_Base_Price_Aprl_Type with util.Managed;

annotate Vi_Base_Price_Aprl_Type with @title : '양산기준단가 유형'  @description : '양산기준단가 유형';

annotate Vi_Base_Price_Aprl_Type with {
    tenant_id                         @title : '테넌트ID'  @description             : '테넌트ID';
    approval_number                   @title : '품의번호'  @description             : '품의번호';
    net_price_type_code               @title : '단가유형코드'  @description         : '단가유형코드';

};