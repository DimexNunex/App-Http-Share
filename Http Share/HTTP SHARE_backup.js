var fdr = !app.FolderExists("/sdcard/HTTP SHARE"  );
if( fdr) var folder = app.MakeFolder( "/sdcard/HTTP SHARE");
var path = "/sdcard/HTTP SHARE/";
var ax = app.GetPath().slice(1);
var local = ax+"/HTTP SHARE/Html";
alert(ax)
//Called when application is started.
var ip, textip;
function OnStart()
{

 // app.SetSharedApp( "HTTP SHARE"  );
  
	//Check wifi is enabled.
	ip = app.GetIPAddress();

	if( ip == "0.0.0.0" ) { 
		textip = "<b><font color=#ff0000>Erro :</font></b> Ligue o wifi ou dados moveis";
	}
	else {
	   textip = "Click abaixo para ligar o HTTP";
	}

	app.SetOrientation( "Portrait" );
	
	//lay Iniciar 
	layborder = app.CreateLayout( "Linear", "VCenter,FillXY" );
	layborder.SetSize( 1,1 );
	layborder.SetBackColor( "#458ccb" );
	lays = app.CreateLayout( "Linear", "VCenter,FillXY" );
	lays.SetBackColor( "#ffffff" );
	lays.SetSize( 0.95,0.97 );
	imgstart = app.CreateImage( "Img/HTTP SHARE.png", 0.5 );
	lays.AddChild( imgstart);
	layborder.AddChild( lays );
	app.AddLayout( layborder);
	
setTimeout(function(){	

	//Create a layout with objects vertically centered.
	lay = app.CreateLayout( "linear", "FillXY" );	
  lay.SetBackColor( "#dddddd" );
  
  title = app.CreateLayout( "Linear", "FillXY" );
  title.SetBackColor( "#960100ff" );
  title.SetSize( 1,0.5 );
  lay.AddChild( title );
  
  titleTxt = app.CreateText( "<b>HTTP FILE SHARE<b/>",1,-1,"Html" );
  titleTxt.SetTextColor( "#ffffff" );
  titleTxt.SetTextSize( 40 );
  title.AddChild( titleTxt );
  

/*	laystart = app.CreateLayout( "Frame" );
	laystart.SetPosition(0,0 );*/
	
		//Create a text label and add it to layout.
	txt = app.CreateText( textip, 1, 0.15, "MultiLine,Html" );
	txt.SetTextSize( 20 );
	txt.SetPadding( 0,0.01,0,0 );
	txt.SetTextColor( "#f2f200" );
	title.AddChild( txt );
	
	
	
  bstart = app.CreateButton( "<b>START</b>",0.38,0.22,"Custom,Html" );
	bstart.SetBackColor( "#ff3445" );
	bstart.SetTextColor( "#ffffff" );
	bstart.SetOnTouch( ligar_server );
	bstart.SetTextSize( 23 );
	bstart.SetPadding( 0.03,0.03,0.03,0.03 );
	bstart.SetStyle( "#ff3434","#ff3434",100,"#eeeeee",10,0 );
	title.AddChild( bstart );
	
	
	layBottom = app.CreateLayout( "Linear", "FillXY" );
	layBottom.SetSize( 1,0.45 );
	layBottom.SetBackColor( "#ffffff" );
	lay.AddChild( layBottom );
	
	titleB = app.CreateText( "<b>ENVIAR ARQUIVOS</b>",1,0.1,"Html" );
	titleB.SetTextColor( "#2356ff" );
	titleB.SetTextSize( 25 );
	layBottom.AddChild( titleB );
	
	bsend = app.CreateButton( "[fa-send]",0.52,0.3,"FontAwesome,Custom" );
	bsend.SetTextColor( "#5565ff" );
	bsend.SetBackColor( "#00ffffff" );
	bsend.SetTextSize( 50 );
	bsend.SetOnTouch( enviar_file );
	bsend.SetStyle( "#ffffff","#ffffff",100,"#5656dd",10,0 );
	layBottom.AddChild( bsend );
	
	layMenu  = app.CreateLayout( "Linear", "Horizontal" );
	layMenu.SetSize( 1,0.05 );
	lay.AddChild( layMenu );
	

	
	bsobre   = app.CreateButton( "<b>SOBRE</b>",1,0.05,"FontAWesome,Html" );
	bsobre.SetBackColor( "#5656dd" );
	bsobre.SetTextColor( "#dddddd" );
	bsobre.SetOnTouch( about);
	bsobre.SetTextSize( 13);
	bsobre.SetFontFile( "font/font1.ttf" );
	layMenu.AddChild( bsobre );

  //Explorer Managne
	layExplorer = app.CreateLayout( "Linear", "FillXY" );
	layExplorer.SetBackColor( "#45360f" );

 
		
	//Add layout to app.	
	app.AddLayout( lay );
	app.AddDrawer( layExplorer, "Left",1.0 );




	//serv para o index 
	serv = app.CreateWebServer(1122, "Upload,ListDir" );
	serv.SetFolder( local );
	serv.SetUploadFolder( path );
  serv.SetOnReceive( serv_recive );
 
  
  //serv para o download
  serv2 = app.CreateWebServer( 2389,"ListDir,NoWelcome" );
  serv2.SetFolder( "file:///");
  

},5000);
}


