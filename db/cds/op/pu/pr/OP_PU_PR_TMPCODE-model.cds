namespace op;	

entity Pu_Pr_TMPCODE {	 
        key pr_type_code			: String(30)     not null	 @title: '구매요청유형코드';
        key pr_template_number		: String(10)     not null	 @title: '구매요청템플릿번호';
    }	

