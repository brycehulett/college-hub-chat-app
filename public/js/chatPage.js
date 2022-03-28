$(document).ready(()=>{
    $.get(`/api/chats/${chatId}`, data=> $("#chatName").text(getChatName(data)));
})

$("#chatNameButton").click(()=>{
    var name = $("#chatNameTextbox").val().trim();
    $.ajax({
        url: "/api/chats/" + chatId,
        type: "PUT",
        data: {chatName: name},
        success: (data, status, xhr) =>{
            if(xhr.status != 204){
                alert('could not update');
            }else{
                location.reload();
            }
        }
    })
})

$(".sendMessageButton").click(()=>{
    messageSubmitted();
})

$(".inputTextbox").keydown((e)=>{
    if(e.which === 13){         // 13 is the enter key
        messageSubmitted();
        return false;
    } 
    
})

function messageSubmitted(){
    var content = $(".inputTextbox").val().trim();
    sendMessage(content);
}

function sendMessage(content){
    console.log(content);
}