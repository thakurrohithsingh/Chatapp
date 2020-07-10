var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '1031179',
  key: 'ebe85964f2ab0f1bcdc6',
  secret: '5861fc501f0dd4619b70',
  cluster: 'ap2',
  encrypted: true
});

pusher.trigger('my-channel', 'my-event', {
  'message': 'hello world'
});