namespace tmp; 
entity CC_SCR001_TEMP
{
    key SCRID :String(50) not null @title: '#화면번호' ;
    SCR_NAME :String(50) not null @title: '화면명' ;
}