var ck_restart;

if( app.FileExists( "/sdcard/.http share/restart.txt" ) ) ck_restart = app.ReadFile("/sdcard/.http share/restart.txt");
else ck_restart = "false ; null";

var ck_r_ext = ck_restart.split(";");

//alert(ck_r_ext[0])
var port1;
if(ck_r_ext[0] == "true ") port1 = ck_r_ext[1].split(",");
else port1 = [Math.floor(Math.random()*10),Math.floor(Math.random()*10),Math.floor(Math.random()*10),Math.floor(Math.random()*10)];
var port2 = [Math.floor(Math.random()*10),Math.floor(Math.random()*10),Math.floor(Math.random()*10),Math.floor(Math.random()*10)];
while(port1 == port2){  port2[0] = Math.floor(Math.random()*10); }
if(port1[0] == 0 || port2[0] == 0) {
    port1[0] = 1;
    port2[0] = 1;
}

var fdr = !app.FolderExists("/sdcard/Http Share"  );
if( fdr) var folder = app.MakeFolder( "/sdcard/Http Share");
var path = "/sdcard/Http Share";

var hide_path;
var conf_http =!app.FolderExists( "/sdcard/.http share" );
if(conf_http) hide_path = app.MakeFolder( "/sdcard/.http share" );

//copy files to sdcard
var downFile = app.ReadFile( "Html/down.html" );
var downFile2 = app.ReadFile( "Html/index.html" );

 if(!app.FileExists("/sdcard/.http share/down.html"))
    app.WriteFile( "/sdcard/.http share/down.html",downFile );
    
if(!app.FileExists("/sdcard/.http share/index.html"))
    app.WriteFile( "/sdcard/.http share/index.html",downFile2 );  
  
if(!app.FileExists("/sdcard/.http share/jquery-3.3.1.js"))
    app.CopyFile("Html/jquery-3.3.1.js","/sdcard/.http share/jquery-3.3.1.js" );
    
if( !app.FolderExists("/sdcard/.http share/img")){ 
 app.MakeFolder( "/sdcard/.http share/img" );
  app.CopyFolder( "Html/img","/sdcard/.http share/img" );
}

//local onde fica o index html  
var local = "/sdcard/.http share";

var check_config = !app.FileExists( "/sdcard/.http share/config.txt" );
if (check_config) app.WriteFile("/sdcard/.http share/config.txt", path);

var size_file;//<-- tamanho do arquivo.a ser recebido

