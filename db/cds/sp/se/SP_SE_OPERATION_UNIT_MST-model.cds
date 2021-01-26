namespace sp;	
using util from '../../cm/util/util-model';  
using {sp as mapping} from './SP_SE_OPERATION_UNIT_MAP-model';		
	
entity Se_Operation_Unit_Mst {	
  key tenant_id                        : String(5)  not null @title: '테넌트ID' ;	
  key company_code                     : String(10) not null @title: '회사코드' ;	
  key org_type_code                    : String(2)  not null @title: '구매운영조직유형' ;	
  key org_code                         : String(10) not null @title: '구매운영조직코드' ;	
  key evaluation_operation_unit_code   : String(30) not null @title: '평가운영단위코드' ;
      evaluation_operation_unit_name   : String(50)          @title: '평가운영단위명' ;	
      distrb_score_eng_flag            : Boolean             @title: '배점셜계여부' ;	
      evaluation_request_mode_code     : String(30)          @title: '평가요청방식코드' ;	
      evaluation_request_approval_flag : Boolean             @title: '평가요청품의여부' ;	
      operation_plan_flag              : Boolean             @title: '운영계획여부' ;	
      eval_apply_vendor_pool_lvl_no    : Decimal             @title: '평가적용협력사풀레벨번호' ;
      use_flag                         : Boolean             @title: '사용여부';
}	
extend Se_Operation_Unit_Mst with util.Managed;	
