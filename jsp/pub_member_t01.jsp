<%@ include file = "./common.jsp" %>
<%
	this.proc_input(request);
	
	this.out_vl = new VariableList();
	this.out_dl = new DatasetList();
  
	Dataset inds_code = in_dl.getDataset("ds_member");
	
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
  			sql  = "DELETE FROM pub_member ";
  			sql += "      WHERE l_id = '" + inds_code.getDeleteColumn(i,"l_id").getString() + "' ";
  			stmt.execute(sql);
  		}
      
  		RowCnt = inds_code.getRowCount();
      
  		for ( i = 0 ; i < RowCnt ; i++ )
  		{
  			RowStatus = inds_code.getRowStatus(i);
  			sbSql = new StringBuffer();
  			
  			if ( RowStatus.equals("insert") )
  			{ 
  			
           
  				sbSql.append("\n INSERT INTO pub_member ( l_id,l_pw,l_name,l_christen,l_tel,l_handphone,l_level ) ");
  				sbSql.append("\n      VALUES ( " + checkNullString(inds_code.getColumn(i,"l_id").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"l_pw").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"l_name").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"l_christen").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"l_tel").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"l_handphone").getString()) + ",    ");
  				sbSql.append("\n               " + checkNullString(inds_code.getColumn(i,"l_level").getString()) + "    ");
  				sbSql.append("\n             )                                                                        ");
  				
  			}
  			else if ( RowStatus.equals("update") )
  			{
  				sbSql.append("\n UPDATE pub_member                                                                              ");
  				sbSql.append("\n    SET l_pw      = " + checkNullString(inds_code.getColumn(i,"l_pw").getString()) + ",            ");
  				sbSql.append("\n        l_name    = " + checkNullString(inds_code.getColumn(i,"l_name").getString()) + ",        ");
  				sbSql.append("\n        l_christen = " + checkNullString(inds_code.getColumn(i,"l_christen").getString()) + ",        ");
  				sbSql.append("\n        l_tel = " + checkNullString(inds_code.getColumn(i,"l_tel").getString()) + ",  ");
  				sbSql.append("\n        l_handphone   = " + checkNullString(inds_code.getColumn(i,"l_handphone").getString()) + ",  ");
  				sbSql.append("\n        l_level  = " + checkNullString(inds_code.getColumn(i,"l_level").getString()) + "  ");
  				sbSql.append("\n  WHERE l_id = " + checkNullString(inds_code.getColumn(i,"l_id").getString()) + "     ");
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
