package lg.sppCap.frame.dto.cm;


public class FileQueryDto {
    private String result; 
    private String records;
    
	public FileQueryDto(String result, String records) {
        this.result = result;
        this.records = records;
    }
    
    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getRecords() {
        return records;
    }

    public void setRecords(String records) {
        this.records = records;
    }
    

    

}
