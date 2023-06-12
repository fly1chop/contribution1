<%@ include file = "./common.jsp" %>


<%
	this.proc_input(request);  
	
	this.out_vl = new VariableList();
	this.out_dl = new DatasetList();  
  
  Dataset ds_out = null;
  
  String strWorkGu = "";
  String strYear, strMonth;
  String strName, strbgu1, strbgu2;
  
  
  if(in_vl !=null){
  
    // 필수 구분자
    strWorkGu = in_vl.getValueAsString("workgu");
    
    // Query 조건 인자
  	strYear   = in_vl.getValueAsString("bYear");
  	strName   = in_vl.getValueAsString("bName");
  	strbgu1   = in_vl.getValueAsString("bGu1");
  	strbgu2   = in_vl.getValueAsString("bGu2");
  	
  } else{
		//System.out.println("in_vl:"+in_vl);
		strYear = "";
		strName = "";
		strbgu1 = strbgu2 = strMonth = "";
	}
	
	//strWorkGu = "find";
	
	try {	
	
	  conn = connDB_MSSQL();
	  
		if(conn!=null)
		{
			
			
			if ( strWorkGu.equals("find") )
      {
	      //System.out.println("function Query1 _____________ : "  + strSlipDate);
	      
	      ds_out = fn_list( conn, strYear, strName, strbgu1, strbgu2 );
	      this.out_dl.addDataset("DS_LIST", ds_out );
	      
	      
	    } else
			{
	      System.out.println("작업 구분자가 없습니다. ____________" );
			  //this.setResultMessage(-5, "작업 구분자가 없습니다.");
			  //this.proc_output(response,out); 
			  //response.End;
			}
			
		}
		this.setResultMessage(0, "OK");
	
	} catch(Exception ex) {
    this.setResultMessage(-1, ex.toString());
	} finally {
		if(rs != null) {
			try {
				rs.close();
			}catch(Exception e) {}
		}
		if(pstmt != null) {
			try {
				pstmt.close();
			}catch(Exception e) {}
		}
		if(conn != null) {
			try {
				conn.close();
			}catch(Exception e) {}
		}
	}
    this.proc_output(response,out); 
%>



<%! 


// 후원금 납입내역
public Dataset fn_list(Connection conn, String strYear, String strName, String strbgu1, String strbgu2 )
{
  PreparedStatement pstmt = null;
  ResultSet rs = null;
  Dataset ds = null;
  
	StringBuffer sbSql = new StringBuffer();
	
	sbSql.append("\n select b.b_no, b.b_name, sum(a.b_in_amt) as b_in_amt,  ");
	sbSql.append("\n 		sum(case when a.b_month = '01' then b_in_amt end) as mon_1,  ");
	sbSql.append("\n 		sum(case when a.b_month = '02' then b_in_amt end) as mon_2,  ");
	sbSql.append("\n 		sum(case when a.b_month = '03' then b_in_amt end) as mon_3,  ");
	sbSql.append("\n 		sum(case when a.b_month = '04' then b_in_amt end) as mon_4,  ");
	sbSql.append("\n 		sum(case when a.b_month = '05' then b_in_amt end) as mon_5,  ");
	sbSql.append("\n 		sum(case when a.b_month = '06' then b_in_amt end) as mon_6,  ");
	sbSql.append("\n 		sum(case when a.b_month = '07' then b_in_amt end) as mon_7,  ");
	sbSql.append("\n 		sum(case when a.b_month = '08' then b_in_amt end) as mon_8,  ");
	sbSql.append("\n 		sum(case when a.b_month = '09' then b_in_amt end) as mon_9,  ");
	sbSql.append("\n 		sum(case when a.b_month = '10' then b_in_amt end) as mon_10,  ");
	sbSql.append("\n 		sum(case when a.b_month = '11' then b_in_amt end) as mon_11,  ");
	sbSql.append("\n 		sum(case when a.b_month = '12' then b_in_amt end) as mon_12  ");
	//sbSql.append("\n   from backer_member b left outer join backer_money a on a.b_no = b.b_no  ");
	sbSql.append("\n   from backer_money a, backer_member b");
	sbSql.append("\n  where a.b_no = b.b_no  ");
	sbSql.append("\n    and a.b_year = '" + strYear + "'  ");
	sbSql.append("\n    and b.b_gu like '" + strbgu1 + "'  ");
	sbSql.append("\n    and ifnull(b.b_gu2,'') like '" + strbgu2 + "'  ");
	sbSql.append("\n    and b.b_name like '" + strName + "%'  ");
	sbSql.append("\n  group by b.b_no, b.b_name  ");
	
  System.out.println(sbSql.toString());
  
  try {	
  	pstmt = conn.prepareStatement(sbSql.toString());
  	rs = pstmt.executeQuery();
  	
    ds = makeDataSet(rs,"output");
  	
  } catch(Exception ex) {
    this.setResultMessage(-1, ex.toString());
  }
	  
  return ds;
}

%>
