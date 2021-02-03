namespace op;

using util from '../../../cm/util/util-model';
using { op.Pu_Pr_Dtl as dtl } from './OP_PU_PR_DTL-model';

entity Pu_Pr_Dtl_His {

    key tenant_id                   : String(5)     not null    @title: '테넌트id';
    key company_code                : String(10)    not null    @title: '회사코드';
    key pr_number                   : String(50)    not null    @title: '구매요청번호';
    key pr_item_number              : Integer64     not null    @title: '구매요청품목번호';
    key sequence                    : Integer64     not null    @title: '순번(품목별순번)';

        dtl : Association to dtl
            on dtl.tenant_id = tenant_id
            and dtl.company_code  =  company_code
            and dtl.pr_number  =  pr_number
            and dtl.pr_item_number  =  pr_item_number;

        job_type_code               : String(30)    not null    @title: '업무유형코드(재작성요청(REWRITE), 마감(CLOSING), 마감취소(CLOSING_CANCEL), 구매담당자변경(CHANGE), RFQ작성(RFQ) 등)';
        before_desc                 : String(50)                @title: '변경전내역';
        after_desc                  : String(50)                @title: '변경후내역';
        remark                      : String(3000)              @title: '처리사유';
    }

extend Pu_Pr_Dtl_His with util.Managed;
