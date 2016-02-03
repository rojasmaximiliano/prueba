// Declaraci—n de variables globales
var myScroll, myScrollMenu, cuerpo, menuprincipal, wrapper, estado, map, myLatlng;

// Guardamos en variables elementos para poder rescatarlos despuŽs sin tener que volver a buscarlos
cuerpo = document.getElementById("cuerpo"),
menuprincipal = document.getElementById("menuprincipal"),
wrapper = document.getElementById("wrapper");

var xhReq = new XMLHttpRequest();

var app = {
    // Constructor de la app
    initialize: function() {
    	// Estado inicial mostrando capa cuerpo
    	estado="cuerpo";
    	
    	// Creamos el elemento style, lo a–adimos al html y creamos la clase cssClass para aplicarsela al contenedor wrapper
	    var heightCuerpo=window.innerHeight-50;
	    var style = document.createElement('style');
	    style.type = 'text/css';
	    style.innerHTML = '.cssClass { position:absolute; z-index:2; left:0; top:50px; width:100%; height: '+heightCuerpo+'px; overflow:auto;}';
	    document.getElementsByTagName('head')[0].appendChild(style);
	    
	    // A–adimos las clases necesarias
		cuerpo.className = 'page center';
		menuprincipal.className = 'page center';
		wrapper.className = 'cssClass';
			
		// Leemos por ajax el archivos opcion1.html de la carpeta opciones
		xhReq.open("GET", "opciones/opcion1.html", false);
		getMensajes();
		xhReq.send(null);
		document.getElementById("contenidoCuerpo").innerHTML=xhReq.responseText;

		// Leemos por ajax el archivos menu.html de la carpeta opciones
		xhReq.open("GET", "opciones/menu.html", false);
		xhReq.send(null);
		document.getElementById("contenidoMenu").innerHTML=xhReq.responseText;
			
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
    	// Ejecutamos la funci—n FastClick, que es la que nos elimina esos 300ms de espera al hacer click
    	new FastClick(document.body);
    },
  

};


// Funci—n para a–adir clases css a elementos
function addClass( classname, element ) {
    var cn = element.className;
    if( cn.indexOf( classname ) != -1 ) {
    	return;
    }
    if( cn != '' ) {
    	classname = ' '+classname;
    }
    element.className = cn+classname;
}

// Funci—n para eliminar clases css a elementos
function removeClass( classname, element ) {
    var cn = element.className;
    var rxp = new RegExp( "\\s?\\b"+classname+"\\b", "g" );
    cn = cn.replace( rxp, '' );
    element.className = cn;
}

function menu(opcion){
	
	// Si pulsamos en el bot—n de "menu" entramos en el if
	if(opcion=="menu"){
		if(estado=="cuerpo"){
			cuerpo.className = 'page transition right';
			estado="menuprincipal";
		}else if(estado=="menuprincipal"){
			cuerpo.className = 'page transition center';
			estado="cuerpo";	
		}
	// Si pulsamos un bot—n del menu principal entramos en el else
	}else{
		
		// A–adimos la clase al li presionado
		addClass('li-menu-activo' , document.getElementById("ulMenu").getElementsByTagName("li")[opcion]);
		
		// Recogemos mediante ajax el contenido del html segœn la opci—n clickeada en el menu
		xhReq.open("GET", "opciones/opcion"+opcion+".html", false);
		xhReq.send(null);
		document.getElementById("contenidoCuerpo").innerHTML=xhReq.responseText;
		
		
		// A–adimos las clases necesarias para que la capa cuerpo se mueva al centro de nuestra app y muestre el contenido
		cuerpo.className = 'page transition center';
		estado="cuerpo";
		
		// Quitamos la clase a–adida al li que hemos presionado
		setTimeout(function() {
			removeClass('li-menu-activo' , document.getElementById("ulMenu").getElementsByTagName("li")[opcion]);
		}, 300);
		
		if (opcion==1){
		getMensajes();
		}
		
	    if (opcion ==2){
		navigator.geolocation.getCurrentPosition(onSuccess, onError); 
	 }
	 
	 }

}

function onSuccess(position) { 
    initializeMap(position.coords.latitude,position.coords.longitude); 
} 
                       
function onError(error) { 
    alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n'); 
}



