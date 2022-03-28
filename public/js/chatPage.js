$(document).ready(()=>{
    $.get(`/api/chats/${chatId}`, data=> $("#chatName").text(getChatName(data)));
    $.get(`/api/chats/${chatId}/messages`, data=>{
        var lastSenderId = "";
        var msgs = [];
        data.forEach((element, index) => {
            msgs.push(createMessageHtml(element, data[index+1], lastSenderId));
            lastSenderId = element.sender._id;
        });
        

        var msgsHtml = msgs.join("");
        addMessagesHtmlToPage(msgsHtml);
    })
})

function addMessagesHtmlToPage(html){
    $(".chatMessages").append(html);
    // scroll down

}

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

        if(xhr.status != 201){
            alert('could not send msg');
            $(".inputTextbox").val(content);
            return;
        }

        addChatMessageHtml(data);
    })
}

function addChatMessageHtml(msg){
    if(!msg || !msg._id){
        return alert('message invalid')
    }

    var msgDiv = createMessageHtml(msg, null, "");
    addMessagesHtmlToPage(msgDiv);
}

function createMessageHtml(msg, nextMsg, lastSenderId){

    var sender = msg.sender;
    var senderName = sender.firstName + " " + sender.lastName;
    var currentSenderId = sender._id;
    var nextSenderId = nextMsg != null ? nextMsg.sender._id : "";

    var isFirst = lastSenderId != currentSenderId;
    var isLast = nextSenderId != currentSenderId;

    var isMyMsg = msg.sender._id == userLoggedIn._id;
    var liClassName = isMyMsg ? "mine" : "theirs";

    if(isFirst){
        liClassName += " first";
    }

    if(isLast){
        liClassName += " last";
    }


    return `<li class='message ${liClassName}'>
                <div class='messageContainer'>
                    <span class='messageBody'>
                        ${msg.content}
                    </span>
                </div>
            </li>`;
}