// function area

var ligar = 0;
function ligar_server()
{ 
 if(ip != "0.0.0.0"){
	if (ligar == 0) {
	    serv.Start();
	    serv2.Start();
	    bstart.SetHtml( "<b>STOP</b>" );
	    	bstart.SetStyle( "#34dd34","#34dd34",100,"#eeeeee",10,0 );
	    app.ShowPopup( "HTTP está ligado" );
	    txt.SetHtml( "Degite o url no seu Navegador web<br/>Ex: chrome | opera | firefox<br/> "+"<b><font color=#23ff45>http://"+ip+":1122</font></b>" );
	    ligar = 1;
	    return;
	}
	else {
	   serv.Stop();
	   serv2.Stop();
	   bstart.SetHtml( "<b>START</b>" );
	   	bstart.SetStyle( "#ff3434","#ff3434",100,"#eeeeee",10,0 );
	   app.ShowPopup( "HTTP está desligado" );
	   txt.SetText( textip );
	   ligar = 0;
	   return;
	}
	
	}
	 
}

function enviar_file()
{
	app.ChooseFile( "","",onchoose );
}

function onchoose(file)
{
	enviar_link("http://"+ip+":2389"+file)
}

function enviar_link(url)
{
  serv.SendText( url );
	app.ShowPopup( "arquivo enviado para o download do seu \n NAVEGADOR WEB",20000,20000 );
	
}

function about()
{
    About = app.CreateDialog( "HTTP SHARE","NoTitle" );
    layAbout = app.CreateLayout( "linear", "vertical,fillxy" );
    layAbout.SetBackColor( "#000" );
    imgA = app.CreateImage( "Img/HTTP SHARE.png",0.4);
    imgA.SetMargins( 0, 0.01, 0,-0.1 );
    txtA = app.CreateText( "<b>V-1.0<br/><font color=#df5634>"+"<a href='https://www.disoftapps.com'>BY  DISOFT APPS</a>"+"</font></b>", 0.8, 0.2, "Multiline,Html,Link" );
    txtA.SetTextColor("#ffffff");
    txtA.SetMargins( 0, 0.099, 0,-0.1 );
    txtA.SetTextSize( 20 );
    layAbout.AddChild( imgA )
    layAbout.AddChild( txtA )
    About.AddLayout( layAbout );
    About.Show();
}


function serv_recive()
{
	app.ShowPopup( "Arquivo recebido\n <-- swip para ver" );
}