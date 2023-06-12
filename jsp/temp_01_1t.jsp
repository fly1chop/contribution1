<%@ include file = "./common.jsp" %>
<%
	this.proc_input(request);
	
	this.out_vl = new VariableList();
	this.out_dl = new DatasetList();
  
	Dataset inds_code = in_dl.getDataset("ds_list");
	
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
  			sql  = "DELETE FROM backer_member ";
  			sql += "      WHERE b_no = '" + inds_code.getDeleteColumn(i,"b_no").getString() + "' ";
  			stmt.execute(sql);
  		}
      
  		RowCnt = inds_code.getRowCount();
      
  		for ( i = 0 ; i < RowCnt ; i++ )
  		{
  			RowStatus = inds_code.getRowStatus(i);
  			sbSql = new StringBuffer();
  			
  			if ( RowStatus.equals("insert") )
  			{ 
  			
           
  				sbSql.append("\n INSERT INTO backer_member ( b_no, b_name, baptismal_name, baptismal_date, in_date, out_date, b_gu, b_gu2, b_tel1, b_tel2, b_post, b_address, b_address_new, b_desc, b_make_amt ) ");
  				sbSql.append("\n      VALUES ( " + checkNullString(inds_code.getColumn(i,"b_no").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"b_name").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"baptismal_name").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"baptismal_date").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"in_date").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"out_date").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"b_gu").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"b_gu2").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"b_tel1").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"b_tel2").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"b_post").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"b_address").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"b_address_new").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"b_desc").getString()) + ",    ");
  				sbSql.append("\n               isNull(" + checkNullNumber(inds_code.getColumnAsString(i,"b_make_amt")) + ",0)    ");
  				sbSql.append("\n             )                                                                        ");
  				
  			}
  			else if ( RowStatus.equals("update") )
  			{
  				sbSql.append("\n UPDATE backer_member                                                                              ");
  				sbSql.append("\n    SET b_no      = " + checkNullString(inds_code.getColumn(i,"b_no").getString()) + ",            ");
  				sbSql.append("\n        b_name    = " + checkNullString(inds_code.getColumn(i,"b_name").getString()) + ",        ");
  				sbSql.append("\n        baptismal_name = " + checkNullString(inds_code.getColumn(i,"baptismal_name").getString()) + ",        ");
  				sbSql.append("\n        baptismal_date = " + checkNullString(inds_code.getColumn(i,"baptismal_date").getString()) + ",  ");
  				sbSql.append("\n        in_date   = " + checkNullString(inds_code.getColumn(i,"in_date").getString()) + ",  ");
  				sbSql.append("\n        out_date  = " + checkNullString(inds_code.getColumn(i,"out_date").getString()) + ",  ");
  				sbSql.append("\n        b_gu      = " + inds_code.getColumnAsString(i,"b_gu") + ",  ");
  				sbSql.append("\n        b_gu2     = " + inds_code.getColumnAsString(i,"b_gu2") + ",  ");
  				//sbSql.append("\n        b_gu      = " + checkNullString(inds_code.getColumn(i,"b_gu").getString()) + ",  ");
  				//sbSql.append("\n        b_gu2     = " + checkNullString(inds_code.getColumn(i,"b_gu2").getString()) + ",  ");
  				sbSql.append("\n        b_tel1    = " + checkNullString(inds_code.getColumn(i,"b_tel1").getString()) + ",  ");
  				sbSql.append("\n        b_tel2    = " + checkNullString(inds_code.getColumn(i,"b_tel2").getString()) + ",  ");
  				sbSql.append("\n        b_post    = " + checkNullString(inds_code.getColumn(i,"b_post").getString()) + ",  ");
  				sbSql.append("\n        b_address = " + checkNullString(inds_code.getColumn(i,"b_address").getString()) + ",  ");
  				sbSql.append("\n        b_address_new = " + checkNullString(inds_code.getColumn(i,"b_address_new").getString()) + ",  ");
  				sbSql.append("\n        b_desc    = " + checkNullString(inds_code.getColumn(i,"b_desc").getString()) + ",  ");
  				sbSql.append("\n        b_make_amt = isNull(" + checkNullNumber(inds_code.getColumnAsString(i,"b_make_amt")) + ",0)    ");
  				sbSql.append("\n  WHERE b_no = " + checkNullString(inds_code.getColumn(i,"b_no").getString()) + "     ");
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
