<%@ include file = "./common.jsp" %>


<%
	this.proc_input(request);  
	
	this.out_vl = new VariableList();
	this.out_dl = new DatasetList();  
  
  Dataset ds_out = null;
  
  String strWorkGu = "";
  
  String strYear, strMonth;
  String strName, strbgu1, strbgu2;
  
  strYear = strMonth = strName = "";
  
  
  if(in_vl !=null){
  
    // 필수 구분자
    strWorkGu = in_vl.getValueAsString("workgu");
    
    // Query 조건 인자
  	strYear   = in_vl.getValueAsString("bYear");
  	strMonth   = in_vl.getValueAsString("bMonth");
  	strName   = in_vl.getValueAsString("bName");
  	strbgu1   = in_vl.getValueAsString("bGu1");
  	strbgu2   = in_vl.getValueAsString("bGu2");
    
  } else{
		//System.out.println("in_vl:"+in_vl);
		strYear = "";
		strName = "";
		strbgu1 = strbgu2 = strMonth = "";
	}
	
	strWorkGu = "find";
	
	try {	
	
	  conn = connDB_MSSQL();
	  
		if(conn!=null)
		{
			
			
			if ( strWorkGu.equals("find") )
      {
	      //System.out.println("function Query1 _____________ : "  + strSlipDate);
	      
	      ds_out = fn_list( conn, strYear, strMonth, strName, strbgu1, strbgu2 );
	      this.out_dl.addDataset("DS_LIST", ds_out );
	      
	      //ds_out = col_dict_list( conn, strPrj );
	      //this.out_dl.addDataset("DS_COL_DICT", ds_out );
	      
	    } else if ( strWorkGu.equals("PRJ_SUB") )
      {
	      //System.out.println("function Query1 _____________ : "  + strSlipDate);
	      
	      //ds_out = prj_list( conn );
	      //this.out_dl.addDataset("DS_CODE_PRJ", ds_out );
	      //ds_out = prj_sub_list( conn, strPrj );
	      //this.out_dl.addDataset("DS_CODE_SUB", ds_out );
	      
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


// 테이블 리스트 조회
public Dataset fn_list(Connection conn, String strYear, String strMonth, String strName, String strbgu1, String strbgu2 )
{
  PreparedStatement pstmt = null;
  ResultSet rs = null;
  Dataset ds = null;
  
	StringBuffer sbSql = new StringBuffer();
	
	//sbSql.append("SELECT '0' as chk, *   ");
	//sbSql.append("  FROM backer_member a  ");
	//sbSql.append(" WHERE a.b_gu LIKE '" + strbgu1 + "'  ");
	//sbSql.append("   AND a.b_name LIKE '" + strName + "%'  ");
  //sbSql.append(" ORDER BY a.b_no  ");


	sbSql.append("\n  select '0' as chk,    ");
	//sbSql.append("\n         b.b_no,   ");
	sbSql.append("\n        substring(b.b_no,1,2) + '-' + substring(b.b_no,3,5) as b_no,  ");
	sbSql.append("\n                b.b_name,   ");
	sbSql.append("\n                b.b_make_amt,   ");
	sbSql.append("\n                b.b_post,   ");
	sbSql.append("\n                b.b_address,   ");
	sbSql.append("\n                b.b_tel1,   ");
	sbSql.append("\n                b.b_gu,   ");
	sbSql.append("\n                b.b_gu2,   ");
	sbSql.append("\n                a.b_year,   ");
	sbSql.append("\n                a.b_month,   ");
	sbSql.append("\n                case ifnull(a.b_in_amt, 0 ) when 0 then '' else a.b_in_date end as b_in_date,   ");
	sbSql.append("\n                case ifnull(a.b_in_amt, 0 ) when 0 then '' else substring(a.b_in_date,1,4) end as b_in_year,   ");
	sbSql.append("\n                case ifnull(a.b_in_amt, 0 ) when 0 then '' else substring(a.b_in_date,5,2) end as b_in_month,   ");
	sbSql.append("\n                case ifnull(a.b_in_amt, 0 ) when 0 then '' else substring(a.b_in_date,7,2) end as b_in_day,   ");
	sbSql.append("\n                a.b_in_amt,   ");
	sbSql.append("\n                a.b_bank_nm   ");
	sbSql.append("\n    from backer_member b left outer join backer_money a on a.b_no = b.b_no   ");
	//sbSql.append("\n     and a.b_year = '" + strYear + "'   ");
	//sbSql.append("\n     and a.b_month = '" + strMonth + "'   ");
	sbSql.append("\n     and a.b_year = SUBSTRING( DATE_FORMAT(DATE_SUB(STR_TO_DATE('" + strYear + strMonth + "01', '%Y%m%d'), INTERVAL 1 MONTH), '%Y%m%d') , 1,4)   ");
	sbSql.append("\n     and a.b_month = SUBSTRING( DATE_FORMAT(DATE_SUB(STR_TO_DATE('" + strYear + strMonth + "01', '%Y%m%d'), INTERVAL 1 MONTH), '%Y%m%d') , 5,2)   ");
	sbSql.append("\n   where b.b_gu LIKE '" + strbgu1 + "'   ");
	sbSql.append("\n     and b.b_name like '" + strName + "%'   ");
	sbSql.append("\n   order by ifnull(b.b_no,'')   ");
  
  
  // New Sql 
  sbSql = new StringBuffer();
	sbSql.append("\n  select '0' as chk,    ");
	//sbSql.append("\n         b.b_no,   ");
	sbSql.append("\n        substring(b.b_no,1,2) + '-' + substring(b.b_no,3,5) as b_no,  ");
	sbSql.append("\n                max(b.b_name) as b_name,   ");
	sbSql.append("\n                max(b.b_make_amt) as b_make_amt,   ");
	sbSql.append("\n                max(b.b_post) as b_post,   ");
	sbSql.append("\n                max(b.b_address) as b_address,   ");
	sbSql.append("\n                max(b.b_tel1) as b_tel1,   ");
	sbSql.append("\n                max(b.b_gu) as b_gu,   ");
	sbSql.append("\n                max(b.b_gu2) as b_gu2,   ");
	sbSql.append("\n                max(a.b_year) as b_year,   ");
	sbSql.append("\n                max(a.b_month) as b_month,   ");
	sbSql.append("\n                max(case ifnull(a.b_in_amt, 0 ) when 0 then '' else a.b_in_date end ) as b_in_date,   ");
	sbSql.append("\n                max(case ifnull(a.b_in_amt, 0 ) when 0 then '' else substring(a.b_in_date,1,4) end ) as b_in_year,   ");
	sbSql.append("\n                max(case ifnull(a.b_in_amt, 0 ) when 0 then '' else substring(a.b_in_date,5,2) end ) as b_in_month,   ");
	sbSql.append("\n                max(case ifnull(a.b_in_amt, 0 ) when 0 then '' else substring(a.b_in_date,7,2) end ) as b_in_day,   ");
	sbSql.append("\n                sum(a.b_in_amt) as b_in_amt,   ");
	sbSql.append("\n                max(a.b_bank_nm) as b_bank_nm   ");
	sbSql.append("\n    from backer_member b left outer join backer_money a on a.b_no = b.b_no   ");
	//sbSql.append("\n     and a.b_year = '" + strYear + "'   ");
	//sbSql.append("\n     and a.b_month = '" + strMonth + "'   ");
	sbSql.append("\n     and a.b_year = SUBSTRING( DATE_FORMAT(DATE_SUB(STR_TO_DATE('" + strYear + strMonth + "01', '%Y%m%d'), INTERVAL 1 MONTH), '%Y%m%d') , 1,4)   ");
	sbSql.append("\n     and a.b_month = SUBSTRING( DATE_FORMAT(DATE_SUB(STR_TO_DATE('" + strYear + strMonth + "01', '%Y%m%d'), INTERVAL 1 MONTH), '%Y%m%d') , 5,2)   ");
	sbSql.append("\n   where b.b_gu LIKE '" + strbgu1 + "'   ");
	sbSql.append("\n     and b.b_name like '" + strName + "%'   ");
	sbSql.append("\n   group by b.b_no  ");
   
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
