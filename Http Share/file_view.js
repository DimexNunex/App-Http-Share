
var listItems;

function criar_draw()
{
	file_view = app.CreateScroller( 1.0,1.0);   

  lay_file_view = app.CreateLayout( "Linear", "FillXY" );
  lay_file_view.SetSize( 1.0,1.0 );
  file_view.AddChild( lay_file_view );

  lay_title = app.CreateLayout( "Linear", "Horizontal,VCenter,Left" );
  lay_title.SetSize( 1.0,0.1 );
  lay_title.SetBackColor( "#5656dd" );
  lay_file_view.AddChild( lay_title );

  back = app.CreateButton( "[fa-chevron-left]",0.14,0.08,"Custom,FontAwesome,Bold" );
  back.SetStyle( "#5656dd","#5656dd",1000,"#ffffff",3,0 );
  back.SetTextColor( "#ffffff" );
  back.SetMargins( 0,0.005,0,0 );
  back.SetOnTouch( file_back );
  if( app.IsTablet()) back.SetSize( 0.14,0.085 );
  lay_title.AddChild( back );

  title = app.CreateText( "Files View",0.5,-1,"FontAwesome,Bold" );
  title.SetTextSize( 25 );
  title.SetMargins( (1/2)-0.25-0.12,0,0,0 );
  title.SetTextColor( "#ffffff" );
  lay_title.AddChild( title );

  file_progress = app.CreateLayout( "Linear", "Horizontal,Left" );
  file_progress.SetBackColor( "#45ad45" );
  file_progress.SetSize( 1.0,0.01 );
  lay_file_view.AddChild( file_progress );
  
  file_prgMove = app.CreateLayout( "Linear", "Horizontal" );
  file_prgMove.SetBackColor( "#fd345f" );
  file_prgMove.SetSize( 0.2,0.01);
  file_prgMove.Hide();
  file_progress.AddChild( file_prgMove );
  
  body = app.CreateLayout( "Linear", "Left,Center" );
  body.SetBackColor( "#ffffff" );
  body.SetSize( 1.0,0.84);
  lay_file_view.AddChild( body );
 
    lstMenu1 = app.CreateList( listItems, 1.0,0.84,"Menu,Left");
    lstMenu1.SetColumnWidths( -1,-1,-1,"Bottom,Left");
    lstMenu1.SetIconSize( 40 );
    lstMenu1.SetTextSize( 20);
    lstMenu1.SetOnTouch( open_folder );
    lstMenu1.SetFontFile( "font/font2.ttf" );
    lstMenu1.SetOnLongTouch( show_options  );
    lstMenu1.SetMargins( 0,0,0,0 );
    lstMenu1.SetDivider( 0.005,"#dddddd" );
    lstMenu1.SetTextColor1( "#5656dd" );
    lstMenu1.SetTextColor2( "#5656dd" );
    //lstMenu1.SetItemByIndex( 0, "Primary", 21 );
    body.AddChild( lstMenu1 );
   
    lay_Options = app.CreateLayout( "Linear", "Horizontal,FillXY,VCenter" );
    lay_Options.SetSize( 1.0,0.05 );
    lay_Options.SetBackColor( "#5656aa" );
    // lay_Options.Hide();
    lay_file_view.AddChild( lay_Options );
    
     direct_send = app.CreateButton( "[fa-send]"+" send",0.5,0.05,"FontAwesome,Custom");
    direct_send.SetTextSize( 13 );
    direct_send.SetTextColor( "#ffffff" );
    direct_send.SetStyle( "#dd5656","#dd5656",5);
    direct_send.SetMargins( 0, 0.005, 0, 0 );
    direct_send.SetOnTouch(direct_send_files);
    lay_Options.AddChild(direct_send);

    del = app.CreateButton( "[fa-trash]"+" delete",0.5,0.05,"FontAwesome,Custom");
    del.SetTextSize( 13 );
    del.SetTextColor( "#ffffff" );
    del.SetStyle( "#dd5656","#dd5656",5);
    del.SetMargins( 0, 0.005, 0, 0 );
    del.SetOnTouch( del_OnTouch );
    lay_Options.AddChild(del);

    //adicionar files do cartãosd
     set_files(path);
}

