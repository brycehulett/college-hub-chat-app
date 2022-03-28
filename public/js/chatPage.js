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
    if(content != ""){
        sendMessage(content);
        $(".inputTextbox").val("");
    }
    
}

function sendMessage(content){
    $.post("/api/messages", {content, chatId}, (data, status, xhr)=>{
        addChatMessageHtml(data);
    })
}

function addChatMessageHtml(msg){
    if(!msg || !msg._id){
        return alert('message invalid')
    }

    var msgDiv = createMessageHtml(msg);
    $(".chatMessages").append(msgDiv);
}

function createMessageHtml(msg){

    var isMyMsg = msg.sender._id == userLoggedIn._id;
    var liClassName = isMyMsg ? "mine" : "theirs";

    return `<li class='message ${liClassName}'>
                <div class='messageContainer'>
                    <span class='messageBody'>
                        ${msg.content}
                    </span>
                </div>
            </li>`;
}