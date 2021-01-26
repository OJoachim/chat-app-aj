const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName = '';

const socket = io();
socket.on('message', ({ author, content }) => addMessage(author, content))

socket.on('join', ({ user, id }) => {
    console.log('User ' + user + ' with id ' + id);
});
socket.on('newUser', ({ author }) => addMessage('Chat Bot', `${author} has joined the conversation!`));
socket.on('removeUser', ({ author }) => addMessage('Chat Bot', `${author} has left the conversation:(`));

const login = function (e) {
  e.preventDefault();
  
  if (userNameInput.value.length > 0) {
    userName = userNameInput.value;
    loginForm.classList.remove('show'); //login form is hidden
    messagesSection.classList.add('show'); //message form is shown
    
    socket.emit('join', { author: userName, id: socket.id })
  } else {
    alert("Type your name.")
  }
}
loginForm.addEventListener('submit', login);

const addMessage = function (author, content) {
  const message = document.createElement('li');
  message.classList.add('message', 'message--received');
  
  if (author === userName) {
    message.classList.add('message--self');
  } else {
    message.classList.add('message--chat');
  }
  message.innerHTML = `
    <h3 class='message__author'>
      ${userName === author ? 'You' : author}
    </h3>
    <div class='message__content'>
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
}

const sendMessage = function (e) {
  e.preventDefault();
  
  messageContentInput.value;
  let messageContent = messageContentInput.value;
  
  if ((!messageContent.length)) {
    alert('Type your message.');
  }
  else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent })
    messageContentInput.value = '';
  }
}
addMessageForm.addEventListener('submit', sendMessage);