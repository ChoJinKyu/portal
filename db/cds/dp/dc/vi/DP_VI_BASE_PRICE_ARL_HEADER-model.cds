namespace dp;

using util from '../../../util/util-model';
using {dp.VI_Base_Price_Arl_Line as line} from './DP_VI_BASE_PRICE_ARL_LINE-model';


entity VI_Base_Price_Arl_Header {
    key tenant_id                : String(5) not null   @title : '테넌트ID';
    key arl_number               : String(100) not null @title : '품의서번호';
        company_code             : String(10) not null  @title : '회사코드';
        org_type_code            : String(30) not null  @title : '조직유형코드';
        org_code                 : String(10) not null  @title : '조직코드';
        arl_type_code            : String(30) not null  @title : '품의서유형코드';
        new_change_code          : String(30) not null  @title : '신규변경코드';
        arl_status_code          : String(30) not null  @title : '품의서상태';
        approval_request_desc    : String(3000)         @title : '승인요청설명';
        approval_requester_empno : String(30) not null  @title : '승인작성자사번';
        approval_request_date    : Date                 @title : '승인요청일자';
        attached_file_no         : String(30)           @title : '첨부파일No';

        children                 : Composition of many line
                                       on  children.tenant_id  = tenant_id
                                       and children.arl_number = arl_number;
}

extend VI_Base_Price_Arl_Header with util.Managed;
