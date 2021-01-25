namespace dp;

using util from '../../cm/util/util-model';

entity VI_Base_Price_Arl_requestor_his {
    key tenant_id       : String(5) not null;
    key approval_number : String(30) not null;
    key change_sequence : Decimal not null;
        changer_empno   : String(30) not null;
        creator_empno   : String(30) not null;
};
extend VI_Base_Price_Arl_requestor_his with util.Managed;

annotate VI_Base_Price_Arl_requestor_his with @title : '품의 요청자 이력'  @description : '품의 요청자 변경 이력 정보';
annotate VI_Base_Price_Arl_requestor_his with {
    tenant_id       @title : '테넌트ID'  @description : '테넌트ID';
    approval_number @title : '품의번호'  @description  : '품의번호';
    change_sequence @title : '변경순번'  @description  : '변경순번';
    changer_empno   @title : '변경자사번'  @description : '품의 담당자로 신규 할당받은 담당자사번';
    creator_empno   @title : '생성자사번'  @description : '품의 담당자를 이관한 담당자사번';
};
