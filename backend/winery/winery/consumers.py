import json
from channels.generic.websocket import WebsocketConsumer

class FermentationDataConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        data = json.loads(text_data)
        # Process the data (e.g., save to the database)
        self.send(text_data=json.dumps({
            'message': 'Data received',
        }))