//Called when application is started.
var ip, textip;
function OnStart()
{  
   //app props
  	app.SetOrientation( "Portrait" );
    //app.SetWifiApEnabled( false );
    app.EnableBackKey( false  );
    app.SetOnError( function(e){ alert("Erro interno\n"+e.toString())} );
    
    //arquivo config do nosso app
    path =  app.ReadFile("/sdcard/.http share/config.txt");
 
  //carregar o sript file_view
  app.LoadScript( "file_view.js" );
  //debug desable
   app.SetDebugEnabled( false );
      
	//Logo inicial do app
	//lay Iniciar 
	layborder = app.CreateLayout( "Linear", "VCenter,FillXY" );
	layborder.SetSize( 1,1 );
	layborder.SetBackColor( "#458ccb" );
	lays = app.CreateLayout( "Linear", "VCenter,FillXY" );
	lays.SetBackColor( "#ffffff" );
	lays.SetSize( 0.95,0.97 );
	imgstart = app.CreateImage( "Img/Http Share.png", 0.5 );
	lays.AddChild( imgstart);
	layborder.AddChild( lays );
	app.AddLayout( layborder);


//Pagina do app quando full carregado	
setTimeout(function(){	

   //Explorer alert
   app.ShowPopup( "<- swip para ver o explorer" );

	//Create a layout with objects vertically centered.
	lay = app.CreateLayout( "linear", "FillXY" );	
  lay.SetBackColor( "#dddddd" );
  
  title = app.CreateLayout( "Linear", "FillXY" );
  title.SetBackColor( "#960100ff" );
  title.SetSize( 1,0.49 );
  lay.AddChild( title );
  
  titleTxt = app.CreateText( "<b>HTTP FILE SHARE<b/>",1,-1,"Html" );
  titleTxt.SetTextColor( "#ffffff" );
  titleTxt.SetFontFile("font/Roboto-Bold.ttf" );
  //titleTxt.SetBackGradient( "#6060dd","#8080ee","#9090ff" );
  titleTxt.SetTextSize( 40 );
  title.AddChild( titleTxt );
  

/*	laystart = app.CreateLayout( "Frame" );
	laystart.SetPosition(0,0 );*/
	
		//Create a text label and add it to layout.
	txtInfoIp = app.CreateText( textip, 1, 0.15, "MultiLine,Html" );
	txtInfoIp.SetTextSize( 20 );
	txtInfoIp.SetFontFile( "font/font2.ttf" );
	txtInfoIp.SetPadding( 0,0.01,0,0 );
	txtInfoIp.SetTextColor( "#f2f200" );
	title.AddChild( txtInfoIp );
	
	
	
  bstart = app.CreateButton( "[fa-power-off]",0.38,0.22,"Custom,FontAwesome" );
	bstart.SetBackColor( "#ff3445" );
	bstart.SetTextColor( "#ffffff" );
	bstart.SetOnTouch( ligar_server );
	bstart.SetTextSize( 35 );
	bstart.SetPadding( 0.03,0.03,0.03,0.03 );
	bstart.SetStyle( "#ff3434","#ff3434",1000,"#eeeeee",10,0 );
  if( app.IsTablet()) bstart.SetSize( 0.38,0.235 );
	title.AddChild( bstart );
	
  file_progress = app.CreateLayout( "Linear", "Horizontal,Left" );
  file_progress.SetBackColor( "#45ad45" );
  file_progress.SetSize( 1.0,0.01);
  lay.AddChild( file_progress );
	
	layBottom = app.CreateLayout( "Linear", "FillXY" );
	layBottom.SetSize( 1,0.452);
	layBottom.SetBackColor( "#ffffff" );
	lay.AddChild( layBottom );
	
	titleB = app.CreateText( "<b>ENVIAR ARQUIVOS</b>",1,0.1,"Html" );
	titleB.SetTextColor( "#2356ff" );
	titleB.SetTextSize( 25 );
	titleB.SetFontFile( "font/Roboto-Medium.ttf" );
	layBottom.AddChild( titleB );
	
	bsend = app.CreateButton( "[fa-send]",0.52,0.3,"FontAwesome,Custom" );
	bsend.SetTextColor( "#5565ff" );
	bsend.SetBackColor( "#00ffffff" );
	bsend.SetTextSize( 70 );
	bsend.SetOnTouch( enviar_file );
	bsend.SetStyle( "#ffffff","#ffffff",1000,"#5656dd",10,0 );
  if( app.IsTablet() ) bsend.SetSize( 0.52,0.33 );
	layBottom.AddChild( bsend );
	
	layMenu  = app.CreateLayout( "Linear", "Horizontal" );
	layMenu.SetSize( 1,0.05 );
  layMenu.SetBackColor( "#5656aa" );
	lay.AddChild( layMenu );
	

   //settings button
	bconfig   = app.CreateButton( "[fa-cog]"+" Conf",0.33,0.05,"FontAWesome,Custom" );
	bconfig.SetBackColor( "#5656dd" );
	bconfig.SetTextColor( "#ffffff" );
  bconfig.SetStyle( "#dd5656","#dd5656",5 );
  bconfig.SetMargins( 0,0.005,0,0 );
	bconfig.SetOnTouch( setthings);
	bconfig.SetTextSize( 13);
	//bsobre.SetFontFile( "font/font1.ttf" );
	layMenu.AddChild( bconfig );


  //	Sobre o app
	bsobre   = app.CreateButton( "[fa-user]"+" about",0.33,0.05,"FontAWesome,Custom" );
	bsobre.SetBackColor( "#5656dd" );
	bsobre.SetTextColor( "#ffffff" );
	bsobre.SetOnTouch( about);
  bsobre.SetStyle( "#dd5656","#dd5656",5 );
  bsobre.SetMargins( 0,0.005,0,0 );
	bsobre.SetTextSize( 13);
//	bsobre.SetFontFile( "font/font1.ttf" );
	layMenu.AddChild( bsobre );

  bsair = app.CreateButton( "[fa-power-off]"+" exit",0.33,0.05,"FontAWesome,Custom" );
	bsair.SetBackColor( "#5656dd" );
	bsair.SetTextColor( "#ffffff" );
	bsair.SetOnTouch( exit );
  bsair.SetStyle( "#dd5656","#dd5656",5 );
  bsair.SetMargins( 0,0.005,0,0 );
	bsair.SetTextSize( 13);
  layMenu.AddChild( bsair );


  //Mostra a percentagem do arquivoque está sendo  recebido
  lay_recive = app.CreateLayout( "frame" );
  lay_recive.Hide();
  lay_reci = app.CreateLayout( "Linear", "VCenter,FillX" );
  lay_reci.SetBackColor( "#ddffffff" );
  lay_reci.SetSize( 0.3,0.19 );
  
  
    
  txt_r  = app.CreateText( "[fa-download]", -1,-1,"Bold,FontAwesome" );
  txt_r.SetTextColor( "#3434dd" );
  txt_r.SetTextSize( 30 );
  lay_reci.AddChild( txt_r);

  lay_RProgress = app.CreateLayout( "Linear", "Horizontal,Left" );
  lay_RProgress.SetSize( 0.28,0.02);
  lay_RProgress.SetBackColor( "#505050" );
  lay_RProgress.SetMargins( 0, 0.01, 0, 0 );
  lay_reci.AddChild( lay_RProgress );

  lay_R_MoveProgress = app.CreateLayout( "Linear", "Horizontal" );
  lay_R_MoveProgress.SetSize( 0,0.02 );
  lay_R_MoveProgress.SetBackColor( "#00ee00" );
  lay_RProgress.AddChild( lay_R_MoveProgress );


  text_recive = app.CreateText( "0%",-1,-1,"Bold");
  text_recive.SetTextColor( "#4040dd" );
  text_recive.SetTextSize( 10 );  
  lay_reci.AddChild( text_recive);
//  lay_reci.AddChild( txt_r );
  lay_recive.AddChild( lay_reci);
 // app.AddLayout( lay_recive);
	
  bt_reci_cancel = app.CreateButton( "x",1,1,"Custom,FontAwesome" );
  bt_reci_cancel.SetStyle( "#ff2036","#ff2036",100,0,"",0 );
  bt_reci_cancel.SetBackColor( "#ff0036" );
  bt_reci_cancel.SetMargins( 0.01, 0.01, 0.01, 0 );
  bt_reci_cancel.SetOnTouch( cancel_fileRecive);
  bt_reci_cancel.SetSize( 0.1,0.06 );
  lay_reci.AddChild( bt_reci_cancel );

  //http share files view add e chamar script
   criar_draw();
  app.AddDrawer( file_view,"Left",1 );
 

	//Add layout to app.	
	app.AddLayout( lay );
	app.AddLayout( lay_recive );


//criar os servers e set options
 criar_servers();


 //check ip address
check_ip();


},2000);

}

