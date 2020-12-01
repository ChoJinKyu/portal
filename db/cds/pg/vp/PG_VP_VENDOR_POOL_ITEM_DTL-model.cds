namespace pg;	
 
using util from '../../cm/util/util-model';
using {pg as mst} from './PG_VP_VENDOR_POOL_MST-model';

entity Vp_Vendor_Pool_Item_Dtl {	
  key tenant_id : String(5)  not null @title: '테넌트ID';
  key company_code : String(10)  not null @title: '회사코드';
  key org_type_code : String(2)  not null @title: '운영조직유형코드';
  key org_code : String(10)  not null @title: '운영조직코드';
  key vendor_pool_code : String(20)  not null @title: '협력사풀코드';
  key material_code : String(40)  not null @title: '자재코드';
    vendor_pool_mapping_use_flag : Boolean   @title: '협력사풀매핑사용여부';
    register_reason : String(50)   @title: '등록사유';
    approval_number : String(50)   @title: '품의번호';
    
    ref : Association to mst.Vp_Vendor_Pool_Mst on ref.tenant_id = tenant_id and 
                                                ref.company_code = company_code and 
                                                ref.org_type_code = org_type_code and
                                                ref.org_code = org_code and
                                                ref.vendor_pool_code = vendor_pool_code;
                                                 	
}

extend Vp_Vendor_Pool_Item_Dtl with util.Managed;