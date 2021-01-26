namespace dp;

using util from '../../cm/util/util-model';

// 금형진행상태
entity Md_Progress_Status {
    key tenant_id                     : String(5) not null   @title : '테넌트ID';
    key mold_id                       : String(100) not null @title : '금형ID';
    key prog_status_change_seq        : Integer not null     @title : '상태변경순번';
        prog_status_code              : String(30) not null  @title : '금형진행상태코드';
        prog_status_change_date       : String(8) not null   @title : '상태변경일자';
        prog_status_changer_empno     : String(30) not null  @title : '상태변경자사번';
        prog_status_changer_dept_code : String(30)           @title : '상태변경자조직코드';
        remark                        : String(3000)         @title : '비고';
}

extend Md_Progress_Status with util.Managed;
