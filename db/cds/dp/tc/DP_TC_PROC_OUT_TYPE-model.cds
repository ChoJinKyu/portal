namespace dp;

@cds.persistence.exists
entity Dp_Tc_Proc_Out_Type {
    return_code : String(2)   @title : '리턴코드';
    return_msg  : String(5000)@title : '리턴메시지';
}
