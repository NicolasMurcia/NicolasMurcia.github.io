var count = 0;
var BASE_URL = 'http://fadergsapi.azurewebsites.net/v1/';
var myResult = [];
var i=0;

$(function(){		
	if(window.localStorage.getItem('score') && window.localStorage.getItem('score') !="undefined" && window.localStorage.getItem('score')!= undefined)
		$("#point").text(window.localStorage.getItem('score'));
	else
		$("#point").text("0");
	

	$("#reset").click(function(){
		reset();
	});

	$("#box-success .content span.close").click(function(){
		var step = $(this).data('step');
		closeStepClick(step)
	});	

	if(window.location.href.indexOf('intro.html') > -1){
		window.localStorage.setItem('score', 0);
		$("#point").text(0);
	}else if(window.location.href.indexOf('licao-2.html') > -1){
		window.localStorage.setItem('score', 100);
		$("#point").text(100);
	}
	else if(window.location.href.indexOf('sucesso.html') > -1){	
		$("#my_score").text(window.localStorage.getItem('score'));
		window.localStorage.setItem('score', 0);
		setTimeout(function(){ window.localStorage.setItem('session', undefined)}, 500);
	}

	if (window.location.href.indexOf('login.html')) {

    } else if(!window.localStorage.getItem('session'))
		window.location.href = "login.html"
	else if(window.localStorage.getItem('session') == undefined || window.localStorage.getItem('session') == 'undefined')
		window.location.href = "index.html"

	$("#form_login").validate({            
        submitHandler: function(form){
            var data  = {
			  name        : form.name.value,
			  code        : form.code.value,
			  sessionCode : form.session.value
			};

            $.ajax({
                type        : "POST",
                contentType : "application/json-patch+json",
                url         :  BASE_URL+'login',                
                dataType    : "json",
                data        : JSON.stringify(data),                
                success: function(resp)
                {                     
                    window.localStorage.setItem('session', JSON.stringify(resp.data));
                    window.location.href='intro.html';
                },
                error: function(response) {
                    $('.box-error').text(response.responseJSON.errors[0].message);
                    $('.box-error').fadeIn();
                    setTimeout(function(){
                    	$('.box-error').fadeOut();
                    }, 2000);
                } 
            });
            return false;
        }
    });    
});



function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev, step, licao) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));	
    $(ev.target).addClass('drag_desabled');

    if(licao=='intro'){
    	nextStep(step);
    }else if(licao=='um'){
    	nextStepLeassonOne(step, data);
    	
    }
    
}

function nextStep(step){
	var score = parseInt($("#point").text())+ 10;	
	$("#point").text(score);
	
	if(step == 10){
		window.localStorage.setItem('score', score);
		$("#box-success .content #successTitle").text("Bom trabalho!");
		$("#box-success .content #successText").text("Você montou seu torso com êxito. Clique no X para iniciar as tarefas.");
		$("#box-success .content span.close").data('step', 1)
		$("#box-success").fadeIn();
	}else{
		$('#block'+step).show();
		$('#div'+(parseInt(step)+1)).show();
		$('#drag'+(parseInt(step)+1)).fadeIn('slow');
		$('#drag'+(parseInt(step)+1)).addClass('active');
	}
}
function closeStepClick(step){
	if(step == 'sucess')
		window.location.href = 'sucesso.html';
	else
		window.location.href = 'licao-'+step+'.html';
}

function reset(){
	window.localStorage.setItem('score', undefined);
	var sessionData = JSON.parse(window.localStorage.getItem('session'));	
	var data = {
		session : sessionData.session,
		user    : sessionData.user,
	};

	$.ajax({
        type        : "DELETE",
        contentType : "application/json-patch+json",
        url         :  BASE_URL+'score',                
        dataType    : "json",   
        data        : JSON.stringify(data),             
        success: function(resp)
        {   
			window.location.href = 'intro.html';                
        },
        error: function(response) {
            console.log(response);
        } 
    });		
}

function nextStepLeassonOne(step, ele){
	var score;	

	if(ele.indexOf(step) != -1){
		var score = parseInt($("#point").text())+ 10;
		myResult.push({question: $("#drag"+step).attr('title'),result: 1});
	}
	else{
		var score = parseInt($("#point").text())- 5;
		myResult.push({question: $("#drag"+step).attr('title'),result: 0});
	}

	count++;
	

	$("#point").text(score);

	if(count==5){
		window.localStorage.setItem('score', score);
		if($("#box-success .content span.close").attr('data-step') == '2'){
			$("#box-success .content #successTitle").text("Bom trabalho!");
			$("#box-success .content #successText").text("Você concluiu as tarefas da Lição "+ 1+". Clique no X para iniciar a Lição 2!");
			$("#box-success .content span.close").data('step', 2)
			$("#box-success").fadeIn();
		}else
			if($("#box-success .content span.close").attr('data-step') == '3'){
				$("#box-success .content #successTitle").text("Bom trabalho!");
				$("#box-success .content #successText").text("Você concluiu as tarefas da Lição "+ 2+". Clique no X para iniciar a Lição 3!");
				$("#box-success .content span.close").data('step', 3)
				$("#box-success").fadeIn();
			
		}else
			if($("#box-success .content span.close").attr('data-step') == '4'){
				window.location.href="sucesso.html"
		}
	}	
}


