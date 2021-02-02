namespace sp;	

using util from '../../cm/util/util-model';

entity Vi_Base_Price_Aprl_Dtl {	
  key tenant_id                      : String(5)  not null;	
  key approval_number                : String(50)  not null;	
  key item_sequence                  : Decimal  not null;	
  key metal_type_code                : String(30)  not null;	
      metal_net_price                : Decimal(19,4)  ;	

};

extend Vi_Base_Price_Aprl_Dtl with util.Managed;

annotate Vi_Base_Price_Aprl_Dtl with @title : '양산가 품의 메탈상세'  @description : '양산가 품의 메탈상세';

annotate Vi_Base_Price_Aprl_Dtl with {
    tenant_id                         @title : '테넌트ID'  @description            : '테넌트ID';
    approval_number                   @title : '품의번호'  @description            : '품의번호';
    item_sequence                     @title : '품목순번'  @description            : '품목순번';
    metal_type_code                   @title : '메탈구분코드'  @description         : '공통코드(CM_CODE_DTL, SP_VI_METAL_TYPE_CODE)  ';
    metal_net_price                   @title : '메탈단가'  @description             : '메탈단가';
};