function check_ip()
{
		ip = app.GetIPAddress();
	if( ip == "0.0.0.0" ) { 
		textip = "<font color=#ff9090>Ligue o wi-fi ou  hotspot</font>";
    setTimeout( check_ip,2000);
	}
	else  textip = "Click abaixo para ligar o HTTP";
  txtInfoIp.SetHtml( textip );
}


function criar_servers(del_serv)
{  
   
	//Create and run web server.
	serv = app.CreateWebServer(port1.join(''), "Upload" );
	serv.SetFolder( local );
  serv.SetUploadFolder( path );
	serv.SetOnReceive( serv_reciver );

  serv2 = app.CreateWebServer( port2.join(''),"NoWelcome" );
  serv2.SetFolder( "file:///");
  serv2.SetOnReceive( serv2_reciver );
  serv.Start();
  serv2.Start();
}

var ligar = 0;
function ligar_server()
{ 
 if(ip != "0.0.0.0"){
 var aux = port1.join('');
	if (ligar == 0) {
	    serv.Start();
	    serv2.Start();
	     //app.SetWifiApEnabled( true );
	    	bstart.SetStyle( "#34dd34","#34dd34",100,"#eeeeee",10,0 );
	    app.ShowPopup( "HTTP está ligado" );
	    txtInfoIp.SetHtml( "Degite o url no seu Navegador web<br/>Ex: chrome | opera | firefox<br/> "+"<b><font color=#23ff45>http://"+ip+":"+aux+"</font></b>" );
	    ligar = 1;
	    return;
	}
	else {
	   serv.Stop();
	   serv2.Stop();
	   //app.SetWifiApEnabled( "false" );
	 	bstart.SetStyle( "#ff3434","#ff3434",100,"#eeeeee",10,0 );
	   app.ShowPopup( "HTTP está desligado" );
	   txtInfoIp.SetText( textip );
	   ligar = 0;
	   return;
	}
	
	}
  
else {
    setthings();

}
	 
}

