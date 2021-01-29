namespace sp;
@path : '/sp.evalSupplierMgtV4Service'
service EvalSupplierMgtV4Service { 

    type rtnMsg : {
        return_code: String(2);
 	    return_msg: String(1000);
    } 

    action CreateEvalSupplierProc (tenant_id : String(5),
                                   user_id : String(30)) returns array of rtnMsg;

}