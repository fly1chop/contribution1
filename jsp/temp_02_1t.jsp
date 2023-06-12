<%@ include file = "./common.jsp" %>
<%
	this.proc_input(request);
	
	this.out_vl = new VariableList();
	this.out_dl = new DatasetList();
  
	Dataset inds_code = in_dl.getDataset("ds_money");
	
	//Statement stmt =  conn.createStatement();
	
	Statement stmt = null;
  
	try 
	{	
		int RowCnt;
		int i;
	  
		String RowStatus;
		String sql          = "";
		StringBuffer sbSql  = null;
		
		conn = connDB_MSSQL();
		
		if(conn!=null){
		  stmt =  conn.createStatement();
		  
		  RowCnt = inds_code.getDeleteRowCount();
  		for ( i = 0 ; i < RowCnt ; i++ )
  		{
  			sql  = "DELETE FROM backer_money ";
  			sql += "      WHERE b_seq = " + inds_code.getDeleteColumn(i,"b_seq").getInteger() + " ";
  			sql += "        AND b_no = '" + inds_code.getDeleteColumn(i,"b_no").getString() + "' ";
  			sql += "        AND b_year = '" + inds_code.getDeleteColumn(i,"b_year").getString() + "' ";
  			sql += "        AND b_month = '" + inds_code.getDeleteColumn(i,"b_month").getString() + "' ";
  			
  			System.out.println(sql);
  			
  			stmt.execute(sql);
  		}
      
  		RowCnt = inds_code.getRowCount();
      
  		for ( i = 0 ; i < RowCnt ; i++ )
  		{
  			RowStatus = inds_code.getRowStatus(i);
  			sbSql = new StringBuffer();
  			
  			if ( RowStatus.equals("insert") )
  			{ 
  				sbSql.append("\n INSERT INTO backer_money ( b_no, b_year, b_month, b_in_amt, b_in_date, b_edit_yn, b_desc, b_bank_nm, b_gu ) ");
  				sbSql.append("\n      VALUES ( " + checkNullString(inds_code.getColumn(i,"b_no").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"b_year").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"b_month").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullNumber(inds_code.getColumnAsString(i,"b_in_amt")) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"b_in_date").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"b_edit_yn").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"b_desc").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"b_bank_nm").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"b_gu").getString()) + "     ");
  				sbSql.append("\n             )                                                                        ");
  				
  			}
  			else if ( RowStatus.equals("update") )
  			{
  				sbSql.append("\n UPDATE backer_money                                                                              ");
  				sbSql.append("\n    SET b_no = " + checkNullString(inds_code.getColumn(i,"b_no").getString()) + ",            ");
  				sbSql.append("\n        b_year = " + checkNullString(inds_code.getColumn(i,"b_year").getString()) + ",        ");
  				sbSql.append("\n        b_month = " + checkNullString(inds_code.getColumn(i,"b_month").getString()) + ",        ");
  				sbSql.append("\n        b_in_amt = " + checkNullNumber(inds_code.getColumnAsString(i,"b_in_amt")) + ",    ");
  				sbSql.append("\n        b_in_date = " + checkNullString(inds_code.getColumn(i,"b_in_date").getString()) + ",  ");
  				sbSql.append("\n        b_edit_yn = " + checkNullString(inds_code.getColumn(i,"b_edit_yn").getString()) + ",  ");
  				sbSql.append("\n        b_desc = " + checkNullString(inds_code.getColumn(i,"b_desc").getString()) + ",        ");
  				sbSql.append("\n        b_bank_nm = " + checkNullString(inds_code.getColumn(i,"b_bank_nm").getString()) + ",  ");
  				sbSql.append("\n        b_gu = " + checkNullString(inds_code.getColumn(i,"b_gu").getString()) + "             ");
  				sbSql.append("\n  WHERE b_seq = " + inds_code.getColumn(i,"b_seq").getInteger() + " ");
  				sbSql.append("\n    AND b_no = " + checkNullString(inds_code.getColumn(i,"b_no").getString()) + "     ");
  				sbSql.append("\n    AND b_year = " + checkNullString(inds_code.getColumn(i,"b_year").getString()) + "     ");
  				sbSql.append("\n    AND b_month = " + checkNullString(inds_code.getColumn(i,"b_month").getString()) + "     ");
  			}
  			
        System.out.println(sbSql.toString());
  			stmt.execute(sbSql.toString());
  		}
		  
  		
		}
    
		
	  this.setResultMessage(0, "OK");
		
	} catch(Exception ex) {
      // System.out.println(ex.toString());
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
		if(stmt != null) {
			try {
				stmt.close();
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