function enviar_file()
{
	app.ChooseFile( "","",onchoose );
}

function onchoose(file)
{   
  var aux = port2.join('');
	enviar_link("http://"+ip+":"+aux+file)
}

function enviar_link(url)
{
  var sep  = url.split("/");
  var name = sep[sep.length-1];
  serv2.SendText(url+","+name);
  serv.SendText( "open" );
	app.ShowPopup( "arquivo enviado para o download do seu NAVEGADOR WEB",15000,15000 );
	
}

function about()
{
    About = app.CreateDialog( "HTTP SHARE","NoTitle" );
   About.SetBackColor( "#50000000" );
    layAbout = app.CreateLayout( "linear", "VCenter,FillXY" );
    layAbout.SetSize( 1.0,1.0 );
    layAbout.SetBackColor( "#50000000" );
    
//    layAbout.SetBackground( "/Sys/Img/GreenBack.jpg" );
    imgA = app.CreateImage( "Img/Http Share.png",0.6);
    imgA.SetMargins( 0, 0.01, 0,-0.1 );
    txtA = app.CreateText( "<b><u>DISOFT APPS</u></b>", 0.8, 0.2,"Html," );
    txtA.SetTextColor("#dd5656");
    txtA.SetMargins( 0, 0.099, 0,-0.1 );
    txtA.SetTextSize( 30 );
    txtA.SetFontFile("font/font1.ttf" );
    txtA.SetOnTouchUp( function(){ app.OpenUrl( "http://www.disoftapps.cv" );});
    layAbout.AddChild( imgA );
    layAbout.AddChild( txtA );

    div = app.CreateLayout( "Linear", "Horizontal" );
    div.SetBackColor( "#45ad45" );
   div.SetSize( 1,0.004 );
 //  layAbout.AddChild( div );

    lay_contatos = app.CreateLayout( "Linear", "FillXY,VCenter" );
    lay_contatos.SetPadding( 0.02,0.02,0.02,0.02 );
    //lay_contatos.SetSize( -1,0.3 );

    Ctitle = app.CreateText( "Me segue no",-1,-1,"Center" );
    Ctitle.SetTextSize( 25 );
    Ctitle.SetFontFile( "font/Roboto-Regular.ttf" );
    Ctitle.SetTextColor( "#402356" );
//    lay_contatos.AddChild( Ctitle );
   
    var wd = 0.8-0.05;

     star = app.CreateButton( "[fa-star]"+"    Avaliar   "+"[fa-star]",1,0.1,"FontAwesome,Bold,Custom" );
    star.SetTextColor( "#fffff" );
    star.SetStyle( "#ddaa50","#dddd20",10,"",0,0 );
    star.SetMargins( 0.01, 0.01, 0.01, 0.01 );
    star.SetTextSize( 20 );
    star.SetOnTouch( avaliar  );
   lay_contatos.AddChild( star);

    face = app.CreateButton( "[fa-facebook]"+"    Facebook",1,0.1,"FontAwesome,Bold,Custom" );
    face.SetTextColor( "#fffff" );
    face.SetStyle( "#5656dd","#5656aa",10,"",0,0);
    face.SetMargins( 0.01, 0.01, 0.01, 0.01 );
    face.SetTextSize( 20 );
   lay_contatos.AddChild( face );

    insta = app.CreateButton( "[fa-instagram]"+"   Instagram",1,0.1,"FontAwesome,Custom" );
    insta.SetTextColor( "#ffffff" );
    insta.SetTextSize( 20 );
    insta.SetStyle( "#56dd56","#56aa56",10,"",0,0 );
    insta.SetMargins( 0.01, 0.01, 0.01, 0.01 );
   lay_contatos.AddChild( insta );

    google  = app.CreateButton( "[fa-google]"+"   Google",1,0.1,"FontAwesome,Bold,Custom" );
    google.SetTextColor( "#ffffff" );
    google.SetTextSize( 20 );
    google.SetStyle( "#dd5656","#aa5656",10,'',0,0 );
    google.SetMargins( 0.01, 0.01, 0.01, 0.01 );
    lay_contatos.AddChild( google);

   space = app.CreateLayout( "Linear", "Horizontal" );
   space.SetSize( 1,0.02 );
  // lay_contatos.AddChild( space );

   layAbout.AddChild( lay_contatos);
   About.AddLayout( layAbout );
    About.Show();
}



