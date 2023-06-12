<%@ include file = "./common.jsp" %>


<%
	this.proc_input(request);
	
	this.out_vl = new VariableList();
	this.out_dl = new DatasetList();  
  
  Dataset ds_out = null;
  String strWorkGu = "";
  
  String strYear;
  String strNo;
  
  strYear = strNo = "";
  
  if(in_vl !=null){
  
    // 필수 구분자
    strWorkGu = in_vl.getValueAsString("workgu");
    
    // Query 조건 인자
  	strYear   = in_vl.getValueAsString("bYear");
  	strNo   = in_vl.getValueAsString("bNo");
  	
  	//System.out.println("getValueAsString : " + strWorkGu + " / " + strKind );
    //http://localhost/miplatform/jspSrc/TobeDemo_mdi1/m_codelist_s01.jsp?workgu=COM_CODE&kind=0000
    
    
  } else{
		System.out.println("in_vl:"+in_vl);
		
		strYear = "";
		strNo = "";
	}
	
	//strWorkGu = "find";
	
	try {	
	
	  conn = connDB_MSSQL();
	  
		if(conn!=null){
			
			
			if ( strWorkGu.equals("find") )
      {
	      //System.out.println("function Query1 _____________ : "  + strSlipDate);
	      
	      ds_out = fn_backer_money( conn, strYear, strNo );
	      this.out_dl.addDataset("ds_money", ds_out );
  			
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

// 개인별 임금액
public Dataset fn_backer_money(Connection conn, String strYear, String strNo )
{
  PreparedStatement pstmt = null;
  ResultSet rs = null;
  Dataset ds = null;
  
	StringBuffer sbSql = new StringBuffer();
	
  
	sbSql.append("\n  select a.b_seq, a.b_no,      ");
	sbSql.append("\n  		b.b_name,       ");
	sbSql.append("\n  		a.b_year,       ");
	sbSql.append("\n  		a.b_month,      ");
	sbSql.append("\n  		a.b_in_date,    ");
	sbSql.append("\n  		a.b_in_amt,     ");
	sbSql.append("\n  		a.b_bank_nm,    ");
	sbSql.append("\n  		a.b_desc,       ");
	sbSql.append("\n  		a.b_gu,         ");
	sbSql.append("\n  		a.b_edit_yn     ");
	sbSql.append("\n    from backer_money a, backer_member b ");
	sbSql.append("\n   where a.b_no = b.b_no        ");
	sbSql.append("\n     and a.b_year = '" +strYear + "'  ");
	sbSql.append("\n     and a.b_no = '" +strNo + "'     ");
	sbSql.append("\n   order by a.b_year, a.b_month ");
 
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
