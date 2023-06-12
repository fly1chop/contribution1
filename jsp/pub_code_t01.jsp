<%@ include file = "./common.jsp" %>
<%
	this.proc_input(request);
	
	this.out_vl = new VariableList();
	this.out_dl = new DatasetList();
  
	Dataset inds_code = in_dl.getDataset("ds_Code");
	
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
  			sql  = "DELETE FROM pub_code ";
  			sql += "      WHERE com_kind = '" + inds_code.getDeleteColumn(i,"com_kind").getString() + "' ";
  			sql += "        AND com_code = '" + inds_code.getDeleteColumn(i,"com_code").getString() + "' ";
  			stmt.execute(sql);
  		}
      
  		RowCnt = inds_code.getRowCount();
      
  		for ( i = 0 ; i < RowCnt ; i++ )
  		{
  			RowStatus = inds_code.getRowStatus(i);
  			sbSql = new StringBuffer();
  			
  			if ( RowStatus.equals("insert") )
  			{ 
  				sbSql.append("\n INSERT INTO pub_code ( com_kind, com_code, com_name, com_desc, com_sort, com_date ) ");
  				sbSql.append("\n      VALUES ( " + checkNullString(inds_code.getColumn(i,"com_kind").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"com_code").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"com_name").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"com_desc").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"com_sort").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"com_date").getString()) + "     ");
  				sbSql.append("\n             )                                                                        ");
  				
  			}
  			else if ( RowStatus.equals("update") )
  			{
  				sbSql.append("\n UPDATE pub_code                                                                              ");
  				sbSql.append("\n    SET com_name = " + checkNullString(inds_code.getColumn(i,"com_name").getString()) + ",    ");
  				sbSql.append("\n        com_desc = " + checkNullString(inds_code.getColumn(i,"com_desc").getString()) + ",    ");
  				sbSql.append("\n        com_sort = " + checkNullString(inds_code.getColumn(i,"com_sort").getString()) + ",    ");
  				sbSql.append("\n        com_date = " + checkNullString(inds_code.getColumn(i,"com_date").getString()) + "     ");
  				sbSql.append("\n  WHERE com_kind = " + checkNullString(inds_code.getColumn(i,"com_kind").getString()) + "     ");
  				sbSql.append("\n    AND com_code = " + checkNullString(inds_code.getColumn(i,"com_code").getString()) + "     ");
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