//enviar link iframe
var arquivo_name;
function serv_reciver(send)
{  
  var aux = port2.join('');
	if(send == "iframe"){
      //var  txt2 = config_files.split(',')[1];
       txt_url = "http://"+ip+":"+aux+app.GetInternalFolder()+"/.http share/down.html"; 
      serv.SendText(txt_url);
  
	}
	if(send  == "enviado"){
	  app.ShowPopup( "Aquivo Recebido! \n <-- Desilze para ver" );
    lay_recive.Hide();
    show_lay_recive = 0;
  }
  
//  alert( app.GetFreeSpace(  ));
  var okey = send.split(",");
  
  if(okey[0] == "aceitar"){
      dialog = app.CreateYesNoDialog( "Receber Arquivo?\n -> "+okey[1], "center, FillXY" );
      dialog.SetOnTouch( dialog_OnTouch );
      //dialog.SetBackColor( "#12000000" );
      dialog.SetButtonText( "aceitar", "cancelar" );
      dialog.Show();  
     size_file = okey[2];
     
  }

  var ext = send.split(",");
  if( ext[1] == "%"){
      show_recive_progress(ext[0]);
  }
if( send == "close progress"){
   lay_recive.Hide();
   setTimeout('show_lay_recive = 0',2000);
}
 if( send == "no upload" ) 
     app.ShowPopup( "Envio Cancelado" );

    
}


function dialog_OnTouch(key){
   if(key === "Yes") {
       var freespace =  app.GetFreeSpace( "" );
      var aux = ((size_file/1024)/1024)/1024
      if( aux <= 1)  {
         //if( aux  <= freespace)
           serv.SendText( "pedido_aceito" );
      /*   else if {
               alert("Memória insufiçiente");
               dialog.Show();
         }*/
      }
      else alert("tamanho a receber é de um 1000Mb");
   }
   if(key ===  "No") serv.SendText( "pedido_recuzado" );
   
}

//serv2 on recive
function serv2_reciver(txt)
{   
  	serv.SendText("close");
}

function cancel_fileRecive()
{
	  cancel_recive = app.CreateYesNoDialog( "Quer mesmo cancelar?");
    cancel_recive.SetOnTouch( cancel_recive_OnTouch );
    cancel_recive.SetButtonText( "Yes","No" );
    cancel_recive.Show();
}

function cancel_recive_OnTouch(user)
{
	if( user == "Yes" ) {
     serv.SendText("cancelar") ;
     lay_recive.Hide();
 }
   
}

var show_lay_recive= 0;
function show_recive_progress(val)
{
   
   if( show_lay_recive == 0)
        lay_recive.Show();
   
    if(show_lay_recive <=2)
    show_lay_recive ++;

	 var Max = 0.28;
    var per = Max*val/100;
    lay_R_MoveProgress.SetSize( per,0.02 );
    text_recive.SetText( val +"℅");
  
    
  
}

 var time;