function initializeMap(lat,long) { 
	myLatlng = new google.maps.LatLng(lat, long); 
	myLatlng2 = new google.maps.LatLng(-33.4587173,-70.6623188);
    var mapOptions = { 
    zoom: 14, 
    center: myLatlng 
    }; 
	
	
	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

	var key = "etkSJjrEJHyMcU5HL3YYyu0xru87e_fjsrbHYSi3z-nsgVzFu82K-fj6";
                
    //url = "http://localhost:8080/yoreciclo/puntos/obtener/"+key
	url= "http://10.42.207.205:8080/yoreciclo/puntos/obtener/etkSJjrEJHyMcU5HL3YYyu0xru87e_fjsrbHYSi3z-nsgVzFu82K-fj6"
    data =  key
     $.ajax({
        url: url,
        dataType: 'json',
        type : "GET",
        data: data,
        crossDomain: true,
		timeout:60000,
        complete: function(xhr, statusText){ 
            console.log(xhr.responseText);
        },
					
        success: function(data) {
            if (data != null){
				var table = document.getElementById("tablaPuntos");
				for(var i in data){ 
				
					latLong= new google.maps.LatLng(data[i].latitud, data[i].longitud);
					var marker = new google.maps.Marker({ 
					position: latLong, 
					map: map, 
					title: data[i].tipo
					}); 
		
					var row = table.insertRow(data.length);
					var cell1 = row.insertCell(0);
					cell1.innerHTML = "<td><div class='pure-u-3-4'><div id='encabezado'><b>"+data[i].direccion+"</b></div><div id = 'descripcion'>"+data[i].tipo+"</div></div><div class='pure-u-1-4'></div></td>";
				}
			}
						
			else{
				alert('No hay información para mostrar');
				}
        },
                    
		error: function( req, status, err ) {
            alert('Error establecer conexión');
			var table = document.getElementById("tablaPuntos");
			var row = table.insertRow(data.length);
			var cell1 = row.insertCell(0);
			cell1.innerHTML = "<td><div class='pure-u-3-4'><div id = 'descripcion'>Error en el servidor. Por favor, inténtelo de nuevo</div></div><div class='pure-u-1-4'></div></td>";
            
            }
        });
		
		var parentElement = document.getElementById("cargando");
		parentElement.setAttribute('style', 'display:none;');
								
} 

function getMensajes(){
	var key = "etkSJjrEJHyMcU5HL3YYyu0xru87e_fjsrbHYSi3z-nsgVzFu82K-fj6";
                
    //url = "http://localhost:8080/yoreciclo/puntos/obtener/"+key
	url= "http://10.42.207.205:8080/yoreciclo/mensaje/misMensajes/vokeyJVVDocGaFDG6l1VJ_Psr085yaRoMS4FwQ2PmZjrOYYSg0UAx4rC"
    data =  key
     $.ajax({
        url: url,
        dataType: 'json',
        type : "GET",
        data: data,
        crossDomain: true,
		timeout:60000,
        complete: function(xhr, statusText){ 
            console.log(xhr.responseText);
        },
					
        success: function(data) {
            if (data != null){
				var table = document.getElementById("tablaMensajes");
				for(var i in data){ 
				var fecha= new Date(data[i].fecha);
				
				var minutos = fecha.getMinutes();
				minutos = minutos > 9 ? minutos : '0' + minutos;
				/*
				var dia = fecha.getDate();
				var hora = fecha.getHours();
				var minutos = fecha.getMinutes();
				*/
				
					var row = table.insertRow(data.length);
					var cell1 = row.insertCell(0);
					cell1.innerHTML = "<td><div class='pure-u-3-4'><div id='encabezado'><b>"+data[i].textoMensaje+"</b></div><div id = 'descripcion'>El "+fecha.getDate()+"/"+fecha.getMonth()+1+" a las "+fecha.getHours()+":"+minutos+"</div></div><div class='pure-u-1-4'></div></td>";
				}
			}
						
			else{
				alert('No hay información para mostrar');
				}
        },
                    
		error: function( req, status, err ) {
            alert('Error establecer conexión');
			var table = document.getElementById("tablaMensajes");
			var row = table.insertRow(data.length);
			var cell1 = row.insertCell(0);
			cell1.innerHTML = "<td><div class='pure-u-3-4'><div id = 'descripcion'>Aún no tiene mensajes para mostrar</div></div><div class='pure-u-1-4'></div></td>";
            }
        });

}

function scanear(){ 
	alert("Debes colocar tu teléfono de forma horizontal para escanear");
	var envio = new Object();
	envio.tipo =  $("#tipo").val()
	envio.key = key;
	envio.idPuntoLimpioString = '1';
	cordova.plugins.barcodeScanner.scan( 
		function (envio) {  
			key= "vokeyJVVDocGaFDG6l1VJ_Psr085yaRoMS4FwQ2PmZjrOYYSg0UAx4rC"
			url= "http://10.42.207.205:8080/yoreciclo/"
			data =  envio
			alert(data);
			 $.ajax({
				url: url,
				dataType: 'json',
				type : "POST",
				data: data,
				crossDomain: true,
				timeout:60000,
				complete: function(xhr, statusText){ 
					console.log(xhr.responseText);
				},
							
				success: function(data) {
					if (data!=null){
						alert(data);
						javascript:menu('1');
					}
					
					else{
						alert('No hay información para mostrar');
						estado="menuprincipal";
						menu('1');
						}
				},
							
				error: function( req, status, err ) {
					alert('Error establecer conexión');
					}
				});
		}, 
		function (error) { 
			notificacion("Ha ocurrido un error al escanear. Por favor intentalo de nuevo."); 
		} 
	); 
}; 
			