function set_files(files)
{  
    my_progress.Show();
   var list = app.ListFolder(files);
   var arr = list;
   var rtr = [];
   for( var x= 0; x < arr.length; x++){
        
        if( app.IsFolder(files+"/"+arr[x] )) rtr[x] = arr[x]+"::[fa-folder]";
        else{
              var fileType = new String(arr[x]).split(".");
              var ft = fileType[fileType.length-1];
              if( ft == "mp3" || ft == "ogg" || ft == "wav")
                     rtr[x] = arr[x]+"::[fa-music]";
               else if( ft == "png" || ft == "jpg" || ft == "jpeg")
                     rtr[x] = arr[x]+"::[fa-image]";
               else  if( ft == "mp4" || ft == "3gp" || ft == "mkv" || ft == "avi" || ft == "mov" || ft == "webm")
                     rtr[x] = arr[x]+"::[fa-video-camera]";
               else if ( ft == "apk") 
                      rtr[x] = arr[x]+"::[fa-android]";
               else if ( ft == "exe")
                      rtr[x] = arr[x]+"::[fa-windows]";
               else if ( ft == "html")
                      rtr[x] = arr[x]+"::[fa-html5]";
                else if ( ft == "js")
                      rtr[x] = arr[x]+"::[fa-file-text]";
                 else if ( ft == "css")
                      rtr[x] = arr[x]+"::[fa-file-text]";
                 else if ( ft == "zip" || ft == "rar")
                      rtr[x] = arr[x]+"::[fa-file-archive-o]";
                  else if ( ft == "txt")
                      rtr[x] = arr[x]+"::[fa-file-text]";
                else 
                      rtr[x] = arr[x]+"::[fa-file]";
          }
       
   }

   listItems = " ";
   listItems = rtr.sort();
   lstMenu1.SetList( listItems );
   my_progress.Hide();
}

var selc = false; //<-- list select
function open_folder(title,b,type,index)
{ if( selc == false){
    var  listFile = lstMenu1.GetItemByIndex( index );
     var aux = path;
        if( app.IsFolder(path+"/"+listFile.title))  {
              path = aux+"/"+listFile.title;
              set_files(path);
        }
      else{
              
              var fileUrl = path+"/"+listFile.title;
            
              app.OpenFile( fileUrl,null,"Open With..." );
      }
    
  }
  else {
       //mudar a cor do butões options
      del.SetTextColor( "#ffffff");  
      direct_send.SetTextColor( "#ffffff" );
      selc = false;
      lstMenu1.SelectItem( "none" );
  }
}

function file_back()
{ 
	var aux = path.split("/");
  if( aux[2] != undefined)
       aux.pop();
  path = aux.join("/");
  set_files(path);
}

var pos = 0;//list delete position
function show_options(title,b,type,index)
{
     lstMenu1.SelectItemByIndex(index);
    pos = index;
    del.SetTextColor( "#00ff56" );
    direct_send.SetTextColor( "#00ff56" );
    selc = true;
}

//bt delite on touch
function del_OnTouch()
{ 
   if( selc == true){
     my_progress.Show();
     var  listFile = lstMenu1.GetItemByIndex(pos);
      var aux = path;
      del_diag = app.CreateYesNoDialog( "Pretende apagar o Item \n\n"+"  "+listFile.title );
       del_diag.SetButtonText( "apagar","cancelar" );
       del_diag.SetOnTouch(del_file);
       // del_diag.SetBackColor( "#50ffffff" );
      del_diag.Show();

  
     my_progress.Hide();
  }
}

//dialag del file
function del_file(opt)
{
  var  listFile = lstMenu1.GetItemByIndex(pos);
	if( opt == "Yes") {
         if( app.IsFolder(path+"/"+listFile.title))  {
                app.DeleteFolder( path+"/"+listFile.title );
        }
      else{
             app.DeleteFile( path+"/"+listFile.title);
      }
  setTimeout("set_files(path)",1000);
  del_diag.Hide();
  }
else  del_diag.Hide(); 
     del.SetTextColor( "#ffffff" );
     direct_send.SetTextColor( "#ffffff" );
     lstMenu1.SelectItem(  );
     selc = false;

}

//enviar arquivos do nosso nosso explirer
function direct_send_files()
{
     var  listFile = lstMenu1.GetItemByIndex(pos);
     var aux = path.split("/");
     aux.shift();
     aux.shift();
     var a = aux.join("/");
     var aux2 = port2.join("");
     var link = app.GetInternalFolder()+"/"+a+"/"+listFile.title;
      if( app.IsFolder(path+"/"+listFile.title))  {
           app.ShowPopup( "Não pode enviar a pasta" );
      }
      else {
             	enviar_link("http://"+ip+":"+aux2+link);
               app.CloseDrawer( "Left" );
       }
}

//folder open  changeprogress
 var my_progress = new prg();
function prg(){  
  this.Show = function(){}
  this.Hide = function(){}
}