function setthings()
{
    var  dir = app.ReadFile("/sdcard/.http share/config.txt");
    //verificar quando fechar a aba
    time = setInterval( isConfigOpen, 1000);

	  control_painel = app.CreateDialog( "","NoTitle" );
    control_painel.SetSize( 0.85,0.415);
    lay_painel = app.CreateLayout( "Linear", "FillXY,Left" );
    lay_painel.SetBackColor( "#ffffff");
    lay_painel.SetSize( 0.85,0.415 );
    lay_painel.SetPadding( 0.05,0.01,0.05,0.05 );
    control_painel.AddLayout( lay_painel );
    control_painel.Show();

   title = app.CreateText( "Ajustes",0.75,0.07,"Bold,Center" );
   title.SetTextColor( "#707070" );
   title.SetTextSize( 25 );
   lay_painel.AddChild( title );

   div = app.CreateLayout( "Linear", "Horizontal" );
   div.SetBackColor( "#45ad45" );
   div.SetSize( 0.85,0.004 );
   lay_painel.AddChild( div );

  lay_rede = app.CreateLayout( "Linear", "VCenter,FillXY" );
  lay_rede.SetSize( 0.85,0.17 );
  lay_painel.AddChild( lay_rede );

  LayHot = app.CreateLayout( "Linear", "Horizontal,Left,VCenter" );
  LayHot.SetSize( 0.85,0.085);
  lay_rede.AddChild( LayHot );
  
   txtHot = app.CreateText("Wi-Fi Hotspot" ,0.54,-1,"Bold,Left");
   txtHot.SetTextColor( "#5656dd" );
   txtHot.SetTextSize( 16 );
   txtHot.SetMargins( 0.01,0,0,0 );
   LayHot.AddChild( txtHot ); 

   toggleHot = app.CreateText( "[fa-toggle-off]",0.2,-1,"Bold,FontAwesome,Right" );
   toggleHot.SetTextSize( 30 );
   toggleHot.SetTextColor( "#5656dd" );
   toggleHot.SetOnTouch( toggle_hot );
   LayHot.AddChild( toggleHot );

  
  LayWifi = app.CreateLayout( "Linear", "Horizontal,Left,VCenter" );
  LayWifi.SetSize( 0.85,0.085);
  lay_rede.AddChild( LayWifi );
  
   txtWifi = app.CreateText( "Wi-Fi" ,0.54,-1,"Bold,Left");
   txtWifi.SetTextColor( "#5656dd" );
   txtWifi.SetTextSize( 16 );
   txtWifi.SetMargins( 0.01,0,0,0 );
   LayWifi.AddChild( txtWifi ); 
  
  toggleWifi = app.CreateText( "[fa-toggle-off]",0.2,-1,"Bold,FontAwesome,Right" );
  toggleWifi.SetTextSize( 30 );
  toggleWifi.SetTextColor( "#5656dd" );
  toggleWifi.SetOnTouchUp( toggle_wifi);
  LayWifi.AddChild( toggleWifi );

  div = app.CreateLayout( "Linear", "Horizontal" );
  div.SetBackColor( "#45ad45" );
  div.SetSize( 0.85,0.004 );
  lay_painel.AddChild( div );

  titleR = app.CreateText( "File Save",0.85,-1,"Bold,Left");
  titleR.SetTextColor( "#909090" );
  titleR.SetMargins( 0, 0.01, 0.01, 0.015 );
  titleR.SetTextSize( 16 );
  lay_painel.AddChild( titleR );
  
 chooseFolder = app.CreateLayout( "Linear", "Horizontal,Left,Top" );
 chooseFolder.SetSize(0.85,0.2);
 lay_painel.AddChild( chooseFolder );

  file_text_dir = app.CreateText( dir, 0.55,-1,"Bold,Left");
  file_text_dir.SetTextColor( "#5656dd" );
  file_text_dir.SetTextSize( 14 );
  file_text_dir.SetPadding( 0.01,0.01,0.01,0.01 );
 // file_text_dir.SetCursorColor( "#5656dd" );
  file_text_dir.SetBackColor( "#dddddd" );
  chooseFolder.AddChild( file_text_dir );
  
  folderButton = app.CreateButton( "[fa-folder]",0.2,0.055,"FontAwesome,Custom" );
  folderButton.SetTextSize( 20);
  folderButton.SetTextColor( "#5656dd" );
  folderButton.SetOnTouch( choose_folder );
  folderButton.SetStyle( "#ffffff","#ffffff",0,"#ffffff",0,0 );
  chooseFolder.AddChild( folderButton );
   
   //var para verificar se vai mostrar o diag retart
   pathVerif1 = file_text_dir.GetText();
   pathVerif2 = file_text_dir.GetText();

 //verificar os toggles
 if(app.IsWifiEnabled() ) toggleWifi.SetText( "[fa-toggle-on]" );
 if( app.IsWifiApEnabled() ) toggleHot.SetText( "[fa-toggle-on]" );
    
}

function toggle_wifi()
{  
	 if( !app.IsWifiEnabled()){
       app.SetWifiEnabled( true );
       toggleWifi.SetText( "[fa-toggle-on]" );
   }
    else{
       app.SetWifiEnabled( false );
       toggleWifi.SetText( "[fa-toggle-off]" );
   }
   
}

function toggle_hot()
{  
    var aux = port1.join("")+""+port2.join("");
	  if( !app.IsWifiApEnabled()){
       app.SetWifiApEnabled( true , app.GetAppName(),"00000000");
       toggleHot.SetText( "[fa-toggle-on]" );
       app.ShowPopup("Hotspot ativos\npass = 00000000");
    }
     else{
        toggleHot.SetText( "[fa-toggle-off]" );
       app.SetWifiApEnabled( false );
       app.ShowPopup("Hotspot inativos");
    }
   
}



//verificar se aba configuracão foi fechado;
var pathVerif1, pathVerif2;
function isConfigOpen()
{
  
	if(!control_painel.IsVisible()){
      clearInterval(time);
     set_files(path);
      pathVerif1 = file_text_dir.GetText();
         if( pathVerif1 != pathVerif2){
           retart = app.CreateYesNoDialog(  "Reniciar para atualizar as definiçãoes" ,"Center");
           retart.SetOnTouch( function(ok){ 
                   if(ok == "Yes") {
                         app.WriteFile( "/sdcard/.http share/restart.txt","true ; "+port1 );  
                         app.WriteFile( "/sdcard/.http share/config.txt",file_text_dir.GetText() );         
                         app.Exit(  );
                    }
                   if( ok == "No"){ 
                           pathVerif1 = path; 
                           pathVerif2 = path;
                           file_text_dir.SetText( path ); 
                    }
             })         
           retart.Show();
          }
       
  }
}

//quando clicamos em voltar butão
function OnBack()
{
  var a = path.split("/");
  if( a[2] == undefined){
	        if(file_view.GetWidth(  ) == 1.0) app.CloseDrawer( "Left" );     
  }
  else{
         file_back();
  }
  
}

function exit()
{
  app.WriteFile( "/sdcard/.http share/restart.txt","false ;null" );
  app.SetWifiApEnabled( false );
  app.Exit(  ); 
}

//escolher local para armazenar files
function choose_folder()
{
	 choose_diag = app.CreateDialog( "Escolher Pasta" ,"NoTitle");
   choose_diag.SetSize( 0.7,0.5 );
   choose_lay = app.CreateLayout( "Linear", "FillXY" );
   choose_lay.SetSize( 0.7,0.5 );
   choose_lay.SetBackColor( "#ffffff" );
   choose_diag.AddLayout( choose_lay );
   
   text = app.CreateText( "Choose Folder",1.0,0.05 );
   text.SetBackColor( "#5656ff" );
   text.SetTextColor( "#ffffff" );
    text.SetTextSize( 20 );
    choose_lay.AddChild( text );

   folderList = app.CreateList(" ",0.7,0.45,"Menu" );
   folderList.SetTextColor( "#5656dd" );
   folderList.SetIconSize( 30 );
   folderList.SetDivider( 0.005,"#dddddd" );
   folderList.SetTextColor2( "#5656dd" );
   folderList.SetOnTouch( new_folder );
   folderList.SetTextSize(16 );
   choose_lay.AddChild( folderList );

   set_pasta( file_text_dir.GetText() );
   
}

function set_pasta(pth){
     var aux =[];
   var listF = app.ListFolder( pth );
   for( var x = 0; x<listF.length; x++){
       if( app.IsFolder(pth+"/"+listF[x])) aux[x] = listF[x]+"::[fa-folder]";
    }
   folderList.SetList("..::[fa-folder],"+aux.sort() );
  choose_diag.Show();
}

function new_folder(title, body, type, index)
{
	 if( title == ".."){
      var aux1 = path.split("/");
       if( aux1[2] != undefined){
          aux1.pop();
          var a = aux1.join("/");
           path = a;
           set_pasta(path);
       }
   }
   else{
        var aux = path+"/"+title;
        path = aux;
        set_pasta(aux);
   }
   file_text_dir.SetText(path);
}


function avaliar()
{ 
	var packageName = "com.disoftapps.httpshare";
  app.OpenUrl ("market:details?id=" + packageName);
  
}